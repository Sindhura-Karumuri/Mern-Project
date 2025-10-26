import express from "express";
import Plan from "../models/Plan.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/plans"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all plans
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new plan
router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, duration_in_days } = req.body;

  if (!name || !price || !duration_in_days)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const plan = new Plan({
      name,
      price,
      duration: duration_in_days,
      image: req.file ? `/uploads/plans/${req.file.filename}` : null,
    });
    await plan.save();
    res.status(201).json({ message: "Plan added successfully", plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update plan
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    plan.name = req.body.name || plan.name;
    plan.price = req.body.price || plan.price;
    plan.duration = req.body.duration_in_days || plan.duration;

    // Replace image if new file uploaded
    if (req.file) {
      if (plan.image) {
        const oldPath = path.join(process.cwd(), plan.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      plan.image = `/uploads/plans/${req.file.filename}`;
    }

    await plan.save();
    res.json({ message: "Plan updated successfully", plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE plan
router.delete("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Remove image
    if (plan.image) {
      const imagePath = path.join(process.cwd(), plan.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
