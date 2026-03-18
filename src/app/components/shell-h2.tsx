/**
 * Shell + Dashboard H2 — "Sophia Forward"
 * 
 * Claude/Manus DNA. NO sidebar. Horizontal nav pills at top.
 * Sophia bar at bottom — persistent, context-aware, suggestion chips.
 * Dashboard is Sophia-curated: generous whitespace, fewer elements, each with presence.
 * The product feels like a smart companion, not a tool belt.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Home, Compass, FileText, Search, MessageSquare,
  Bell, ChevronRight, Target, TrendingUp,
  Check, Sparkles, ArrowUpRight, Zap,
  Briefcase, Clock, ArrowRight, MapPin, Building2,
  Star, ChevronDown,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Top Navigation ─────────────────────────────────────────────────────────

const NAV_PILLS = [
  { id: "home", label: "Home", icon: Home },
  { id: "roadmap", label: "Roadmap", icon: Compass },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Search, badge: 23 },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
];

function TopNav({ active, onNav }: { active: string; onNav: (id: string) => void }) {
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
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
          <Sparkles className="w-3.5 h-3.5 text-[#B3FF3B]" />
        </div>
        <span className="text-[14px] text-[#E8E8ED] tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CareerEdge</span>
      </div>

      {/* Nav pills — centered */}
      <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        {NAV_PILLS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  layoutId="nav-pill-active"
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

      {/* Right — avatar + EdgeGas */}
      <div className="flex items-center gap-3">
        {/* EdgeGas pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.1)" }}>
          <Zap className="w-3 h-3 text-[#B3FF3B]" />
          <span className="text-[11px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>45</span>
        </div>

        {/* Notifications */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(255,255,255,0.03)" }}>
          <Bell className="w-4 h-4 text-[#6B7280]" />
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#22D3EE]" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(179,255,59,0.1))", border: "1.5px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>S</span>
        </div>
      </div>
    </motion.header>
  );
}

// ─── Sophia Bar (Bottom) ────────────────────────────────────────────────────

function SophiaBar() {
  const [focused, setFocused] = useState(false);

  const chips = [
    "Start interview prep",
    "View job matches",
    "Continue roadmap",
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
    >
      {/* Gradient fade */}
      <div className="h-8 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(8,9,12,0.95), transparent)" }} />
      
      <div className="px-6 pb-5" style={{ background: "rgba(8,9,12,0.95)" }}>
        <div className="max-w-[700px] mx-auto">
          {/* Context line */}
          <motion.div
            className="flex items-center gap-2 mb-3 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <SophiaMark size={16} glowing={false} />
            <p className="text-[13px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>
              You've been applying but haven't prepped for interviews yet — Figma's design challenge is common.
            </p>
          </motion.div>

          {/* Suggestion chips */}
          <motion.div
            className="flex gap-2 mb-3 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {chips.map((chip, i) => (
              <button
                key={i}
                className="text-[12px] px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                style={{
                  background: i === 0 ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === 0 ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.06)"}`,
                  color: i === 0 ? "#22D3EE" : "#6B7280",
                  fontFamily: "var(--font-body)",
                }}
              >
                {chip}
              </button>
            ))}
          </motion.div>

          {/* Input bar */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
            style={{
              background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${focused ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.06)"}`,
              boxShadow: focused ? "0 0 20px rgba(34,211,238,0.04)" : "none",
            }}
          >
            <SophiaMark size={20} glowing={false} />
            <input
              type="text"
              placeholder="Ask Sophia anything..."
              className="flex-1 bg-transparent text-[14px] text-[#E8E8ED] placeholder:text-[#374151] focus:outline-none"
              style={{ fontFamily: "var(--font-body)" }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "rgba(34,211,238,0.1)" }}>
              <ArrowRight className="w-4 h-4 text-[#22D3EE]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hero Roadmap Card ──────────────────────────────────────────────────────

