import express from 'express';

const app = express();
app.use(express.json());

app.get("/api/households/:householdId/chores", (req, res) => {
  res.json({
    householdId: req.params.householdId,
    chores: []
  });
});

app.post("/api/households/:householdId/chores", (req, res) => {
  res.status(201).json({
    created: true,
    householdId: req.params.householdId,
    chore: {
      id: "chore_1",
      ...req.body
    }
  });
});

export default app;
