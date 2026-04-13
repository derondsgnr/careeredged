/**
 * Shared Role Shell — Top Nav + Sophia Bar
 * 
 * Universal shell used by ALL 8 roles. Same structure, different nav pills.
 * Extracted from shell-synthesis.tsx (EdgeStar's H2 pattern).
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { SophiaForwardBackground } from "./shell-background";
import { SophiaAsk } from "./sophia-ask";
import { SophiaVoiceOverlay } from "./sophia-voice-overlay";
import { SophiaCtx } from "./sophia-context";
import { SettingsPanel } from "./settings";
import { TabSwitcher } from "./tab-switcher";
import { SophiaBottomBar, type NavVariation } from "./sophia-patterns";
import { NavExplorePanel } from "./nav-explore-panel";
import { EASE, COLORS, FONT, TEXT, SURFACE, GLASS_TINT } from "./tokens";
import { useThemeToggle } from "./ui/use-theme";
import {
  Sparkles, Zap, Bell, Home, Compass, FileText, Search,
  MessageSquare, Rocket, Users, Calendar,
  DollarSign, GraduationCap, BarChart3,
  Heart, Target, BookOpen, Briefcase,
  TrendingUp, Kanban, Layers, Sun, Moon,
  type LucideIcon,
} from "lucide-react";

// ─── Role configurations ──────────────────────────────────────────────

export type RoleId = "edgestar" | "edgepreneur" | "parent" | "guide" | "employer" | "edu" | "ngo" | "agency";

export interface NavPill {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  surfaceId?: string;
  sophiaPrompt?: string;
}

export interface SophiaContext {
  message: string;
  chips: { label: string; action: string }[];
}

export interface RoleNotification {
  title: string;
  time: string;
  unread: boolean;
  /** surfaceId or "sophia" */
  target: string;
}

export interface RoleConfig {
  id: RoleId;
  label: string;
  navPills: NavPill[];
  sophia: SophiaContext;
  notifications: RoleNotification[];
  userName: string;
  userInitial: string;
  edgeGas: number;
}

