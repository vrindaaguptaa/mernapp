const mongoose = require('mongoose');

// MongoDB URI
const mongoURI='mongodb+srv://DeliveryAdmin:Vrinda%40123@cluster0.xsimi.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0'

const mongoDB = async () =>{
 try{
    await mongoose.connect(mongoURI, {});
    console.log('Connected to MongoDB');

    // Fetch data from the "food_items" and "food_category" collections
    const fetched_data = await mongoose.connection.db.collection("food_items").find({}).toArray();
    const fetched_category_data = await mongoose.connection.db.collection("food_category").find({}).toArray();

    // Store the fetched data in global variables
    global.food_items = fetched_data;
    global.food_category = fetched_category_data;

    // Optionally, log the data to confirm
    console.log('Food Items:', global.food_items);
    console.log('Food Categories:', global.food_category);

 } catch (err) {
    console.error('Error connecting to MongoDB or fetching data:', err);
 }
};






module.exports=mongoDB;