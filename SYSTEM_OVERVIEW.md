# 📋 AmazeBid - Hệ Thống E-commerce & Auction Platform Tổng Quan

## 🎯 Giới Thiệu

AmazeBid là nền tảng thương mại điện tử và đấu giá hybrid tích hợp AI, cho phép người dùng:
- Mua sắm sản phẩm với giá cố định
- Tham gia đấu giá trực tuyến
- Sử dụng KOL (Key Opinion Leader) ảo với avatar 3D
- Livestream bán hàng
- Tương tác với AI assistant

## 🏗️ Kiến Trúc Hệ Thống

### **Frontend (React + TypeScript)**
```
client/
├── components/          # UI Components
├── services/          # API Services
├── context/           # React Context
├── types.ts           # TypeScript Types
├── App.tsx           # Main App Component
└── index.tsx         # Entry Point
```

### **Backend (Node.js + Express)**
```
server/
├── controllers/       # Business Logic
├── models/           # Database Models
├── routes/           # API Routes
├── middleware/       # Custom Middleware
├── config/           # Configuration
├── uploads/          # File Storage
└── server.js         # Server Entry Point
```

### **Database (MongoDB)**
- Users & Authentication
- Products & Listings
- Bids & Auctions
- Orders & Payments
- Avatars & 3D Models
- KOL Profiles
- Support Tickets

## 🚀 Tính Năng Chính

### **1. User Management**
- **Authentication:** JWT-based login/register
- **Profiles:** User profiles with avatars
- **Roles:** USER, SELLER, ADMIN
- **Balance:** Wallet system for transactions

### **2. Product Management**
- **Listings:** Fixed price and auction products
- **Categories:** Multiple product categories
- **Media:** Image and video uploads
- **Search:** Advanced search and filtering

### **3. Bidding System**
- **Real-time Bidding:** Socket.io integration
- **Auto-bid:** Automatic bidding system
- **Bid History:** Complete bid tracking
- **Notifications:** Real-time bid alerts

### **4. KOL & Avatar System**
- **3D Avatars:** Custom 3D character models
- **Logo Branding:** Company logos on avatars
- **Animations:** Idle, talking, greeting animations
- **Voice Settings:** Multi-language TTS support

### **5. Live Streaming**
- **Real-time Streaming:** Live product showcases
- **Chat Integration:** Viewer interaction
- **Viewer Analytics:** Engagement metrics
- **Recording:** Stream recording capability

### **6. AI Integration**
- **Gemini AI:** Google's AI for assistance
- **Content Generation:** AI-powered descriptions
- **Recommendations:** Smart product suggestions
- **Chat Support:** AI customer service

### **7. Payment System**
- **Multiple Methods:** Various payment options
- **Escrow:** Secure payment holding
- **Refunds:** Automated refund system
- **Transaction History:** Complete payment tracking

## 📡 API Endpoints

### **Authentication**
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update profile
```

### **Products**
```
GET    /api/products        # Get all products
GET    /api/products/:id    # Get product details
POST   /api/products        # Create product
PUT    /api/products/:id    # Update product
DELETE /api/products/:id    # Delete product
```

### **Bidding**
```
POST   /api/bidding/place           # Place bid
GET    /api/bidding/history/:id     # Get bid history
GET    /api/bidding/highest/:id     # Get highest bid
GET    /api/bidding/my-bids        # Get user bids
POST   /api/bidding/auto-bid       # Set auto-bid
DELETE /api/bidding/withdraw/:id    # Withdraw bid
```

### **Avatars & 3D Models**
```
POST /api/avatars/upload-model      # Upload 3D model
POST /api/avatars/upload-thumbnail  # Upload thumbnail
POST /api/avatars/upload-logo       # Upload logo
GET  /api/avatars                 # Get user avatars
POST /api/avatars                 # Create avatar
PUT  /api/avatars/:id             # Update avatar
```

### **Live Streaming**
```
GET    /api/livestreams           # Get all streams
GET    /api/livestreams/:id       # Get stream details
POST   /api/livestreams           # Create stream
PUT    /api/livestreams/:id       # Update stream
DELETE /api/livestreams/:id       # Delete stream
```

### **Admin**
```
GET /api/admin/stats               # Dashboard statistics
GET /api/admin/users              # Manage users
GET /api/admin/products           # Manage products
GET /api/admin/orders             # Manage orders
GET /api/admin/reports/financial  # Financial reports
```

## 🗄️ Database Schema

### **User Model**
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String, // hashed
  role: String, // USER, SELLER, ADMIN
  balance: Number,
  avatar: String,
  createdAt: Date,
  lastLogin: Date
}
```

### **Product Model**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  type: String, // FIXED_PRICE, AUCTION
  currentBid: Number,
  minBidIncrement: Number,
  endTime: Date,
  sellerId: ObjectId,
  category: String,
  images: [String],
  status: String // AVAILABLE, SOLD, PENDING
}
```

### **Bid Model**
```javascript
{
  _id: ObjectId,
  productId: ObjectId,
  userId: ObjectId,
  amount: Number,
  status: String, // ACTIVE, WINNING, OUTBID
  isAutoBid: Boolean,
  maxAutoBidAmount: Number,
  timestamp: Date
}
```

### **Avatar Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  modelId: String,
  modelType: String, // SKETCHFAB, LOCAL_FILE, CUSTOM_URL
  modelPath: String,
  modelFormat: String, // FBX, GLB, GLTF, OBJ, DAE
  texturePath: String,
  logo: String,
  logoPosition: String, // TOP_LEFT, TOP_RIGHT, etc.
  logoSize: String, // SMALL, MEDIUM, LARGE
  logoOpacity: Number,
  animations: Object,
  voiceSettings: Object,
  isPublic: Boolean
}
```

