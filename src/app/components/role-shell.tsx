/**
 * Shared Role Shell — Top Nav + Sophia Bar
 * 
 * Universal shell used by ALL 8 roles. Same structure, different nav pills.
 * Extracted from shell-synthesis.tsx (EdgeStar's H2 pattern).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import { SophiaAsk } from "./sophia-ask";
import { SophiaVoiceOverlay } from "./sophia-voice-overlay";
import { SophiaCtx, useSophia } from "./sophia-context";
import { SettingsPanel } from "./settings";
import {
  Sparkles, Zap, Bell, Home, Compass, FileText, Search,
  MessageSquare, Rocket, Users, Calendar,
  DollarSign, GraduationCap, BarChart3,
  Heart, Target, BookOpen, Briefcase,
  Mic, TrendingUp, Kanban, Layers,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

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
      chips: [{ label: "View matches", action: "jobs" }, { label: "Open roadmap", action: "roadmap" }],
    },
    notifications: [
      { title: "3 new job matches today — Product Designer at Figma", time: "Just now", unread: true, target: "jobs" },
      { title: "Resume ATS score improved to 87 after your edits", time: "1 hr ago", unread: true, target: "resume" },
      { title: "Your coach Alice replied to your session request", time: "2 hrs ago", unread: false, target: "sessions" },
      { title: "Phase 2 milestone due in 3 days", time: "Yesterday", unread: false, target: "roadmap" },
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
      chips: [{ label: "View funding", action: "funding" }, { label: "Open roadmap", action: "roadmap" }],
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
      chips: [{ label: "View outcomes", action: "outcomes" }, { label: "Manage events", action: "events" }],
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
      chips: [{ label: "Continue application", action: "programs" }, { label: "View impact", action: "impact" }],
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
      chips: [{ label: "Review applications", action: "programs" }, { label: "View metrics", action: "impact" }],
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
  edgestar: "#22D3EE",
  edgepreneur: "#F59E0B",
  parent: "#EC4899",
  guide: "#8B5CF6",
  employer: "#10B981",
  edu: "#3B82F6",
  ngo: "#F97316",
  agency: "#6366F1",
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
        background: "rgba(8,9,12,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Logo + Role Badge */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
          <Sparkles className="w-3.5 h-3.5 text-[#B3FF3B]" />
        </div>
        <span className="text-[14px] text-[#E8E8ED] tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CareerEdge</span>
        <RoleBadge role={role} />
      </div>

      {/* Nav pills — centered */}
      <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        {config.navPills.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  layoutId="role-nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: isActive ? "#E8E8ED" : "#6B7280" }} />
                <span className={`text-[13px] ${isActive ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                    background: isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.06)",
                    color: isActive ? "#22D3EE" : "#6B7280",
                    fontFamily: "var(--font-body)",
                  }}>{item.badge}</span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Right — EdgeGas + bell + avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.1)" }}>
          <Zap className="w-3 h-3 text-[#B3FF3B]" />
          <span className="text-[11px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{edgeGas}</span>
        </div>

        <button onClick={onNotifClick} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(255,255,255,0.03)" }}>
          <Bell className="w-4 h-4 text-[#6B7280]" />
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#22D3EE]" />
        </button>

        <button onClick={onProfileClick} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[role]}25, rgba(179,255,59,0.1))`, border: "1.5px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{userInitial}</span>
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

// ─── Sophia Bottom Bar ───────────────────────────────────────────────

function SophiaBottomBar({
  context,
  onAskSophia,
  onVoiceStart,
  onChipClick,
}: {
  context: SophiaContext;
  onAskSophia: () => void;
  onVoiceStart: () => void;
  onChipClick: (action: string) => void;
}) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-4 px-6 h-14"
      style={{
        background: "rgba(10,12,16,0.92)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
      }}
      initial={{ y: 56 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
    >
      <SophiaMark size={18} glowing={false} />
      <div className="flex-1 flex items-center gap-3">
        <span className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
          {context.message}
        </span>
        <div className="flex gap-2">
          {context.chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onChipClick(chip.action)}
              className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice entry point — always visible */}
      <button
        onClick={onVoiceStart}
        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(179,255,59,0.08)] group"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        title="Talk to Sophia"
      >
        <Mic className="w-3.5 h-3.5 text-[#374151] group-hover:text-[#B3FF3B] transition-colors" />
      </button>

      <button
        onClick={onAskSophia}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(34,211,238,0.08)] transition-colors"
        style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)" }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
        <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia</span>
      </button>
    </motion.div>
  );
}

