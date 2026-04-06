// ─── SERVICE WORKER — Recipe Calculator PWA ──────────────────────────────────
const CACHE_NAME = "recipe-calc-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/style.css",
  "/src/data.js",
  "/src/helpers.js",
  "/src/i18n.js",
  "/src/store/useRecipeStore.js",
  "/src/utils/calculator.js",
];

// Install — cache all static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith("chrome-extension")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback for HTML pages
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        });
    })
  );
});
