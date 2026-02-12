const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatarController');
// const { protect } = require('../middleware/authMiddleware');

// Public routes - temporarily remove auth for testing
router.get('/public', avatarController.getPublicAvatars);
router.get('/categories', avatarController.getCategories);
router.get('/popular', avatarController.getPopularAvatars);

// Protected routes - temporarily remove auth for testing
router.get('/', avatarController.getAvatars);
router.get('/:id', avatarController.getAvatarById);
router.post('/', avatarController.createAvatar);
router.put('/:id', avatarController.updateAvatar);
router.delete('/:id', avatarController.deleteAvatar);

module.exports = router;
