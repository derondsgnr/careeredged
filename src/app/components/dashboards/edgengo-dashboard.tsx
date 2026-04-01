/**
 * EdgeNGO Dashboard
 * Community program impact, participant outcomes, and community jobs.
 */

import { motion } from "motion/react";
import { RoleShell, GlassCard, type NavigateFn } from "../role-shell";
import {
  BookOpen, Users, BarChart3, Briefcase, ChevronRight,
  TrendingUp, Target, Heart, Calendar, ArrowUpRight,
} from "lucide-react";
import { EASE } from "../tokens";
import { KPIRow } from "../kpi-patterns";
import { SophiaInsight } from "../sophia-patterns";

const KPIS = [
  { label: "Active Programs", value: "4", trend: "1 launching soon", icon: <BookOpen className="w-4 h-4" />, color: "var(--ce-role-ngo)", gauge: null },
  { label: "Participants", value: "187", trend: "+23 this month", icon: <Users className="w-4 h-4" />, color: "var(--ce-role-ngo)", gauge: null },
  { label: "Job Placements", value: "34", trend: "+8 this month", icon: <Briefcase className="w-4 h-4" />, color: "var(--ce-role-ngo)", gauge: null },
  { label: "Grant Utilization", value: "71%", trend: "On track", icon: <BarChart3 className="w-4 h-4" />, color: "var(--ce-role-ngo)", gauge: 0.71 },
];

const PROGRAMS = [
  { name: "Tech Career Pathways", participants: 65, completionRate: 72, placements: 18, status: "active" },
  { name: "Youth Employment Initiative", participants: 45, completionRate: 58, placements: 9, status: "active" },
  { name: "Career Restart Program", participants: 52, completionRate: 81, placements: 7, status: "active" },
  { name: "Digital Skills Bootcamp", participants: 25, completionRate: 0, placements: 0, status: "launching" },
];

const COMMUNITY_JOBS = [
  { title: "Community Outreach Coordinator", org: "Youth Forward", type: "Community Opportunity", applicants: 12 },
  { title: "Program Assistant", org: "TechBridge", type: "Community Opportunity", applicants: 8 },
  { title: "Career Coach (Volunteer)", org: "New Horizons", type: "Volunteer", applicants: 5 },
];

export function EdgeNGODashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  return (
    <RoleShell role="ngo" userName="James" userInitial="J" edgeGas={40} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good morning, James
        </h1>
        <p className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          187 active participants · 34 placements this quarter
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="mb-5"><KPIRow kpis={KPIS} /></div>

      {/* Two-column */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Programs */}
          <GlassCard delay={0.5}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--ce-role-ngo)]" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Active Programs</span>
              </div>
              <button onClick={() => onNavigate?.("programs")} className="text-[11px] text-[var(--ce-role-ngo)] px-2 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-role-ngo-rgb),0.08)", border: "1px solid rgba(var(--ce-role-ngo-rgb),0.12)", fontFamily: "var(--font-body)" }}>
                + New Program
              </button>
            </div>
            {PROGRAMS.map((prog, i) => (
              <div key={i} onClick={() => onNavigate?.("programs")} className="py-3 cursor-pointer" style={{ borderBottom: i < PROGRAMS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{prog.name}</span>
                    {prog.status === "launching" && (
                      <span className="text-[9px] text-[var(--ce-role-edgepreneur)] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.08)", fontFamily: "var(--font-body)" }}>Launching</span>
                    )}
                  </div>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{prog.participants} participants</span>
                </div>
                {prog.status === "active" && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--ce-role-ngo), var(--ce-lime))" }} initial={{ width: 0 }} animate={{ width: `${prog.completionRate}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: EASE }} />
                      </div>
                      <span className="text-[10px] text-ce-text-tertiary tabular-nums w-8 text-right" style={{ fontFamily: "var(--font-body)" }}>{prog.completionRate}%</span>
                    </div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{prog.placements} placed</span>
                  </>
                )}
              </div>
            ))}
          </GlassCard>

          {/* Community jobs */}
          <GlassCard delay={0.6}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-ce-lime" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Community Opportunities</span>
              </div>
              <button onClick={() => onNavigate?.("jobs")} className="text-[11px] text-ce-text-tertiary hover:text-ce-text-secondary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Post job →
              </button>
            </div>
            {COMMUNITY_JOBS.map((job, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < COMMUNITY_JOBS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.org} · {job.type}</span>
                </div>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{job.applicants} applicants</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="The Career Restart Program is outperforming — 81% completion rate. 12 participants completed interview prep this week. Placement rate is trending above target."
            actionLabel="View impact report"
            onAction={() => onNavigate?.("analytics")}
            delay={0.55}
          />

          {/* Impact metrics */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-ce-cyan" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Impact This Quarter</span>
            </div>
            {[
              { label: "Resume completions", value: "124", trend: "+34%" },
              { label: "Interview prep sessions", value: "89", trend: "+22%" },
              { label: "Job placements", value: "34", trend: "+45%" },
              { label: "Avg time to placement", value: "42 days", trend: "-8 days" },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{metric.value}</span>
                  <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>{metric.trend}</span>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
      </div>
    </RoleShell>
  );
}