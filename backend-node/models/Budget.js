import mongoose from "mongoose";
const { Schema } = mongoose;

const BudgetSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
    },
    monthlyCap: { type: Number, required: true },
    alertThreshold: { // stored as percentage
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    }, 
  },
  { timestamps: true }
);

export default mongoose.model("Budget", BudgetSchema);
