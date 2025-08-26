import mongoose from "mongoose";
const Schema = mongoose.Schema;

const semesterSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g. "2025-Spring"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Semester", semesterSchema);