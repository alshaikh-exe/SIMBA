import express from 'express';
import { checkToken, dataController, apiController } from '../../controllers/api/users.js';
import ensureLoggedIn from '../../config/ensureLoggedIn.js';

const router = express.Router();

// POST /api/admin
router.post('/admin', dataController.create, apiController.auth)
// POST /api/admin/login
router.post('/admin/login', dataController.login, apiController.auth)
// GET /api/admin/check-token
router.get('/admin/check-token', ensureLoggedIn, checkToken)

export default router;