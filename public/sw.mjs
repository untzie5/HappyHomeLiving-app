const CACHE_NAME = "hhl-cahce-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/app.mjs",

  // views 
  "/views/login-view/login.html",
  "/views/dashboard-view/dashboard.html",
  "/views/edit-view/edit-user.html",
  "/views/ToS.md",

  // client
  "/views/i18n-client.mjs",
  "/views/components/api.mjs",
  "/views/components/session.mjs",
  "/views/login-view/login.mjs",
  "/views/dashboard-view/dashboard.mjs",
  "/views/edit-view/edit-user.mjs",

  // localization
  "/localization/en.json",
  "/localization/no.json",

  // icons
  "/assets/icons/IconHHL-192.png",
  "/assets/icons/IconHHL-512.png",

  // manifest
  "/manifest.json",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api/")) return;

     if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cached) => cached || fetch(req))
    );
    return;
  }

  event. respontWith(
    caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
        .then((res) => {
            if (req.method === "GET" && res.ok) {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return res;
        })
        .catch(() => cached);
    })
  );
});