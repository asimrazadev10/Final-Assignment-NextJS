import mongoose from "mongoose";
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    fileUrl: { type: String },
    amount: { type: Number, required: true },
    invoiceDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "void"],
      default: "pending",
    },
    source: {
      type: String,
      enum: ["email", "upload", "api"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", InvoiceSchema);
