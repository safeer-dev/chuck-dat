// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    serviceOrder: {
      type: Schema.Types.ObjectId,
      ref: "service-orders",
    },
    feedback: { type: String },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
      index: true,
    },
    chucker: {
      type: Schema.Types.ObjectId,
      ref: "chuckers",
      index: true,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("feedbacks", elementSchema);
