const mongoose = require('mongoose');

const twinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  persona: {
    type: String,
    required: true,
    trim: true,
    minlength: 50
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  personalityProfile: {
    type: Object,
    default: null
  },
  conversationHistory: [{
    userMessage: String,
    twinResponse: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Twin', twinSchema);