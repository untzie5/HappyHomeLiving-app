import { apiRequest } from "../components/api.mjs";
import { saveUser } from "../components/session.mjs";
import "../../components/create-user.mjs";

export async function mount({ app, navigate }) {
  const form = app.querySelector("#login-form");
  const openBtn = app.querySelector("#open-create-user");
  const createUserEl = app.querySelector("#createUser");

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