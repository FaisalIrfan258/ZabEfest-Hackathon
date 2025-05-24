# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up Firebase Cloud Messaging for push notifications in the EcoTracker application.

## Prerequisites

1. A Google account
2. Node.js and npm installed
3. EcoTracker backend and frontend applications

## Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new Firebase project
3. Give your project a name (e.g., "EcoTracker")
4. Enable Google Analytics if desired
5. Click "Create project"

## Configure Firebase for Web

1. In the Firebase Console, click on the gear icon next to "Project Overview" and select "Project settings"
2. In the "Your apps" section, click on the web icon (</>) to add a web app
3. Register your app with a nickname (e.g., "EcoTracker Web")
4. Check "Also set up Firebase Hosting" if you plan to use Firebase Hosting
5. Click "Register app"
6. Copy the Firebase configuration object for later use

## Set up Firebase Admin SDK

1. In the Firebase Console, go to "Project settings" > "Service accounts"
2. Click "Generate new private key"
3. Save the JSON file securely - this is your Firebase admin credentials
4. **IMPORTANT**: Never commit this file to version control

## Backend Configuration

1. Add the Firebase Admin SDK to your backend:

```bash
npm install firebase-admin
```

2. Create a `.env` file in your backend root directory and add the following variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

3. Make sure to replace the values with the actual values from your Firebase service account JSON file.

4. For local development, you can use the following approach to load the Firebase credentials:

```javascript
// utils/firebase.js
const admin = require('firebase-admin');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

## Frontend Configuration

1. Add Firebase to your frontend:

```bash
npm install firebase
```

2. Create a `firebase.js` file in your frontend:

```javascript
// firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      
      // Send token to your backend
      await updateFCMToken(token);
      
      return token;
    }
    
    console.log('Notification permission denied');
    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Function to update FCM token in backend
const updateFCMToken = async (token) => {
  const authToken = localStorage.getItem('token');
  if (!authToken) return;
  
  try {
    const response = await fetch('/api/auth/fcm-token', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ fcmToken: token })
    });
    
    const data = await response.json();
    if (!data.success) {
      console.error('Failed to update FCM token:', data.message);
    }
  } catch (error) {
    console.error('Error updating FCM token:', error);
  }
};

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
```

3. Create a `firebase-messaging-sw.js` file in your frontend public directory:

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Integrating FCM in Your Application

### Login/Registration

When a user logs in or registers, collect and store their FCM token:

```javascript
// In your login/registration component
import { requestNotificationPermission } from './firebase';

const handleLogin = async (credentials) => {
  // Perform login
  const response = await login(credentials);
  
  if (response.success) {
    // After successful login, request notification permission
    await requestNotificationPermission();
  }
};
```

### Handling Notifications

Set up notification listeners in your application:

```javascript
// In your App.js or notification component
import { onMessageListener } from './firebase';
import { useState, useEffect } from 'react';

const NotificationComponent = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });
  
  useEffect(() => {
    const unsubscribe = onMessageListener().then(payload => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body
      });
      
      // Show toast notification or custom notification UI
      // ...
    });
    
    return () => {
      unsubscribe.catch(err => console.log('failed: ', err));
    };
  }, []);
  
  return (
    // Your notification UI
  );
};
```

## Testing Push Notifications

1. Use the test endpoint to send a test notification:

```bash
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

2. Check that the notification appears in your browser

## Troubleshooting

1. **Notification not showing**: Make sure you have granted notification permissions in your browser
2. **Token not being sent to backend**: Check network requests for errors when updating the token
3. **Backend errors**: Verify your Firebase admin credentials are correctly set up
4. **CORS issues**: Ensure your backend has proper CORS configuration for your frontend domain

## Security Considerations

1. Always validate the user's authentication before sending notifications
2. Never expose your Firebase admin credentials in client-side code
3. Implement rate limiting for notification endpoints to prevent abuse
4. Sanitize notification content to prevent XSS attacks

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Web Push Notifications Guide](https://firebase.google.com/docs/cloud-messaging/js/client) 