// module imports
import mongoose from "mongoose";

import {
  SERVICE_ORDER_STATUS,
  EXTRA_CHARGES_REQUEST_STATUS,
} from "../../configs/enum";
const { PENDING } = SERVICE_ORDER_STATUS;

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
    lotSize: {
      type: String,
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
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    notes: { type: String, required: true },
    extraCharges: {
      type: Number,
      default: 0,
    },
    extraChargesRequested: {
      type: Boolean,
      default: false,
    },
    extraChargesStatus: {
      type: String,
      enum: Object.values(EXTRA_CHARGES_REQUEST_STATUS),
      required: true,
    },
    totalPayment: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(SERVICE_ORDER_STATUS),
      default: PENDING,
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
