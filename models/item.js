import mongoose from 'mongoose';

const itemSchema = new Schema({
    
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model['Item', itemSchema];