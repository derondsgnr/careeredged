/**
 * EdgePreneur Dashboard
 * Business builder focused on roadmap velocity, pitch milestones, and advisor connections.
 */

import { motion } from "motion/react";
import { RoleShell, GlassCard, type NavigateFn } from "../role-shell";
import { SophiaMark } from "../sophia-mark";
import {
  Rocket, Zap, Target, Users, Check, ChevronRight, Sparkles,
  TrendingUp, Lightbulb, FileText, MessageSquare, ArrowRight, DollarSign,
} from "lucide-react";
import { EASE } from "../tokens";
import { KPIRow, PhaseBar } from "../kpi-patterns";
import { SophiaInsight } from "../sophia-patterns";
import { BuddyDashboardCard } from "../buddy-dashboard-card";

const KPIS = [
  { label: "Business Score", value: "64", trend: "+8", icon: <Rocket className="w-4 h-4" />, color: "var(--ce-role-edgepreneur)", gauge: 0.64 },
  { label: "EdgeGas", value: "38", trend: "+10 earned", icon: <Zap className="w-4 h-4" />, color: "var(--ce-lime)", gauge: null },
  { label: "Milestones", value: "7", trend: "3 this month", icon: <Target className="w-4 h-4" />, color: "var(--ce-role-edgestar)", gauge: null },
  { label: "Connections", value: "12", trend: "+4 advisors", icon: <Users className="w-4 h-4" />, color: "var(--ce-role-guide)", gauge: null },
];

const PHASES = [
  { id: 1, title: "Validate Idea", weeks: "Weeks 1–3", status: "done" as const, progress: 1 },
  { id: 2, title: "Build MVP", weeks: "Weeks 4–8", status: "active" as const, progress: 0.45 },
  { id: 3, title: "Launch", weeks: "Weeks 9–12", status: "upcoming" as const, progress: 0 },
  { id: 4, title: "Scale", weeks: "Weeks 13–20", status: "upcoming" as const, progress: 0 },
];

const MILESTONES = [
  { label: "Market research complete", status: "done" as const, date: "Mar 1" },
  { label: "Customer interviews (10)", status: "done" as const, date: "Mar 5" },
  { label: "Competitive analysis", status: "done" as const, date: "Mar 8" },
  { label: "Pitch deck draft", status: "current" as const, date: "Today" },
  { label: "Financial model v1", status: "upcoming" as const, date: "Mar 20" },
  { label: "Advisor feedback round", status: "upcoming" as const, date: "Mar 25" },
];

const ACTIVITIES = [
  { time: "3h ago", text: "Pitch deck section 3 completed", icon: <FileText className="w-3 h-3" />, color: "var(--ce-role-edgepreneur)" },
  { time: "Yesterday", text: "Advisor session with Michael", icon: <Users className="w-3 h-3" />, color: "var(--ce-role-guide)" },
  { time: "2 days ago", text: "Market validation survey sent", icon: <TrendingUp className="w-3 h-3" />, color: "var(--ce-role-edgestar)" },
  { time: "3 days ago", text: "Competitive landscape mapped", icon: <Lightbulb className="w-3 h-3" />, color: "var(--ce-lime)" },
];

