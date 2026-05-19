const CACHE_NAME = 'xiaobai-mobile-app-v2-cloud-remote'
const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '')
const assetPath = (path) => `${scopePath}${path}`
const CORE_ASSETS = [
  assetPath('/'),
  assetPath('/index.html'),
  assetPath('/manifest.webmanifest'),
  assetPath('/icons/icon.svg'),
  assetPath('/icons/icon-192.png'),
  assetPath('/icons/icon-512.png'),
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== location.origin) return

  if (url.pathname.startsWith(`${scopePath}/src/`) || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)))
    return
  }

  event.respondWith(
    fetch(request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
      return response
    }).catch(() => caches.match(request)),
  )
})
