import express from "express";
const router = express.Router();
import upc from "../controllers/userPlanController.js";
import { authenticate } from "../middleware/auth.js";
import { body } from "express-validator";

// Stripe checkout session creation
router.post(
  "/create-checkout-session",
  authenticate,
  [body("planId").isMongoId()],
  upc.createCheckoutSession
);

// Confirm payment after successful checkout
router.post(
  "/confirm-payment",
  authenticate,
  [body("sessionId").isString().notEmpty()],
  upc.confirmPayment
);

// Simplified plan selection (for demo/mock payment - fallback)
router.post(
  "/select",
  authenticate,
  [body("planId").isMongoId()],
  upc.selectPlan
);
router.get("/my-plan", authenticate, upc.getMyPlan);

// Admin/Full Stripe integration endpoints
router.post(
  "/assign",
  authenticate,
  [
    body("userId").isMongoId(),
    body("planId").isMongoId(),
    body("stripeCustomerId").isString().notEmpty(),
    body("status")
      .isIn(["active", "canceled", "past_due", "incomplete"])
      .optional(),
  ],
  upc.assignPlanToUser
);
router.get("/plan/:userId", authenticate, upc.getUserPlan);
router.put("/plan/update/:userId", authenticate, upc.updateUserPlan);
router.put("/plan/:userId", authenticate, upc.cancelUserPlan);
router.delete("/plan/:userId", authenticate, upc.deleteUserPlan);

export default router;
