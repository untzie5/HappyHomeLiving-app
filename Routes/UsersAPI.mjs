import express from "express";
import { registerUser, loginUser, getUser, patchUser, removeUser } from "../services/usersService.mjs";
import { getLocaleFromRequest, t } from "../modules/i18n.mjs";

function localizeBody(req, body) {
  const locale = getLocaleFromRequest(req);

   if (body?.error && typeof body.error === "string" && body.error.startsWith("errors.")) {
    return { ...body, errorKey: body.error, error: t(locale, body.error) };
  }

  return body;
}

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(result.status).json(localizeBody(req, out.body));
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const out = await loginUser(req.body ?? {});
  res.status(out.status).json(localizeBody(req, out.body));
});


userRouter.get("/:id", async (req, res) => {
  const out = await getUser(req.params.id);
  res.status(out.status).json(localizeBody(req, out.body));
});

userRouter.patch("/:id", async (req, res) => {
  const out = await patchUser(req.params.id, req.body ?? {});
  res.status(out.status).json(localizeBody(req, out.body));
});

userRouter.delete("/:id", async (req, res) => {
  const out = await removeUser(req.params.id);
  res.status(out.status).json(localizeBody(req, out.body));
});

export default userRouter;