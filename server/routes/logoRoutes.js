const express = require('express');
const router = express.Router();
const logoController = require('../controllers/logoController');

// Public routes
router.get('/', logoController.getLogos);
router.get('/search/:pattern', logoController.searchLogos);
router.get('/random/:count', logoController.getRandomLogos);
router.get('/:filename', logoController.getLogoByName);

module.exports = router;
