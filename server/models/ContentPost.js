const mongoose = require('mongoose');

const contentPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [String], // Array of image URLs
  tags: [String],
  category: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorAvatar: String,
  type: { 
    type: String, 
    enum: ['POST', 'STORY', 'REEL', 'TUTORIAL'], 
    default: 'POST' 
  },
  status: { 
    type: String, 
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
    default: 'DRAFT' 
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    userAvatar: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  publishedAt: Date,
  platforms: [String], // Social platforms where this was shared
  hashtags: [String]
}, { timestamps: true });

module.exports = mongoose.model('ContentPost', contentPostSchema);
