// module imports
import mongoose from "mongoose";
import { EXTRA_CHARGES_REQUEST_STATUS } from "../../configs/enum";
const { PENDING } = EXTRA_CHARGES_REQUEST_STATUS;
// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const elementSchema = new Schema(
  {
    serviceOrder: {
      type: Schema.Types.ObjectId,
      ref: "service-orders",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: EXTRA_CHARGES_REQUEST_STATUS,
      default: PENDING,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("extra-charges-requests", elementSchema);
