const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI;
const mongoDB = async () => {
  if (!mongoURI) {
    console.warn('MONGO_URI is not configured; database-backed endpoints will be unavailable until it is set.');
    global.food_items = [];
    global.food_category = [];
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
// const Category = require('./models/Category');



// const count = await Category.countDocuments();
// console.log("Category Count From Model:", count);








    const fetched_data = await mongoose.connection.db.collection('food_items').find({}).toArray();
    const fetched_category_data = await mongoose.connection.db.collection('food_category').find({}).toArray();

    global.food_items = fetched_data;
    global.food_category = fetched_category_data;

    // Optionally, log the data to confirm
    // console.log('Food Items:', global.food_items);
    // console.log('Food Categories:', global.food_category);
  } catch (err) {
    console.error('Error connecting to MongoDB or fetching data:', err);
    throw err;
  }
};






module.exports=mongoDB;