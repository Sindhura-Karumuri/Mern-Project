import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // default import
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.ATLAS_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_canteen";

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const existingAdmin = await User.findOne({ email: "superadmin@example.com" });
  if (existingAdmin) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("SuperSecure123", 10);

  const admin = new User({
    name: "Super Admin",
    email: "superadmin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin user created successfully!");
  process.exit(0);
}

createAdmin();
