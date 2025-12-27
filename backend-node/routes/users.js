import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import uc from "../controllers/userController.js";

router.get("/search", authenticate, uc.searchUsers);
router.get("/me", authenticate, uc.getMe);
router.put("/me", authenticate, uc.updateUser);
router.post("/me/change-password", authenticate, uc.changePassword);
router.put("/:username", authenticate, uc.updateUser);
router.get("/:username", authenticate, uc.getUserByUsername);

// Admin routes
router.get("/admin/all", authenticate, isAdmin, uc.getAllUsers);
router.post("/admin/create", authenticate, isAdmin, uc.createUser);
router.put("/admin/:id", authenticate, isAdmin, uc.updateUserById);
router.delete("/admin/:id", authenticate, isAdmin, uc.deleteUserById);

export default router;