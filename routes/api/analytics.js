import express from "express";
import ensureLoggedIn from "../../config/ensureLoggedIn.js";
import * as analyticsCtrl from "../../controllers/api/analytics.js";

const router = express.Router();

// GET /api/analytics/usage
router.get("/usage", ensureLoggedIn, analyticsCtrl.usageBySemester);

export default router;