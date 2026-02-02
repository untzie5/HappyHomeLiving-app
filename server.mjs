import express from "expess";
import app from "./Public/app.mjs";
import todosRouter from "./Routes/TodosAPI.mjs";
import UserRouter from "./Routes/UsersAPI.mjs";


const PORT = process.env.PORT || 3000;
const app = new express();

app.use(express.json());

app.use("/Todo", TodosAPI);
app.use("/user", UserRouter);


app.listen (PORT, () => {
console.log (`Server is running on port ${PORT}`)
});