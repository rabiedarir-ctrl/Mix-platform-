const CACHE_NAME = "mix-platform-v1";
const ASSETS_TO_CACHE = [
    "/index.html",
    "/login.html",
    "/dashboard.html",
    "/feed.html",
    "/messages.html",
    "/store.html",
    "/games.html",
    "/world.html",
    "/dream_world.html",
    "/static/style.css",
    "/static/main.js",
    "/static/api.js",
    "/static/auth.js",
    "/static/social.js",
    "/static/messages.js",
    "/static/wallet.js",
    "/static/store.js",
    "/static/games.js",
    "/static/dreams.js",
    "/static/matrix.js",
    "/static/dashboard.js",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png"
];

// ===========================
// 🔹 تثبيت Service Worker وتخزين الموارد
// ===========================
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// ===========================
// 🔹 تفعيل Service Worker وتنظيف النسخ القديمة
// ===========================
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ===========================
// 🔹 اعتراض الطلبات وتقديم نسخة مخزنة أو الشبكة
// ===========================
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    // يمكن إضافة صفحة Offline بديلة
                    if (event.request.destination === "document") {
                        return caches.match("/index.html");
                    }
                });
        })
    );
});
