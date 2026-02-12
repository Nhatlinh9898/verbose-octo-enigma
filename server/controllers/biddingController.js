const Bid = require('../models/Bid');
const Product = require('../models/Product');

// @desc    Place a bid on a product
// @route   POST /api/bidding/place
exports.placeBid = async (req, res) => {
  try {
    const { productId, amount, isAutoBid = false, maxAutoBidAmount = null } = req.body;

    if (!productId || !amount) {
      return res.status(400).json({ message: 'Product ID and bid amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Bid amount must be greater than 0' });
    }

    // Mock product data
    const product = {
      _id: productId,
      title: 'Vintage Watch',
      currentBid: 500,
      minBidIncrement: 10,
      endTime: new Date('2024-02-15T23:59:59Z'),
      status: 'AVAILABLE'
    };

    // Check if product is still available for bidding
    if (product.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Product is not available for bidding' });
    }

    // Check if bid is higher than current bid
    if (amount <= product.currentBid) {
      return res.status(400).json({ 
        message: `Bid must be higher than current bid of $${product.currentBid}` 
      });
    }

    // Check bid increment
    const minNextBid = product.currentBid + product.minBidIncrement;
    if (amount < minNextBid) {
      return res.status(400).json({ 
        message: `Minimum next bid is $${minNextBid}` 
      });
    }

    // Mock bid creation
    const bid = {
      _id: `bid_${Date.now()}`,
      productId,
      userId: req.user?._id || 'mock_user_id',
      userName: req.user?.fullName?.split(' ').pop() || 'User',
      amount,
      status: 'ACTIVE',
      isAutoBid,
      maxAutoBidAmount,
      bidIncrement: product.minBidIncrement,
      timestamp: new Date(),
      ipAddress: req.ip || '',
      userAgent: req.get('User-Agent') || ''
    };

    // Mock updated product
    const updatedProduct = {
      ...product,
      currentBid: amount,
      bidCount: (product.bidCount || 0) + 1,
      lastBidAt: new Date()
    };

    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Error placing bid' });
  }
};

// @desc    Get bid history for a product
// @route   GET /api/bidding/history/:productId
exports.getBidHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 50 } = req.query;

    // Mock bid history
    const bidHistory = [
      {
        _id: 'bid_1',
        productId,
        userId: 'user_1',
        userName: 'John',
        amount: 650,
        status: 'ACTIVE',
        timestamp: new Date('2024-02-12T10:30:00Z'),
        isAutoBid: false
      },
      {
        _id: 'bid_2',
        productId,
        userId: 'user_2',
        userName: 'Sarah',
        amount: 620,
        status: 'OUTBID',
        timestamp: new Date('2024-02-12T10:25:00Z'),
        isAutoBid: false
      },
      {
        _id: 'bid_3',
        productId,
        userId: 'user_3',
        userName: 'Mike',
        amount: 600,
        status: 'OUTBID',
        timestamp: new Date('2024-02-12T10:20:00Z'),
        isAutoBid: true
      }
    ];

    res.json({
      productId,
      bids: bidHistory,
      total: bidHistory.length,
      highestBid: bidHistory[0],
      totalBids: bidHistory.length
    });
  } catch (error) {
    console.error('Get bid history error:', error);
    res.status(500).json({ message: 'Error fetching bid history' });
  }
};

// @desc    Get current highest bid for a product
// @route   GET /api/bidding/highest/:productId
exports.getHighestBid = async (req, res) => {
  try {
    const { productId } = req.params;

    // Mock highest bid
    const highestBid = {
      _id: 'bid_1',
      productId,
      userId: 'user_1',
      userName: 'John',
      amount: 650,
      status: 'ACTIVE',
      timestamp: new Date('2024-02-12T10:30:00Z'),
      isAutoBid: false,
      timeLeft: 86400 // 24 hours in seconds
    };

    res.json(highestBid);
  } catch (error) {
    console.error('Get highest bid error:', error);
    res.status(500).json({ message: 'Error fetching highest bid' });
  }
};

