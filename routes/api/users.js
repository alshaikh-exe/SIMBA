import express from 'express';
import { checkToken, dataController, apiController } from '../../controllers/api/users.js';
import ensureLoggedIn from '../../config/ensureLoggedIn.js';

const router = express.Router();

// POST /api/users
router.post('/', dataController.create, apiController.auth)
// POST /api/users/login
router.post('/login', dataController.login, apiController.auth)
// GET /api/users/check-token
router.get('/check-token', ensureLoggedIn, checkToken)

export default router;