const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatarController');
// const { protect } = require('../middleware/authMiddleware');

// Public routes - temporarily remove auth for testing
router.get('/public', avatarController.getPublicAvatars);
router.get('/categories', avatarController.getCategories);
router.get('/popular', avatarController.getPopularAvatars);

// Protected routes - temporarily remove auth for testing
router.post('/upload-model', avatarController.upload3DModel);
router.post('/upload-thumbnail', avatarController.uploadThumbnail);
router.post('/upload-logo', avatarController.uploadLogo);
router.get('/', avatarController.getAvatars);
router.get('/:id', avatarController.getAvatarById);
router.post('/', avatarController.createAvatar);
router.put('/:id', avatarController.updateAvatar);
router.delete('/:id', avatarController.deleteAvatar);

module.exports = router;
