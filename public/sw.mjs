const CACHE_NAME = "hhl-cache-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/app.mjs",
  "/manifest.json",

  "/views/login-view/login.html",
  "/views/dashboard-view/dashboard.html",
  "/views/edit-view/edit-user.html",
  "/views/ToS.md",

  "/components/create-user.mjs",
  "/components/delete-user.mjs",
  "/components/api.mjs",
  "/components/sessions.mjs",

  "/views/i18n-client.mjs",
  "/views/components/api.mjs",
  "/views/components/session.mjs",
  "/views/login-view/login.mjs",
  "/views/dashboard-view/dashboard.mjs",
  "/views/edit-view/edit-user.mjs",


  "/localization/en.json",
  "/localization/no.json",

  "/assets/icons/IconHHL-192.png",
  "/assets/icons/IconHHL-512.png",
  
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api/")) return;

  if (req.mode === "navigate") {
    e.respondWith(caches.match("/index.html").then((r) => r || fetch(req)));
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        if (req.method === "GET" && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});