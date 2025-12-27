import Workspace from "../models/Workspace.js";
import Budget from "../models/Budget.js";
import Subscription from "../models/Subscription.js";
import Client from "../models/Client.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

const createWorkspace = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  const data = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const wsArray = await Workspace.create(
      [
        {
          name: sanitizeInput(data.name),
          ownerId: req.userId,
        }
      ],
      { session }
    );
    
    const ws = wsArray[0];

    // Every workspace needs a budget to function
    // Use provided monthlyCap or default to 100 (not 1000)
    const monthlyCap = (data.monthlyCap && data.monthlyCap !== "" && !isNaN(data.monthlyCap)) 
      ? Number(data.monthlyCap) 
      : 100;
    
    await Budget.create(
      [
        {
          workspaceId: ws._id,
          monthlyCap: monthlyCap,
          alertThreshold: 80,
        }
      ],
      { session }
    );

    await session.commitTransaction();
    
    return res.json({
      status: 201,
      message: "Workspace created successfully",
      workspace: ws,
    });
  } catch (e) {
    await session.abortTransaction();
    console.error("Error creating workspace:", e);
    return res.status(500).json({ 
      message: "Failed to create workspace",
      error: e.message 
    });
  } finally {
    session.endSession();
  }
};


const getMyWorkspaces = async (req, res) => {
  const userId = req.userId;

  const workspaces = await Workspace.find({ ownerId: userId }).sort({
    createdAt: -1,
  });

  return res.json(workspaces);
};

const getWorkspace = async (req, res) => {
  const id = req.params.workspaceId || req.params.id;

  const ws = await Workspace.findById(id);
  if (!ws) return res.status(404).json({ message: "Workspace not found" });

  const isOwner = ws.ownerId.toString() === req.userId;
  return res.json({ workspace: ws, isOwner });
};

const updateWorkspace = async (req, res) => {
  const id = req.params.workspaceId || req.params.id;
  const data = req.body;

  try {
    console.log("Updating workspace:", { id, userId: req.userId, name: data.name });
    
    // First verify the workspace exists and user owns it
    const existingWs = await Workspace.findOne({ _id: id, ownerId: req.userId });
    if (!existingWs) {
      console.log("Workspace not found or user doesn't own it:", { id, userId: req.userId });
      return res.status(403).json({ message: "Not allowed or not found" });
    }

    const ws = await Workspace.findOneAndUpdate(
      { _id: id, ownerId: req.userId },
      { name: sanitizeInput(data.name) },
      { new: true }
    );

    if (!ws) {
      return res.status(403).json({ message: "Not allowed or not found" });
    }

    return res.json({
      status: 200,
      message: "Workspace updated successfully",
      workspace: ws,
    });
  } catch (e) {
    console.error("Error updating workspace:", e);
    return res.status(500).json({ message: "Failed to update workspace", error: e.message });
  }
};

const deleteWorkspace = async (req, res) => {
  const id = req.params.workspaceId || req.params.id;

  try {
    console.log("Deleting workspace:", { id, userId: req.userId });
    
    // First verify the workspace exists and user owns it
    const existingWs = await Workspace.findOne({ _id: id, ownerId: req.userId });
    if (!existingWs) {
      console.log("Workspace not found or user doesn't own it:", { id, userId: req.userId });
      return res.status(403).json({ message: "Not allowed or not found" });
    }

    // Delete all related data first (subscriptions will cascade delete their related data via pre-hooks)
    // Delete subscriptions (this will also delete invoices, alerts, subscriptionClients via pre-hooks)
    await Subscription.deleteMany({ workspaceId: id });
    
    // Delete clients
    await Client.deleteMany({ workspaceId: id });
    
    // Delete budget
    await Budget.deleteMany({ workspaceId: id });
    
    // Finally delete the workspace
    const ws = await Workspace.findOneAndDelete({
      _id: id,
      ownerId: req.userId,
    });

    if (!ws) {
      return res.status(403).json({ message: "Not allowed or not found" });
    }

    console.log("Workspace deleted successfully:", id);
    return res.json({
      status: 200,
      message: "Workspace deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting workspace:", e);
    console.error("Error stack:", e.stack);
    return res.status(500).json({ message: "Failed to delete workspace", error: e.message });
  }
};

export default {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
