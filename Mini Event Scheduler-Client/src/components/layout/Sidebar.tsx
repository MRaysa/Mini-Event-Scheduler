import React from "react";
import { Clock, Calendar, TrendingUp } from "lucide-react";

interface SidebarProps {
  todayCount: number;
  weekCount: number;
  totalCount: number;
  workCount: number;
  personalCount: number;
}

export function Sidebar({
  todayCount = 0,
  weekCount = 0,
  totalCount = 0,
  workCount = 0,
  personalCount = 0,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full overflow-y-auto p-6">
      <div className="space-y-6">
        {/* Quick Overview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Overview
          </h3>
          <div className="space-y-3">
            <StatItem
              icon={<Clock className="w-4 h-4 text-blue-600" />}
              label="Today"
              count={todayCount}
            />
            <StatItem
              icon={<Calendar className="w-4 h-4 text-green-600" />}
              label="This Week"
              count={weekCount}
            />
            <StatItem
              icon={<TrendingUp className="w-4 h-4 text-gray-600" />}
              label="Total"
              count={totalCount}
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            <CategoryItem
              name="Work"
              count={workCount}
              color="bg-blue-100"
              textColor="text-blue-800"
            />
            <CategoryItem
              name="Personal"
              count={personalCount}
              color="bg-green-100"
              textColor="text-green-800"
            />
            <CategoryItem
              name="Others"
              count={totalCount - (workCount + personalCount)}
              color="bg-gray-100"
              textColor="text-gray-900"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

const StatItem = ({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{count}</span>
  </div>
);

const CategoryItem = ({
  name,
  count,
  color,
  textColor,
}: {
  name: string;
  count: number;
  color: string;
  textColor: string;
}) => (
  <div className="flex items-center justify-between">
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${textColor}`}
    >
      {name}
    </span>
    <span className="text-sm font-medium text-gray-900">{count}</span>
  </div>
);
