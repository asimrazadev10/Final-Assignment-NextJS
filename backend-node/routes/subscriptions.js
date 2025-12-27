import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import sc from "../controllers/subscriptionController.js";
import { body } from "express-validator";

router.post(
  "/",
  authenticate,
  [
    body("workspaceId").isMongoId().withMessage("Invalid Workspace ID"),
    body("name").notEmpty().trim(),
    body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
    body("currency").isISO4217().withMessage("Invalid currency code"),
    body("period").isIn(["monthly", "yearly"]).withMessage("Invalid period"),
  ],
  sc.createSubscription
);

// FIX: Change workspace-id to workspaceId
router.get("/workspace/:workspaceId", authenticate, sc.getSubscriptionsByWorkspace);
router.get("/:id", sc.getSubscription);
router.put("/:id", authenticate, sc.updateSubscription);
router.delete("/:id", authenticate, sc.deleteSubscription);

export default router;
