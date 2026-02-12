const ContentPost = require('../models/ContentPost');

// @desc    Create content post
// @route   POST /api/content
exports.createContent = async (req, res) => {
  try {
    const { title, content, images, tags, category, type } = req.body;

    const post = await ContentPost.create({
      title,
      content,
      images,
      tags,
      category,
      type,
      authorId: req.user._id,
      authorName: req.user.fullName,
      authorAvatar: req.user.avatar,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user content
// @route   GET /api/content/me
exports.getUserContent = async (req, res) => {
  try {
    const posts = await ContentPost.find({ authorId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all published content
// @route   GET /api/content
exports.getAllContent = async (req, res) => {
  try {
    const posts = await ContentPost.find({ status: 'PUBLISHED' })
      .populate('authorId', 'fullName avatar')
      .sort({ publishedAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
