const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, adminOnly, getDashboardStats);

module.exports = router;
