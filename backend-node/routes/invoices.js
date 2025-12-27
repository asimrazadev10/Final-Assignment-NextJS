import express from "express";
const router = express.Router();
import { authenticate } from "../middleware/auth.js";
import ic from "../controllers/invoiceController.js";
import { body } from "express-validator";

// FIX: Change /create-invoice to /
router.post(
  "/",
  authenticate,
  [
    body("subscriptionId").isMongoId(),
    body("amount").isFloat({ min: 0 }),
    body("invoiceDate").isISO8601().toDate(),
    body("source").isIn(["email", "upload", "api"]),
      body("status").isIn(["pending", "paid", "overdue", "void"]),
  ],
  ic.createInvoice
);

// FIX: Remove /invoices prefix
router.get("/subscription/:subscriptionId", authenticate, ic.getInvoicesBySubscription);

// FIX: Remove /invoice prefix
router.get("/:id", authenticate, ic.getInvoice);
router.put("/:id", authenticate, ic.updateInvoice);
router.delete("/:id", authenticate, ic.deleteInvoice);

export default router;
