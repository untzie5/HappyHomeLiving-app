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


router.patch("/:id" , quietHours(), (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "todo not found" });

  const body = req.body ?? {};

  if (typeof body.done === "boolean") todo.done = body.done;
  if (typeof body.text === "string" && body.text.trim().length > 0) todo.text = body.text.trim();
  if (typeof body.repeatWeekly === "boolean") todo.repeatWeekly = body.repeatWeekly;
  if (typeof body.removeWhenDone === "boolean") todo.removeWhenDone = body.removeWhenDone;

  if (todo.done && todo.removeWhenDone) {
    todos = todos.filter(t => t.id !== todo.id);
    return res.json({
      updated: true, 
      removed: true,
      quietHour: req.isQuietHours,
      notification: req.isQuietHours ? "supressed" : "would send",
      id: todo.id
    });
  }

  res.json({
    updated: true,
    quietHour: req.isQuietHours,
    notification: req.isQuietHours ? "suppressed" : "would send",
    todo
  });

});

router.delete("/:id", quietHours(), (req, res) => {
  const before = todos.length;
  todos = todos.filter(t => t.id !== req.params.id);

  if (todos.length === before) {
    return res.status(404).json({ error: "todo not found" });
  }

  res.json({
    deleted: true,
    quietHour: req.isQuietHours,
    id: req.params.id
  });
});

router.post("/reset-week", quietHours(), (req, res) => {
  let resetCount = 0;
  for (const t of todos) {
    if (t.repeatWeekly && t.done) {
      t.done = false;
      resetCount++;
    }
  }

  res.json({ ok: true, resetCount, quietHour: req.isQuietHours });
});

export default router;