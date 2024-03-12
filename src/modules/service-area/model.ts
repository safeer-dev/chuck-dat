// module imports
import mongoose from "mongoose";
import { GEO_JSON_TYPES } from "../../configs/enum";
const { POINT } = GEO_JSON_TYPES;
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
    zipCodes: [{ type: Number }],
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
      radius: { type: Number },
    },
  },
  { timestamps: true },
);

export default model("service-areas", elementSchema);
