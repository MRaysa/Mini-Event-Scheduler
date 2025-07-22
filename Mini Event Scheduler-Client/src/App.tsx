import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { EventList } from "./components/events/EventList";
import { EventForm } from "./components/events/EventForm";
import { Modal } from "./components/common/Modal";
import { isToday, isThisWeek } from "./utils/dateUtils";
import { toast } from "react-toastify";
import { useEvents, useCreateEvent } from "./hooks/useEventQueries";
import type { Event } from "./types";
import { Drawer } from "./components/common/Drawer";
import { useMediaQuery } from "./hooks/useMediaQuery";

export default function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { data: events = [], isLoading } = useEvents();
  const createEventMutation = useCreateEvent();

  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  const handleCreateEvent = async (
    eventData: Omit<Event, "id" | "createdAt" | "archived">
  ) => {
    try {
      await createEventMutation.mutateAsync(eventData);
      setIsCreateModalOpen(false);
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  const todayCount = events.filter((e) => isToday(e.date)).length;
  const weekCount = events.filter((e) => isThisWeek(e.date)).length;
  const workCount = events.filter((e) => e.category === "Work").length;
  const personalCount = events.filter((e) => e.category === "Personal").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateEvent={() => setIsCreateModalOpen(true)}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar (always visible on desktop) */}
        {isDesktop && (
          <div className="w-64 flex-shrink-0 border-r border-gray-200">
            <Sidebar
              todayCount={todayCount}
              weekCount={weekCount}
              totalCount={events.length}
              workCount={workCount}
              personalCount={personalCount}
            />
          </div>
        )}

        {/* Mobile Drawer (only visible when toggled) */}
        <Drawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          <Sidebar
            todayCount={todayCount}
            weekCount={weekCount}
            totalCount={events.length}
            workCount={workCount}
            personalCount={personalCount}
          />
        </Drawer>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <EventList events={events} />
          )}
        </main>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
