const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require('./db');

// Initialize MongoDB
mongoDB();

// Enable CORS for all requests
app.use(cors({
  origin: "http://localhost:3000", // Allow requests only from your frontend
  credentials: true, // Allow cookies & authorization headers
  methods: "GET,POST,PUT,DELETE" // Allowed HTTP methods
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
