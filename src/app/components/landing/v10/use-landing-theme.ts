import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "ce-theme";

/** Reads the current theme from the <html> element class */
function getSnapshot(): boolean {
  return !document.documentElement.classList.contains("light");
}

function getServerSnapshot(): boolean {
  return true; // default to dark
}

let listeners: Array<() => void> = [];

function subscribe(callback: () => void): () => void {
  listeners.push(callback);

  // Observe <html> class changes
  const observer = new MutationObserver(() => {
    listeners.forEach(l => l());
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // Also listen for storage changes from other tabs
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listeners.forEach(l => l());
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners = listeners.filter(l => l !== callback);
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Bridge between the app's theme system and the landing v10 scoped CSS.
 * Uses useSyncExternalStore to observe <html> class changes reactively,
 * so all components using this hook stay in sync automatically.
 */
export function useLandingTheme() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const currentlyDark = !document.documentElement.classList.contains("light");
    const next = currentlyDark ? "light" : "dark";
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const wrapperClass = isDark ? "landing-v10" : "landing-v10 lv10-light";

  return { isDark, toggle, wrapperClass };
}
