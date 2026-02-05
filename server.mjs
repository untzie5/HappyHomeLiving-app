import express from "express";
import todosRouter from "./Routes/TodosAPI.mjs";
import UserRouter from "./Routes/UsersAPI.mjs";

const app =  express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use (express.static("Public"));
app.listen (PORT, () => {
console.log (`Server is running on port ${PORT}`)
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/todos", todosRouter);
app.use("/api/user", UserRouter);

