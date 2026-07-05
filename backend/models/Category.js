const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  CategoryName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category',
  CategorySchema,
  'food_category');
