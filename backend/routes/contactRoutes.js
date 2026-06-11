const express = require('express');
const router = express.Router();
const { submitContact, getMessages, deleteMessage } = require('../controllers/contactController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public submit endpoint
router.post('/', submitContact);

// Admin endpoints (Protected)
router.get('/', authMiddleware, adminOnly, getMessages);
router.delete('/:id', authMiddleware, adminOnly, deleteMessage);

module.exports = router;
