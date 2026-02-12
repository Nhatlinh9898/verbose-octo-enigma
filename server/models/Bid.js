const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  userName: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'WINNING', 'OUTBID', 'WITHDRAWN'],
    default: 'ACTIVE'
  },
  isAutoBid: {
    type: Boolean,
    default: false
  },
  maxAutoBidAmount: {
    type: Number,
    default: null
  },
  bidIncrement: {
    type: Number,
    default: 10
  },
  timeLeft: {
    type: Number,
    default: null
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Index for faster queries
bidSchema.index({ productId: 1, timestamp: -1 });
bidSchema.index({ userId: 1 });
bidSchema.index({ status: 1 });
bidSchema.index({ amount: -1 });

// Static method to get highest bid for product
bidSchema.statics.getHighestBid = async function(productId) {
  return await this.findOne({ productId, status: 'ACTIVE' })
    .sort({ amount: -1 })
    .populate('userId', 'fullName avatar');
};

// Static method to get bid history for product
bidSchema.statics.getBidHistory = async function(productId, limit = 50) {
  return await this.find({ productId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'fullName avatar');
};

// Static method to get user's bids
bidSchema.statics.getUserBids = async function(userId, options = {}) {
  const { page = 1, limit = 20, status } = options;
  
  const filter = { userId };
  if (status) {
    filter.status = status;
  }
  
  const bids = await this.find(filter)
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('productId', 'title image currentBid');
    
  const total = await this.countDocuments(filter);
  
  return {
    bids,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  };
};

// Pre-save middleware
bidSchema.pre('save', function(next) {
  // Set userName based on userId if not provided
  if (!this.userName && this.userId) {
    // In a real implementation, you'd fetch the user name
    this.userName = 'User';
  }
  next();
});

module.exports = mongoose.model('Bid', bidSchema);
