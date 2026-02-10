import { loadUser, clearUser } from "../components/session.mjs";
import "../../components/delete-user.mjs";

const user = loadUser();
if (!user) location.replace("../login-view/login.html");

document.getElementById("usernameText").textContent = user.username;

document.getElementById("logout-btn")?.addEventListener("click", () => {
  clearUser();
  location.href = "../login-view/login.html";
});

document.getElementById("edit-user-btn")?.addEventListener("click", () => {
  location.href = "../edit-view/edit-user.html";
});

const del = document.getElementById("deleteUser");
del.user = user;

del.addEventListener("user-deleted", () => {
  clearUser();
  location.href = "../login-view/login.html";
});
