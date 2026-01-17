import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Plan from "../models/Plan.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for food items
export const createFoodOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId,
        type: "food_order",
      },
    });

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      amount: totalAmount,
      status: "Pending",
      razorpay_order_id: razorpayOrder.id,
    });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      items,
    });
  } catch (err) {
    console.error("Create food order error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify payment and create order
export const verifyFoodPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount,
      paymentId,
    } = req.body;

    const userId = req.user.id;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Update payment status to failed
      await Payment.findByIdAndUpdate(paymentId, { status: "Failed" });
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update payment record
    await Payment.findByIdAndUpdate(paymentId, {
      status: "Succeeded",
      razorpay_payment_id,
      razorpay_signature,
    });

    // Create order only after successful payment
    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      paymentStatus: "completed",
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Verify food payment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create Razorpay order for subscription plans
export const createPlanOrder = async (req, res) => {
  try {
    const { planId, userId } = req.body;
    if (!planId || !userId)
      return res.status(400).json({ message: "Plan ID and User ID required" });

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: plan.price * 100, // Convert to paise
      currency: "INR",
      receipt: `plan_${Date.now()}`,
      notes: {
        userId,
        planId,
        type: "subscription",
      },
    });

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      plan: planId,
      amount: plan.price,
      status: "Pending",
      razorpay_order_id: razorpayOrder.id,
    });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: plan.price,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      planName: plan.name,
    });
  } catch (err) {
    console.error("Create plan order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify plan payment
export const verifyPlanPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,
      paymentId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentId, { status: "Failed" });
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update payment record
    await Payment.findByIdAndUpdate(paymentId, {
      status: "Succeeded",
      razorpay_payment_id,
      razorpay_signature,
    });

    // Save subscription to user
    const user = await User.findById(userId);
    if (user) {
      user.subscription = planId;
      await user.save();
    }

    // Track revenue for subscription
    const plan = await Plan.findById(planId);
    console.log(`📊 Tracking subscription revenue: ₹${plan.price} for plan ${plan.name}`);
    const Revenue = (await import("../models/Revenue.js")).default;
    await Revenue.create({
      type: "subscription",
      amount: plan.price,
      planId: plan._id,
      userId: userId,
    });
    console.log(`✅ Subscription revenue tracked successfully`);

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated successfully",
    });
  } catch (err) {
    console.error("Verify plan payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
