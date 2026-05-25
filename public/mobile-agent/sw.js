const CACHE_NAME = 'xiaobai-tianshu-mobile-v0.2.3'
const PRECACHE = [
'./',
'./index.html',
'./desktop-brain.html',
'./manifest.webmanifest',
'./icons/icon.svg',
'./icons/xiaobai-ai-agent.png',
'./src/app.js',
'./src/styles.css',
'./src/mobile-hotspot-earth.js',
'./vendor/three/three.module.js',
'./vendor/d3/d3.min.js',
'./assets/earth/earth_atmos_2048.jpg',
'./assets/earth/earth_normal_2048.jpg',
'./assets/earth/earth_specular_2048.jpg',
'./assets/earth/earth_clouds_2048.png',
'./assets/desktop-brain/desktop-galaxy-background.jpg',
'./assets/image2/backgrounds/chat-orbit-bg.png',
'./assets/image2/backgrounds/tianshu-earth-bg.png',
'./assets/image2/xiaobai-mascot.png',
'./assets/image2/icons/back.png',
'./assets/image2/icons/camera.png',
'./assets/image2/icons/chat.png',
'./assets/image2/icons/close.png',
'./assets/image2/icons/file.png',
'./assets/image2/icons/menu.png',
'./assets/image2/icons/mic.png',
'./assets/image2/icons/news.png',
'./assets/image2/icons/photo.png',
'./assets/image2/icons/plus.png',
'./assets/image2/icons/send.png',
'./assets/image2/icons/settings.png',
'./assets/image2/icons/spark.png',
'./assets/image2/icons/task.png',
'./assets/image2/icons/tianshu.png',
'./assets/image2/icons/weather.png',
]
self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => undefined))
self.skipWaiting()
})
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys()
.then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
.then(() => self.clients.claim())
)
})
self.addEventListener('fetch', (event) => {
const request = event.request
if (request.method !== 'GET') return
const url = new URL(request.url)
if (url.origin !== location.origin) return
if (url.pathname.includes('/api/')) {
event.respondWith(fetch(request).catch(() => caches.match(request)))
return
}
event.respondWith(
caches.match(request).then((cached) => {
const refresh = fetch(request)
.then((response) => {
if (response.ok) {
const copy = response.clone()
caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
}
return response
})
.catch(() => cached)
return cached || refresh
})
)
})