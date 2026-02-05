const app = document.getElementById("app");
let currentUser = null; 

showSignIn();


function showSignIn() {
  app.innerHTML = signInHTML();
  wireCreateAccountLink();
  wireLogin(); 
}

function showCreateUser() {
  app.innerHTML = createUserHTML();
  wireBackToSignIn();
  wireTosModal();
  wireCreateUser();
}

function showDashboard(user) {
  currentUser = user;
  app.innerHTML = dashboardHTML(user);
  wireLogout();
  wireGoToEdit();
  wireDeleteUser();
}

function showEditUser() {
  app.innerHTML = editUserHTML(currentUser);
  wireBackToDashboard();
  wireEditUser();
}


function signInHTML() {
  return `
    <main>
      <h1>sign in</h1>

      <form id="login-form">
        <div>
          <label for="username">username</label>
          <input id="username" name="username" type="text" required />
        </div>

        <div>
          <label for="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>

        <button type="submit">sign in</button>
      </form>
    </main>

    <div class="create-user-container">
      <p>Not a user yet?</p>
      <button type="button" class="create-user-btn" id="go-create-user">Create user</button>
    </div>
  `;
}

function createUserHTML() {
  return `
    <dialog id="create-user-dialog" class="cu-dialog" open>
      <form class="cu-card" id="create-user-form">
        <div class="cu-header">
          <h2>Create User</h2>
          <button type="button" class="cu-close" id="back-to-signin">Close</button>
        </div>

        <div class="cu-body">
          <label>
            username
            <input id="cu-username" type="text" minlength="3" required />
          </label>

          <label>
            Password
            <input id="cu-password" type="password" minlength="5" required />
          </label>

          <label>
            Email
            <input id="cu-email" type="email" required />
          </label>

          <p class="cu-note">You must accept Terms of Service to create an account.</p>

          <div class="terms">
            <input type="checkbox" id="terms" />
            <span class="terms-text" id="tos-link">Terms of service</span>
          </div>

          <p class="cu-error" id="cu-error" hidden></p>
          <p class="cu-success" id="cu-success" hidden></p>
        </div>

        <div class="cu-footer">
          <button type="submit" class="cu-submit" id="cu-submit">Create User</button>
        </div>
      </form>
    </dialog>

    ${tosModalHTML()}
  `;
}

function tosModalHTML() {
  return `
    <div id="tos-modal" class="modal hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Terms of Service</h2>
          <button id="close-tos" type="button">Close</button>
        </div>
        <iframe class="tos-frame" src="./ToS.md"></iframe>
      </div>
    </div>
  `;
}

function dashboardHTML(user) {
    return `
    <main>
        <h1> Happy Home Living </h1>
        <p> Logged in as <strong> ${user.username}</strong></p>
        
        <button type="button" id="edit-user-btn"> Edit user </button>
        <button type="button" id="delete-user-btn"> Delete user </button>
        <button type="button" id="logout-btn"> Logout </button>
        
        <p id="dass-error" class"cu-error" hidden></p>
    </main>
    `;
}

function editUserHTML(user) {
  return `
    <main>
      <h1>Edit user</h1>

      <form id="edit-form">
        <div>
          <label>New username (optional)</label>
          <input name="username" type="text" placeholder="${user.username}" />
        </div>

        <div>
          <label>New password (optional)</label>
          <input name="password" type="password" />
        </div>

         <button type="submit">Confirm</button>
        <button type="button" id="back-to-dashboard">Back</button>

        <p id="edit-error" class="cu-error" hidden></p>
        <p id="edit-success" class="cu-success" hidden></p>
      </form>
    </main>
  `;
}

  function loggedInHTML(username) {
    return `
    <h1> HAppy Home Living </h1>

    <section id= "editAccount-section">
        <h2> Edit Account </h2>

        <form id= "Edit-form">
            <input name= "username" type="text" placeholder="New username (optional)"/>
            <input name ="password" type="password" placeholder="New password (optional)"/>

            <button type="submit"> Confirm </button>
            <button type="button" id="return-to-loggedIn"> Back </button>
        </form>
    </section>
    `;
  
}


function wireCreateAccountLink() {
  const btn = document.getElementById("go-create-user");
  if (!btn) return;
  btn.addEventListener("click", showCreateUser);
}

function wireBackToSignIn() {
  const btn = document.getElementById("back-to-signin");
  if (!btn) return;
  btn.addEventListener("click", showSignIn);
}

function wireTosModal() {
  const tosLink = document.getElementById("tos-link");
  const modal = document.getElementById("tos-modal");
  const closeTos = document.getElementById("close-tos");

  if (!tosLink || !modal || !closeTos) return;

  tosLink.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
  });

  closeTos.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}

function wireCreateUser() {
  const form = document.getElementById("create-user-form");
  const tosCheckbox = document.getElementById("terms");

  const usernameEl = document.getElementById("cu-username");
  const passwordEl = document.getElementById("cu-password");
  const emailEl = document.getElementById("cu-email");

  const errorEl = document.getElementById("cu-error");
  const successEl = document.getElementById("cu-success");

  if (!form || !tosCheckbox || !usernameEl || !passwordEl || !emailEl || !errorEl || !successEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    successEl.hidden = true;

    try {
      const created = await apiRequest("./api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptToS: tosCheckbox.checked,
          username: usernameEl.value,
          password: passwordEl.value,
          email: emailEl.value,
        }),
      });

      successEl.textContent = `User created!`;
      successEl.hidden = false;

    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });
}


function wireLogout() {
  const btn = document.getElementById("logout-btn");
  btn?.addEventListener("click", () => {
    currentUser = null;
    showSignIn();
  });
}

function wireGoToEdit() {
  const btn = document.getElementById("edit-user-btn");
  btn?.addEventListener("click", showEditUser);
}

function wireDeleteUser() {
  const btn = document.getElementById("delete-user-btn");
  const err = document.getElementById("dash-error");

  btn?.addEventListener("click", async () => {
    if (!confirm("Delete your account?")) return;

    try {
      await apiRequest(`./api/user/${currentUser.id}`, { method: "DELETE" });
      currentUser = null;
      showSignIn();
    } catch (e) {
      if (err) { err.textContent = e.message; err.hidden = false; }
    }
  });
}

function wireBackToDashboard() {
  document.getElementById("back-to-dashboard")
    ?.addEventListener("click", () => showDashboard(currentUser));
}

function wireEditUser() {
  const form = document.getElementById("edit-form");
  const err = document.getElementById("edit-error");
  const ok = document.getElementById("edit-success");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    ok.hidden = true;

    const payload = {
      username: form.username.value || undefined,
      password: form.password.value || undefined,
    };

    try {
      const updated = await apiRequest(`./api/user/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      currentUser = updated;
      ok.textContent = "Updated!";
      ok.hidden = false;
    } catch (e2) {
      err.textContent = e2.message;
      err.hidden = false;
    }
  });
}


async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function wireLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const user = await apiRequest("./api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
        }),
      });

      showDashboard(user);
    } catch (err) {
      alert(err.message);
    }
  });
}
