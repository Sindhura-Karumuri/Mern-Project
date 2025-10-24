const express = require('express');
const { Plan } = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// list plans
router.get('/', async (req, res) => {
  const plans = await Plan.findAll();
  res.json(plans);
});

// admin create
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { name, price, duration_in_days } = req.body;
  const plan = await Plan.create({ name, price, duration_in_days });
  res.json(plan);
});

// update
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Not found' });
  await plan.update(req.body);
  res.json(plan);
});

// delete
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (!plan) return res.status(404).json({ message: 'Not found' });
  await plan.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
