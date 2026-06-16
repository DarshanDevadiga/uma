const express = require('express');
const router = express.Router();
const { submitContact, getMessages, deleteMessage, sendCustomEmail } = require('../controllers/contactController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public submit endpoint
router.post('/', submitContact);

// Admin endpoints (Protected)
router.get('/', authMiddleware, adminOnly, getMessages);
router.delete('/:id', authMiddleware, adminOnly, deleteMessage);
router.post('/send-email', authMiddleware, adminOnly, sendCustomEmail);

module.exports = router;
