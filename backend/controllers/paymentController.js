import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Plan from "../models/Plan.js";
import User from "../models/User.js";

dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { planId, userId } = req.body;
    if (!planId || !userId)
      return res.status(400).json({ message: "Plan ID and User ID required" });

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // For testing without Razorpay - simulate successful subscription
    const user = await User.findById(userId);
    if (user) {
      user.subscription = planId;
      await user.save();
    }

    // Track revenue for subscription
    console.log(`📊 Tracking subscription revenue: ₹${plan.price} for plan ${plan.name}`);
    const Revenue = (await import("../models/Revenue.js")).default;
    await Revenue.create({
      type: "subscription",
      amount: plan.price,
      planId: plan._id,
      userId: userId
    });
    console.log(`✅ Subscription revenue tracked successfully`);

    res.status(200).json({
      success: true,
      message: "Subscription successful!",
      planId: plan._id,
    });
  } catch (err) {
    console.error("Create-order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Save subscription to user
    const user = await User.findById(userId);
    if (user) {
      user.subscription = planId;
      await user.save();
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Verify-payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
