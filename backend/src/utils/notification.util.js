/**
 * Notification utility for sending web push notifications
 */
const { webpush, initializeWebPush } = require('../config/webpush.config');

// Initialize web push on startup
const { vapidKeys } = initializeWebPush();

/**
 * Send a web push notification to a user
 * @param {Object} subscription - User's push subscription object
 * @param {Object} notification - Notification data
 * @returns {Promise} - Promise that resolves when notification is sent
 */
exports.sendNotification = async (subscription, notification) => {
  try {
    if (!subscription) {
      console.log('No subscription provided, skipping notification');
      return;
    }

    // Create payload
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/favicon.ico',
      badge: notification.badge || '/badge-icon.png',
      data: notification.data || {},
    });

    // Send notification
    const result = await webpush.sendNotification(subscription, payload);
    console.log('Successfully sent notification:', result.statusCode);
    
    return {
      success: true,
      message: 'Notification sent successfully',
      statusCode: result.statusCode,
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      message: 'Failed to send notification',
      error: error.message,
    };
  }
};

/**
 * Send notifications to multiple users
 * @param {Array} subscriptions - Array of user push subscription objects
 * @param {Object} notification - Notification data
 * @returns {Promise} - Promise that resolves when all notifications are sent
 */
exports.sendMulticastNotification = async (subscriptions, notification) => {
  try {
    if (!subscriptions || !subscriptions.length) {
      console.log('No subscriptions provided, skipping notifications');
      return;
    }

    // Filter out null/undefined subscriptions
    const validSubscriptions = subscriptions.filter(sub => sub);

    if (!validSubscriptions.length) {
      console.log('No valid subscriptions, skipping notifications');
      return;
    }

    // Create payload
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/favicon.ico',
      badge: notification.badge || '/badge-icon.png',
      data: notification.data || {},
    });
    
    // Send to all subscriptions
    const results = await Promise.allSettled(
      validSubscriptions.map(subscription => 
        webpush.sendNotification(subscription, payload)
      )
    );
    
    // Count successes and failures
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failureCount = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Successfully sent multicast notification: ${successCount} successful, ${failureCount} failed`);
    
    return {
      success: true,
      message: `Notification sent to ${successCount} recipients`,
      failureCount,
      successCount,
    };
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    return {
      success: false,
      message: 'Failed to send notifications',
      error: error.message,
    };
  }
};

/**
 * Send notification about incident status change
 * @param {Object} incident - Incident object
 * @param {String} previousStatus - Previous status
 * @param {String} newStatus - New status
 * @param {String} changedBy - User who changed the status
 * @returns {Promise} - Promise that resolves when notification is sent
 */
exports.sendStatusChangeNotification = async (incident, previousStatus, newStatus, changedBy) => {
  try {
    // Get reporter's subscription
    const { User } = require('../models');
    const reporter = await User.findById(incident.reporter);
    
    if (!reporter || !reporter.pushSubscription) {
      console.log('Reporter has no push subscription, skipping notification');
      return;
    }

    // Parse subscription object if it's stored as a string
    let subscription = reporter.pushSubscription;
    if (typeof subscription === 'string') {
      subscription = JSON.parse(subscription);
    }

    // Prepare notification
    const notification = {
      title: 'Incident Status Updated',
      body: `Your incident "${incident.title}" has been updated from ${previousStatus} to ${newStatus}`,
      data: {
        incidentId: incident._id.toString(),
        type: 'status_change',
        previousStatus,
        newStatus,
      },
    };

    // Send notification
    return this.sendNotification(subscription, notification);
  } catch (error) {
    console.error('Error sending status change notification:', error);
  }
};

/**
 * Send notification about new verification
 * @param {Object} incident - Incident object
 * @param {Object} verifier - User who verified the incident
 * @returns {Promise} - Promise that resolves when notification is sent
 */
exports.sendVerificationNotification = async (incident, verifier) => {
  try {
    // Get reporter's subscription
    const { User } = require('../models');
    const reporter = await User.findById(incident.reporter);
    
    if (!reporter || !reporter.pushSubscription) {
      console.log('Reporter has no push subscription, skipping notification');
      return;
    }

    // Parse subscription object if it's stored as a string
    let subscription = reporter.pushSubscription;
    if (typeof subscription === 'string') {
      subscription = JSON.parse(subscription);
    }

    // Prepare notification
    const notification = {
      title: 'New Incident Verification',
      body: `Your incident "${incident.title}" has received a new verification`,
      data: {
        incidentId: incident._id.toString(),
        type: 'verification',
        verificationCount: incident.verificationCount,
      },
    };

    // Send notification
    return this.sendNotification(subscription, notification);
  } catch (error) {
    console.error('Error sending verification notification:', error);
  }
};

/**
 * Send notification about threshold reached
 * @param {Object} incident - Incident object
 * @returns {Promise} - Promise that resolves when notification is sent
 */
exports.sendVerificationThresholdNotification = async (incident) => {
  try {
    // Get reporter's subscription
    const { User } = require('../models');
    const reporter = await User.findById(incident.reporter);
    
    if (!reporter || !reporter.pushSubscription) {
      console.log('Reporter has no push subscription, skipping notification');
      return;
    }

    // Parse subscription object if it's stored as a string
    let subscription = reporter.pushSubscription;
    if (typeof subscription === 'string') {
      subscription = JSON.parse(subscription);
    }

    // Prepare notification
    const notification = {
      title: 'Incident Verified',
      body: `Your incident "${incident.title}" has been verified by the community`,
      data: {
        incidentId: incident._id.toString(),
        type: 'verification_threshold',
      },
    };

    // Send notification
    return this.sendNotification(subscription, notification);
  } catch (error) {
    console.error('Error sending verification threshold notification:', error);
  }
};

/**
 * Get public VAPID key for clients
 * @returns {String} - Public VAPID key
 */
exports.getPublicVapidKey = () => {
  return vapidKeys.publicKey;
}; 