const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/categories', supportController.getCategories);

// Protected routes - temporarily remove auth for testing
router.get('/', supportController.getUserTickets);
router.get('/all', supportController.getAllTickets);
router.get('/stats', supportController.getTicketStats);
router.get('/:id', supportController.getTicketById);
router.post('/', supportController.createTicket);
router.post('/:id/messages', supportController.addMessage);
router.put('/:id/status', supportController.updateTicketStatus);
router.put('/:id/rating', supportController.rateTicket);

module.exports = router;
