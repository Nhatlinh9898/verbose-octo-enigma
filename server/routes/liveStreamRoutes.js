const express = require('express');
const router = express.Router();
const liveStreamController = require('../controllers/liveStreamController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', liveStreamController.getLiveStreams);
router.get('/:id', liveStreamController.getLiveStreamById);

// Protected routes
router.post('/', protect, liveStreamController.createLiveStream);
router.put('/:id/status', protect, liveStreamController.updateStreamStatus);
router.post('/:id/chat', protect, liveStreamController.addChatMessage);

module.exports = router;
