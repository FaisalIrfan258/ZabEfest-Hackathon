/**
 * Notification Controller
 * @module controllers/notification
 */

const notification = require('../utils/notification.util');

/**
 * @desc    Send test notification
 * @route   POST /api/notifications/test
 * @access  Private
 */
exports.sendTestNotification = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.pushSubscription) {
      return res.status(400).json({
        success: false,
        message: 'No push subscription found for your account. Please register for notifications first.',
      });
    }

    // Prepare notification
    const testNotification = {
      title: 'Test Notification',
      body: 'This is a test notification from EcoTracker',
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
      },
    };

    // Send notification
    const result = await notification.sendNotification(user.pushSubscription, testNotification);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test notification sent successfully',
        data: result,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test notification',
        error: result.error,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public VAPID key
 * @route   GET /api/notifications/vapid-public-key
 * @access  Public
 */
exports.getVapidPublicKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      vapidPublicKey: notification.getPublicVapidKey()
    });
  } catch (error) {
    next(error);
  }
}; 