export function EdgePreneurDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  return (
    <RoleShell role="edgepreneur" userName="Marcus" userInitial="M" edgeGas={38} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good morning, Marcus
        </h1>
        <p className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          Build phase — 45% complete · Pitch deck milestone in progress
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="mb-5"><KPIRow kpis={KPIS} /></div>

      {/* Roadmap strip */}
      <GlassCard delay={0.45} className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Rocket className="w-4 h-4 text-[var(--ce-role-edgepreneur)]" />
            <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Business Roadmap</span>
          </div>
          <button onClick={() => onNavigate?.("edgepath")} className="flex items-center gap-1 text-[12px] text-ce-text-tertiary hover:text-ce-text-secondary transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
            View full roadmap <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <PhaseBar phases={PHASES} accent="var(--ce-role-edgepreneur)" delay={0.5} />
      </GlassCard>

      {/* Two-column */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Milestones */}
          <GlassCard delay={0.5} className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--ce-role-edgepreneur)]" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Build Phase Milestones</span>
              </div>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>3 of 6</span>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4].map((p) => (
                <div key={p} className="flex-1 h-1 rounded-full" style={{ background: p <= 1 ? "var(--ce-role-edgepreneur)" : p === 2 ? "linear-gradient(90deg, var(--ce-role-edgepreneur), rgba(var(--ce-role-edgepreneur-rgb),0.3))" : "rgba(var(--ce-glass-tint),0.04)" }} />
              ))}
            </div>
            <div className="flex flex-col flex-1">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-start gap-2.5 relative">
                  {i < MILESTONES.length - 1 && (
                    <div className="absolute left-[9px] top-[18px] bottom-0 w-[1px]" style={{ background: m.status === "done" ? "rgba(var(--ce-role-edgepreneur-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)" }} />
                  )}
                  <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5" style={{
                    background: m.status === "done" ? "rgba(var(--ce-role-edgepreneur-rgb),0.1)" : "var(--ce-surface-0)",
                    border: `1.5px solid ${m.status === "done" ? "rgba(var(--ce-role-edgepreneur-rgb),0.25)" : m.status === "current" ? "var(--ce-role-edgepreneur)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                    boxShadow: m.status === "current" ? "0 0 8px rgba(var(--ce-role-edgepreneur-rgb),0.2)" : "none",
                  }}>
                    {m.status === "done" && <Check className="w-2.5 h-2.5 text-[var(--ce-role-edgepreneur)]" />}
                    {m.status === "current" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgepreneur)]" />}
                  </div>
                  <div className="flex-1 pb-3 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[12px] truncate ${m.status === "upcoming" ? "text-ce-text-tertiary" : m.status === "done" ? "text-ce-text-secondary" : "text-ce-text-primary"}`} style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{m.date}</span>
                    </div>
                    {m.status === "current" && (
                      <motion.div className="flex items-center gap-1 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                        <Sparkles className="w-2.5 h-2.5 text-[var(--ce-role-edgepreneur)]" />
                        <button onClick={() => onNavigate?.("taskroom")} className="text-[10px] text-[var(--ce-role-edgepreneur)] cursor-pointer hover:underline" style={{ fontFamily: "var(--font-body)", background: "none", border: "none", padding: 0 }}>In progress · Open task room →</button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Activity */}
          <GlassCard delay={0.55}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-ce-text-secondary" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Recent Activity</span>
            </div>
            {ACTIVITIES.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < ACTIVITIES.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <span className="text-[12px] text-ce-text-secondary flex-1 min-w-0" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{item.time}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="Your market research is solid. The pitch deck draft is shaping up — I'd focus on the financial model section next. Investors will want to see unit economics."
            actionLabel="Continue pitch deck"
            onAction={() => onNavigate?.("taskroom")}
            delay={0.6}
          />

          {/* Funding teaser */}
          <GlassCard delay={0.63}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--ce-role-edgepreneur)]" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Funding Matches</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.1)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-display)" }}>2 new</span>
              </div>
            </div>
            {[
              { name: "YCombinator W27", type: "Accelerator", stage: "Seed", deadline: "Apr 5" },
              { name: "TechStars NYC", type: "Accelerator", stage: "Pre-Seed", deadline: "Apr 12" },
            ].map((opp, i) => (
              <div key={i} onClick={() => onNavigate?.("funding")} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors rounded-lg px-1" style={{ borderBottom: i === 0 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{opp.name}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{opp.type} · {opp.stage}</span>
                </div>
                <span className="text-[10px] text-[var(--ce-role-edgepreneur)] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>Deadline {opp.deadline}</span>
              </div>
            ))}
            <button onClick={() => onNavigate?.("funding")} className="w-full mt-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-role-edgepreneur-rgb),0.06)]" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.1)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>
              View all funding opportunities →
            </button>
          </GlassCard>

          {/* Advisor sessions */}
          <GlassCard delay={0.65}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Advisor Sessions</span>
              </div>
            </div>
            {[
              { name: "Michael Torres", role: "Startup Advisor", date: "Tomorrow, 3 PM" },
              { name: "Dr. Sarah Kim", role: "Market Strategy", date: "Friday, 10 AM" },
            ].map((session, i) => (
              <div key={i} onClick={() => onNavigate?.("messages")} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors mb-2" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.15)" }}>
                  <span className="text-[10px] text-[var(--ce-role-guide)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{session.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block truncate" style={{ fontFamily: "var(--font-body)" }}>{session.name}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{session.role} · {session.date}</span>
                </div>
              </div>
            ))}
          </GlassCard>
          <BuddyDashboardCard
            roleColor="var(--ce-role-edgepreneur)"
            roleRgb="var(--ce-role-edgepreneur-rgb)"
            onNavigate={(s) => onNavigate?.(s)}
            onSophia={() => onNavigate?.("messages")}
            delay={0.5}
          />
        </div>
      </div>
      </div>
    </RoleShell>
  );
}