/**
 * Web Push Notifications Configuration
 * @module config/webpush
 */

const webpush = require('web-push');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Generate VAPID keys if they don't exist and set them for web push
 * @returns {Object} VAPID keys
 */
const generateVAPIDKeys = () => {
  // Check if VAPID keys exist in environment variables
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log('VAPID keys not found in environment, generating new keys...');
    
    // Generate new VAPID keys
    const vapidKeys = webpush.generateVAPIDKeys();
    
    console.log('Generated VAPID keys:');
    console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
    console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
    console.log('Add these to your .env file for persistent use');
    
    return vapidKeys;
  }
  
  // Return existing VAPID keys from environment variables
  return {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
  };
};

/**
 * Initialize Web Push configuration
 */
const initializeWebPush = () => {
  const vapidKeys = generateVAPIDKeys();
  
  // Set VAPID details
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:contact@ecotracker.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  
  console.log('Web Push initialized successfully');
  
  return {
    webpush,
    vapidKeys
  };
};

module.exports = {
  webpush,
  initializeWebPush,
  generateVAPIDKeys
}; 