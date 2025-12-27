import mongoose from "mongoose";
const { Schema } = mongoose;

const SubscriptionClientSchema = new Schema(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { timestamps: true }
);
 
// Prevent duplicate links between same sub and client
SubscriptionClientSchema.index(
  { subscriptionId: 1, clientId: 1 },
  { unique: true }
);

export default mongoose.model("SubscriptionClient", SubscriptionClientSchema);
