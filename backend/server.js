const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();

// Environment check
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://echo-me-x.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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

// Request logging (simplified for production)
app.use((req, res, next) => {
  if (!isProduction) {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend test successful!', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    cors: process.env.CORS_ORIGIN
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'EchoMe X Backend is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes for Twin Creation
app.post('/api/train', (req, res) => {
  try {
    console.log('Received twin creation request:', req.body);
    
    // For now, return a success response
    // You'll need to add your actual twin creation logic here
    res.json({
      success: true,
      message: 'Twin created successfully!',
      twinId: 'twin_' + Date.now(),
      personality: req.body.personality || 'default'
    });
  } catch (error) {
    console.error('Error creating twin:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create twin'
    });
  }
});

app.get('/api/twin-info', (req, res) => {
  res.json({
    success: true,
    twin: {
      id: 'twin_example',
      name: 'Your AI Twin',
      personality: 'friendly and helpful',
      created: new Date().toISOString()
    }
  });
});

app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    // Simple response for now
    res.json({
      success: true,
      response: `Echo: ${message}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Chat failed'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /health', 
      'GET /test',
      'POST /api/train',
      'GET /api/twin-info',
      'POST /api/chat'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: isProduction ? 'Internal server error' : err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
      
      if (isProduction) {
        console.log('🔒 Production mode: Enhanced security enabled');
      }
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