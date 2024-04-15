// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    chucker: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    serviceOrder: {
      type: Schema.Types.ObjectId,
      ref: "service-orders",
      required: true,
      index: true,
    },
    report: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default model("chucker-reports", elementSchema);
