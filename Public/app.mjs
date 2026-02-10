import { loadUser } from "./views/components/session.mjs";

const user = loadUser();

if (user) {
  location.replace("./views/dashboard-view/dashboard.html");
} else {
  location.replace("./views/login-view/login.html");
}
