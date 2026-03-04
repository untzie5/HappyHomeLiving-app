import { apiRequest } from "../components/api.mjs";
import { loadUser, saveUser } from "../components/session.mjs";
import { t } from "../i18n-client,mjs";

const user = loadUser();
if (!user) location.replace("../login-view/login.html");

const form = document.getElementById("edit-form");
const err = document.getElementById("edit-error");
const ok = document.getElementById("edit-success");

(async () => {
  document.querySelector("h1").textContent = await t("ui.editUser.title");
  form.querySelector('label:nth-of-type(1)').textContent = await t("ui.editUser.newUsername");
  form.querySelector('label:nth-of-type(2)').textContent = await t("ui.editUser.newPassword");
  form.querySelector('button[type="submit"]').textContent = await t("ui.editUser.confirm");
  document.getElementById("back-btn").textContent = await t("ui.editUser.back");
})();

document.getElementById("back-btn")?.addEventListener("click", () => {
  location.href = "../dashboard-view/dashboard.html";
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
    username: username|| undefined,
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
