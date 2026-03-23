import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ce-theme";
type Theme = "dark" | "light";

/**
 * Shared theme hook — single source of truth for theme state.
 * Syncs via localStorage + storage events across components.
 */
export function useThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  // Listen for storage changes from other components/tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setThemeState(e.newValue === "light" ? "light" : "dark");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  }, []);

  return { theme, toggle, setTheme, isDark: theme === "dark" } as const;
}
