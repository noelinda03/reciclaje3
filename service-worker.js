const CACHE_NAME = "recycling-map-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
    "/css/styles.css",
    "/imagenes/mundo.png", // Asegúrate de que las rutas de los iconos sean correctas
    "/imagenes/mundo.png" // Asegúrate de que las rutas de los iconos sean correctas

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

            if (!navigator.onLine) {
                // Si está offline, devuelve un mensaje JSON o de texto
                return new Response(
                    "Estás offline. Algunas funcionalidades podrían no estar disponibles.", {
                        status: 503,
                        statusText: "Servicio no disponible",
                        headers: { "Content-Type": "text/plain" }
                    }
                );
            }

            return fetch(event.request);
        })
        .catch(error => {
            console.log("Error al intentar obtener el recurso:", error);
            return new Response("Error al cargar el recurso.", { status: 500 });
        })
    );
});