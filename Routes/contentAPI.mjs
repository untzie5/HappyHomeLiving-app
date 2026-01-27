import express from "express"

const router = express.Router();

router.get("/api/households/:householdId/chores", (req, res) => {
  res.json({
    householdId: req.params.householdId,
    chores: []
  });
});

router.post("/api/households/:householdId/chores", (req, res) => {
  res.status(201).json({
    created: true,
    householdId: req.params.householdId,
    chore: {
      id: "chore_1",
      ...req.body
    }
  });
});

export default router;