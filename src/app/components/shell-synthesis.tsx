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

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import { SophiaAsk } from "./sophia-ask";
import { SharedTopNav } from "./role-shell";
import {
  Zap, FileText, Search, Compass,
  ChevronRight, Target, BarChart3,
  Check, Sparkles, ArrowUpRight, ArrowRight,
  Users, Calendar, Building2, Star,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── KPI Cards with Gauges (from H3) ────────────────────────────────────────

function KPIRow() {
  const kpis = [
    { label: "Career Score", value: "72", trend: "+4", icon: <Target className="w-4 h-4" />, color: "#22D3EE", gauge: 0.72 },
    { label: "Applications", value: "12", trend: "+3 this week", icon: <ArrowUpRight className="w-4 h-4" />, color: "#9CA3AF", gauge: null },
    { label: "ATS Score", value: "87", trend: "Resume v3", icon: <FileText className="w-4 h-4" />, color: "#B3FF3B", gauge: 0.87 },
    { label: "EdgeGas", value: "45", trend: "+15 earned", icon: <Zap className="w-4 h-4" />, color: "#B3FF3B", gauge: null },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
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
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Product Design Roadmap</span>
        </div>
        <button onClick={() => onNav("roadmap")} className="flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
          View full roadmap <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-3">
        {phases.map((phase) => (
          <div key={phase.id} className="flex-1 cursor-pointer" onClick={() => onNav("roadmap")}>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-2.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              {phase.status === "active" && (
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #22D3EE, #B3FF3B)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress * 100}%` }}
                  transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
                />
              )}
            </div>
            {/* Phase info */}
            <div className="flex items-center gap-1.5 mb-0.5">
              {phase.status === "active" ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" style={{ boxShadow: "0 0 6px rgba(34,211,238,0.4)" }} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
              )}
              <span className={`text-[12px] ${phase.status === "active" ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {phase.title}
              </span>
            </div>
            <span className="text-[10px] text-[#374151] ml-3" style={{ fontFamily: "var(--font-body)" }}>{phase.weeks}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Activity/Upcoming Tabbed Widget (from H3) ─────────────────────────────

function ActivityWidget({ onNav }: { onNav?: (id: string) => void }) {
  const [tab, setTab] = useState<"activity" | "upcoming">("activity");

  const activities = [
    { time: "2h ago", text: "Resume optimized — ATS score: 87", icon: <FileText className="w-3 h-3" />, color: "#22D3EE" },
    { time: "5h ago", text: "Applied to Product Designer at Figma", icon: <ArrowUpRight className="w-3 h-3" />, color: "#B3FF3B" },
    { time: "Yesterday", text: "Completed milestone: Portfolio review", icon: <Check className="w-3 h-3" />, color: "#B3FF3B" },
    { time: "2 days ago", text: "New job match: UX Lead at Intercom", icon: <Search className="w-3 h-3" />, color: "#22D3EE" },
    { time: "3 days ago", text: "Session with Alice Chen — Career Coaching", icon: <Users className="w-3 h-3" />, color: "#9CA3AF", target: "sessions" },
  ];

  const upcoming = [
    { date: "Today 2:00 PM", text: "Session with Alice Chen — Career Coaching", icon: <Calendar className="w-3 h-3" />, color: "#B3FF3B", target: "sessions" },
    { date: "Friday", text: "LinkedIn optimization due", icon: <Target className="w-3 h-3" />, color: "#22D3EE" },
    { date: "Monday", text: "Mock interview with James Okafor", icon: <Users className="w-3 h-3" />, color: "#8B5CF6", target: "sessions" },
  ];

  const items = tab === "activity" ? activities : upcoming;

  return (
    <motion.div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4, ease: EASE }}
    >
      {/* Tab toggle */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg mb-4 self-start" style={{ background: "rgba(255,255,255,0.03)" }}>
        {(["activity", "upcoming"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-3 py-1.5 rounded-md cursor-pointer"
          >
            {tab === t && (
              <motion.div
                className="absolute inset-0 rounded-md"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                layoutId="synth-activity-tab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 text-[12px] ${tab === t ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-body)" }}>
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
                className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-[rgba(255,255,255,0.01)] rounded-lg px-1 -mx-1 transition-colors"
                style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                onClick={() => (item as any).target && onNav?.((item as any).target)}
              >
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ color: (item as any).color }}>{(item as any).icon}</div>
                </div>
                <span className="text-[12px] text-[#9CA3AF] flex-1 min-w-0" style={{ fontFamily: "var(--font-body)" }}>{(item as any).text}</span>
                <span className="text-[10px] text-[#374151] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
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

// ─── Roadmap Todos (from H3 timeline, reframed as checklist) ────────────────

function RoadmapTodos({ onNav, onOpenTaskRoom }: { onNav: (id: string) => void; onOpenTaskRoom?: (milestoneId: string) => void }) {
  const milestones = [
    { id: "m-resume-audit", label: "Resume audit", status: "done" as const, date: "Mar 2" },
    { id: "m-portfolio-review", label: "Portfolio review", status: "done" as const, date: "Mar 5" },
    { id: "m-target-companies", label: "Target companies", status: "done" as const, date: "Mar 8" },
    { id: "m-linkedin-optimization", label: "LinkedIn optimization", status: "current" as const, date: "Today" },
    { id: "m-networking-outreach", label: "Networking outreach", status: "upcoming" as const, date: "Mar 17" },
    { id: "m-first-applications", label: "First applications", status: "upcoming" as const, date: "Mar 20" },
  ];

  return (
    <motion.div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Phase 1 Milestones</span>
        </div>
        <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>3 of 6</span>
      </div>

      {/* Phase progress mini-bar */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="flex-1 h-1 rounded-full" style={{ background: p === 1 ? "linear-gradient(90deg, #22D3EE, rgba(34,211,238,0.3))" : "rgba(255,255,255,0.04)" }} />
        ))}
      </div>

      {/* Timeline */}
      <div className="flex flex-col flex-1">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-start gap-2.5 relative cursor-pointer" onClick={() => {
            if ((m.status === "current" || m.status === "upcoming") && onOpenTaskRoom) {
              onOpenTaskRoom(m.id);
            } else {
              onNav("roadmap");
            }
          }}>
            {/* Vertical connector */}
            {i < milestones.length - 1 && (
              <div className="absolute left-[9px] top-[18px] bottom-0 w-[1px]" style={{ background: m.status === "done" ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)" }} />
            )}
            {/* Node */}
            <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5" style={{
              background: m.status === "done" ? "rgba(34,211,238,0.1)" : "#0A0C10",
              border: `1.5px solid ${m.status === "done" ? "rgba(34,211,238,0.25)" : m.status === "current" ? "#22D3EE" : "rgba(255,255,255,0.06)"}`,
              boxShadow: m.status === "current" ? "0 0 8px rgba(34,211,238,0.2)" : "none",
            }}>
              {m.status === "done" && <Check className="w-2.5 h-2.5 text-[#22D3EE]" />}
              {m.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />}
            </div>
            {/* Content */}
            <div className="flex-1 pb-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[12px] truncate ${m.status === "upcoming" ? "text-[#6B7280]" : m.status === "done" ? "text-[#9CA3AF]" : "text-[#E8E8ED]"}`} style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
                <span className="text-[10px] text-[#374151] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{m.date}</span>
              </div>
              {m.status === "current" && (
                <motion.div
                  className="flex items-center gap-1 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#22D3EE]" />
                  <span className="text-[10px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}>Due today · Open task room →</span>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Sophia Insight + Next Action (right column) ────────────────────────────

function SophiaInsightCard({ onSophia }: { onSophia: (msg: string) => void }) {
  return (
    <motion.div
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(145deg, rgba(34,211,238,0.05), rgba(255,255,255,0.02) 50%, rgba(179,255,59,0.02))",
        border: "1px solid rgba(34,211,238,0.08)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={18} glowing={false} />
        <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
      </div>
      <p className="text-[13px] text-[#9CA3AF] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
        Your resume improvements are paying off — 3x more responses this week. I'd start interview prep now. Figma's design challenge round is common.
      </p>
      <button
        onClick={() => onSophia("Start interview prep")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px]"
        style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(179,255,59,0.05))",
          border: "1px solid rgba(34,211,238,0.12)",
          color: "#E8E8ED",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" /> Start interview prep
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
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-[#B3FF3B]" />
          <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Top Matches</span>
        </div>
        <button onClick={() => onNav("jobs")} className="text-[11px] text-[#6B7280] hover:text-[#9CA3AF] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
          View all 23 →
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {jobs.map((job, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors" style={{ border: "1px solid rgba(255,255,255,0.03)" }} onClick={() => onNav("jobs")}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[#E8E8ED] block truncate" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{job.company} · {job.location}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(179,255,59,0.06)" }}>
              <span className="text-[10px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Sophia Bottom Bar (from H3) ────────────────────────────────────────────

function SophiaBottomBar({ onAskSophia, onChipClick, onNav }: { onAskSophia: () => void; onChipClick: (msg: string) => void; onNav?: (id: string) => void }) {
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
          Session with Alice today at 2PM · 3 new job matches
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onNav?.("sessions")}
            className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}
          >
            View session
          </button>
          <button
            onClick={() => onNav?.("jobs")}
            className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}
          >
            View matches
          </button>
          <button
            onClick={() => onChipClick("Open roadmap")}
            className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}
          >
            Open roadmap
          </button>
        </div>
      </div>
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

// ─── Main ───────────────────────────────────────────────────────────────────

type NavigateFn = (target: string) => void;

export function ShellSynthesis({ onNavigate, onOpenTaskRoom }: { onNavigate?: NavigateFn; onOpenTaskRoom?: (milestoneId: string) => void }) {
  const [sophiaOpen, setSophiaOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
      <SophiaForwardBackground />
      <SharedTopNav
        role="edgestar"
        onOpenSophia={(msg) => { setInitialMessage(msg); setSophiaOpen(true); }}
        onNotifClick={() => { setProfileOpen(false); setNotifOpen(!notifOpen); }}
        onProfileClick={() => { setNotifOpen(false); setProfileOpen(!profileOpen); }}
      />
      <SophiaBottomBar onAskSophia={handleAskSophia} onChipClick={handleChipClick} onNav={handleNavClick} />

      {/* Notification Panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div className="fixed top-14 right-6 z-50 w-[340px] rounded-xl overflow-hidden" style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Notifications</span>
              <button onClick={() => setNotifOpen(false)} className="text-[11px] text-[#22D3EE] cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Mark all read</button>
            </div>
            {[
              { title: "New match: Product Designer at Figma", time: "2 min ago", unread: true, target: "jobs" },
              { title: "Resume ATS score improved to 87", time: "2 hrs ago", unread: true, target: "resume" },
              { title: "Alice sent a message", time: "5 hrs ago", unread: false, target: "messages" },
              { title: "Sophia has a new insight for you", time: "Yesterday", unread: false, target: "sophia" },
            ].map((n, i) => (
              <button key={i} onClick={() => { setNotifOpen(false); if (n.target === "sophia") { setInitialMessage("What's the new insight you have for me?"); setSophiaOpen(true); } else if (onNavigate) { onNavigate(n.target); } }} className="w-full flex items-start gap-3 p-4 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
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
              <span className="text-[13px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sharon</span>
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>EdgeStar</span>
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
              }} className="w-full text-left px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors text-[12px]" style={{ color: item.action === "signout" ? "#EF4444" : "#9CA3AF", fontFamily: "var(--font-body)", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
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
            <h1 className="text-[22px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Good morning, Sharon
            </h1>
            <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
              Phase 1 — 60% complete · 3 applications this week
            </p>
          </motion.div>

          {/* KPI row */}
          <div className="mb-5">
            <KPIRow />
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
              <TopJobsCompact onNav={handleNavClick} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}