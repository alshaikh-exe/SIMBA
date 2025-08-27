import express from "express";
import { index, show, create, update, destroy, lowStock, adjustQty} from "../../controllers/api/items.js";
import ensureLoggedIn from "../../config/ensureLoggedIn.js";

const router = express.Router();

// Public
router.get("/", index);
router.get("/:id", show);

// Protected
router.post("/", ensureLoggedIn, create);
router.put("/:id", ensureLoggedIn, update);
router.delete("/:id", ensureLoggedIn, destroy);

// Low stock check
router.get("/low-stock", ensureLoggedIn, lowStock);

router.patch("/:id/adjust-qty", ensureLoggedIn,adjustQty)

export default router;
