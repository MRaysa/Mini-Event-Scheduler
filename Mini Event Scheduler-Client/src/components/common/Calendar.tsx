import { format, startOfWeek, addDays, isSameDay } from "date-fns";

interface Event {
  date: string | Date;
}

interface CalendarProps {
  events: Event[];
  selectedDate: Date;
  onDateClick: (day: Date) => void;
  isLoading?: boolean;
}

export function Calendar({
  events,
  selectedDate,
  onDateClick,
  isLoading = false,
}: CalendarProps) {
  const weekStart = startOfWeek(new Date());

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-4">Weekly View</h2>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: 7 }).map((_, index) => {
          const day = addDays(weekStart, index);
          const dayEvents = events.filter((event) =>
            isSameDay(new Date(event.date), day)
          );

          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                isSameDay(day, selectedDate)
                  ? "bg-blue-100 border border-blue-300"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="text-center font-medium">{format(day, "d")}</div>
              {dayEvents.length > 0 && (
                <div className="flex justify-center space-x-1 mt-1">
                  {Array.from({
                    length: Math.min(dayEvents.length, 3),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-blue-500"
                    ></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
