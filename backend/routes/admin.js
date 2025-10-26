const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment'); // Make sure this is the correct import
const MenuItem = require('../models/MenuItem');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ planId: { $ne: null } });

    const sinceYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyOrders = await Order.countDocuments({ createdAt: { $gte: sinceYesterday } });

    const successfulPayments = await Payment.find({ status: "Succeeded" });
    const revenue = successfulPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const menuCount = await MenuItem.countDocuments();

    res.status(200).json({ totalUsers, activeSubscriptions, dailyOrders, revenue, menuCount });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ message: 'Dashboard summary failed', error: err.message });
  }
});

module.exports = router;
