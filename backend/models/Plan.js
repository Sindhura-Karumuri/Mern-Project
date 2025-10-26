import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  image: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
