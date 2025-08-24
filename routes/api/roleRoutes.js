import express from 'express';
import ensureLoggedIn from '../../config/ensureLoggedIn.js';
import requireRole from '../../config/requireRole.js';

const router = express.Router();

// Example route only accessible by admins
router.get('/admin-data', ensureLoggedIn, requireRole('admin'), (req, res) => {
  res.json({ secret: "Admin-only data" });
});

// Example route accessible by all logged-in users
router.get('/general-data', ensureLoggedIn, (req, res) => {
  res.json({ secret: "Accessible by any logged-in user" });
});

export default router;
