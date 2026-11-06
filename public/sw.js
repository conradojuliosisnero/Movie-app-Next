// Service worker de PeliBox: abre rápido y muestra una pantalla sin conexión en vez del error del navegador.
// - Páginas: red primero; si no hay conexión, la última copia o /offline.html (autónoma, sin JS).
// - Archivos de la app (_next/static, íconos, fuentes): caché primero (tienen hash, no cambian).
// - Pósters de TMDB: caché y se actualizan en segundo plano (máximo IMAGE_LIMIT).
// - /api y Firebase: nunca se cachean (datos personales y en vivo).
const VERSION = 'pelibox-v2';
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const IMAGES = `${VERSION}-images`;
const IMAGE_LIMIT = 200;
const PRECACHE = ['/offline.html', '/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Páginas: red primero, con respaldo sin conexión.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(request, copy)); return res; })
        .catch(async () => (await caches.match(request)) ?? caches.match('/offline.html'))
    );
    return;
  }

  // Archivos estáticos de la app.
  if (url.origin === self.location.origin && (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/') || url.pathname === '/icon.svg')) {
    event.respondWith(
      caches.match(request).then((hit) => hit ?? fetch(request).then((res) => { const copy = res.clone(); caches.open(STATIC).then((c) => c.put(request, copy)); return res; }).catch(() => Response.error()))
    );
    return;
  }

  // Pósters e imágenes de TMDB.
  if (url.hostname === 'image.tmdb.org') {
    event.respondWith(
      caches.open(IMAGES).then(async (cache) => {
        const hit = await cache.match(request);
        const fresh = fetch(request).then((res) => { cache.put(request, res.clone()); trim(IMAGES, IMAGE_LIMIT); return res; }).catch(() => hit ?? Response.error());
        return hit ?? fresh;
      })
    );
  }
  // Todo lo demás (API, Firebase, YouTube…) va directo a la red.
});
