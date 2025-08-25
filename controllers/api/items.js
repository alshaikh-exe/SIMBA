import mongoose from "mongoose";
import Item from "../../models/item.js";
import Location from "../../models/location.js";

const { Types } = mongoose;

const VALID_RETURN_POLICIES = ["returnable", "nonreturnable"];
const DEADLINE_MIN = 1;
const DEADLINE_MAX = 50;

// ----------------- helpers -----------------
function buildTextFilter(q) {
  if (!q) return {};
  return {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { details: { $regex: q, $options: "i" } },
    ],
  };
}

function clampInt(n, min, max) {
  const x = Math.floor(Number(n));
  if (!Number.isFinite(x)) return null;
  return Math.min(max, Math.max(min, x));
}

function sanitizePolicyInputs({ returnPolicy, deadline }) {
  const sanitized = {};
  if (typeof returnPolicy === "string" && VALID_RETURN_POLICIES.includes(returnPolicy)) {
    sanitized.returnPolicy = returnPolicy;
  }
  if (deadline !== undefined) {
    const d = clampInt(deadline, DEADLINE_MIN, DEADLINE_MAX);
    if (d !== null) sanitized.deadline = d;
  }
  return sanitized;
}

async function resolveLocation({ locationId, campus, building, classroom }) {
  if (locationId) {
    if (!Types.ObjectId.isValid(locationId)) {
      const err = new Error("Invalid locationId");
      err.status = 400;
      throw err;
    }
    const loc = await Location.findById(locationId);
    if (!loc) {
      const err = new Error("Location not found");
      err.status = 400;
      throw err;
    }
    return loc;
  }
  if (campus && building && classroom) {
    return await Location.findOneAndUpdate(
      { campus, building, classroom },
      { $setOnInsert: { campus, building, classroom } },
      { new: true, upsert: true }
    );
  }
  const err = new Error("Provide either locationId or campus+building+classroom");
  err.status = 400;
  throw err;
}

function selectUpdatableFields(body) {
  const updatable = {};
  if (typeof body.name === "string") updatable.name = body.name;
  if (typeof body.details === "string") updatable.details = body.details;
  if (typeof body.picture === "string") updatable.picture = body.picture;
  if (typeof body.quantity === "number") updatable.quantity = body.quantity;
  if (typeof body.threshold === "number") updatable.threshold = body.threshold;

  Object.assign(updatable, sanitizePolicyInputs({ returnPolicy: body.returnPolicy, deadline: body.deadline }));
  return updatable;
}

function populateItem(query) {
  return query.populate("location").populate("createdBy", "name email");
}

// ---- datasheet utilities ----
const ALLDATASHEET_BASE = "https://www.alldatasheet.net/view.jsp?Searchword=";

function extractLikelyPartNumbers(...texts) {
  const prefixes = [
    "LM","TL","NE","OPA","AD","LT","IRF","IRL","BC","BD","2N","1N",
    "SS","ATMEGA","STM32","ESP32","ESP8266","MAX","MIC","TPS","AMS",
    "AP","AOZ","SI","SN","74HC","74HCT","74LS","MB","NCP","MP"
  ];
  const regex = new RegExp(String.raw`\b(?:${prefixes.join("|")})[A-Z0-9\-]*\d+[A-Z0-9\-]*\b`, "gi");

  const found = new Set();
  texts.join(" ").replace(regex, (m) => {
    const clean = m.toUpperCase().replace(/[.,;:)\]]+$/, "");
    if (clean.length >= 4 && clean.length <= 24) found.add(clean);
    return m;
  });
  return Array.from(found).slice(0, 12);
}

function makeAlldatasheetLink(query) {
  return `${ALLDATASHEET_BASE}${encodeURIComponent(query)}`;
}

function buildDatasheetLinks(parts) {
  return parts.map((p) => ({
    title: p,
    url: makeAlldatasheetLink(p),
    source: "alldatasheet.net",
  }));
}

function policySummary(item) {
  if (item.returnPolicy === "returnable") {
    return `Returnable; deadline ${item.deadline} day(s).`;
  }
  return "Non-returnable/one-way issue.";
}

