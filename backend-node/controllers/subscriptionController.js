import Subscription from "../models/Subscription.js";
import Workspace from "../models/Workspace.js";
import Invoice from "../models/Invoice.js";
import SubscriptionClient from "../models/SubscriptionClient.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import { validationResult } from "express-validator";
import alertService from "../services/alertService.js";

const createSubscription = async (req, res) => {
  const data = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }

  try {
    // verify workspace ownership
    const ws = await Workspace.findOne({
      _id: data.workspaceId,
      ownerId: req.userId,
    });
    
    if (!ws) {
      return res
        .status(403)
        .json({ message: "Not allowed to access workspace" });
    }

    const subscription = await Subscription.create({
      workspaceId: data.workspaceId,
      name: sanitizeInput(data.name),
      vendor: sanitizeInput(data.vendor),
      plan: sanitizeInput(data.plan),
      amount: Number(data.amount),
      currency: sanitizeInput(data.currency || "USD"),
      period: data.period,
      // FIX: Handle null dates properly
      nextRenewalDate: data.nextRenewalDate ? new Date(data.nextRenewalDate) : null,
      category: sanitizeInput(data.category),
      notes: sanitizeInput(data.notes),
      tags: Array.isArray(data.tags) ? data.tags.map(sanitizeInput) : [],
    });

    // Trigger alert checks after creating subscription (for immediate alerts)
    // Check both deadline alerts and budget alerts (since spending changed)
    setTimeout(() => {
      Promise.all([
        subscription.nextRenewalDate ? alertService.checkDeadlineAlerts() : Promise.resolve(),
        alertService.removeBudgetAlertsIfBalanced(data.workspaceId)
      ]).catch(err => 
        console.error("Error checking alerts after subscription creation:", err)
      );
    }, 1000);

    return res.json({
      status: 201,
      message: "Subscription created successfully",
      subscription,
    });
  } catch (e) {
    console.error("Error creating subscription:", e);
    return res.status(500).json({ message: "Failed to create subscription", error: e.message });
  }
};


const getSubscriptionsByWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    const ws = await Workspace.findOne({
      _id: workspaceId,
      ownerId: req.userId,
    });

    if (!ws) return res.status(403).json({ message: "Not allowed" });

    const subscriptions = await Subscription.find({ workspaceId }).sort({
      name: 1,
    });

    return res.json(subscriptions);
  } catch (e) {
    console.error("Error fetching subscriptions:", e);
    return res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

const getSubscription = async (req, res) => {
  const id = req.params.id;

  try {
    const sub = await Subscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    // verify workspace access
    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res
        .status(403)
        .json({ message: "Not allowed to view subscription" });

    return res.json(sub);
  } catch (e) {
    console.error("Error retrieving subscription:", e);
    return res.status(500).json({ message: "Failed to fetch subscription" });
  }
};

const updateSubscription = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const sub = await Subscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    // verify workspace permission
    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res
        .status(403)
        .json({ message: "Not allowed to update subscription" });

    const newRenewalDate = data.nextRenewalDate
      ? new Date(data.nextRenewalDate)
      : sub.nextRenewalDate;

    // Check if renewal date changed (for removing outdated alerts)
    const renewalDateChanged = sub.nextRenewalDate?.getTime() !== newRenewalDate?.getTime();

    const updated = await Subscription.findByIdAndUpdate(
      id,
      {
        name: sanitizeInput(data.name),
        vendor: sanitizeInput(data.vendor),
        plan: sanitizeInput(data.plan),
        amount: Number(data.amount),
        currency: sanitizeInput(data.currency),
        period: data.period,
        nextRenewalDate: newRenewalDate,
        category: sanitizeInput(data.category),
        notes: sanitizeInput(data.notes),
        tags: Array.isArray(data.tags)
          ? data.tags.map(sanitizeInput)
          : sub.tags,
      },
      { new: true }
    );

    // Remove outdated renewal alerts if renewal date changed
    if (renewalDateChanged) {
      await alertService.removeOutdatedRenewalAlerts(id, newRenewalDate);
    }

    // Trigger alert checks after updating subscription (for immediate alerts)
    // Check both deadline alerts and budget alerts (since spending may have changed)
    setTimeout(() => {
      Promise.all([
        updated.nextRenewalDate ? alertService.checkDeadlineAlerts() : Promise.resolve(),
        alertService.removeBudgetAlertsIfBalanced(sub.workspaceId)
      ]).catch(err => 
        console.error("Error checking alerts after subscription update:", err)
      );
    }, 1000);

    return res.json({
      status: 200,
      message: "Subscription updated successfully",
      subscription: updated,
    });
  } catch (e) {
    console.error("Error updating subscription:", e);
    return res.status(500).json({ message: "Failed to update subscription" });
  }
};

const deleteSubscription = async (req, res) => {
  const id = req.params.id;

  try {
    const sub = await Subscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    // verify workspace ownership
    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res
        .status(403)
        .json({ message: "Not allowed to delete subscription" });

    const workspaceId = sub.workspaceId;
    await Subscription.findByIdAndDelete(id);

    // Trigger budget alert check after deleting subscription (spending changed)
    setTimeout(() => {
      alertService.removeBudgetAlertsIfBalanced(workspaceId).catch(err => 
        console.error("Error checking alerts after subscription deletion:", err)
      );
    }, 1000);

    return res.json({
      status: 200,
      message: "Subscription deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting subscription:", e);
    return res.status(500).json({ message: "Failed to delete subscription" });
  }
};

export default {
  createSubscription,
  getSubscriptionsByWorkspace,
  getSubscription,
  updateSubscription,
  deleteSubscription,
};
