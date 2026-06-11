const express = require('express');
const router = express.Router();
const {
  getTrainingPrograms,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram
} = require('../controllers/trainingController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getTrainingPrograms);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, createTrainingProgram);
router.put('/:id', authMiddleware, adminOnly, updateTrainingProgram);
router.delete('/:id', authMiddleware, adminOnly, deleteTrainingProgram);

module.exports = router;
