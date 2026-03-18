/**
 * EdgePath — Option B: Inline Sophia Cards (Full-Width Feed)
 * 
 * Full-width milestones with Sophia intelligence cards woven between
 * milestone groups — like a feed, not a sidebar. The intelligence
 * is IN the content, not beside it.
 * 
 * Pattern references:
 * - Linear: task as organizing unit, full-width focus
 * - SpaceX: floating contextual alerts between operational data
 * - Notion: inline AI blocks interspersed with content
 * - Quarn: workspace feel with dot-grid empty spaces
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import {
  Compass, ChevronRight, Check, Sparkles, ArrowUpRight,
  Clock, BookOpen, ExternalLink, MoreHorizontal, Star,
  ChevronDown, ChevronUp, Mic, Search, Zap,
  Target, TrendingUp, Users, Briefcase, GraduationCap,
  Bell, Home, FileText, MessageSquare, ArrowRight,
  Lightbulb, MapPin,
  List, Map,
} from "lucide-react";
import { MindMapView } from "./edgepath-mindmap";

const SURFACE_ICONS: Record<string, any> = { file: FileText, briefcase: Briefcase, users: Users };

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Shared Data ────────────────────────────────────────────────────────────

const ROADMAP = {
  title: "Revenue Ops Manager",
  target: "Product Designer",
  archetype: "Innovator-Strategist",
  assessmentComplete: true,
  isPrimary: true,
};

const PHASES = [
  { id: 1, title: "Discover & Position", weeks: "Weeks 1–3", status: "complete" as const, progress: 1.0, milestonesDone: 6, milestonesTotal: 6 },
  { id: 2, title: "Skill Bridge", weeks: "Weeks 4–8", status: "active" as const, progress: 0.625, milestonesDone: 5, milestonesTotal: 8 },
  { id: 3, title: "Build & Ship", weeks: "Weeks 9–13", status: "upcoming" as const, progress: 0, milestonesDone: 0, milestonesTotal: 7 },
  { id: 4, title: "Interview & Close", weeks: "Weeks 14–18", status: "locked" as const, progress: 0, milestonesDone: 0, milestonesTotal: 5 },
];

type MilestoneStatus = "done" | "current" | "upcoming";
interface Milestone {
  id: string;
  label: string;
  category: "skill" | "action" | "resource";
  status: MilestoneStatus;
  time: string;
  sophiaNote?: string;
  resources?: { label: string; type: string }[];
  actions?: string[];
  crossSurface?: { surface: string; note: string; icon: string }[];
}

const PHASE_2_MILESTONES: Milestone[] = [
  { id: "m1", label: "Complete Figma fundamentals course", category: "skill", status: "done", time: "8h" },
  { id: "m2", label: "Learn design system principles", category: "skill", status: "done", time: "6h" },
  { id: "m3", label: "Complete UX research foundations", category: "skill", status: "done", time: "10h" },
  { id: "m4", label: "Build first case study", category: "action", status: "done", time: "12h" },
  { id: "m5", label: "Get portfolio feedback from mentor", category: "action", status: "done", time: "2h" },
  {
    id: "m6", label: "Complete interaction design module", category: "skill", status: "current", time: "8h",
    sophiaNote: "Based on your saved jobs, 6 of 8 target companies list interaction design as required. Prioritize this over motion design.",
    resources: [
      { label: "Interaction Design Foundation", type: "course" },
      { label: "Microinteractions by Dan Saffer", type: "book" },
    ],
    actions: ["Start course", "Add to EdgeProd sprint"],
    crossSurface: [
      { surface: "ResumeEdge", note: "Resume needs update after this skill", icon: "file" },
      { surface: "EdgeMatch", note: "3 jobs require this skill", icon: "briefcase" },
      { surface: "EdgeGuide", note: "Alice left feedback on your approach", icon: "users" },
    ],
  },
  {
    id: "m7", label: "Redesign a real product (case study #2)", category: "action", status: "upcoming", time: "15h",
    sophiaNote: "Pick a product you use daily. Recruiters value redesigns that show deep understanding over flashy visuals.",
  },
  { id: "m8", label: "Submit portfolio for ATS optimization", category: "resource", status: "upcoming", time: "1h" },
];

const CATEGORY_META = {
  skill: { label: "Skills to Build", icon: GraduationCap, color: "#22D3EE" },
  action: { label: "Actions to Take", icon: Target, color: "#B3FF3B" },
  resource: { label: "Resources to Complete", icon: BookOpen, color: "#9CA3AF" },
};

// ─── Top Nav ────────────────────────────────────────────────────────────────

const NAV_PILLS = [
  { id: "home", label: "Home", icon: Home },
  { id: "roadmap", label: "EdgePath", icon: Compass },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Search, badge: 23 },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
];

function TopNav() {
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
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
          <Sparkles className="w-3.5 h-3.5 text-[#B3FF3B]" />
        </div>
        <span className="text-[14px] text-[#E8E8ED] tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CareerEdge</span>
      </div>

      <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        {NAV_PILLS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "roadmap";
          return (
            <button key={item.id} className="relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors">
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  layoutId="ep-nav-pill-b"
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
                  }}>{item.badge}</span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.1)" }}>
          <Zap className="w-3 h-3 text-[#B3FF3B]" />
          <span className="text-[11px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>45</span>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(255,255,255,0.03)" }}>
          <Bell className="w-4 h-4 text-[#6B7280]" />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(179,255,59,0.1))", border: "1.5px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>S</span>
        </div>
      </div>
    </motion.header>
  );
}

// ─── Phase Strip (Compact Journey — wider space for full-width layout) ──────

function PhaseStrip({ activePhase, onPhaseClick }: { activePhase: number; onPhaseClick: (id: number) => void }) {
  return (
    <motion.div
      className="rounded-2xl px-6 py-5"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
    >
      {/* Journey line visualization */}
      <div className="relative flex items-center">
        {/* Background line */}
        <div className="absolute top-4 left-4 right-4 h-[2px]" style={{ background: "rgba(255,255,255,0.04)" }} />
        {/* Progress line */}
        <motion.div
          className="absolute top-4 left-4 h-[2px]"
          style={{ background: "linear-gradient(90deg, #B3FF3B, #22D3EE, rgba(34,211,238,0.1))" }}
          initial={{ width: 0 }}
          animate={{ width: "42%" }}
          transition={{ delay: 0.5, duration: 1, ease: EASE }}
        />

        {PHASES.map((phase, i) => {
          const isActive = phase.id === activePhase;
          const isComplete = phase.status === "complete";
          const isLocked = phase.status === "locked";

          return (
            <button
              key={phase.id}
              className="relative flex-1 flex flex-col items-center cursor-pointer group"
              onClick={() => !isLocked && onPhaseClick(phase.id)}
            >
              {/* Node */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300"
                style={{
                  background: isComplete
                    ? "rgba(179,255,59,0.15)"
                    : isActive
                      ? "#0A0C10"
                      : "#0A0C10",
                  border: `2.5px solid ${isComplete
                    ? "#B3FF3B"
                    : isActive
                      ? "#22D3EE"
                      : "rgba(255,255,255,0.08)"
                    }`,
                  boxShadow: isActive
                    ? "0 0 20px rgba(34,211,238,0.2), 0 0 40px rgba(34,211,238,0.05)"
                    : isComplete
                      ? "0 0 12px rgba(179,255,59,0.1)"
                      : "none",
                }}
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-[#B3FF3B]" />
                ) : isActive ? (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                ) : (
                  <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{phase.id}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[12px] mt-2 text-center ${isActive ? "text-[#E8E8ED]" : isComplete ? "text-[#9CA3AF]" : "text-[#6B7280]"}`}
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {phase.title}
              </span>
              <span className="text-[10px] text-[#374151] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                {phase.weeks}
              </span>

              {/* Progress indicator for active */}
              {isActive && (
                <motion.div
                  className="mt-1.5 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#22D3EE" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.progress * 100}%` }}
                      transition={{ delay: 1, duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <span className="text-[9px] text-[#22D3EE] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                    {phase.milestonesDone}/{phase.milestonesTotal}
                  </span>
                </motion.div>
              )}

              {isComplete && (
                <span className="text-[9px] text-[#B3FF3B] mt-1.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(179,255,59,0.06)" }}>
                  Done
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Sophia Inline Card (THE DIFFERENTIATOR for Option B) ───────────────────

function SophiaInlineCard({ children, icon, delay = 0.5 }: { children: React.ReactNode; icon?: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="relative rounded-xl px-5 py-4 my-1"
      style={{
        background: "linear-gradient(135deg, rgba(34,211,238,0.04), rgba(255,255,255,0.015) 60%, rgba(179,255,59,0.02))",
        border: "1px solid rgba(34,211,238,0.06)",
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      {/* Sophia accent line on left */}
      <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #22D3EE, rgba(179,255,59,0.3))" }} />

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon || <SophiaMark size={16} glowing={false} />}
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </motion.div>
  );
}

// ─── Milestone Item (Full-width variant) ────────────────────────────────────

function MilestoneItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const [expanded, setExpanded] = useState(milestone.status === "current");
  const [checked, setChecked] = useState(milestone.status === "done");

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.04, duration: 0.3, ease: EASE }}
    >
      <div
        className="flex items-start gap-4 px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          background: expanded ? "rgba(255,255,255,0.025)" : "transparent",
          border: expanded ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
        onClick={() => milestone.status !== "done" && setExpanded(!expanded)}
      >
        {/* Checkbox */}
        <button
          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 cursor-pointer"
          style={{
            background: checked ? "rgba(179,255,59,0.15)" : "transparent",
            border: `1.5px solid ${checked ? "#B3FF3B" : milestone.status === "current" ? "#22D3EE" : "rgba(255,255,255,0.1)"}`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!checked && milestone.status !== "upcoming") setChecked(true);
          }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Check className="w-3 h-3 text-[#B3FF3B]" />
            </motion.div>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-[13px] ${checked ? "text-[#6B7280] line-through" : milestone.status === "current" ? "text-[#E8E8ED]" : "text-[#9CA3AF]"}`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {milestone.label}
              </span>
              {milestone.status === "current" && !checked && (
                <span className="flex items-center gap-1 text-[10px] text-[#22D3EE] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(34,211,238,0.08)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" style={{ boxShadow: "0 0 6px rgba(34,211,238,0.4)" }} />
                  Up next
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Category tag */}
              <span className="text-[9px] px-2 py-0.5 rounded" style={{
                background: "rgba(255,255,255,0.03)",
                color: CATEGORY_META[milestone.category].color,
                fontFamily: "var(--font-body)",
              }}>
                {milestone.category}
              </span>
              <div className="flex items-center gap-1 text-[#374151]">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{milestone.time}</span>
              </div>
              {!checked && (
                <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="cursor-pointer">
                  {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#374151]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#374151]" />}
                </button>
              )}
            </div>
          </div>

          {/* Expanded detail */}
          <AnimatePresence>
            {expanded && !checked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid grid-cols-[1fr_1fr] gap-4">
                  {/* Left: Sophia note + resources */}
                  <div>
                    {milestone.sophiaNote && (
                      <div className="flex gap-2 px-3 py-2.5 rounded-lg mb-2" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.06)" }}>
                        <SophiaMark size={14} glowing={false} />
                        <p className="text-[11px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                          {milestone.sophiaNote}
                        </p>
                      </div>
                    )}
                    {milestone.resources && (
                      <div className="flex flex-col gap-1.5">
                        {milestone.resources.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors">
                            <BookOpen className="w-3 h-3 text-[#374151]" />
                            <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{r.label}</span>
                            <span className="text-[9px] text-[#374151] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>{r.type}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-[#374151] ml-auto" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Right: Cross-surface + Actions */}
                  <div className="flex flex-col justify-between">
                    {milestone.crossSurface && (
                      <div className="mb-2">
                        <span className="text-[9px] text-[#374151] mb-1.5 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Connected surfaces</span>
                        <div className="flex flex-col gap-1">
                          {milestone.crossSurface.map((cs, i) => {
                            const SIcon = SURFACE_ICONS[cs.icon] || FileText;
                            return (
                              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors">
                                <SIcon className="w-3 h-3 text-[#22D3EE]" />
                                <span className="text-[10px] text-[#6B7280] flex-1" style={{ fontFamily: "var(--font-body)" }}>{cs.surface}: {cs.note}</span>
                                <ChevronRight className="w-2.5 h-2.5 text-[#374151]" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {milestone.actions && (
                      <div className="flex gap-2 justify-end">
                        {milestone.actions.map((a, i) => (
                          <button
                            key={i}
                            className="text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-colors"
                            style={{
                              background: i === 0 ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${i === 0 ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.06)"}`,
                              color: i === 0 ? "#22D3EE" : "#9CA3AF",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sophia Bottom Bar ──────────────────────────────────────────────────────

function SophiaBottomBar() {
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
          Phase 2 is 63% complete. 2 milestones this week.
        </span>
        <div className="flex gap-2">
          <button className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
            Quick wins
          </button>
          <button className="text-[11px] text-[#9CA3AF] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
            Compare paths
          </button>
        </div>
      </div>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(34,211,238,0.08)] transition-colors" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)" }}>
        <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
        <span className="text-[12px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia</span>
      </button>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function EdgePathOptionB() {
  const [activePhase, setActivePhase] = useState(2);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Split milestones into done and remaining for the inline Sophia card placement
  const doneMilestones = PHASE_2_MILESTONES.filter((m) => m.status === "done");
  const remainingMilestones = PHASE_2_MILESTONES.filter((m) => m.status !== "done");

  if (viewMode === "map") {
    return (
      <div className="h-screen w-full flex flex-col" style={{ backgroundColor: "#08090C" }}>
        <SophiaForwardBackground />
        <TopNav />
        <motion.div
          className="mt-14 flex items-center justify-between px-6 py-3 z-10 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-[16px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {ROADMAP.title} <span className="text-[#374151] mx-1">→</span> {ROADMAP.target}
            </h1>
            <Star className="w-3.5 h-3.5 text-[#B3FF3B] fill-[#B3FF3B]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                style={{ background: "transparent", color: "#6B7280", fontFamily: "var(--font-body)" }}
                onClick={() => setViewMode("list")}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)", color: "#22D3EE", fontFamily: "var(--font-body)" }}>
                <Map className="w-3.5 h-3.5" /> Map
              </button>
            </div>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </motion.div>
        <MindMapView />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
      <SophiaForwardBackground />
      <TopNav />
      <SophiaBottomBar />

      <main className="mt-14 pb-20 px-6">
        <div className="max-w-[860px] mx-auto">
          {/* Roadmap Header */}
          <motion.div
            className="pt-8 pb-5 flex items-center justify-between"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[20px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {ROADMAP.title} <span className="text-[#374151] mx-1">→</span> {ROADMAP.target}
                </h1>
                <Star className="w-4 h-4 text-[#B3FF3B] fill-[#B3FF3B]" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                  Archetype: <span className="text-[#9CA3AF]">{ROADMAP.archetype}</span> · Assessment complete
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                  style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)", color: "#22D3EE", fontFamily: "var(--font-body)" }}>
                  <List className="w-3.5 h-3.5" /> List
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                  style={{ background: "transparent", color: "#6B7280", fontFamily: "var(--font-body)" }}
                  onClick={() => setViewMode("map")}
                >
                  <Map className="w-3.5 h-3.5" /> Map
                </button>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          </motion.div>

          {/* Phase Strip */}
          <div className="mb-5">
            <PhaseStrip activePhase={activePhase} onPhaseClick={setActivePhase} />
          </div>

          {/* Sophia Commentary Strip */}
          <motion.div
            className="flex items-center gap-3 px-5 py-3 rounded-xl mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.04), rgba(255,255,255,0.015))",
              border: "1px solid rgba(34,211,238,0.06)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
          >
            <SophiaMark size={16} glowing={false} />
            <span className="text-[12px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>
              Phase 2 is your skill-building phase. You're 63% through — on track for completion by April 28.
              <span className="text-[#22D3EE] ml-1">Interaction design is your priority this week.</span>
            </span>
          </motion.div>

          {/* FEED: Milestones with inline Sophia cards */}
          <div className="flex flex-col gap-1">
            {/* Done milestones */}
            <motion.div
              className="flex items-center gap-2 px-5 py-2 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.3, ease: EASE }}
            >
              <Check className="w-3.5 h-3.5 text-[#B3FF3B]" />
              <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Completed ({doneMilestones.length})
              </span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(255,255,255,0.04)" }} />
            </motion.div>

            {doneMilestones.map((m, i) => (
              <MilestoneItem key={m.id} milestone={m} index={i} />
            ))}

            {/* SOPHIA INLINE CARD: Progress celebration */}
            <SophiaInlineCard delay={0.7}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-body)" }}>
                    5 milestones down in Phase 2. You're building momentum.
                  </p>
                  <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                    At this pace, you'll finish Phase 2 a week early. Your Figma skills are already above the median for junior product designers.
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(179,255,59,0.06)", border: "1.5px solid rgba(179,255,59,0.12)" }}>
                    <span className="text-[16px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>63%</span>
                  </div>
                </div>
              </div>
            </SophiaInlineCard>

            {/* Remaining milestones header */}
            <motion.div
              className="flex items-center gap-2 px-5 py-2 mt-2 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.3, ease: EASE }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Remaining ({remainingMilestones.length})
              </span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(255,255,255,0.04)" }} />
            </motion.div>

            {remainingMilestones.map((m, i) => (
              <MilestoneItem key={m.id} milestone={m} index={doneMilestones.length + i} />
            ))}

            {/* SOPHIA INLINE CARD: Job matches */}
            <SophiaInlineCard icon={<Briefcase className="w-4 h-4 text-[#B3FF3B]" />} delay={0.9}>
              <p className="text-[12px] text-[#E8E8ED] mb-2" style={{ fontFamily: "var(--font-body)" }}>
                4 jobs match your Phase 2 skills — 2 posted this week
              </p>
              <div className="flex gap-3">
                {[
                  { title: "Product Designer", company: "Figma", match: 92 },
                  { title: "UX Designer", company: "Linear", match: 87 },
                  { title: "Design Lead", company: "Vercel", match: 84 },
                ].map((job, i) => (
                  <div key={i} className="flex-1 px-3 py-2 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-[11px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{job.company}</span>
                      <span className="text-[9px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-[11px] text-[#22D3EE] mt-2 cursor-pointer hover:underline" style={{ fontFamily: "var(--font-body)" }}>
                View all in EdgeMatch →
              </button>
            </SophiaInlineCard>

            {/* SOPHIA INLINE CARD: Mentor + Pathway fork */}
            <SophiaInlineCard icon={<Lightbulb className="w-4 h-4 text-[#22D3EE]" />} delay={1.0}>
              <p className="text-[12px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-body)" }}>
                I see two paths for your remaining milestones
              </p>
              <p className="text-[11px] text-[#6B7280] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Specializing in interaction design vs. going broader with design systems. Both match your target roles. Want to compare?
              </p>
              <div className="flex gap-2">
                <button
                  className="text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.12)", color: "#22D3EE", fontFamily: "var(--font-body)" }}
                >
                  Compare paths
                </button>
                <button
                  className="text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}
                >
                  Ask Alice (EdgeGuide)
                </button>
              </div>
            </SophiaInlineCard>

            {/* SOPHIA INLINE CARD: Skills snapshot */}
            <SophiaInlineCard icon={<TrendingUp className="w-4 h-4 text-[#22D3EE]" />} delay={1.1}>
              <p className="text-[12px] text-[#E8E8ED] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Your Phase 2 skill progress
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { skill: "Figma", pct: 85, color: "#B3FF3B" },
                  { skill: "UX Research", pct: 70, color: "#22D3EE" },
                  { skill: "Interaction", pct: 15, color: "#22D3EE" },
                  { skill: "Systems", pct: 45, color: "#9CA3AF" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-1">
                      <svg width="48" height="48" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                        <motion.circle
                          cx="24" cy="24" r="20" fill="none"
                          stroke={s.color}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20}`}
                          transform="rotate(-90 24 24)"
                          initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - s.pct / 100) }}
                          transition={{ delay: 1.3 + i * 0.1, duration: 0.6, ease: EASE }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] tabular-nums" style={{ color: s.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                        {s.pct}%
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{s.skill}</span>
                  </div>
                ))}
              </div>
            </SophiaInlineCard>
          </div>
        </div>
      </main>
    </div>
  );
}