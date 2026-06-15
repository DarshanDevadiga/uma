const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getActivities);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, createActivity);
router.put('/:id', authMiddleware, adminOnly, updateActivity);
router.delete('/:id', authMiddleware, adminOnly, deleteActivity);

module.exports = router;
