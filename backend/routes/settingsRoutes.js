const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getSettings);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, updateSettings);

module.exports = router;
