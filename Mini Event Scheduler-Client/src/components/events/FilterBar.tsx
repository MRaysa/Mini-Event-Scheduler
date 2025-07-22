import { useState, useEffect } from "react";
import { ChevronDown, Filter, X } from "lucide-react";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: { id: string; label: string; count?: number }[];
  title?: string;
  variant?: "pills" | "dropdown" | "tabs";
  showClearAll?: boolean;
}

export function FilterBar({
  activeFilter,
  onFilterChange,
  filters,
  title,
  variant = "pills",
  showClearAll = false,
}: FilterBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Set up scroll listener for pills variant
  useEffect(() => {
    const handleScroll = () => {
      if (container) {
        setIsScrolled(container.scrollLeft > 0);
      }
    };

    if (variant === "pills") {
      container?.addEventListener("scroll", handleScroll);
      return () => {
        container?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [container, variant]);

  // Check if overflow exists
  const [hasOverflow, setHasOverflow] = useState(false);
  useEffect(() => {
    if (container && variant === "pills") {
      setHasOverflow(container.scrollWidth > container.clientWidth);
    }
  }, [container, filters, variant]);

  const activeFilterLabel =
    filters.find((f) => f.id === activeFilter)?.label || "Select filter";

  // Pills variant (original enhanced)
  if (variant === "pills") {
    return (
      <div className="relative">
        {/* Title */}
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            {showClearAll && activeFilter !== "all" && (
              <button
                onClick={() => onFilterChange("all")}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Scroll shadows */}
        {hasOverflow && (
          <>
            <div
              className={`absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white via-white to-transparent pointer-events-none z-10 ${
                isScrolled ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            />
            <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white via-white to-transparent pointer-events-none z-10" />
          </>
        )}

        {/* Filter buttons container */}
        <div
          ref={setContainer}
          className="filter-container flex  gap-2 overflow-x-auto scrollbar-hide py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 flex-shrink-0 min-w-fit border ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
              }`}
              aria-current={activeFilter === filter.id ? "true" : "false"}
            >
              <span className="flex items-center gap-2">
                {filter.label}
                {filter.count !== undefined && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilter === filter.id
                        ? "bg-blue-500 text-blue-100"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <div className="relative  flex items-center gap-4">
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            {showClearAll && activeFilter !== "all" && (
              <button
                onClick={() => onFilterChange("all")}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full md:w-auto min-w-[200px] px-4 py-2.5 text-sm font-medium text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{activeFilterLabel}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
              <div className="py-1">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      onFilterChange(filter.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors duration-150 ${
                      activeFilter === filter.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{filter.label}</span>
                      {filter.count !== undefined && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            activeFilter === filter.id
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {filter.count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Backdrop */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  // Tabs variant
  if (variant === "tabs") {
    return (
      <div className="relative">
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            {showClearAll && activeFilter !== "all" && (
              <button
                onClick={() => onFilterChange("all")}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`py-2.5 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeFilter === filter.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={activeFilter === filter.id ? "page" : undefined}
              >
                <span className="flex items-center gap-2">
                  {filter.label}
                  {filter.count !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeFilter === filter.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {filter.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  return null;
}
