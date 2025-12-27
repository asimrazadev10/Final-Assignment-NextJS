import Budget from "../models/Budget.js";
import Workspace from "../models/Workspace.js";
import alertService from "../services/alertService.js";

import { validationResult } from "express-validator";

const createBudget = async (req, res) => {
  const data = req.body;

  try {
    // Verify workspace ownership
    const ws = await Workspace.findOne({
      _id: data.workspaceId,
      ownerId: req.userId,
    });

    if (!ws) {
      return res.status(403).json({ message: "Not allowed to access workspace" });
    }

    const budget = await Budget.create({
      workspaceId: data.workspaceId,
      monthlyCap: Number(data.monthlyCap),
      alertThreshold: Number(data.alertThreshold),
    });

    return res.json({
      status: 201,
      message: "Budget created successfully",
      budget,
    });
  } catch (e) {
    console.error("Error creating budget:", e);
    return res.status(500).json({ message: "Failed to create budget" });
  }
};

const getBudgetByWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    const ws = await Workspace.findOne({
      _id: workspaceId,
      ownerId: req.userId,
    });

    if (!ws) return res.status(403).json({ message: "Not allowed" });

    const budget = await Budget.findOne({ workspaceId });

    if (!budget)
      return res.status(404).json({ message: "Budget not set for workspace" });

    return res.json(budget);
  } catch (e) {
    console.error("Error fetching budget:", e);
    return res.status(500).json({ message: "Failed to fetch budget" });
  }
};

const updateBudget = async (req, res) => {
  const budgetId = req.params.id;
  const data = req.body;
  const resData = {};

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resData.message = "Validation failed";
    resData.errors = errors.array();
    return res.json(resData);
  }

  try {
    // Ensure user owns the workspace of this budget
    const budget = await Budget.findById(budgetId);
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const ws = await Workspace.findOne({
      _id: budget.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to update budget" });

    const updated = await Budget.findByIdAndUpdate(
      budgetId,
      {
        monthlyCap: Number(data.monthlyCap),
        alertThreshold: Number(data.alertThreshold),
      },
      { new: true }
    );

    // After budget update, check if alerts should be removed (budget balanced or increased)
    await alertService.removeBudgetAlertsIfBalanced(budget.workspaceId);

    resData.status = 200;
    resData.message = "Budget updated successfully";
    resData.budget = updated;
    return res.json(resData);
  } catch (e) {
    console.error("Error updating budget:", e);
    return res.status(500).json({ message: "Failed to update budget" });
  }
};

const deleteBudget = async (req, res) => {
  const budgetId = req.params.id;

  try {
    const budget = await Budget.findById(budgetId);
    if (!budget)
      return res.status(404).json({ message: "Budget not found" });

    const ws = await Workspace.findOne({
      _id: budget.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to delete budget" });

    await Budget.findByIdAndDelete(budgetId);

    return res.json({
      status: 200,
      message: "Budget deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting budget:", e);
    return res.status(500).json({ message: "Failed to delete budget" });
  }
};

export default {
  getBudgetByWorkspace,
  updateBudget,
};
