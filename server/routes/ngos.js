const express = require('express');
const { body, validationResult, query } = require('express-validator');
const NGO = require('../models/NGO');
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ngos
// @desc    Get all approved NGOs with filters
// @access  Public
router.get('/', [
  query('category').optional().isString(),
  query('city').optional().isString(),
  query('state').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
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
      category, city, state, search,
      page = 1, limit = 10
    } = req.query;

    const filters = { status: 'approved', isActive: true };
    if (category) filters.category = category;
    if (city) filters['address.city'] = new RegExp(city, 'i');
    if (state) filters['address.state'] = new RegExp(state, 'i');

    let ngos;
    if (search) {
      ngos = await NGO.find({
        ...filters,
        $text: { $search: search }
      });
    } else {
      ngos = await NGO.find(filters);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNGOs = ngos.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedNGOs.map(ngo => ngo.getPublicProfile()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(ngos.length / limit),
        totalNGOs: ngos.length,
        hasNextPage: endIndex < ngos.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/featured
// @desc    Get featured/top NGOs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const ngos = await NGO.findTopNGOs(parseInt(limit));
    
    res.json({
      success: true,
      data: ngos.map(ngo => ngo.getPublicProfile())
    });
  } catch (error) {
    console.error('Get featured NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/:id
// @desc    Get single NGO
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id)
      .populate('user', 'name email');

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    // Only show approved NGOs to public
    if (ngo.status !== 'approved' && ngo.user._id.toString() !== req.user?._id?.toString()) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.json({
      success: true,
      data: ngo.getPublicProfile()
    });
  } catch (error) {
    console.error('Get NGO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/:id/tasks
// @desc    Get tasks by NGO
// @access  Public
router.get('/:id/tasks', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const ngo = await NGO.findById(req.params.id);
    if (!ngo || ngo.status !== 'approved') {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const filters = { ngo: ngo._id };
    if (status) filters.status = status;

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
    console.error('Get NGO tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/profile/my
// @desc    Get current user's NGO profile
// @access  Private (NGO only)
router.get('/profile/my', protect, async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    res.json({
      success: true,
      data: ngo
    });
  } catch (error) {
    console.error('Get NGO profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ngos/profile
// @desc    Update NGO profile
// @access  Private (NGO owner only)
router.put('/profile', [
  protect,
  authorize('ngo'),
  body('organizationName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('mission')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mission cannot be more than 500 characters'),
  body('vision')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Vision cannot be more than 500 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('focusAreas')
    .optional()
    .isArray()
    .withMessage('Focus areas must be an array'),
  body('targetAudience')
    .optional()
    .isArray()
    .withMessage('Target audience must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    const updatedNGO = await NGO.findByIdAndUpdate(
      ngo._id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'NGO profile updated successfully',
      data: updatedNGO
    });
  } catch (error) {
    console.error('Update NGO profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ngos/logo
// @desc    Update NGO logo
// @access  Private (NGO owner only)
router.put('/logo', [
  protect,
  authorize('ngo'),
  body('logo')
    .isURL()
    .withMessage('Please provide a valid image URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { logo } = req.body;

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    ngo.logo = logo;
    await ngo.save();

    res.json({
      success: true,
      message: 'Logo updated successfully',
      data: ngo
    });
  } catch (error) {
    console.error('Update NGO logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ngos/banner
// @desc    Update NGO banner
// @access  Private (NGO owner only)
router.put('/banner', [
  protect,
  authorize('ngo'),
  body('banner')
    .isURL()
    .withMessage('Please provide a valid image URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { banner } = req.body;

    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    ngo.banner = banner;
    await ngo.save();

    res.json({
      success: true,
      message: 'Banner updated successfully',
      data: ngo
    });
  } catch (error) {
    console.error('Update NGO banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/search
// @desc    Search NGOs
// @access  Public
router.get('/search', [
  query('q').trim().notEmpty().withMessage('Search query is required'),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { q, limit = 10 } = req.query;

    const ngos = await NGO.find({
      $text: { $search: q },
      status: 'approved',
      isActive: true
    })
    .select('organizationName logo category description stats')
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: ngos.map(ngo => ngo.getPublicProfile())
    });
  } catch (error) {
    console.error('Search NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/stats/categories
// @desc    Get NGO statistics by category
// @access  Public
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await NGO.aggregate([
      { $match: { status: 'approved', isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalTasks: { $sum: '$stats.totalTasks' },
          totalVolunteers: { $sum: '$stats.totalVolunteers' },
          totalHours: { $sum: '$stats.totalHours' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get NGO stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ngos/stats/locations
// @desc    Get NGO statistics by location
// @access  Public
router.get('/stats/locations', async (req, res) => {
  try {
    const stats = await NGO.aggregate([
      { $match: { status: 'approved', isActive: true } },
      {
        $group: {
          _id: { state: '$address.state', city: '$address.city' },
          count: { $sum: 1 },
          totalTasks: { $sum: '$stats.totalTasks' },
          totalVolunteers: { $sum: '$stats.totalVolunteers' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get NGO location stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 