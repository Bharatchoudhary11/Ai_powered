"use client";
import { Sun, Moon } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

export default function DarkModeToggle() {
  const { enabled, setEnabled, mounted } = useDarkMode();

  if (!mounted) {
    return (
      <div className="h-9 w-18 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      aria-label="Toggle dark mode"
      className={`relative inline-flex h-9 w-18 items-center rounded-full p-1 transition-colors duration-300 
      ${enabled ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg" : "bg-gray-300 dark:bg-gray-600"}`}
    >
      <span
        className={`h-7 w-7 transform rounded-full bg-white shadow-md flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${enabled ? "translate-x-9 bg-yellow-100 glow-light" : "translate-x-0 bg-gray-200 glow-dark"}`}
      >
        {enabled ? (
          <Sun className="w-4 h-4 text-yellow-500 transition-transform duration-500 rotate-90" />
        ) : (
          <Moon className="w-4 h-4 text-gray-700 transition-transform duration-500 -rotate-6" />
        )}
      </span>
    </button>
  );
}
