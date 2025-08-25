import mongoose from "mongoose";
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "default.jpg",
    },

    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    returnPolicy: {
      type: String,
      enum: ["returnable", "nonreturnable"],
      default: "returnable",
    },

    deadline: {
      type: Number,
      default: 7,
      min: 1,
      max: 50,
    },

    // Stock management fields
    quantity: {
      type: Number,
      required: true,
      default: 0, // start with no stock unless set
      min: 0,
    },
    threshold: {
      type: Number,
      default: 5, // warn if below 5 by default
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);