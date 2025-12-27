import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import wc from "../controllers/workspaceController.js";
import { body } from "express-validator";

router.post(
  "/",
  authenticate,
  [
    body("name")
      .notEmpty()
      .withMessage("Workspace name is required")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Name too long"),
  ],
  wc.createWorkspace
);
router.get("/", authenticate, wc.getMyWorkspaces);
router.get("/:workspaceId", authenticate, wc.getWorkspace);
router.put("/:workspaceId", authenticate, wc.updateWorkspace);
router.delete("/:workspaceId", authenticate, wc.deleteWorkspace);

export default router;
