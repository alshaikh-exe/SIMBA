import "dotenv/config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";// Middleware
import checkToken from "./config/checkToken.js";// API routes
import userRoutes from "./routes/api/users.js";
import adminRoutes from "./routes/api/admin.js";
import roleRoutes from "./routes/api/roleRoutes.js";
import itemsRoutes from "./routes/api/items.js";
import ordersRoutes from "./routes/api/orders.js";const app = express();const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);// Core middleware
app.use(cors());
app.use(express.json());// Attach req.user if a JWT is present (must be before routes)
app.use(checkToken);// Optional per-request stash
app.use((req, res, next) => {
  res.locals.data = {};
  next();
});// ---------- API ROUTES ----------
app.use("/api/users", userRoutes);
app.use("/api/users", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/orders", ordersRoutes);// ---------- STATIC / REACT ----------
const staticDir = process.env.NODE_ENV === "production" ? "dist" : "public";
const indexPath = process.env.NODE_ENV === "production" ? "dist/index.html" : "index.html";app.use(express.static(staticDir));// Health check (handy for deployment)
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));// Unknown API endpoints (after all API routers)
app.all("/api/*", (_req, res) => res.status(404).json({ error: "API endpoint not found" }));// Send React for everything else
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, indexPath)));
});// ---------- ERROR HANDLER ----------
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Server error" });
});export default app;