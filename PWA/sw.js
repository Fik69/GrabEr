const CACHE_NAME = 'GrabEr-cache-v1';
const urlsToCache = [
    'pwa/hs2.html',
   // './styles.css', // If you extract CSS to a separate file
    //'./script.js',  // If you extract JS to a separate file
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    // Add paths to your icons if you create them
    'pwa/icons/icon-192x192.png',
    'pwa/icons/icon-512x512.png'
];

// Install event: caches initial assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
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
            // If network fails, try to return a fallback page for navigation requests
            if (event.request.mode === 'navigate') {
                // You could serve an offline.html here if you create one
                // return caches.match('/offline.html');
            }
        });
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});