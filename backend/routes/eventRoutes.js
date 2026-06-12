const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  registerForEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  deleteEventRegistration
} = require('../controllers/eventController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/register', registerForEvent);

// Admin endpoints (Protected)
router.get('/admin/registrations', authMiddleware, adminOnly, getEventRegistrations);
router.delete('/admin/registrations/:id', authMiddleware, adminOnly, deleteEventRegistration);
router.post('/', authMiddleware, adminOnly, upload('events').single('image'), createEvent);
router.put('/:id', authMiddleware, adminOnly, upload('events').single('image'), updateEvent);
router.delete('/:id', authMiddleware, adminOnly, deleteEvent);

module.exports = router;
