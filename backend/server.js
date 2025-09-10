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
  origin: process.env.CORS_ORIGIN || 'https://echo-me-x.vercel.app',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString() 
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend test successful!',
    cors: process.env.CORS_ORIGIN
  });
});

// API Routes - Add the exact endpoint your frontend calls
app.post('/api/create-personality-twin', (req, res) => {
  try {
    console.log('Creating personality twin with data:', req.body);
    
    const { answers, socialMedia, permissions } = req.body;
    
    // Generate a unique twin ID
    const twinId = 'twin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate personality analysis
    const personalityTraits = {
      openness: Math.floor(Math.random() * 100),
      conscientiousness: Math.floor(Math.random() * 100),
      extraversion: Math.floor(Math.random() * 100),
      agreeableness: Math.floor(Math.random() * 100),
      neuroticism: Math.floor(Math.random() * 100)
    };
    
    res.json({
      success: true,
      message: 'Personality twin created successfully!',
      twin: {
        id: twinId,
        personality: personalityTraits,
        answers: answers || {},
        socialMedia: socialMedia || {},
        permissions: permissions || {},
        created: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error creating personality twin:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create personality twin',
      details: error.message
    });
  }
});

// Legacy train endpoint
app.post('/api/train', (req, res) => {
  try {
    console.log('Received train request:', req.body);
    res.json({
      success: true,
      message: 'Twin trained successfully!',
      twinId: 'twin_' + Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Training failed'
    });
  }
});

// Twin info endpoint
app.get('/api/twin-info', (req, res) => {
  res.json({
    success: true,
    twin: {
      id: 'twin_example',
      name: 'Your AI Twin',
      personality: 'friendly and helpful',
      created: new Date().toISOString(),
      status: 'active'
    }
  });
});

// Chat endpoints
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    res.json({
      success: true,
      response: `Echo: ${message}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Chat failed'
    });
  }
});

app.post('/api/chat-with-personality', (req, res) => {
  try {
    const { message, twinId } = req.body;
    
    res.json({
      success: true,
      response: `Personality response to: ${message}`,
      twinId: twinId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Personality chat failed'
    });
  }
});

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
      'POST /api/chat-with-personality'
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