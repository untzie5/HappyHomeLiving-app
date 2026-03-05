const CACHE_NAME = "hhl-cache-v4";

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
 "/components/session.mjs",

  "/views/i18n-client.mjs",
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
    e.respondWith(
      caches.match("/index.html").then((cached) => cached || fetch(req))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          if (!res || !res.ok) return res;

          const ct = res.headers.get("content-type") || "";
          const isProbablyHtml = ct.includes("text/html");
          const isModuleRequest =
            req.destination === "script" || req.headers.get("accept")?.includes("text/javascript");

          if (isProbablyHtml && isModuleRequest) return res;

          if (req.method === "GET") {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});