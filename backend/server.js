const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Check if frontend directory exists
const frontendPath = path.join(__dirname, '../frontend');
console.log('📁 Frontend path:', frontendPath);

// Serve static files from frontend
app.use(express.static(frontendPath));

// API Routes
app.use('/api', apiRoutes);

// Health check (before catch-all route)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    frontend: frontendPath
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    time: new Date().toISOString() 
  });
});

// Serve frontend for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(frontendPath, 'index.html');
    console.log('📄 Serving:', indexPath);
    res.sendFile(indexPath);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`📁 Serving files from: ${frontendPath}`);
  });
}).catch(error => {
  console.error('Failed to start:', error);
  process.exit(1);
});