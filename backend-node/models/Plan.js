import mongoose from "mongoose";
const { Schema } = mongoose;

const PlanSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    featuresJSON: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
