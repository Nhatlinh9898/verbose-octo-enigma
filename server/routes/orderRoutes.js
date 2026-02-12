const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/', protect, orderController.createOrder);
router.get('/me', protect, orderController.getUserOrders);
router.put('/:id/status', protect, orderController.updateOrderStatus);

module.exports = router;
