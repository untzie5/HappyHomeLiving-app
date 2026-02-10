import { loadUser } from "./views/components/session.mjs";

// App entry point
// Ansvar: avgjøre start-view basert på session state

const user = loadUser();

if (user) {
  // Bruker er "innlogget" i denne session
  location.replace("./views/dashboard-view/dashboard.html");
} else {
  // Ingen session → login
  location.replace("./views/login-view/login.html");
}
