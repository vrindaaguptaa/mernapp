const express = require('express');
const router = express.Router();

router.get(['/displaydata', '/foodData'], (req, res) => {
  try {
    if (!global.food_items || !global.food_category) {
      return res.status(503).json({ success: false, message: 'Food data not loaded yet' });
    }
    return res.json({ success: true, foodItems: global.food_items, foodCategory: global.food_category });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
