/**
 * useEdgePlus — Platform-level premium subscription state
 *
 * Edge Plus is CareerEdge's premium tier. It gates access to Professional
 * EdgeGroups (coach-led monetized communities), exclusive coaching content,
 * and priority features. This hook reads/writes the subscription flag to
 * localStorage so the DevTools toggle and surfaces stay in sync without
 * React context plumbing.
 *
 * Used by:
 * - DevTools panel (set the state for demos)
 * - EdgePlusPaywall modal (gate any interaction)
 * - EdgeGroups surface (gate Professional tab clicks)
 * - Role badge in shell (show ✨ Edge Plus chip when active)
 */

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "careerEdgePlus";

function readEdgePlus(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function writeEdgePlus(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(value));
  // Notify other hook instances in the same document
  window.dispatchEvent(new CustomEvent("edgeplus:change", { detail: value }));
}

export function useEdgePlus(): [boolean, (value: boolean) => void, () => void] {
  const [edgePlus, setState] = useState<boolean>(readEdgePlus);

  useEffect(() => {
    // Respond to writes from other components in this tab
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setState(detail);
    };
    // And storage events from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(e.newValue === "true");
    };
    window.addEventListener("edgeplus:change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("edgeplus:change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setEdgePlus = useCallback((value: boolean) => {
    writeEdgePlus(value);
    setState(value);
  }, []);

  const toggleEdgePlus = useCallback(() => {
    const next = !readEdgePlus();
    writeEdgePlus(next);
    setState(next);
  }, []);

  return [edgePlus, setEdgePlus, toggleEdgePlus];
}
