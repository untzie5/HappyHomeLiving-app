import { apiRequest } from "./api.mjs";
import { t } from "../views/i18n-client.mjs";

class DeleteUser extends HTMLElement {
  user = null;

  async connectedCallback() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = await t("ui.deleteUser.button");

    const error = document.createElement("p");
    error.className = "cu-error";
    error.hidden = true;
    error.setAttribute("aria-live", "polite");

    btn.addEventListener("click", async () => {
      error.hidden = true;

      if (!this.user) {
        error.textContent = await t("ui.deleteUser.noUserSet");
        error.hidden = false;
        return;
      }

      const confirmed = confirm(await t("ui.deleteUser.confirm"));
      if (!confirmed) return;

      try {
        await apiRequest(`/api/user/${this.user.id}`, { method: "DELETE" });
        this.dispatchEvent(new CustomEvent("user-deleted"));
      } catch (err) {
        error.textContent = err.message;
        error.hidden = false;
      }
    });

    this.append(btn, error);
  }
}

customElements.define("delete-user", DeleteUser);