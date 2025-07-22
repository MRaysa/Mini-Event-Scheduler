import { Request, Response } from "express";
import eventService from "../services/eventService";
import { IEvent } from "../models/Event";

class EventController {
  public async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  }

  public async createEvent(req: Request, res: Response) {
    try {
      const { title, date, time, notes } = req.body;
      const event = await eventService.createEvent(title, date, time, notes);
      res.status(201).json(event);
    } catch (error: any) {
      if (error.message === "Title, date, and time are required") {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create event" });
      }
    }
  }

  public async archiveEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await eventService.archiveEvent(id);
      event
        ? res.status(200).json(event)
        : res.status(404).json({ message: "Event not found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to archive event" });
    }
  }

  public async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await eventService.deleteEvent(id);
      success
        ? res.status(200).json({ message: "Event deleted successfully" })
        : res.status(404).json({ message: "Event not found" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  }
}

export default new EventController();
