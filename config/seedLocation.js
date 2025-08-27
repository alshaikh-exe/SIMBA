// seedLocations.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "./models/location.js";

dotenv.config(); // make sure .env is loaded

const seed = [
  { campus: "Campus A", building: "10", classroom: "20.124" },
  { campus: "Campus A", building: "24", classroom: "24.125" },
  { campus: "Campus B", building: "20", classroom: "20.134" },
  { campus: "Campus B", building: "20", classroom: "20.165" },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const loc of seed) {
      await Location.findOneAndUpdate(
        { campus: loc.campus, building: loc.building, classroom: loc.classroom },
        loc,
        { upsert: true, new: true }
      );
    }

    console.log("✅ Locations seeded (safe against duplicates)");
  } catch (err) {
    console.error("❌ Error seeding locations:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
