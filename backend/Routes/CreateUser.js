const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify user
const verifyUser = (req, res, next) => {
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

// Get current user info
router.get('/user', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

router.post(
  '/createuser',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location
      });

      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Unable to create user' });
    }
  }
);

router.post(
  '/loginuser',
  [body('email').isEmail(), body('password').isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const pwdCompare = await bcrypt.compare(password, userData.password);
      if (!pwdCompare) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (!jwtSecret) {
        return res.status(500).json({ success: false, message: 'Server auth configuration missing' });
      }

      const data = { user: { id: userData.id } };
      const authToken = jwt.sign(data, jwtSecret, { expiresIn: '2h' });
      return res.json({ success: true, authToken, isAdmin: userData.isAdmin || false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
);

module.exports = router;
