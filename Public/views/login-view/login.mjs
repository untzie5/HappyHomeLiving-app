import { apiRequest } from "../components/api.mjs";
import { saveUser } from "../components/session.mjs";
import "../../components/create-user.mjs";

const form = document.getElementById("login-form");
const openBtn = document.getElementById("open-create-user");
const createUserEl = document.getElementById("createUser");

openBtn?.addEventListener("click", () => createUserEl.open());

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const user = await apiRequest("../../api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    saveUser(user);
    location.href = "../dashboard-view/dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
