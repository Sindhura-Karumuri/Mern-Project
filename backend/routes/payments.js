import express from "express";
import {
  createFoodOrder,
  verifyFoodPayment,
  createPlanOrder,
  verifyPlanPayment,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Food order payment routes
router.post("/create-food-order", authMiddleware, createFoodOrder);
router.post("/verify-food-payment", authMiddleware, verifyFoodPayment);

// Plan subscription payment routes
router.post("/create-plan-order", createPlanOrder);
router.post("/verify-plan-payment", verifyPlanPayment);

export default router;
