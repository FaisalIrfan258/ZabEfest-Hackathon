const { User } = require('../models');
const { token, email } = require('../utils');
const crypto = require('crypto');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, role, location, cnic } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken',
      });
    }

    // If registering as a regular user, check CNIC
    if (role !== 'admin' && role !== 'authority') {
      if (!cnic) {
        return res.status(400).json({
          success: false,
          message: 'CNIC is required for user registration',
        });
      }
      
      // Check if user with CNIC already exists
      const existingCnic = await User.findOne({ cnic });
      if (existingCnic) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this CNIC',
        });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      username,
      email,
      password,
      role: role === 'authority' ? 'authority' : 'user', // Only allow 'user' or 'authority'
      location,
      cnic
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
 * @desc    Register new admin
 * @route   POST /api/auth/register/admin
 * @access  Public
 */
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new admin user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'authority' ? 'authority' : 'admin', // Only allow 'admin' or 'authority'
      username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Generate a random username for admin
    });

    // Generate JWT
    const jwt = token.generateToken(user);

    // Return response
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
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
    const { email, cnic, username, password } = req.body;
    let user;

    // Check if login is using CNIC (for regular users)
    if (cnic) {
      user = await User.findOne({ cnic }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    }
    // Check if login is using username (for regular users)
    else if (username) {
      user = await User.findOne({ username }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    }
    // Check if login is using email (for admins/authority)
    else if (email) {
      user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, username, or CNIC',
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

    // Update last active
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate JWT
    const jwt = token.generateToken(user);

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
    const { name, location } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, location },
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

/**
 * @desc    Update push subscription
 * @route   PUT /api/auth/push-subscription
 * @access  Private
 */
exports.updatePushSubscription = async (req, res, next) => {
  try {
    // Get subscription object from request body
    const pushSubscription = req.body;

    // Update user's push subscription
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { pushSubscription },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Push subscription updated successfully',
      data: {
        pushSubscription: user.pushSubscription
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get VAPID public key
 * @route   GET /api/auth/vapid-public-key
 * @access  Public
 */
exports.getVapidPublicKey = async (req, res, next) => {
  try {
    const { getPublicVapidKey } = require('../utils/notification.util');
    
    res.status(200).json({
      success: true,
      vapidPublicKey: getPublicVapidKey()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password for admin (email-based)
 * @route   POST /api/auth/forgot-password/admin
 * @access  Public
 */
exports.forgotPasswordAdmin = async (req, res, next) => {
  try {
    const { email: userEmail } = req.body;

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Check if user is admin or authority
    if (user.role !== 'admin' && user.role !== 'authority') {
      return res.status(403).json({
        success: false,
        message: 'Only admin or authority users can use this endpoint',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (1 hour)
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    // Save user
    await user.save({ validateBeforeSave: false });

    try {
      // Send email
      await email.sendPasswordResetEmail(user.email, resetToken, user.name);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (err) {
      // If email fails, remove token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password for user (CNIC-based)
 * @route   POST /api/auth/forgot-password/user
 * @access  Public
 */
exports.forgotPasswordUser = async (req, res, next) => {
  try {
    const { cnic } = req.body;

    // Find user by CNIC
    const user = await User.findOne({ cnic });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this CNIC',
      });
    }

    // Check if user role is actually 'user'
    if (user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is only for regular users',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (1 hour)
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

    // Save user
    await user.save({ validateBeforeSave: false });

    try {
      // Send email
      await email.sendPasswordResetEmail(user.email, resetToken, user.name);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (err) {
      // If email fails, remove token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token: resetToken } = req.params;

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user by token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send success email
    try {
      await email.sendPasswordResetSuccessEmail(user.email, user.name);
    } catch (err) {
      // Continue even if email fails, just log it
      console.error('Error sending password reset success email:', err);
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
}; 