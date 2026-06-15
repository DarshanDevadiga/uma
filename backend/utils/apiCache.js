const cache = {};

/**
 * Express middleware for in-memory API caching
 * @param {number} durationSeconds - Cache duration in seconds
 */
const cacheMiddleware = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedItem = cache[key];
    const now = Date.now();

    if (cachedItem && cachedItem.expiry > now) {
      // Return cached response
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${durationSeconds}`);
      return res.json(cachedItem.data);
    }

    // Intercept res.json to capture response data
    const originalJson = res.json;
    res.json = function(data) {
      // Store in cache
      cache[key] = {
        expiry: Date.now() + durationSeconds * 1000,
        data: data
      };
      
      res.setHeader('X-Cache', 'MISS');
      originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Clear cache by exact key or pattern
 * @param {string} pattern - Exact URL or RegExp prefix (e.g. '/api/news')
 */
const clearCache = (pattern) => {
  const keys = Object.keys(cache);
  if (!pattern) {
    // Clear all
    keys.forEach(key => delete cache[key]);
    console.log('[Cache] Entire cache cleared.');
    return;
  }

  let clearedCount = 0;
  keys.forEach(key => {
    if (key.startsWith(pattern) || (pattern instanceof RegExp && pattern.test(key))) {
      delete cache[key];
      clearedCount++;
    }
  });
  console.log(`[Cache] Cleared ${clearedCount} entries for pattern: ${pattern}`);
};

module.exports = {
  cacheMiddleware,
  clearCache
};
