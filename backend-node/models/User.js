import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    companyName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.index({ username: "text", name: "text" });

UserSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());

  if (doc) {
    await mongoose.model("Workspace").deleteMany({ userId: doc._id });
    await mongoose.model("UserPlan").deleteMany({ userId: doc._id });
  }

  next();
});

export default mongoose.model("User", UserSchema);
