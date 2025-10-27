import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
  type: { type: String, enum: ["order", "subscription"], required: true },
  amount: { type: Number, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Revenue", revenueSchema);