const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', contentController.getAllContent);

// Protected routes
router.post('/', protect, contentController.createContent);
router.get('/me', protect, contentController.getUserContent);

module.exports = router;
