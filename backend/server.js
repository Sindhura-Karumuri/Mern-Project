import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import planRoutes from "./routes/plans.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ Allow CORS for multiple frontends
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // optional fallback if used
      "http://localhost:3000", // CRA fallback
      "https://meal-plan-portal.vercel.app", // deployed frontend
      "https://mern-project-frontend-olt6.onrender.com", // deployed frontend on Render
    ],
    credentials: true,
  })
);

// ✅ Serve static files (uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ MERN Canteen API running with MongoDB");
});

// ✅ MongoDB connection
const dbUri = process.env.ATLAS_URI || process.env.MONGO_URI;
mongoose
  .connect(dbUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
