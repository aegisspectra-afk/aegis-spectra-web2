// Service Worker for Aegis Spectra
const CACHE_VERSION = 'v2';
const CACHE_NAME = `aegis-spectra-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `aegis-spectra-static-${CACHE_VERSION}`;

// Resources to cache on install
const urlsToCache = [
  '/offline.html',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME && cacheName.startsWith('aegis-spectra-')) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Claim clients to take control immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API routes and external requests
  if (url.pathname.startsWith('/api/') || !url.origin.includes(self.location.hostname)) {
    return;
  }

  // Skip _next static files (let Next.js handle them)
  if (url.pathname.startsWith('/_next/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          // Clone the response
          const responseToCache = response.clone();

          // Cache HTML pages and static assets
          if (request.destination === 'document' || 
              request.destination === 'image' || 
              request.destination === 'style' ||
              request.destination === 'script') {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
          }
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If it's a document request and we have offline page, return it
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }

          // Return error response
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

