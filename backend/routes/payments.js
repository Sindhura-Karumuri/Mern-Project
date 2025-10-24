const express = require('express');
const Razorpay = require('razorpay');
const { Payment, Plan, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

// Initialize Razorpay instance safely
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials missing in .env');
  }
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} catch (err) {
  console.error('Razorpay initialization failed:', err);
}

// Create Razorpay order for a plan
router.post('/create-order', authMiddleware, async (req, res) => {
  const { planId } = req.body;
  if (!planId) return res.status(400).json({ message: 'planId is required' });

  const plan = await Plan.findByPk(planId);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });

  try {
    const amountInPaise = Math.round(plan.price * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `plan_${plan.id}_user_${req.user.id}_${Date.now()}`
    };

    const rOrder = await razorpay.orders.create(options);

    const payment = await Payment.create({
      userId: req.user.id,
      planId: plan.id,
      amount: plan.price,
      status: 'Pending',
      metadata: { razorpay_order_id: rOrder.id }
    });

    res.json({ order: rOrder, paymentId: payment.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: err.message });
  }
});

// Verify Razorpay payment
router.post('/verify', authMiddleware, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
    return res.status(400).json({ message: 'Missing payment verification fields' });
  }

  try {
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const payment = await Payment.findByPk(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'Succeeded';
    payment.provider_payment_id = razorpay_payment_id;
    await payment.save();

    const user = await User.findByPk(payment.userId);
    const plan = await Plan.findByPk(payment.planId);
    if (user && plan) {
      const now = new Date();
      const expires = new Date(now.getTime() + plan.duration_in_days * 24 * 60 * 60 * 1000);
      user.planId = plan.id;
      user.planExpiresAt = expires;
      await user.save();
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Payment verification failed:', err);
    res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
});

module.exports = router;
