// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    chucker: {
      type: Schema.Types.ObjectId,
      ref: "chuckers",
      required: true,
      index: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "services",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default model("cucker-services", elementSchema);
