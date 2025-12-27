import SubscriptionClient from "../models/SubscriptionClient.js";
import Subscription from "../models/Subscription.js";
import Client from "../models/Client.js";
import Workspace from "../models/Workspace.js";

const linkClientToSubscription = async (req, res) => {
  const data = req.body;

  try {
    const subscription = await Subscription.findById(data.subscriptionId);
    const client = await Client.findById(data.clientId);

    if (!subscription || !client) {
      return res
        .status(404)
        .json({ message: "Subscription or Client not found" });
    }

    // Verify workspace ownership
    const ws = await Workspace.findOne({
      _id: subscription.workspaceId,
      ownerId: req.userId,
    });

    if (!ws) {
      return res
        .status(403)
        .json({ message: "Not allowed to link client to subscription" });
    }

    // Prevent duplicates
    const existing = await SubscriptionClient.findOne({
      subscriptionId: data.subscriptionId,
      clientId: data.clientId,
    });

    if (existing) {
      return res.json({
        status: 200,
        message: "Client already linked to subscription",
        link: existing,
      });
    }

    const link = await SubscriptionClient.create({
      subscriptionId: data.subscriptionId,
      clientId: data.clientId,
    });

    return res.json({
      status: 201,
      message: "Client linked to subscription successfully",
      link,
    });
  } catch (e) {
    console.error("Error linking client to subscription:", e);
    return res.status(500).json({ message: "Failed to link client" });
  }
};

const getClientsForSubscription = async (req, res) => {
  const subscriptionId = req.params.subscriptionId;

  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    const ws = await Workspace.findOne({
      _id: subscription.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res
        .status(403)
        .json({ message: "Not allowed to view clients for subscription" });

    const links = await SubscriptionClient.find({ subscriptionId }).populate(
      "clientId",
      "name contact notes"
    );

    return res.json(links);
  } catch (e) {
    console.error("Error retrieving subscription clients:", e);
    return res.status(500).json({ message: "Failed to retrieve clients" });
  }
};

const getSubscriptionsForClient = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const ws = await Workspace.findOne({
      _id: client.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res
        .status(403)
        .json({ message: "Not allowed to view subscriptions for client" });

    const links = await SubscriptionClient.find({ clientId }).populate(
      "subscriptionId",
      "name vendor amount nextRenewalDate"
    );

    return res.json(links);
  } catch (e) {
    console.error("Error fetching subscriptions for client:", e);
    return res
      .status(500)
      .json({ message: "Failed to retrieve subscriptions" });
  }
};

const unlinkClientFromSubscription = async (req, res) => {
  const data = req.body;

  try {
    const link = await SubscriptionClient.findOne({
      subscriptionId: data.subscriptionId,
      clientId: data.clientId,
    });

    if (!link) return res.status(404).json({ message: "Link not found" });

    const subscription = await Subscription.findById(link.subscriptionId);

    const ws = await Workspace.findOne({
      _id: subscription.workspaceId,
      ownerId: req.userId,
    });

    if (!ws)
      return res.status(403).json({ message: "Not allowed to remove link" });

    await SubscriptionClient.findByIdAndDelete(link._id);

    return res.json({
      status: 200,
      message: "Client unlinked from subscription",
    });
  } catch (e) {
    console.error("Error unlinking client from subscription:", e);
    return res.status(500).json({ message: "Failed to unlink client" });
  }
};

export default {
  linkClientToSubscription,
  getClientsForSubscription,
  getSubscriptionsForClient,
  unlinkClientFromSubscription,
};
