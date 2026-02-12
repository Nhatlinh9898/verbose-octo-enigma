const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login-phone', authController.loginPhone);

// Protected routes
router.get('/profile', protect, authController.getProfile);

module.exports = router;
