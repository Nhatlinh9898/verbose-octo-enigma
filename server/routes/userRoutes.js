const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.put('/profile', protect, userController.updateProfile);
router.put('/balance', protect, userController.updateBalance);
router.get('/', protect, userController.getAllUsers); // Admin only

module.exports = router;
