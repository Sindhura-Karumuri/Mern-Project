const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authMiddleware, adminOnly } = require("../middleware/auth");

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

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
