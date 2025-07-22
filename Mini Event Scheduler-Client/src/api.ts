import type { Event } from "./types";

const API_URL = "https://event-scheduler-server-2x3q.vercel.app/api/v1";

export const getEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_URL}/events`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return await response.json();
};

export const createEvent = async (
  eventData: Omit<Event, "id" | "createdAt" | "archived">
): Promise<Event> => {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error("Failed to create event");
  return await response.json();
};

export const archiveEvent = async (id: string): Promise<Event> => {
  const response = await fetch(`${API_URL}/events/${id}/archive`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Failed to archive event");
  return await response.json();
};

export const deleteEvent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete event");
};
