/**
 * EdgeParent Dashboard
 * Supportive monitoring of child's career progress. Warm, not surveillance.
 */

import { motion } from "motion/react";
import { RoleShell, KPIRow, GlassCard, SophiaInsight, type NavigateFn } from "../role-shell";
import {
  Heart, Compass, Check, ChevronRight, BookOpen,
  Target, Calendar, TrendingUp, Star, MessageSquare,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

const KPIS = [
  { label: "Roadmap Progress", value: "63%", trend: "+12% this month", icon: <Compass className="w-4 h-4" />, color: "#EC4899", gauge: 0.63 },
  { label: "Tasks Completed", value: "8", trend: "3 this week", icon: <Check className="w-4 h-4" />, color: "#22D3EE", gauge: null },
  { label: "Next Session", value: "Fri", trend: "with Alice Chen", icon: <Calendar className="w-4 h-4" />, color: "#8B5CF6", gauge: null },
];

const PHASES = [
  { id: 1, title: "Discover & Position", status: "done" as const, progress: 1 },
  { id: 2, title: "Build & Apply", status: "active" as const, progress: 0.6 },
  { id: 3, title: "Interview & Close", status: "upcoming" as const, progress: 0 },
  { id: 4, title: "Transition & Grow", status: "upcoming" as const, progress: 0 },
];

const MILESTONES_COMPLETED = [
  { label: "Resume audit completed", date: "Mar 2", icon: <Check className="w-3 h-3" />, color: "#22D3EE" },
  { label: "Portfolio review finished", date: "Mar 5", icon: <Check className="w-3 h-3" />, color: "#22D3EE" },
  { label: "Target companies identified", date: "Mar 8", icon: <Check className="w-3 h-3" />, color: "#B3FF3B" },
  { label: "LinkedIn profile optimized", date: "Mar 12", icon: <Star className="w-3 h-3" />, color: "#B3FF3B" },
  { label: "First 3 applications sent", date: "Mar 15", icon: <TrendingUp className="w-3 h-3" />, color: "#EC4899" },
];

export function EdgeParentDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  return (
    <RoleShell role="parent" userName="David" userInitial="D" edgeGas={20} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good afternoon, David
        </h1>
        <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
          Alex is making steady progress — Phase 2 is 60% complete
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="mb-5"><KPIRow kpis={KPIS} /></div>

      {/* Child's roadmap (read-only) */}
      <GlassCard delay={0.45} className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#EC4899]" />
            <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Alex's Career Roadmap</span>
            <span className="text-[10px] text-[#6B7280] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", fontFamily: "var(--font-body)" }}>Product Design</span>
          </div>
          <button onClick={() => onNavigate?.("family")} className="flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
            View details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3">
          {PHASES.map((phase) => (
            <div key={phase.id} className="flex-1">
              <div className="h-1.5 rounded-full mb-2.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                {(phase.status === "active" || phase.status === "done") && (
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: phase.status === "done" ? "#EC4899" : "linear-gradient(90deg, #EC4899, #22D3EE)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.progress * 100}%` }}
                    transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-0.5">
                {phase.status === "done" ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                ) : phase.status === "active" ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" style={{ boxShadow: "0 0 6px rgba(236,72,153,0.4)" }} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
                )}
                <span className={`text-[12px] ${phase.status !== "upcoming" ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {phase.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Single wider layout — parent doesn't need dense two-column */}
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Weekly progress */}
          <GlassCard delay={0.5}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#EC4899]" />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Recent Milestones</span>
            </div>
            <p className="text-[12px] text-[#6B7280] mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Here's what Alex has accomplished recently
            </p>
            {MILESTONES_COMPLETED.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < MILESTONES_COMPLETED.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <span className="text-[12px] text-[#9CA3AF] flex-1 min-w-0" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                <span className="text-[10px] text-[#374151] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
              </div>
            ))}
          </GlassCard>

          {/* Upcoming */}
          <GlassCard delay={0.55}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Coming Up</span>
            </div>
            {[
              { text: "Mentor session with Alice Chen", date: "Friday, 2 PM", color: "#8B5CF6" },
              { text: "Networking outreach milestone due", date: "Monday", color: "#22D3EE" },
              { text: "First application batch target", date: "Next Wednesday", color: "#B3FF3B" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-[12px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                <span className="text-[10px] text-[#374151] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="Alex is building momentum — 5 milestones completed in 2 weeks. Their mentor Alice says the portfolio is coming together well. The next big step is sending out applications."
            actionLabel="View Alex's roadmap"
            onAction={() => onNavigate?.("family")}
            delay={0.6}
          />
          {/* Quick message */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-[#EC4899]" />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Message Alex</span>
            </div>
            <p className="text-[12px] text-[#6B7280] mb-3" style={{ fontFamily: "var(--font-body)" }}>
              Send encouragement or check in
            </p>
            <div className="flex gap-2">
              {["Great progress!", "How's it going?", "Need anything?"].map((msg) => (
                <button key={msg} onClick={() => onNavigate?.("messages")} className="text-[11px] text-[#9CA3AF] px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}>
                  {msg}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
      </div>
    </RoleShell>
  );
}