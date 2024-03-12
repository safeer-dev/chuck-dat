// module imports
import mongoose from "mongoose";

import { GEO_JSON_TYPES } from "../../configs/enum";
const { POINT } = GEO_JSON_TYPES;
// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    srtreet: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: Number },
    location: {
      type: {
        type: String,
        enum: Object.values(GEO_JSON_TYPES),
        default: POINT,
        required: true,
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
        required: true,
      },
    },
  },
  { timestamps: true },
);

export default model("locations", elementSchema);
