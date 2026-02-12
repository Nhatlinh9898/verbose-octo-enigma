const Avatar = require('../models/Avatar');

// @desc    Get all avatars for a user
// @route   GET /api/avatars
exports.getAvatars = async (req, res) => {
  try {
    // Return empty array for now since no database connection
    const avatars = [];
    res.json(avatars);
  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({ message: 'Error fetching avatars' });
  }
};

// @desc    Get public avatars
// @route   GET /api/avatars/public
exports.getPublicAvatars = async (req, res) => {
  try {
    // Return empty array for now since no avatars exist yet
    const avatars = [];
    res.json(avatars);
  } catch (error) {
    console.error('Get public avatars error:', error);
    res.status(500).json({ message: 'Error fetching public avatars' });
  }
};

// @desc    Get single avatar
// @route   GET /api/avatars/:id
exports.getAvatarById = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.id);
    
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    // Check if user owns the avatar or it's public
    if (avatar.userId.toString() !== req.user._id.toString() && !avatar.isPublic) {
      return res.status(401).json({ message: 'Not authorized to access this avatar' });
    }

    // Increment usage count
    avatar.usageCount += 1;
    avatar.lastUsed = new Date();
    await avatar.save();

    res.json(avatar);
  } catch (error) {
    console.error('Get avatar error:', error);
    res.status(500).json({ message: 'Error fetching avatar' });
  }
};

// @desc    Create new avatar
// @route   POST /api/avatars
exports.createAvatar = async (req, res) => {
  try {
    const {
      name,
      description,
      modelId,
      thumbnail,
      category,
      personality,
      greetingMessage,
      voiceSettings,
      animations,
      environment,
      isPublic
    } = req.body;

    if (!name || !modelId) {
      return res.status(400).json({ message: 'Name and modelId are required' });
    }

    // Mock avatar creation without database
    const avatar = {
      _id: `avatar_${Date.now()}`,
      userId: 'mock_user_id',
      name,
      description: description || '',
      modelId,
      thumbnail: thumbnail || '',
      category: category || 'CUSTOM',
      personality: personality || [],
      greetingMessage: greetingMessage || 'Xin chào! Tôi là trợ lý ảo của bạn.',
      voiceSettings: voiceSettings || {
        language: 'vi-VN',
        voice: 'female',
        speed: 1.0
      },
      animations: animations || {
        idle: 'idle',
        talking: 'talking',
        greeting: 'wave'
      },
      environment: environment || 'studio',
      isPublic: isPublic || false,
      isActive: true,
      usageCount: 0,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json(avatar);
  } catch (error) {
    console.error('Create avatar error:', error);
    res.status(500).json({ message: 'Error creating avatar' });
  }
};

// @desc    Update avatar
// @route   PUT /api/avatars/:id
exports.updateAvatar = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.id);

    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    // Check if user owns the avatar
    if (avatar.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this avatar' });
    }

    const {
      name,
      description,
      modelId,
      thumbnail,
      category,
      personality,
      greetingMessage,
      voiceSettings,
      animations,
      environment,
      isPublic,
      isActive
    } = req.body;

    avatar.name = name || avatar.name;
    avatar.description = description !== undefined ? description : avatar.description;
    avatar.modelId = modelId || avatar.modelId;
    avatar.thumbnail = thumbnail !== undefined ? thumbnail : avatar.thumbnail;
    avatar.category = category || avatar.category;
    avatar.personality = personality || avatar.personality;
    avatar.greetingMessage = greetingMessage !== undefined ? greetingMessage : avatar.greetingMessage;
    avatar.voiceSettings = voiceSettings || avatar.voiceSettings;
    avatar.animations = animations || avatar.animations;
    avatar.environment = environment || avatar.environment;
    avatar.isPublic = isPublic !== undefined ? isPublic : avatar.isPublic;
    avatar.isActive = isActive !== undefined ? isActive : avatar.isActive;

    const updatedAvatar = await avatar.save();
    res.json(updatedAvatar);
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Error updating avatar' });
  }
};

// @desc    Delete avatar
// @route   DELETE /api/avatars/:id
exports.deleteAvatar = async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.id);

    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    // Check if user owns the avatar
    if (avatar.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this avatar' });
    }

    await avatar.remove();
    res.json({ message: 'Avatar removed successfully' });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ message: 'Error deleting avatar' });
  }
};

// @desc    Get avatar categories
// @route   GET /api/avatars/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = ['HUMAN', 'ROBOT', 'ANIMAL', 'FANTASY', 'CUSTOM'];
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// @desc    Get popular avatars
// @route   GET /api/avatars/popular
exports.getPopularAvatars = async (req, res) => {
  try {
    const avatars = await Avatar.find({ isPublic: true, isActive: true })
      .sort({ usageCount: -1 })
      .limit(10)
      .populate('userId', 'fullName avatar');
    
    res.json(avatars);
  } catch (error) {
    console.error('Get popular avatars error:', error);
    res.status(500).json({ message: 'Error fetching popular avatars' });
  }
};
