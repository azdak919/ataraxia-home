/* ═══════════════════════════════════════════════════════
   Ataraxia — Service Worker
   Strategy:
     • App shell (HTML, icons, manifest)  → stale-while-revalidate
     • Google Fonts CSS + WOFF2 files     → cache-first (fonts never change)
     • External background images         → network-only (too large; always fresh)
     • Anything else same-origin          → stale-while-revalidate
   ═══════════════════════════════════════════════════════ */

const SHELL_CACHE   = 'ataraxia-shell-v2';
const FONT_CACHE    = 'ataraxia-fonts-v1';
const KNOWN_CACHES  = [SHELL_CACHE, FONT_CACHE];

// Explicit allowlist of external image CDN hostnames (network-only, never cached)
const IMAGE_CDN_HOSTS = new Set([
  'images.unsplash.com',
  'source.unsplash.com',
  'upload.wikimedia.org',
  'commons.wikimedia.org',
  'images.pexels.com',
]);

// Static assets to pre-cache on install (paths relative to the SW scope)
const SHELL_ASSETS = [
  './',
  './index.html',
  './site.webmanifest',
  './favicon.svg',
  './favicon.ico',
  './favicon-96x96.png',
  './apple-touch-icon.png',
  './web-app-manifest-192x192.png',
  './web-app-manifest-512x512.png',
];

// ── Install ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !KNOWN_CACHES.includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (_) {
    return;
  }

  // Google Fonts CSS and WOFF/WOFF2 files → cache-first (immutable content)
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(cacheFirst(FONT_CACHE, request));
    return;
  }

  // External image CDNs → network-only (images are large and always refreshed)
  if (IMAGE_CDN_HOSTS.has(url.hostname)) {
    return;
  }

  // Same-origin requests (app shell, icons, etc.) → stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(SHELL_CACHE, request));
  }
});

// ── Helpers ───────────────────────────────────────────────

async function cacheFirst(cacheName, request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(cacheName, request) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
      return response;
    }
    // Network returned an error status — serve stale cache if available
    return cached || response;
  }).catch(() => cached || new Response('Service unavailable', { status: 503 }));

  return cached || networkFetch;
}
