import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Breakfast", "Lunch", "Snacks", "Beverages"], 
    required: true 
  },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String }, // ✅ add this field
});

export default mongoose.model("MenuItem", menuItemSchema);
