const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const SupportTicket = require('../models/SupportTicket');
const LiveStream = require('../models/LiveStream');
const Avatar = require('../models/Avatar');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const timeRange = req.query.timeRange || 'MONTH';
    let startDate = new Date();

    switch (timeRange) {
      case 'DAY':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'WEEK':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'MONTH':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'QUARTER':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'YEAR':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Mock statistics for now
    const stats = {
      totalUsers: 1250,
      activeUsers: 890,
      totalProducts: 3420,
      activeProducts: 2156,
      totalOrders: 5678,
      completedOrders: 4892,
      totalRevenue: 1250000,
      revenueGrowth: 15.3,
      newUsersThisPeriod: 156,
      newOrdersThisPeriod: 892,
      topCategories: [
        { name: 'Electronics', count: 1234, revenue: 456000 },
        { name: 'Fashion', count: 987, revenue: 234000 },
        { name: 'Home', count: 654, revenue: 189000 }
      ],
      recentActivity: [
        { type: 'NEW_USER', user: 'John Doe', timestamp: new Date() },
        { type: 'NEW_ORDER', order: 'ORD-001', amount: 2500, timestamp: new Date() },
        { type: 'NEW_TICKET', ticket: 'TKT-123', subject: 'Payment Issue', timestamp: new Date() }
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 20, search, status, role } = req.query;
    
    // Mock users for now
    const users = [
      {
        _id: 'user_1',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        status: 'ACTIVE',
        balance: 1500,
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-02-10'),
        orderCount: 12,
        totalSpent: 3500
      },
      {
        _id: 'user_2',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        role: 'SELLER',
        status: 'ACTIVE',
        balance: 2800,
        createdAt: new Date('2024-01-20'),
        lastLogin: new Date('2024-02-11'),
        orderCount: 8,
        totalSpent: 2100
      }
    ];

    res.json({
      users,
      totalPages: 1,
      currentPage: page,
      total: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const userId = req.params.id;

    if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Mock update
    res.json({ 
      message: `User ${userId} status updated to ${status}`,
      userId,
      status 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
exports.getAllProducts = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 20, search, status, category } = req.query;
    
    // Mock products for now
    const products = [
      {
        _id: 'prod_1',
        title: 'iPhone 15 Pro',
        sellerId: 'user_2',
        sellerName: 'Jane Smith',
        category: 'Electronics',
        type: 'FIXED_PRICE',
        price: 1200,
        originalPrice: 1400,
        status: 'AVAILABLE',
        bidCount: 0,
        viewCount: 234,
        createdAt: new Date('2024-02-01'),
        featured: true
      },
      {
        _id: 'prod_2',
        title: 'Vintage Watch',
        sellerId: 'user_1',
        sellerName: 'John Doe',
        category: 'Fashion',
        type: 'AUCTION',
        price: 500,
        currentBid: 650,
        originalPrice: null,
        status: 'AVAILABLE',
        bidCount: 8,
        viewCount: 156,
        createdAt: new Date('2024-02-05'),
        featured: false
      }
    ];

    res.json({
      products,
      totalPages: 1,
      currentPage: page,
      total: products.length
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Update product status
// @route   PUT /api/admin/products/:id/status
exports.updateProductStatus = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { status, featured } = req.body;
    const productId = req.params.id;

    if (!['AVAILABLE', 'SOLD', 'PENDING', 'REMOVED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Mock update
    res.json({ 
      message: `Product ${productId} status updated to ${status}`,
      productId,
      status,
      featured: featured || false
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ message: 'Error updating product status' });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 20, search, status, timeRange } = req.query;
    
    // Mock orders for now
    const orders = [
      {
        _id: 'order_1',
        orderNumber: 'ORD-2024-001',
        buyerId: 'user_1',
        buyerName: 'John Doe',
        sellerId: 'user_2',
        sellerName: 'Jane Smith',
        productId: 'prod_1',
        productTitle: 'iPhone 15 Pro',
        amount: 1200,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        createdAt: new Date('2024-02-08'),
        completedAt: new Date('2024-02-10')
      },
      {
        _id: 'order_2',
        orderNumber: 'ORD-2024-002',
        buyerId: 'user_2',
        buyerName: 'Jane Smith',
        sellerId: 'user_1',
        sellerName: 'John Doe',
        productId: 'prod_2',
        productTitle: 'Vintage Watch',
        amount: 650,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: new Date('2024-02-11'),
        completedAt: null
      }
    ];

    res.json({
      orders,
      totalPages: 1,
      currentPage: page,
      total: orders.length
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Get financial reports
// @route   GET /api/admin/reports/financial
exports.getFinancialReports = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { timeRange = 'MONTH' } = req.query;
    
    // Mock financial data
    const financialData = {
      totalRevenue: 1250000,
      totalOrders: 5678,
      averageOrderValue: 220,
      commissionEarned: 125000,
      paymentProcessingFees: 25000,
      refunds: 15000,
      netRevenue: 1085000,
      revenueByMonth: [
        { month: '2024-01', revenue: 980000, orders: 4567 },
        { month: '2024-02', revenue: 1250000, orders: 5678 }
      ],
      revenueByCategory: [
        { category: 'Electronics', revenue: 456000, orders: 1234 },
        { category: 'Fashion', revenue: 234000, orders: 987 },
        { category: 'Home', revenue: 189000, orders: 654 }
      ],
      topSellers: [
        { sellerId: 'user_2', sellerName: 'Jane Smith', revenue: 45000, orders: 23 },
        { sellerId: 'user_1', sellerName: 'John Doe', revenue: 32000, orders: 18 }
      ]
    };

    res.json(financialData);
  } catch (error) {
    console.error('Get financial reports error:', error);
    res.status(500).json({ message: 'Error fetching financial reports' });
  }
};

// @desc    Get system health
// @route   GET /api/admin/system/health
exports.getSystemHealth = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    // Mock system health data
    const health = {
      status: 'HEALTHY',
      uptime: '15 days, 8 hours',
      memory: {
        used: '2.1 GB',
        total: '4.0 GB',
        percentage: 52.5
      },
      cpu: {
        usage: 23.4,
        cores: 4
      },
      database: {
        status: 'CONNECTED',
        responseTime: '12ms'
      },
      api: {
        requestsPerMinute: 145,
        averageResponseTime: '245ms',
        errorRate: 0.2
      },
      storage: {
        used: '45.2 GB',
        total: '100 GB',
        percentage: 45.2
      },
      lastBackup: new Date('2024-02-12T02:00:00Z'),
      activeConnections: 89
    };

    res.json(health);
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Error fetching system health' });
  }
};

// @desc    Get activity logs
// @route   GET /api/admin/logs
exports.getActivityLogs = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 50, level, action, userId } = req.query;
    
    // Mock activity logs
    const logs = [
      {
        _id: 'log_1',
        timestamp: new Date('2024-02-12T10:30:00Z'),
        level: 'INFO',
        action: 'USER_LOGIN',
        userId: 'user_1',
        userName: 'John Doe',
        details: 'User logged in from IP 192.168.1.1',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...'
      },
      {
        _id: 'log_2',
        timestamp: new Date('2024-02-12T10:25:00Z'),
        level: 'WARNING',
        action: 'FAILED_LOGIN',
        userId: null,
        userName: 'unknown',
        details: 'Failed login attempt for email test@example.com',
        ip: '192.168.1.2',
        userAgent: 'Mozilla/5.0...'
      }
    ];

    res.json({
      logs,
      totalPages: 1,
      currentPage: page,
      total: logs.length
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
};
