const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/generate-content', protect, aiController.generateContent);
router.post('/generate-kol', protect, aiController.generateKOL);

module.exports = router;
