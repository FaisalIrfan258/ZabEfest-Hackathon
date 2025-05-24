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

module.exports = router; 