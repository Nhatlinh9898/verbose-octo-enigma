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
    required: true // Sketchfab 3D model ID or local file path
  },
  modelType: {
    type: String,
    enum: ['SKETCHFAB', 'LOCAL_FILE', 'CUSTOM_URL'],
    default: 'LOCAL_FILE'
  },
  modelPath: {
    type: String,
    default: '' // Local file path: /uploads/3d-models/avatars/user_id/model.fbx
  },
  modelFormat: {
    type: String,
    enum: ['FBX', 'GLB', 'GLTF', 'OBJ', 'DAE'],
    default: 'FBX'
  },
  texturePath: {
    type: String,
    default: ''
  },
  animationPaths: {
    idle: { type: String, default: '' },
    talking: { type: String, default: '' },
    greeting: { type: String, default: '' },
    walking: { type: String, default: '' }
  },
  thumbnail: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: '' // Logo path: /uploads/logos/avatar_logo.png
  },
  logoPosition: {
    type: String,
    enum: ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'CENTER'],
    default: 'TOP_RIGHT'
  },
  logoSize: {
    type: String,
    enum: ['SMALL', 'MEDIUM', 'LARGE'],
    default: 'SMALL'
  },
  logoOpacity: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
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
