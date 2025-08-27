// routes/api/orders.js (merged)

import { Router } from "express";
import {
  getCart,
  addToCart,
  setCartQty,
  submit,
  approve,
  show,
  setCartDates,
  index,
} from "../../controllers/api/orders.js";
import {
  setOrderDates,
  getUserCalendar,
  getAdminCalendar,
} from "../../controllers/api/calender.js"; // note: 'calender' as in your original path
import ensureLoggedIn from "../../config/ensureLoggedIn.js";
import requireRoles from "../../config/requireRoles.js";

const router = Router();

/* ---------------- CART ROUTES ---------------- */
router.get("/cart", ensureLoggedIn, getCart);
router.post("/cart/items", ensureLoggedIn, addToCart);
router.put("/cart/items/:itemId", ensureLoggedIn, setCartQty);
// keep this above any `/:id` routes to avoid shadowing
router.post("/cart/set-dates", ensureLoggedIn, setCartDates);

/* ---------------- ORDER LIST ROUTES ----------------
   - GET /api/orders               -> students: my orders; admins: all (optional ?scope=requested)
   - GET /api/orders/admin         -> admins: all (optional ?scope=requested)
--------------------------------------------------- */
router.get("/", ensureLoggedIn, index);
router.get("/admin", ensureLoggedIn, requireRoles("admin"), index);

/* ---------------- CALENDAR ROUTES ----------------
   IMPORTANT: These MUST come BEFORE '/:id' or they will be shadowed.
--------------------------------------------------- */
router.get("/calendar", ensureLoggedIn, getUserCalendar);
router.get("/admin/calendar", ensureLoggedIn, requireRoles("admin"), getAdminCalendar);

/* ---------------- MUTATION ROUTES ---------------- */
router.post("/submit", ensureLoggedIn, submit);
router.post("/:orderId/set-dates", ensureLoggedIn, setOrderDates);
router.put("/:id/approve", ensureLoggedIn, requireRoles("admin"), approve);

/* ---------------- SHOW ROUTE (keep last) -------- */
router.get("/:id", ensureLoggedIn, show);

export default router;
