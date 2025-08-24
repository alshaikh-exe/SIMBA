import mongoose from "mongoose";
import Location from "./models/location.js";

await mongoose.connect(process.env.MONGO_URI);

const seed = [
  { campus: "Campus A", building: "10", classroom: "20.124" },
  { campus: "Campus A", building: "24", classroom: "24.125" },
  { campus: "Campus B", building: "20",     classroom: "20.134" },
  { campus: "Campus B", building: "20",     classroom: "20.165" },
];

await Location.insertMany(seed);
console.log("Seeded locations");
await mongoose.disconnect();
