const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Bidding handled primarily through Socket.io for real-time updates
// But we can provide REST endpoints for backup/fallback

module.exports = router;
