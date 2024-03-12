// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    charges: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("services", elementSchema);
