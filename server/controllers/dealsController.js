const Product = require('../models/Product');

// @desc    Get all active deals (flash sales, discounts, etc.)
// @route   GET /api/deals
exports.getActiveDeals = async (req, res) => {
  try {
    const { category, minDiscount, sort = 'discount' } = req.query;
    
    // Mock deals data for now
    const deals = [
      {
        _id: 'deal_1',
        productId: 'prod_1',
        title: 'iPhone 15 Pro Max - Flash Sale',
        description: 'Latest iPhone with massive discount',
        originalPrice: 1400,
        dealPrice: 999,
        discountPercentage: 29,
        category: 'Electronics',
        image: 'https://picsum.photos/seed/iphone15/400/400',
        sellerId: 'seller_1',
        sellerName: 'TechStore Official',
        type: 'FLASH_SALE',
        startTime: new Date('2024-02-12T00:00:00Z'),
        endTime: new Date('2024-02-12T23:59:59Z'),
        quantity: 50,
        sold: 23,
        isActive: true,
        featured: true,
        tags: ['hot', 'limited', 'electronics'],
        viewCount: 1250,
        createdAt: new Date('2024-02-10T10:00:00Z')
      },
      {
        _id: 'deal_2',
        productId: 'prod_2',
        title: 'Nike Air Max 270 - Daily Deal',
        description: 'Comfortable running shoes with great discount',
        originalPrice: 180,
        dealPrice: 120,
        discountPercentage: 33,
        category: 'Fashion',
        image: 'https://picsum.photos/seed/nike270/400/400',
        sellerId: 'seller_2',
        sellerName: 'SportZone',
        type: 'DAILY_DEAL',
        startTime: new Date('2024-02-12T00:00:00Z'),
        endTime: new Date('2024-02-12T23:59:59Z'),
        quantity: 100,
        sold: 67,
        isActive: true,
        featured: false,
        tags: ['fashion', 'sports', 'daily'],
        viewCount: 890,
        createdAt: new Date('2024-02-11T08:00:00Z')
      },
      {
        _id: 'deal_3',
        productId: 'prod_3',
        title: 'Sony WH-1000XM5 - Weekend Special',
        description: 'Premium noise-canceling headphones',
        originalPrice: 400,
        dealPrice: 280,
        discountPercentage: 30,
        category: 'Electronics',
        image: 'https://picsum.photos/seed/sonyxm5/400/400',
        sellerId: 'seller_3',
        sellerName: 'AudioPro',
        type: 'WEEKEND_SPECIAL',
        startTime: new Date('2024-02-10T00:00:00Z'),
        endTime: new Date('2024-02-12T23:59:59Z'),
        quantity: 30,
        sold: 18,
        isActive: true,
        featured: true,
        tags: ['audio', 'premium', 'weekend'],
        viewCount: 567,
        createdAt: new Date('2024-02-09T15:00:00Z')
      }
    ];

    // Apply filters
    let filteredDeals = deals;
    
    if (category && category !== 'all') {
      filteredDeals = filteredDeals.filter(deal => 
        deal.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (minDiscount) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.discountPercentage >= parseInt(minDiscount)
      );
    }

    // Apply sorting
    switch (sort) {
      case 'discount':
        filteredDeals.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'price_low':
        filteredDeals.sort((a, b) => a.dealPrice - b.dealPrice);
        break;
      case 'price_high':
        filteredDeals.sort((a, b) => b.dealPrice - a.dealPrice);
        break;
      case 'ending_soon':
        filteredDeals.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;
      case 'popular':
        filteredDeals.sort((a, b) => b.sold - a.sold);
        break;
      default:
        filteredDeals.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    res.json({
      deals: filteredDeals,
      total: filteredDeals.length,
      categories: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'],
      stats: {
        totalActiveDeals: deals.length,
        averageDiscount: Math.round(deals.reduce((sum, deal) => sum + deal.discountPercentage, 0) / deals.length),
        totalSavings: deals.reduce((sum, deal) => sum + (deal.originalPrice - deal.dealPrice), 0),
        hottestDeal: deals.reduce((hottest, deal) => deal.sold > hottest.sold ? deal : hottest, deals[0])
      }
    });
  } catch (error) {
    console.error('Get active deals error:', error);
    res.status(500).json({ message: 'Error fetching deals' });
  }
};

// @desc    Get deal by ID
// @route   GET /api/deals/:id
exports.getDealById = async (req, res) => {
  try {
    const dealId = req.params.id;
    
    // Mock deal data
    const deal = {
      _id: dealId,
      productId: 'prod_1',
      title: 'iPhone 15 Pro Max - Flash Sale',
      description: 'Latest iPhone with massive discount. Features include A17 Pro chip, titanium design, and advanced camera system.',
      originalPrice: 1400,
      dealPrice: 999,
      discountPercentage: 29,
      category: 'Electronics',
      image: 'https://picsum.photos/seed/iphone15/800/600',
      images: [
        'https://picsum.photos/seed/iphone15a/800/600',
        'https://picsum.photos/seed/iphone15b/800/600',
        'https://picsum.photos/seed/iphone15c/800/600'
      ],
      sellerId: 'seller_1',
      sellerName: 'TechStore Official',
      sellerRating: 4.8,
      sellerReviews: 1250,
      type: 'FLASH_SALE',
      startTime: new Date('2024-02-12T00:00:00Z'),
      endTime: new Date('2024-02-12T23:59:59Z'),
      quantity: 50,
      sold: 23,
      isActive: true,
      featured: true,
      tags: ['hot', 'limited', 'electronics', 'apple'],
      viewCount: 1250,
      specifications: {
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        storage: '256GB',
        color: 'Natural Titanium',
        display: '6.7-inch Super Retina XDR',
        processor: 'A17 Pro',
        camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto'
      },
      shipping: {
        freeShipping: true,
        deliveryTime: '2-3 business days',
        returnPolicy: '30 days return'
      },
      createdAt: new Date('2024-02-10T10:00:00Z'),
      updatedAt: new Date('2024-02-12T08:30:00Z')
    };

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Get deal by ID error:', error);
    res.status(500).json({ message: 'Error fetching deal' });
  }
};

// @desc    Create new deal (for sellers)
// @route   POST /api/deals
exports.createDeal = async (req, res) => {
  try {
    const {
      productId,
      dealPrice,
      originalPrice,
      quantity,
      type,
      startTime,
      endTime,
      tags
    } = req.body;

    if (!productId || !dealPrice || !originalPrice || !quantity || !type) {
      return res.status(400).json({ 
        message: 'Product ID, deal price, original price, quantity, and type are required' 
      });
    }

    const discountPercentage = Math.round(((originalPrice - dealPrice) / originalPrice) * 100);

    // Mock deal creation
    const deal = {
      _id: `deal_${Date.now()}`,
      productId,
      title: `Deal for Product ${productId}`,
      description: 'Special discount offer',
      originalPrice,
      dealPrice,
      discountPercentage,
      category: 'Electronics',
      image: 'https://picsum.photos/seed/deal/400/400',
      sellerId: req.user?._id || 'seller_1',
      sellerName: req.user?.fullName || 'Seller Name',
      type: type || 'FLASH_SALE',
      startTime: new Date(startTime || Date.now()),
      endTime: new Date(endTime || Date.now() + 24*60*60*1000), // 24 hours from now
      quantity: parseInt(quantity),
      sold: 0,
      isActive: true,
      featured: false,
      tags: tags || [],
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json(deal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Error creating deal' });
  }
};

// @desc    Update deal (for sellers)
// @route   PUT /api/deals/:id
exports.updateDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const {
      dealPrice,
      quantity,
      endTime,
      tags,
      isActive
    } = req.body;

    // Mock update
    const updatedDeal = {
      _id: dealId,
      message: 'Deal updated successfully',
      updatedAt: new Date()
    };

    if (dealPrice) updatedDeal.dealPrice = dealPrice;
    if (quantity) updatedDeal.quantity = quantity;
    if (endTime) updatedDeal.endTime = new Date(endTime);
    if (tags) updatedDeal.tags = tags;
    if (isActive !== undefined) updatedDeal.isActive = isActive;

    res.json(updatedDeal);
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: 'Error updating deal' });
  }
};

