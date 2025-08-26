// routes/api/locations.js
import express from "express";
import * as locationsCtrl from "../../controllers/api/locations.js";
import ensureLoggedIn from "../../config/ensureLoggedIn.js";

const router = express.Router();

router.get("/", ensureLoggedIn, locationsCtrl.index);   // list all locations
router.post("/", ensureLoggedIn, locationsCtrl.create); // add new location

export default router;