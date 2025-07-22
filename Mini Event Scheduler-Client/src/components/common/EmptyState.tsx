import type { ComponentType } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }> | string;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-lg border border-dashed border-gray-200 bg-gray-50">
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        {typeof Icon === "string" ? (
          <span className="text-2xl">{Icon}</span>
        ) : (
          <Icon className="h-full w-full" />
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
