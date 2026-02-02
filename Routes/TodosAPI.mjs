import express from "express";
import { quietHours } from "../modules/QuietHours.mjs";

const router = express.Router();

let todos = [];
let counter = 1;

router.get("/", (req, res) => {
  res.json({ todos });
});

