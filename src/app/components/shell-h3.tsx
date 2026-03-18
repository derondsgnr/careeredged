/**
 * Shell + Dashboard H3 — "Mission Control"
 * 
 * SpaceX/Quanta DNA. Full expanded sidebar with labels.
 * Dense information grid. Sophia bar at bottom as intelligence layer.
 * Green gradient brand signature header. Everything visible at once.
 * The user sees their entire career state at a glance.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Home, Compass, FileText, Search, Zap, MessageSquare,
  Settings, Bell, ChevronRight, Target, TrendingUp,
  Check, Sparkles, ArrowUpRight, ArrowRight,
  BookOpen, Users, BarChart3, Calendar,
  Briefcase, MapPin, Building2, Star,
  Shield, Clock, Activity, ChevronDown,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Full Sidebar ───────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  {
    label: "Main",
    items: [
      { id: "home", icon: Home, label: "Home", active: true },
      { id: "roadmap", icon: Compass, label: "EdgePath" },
      { id: "resume", icon: FileText, label: "ResumeEdge" },
      { id: "jobs", icon: Search, label: "EdgeMatch", badge: 23 },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "prod", icon: Zap, label: "EdgeProd" },
      { id: "messages", icon: MessageSquare, label: "Messages", badge: 3 },
      { id: "calendar", icon: Calendar, label: "Schedule" },
    ],
  },
];

function FullSidebar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 w-[220px] z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0D0F14 0%, #0A0C10 100%)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
      initial={{ x: -220 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
          <Sparkles className="w-4 h-4 text-[#B3FF3B]" />
        </div>
        <div>
          <span className="text-[14px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CareerEdge</span>
          <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>EdgeStar</span>
        </div>
      </div>

      {/* Role badge */}
      <div className="mx-4 mt-4 mb-3 flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(179,255,59,0.04))", border: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(179,255,59,0.1))", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[11px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>S</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] text-[#E8E8ED] block truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sharon</span>
          <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Product Design · Early</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#374151]" />
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="px-2 py-1.5 mb-1">
              <span className="text-[10px] tracking-wider text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{section.label.toUpperCase()}</span>
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all mb-0.5 ${isActive ? "" : "hover:bg-[rgba(255,255,255,0.03)]"}`}
                  style={isActive ? { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)" } : undefined}
                >
                  <Icon className="w-[16px] h-[16px]" style={{ color: isActive ? "#B3FF3B" : "#6B7280" }} />
                  <span className={`text-[13px] flex-1 text-left ${isActive ? "text-[#E8E8ED]" : "text-[#9CA3AF]"}`} style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md tabular-nums" style={{
                      background: "rgba(34,211,238,0.08)",
                      color: "#22D3EE",
                      fontFamily: "var(--font-body)",
                    }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* EdgeGas */}
      <div className="px-4 py-3 mx-3 mb-2 rounded-xl" style={{ background: "rgba(179,255,59,0.04)", border: "1px solid rgba(179,255,59,0.08)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#B3FF3B]" />
            <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>EdgeGas</span>
          </div>
          <span className="text-[13px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>45</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="h-full rounded-full w-[45%]" style={{ background: "linear-gradient(90deg, #B3FF3B, rgba(179,255,59,0.5))" }} />
        </div>
        <span className="text-[10px] text-[#374151] mt-1 block" style={{ fontFamily: "var(--font-body)" }}>+15 this week · Upgrade for more</span>
      </div>

      {/* Settings */}
      <div className="px-3 pb-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors">
          <Settings className="w-[16px] h-[16px] text-[#374151]" />
          <span className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Settings</span>
        </button>
      </div>
    </motion.aside>
  );
}

// ─── Header with Brand Gradient ─────────────────────────────────────────────

function GradientHeader() {
  return (
    <motion.header
      className="fixed top-0 left-[220px] right-0 z-30"
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Gradient brand strip */}
      <div className="relative h-[120px] overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(4,44,1,0.3) 0%, rgba(34,211,238,0.08) 50%, rgba(179,255,59,0.06) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 40%, #0A0C10 100%)",
        }} />

        {/* Content overlay */}
        <div className="relative h-full flex items-end justify-between px-6 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-[#22D3EE] tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PHASE 1 OF 4</span>
              <span className="text-[#374151]">·</span>
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Product Design Roadmap</span>
            </div>
            <h1 className="text-[22px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Good morning, Sharon</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Search className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-[12px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>Search...</span>
              <div className="flex items-center gap-0.5 ml-6">
                <kbd className="text-[9px] text-[#374151] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", fontFamily: "var(--font-body)" }}>⌘K</kbd>
              </div>
            </button>

            {/* Notifications */}
            <button className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Bell className="w-4 h-4 text-[#6B7280]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22D3EE]" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// ─── KPI Cards Row ──────────────────────────────────────────────────────────

function KPIRow() {
  const kpis = [
    {
      label: "Career Score",
      value: "72",
      trend: "+4",
      icon: <Target className="w-4 h-4" />,
      color: "#22D3EE",
      gauge: 0.72,
    },
    {
      label: "Applications",
      value: "12",
      trend: "+3 this week",
      icon: <ArrowUpRight className="w-4 h-4" />,
      color: "#9CA3AF",
      gauge: null,
    },
    {
      label: "ATS Score",
      value: "87",
      trend: "Resume v3",
      icon: <FileText className="w-4 h-4" />,
      color: "#B3FF3B",
      gauge: 0.87,
    },
    {
      label: "EdgeGas",
      value: "45",
      trend: "+15 earned",
      icon: <Zap className="w-4 h-4" />,
      color: "#B3FF3B",
      gauge: null,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {kpis.map((kpi, i) => (
        <motion.div
          key={i}
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}10` }}>
              <div style={{ color: kpi.color }}>{kpi.icon}</div>
            </div>
            {kpi.gauge !== null && (
              <svg width="36" height="20" viewBox="0 0 36 20">
                <path d="M4 18 A14 14 0 0 1 32 18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeLinecap="round" />
                <motion.path
                  d="M4 18 A14 14 0 0 1 32 18"
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
          <div className="text-[24px] text-[#E8E8ED] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{kpi.value}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{kpi.label}</span>
            <span className="text-[10px] text-[#B3FF3B]" style={{ fontFamily: "var(--font-body)" }}>{kpi.trend}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Roadmap Timeline ───────────────────────────────────────────────────────

function RoadmapTimeline() {
  const milestones = [
    { label: "Resume audit", status: "done", date: "Mar 2" },
    { label: "Portfolio review", status: "done", date: "Mar 5" },
    { label: "Target companies", status: "done", date: "Mar 8" },
    { label: "LinkedIn optimization", status: "current", date: "Mar 13" },
    { label: "Networking outreach", status: "upcoming", date: "Mar 17" },
  ];

  return (
    <motion.div
      className="rounded-xl p-5 h-full"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Phase 1: Discover & Position</span>
        </div>
        <button className="flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
          Full roadmap <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Phase bar */}
      <div className="flex gap-1.5 mb-5">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="flex-1 h-1 rounded-full" style={{ background: p === 1 ? "linear-gradient(90deg, #22D3EE, rgba(34,211,238,0.3))" : "rgba(255,255,255,0.04)" }} />
        ))}
      </div>

      {/* Timeline */}
      <div className="flex flex-col">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-start gap-3 relative">
            {/* Vertical line */}
            {i < milestones.length - 1 && (
              <div className="absolute left-[11px] top-[20px] bottom-0 w-[1px]" style={{ background: m.status === "done" ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)" }} />
            )}
            {/* Node */}
            <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
              m.status === "done" ? "" : m.status === "current" ? "" : ""
            }`} style={{
              background: m.status === "done" ? "rgba(34,211,238,0.1)" : m.status === "current" ? "#0A0C10" : "#0A0C10",
              border: `1.5px solid ${m.status === "done" ? "rgba(34,211,238,0.3)" : m.status === "current" ? "#22D3EE" : "rgba(255,255,255,0.06)"}`,
              boxShadow: m.status === "current" ? "0 0 8px rgba(34,211,238,0.2)" : "none",
            }}>
              {m.status === "done" && <Check className="w-3 h-3 text-[#22D3EE]" />}
              {m.status === "current" && <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />}
            </div>
            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${m.status === "upcoming" ? "text-[#6B7280]" : "text-[#E8E8ED]"}`} style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
                <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{m.date}</span>
              </div>
              {m.status === "current" && (
                <motion.div
                  className="flex items-center gap-1.5 mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Sparkles className="w-3 h-3 text-[#22D3EE]" />
                  <span className="text-[11px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}>Due today — Sophia can help</span>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Activity + Upcoming ────────────────────────────────────────────────────

function ActivityAndUpcoming() {
  const [tab, setTab] = useState<"activity" | "upcoming">("activity");

  const activities = [
    { time: "2h", text: "Resume optimized — 87 ATS", icon: <FileText className="w-3 h-3" />, color: "#22D3EE" },
    { time: "5h", text: "Applied to Figma", icon: <ArrowUpRight className="w-3 h-3" />, color: "#B3FF3B" },
    { time: "1d", text: "Portfolio review completed", icon: <Check className="w-3 h-3" />, color: "#B3FF3B" },
    { time: "2d", text: "New match: Intercom UX Lead", icon: <Search className="w-3 h-3" />, color: "#22D3EE" },
    { time: "3d", text: "Session with Alice (EdgeGuide)", icon: <Users className="w-3 h-3" />, color: "#9CA3AF" },
  ];

  const upcoming = [
    { date: "Today", text: "LinkedIn optimization due", icon: <Target className="w-3 h-3" />, color: "#22D3EE" },
    { date: "Fri", text: "EdgeGuide check-in with Alice", icon: <Users className="w-3 h-3" />, color: "#9CA3AF" },
    { date: "Mon", text: "Networking outreach starts", icon: <Briefcase className="w-3 h-3" />, color: "#6B7280" },
  ];

  return (
    <motion.div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4, ease: EASE }}
    >
      {/* Tab toggle */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg mb-4" style={{ background: "rgba(255,255,255,0.03)" }}>
        {(["activity", "upcoming"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative flex-1 py-1.5 rounded-md cursor-pointer text-center"
          >
            {tab === t && (
              <motion.div
                className="absolute inset-0 rounded-md"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                layoutId="activity-tab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 text-[12px] ${tab === t ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-body)" }}>
              {t === "activity" ? "Activity" : "Upcoming"}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {tab === "activity" ? (
            <motion.div key="activity" className="flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < activities.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ color: a.color }}>{a.icon}</div>
                  </div>
                  <span className="text-[12px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>{a.text}</span>
                  <span className="text-[10px] text-[#374151] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{a.time}</span>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="upcoming" className="flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < upcoming.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ color: u.color }}>{u.icon}</div>
                  </div>
                  <span className="text-[12px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>{u.text}</span>
                  <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{u.date}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Sophia Insight (full width) ────────────────────────────────────────────

function SophiaInsightBanner() {
  return (
    <motion.div
      className="rounded-xl px-5 py-4 flex items-center gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(34,211,238,0.05), rgba(179,255,59,0.02))",
        border: "1px solid rgba(34,211,238,0.08)",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.4, ease: EASE }}
    >
      <SophiaMark size={24} glowing={false} />
      <p className="text-[13px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>
        Your resume improvements are paying off — 3x more responses this week. I'd start interview prep now. Figma's design challenge round is common for product designers.
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button className="text-[11px] text-[#22D3EE] px-3 py-1.5 rounded-md cursor-pointer" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.1)", fontFamily: "var(--font-body)" }}>
          Start prep
        </button>
        <button className="text-[11px] text-[#6B7280] px-3 py-1.5 rounded-md cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

// ─── Sophia Bar (Bottom) ────────────────────────────────────────────────────

function SophiaBottomBar() {
  return (
    <motion.div
      className="fixed bottom-0 left-[220px] right-0 z-30 flex items-center gap-4 px-5 h-14"
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
          3 new job matches since yesterday
        </span>
        <div className="flex gap-2">
          <button className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
            View matches
          </button>
          <button className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
            Open roadmap
          </button>
        </div>
      </div>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)" }}>
        <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
        <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia</span>
      </button>
    </motion.div>
  );
}

// ─── Top Jobs Preview ───────────────────────────────────────────────────────

function TopJobsPreview() {
  const jobs = [
    { title: "Product Designer", company: "Figma", match: 92, location: "SF" },
    { title: "UX Lead", company: "Intercom", match: 87, location: "Remote" },
    { title: "Design Manager", company: "Vercel", match: 84, location: "Remote" },
  ];

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Top Matches</span>
        </div>
        <button className="text-[11px] text-[#6B7280] hover:text-[#9CA3AF] cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
          View all 23 →
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {jobs.map((job, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Building2 className="w-4 h-4 text-[#6B7280]" />
            </div>
            <div className="flex-1">
              <span className="text-[13px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
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

// ─── Main Shell H3 ─────────────────────────────────────────────────────────

export function ShellH3() {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0A0C10" }}>
      <FullSidebar active={activeNav} onNav={setActiveNav} />
      <GradientHeader />
      <SophiaBottomBar />

      {/* Main content */}
      <main className="ml-[220px] mt-[120px] pb-20 px-6">
        {/* KPI row */}
        <div className="mb-4">
          <KPIRow />
        </div>

        {/* Two-column main area */}
        <div className="grid grid-cols-[1fr_340px] gap-4 mb-4">
          <RoadmapTimeline />
          <ActivityAndUpcoming />
        </div>

        {/* Sophia insight banner */}
        <div className="mb-4">
          <SophiaInsightBanner />
        </div>

        {/* Bottom: Top Jobs */}
        <TopJobsPreview />
      </main>
    </div>
  );
}
