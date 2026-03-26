import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import todosRouter from "./routes/TodosAPI.mjs";
import UserRouter from "./routes/UsersAPI.mjs";
import notificationsRouter from "./routes/NotificationsAPI.mjs";

const app =  express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

app.use(express.json());

app.use(express.static(publicDir));
app.use("/localization", express.static("localization"));
app.use("/api/todos", todosRouter);
app.use("/api/user", UserRouter);
app.use("/api/notifications", notificationsRouter);

app.get(/^(?!\/api\/).*/, (req, res, next) => {
  if (req.path.includes(".")) return next();

  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen (PORT, () => {
console.log (`Server is running on port ${PORT}`)
});