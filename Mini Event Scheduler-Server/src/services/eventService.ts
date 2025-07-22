import EventModel from "../models/Event";
import { IEvent, Category } from "../models/Event";

const WORK_KEYWORDS = ["meeting", "project", "client", "work", "office"];
const PERSONAL_KEYWORDS = ["birthday", "family", "friend", "personal", "home"];

class EventService {
  private determineCategory(title: string, notes?: string): Category {
    const text = `${title} ${notes || ""}`.toLowerCase();
    const isWork = WORK_KEYWORDS.some((keyword) => text.includes(keyword));
    const isPersonal = PERSONAL_KEYWORDS.some((keyword) =>
      text.includes(keyword)
    );

    if (isWork) return "Work";
    if (isPersonal) return "Personal";
    return "Other";
  }

  public async getAllEvents(): Promise<IEvent[]> {
    return await EventModel.find().sort({ date: 1, time: 1 }).exec();
  }

  public async createEvent(
    title: string,
    date: string,
    time: string,
    notes?: string
  ): Promise<IEvent> {
    if (!title || !date || !time) {
      throw new Error("Title, date, and time are required");
    }

    const newEvent = new EventModel({
      title,
      date,
      time,
      notes,
      category: this.determineCategory(title, notes),
      archived: false,
    });

    return await newEvent.save();
  }

  public async archiveEvent(id: string): Promise<IEvent | null> {
    const event = await EventModel.findById(id);
    if (!event) return null;

    event.archived = !event.archived;
    await event.save();
    return event;
  }

  public async deleteEvent(id: string): Promise<boolean> {
    const result = await EventModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export default new EventService();
