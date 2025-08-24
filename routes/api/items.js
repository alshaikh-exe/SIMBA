
import { Router } from "express";
import { index, show, create, update, destroy } from "../../controllers/api/items.js";
import ensureLoggedIn from "../../config/ensureLoggedIn.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.post("/",ensureLoggedIn,  create);
router.put("/:id", ensureLoggedIn,  update);
router.delete("/:id", ensureLoggedIn, destroy);

export default router;
