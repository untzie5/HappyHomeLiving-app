import app from "./Public/app.mjs";
import contentRouter from "./Routes/TodosAPI.mjs";
import UserRouter from "./Routes/UsersAPI.mjs";


const PORT = 3000;

app.use("/content", contentRouter);
app.use("/user", UserRouter);


app.listen (PORT, () => {
console.log (`Server is running on port ${PORT}`)
});