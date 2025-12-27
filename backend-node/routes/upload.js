import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import { uploadMiddleware, uploadInvoiceImage } from "../controllers/uploadController.js";

// Upload invoice image endpoint
router.post(
  "/invoice",
  authenticate,
  uploadMiddleware,
  uploadInvoiceImage
);

export default router;

