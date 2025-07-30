import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number;
  className?: string;
  icon?: LucideIcon; // ✅ Added icon support
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  className,
  icon: Icon,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-4 ${className || ""}`}
    >
      {/* ✅ Icon Section */}
      {Icon && (
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      )}

      {/* ✅ Text Section */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </span>
        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={`text-sm font-medium ${
              delta >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
