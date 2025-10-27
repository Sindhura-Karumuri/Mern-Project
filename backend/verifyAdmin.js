import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.ATLAS_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_canteen";

async function verifyAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const admin = await User.findOne({ email: "superadmin@example.com" });
    
    if (!admin) {
      console.log("❌ Admin user not found!");
      return;
    }

    console.log("✅ Admin user found:");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Name:", admin.name);

    // Test password
    const testPassword = "SuperSecure123";
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    if (isMatch) {
      console.log("✅ Password verification successful!");
      console.log("Use these credentials to login:");
      console.log("Email: superadmin@example.com");
      console.log("Password: SuperSecure123");
    } else {
      console.log("❌ Password mismatch! Resetting password...");
      
      // Reset password
      const hashedPassword = await bcrypt.hash("SuperSecure123", 10);
      await User.updateOne(
        { email: "superadmin@example.com" },
        { password: hashedPassword }
      );
      
      console.log("✅ Password reset successfully!");
      console.log("Use these credentials to login:");
      console.log("Email: superadmin@example.com");
      console.log("Password: SuperSecure123");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
}

verifyAdmin();