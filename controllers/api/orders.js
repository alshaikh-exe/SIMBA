import mongoose from "mongoose";
import Order from "../../models/order.js";
import Item from "../../models/item.js";

const { Types } = mongoose;

const clampDays = (n) => {
  const x = Math.floor(Number(n));
  if (!Number.isFinite(x)) return null;
  if (x < 1 || x > 50) return null;
  return x;
};

// GET /api/orders/cart
export async function getCart(req, res) {
  try {
    const cart = await Order.getCart(req.user._id);
    await cart.populate("lineItems.item");
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

// POST /api/orders/cart/items  { itemId }
export async function addToCart(req, res) {
  try {
    const { itemId } = req.body;
    if (!Types.ObjectId.isValid(itemId)) return res.status(400).json({ success: false, message: "Invalid itemId" });
    const exists = await Item.findById(itemId).select("_id");
    if (!exists) return res.status(404).json({ success: false, message: "Item not found" });

    const cart = await Order.getCart(req.user._id);
    await cart.addItemToCart(itemId);
    await cart.populate("lineItems.item");
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

// PUT /api/orders/cart/items/:itemId  { qty }
export async function setCartQty(req, res) {
  try {
    const { itemId } = req.params;
    const { qty } = req.body;
    if (!Types.ObjectId.isValid(itemId)) return res.status(400).json({ success: false, message: "Invalid itemId" });

    const cart = await Order.getCart(req.user._id);
    await cart.setItemQty(itemId, Math.max(0, Number(qty)));
    await cart.populate("lineItems.item");
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

/**
 * POST /api/orders/submit
 * Body: { lines: [{ item, requestedDays }], notes? }
 */
export async function submit(req, res) {
  try {
    const { lines = [], notes } = req.body;
    if (!Array.isArray(lines) || !lines.length) {
      return res.status(400).json({ success: false, message: "lines is required" });
    }

    const cart = await Order.getCart(req.user._id);
    if (!cart.lineItems.length) return res.status(400).json({ success: false, message: "Cart is empty" });

    // attach requestedDays to each cart line
    for (const li of cart.lineItems) {
      const match = lines.find((x) => x.item && li.item.equals(x.item));
      if (!match) return res.status(400).json({ success: false, message: "Each line needs requestedDays" });

      const days = clampDays(match.requestedDays);
      if (!days) return res.status(400).json({ success: false, message: "requestedDays must be 1..50" });

      li.requestedDays = days;
      li.decision = "pending";
      li.status = "pending";
      li.approvedDays = undefined;
      li.dueAt = undefined;
    }

    cart.status = "requested";
    if (typeof notes === "string" && notes.trim()) cart.message = cart.message || undefined;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

/**
 * PUT /api/orders/:id/approve  (admin)
 * Body: { decisions: [{ item, decision: 'return'|'keep', approvedDays? }], reject? }
 */
export async function approve(req, res) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "requested") {
      return res.status(400).json({ success: false, message: "Only requested orders can be approved/rejected" });
    }

    const { decisions = [], reject = false } = req.body;

    if (reject) {
      order.status = "rejected";
      order.lineItems.forEach((li) => {
        li.status = "rejected";
        li.decision = "pending";
        li.approvedDays = undefined;
        li.dueAt = undefined;
      });
      order.approvedBy = req.user._id;
      order.approvedAt = new Date();
      await order.save();
      return res.status(200).json({ success: true, data: order });
    }

    // match decisions by item id
    for (const li of order.lineItems) {
      const d = decisions.find((x) => x.item && li.item.equals(x.item));
      if (!d || !["return", "keep"].includes(d.decision)) {
        return res.status(400).json({ success: false, message: "Each line needs decision: return or keep" });
      }

      li.decision = d.decision;

      if (d.decision === "return") {
        let days = clampDays(d.approvedDays ?? li.requestedDays);
        if (!days) return res.status(400).json({ success: false, message: "approvedDays/requestedDays must be 1..50" });
        li.approvedDays = days;
        li.dueAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        li.status = "open";
      } else {
        li.approvedDays = undefined;
        li.dueAt = undefined;
        li.status = "consumed";
      }
    }

    order.status = "approved";
    order.approvedBy = req.user._id;
    order.approvedAt = new Date();
    await order.save();

    await order.populate("lineItems.item").populate("user", "name email");
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

// GET /api/orders/:id
export async function show(req, res) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const order = await Order.findById(id).populate("lineItems.item").populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

export async function setCartDates(req, res) {
  try {
    const { pickupDate, returnDate } = req.body;
    if (!pickupDate || !returnDate) {
      return res.status(400).json({ success: false, message: "Both dates required" });
    }

    const cart = await Order.getCart(req.user._id);
    cart.pickupDate = new Date(pickupDate);
    cart.returnDate = new Date(returnDate);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// GET /api/orders (all orders for logged-in user)
export async function index(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("lineItems.item")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

export default { getCart, addToCart, setCartQty, submit, approve, show, setCartDates, index };
