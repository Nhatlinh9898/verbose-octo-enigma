const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  category: String,
  type: { type: String, enum: ['FIXED_PRICE', 'AUCTION'], default: 'FIXED_PRICE' },
  
  // Giá
  price: { type: Number, required: true }, // Giá gốc hoặc Giá khởi điểm
  
  // Đấu giá
  currentBid: { type: Number, default: 0 },
  bidCount: { type: Number, default: 0 },
  endTime: { type: Date }, // Thời gian kết thúc đấu giá
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Affiliate
  isAffiliate: { type: Boolean, default: false },
  affiliateLink: String,
  
  status: { type: String, default: 'AVAILABLE' },
  
  // Thêm các field mới cho KOL và content
  originalPrice: Number, // Giá gốc cho sản phẩm giảm giá
  bidHistory: [{
    id: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    amount: Number,
    timestamp: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