## 🔧 File Structure

### **Upload Directory**
```
uploads/
├── 3d-models/
│   ├── avatars/          # User avatar 3D models
│   ├── kol/              # KOL 3D models
│   └── public/           # Public 3D models
├── thumbnails/           # Product/avatar thumbnails
├── logos/               # Avatar/KOL logos
├── textures/            # 3D model textures
└── animations/         # Animation files
```

### **Supported File Formats**
- **3D Models:** FBX, GLB, GLTF, OBJ, DAE
- **Images:** JPG, PNG, WebP
- **Logos:** JPG, PNG, SVG, WebP
- **Textures:** JPG, PNG, TGA

## 🛡️ Security Features

### **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Session management

### **File Upload Security**
- File type validation
- File size limits
- Malicious file detection
- Secure file storage

### **API Security**
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### **Data Protection**
- Environment variables for secrets
- Database connection encryption
- Secure password storage
- Audit logging

## 📊 Real-time Features

### **Socket.io Integration**
- **Real-time Bidding:** Instant bid updates
- **Live Streaming:** Real-time video/audio
- **Chat System:** Live chat during streams
- **Notifications:** Instant alerts and updates

### **Events**
```javascript
// Bidding events
socket.on('place_bid', data)
socket.on('new_bid_update', data)
socket.on('join_product_room', productId)

// Streaming events
socket.on('join_stream_room', streamId)
socket.on('send_chat_message', data)
socket.on('new_chat_message', data)
socket.on('update_viewer_count', data)
```

## 🎨 Frontend Components

### **Core Components**
- **Header:** Navigation and user menu
- **ProductCard:** Product display component
- **BidPanel:** Bidding interface
- **LiveStream:** Video streaming component
- **AvatarViewer:** 3D avatar display
- **ChatPanel:** Live chat interface

### **Pages**
- **Home:** Product discovery
- **Product Detail:** Product information and bidding
- **Live Streams:** Active streams list
- **Profile:** User profile management
- **Dashboard:** Seller/admin dashboard
- **Avatar Studio:** Avatar creation and customization

## 🔧 Development Setup

### **Prerequisites**
- Node.js 16+
- MongoDB 4.4+
- React 18+
- TypeScript 4+

### **Installation**
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start
```

### **Environment Variables**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/amazebid
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

## 📱 Technology Stack

### **Frontend**
- **React 18:** UI framework
- **TypeScript:** Type safety
- **Vite:** Build tool
- **TailwindCSS:** Styling
- **Three.js:** 3D rendering
- **Socket.io-client:** Real-time communication

### **Backend**
- **Node.js:** Runtime environment
- **Express.js:** Web framework
- **MongoDB:** Database
- **Mongoose:** ODM
- **Socket.io:** Real-time communication
- **JWT:** Authentication
- **Multer:** File uploads
- **Gemini AI:** AI integration

### **Infrastructure**
- **Git:** Version control
- **NPM:** Package manager
- **Environment variables:** Configuration
- **RESTful API:** Architecture pattern

## 🚀 Deployment

### **Development**
- Local MongoDB instance
- Development server with hot reload
- Debug logging enabled

### **Production**
- MongoDB Atlas cloud database
- PM2 process management
- Nginx reverse proxy
- SSL certificates
- Environment-specific configuration

## 📈 Performance Optimization

### **Frontend**
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle optimization

### **Backend**
- Database indexing
- Query optimization
- Response caching
- File compression
- Load balancing

## 🔍 Monitoring & Analytics

### **System Monitoring**
- Server health checks
- Database performance
- API response times
- Error tracking

### **Business Analytics**
- User engagement metrics
- Sales analytics
- Bidding patterns
- Stream performance

## 🔄 Future Enhancements

### **Planned Features**
- Mobile app development
- Advanced AI recommendations
- Blockchain integration
- Multi-language support
- Advanced analytics dashboard
- Social features integration

### **Technical Improvements**
- Microservices architecture
- GraphQL API
- Progressive Web App
- Advanced caching
- CDN integration

## 📞 Support & Documentation

### **Documentation Files**
- `SYSTEM_OVERVIEW.md` - This file
- `3D_MODEL_GUIDE.md` - 3D model usage
- `BACKEND_GUIDE.md` - Backend development
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `FULL_SETUP_GUIDE.md` - Complete setup guide

### **API Documentation**
- RESTful API endpoints
- Socket.io events
- Request/response examples
- Error handling

---

## 📝 Summary

AmazeBid là một hệ thống e-commerce và đấu giá toàn diện với:
- ✅ Real-time bidding và live streaming
- ✅ 3D avatar và KOL integration
- ✅ AI-powered features
- ✅ Secure payment system
- ✅ Scalable architecture
- ✅ Modern technology stack

Hệ thống được thiết kế để mở rộng, bảo mật và cung cấp trải nghiệm người dùng tốt nhất cho cả người mua và người bán.
