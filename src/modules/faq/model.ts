// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  { question: { type: String }, answer: { type: String } },
  { timestamps: true },
);

export default model("faqs", elementSchema);
