const SupportTicket = require('../models/SupportTicket');

// @desc    Get all tickets for a user
// @route   GET /api/support
exports.getUserTickets = async (req, res) => {
  try {
    // Return empty array for now since no database connection
    const tickets = [];
    res.json(tickets);
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

// @desc    Get all tickets (for admin/support staff)
// @route   GET /api/support/all
exports.getAllTickets = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tickets = await SupportTicket.find(filter)
      .populate('userId', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SupportTicket.countDocuments(filter);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

// @desc    Get single ticket
// @route   GET /api/support/:id
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'fullName email')
      .populate('assignedTo', 'fullName email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns the ticket or is admin/support
    if (ticket.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN' && req.user.role !== 'SUPPORT') {
      return res.status(401).json({ message: 'Not authorized to access this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Error fetching ticket' });
  }
};

// @desc    Create new ticket
// @route   POST /api/support
exports.createTicket = async (req, res) => {
  try {
    const {
      subject,
      category,
      priority,
      description,
      relatedOrderId,
      relatedProductId,
      tags
    } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({ message: 'Subject, category, and description are required' });
    }

    // Mock ticket creation without database
    const ticket = {
      _id: `ticket_${Date.now()}`,
      userId: 'mock_user_id',
      ticketNumber: `TKT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      subject,
      category,
      priority: priority || 'MEDIUM',
      description,
      relatedOrderId,
      relatedProductId,
      tags: tags || [],
      status: 'OPEN',
      messages: [{
        sender: 'CUSTOMER',
        message: description,
        timestamp: new Date()
      }],
      assignedTo: null,
      resolution: '',
      satisfactionRating: null,
      satisfactionComment: '',
      escalated: false,
      escalatedTo: null,
      lastResponseAt: new Date(),
      resolvedAt: null,
      closedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Error creating ticket' });
  }
};

// @desc    Add message to ticket
// @route   POST /api/support/:id/messages
exports.addMessage = async (req, res) => {
  try {
    const { message, sender, attachments } = req.body;

    if (!message || !sender) {
      return res.status(400).json({ message: 'Message and sender are required' });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user owns the ticket or is admin/support
    const isOwner = ticket.userId.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'ADMIN' || req.user.role === 'SUPPORT';

    if (!isOwner && !isStaff) {
      return res.status(401).json({ message: 'Not authorized to access this ticket' });
    }

    // Validate sender based on user role
    if (sender === 'CUSTOMER' && !isOwner) {
      return res.status(401).json({ message: 'Customers can only send messages to their own tickets' });
    }

    if (sender === 'SUPPORT' && !isStaff) {
      return res.status(401).json({ message: 'Only support staff can send support messages' });
    }

    ticket.messages.push({
      sender,
      message,
      timestamp: new Date(),
      attachments: attachments || []
    });

    ticket.lastResponseAt = new Date();

    // Update ticket status based on sender
    if (sender === 'CUSTOMER' && ticket.status === 'PENDING_CUSTOMER') {
      ticket.status = 'IN_PROGRESS';
    } else if (sender === 'SUPPORT' && ticket.status === 'IN_PROGRESS') {
      ticket.status = 'PENDING_CUSTOMER';
    }

    await ticket.save();
    await ticket.populate('userId', 'fullName email');
    await ticket.populate('assignedTo', 'fullName email');

    res.json(ticket);
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Error adding message' });
  }
};

// @desc    Update ticket status
// @route   PUT /api/support/:id/status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status, resolution, assignedTo } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only admin/support can update status
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPPORT') {
      return res.status(401).json({ message: 'Not authorized to update ticket status' });
    }

    ticket.status = status;
    
    if (resolution) {
      ticket.resolution = resolution;
    }

    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }

    if (status === 'RESOLVED') {
      ticket.resolvedAt = new Date();
    } else if (status === 'CLOSED') {
      ticket.closedAt = new Date();
    }

    await ticket.save();
    await ticket.populate('userId', 'fullName email');
    await ticket.populate('assignedTo', 'fullName email');

    res.json(ticket);
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Error updating ticket status' });
  }
};

// @desc    Rate ticket satisfaction
// @route   PUT /api/support/:id/rating
exports.rateTicket = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only ticket owner can rate
    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to rate this ticket' });
    }

    // Only resolved tickets can be rated
    if (ticket.status !== 'RESOLVED') {
      return res.status(400).json({ message: 'Only resolved tickets can be rated' });
    }

    ticket.satisfactionRating = rating;
    ticket.satisfactionComment = comment || '';

    await ticket.save();

    res.json({ message: 'Thank you for your feedback!' });
  } catch (error) {
    console.error('Rate ticket error:', error);
    res.status(500).json({ message: 'Error rating ticket' });
  }
};

// @desc    Get support categories
// @route   GET /api/support/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'GUIDE', name: 'Hướng dẫn sử dụng', description: 'Cần hướng dẫn về cách sử dụng platform' },
      { id: 'PAYMENT', name: 'Quy tắc thanh toán', description: 'Vấn đề liên quan đến thanh toán' },
      { id: 'PACKAGING', name: 'Quy cách đóng gói', description: 'Vấn đề về đóng gói sản phẩm' },
      { id: 'SHIPPING', name: 'Gửi & Nhận hàng', description: 'Vấn đề về vận chuyển' },
      { id: 'RETURN', name: 'Trả hàng & Hoàn tiền', description: 'Yêu cầu trả hàng hoặc hoàn tiền' },
      { id: 'TAX', name: 'Khai báo thuế', description: 'Tư vấn về thuế' },
      { id: 'AGREEMENT', name: 'Hợp đồng thỏa thuận', description: 'Vấn đề về điều khoản dịch vụ' },
      { id: 'OTHER', name: 'Khác', description: 'Các vấn đề khác' }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// @desc    Get ticket statistics (for admin)
// @route   GET /api/support/stats
exports.getTicketStats = async (req, res) => {
  try {
    // Only admin can access stats
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPPORT') {
      return res.status(401).json({ message: 'Not authorized to access statistics' });
    }

    const stats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: 'OPEN' });
    const resolvedTickets = await SupportTicket.countDocuments({ status: 'RESOLVED' });

    res.json({
      total: totalTickets,
      open: openTickets,
      resolved: resolvedTickets,
      byStatus: stats,
      byCategory: categoryStats,
      byPriority: priorityStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};
