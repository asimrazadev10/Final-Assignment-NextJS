import Client from "../models/Client.js";
import Workspace from "../models/Workspace.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import isAlphabetOnly from "../utils/isAlphabetOnly.js";
import { validationResult } from "express-validator";

const createClient = async (req, res) => {
  const data = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ message: "Validation failed", errors: errors.array() });
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

    let name_get = sanitizeInput(data.name);
    if (isAlphabetOnly(name_get) === 0) {
      return res
        .status(400)
        .json({ message: "Name invalid: Only characters are allowed" });
    }

    const client = await Client.create({
      workspaceId: data.workspaceId,
      name: name_get,
      contact: sanitizeInput(data.contact),
      notes: sanitizeInput(data.notes),
    });

    return res.json({
      status: 201,
      message: "Client created successfully",
      client,
    });
  } catch (e) {
    console.error("Error creating client:", e);
    return res.status(500).json({ message: "Failed to create client" });
  }
};

const getClientsByWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    const ws = await Workspace.findOne({
      _id: workspaceId,
      ownerId: req.userId,
    });

    if (!ws) return res.status(403).json({ message: "Not allowed" });

    const clients = await Client.find({ workspaceId }).sort({ name: 1 });

    return res.json(clients);
  } catch (e) {
    console.error("Error fetching clients:", e);
    return res.status(500).json({ message: "Failed to fetch clients" });
  }
};

const getClient = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    // check workspace access
    const ws = await Workspace.findOne({
      _id: client.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to view client" });

    return res.json(client);
  } catch (e) {
    console.error("Error fetching client:", e);
    return res.status(500).json({ message: "Failed to fetch client" });
  }
};

const updateClient = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    // verify workspace
    const ws = await Workspace.findOne({
      _id: client.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to update client" });

    const updated = await Client.findByIdAndUpdate(
      id,
      {
        name: sanitizeInput(data.name),
        contact: sanitizeInput(data.contact),
        notes: sanitizeInput(data.notes),
      },
      { new: true }
    );

    return res.json({
      status: 200,
      message: "Client updated successfully",
      client: updated,
    });
  } catch (e) {
    console.error("Error updating client:", e);
    return res.status(500).json({ message: "Failed to update client" });
  }
};

const deleteClient = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const ws = await Workspace.findOne({
      _id: client.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to delete client" });

    await Client.findByIdAndDelete(id);

    return res.json({
      status: 200,
      message: "Client deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting client:", e);
    return res.status(500).json({ message: "Failed to delete client" });
  }
};

export default {
  createClient,
  getClientsByWorkspace,
  getClient,
  updateClient,
  deleteClient,
};
