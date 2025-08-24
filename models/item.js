import mongoose from "mongoose";
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    details: { 
        type: String, 
        required: true 
    },
    picture: { 
        type: String, 
        default: "default.jpg"
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
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
