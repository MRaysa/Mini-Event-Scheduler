import { Button } from "../common/Button";
import { Calendar, Plus, Menu } from "lucide-react";

interface HeaderProps {
  onCreateEvent: () => void;
  onMenuToggle: () => void;
  showMenuButton?: boolean;
}

export function Header({
  onCreateEvent,
  onMenuToggle,
  showMenuButton = true,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center md:gap-2 lg:gap-2">
              <Calendar className="w-8 h-8 text-blue-600 " />
              <h1 className="text-[18px] md:text-xl lg:text-xl  font-bold text-gray-900 ">
                EventScheduler
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={onCreateEvent}
              className="flex items-center gap-2"
              variant="primary"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
