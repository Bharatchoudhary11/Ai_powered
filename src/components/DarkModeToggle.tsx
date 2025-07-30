"use client";
import { Sun, Moon } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useDarkMode();

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      aria-label="Toggle dark mode"
      className={`relative inline-flex h-9 w-18 items-center rounded-full p-1 
      transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2
      ${enabled ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg" : "bg-gray-300 dark:bg-gray-600"}`}
    >
      <span
        className={`h-7 w-7 transform rounded-full bg-white shadow-md flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${enabled ? "translate-x-9 glow-light" : "translate-x-0 bg-gray-200 glow-dark"}`}
      >
        {enabled ? (
          <Sun className="w-4 h-4 text-yellow-500 transition-transform duration-500 rotate-90" />
        ) : (
          <Moon className="w-4 h-4 text-gray-700 transition-transform duration-500 -rotate-6" />
        )}
      </span>

      <style jsx>{`
        @keyframes glowLight {
          0% { box-shadow: 0 0 2px rgba(255, 200, 0, 0.4); }
          50% { box-shadow: 0 0 8px rgba(255, 200, 0, 0.6); }
          100% { box-shadow: 0 0 2px rgba(255, 200, 0, 0.4); }
        }
        @keyframes glowDark {
          0% { box-shadow: 0 0 2px rgba(156, 163, 175, 0.4); }
          50% { box-shadow: 0 0 6px rgba(156, 163, 175, 0.5); }
          100% { box-shadow: 0 0 2px rgba(156, 163, 175, 0.4); }
        }
        .glow-light {
          animation: glowLight 1.2s infinite;
        }
        .glow-dark {
          animation: glowDark 1.5s infinite;
        }
      `}</style>
    </button>
  );
}
