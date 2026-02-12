const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    default: null
  },
  variant: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  couponCode: {
    type: String,
    default: ''
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  estimatedDelivery: {
    type: Date,
    default: null
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, {
  timestamps: true
});

// Index for faster queries
cartSchema.index({ userId: 1 });
cartSchema.index({ isActive: 1 });
cartSchema.index({ expiresAt: 1 });
cartSchema.index({ 'items.productId': 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.calculateTotals();
  this.lastActivityAt = new Date();
  next();
});

// Instance method to calculate totals
cartSchema.methods.calculateTotals = function() {
  let totalAmount = 0;
  let totalItems = 0;

  this.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    totalItems += item.quantity;
  });

  this.totalAmount = totalAmount;
  this.totalItems = totalItems;
  
  // Calculate final amount with discounts, shipping, and tax
  const subtotalAfterCoupon = totalAmount - this.couponDiscount;
  const subtotalAfterShipping = subtotalAfterCoupon + this.shippingCost;
  this.finalAmount = subtotalAfterShipping + this.taxAmount;
};

// Static method to get or create cart
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ userId, isActive: true });
  
  if (!cart) {
    cart = new this({
      userId,
      items: [],
      totalAmount: 0,
      totalItems: 0,
      finalAmount: 0
    });
    await cart.save();
  }
  
  return cart;
};

// Static method to clean expired carts
cartSchema.statics.cleanExpiredCarts = async function() {
  const result = await this.updateMany(
    { 
      expiresAt: { $lt: new Date() },
      isActive: true 
    },
    { 
      isActive: false 
    }
  );
  
  return result.modifiedCount;
};

module.exports = mongoose.model('Cart', cartSchema);
