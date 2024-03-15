// module imports
import mongoose from "mongoose";

import { SERVICE_ORDER_STATUS, EXTRA_CHARGES_REQUEST_STATUS } from "../../configs/enum";
const { CONFIRMED } = SERVICE_ORDER_STATUS;

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
    subServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "sub-services",
        index: true,
      },
    ],
    location: {
      type: Schema.Types.ObjectId,
      ref: "locations",

      index: true,
    },
    extraChargesRequested: {
      type: Boolean,
      default: false,
    },
    extraChargesStatus: {
      type: String,
      enum: Object.values(EXTRA_CHARGES_REQUEST_STATUS),
    },
    totalPayment: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(SERVICE_ORDER_STATUS),
      default: CONFIRMED,
      required: true,
    },
    mediaBeforeWork: [
      {
        type: String,
      },
    ],
    mediaAfterWork: [{ type: String }],
  },
  { timestamps: true },
);

export default model("service-orders", elementSchema);
