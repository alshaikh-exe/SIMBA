// routes/api/management.js
import express from "express";
import { requestStock } from "../../controllers/api/management.js";

const router = express.Router();
router.post("/request-stock", requestStock);

export default router;