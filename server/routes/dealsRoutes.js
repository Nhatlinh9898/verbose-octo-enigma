const express = require('express');
const router = express.Router();
const dealsController = require('../controllers/dealsController');
// const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', dealsController.getActiveDeals);
router.get('/stats', dealsController.getDealStats);
router.get('/:id', dealsController.getDealById);

// Protected routes - temporarily removed auth for testing
router.post('/', dealsController.createDeal);
router.put('/:id', dealsController.updateDeal);
router.delete('/:id', dealsController.deleteDeal);
router.get('/my-deals', dealsController.getMyDeals);

module.exports = router;
