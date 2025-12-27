import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import pc from "../controllers/planController.js";

import { body } from "express-validator";

router.post(
  "/createPlan",
  authenticate,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
  ],
  pc.createPlan
);
router.get("/getPlans", authenticate, pc.getPlans);
router.get("/getPlan/:id", authenticate, pc.getPlan);
router.put("/updatePlan/:id", authenticate, pc.updatePlan);
router.delete("/deletePlan/:id", authenticate, pc.deletePlan);

export default router;
