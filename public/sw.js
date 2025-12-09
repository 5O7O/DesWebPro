
const CACHE_NAME = "deswebpro-v1";

const FILES_TO_CACHE = [
  "/",                // la ruta raíz
  "/index.html",
  "/carrito.html",
  "/style.css",
  "/style2.css",
  "/script.js",
  "/manifest.json",
  // Si tienes imágenes, agrégalas también, por ejemplo:
  // "/img/logo.png",
  // "/img/producto1.jpg",
];

// sw.js
console.log("¡Service Worker registrado!");

// (Opcional) para ver claramente el ciclo de vida:
self.addEventListener("install", (event) => {
  console.log("Service Worker: evento install");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: evento activate");
});
self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Guardando en caché los archivos iniciales");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
self.addEventListener("fetch", (event) => {
  // Solo manejamos peticiones GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Si está en caché, devuelve eso
        return cachedResponse;
      }

      // Si no, se va a la red y opcionalmente guarda la respuesta
      return fetch(event.request)
        .then((networkResponse) => {
          // Puedes omitir cache dinámico si quieres algo básico
          return networkResponse;
        })
        .catch((error) => {
          console.error("[SW] Error en fetch:", error);
          // Podrías devolver una página offline personalizada aquí
          // return caches.match("./offline.html");
        });
    })
  );
});
