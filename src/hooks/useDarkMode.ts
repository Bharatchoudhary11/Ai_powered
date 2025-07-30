"use client";
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [enabled, setEnabled] = useState(false);

  // Load stored theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setEnabled(savedTheme === "dark");
    } else {
      setEnabled(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Apply dark mode to the <html> tag for full-page effect
  useEffect(() => {
    const root = document.documentElement;

    if (enabled) {
      root.classList.add("dark", "theme-transition");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("theme-transition");
      localStorage.setItem("theme", "light");
    }

    // Remove transition helper class after animation
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 500);
    return () => clearTimeout(timeout);
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
