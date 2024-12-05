const CACHE_NAME = "recycling-map-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
    "/css/styles.css",
    "/imagenes/mundo.png", // Asegúrate de que las rutas de los iconos sean correctas
    "/imagenes/mundo.png", // Asegúrate de que las rutas de los iconos sean correctas
    "/offline.html"
];

// Instala el Service Worker y almacena los recursos en caché
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log("Cachando recursos...", urlsToCache); // Agrega un log aquí
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercepta las solicitudes de red y sirve desde el caché si está disponible
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response; // Si está en caché, devuelve el recurso
            }

            // Si no hay respuesta en caché y no hay red, puedes devolver un mensaje o recurso alternativo
            if (!navigator.onLine) {
                return caches.match("/offline.html"); // Asegúrate de tener un archivo offline.html
            }

            return fetch(event.request); // Si está en línea, obtiene el recurso desde la red
        })
        .catch(error => {
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