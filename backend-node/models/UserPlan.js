import mongoose from "mongoose";
const { Schema } = mongoose;

const UserPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One active plan per user
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    stripeCustomerId: { type: String, required: true },
    stripeSubId: { type: String },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "incomplete"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserPlan", UserPlanSchema);
