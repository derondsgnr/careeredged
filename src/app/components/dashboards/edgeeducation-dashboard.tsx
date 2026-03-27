/**
 * EdgeEducation Dashboard
 * Institutional focus: student adoption, career readiness outcomes, events.
 */

import { motion } from "motion/react";
import { RoleShell, GlassCard, type NavigateFn } from "../role-shell";
import {
  GraduationCap, Users, BarChart3, Calendar, ChevronRight,
  TrendingUp, BookOpen, Building2, ArrowUpRight, Star,
} from "lucide-react";
import { EASE } from "../tokens";
import { KPIRow } from "../kpi-patterns";
import { SophiaInsight } from "../sophia-patterns";

const KPIS = [
  { label: "Student Adoption", value: "72%", trend: "+8% this semester", icon: <Users className="w-4 h-4" />, color: "var(--ce-role-edu)", gauge: 0.72 },
  { label: "Career Readiness", value: "68", trend: "+16 vs Fall '25", icon: <TrendingUp className="w-4 h-4" />, color: "var(--ce-lime)", gauge: 0.68 },
  { label: "Employer Partners", value: "34", trend: "+6 new", icon: <Building2 className="w-4 h-4" />, color: "var(--ce-role-edgestar)", gauge: null },
  { label: "Events This Month", value: "5", trend: "2 career fairs", icon: <Calendar className="w-4 h-4" />, color: "var(--ce-role-guide)", gauge: null },
];

const OUTCOMES = [
  { label: "Career Knowledge & Skills", score: 74, target: 80, color: "var(--ce-role-edu)" },
  { label: "Experiential Learning", score: 61, target: 75, color: "var(--ce-role-edgestar)" },
  { label: "Employment Outcomes", score: 58, target: 70, color: "var(--ce-lime)" },
  { label: "Employer Engagement", score: 82, target: 80, color: "var(--ce-role-employer)" },
];

const COHORTS = [
  { name: "Spring 2026 — Computer Science", students: 145, active: 112, readiness: 72 },
  { name: "Spring 2026 — Business Admin", students: 98, active: 67, readiness: 64 },
  { name: "Spring 2026 — Design", students: 56, active: 48, readiness: 78 },
  { name: "Fall 2025 Alumni", students: 203, placed: 168, readiness: 85 },
];

const UPCOMING_EVENTS = [
  { name: "Spring Career Fair", date: "March 22", type: "Career Fair", attendees: 340 },
  { name: "Tech Industry Panel", date: "March 25", type: "Panel", attendees: 85 },
  { name: "Resume Workshop Series", date: "March 28", type: "Workshop", attendees: 120 },
];

export function EdgeEducationDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  return (
    <RoleShell role="edu" userName="Dr. Martinez" userInitial="M" edgeGas={55} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good morning, Dr. Martinez
        </h1>
        <p className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          23 students active this week · Spring Career Fair in 5 days
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="mb-5"><KPIRow kpis={KPIS} /></div>

      {/* NACE/CSEA Outcomes strip */}
      <GlassCard delay={0.45} className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-[var(--ce-role-edu)]" />
            <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NACE Career Readiness Outcomes</span>
          </div>
          <button onClick={() => onNavigate?.("analytics")} className="flex items-center gap-1 text-[12px] text-ce-text-tertiary hover:text-ce-text-secondary transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
            Full report <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {OUTCOMES.map((outcome, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{outcome.label}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: outcome.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${outcome.score}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: EASE }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{outcome.score}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Target: {outcome.target}</span>
              </div>
              {outcome.score >= outcome.target && (
                <span className="text-[9px] text-[var(--ce-role-employer)] mt-0.5 block" style={{ fontFamily: "var(--font-body)" }}>Target met</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Two-column */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Cohort progress */}
          <GlassCard delay={0.55}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[var(--ce-role-edu)]" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Student Cohorts</span>
              </div>
              <button onClick={() => onNavigate?.("analytics")} className="text-[11px] text-ce-text-tertiary hover:text-ce-text-secondary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Manage students →
              </button>
            </div>
            {COHORTS.map((cohort, i) => (
              <div key={i} onClick={() => onNavigate?.("analytics")} className="py-3 cursor-pointer" style={{ borderBottom: i < COHORTS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{cohort.name}</span>
                  <span className="text-[11px] text-[var(--ce-role-edu)] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{cohort.readiness}%</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--ce-role-edu), var(--ce-role-edgestar))" }} initial={{ width: 0 }} animate={{ width: `${cohort.readiness}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: EASE }} />
                  </div>
                </div>
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                  {cohort.students} students · {(cohort as any).active ? `${(cohort as any).active} active` : `${(cohort as any).placed} placed`}
                </span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="The Design cohort is outperforming — 78% career readiness. Their engagement with ResumeEdge is 2x the average. Consider sharing their approach with other departments."
            actionLabel="View outcomes report"
            onAction={() => onNavigate?.("analytics")}
            delay={0.6}
          />

          {/* Upcoming events */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Upcoming Events</span>
            </div>
            {UPCOMING_EVENTS.map((event, i) => (
              <div key={i} onClick={() => onNavigate?.("events")} className="flex items-center gap-3 py-2.5 cursor-pointer" style={{ borderBottom: i < UPCOMING_EVENTS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{event.name}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{event.type} · {event.attendees} registered</span>
                </div>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{event.date}</span>
              </div>
            ))}
          </GlassCard>

          {/* Employer partnerships */}
          <GlassCard delay={0.7}>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-3.5 h-3.5 text-ce-cyan" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Top Partners</span>
            </div>
            {["Google", "Figma", "Meta", "Vercel"].map((partner, i) => (
              <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                  <Building2 className="w-3 h-3 text-ce-text-tertiary" />
                </div>
                <span className="text-[12px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>{partner}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Active</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
      </div>
    </RoleShell>
  );
}