const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  modelId: {
    type: String,
    required: true // Sketchfab 3D model ID
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['HUMAN', 'ROBOT', 'ANIMAL', 'FANTASY', 'CUSTOM'],
    default: 'CUSTOM'
  },
  personality: {
    type: [String],
    default: []
  },
  greetingMessage: {
    type: String,
    default: 'Xin chào! Tôi là trợ lý ảo của bạn.'
  },
  voiceSettings: {
    language: {
      type: String,
      default: 'vi-VN'
    },
    voice: {
      type: String,
      default: 'female'
    },
    speed: {
      type: Number,
      default: 1.0
    }
  },
  animations: {
    idle: {
      type: String,
      default: 'idle'
    },
    talking: {
      type: String,
      default: 'talking'
    },
    greeting: {
      type: String,
      default: 'wave'
    }
  },
  environment: {
    type: String,
    default: 'studio'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
avatarSchema.index({ userId: 1 });
avatarSchema.index({ isPublic: 1 });
avatarSchema.index({ category: 1 });

module.exports = mongoose.model('Avatar', avatarSchema);
