const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  twinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Twin',
    required: true
  },
  followers: { type: Number, default: 2300 },
  engagementRate: { type: Number, default: 87.3 },
  totalInteractions: { type: Number, default: 1250 },
  averageResponseTime: { type: Number, default: 1.2 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);