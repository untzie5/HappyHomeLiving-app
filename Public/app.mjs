const app = document.getElementById("app");

showSignIn();

/* ========= Views ========= */

function showSignIn() {
  app.innerHTML = signInHTML();
  wireCreateAccountLink();
  wireLogin(); // (placeholder – gjør ingenting hvis du ikke trenger login enda)
}

function showCreateUser() {
  app.innerHTML = createUserHTML();
  wireBackToSignIn();
  wireTosModal();
  wireCreateUser();
}

/* ========= HTML templates ========= */

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

/* ========= Wiring ========= */

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

      successEl.textContent = `User created! id: ${created.id}`;
      successEl.hidden = false;

      // Valgfritt: send tilbake til sign in etter opprettelse
      // showSignIn();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });
}


async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/* ========= Placeholders (kan fylles senere) ========= */
function wireLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // login kommer senere
  });
}
