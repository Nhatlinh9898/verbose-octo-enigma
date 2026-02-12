const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar, socialAccounts } = req.body;

    const updateData = {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(avatar && { avatar }),
      ...(socialAccounts && { socialAccounts })
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user balance
// @route   PUT /api/users/balance
exports.updateBalance = async (req, res) => {
  try {
    const { amount, type } = req.body; // type: 'add' | 'subtract'

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (type === 'add') {
      user.balance += amount;
    } else if (type === 'subtract') {
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.balance -= amount;
    }

    await user.save();

    res.json({ 
      message: 'Balance updated successfully',
      newBalance: user.balance 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
