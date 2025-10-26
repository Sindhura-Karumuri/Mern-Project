// db.js or index.js
import mongoose from "mongoose";
import User from "./User.js";
import Plan from "./Plan.js";
import MenuItem from "./MenuItem.js";
import Order from "./Order.js";
import Payment from "./Payment.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mern_canteen", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Export models individually if needed
export { User, Plan, MenuItem, Order, Payment };
