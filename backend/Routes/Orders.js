const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

const jwtSecret = process.env.JWT_SECRET;

// middleware to extract user
const fetchUser = (req, res, next) => {
  if (!jwtSecret) {
    return res.status(500).json({ success: false, message: 'Server auth configuration missing' });
  }

  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Auth token missing' });
  }
  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid auth token' });
  }
};

// Place an order. Kept as a named handler so the legacy endpoint can remain
// available while the cart uses the canonical POST /api/orders endpoint.
const createOrder = async (req, res) => {
  try {
    const { orderedItems, totalPrice } = req.body;
    if (!Array.isArray(orderedItems) || orderedItems.length === 0) {
      return res.status(400).json({ success: false, message: 'orderedItems required' });
    }

    const invalidItem = orderedItems.some((item) => (
      !item.id ||
      !item.name ||
      !Number.isInteger(Number(item.qty)) ||
      Number(item.qty) < 1 ||
      !Number.isFinite(Number(item.unitPrice)) ||
      Number(item.unitPrice) < 0 ||
      !Number.isFinite(Number(item.price)) ||
      Number(item.price) < 0
    ));
    if (invalidItem) {
      return res.status(400).json({ success: false, message: 'One or more order items are invalid' });
    }

    const numericTotal = Number(totalPrice);
    if (!Number.isFinite(numericTotal) || numericTotal < 0) {
      return res.status(400).json({ success: false, message: 'A valid totalPrice is required' });
    }

    const order = await Order.create({
      userId: req.user.id,
      orderedItems: orderedItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: Number(item.qty),
        size: item.size,
        unitPrice: Number(item.unitPrice),
        price: Number(item.price)
      })),
      totalPrice: numericTotal,
      status: 'Pending'
    });
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

router.post('/orders', fetchUser, createOrder);
router.post('/placeOrder', fetchUser, createOrder);

// Get orders for logged in user
router.get('/myOrders', fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get order details
router.get('/order/:id', fetchUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

module.exports = router;
