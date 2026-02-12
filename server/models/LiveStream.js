const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  hostAvatar: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: { 
    type: String, 
    enum: ['SCHEDULED', 'LIVE', 'ENDED'], 
    default: 'SCHEDULED' 
  },
  startTime: { type: Date },
  endTime: { type: Date },
  viewerCount: { type: Number, default: 0 },
  maxViewers: { type: Number, default: 0 },
  streamKey: String, // For RTMP streaming
  chatMessages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('LiveStream', liveStreamSchema);
