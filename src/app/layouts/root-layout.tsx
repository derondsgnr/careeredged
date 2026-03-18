import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { DevTools } from "../components/dev-tools";
import type { AppState } from "../components/state-toggle";

export default function RootLayout() {
  // Initialize from localStorage, defaulting to "active"
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem("careerEdgeAppState");
    return (saved as AppState) || "active";
  });

  // Persist app state to localStorage
  useEffect(() => {
    localStorage.setItem("careerEdgeAppState", appState);
  }, [appState]);

  return (
    <>
      {/* DevTools floating panel — role picker, state toggle, route picker */}
      <DevTools appState={appState} onStateChange={setAppState} />

      {/* Route content — receives appState AND setAppState so pages can transition state */}
      <Outlet context={{ appState, setAppState }} />

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(14,16,20,0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#E8E8ED",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
          },
          duration: 3500,
        }}
      />
    </>
  );
}