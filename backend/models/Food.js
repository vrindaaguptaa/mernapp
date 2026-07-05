const mongoose = require('mongoose');
const { Schema } = mongoose;

const FoodSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  img: { type: String },
  options: [
    {
      type: Schema.Types.Mixed
    }
  ],
  CategoryName: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food',
  FoodSchema,
  'food_items');
