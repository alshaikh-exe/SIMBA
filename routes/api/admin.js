import express from 'express';
import { checkToken, dataController, apiController } from '../../controllers/api/users.js';
import ensureLoggedIn from '../../config/ensureLoggedIn.js';
import User from '../../models/user.js'; // make sure this is at the top

const router = express.Router();

// POST /api/admin
router.post('/admin', dataController.create, apiController.auth);

// POST /api/admin/login
router.post('/admin/login', dataController.login, apiController.auth);

// GET /api/admin/check-token
router.get('/admin/check-token', ensureLoggedIn, checkToken);

// ------------------ NEW: Admin profile & availability ------------------

// All routes below require admin to be logged in
router.use(ensureLoggedIn);

// GET /api/admin/profile -> fetch current admin profile including availability
router.get('/profile', dataController.getProfile, apiController.sendAdminProfile);

// PATCH /api/admin -> update availability
router.patch('/', dataController.updateAvailability, apiController.sendAdminProfile);

export default router;