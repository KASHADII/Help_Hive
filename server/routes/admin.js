const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const NGO = require('../models/NGO');
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authentication
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          verifiedCount: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          }
        }
      }
    ]);

    // Get NGO statistics
    const ngoStats = await NGO.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalTasks: { $sum: '$stats.totalTasks' },
          totalVolunteers: { $sum: '$stats.totalVolunteers' },
          totalHours: { $sum: '$stats.totalHours' }
        }
      }
    ]);

    // Get task statistics
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalApplications: { $sum: '$stats.totalApplications' },
          totalVolunteers: { $sum: '$stats.totalVolunteers' },
          totalHours: { $sum: '$stats.totalHours' }
        }
      }
    ]);

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentNGOs = await NGO.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('organizationName category status createdAt');

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ngo', 'organizationName')
      .select('title category status createdAt');

    // Calculate totals
    const totalUsers = userStats.reduce((sum, stat) => sum + stat.count, 0);
    const totalNGOs = ngoStats.reduce((sum, stat) => sum + stat.count, 0);
    const totalTasks = taskStats.reduce((sum, stat) => sum + stat.count, 0);

    res.json({
      success: true,
      data: {
        userStats,
        ngoStats,
        taskStats,
        totals: {
          users: totalUsers,
          ngos: totalNGOs,
          tasks: totalTasks
        },
        recent: {
          users: recentUsers,
          ngos: recentNGOs,
          tasks: recentTasks
        }
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (Admin only)
router.get('/users', [
  query('role').optional().isIn(['volunteer', 'ngo', 'admin']),
  query('status').optional().isIn(['active', 'inactive']),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      role, status, search,
      page = 1, limit = 20
    } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (status === 'active') filters.isActive = true;
    if (status === 'inactive') filters.isActive = false;
    if (search) {
      filters.$text = { $search: search };
    }

    const users = await User.find(filters)
      .sort({ createdAt: -1 });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUsers.map(user => user.getPublicProfile()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.length / limit),
        totalUsers: users.length,
        hasNextPage: endIndex < users.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/ngos
// @desc    Get all NGOs with filters
// @access  Private (Admin only)
router.get('/ngos', [
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      status, category, search,
      page = 1, limit = 20
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (search) {
      filters.$text = { $search: search };
    }

    const ngos = await NGO.find(filters)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNGOs = ngos.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedNGOs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(ngos.length / limit),
        totalNGOs: ngos.length,
        hasNextPage: endIndex < ngos.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/ngos/:id/approve
// @desc    Approve NGO registration
// @access  Private (Admin only)
router.put('/ngos/:id/approve', [
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot be more than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { adminNotes } = req.body;

    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    if (ngo.status === 'approved') {
      return res.status(400).json({ message: 'NGO is already approved' });
    }

    ngo.status = 'approved';
    ngo.isVerified = true;
    ngo.adminNotes = adminNotes;
    await ngo.save();

    // Update user verification status
    await User.findByIdAndUpdate(ngo.user, { isVerified: true });

    res.json({
      success: true,
      message: 'NGO approved successfully',
      data: ngo
    });
  } catch (error) {
    console.error('Approve NGO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/ngos/:id/reject
// @desc    Reject NGO registration
// @access  Private (Admin only)
router.put('/ngos/:id/reject', [
  body('rejectionReason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot be more than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { rejectionReason, adminNotes } = req.body;

    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    if (ngo.status === 'rejected') {
      return res.status(400).json({ message: 'NGO is already rejected' });
    }

    ngo.status = 'rejected';
    ngo.rejectionReason = rejectionReason;
    ngo.adminNotes = adminNotes;
    await ngo.save();

    res.json({
      success: true,
      message: 'NGO rejected successfully',
      data: ngo
    });
  } catch (error) {
    console.error('Reject NGO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/tasks
// @desc    Get all tasks with filters
// @access  Private (Admin only)
router.get('/tasks', [
  query('status').optional().isIn(['draft', 'active', 'in-progress', 'completed', 'cancelled']),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      status, category, search,
      page = 1, limit = 20
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (search) {
      filters.$text = { $search: search };
    }

    const tasks = await Task.find(filters)
      .populate('ngo', 'organizationName logo category')
      .sort({ createdAt: -1 });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedTasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(tasks.length / limit),
        totalTasks: tasks.length,
        hasNextPage: endIndex < tasks.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/tasks/:id/feature
// @desc    Toggle task featured status
// @access  Private (Admin only)
router.put('/tasks/:id/feature', [
  body('isFeatured')
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { isFeatured } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isFeatured = isFeatured;
    await task.save();

    res.json({
      success: true,
      message: `Task ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: task
    });
  } catch (error) {
    console.error('Toggle task feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/tasks/:id
// @desc    Delete task (admin only)
// @access  Private (Admin only)
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Update NGO stats
    const ngo = await NGO.findById(task.ngo);
    if (ngo) {
      ngo.stats.totalTasks = Math.max(0, ngo.stats.totalTasks - 1);
      await ngo.save();
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get detailed system statistics
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // NGO growth over time
    const ngoGrowth = await NGO.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Task completion rates
    const taskCompletion = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgApplications: { $avg: '$stats.totalApplications' },
          avgVolunteers: { $avg: '$stats.totalVolunteers' }
        }
      }
    ]);

    // Top performing NGOs
    const topNGOs = await NGO.find({ status: 'approved' })
      .sort({ 'stats.averageRating': -1, 'stats.completedTasks': -1 })
      .limit(10)
      .select('organizationName category stats');

    // Top volunteers
    const topVolunteers = await User.find({ role: 'volunteer' })
      .sort({ totalHours: -1 })
      .limit(10)
      .select('name avatar totalHours completedTasks');

    res.json({
      success: true,
      data: {
        userGrowth,
        ngoGrowth,
        taskCompletion,
        topNGOs,
        topVolunteers
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/broadcast
// @desc    Send broadcast message to all users
// @access  Private (Admin only)
router.post('/broadcast', [
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('targetRole')
    .optional()
    .isIn(['all', 'volunteer', 'ngo'])
    .withMessage('Target role must be all, volunteer, or ngo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { message, targetRole = 'all' } = req.body;

    // In a real application, you would send emails/notifications here
    // For now, we'll just return success
    const filter = targetRole === 'all' ? {} : { role: targetRole };
    const userCount = await User.countDocuments(filter);

    res.json({
      success: true,
      message: `Broadcast message sent to ${userCount} users`,
      data: {
        message,
        targetRole,
        userCount
      }
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 