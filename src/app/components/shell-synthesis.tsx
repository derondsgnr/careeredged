/**
 * Shell + Dashboard — Synthesis
 * 
 * Cherry-picked from user feedback:
 * - H2's top nav bar (horizontal pills, no sidebar)
 * - H1's horizontal roadmap widget (phase strip with progress)
 * - H3's KPI cards with gauge arcs
 * - H3's activity/upcoming tabbed widget
 * - H3's bottom Sophia bar (passive intelligence layer)
 * 
 * Background: SophiaForward variant (centered topo, warm gradient)
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import { SophiaAsk } from "./sophia-ask";
import { SharedTopNav } from "./role-shell";
import { SophiaBottomBar as SharedSophiaBottomBar, type NavVariation } from "./sophia-patterns";
import { NavExplorePanel } from "./nav-explore-panel";
import {
  DollarSign, FileText, Search, Compass,
  ChevronRight, Target, BarChart3,
  Check, Sparkles, ArrowUpRight, ArrowRight,
  Users, Calendar, Building2, Star, Sun, Moon,
  MessageSquare, BookOpen, ShoppingBag, Clock,
} from "lucide-react";
import { EASE, TEXT, SURFACE, GLASS_TINT } from "./tokens";
import { useThemeToggle } from "./ui/use-theme";
import { KPIRow, PhaseBar } from "./kpi-patterns";
import { BuddyDashboardCard } from "./buddy-dashboard-card";

const KPIS = [
  { label: "Career Score", value: "72", trend: "+4", icon: <Target className="w-4 h-4" />, color: "var(--ce-role-edgestar)", gauge: 0.72 },
  { label: "Applications", value: "12", trend: "+3 this week", icon: <ArrowUpRight className="w-4 h-4" />, color: "var(--ce-text-secondary)", gauge: null },
  { label: "ATS Score", value: "87", trend: "Resume v3", icon: <FileText className="w-4 h-4" />, color: "var(--ce-text-secondary)", gauge: 0.87 },
  { label: "Invested", value: "$299", trend: "of $1,112", icon: <DollarSign className="w-4 h-4" />, color: "var(--ce-text-secondary)", gauge: 0.27 },
];

// ─── Roadmap Strip (from H1) ────────────────────────────────────────────────

function RoadmapStrip({ onNav }: { onNav: (id: string) => void }) {
  const phases = [
    { id: 1, title: "Discover & Position", weeks: "Weeks 1–3", status: "active" as const, progress: 0.6 },
    { id: 2, title: "Build & Apply", weeks: "Weeks 4–7", status: "upcoming" as const, progress: 0 },
    { id: 3, title: "Interview & Close", weeks: "Weeks 8–10", status: "upcoming" as const, progress: 0 },
    { id: 4, title: "Transition & Grow", weeks: "Weeks 11–14", status: "upcoming" as const, progress: 0 },
  ];

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-ce-cyan" />
          <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Product Design Roadmap</span>
        </div>
        <button onClick={() => onNav("roadmap")} className="flex items-center gap-1 text-[12px] text-[var(--ce-text-secondary)] hover:text-[var(--ce-text-tertiary)] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
          View full roadmap <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <PhaseBar phases={phases} accent="var(--ce-role-edgestar)" delay={0.5} />
    </motion.div>
  );
}

// ─── Activity/Upcoming Tabbed Widget (from H3) ─────────────────────────────

function ActivityWidget({ onNav }: { onNav?: (id: string) => void }) {
  const [tab, setTab] = useState<"activity" | "upcoming">("activity");

  const activities = [
    { time: "2h ago", text: "Resume optimized — ATS score: 87", icon: <FileText className="w-3 h-3" />, color: "var(--ce-role-edgestar)" },
    { time: "5h ago", text: "Applied to Product Designer at Figma", icon: <ArrowUpRight className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
    { time: "Yesterday", text: "Completed milestone: Portfolio review", icon: <Check className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
    { time: "2 days ago", text: "New job match: UX Lead at Intercom", icon: <Search className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
    { time: "3 days ago", text: "Session with Alice Chen — Career Coaching", icon: <Users className="w-3 h-3" />, color: "var(--ce-text-tertiary)", target: "sessions" },
  ];

  const upcoming = [
    { date: "Today 2:00 PM", text: "Session with Alice Chen — Career Coaching", icon: <Calendar className="w-3 h-3" />, color: "var(--ce-role-edgestar)", target: "sessions" },
    { date: "Friday", text: "LinkedIn optimization due", icon: <Target className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
    { date: "Monday", text: "Mock interview with James Okafor", icon: <Users className="w-3 h-3" />, color: "var(--ce-text-tertiary)", target: "sessions" },
  ];

  const items = tab === "activity" ? activities : upcoming;

  return (
    <motion.div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4, ease: EASE }}
    >
      {/* Tab toggle */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg mb-4 self-start" style={{ background: `rgba(${GLASS_TINT},0.03)` }}>
        {(["activity", "upcoming"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-3 py-1.5 rounded-md cursor-pointer"
          >
            {tab === t && (
              <motion.div
                className="absolute inset-0 rounded-md"
                style={{ background: `rgba(${GLASS_TINT},0.06)`, border: `1px solid rgba(${GLASS_TINT},0.08)` }}
                layoutId="synth-activity-tab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 text-[12px] ${tab === t ? "text-[var(--ce-text-primary)]" : "text-[var(--ce-text-secondary)]"}`} style={{ fontFamily: "var(--font-body)" }}>
              {t === "activity" ? "Activity" : "Upcoming"}
            </span>
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.01)] rounded-lg px-1 -mx-1 transition-colors"
                style={{ borderBottom: i < items.length - 1 ? `1px solid rgba(${GLASS_TINT},0.03)` : "none" }}
                onClick={() => (item as any).target && onNav?.((item as any).target)}
              >
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${GLASS_TINT},0.03)` }}>
                  <div style={{ color: (item as any).color }}>{(item as any).icon}</div>
                </div>
                <span className="text-[12px] text-[var(--ce-text-tertiary)] flex-1 min-w-0" style={{ fontFamily: "var(--font-body)" }}>{(item as any).text}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                  {tab === "activity" ? (item as any).time : (item as any).date}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Roadmap Todos (Enhanced: cross-phase, time-grouped, Sophia daily brief) ─

function RoadmapTodos({ onNav, onOpenTaskRoom }: { onNav: (id: string) => void; onOpenTaskRoom?: (milestoneId: string) => void }) {
  const todayTasks = [
    { id: "m-linkedin-optimization", label: "LinkedIn optimization", phase: "P1", status: "current" as const, time: "2h" },
    { id: "m6", label: "Complete interaction design module", phase: "P2", status: "current" as const, time: "8h", cost: 299 },
  ];

  const weekTasks = [
    { id: "m-networking-outreach", label: "Networking outreach", phase: "P1", status: "upcoming" as const, time: "3h" },
    { id: "m7", label: "Redesign a real product (case study #2)", phase: "P2", status: "upcoming" as const, time: "15h", cost: 12 },
    { id: "m-first-applications", label: "First applications", phase: "P1", status: "upcoming" as const, time: "4h" },
  ];

  const completedCount = 8;
  const totalCount = completedCount + todayTasks.length + weekTasks.length;

  return (
    <motion.div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
    >
      {/* Sophia daily brief */}
      <motion.div
        className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-lg"
        style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Sparkles className="w-3 h-3 text-ce-cyan flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {todayTasks.length} tasks today. The interaction design module is your highest-impact action — 6 of 8 target companies require it.
        </p>
      </motion.div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ce-cyan" />
          <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Your Tasks</span>
        </div>
        <span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{completedCount} of {totalCount}</span>
      </div>

      {/* Phase progress mini-bar */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="flex-1 h-1 rounded-full" style={{
            background: p === 1
              ? "linear-gradient(90deg, var(--ce-lime), rgba(var(--ce-lime-rgb),0.3))"
              : p === 2
                ? "linear-gradient(90deg, var(--ce-role-edgestar), rgba(var(--ce-role-edgestar-rgb),0.3))"
                : `rgba(${GLASS_TINT},0.04)`
          }} />
        ))}
      </div>

      {/* Today */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-wider text-ce-text-quaternary mb-2 block" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>Today</span>
        <div className="flex flex-col">
          {todayTasks.map((m, i) => (
            <div key={m.id} className="flex items-start gap-2.5 relative cursor-pointer group" onClick={() => onOpenTaskRoom?.(m.id)}>
              {i < todayTasks.length - 1 && (
                <div className="absolute left-[9px] top-[18px] bottom-0 w-[1px]" style={{ background: `rgba(${GLASS_TINT},0.04)` }} />
              )}
              <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5" style={{
                background: SURFACE.bg,
                border: "1.5px solid var(--ce-role-edgestar)",
                boxShadow: "0 0 8px rgba(var(--ce-role-edgestar-rgb),0.2)",
              }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)]" />
              </div>
              <div className="flex-1 pb-3 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[var(--ce-text-primary)] truncate group-hover:text-ce-cyan transition-colors" style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md text-ce-text-quaternary" style={{ background: `rgba(${GLASS_TINT},0.04)`, fontFamily: "var(--font-body)" }}>{m.phase}</span>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{m.time}</span>
                    {m.cost && <span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>${m.cost}</span>}
                  </div>
                </div>
                <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Open task room →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Week */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-ce-text-quaternary mb-2 block" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>This week</span>
        <div className="flex flex-col">
          {weekTasks.map((m, i) => (
            <div key={m.id} className="flex items-start gap-2.5 relative cursor-pointer group" onClick={() => onOpenTaskRoom?.(m.id)}>
              {i < weekTasks.length - 1 && (
                <div className="absolute left-[9px] top-[18px] bottom-0 w-[1px]" style={{ background: `rgba(${GLASS_TINT},0.04)` }} />
              )}
              <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5" style={{
                background: SURFACE.bg,
                border: `1.5px solid rgba(${GLASS_TINT},0.06)`,
              }} />
              <div className="flex-1 pb-3 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[var(--ce-text-secondary)] truncate group-hover:text-ce-text-primary transition-colors" style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md text-ce-text-quaternary" style={{ background: `rgba(${GLASS_TINT},0.04)`, fontFamily: "var(--font-body)" }}>{m.phase}</span>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{m.time}</span>
                    {m.cost && <span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>${m.cost}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See all deep-link */}
      <button
        className="mt-3 flex items-center gap-1.5 text-[11px] text-ce-cyan cursor-pointer hover:gap-2.5 transition-all"
        style={{ fontFamily: "var(--font-body)" }}
        onClick={() => onNav("edgepath")}
      >
        See all milestones <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

// ─── Sophia Insight + Next Action (right column) ────────────────────────────

function SophiaInsightCard({ onSophia }: { onSophia: (msg: string) => void }) {
  return (
    <motion.div
      className="rounded-xl p-5"
      style={{
        background: `linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.05), rgba(${GLASS_TINT},0.02) 50%, rgba(var(--ce-lime-rgb),0.02))`,
        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={18} glowing={false} />
        <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
      </div>
      <p className="text-[13px] text-[var(--ce-text-tertiary)] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
        Your resume improvements are paying off — 3x more responses this week. I'd start interview prep now. Figma's design challenge round is common.
      </p>
      <button
        onClick={() => onSophia("Start interview prep")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px]"
        style={{
          background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.1), rgba(var(--ce-lime-rgb),0.05))",
          border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
          color: TEXT.primary,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-ce-cyan" /> Start interview prep
      </button>
    </motion.div>
  );
}

function TopJobsCompact({ onNav }: { onNav: (id: string) => void }) {
  const jobs = [
    { title: "Product Designer", company: "Figma", match: 92, location: "SF" },
    { title: "UX Lead", company: "Intercom", match: 87, location: "Remote" },
    { title: "Design Manager", company: "Vercel", match: 84, location: "Remote" },
  ];

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-ce-lime" />
          <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Top Matches</span>
        </div>
        <button onClick={() => onNav("jobs")} className="text-[11px] text-[var(--ce-text-secondary)] hover:text-[var(--ce-text-tertiary)] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
          View all 23 →
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {jobs.map((job, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors" style={{ border: `1px solid rgba(${GLASS_TINT},0.03)` }} onClick={() => onNav("jobs")}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `rgba(${GLASS_TINT},0.04)` }}>
              <Building2 className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[var(--ce-text-primary)] block truncate" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{job.company} · {job.location}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-lime-rgb),0.06)" }}>
              <span className="text-[10px] text-ce-lime tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Sophia Bottom Bar — now uses shared component from sophia-patterns.tsx ──

// ─── Main ───────────────────────────────────────────────────────────────────

type NavigateFn = (target: string) => void;

export function ShellSynthesis({ onNavigate, onOpenTaskRoom }: { onNavigate?: NavigateFn; onOpenTaskRoom?: (milestoneId: string) => void }) {
  const [sophiaOpen, setSophiaOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [exploreMode, setExploreMode] = useState<"chat" | "explore">("chat");

  // Theme toggle — shared hook
  const { theme: themeMode, toggle: toggleTheme } = useThemeToggle();

  // Read navVariation from localStorage (syncs with DevTools)
  const [navVariation, setNavVariation] = useState<NavVariation>(() => {
    return (localStorage.getItem("careerEdgeNavVariation") as NavVariation) || "A";
  });
  // Poll for DevTools changes
  useEffect(() => {
    const interval = setInterval(() => {
      const current = (localStorage.getItem("careerEdgeNavVariation") as NavVariation) || "A";
      setNavVariation(prev => prev !== current ? current : prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleAskSophia = () => {
    setInitialMessage(null);
    setSophiaOpen(true);
  };

  const handleChipClick = (msg: string) => {
    setInitialMessage(msg);
    setSophiaOpen(true);
  };

  const handleClose = () => {
    setSophiaOpen(false);
    setInitialMessage(null);
  };

  const handleNavClick = (id: string) => {
    // SharedTopNav handles routing internally via useNavigate.
    // This handler is only used by SophiaBottomBar chips.
    if (id === "roadmap" && onNavigate) onNavigate("edgepath");
    else if (id === "resume" && onNavigate) onNavigate("resume");
    else if (id === "jobs" && onNavigate) onNavigate("jobs");
    else if (id === "sessions" && onNavigate) onNavigate("sessions");
    else if (id === "analytics" && onNavigate) onNavigate("analytics");
    else if (id === "messages" && onNavigate) onNavigate("messages");
  };

  const handleSophiaChipAction = (action: string) => {
    // Try to navigate, or open Sophia
    if (["sessions", "jobs", "roadmap", "resume", "analytics", "messages"].includes(action)) {
      handleNavClick(action);
    } else {
      handleChipClick(action);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: SURFACE.bg }}>
      <SophiaForwardBackground />
      <SharedTopNav
        role="edgestar"
        onOpenSophia={(msg) => { setInitialMessage(msg); setSophiaOpen(true); }}
        onNotifClick={() => { setProfileOpen(false); setNotifOpen(!notifOpen); }}
        onProfileClick={() => { setNotifOpen(false); setProfileOpen(!profileOpen); }}
      />
      <SharedSophiaBottomBar
        context={{
          message: "Session with Alice today at 2PM · 3 new job matches",
          chips: [
            { label: "View session", action: "sessions" },
            { label: "View matches", action: "jobs" },
            { label: "Open roadmap", action: "roadmap" },
          ],
        }}
        onAskSophia={handleAskSophia}
        onVoiceStart={() => {}}
        onChipClick={handleSophiaChipAction}
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

      {/* Explore panel */}
      <NavExplorePanel
        role="edgestar"
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
          <motion.div className="fixed top-14 right-6 z-50 w-[340px] rounded-xl overflow-hidden" style={{ background: SURFACE.modalBg, border: `1px solid rgba(${GLASS_TINT},0.06)`, backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid rgba(${GLASS_TINT},0.04)` }}>
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Notifications</span>
              <button onClick={() => setNotifOpen(false)} className="text-[11px] text-ce-cyan cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Mark all read</button>
            </div>
            {[
              { title: "New match: Product Designer at Figma", time: "2 min ago", unread: true, target: "jobs" },
              { title: "Resume ATS score improved to 87", time: "2 hrs ago", unread: true, target: "resume" },
              { title: "Alice sent a message", time: "5 hrs ago", unread: false, target: "messages" },
              { title: "Sophia has a new insight for you", time: "Yesterday", unread: false, target: "sophia" },
            ].map((n, i) => (
              <button key={i} onClick={() => { setNotifOpen(false); if (n.target === "sophia") { setInitialMessage("What's the new insight you have for me?"); setSophiaOpen(true); } else if (onNavigate) { onNavigate(n.target); } }} className="w-full flex items-start gap-3 p-4 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors text-left" style={{ borderBottom: i < 3 ? `1px solid rgba(${GLASS_TINT},0.03)` : "none" }}>
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
          <motion.div className="fixed top-14 right-6 z-50 w-[220px] rounded-xl overflow-hidden" style={{ background: SURFACE.modalBg, border: `1px solid rgba(${GLASS_TINT},0.06)`, backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="p-4" style={{ borderBottom: `1px solid rgba(${GLASS_TINT},0.04)` }}>
              <span className="text-[13px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sharon</span>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>EdgeStar</span>
            </div>
            {/* Theme toggle */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid rgba(${GLASS_TINT},0.04)` }}>
              <span className="text-[11px]" style={{ color: TEXT.tertiary, fontFamily: "var(--font-body)" }}>Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                style={{
                  background: `rgba(${GLASS_TINT},0.04)`,
                  border: `1px solid rgba(${GLASS_TINT},0.06)`,
                }}
              >
                {themeMode === "dark" ? (
                  <>
                    <Moon className="w-3 h-3" style={{ color: TEXT.secondary }} />
                    <span className="text-[11px]" style={{ color: TEXT.secondary, fontFamily: "var(--font-body)" }}>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3" style={{ color: "var(--ce-role-edgepreneur)" }} />
                    <span className="text-[11px]" style={{ color: TEXT.secondary, fontFamily: "var(--font-body)" }}>Light</span>
                  </>
                )}
              </button>
            </div>

            {[
              { label: "Profile Settings", action: "settings" },
              { label: "Account", action: "account" },
              { label: "Help & Support", action: "help" },
              { label: "Sign Out", action: "signout" },
            ].map((item, i) => (
              <button key={i} onClick={() => {
                setProfileOpen(false);
                if (item.action === "signout" && onNavigate) onNavigate("landing");
                else if (item.action === "settings") { setInitialMessage("Help me update my profile settings"); setSophiaOpen(true); }
                else if (item.action === "account") { setInitialMessage("Show me my account details"); setSophiaOpen(true); }
                else if (item.action === "help") { setInitialMessage("I need help using CareerEdge"); setSophiaOpen(true); }
              }} className="w-full text-left px-4 py-3 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors text-[12px]" style={{ color: item.action === "signout" ? "var(--ce-status-error)" : TEXT.tertiary, fontFamily: "var(--font-body)", borderBottom: i < 3 ? `1px solid rgba(${GLASS_TINT},0.03)` : "none" }}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away for dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-[49]" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}

      {/* Sophia conversation overlay */}
      <SophiaAsk
        isOpen={sophiaOpen}
        onClose={handleClose}
        mode="stretch"
        initialMessage={initialMessage}
        onClearInitial={() => setInitialMessage(null)}
        onNavigate={(target) => {
          setSophiaOpen(false);
          setInitialMessage(null);
        }}
      />

      {/* Main content */}
      <main className="mt-14 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Greeting */}
          <motion.div
            className="pt-8 pb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
          >
            <h1 className="text-[22px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Good morning, Sharon
            </h1>
            <p className="text-[13px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              Phase 1 — 60% complete · 3 applications this week
            </p>
          </motion.div>

          {/* KPI row */}
          <div className="mb-5">
            <KPIRow kpis={KPIS} />
          </div>

          {/* Roadmap strip */}
          <div className="mb-5">
            <RoadmapStrip onNav={handleNavClick} />
          </div>

          {/* Two-column: Roadmap Todos + Activity left, Sophia/Jobs right */}
          <div className="grid grid-cols-[1fr_320px] gap-5">
            <div className="flex flex-col gap-5">
              <RoadmapTodos onNav={handleNavClick} onOpenTaskRoom={onOpenTaskRoom} />
              <ActivityWidget onNav={handleNavClick} />
            </div>
            <div className="flex flex-col gap-5">
              <SophiaInsightCard onSophia={handleChipClick} />
              <BuddyDashboardCard
                roleColor="var(--ce-role-edgestar)"
                roleRgb="var(--ce-role-edgestar-rgb)"
                onNavigate={handleNavClick}
                onSophia={handleChipClick}
                delay={0.3}
              />
              <TopJobsCompact onNav={handleNavClick} />
            </div>
          </div>

          {/* Quick access cards — surfaces discoverable from dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Schedule", desc: "2 sessions this week", icon: Calendar, target: "schedule" },
              { label: "Community", desc: "5 new posts today", icon: MessageSquare, target: "community" },
              { label: "Budget", desc: "$299 of $1,112 invested", icon: DollarSign, target: "budget" },
              { label: "Resources", desc: "3 recommended for you", icon: BookOpen, target: "resources" },
              { label: "Marketplace", desc: "12 opportunities matched", icon: ShoppingBag, target: "market" },
              { label: "Coaches", desc: "97% match: Alice Chen", icon: Users, target: "coaches" },
              { label: "Courses", desc: "1 course in progress", icon: BookOpen, target: "courses" },
              { label: "Productivity", desc: "5 tasks today", icon: Clock, target: "productivity" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.target}
                  onClick={() => onNavigate?.(card.target)}
                  className="flex items-start gap-3 p-4 rounded-xl cursor-pointer text-left transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
                  style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.04, duration: 0.3, ease: EASE }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${GLASS_TINT},0.06)` }}>
                    <Icon className="w-4 h-4" style={{ color: TEXT.secondary }} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: TEXT.primary }}>{card.label}</span>
                    <span className="text-[10px] block truncate" style={{ fontFamily: "var(--font-body)", color: TEXT.tertiary }}>{card.desc}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}