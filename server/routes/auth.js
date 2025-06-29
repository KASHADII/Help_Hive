const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const NGO = require('../models/NGO');
const { 
  protect, 
  authorize, 
  loginLimiter, 
  registerLimiter, 
  passwordResetLimiter 
} = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new volunteer
// @access  Public
router.post('/register', [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 25 })
    .withMessage('First name must be between 2 and 25 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 25 })
    .withMessage('Last name must be between 2 and 25 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password, phone, location, skills, interests } = req.body;

    // Combine first and last name
    const name = `${firstName} ${lastName}`;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      location,
      skills: skills || [],
      interests: interests || [],
      role: 'volunteer'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/ngo-register
// @desc    Register a new NGO
// @access  Public
router.post('/ngo-register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('organizationName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required'),
  body('category')
    .isIn(['Healthcare', 'Education', 'Environment', 'Community Service', 'Animal Welfare', 'Disaster Relief', 'Human Rights', 'Arts & Culture', 'Sports', 'Technology', 'Other'])
    .withMessage('Please select a valid category'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('foundedYear')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Please provide a valid founded year'),
  body('contactPerson.name')
    .trim()
    .notEmpty()
    .withMessage('Contact person name is required'),
  body('contactPerson.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid contact person email'),
  body('contactPerson.phone')
    .trim()
    .notEmpty()
    .withMessage('Contact person phone is required'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      name, email, password, phone,
      organizationName, registrationNumber, category, description,
      foundedYear, contactPerson, address, website, mission, vision
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if NGO registration number already exists
    const existingNGO = await NGO.findOne({ registrationNumber });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO with this registration number already exists' });
    }

    // Create user first
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'ngo'
    });

    // Create NGO
    const ngo = await NGO.create({
      user: user._id,
      organizationName,
      registrationNumber,
      category,
      description,
      foundedYear,
      contactPerson,
      address,
      website,
      mission,
      vision,
      status: 'pending',
      isActive: false
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'NGO registered successfully. Your account is pending admin approval. You will be notified once approved.',
      token,
      user: user.getPublicProfile(),
      ngo: ngo.getPublicProfile()
    });
  } catch (error) {
    console.error('NGO registration error:', error);
    res.status(500).json({ message: 'Server error during NGO registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  loginLimiter,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For NGO users, check approval status
    if (user.role === 'ngo') {
      const ngo = await NGO.findOne({ user: user._id });
      if (ngo && ngo.status === 'pending') {
        return res.status(403).json({ 
          message: 'Your NGO account is pending admin approval. You will be notified once approved.',
          status: 'pending'
        });
      }
      if (ngo && ngo.status === 'rejected') {
        return res.status(403).json({ 
          message: `Your NGO registration was rejected. Reason: ${ngo.rejectionReason || 'No reason provided'}`,
          status: 'rejected'
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Admin login
// @access  Public
router.post('/admin-login', [
  loginLimiter,
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Check admin credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Create or find admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@helphive.com',
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        isActive: true
      });
    }

    // Generate token
    const token = generateToken(adminUser._id);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: adminUser.getPublicProfile()
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', [
  passwordResetLimiter,
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Return the reset token directly (for development/testing)
    res.json({
      success: true,
      message: 'Password reset token generated successfully',
      resetToken // Remove this in production
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @route   POST /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.post('/reset-password/:resetToken', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { resetToken } = req.params;
    const { password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful',
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router; 