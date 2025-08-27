// app-server.js
import "dotenv/config.js"
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"

// API + auth glue
import userRoutes from "./routes/api/users.js"
import adminRoutes from "./routes/api/admin.js"
import roleRoutes from "./routes/api/roleRoutes.js"
import itemsRoutes from "./routes/api/items.js"
import ordersRoutes from "./routes/api/orders.js"
import checkToken from "./config/checkToken.js"
import ensureLoggedIn from "./config/ensureLoggedIn.js"
import managementRoutes from "./routes/api/management.js";
import analyticsRoutes from "./routes/api/analytics.js";
import locationRoutes from "./routes/api/locations.js";


const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  res.locals.data = {}
  next()
})

// ---------- API ROUTES ----------
// Public auth endpoints first (register/login live here)
app.use("/api/users", userRoutes)

// Protected routes (attach checkToken + ensureLoggedIn)
app.use("/api/admin", checkToken, ensureLoggedIn, adminRoutes)
app.use("/api/roles", checkToken, ensureLoggedIn, roleRoutes)
app.use("/api/items", checkToken, ensureLoggedIn, itemsRoutes)
app.use("/api/orders", checkToken, ensureLoggedIn, ordersRoutes)
app.use("/api/management", checkToken, ensureLoggedIn, managementRoutes);
app.use("/api/analytics", checkToken, ensureLoggedIn, analyticsRoutes);
app.use("/api/locations", checkToken, ensureLoggedIn, locationRoutes);

// ---------- STATIC / REACT ----------
const staticDir = process.env.NODE_ENV === "production" ? "dist" : "public"
const indexPath = process.env.NODE_ENV === "production" ? "dist/index.html" : "index.html"

app.use(express.static(staticDir))

// For React Router - serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" })
  }
  res.sendFile(path.resolve(path.join(__dirname, indexPath)))
})

export default app