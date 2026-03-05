import { loadUser, clearUser } from "../components/session.mjs";
import "../../components/delete-user.mjs";

export async function mount({ app, navigate }) {
  const user = loadUser();
  if (!user) return navigate("/login");

  app.querySelector("#usernameText").textContent = user.username;

  app.querySelector("#logout-btn")?.addEventListener("click", () => {
    clearUser();
    navigate("/login");
  });

  app.querySelector("#edit-user-btn")?.addEventListener("click", () => {
    navigate("/edit-user");
  });

  const del = app.querySelector("#deleteUser");
  del.user = user;

  del.addEventListener("user-deleted", () => {
    clearUser();
    navigate("/login");
  });
}