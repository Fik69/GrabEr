const CACHE_NAME = 'video-frame-extractor-cache-v1';
const urlsToCache = [
  '/GrabEr/scrub.html',
  '/GrabEr/manifest.json',
  '/GrabEr/icons/icon-192x192.png',
  '/GrabEr/icons/icon-512x512.png',
  // External libraries (CDNs) will NOT be cached by this simple service worker
  // unless explicitly configured with more advanced Workbox strategies.
  // For now, assume they need network access.
  // We'll cache your local CSS/JS if you move them from inline or external files.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});