const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

// Add this simple test route at the top of your routes
router.post('/test-simple-create', async (req, res) => {
  try {
    console.log('🧪 Simple test create endpoint hit');
    console.log('📦 Request body received:', req.body);
    
    // Test if we can access the Twin model
    const Twin = require('../models/Twin');
    console.log('✅ Twin model loaded successfully');
    
    // Test basic twin creation with minimal data
    const testTwin = new Twin({
      name: 'TestTwin',
      persona: 'I am a test twin with a simple personality for testing purposes.',
      userId: 'test_user_123',
      personalityProfile: { test: true },
      conversationHistory: []
    });
    
    console.log('🔧 Test twin object created');
    
    const savedTwin = await testTwin.save();
    console.log('✅ Test twin saved successfully:', savedTwin._id);
    
    res.json({
      success: true,
      message: 'Simple test twin created successfully',
      twinId: savedTwin._id.toString()
    });
    
  } catch (error) {
    console.error('❌ Simple test error:', error);
    res.status(500).json({
      success: false,
      error: 'Simple test failed',
      details: error.message,
      stack: error.stack
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Twin routes
/*router.post('/train', controller.createTwin);*/
router.get('/twin', controller.getTwin);

// Chat routes
router.post('/chat', controller.chat);
router.post('/chat-with-personality', controller.chatWithPersonality); // ✅ Add this line

// Analytics routes
router.get('/analytics', controller.getAnalytics);

// Add new personality-based routes
router.post('/create-personality-twin', controller.createPersonalityTwin);
router.post('/chat-personality', controller.chatWithPersonality);

// Replace the debug route
router.get('/debug-twins', async (req, res) => {
  try {
    const Twin = require('../models/Twin');
    const twins = await Twin.find({}, '_id name userId personalityProfile').limit(10);
    
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
        hasPersonality: !!twin.personalityProfile
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

// Add this test route to your backend/routes/api.js
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

// Add this test route to see the complete flow
router.post('/test-create-and-chat', async (req, res) => {
  try {
    console.log('🧪 Testing complete twin creation and chat flow...');
    
    // Create a test twin
    const testPersonalityData = {
      name: 'TestTwin',
      bigFiveTraits: {
        extraversion: 0.7,
        openness: 0.8,
        conscientiousness: 0.6,
        agreeableness: 0.9,
        neuroticism: 0.3
      },
      communicationStyle: {
        formality: 'casual',
        expressiveness: 'expressive',
        supportiveness: 'supportive',
        optimism: 0.8
      },
      cognitiveStyle: {
        thinking_preference: 'creative',
        decision_making: 'emotional',
        planning_approach: 'flexible',
        creativity_level: 0.9
      }
    };

    // Create twin using the controller
    const controller = require('../controllers/mainController');
    const mockReq = { body: testPersonalityData };
    const mockRes = {
      status: (code) => ({ json: (data) => mockRes.jsonData = data }),
      json: (data) => mockRes.jsonData = data
    };

    await controller.createPersonalityTwin(mockReq, mockRes);
    console.log('📝 Twin creation result:', mockRes.jsonData);

    if (mockRes.jsonData.success) {
      const twinId = mockRes.jsonData.twinId;
      
      // Now test chat
      const chatReq = { body: { message: 'Hello test', twinId: twinId } };
      const chatRes = {
        json: (data) => chatRes.jsonData = data,
        status: (code) => ({ json: (data) => chatRes.jsonData = data })
      };

      await controller.chatWithPersonality(chatReq, chatRes);
      console.log('💬 Chat result:', chatRes.jsonData);

      res.json({
        success: true,
        twinCreation: mockRes.jsonData,
        chatTest: chatRes.jsonData
      });
    } else {
      res.json({
        success: false,
        error: 'Twin creation failed',
        details: mockRes.jsonData
      });
    }

  } catch (error) {
    console.error('Test flow error:', error);
    res.status(500).json({
      success: false,
      error: 'Test flow failed',
      details: error.message
    });
  }
});

// Add this simple test route
router.get('/test-groq-simple', async (req, res) => {
  try {
    console.log('🧪 Testing Groq API via route...');
    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    
    const axios = require('axios');
    
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'user', content: 'Say "Hello from Groq API test!"' }
      ],
      max_tokens: 20
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      message: 'Groq API working!',
      response: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error('Groq test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
});

// Add this route for deleting twins
router.delete('/twin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const Twin = require('../models/Twin');
    
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

// Add this debug route to check environment variables
router.get('/debug-env', (req, res) => {
  console.log('🔍 Environment Debug:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
  console.log('GROQ_API_KEY first 10 chars:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'NOT SET');
  console.log('All env keys:', Object.keys(process.env).filter(key => key.includes('GROQ')));
  
  res.json({
    success: true,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      groqKeyPreview: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'NOT SET'
    }
  });
});

// Routes list endpoint
router.get('/routes', (req, res) => {
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

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Main routes
router.post('/create-personality-twin', controller.createPersonalityTwin);
router.post('/chat-with-personality', controller.chatWithPersonality);
router.post('/train', controller.trainTwin);
router.get('/twin-info/:id', controller.getTwinInfo);
router.post('/chat', controller.chat);

// Test routes for debugging
router.post('/test-create', (req, res) => {
  console.log('🧪 Test route hit with body:', req.body);
  res.json({
    success: true,
    message: 'Test route working',
    receivedData: req.body
  });
});

router.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    console.log('🔍 Testing database connection...');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    const Twin = require('../models/Twin');
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

module.exports = router;