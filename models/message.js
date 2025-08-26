import mongoose from 'mongoose'
const { Schema } = mongoose

const messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  type: { 
    type: String, 
    enum: ['alert', 'confirmation', 'query', 'content'], 
    required: true 
  },
  message: {type: String, required: true }
}, {
  timestamps: true,
});
export default mongoose.model('Message', messageSchema);