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
const liveStreamRoutes = require('./routes/liveStreamRoutes');
const contentRoutes = require('./routes/contentRoutes');
const userRoutes = require('./routes/userRoutes');
const avatarRoutes = require('./routes/avatarRoutes');
const supportRoutes = require('./routes/supportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dealsRoutes = require('./routes/dealsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const biddingRoutes = require('./routes/biddingRoutes');

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

// Pass io instance to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/livestreams', liveStreamRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/avatars', avatarRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bidding', biddingRoutes);

// Socket.io logic for real-time bidding and live streaming
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 1. Người dùng tham gia vào "phòng" của một sản phẩm cụ thể
  socket.on('join_product_room', (productId) => {
    socket.join(productId);
    console.log(`User ${socket.id} joined room ${productId}`);
  });

  // 2. Tham gia live stream room
  socket.on('join_stream_room', (streamId) => {
    socket.join(streamId);
    console.log(`User ${socket.id} joined stream room ${streamId}`);
  });

  // 3. Xử lý khi có người đặt giá (Bid)
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

  // 4. Xử lý chat message trong live stream
  socket.on('send_chat_message', async (data) => {
    const { streamId, userId, message } = data;
    
    try {
      const LiveStream = require('./models/LiveStream');
      const User = require('./models/User');
      
      const stream = await LiveStream.findById(streamId);
      const user = await User.findById(userId);
      
      if (!stream || !user) {
        socket.emit('error', 'Stream hoặc user không tồn tại');
        return;
      }

      const chatMessage = {
        userId: userId,
        userName: user.fullName,
        message,
        timestamp: new Date()
      };

      // Lưu vào DB
      stream.chatMessages.push(chatMessage);
      await stream.save();

      // Gửi đến tất cả trong stream room
      io.to(streamId).emit('new_chat_message', chatMessage);

      console.log(`Chat message in stream ${streamId} by user ${userId}`);
    } catch (error) {
      console.error('Chat error:', error);
      socket.emit('error', 'Lỗi khi gửi tin nhắn');
    }
  });

  // 5. Cập nhật số người xem live stream
  socket.on('update_viewer_count', async (data) => {
    const { streamId, count } = data;
    
    try {
      const LiveStream = require('./models/LiveStream');
      
      const stream = await LiveStream.findById(streamId);
      if (stream) {
        stream.viewerCount = count;
        if (count > stream.maxViewers) {
          stream.maxViewers = count;
        }
        await stream.save();

        // Gửi đến tất cả trong stream room
        io.to(streamId).emit('viewer_count_update', { count, maxViewers: stream.maxViewers });
      }
    } catch (error) {
      console.error('Viewer count error:', error);
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
