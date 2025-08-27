// controllers/api/locations.js
import Location from "../../models/location.js";

// GET /api/locations
export async function index(req, res) {
  try {
    const locations = await Location.find().sort({ campus: 1, building: 1, classroom: 1 });
    res.status(200).json({ success: true, data: locations });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch locations" });
  }
}

// POST /api/locations (admin only)
export async function create(req, res) {
  try {
    const { campus, building, classroom } = req.body;
    if (!campus || !building || !classroom) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const loc = await Location.findOneAndUpdate(
      { campus, building, classroom },
      { $setOnInsert: { campus, building, classroom } },
      { new: true, upsert: true }
    );
    res.status(201).json({ success: true, data: loc });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create location" });
  }
}