// ─── Shared KPI Row ──────────────────────────────────────────────────

export interface KPIItem {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
  gauge: number | null;
}

export function KPIRow({ kpis }: { kpis: KPIItem[] }) {
  return (
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${kpis.length}, 1fr)` }}>
      {kpis.map((kpi, i) => (
        <motion.div
          key={i}
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.08, duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}10` }}>
              <div style={{ color: kpi.color }}>{kpi.icon}</div>
            </div>
            {kpi.gauge !== null && (
              <svg width="40" height="22" viewBox="0 0 40 22">
                <path d="M4 20 A16 16 0 0 1 36 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeLinecap="round" />
                <motion.path
                  d="M4 20 A16 16 0 0 1 36 20"
                  fill="none"
                  stroke={kpi.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: kpi.gauge }}
                  transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
                />
              </svg>
            )}
          </div>
          <div className="text-[26px] text-[#E8E8ED] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{kpi.value}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{kpi.label}</span>
            <span className="text-[10px] text-[#B3FF3B]" style={{ fontFamily: "var(--font-body)" }}>{kpi.trend}</span>
          </div>
        </motion.div>
      ))}
    </div>
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
              background: "linear-gradient(145deg, rgba(34,211,238,0.05), rgba(255,255,255,0.02) 50%, rgba(179,255,59,0.02))",
              border: "1px solid rgba(34,211,238,0.08)",
            }
          : {
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
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

// ─── Sophia Insight Card ─────────────────────────────────────────────

export function SophiaInsight({
  message,
  actionLabel,
  onAction,
  actionPrompt,
  delay = 0.6,
}: {
  message: string;
  actionLabel: string;
  onAction?: () => void;
  /** If provided, clicking the CTA opens Sophia with this query via context */
  actionPrompt?: string;
  delay?: number;
}) {
  const { openSophia } = useSophia();
  const handleClick = () => {
    if (actionPrompt) openSophia(actionPrompt);
    onAction?.();
  };
  return (
    <GlassCard gradient delay={delay}>
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={18} glowing={false} />
        <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
      </div>
      <p className="text-[13px] text-[#9CA3AF] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
        {message}
      </p>
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px]"
        style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(179,255,59,0.05))",
          border: "1px solid rgba(34,211,238,0.12)",
          color: "#E8E8ED",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" /> {actionLabel}
      </button>
    </GlassCard>
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
      <h2 className="text-[20px] text-[#E8E8ED] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        {name}
      </h2>
      <p className="text-[13px] text-[#6B7280] text-center max-w-[320px]" style={{ fontFamily: "var(--font-body)" }}>
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
}: RoleShellProps) {
  const config = ROLE_CONFIGS[role];
  const location = useLocation();
  const [sophiaOpen, setSophiaOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);

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
    // Try to navigate to the action as a nav pill
    const pill = config.navPills.find((p) => p.id === action);
    if (pill) {
      handleNavClick(action);
    } else {
      setInitialMessage(action);
      setSophiaOpen(true);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
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
      />

      {/* Notification Panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div className="fixed top-14 right-6 z-50 w-[340px] rounded-xl overflow-hidden" style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Notifications</span>
              <button onClick={() => setNotifOpen(false)} className="text-[11px] text-[#22D3EE] cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Mark all read</button>
            </div>
            {config.notifications.map((n, i) => (
              <button key={i} onClick={() => { setNotifOpen(false); if (n.target === "sophia") { setInitialMessage("What's the new insight you have for me?"); setSophiaOpen(true); } else if (onNavigate) { onNavigate(n.target); } }} className="w-full flex items-start gap-3 p-4 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left" style={{ borderBottom: i < config.notifications.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                {n.unread && <div className="w-2 h-2 rounded-full bg-[#22D3EE] mt-1.5 flex-shrink-0" />}
                {!n.unread && <div className="w-2 h-2 rounded-full bg-transparent mt-1.5 flex-shrink-0" />}
                <div>
                  <span className={`text-[12px] block ${n.unread ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-body)" }}>{n.title}</span>
                  <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{n.time}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div className="fixed top-14 right-6 z-50 w-[220px] rounded-xl overflow-hidden" style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[13px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{userName}</span>
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{config.label}</span>
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
              }} className="w-full text-left px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors text-[12px]" style={{ color: item.action === "signout" ? "#EF4444" : "#9CA3AF", fontFamily: "var(--font-body)", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
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