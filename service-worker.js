const CACHE_NAME = "recycling-map-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
    "/css/styles.css"
];

// Instala el Service Worker y almacena los recursos en caché
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

// Intercepta las solicitudes de red y sirve desde el caché si está disponible
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Retorna el recurso del caché o intenta obtenerlo de la red
            return response || (navigator.onLine ? fetch(event.request) : Promise.reject("Offline"));
        }).catch(error => {
            console.log("Recurso no disponible en caché y sin conexión:", error);
        })
    );
});

// Actualiza el caché
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});