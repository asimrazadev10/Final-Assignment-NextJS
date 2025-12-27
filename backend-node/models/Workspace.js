import mongoose from "mongoose";
const { Schema } = mongoose;

const WorkspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

WorkspaceSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());

  if (doc) {
    await mongoose.model("Subscription").deleteMany({ workspaceId: doc._id });
    await mongoose.model("Budget").deleteMany({ workspaceId: doc._id });
    await mongoose.model("Client").deleteMany({ workspaceId: doc._id });
  }

  next();
});

export default mongoose.model("Workspace", WorkspaceSchema);
