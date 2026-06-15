const express = require('express');
const router = express.Router();
const {
  getSeoSettings,
  updateSeoSettings,
  getRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  getRobotsRules,
  updateRobotsRules,
  triggerRebuildSitemaps,
  getSitemapLogs,
  runSeoAudit,
  getSeoAudits,
  getPerformanceLogs,
  logPerformanceMetric
} = require('../controllers/seoController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public performance logging
router.post('/performance', logPerformanceMetric);

// Protected Admin SEO routes
router.get('/settings', authMiddleware, adminOnly, getSeoSettings);
router.put('/settings', authMiddleware, adminOnly, updateSeoSettings);

router.get('/redirects', authMiddleware, adminOnly, getRedirects);
router.post('/redirects', authMiddleware, adminOnly, createRedirect);
router.put('/redirects/:id', authMiddleware, adminOnly, updateRedirect);
router.delete('/redirects/:id', authMiddleware, adminOnly, deleteRedirect);

router.get('/robots', authMiddleware, adminOnly, getRobotsRules);
router.put('/robots', authMiddleware, adminOnly, updateRobotsRules);

router.post('/sitemaps/rebuild', authMiddleware, adminOnly, triggerRebuildSitemaps);
router.get('/sitemaps/logs', authMiddleware, adminOnly, getSitemapLogs);

router.post('/audits/run', authMiddleware, adminOnly, runSeoAudit);
router.get('/audits', authMiddleware, adminOnly, getSeoAudits);
router.get('/performance-logs', authMiddleware, adminOnly, getPerformanceLogs);

module.exports = router;
