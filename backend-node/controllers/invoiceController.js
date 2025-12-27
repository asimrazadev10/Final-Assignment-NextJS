import Invoice from "../models/Invoice.js";
import Subscription from "../models/Subscription.js";
import Workspace from "../models/Workspace.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import { validationResult } from "express-validator";

const createInvoice = async (req, res) => {
  const data = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ message: "Validation failed", errors: errors.array() });
  }

  try {
    const sub = await Subscription.findById(data.subscriptionId);
    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Verify workspace ownership via subscription
    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws) {
      return res
        .status(403)
        .json({
          message: "Not allowed to create invoice for this subscription",
        });
    }

    const invoice = await Invoice.create({
      subscriptionId: data.subscriptionId,
      fileUrl: sanitizeInput(data.fileUrl),
      amount: Number(data.amount),
      invoiceDate: new Date(data.invoiceDate),
      status: data.status, // paid | unpaid | pending
      source: data.source, // email | upload | api
    });

    return res.json({
      status: 201,
      message: "Invoice created successfully",
      invoice,
    });
  } catch (e) {
    console.error("Error creating invoice:", e);
    return res.status(500).json({ message: "Failed to create invoice" });
  }
};

const getInvoicesBySubscription = async (req, res) => {
  const subscriptionId = req.params.subscriptionId;

  try {
    const sub = await Subscription.findById(subscriptionId);
    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws) {
      return res
        .status(403)
        .json({
          message: "Not allowed to view invoices for this subscription",
        });
    }

    const invoices = await Invoice.find({ subscriptionId }).sort({
      invoiceDate: -1,
    });

    return res.json(invoices);
  } catch (e) {
    console.error("Error fetching invoices:", e);
    return res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

const getInvoice = async (req, res) => {
  const id = req.params.id;

  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const sub = await Subscription.findById(invoice.subscriptionId);

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res
        .status(403)
        .json({ message: "Not allowed to view this invoice" });

    return res.json(invoice);
  } catch (e) {
    console.error("Error fetching invoice:", e);
    return res.status(500).json({ message: "Failed to fetch invoice" });
  }
};

const updateInvoice = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const sub = await Subscription.findById(invoice.subscriptionId);

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to update invoice" });

    const updated = await Invoice.findByIdAndUpdate(
      id,
      {
        fileUrl: sanitizeInput(data.fileUrl),
        amount: Number(data.amount),
        invoiceDate: data.invoiceDate
          ? new Date(data.invoiceDate)
          : invoice.invoiceDate,
        status: data.status,
        source: data.source,
      },
      { new: true }
    );

    return res.json({
      status: 200,
      message: "Invoice updated successfully",
      invoice: updated,
    });
  } catch (e) {
    console.error("Error updating invoice:", e);
    return res.status(500).json({ message: "Failed to update invoice" });
  }
};

const deleteInvoice = async (req, res) => {
  const id = req.params.id;

  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const sub = await Subscription.findById(invoice.subscriptionId);

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to delete invoice" });

    await Invoice.findByIdAndDelete(id);

    return res.json({
      status: 200,
      message: "Invoice deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting invoice:", e);
    return res.status(500).json({ message: "Failed to delete invoice" });
  }
};

export default {
  createInvoice,
  getInvoicesBySubscription,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
