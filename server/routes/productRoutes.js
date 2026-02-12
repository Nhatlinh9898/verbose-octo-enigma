const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/', protect, productController.createProduct);
router.put('/:id/status', protect, productController.updateProductStatus);

module.exports = router;
