import { apiRequest } from "/components/api.mjs";
import { t } from "/views/i18n-client.mjs";


class CreateUser extends HTMLElement {
  #dialog;
  #tosDialog;
  #error;
  #success;

  connectedCallback() {
    if (this.#dialog) return;

    this.#dialog = document.createElement("dialog");
    this.#dialog.className = "cu-dialog";

    const form = document.createElement("form");
    form.className = "cu-card";
    form.noValidate = true;

    const header = document.createElement("div");
    header.className = "cu-header";

    const title = document.createElement("h2");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "cu-close";
    closeBtn.addEventListener("click", () => this.close());

    header.append(title, closeBtn);

    const body = document.createElement("div");
    body.className = "cu-body";

    //--------------------------
    const usernameLabel = document.createElement("label");
    const usernameText = document.createElement("span");
    const username = document.createElement("input");
    username.type = "text";
    username.autocomplete = "username";
    usernameLabel.append(usernameText, username);

    //------------------------- 
    const passwordLabel = document.createElement("label");
    const passwordText = document.createElement("span");
    const password = document.createElement("input");
    password.type = "password";
    password.autocomplete = "new-password";
    passwordLabel.append(passwordText, password);

    //--------------------------
    const emailLabel = document.createElement("label");
    const emailText = document.createElement("span");
    const email = document.createElement("input");
    email.type = "email";
    email.autocomplete = "email";
    emailLabel.append(emailText, email);

    const note = document.createElement("p");
    note.className = "cu-note";

    //-------------------------
    const termsRow = document.createElement("div");
    termsRow.className = "terms";

    const tosLabel = document.createElement("label");
    tosLabel.className = "terms-label";

    const tosCheckbox = document.createElement("input");
    tosCheckbox.type = "checkbox";

    const tosText = document.createElement("span");
    tosText.className = "terms-text";

    tosLabel.append(tosCheckbox, tosText);
    termsRow.append(tosLabel);

    //--------------------------
    this.#error = document.createElement("p");
    this.#error.className = "cu-error";
    this.#error.hidden = true;
    this.#error.setAttribute("aria-live", "polite");

    this.#success = document.createElement("p");
    this.#success.className = "cu-success";
    this.#success.hidden = true;
    this.#success.setAttribute("aria-live", "polite");

    //---------------------------
    const footer = document.createElement("div");
    footer.className = "cu-footer";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "cu-submit";
    footer.append(submit);

    //----------------------------
     (async () => {
      title.textContent = await t("ui.createUser.title");
      closeBtn.textContent = await t("ui.createUser.close");

      usernameText.textContent = await t("ui.createUser.username");
      passwordText.textContent = await t("ui.createUser.password");
      emailText.textContent = await t("ui.createUser.email");

      note.textContent = await t("ui.createUser.note");
      tosText.textContent = await t("ui.createUser.tosLink");
      submit.textContent = await t("ui.createUser.submit");
    })();

    //-----------------------
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.#error.hidden = true;
      this.#success.hidden = true;

      const u = username.value.trim();
      const p = password.value;
      const em = email.value.trim();

      if (!u) return this.#showError(await t("errors.required"));
      if (u.length < 3) return this.#showError(await t("errors.usernameTooShort"));

      if (!p) return this.#showError(await t("errors.required"));
      if (p.trim().length < 5) return this.#showError(await t("errors.passwordTooShort"));

      if (!em) return this.#showError(await t("errors.required"));
      if (!em.includes("@")) return this.#showError(await t("errors.invalidEmail"));

      if (!tosCheckbox.checked) return this.#showError(await t("errors.tosRequired"));

      try {
        await apiRequest("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acceptToS: true,
            username: u,
            password: p,
            email: em,
          }),
        });

        this.#success.textContent = await t("users.created");
        this.#success.hidden = false;
      } catch (err) {
        this.#showError(err.message);
      }
    });

    body.append(
      usernameLabel,
      passwordLabel,
      emailLabel,
      note,
      termsRow,
      this.#error,
      this.#success
    );

    form.append(header, body, footer);
    this.#dialog.append(form);

    //----------------------------
   this.#tosDialog = document.createElement("dialog");
this.#tosDialog.className = "tos-dialog";

const tosCard = document.createElement("div");
tosCard.className = "cu-card tos-card";

const tosBody = document.createElement("div");
tosBody.className = "tos-html-content";
tosBody.innerHTML = `<p>Loading...</p>`;

tosCard.append(tosBody);
this.#tosDialog.append(tosCard);

tosText.addEventListener("click", async () => {
  try {
    const res = await fetch("/views/tos-pp-view.html", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load Terms and Privacy view");

    tosBody.innerHTML = await res.text();

    const closeBtn = tosBody.querySelector("#cu-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.#tosDialog.close());
    }

    this.#tosDialog.showModal();
  } catch (err) {
    tosBody.innerHTML = `<p class="cu-error">${err.message}</p>`;
    this.#tosDialog.showModal();
  }
});

    this.append(this.#dialog, this.#tosDialog);
  }

  #showError(msg) {
    this.#error.textContent = msg;
    this.#error.hidden = false;
  }

  open() {
    this.#dialog.showModal(); 
  }
  close() {
    this.#dialog.close();
  }
}

customElements.define("create-user", CreateUser);