// @desc    Get user's bidding history
// @route   GET /api/bidding/my-bids
exports.getMyBids = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    // Mock user bids
    const myBids = [
      {
        _id: 'bid_1',
        productId: 'prod_1',
        productTitle: 'Vintage Watch',
        productImage: 'https://picsum.photos/seed/watch/400/400',
        amount: 650,
        status: 'WINNING',
        timestamp: new Date('2024-02-12T10:30:00Z'),
        isAutoBid: false,
        currentBid: 650,
        endTime: new Date('2024-02-15T23:59:59Z')
      },
      {
        _id: 'bid_2',
        productId: 'prod_2',
        productTitle: 'Antique Vase',
        productImage: 'https://picsum.photos/seed/vase/400/400',
        amount: 320,
        status: 'OUTBID',
        timestamp: new Date('2024-02-11T15:45:00Z'),
        isAutoBid: true,
        currentBid: 350,
        endTime: new Date('2024-02-14T23:59:59Z')
      }
    ];

    // Apply status filter if provided
    let filteredBids = myBids;
    if (status) {
      filteredBids = myBids.filter(bid => bid.status === status);
    }

    const startIndex = (page - 1) * limit;
    const paginatedBids = filteredBids.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      bids: paginatedBids,
      totalPages: Math.ceil(filteredBids.length / limit),
      currentPage: parseInt(page),
      total: filteredBids.length,
      stats: {
        totalBids: myBids.length,
        winningBids: myBids.filter(b => b.status === 'WINNING').length,
        outbidBids: myBids.filter(b => b.status === 'OUTBID').length,
        totalAmount: myBids.reduce((sum, b) => sum + b.amount, 0)
      }
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ message: 'Error fetching your bids' });
  }
};

// @desc    Withdraw a bid
// @route   DELETE /api/bidding/withdraw/:bidId
exports.withdrawBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Mock bid withdrawal
    const withdrawnBid = {
      _id: bidId,
      status: 'WITHDRAWN',
      withdrawnAt: new Date()
    };

    res.json({
      message: 'Bid withdrawn successfully',
      bid: withdrawnBid
    });
  } catch (error) {
    console.error('Withdraw bid error:', error);
    res.status(500).json({ message: 'Error withdrawing bid' });
  }
};

// @desc    Set up auto-bid
// @route   POST /api/bidding/auto-bid
exports.setAutoBid = async (req, res) => {
  try {
    const { productId, maxAmount, bidIncrement = 10 } = req.body;

    if (!productId || !maxAmount) {
      return res.status(400).json({ message: 'Product ID and maximum amount are required' });
    }

    // Mock auto-bid setup
    const autoBid = {
      _id: `auto_bid_${Date.now()}`,
      productId,
      userId: req.user?._id || 'mock_user_id',
      maxAmount,
      bidIncrement,
      isActive: true,
      currentBid: 0,
      createdAt: new Date()
    };

    res.status(201).json({
      message: 'Auto-bid set up successfully',
      autoBid
    });
  } catch (error) {
    console.error('Set auto-bid error:', error);
    res.status(500).json({ message: 'Error setting up auto-bid' });
  }
};

// @desc    Cancel auto-bid
// @route   DELETE /api/bidding/auto-bid/:autoBidId
exports.cancelAutoBid = async (req, res) => {
  try {
    const { autoBidId } = req.params;

    // Mock auto-bid cancellation
    res.json({
      message: 'Auto-bid cancelled successfully',
      autoBidId
    });
  } catch (error) {
    console.error('Cancel auto-bid error:', error);
    res.status(500).json({ message: 'Error cancelling auto-bid' });
  }
};

// @desc    Get bidding statistics
// @route   GET /api/bidding/stats
exports.getBiddingStats = async (req, res) => {
  try {
    // Mock statistics
    const stats = {
      totalActiveAuctions: 156,
      totalBidsPlaced: 12450,
      totalBidders: 3420,
      averageBidAmount: 285,
      highestBidToday: 12500,
      mostActiveCategory: 'Electronics',
      bidDistribution: [
        { range: '$0-$100', count: 4567 },
        { range: '$100-$500', count: 3890 },
        { range: '$500-$1000', count: 2340 },
        { range: '$1000-$5000', count: 1234 },
        { range: '$5000+', count: 419 }
      ],
      autoBidUsage: {
        totalAutoBids: 2340,
        percentage: 18.8,
        avgMaxAmount: 1250
      },
      timeDistribution: [
        { hour: '09:00', bids: 234 },
        { hour: '12:00', bids: 456 },
        { hour: '15:00', bids: 345 },
        { hour: '18:00', bids: 567 },
        { hour: '21:00', bids: 389 }
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Get bidding stats error:', error);
    res.status(500).json({ message: 'Error fetching bidding statistics' });
  }
};

// @desc    Get auction status for a product
// @route   GET /api/bidding/auction-status/:productId
exports.getAuctionStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    // Mock auction status
    const auctionStatus = {
      productId,
      status: 'ACTIVE', // ACTIVE, ENDED, CANCELLED
      currentBid: 650,
      bidCount: 23,
      timeLeft: 86400, // seconds
      endTime: new Date('2024-02-15T23:59:59Z'),
      highestBidder: {
        userId: 'user_1',
        userName: 'John'
      },
      minNextBid: 660,
      bidIncrement: 10,
      isReserveMet: true,
      reservePrice: 500,
      watchers: 45,
      views: 1250
    };

    res.json(auctionStatus);
  } catch (error) {
    console.error('Get auction status error:', error);
    res.status(500).json({ message: 'Error fetching auction status' });
  }
};