function HeroRoadmapCard() {
  const milestones = [
    { label: "Resume audit", done: true },
    { label: "Portfolio review", done: true },
    { label: "Target companies list", done: true },
    { label: "LinkedIn optimization", done: false },
    { label: "Networking outreach", done: false },
  ];

  return (
    <motion.div
      className="rounded-2xl p-6 h-full"
      style={{
        background: "linear-gradient(165deg, rgba(34,211,238,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(179,255,59,0.03) 100%)",
        border: "1px solid rgba(34,211,238,0.08)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#22D3EE]" style={{ boxShadow: "0 0 8px rgba(34,211,238,0.4)" }} />
            <span className="text-[11px] text-[#22D3EE] tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PHASE 1 — ACTIVE</span>
          </div>
          <h2 className="text-[18px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Discover & Position</h2>
          <p className="text-[13px] text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>Product Design Roadmap · Weeks 1–3</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-[#9CA3AF] cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
          Full roadmap <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>3 of 5 milestones</span>
          <span className="text-[12px] text-[#E8E8ED] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>60%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #22D3EE, #B3FF3B)" }}
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="flex flex-col gap-2">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${m.done ? "bg-[rgba(34,211,238,0.1)]" : "bg-[rgba(255,255,255,0.03)]"}`} style={{ border: `1px solid ${m.done ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.06)"}` }}>
              {m.done && <Check className="w-3 h-3 text-[#22D3EE]" />}
            </div>
            <span className={`text-[13px] ${m.done ? "text-[#9CA3AF]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Next Action Card ───────────────────────────────────────────────────────

function NextActionCard() {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={16} glowing={false} />
        <span className="text-[11px] text-[#22D3EE] tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA SUGGESTS</span>
      </div>
      <h3 className="text-[15px] text-[#E8E8ED] mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Optimize your LinkedIn</h3>
      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
        Your resume scored 87 ATS — let's apply the same keywords to your LinkedIn headline and summary. Takes about 10 minutes.
      </p>
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px]"
        style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(179,255,59,0.06))",
          border: "1px solid rgba(34,211,238,0.15)",
          color: "#E8E8ED",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" /> Start optimization
      </button>
    </motion.div>
  );
}

// ─── Job Match Card ─────────────────────────────────────────────────────────

function TopJobMatchCard() {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-[#6B7280] tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>TOP MATCH</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(179,255,59,0.08)", border: "1px solid rgba(179,255,59,0.12)" }}>
          <Star className="w-2.5 h-2.5 text-[#B3FF3B]" />
          <span className="text-[10px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>92%</span>
        </div>
      </div>

      <h3 className="text-[15px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Product Designer</h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-[#6B7280]" />
          <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>Figma</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#6B7280]" />
          <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>San Francisco</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] px-2 py-0.5 rounded-md text-[#9CA3AF]" style={{ background: "rgba(255,255,255,0.04)", fontFamily: "var(--font-body)" }}>$140–180k</span>
        <span className="text-[11px] px-2 py-0.5 rounded-md text-[#9CA3AF]" style={{ background: "rgba(255,255,255,0.04)", fontFamily: "var(--font-body)" }}>Full-time</span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-[12px] text-[#E8E8ED]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }}>
          View details
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-[12px] text-[#08090C]" style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Quick apply
        </button>
      </div>
    </motion.div>
  );
}

// ─── Stats Row ──────────────────────────────────────────────────────────────

function StatsRow() {
  const stats = [
    { label: "Career Score", value: "72", trend: "+4", icon: <Target className="w-3.5 h-3.5 text-[#22D3EE]" /> },
    { label: "ATS Score", value: "87", trend: "+12", icon: <FileText className="w-3.5 h-3.5 text-[#B3FF3B]" /> },
    { label: "Applications", value: "12", trend: "+3", icon: <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF]" /> },
    { label: "Job Matches", value: "23", trend: "new", icon: <Search className="w-3.5 h-3.5 text-[#22D3EE]" /> },
  ];

  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.06, duration: 0.35, ease: EASE }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
            {s.icon}
          </div>
          <div>
            <div className="text-[18px] text-[#E8E8ED] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.value}</div>
            <div className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{s.label}</div>
          </div>
          <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-md text-[#B3FF3B]" style={{ background: "rgba(179,255,59,0.06)", fontFamily: "var(--font-body)" }}>{s.trend}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Main Shell H2 ─────────────────────────────────────────────────────────

export function ShellH2() {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
      {/* Ambient gradient wash */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(34,211,238,0.03) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 60%, rgba(179,255,59,0.02) 0%, transparent 50%)",
      }} />

      <TopNav active={activeNav} onNav={setActiveNav} />

      {/* Main content — centered, generous max-width */}
      <main className="mt-14 pb-48 px-6">
        <div className="max-w-[1080px] mx-auto">
          {/* Greeting */}
          <motion.div
            className="pt-10 pb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-3">
              <SophiaMark size={32} glowing={false} />
              <div>
                <h1 className="text-[24px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Good morning, Sharon
                </h1>
                <p className="text-[14px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                  You have 2 new job matches and a milestone due Friday.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="mb-6">
            <StatsRow />
          </div>

          {/* Two-column: Roadmap (hero) + Action/Job stack */}
          <div className="grid grid-cols-[1fr_380px] gap-5">
            <HeroRoadmapCard />
            <div className="flex flex-col gap-5">
              <NextActionCard />
              <TopJobMatchCard />
            </div>
          </div>
        </div>
      </main>

      <SophiaBar />
    </div>
  );
}
