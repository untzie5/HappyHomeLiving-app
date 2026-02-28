import express from "express";
import { registerUser, loginUser, getUser, patchUser, removeUser } from "../services/usersService.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", async (req, res) => {
  const result  = await registerUser(req.body);
  res.status(result.status).json(result.body);
});

userRouter.post("/login", async (req, res) => {
  const out = await loginUser(req.body ?? {});
  res.status(out.status).json(out.body);
});

userRouter.get("/:id", async (req, res) => {
  const out = await getUser(req.params.id);
  res.status(out.status).json(out.body);
});

userRouter.patch("/:id", async (req, res) => {
  const out = await patchUser(req.params.id, req.body ?? {});
  res.status(out.status).json(out.body);
});

userRouter.delete("/:id", async (req, res) => {
  const out = await removeUser(req.params.id);
  res.status(out.status).json(out.body);
});

export default userRouter;