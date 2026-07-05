const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');

const jwtSecret = process.env.JWT_SECRET;

const ORDER_STATUSES = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];

// Admin middleware: verify user is authenticated and is admin
const verifyAdmin = async (req, res, next) => {
  if (!jwtSecret) {
    return res.status(500).json({ success: false, message: 'Server auth configuration missing' });
  }

  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Auth token missing' });
  }
  try {
    const data = jwt.verify(token, jwtSecret);
    const user = await User.findById(data.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid auth token' });
  }
};

// Helper to refresh global food data
const refreshGlobalData = async () => {
  try {
    const foods = await Food.find({});
    const categories = await Category.find({});
    global.food_items = foods;
    global.food_category = categories;
  } catch (err) {
    console.error('Error refreshing global data:', err);
  }
};

// ============ FOOD CRUD ============

// Get all foods (admin view)
router.get('/admin/foods', verifyAdmin, async (req, res) => {
  try {
    const foods = await Food.find({});
    return res.json({ success: true, foods });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch foods' });
  }
});

// Add food
router.post('/admin/addFood', verifyAdmin, async (req, res) => {
  try {
    const { name, description, img, options, CategoryName, rating } = req.body;
    if (!name || !CategoryName) {
      return res.status(400).json({ success: false, message: 'Name and CategoryName required' });
    }

    const food = await Food.create({
      name,
      description,
      img,
      options,
      CategoryName,
      rating: rating || 4.5
    });

    await refreshGlobalData();
    return res.json({ success: true, food });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to add food' });
  }
});

// Edit food
router.put('/admin/editFood/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, img, options, CategoryName, rating } = req.body;
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, description, img, options, CategoryName, rating },
      { new: true }
    );
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });

    await refreshGlobalData();
    return res.json({ success: true, food });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to edit food' });
  }
});

// Delete food
router.delete('/admin/deleteFood/:id', verifyAdmin, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });

    await refreshGlobalData();
    return res.json({ success: true, message: 'Food deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to delete food' });
  }
});

// ============ CATEGORY CRUD ============

// Get all categories
router.get('/admin/categories', verifyAdmin, async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Add category
router.post('/admin/addCategory', verifyAdmin, async (req, res) => {
  try {
    const { CategoryName } = req.body;
    if (!CategoryName) {
      return res.status(400).json({ success: false, message: 'CategoryName required' });
    }

    const category = await Category.create({ CategoryName });
    await refreshGlobalData();
    return res.json({ success: true, category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to add category' });
  }
});

// Edit category
router.put('/admin/editCategory/:id', verifyAdmin, async (req, res) => {
  try {
    const { CategoryName } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { CategoryName }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await refreshGlobalData();
    return res.json({ success: true, category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to edit category' });
  }
});

// Delete category
router.delete('/admin/deleteCategory/:id', verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await refreshGlobalData();
    return res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// ============ DASHBOARD STATS ============

router.put('/admin/order/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

router.get('/admin/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();

    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

router.get('/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      totalFoods,
      totalCategories,
      totalOrders,
      totalUsers,
      newUsersThisWeek,
      recentOrders,
      recentUsers,
      recentFoods,
      recentCategories,
      dailyOrderData,
      mostOrderedItems,
      orderStatusData,
      revenueResult
    ] = await Promise.all([
      Food.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ date: { $gte: startOfWeek } }),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('userId', 'name email')
        .lean(),
      User.find({}).sort({ date: -1 }).limit(5).select('name email date').lean(),
      Food.find({}).sort({ _id: -1 }).limit(5).select('name createdAt _id').lean(),
      Category.find({}).sort({ createdAt: -1 }).limit(5).select('CategoryName createdAt').lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $unwind: '$orderedItems' },
        {
          $group: {
            _id: '$orderedItems.name',
            orders: { $sum: '$orderedItems.qty' }
          }
        },
        { $sort: { orders: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: '$_id', orders: 1 } }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: {
              $cond: [{ $eq: ['$status', 'Placed'] }, 'Pending', '$status']
            },
            count: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }])
    ]);

    const dailyMap = new Map(dailyOrderData.map((entry) => [entry._id, entry]));
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setUTCDate(date.getUTCDate() + index);
      const key = date.toISOString().slice(0, 10);
      const values = dailyMap.get(key);
      return {
        date: key,
        label: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
        orders: values?.orders || 0,
        revenue: values?.revenue || 0
      };
    });

    const orderStatusCounts = {
      Pending: 0,
      Preparing: 0,
      Delivered: 0
    };
    orderStatusData.forEach((entry) => {
      if (Object.prototype.hasOwnProperty.call(orderStatusCounts, entry._id)) {
        orderStatusCounts[entry._id] = entry.count;
      }
    });

    const activities = [
      ...recentUsers.map((user) => ({
        id: `user-${user._id}`,
        type: 'user',
        message: `${user.name} registered`,
        createdAt: user.date
      })),
      ...recentOrders.map((order) => ({
        id: `order-${order._id}`,
        type: 'order',
        message: `New order placed by ${order.userId?.name || 'a customer'}`,
        createdAt: order.createdAt
      })),
      ...recentFoods.map((food) => ({
        id: `food-${food._id}`,
        type: 'food',
        message: `${food.name} added to the menu`,
        createdAt: food.createdAt || food._id.getTimestamp()
      })),
      ...recentCategories.map((category) => ({
        id: `category-${category._id}`,
        type: 'category',
        message: `${category.CategoryName} category added`,
        createdAt: category.createdAt || category._id.getTimestamp()
      }))
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    return res.json({
      success: true,
      totalFoods,
      totalCategories,
      totalOrders,
      totalUsers,
      newUsersThisWeek,
      totalRevenue: revenueResult[0]?.total || 0,
      recentOrders,
      recentUsers,
      activities,
      analytics: { lastSevenDays, mostOrderedItems, orderStatusCounts }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

module.exports = router;
