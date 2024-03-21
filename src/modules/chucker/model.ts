// module imports
import mongoose from "mongoose";

// variable initializations
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
  },
  {
    timestamps: true,
  },
);

export default model("chuckers", serviceProviderSchema);
