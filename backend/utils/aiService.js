const axios = require('axios');

const generateResponse = async (message, persona) => {
  try {
    console.log('🤖 Generating AI response with GROQ...');
    console.log('📝 Message:', message);
    console.log('👤 Persona:', persona.substring(0, 100) + '...');

    // Use GROQ API if available
    if (process.env.GROQ_API_KEY) {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.1-8b-instant', // ✅ New model name
        messages: [
          {
            role: 'system',
            content: `You are an AI twin with this persona: ${persona}. Respond naturally and authentically based on this personality. Keep responses conversational and under 150 words. Don't say you're processing - just respond naturally as this character would.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      const aiResponse = response.data.choices[0].message.content;
      console.log('✅ GROQ response:', aiResponse.substring(0, 50) + '...');
      return aiResponse;
    }
    
    // If OpenAI key is available, use it
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI twin with this persona: ${persona}. Respond naturally and authentically based on this personality.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    }
    
    // Fallback responses if no API key
    console.log('⚠️ No GROQ API key, using fallback');
    const responses = [
      `Based on my personality, I'd say that's really interesting! ${message.toLowerCase().includes('how') ? 'The key is understanding the context and breaking things down step by step.' : 'I can definitely relate to that perspective.'}`,
      `You know, given who I am, ${message.toLowerCase().includes('what') ? 'I think it depends on various factors, but generally speaking...' : 'that really resonates with me.'} What made you think about that?`,
      `That's a great question! ${message.toLowerCase().includes('why') ? 'There are usually multiple reasons behind things like this.' : 'I see where you\'re coming from.'} Tell me more about your thoughts on this.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];

  } catch (error) {
    console.error('❌ AI Service error:', error.response?.data || error.message);
    
    // Check for specific GROQ errors
    if (error.response?.data?.error?.code === 'model_decommissioned') {
      console.error('🚨 Model decommissioned - check GROQ docs for latest models');
    }
    
    // Better fallback response
    const personalizedResponses = [
      `That's interesting! I'm still learning to process complex thoughts like that. Can you tell me more?`,
      `I appreciate you sharing that with me. Let me think about this differently - what's your take on it?`,
      `You've got me thinking! While I process that, what's been on your mind lately?`
    ];
    
    return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
  }
};

module.exports = { generateResponse };