/**
 * Web Push Client Setup Example
 * This file demonstrates how to set up Web Push Notifications in a client app
 * 
 * This is for reference only and should be adapted to your frontend framework
 */

/**
 * Check if service workers and push messaging are supported
 * @returns {Boolean} - True if supported, false otherwise
 */
function checkSupport() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported by this browser');
    return false;
  }
  
  if (!('PushManager' in window)) {
    console.log('Push notifications are not supported by this browser');
    return false;
  }
  
  return true;
}

/**
 * Register the service worker
 * @returns {Promise<ServiceWorkerRegistration>} - Service worker registration
 */
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    throw error;
  }
}

/**
 * Request notification permission
 * @returns {Promise<String>} - Permission status
 */
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission status:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
}

/**
 * Get the VAPID public key from the server
 * @returns {Promise<String>} - VAPID public key in URL-safe base64 format
 */
async function getVapidPublicKey() {
  try {
    const response = await fetch('/api/notifications/vapid-public-key');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to get VAPID public key');
    }
    
    return data.vapidPublicKey;
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    throw error;
  }
}

/**
 * Convert URL-safe base64 string to Uint8Array
 * @param {String} base64String - URL-safe base64 string
 * @returns {Uint8Array} - Uint8Array representation
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

/**
 * Subscribe to push notifications
 * @param {ServiceWorkerRegistration} registration - Service worker registration
 * @returns {Promise<PushSubscription>} - Push subscription
 */
async function subscribeToPushNotifications(registration) {
  try {
    // Get VAPID public key
    const vapidPublicKey = await getVapidPublicKey();
    
    // Convert VAPID public key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    
    console.log('Push subscription:', subscription);
    
    // Send subscription to server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

/**
 * Send push subscription to server
 * @param {PushSubscription} subscription - Push subscription
 * @returns {Promise<Object>} - Server response
 */
async function sendSubscriptionToServer(subscription) {
  try {
    // Get auth token
    const authToken = localStorage.getItem('token');
    
    if (!authToken) {
      throw new Error('User not authenticated');
    }
    
    // Send subscription to server
    const response = await fetch('/api/auth/push-subscription', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(subscription)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update push subscription');
    }
    
    console.log('Push subscription sent to server');
    return data;
  } catch (error) {
    console.error('Error sending push subscription to server:', error);
    throw error;
  }
}

/**
 * Initialize push notifications
 * @returns {Promise<PushSubscription|null>} - Push subscription or null if not supported/permitted
 */
async function initializePushNotifications() {
  try {
    // Check if push notifications are supported
    if (!checkSupport()) {
      console.log('Push notifications not supported');
      return null;
    }
    
    // Register service worker
    const registration = await registerServiceWorker();
    
    // Request notification permission
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }
    
    // Subscribe to push notifications
    const subscription = await subscribeToPushNotifications(registration);
    
    return subscription;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 * @returns {Promise<Boolean>} - True if unsubscribed successfully
 */
async function unsubscribeFromPushNotifications() {
  try {
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Get push subscription
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log('No subscription to unsubscribe from');
      return true;
    }
    
    // Unsubscribe
    const success = await subscription.unsubscribe();
    
    if (success) {
      console.log('Successfully unsubscribed from push notifications');
    } else {
      console.log('Failed to unsubscribe from push notifications');
    }
    
    return success;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

// Example of how to use these functions:
/*
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize push notifications when the page loads
  const subscribeButton = document.getElementById('subscribe-button');
  const unsubscribeButton = document.getElementById('unsubscribe-button');
  
  // Subscribe button click handler
  subscribeButton.addEventListener('click', async () => {
    try {
      await initializePushNotifications();
      // Update UI to show subscribed status
      subscribeButton.disabled = true;
      unsubscribeButton.disabled = false;
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  });
  
  // Unsubscribe button click handler
  unsubscribeButton.addEventListener('click', async () => {
    try {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        // Update UI to show unsubscribed status
        subscribeButton.disabled = false;
        unsubscribeButton.disabled = true;
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  });
  
  // Check if already subscribed
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (subscription) {
    // Already subscribed, update UI
    subscribeButton.disabled = true;
    unsubscribeButton.disabled = false;
  } else {
    // Not subscribed, update UI
    subscribeButton.disabled = false;
    unsubscribeButton.disabled = true;
  }
});
*/ 