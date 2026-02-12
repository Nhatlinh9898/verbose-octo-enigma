const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const { protect } = require('../middleware/authMiddleware');

// Cart routes - temporarily removed auth for testing
router.get('/', cartController.getCart);
router.get('/summary', cartController.getCartSummary);

// Item management
router.post('/add', cartController.addToCart);
router.put('/items/:itemId', cartController.updateItemQuantity);
router.delete('/items/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

// Coupon management
router.post('/apply-coupon', cartController.applyCoupon);
router.delete('/remove-coupon', cartController.removeCoupon);

// Guest cart management
router.post('/merge', cartController.mergeCart);

module.exports = router;
