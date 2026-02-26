import express from "express";
import { registerUser, loginUser, getUser, patchUser, removeUser } from "../services/usersService.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", (req, res) => {
  const out = registerUser(req.body ?? {});
  res.status(out.status).json(out.body);
});

userRouter.post("/login", (req, res) => {
  const out = loginUser(req.body ?? {});
  res.status(out.status).json(out.body);
});

userRouter.get("/:id", (req, res) => {
  const out = getUser(req.params.id);
  res.status(out.status).json(out.body);
});

userRouter.patch("/:id", (req, res) => {
  const out = patchUser(req.params.id, req.body ?? {});
  res.status(out.status).json(out.body);
});

userRouter.delete("/:id", (req, res) => {
  const out = removeUser(req.params.id);
  res.status(out.status).json(out.body);
});

export default userRouter;