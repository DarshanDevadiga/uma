const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send("UMA Backend Running");
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
  console.log(`Server is running on port ${PORT}`);
  console.log(`Uploads directory mapping: http://localhost:${PORT}/uploads`);

  // Auto-run DB Setup to ensure tables and seed data exist
  const { exec } = require('child_process');
  exec('node setup-db.js', { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('Database auto-initialization check failed:', err);
    } else {
      console.log('Database auto-initialization check passed/executed successfully.');
    }
  });
});
