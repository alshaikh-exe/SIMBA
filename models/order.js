import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import itemSchema from './item.js';

const lineItemSchema = new Schema({
  qty: { type: Number, default: 1 },
  
  item: itemSchema
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});


const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    lineItems: [lineItemSchema],
    status: { type: String, default: 'pending' },
    message: {type: Schema.Types.ObjectId, ref: 'Message'}
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});


orderSchema.virtual('totalQty').get(function() {
    return this.lineItems.reduce((total, item) => total + item.qty, 0);
});

orderSchema.virtual('orderId').get(function() {
  return this.id.slice(-6).toUpperCase();
});

orderSchema.statics.getCart = function(userId) {
  // 'this' is the Order model
  return this.findOneAndUpdate(
    // query
    { user: userId, status: 'pending' },
    // update
    { user: userId },
    // upsert option will create the doc if
    // it doesn't exist
    { upsert: true, new: true }
  );
};

orderSchema.methods.addItemToCart = async function(itemId) {
  const cart = this;
  // Check if item already in cart
  const lineItem = cart.lineItems.find(lineItem => lineItem.item._id.equals(itemId));
  if (lineItem) {
    lineItem.qty += 1;
  } else {
    const item = await mongoose.model('Item').findById(itemId);
    cart.lineItems.push({ item });
  }
  return cart.save();
};

// Instance method to set an item's qty in the cart (will add item if does not exist)
orderSchema.methods.setItemQty = function(itemId, newQty) {
  // this keyword is bound to the cart (order doc)
  const cart = this;
  // Find the line item in the cart for the menu item
  const lineItem = cart.lineItems.find(lineItem => lineItem.item._id.equals(itemId));
  if (lineItem && newQty <= 0) {
    // Calling remove, removes itself from the cart.lineItems array
    lineItem.deleteOne();
  } else if (lineItem) {
    // Set the new qty - positive value is assured thanks to prev if
    lineItem.qty = newQty;
  }
  // return the save() method's promise
  return cart.save();
};

export default mongoose.model('Order', orderSchema);