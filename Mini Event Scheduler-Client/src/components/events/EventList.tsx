import { EventCard } from "./EventCard";
import type { Event } from "../../types";
import { EmptyState } from "../common/EmptyState";
import { Skeleton } from "../common/Skeleton";
import { FilterBar } from "../events/FilterBar";
import { Calendar } from "../common/Calendar";
import { useState } from "react";
import { isSameDay, isAfter, isBefore, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  onFilterChange?: (filter: string) => void;
}

export function EventList({
  events,
  isLoading = false,
  onFilterChange,
}: EventListProps) {
  const [activeTimeFilter, setActiveTimeFilter] = useState<string>("all");
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleTimeFilterChange = (filter: string) => {
    setActiveTimeFilter(filter);
    setSelectedDate(null);
    onFilterChange?.(filter);
  };

  const handleCategoryFilterChange = (category: string) => {
    setActiveCategoryFilter(category);
  };

  const handleDateClick = (day: Date) => {
    // Toggle date selection if clicking the same date
    if (selectedDate && isSameDay(day, selectedDate)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(day);
      setActiveTimeFilter("all");
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);

    // First apply date filter if a date is selected
    if (selectedDate && !isSameDay(eventDate, selectedDate)) {
      return false;
    }

    // Apply category filter
    if (
      activeCategoryFilter !== "all" &&
      event.category !== activeCategoryFilter
    ) {
      return false;
    }

    // Then apply the active time filter
    switch (activeTimeFilter) {
      case "upcoming":
        return isAfter(eventDate, new Date());
      case "past":
        return isBefore(eventDate, new Date());
      case "today":
        return isSameDay(eventDate, new Date());
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden space-y-6">
        <Calendar
          events={[]}
          selectedDate={new Date()}
          onDateClick={handleDateClick}
          isLoading
        />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden space-y-6">
      <Calendar
        events={events}
        selectedDate={selectedDate || new Date()}
        onDateClick={handleDateClick}
      />

      {/* Date selection indicator */}
      {selectedDate && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm font-medium text-gray-700">
            Showing events for: {format(selectedDate, "MMMM d, yyyy")}
          </p>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-sm text-blue-600 hover:text-blue-800 border-b border-transparent hover:border-blue-600 transition-colors"
          >
            Clear date
          </button>
        </div>
      )}

      <div className="flex gap-4">
        {/* Time-based Filter Bar */}
        <FilterBar
          activeFilter={activeTimeFilter}
          onFilterChange={handleTimeFilterChange}
          filters={[
            { id: "all", label: "All Events" },
            { id: "upcoming", label: "Upcoming" },
            { id: "past", label: "Past Events" },
            { id: "today", label: "Today" },
          ]}
          variant="dropdown"
        />

        {/* Category Filter Bar */}
        <FilterBar
          activeFilter={activeCategoryFilter}
          onFilterChange={handleCategoryFilterChange}
          filters={[
            { id: "all", label: "All Categories" },
            { id: "Work", label: "Work" },
            { id: "Personal", label: "Personal" },
            { id: "Other", label: "Other" },
          ]}
          variant="dropdown"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState
          title={
            selectedDate
              ? `No events on ${format(selectedDate, "MMMM d")}`
              : activeTimeFilter === "today"
              ? "No events today"
              : activeCategoryFilter !== "all"
              ? `No ${activeCategoryFilter.toLowerCase()} events found`
              : "No events found"
          }
          description={
            selectedDate
              ? "Try selecting a different date"
              : activeTimeFilter === "today"
              ? "You don't have any events scheduled for today"
              : activeTimeFilter !== "all"
              ? `No ${activeTimeFilter} events found`
              : activeCategoryFilter !== "all"
              ? `No ${activeCategoryFilter.toLowerCase()} events found. Try a different category.`
              : "Create your first event to get started"
          }
          icon={CalendarIcon}
        />
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
