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
  '/fcm-token',
  auth.protect,
  auth.updateLastActive,
  validator.validateRequest(validator.fcmTokenValidator),
  authController.updateFcmToken
);

module.exports = router; 