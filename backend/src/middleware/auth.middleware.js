const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id);

      // Check if user exists
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated',
        });
      }

      // Set user on request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize based on user role
 * @param {...String} roles - Roles to authorize
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists on request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Check if user role is authorized
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is the owner of the resource
 * @param {String} modelName - Name of the model
 * @param {String} idField - Field to get the id from (defaults to 'id')
 */
exports.isOwner = (modelName, idField = 'id') => {
  return async (req, res, next) => {
    try {
      // Check if user exists on request
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route',
        });
      }

      // Get the id from the request params
      const id = req.params[idField];

      // Get the model
      const Model = require(`../models`)[modelName];

      // Get the resource
      const resource = await Model.findById(id);

      // Check if resource exists
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${modelName} not found`,
        });
      }

      // Check if user is the owner
      if (
        resource.reporter && 
        resource.reporter.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'authority'
      ) {
        return res.status(403).json({
          success: false,
          message: `Not authorized to access this ${modelName}`,
        });
      }

      // Set resource on request
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to update user's last active timestamp
 */
exports.updateLastActive = async (req, res, next) => {
  try {
    // Check if user exists on request
    if (req.user) {
      // Update last active timestamp
      req.user.lastActive = Date.now();
      await req.user.save({ validateBeforeSave: false });
    }
    next();
  } catch (error) {
    next(error);
  }
}; 