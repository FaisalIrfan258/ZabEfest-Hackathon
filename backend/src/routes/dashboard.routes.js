const express = require('express');
const { dashboard: dashboardController } = require('../controllers');
const { auth } = require('../middleware');

const router = express.Router();

// Protected routes
router.get(
  '/user',
  auth.protect,
  auth.updateLastActive,
  dashboardController.getUserDashboard
);

router.get(
  '/admin',
  auth.protect,
  auth.updateLastActive,
  auth.authorize('admin', 'authority'),
  dashboardController.getAdminDashboard
);

// Public routes
router.get('/neighborhoods', dashboardController.getNeighborhoods);
router.get('/neighborhoods/:id', dashboardController.getNeighborhoodDetail);
router.get('/stats', dashboardController.getPlatformStats);

module.exports = router; 