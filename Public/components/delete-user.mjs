import { apiRequest } from "../views/components/api.mjs";

class DeleteUser extends HTMLElement {
  user = null;

  connectedCallback() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Delete user";

    btn.addEventListener("click", async () => {
      if (!this.user) return alert("No user set");
      if (!confirm("Delete your account?")) return;

      try {
        await apiRequest(`../api/user/${this.user.id}`, { method: "DELETE" });
        this.dispatchEvent(new CustomEvent("user-deleted"));
      } catch (err) {
        alert(err.message);
      }
    });

    this.append(btn);
  }
}

customElements.define("delete-user", DeleteUser);
