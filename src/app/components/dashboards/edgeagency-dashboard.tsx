/**
 * EdgeAgency Dashboard
 * Government workforce development: programs, placements, budget utilization.
 */

import { motion } from "motion/react";
import { RoleShell, GlassCard, type NavigateFn } from "../role-shell";
import {
  Building2, Users, BarChart3, Briefcase, ChevronRight,
  TrendingUp, Target, DollarSign, Calendar, ArrowUpRight,
} from "lucide-react";
import { EASE } from "../tokens";
import { KPIRow } from "../kpi-patterns";
import { SophiaInsight } from "../sophia-patterns";

const KPIS = [
  { label: "Active Programs", value: "3", trend: "2 regions", icon: <Building2 className="w-4 h-4" />, color: "var(--ce-role-agency)", gauge: null },
  { label: "Total Participants", value: "312", trend: "+47 this Q", icon: <Users className="w-4 h-4" />, color: "var(--ce-role-agency)", gauge: null },
  { label: "Placements", value: "89", trend: "+21 this month", icon: <Briefcase className="w-4 h-4" />, color: "var(--ce-role-agency)", gauge: null },
  { label: "Budget Utilization", value: "78%", trend: "On target", icon: <DollarSign className="w-4 h-4" />, color: "var(--ce-role-agency)", gauge: 0.78 },
];

const PROGRAMS = [
  { name: "Tech Reskilling Initiative", region: "Northeast", participants: 145, placed: 52, budget: 85, target: 100 },
  { name: "Veterans Career Transition", region: "Nationwide", participants: 98, placed: 28, budget: 72, target: 75 },
  { name: "Youth Workforce Development", region: "Midwest", participants: 69, placed: 9, budget: 64, target: 50 },
];

const REGIONAL_METRICS = [
  { region: "Northeast", participants: 145, placements: 52, rate: "36%" },
  { region: "Midwest", region2: "69 participants", placements: 69, rate: "13%" },
  { region: "Nationwide", participants: 98, placements: 28, rate: "29%" },
];

export function EdgeAgencyDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  return (
    <RoleShell role="agency" userName="Director Liu" userInitial="L" edgeGas={35} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good morning, Director Liu
        </h1>
        <p className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          3 workforce programs active · Q1 targets 78% achieved
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
                <Building2 className="w-4 h-4 text-[var(--ce-role-agency)]" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Workforce Programs</span>
              </div>
              <button onClick={() => onNavigate?.("programs")} className="flex items-center gap-1 text-[12px] text-ce-text-tertiary hover:text-ce-text-secondary transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
                Full report <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {PROGRAMS.map((prog, i) => (
              <div key={i} onClick={() => onNavigate?.("programs")} className="py-4 cursor-pointer" style={{ borderBottom: i < PROGRAMS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{prog.name}</span>
                    <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{prog.region} · {prog.participants} participants</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{prog.placed}</span>
                    <span className="text-[10px] text-ce-text-tertiary block" style={{ fontFamily: "var(--font-body)" }}>placed</span>
                  </div>
                </div>
                {/* Budget utilization bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ce-text-tertiary w-12" style={{ fontFamily: "var(--font-body)" }}>Budget</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: prog.budget > 80 ? "var(--ce-role-edgepreneur)" : "linear-gradient(90deg, var(--ce-role-agency), var(--ce-role-edgestar))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${prog.budget}%` }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <span className="text-[10px] text-ce-text-tertiary tabular-nums w-8 text-right" style={{ fontFamily: "var(--font-body)" }}>{prog.budget}%</span>
                </div>
                {/* Placement target bar */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-ce-text-tertiary w-12" style={{ fontFamily: "var(--font-body)" }}>Target</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--ce-lime), var(--ce-role-edgestar))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((prog.placed / prog.target) * 100, 100)}%` }}
                      transition={{ delay: 0.9 + i * 0.15, duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <span className="text-[10px] text-ce-text-tertiary tabular-nums w-16 text-right" style={{ fontFamily: "var(--font-body)" }}>{prog.placed}/{prog.target}</span>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Workforce jobs */}
          <GlassCard delay={0.6}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-ce-cyan" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Workforce Opportunities</span>
              </div>
              <button onClick={() => onNavigate?.("programs")} className="text-[11px] text-ce-text-tertiary hover:text-ce-text-secondary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                View all →
              </button>
            </div>
            {[
              { title: "IT Support Technician", dept: "State IT Dept", applicants: 23, type: "Government" },
              { title: "Data Entry Specialist", dept: "Dept of Labor", applicants: 18, type: "Government" },
              { title: "Community Health Worker", dept: "Health Services", applicants: 31, type: "Workforce Program" },
            ].map((job, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.dept} · {job.type}</span>
                </div>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{job.applicants} applicants</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="The Tech Reskilling Initiative is outperforming Q1 targets — 52 placements against a target of 100 with 6 weeks remaining. Budget utilization is at 85%, so resource allocation is efficient."
            actionLabel="View stakeholder report"
            onAction={() => onNavigate?.("programs")}
            delay={0.55}
          />

          {/* Key metrics */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-ce-cyan" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Q1 Performance</span>
            </div>
            {[
              { label: "Overall placement rate", value: "29%", trend: "+7%" },
              { label: "Avg time to placement", value: "38 days", trend: "-12 days" },
              { label: "Participant retention", value: "87%", trend: "+3%" },
              { label: "Cost per placement", value: "$2,140", trend: "-$340" },
              { label: "Employer satisfaction", value: "4.6/5", trend: "+0.3" },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 4 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{metric.value}</span>
                  <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>{metric.trend}</span>
                </div>
              </div>
            ))}
          </GlassCard>

          {/* Upcoming */}
          <GlassCard delay={0.7}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Upcoming</span>
            </div>
            {[
              { text: "Q1 Stakeholder Review", date: "March 28" },
              { text: "Youth Program orientation", date: "April 1" },
              { text: "Grant renewal deadline", date: "April 15" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-agency)] flex-shrink-0" />
                <span className="text-[11px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
      </div>
    </RoleShell>
  );
}