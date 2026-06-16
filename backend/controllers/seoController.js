const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');

// ==========================================
// 1. GLOBAL SEO SETTINGS
// ==========================================
const getSeoSettings = async (req, res) => {
  try {
    const list = await query('SELECT setting_key, setting_value FROM seo_settings');
    const settings = {};
    list.forEach(item => {
      settings[item.setting_key] = item.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('getSeoSettings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateSeoSettings = async (req, res) => {
  const data = req.body; // Key-value object
  try {
    for (const key of Object.keys(data)) {
      const val = data[key];
      await query(
        `INSERT INTO seo_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, val, val]
      );
    }
    res.json({ message: 'SEO settings updated successfully' });
  } catch (error) {
    console.error('updateSeoSettings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// 2. REDIRECTS (301)
// ==========================================
const getRedirects = async (req, res) => {
  try {
    const list = await query('SELECT * FROM redirects ORDER BY created_at DESC');
    res.json(list);
  } catch (error) {
    console.error('getRedirects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createRedirect = async (req, res) => {
  const { source_url, target_url } = req.body;
  if (!source_url || !target_url) {
    return res.status(400).json({ message: 'Source and target URLs are required' });
  }
  try {
    await query(
      'INSERT INTO redirects (source_url, target_url) VALUES (?, ?)',
      [source_url.trim(), target_url.trim()]
    );
    res.status(201).json({ message: 'Redirect created successfully' });
  } catch (error) {
    console.error('createRedirect error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRedirect = async (req, res) => {
  const { id } = req.params;
  const { source_url, target_url } = req.body;
  try {
    await query(
      'UPDATE redirects SET source_url = ?, target_url = ? WHERE id = ?',
      [source_url.trim(), target_url.trim(), id]
    );
    res.json({ message: 'Redirect updated successfully' });
  } catch (error) {
    console.error('updateRedirect error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRedirect = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM redirects WHERE id = ?', [id]);
    res.json({ message: 'Redirect deleted successfully' });
  } catch (error) {
    console.error('deleteRedirect error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// 3. ROBOTS.TXT RULES
// ==========================================
const getRobotsRules = async (req, res) => {
  try {
    const rules = await query('SELECT robots_txt FROM robots_settings WHERE id = 1');
    if (rules.length === 0) {
      return res.json({ robots_txt: 'User-agent: *\nDisallow: /admin/' });
    }
    res.json(rules[0]);
  } catch (error) {
    console.error('getRobotsRules error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRobotsRules = async (req, res) => {
  const { robots_txt } = req.body;
  try {
    await query(
      `INSERT INTO robots_settings (id, robots_txt) VALUES (1, ?)
       ON DUPLICATE KEY UPDATE robots_txt = ?`,
      [robots_txt, robots_txt]
    );
    res.json({ message: 'Robots.txt updated successfully' });
  } catch (error) {
    console.error('updateRobotsRules error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// 4. SITEMAP REBUILD ENGINE
// ==========================================
const generateSitemapXml = async (canonicalDomain) => {
  const staticPages = ['', '/about', '/contact', '/membership', '/events', '/publications', '/gallery', '/media'];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
  
  // Static pages
  staticPages.forEach(p => {
    xml += `  <url>\n    <loc>${canonicalDomain}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // News items
  const newsList = await query('SELECT id, slug, image_url, updated_at FROM news ORDER BY created_at DESC');
  newsList.forEach(n => {
    const loc = `${canonicalDomain}/news/${n.slug || n.id}`;
    const date = new Date(n.updated_at || new Date()).toISOString().split('T')[0];
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n`;
    if (n.image_url) {
      xml += `    <image:image>\n      <image:loc>${canonicalDomain}${n.image_url}</image:loc>\n    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return { xml, count: staticPages.length + newsList.length };
};

const generateNewsSitemapXml = async (canonicalDomain, orgName) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  // Fetch news published in the last 48 hours
  const recentNews = await query(
    'SELECT id, title, slug, created_at FROM news WHERE created_at >= NOW() - INTERVAL 2 DAY ORDER BY created_at DESC'
  );

  recentNews.forEach(n => {
    const loc = `${canonicalDomain}/news/${n.slug || n.id}`;
    const pubDate = new Date(n.created_at).toISOString();
    xml += `  <url>\n    <loc>${loc}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>${orgName}</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${pubDate}</news:publication_date>\n      <news:title>${n.title.replace(/&/g, '&amp;')}</news:title>\n    </news:news>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return { xml, count: recentNews.length };
};

const triggerRebuildSitemaps = async (req, res) => {
  try {
    const globalSettings = await getGlobalSeoSettingsInternal();
    const canonicalDomain = globalSettings.canonical_domain || `${req.protocol}://${req.get('host')}`;
    const orgName = globalSettings.org_name || 'Udupi Management Association';

    // 1. Rebuild Standard Sitemap
    const stdSitemap = await generateSitemapXml(canonicalDomain);
    const publicPath = path.join(__dirname, '..', 'public');
    if (fs.existsSync(publicPath)) {
      fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), stdSitemap.xml);
    }
    await query(
      'INSERT INTO sitemap_logs (type, item_count, status) VALUES (?, ?, ?)',
      ['standard', stdSitemap.count, 'success']
    );

    // 2. Rebuild News Sitemap
    const newsSitemap = await generateNewsSitemapXml(canonicalDomain, orgName);
    if (fs.existsSync(publicPath)) {
      fs.writeFileSync(path.join(publicPath, 'sitemap-news.xml'), newsSitemap.xml);
    }
    await query(
      'INSERT INTO sitemap_logs (type, item_count, status) VALUES (?, ?, ?)',
      ['news', newsSitemap.count, 'success']
    );

    res.json({
      message: 'Sitemaps rebuilt and written to disk successfully',
      standardCount: stdSitemap.count,
      newsCount: newsSitemap.count
    });
  } catch (error) {
    console.error('triggerRebuildSitemaps error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSitemapLogs = async (req, res) => {
  try {
    const logs = await query('SELECT * FROM sitemap_logs ORDER BY generated_at DESC LIMIT 20');
    res.json(logs);
  } catch (error) {
    console.error('getSitemapLogs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// 5. AUTOMATED SEO AUDIT SYSTEM
// ==========================================
const runSeoAudit = async (req, res) => {
  try {
    // Clear previous audits
    await query('TRUNCATE TABLE seo_audits');

    const globalSettings = await getGlobalSeoSettingsInternal();
    const canonicalDomain = globalSettings.canonical_domain || `${req.protocol}://${req.get('host')}`;

    // Audit general pages
    const mainPages = ['', '/about', '/contact', '/membership', '/events', '/publications', '/gallery', '/media'];
    for (const page of mainPages) {
      let missingTitle = 0;
      let missingDescription = 0;
      let missingCanonical = 0;

      if (!globalSettings.website_title) missingTitle = 1;
      if (!globalSettings.website_description) missingDescription = 1;
      if (!globalSettings.canonical_domain) missingCanonical = 1;

      await query(
        `INSERT INTO seo_audits (url, missing_title, missing_description, missing_canonical, missing_alt_tags, status_code)
         VALUES (?, ?, ?, ?, ?, 200)`,
        [page || '/', missingTitle, missingDescription, missingCanonical, 0]
      );
    }

    // Audit news article detail pages
    const newsList = await query('SELECT n.id, n.title, n.slug, n.content, n.image_url, s.seo_title, s.seo_description, s.canonical_url FROM news n LEFT JOIN article_seo s ON n.id = s.news_id');
    for (const art of newsList) {
      const missingTitle = !art.seo_title ? 1 : 0;
      const missingDescription = !art.seo_description ? 1 : 0;
      const missingCanonical = !art.canonical_url ? 1 : 0;

      // Scan content for empty image alt tags
      let missingAltTags = 0;
      if (art.image_url && !art.title) {
        missingAltTags++;
      }
      
      const articleUrl = `/news/${art.slug || art.id}`;
      await query(
        `INSERT INTO seo_audits (url, missing_title, missing_description, missing_canonical, missing_alt_tags, status_code)
         VALUES (?, ?, ?, ?, ?, 200)`,
        [articleUrl, missingTitle, missingDescription, missingCanonical, missingAltTags]
      );
    }

    const logs = await query('SELECT * FROM seo_audits');
    res.json({
      message: 'SEO audit completed successfully',
      issuesFound: logs.filter(l => l.missing_title || l.missing_description || l.missing_canonical || l.missing_alt_tags).length,
      data: logs
    });
  } catch (error) {
    console.error('runSeoAudit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSeoAudits = async (req, res) => {
  try {
    const list = await query('SELECT * FROM seo_audits ORDER BY id ASC');
    res.json(list);
  } catch (error) {
    console.error('getSeoAudits error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// 6. CORE WEB VITALS PERFORMANCE LOGGING
// ==========================================
const getPerformanceLogs = async (req, res) => {
  try {
    const metrics = await query(
      'SELECT metric_type, AVG(metric_value) as avg_value, COUNT(*) as count FROM performance_logs GROUP BY metric_type'
    );
    res.json(metrics);
  } catch (error) {
    console.error('getPerformanceLogs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const logPerformanceMetric = async (req, res) => {
  const { metric_type, metric_value, url } = req.body;
  if (!metric_type || metric_value === undefined) {
    return res.status(400).json({ message: 'Metric type and value are required' });
  }
  try {
    await query(
      'INSERT INTO performance_logs (metric_type, metric_value, url) VALUES (?, ?, ?)',
      [metric_type, parseFloat(metric_value), url || null]
    );
    res.status(201).json({ message: 'Metric logged successfully' });
  } catch (error) {
    console.error('logPerformanceMetric error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==========================================
// HELPER METHODS
// ==========================================
const getGlobalSeoSettingsInternal = async () => {
  const list = await query('SELECT setting_key, setting_value FROM seo_settings');
  const settings = {};
  list.forEach(item => {
    settings[item.setting_key] = item.setting_value;
  });
  return settings;
};

module.exports = {
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
  logPerformanceMetric,
  generateSitemapXml,
  generateNewsSitemapXml,
  getGlobalSeoSettingsInternal
};
