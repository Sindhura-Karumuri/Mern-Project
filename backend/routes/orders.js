import express from "express";
import Order from "../models/Order.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET all orders (Admin)
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "-password");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET orders of logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, paymentStatus } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Items are required and must be an array" });

    if (totalAmount === undefined)
      return res.status(400).json({ message: "totalAmount is required" });

    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      paymentStatus: paymentStatus || "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update order status (Admin)
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Track revenue when order is completed (case insensitive)
    if (status.toLowerCase() === "completed" && oldStatus.toLowerCase() !== "completed") {
      console.log(`📊 Tracking revenue for order ${order._id}: ₹${order.totalAmount}`);
      const Revenue = (await import("../models/Revenue.js")).default;
      await Revenue.create({
        type: "order",
        amount: order.totalAmount,
        orderId: order._id,
        userId: order.user
      });
      console.log(`✅ Revenue tracked successfully`);
    }

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
