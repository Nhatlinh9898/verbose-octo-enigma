const express = require('express');
const router = express.Router();
const biddingController = require('../controllers/biddingController');
// const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/history/:productId', biddingController.getBidHistory);
router.get('/highest/:productId', biddingController.getHighestBid);
router.get('/auction-status/:productId', biddingController.getAuctionStatus);
router.get('/stats', biddingController.getBiddingStats);

// Protected routes - temporarily removed auth for testing
router.post('/place', biddingController.placeBid);
router.get('/my-bids', biddingController.getMyBids);
router.delete('/withdraw/:bidId', biddingController.withdrawBid);
router.post('/auto-bid', biddingController.setAutoBid);
router.delete('/auto-bid/:autoBidId', biddingController.cancelAutoBid);

module.exports = router;
