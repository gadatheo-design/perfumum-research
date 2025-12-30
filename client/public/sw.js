/**
 * PERFUMUM Service Worker - Version améliorée
 * Stratégie: Network First avec cache de secours
 * 
 * Cette version privilégie toujours le réseau pour éviter les problèmes
 * de cache obsolète, tout en offrant un mode offline fonctionnel.
 */

const CACHE_VERSION = 'perfumum-v2'; // Incrémenter pour forcer le rafraîchissement
const RUNTIME_CACHE = 'perfumum-runtime-v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

// Assets critiques à mettre en cache (minimal)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache minimal des assets critiques
self.addEventListener('install', (event) => {
  console.log('[SW v2] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[SW v2] Caching critical assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force activation immédiate
  );
});

// Activate event - nettoyer tous les anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW v2] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_VERSION && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW v2] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim()) // Prendre le contrôle immédiatement
  );
});

// Vérifier si une réponse en cache est encore valide
function isCacheValid(cachedResponse) {
  if (!cachedResponse) return false;
  
  const cachedDate = cachedResponse.headers.get('sw-cache-date');
  if (!cachedDate) return false;
  
  const cacheAge = Date.now() - new Date(cachedDate).getTime();
  return cacheAge < CACHE_DURATION;
}

// Ajouter un timestamp à la réponse avant de la mettre en cache
function addCacheTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cache-date', new Date().toISOString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Fetch event - NETWORK FIRST avec cache de secours
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - TOUJOURS network first, pas de cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch((error) => {
          console.error('[SW v2] API request failed:', url.pathname, error);
          // Retourner une erreur explicite en mode offline
          return new Response(
            JSON.stringify({ 
              error: 'Offline', 
              message: 'Pas de connexion réseau. Certaines fonctionnalités sont indisponibles.' 
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // HTML/JS/CSS - Network First avec cache de secours
  if (
    request.mode === 'navigate' || 
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Toujours mettre à jour le cache avec la dernière version
          if (response && response.status === 200) {
            const responseToCache = addCacheTimestamp(response.clone());
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Réseau indisponible, utiliser le cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse && isCacheValid(cachedResponse)) {
              console.log('[SW v2] Serving from cache (offline):', url.pathname);
              return cachedResponse;
            }
            
            // Cache expiré ou inexistant
            if (request.mode === 'navigate') {
              return new Response(
                `<!DOCTYPE html>
                <html lang="fr">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>PERFUMUM - Hors ligne</title>
                  <style>
                    body {
                      font-family: system-ui, -apple-system, sans-serif;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      min-height: 100vh;
                      margin: 0;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      text-align: center;
                      padding: 2rem;
                    }
                    .container {
                      max-width: 500px;
                    }
                    h1 {
                      font-size: 2.5rem;
                      margin-bottom: 1rem;
                    }
                    p {
                      font-size: 1.2rem;
                      line-height: 1.6;
                      margin-bottom: 2rem;
                    }
                    button {
                      background: white;
                      color: #667eea;
                      border: none;
                      padding: 1rem 2rem;
                      font-size: 1rem;
                      font-weight: 600;
                      border-radius: 8px;
                      cursor: pointer;
                      transition: transform 0.2s;
                    }
                    button:hover {
                      transform: translateY(-2px);
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>🌿 PERFUMUM</h1>
                    <p>Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion internet pour accéder à la plateforme de recherche olfactive.</p>
                    <button onclick="window.location.reload()">Réessayer</button>
                  </div>
                </body>
                </html>`,
                {
                  status: 503,
                  headers: { 'Content-Type': 'text/html; charset=utf-8' }
                }
              );
            }
            
            return new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Images et autres assets statiques - Cache First (car moins critiques)
  if (
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse && isCacheValid(cachedResponse)) {
            // Rafraîchir en arrière-plan
            fetch(request).then((response) => {
              if (response && response.status === 200) {
                const responseToCache = addCacheTimestamp(response.clone());
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
            }).catch(() => {
              // Ignorer les erreurs de rafraîchissement en arrière-plan
            });
            
            return cachedResponse;
          }

          // Pas de cache valide, fetch depuis le réseau
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseToCache = addCacheTimestamp(response.clone());
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
              return response;
            });
        })
    );
    return;
  }

  // Tous les autres requests - Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = addCacheTimestamp(response.clone());
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse && isCacheValid(cachedResponse)) {
            return cachedResponse;
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Message handler pour forcer le rafraîchissement du cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('[SW v2] All caches cleared');
        return self.clients.claim();
      })
    );
  }
});
