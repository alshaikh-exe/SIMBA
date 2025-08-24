// models/order.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Each line in an order (cart/request/approved)
const lineItemSchema = new Schema(
  {
    qty: { type: Number, default: 1, min: 1 },

    // Reference the Item by id (don't embed the whole item schema)
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },

    // STUDENT input at submit time
    requestedDays: { type: Number, min: 1, max: 50 }, // required when submitting

    // ADMIN decision per line
    decision: { type: String, enum: ["pending", "return", "keep"], default: "pending" },
    approvedDays: { type: Number, min: 1, max: 50 }, // only if decision === "return"
    dueAt: { type: Date },                           // computed when admin approves "return"

    // Return tracking
    returnedQty: { type: Number, default: 0, min: 0 },

    // Line lifecycle
    status: {
      type: String,
      enum: ["pending", "open", "consumed", "returned", "overdue", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Whole order
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // student
    lineItems: [lineItemSchema],

    // Cart/request/approval lifecycle
    status: { type: String, enum: ["pending", "requested", "approved", "rejected", "closed"], default: "pending" },

    // Admin approval audit
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },

    // Keep your existing message link if you use it
    message: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Virtuals
orderSchema.virtual("totalQty").get(function () {
  return this.lineItems.reduce((total, li) => total + li.qty, 0);
});
orderSchema.virtual("orderId").get(function () {
  return this.id.slice(-6).toUpperCase();
});

// Helpful indexes
orderSchema.index({ user: 1, status: 1, createdAt: -1 });
orderSchema.index({ "lineItems.dueAt": 1, "lineItems.status": 1 });

// Get/create the student's cart (status='pending')
orderSchema.statics.getCart = function (userId) {
  return this.findOneAndUpdate(
    { user: userId, status: "pending" },
    { user: userId },
    { upsert: true, new: true }
  );
};

// Add an item to cart
orderSchema.methods.addItemToCart = async function (itemId) {
  const cart = this;
  const existing = cart.lineItems.find((li) => li.item.equals(itemId));
  if (existing) {
    existing.qty += 1;
  } else {
    cart.lineItems.push({ item: itemId, qty: 1 });
  }
  return cart.save();
};

// Set qty for an item in cart (remove if <= 0)
orderSchema.methods.setItemQty = function (itemId, newQty) {
  const cart = this;
  const li = cart.lineItems.find((x) => x.item.equals(itemId));
  if (li && newQty <= 0) li.deleteOne();
  else if (li) li.qty = newQty;
  return cart.save();
};

export default model("Order", orderSchema);
