// module imports
import mongoose from "mongoose";

import { SERVICE_REQUEST_STATUS } from "../../configs/enum";
const { PENDING } = SERVICE_REQUEST_STATUS;

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;
const elementSchema = new Schema(
  {
    serviceRequest: {
      type: Schema.Types.ObjectId,
      ref: "service-order-requests",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
      index: true,
    },
    chucker: {
      type: Schema.Types.ObjectId,
      ref: "chuckers",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SERVICE_REQUEST_STATUS),
      default: PENDING,
      required: true,
    },
    isDeclined: {
      type: Boolean,
      default: false,
      select: false,
      required: true,
    },
  },

  { timestamps: true },
);

export default model("service-order-offers", elementSchema);
