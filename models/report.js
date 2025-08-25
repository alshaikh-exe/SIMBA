import mongoose from 'mongoose';
const { Schema } = mongoose;

const reportSchema = new Schema({
    approvedOrders: [
        { type: Schema.Types.ObjectId, ref: "Order" }
    ],
    outOfStockItems: [
        { type: Schema.Types.ObjectId, ref: "Item" }
    ],
    analysis: { type: String},
    semesterStart: { type: Date, required: true },
    semesterEnd: { type: Date, required: true },
}, {
    timestamps: true,
});

export default mongoose.model('Report', reportSchema);