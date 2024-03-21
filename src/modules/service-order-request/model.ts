// module imports
import mongoose from "mongoose";

import { SERVICE_REQUEST_STATUS } from "../../configs/enum";
const { PENDING } = SERVICE_REQUEST_STATUS;

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
    decliners: [
      {
        type: Schema.Types.ObjectId,
        ref: "chuckers",

        index: true,
      },
    ],
    lotSize: {
      type: String,
    },
    notes: { type: String, required: true },
    subServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "sub-services",
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

    status: {
      type: String,
      enum: Object.values(SERVICE_REQUEST_STATUS),
      default: PENDING,
      required: true,
    },
    isAssigned: {
      type: Boolean,
      default: false,
      select: false,
      required: true,
    },
  },

  { timestamps: true },
);

export default model("service-order-requests", elementSchema);
