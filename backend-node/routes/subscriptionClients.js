import express from "express";
const router = express.Router();
import scc from "../controllers/subscriptionClientController.js";
import { authenticate } from "../middleware/auth.js";
import { body } from "express-validator";

router.post(
  "/link-client",
  authenticate,
  [
    body("subscriptionId").notEmpty().withMessage("Subscription ID is required"),
    body("clientId").notEmpty().withMessage("Client ID is required"),
  ],
  scc.linkClientToSubscription
);
router.post(
  "/unlink-client",
  authenticate,
  [
    body("subscriptionId").notEmpty().withMessage("Subscription ID is required"),
    body("clientId").notEmpty().withMessage("Client ID is required"),
  ],
  scc.unlinkClientFromSubscription
);
router.get("/clients/:subscriptionId", authenticate, scc.getClientsForSubscription);
router.get("/subscriptions/:clientId", authenticate, scc.getSubscriptionsForClient);

export default router;
