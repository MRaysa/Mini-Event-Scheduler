import type { Event } from "../../types";
import { Button } from "../common/Button";
import {
  Calendar,
  Clock,
  MapPin,
  Archive,
  Trash2,
  ArchiveX,
} from "lucide-react";
import { useArchiveEvent, useDeleteEvent } from "../../hooks/useEventQueries";
import { toast } from "react-toastify";

interface EventCardProps {
  /** The event data to be displayed in the card */
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Initialize mutation hooks for event operations
  const archiveMutation = useArchiveEvent();
  const deleteMutation = useDeleteEvent();

  /**
   * Handles the archive/unarchive action for the event
   * @async
   * @throws {Error} When the archive operation fails
   */
  const handleArchive = async () => {
    if (!event._id) {
      console.warn("Attempted to archive event without ID");
      return;
    }

    try {
      await archiveMutation.mutateAsync(event._id);
      toast.success("Event archived successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Archive operation failed:", error);
      toast.error("Failed to archive event. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /**
   * Handles the delete action for the event
   * @async
   * @throws {Error} When the delete operation fails
   */
  const handleDelete = async () => {
    if (!event._id) {
      console.warn("Attempted to delete event without ID");
      return;
    }

    try {
      await deleteMutation.mutateAsync(event._id);
      toast.success("Event deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error("Failed to delete event. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /**
   * Determines the styling for the event category badge
   * @returns {string} Tailwind CSS classes for the category badge
   */
  const getCategoryColor = (): string => {
    switch (event.category) {
      case "Work":
        return "bg-blue-100 text-blue-800";
      case "Personal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    // Card container with dynamic left border color
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 mb-6 transition-all hover:shadow-lg"
      style={{
        borderLeftColor:
          event.category === "Work"
            ? "#3B82F6" // Blue border for Work category
            : event.category === "Personal"
            ? "#10B981" // Green border for Personal category
            : "#6B7280", // Gray border for other categories
      }}
      data-testid="event-card"
    >
      <div className="p-6">
        {/* Header section with title and actions */}
        <div className="flex justify-between items-start mb-4">
          {/* Event title and category */}
          <div>
            <h3
              className="text-xl font-bold text-gray-900 mb-1"
              aria-label="Event title"
            >
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}
                aria-label={`Event category: ${event.category}`}
              >
                {event.category}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleArchive}
              className="text-gray-500 hover:text-blue-600"
              aria-label={event.archived ? "Unarchive event" : "Archive event"}
              data-testid="archive-button"
            >
              {event.archived ? (
                <ArchiveX className="w-4 h-4 cursor-pointer text-red-400" />
              ) : (
                <Archive className="w-4 h-4 cursor-pointer" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600"
              aria-label="Delete event"
              data-testid="delete-button"
            >
              <Trash2 className="w-4 h-4 cursor-pointer" />
            </Button>
          </div>
        </div>

        {/* Event notes (conditional rendering) */}
        {event.notes && (
          <p className="text-gray-600 mb-4" aria-label="Event notes">
            {event.notes}
          </p>
        )}

        {/* Event details section */}
        <div className="space-y-3">
          {/* Date and time */}
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span aria-label="Event date">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="mx-1" aria-hidden="true">
              •
            </span>
            <Clock className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span aria-label="Event time">{event.time}</span>
          </div>

          {/* Location (conditional rendering) */}
          {event.location && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-500" aria-hidden="true" />
              <span aria-label="Event location">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
