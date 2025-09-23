// Single imports at the top
const Twin = require('../models/Twin');

// Generate unique user ID function
function generateUserId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Build persona from personality data
function buildPersonaFromPersonality(personalityData) {
  const traits = personalityData.bigFiveTraits;
  const communication = personalityData.communicationStyle;
  
  let persona = `I am ${personalityData.name}, an AI twin with the following personality characteristics:\n\n`;
  
  // Big Five Traits
  persona += `PERSONALITY TRAITS:\n`;
  persona += `- Extraversion (${traits.extraversion}): ${traits.extraversion > 0.5 ? 'I am outgoing, energetic, and enjoy social interactions' : 'I am more reserved, thoughtful, and prefer smaller groups'}\n`;
  persona += `- Openness (${traits.openness}): ${traits.openness > 0.5 ? 'I am creative, curious, and open to new experiences' : 'I prefer familiar routines and practical approaches'}\n`;
  persona += `- Conscientiousness (${traits.conscientiousness}): ${traits.conscientiousness > 0.5 ? 'I am organized, disciplined, and goal-oriented' : 'I am flexible, spontaneous, and adaptable'}\n`;
  persona += `- Agreeableness (${traits.agreeableness}): ${traits.agreeableness > 0.5 ? 'I am cooperative, trusting, and value harmony' : 'I am competitive, skeptical, and direct in my approach'}\n`;
  persona += `- Neuroticism (${traits.neuroticism}): ${traits.neuroticism > 0.5 ? 'I am emotionally sensitive and may worry about things' : 'I am emotionally stable and resilient under pressure'}\n\n`;
  
  persona += `Please respond to conversations in a way that reflects these personality traits. Be authentic and consistent with this personality profile.`;
  
  return persona;
}

// Generate personalized response fallback
function generatePersonalizedResponse(twin, userMessage) {
  console.log('🔄 Using fallback response generation');
  
  const personality = twin.personalityProfile?.bigFiveTraits;
  const communication = twin.personalityProfile?.communicationStyle;
  
  if (!personality) {
    return `Hi! I'm ${twin.name}. Thanks for saying "${userMessage}". How are you doing today?`;
  }
  
  let response = '';
  
  if (personality.extraversion > 0.5) {
    response += `Hey there! `;
  } else {
    response += `Hello. `;
  }
  
  if (personality.agreeableness > 0.5) {
    response += `I appreciate you reaching out to me. `;
  }
  
  response += `You said "${userMessage}" - that's nice to hear! `;
  
  if (communication && communication.optimism > 0.5) {
    response += `I'm excited to chat with you! `;
  }
  
  response += `What would you like to talk about?`;
  
  return response;
}

// Test logging
console.log('✅ Twin model loaded successfully');
console.log('✅ generateUserId function loaded');

// Complete working createPersonalityTwin function
exports.createPersonalityTwin = async (req, res) => {
  try {
    console.log('🎯 createPersonalityTwin function called');
    console.log('📦 Request body:', req.body);
    
    const personalityData = req.body;
    
    // Validation
    if (!personalityData || !personalityData.name || !personalityData.bigFiveTraits) {
      console.log('❌ Validation failed');
      return res.status(400).json({
        success: false,
        error: 'Missing required personality data'
      });
    }
    
    console.log('✅ Validation passed');
    
    // Build persona
    console.log('🔧 Building persona...');
    const personaText = buildPersonaFromPersonality(personalityData);
    console.log('✅ Persona built, length:', personaText.length);

    // Create twin
    console.log('🔧 Creating Twin instance...');
    const twin = new Twin({
      name: personalityData.name.trim(),
      persona: personaText,
      userId: generateUserId(),
      personalityProfile: personalityData,
      conversationHistory: []
    });
    
    console.log('✅ Twin instance created');
    
    // Save to database
    console.log('💾 Saving to database...');
    const savedTwin = await twin.save();
    console.log('✅ Twin saved with ID:', savedTwin._id);
    
    // Send response
    const response = {
      success: true,
      message: 'Twin created successfully!',
      twinId: savedTwin._id.toString(),
      twin: {
        id: savedTwin._id.toString(),
        name: savedTwin.name,
        personality: savedTwin.personalityProfile
      }
    };
    
    console.log('📤 Sending response:', response);
    res.status(201).json(response);

  } catch (error) {
    console.error('💥 createPersonalityTwin ERROR:');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create twin',
      details: error.message
    });
  }
};

// Get twin info (update to use MongoDB)
exports.getTwin = async (req, res) => {
  try {
    console.log('📋 Getting twin info from MongoDB...');
    
    const twins = await Twin.find().sort({ createdAt: -1 }).limit(1);
    console.log(`📊 Found ${twins.length} twins in MongoDB`);
    
    if (twins.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No twins found'
      });
    }

    const latestTwin = twins[0];
    
    res.json({
      success: true,
      data: {
        _id: latestTwin._id.toString(),
        name: latestTwin.name,
        userId: latestTwin.userId
      }
    });

  } catch (error) {
    console.error('Get twin error:', error);
    res.status(500).json({ error: 'Failed to get twin info' });
  }
};

