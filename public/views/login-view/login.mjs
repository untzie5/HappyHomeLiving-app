import { apiRequest } from "/components/api.mjs";
import { saveUser } from "/components/session.mjs";
import { t } from "/views/i18n-client.mjs";
import "/components/create-user.mjs";

export async function mount({ app, navigate }) {
  const form = app.querySelector("#login-form");
  const openBtn = app.querySelector("#open-create-user");
  const createUserEl = app.querySelector("#createUser");

  app.querySelector("#login-app-title").textContent = await t("ui.login.appTitle");
  app.querySelector("#login-title").textContent = await t("ui.login.title");
  app.querySelector("#login-username-label").textContent = await t("ui.login.username");
  app.querySelector("#login-password-label").textContent = await t("ui.login.password");
  app.querySelector("#login-submit-btn").textContent = await t("ui.login.submit");
  app.querySelector("#login-create-text").textContent = await t("ui.login.notUserYet");
  app.querySelector("#open-create-user").textContent = await t("ui.login.createUser");

  openBtn?.addEventListener("click", () => createUserEl.open());

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = app.querySelector("#username")?.value ?? "";
    const password = app.querySelector("#password")?.value ?? "";

    try {
      const user = await apiRequest("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      saveUser(user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  });
}