// module imports
import mongoose, { Types } from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "services",
      required: true,
      index: true,
    },
    name: { type: String },
    charges: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("sub-services", elementSchema);
