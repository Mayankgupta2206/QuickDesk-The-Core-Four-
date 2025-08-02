const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/tickets - Get all tickets (with role-based filtering)
router.get('/', [
  query('status').optional().isIn(['open', 'in-progress', 'resolved', 'closed']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('category').optional().isIn(['technical', 'billing', 'general', 'bug', 'feature-request']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { status, priority, category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter based on user role
    let filter = {};
    
    if (req.user.role === 'user') {
      // Users can only see their own tickets
      filter.createdBy = req.user._id;
    } else if (req.user.role === 'support') {
      // Support agents can see tickets assigned to them or unassigned tickets
      filter.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null }
      ];
    }
    // Admins can see all tickets (no additional filter)

    // Add query filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'email role')
      .populate('assignedTo', 'email role')
      .populate('assignedBy', 'email role')
      .populate('comments.user', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/tickets - Create a new ticket
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('category').optional().isIn(['technical', 'billing', 'general', 'bug', 'feature-request']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { title, description, priority, category, tags } = req.body;

    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'medium',
      category: category || 'general',
      createdBy: req.user._id,
      tags: tags || []
    });

    await ticket.save();

    // Populate user details
    await ticket.populate('createdBy', 'email role');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: { ticket }
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/tickets/:id - Get a specific ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'email role')
      .populate('assignedTo', 'email role')
      .populate('assignedBy', 'email role')
      .populate('comments.user', 'email role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { ticket }
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/tickets/:id - Update a ticket
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['open', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('category').optional().isIn(['technical', 'billing', 'general', 'bug', 'feature-request']).withMessage('Invalid category'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid assignedTo ID'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only admins and support agents can assign tickets
    if (req.body.assignedTo && req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and support agents can assign tickets'
      });
    }

    // Update fields
    const updateFields = ['title', 'description', 'priority', 'category', 'tags'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    // Handle status update
    if (req.body.status && req.body.status !== ticket.status) {
      await ticket.updateStatus(req.body.status, req.user._id);
    }

    // Handle assignment
    if (req.body.assignedTo !== undefined) {
      ticket.assignedTo = req.body.assignedTo || null;
      ticket.assignedBy = req.body.assignedTo ? req.user._id : null;
    }

    await ticket.save();

    // Populate user details
    await ticket.populate('createdBy', 'email role');
    await ticket.populate('assignedTo', 'email role');
    await ticket.populate('assignedBy', 'email role');

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: { ticket }
    });

  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/tickets/:id/comments - Add a comment to a ticket
router.post('/:id/comments', [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment content is required and must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await ticket.addComment(req.user._id, req.body.content);

    // Populate user details
    await ticket.populate('createdBy', 'email role');
    await ticket.populate('assignedTo', 'email role');
    await ticket.populate('comments.user', 'email role');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { ticket }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/tickets/:id - Delete a ticket (admin only)
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });

  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/tickets/stats/dashboard - Get dashboard statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    let filter = {};
    
    // Apply role-based filtering
    if (req.user.role === 'user') {
      filter.createdBy = req.user._id;
    } else if (req.user.role === 'support') {
      filter.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null }
      ];
    }

    const stats = await Ticket.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Ticket.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTickets = await Ticket.countDocuments(filter);
    const openTickets = await Ticket.countDocuments({ ...filter, status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ ...filter, status: 'in-progress' });

    res.json({
      success: true,
      data: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        statusBreakdown: stats,
        priorityBreakdown: priorityStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 