import express from "express";
const router = express.Router();
import cc from "../controllers/clientController.js";
import { authenticate } from "../middleware/auth.js";
import { body } from "express-validator";

// FIX: Change /subscribe to /
router.post(
  "/",
  authenticate,
  [
    body("workspaceId").notEmpty().withMessage("Workspace ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  cc.createClient
);

router.get("/workspace/:workspaceId", authenticate, cc.getClientsByWorkspace);
router.get("/:id", authenticate, cc.getClient);
// FIX: Add missing PUT route
router.put("/:id", authenticate, cc.updateClient);
router.delete("/:id", authenticate, cc.deleteClient);

export default router;
