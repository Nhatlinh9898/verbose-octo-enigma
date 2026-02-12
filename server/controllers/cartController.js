const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    // Mock cart data for now
    const cart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [
        {
          _id: 'item_1',
          productId: 'prod_1',
          title: 'iPhone 15 Pro Max',
          description: 'Latest iPhone with A17 Pro chip',
          price: 999,
          originalPrice: 1400,
          discountAmount: 401,
          quantity: 1,
          image: 'https://picsum.photos/seed/iphone15/400/400',
          category: 'Electronics',
          sellerId: 'seller_1',
          sellerName: 'TechStore Official',
          variant: '256GB - Natural Titanium',
          notes: '',
          dealId: 'deal_1',
          addedAt: new Date('2024-02-12T08:30:00Z')
        },
        {
          _id: 'item_2',
          productId: 'prod_2',
          title: 'Nike Air Max 270',
          description: 'Comfortable running shoes',
          price: 120,
          originalPrice: 180,
          discountAmount: 60,
          quantity: 2,
          image: 'https://picsum.photos/seed/nike270/400/400',
          category: 'Fashion',
          sellerId: 'seller_2',
          sellerName: 'SportZone',
          variant: 'Size 10 - Black',
          notes: 'Gift wrap please',
          dealId: 'deal_2',
          addedAt: new Date('2024-02-12T09:15:00Z')
        }
      ],
      totalAmount: 1239,
      totalItems: 3,
      currency: 'USD',
      couponCode: '',
      couponDiscount: 0,
      shippingCost: 0,
      taxAmount: 99.12,
      finalAmount: 1338.12,
      estimatedDelivery: new Date('2024-02-15T00:00:00Z'),
      lastActivityAt: new Date(),
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date('2024-02-10T10:00:00Z'),
      updatedAt: new Date()
    };

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant = '', notes = '', dealId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Mock product data
    const product = {
      _id: productId,
      title: 'Sample Product',
      description: 'Product description',
      price: 100,
      originalPrice: 150,
      image: 'https://picsum.photos/seed/product/400/400',
      category: 'Electronics',
      sellerId: 'seller_1',
      sellerName: 'Sample Seller'
    };

    // Mock cart item
    const cartItem = {
      _id: `item_${Date.now()}`,
      productId,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discountAmount: product.originalPrice - product.price,
      quantity,
      image: product.image,
      category: product.category,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      variant,
      notes,
      dealId,
      addedAt: new Date()
    };

    // Mock updated cart
    const updatedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [cartItem],
      totalAmount: product.price * quantity,
      totalItems: quantity,
      currency: 'USD',
      couponCode: '',
      couponDiscount: 0,
      shippingCost: 0,
      taxAmount: (product.price * quantity) * 0.08,
      finalAmount: (product.price * quantity) * 1.08,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      lastActivityAt: new Date(),
      isActive: true,
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'Item added to cart successfully',
      cart: updatedCart,
      item: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/items/:itemId
