import { Router } from "express";
import eventController from "../controllers/eventController";

const router = Router();

router.get("/events", eventController.getAllEvents);
router.post("/events", eventController.createEvent);
router.put("/events/:id/archive", eventController.archiveEvent);
router.delete("/events/:id", eventController.deleteEvent);

export default router;
