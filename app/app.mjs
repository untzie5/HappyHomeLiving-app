import express from 'express';
const app = express();

app.use(express.json());



app.get("/heatlh", (req, red) => res.json({ ok: true }));

export default app;
