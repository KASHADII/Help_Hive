const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const NGO = require('../models/NGO');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks with filters
// @access  Public
router.get('/', [
  optionalAuth,
  query('category').optional().isString(),
  query('city').optional().isString(),
  query('state').optional().isString(),
  query('search').optional().isString(),
  query('isUrgent').optional().isBoolean(),
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
      category, city, state, search, isUrgent,
      page = 1, limit = 10
    } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (state) filters['location.state'] = new RegExp(state, 'i');
    if (isUrgent !== undefined) filters.isUrgent = isUrgent;
    filters.status = 'active';

    let tasks;
    if (search) {
      tasks = await Task.searchTasks(search, filters);
    } else {
      tasks = await Task.find(filters)
        .populate('ngo', 'organizationName logo category')
        .sort({ 'dateTime.startDate': 1 });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    // Add application status for authenticated users
    if (req.user) {
      paginatedTasks.forEach(task => {
        const userApplication = task.applications.find(
          app => app.volunteer.toString() === req.user._id.toString()
        );
        task.userApplication = userApplication || null;
      });
    }

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
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/featured
// @desc    Get featured tasks
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const tasks = await Task.findFeaturedTasks(6);
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get featured tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/urgent
// @desc    Get urgent tasks
// @access  Public
router.get('/urgent', async (req, res) => {
  try {
    const tasks = await Task.findUrgentTasks(6);
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get urgent tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/my
// @desc    Get tasks for current NGO
// @access  Private (NGO only)
router.get('/my', [
  protect,
  authorize('ngo'),
  query('status').optional().isString(),
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

    const { status, page = 1, limit = 10 } = req.query;

    // Get NGO for current user
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const filters = { ngo: ngo._id };
    if (status) filters.status = status;

    const tasks = await Task.find(filters)
      .populate('applications.volunteer', 'name avatar')
      .populate('volunteers.volunteer', 'name avatar')
      .sort({ createdAt: -1 });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    res.json({
      success: true,
      tasks: paginatedTasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(tasks.length / limit),
        totalTasks: tasks.length,
        hasNextPage: endIndex < tasks.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('ngo', 'organizationName logo category description contactPerson')
      .populate('applications.volunteer', 'name avatar')
      .populate('volunteers.volunteer', 'name avatar');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (NGO only)
router.post('/', [
  protect,
  authorize('ngo', 'admin'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .isIn(['Healthcare', 'Education', 'Environment', 'Community Service', 'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Arts & Culture', 'Sports', 'Technology', 'Other'])
    .withMessage('Please select a valid category'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('dateTime.startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('dateTime.endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('requirements.volunteersNeeded')
    .isInt({ min: 1 })
    .withMessage('At least 1 volunteer is needed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    // Check if user has an approved NGO
    const ngo = await NGO.findOne({ user: req.user._id });
    if (!ngo) {
      return res.status(403).json({ message: 'NGO profile not found. Please complete your NGO registration first.' });
    }
    
    // For development: allow unapproved NGOs to create tasks
    // In production, this should be: if (!ngo.status === 'approved' && req.user.role !== 'admin')
    if (ngo.status !== 'approved' && req.user.role !== 'admin' && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Only approved NGOs can create tasks. Please wait for admin approval.' });
    }

    const taskData = {
      ...req.body,
      ngo: ngo ? ngo._id : req.body.ngo // Admin can specify NGO
    };

    const task = await Task.create(taskData);

    // Update NGO stats
    if (ngo) {
      ngo.stats.totalTasks += 1;
      await ngo.save();
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private (Task owner or admin)
router.put('/:id', [
  protect,
  authorize('ngo', 'admin'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    const ngo = await NGO.findOne({ user: req.user._id });
    if (task.ngo.toString() !== ngo?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ngo', 'organizationName logo category');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Task owner or admin)
router.delete('/:id', [
  protect,
  authorize('ngo', 'admin')
], async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    const ngo = await NGO.findOne({ user: req.user._id });
    if (task.ngo.toString() !== ngo?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Update NGO stats
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

// @route   POST /api/tasks/:id/apply
// @desc    Apply for a task
// @access  Private (Volunteers only)
router.post('/:id/apply', [
  protect,
  authorize('volunteer'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot be more than 500 characters'),
  body('availability')
    .optional()
    .isIn(['full-time', 'part-time', 'flexible'])
    .withMessage('Please select a valid availability option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'active') {
      return res.status(400).json({ message: 'Task is not accepting applications' });
    }

    // Check if already applied
    const existingApplication = task.applications.find(
      app => app.volunteer.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this task' });
    }

    // Check if task is full
    const approvedApplications = task.applications.filter(app => app.status === 'approved').length;
    if (approvedApplications >= task.requirements.volunteersNeeded) {
      return res.status(400).json({ message: 'Task is full' });
    }

    // Add application
    task.applications.push({
      volunteer: req.user._id,
      message: req.body.message,
      availability: req.body.availability || 'flexible'
    });

    await task.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Apply for task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id/applications/:applicationId
// @desc    Update application status (approve/reject)
// @access  Private (Task owner or admin)
router.put('/:id/applications/:applicationId', [
  protect,
  authorize('ngo', 'admin'),
  body('status')
    .isIn(['approved', 'rejected', 'withdrawn'])
    .withMessage('Please provide a valid status'),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot be more than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { status, rejectionReason } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    const ngo = await NGO.findOne({ user: req.user._id });
    if (task.ngo.toString() !== ngo?._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const application = task.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application
    application.status = status;
    if (status === 'approved') {
      application.approvedAt = new Date();
      
      // Add to volunteers if approved
      const existingVolunteer = task.volunteers.find(
        vol => vol.volunteer.toString() === application.volunteer.toString()
      );
      if (!existingVolunteer) {
        task.volunteers.push({
          volunteer: application.volunteer,
          joinedAt: new Date()
        });
      }
    } else if (status === 'rejected') {
      application.rejectedAt = new Date();
      application.rejectionReason = rejectionReason;
    }

    await task.save();

    res.json({
      success: true,
      message: `Application ${status} successfully`
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks/:id/complete
// @desc    Mark task as completed by volunteer
// @access  Private (Task volunteer)
router.post('/:id/complete', [
  protect,
  authorize('volunteer'),
  body('hoursWorked')
    .isFloat({ min: 0 })
    .withMessage('Hours worked must be a positive number'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback cannot be more than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { hoursWorked, rating, feedback } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is a volunteer for this task
    const volunteer = task.volunteers.find(
      vol => vol.volunteer.toString() === req.user._id.toString()
    );

    if (!volunteer) {
      return res.status(403).json({ message: 'You are not a volunteer for this task' });
    }

    if (volunteer.completedAt) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Update volunteer completion
    volunteer.hoursWorked = hoursWorked;
    volunteer.rating = rating;
    volunteer.feedback = feedback;
    volunteer.completedAt = new Date();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalHours += hoursWorked;
    user.completedTasks.push({
      task: task._id,
      completedAt: new Date(),
      rating: rating,
      feedback: feedback
    });

    await Promise.all([task.save(), user.save()]);

    res.json({
      success: true,
      message: 'Task completed successfully'
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 