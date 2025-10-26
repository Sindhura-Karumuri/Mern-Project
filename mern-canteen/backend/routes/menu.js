const express = require('express');
const { MenuItem } = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// public list
router.get('/', async (req, res) => {
  const items = await MenuItem.findAll({ where: { available: true } });
  res.json(items);
});

// admin CRUD
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.json(item);
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.update(req.body);
  res.json(item);
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
