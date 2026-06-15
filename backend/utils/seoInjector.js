const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');

// In-memory cache for index.html content
let indexHtmlTemplate = null;

const loadTemplate = () => {
  const publicIndex = path.join(__dirname, '..', 'public', 'index.html');
  if (fs.existsSync(publicIndex)) {
    return fs.readFileSync(publicIndex, 'utf8');
  }
  // Fallback default HTML if frontend is not compiled yet
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Udupi Management Association</title>
</head>
<body style="background: #090a0f; color: #fff;">
  <div id="root">UMA Portal - Frontend not compiled yet. Run build process.</div>
</body>
</html>`;
};

const getGlobalSeoSettings = async () => {
  try {
    const list = await query('SELECT setting_key, setting_value FROM seo_settings');
    const settings = {};
    list.forEach(item => {
      settings[item.setting_key] = item.setting_value;
    });
    return settings;
  } catch (err) {
    console.error('[SEO Injector] Failed to load global SEO settings:', err.message);
    return {};
  }
};

/**
 * Express middleware to dynamically inject meta tags and schema markup in index.html head
 */
const injectSeo = async (req, res) => {
  // Always load template fresh in development, or once in production
  if (process.env.NODE_ENV !== 'production' || !indexHtmlTemplate) {
    indexHtmlTemplate = loadTemplate();
  }

  const globalSettings = await getGlobalSeoSettings();
  const canonicalDomain = globalSettings.canonical_domain || `${req.protocol}://${req.get('host')}`;
  const currentUrl = `${canonicalDomain}${req.originalUrl}`;
  
  let pageTitle = globalSettings.website_title || 'Udupi Management Association | Building Leadership Excellence';
  let pageDesc = globalSettings.website_description || 'UMA is a premier management association coordinating commercial leadership and professional upskilling in coastal Karnataka.';
  let pageKeywords = globalSettings.website_keywords || 'UMA, Udupi Management Association, business networking, upskilling';
  let ogTitle = pageTitle;
  let ogDesc = pageDesc;
  let ogImage = `${canonicalDomain}${globalSettings.logo || '/logo.png'}`;
  let twitterTitle = pageTitle;
  let twitterDesc = pageDesc;
  let twitterImage = ogImage;
  let canonicalUrl = currentUrl;
  
  const schemas = [];

  // Determine context by path
  const pathParts = req.path.split('/').filter(Boolean);
  
  if (pathParts[0] === 'news' && pathParts[1]) {
    // 1. News Article Detail SEO lookup
    const slugOrId = pathParts[1];
    try {
      let newsItems = [];
      if (isNaN(slugOrId)) {
        newsItems = await query('SELECT * FROM news WHERE slug = ?', [slugOrId]);
      } else {
        newsItems = await query('SELECT * FROM news WHERE id = ?', [slugOrId]);
      }

      if (newsItems.length > 0) {
        const article = newsItems[0];
        
        // Lookup custom metadata override
        const seoOverrides = await query('SELECT * FROM article_seo WHERE news_id = ?', [article.id]);
        const seo = seoOverrides.length > 0 ? seoOverrides[0] : {};

        pageTitle = seo.seo_title || `${article.title} | UMA News`;
        pageDesc = seo.seo_description || article.content.substring(0, 160) + '...';
        pageKeywords = seo.seo_keywords || 'UMA News, press release, Udupi management';
        canonicalUrl = seo.canonical_url || `${canonicalDomain}/news/${article.slug || article.id}`;
        
        ogTitle = seo.og_title || pageTitle;
        ogDesc = seo.og_description || pageDesc;
        ogImage = seo.og_image ? (seo.og_image.startsWith('http') ? seo.og_image : `${canonicalDomain}${seo.og_image}`) : (article.image_url ? `${canonicalDomain}${article.image_url}` : ogImage);
        
        twitterTitle = seo.twitter_title || pageTitle;
        twitterDesc = seo.twitter_description || pageDesc;
        twitterImage = seo.twitter_image ? (seo.twitter_image.startsWith('http') ? seo.twitter_image : `${canonicalDomain}${seo.twitter_image}`) : ogImage;

        // Structured NewsArticle Schema (Google News & Google Discover optimized)
        schemas.push({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": article.title,
          "description": pageDesc,
          "image": [ogImage],
          "datePublished": article.created_at,
          "dateModified": article.updated_at || article.created_at,
          "author": {
            "@type": "Organization",
            "name": globalSettings.org_name || "Udupi Management Association",
            "url": canonicalDomain
          },
          "publisher": {
            "@type": "Organization",
            "name": globalSettings.org_name || "Udupi Management Association",
            "logo": {
              "@type": "ImageObject",
              "url": `${canonicalDomain}${globalSettings.logo || '/logo.png'}`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
          }
        });

        // Breadcrumb Schema
        schemas.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": canonicalDomain
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "News",
              "item": `${canonicalDomain}/media`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": article.title,
              "item": canonicalUrl
            }
          ]
        });
      }
    } catch (err) {
      console.error('[SEO Injector] Failed to fetch news item for SEO injection:', err.message);
    }
  } else {
    // 2. Generic static pages
    const pageName = pathParts[0] || 'home';
    const capitalized = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    pageTitle = `${capitalized} | ${globalSettings.website_title || 'Udupi Management Association'}`;
    
    if (pageName === 'home') {
      pageTitle = globalSettings.website_title || 'Udupi Management Association | Building Leadership Excellence';
      
      // Seed Website & Org schema on home page
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": globalSettings.org_name || "Udupi Management Association",
        "url": canonicalDomain,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${canonicalDomain}/media?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      });

      schemas.push({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": globalSettings.org_name || "Udupi Management Association",
        "url": canonicalDomain,
        "logo": `${canonicalDomain}${globalSettings.logo || '/logo.png'}`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": globalSettings.org_phone || "+91-820-2520412",
          "contactType": "customer service",
          "email": globalSettings.org_email || "info@udupimanagement.org"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": globalSettings.org_address || "Poornaprajna Campus",
          "addressLocality": "Udupi",
          "addressRegion": "Karnataka",
          "postalCode": "576101",
          "addressCountry": "IN"
        }
      });
    } else {
      // Breadcrumbs for standard pages
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": canonicalDomain
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": capitalized,
            "item": canonicalUrl
          }
        ]
      });
    }
  }

  // 3. Construct HTML Meta tags list
  let seoTags = `
  <!-- SEO Optimizations -->
  <meta name="description" content="${pageDesc}" />
  <meta name="keywords" content="${pageKeywords}" />
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="${globalSettings.org_name || 'Udupi Management Association'}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${twitterTitle}" />
  <meta name="twitter:description" content="${twitterDesc}" />
  <meta name="twitter:image" content="${twitterImage}" />
  `;

  // Append script tags for search console / tag managers
  if (globalSettings.google_search_console_id) {
    seoTags += `\n  <meta name="google-site-verification" content="${globalSettings.google_search_console_id}" />`;
  }
  if (globalSettings.bing_verification_id) {
    seoTags += `\n  <meta name="msvalidate.01" content="${globalSettings.bing_verification_id}" />`;
  }
  if (globalSettings.google_analytics_id) {
    seoTags += `\n  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${globalSettings.google_analytics_id}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${globalSettings.google_analytics_id}');
  </script>`;
  }
  if (globalSettings.google_tag_manager_id) {
    seoTags += `\n  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${globalSettings.google_tag_manager_id}');</script>
  <!-- End Google Tag Manager -->`;
  }

  // Add JSON-LD schemas
  schemas.forEach(schema => {
    seoTags += `\n  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  });

  // 4. Inject into indexHtmlTemplate
  let outputHtml = indexHtmlTemplate;

  // Replace default title
  outputHtml = outputHtml.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);

  // Insert meta and schema tags before the closing </head> tag
  outputHtml = outputHtml.replace('</head>', `${seoTags}\n</head>`);

  // Send the page
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(outputHtml);
};

module.exports = {
  injectSeo
};
