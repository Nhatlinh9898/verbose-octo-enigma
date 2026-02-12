require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Cho phép Frontend kết nối
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// Socket.io logic for real-time bidding
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 1. Người dùng tham gia vào "phòng" của một sản phẩm cụ thể
  socket.on('join_product_room', (productId) => {
    socket.join(productId);
    console.log(`User ${socket.id} joined room ${productId}`);
  });

  // 2. Xử lý khi có người đặt giá (Bid)
  socket.on('place_bid', async (data) => {
    const { productId, userId, amount } = data;
    
    try {
      const Product = require('./models/Product');
      const Bid = require('./models/Bid');
      const User = require('./models/User');
      
      // Kiểm tra Database xem giá mới có > giá hiện tại không
      const product = await Product.findById(productId);
      if (!product) {
        socket.emit('error', 'Sản phẩm không tồn tại');
        return;
      }
      
      if (amount <= product.currentBid) {
        socket.emit('error', 'Giá thầu phải cao hơn giá hiện tại');
        return;
      }

      // Lấy thông tin user
      const user = await User.findById(userId);
      if (!user) {
        socket.emit('error', 'Người dùng không tồn tại');
        return;
      }

      // Tạo bid mới
      const newBid = {
        id: `bid_${Date.now()}`,
        userId: userId,
        userName: user.fullName.split(' ').pop() || 'User',
        amount: amount,
        timestamp: new Date().toISOString()
      };

      // Cập nhật DB
      await Product.updateOne(
        { _id: productId }, 
        { 
          currentBid: amount, 
          $inc: { bidCount: 1 },
          $push: { bidHistory: newBid }
        }
      );
      
      await Bid.create({ productId, userId, amount, userName: newBid.userName });

      // 3. Gửi thông báo cập nhật giá mới cho TẤT CẢ mọi người đang xem sản phẩm này
      io.to(productId).emit('new_bid_update', {
        productId,
        newPrice: amount,
        bidderName: newBid.userName,
        timestamp: new Date()
      });

      console.log(`New bid placed: ${amount} on product ${productId} by user ${userId}`);
    } catch (error) {
      console.error('Bid error:', error);
      socket.emit('error', 'Lỗi khi đặt giá thầu');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
