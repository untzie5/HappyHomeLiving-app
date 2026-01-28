import express from "express"
import { quietHours } from "../modules/QuietHours.mjs";

const router = express.Router();

router.get("/api/households/:householdId/chores", (req, res) => {
  res.json({
    householdId: req.params.householdId,
    chores: []
  });
});

router.post(
  "/households/:householdId/chores",
  quietHours(), 
  (req, res) => {
    res.status(201).json({
      created: true,
      quietTime: req.isQuietTime,
      householdId: req.params.householdId,
      chore: {
        id: "chore_1",
        ...req.body
      },
      notification: req.isQuietTime ? "suppressed" : "would_send"
    });
  }
);

export default router;