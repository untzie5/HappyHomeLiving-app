document.addEventListener("DOMContentLoaded", () => {
  wireTosModal();
});

function wireTosModal() {
  const tosLink = document.getElementById("tos-link");
  const modal = document.getElementById("tos-modal");
  const closeTos = document.getElementById("close-tos");

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


app.get("/health", (req, red) => res.json({ ok: true }));

export default app;
