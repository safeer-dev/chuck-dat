// module imports
import mongoose from "mongoose";

// variable initializations
const Schema = mongoose.Schema;
const model = mongoose.model;

const customersSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("customers", customersSchema);
