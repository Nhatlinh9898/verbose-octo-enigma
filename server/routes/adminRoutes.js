const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin middleware - temporarily removed for testing
const adminOnly = (req, res, next) => {
  // Mock admin check - in production, check req.user.role === 'ADMIN'
  req.user = { role: 'ADMIN' };
  next();
};

// Dashboard and Statistics
router.get('/stats', adminOnly, adminController.getDashboardStats);

// User Management
router.get('/users', adminOnly, adminController.getAllUsers);
router.put('/users/:id/status', adminOnly, adminController.updateUserStatus);

// Product Management
router.get('/products', adminOnly, adminController.getAllProducts);
router.put('/products/:id/status', adminOnly, adminController.updateProductStatus);

// Order Management
router.get('/orders', adminOnly, adminController.getAllOrders);

// Reports
router.get('/reports/financial', adminOnly, adminController.getFinancialReports);

// System Management
router.get('/system/health', adminOnly, adminController.getSystemHealth);
router.get('/logs', adminOnly, adminController.getActivityLogs);

module.exports = router;
