// sw-shell.js
const SHELL_CACHE = 'shell-v1';
const CONTENT_CACHE = 'content-v1';

const shellFiles = [
    '/',
    './index.html',
    './style.css',
    './app.js',
    './images/icon-192.png',
    './images/icon-512.png',
];

const contentUrls = [
    '/productos',
    '/carrito',
    '/checkout',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then((cache) => {
            console.log('[SW] Guardando el shell en caché');
            return cache.addAll(shellFiles);
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    if (shellFiles.includes(event.request.url)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).then((response) => {
                    const clone = response.clone();
                    caches.open(CONTENT_CACHE).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                });
            })
        );
    }
});
