import { apiRequest } from "../views/components/api.mjs";

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

    const header = document.createElement("div");
    header.className = "cu-header";

    const title = document.createElement("h2");
    title.textContent = "Create User";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "cu-close";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => this.close());

    header.append(title, closeBtn);

    const body = document.createElement("div");
    body.className = "cu-body";

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "username";
    const username = document.createElement("input");
    username.type = "text";
    username.required = true;
    username.minLength = 3;
    usernameLabel.append(username);

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password";
    const password = document.createElement("input");
    password.type = "password";
    password.required = true;
    password.minLength = 5;
    passwordLabel.append(password);

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email";
    const email = document.createElement("input");
    email.type = "email";
    email.required = true;
    emailLabel.append(email);

    const note = document.createElement("p");
    note.className = "cu-note";
    note.textContent = "You must accept Terms of Service to create an account.";

    const termsRow = document.createElement("div");
    termsRow.className = "terms";

    const tosCheckbox = document.createElement("input");
    tosCheckbox.type = "checkbox";

    const tosText = document.createElement("span");
    tosText.className = "terms-text";
    tosText.textContent = "I agree to the Terms of Service";

    termsRow.append(tosCheckbox, tosText);

    this.#error = document.createElement("p");
    this.#error.className = "cu-error";
    this.#error.hidden = true;

    this.#success = document.createElement("p");
    this.#success.className = "cu-success";
    this.#success.hidden = true;

    const footer = document.createElement("div");
    footer.className = "cu-footer";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "cu-submit";
    submit.textContent = "Create User";

    footer.append(submit);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.#error.hidden = true;
      this.#success.hidden = true;

      try {
        await apiRequest("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acceptToS: tosCheckbox.checked,
            username: username.value,
            password: password.value,
            email: email.value,
          }),
        });

        this.#success.textContent = "User created!";
        this.#success.hidden = false;
      } catch (err) {
        this.#error.textContent = err.message;
        this.#error.hidden = false;
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

    this.#tosDialog = document.createElement("dialog");
    this.#tosDialog.className = "tos-dialog";

    const tosCard = document.createElement("div");
    tosCard.className = "cu-card";

    const tosHeader = document.createElement("div");
    tosHeader.className = "cu-header";

    const tosTitle = document.createElement("h2");
    tosTitle.textContent = "Terms of Service";

    const tosClose = document.createElement("button");
    tosClose.type = "button";
    tosClose.className = "cu-close";
    tosClose.textContent = "Close";
    tosClose.addEventListener("click", () => this.#tosDialog.close());

    tosHeader.append(tosTitle, tosClose);

    const frame = document.createElement("iframe");
    frame.className = "tos-frame";
    frame.src = "/ToS.md"; 

    tosCard.append(tosHeader, frame);
    this.#tosDialog.append(tosCard);

    tosText.addEventListener("click", () => {
      this.#tosDialog.showModal();
    });

    this.append(this.#dialog, this.#tosDialog);
  }

  open() {
    this.#dialog.showModal();
  }

  close() {
    this.#dialog.close();
  }
}

customElements.define("create-user", CreateUser);
