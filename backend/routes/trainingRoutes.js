const express = require('express');
const router = express.Router();
const {
  getTrainingPrograms,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
  registerForTraining,
  getTrainingRegistrations,
  deleteTrainingRegistration
} = require('../controllers/trainingController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getTrainingPrograms);
router.post('/:id/register', registerForTraining);

// Admin endpoints (Protected)
router.get('/registrations', authMiddleware, adminOnly, getTrainingRegistrations);
router.delete('/registrations/:id', authMiddleware, adminOnly, deleteTrainingRegistration);
router.post('/', authMiddleware, adminOnly, createTrainingProgram);
router.put('/:id', authMiddleware, adminOnly, updateTrainingProgram);
router.delete('/:id', authMiddleware, adminOnly, deleteTrainingProgram);

module.exports = router;
