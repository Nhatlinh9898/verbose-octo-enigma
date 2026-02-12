const Product = require('../models/Product');
const Bid = require('../models/Bid');

// @desc    Fetch all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    
    // Build query
    const query = { status: 'AVAILABLE' };
    
    if (category && category !== 'Tất cả') {
      query.category = category;
    }
    
    if (type && type !== 'ALL') {
      query.type = type;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('sellerId', 'fullName avatar')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'fullName avatar');

    if (product) {
      // Get bid history
      const bidHistory = await Bid.find({ productId: req.params.id })
        .populate('userId', 'fullName avatar')
        .sort({ createdAt: -1 });

      res.json({
        ...product.toObject(),
        bidHistory
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { title, description, image, category, type, price, endTime } = req.body;

    const product = await Product.create({
      title,
      description,
      image,
      category,
      type,
      price,
      endTime,
      sellerId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product status
// @route   PUT /api/products/:id/status
exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    product.status = status;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
