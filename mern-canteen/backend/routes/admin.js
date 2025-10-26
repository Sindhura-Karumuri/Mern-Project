const express = require('express');
const { User, Plan, Order, Payment, MenuItem } = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/summary', authMiddleware, adminOnly, async (req, res) => {
  const totalUsers = await User.count();
  const activeSubscriptions = await User.count({ where: { planId: { [Op.ne]: null } } });
  const dailyOrders = await Order.count({ where: { createdAt: { [Op.gte]: new Date(Date.now() - 24*60*60*1000) } } });
  const revenue = await Payment.sum('amount', { where: { status: 'Succeeded' }}) || 0;
  const menuCount = await MenuItem.count();

  res.json({ totalUsers, activeSubscriptions, dailyOrders, revenue, menuCount });
});

module.exports = router;
