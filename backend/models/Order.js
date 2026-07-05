const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: 'food', required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  size: { type: String },
  unitPrice: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  orderedItems: { type: [OrderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('order', OrderSchema);
