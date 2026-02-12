const LiveStream = require('../models/LiveStream');
const Product = require('../models/Product');

// @desc    Create new live stream
// @route   POST /api/livestreams
exports.createLiveStream = async (req, res) => {
  try {
    const { title, description, thumbnail, productId, startTime } = req.body;

    const stream = await LiveStream.create({
      title,
      description,
      thumbnail,
      productId,
      startTime,
      hostId: req.user._id,
      hostName: req.user.fullName,
      hostAvatar: req.user.avatar,
      streamKey: `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all live streams
// @route   GET /api/livestreams
exports.getLiveStreams = async (req, res) => {
  try {
    const streams = await LiveStream.find({ status: { $in: ['LIVE', 'SCHEDULED'] } })
      .populate('hostId', 'fullName avatar')
      .populate('productId', 'title image price')
      .sort({ startTime: -1 });

    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single live stream
// @route   GET /api/livestreams/:id
exports.getLiveStreamById = async (req, res) => {
  try {
    const stream = await LiveStream.findById(req.params.id)
      .populate('hostId', 'fullName avatar')
      .populate('productId', 'title image price currentBid bidHistory')
      .populate('chatMessages.userId', 'fullName avatar');

    if (stream) {
      res.json(stream);
    } else {
      res.status(404).json({ message: 'Stream not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update stream status
// @route   PUT /api/livestreams/:id/status
exports.updateStreamStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const stream = await LiveStream.findById(req.params.id);
    
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    // Check if user is the host
    if (stream.hostId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    stream.status = status;
    if (status === 'LIVE') {
      stream.startTime = new Date();
    } else if (status === 'ENDED') {
      stream.endTime = new Date();
    }
    
    await stream.save();

    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add chat message
// @route   POST /api/livestreams/:id/chat
exports.addChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    const stream = await LiveStream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    const chatMessage = {
      userId: req.user._id,
      userName: req.user.fullName,
      message,
      timestamp: new Date()
    };

    stream.chatMessages.push(chatMessage);
    await stream.save();

    // Emit real-time via Socket.io
    const io = req.app.get('io');
    io.to(req.params.id).emit('new_chat_message', chatMessage);

    res.json(chatMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
