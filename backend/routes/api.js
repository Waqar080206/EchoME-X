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

module.exports = router;