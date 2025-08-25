import { Router } from "express";
import { getCart, addToCart, setCartQty, submit, approve, show } from "../../controllers/api/orders.js";
import ensureLoggedIn from "../../config/ensureLoggedIn.js";
import requireRoles from "../../config/requireRoles.js";

const router = Router();

// student cart
router.get("/cart", ensureLoggedIn, getCart);
router.post("/cart/items", ensureLoggedIn, addToCart);
router.put("/cart/items/:itemId", ensureLoggedIn, setCartQty);

// student submits with requestedDays
router.post("/submit", ensureLoggedIn, submit);

// admin decides return/keep + days
router.put("/:id/approve", ensureLoggedIn, requireRoles("admin"), approve);

// view an order
router.get("/:id", ensureLoggedIn, show);

export default router;
