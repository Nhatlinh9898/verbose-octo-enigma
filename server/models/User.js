const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash bằng bcrypt
  phone: { type: String },
  balance: { type: Number, default: 0 }, // Số dư ví
  avatar: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  socialAccounts: [{
    provider: String, // google, facebook
    id: String
  }]
}, { timestamps: true });

// Hash password trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method để kiểm tra password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
