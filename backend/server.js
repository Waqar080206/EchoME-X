const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Environment check
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    'https://echo-me-x.vercel.app',
    'https://www.echo-me-x.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Security headers for production
if (isProduction) {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
}

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'EchoMe X Backend is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend test successful!',
    cors: process.env.CORS_ORIGIN
  });
});

// API Routes
app.use('/api', apiRoutes);

// Remove or comment out the duplicate endpoints below since they're handled by routes/api.js
/*
app.post('/api/chat-with-personality', async (req, res) => {
    // Remove this duplicate
});
*/

// Debug endpoint to see all available routes
app.get('/api/routes', (req, res) => {
  res.json({
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /test',
      'POST /api/create-personality-twin',
      'POST /api/train',
      'GET /api/twin-info',
      'POST /api/chat',
      'POST /api/chat-with-personality',
      'GET /api/routes'
    ]
  });
});

// Serve frontend for any non-API routes (SPA fallback)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  }
});

// 404 handler with better debugging
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  console.log('Headers:', req.headers);
  
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /',
      'GET /health', 
      'GET /test',
      'POST /api/create-personality-twin',
      'POST /api/train',
      'GET /api/twin-info',
      'POST /api/chat',
      'POST /api/chat-with-personality', // ✅ Correct endpoint name
      'GET /api/debug-twins'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🎨 Frontend available at: http://localhost:${PORT}`);
      console.log(`📡 Backend API at: http://localhost:${PORT}/api`);
      console.log('📡 Available endpoints:');
      console.log('  POST /api/create-personality-twin');
      console.log('  POST /api/train');
      console.log('  GET /api/twin-info');
      console.log('  POST /api/chat');
      console.log('  POST /api/chat-with-personality');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});