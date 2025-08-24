import mongoose from "mongoose";
const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    campus: { 
        type: String, 
        enum: ["Campus A", "Campus B"], 
        required: true 
    },
    building: { 
        type: String, 
        required: true, 
        trim: true }, 
    classroom: { 
        type: String, 
        required: true, 
        trim: true 
    },
  },
  { timestamps: true }
);

locationSchema.index({ campus: 1, building: 1, classroom: 1 }, { unique: true });

export default mongoose.model("Location", locationSchema);
