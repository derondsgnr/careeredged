/**
 * DevTools Panel — Route Picker + Role Switcher + State Toggle
 *
 * Floating, draggable developer control panel for demo navigation.
 * - Switch between 8 user types (roles) — navigates instantly
 * - Toggle states: onboarding / empty / active — controls what's rendered
 * - Browse and jump to any route in the app
 *
 * Position persists in localStorage. Role/state persist in localStorage.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import {
  GripVertical, ChevronDown, ChevronUp,
  Home, Compass, FileText, Search, MessageSquare,
  BarChart3, Target, Sparkles,
  Rocket, Heart, BookOpen, Building2, Globe, Briefcase,
  User, GraduationCap,
} from "lucide-react";
import type { AppState } from "./state-toggle";
import type { FamilyVariation, ThemeMode, NavVariation } from "../layouts/root-layout";
import { Sun, Moon } from "lucide-react";

// ─── Role definitions ──────────────────────────────────────────────────────

const ALL_ROLES = [
  { id: "edgestar",   label: "EdgeStar",     short: "ES",  color: "var(--ce-role-edgestar)", icon: User },
  { id: "edgepreneur", label: "EdgePreneur", short: "EP",  color: "var(--ce-role-edgepreneur)", icon: Rocket },
  { id: "parent",     label: "EdgeParent",   short: "PA",  color: "var(--ce-role-parent)", icon: Heart },
  { id: "guide",      label: "EdgeGuide",    short: "GU",  color: "var(--ce-role-guide)", icon: BookOpen },
  { id: "employer",   label: "EdgeEmployer", short: "EM",  color: "var(--ce-role-employer)", icon: Briefcase },
  { id: "edu",        label: "EdgeEducation",short: "ED",  color: "var(--ce-role-edu)", icon: GraduationCap },
  { id: "ngo",        label: "EdgeNGO",      short: "NG",  color: "var(--ce-role-ngo)", icon: Globe },
  { id: "agency",     label: "EdgeAgency",   short: "AG",  color: "var(--ce-role-agency)", icon: Building2 },
] as const;

type RoleId = typeof ALL_ROLES[number]["id"];

// ─── Route definitions ─────────────────────────────────────────────────────

interface RouteItem {
  path: string;
  label: string;
  Icon: React.ElementType;
}

const GENERAL_ROUTES: RouteItem[] = [
  { path: "/",            label: "Landing",    Icon: Sparkles },
  { path: "/login",       label: "Login",      Icon: User },
  { path: "/signup",      label: "Sign Up",    Icon: User },
  { path: "/onboarding",  label: "Onboarding", Icon: Compass },
];

const LANDING_ROUTES: RouteItem[] = [
  { path: "/archive/landing",     label: "All Variations", Icon: Sparkles },
  { path: "/archive/landing/v1",  label: "V1 — Editorial", Icon: Sparkles },
  { path: "/archive/landing/v2",  label: "V2 — Proof",     Icon: Sparkles },
  { path: "/archive/landing/v3",  label: "V3 — Narrative",  Icon: Sparkles },
  { path: "/archive/landing/v4",  label: "V4 — Architect",  Icon: Sparkles },
  { path: "/archive/landing/v5",  label: "V5 — Conversation", Icon: Sparkles },
  { path: "/archive/landing/v6",  label: "V6 — Gallery",    Icon: Sparkles },
  { path: "/archive/landing/v7",  label: "V7 — Data Canvas", Icon: Sparkles },
  { path: "/archive/landing/v8",  label: "V8 — Manifesto",  Icon: Sparkles },
  { path: "/archive/landing/v9",  label: "V9 — Ecosystem",  Icon: Sparkles },
];

function getRoleRoutes(role: string): RouteItem[] {
  return [
    { path: `/${role}`,             label: "Home",      Icon: Home },
    { path: `/${role}/edgepath`,    label: "Roadmap",   Icon: Compass },
    { path: `/${role}/resume`,      label: "Resume",    Icon: FileText },
    { path: `/${role}/jobs`,        label: "Jobs",      Icon: Search },
    { path: `/${role}/messages`,    label: "Messages",  Icon: MessageSquare },
    { path: `/${role}/analytics`,   label: "Analytics", Icon: BarChart3 },
    { path: `/${role}/taskroom`,    label: "Task Room", Icon: Target },
  ];
}

// ─── State label/color map ─────────────────────────────────────────────────

const STATE_OPTIONS: { id: AppState; label: string; color: string }[] = [
  { id: "onboarding", label: "Onboarding", color: "var(--ce-role-edgestar)" },
  { id: "empty",      label: "Empty",      color: "var(--ce-text-secondary)" },
  { id: "active",     label: "Active",     color: "var(--ce-cyan)" },
];

// ─── DevTools component ────────────────────────────────────────────────────

const FAMILY_VARIATIONS: { id: FamilyVariation; label: string; desc: string; color: string }[] = [
  { id: "A", label: "Constellation", desc: "Overview-first orbit cards", color: "var(--ce-role-parent)" },
  { id: "B", label: "Journal",       desc: "Narrative scroll",          color: "var(--ce-role-guide)" },
  { id: "C", label: "Command Center", desc: "Three-pane layout",       color: "var(--ce-role-edgestar)" },
];

interface DevToolsProps {
  appState: AppState;
  onStateChange: (state: AppState) => void;
  familyVariation: FamilyVariation;
  onFamilyVariationChange: (v: FamilyVariation) => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  navVariation: NavVariation;
  onNavVariationChange: (v: NavVariation) => void;
}

export function DevTools({ appState, onStateChange, familyVariation, onFamilyVariationChange, theme, onThemeChange, navVariation, onNavVariationChange }: DevToolsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Drag position — use MotionValues so drag transform never compounds
  const [isDragging, setIsDragging] = useState(false);
  const [initPos] = useState(() => {
    try {
      const saved = localStorage.getItem("devToolsPosition");
      if (saved) {
        const p = JSON.parse(saved);
        return {
          x: Math.max(0, Math.min(p.x, window.innerWidth - 260)),
          y: Math.max(0, Math.min(p.y, window.innerHeight - 60)),
        };
      }
    } catch { /* ignore */ }
    return { x: Math.max(window.innerWidth - 280, 20), y: 80 };
  });
  const xMotion = useMotionValue(initPos.x);
  const yMotion = useMotionValue(initPos.y);

  // ── Collapsed state
  const [expanded, setExpanded] = useState(() => {
    return localStorage.getItem("devToolsExpanded") !== "false";
  });

  // ── Section collapses
  const [rolesExpanded, setRolesExpanded] = useState(true);
  const [stateExpanded, setStateExpanded] = useState(true);
  const [routesExpanded, setRoutesExpanded] = useState(true);

  // ── Detect current role from URL
  const pathname = location.pathname;
  const activeRoleId = ALL_ROLES.find(r => pathname.startsWith(`/${r.id}`))?.id ?? null;

  // ── Display role: derive from URL, fall back to first
  const displayRoleId: RoleId = (activeRoleId as RoleId) ?? "edgestar";
  const displayRole = ALL_ROLES.find(r => r.id === displayRoleId) ?? ALL_ROLES[0];

  // Save position
  const savePosition = (pos: { x: number; y: number }) => {
    localStorage.setItem("devToolsPosition", JSON.stringify(pos));
  };

  // Persist expanded state
  useEffect(() => {
    localStorage.setItem("devToolsExpanded", String(expanded));
  }, [expanded]);

  const handleRoleClick = (roleId: string) => {
    navigate(`/${roleId}`);
  };

  const handleRouteClick = (path: string) => {
    navigate(path);
  };

  const currentStateOption = STATE_OPTIONS.find(s => s.id === appState) ?? STATE_OPTIONS[2];
  const roleRoutes = getRoleRoutes(displayRoleId);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        const newPos = {
          x: Math.max(0, Math.min(window.innerWidth - 260, xMotion.get())),
          y: Math.max(0, Math.min(window.innerHeight - 60, yMotion.get())),
        };
        xMotion.set(newPos.x);
        yMotion.set(newPos.y);
        savePosition(newPos);
      }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: xMotion,
        y: yMotion,
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "default",
        width: 252,
      }}
    >
      <div
        style={{
          background: "rgba(10,12,16,0.96)",
          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
          borderRadius: 14,
          backdropFilter: "blur(24px)",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(var(--ce-shadow-tint),0.4)",
        }}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 cursor-grab active:cursor-grabbing"
          style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
        >
          <GripVertical className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] flex-shrink-0" />
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(var(--ce-cyan-rgb),0.08)" }}
            >
              <Sparkles className="w-3 h-3 text-ce-cyan" />
            </div>
            <span
              className="text-[11px] text-ce-text-primary truncate"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Demo Controls
            </span>
          </div>
          {/* State pill */}
          <div
            className="flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px]"
            style={{
              background: `${currentStateOption.color}12`,
              border: `1px solid ${currentStateOption.color}22`,
              color: currentStateOption.color,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            {currentStateOption.label}
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-white/5 transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-3 h-3 text-ce-text-tertiary" />
            ) : (
              <ChevronDown className="w-3 h-3 text-ce-text-tertiary" />
            )}
          </button>
        </div>

        {/* ── Expanded body ────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              style={{ overflow: "hidden" }}
            >
              {/* Current path */}
              <div
                className="px-3 py-2 flex items-center gap-1.5"
                style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)", background: "rgba(var(--ce-glass-tint),0.015)" }}
              >
                <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>PATH</span>
                <span
                  className="text-[10px] text-ce-text-tertiary truncate flex-1"
                  style={{ fontFamily: "var(--font-body)", fontFeatureSettings: "'tnum'" }}
                >
                  {pathname || "/"}
                </span>
              </div>

              {/* ── ROLE section ──────────────────────────────── */}
              <div style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <button
                  onClick={() => setRolesExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                    ROLE
                  </span>
                  {rolesExpanded ? (
                    <ChevronUp className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {rolesExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                        {ALL_ROLES.map(role => {
                          const isActive = activeRoleId === role.id;
                          const Icon = role.icon;
                          return (
                            <button
                              key={role.id}
                              onClick={() => handleRoleClick(role.id)}
                              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-left transition-colors hover:bg-white/[0.03]"
                              style={{
                                background: isActive ? `${role.color}10` : "transparent",
                                border: isActive
                                  ? `1px solid ${role.color}25`
                                  : "1px solid transparent",
                              }}
                            >
                              <Icon
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: isActive ? role.color : "var(--ce-text-tertiary)" }}
                              />
                              <span
                                className="text-[10px] truncate"
                                style={{
                                  color: isActive ? role.color : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                  fontWeight: isActive ? 500 : 400,
                                }}
                              >
                                {role.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── STATE section ─────────────────────────────── */}
              <div style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <button
                  onClick={() => setStateExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                    STATE
                  </span>
                  {stateExpanded ? (
                    <ChevronUp className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {stateExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-2 pb-2 flex flex-col gap-1">
                        {STATE_OPTIONS.map(s => {
                          const isActive = appState === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => onStateChange(s.id)}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-left transition-colors hover:bg-white/[0.03]"
                              style={{
                                background: isActive ? `${s.color}10` : "transparent",
                                border: isActive
                                  ? `1px solid ${s.color}25`
                                  : "1px solid transparent",
                              }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: isActive ? s.color : "var(--ce-text-quaternary)" }}
                              />
                              <span
                                className="text-[11px] capitalize"
                                style={{
                                  color: isActive ? s.color : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                  fontWeight: isActive ? 500 : 400,
                                }}
                              >
                                {s.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── THEME section ─────────────────────────────── */}
              <div style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                    THEME
                  </span>
                  <div className="flex items-center gap-1">
                    {([
                      { id: "dark" as ThemeMode, label: "Dark", Icon: Moon, color: "var(--ce-role-guide)" },
                      { id: "light" as ThemeMode, label: "Light", Icon: Sun, color: "var(--ce-role-edgepreneur)" },
                    ]).map(t => {
                      const isActive = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => onThemeChange(t.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-white/[0.03]"
                          style={{
                            background: isActive ? `${t.color}10` : "transparent",
                            border: isActive ? `1px solid ${t.color}25` : "1px solid transparent",
                          }}
                        >
                          <t.Icon
                            className="w-3 h-3"
                            style={{ color: isActive ? t.color : "var(--ce-text-tertiary)" }}
                          />
                          <span
                            className="text-[10px]"
                            style={{
                              color: isActive ? t.color : "var(--ce-text-secondary)",
                              fontFamily: "var(--font-body)",
                              fontWeight: isActive ? 500 : 400,
                            }}
                          >
                            {t.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── NAV VARIATION section ──────────────────── */}
              <div style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                    NAV STYLE
                  </span>
                  <div className="flex items-center gap-1">
                    {([
                      { id: "A" as NavVariation, label: "Dock", color: "var(--ce-role-parent)" },
                      { id: "B" as NavVariation, label: "Segment", color: "var(--ce-role-edgestar)" },
                    ]).map(v => {
                      const isActive = navVariation === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => onNavVariationChange(v.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-white/[0.03]"
                          style={{
                            background: isActive ? `${v.color}10` : "transparent",
                            border: isActive ? `1px solid ${v.color}25` : "1px solid transparent",
                          }}
                        >
                          <span
                            className="text-[10px]"
                            style={{
                              color: isActive ? v.color : "var(--ce-text-secondary)",
                              fontFamily: "var(--font-body)",
                              fontWeight: isActive ? 500 : 400,
                            }}
                          >
                            {v.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── VARIATION section (family surface only) ──── */}
              {pathname.includes("/family") && (
                <div style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <div className="px-3 py-2">
                    <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                      FAMILY VARIATION
                    </span>
                  </div>
                  <div className="px-2 pb-2 flex flex-col gap-1">
                    {FAMILY_VARIATIONS.map(v => {
                      const isActive = familyVariation === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => onFamilyVariationChange(v.id)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-left transition-colors hover:bg-white/[0.03]"
                          style={{
                            background: isActive ? `${v.color}10` : "transparent",
                            border: isActive ? `1px solid ${v.color}25` : "1px solid transparent",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px]"
                            style={{
                              background: isActive ? `${v.color}20` : "rgba(var(--ce-glass-tint),0.04)",
                              color: isActive ? v.color : "var(--ce-text-tertiary)",
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                            }}
                          >
                            {v.id}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span
                              className="text-[10px] block leading-tight"
                              style={{ color: isActive ? v.color : "var(--ce-text-secondary)", fontFamily: "var(--font-body)", fontWeight: isActive ? 500 : 400 }}
                            >
                              {v.label}
                            </span>
                            <span className="text-[9px] block leading-tight text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                              {v.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── ROUTES section ────────────────────────────── */}
              <div>
                <button
                  onClick={() => setRoutesExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                    NAVIGATE
                  </span>
                  {routesExpanded ? (
                    <ChevronUp className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {routesExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="pb-2"
                        style={{ maxHeight: 340, overflowY: "auto" }}
                      >
                        {/* General routes */}
                        <div
                          className="px-3 py-1"
                          style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}
                        >
                          <span
                            className="text-[9px] text-[var(--ce-text-quaternary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            General
                          </span>
                        </div>
                        {GENERAL_ROUTES.map(route => {
                          const isActive = pathname === route.path;
                          const Icon = route.Icon;
                          return (
                            <button
                              key={route.path}
                              onClick={() => handleRouteClick(route.path)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 cursor-pointer text-left transition-colors hover:bg-white/[0.03]"
                              style={{
                                background: isActive ? "rgba(var(--ce-cyan-rgb),0.06)" : "transparent",
                              }}
                            >
                              <Icon
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: isActive ? "var(--ce-cyan)" : "var(--ce-text-tertiary)" }}
                              />
                              <span
                                className="text-[10px] flex-1 truncate"
                                style={{
                                  color: isActive ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                  fontWeight: isActive ? 500 : 400,
                                }}
                              >
                                {route.path}
                              </span>
                              <span
                                className="text-[9px] flex-shrink-0"
                                style={{ color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}
                              >
                                {route.label}
                              </span>
                            </button>
                          );
                        })}

                        {/* Landing page variations */}
                        <div
                          className="px-3 py-1 mt-0.5"
                          style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}
                        >
                          <span
                            className="text-[9px] text-[var(--ce-text-quaternary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Landing Pages
                          </span>
                        </div>
                        {LANDING_ROUTES.map(route => {
                          const isActive = pathname === route.path;
                          const Icon = route.Icon;
                          return (
                            <button
                              key={route.path}
                              onClick={() => handleRouteClick(route.path)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 cursor-pointer text-left transition-colors hover:bg-white/[0.03]"
                              style={{
                                background: isActive ? "rgba(var(--ce-cyan-rgb),0.06)" : "transparent",
                              }}
                            >
                              <Icon
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: isActive ? "var(--ce-cyan)" : "var(--ce-text-tertiary)" }}
                              />
                              <span
                                className="text-[10px] flex-1 truncate"
                                style={{
                                  color: isActive ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                  fontWeight: isActive ? 500 : 400,
                                }}
                              >
                                {route.path}
                              </span>
                              <span
                                className="text-[9px] flex-shrink-0"
                                style={{ color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}
                              >
                                {route.label}
                              </span>
                            </button>
                          );
                        })}

                        {/* Role routes */}
                        <div
                          className="px-3 py-1 mt-0.5"
                          style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}
                        >
                          <span
                            className="text-[9px]"
                            style={{
                              fontFamily: "var(--font-body)",
                              color: displayRole.color,
                            }}
                          >
                            {displayRole.label}
                          </span>
                        </div>
                        {roleRoutes.map(route => {
                          const isActive = pathname === route.path || (route.path !== `/${displayRoleId}` && pathname.startsWith(route.path));
                          const isExact = pathname === route.path;
                          const Icon = route.Icon;
                          return (
                            <button
                              key={route.path}
                              onClick={() => handleRouteClick(route.path)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 cursor-pointer text-left transition-colors hover:bg-white/[0.03]"
                              style={{
                                background: isExact
                                  ? `${displayRole.color}08`
                                  : "transparent",
                              }}
                            >
                              <Icon
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: isExact ? displayRole.color : "var(--ce-text-tertiary)" }}
                              />
                              <span
                                className="text-[10px] flex-1 truncate"
                                style={{
                                  color: isExact ? displayRole.color : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                  fontWeight: isExact ? 500 : 400,
                                  fontFeatureSettings: "'tnum'",
                                }}
                              >
                                {route.path}
                              </span>
                              <span
                                className="text-[9px] flex-shrink-0"
                                style={{ color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}
                              >
                                {route.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}