const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply CORS middleware
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, can narrow down in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Resolve the base uploads directory from environment variable UPLOADS_DIR
const uploadsDir = process.env.UPLOADS_DIR
  ? (path.isAbsolute(process.env.UPLOADS_DIR) ? process.env.UPLOADS_DIR : path.join(__dirname, process.env.UPLOADS_DIR))
  : path.join(__dirname, 'uploads');

// Ensure upload folders exist
const uploadSubDirs = [
  'events',
  'bearers',
  'committees',
  'news',
  'gallery',
  'publications',
  'awards'
];
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
uploadSubDirs.forEach(sub => {
  const dirPath = path.join(uploadsDir, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Serve static uploaded files from the custom uploads location
app.use('/uploads', express.static(uploadsDir));

// Serve default placeholder images if they don't exist
const defaultBearerPath = path.join(uploadsDir, 'bearers/default_bearer.png');
if (!fs.existsSync(defaultBearerPath)) {
  // Create a simple blank SVG placeholder
  const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#27272a">
    <circle cx="50" cy="35" r="20" fill="#52525b"/>
    <path d="M20 80c0-15 15-20 30-20s30 5 30 20z" fill="#52525b"/>
  </svg>`;
  fs.writeFileSync(defaultBearerPath, placeholderSvg);
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const eventRoutes = require('./routes/eventRoutes');
const awardRoutes = require('./routes/awardRoutes');
const bearerRoutes = require('./routes/bearerRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memberships', memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/office-bearers', bearerRoutes);
app.use('/api/committees', committeeRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activityRoutes);

// Temporary Administrator Server Diagnostics Page
app.get('/server-diagnostics', async (req, res) => {
  const secretKey = process.env.DIAGNOSTIC_KEY;
  if (!secretKey || req.query.key !== secretKey) {
    return res.status(404).send("Not Found");
  }

  const { pool } = require('./config/db');
  let dbStatus = 'Pending';
  let dbError = null;
  let connectionInfo = null;

  try {
    const conn = await pool.getConnection();
    dbStatus = 'Success';
    const [rows] = await conn.query('SELECT 1 as success');
    connectionInfo = rows;
    conn.release();
  } catch (err) {
    dbStatus = 'Failed';
    dbError = {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      message: err.message
    };
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UMA Server Diagnostics</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #09090b;
          color: #f4f4f5;
          margin: 0;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
        }
        .container {
          max-width: 800px;
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
        }
        .banner {
          background: #7f1d1d;
          color: #fca5a5;
          border: 1px solid #b91c1c;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
          margin-bottom: 25px;
          letter-spacing: 1px;
        }
        h1 {
          font-size: 24px;
          margin-top: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 15px;
          color: #fbbf24;
        }
        h2 {
          font-size: 18px;
          color: #a1a1aa;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        th {
          color: #a1a1aa;
          font-weight: 600;
          width: 30%;
        }
        td {
          font-family: monospace;
          color: #e4e4e7;
          word-break: break-all;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }
        .status-success {
          background: #064e3b;
          color: #6ee7b7;
          border: 1px solid #047857;
        }
        .status-failed {
          background: #7f1d1d;
          color: #fca5a5;
          border: 1px solid #b91c1c;
        }
        .error-panel {
          background: rgba(185, 28, 28, 0.1);
          border: 1px solid rgba(185, 28, 28, 0.2);
          border-radius: 6px;
          padding: 15px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="banner">
          ⚠️ TEMPORARY DEBUG PAGE - REMOVE BEFORE GOING LIVE
        </div>
        <h1>UMA Server Diagnostics</h1>
        
        <h2>System Information</h2>
        <table>
          <tr>
            <th>Node.js Version</th>
            <td>${process.version}</td>
          </tr>
          <tr>
            <th>Working Directory</th>
            <td>${process.cwd()}</td>
          </tr>
          <tr>
            <th>Environment (NODE_ENV)</th>
            <td>${process.env.NODE_ENV || 'Not Set'}</td>
          </tr>
        </table>

        <h2>Database Configuration</h2>
        <table>
          <tr>
            <th>DB_HOST</th>
            <td>${process.env.DB_HOST || '127.0.0.1'}</td>
          </tr>
          <tr>
            <th>DB_USER</th>
            <td>${process.env.DB_USER || 'root'}</td>
          </tr>
          <tr>
            <th>DB_NAME</th>
            <td>${process.env.DB_NAME || 'uma_db'}</td>
          </tr>
          <tr>
            <th>DB_PORT</th>
            <td>${process.env.DB_PORT || '3306'}</td>
          </tr>
          <tr>
            <th>DB_PASSWORD</th>
            <td>${process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'Not Set / Empty'}</td>
          </tr>
        </table>

        <h2>Database Connection Test</h2>
        <table>
          <tr>
            <th>Status</th>
            <td>
              <span class="status-badge ${dbStatus === 'Success' ? 'status-success' : 'status-failed'}">
                ${dbStatus}
              </span>
            </td>
          </tr>
          ${dbStatus === 'Success' ? `
          <tr>
            <th>Test Query Output</th>
            <td>${JSON.stringify(connectionInfo)}</td>
          </tr>
          ` : `
          <tr>
            <th>Diagnostics</th>
            <td>
              <div class="error-panel">
                <strong>Error Code:</strong> ${dbError.code || 'N/A'}<br>
                <strong>Error Number:</strong> ${dbError.errno || 'N/A'}<br>
                <strong>SQL State:</strong> ${dbError.sqlState || 'N/A'}<br>
                <strong>Message:</strong> ${dbError.message || 'N/A'}
              </div>
            </td>
          </tr>
          `}
        </table>
      </div>
    </body>
    </html>
  `;
  res.status(200).send(html);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send("UMA Backend Running");
});

// Database diagnostics endpoint
app.get('/api/db-test', async (req, res) => {
  const { query } = require('./config/db');
  console.log('Database diagnostic check initiated...');
  console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    PASSWORD_SET: !!process.env.DB_PASSWORD,
    PASSWORD_LENGTH: process.env.DB_PASSWORD?.length || 0
  });
  
  try {
    const results = await query('SELECT 1 as connection_success');
    res.status(200).json({
      status: 'success',
      message: 'Database connection succeeds.',
      data: results
    });
  } catch (err) {
    console.error('Database diagnostic query failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed.',
      error: {
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage || err.message
      }
    });
  }
});

// Serve static React production build assets if present
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  // Handle SPA routing: serve index.html for non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  // Fallback root route if frontend is not built
  app.get('/', (req, res) => {
    res.send('UMA Backend API Server is active.');
  });
}

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('=== UMA Backend Server starting ===');
  console.log(`Server is running on port ${PORT}`);
  console.log(`Uploads directory mapping: http://127.0.0.1:${PORT}/uploads`);

  // Test database connection pool on startup
  const { pool } = require('./config/db');
  pool.getConnection()
    .then(conn => {
      console.log('Database connection pool verified successfully.');
      conn.release();
    })
    .catch(err => {
      console.error('CRITICAL: Database connection pool verification failed on startup!');
      console.error('Error details:', err);
    });

  // Auto-run DB Setup to ensure tables and seed data exist
  const { execFile } = require('child_process');
  execFile(process.execPath, ['setup-db.js'], { cwd: __dirname }, (err, stdout, stderr) => {
    if (stdout) console.log('Database Setup Output:', stdout);
    if (stderr) console.error('Database Setup Stderr:', stderr);
    if (err) {
      console.error('Database auto-initialization check failed:', err);
    } else {
      console.log('Database auto-initialization check passed/executed successfully.');
    }
  });
});