// ----------------- controllers -----------------

async function filterByLocationQuery({ campus, building, classroom }) {
  if (!campus && !building && !classroom) return {};
  const locQuery = {};
  if (campus) locQuery.campus = campus;
  if (building) locQuery.building = building;
  if (classroom) locQuery.classroom = classroom;

  const locs = await Location.find(locQuery).select("_id");
  return locs.length
    ? { location: { $in: locs.map(l => l._id) } }
    : { location: { $in: [] } };
}

export async function index(req, res) {
  try {
    const { q, campus, building, classroom, returnPolicy, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const filters = { ...buildTextFilter(q) };
    if (typeof returnPolicy === "string" && VALID_RETURN_POLICIES.includes(returnPolicy)) {
      filters.returnPolicy = returnPolicy;
    }

    const locFilter = await filterByLocationQuery({ campus, building, classroom });
    Object.assign(filters, locFilter);

    const $page = Math.max(1, Number(page));
    const $limit = Math.min(100, Math.max(1, Number(limit)));
    const skip = ($page - 1) * $limit;

    const [items, total] = await Promise.all([
      populateItem(Item.find(filters).sort(sort).skip(skip).limit($limit)),
      Item.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      data: items,
      meta: { total, page: $page, pages: Math.max(1, Math.ceil(total / $limit)), limit: $limit },
    });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
  }
}

export async function show(req, res) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const item = await populateItem(Item.findById(id));
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const partsParam = (req.query.parts || "").toString().trim();
    const manualParts = partsParam
      ? partsParam.split(",").map(s => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const autoParts = extractLikelyPartNumbers(item.name || "", item.details || "");
    const partNumbers = Array.from(new Set([...manualParts, ...autoParts]));
    const datasheetLinks = buildDatasheetLinks(partNumbers);

    res.status(200).json({
      success: true,
      data: { item, partNumbers, datasheetLinks, policySummary: policySummary(item) },
    });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
  }
}

export async function create(req, res) {
  try {
    if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, details, picture, returnPolicy, deadline, quantity, threshold, locationId, campus, building, classroom } = req.body;
    if (!name || !details) {
      return res.status(400).json({ success: false, message: "name and details are required" });
    }

    if (returnPolicy && !VALID_RETURN_POLICIES.includes(returnPolicy)) {
      return res.status(400).json({
        success: false,
        message: `returnPolicy must be one of: ${VALID_RETURN_POLICIES.join(", ")}`,
      });
    }

    const loc = await resolveLocation({ locationId, campus, building, classroom });
    const policy = sanitizePolicyInputs({ returnPolicy, deadline });

    const toCreate = {
      name: name.trim(),
      details,
      picture,
      location: loc._id,
      createdBy: req.user._id,
      quantity: quantity || 0,
      threshold: threshold || 5,
      ...policy,
    };

    const created = await Item.create(toCreate);
    const populated = await populateItem(Item.findById(created._id));
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    const code = err.code === 11000 ? 400 : err.status || 500;
    res.status(code).json({ success: false, message: err.message || "Server error" });
  }
}

export async function update(req, res) {
  try {
    if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const existing = await Item.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Item not found" });
    if (existing.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updates = selectUpdatableFields(req.body);
    const { locationId, campus, building, classroom } = req.body;
    if (locationId || (campus && building && classroom)) {
      const loc = await resolveLocation({ locationId, campus, building, classroom });
      updates.location = loc._id;
    }

    const updated = await Item.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    const populated = await populateItem(Item.findById(updated._id));
    res.status(200).json({ success: true, data: populated });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
  }
}

export async function destroy(req, res) {
  try {
    if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const existing = await Item.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Item not found" });
    if (existing.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Item.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: id });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
  }
}

// NEW: Low-stock route
export async function lowStock(req, res) {
  try {
    const items = await Item.find({ $expr: { $lt: ["$quantity", "$threshold"] } });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error("Error fetching low stock items:", err);
    res.status(500).json({ success: false, message: "Failed to fetch low stock items" });
  }
}

export default { index, show, create, update, destroy, lowStock };