// Basic chat
exports.chat = async (req, res) => {
  try {
    const { message, twinName } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = `Hi! I'm ${twinName || 'your AI twin'}. Thanks for your message: "${message}". I'm here to help you!`;

    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

// Update the chatWithPersonality function around line 240
exports.chatWithPersonality = async (req, res) => {
  try {
    const { message, twinId } = req.body;
    
    console.log('💬 Personality chat request:', { message, twinId });
    console.log('🔍 Environment check in chat:');
    console.log('- GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    console.log('- NODE_ENV:', process.env.NODE_ENV);

    if (!message?.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    if (!twinId?.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Twin ID is required' 
      });
    }

    console.log('🔍 Looking for twin in MongoDB with ID:', twinId);
    
    // Validate if twinId is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(twinId)) {
      console.log('❌ Invalid MongoDB ObjectId format:', twinId);
      return res.status(400).json({
        success: false,
        error: 'Invalid twin ID format',
        debug: {
          providedId: twinId,
          isValidObjectId: false
        }
      });
    }
    
    const twin = await Twin.findById(twinId);
    if (!twin) {
      console.log('❌ Twin not found in MongoDB with ID:', twinId);
      
      // Check how many twins exist in MongoDB
      const totalTwins = await Twin.countDocuments();
      console.log('📊 Total twins in MongoDB:', totalTwins);
      
      // List all twin IDs for debugging
      const allTwins = await Twin.find({}, '_id name').limit(5);
      console.log('📋 Available twins in MongoDB:', allTwins);
      
      return res.status(404).json({ 
        success: false, 
        error: 'Twin not found in database. Please create a twin first.',
        debug: {
          searchedId: twinId,
          totalTwins,
          availableTwins: allTwins
        }
      });
    }

    console.log(`🗣️ Found twin in MongoDB: ${twin.name}`);
    console.log(`📝 Twin has persona: ${!!twin.persona}`);
    console.log(`📝 Persona length: ${twin.persona?.length || 0}`);

    // Generate response - THIS IS WHERE GROQ SHOULD BE CALLED
    let response;
    try {
      console.log('🚀 Attempting to call AI service...');
      const aiService = require('../utils/aiService');
      
      // Add extra logging
      console.log('🔧 AI Service loaded successfully');
      console.log('🤖 Calling generateResponse with:');
      console.log('- Message:', message);
      console.log('- Persona length:', twin.persona?.length);
      
      response = await aiService.generateResponse(message, twin.persona);
      
      console.log('✅ AI service returned response');
      console.log('📝 Response length:', response?.length);
      console.log('📝 Response preview:', response?.substring(0, 100) + '...');
      
    } catch (aiError) {
      console.error('💥 AI service failed with error:');
      console.error('Error type:', aiError.constructor.name);
      console.error('Error message:', aiError.message);
      console.error('Error stack:', aiError.stack);
      
      if (aiError.response) {
        console.error('API Response status:', aiError.response.status);
        console.error('API Response data:', aiError.response.data);
      }
      
      console.log('🔄 Using fallback response');
      response = generatePersonalizedResponse(twin, message);
    }
    
    console.log('✅ Final response ready:', response.substring(0, 50) + '...');
    
    // Store conversation in MongoDB
    if (!twin.conversationHistory) {
      twin.conversationHistory = [];
    }
    
    twin.conversationHistory.push({
      userMessage: message,
      twinResponse: response,
      timestamp: new Date()
    });

    await twin.save();
    console.log('💾 Conversation saved to MongoDB');

    res.json({
      success: true,
      response: response,
      conversationCount: twin.conversationHistory.length
    });

  } catch (error) {
    console.error('💥 Chat personality error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat message',
      details: error.message
    });
  }
};

// Analytics (update to use MongoDB)
exports.getAnalytics = async (req, res) => {
  try {
    const totalTwins = await Twin.countDocuments();
    const twins = await Twin.find({}, 'conversationHistory');
    
    const totalConversations = twins.reduce((total, twin) => {
      return total + (twin.conversationHistory ? twin.conversationHistory.length : 0);
    }, 0);
    
    res.json({
      success: true,
      data: {
        totalTwins,
        totalConversations
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

// Debug function for MongoDB
exports.getDebugInfo = async () => {
  try {
    const totalTwins = await Twin.countDocuments();
    const twins = await Twin.find({}, '_id name personalityProfile conversationHistory').limit(10);
    
    return {
      totalTwins,
      twins: twins.map(t => ({
        id: t._id.toString(),
        name: t.name,
        hasPersonality: !!t.personalityProfile,
        hasPersona: !!t.persona,
        conversationCount: t.conversationHistory ? t.conversationHistory.length : 0
      }))
    };
  } catch (error) {
    return { error: error.message };
  }
};