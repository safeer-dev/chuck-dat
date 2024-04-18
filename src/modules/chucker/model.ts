// module imports
import mongoose from "mongoose";
import { GEO_JSON_TYPES } from "../../configs/enum";

// variable initializations
const { POINT } = GEO_JSON_TYPES;

const Schema = mongoose.Schema;
const model = mongoose.model;

const serviceProviderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    faceImage: {
      type: String,
      // required: true,
      select: false,
    },
    equipmentMedia: [
      {
        type: String,
        // required: true,
      },
    ],
    drivingLicense: {
      type: String,
      // required: true,
      select: false,
    },
    idCard: {
      type: String,
      select: false,
      // required: true,
    },
    isProfileVerified: {
      type: Boolean,
      default: false,
      select: false,
      // required: true,
    },
    serviceZipCodes: [
      {
        type: String,
        trim: true,
      },
    ],
    serviceRadius: {
      type: Number,
    },
    servicelocation: {
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
  {
    timestamps: true,
  },
);

export default model("chuckers", serviceProviderSchema);
