import { loadUser } from "./views/components/session.mjs";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}

const app = document.getElementById("app");
if (!app) throw new Error("Missing #app in index.html");

export function navigate(path) {
  history.pushState({}, "", path);
  route();
}

window.addEventListener("popstate", route);

route();

async function route() {
  const user = loadUser();
  const path = location.pathname;

  if (path === "/dashboard" && !user) {
    return navigate("/login");
  }

  if (path === "/" || path === "/index.html") {
    return navigate(user ? "/dashboard" : "/login");
  }

  if (path === "/login") {
    await renderView("/views/login-view/login.html");
    const mod = await import("./views/login-view/login.mjs");
    await mod.mount({ app, navigate });
    return;
  }

  if (path === "/dashboard") {
    await renderView("/views/dashboard-view/dashboard.html");
    const mod = await import("./views/dashboard-view/dashboard.mjs");
    await mod.mount({ app, navigate });
    return;
  }

  if (path === "/edit-user") {
    await renderView("/views/edit-view/edit-user.html");
    const mod = await import("./views/edit-view/edit-user.mjs");
    await mod.mount({ app, navigate});
    return;
  }

  app.innerHTML = `<h1>Not found</h1><p>Unknown route: ${path}</p>`;
}

async function renderView(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load view ${url}: ${res.status}`);
  app.innerHTML = await res.text();
}