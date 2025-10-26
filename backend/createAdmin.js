require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, connectDB } = require("./models");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "superadmin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("SuperSecure123", 10);

    // Create new admin user
    const admin = new User({
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: superadmin@example.com");
    console.log("Password: SuperSecure123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
