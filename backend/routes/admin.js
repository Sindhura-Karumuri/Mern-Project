import express from "express";
import { User, Order, MenuItem } from "../models/index.js";
import Payment from "../models/Payment.js";
import Revenue from "../models/Revenue.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ subscription: { $ne: null } });

    const sinceYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyOrders = await Order.countDocuments({ createdAt: { $gte: sinceYesterday } });

    // Calculate total revenue from Revenue model
    const revenueRecords = await Revenue.find();
    const revenue = revenueRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const menuCount = await MenuItem.countDocuments();

    res.status(200).json({ totalUsers, activeSubscriptions, dailyOrders, revenue, menuCount });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Dashboard summary failed", error: err.message });
  }
});

// GET all payments
router.get("/payments", authMiddleware, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("plan", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
});

// GET all users with subscription details
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "student" })
      .select("-password")
      .populate("subscription", "name price duration")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

export default router;
