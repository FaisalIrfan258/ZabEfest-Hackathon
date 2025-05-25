const express = require('express');
const { auth: authController } = require('../controllers');
const { auth, upload } = require('../middleware');
const { validator } = require('../utils');

const router = express.Router();

// Public routes
router.post(
  '/register',
  validator.validateRequest(validator.registerValidator),
  authController.register
);

// User login (CNIC-based)
router.post(
  '/login/user',
  validator.validateRequest(validator.userLoginValidator),
  authController.login
);

// Admin login (Email-based)
router.post(
  '/login/admin',
  validator.validateRequest(validator.adminLoginValidator),
  authController.login
);

// Legacy login endpoint (supports both methods)
router.post(
  '/login',
  validator.validateRequest(validator.loginValidator),
  authController.login
);

// Forgot password routes
router.post(
  '/forgot-password/admin',
  validator.validateRequest(validator.adminForgotPasswordValidator),
  authController.forgotPasswordAdmin
);

router.post(
  '/forgot-password/user',
  validator.validateRequest(validator.userForgotPasswordValidator),
  authController.forgotPasswordUser
);

// Reset password
router.post(
  '/reset-password/:token',
  validator.validateRequest(validator.resetPasswordValidator),
  authController.resetPassword
);

// Protected routes
router.get(
  '/me',
  auth.protect,
  auth.updateLastActive,
  authController.getMe
);

router.put(
  '/me',
  auth.protect,
  auth.updateLastActive,
  validator.validateRequest(validator.profileUpdateValidator),
  authController.updateProfile
);

router.put(
  '/password',
  auth.protect,
  auth.updateLastActive,
  validator.validateRequest(validator.passwordChangeValidator),
  authController.updatePassword
);

router.put(
  '/profile-picture',
  auth.protect,
  auth.updateLastActive,
  upload.uploadSingle('profilePicture'),
  authController.uploadProfilePicture
);

router.put(
  '/push-subscription',
  auth.protect,
  auth.updateLastActive,
  validator.validateRequest(validator.pushSubscriptionValidator),
  authController.updatePushSubscription
);

// Get VAPID public key
router.get(
  '/vapid-public-key',
  authController.getVapidPublicKey
);

module.exports = router; 