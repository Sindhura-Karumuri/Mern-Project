const express = require('express');
const { Order, MenuItem } = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// place order - student
router.post('/', authMiddleware, async (req, res) => {
  const { menuItemId, quantity = 1 } = req.body;
  const menuItem = await MenuItem.findByPk(menuItemId);
  if (!menuItem || !menuItem.available) return res.status(400).json({ message: 'Item not available' });
  const totalPrice = menuItem.price * quantity;
  const order = await Order.create({ userId: req.user.id, menuItemId, quantity, totalPrice, status: 'Pending' });
  res.json(order);
});

// get user's orders
router.get('/my', authMiddleware, async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.user.id }, include: [MenuItem] });
  res.json(orders);
});

// admin: list all
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  const orders = await Order.findAll({ include: [MenuItem] });
  res.json(orders);
});

// admin update status
router.put('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  const { status } = req.body;
  order.status = status;
  await order.save();
  res.json(order);
});

module.exports = router;
