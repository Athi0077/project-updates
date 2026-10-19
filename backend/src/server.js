const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { ensureAdminExists } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { seedCategoriesIfEmpty } = require('./controllers/categoryController');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploads if using local fallback
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Portfolio Projects Tracker API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);

// Serve frontend build if dist folder exists (e.g. production / Render)
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 handler for unmatched API requests
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5001;

// Start server
const startServer = async () => {
  // 1. Listen immediately so port is open without race condition or ERR_CONNECTION_REFUSED
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`Backend Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Projects API: http://localhost:${PORT}/api/projects`);
    console.log(`Upload API:   http://localhost:${PORT}/api/upload`);
    console.log(`===============================================`);
  });

  // 2. Connect to MongoDB and initialize defaults
  try {
    await connectDB();
    await ensureAdminExists();
    await seedCategoriesIfEmpty();
  } catch (error) {
    console.error('Database connection/initialization error:', error.message);
  }
};

startServer();
