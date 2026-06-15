const { query } = require('../config/db');

const redirectMiddleware = async (req, res, next) => {
  // Only intercept GET and HEAD requests for redirects
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  // Check redirects using both originalUrl and path (without query params)
  const fullUrl = req.originalUrl;
  const pathOnly = req.path;

  try {
    // Search for redirect match
    const redirects = await query(
      'SELECT * FROM redirects WHERE source_url = ? OR source_url = ? LIMIT 1',
      [fullUrl, pathOnly]
    );

    if (redirects.length > 0) {
      const redirect = redirects[0];

      // Increment hit count and update last_accessed asynchronously
      query(
        'UPDATE redirects SET hit_count = hit_count + 1, last_accessed = NOW() WHERE id = ?',
        [redirect.id]
      ).catch(err => console.error('Failed to update redirect stats:', err));

      return res.redirect(301, redirect.target_url);
    }
  } catch (error) {
    console.error('Redirect middleware query error:', error);
  }

  next();
};

const log404 = async (req, res, next) => {
  const url = req.originalUrl;

  try {
    // Avoid duplicate logging of the same url 404 in audits, or just insert it
    await query(
      `INSERT INTO seo_audits (url, missing_title, missing_description, missing_canonical, missing_alt_tags, status_code)
       VALUES (?, 0, 0, 0, 0, 404)`,
      [url]
    );
  } catch (error) {
    console.error('Failed to log 404 audit error:', error);
  }

  res.status(404).json({ message: 'Resource not found' });
};

module.exports = {
  redirectMiddleware,
  log404
};
