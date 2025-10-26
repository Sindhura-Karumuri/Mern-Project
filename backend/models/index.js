const mongoose = require("mongoose");
const User = require("./User");
const Plan = require("./Plan");
const MenuItem = require("./MenuItem");
const Order = require("./Order");
const Payment = require("./Payment");

const connectDB = async () => {
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

module.exports = {
  connectDB,
  User,
  Plan,
  MenuItem,
  Order,
  Payment,
};