exports.updateItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Mock updated cart
    const updatedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [
        {
          _id: itemId,
          productId: 'prod_1',
          title: 'iPhone 15 Pro Max',
          price: 999,
          quantity,
          image: 'https://picsum.photos/seed/iphone15/400/400'
        }
      ],
      totalAmount: 999 * quantity,
      totalItems: quantity,
      currency: 'USD',
      finalAmount: (999 * quantity) * 1.08,
      lastActivityAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Item quantity updated successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Update item quantity error:', error);
    res.status(500).json({ message: 'Error updating item quantity' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Mock updated cart (empty after removal)
    const updatedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [],
      totalAmount: 0,
      totalItems: 0,
      currency: 'USD',
      finalAmount: 0,
      lastActivityAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Item removed from cart successfully',
      cart: updatedCart,
      removedItemId: itemId
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    // Mock cleared cart
    const clearedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [],
      totalAmount: 0,
      totalItems: 0,
      currency: 'USD',
      finalAmount: 0,
      lastActivityAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Cart cleared successfully',
      cart: clearedCart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

// @desc    Apply coupon code
// @route   POST /api/cart/apply-coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    // Mock coupon validation
    const coupon = {
      code: couponCode.toUpperCase(),
      discount: 50, // $50 discount
      type: 'FIXED', // FIXED or PERCENTAGE
      minimumAmount: 100,
      isValid: couponCode.toUpperCase() === 'SAVE50'
    };

    if (!coupon.isValid) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    // Mock updated cart with coupon
    const updatedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [
        {
          _id: 'item_1',
          productId: 'prod_1',
          title: 'iPhone 15 Pro Max',
          price: 999,
          quantity: 1
        }
      ],
      totalAmount: 999,
      totalItems: 1,
      currency: 'USD',
      couponCode: coupon.code,
      couponDiscount: coupon.discount,
      shippingCost: 0,
      taxAmount: (999 - coupon.discount) * 0.08,
      finalAmount: (999 - coupon.discount) * 1.08,
      lastActivityAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Coupon applied successfully',
      cart: updatedCart,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ message: 'Error applying coupon' });
  }
};

// @desc    Remove coupon code
// @route   DELETE /api/cart/remove-coupon
exports.removeCoupon = async (req, res) => {
  try {
    // Mock updated cart without coupon
    const updatedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: [
        {
          _id: 'item_1',
          productId: 'prod_1',
          title: 'iPhone 15 Pro Max',
          price: 999,
          quantity: 1
        }
      ],
      totalAmount: 999,
      totalItems: 1,
      currency: 'USD',
      couponCode: '',
      couponDiscount: 0,
      shippingCost: 0,
      taxAmount: 999 * 0.08,
      finalAmount: 999 * 1.08,
      lastActivityAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Coupon removed successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({ message: 'Error removing coupon' });
  }
};

// @desc    Get cart summary (for checkout)
// @route   GET /api/cart/summary
exports.getCartSummary = async (req, res) => {
  try {
    // Mock cart summary
    const summary = {
      totalAmount: 1239,
      totalItems: 3,
      couponDiscount: 0,
      shippingCost: 0,
      taxAmount: 99.12,
      finalAmount: 1338.12,
      currency: 'USD',
      estimatedDelivery: new Date('2024-02-15T00:00:00Z'),
      items: [
        {
          productId: 'prod_1',
          title: 'iPhone 15 Pro Max',
          quantity: 1,
          price: 999,
          sellerId: 'seller_1',
          sellerName: 'TechStore Official'
        },
        {
          productId: 'prod_2',
          title: 'Nike Air Max 270',
          quantity: 2,
          price: 120,
          sellerId: 'seller_2',
          sellerName: 'SportZone'
        }
      ]
    };

    res.json(summary);
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ message: 'Error fetching cart summary' });
  }
};

// @desc    Merge guest cart with user cart
// @route   POST /api/cart/merge
exports.mergeCart = async (req, res) => {
  try {
    const { guestCartItems } = req.body;

    if (!guestCartItems || !Array.isArray(guestCartItems)) {
      return res.status(400).json({ message: 'Guest cart items are required' });
    }

    // Mock merged cart
    const mergedCart = {
      _id: 'cart_mock_user_id',
      userId: 'mock_user_id',
      items: guestCartItems.map((item, index) => ({
        _id: `item_${Date.now()}_${index}`,
        productId: item.productId,
        title: item.title || 'Product Title',
        price: item.price || 100,
        quantity: item.quantity || 1,
        image: item.image || 'https://picsum.photos/seed/product/400/400',
        addedAt: new Date()
      })),
      totalAmount: guestCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      totalItems: guestCartItems.reduce((sum, item) => sum + item.quantity, 0),
      currency: 'USD',
      finalAmount: guestCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08,
      lastActivityAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Cart merged successfully',
      cart: mergedCart
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({ message: 'Error merging cart' });
  }
};
