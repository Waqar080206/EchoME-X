const mongoose = require('mongoose');

const twinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  persona: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  personalityProfile: {
    type: Object,
    default: {}
  },
  conversationHistory: [{
    userMessage: String,
    twinResponse: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

console.log('✅ Twin schema created successfully');

module.exports = mongoose.model('Twin', twinSchema);