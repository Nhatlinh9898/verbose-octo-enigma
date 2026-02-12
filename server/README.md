# AmazeBid Backend Server

Backend server cho AmazeBid - Hybrid E-commerce & Auction Platform với AI KOL Creator Studio.

## Công nghệ

- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database với Mongoose ODM
- **Socket.io** - Real-time bidding và live streaming
- **JWT** - Authentication
- **Google Gemini AI** - AI content generation

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình môi trường:
```bash
# Sao chép .env.example sang .env và điền thông tin
cp .env.example .env
```

3. Khởi động server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/login-phone` - Đăng nhập bằng SĐT (Mock OTP)
- `GET /api/auth/profile` - Lấy thông tin user (cần token)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Đăng sản phẩm mới
- `PUT /api/products/:id/status` - Cập nhật trạng thái sản phẩm

### Orders
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders/me` - Lấy danh sách đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

### AI Services
- `POST /api/ai/generate-content` - Tạo nội dung AI
- `POST /api/ai/generate-kol` - Tạo profile KOL AI

## Real-time Events (Socket.io)

### Client Events
- `join_product_room` - Tham gia phòng đấu giá sản phẩm
- `place_bid` - Đặt giá thầu

### Server Events
- `new_bid_update` - Cập nhật giá thầu mới
- `error` - Thông báo lỗi

## Cấu trúc Database

### User Schema
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  balance: Number (default: 0),
  avatar: String,
  role: String (USER|ADMIN),
  socialAccounts: [{ provider: String, id: String }]
}
```

### Product Schema
```javascript
{
  title: String,
  description: String,
  image: String,
  category: String,
  type: String (FIXED_PRICE|AUCTION),
  price: Number,
  currentBid: Number,
  bidCount: Number,
  endTime: Date,
  sellerId: ObjectId (ref: User),
  status: String,
  bidHistory: [Bid]
}
```

## Môi trường Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/amazebid
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## Deployment

1. Cấu hình MongoDB Atlas
2. Đặt environment variables
3. Deploy lên Heroku, Vercel, hoặc Railway

## License

MIT
