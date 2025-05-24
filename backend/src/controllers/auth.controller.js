const { User } = require('../models');
const { token } = require('../utils');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, location, bio } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'authority' ? 'authority' : 'user', // Only allow 'user' or 'authority'
      location,
      bio,
    });

    // Generate JWT
    const jwt = token.generateToken(user);

    // Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token: jwt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Generate JWT
    const jwt = token.generateToken(user);

    // Update last active
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });

    // Return response
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        user: user.getPublicProfile(),
        token: jwt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new JWT
    const jwt = token.generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: {
        token: jwt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload profile picture
 * @route   PUT /api/auth/profile-picture
 * @access  Private
 */
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Get file path or url
    const profilePicture = req.file.path || req.file.location || req.file.url;

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
}; 