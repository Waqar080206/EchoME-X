const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Twin routes
router.post('/train', controller.createTwin);
router.get('/twin', controller.getTwin);

// Chat routes
router.post('/chat', controller.chat);

// Analytics routes
router.get('/analytics', controller.getAnalytics);

// Add new personality-based routes
router.post('/create-personality-twin', controller.createPersonalityTwin);
router.post('/chat-personality', controller.chatWithPersonality);

// Replace the debug route
router.get('/debug-twins', async (req, res) => {
  try {
    const controller = require('../controllers/mainController');
    const debugInfo = await controller.getDebugInfo();
    
    res.json({
      ...debugInfo,
      message: 'Debug info retrieved successfully'
    });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({
      error: 'Failed to get debug info',
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

module.exports = router;