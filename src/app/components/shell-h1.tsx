/**
 * Shell + Dashboard H1 — "The Corridor"
 * 
 * Linear/Flora DNA. Ultra-minimal icon sidebar rail.
 * Sophia is NOT persistent — accessed via ⌘K or sidebar icon.
 * Maximum content area. Dense, professional, tool-like.
 * 
 * Lime appears ONLY on: active sidebar icon, EdgeGas indicator, achievements.
 * Everything else is the gray hierarchy.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Home, Compass, FileText, Search, Zap, MessageSquare,
  Settings, Bell, ChevronRight, Target, TrendingUp,
  Award, Check, Sparkles, ArrowUpRight, Clock,
  BookOpen, Users, BarChart3, Command,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Sidebar Rail ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "roadmap", icon: Compass, label: "Roadmap" },
  { id: "resume", icon: FileText, label: "Resume" },
  { id: "jobs", icon: Search, label: "Jobs" },
  { id: "prod", icon: Zap, label: "Productivity" },
  { id: "messages", icon: MessageSquare, label: "Messages", badge: 3 },
];

function SidebarRail({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.nav
      className="fixed left-0 top-0 bottom-0 w-[52px] z-40 flex flex-col items-center py-3"
      style={{
        background: "linear-gradient(180deg, #0D0F14 0%, #0A0C10 100%)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
      initial={{ x: -52 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Logo mark */}
      <motion.div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-6 cursor-pointer"
        style={{ background: "rgba(179,255,59,0.08)" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-4 h-4 text-[#B3FF3B]" />
      </motion.div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div key={item.id} className="relative">
              <motion.button
                onClick={() => onNav(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer relative"
                style={{
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  className="w-[18px] h-[18px]"
                  style={{ color: isActive ? "#B3FF3B" : "#6B7280" }}
                />
                {/* Active indicator — left bar */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full bg-[#B3FF3B]"
                    layoutId="sidebar-active"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#22D3EE] flex items-center justify-center">
                    <span className="text-[9px] text-[#08090C]" style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>{item.badge}</span>
                  </div>
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hovered === item.id && (
                  <motion.div
                    className="absolute left-[54px] top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 rounded-md whitespace-nowrap"
                    style={{
                      background: "#1A1D24",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sophia access */}
      <motion.button
        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer mb-1"
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setHovered("sophia")}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="relative">
          <SophiaMark size={20} glowing={false} />
        </div>
      </motion.button>

      {/* EdgeGas */}
      <div className="flex flex-col items-center gap-1.5 mt-1 mb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
          <Zap className="w-3 h-3 text-[#B3FF3B]" />
        </div>
        <span className="text-[10px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>45</span>
      </div>

      {/* Settings */}
      <motion.button
        className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
      >
        <Settings className="w-[16px] h-[16px] text-[#374151]" />
      </motion.button>
    </motion.nav>
  );
}

// ─── Header Bar ─────────────────────────────────────────────────────────────

function HeaderBar({ onCommandOpen }: { onCommandOpen: () => void }) {
  return (
    <motion.header
      className="fixed top-0 left-[52px] right-0 h-12 z-30 flex items-center justify-between px-5"
      style={{
        background: "rgba(10,12,16,0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
      }}
      initial={{ y: -48 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>Home</span>
        <span className="text-[#374151] text-[11px]">/</span>
        <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>Dashboard</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Command trigger */}
        <button
          onClick={onCommandOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="text-[12px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>Search or ask Sophia...</span>
          <div className="flex items-center gap-0.5 ml-4">
            <kbd className="text-[10px] text-[#374151] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>⌘</kbd>
            <kbd className="text-[10px] text-[#374151] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>K</kbd>
          </div>
        </button>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(255,255,255,0.03)" }}>
          <Bell className="w-4 h-4 text-[#6B7280]" />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#22D3EE]" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(179,255,59,0.1))", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[11px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>S</span>
        </div>

        {/* Role badge */}
        <div className="px-2 py-1 rounded-md" style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.1)" }}>
          <span className="text-[10px] text-[#B3FF3B] tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EDGESTAR</span>
        </div>
      </div>
    </motion.header>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, icon, accent, delay }: {
  label: string; value: string; sub: string; icon: React.ReactNode; accent?: "lime" | "cyan" | "neutral"; delay: number;
}) {
  const colors = {
    lime: { bg: "rgba(179,255,59,0.06)", border: "rgba(179,255,59,0.1)", icon: "#B3FF3B" },
    cyan: { bg: "rgba(34,211,238,0.06)", border: "rgba(34,211,238,0.1)", icon: "#22D3EE" },
    neutral: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)", icon: "#6B7280" },
  };
  const c = colors[accent || "neutral"];

  return (
    <motion.div
      className="rounded-xl p-4"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div style={{ color: c.icon }}>{icon}</div>
        </div>
        <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{label}</span>
      </div>
      <div className="text-[28px] tabular-nums text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{value}</div>
      <div className="text-[11px] text-[#6B7280] mt-1" style={{ fontFamily: "var(--font-body)" }}>{sub}</div>
    </motion.div>
  );
}

// ─── Roadmap Strip ──────────────────────────────────────────────────────────

function RoadmapStrip() {
  const phases = [
    { id: 1, title: "Discover & Position", weeks: "Weeks 1–3", status: "active", progress: 0.6 },
    { id: 2, title: "Build & Apply", weeks: "Weeks 4–7", status: "upcoming", progress: 0 },
    { id: 3, title: "Interview & Close", weeks: "Weeks 8–10", status: "upcoming", progress: 0 },
    { id: 4, title: "Transition & Grow", weeks: "Weeks 11–14", status: "upcoming", progress: 0 },
  ];

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Product Design Roadmap</span>
        </div>
        <button className="flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
          View full roadmap <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-2">
        {phases.map((phase) => (
          <div key={phase.id} className="flex-1">
            <div className="h-1.5 rounded-full mb-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              {phase.status === "active" && (
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #22D3EE, #B3FF3B)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress * 100}%` }}
                  transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
                />
              )}
            </div>
            <div className="flex items-center gap-1.5 mb-0.5">
              {phase.status === "active" ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" style={{ boxShadow: "0 0 6px rgba(34,211,238,0.4)" }} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
              )}
              <span className={`text-[12px] ${phase.status === "active" ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{phase.title}</span>
            </div>
            <span className="text-[10px] text-[#374151] ml-3" style={{ fontFamily: "var(--font-body)" }}>{phase.weeks}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Activity Feed ──────────────────────────────────────────────────────────

const ACTIVITIES = [
  { time: "2h ago", text: "Resume optimized — ATS score: 87", icon: <FileText className="w-3.5 h-3.5" />, color: "#22D3EE" },
  { time: "5h ago", text: "Applied to Product Designer at Figma", icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: "#B3FF3B" },
  { time: "Yesterday", text: "Completed milestone: Portfolio review", icon: <Check className="w-3.5 h-3.5" />, color: "#B3FF3B" },
  { time: "2 days ago", text: "New job match: UX Lead at Intercom", icon: <Search className="w-3.5 h-3.5" />, color: "#22D3EE" },
  { time: "3 days ago", text: "EdgeGuide session with Alice — 45 min", icon: <Users className="w-3.5 h-3.5" />, color: "#9CA3AF" },
  { time: "4 days ago", text: "Applied to Senior Designer at Vercel", icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: "#B3FF3B" },
];

function ActivityFeed() {
  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Recent Activity</span>
        <span className="text-[11px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>This week</span>
      </div>
      <div className="flex flex-col">
        {ACTIVITIES.map((a, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 py-2.5"
            style={{ borderBottom: i < ACTIVITIES.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.06, duration: 0.3, ease: EASE }}
          >
            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div style={{ color: a.color }}>{a.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{a.text}</span>
            </div>
            <span className="text-[11px] text-[#374151] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{a.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Sophia Insight + Quick Actions ─────────────────────────────────────────

function SophiaInsightCard() {
  return (
    <motion.div
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(34,211,238,0.04), rgba(179,255,59,0.02))",
        border: "1px solid rgba(34,211,238,0.08)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={20} glowing={false} />
        <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
      </div>
      <p className="text-[13px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
        Your resume improvements are paying off — 3x more responses this week. I'd start interview prep now. Figma's design challenge round is common.
      </p>
      <div className="flex gap-2 mt-3">
        <button className="text-[11px] text-[#22D3EE] px-2.5 py-1.5 rounded-md cursor-pointer" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.1)", fontFamily: "var(--font-body)" }}>
          Start interview prep
        </button>
        <button className="text-[11px] text-[#6B7280] px-2.5 py-1.5 rounded-md cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

function QuickActions() {
  const actions = [
    { label: "Optimize resume", icon: <FileText className="w-3.5 h-3.5" />, color: "#22D3EE" },
    { label: "Browse jobs", icon: <Search className="w-3.5 h-3.5" />, color: "#9CA3AF" },
    { label: "View roadmap", icon: <Compass className="w-3.5 h-3.5" />, color: "#9CA3AF" },
    { label: "Start interview prep", icon: <Target className="w-3.5 h-3.5" />, color: "#9CA3AF" },
  ];

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
    >
      <span className="text-[14px] text-[#E8E8ED] block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Quick Actions</span>
      <div className="flex flex-col gap-1.5">
        {actions.map((a, i) => (
          <button
            key={i}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors text-left"
          >
            <div style={{ color: a.color }}>{a.icon}</div>
            <span className="text-[13px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{a.label}</span>
            <ChevronRight className="w-3 h-3 text-[#374151] ml-auto" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Command Palette Overlay ────────────────────────────────────────────────

function CommandPalette({ onClose }: { onClose: () => void }) {
  const commands = [
    { section: "Recent", items: [
      { label: "Dashboard", icon: <Home className="w-4 h-4" />, sub: "Home" },
      { label: "Resume — Sharon_v3.pdf", icon: <FileText className="w-4 h-4" />, sub: "ResumeEdge" },
    ]},
    { section: "Navigate", items: [
      { label: "EdgePath Roadmap", icon: <Compass className="w-4 h-4" />, sub: "View your career plan" },
      { label: "EdgeMatch Jobs", icon: <Search className="w-4 h-4" />, sub: "23 new matches" },
      { label: "Messages", icon: <MessageSquare className="w-4 h-4" />, sub: "3 unread" },
    ]},
    { section: "Sophia Actions", items: [
      { label: "Optimize resume for Figma role", icon: <Sparkles className="w-4 h-4" />, sub: "ResumeEdge + Cover Letter" },
      { label: "Start interview prep", icon: <Target className="w-4 h-4" />, sub: "Design challenge format" },
      { label: "Check application status", icon: <BarChart3 className="w-4 h-4" />, sub: "12 active applications" },
    ]},
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(8,9,12,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          background: "#12141A",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
        }}
        initial={{ y: -8, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <SophiaMark size={18} glowing={false} />
          <input
            type="text"
            autoFocus
            placeholder="Search or ask Sophia anything..."
            className="flex-1 bg-transparent text-[14px] text-[#E8E8ED] placeholder:text-[#374151] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <kbd className="text-[10px] text-[#374151] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>ESC</kbd>
        </div>

        {/* Command list */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {commands.map((section) => (
            <div key={section.section} className="mb-1">
              <div className="px-4 py-1.5">
                <span className="text-[10px] tracking-wider text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{section.section.toUpperCase()}</span>
              </div>
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <div className="text-[#6B7280]">{item.icon}</div>
                  <div className="flex-1 text-left">
                    <span className="text-[13px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                    <span className="text-[11px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{item.sub}</span>
                  </div>
                  {section.section === "Sophia Actions" && <Sparkles className="w-3 h-3 text-[#22D3EE]" />}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>Type to search or ask Sophia</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>↑↓ navigate</span>
            <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>↵ select</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Shell H1 ─────────────────────────────────────────────────────────

export function ShellH1() {
  const [activeNav, setActiveNav] = useState("home");
  const [showCommand, setShowCommand] = useState(false);

  // ⌘K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommand(prev => !prev);
      }
      if (e.key === "Escape") setShowCommand(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0A0C10" }}>
      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
      }} />

      <SidebarRail active={activeNav} onNav={setActiveNav} />
      <HeaderBar onCommandOpen={() => setShowCommand(true)} />

      {/* Main content */}
      <main className="ml-[52px] mt-12 p-6">
        {/* Greeting */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
        >
          <h1 className="text-[22px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Good morning, Sharon
          </h1>
          <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
            Phase 1 — 60% complete · 3 applications this week
          </p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <KPICard label="Career Score" value="72" sub="+4 this month" icon={<Target className="w-3.5 h-3.5" />} accent="cyan" delay={0.25} />
          <KPICard label="ATS Score" value="87" sub="Resume v3 · Optimized" icon={<FileText className="w-3.5 h-3.5" />} accent="lime" delay={0.3} />
          <KPICard label="Applications" value="12" sub="+3 this week" icon={<ArrowUpRight className="w-3.5 h-3.5" />} accent="neutral" delay={0.35} />
        </div>

        {/* Roadmap strip */}
        <div className="mb-4">
          <RoadmapStrip />
        </div>

        {/* Two-column: Activity + Sophia/Actions */}
        <div className="grid grid-cols-[1fr_340px] gap-4">
          <ActivityFeed />
          <div className="flex flex-col gap-4">
            <SophiaInsightCard />
            <QuickActions />
          </div>
        </div>
      </main>

      {/* Command palette */}
      <AnimatePresence>
        {showCommand && <CommandPalette onClose={() => setShowCommand(false)} />}
      </AnimatePresence>
    </div>
  );
}
