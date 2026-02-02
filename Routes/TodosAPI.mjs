import express from "express";
import { quietHours } from "../modules/QuietHours.mjs";

const router = express.Router();

let todos = [];
let counter = 1;

router.get("/", (req, res) => {
  res.json({ todos });
});


router.post("/", quietHours(), (req, res) => {
  const body = req.body ?? {};
  const text = body.text;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({
      error: "text is required",
      example: { text: "Clean kitchen", repeatWeekly: true, removeWhenDone: false }
    });
  }

  const todo = {
    id: "todo_" + counter++,
    text: text.trim (),
    done: false,
    repeatWeekly: Boolean(body.repeatWeekly),
    removeWhenDone: Boolean(body.removeWhenDone)
  };

  todos.push(todo);

  res.status(201).json({
    created: true,
    quietHour: req.isQuietHours,
    notification: req.isQuietHours ? "suppressed" : "wouuld send",
    todo
  });
});