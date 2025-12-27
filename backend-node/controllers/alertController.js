import Alert from "../models/Alert.js";
import Subscription from "../models/Subscription.js";
import Workspace from "../models/Workspace.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import alertService from "../services/alertService.js";

const createAlert = async (req, res) => {
  const data = req.body;

  try {
    const sub = await Subscription.findById(data.subscriptionId);
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
        .json({ message: "Not allowed to create alert" });
    }

    const alert = await Alert.create({
      subscriptionId: data.subscriptionId,
      type: sanitizeInput(data.type), // renewal | budget | invoice-missing
      dueDate: new Date(data.dueDate),
      sentAt: data.sentAt ? new Date(data.sentAt) : null,
    });

    return res.json({
      status: 201,
      message: "Alert created successfully",
      alert,
    });
  } catch (e) {
    console.error("Error creating alert:", e);
    return res.status(500).json({ message: "Failed to create alert" });
  }
};

const getAlertsBySubscription = async (req, res) => {
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
        .json({ message: "Not allowed to view this alert" });
    }

    const alerts = await Alert.find({ subscriptionId }).sort({
      dueDate: 1,
    });

    return res.json(alerts);
  } catch (e) {
    console.error("Error fetching alerts:", e);
    return res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

const getAlertsByWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    // Verify workspace ownership
    const ws = await Workspace.findOne({
      _id: workspaceId,
      ownerId: req.userId,
    });
    if (!ws) {
      return res
        .status(403)
        .json({ message: "Not allowed to view alerts for this workspace" });
    }

    // Get all subscriptions for this workspace
    const subscriptions = await Subscription.find({ workspaceId });
    const subscriptionIds = subscriptions.map(sub => sub._id);

    // Get all alerts for subscriptions in this workspace
    const alerts = await Alert.find({
      subscriptionId: { $in: subscriptionIds }
    }).sort({
      dueDate: 1,
    });

    return res.json(alerts);
  } catch (e) {
    console.error("Error fetching alerts by workspace:", e);
    return res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

const getAlert = async (req, res) => {
  const id = req.params.id;

  try {
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const sub = await Subscription.findById(alert.subscriptionId);

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });
    if (!ws) {
      return res
        .status(403)
        .json({ message: "Not allowed to view this alert" });
    }

    return res.json(alert);
  } catch (e) {
    console.error("Error fetching alert:", e);
    return res.status(500).json({ message: "Failed to fetch alert" });
  }
};

const updateAlert = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const sub = await Subscription.findById(alert.subscriptionId);

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });
    if (!ws) {
      return res.status(403).json({ message: "Not allowed to update alert" });
    }

    const updated = await Alert.findByIdAndUpdate(
      id,
      {
        type: data.type || alert.type,
        dueDate: data.dueDate ? new Date(data.dueDate) : alert.dueDate,
        sentAt: data.sentAt ? new Date(data.sentAt) : alert.sentAt,
      },
      { new: true }
    );

    return res.json({
      status: 200,
      message: "Alert updated successfully",
      alert: updated,
    });
  } catch (e) {
    console.error("Error updating alert:", e);
    return res.status(500).json({ message: "Failed to update alert" });
  }
};

const deleteAlert = async (req, res) => {
  const id = req.params.id;

  try {
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const sub = await Subscription.findById(alert.subscriptionId);

    const ws = await Workspace.findOne({
      _id: sub.workspaceId,
      ownerId: req.userId,
    });
    if (!ws) {
      return res.status(403).json({ message: "Not allowed to delete alert" });
    }

    await Alert.findByIdAndDelete(id);

    return res.json({
      status: 200,
      message: "Alert deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting alert:", e);
    return res.status(500).json({ message: "Failed to delete alert" });
  }
};

const triggerAlertChecks = async (req, res) => {
  try {
    // Manually trigger alert checks (useful for testing or manual triggers)
    await alertService.runAlertChecks();
    
    return res.json({
      status: 200,
      message: "Alert checks triggered successfully",
    });
  } catch (e) {
    console.error("Error triggering alert checks:", e);
    return res.status(500).json({ message: "Failed to trigger alert checks" });
  }
};

export default {
  createAlert,
  getAlertsBySubscription,
  getAlertsByWorkspace,
  getAlert,
  updateAlert,
  deleteAlert,
  triggerAlertChecks,
};
