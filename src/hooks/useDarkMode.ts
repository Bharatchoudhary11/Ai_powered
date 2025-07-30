"use client";
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load saved theme or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setEnabled(true);
    } else if (savedTheme === "light") {
      setEnabled(false);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setEnabled(prefersDark);
    }

    setMounted(true);
  }, []);

  // Apply/remove dark mode class dynamically
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (enabled) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [enabled, mounted]);

  return { enabled, setEnabled, mounted };
}
