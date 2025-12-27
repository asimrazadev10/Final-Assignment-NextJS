import UserPlan from "../models/UserPlan.js";
import User from "../models/User.js";
import Plan from "../models/Plan.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import stripeService from "../services/stripeService.js";
import { validationResult } from "express-validator";

// Create Stripe checkout session for plan selection
const createCheckoutSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array(),
      useMockPayment: true 
    });
  }

  const { planId } = req.body;
  const userId = req.userId; // From auth middleware

  try {
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log("Stripe not configured - returning mock payment option");
      // Fallback to mock payment for development
      return res.status(400).json({ 
        message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.",
        useMockPayment: true 
      });
    }

    // Create success and cancel URLs
    const baseUrl = process.env.CLIENT_ORIGIN || req.headers.origin || 'http://localhost:5173';
    const successUrl = `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&planId=${planId}`;
    const cancelUrl = `${baseUrl}/dashboard?canceled=true`;

    // Create Stripe checkout session
    console.log(`Creating Stripe checkout session for plan ${planId}, user ${userId}`);
    const result = await stripeService.createCheckoutSession(
      planId,
      plan,
      userId,
      user.email,
      successUrl,
      cancelUrl
    );

    if (!result.success) {
      console.error("Failed to create Stripe checkout session:", result.error);
      return res.status(500).json({ 
        message: "Failed to create checkout session",
        error: result.error 
      });
    }

    console.log(`Stripe checkout session created successfully: ${result.sessionId}`);

    return res.json({
      status: 200,
      message: "Checkout session created successfully",
      sessionId: result.sessionId,
      url: result.url,
      customerId: result.customerId,
    });
  } catch (e) {
    console.error("Error creating checkout session:", e);
    return res.status(500).json({ message: "Failed to create checkout session", error: e.message });
  }
};

// Handle successful payment and activate plan
const confirmPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array() 
    });
  }

  const { sessionId } = req.body;
  const userId = req.userId;

  try {
    // Retrieve checkout session from Stripe
    const sessionResult = await stripeService.getCheckoutSession(sessionId);
    
    if (!sessionResult.success) {
      return res.status(400).json({ message: "Invalid session", error: sessionResult.error });
    }

    const session = sessionResult.session;

    // Verify session belongs to this user
    if (session.metadata.userId !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const planId = session.metadata.planId;
    const stripeCustomerId = session.customer;
    const stripeSubId = session.subscription;

    // Find or create user plan
    let userPlan = await UserPlan.findOne({ userId });

    if (userPlan) {
      userPlan.planId = planId;
      userPlan.stripeCustomerId = stripeCustomerId;
      userPlan.stripeSubId = stripeSubId;
      userPlan.status = "active";
      await userPlan.save();
    } else {
      userPlan = await UserPlan.create({
        userId,
        planId,
        stripeCustomerId,
        stripeSubId,
        status: "active",
      });
    }

    // Populate plan details for response
    await userPlan.populate("planId", "name price featuresJSON");

    return res.json({
      status: 200,
      message: "Plan activated successfully",
      userPlan,
    });
  } catch (e) {
    console.error("Error confirming payment:", e);
    return res.status(500).json({ message: "Failed to confirm payment", error: e.message });
  }
};

// Simplified plan selection (without Stripe - for demo/mock payment)
const selectPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array() 
    });
  }

  const { planId } = req.body;
  const userId = req.userId; // From auth middleware

  try {
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // If user already has an entry, we update instead of creating a duplicate
    let userPlan = await UserPlan.findOne({ userId });

    // Mock payment - in production, this would integrate with Stripe/PayPal
    // For now, we'll create a mock customer ID
    const mockStripeCustomerId = `cus_mock_${userId}_${Date.now()}`;
    const mockStripeSubId = `sub_mock_${userId}_${Date.now()}`;

    if (userPlan) {
      userPlan.planId = planId;
      userPlan.stripeCustomerId = mockStripeCustomerId;
      userPlan.stripeSubId = mockStripeSubId;
      userPlan.status = "active";
      await userPlan.save();
    } else {
      userPlan = await UserPlan.create({
        userId,
        planId,
        stripeCustomerId: mockStripeCustomerId,
        stripeSubId: mockStripeSubId,
        status: "active",
      });
    }

    // Populate plan details for response
    await userPlan.populate("planId", "name price featuresJSON");

    return res.json({
      status: 201,
      message: "Plan selected successfully",
      userPlan,
    });
  } catch (e) {
    console.error("Error selecting plan:", e);
    return res.status(500).json({ message: "Failed to select plan" });
  }
};

