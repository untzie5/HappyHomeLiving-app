import { apiRequest } from "../components/api.mjs";
import { loadUser, saveUser } from "../components/session.mjs";

const user = loadUser();
if (!user) location.replace("../login-view/login.html");

const form = document.getElementById("edit-form");
const err = document.getElementById("edit-error");
const ok = document.getElementById("edit-success");

document.getElementById("back-btn")?.addEventListener("click", () => {
  location.href = "../dashboard-view/dashboard.html";
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  err.hidden = true;
  ok.hidden = true;

  const payload = {
    username: form.username.value || undefined,
    password: form.password.value || undefined,
  };

  try {
    const updated = await apiRequest(`../../api/user/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    saveUser(updated);
    ok.textContent = "Updated!";
    ok.hidden = false;
  } catch (e2) {
    err.textContent = e2.message;
    err.hidden = false;
  }
});
