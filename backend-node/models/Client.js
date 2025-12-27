import mongoose from "mongoose";
const { Schema } = mongoose;

const ClientSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, required: true },
    contact: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);