export const ROLE_CONFIGS: Record<RoleId, Omit<RoleConfig, "userName" | "userInitial" | "edgeGas">> = {
  edgestar: {
    id: "edgestar",
    label: "EdgeStar",
    navPills: [
      { id: "home",     label: "Home",     icon: Home },
      { id: "roadmap",  label: "Roadmap",  icon: Compass,       surfaceId: "edgepath" },
      { id: "resume",   label: "Resume",   icon: FileText,      surfaceId: "resume" },
      { id: "jobs",     label: "Jobs",     icon: Search, badge: 23, surfaceId: "jobs" },
      { id: "sessions", label: "Sessions", icon: Calendar, badge: 3, surfaceId: "sessions" },
      { id: "messages", label: "Messages", icon: MessageSquare, badge: 3, surfaceId: "messages" },
    ],
    sophia: {
      message: "3 new job matches since yesterday — 2 are strong fits",
      chips: [{ label: "View matches", action: "jobs" }, { label: "Open roadmap", action: "edgepath" }],
    },
    notifications: [
      { title: "3 new job matches today — Product Designer at Figma", time: "Just now", unread: true, target: "jobs" },
      { title: "Resume ATS score improved to 87 after your edits", time: "1 hr ago", unread: true, target: "resume" },
      { title: "Your coach Alice replied to your session request", time: "2 hrs ago", unread: false, target: "sessions" },
      { title: "Phase 2 milestone due in 3 days", time: "Yesterday", unread: false, target: "edgepath" },
    ],
  },
  edgepreneur: {
    id: "edgepreneur",
    label: "EdgePreneur",
    navPills: [
      { id: "home",       label: "Home",       icon: Home },
      { id: "roadmap",    label: "Roadmap",    icon: Rocket,        surfaceId: "edgepath" },
      { id: "funding",    label: "Funding",    icon: TrendingUp,    surfaceId: "funding" },
      { id: "milestones", label: "Milestones", icon: Target,        surfaceId: "taskroom" },
      { id: "messages",   label: "Messages",   icon: MessageSquare, badge: 1, surfaceId: "messages" },
    ],
    sophia: {
      message: "2 accelerators match your current stage — applications close in 14 days",
      chips: [{ label: "View funding", action: "funding" }, { label: "Open roadmap", action: "edgepath" }],
    },
    notifications: [
      { title: "2 new funding opportunities match your venture stage", time: "Just now", unread: true, target: "funding" },
      { title: "Pitch deck milestone is due this week", time: "3 hrs ago", unread: true, target: "milestones" },
      { title: "Sophia has a new funding strategy insight for you", time: "Yesterday", unread: false, target: "sophia" },
    ],
  },
  parent: {
    id: "parent",
    label: "EdgeParent",
    navPills: [
      { id: "home",     label: "Home",     icon: Home },
      { id: "mypath",   label: "My Path",  icon: Compass,       surfaceId: "edgepath" },
      { id: "family",   label: "Family",   icon: Heart,         surfaceId: "family" },
      { id: "messages", label: "Messages", icon: MessageSquare, surfaceId: "messages" },
    ],
    sophia: {
      message: "Link a child account to start tracking their progress",
      chips: [{ label: "Connect a child", action: "family" }],
    },
    notifications: [
      { title: "Your child completed a new milestone — Phase 1 done", time: "2 hrs ago", unread: true, target: "family" },
      { title: "New message from your child's EdgeGuide", time: "5 hrs ago", unread: false, target: "messages" },
    ],
  },
  guide: {
    id: "guide",
    label: "EdgeGuide",
    navPills: [
      { id: "home",     label: "Home",     icon: Home },
      { id: "sessions", label: "Sessions", icon: Calendar, badge: 2, surfaceId: "sessions" },
      { id: "clients",  label: "Clients",  icon: Users,         surfaceId: "clients" },
      { id: "earnings", label: "Earnings", icon: DollarSign,    surfaceId: "analytics" },
      { id: "messages", label: "Messages", icon: MessageSquare, badge: 5, surfaceId: "messages" },
    ],
    sophia: {
      message: "Sharon's session is in 2 hours — she completed Phase 2 last night",
      chips: [{ label: "View session prep", action: "sessions" }, { label: "See all clients", action: "clients" }],
    },
    notifications: [
      { title: "Sharon Lee booked a session for tomorrow at 2pm", time: "30 min ago", unread: true, target: "sessions" },
      { title: "New client request from Marcus T. — 87% archetype fit", time: "2 hrs ago", unread: true, target: "clients" },
      { title: "Monthly earnings: $2,400 — up 18% from last month", time: "Yesterday", unread: false, target: "analytics" },
      { title: "3 clients haven't logged in for 10+ days", time: "2 days ago", unread: false, target: "clients" },
    ],
  },
  employer: {
    id: "employer",
    label: "EdgeEmployer",
    navPills: [
      { id: "home",      label: "Home",     icon: Home },
      { id: "pipeline",  label: "Pipeline", icon: Kanban,      surfaceId: "pipeline" },
      { id: "analytics", label: "Analytics",icon: BarChart3,   surfaceId: "analytics" },
      { id: "messages",  label: "Messages", icon: MessageSquare, badge: 14, surfaceId: "messages" },
    ],
    sophia: {
      message: "3 candidates for Product Designer scored 90%+ match this week",
      chips: [{ label: "Review pipeline", action: "pipeline" }, { label: "View analytics", action: "analytics" }],
    },
    notifications: [
      { title: "5 new applications for Product Designer role", time: "1 hr ago", unread: true, target: "pipeline" },
      { title: "Top candidate match: 94% fit for UX Lead position", time: "3 hrs ago", unread: true, target: "pipeline" },
      { title: "Product Designer posting expires in 3 days", time: "Yesterday", unread: false, target: "pipeline" },
      { title: "14 unread messages from candidates", time: "2 days ago", unread: false, target: "messages" },
    ],
  },
  edu: {
    id: "edu",
    label: "EdgeEducation",
    navPills: [
      { id: "home",     label: "Home",     icon: Home },
      { id: "students", label: "Students", icon: GraduationCap, sophiaPrompt: "Show me student career readiness scores and who needs support" },
      { id: "events",   label: "Events",   icon: Calendar,      surfaceId: "events" },
      { id: "outcomes", label: "Outcomes", icon: BarChart3,     surfaceId: "analytics" },
      { id: "messages", label: "Messages", icon: MessageSquare, badge: 8, surfaceId: "messages" },
    ],
    sophia: {
      message: "Spring 2026 cohort career readiness is up to 68% — 12 students need support",
      chips: [{ label: "View outcomes", action: "analytics" }, { label: "Manage events", action: "events" }],
    },
    notifications: [
      { title: "Spring Career Fair: 42 students registered so far", time: "2 hrs ago", unread: true, target: "events" },
      { title: "Career readiness up to 68% this cohort", time: "1 day ago", unread: false, target: "outcomes" },
      { title: "12 students haven't started their roadmaps yet", time: "2 days ago", unread: false, target: "students" },
    ],
  },
  ngo: {
    id: "ngo",
    label: "EdgeNGO",
    navPills: [
      { id: "home",     label: "Home",     icon: Home },
      { id: "programs", label: "Programs", icon: BookOpen,      surfaceId: "programs" },
      { id: "events",   label: "Events",   icon: Calendar,      surfaceId: "events" },
      { id: "impact",   label: "Impact",   icon: BarChart3,     surfaceId: "analytics" },
      { id: "messages", label: "Messages", icon: MessageSquare, badge: 2, surfaceId: "messages" },
    ],
    sophia: {
      message: "Grant deadline in 7 days — your Workforce Development application is 60% complete",
      chips: [{ label: "Continue application", action: "programs" }, { label: "View impact", action: "analytics" }],
    },
    notifications: [
      { title: "Workforce Development Grant deadline in 7 days", time: "1 hr ago", unread: true, target: "programs" },
      { title: "12 participants completed interview prep this week", time: "1 day ago", unread: false, target: "programs" },
      { title: "Q1 impact report is due in 14 days", time: "3 days ago", unread: false, target: "impact" },
    ],
  },
  agency: {
    id: "agency",
    label: "EdgeAgency",
    navPills: [
      { id: "home",     label: "Home",     icon: Home },
      { id: "programs", label: "Programs", icon: Layers,        surfaceId: "programs" },
      { id: "events",   label: "Events",   icon: Calendar,      surfaceId: "events" },
      { id: "impact",   label: "Impact",   icon: BarChart3,     surfaceId: "analytics" },
      { id: "messages", label: "Messages", icon: MessageSquare, surfaceId: "messages" },
    ],
    sophia: {
      message: "Q1 placement targets are 78% achieved — 3 new NGO applications this week",
      chips: [{ label: "Review applications", action: "programs" }, { label: "View metrics", action: "analytics" }],
    },
    notifications: [
      { title: "3 new NGO grant applications received this week", time: "2 hrs ago", unread: true, target: "programs" },
      { title: "Q1 workforce placement target: 78% achieved", time: "Yesterday", unread: false, target: "impact" },
      { title: "Youth Career Pathways program closing in 30 days", time: "3 days ago", unread: false, target: "programs" },
    ],
  },
};

