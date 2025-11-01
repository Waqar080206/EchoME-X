const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');
const Twin = require('../models/Twin');

// ==================== HEALTH & STATUS ====================

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Routes list endpoint
router.get('/routes', (req, res) => {
  res.json({
    availableRoutes: [
      'GET /health',
      'GET /test',
      'POST /api/create-personality-twin',
      'POST /api/chat-with-personality',
      'GET /api/twin',
      'DELETE /api/twin/:id',
      'GET /api/analytics',
      'GET /api/debug-twins'
    ]
  });
});

// ==================== TWIN MANAGEMENT ====================

// Create personality-based twin
router.post('/create-personality-twin', controller.createPersonalityTwin);

// Get twin info
router.get('/twin', controller.getTwin);

// Delete twin
router.delete('/twin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting twin with ID:', id);
    
    const deletedTwin = await Twin.findByIdAndDelete(id);
    
    if (!deletedTwin) {
      return res.status(404).json({
        success: false,
        error: 'Twin not found'
      });
    }
    
    console.log('✅ Twin deleted successfully:', deletedTwin.name);
    
    res.json({
      success: true,
      message: 'Twin deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete twin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete twin'
    });
  }
});

// ==================== CHAT ====================

// Basic chat (for backwards compatibility)
router.post('/chat', controller.chat);

// Chat with personality
router.post('/chat-with-personality', controller.chatWithPersonality);

// Alias for chat-with-personality (for backwards compatibility)
router.post('/chat-personality', controller.chatWithPersonality);

// ==================== ANALYTICS ====================

// Get analytics
router.get('/analytics', controller.getAnalytics);

// ==================== DEBUG ROUTES ====================

// Debug twins list
router.get('/debug-twins', async (req, res) => {
  try {
    const twins = await Twin.find({}, '_id name userId personalityProfile conversationHistory').limit(10);
    
    console.log('🔍 Debug: Found twins in database:', twins.length);
    twins.forEach(twin => {
      console.log(`- Twin: ${twin.name} (ID: ${twin._id}, UserID: ${twin.userId})`);
    });
    
    res.json({
      success: true,
      message: `Found ${twins.length} twins in database`,
      twins: twins.map(twin => ({
        id: twin._id.toString(),
        name: twin.name,
        userId: twin.userId,
        hasPersonality: !!twin.personalityProfile,
        conversationCount: twin.conversationHistory?.length || 0
      }))
    });
  } catch (error) {
    console.error('Debug twins error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to debug twins',
      details: error.message
    });
  }
});

// ==================== DEVELOPMENT-ONLY ROUTES ====================

// Only load test routes in development/test environments
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      process.env.NODE_ENV === 'dev' || 
                      process.env.NODE_ENV === 'test' ||
                      !process.env.NODE_ENV; // Default to development if not set

if (isDevelopment) {
  // Test AI service
  router.post('/test-ai', async (req, res) => {
    try {
      const { message } = req.body;
      const aiService = require('../utils/aiService');
      
      console.log('🧪 Testing AI service with message:', message || 'Hello');
      
      const response = await aiService.generateResponse(
        message || 'Hello, how are you?',
        'You are a friendly AI assistant named TestBot. Be conversational and helpful.'
      );
      
      res.json({
        success: true,
        message: 'AI service test successful',
        userInput: message || 'Hello, how are you?',
        aiResponse: response
      });
      
    } catch (error) {
      console.error('AI test error:', error);
      res.status(500).json({
        success: false,
        error: 'AI service test failed',
        details: error.message
      });
    }
  });

  // Test database connection
  router.get('/test-db', async (req, res) => {
    try {
      const mongoose = require('mongoose');
      console.log('🔍 Testing database connection...');
      console.log('MongoDB connection state:', mongoose.connection.readyState);
      
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected');
      }
      
      const count = await Twin.countDocuments();
      
      res.json({
        success: true,
        message: 'Database connection working',
        connectionState: mongoose.connection.readyState,
        twinCount: count
      });
      
    } catch (error) {
      console.error('❌ Database test error:', error);
      res.status(500).json({
        success: false,
        error: 'Database test failed',
        details: error.message
      });
    }
  });

  // Debug environment variables
  router.get('/debug-env', (req, res) => {
    console.log('🔍 Environment Debug:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    
    res.json({
      success: true,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasGroqKey: !!process.env.GROQ_API_KEY,
        hasMongoUri: !!process.env.MONGODB_URI
      }
    });
  });
}

module.exports = router;
