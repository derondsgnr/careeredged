import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { DevTools } from "../components/dev-tools";
import type { AppState } from "../components/state-toggle";

export type FamilyVariation = "A" | "B" | "C";
export type ThemeMode = "dark" | "light";
export type NavVariation = "A" | "B";

export default function RootLayout() {
  // Initialize from localStorage, defaulting to "active"
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem("careerEdgeAppState");
    return (saved as AppState) || "active";
  });

  const [familyVariation, setFamilyVariation] = useState<FamilyVariation>(() => {
    const saved = localStorage.getItem("careerEdgeFamilyVariation");
    return (saved as FamilyVariation) || "A";
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("careerEdgeTheme");
    return (saved as ThemeMode) || "dark";
  });

  const [navVariation, setNavVariation] = useState<NavVariation>(() => {
    const saved = localStorage.getItem("careerEdgeNavVariation");
    return (saved as NavVariation) || "A";
  });

  useEffect(() => {
    localStorage.setItem("careerEdgeNavVariation", navVariation);
  }, [navVariation]);

  // Persist app state to localStorage
  useEffect(() => {
    localStorage.setItem("careerEdgeAppState", appState);
  }, [appState]);

  useEffect(() => {
    localStorage.setItem("careerEdgeFamilyVariation", familyVariation);
  }, [familyVariation]);

  // Apply theme class to document root and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("careerEdgeTheme", theme);
  }, [theme]);

  return (
    <>
      {/* DevTools floating panel — role picker, state toggle, route picker */}
      <DevTools appState={appState} onStateChange={setAppState} familyVariation={familyVariation} onFamilyVariationChange={setFamilyVariation} theme={theme} onThemeChange={setTheme} navVariation={navVariation} onNavVariationChange={setNavVariation} />

      {/* Route content — receives appState AND setAppState so pages can transition state */}
      <Outlet context={{ appState, setAppState, familyVariation, setFamilyVariation, theme, setTheme, navVariation, setNavVariation }} />

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