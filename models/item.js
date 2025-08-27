import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    details: { 
      type: String, 
      required: true, 
      
    },

    image: { 
      type: String, 
      default:"default.jpg"
    },

    values: { 
      type: String,
      default: undefined 
    },

    location: { 
      type: Schema.Types.ObjectId, 
      ref: "Location", 
      required: true 
    },

    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    status: {
      type: String,
      enum: ["available", "reserved", "maintenance", "out of order", "repair", "out of stock"],
      default: "available",
      index: true,
    },

    category: { 
      type: String, 
      enum: ["electronics", "3d printing", "machining", "testing", "measurement", "fabrication", "assembly", "safety", "general"],
      trim: true, 
      index: true,
      default:"electronics"
    },

    maintenanceSchedule: { 
      type: String, 
      trim: true 
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
      max: 70 
    },

    quantity: { 
      type: Number, 
      required: true, 
      default: 0, 
      min: 0 
    },

    threshold: { 
      type: Number, 
      default: 5, 
      min: 0 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);