const assignPlanToUser = async (req, res) => {
  const data = req.body;

  try {
    const user = await User.findById(data.userId);
    const plan = await Plan.findById(data.planId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // If user already has an entry (even canceled), we update instead of creating a duplicate
    let userPlan = await UserPlan.findOne({ userId: data.userId });

    if (userPlan) {
      userPlan.planId = data.planId;
      userPlan.stripeCustomerId = sanitizeInput(data.stripeCustomerId);
      userPlan.stripeSubId = sanitizeInput(data.stripeSubId);
      userPlan.status = sanitizeInput(data.status || "active");
      await userPlan.save();
    } else {
      userPlan = await UserPlan.create({
        userId: data.userId,
        planId: data.planId,
        stripeCustomerId: sanitizeInput(data.stripeCustomerId),
        stripeSubId: sanitizeInput(data.stripeSubId),
        status: sanitizeInput(data.status || "active"),
      });
    }

    return res.json({
      status: 201,
      message: "User plan assigned successfully",
      userPlan,
    });
  } catch (e) {
    console.error("Error assigning plan:", e);
    return res.status(500).json({ message: "Failed to assign plan" });
  }
};

const getUserPlan = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userPlan = await UserPlan.findOne({ userId }).populate(
      "planId",
      "name price featuresJSON"
    );

    if (!userPlan) {
      return res.status(404).json({ message: "User plan not found" });
    }

    return res.json(userPlan);
  } catch (e) {
    console.error("Error retrieving user plan:", e);
    return res.status(500).json({ message: "Failed to fetch user plan" });
  }
};

const updateUserPlan = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const userPlan = await UserPlan.findById(id);
    if (!userPlan)
      return res.status(404).json({ message: "UserPlan entry not found" });

    const updated = await UserPlan.findByIdAndUpdate(
      id,
      {
        planId: data.planId || userPlan.planId,
        stripeCustomerId:
          sanitizeInput(data.stripeCustomerId) || userPlan.stripeCustomerId,
        stripeSubId: sanitizeInput(data.stripeSubId) || userPlan.stripeSubId,
        status: sanitizeInput(data.status) || userPlan.status,
      },
      { new: true }
    );

    return res.json({
      status: 200,
      message: "User plan updated successfully",
      userPlan: updated,
    });
  } catch (e) {
    console.error("Error updating user plan:", e);
    return res.status(500).json({ message: "Failed to update user plan" });
  }
};

const cancelUserPlan = async (req, res) => {
  const id = req.params.id;

  try {
    const userPlan = await UserPlan.findById(id);
    if (!userPlan)
      return res.status(404).json({ message: "UserPlan entry not found" });

    userPlan.status = "canceled";
    await userPlan.save();

    return res.json({
      status: 200,
      message: "User subscription canceled",
      userPlan,
    });
  } catch (e) {
    console.error("Error canceling user plan:", e);
    return res.status(500).json({ message: "Failed to cancel user plan" });
  }
};

const deleteUserPlan = async (req, res) => {
  const id = req.params.id;

  try {
    const userPlan = await UserPlan.findById(id);
    if (!userPlan)
      return res.status(404).json({ message: "UserPlan entry not found" });

    await UserPlan.findByIdAndDelete(id);

    return res.json({
      status: 200,
      message: "User plan deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting user plan:", e);
    return res.status(500).json({ message: "Failed to delete user plan" });
  }
};

const getMyPlan = async (req, res) => {
  const userId = req.userId; // From auth middleware

  try {
    const userPlan = await UserPlan.findOne({ userId }).populate(
      "planId",
      "name price featuresJSON"
    );

    if (!userPlan) {
      return res.json({ userPlan: null, message: "No plan assigned" });
    }

    return res.json(userPlan);
  } catch (e) {
    console.error("Error retrieving user plan:", e);
    return res.status(500).json({ message: "Failed to fetch user plan" });
  }
};

export default {
  assignPlanToUser,
  selectPlan,
  createCheckoutSession,
  confirmPayment,
  getMyPlan,
  getUserPlan,
  updateUserPlan,
  cancelUserPlan,
  deleteUserPlan,
};
