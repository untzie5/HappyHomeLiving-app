import express from "expess";
import app from "./Public/app.mjs";
import todosRouter from "./Routes/TodosAPI.mjs";
import UserRouter from "./Routes/UsersAPI.mjs";

const app = new express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/todos", todosRouter);
app.use("/api/user", UserRouter);


app.listen (PORT, () => {
console.log (`Server is running on port ${PORT}`)
});