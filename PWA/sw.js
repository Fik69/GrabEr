const CACHE_NAME = 'Graber-cache-v2'; // Increment cache version for changes
const urlsToCache = [
    '/GrabEr/', // Cache the main index.html page
    '/GrabEr/index.html', // Explicitly cache index.html
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    // Paths for icons are relative to the service worker's scope (which is /GrabEr/PWA/)
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Install event: caches initial assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Opened cache');
        return cache.addAll(urlsToCache).then(() => {
          console.log('Service Worker: All URLs cached successfully.');
        }).catch(error => {
          console.error('Service Worker: Failed to cache some URLs:', error);
        });
      })
      .catch(error => {
        console.error('Service Worker: Cache open failed:', error);
      })
  );
});

// Fetch event: serves cached content first, then falls back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).catch(() => {
            // Optional: If network fails and request is for a navigation,
            // serve a simple offline page. (You'd need to create offline.html)
            // if (event.request.mode === 'navigate') {
            //     return caches.match('/GrabEr/offline.html');
            // }
            console.warn('Service Worker: Fetch failed for:', event.request.url);
        });
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log('Service Worker: Activation complete.');
        self.clients.claim(); // Immediately take control of clients
    })
  );
});