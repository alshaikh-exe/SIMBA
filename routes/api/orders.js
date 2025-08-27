import { Router } from "express";
import {
  getCart,
  addToCart,
  setCartQty,
  submit,
  approve,
  show,
  setCartDates,
} from "../../controllers/api/orders.js";
import { setOrderDates, getUserCalendar, getAdminCalendar } from "../../controllers/api/calender.js";
import ensureLoggedIn from "../../config/ensureLoggedIn.js";
import requireRoles from "../../config/requireRoles.js";

const router = Router();

// ---------------- CART ROUTES ----------------
router.get("/cart", ensureLoggedIn, getCart);
router.post("/cart/items", ensureLoggedIn, addToCart);
router.put("/cart/items/:itemId", ensureLoggedIn, setCartQty);
router.post("/cart/set-dates", ensureLoggedIn, setCartDates); // moved ABOVE :id

// ---------------- ORDER ROUTES ----------------
router.post("/submit", ensureLoggedIn, submit);
router.post("/:orderId/set-dates", ensureLoggedIn, setOrderDates);
router.put("/:id/approve", ensureLoggedIn, requireRoles("admin"), approve);
router.get("/:id", ensureLoggedIn, show);

// ---------------- CALENDAR ROUTES ----------------
router.get("/calendar", ensureLoggedIn, getUserCalendar);
router.get(
  "/admin/calendar",
  ensureLoggedIn,
  requireRoles("admin"),
  getAdminCalendar
);

export default router;