// @desc    Delete deal (for sellers/admins)
// @route   DELETE /api/deals/:id
exports.deleteDeal = async (req, res) => {
  try {
    const dealId = req.params.id;

    // Mock deletion
    res.json({ 
      message: 'Deal deleted successfully',
      dealId 
    });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ message: 'Error deleting deal' });
  }
};

// @desc    Get seller's deals
// @route   GET /api/deals/my-deals
exports.getMyDeals = async (req, res) => {
  try {
    // Mock seller's deals
    const myDeals = [
      {
        _id: 'deal_1',
        productId: 'prod_1',
        title: 'iPhone 15 Pro Max - Flash Sale',
        dealPrice: 999,
        originalPrice: 1400,
        discountPercentage: 29,
        quantity: 50,
        sold: 23,
        isActive: true,
        endTime: new Date('2024-02-12T23:59:59Z'),
        views: 1250,
        revenue: 999 * 23
      }
    ];

    res.json({
      deals: myDeals,
      total: myDeals.length,
      stats: {
        totalDeals: myDeals.length,
        activeDeals: myDeals.filter(d => d.isActive).length,
        totalRevenue: myDeals.reduce((sum, d) => sum + d.revenue, 0),
        totalViews: myDeals.reduce((sum, d) => sum + d.views, 0)
      }
    });
  } catch (error) {
    console.error('Get my deals error:', error);
    res.status(500).json({ message: 'Error fetching your deals' });
  }
};

// @desc    Get deal statistics
// @route   GET /api/deals/stats
exports.getDealStats = async (req, res) => {
  try {
    // Mock statistics
    const stats = {
      totalActiveDeals: 45,
      totalSavings: 125000,
      averageDiscount: 28,
      topCategories: [
        { category: 'Electronics', count: 18, avgDiscount: 32 },
        { category: 'Fashion', count: 12, avgDiscount: 25 },
        { category: 'Home', count: 8, avgDiscount: 22 },
        { category: 'Beauty', count: 4, avgDiscount: 28 },
        { category: 'Sports', count: 3, avgDiscount: 30 }
      ],
      dealTypes: [
        { type: 'FLASH_SALE', count: 25 },
        { type: 'DAILY_DEAL', count: 15 },
        { type: 'WEEKEND_SPECIAL', count: 5 }
      ],
      trendingTags: ['hot', 'limited', 'electronics', 'fashion', 'daily'],
      recentActivity: [
        { type: 'NEW_DEAL', title: 'iPhone 15 Pro Max', discount: 29, time: new Date() },
        { type: 'DEAL_ENDED', title: 'Samsung TV', discount: 35, time: new Date() },
        { type: 'PRICE_DROP', title: 'Nike Shoes', discount: 15, time: new Date() }
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Get deal stats error:', error);
    res.status(500).json({ message: 'Error fetching deal statistics' });
  }
};
