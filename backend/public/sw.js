/**
 * EcoTracker Service Worker
 * Handles Web Push Notifications
 */

// Cache name for offline support
const CACHE_NAME = 'ecotracker-v1';

// URLs to cache for offline access
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/favicon.ico',
  '/badge-icon.png',
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - respond with cached resources when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request and cache the response
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received:', event);
  
  // Get notification data
  let data = {};
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.error('Error parsing push data:', error);
  }
  
  // Default notification options
  const title = data.title || 'EcoTracker Notification';
  const options = {
    body: data.body || 'Something happened in your EcoTracker app',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/badge-icon.png',
    data: data.data || {},
    actions: data.actions || [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    // For vibration pattern (mobile)
    vibrate: [100, 50, 100],
    // Makes notification persistent until user interacts with it
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event - handle user interaction with notification
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  // Get data from notification
  const data = event.notification.data || {};
  
  // Handle different action clicks
  if (event.action === 'close') {
    console.log('User closed the notification');
    return;
  }
  
  // Default action is to open the relevant page
  let url = '/';
  
  // If incident ID is provided, navigate to incident page
  if (data.incidentId) {
    url = `/incidents/${data.incidentId}`;
  }
  
  // Focus or open window with the URL
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab open, open new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
}); 