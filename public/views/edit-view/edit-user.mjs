import { apiRequest } from "../components/api.mjs";
import { loadUser, saveUser } from "../components/session.mjs";
import { t } from "../i18n-client.mjs";

export async function mount({ app, navigate }) {
  const user = loadUser();
  if (!user) return navigate("/login");

  const form = app.querySelector("#edit-form");
  const err = app.querySelector("#edit-error");
  const ok = app.querySelector("#edit-success");

  // i18n labels/buttons
  app.querySelector("h1").textContent = await t("ui.editUser.title");
  app.querySelector("#lbl-username").textContent = await t("ui.editUser.newUsername");
  app.querySelector("#lbl-password").textContent = await t("ui.editUser.newPassword");
  app.querySelector("#confirm-btn").textContent = await t("ui.editUser.confirm");
  app.querySelector("#back-btn").textContent = await t("ui.editUser.back");

  app.querySelector("#back-btn")?.addEventListener("click", () => {
    navigate("/dashboard");
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    ok.hidden = true;

    const username = form.username.value?.trim();
    const password = form.password.value;

    if (username && username.length < 3) {
      err.textContent = await t("errors.usernameTooShort");
      err.hidden = false;
      return;
    }

    if (password && password.trim().length < 5) {
      err.textContent = await t("errors.passwordTooShort");
      err.hidden = false;
      return;
    }

    const payload = {
      username: username || undefined,
      password: password || undefined,
    };

    try {
      const updated = await apiRequest(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      saveUser(updated);
      ok.textContent = await t("users.updated");
      ok.hidden = false;
    } catch (e2) {
      err.textContent = e2.message;
      err.hidden = false;
    }
  });
}