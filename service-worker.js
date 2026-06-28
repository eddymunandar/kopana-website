const CACHE_NAME = 'kopana-v12';
const ASSETS = [
  '/',
  '/index.html',
  '/pengurus.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/img/logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache assets silently, don't fail if one is missing
      return Promise.all(
        ASSETS.map(url => {
          return fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(err => console.log('Cache fail:', url));
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Network First Strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Return network response if valid
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
