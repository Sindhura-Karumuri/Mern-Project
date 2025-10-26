import express from "express";
import MenuItem from "../models/MenuItem.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/menu"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    console.log("✅ Sending menu items:", items.map(i => i.image));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new menu item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const image = req.file ? `/uploads/menu/${req.file.filename}` : null;

    const newItem = new MenuItem({ name, price, category, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update existing menu item (including image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
    item.category = req.body.category || item.category;

    // If new image is uploaded, remove old image
    if (req.file) {
      if (item.image) {
        const oldImagePath = path.join(__dirname, "..", item.image.replace(/^\//, ""));
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      item.image = `/uploads/menu/${req.file.filename}`;
    }

    await item.save();
    console.log("✅ Updated item image:", item.image);
    res.json({ message: "Menu item updated successfully", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE menu item
router.delete("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Delete image file
    if (item.image) {
      const imagePath = path.join(__dirname, "..", item.image.replace(/^\//, ""));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
