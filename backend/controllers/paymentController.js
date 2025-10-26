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

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: plan.price * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: plan._id.toString(),
        userId,
      },
      items: [
        {
          name: plan.name,
          amount: plan.price * 100,
          currency: "INR",
          quantity: 1,
        },
      ],
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      order,
      planId: plan._id,
    });
  } catch (err) {
    console.error("Create-order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

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
