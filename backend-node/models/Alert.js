import mongoose from "mongoose";
const { Schema } = mongoose;

const AlertSchema = new Schema(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    type: {
      type: String,
      enum: ["renewal", "budget", "invoice-missing"],
      required: true,
    },
    dueDate: { type: Date },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", AlertSchema);
