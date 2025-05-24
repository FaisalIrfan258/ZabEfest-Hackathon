/**
 * Notification utility for sending web push notifications
 */

/**
 * Send a web push notification to a user
 * @param {String} userFcmToken - User's FCM token
 * @param {Object} notification - Notification data
 * @returns {Promise} - Promise that resolves when notification is sent
 */
exports.sendNotification = async (userFcmToken, notification) => {
  try {
    if (!userFcmToken) {
      console.log('No FCM token provided, skipping notification');
      return;
    }

    // In a real implementation, this would use the Firebase Admin SDK
    // For the MVP, we'll log the notification and simulate sending
    console.log(`[NOTIFICATION] Would send to token ${userFcmToken}:`, notification);

    // Simulate successful notification
    return {
      success: true,
      message: 'Notification sent successfully',
    };

    /* 
    // Example implementation with Firebase Admin SDK:
    
    const admin = require('firebase-admin');
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
    
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      token: userFcmToken,
    };
    
    return admin.messaging().send(message);
    */
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
 * @param {Array} userFcmTokens - Array of user FCM tokens
 * @param {Object} notification - Notification data
 * @returns {Promise} - Promise that resolves when all notifications are sent
 */
exports.sendMulticastNotification = async (userFcmTokens, notification) => {
  try {
    if (!userFcmTokens || !userFcmTokens.length) {
      console.log('No FCM tokens provided, skipping notifications');
      return;
    }

    // Filter out null/undefined tokens
    const validTokens = userFcmTokens.filter(token => token);

    if (!validTokens.length) {
      console.log('No valid FCM tokens, skipping notifications');
      return;
    }

    // In a real implementation, this would use the Firebase Admin SDK
    // For the MVP, we'll log the notification and simulate sending
    console.log(`[NOTIFICATION] Would send to ${validTokens.length} tokens:`, notification);

    // Simulate successful notification
    return {
      success: true,
      message: `Notification sent to ${validTokens.length} recipients`,
    };

    /*
    // Example implementation with Firebase Admin SDK:
    
    const admin = require('firebase-admin');
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
    
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens: validTokens,
    };
    
    return admin.messaging().sendMulticast(message);
    */
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
    // Get reporter's FCM token
    const { User } = require('../models');
    const reporter = await User.findById(incident.reporter);
    
    if (!reporter || !reporter.fcmToken) {
      console.log('Reporter has no FCM token, skipping notification');
      return;
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
    return this.sendNotification(reporter.fcmToken, notification);
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
    // Get reporter's FCM token
    const { User } = require('../models');
    const reporter = await User.findById(incident.reporter);
    
    if (!reporter || !reporter.fcmToken) {
      console.log('Reporter has no FCM token, skipping notification');
      return;
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
    return this.sendNotification(reporter.fcmToken, notification);
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
    // Get reporter's FCM token
    const { User } = require('../models');
    const reporter = await User.findById(incident.reporter);
    
    if (!reporter || !reporter.fcmToken) {
      console.log('Reporter has no FCM token, skipping notification');
      return;
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
    return this.sendNotification(reporter.fcmToken, notification);
  } catch (error) {
    console.error('Error sending verification threshold notification:', error);
  }
}; 