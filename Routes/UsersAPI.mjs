import express from "express";
import { registerUser, loginUser, getUser, patchUser, removeUser } from "../services/usersService.mjs";
import { getLocaleFromRequest, t } from "../modules/i18n.mjs";

function localizeResponse(req, body) {
  const locale = getLocaleFromRequest(req);

  const out = { ...body};

   if (out?.error && typeof out.error === "string" && out.error.startsWith("errors.")) {
    out.errorKey = out.error;
    out.error = t(locale, out.error);
}

if (out?.message && typeof out.message === "string" && out.message.startsWith("users.")) {
    out.messageKey = out.message;
    out.message = t(locale, out.message);

  }

  return out;
}

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(result.status).json(localizeResponse(req, result.body));
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const out = await loginUser(req.body ?? {});
  res.status(out.status).json(localizeResponse(req, out.body));
});


userRouter.get("/:id", async (req, res) => {
  const out = await getUser(req.params.id);
  res.status(out.status).json(localizeResponse(req, out.body));
});

userRouter.patch("/:id", async (req, res) => {
  const out = await patchUser(req.params.id, req.body ?? {});
  res.status(out.status).json(localizeResponse(req, out.body));
});

userRouter.delete("/:id", async (req, res) => {
  const out = await removeUser(req.params.id);
  res.status(out.status).json(localizeResponse(req, out.body));
});

export default userRouter;