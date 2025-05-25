/**
 * Notification routes
 * @module routes/notification
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware');
const { notification: notificationController } = require('../controllers');

// Public routes
router.get('/vapid-public-key', notificationController.getVapidPublicKey);

// Protected routes
router.post('/test', auth.protect, auth.updateLastActive, notificationController.sendTestNotification);

module.exports = router; 