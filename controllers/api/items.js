// controllers/api/items.js
import mongoose from "mongoose";
import Item from "../../models/item.js";
import Location from "../../models/location.js";

const { Types } = mongoose;


function buildTextFilter(q) {
  if (!q) return {};
  return {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { details: { $regex: q, $options: "i" } },
    ],
  };
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
    
    const loc = await Location.findOneAndUpdate(
      { campus, building, classroom },
      { $setOnInsert: { campus, building, classroom } },
      { new: true, upsert: true }
    );
    return loc;
  }

  const err = new Error("Provide either locationId or campus+building+classroom");
  err.status = 400;
  throw err;
}

async function filterByLocationQuery({ campus, building, classroom }) {
  if (!campus && !building && !classroom) return {};
  const locQuery = {};
  if (campus) locQuery.campus = campus;
  if (building) locQuery.building = building;
  if (classroom) locQuery.classroom = classroom;
  const locs = await Location.find(locQuery).select("_id");
  return locs.length ? { location: { $in: locs.map((l) => l._id) } } : { location: { $in: [] } };
}

function selectUpdatableFields(body) {
  const updatable = {};
  if (typeof body.name === "string") updatable.name = body.name;
  if (typeof body.details === "string") updatable.details = body.details;
  if (typeof body.picture === "string") updatable.picture = body.picture;
  if (typeof body.category === "string") updatable.category = body.category;
  return updatable;
}

function populateItem(query) {
  return query
    .populate("location")
    .populate("createdBy", "name email"); 
}

// --- controllers ---

export async function index(req, res) {
  try {
    const {
      q,
      campus,
      building,
      classroom,
      category,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const filters = { ...buildTextFilter(q) };
    if (category) filters.category = category;

    // location-based filtering
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
      meta: {
        total,
        page: $page,
        pages: Math.max(1, Math.ceil(total / $limit)),
        limit: $limit,
      },
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// GET /api/items/:id
export async function show(req, res) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const item = await populateItem(Item.findById(id));
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// POST /api/items
export async function create(req, res) {
  try {
    if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, details, picture, category, locationId, campus, building, classroom } = req.body;
    if (!name || !details) {
      return res.status(400).json({ success: false, message: "name and details are required" });
    }

    const loc = await resolveLocation({ locationId, campus, building, classroom });

    const toCreate = {
      name: name.trim(),
      details,
      picture,
      category,
      location: loc._id,
      createdBy: req.user._id,
    };

    const created = await Item.create(toCreate);
    const populated = await populateItem(Item.findById(created._id));

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    // Handle unique index collisions gracefully
    const code = err.code === 11000 ? 400 : err.status || 500;
    const message =
      err.code === 11000 ? "Duplicate key error (likely Location uniqueness)" : err.message || "Server error";
    res.status(code).json({ success: false, message });
  }
}

// PUT /api/items/:id
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

    const updated = await Item.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    const populated = await populateItem(Item.findById(updated._id));
    res.status(200).json({ success: true, data: populated });
  } catch (err) {
    const code = err.code === 11000 ? 400 : err.status || 500;
    const message =
      err.code === 11000 ? "Duplicate key error (likely Location uniqueness)" : err.message || "Server error";
    res.status(code).json({ success: false, message });
  }
}

// DELETE /api/items/:id
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
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

export default { index, show, create, update, destroy };