// ─── Role Badge ──────────────────────────────────────────────────────

const ROLE_COLORS: Record<RoleId, string> = {
  edgestar: "var(--ce-role-edgestar)",
  edgepreneur: "var(--ce-role-edgepreneur)",
  parent: "var(--ce-role-parent)",
  guide: "var(--ce-role-guide)",
  employer: "var(--ce-role-employer)",
  edu: "var(--ce-role-edu)",
  ngo: "var(--ce-role-ngo)",
  agency: "var(--ce-role-agency)",
};

function RoleBadge({ role }: { role: RoleId }) {
  const config = ROLE_CONFIGS[role];
  const color = ROLE_COLORS[role];
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
      style={{ background: `${color}10`, border: `1px solid ${color}18` }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[10px]" style={{ color, fontFamily: "var(--font-body)" }}>{config.label}</span>
    </div>
  );
}

// ─── Top Nav ─────────────────────────────────────────────────────────

function TopNav({ role, active, userName, userInitial, edgeGas, onOpenSophia, onNotifClick, onProfileClick }: {
  role: RoleId;
  active: string;
  userName: string;
  userInitial: string;
  edgeGas: number;
  onOpenSophia: (message: string) => void;
  onNotifClick: () => void;
  onProfileClick: () => void;
}) {
  const navigate = useNavigate();
  const config = ROLE_CONFIGS[role];

  const handleNavClick = (pill: NavPill) => {
    if (pill.id === "home") {
      navigate(`/${role}`);
    } else if (pill.surfaceId) {
      navigate(`/${role}/${pill.surfaceId}`);
    } else if (pill.sophiaPrompt) {
      onOpenSophia(pill.sophiaPrompt);
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-6"
      style={{
        background: "color-mix(in srgb, var(--ce-surface-bg) 85%, transparent)",
        borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Logo + Role Badge */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-cyan-rgb),0.08)" }}>
          <Sparkles className="w-3.5 h-3.5 text-ce-cyan" />
        </div>
        <span className="text-[14px] tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--ce-text-primary)" }}>CareerEdge</span>
        <RoleBadge role={role} />
      </div>

      {/* Nav pills — centered */}
      <TabSwitcher
        variant="pill"
        tabs={config.navPills.map((p) => {
          const Icon = p.icon;
          return { id: p.id, label: p.label, icon: <Icon className="w-4 h-4" />, badge: p.badge };
        })}
        active={active}
        onChange={(id) => handleNavClick(config.navPills.find((p) => p.id === id)!)}
        layoutId="role-nav-pill"
      />

      {/* Right — EdgeGas + bell + avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(var(--ce-lime-rgb),0.06)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)" }}>
          <Zap className="w-3 h-3 text-ce-lime" />
          <span className="text-[11px] text-ce-lime tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{edgeGas}</span>
        </div>

        <button onClick={onNotifClick} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
          <Bell className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[var(--ce-role-edgestar)]" />
        </button>

        <button onClick={onProfileClick} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[role]}25, rgba(var(--ce-cyan-rgb),0.1))`, border: `1.5px solid rgba(var(--ce-glass-tint),0.08)` }}>
          <span className="text-[12px]" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--ce-text-primary)" }}>{userInitial}</span>
        </button>
      </div>
    </motion.header>
  );
}

// ─── Shared Top Nav (standalone export) ──────────────────────────────
//
// Use this in surfaces that control their own layout (EdgePath, shell-synthesis)
// rather than wrapping with <RoleShell>. Active pill is auto-detected from URL.
//
export function SharedTopNav({
  role,
  onOpenSophia,
  onNotifClick,
  onProfileClick,
  userName = "Sophia",
  userInitial = "S",
  edgeGas = 45,
}: {
  role: RoleId;
  onOpenSophia: (message: string) => void;
  onNotifClick?: () => void;
  onProfileClick?: () => void;
  userName?: string;
  userInitial?: string;
  edgeGas?: number;
}) {
  const location = useLocation();
  const config = ROLE_CONFIGS[role];

  // Auto-detect active pill from current URL
  const active = (() => {
    const pathname = location.pathname;
    if (pathname === `/${role}` || pathname === `/${role}/`) return "home";
    for (const pill of config.navPills) {
      if (pill.surfaceId && pathname.includes(`/${pill.surfaceId}`)) return pill.id;
    }
    return "home";
  })();

  return (
    <TopNav
      role={role}
      active={active}
      userName={userName}
      userInitial={userInitial}
      edgeGas={edgeGas}
      onOpenSophia={onOpenSophia}
      onNotifClick={onNotifClick ?? (() => {})}
      onProfileClick={onProfileClick ?? (() => {})}
    />
  );
}

// ─── Shared Card Shell ───────────────────────────────────────────────

export function GlassCard({
  children,
  delay = 0.5,
  className = "",
  gradient = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  gradient?: boolean;
}) {
  return (
    <motion.div
      className={`rounded-xl p-5 ${className}`}
      style={
        gradient
          ? {
              background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.05), rgba(var(--ce-glass-tint),0.02) 50%, rgba(var(--ce-cyan-rgb),0.02))",
              border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)",
            }
          : {
              background: "var(--ce-surface-card)",
              border: "1px solid var(--ce-surface-card-border)",
            }
      }
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Placeholder Surface ─────────────────────────────────────────────

export function PlaceholderSurface({ name, role }: { name: string; role: RoleId }) {
  const color = ROLE_COLORS[role];
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: `${color}10`, border: `1px solid ${color}18` }}
      >
        <Sparkles className="w-7 h-7" style={{ color }} />
      </div>
      <h2 className="text-[20px] text-[var(--ce-text-primary)] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        {name}
      </h2>
      <p className="text-[13px] text-[var(--ce-text-secondary)] text-center max-w-[320px]" style={{ fontFamily: "var(--font-body)" }}>
        This surface is designed and ready for build. The UX spec is locked.
      </p>
    </div>
  );
}

// ─── Main Shell Component ────────────────────────────────────────────

export type NavigateFn = (target: string) => void;

interface RoleShellProps {
  role: RoleId;
  userName: string;
  userInitial: string;
  edgeGas?: number;
  children: React.ReactNode;
  onNavigate?: NavigateFn;
  /** Which nav pill is active — the parent manages this for sub-surface navigation */
  activeNav?: string;
  onNavChange?: (id: string) => void;
  /** Override Sophia context for surface-specific messaging */
  sophiaOverride?: SophiaContext;
  /** Remove padding from main content area (for full-bleed layouts like Messaging) */
  noPadding?: boolean;
  /** Navigation variation — controls Sophia bar and explore panel behavior */
  navVariation?: NavVariation;
}

export function RoleShell({
  role,
  userName,
  userInitial,
  edgeGas = 45,
  children,
  onNavigate,
  activeNav: controlledActive,
  onNavChange,
  sophiaOverride,
  noPadding = false,
  navVariation: navVariationProp,
}: RoleShellProps) {
  // Read navVariation from localStorage, poll for DevTools changes
  const [navVariationLocal, setNavVariationLocal] = useState<NavVariation>(() => {
    return (localStorage.getItem("careerEdgeNavVariation") as NavVariation) || "A";
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const current = (localStorage.getItem("careerEdgeNavVariation") as NavVariation) || "A";
      setNavVariationLocal(prev => prev !== current ? current : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const navVariation = navVariationProp ?? navVariationLocal;
  const config = ROLE_CONFIGS[role];
  const location = useLocation();
  const [sophiaOpen, setSophiaOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [exploreMode, setExploreMode] = useState<"chat" | "explore">("chat");

  // Theme toggle — shared hook
  const { theme: themeMode, toggle: toggleTheme } = useThemeToggle();

  // Auto-detect active nav based on current URL path
  const pathname = location.pathname;
  const autoDetectedActive = (() => {
    // Check if we're on the home/dashboard route
    if (pathname === `/${role}` || pathname === `/${role}/`) {
      return "home";
    }
    // Check each nav pill to find a match
    for (const pill of config.navPills) {
      if (pill.surfaceId && pathname.includes(`/${pill.surfaceId}`)) {
        return pill.id;
      }
    }
    return "home"; // fallback
  })();

  const activeNav = controlledActive ?? autoDetectedActive;

  const handleNavClick = (id: string) => {
    // Check if the pill has a surfaceId for cross-surface navigation
    const pill = config.navPills.find((p) => p.id === id);
    if (pill?.surfaceId && onNavigate) {
      onNavigate(pill.surfaceId);
      return;
    }
    // "home" always navigates to dashboard
    if (id === "home" && onNavigate) {
      onNavigate("synthesis");
      return;
    }
    // If the pill has a sophiaPrompt, open Sophia with that context
    if (pill?.sophiaPrompt) {
      setInitialMessage(pill.sophiaPrompt);
      setSophiaOpen(true);
      return;
    }
    if (onNavChange) {
      onNavChange(id);
    }
    // If no onNavChange handler, the navigation is handled by auto-detection
  };

  const handleSophiaChipClick = (action: string) => {
    // 1. Try nav pill match (e.g., "home", "resume", "jobs")
    const pill = config.navPills.find((p) => p.id === action || p.surfaceId === action);
    if (pill) {
      handleNavClick(action);
      return;
    }
    // 2. Single-word actions → route via onNavigate (surface IDs + custom actions like "goals", "retro", "focus")
    //    The receiving surface's onNavigate wrapper can intercept custom actions.
    //    Multi-word actions → Sophia query (natural language like "Help me prep for my interview")
    if (!action.includes(" ")) {
      onNavigate?.(action);
      return;
    }
    // 3. Multi-word: open Sophia with the action as a conversational query
    setInitialMessage(action);
    setSophiaOpen(true);
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--ce-surface-bg)" }}>
      <SophiaForwardBackground />
      <TopNav
        role={role}
        active={activeNav}
        userName={userName}
        userInitial={userInitial}
        edgeGas={edgeGas}
        onOpenSophia={setInitialMessage}
        onNotifClick={() => setNotifOpen(!notifOpen)}
        onProfileClick={() => setProfileOpen(!profileOpen)}
      />
      <SophiaBottomBar
        context={sophiaOverride ?? config.sophia}
        onAskSophia={() => {
          setInitialMessage(null);
          setSophiaOpen(true);
        }}
        onVoiceStart={() => {
          setVoiceOverlayOpen(true);
        }}
        onChipClick={handleSophiaChipClick}
        navVariation={navVariation}
        onToggleExplore={() => setExploreOpen(v => !v)}
        exploreMode={exploreMode}
        onExploreModeChange={(mode) => {
          setExploreMode(mode);
          if (mode === "explore") {
            setExploreOpen(true);
            setSophiaOpen(false);
          } else {
            setExploreOpen(false);
            setInitialMessage(null);
            setSophiaOpen(true);
          }
        }}
      />

      {/* Explore panel — shared by both variations */}
      <NavExplorePanel
        role={role}
        isOpen={exploreOpen}
        onClose={() => {
          setExploreOpen(false);
          setExploreMode("chat");
        }}
        onNavigate={(surfaceId) => {
          if (onNavigate) onNavigate(surfaceId);
        }}
        variant={navVariation === "A" ? "dock" : "inline"}
      />

      {/* Notification Panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div className="fixed top-14 right-6 z-50 w-[340px] rounded-xl overflow-hidden" style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Notifications</span>
              <button onClick={() => setNotifOpen(false)} className="text-[11px] text-ce-cyan cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Mark all read</button>
            </div>
            {config.notifications.map((n, i) => (
              <button key={i} onClick={() => { setNotifOpen(false); if (n.target === "sophia") { setInitialMessage("What's the new insight you have for me?"); setSophiaOpen(true); } else if (onNavigate) { onNavigate(n.target); } }} className="w-full flex items-start gap-3 p-4 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors text-left" style={{ borderBottom: i < config.notifications.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                {n.unread && <div className="w-2 h-2 rounded-full bg-[var(--ce-role-edgestar)] mt-1.5 flex-shrink-0" />}
                {!n.unread && <div className="w-2 h-2 rounded-full bg-transparent mt-1.5 flex-shrink-0" />}
                <div>
                  <span className={`text-[12px] block ${n.unread ? "text-[var(--ce-text-primary)]" : "text-[var(--ce-text-secondary)]"}`} style={{ fontFamily: "var(--font-body)" }}>{n.title}</span>
                  <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{n.time}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div className="fixed top-14 right-6 z-50 w-[220px] rounded-xl overflow-hidden" style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="p-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <span className="text-[13px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{userName}</span>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{config.label}</span>
            </div>
            {/* Theme toggle */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <span className="text-[11px]" style={{ color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                }}
              >
                {themeMode === "dark" ? (
                  <>
                    <Moon className="w-3 h-3" style={{ color: "var(--ce-text-secondary)" }} />
                    <span className="text-[11px]" style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3" style={{ color: "var(--ce-role-edgepreneur)" }} />
                    <span className="text-[11px]" style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>Light</span>
                  </>
                )}
              </button>
            </div>

            {[
              { label: "Settings", action: "settings" },
              { label: "Help & Support", action: "help" },
              { label: "Sign Out", action: "signout" },
            ].map((item, i) => (
              <button key={i} onClick={() => {
                setProfileOpen(false);
                if (item.action === "signout" && onNavigate) {
                  onNavigate("landing");
                } else if (item.action === "settings") {
                  setSettingsOpen(true);
                } else if (item.action === "help") {
                  setInitialMessage("I need help using CareerEdge — can you walk me through the main features for my role?");
                  setSophiaOpen(true);
                }
              }} className="w-full text-left px-4 py-3 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors text-[12px]" style={{ color: item.action === "signout" ? "var(--ce-status-error)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)", borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        role={role}
        userName={userName}
        userInitial={userInitial}
      />

      {/* Click-away for dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-[49]" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}

      {/* Sophia conversation overlay */}
      <SophiaAsk
        isOpen={sophiaOpen}
        onClose={() => { setSophiaOpen(false); setInitialMessage(null); setAutoVoice(false); }}
        mode="stretch"
        initialMessage={initialMessage}
        onClearInitial={() => setInitialMessage(null)}
        autoVoice={autoVoice}
        onClearAutoVoice={() => setAutoVoice(false)}
        onNavigate={(target) => {
          handleNavClick(target);
          setSophiaOpen(false);
          setInitialMessage(null);
          setAutoVoice(false);
        }}
      />

      {/* Voice overlay — Layer 6 */}
      <SophiaVoiceOverlay
        isOpen={voiceOverlayOpen}
        onClose={() => setVoiceOverlayOpen(false)}
        onOpenPanel={(message) => {
          setVoiceOverlayOpen(false);
          setInitialMessage(message);
          setSophiaOpen(true);
        }}
      />

      {/* Main content */}
      <main className={noPadding ? "mt-14 pb-14" : "mt-14 pb-20 px-6"}>
        <SophiaCtx.Provider value={{
          openSophia: (msg?: string) => { setInitialMessage(msg ?? null); setSophiaOpen(true); },
          openVoice: () => setVoiceOverlayOpen(true),
        }}>
          {children}
        </SophiaCtx.Provider>
      </main>
    </div>
  );
}