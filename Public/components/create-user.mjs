import { apiRequest } from "../views/components/api.mjs";

class CreateUser extends HTMLElement {
  #dialog;
  #error;
  #success;

  connectedCallback() {
    // Minimal DOM (du kan bygge videre)
    this.#dialog = document.createElement("dialog");
    this.#dialog.className = "cu-dialog";

    const form = document.createElement("form");
    form.className = "cu-card";

    const body = document.createElement("div");
    body.className = "cu-body";

    const username = document.createElement("input");
    username.id = "cu-username";
    username.required = true;
    username.minLength = 3;
    username.placeholder = "username";

    const password = document.createElement("input");
    password.id = "cu-password";
    password.type = "password";
    password.required = true;
    password.minLength = 5;
    password.placeholder = "password";

    const email = document.createElement("input");
    email.id = "cu-email";
    email.type = "email";
    email.required = true;
    email.placeholder = "email";

    const tos = document.createElement("input");
    tos.type = "checkbox";
    tos.id = "terms";

    const tosLink = document.createElement("a");
    tosLink.href = "../ToS.md"; // <-- viktig: komponenten ligger i /components/
    tosLink.textContent = "Terms of service";
    tosLink.target = "_blank";

    this.#error = document.createElement("p");
    this.#error.className = "cu-error";
    this.#error.hidden = true;

    this.#success = document.createElement("p");
    this.#success.className = "cu-success";
    this.#success.hidden = true;

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "cu-submit";
    submit.textContent = "Create User";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.#error.hidden = true;
      this.#success.hidden = true;

      try {
        await apiRequest("../api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acceptToS: tos.checked,
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

    body.append(username, password, email, tos, tosLink, this.#error, this.#success, submit);
    form.append(body);
    this.#dialog.append(form);
    this.append(this.#dialog);
  }

  open() {
    this.#dialog.showModal();
  }
  close() {
    this.#dialog.close();
  }
}

customElements.define("create-user", CreateUser);
