import express from "express";
import { getNotifications, clearNotifications, deleteNotificationById, } from "../services/notificationsService.mjs";

const router = express.Router();

router.get("/", (_req,res) => {
    res.json({ notifications: getNotifications() });
});

router.delete("/", (_req, res) => {
    clearNotifications();
    res.json({ cleared: true });
});

router.delete("/:id", (req, res) => {
    const deleted = deleteNotificationById(req.params.id);

    if (!deleted) {
        return  res.status(404).json({ error: "notification not found" });
    }

    res.json({ deleted: true, id: req.params.id });
});

export default router;