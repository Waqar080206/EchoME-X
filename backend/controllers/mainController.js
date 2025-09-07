// Mock data storage (since we're using it for chat)
let mockTwins = [];
let mockAnalytics = {
  followers: 2300,
  engagementRate: 87.3,
  totalInteractions: 1250,
  averageResponseTime: 1.2
};

const Twin = require('../models/Twin');
const Analytics = require('../models/Analytics');
const aiService = require('../utils/aiService');
const { v4: uuidv4 } = require('uuid');

// Simple ID generator
const generateUserId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Create Twin
exports.createTwin = async (req, res) => {
  try {
    const { name, persona } = req.body;
    
    console.log('📝 Twin creation request:', { name, persona: typeof persona });

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        error: 'Name is required' 
      });
    }

    // Handle persona - it might be a string or an object
    let personaText = '';
    if (typeof persona === 'string') {
      personaText = persona.trim();
    } else if (typeof persona === 'object' && persona !== null) {
      // If persona is an object, combine its properties
      const { traits, communicationStyle, background } = persona;
      personaText = `Personality Traits: ${traits || ''}. Communication Style: ${communicationStyle || ''}. Background: ${background || ''}`;
    }

    if (!personaText || personaText.length < 50) {
      return res.status(400).json({ 
        error: 'Persona description must be at least 50 characters' 
      });
    }

    const twin = {
      _id: generateUserId(),
      name: name.trim(),
      persona: personaText,
      userId: generateUserId(),
      createdAt: new Date()
    };

    mockTwins.push(twin);
    console.log(`✅ Twin created: ${twin.name} (Total: ${mockTwins.length})`);
    console.log(`📝 Persona: ${twin.persona.substring(0, 100)}...`);

    res.status(201).json({
      success: true,
      message: 'Twin created successfully!',
      data: { id: twin._id, name: twin.name, userId: twin.userId }
    });

  } catch (error) {
    console.error('Create twin error:', error);
    res.status(500).json({ error: 'Failed to create twin' });
  }
};

// Chat with Twin
exports.chat = async (req, res) => {
  try {
    const { message, twinName } = req.body;
    
    console.log('💬 Chat request received:', { message, twinName });
    console.log('📝 Available twins:', mockTwins.map(t => t.name));

    if (!message?.trim()) {
      console.log('❌ No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    let twin = null;
    if (twinName) {
      twin = mockTwins.find(t => t.name === twinName);
      console.log('🔍 Found twin by name:', twin ? twin.name : 'none');
    }
    
    if (!twin) {
      twin = mockTwins[mockTwins.length - 1];
      console.log('🔍 Using latest twin:', twin ? twin.name : 'none');
    }
    
    if (!twin) {
      console.log('❌ No twin found at all');
      return res.status(404).json({ 
        error: 'Twin not found. Please create a twin first.',
        redirect: '/index.html'
      });
    }

    console.log('🤖 Generating response for twin:', twin.name);
    console.log('👤 Twin persona:', twin.persona.substring(0, 100) + '...');

    // Generate AI response
    const response = await aiService.generateResponse(message, twin.persona);
    
    console.log('✅ AI response generated:', response.substring(0, 50) + '...');

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
        twin: { name: twin.name, id: twin._id }
      }
    });

  } catch (error) {
    console.error('💥 Chat error:', error);
    
    // Only use fallback as last resort
    res.json({
      success: true,
      data: {
        message: "Something's not quite right with my responses. Let me try to reconnect...",
        timestamp: new Date().toISOString(),
        fallback: true
      }
    });
  }
};

// Get Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const baseFollowers = 2300;
    const baseEngagement = 87.3;
    const baseInteractions = 1250;
    const baseResponseTime = 1.2;
    
    const data = {
      followers: baseFollowers + Math.floor(Math.random() * 100),
      engagementRate: Math.round((baseEngagement + Math.random() * 4 - 2) * 10) / 10,
      totalInteractions: baseInteractions + Math.floor(Math.random() * 50),
      averageResponseTime: Math.round((baseResponseTime + Math.random() * 0.4 - 0.2) * 10) / 10,
      popularTopics: [
        { name: 'Technology', percentage: 34 },
        { name: 'Lifestyle', percentage: 28 },
        { name: 'Career', percentage: 22 },
        { name: 'Entertainment', percentage: 16 }
      ],
      weeklyData: [40, 65, 30, 80, 45, 90, 70],
      recentActivity: [
        { type: 'conversation', title: 'New conversation started', time: '2 minutes ago' },
        { type: 'engagement', title: '50 new likes received', time: '1 hour ago' },
        { type: 'growth', title: 'Engagement rate increased', time: '3 hours ago' },
        { type: 'followers', title: '100 new followers', time: '6 hours ago' }
      ]
    };

    console.log('📊 Analytics requested, sending data');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Get Twin Info
exports.getTwin = async (req, res) => {
  try {
    const twin = mockTwins[mockTwins.length - 1]; // Get latest twin
    
    if (!twin) {
      console.log('❌ No twin found in mock data');
      return res.status(404).json({ error: 'No twin found. Please create a twin first.' });
    }

    console.log('✅ Twin info requested:', twin.name);

    res.json({
      success: true,
      data: {
        id: twin._id,
        name: twin.name,
        persona: twin.persona,
        createdAt: twin.createdAt
      }
    });

  } catch (error) {
    console.error('Get twin error:', error);
    res.status(500).json({ error: 'Failed to fetch twin' });
  }
};