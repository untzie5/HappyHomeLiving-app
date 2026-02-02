const app = document.getElementById("app");
app.use("/api", TodosAPI);



app.get("/health", (req, red) => res.json({ ok: true }));

export default app;
