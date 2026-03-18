/**
 * EdgeEmployer Dashboard
 * Hiring-focused: open positions, applicant pipeline, hiring velocity.
 */

import { motion } from "motion/react";
import { RoleShell, KPIRow, GlassCard, SophiaInsight, type NavigateFn } from "../role-shell";
import {
  Briefcase, Users, BarChart3, Clock, ChevronRight,
  ArrowUpRight, TrendingUp, Star, Building2, Eye,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

const KPIS = [
  { label: "Open Positions", value: "6", trend: "2 new this week", icon: <Briefcase className="w-4 h-4" />, color: "#10B981", gauge: null },
  { label: "Total Applicants", value: "142", trend: "+28 this week", icon: <Users className="w-4 h-4" />, color: "#22D3EE", gauge: null },
  { label: "Interview Pipeline", value: "18", trend: "5 scheduled", icon: <ArrowUpRight className="w-4 h-4" />, color: "#B3FF3B", gauge: null },
  { label: "Avg Time-to-Hire", value: "23d", trend: "-4d vs last Q", icon: <Clock className="w-4 h-4" />, color: "#F59E0B", gauge: null },
];

const FUNNEL_STAGES = [
  { label: "Applied", count: 142, width: 100, color: "#22D3EE" },
  { label: "Screened", count: 67, width: 47, color: "#8B5CF6" },
  { label: "Interview", count: 18, width: 13, color: "#B3FF3B" },
  { label: "Offer", count: 3, width: 2, color: "#10B981" },
];

const OPEN_JOBS = [
  { title: "Product Designer", dept: "Design", applicants: 34, new: 8, match90: 3, posted: "Mar 1" },
  { title: "Senior Frontend Engineer", dept: "Engineering", applicants: 52, new: 12, match90: 5, posted: "Feb 28" },
  { title: "Data Scientist", dept: "Analytics", applicants: 28, new: 4, match90: 2, posted: "Mar 5" },
  { title: "UX Researcher", dept: "Design", applicants: 19, new: 3, match90: 1, posted: "Mar 10" },
  { title: "Product Manager", dept: "Product", applicants: 9, new: 1, match90: 0, posted: "Mar 14" },
];

const TOP_CANDIDATES = [
  { name: "Sharon Lee", role: "Product Designer", match: 96, status: "Interview scheduled", initial: "S" },
  { name: "James Chen", role: "Frontend Engineer", match: 94, status: "Screening complete", initial: "J" },
  { name: "Priya Patel", role: "Data Scientist", match: 92, status: "Interview scheduled", initial: "P" },
];

export function EdgeEmployerDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  return (
    <RoleShell role="employer" userName="Rachel" userInitial="R" edgeGas={50} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good morning, Rachel
        </h1>
        <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
          14 new applicants today · 5 interviews this week
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="mb-5"><KPIRow kpis={KPIS} /></div>

      {/* Hiring funnel */}
      <GlassCard delay={0.45} className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Hiring Pipeline</span>
          </div>
          <button onClick={() => onNavigate?.("pipeline")} className="flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
            View pipeline <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-end gap-4 h-20">
          {FUNNEL_STAGES.map((stage, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full rounded-lg"
                style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}30` }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(stage.width * 0.8, 8)}px` }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: EASE }}
              />
              <div className="text-center">
                <span className="text-[14px] text-[#E8E8ED] block tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{stage.count}</span>
                <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{stage.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Conversion: Applied → Screened <span className="text-[#22D3EE]">47%</span></span>
          <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Screened → Interview <span className="text-[#B3FF3B]">27%</span></span>
        </div>
      </GlassCard>

      {/* Two-column */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Open positions */}
          <GlassCard delay={0.55}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#10B981]" />
                <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Active Postings</span>
              </div>
              <button onClick={() => onNavigate?.("jobs")} className="text-[11px] text-[#10B981] px-2 py-1 rounded-md cursor-pointer" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.12)", fontFamily: "var(--font-body)" }}>
                + Post New Job
              </button>
            </div>
            {OPEN_JOBS.map((job, i) => (
              <div key={i} onClick={() => onNavigate?.("jobs")} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.01)] transition-colors" style={{ borderBottom: i < OPEN_JOBS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.06)" }}>
                  <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-[#E8E8ED] block truncate" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                  <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{job.dept} · Posted {job.posted}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[12px] text-[#E8E8ED] block tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{job.applicants}</span>
                    <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>applicants</span>
                  </div>
                  {job.new > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full text-[#22D3EE]" style={{ background: "rgba(34,211,238,0.08)", fontFamily: "var(--font-body)" }}>+{job.new} new</span>
                  )}
                  {job.match90 > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full text-[#B3FF3B]" style={{ background: "rgba(179,255,59,0.06)", fontFamily: "var(--font-body)" }}>{job.match90} 90%+</span>
                  )}
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="3 candidates for Product Designer scored 90%+ match. Sharon Lee's portfolio aligns strongly with your design system work. I'd prioritize her screening."
            actionLabel="Review top candidates"
            onAction={() => onNavigate?.("pipeline")}
            delay={0.6}
          />

          {/* Top candidates */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-3.5 h-3.5 text-[#B3FF3B]" />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Top Candidates</span>
            </div>
            {TOP_CANDIDATES.map((candidate, i) => (
              <div key={i} onClick={() => onNavigate?.("pipeline")} className="flex items-center gap-3 py-2.5 cursor-pointer" style={{ borderBottom: i < TOP_CANDIDATES.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(179,255,59,0.08)" }}>
                  <span className="text-[11px] text-[#B3FF3B]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{candidate.initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{candidate.name}</span>
                  <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{candidate.role} · {candidate.status}</span>
                </div>
                <span className="text-[11px] text-[#B3FF3B] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{candidate.match}%</span>
              </div>
            ))}
          </GlassCard>

          {/* Upcoming interviews */}
          <GlassCard delay={0.7}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>This Week</span>
            </div>
            {[
              { text: "Sharon Lee — Product Designer round 2", time: "Tomorrow, 10 AM" },
              { text: "James Chen — Frontend take-home review", time: "Wednesday, 2 PM" },
              { text: "Priya Patel — Data Science panel", time: "Thursday, 11 AM" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] flex-shrink-0" />
                <span className="text-[11px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                <span className="text-[10px] text-[#374151] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{item.time}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
      </div>
    </RoleShell>
  );
}