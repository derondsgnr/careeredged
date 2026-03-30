import { EASE } from "../tokens";
/**
 * Programs Surface — EdgeNGO (primary), EdgeAgency (secondary)
 * All dead ends fixed: New Program, Reach Out, program cards, participant rows,
 * grant drawer actions, contextual Sophia bottom bar.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { useSophia } from "../sophia-context";
import { toast } from "../ui/feedback";
import { FormattedNumberInput } from "../ui/formatted-number-input";
import { EmptyState, SkeletonCard, BannerAlert } from "../ui/feedback";
import {
  Users, TrendingUp, DollarSign, Check,
  ChevronRight, X, ArrowRight, Plus, Calendar,
  AlertCircle, FileText, Zap, BookOpen, Trash2, Edit3,
  Send, Clock, Loader2,
} from "lucide-react";

const ROLE_ACCENT: Record<string, string> = {
  ngo:    "var(--ce-role-ngo)",
  agency: "var(--ce-role-agency)",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface Program {
  id: string;
  title: string;
  status: "active" | "enrolling" | "complete" | "draft";
  cohort: string;
  participants: number;
  capacity: number;
  startDate: string;
  endDate: string;
  phase: string;
  placementRate: number;
  fundedBy?: string;
  budget: string;
  sophiaNote: string;
}

interface Grant {
  id: string;
  title: string;
  funder: string;
  amount: string;
  deadline: string;
  status: "open" | "applied" | "funded" | "rejected" | "submitted" | "under_review";
  match: number;
  category: string;
  sophiaNote: string;
  daysUntil?: number;
}

interface Participant {
  id: string;
  name: string;
  initial: string;
  program: string;
  phase: number;
  readiness: number;
  lastActive: string;
  status: "on_track" | "at_risk" | "ahead";
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROGRAMS_DATA: Program[] = [
  {
    id: "p1", title: "Workforce Re-entry Cohort — Spring 2026", status: "active", cohort: "Spring 2026",
    participants: 42, capacity: 50, startDate: "Jan 15, 2026", endDate: "Jun 30, 2026",
    phase: "Phase 2 — Skill Building", placementRate: 68, fundedBy: "DOL Workforce Innovation Grant",
    budget: "$84,000",
    sophiaNote: "68% of participants are on track. 8 participants flagged at-risk — 5 haven't logged in for 10+ days. Sophia recommends a direct outreach sequence for these 8.",
  },
  {
    id: "p2", title: "Tech Career Pathways — Q1 2026", status: "complete", cohort: "Q1 2026",
    participants: 38, capacity: 40, startDate: "Oct 1, 2025", endDate: "Dec 31, 2025",
    phase: "Completed", placementRate: 79, fundedBy: "State WIOA Allocation",
    budget: "$62,000",
    sophiaNote: "79% placement rate — 7 points above national average. 30 of 38 participants placed within 90 days. Strong data for grant renewal applications.",
  },
  {
    id: "p3", title: "Youth Employment Accelerator — Summer 2026", status: "enrolling", cohort: "Summer 2026",
    participants: 18, capacity: 60, startDate: "Jun 1, 2026", endDate: "Aug 31, 2026",
    phase: "Pre-enrollment", placementRate: 0, budget: "$110,000",
    sophiaNote: "Enrollment is at 30% capacity with 12 weeks until start. Sophia recommends targeted outreach to the 24 students in your pipeline who fit the age and eligibility criteria.",
  },
];

const GRANTS: Grant[] = [
  { id: "g1", title: "DOL Workforce Innovation Opportunity Act Grant", funder: "Department of Labor", amount: "$250,000", deadline: "April 15, 2026", status: "applied", match: 92, category: "Federal", daysUntil: 28, sophiaNote: "Your application is 88% complete. The missing element is the 24-month outcomes narrative — Sophia can draft this from your Q1 placement data." },
  { id: "g2", title: "State Workforce Development Block Grant", funder: "State Labor Department", amount: "$85,000", deadline: "March 31, 2026", status: "open", match: 87, category: "State", daysUntil: 13, sophiaNote: "Strong fit based on your Tech Career Pathways outcomes (79% placement). Application structure is similar to the WIOA grant — 60% of the work is reusable." },
  { id: "g3", title: "JPMorgan Chase Workforce Ready Grant", funder: "JPMorgan Chase Foundation", amount: "$50,000", deadline: "May 1, 2026", status: "open", match: 78, category: "Foundation", daysUntil: 44, sophiaNote: "Good match for the tech pathways program. JPMorgan prioritizes digital skills and underrepresented populations — align your application narrative to these criteria." },
  { id: "g4", title: "Google.org Career Readiness Initiative", funder: "Google.org", amount: "$120,000", deadline: "Dec 1, 2025", status: "funded", match: 96, category: "Foundation", sophiaNote: "Funded in Dec 2025. $120k allocated to Tech Career Pathways program. Renewal application opens October 2026 — Sophia will set a reminder." },
  { id: "g5", title: "City Workforce Innovation Fund", funder: "City of [Redacted]", amount: "$35,000", deadline: "Nov 15, 2025", status: "rejected", match: 72, category: "Municipal", sophiaNote: "Feedback from the rejection: strong outcomes data but narrative didn't align with the city's priority sectors. Consider for 2026 cycle with adjusted framing." },
];

const PARTICIPANTS: Participant[] = [
  { id: "pt1", name: "Marcus T.",   initial: "M", program: "Workforce Re-entry",  phase: 2, readiness: 72, lastActive: "Today",       status: "on_track" },
  { id: "pt2", name: "Yolanda R.", initial: "Y", program: "Workforce Re-entry",  phase: 2, readiness: 88, lastActive: "Today",       status: "ahead"    },
  { id: "pt3", name: "Deon P.",    initial: "D", program: "Workforce Re-entry",  phase: 1, readiness: 41, lastActive: "12 days ago", status: "at_risk"  },
  { id: "pt4", name: "Sofia M.",   initial: "S", program: "Workforce Re-entry",  phase: 2, readiness: 65, lastActive: "Yesterday",   status: "on_track" },
  { id: "pt5", name: "James K.",   initial: "J", program: "Workforce Re-entry",  phase: 1, readiness: 38, lastActive: "14 days ago", status: "at_risk"  },
  { id: "pt6", name: "Nadia L.",   initial: "N", program: "Youth Employment",    phase: 1, readiness: 55, lastActive: "3 days ago",  status: "on_track" },
];

const GRANT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:         { label: "Open",          color: "var(--ce-role-edgestar)" },
  applied:      { label: "Applied",       color: "var(--ce-role-edgepreneur)" },
  funded:       { label: "Funded",        color: "var(--ce-lime)" },
  rejected:     { label: "Rejected",      color: "var(--ce-text-secondary)" },
  submitted:    { label: "Submitted",     color: "var(--ce-role-edgepreneur)" },
  under_review: { label: "Under review",  color: "var(--ce-role-guide)" },
};

// ─── Grant Detail Drawer ──────────────────────────────────────────────────────

function GrantDrawer({ grant, accent, onClose, onApply }: { grant: Grant; accent: string; onClose: () => void; onApply?: (g: Grant) => void }) {
  const { openSophia } = useSophia();
  const cfg = GRANT_STATUS_CONFIG[grant.status];
  return (
    <motion.div className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex-1 min-w-0 pr-3">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full mb-1.5 inline-block" style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}20`, fontFamily: "var(--font-body)" }}>{cfg.label}</span>
          <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{grant.title}</span>
          <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{grant.funder}</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          {[
            { label: "Amount",   value: grant.amount },
            { label: "Deadline", value: grant.deadline },
            { label: "Category", value: grant.category },
            { label: "Match",    value: `${grant.match}% fit` },
          ].map((row, i) => (
            <div key={i} className="flex justify-between py-1.5" style={{ borderBottom: i < 3 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
              <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-1.5 mb-2">
            <SophiaMark size={12} glowing={false} />
            <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's read</span>
          </div>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{grant.sophiaNote}</p>
        </div>
      </div>
      <div className="px-5 py-4 flex gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {grant.status === "open" && (
          <button
            onClick={() => { if (onApply) { onApply(grant); onClose(); } else { openSophia(`Help me start the grant application for "${grant.title}" from ${grant.funder}. Amount: ${grant.amount}, deadline: ${grant.deadline}. Sophia noted: ${grant.sophiaNote}`); } }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <FileText className="w-3.5 h-3.5" /> Start application
          </button>
        )}
        {(grant.status === "submitted" || grant.status === "under_review") && (
          <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px]"
            style={{ background: `${GRANT_STATUS_CONFIG[grant.status].color}08`, border: `1px solid ${GRANT_STATUS_CONFIG[grant.status].color}18`, color: GRANT_STATUS_CONFIG[grant.status].color, fontFamily: "var(--font-body)" }}>
            {grant.status === "under_review" ? <Clock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />} {GRANT_STATUS_CONFIG[grant.status].label}
          </div>
        )}
        {grant.status === "applied" && (
          <button
            onClick={() => openSophia(`Help me continue my in-progress application for "${grant.title}" from ${grant.funder}. Deadline: ${grant.deadline}. Sophia noted: ${grant.sophiaNote}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.1)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.2)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <FileText className="w-3.5 h-3.5" /> Continue application
          </button>
        )}
        <button
          onClick={() => openSophia(`I'm working on "${grant.title}" — ${grant.sophiaNote} What should I focus on to maximize our chances?`)}
          className="px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[rgba(var(--ce-lime-rgb),0.06)] transition-colors"
          style={{ border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}>
          <Zap className="w-3.5 h-3.5 text-ce-lime" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Program Detail Drawer ────────────────────────────────────────────────────

function ProgramDrawer({ program, accent, onClose, onViewParticipants }: {
  program: Program; accent: string; onClose: () => void; onViewParticipants: () => void;
}) {
  const { openSophia } = useSophia();
  const statusColor = program.status === "active" ? accent : program.status === "enrolling" ? "var(--ce-role-edgestar)" : program.status === "complete" ? "var(--ce-lime)" : "var(--ce-text-quaternary)";
  const statusLabel = program.status === "active" ? "Active" : program.status === "enrolling" ? "Enrolling" : program.status === "complete" ? "Complete" : "Draft";
  const fillPct = (program.participants / program.capacity) * 100;

  return (
    <motion.div className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex-1 min-w-0 pr-3">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full mb-1.5 inline-block" style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}20`, fontFamily: "var(--font-body)" }}>{statusLabel}</span>
          <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{program.title}</span>
          {program.fundedBy && <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{program.fundedBy}</span>}
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>Enrollment: {program.participants}/{program.capacity}</span>
            <span className="text-[11px] tabular-nums" style={{ color: statusColor, fontFamily: "var(--font-body)" }}>{Math.round(fillPct)}% full</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
            <motion.div className="h-full rounded-full" style={{ background: statusColor }}
              initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }} />
          </div>
          {([
            { label: "Phase",    value: program.phase },
            { label: "Start",   value: program.startDate },
            { label: "End",     value: program.endDate },
            { label: "Budget",  value: program.budget },
            ...(program.placementRate > 0 ? [{ label: "Placement rate", value: `${program.placementRate}%` }] : []),
          ] as { label: string; value: string }[]).map((row, i, arr) => (
            <div key={i} className="flex justify-between py-1.5" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
              <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-1.5 mb-2">
            <SophiaMark size={12} glowing={false} />
            <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's read</span>
          </div>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{program.sophiaNote}</p>
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <button onClick={onViewParticipants}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
          <Users className="w-3.5 h-3.5" /> View participants
        </button>
        <button
          onClick={() => openSophia(`Analyze the program "${program.title}": ${program.participants}/${program.capacity} enrolled, ${program.phase}. ${program.sophiaNote} What are the top 3 actions I should take right now?`)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.06)] transition-colors"
          style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>
          <SophiaMark size={12} glowing={false} /> Ask Sophia about this program
        </button>
      </div>
    </motion.div>
  );
}

// ─── Create Program Panel ─────────────────────────────────────────────────────

function CreateProgramPanel({ accent, onClose, onCreated }: { accent: string; onClose: () => void; onCreated: (p: Program) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", type: "Workforce Re-entry", cohort: "", startDate: "", endDate: "", capacity: "", fundedBy: "", budget: "" });
  const steps = ["Program basics", "Timeline", "Capacity & funding", "Review & create"];
  const PROGRAM_TYPES = ["Workforce Re-entry", "Tech Career Pathways", "Youth Employment", "Digital Skills", "Career Transition", "Other"];

  const handleCreate = () => {
    const newProg: Program = {
      id: `p${Date.now()}`, title: form.title || "New Program", status: "draft",
      cohort: form.cohort || "TBD", participants: 0, capacity: parseInt(form.capacity) || 50,
      startDate: form.startDate || "TBD", endDate: form.endDate || "TBD", phase: "Pre-enrollment",
      placementRate: 0, fundedBy: form.fundedBy || undefined, budget: form.budget || "TBD",
      sophiaNote: "Sophia will generate participant predictions and grant match recommendations after creation.",
    };
    onCreated(newProg);
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div className="relative w-full max-w-[520px] rounded-2xl overflow-hidden"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <div>
            <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Create Program</span>
            <div className="flex items-center gap-2 mt-1">
              {steps.map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: i <= step ? `${accent}18` : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${i <= step ? `${accent}40` : "rgba(var(--ce-glass-tint),0.08)"}` }}>
                    {i < step ? <Check className="w-2 h-2" style={{ color: accent }} /> : <span className="text-[7px]" style={{ color: i === step ? accent : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>{i + 1}</span>}
                  </div>
                  {i < steps.length - 1 && <div className="w-4 h-px" style={{ background: i < step ? `${accent}40` : "rgba(var(--ce-glass-tint),0.06)" }} />}
                </div>
              ))}
              <span className="text-[10px] text-[var(--ce-text-secondary)] ml-1" style={{ fontFamily: "var(--font-body)" }}>{steps[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>

        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROGRAM TITLE</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Workforce Re-entry Cohort — Fall 2026"
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROGRAM TYPE</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PROGRAM_TYPES.map((type) => (
                      <button key={type} onClick={() => setForm({ ...form, type })}
                        className="px-3 py-2.5 rounded-xl cursor-pointer text-[10px] text-left transition-all"
                        style={{ background: form.type === type ? `${accent}10` : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${form.type === type ? `${accent}25` : "rgba(var(--ce-glass-tint),0.06)"}`, color: form.type === type ? accent : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>COHORT NAME</label>
                  <input value={form.cohort} onChange={(e) => setForm({ ...form, cohort: e.target.value })} placeholder="e.g. Fall 2026"
                    className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>START DATE</label>
                    <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] outline-none"
                      style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)", colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>END DATE</label>
                    <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] outline-none"
                      style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)", colorScheme: "dark" }} />
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PARTICIPANT CAPACITY</label>
                  <FormattedNumberInput value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} placeholder="50"
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>FUNDING SOURCE (optional)</label>
                  <input value={form.fundedBy} onChange={(e) => setForm({ ...form, fundedBy: e.target.value })} placeholder="e.g. WIOA, State block grant..."
                    className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>BUDGET</label>
                  <FormattedNumberInput
                    value={form.budget}
                    onChange={(value) => setForm({ ...form, budget: value })}
                    placeholder="$75,000"
                    className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }}
                  />
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-3">
                <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                  {[
                    { label: "Title",    value: form.title    || "(untitled)" },
                    { label: "Type",     value: form.type },
                    { label: "Cohort",   value: form.cohort   || "TBD" },
                    { label: "Start",    value: form.startDate || "TBD" },
                    { label: "End",      value: form.endDate   || "TBD" },
                    { label: "Capacity", value: form.capacity  ? `${form.capacity} participants` : "TBD" },
                    { label: "Budget",   value: form.budget    || "TBD" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: i < 6 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}>
                      <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
                      <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Saved as draft. Sophia will suggest matching grants and forecast enrollment after creation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
              Back
            </button>
          )}
          <button onClick={step < 3 ? () => setStep(step + 1) : handleCreate}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {step < 3 ? <><ArrowRight className="w-3.5 h-3.5" /> Continue</> : <><Check className="w-3.5 h-3.5" /> Create program</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Needs Attention Row (Sophia-powered Reach Out) ───────────────────────────

function AtRiskRow({ item, accent, isLast }: { item: { name: string; issue: string; severity: string }; accent: string; isLast: boolean }) {
  const { openSophia } = useSophia();
  return (
    <div className="flex items-center gap-2.5 py-2" style={{ borderBottom: !isLast ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.severity === "high" ? "var(--ce-status-error)" : "var(--ce-role-edgepreneur)" }} />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{item.name}</span>
        <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{item.issue}</span>
      </div>
      <button
        onClick={() => openSophia(`Draft a warm, non-judgmental re-engagement message for program participant ${item.name} who has been ${item.issue.toLowerCase()}. Keep it encouraging and short — 2–3 sentences max.`)}
        className="text-[10px] cursor-pointer hover:underline transition-colors flex-shrink-0"
        style={{ color: accent, fontFamily: "var(--font-body)" }}>
        Reach out
      </button>
    </div>
  );
}

// ─── Participant Row (Sophia-powered click) ───────────────────────────────────

function ParticipantRow({ p, accent, isLast }: { p: Participant; accent: string; isLast: boolean }) {
  const { openSophia } = useSophia();
  const statusColor = p.status === "ahead" ? "var(--ce-lime)" : p.status === "at_risk" ? "var(--ce-status-error)" : "var(--ce-role-edgestar)";
  const statusLabel = p.status === "ahead" ? "Ahead" : p.status === "at_risk" ? "At risk" : "On track";
  return (
    <motion.div
      className="grid px-4 py-3 items-center hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors"
      style={{ gridTemplateColumns: "1fr 120px 80px 80px 80px", borderBottom: !isLast ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none", gap: 12 }}
      onClick={() => openSophia(`Tell me about participant ${p.name} in the ${p.program} program. Phase ${p.phase}, ${p.readiness}% readiness, status: ${statusLabel}, last active: ${p.lastActive}. What should I do to support them?`)}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] flex-shrink-0"
          style={{ background: `${accent}12`, color: accent, fontFamily: "var(--font-display)", fontWeight: 600 }}>{p.initial}</div>
        <div>
          <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{p.name}</span>
          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Last: {p.lastActive}</span>
        </div>
      </div>
      <span className="text-[10px] text-[var(--ce-text-secondary)] truncate" style={{ fontFamily: "var(--font-body)" }}>{p.program}</span>
      <span className="text-[12px] text-[var(--ce-text-tertiary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>Phase {p.phase}</span>
      <span className="text-[12px] tabular-nums" style={{ color: p.readiness >= 70 ? "var(--ce-lime)" : p.readiness >= 50 ? "var(--ce-role-edgepreneur)" : "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{p.readiness}%</span>
      <span className="text-[10px] px-2 py-0.5 rounded-full w-fit" style={{ background: `${statusColor}10`, color: statusColor, border: `1px solid ${statusColor}20`, fontFamily: "var(--font-body)" }}>{statusLabel}</span>
    </motion.div>
  );
}

// ─── Participant Row with Remove ─────────────────────────────────────────────

function ParticipantRowWithRemove({ p, accent, isLast, onRemove }: { p: Participant; accent: string; isLast: boolean; onRemove: () => void }) {
  const { openSophia } = useSophia();
  const statusColor = p.status === "ahead" ? "var(--ce-lime)" : p.status === "at_risk" ? "var(--ce-status-error)" : "var(--ce-role-edgestar)";
  const statusLabel = p.status === "ahead" ? "Ahead" : p.status === "at_risk" ? "At risk" : "On track";
  return (
    <motion.div
      className="grid px-4 py-3 items-center hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors group/row"
      style={{ gridTemplateColumns: "1fr 120px 80px 80px 80px 50px", borderBottom: !isLast ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none", gap: 12 }}
      onClick={() => openSophia(`Tell me about participant ${p.name} in the ${p.program} program. Phase ${p.phase}, ${p.readiness}% readiness, status: ${statusLabel}, last active: ${p.lastActive}. What should I do to support them?`)}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] flex-shrink-0"
          style={{ background: `${accent}12`, color: accent, fontFamily: "var(--font-display)", fontWeight: 600 }}>{p.initial}</div>
        <div>
          <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{p.name}</span>
          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Last: {p.lastActive}</span>
        </div>
      </div>
      <span className="text-[10px] text-[var(--ce-text-secondary)] truncate" style={{ fontFamily: "var(--font-body)" }}>{p.program}</span>
      <span className="text-[12px] text-[var(--ce-text-tertiary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>Phase {p.phase}</span>
      <span className="text-[12px] tabular-nums" style={{ color: p.readiness >= 70 ? "var(--ce-lime)" : p.readiness >= 50 ? "var(--ce-role-edgepreneur)" : "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{p.readiness}%</span>
      <span className="text-[10px] px-2 py-0.5 rounded-full w-fit" style={{ background: `${statusColor}10`, color: statusColor, border: `1px solid ${statusColor}20`, fontFamily: "var(--font-body)" }}>{statusLabel}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer opacity-0 group-hover/row:opacity-100 transition-all hover:bg-[rgba(var(--ce-status-error-rgb),0.08)]"
        aria-label={`Remove ${p.name}`}>
        <Trash2 className="w-3 h-3 text-[var(--ce-text-quaternary)] hover:text-[var(--ce-status-error)] transition-colors" />
      </button>
    </motion.div>
  );
}

// ─── Enrollment Modal ────────────────────────────────────────────────────────

function EnrollmentModal({ program, accent, onClose, onEnroll }: {
  program: Program; accent: string; onClose: () => void; onEnroll: (programId: string) => void;
}) {
  const spotsLeft = program.capacity - program.participants;
  const canEnroll = spotsLeft > 0 && program.status === "enrolling";

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Enroll in program</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>
        <div className="px-5 py-5">
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
            <span className="text-[13px] text-[var(--ce-text-primary)] block mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{program.title}</span>
            <span className="text-[11px] text-[var(--ce-text-secondary)] block mb-2" style={{ fontFamily: "var(--font-body)" }}>{program.cohort} · {program.startDate} – {program.endDate}</span>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>Capacity</span>
              <span className="text-[11px] text-[var(--ce-text-primary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{program.participants}/{program.capacity} ({spotsLeft} spots left)</span>
            </div>
          </div>
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
            <SophiaMark size={12} glowing={false} />
            <p className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed flex-1" style={{ fontFamily: "var(--font-body)" }}>
              {canEnroll
                ? `This program has ${spotsLeft} spots remaining. Based on your current pipeline, enrollment will bring you to ${Math.round(((program.participants + 1) / program.capacity) * 100)}% capacity — well within range for effective cohort facilitation.`
                : spotsLeft <= 0
                  ? "This program is at full capacity. Sophia recommends adding this participant to the waitlist or enrolling in the next cohort."
                  : "This program is not currently accepting enrollments. The enrollment window opens during the Pre-enrollment phase."}
            </p>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button onClick={() => { onEnroll(program.id); onClose(); }}
            disabled={!canEnroll}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: canEnroll ? `${accent}12` : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${canEnroll ? `${accent}25` : "rgba(var(--ce-glass-tint),0.08)"}`, color: canEnroll ? accent : "var(--ce-text-quaternary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Check className="w-3.5 h-3.5" /> {canEnroll ? "Confirm enrollment" : "Cannot enroll"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Grant Application Panel ─────────────────────────────────────────────────

function GrantApplicationPanel({ grant, accent, onClose, onSubmit }: {
  grant: Grant; accent: string; onClose: () => void; onSubmit: (grantId: string) => void;
}) {
  const [form, setForm] = useState({ narrative: "", budget: "", timeline: "", impact: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    onSubmit(grant.id);
    toast.success("Application submitted", `Your application for ${grant.title} has been submitted successfully.`);
    setTimeout(() => onClose(), 300);
  };

  const isValid = form.narrative.length > 10 && form.budget && form.timeline && form.impact.length > 10;

  return (
    <motion.div className="fixed top-0 right-0 bottom-0 w-[440px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div>
          <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Grant Application</span>
          <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{grant.title}</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
          <SophiaMark size={12} glowing={false} />
          <p className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed flex-1" style={{ fontFamily: "var(--font-body)" }}>
            {grant.sophiaNote}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROJECT NARRATIVE</label>
            <textarea value={form.narrative} onChange={(e) => setForm({ ...form, narrative: e.target.value })}
              placeholder="Describe the program goals, target population, and delivery approach..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none resize-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>BUDGET AMOUNT REQUESTED</label>
            <FormattedNumberInput value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} placeholder="$85,000"
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROJECT TIMELINE</label>
            <input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              placeholder="e.g. 12 months — Jan 2026 to Dec 2026"
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>IMPACT STATEMENT</label>
            <textarea value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })}
              placeholder="Describe expected outcomes, measurement approach, and community impact..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none resize-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
          </div>
        </div>
      </div>
      <div className="px-5 py-4 flex gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
          style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>Cancel</button>
        <button onClick={handleSubmit} disabled={!isValid || submitting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: isValid ? `${accent}12` : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${isValid ? `${accent}25` : "rgba(var(--ce-glass-tint),0.08)"}`, color: isValid ? accent : "var(--ce-text-quaternary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Submit application
        </button>
      </div>
    </motion.div>
  );
}

// ─── Add Participant Form ────────────────────────────────────────────────────

function AddParticipantModal({ accent, onClose, onAdd }: {
  accent: string; onClose: () => void; onAdd: (p: Participant) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const PROGRAM_OPTIONS = ["Workforce Re-entry", "Youth Employment", "Tech Career Pathways"];
  const [program, setProgram] = useState(PROGRAM_OPTIONS[0]);

  const handleAdd = () => {
    const newP: Participant = {
      id: `pt${Date.now()}`,
      name: name || "New Participant",
      initial: (name || "N").charAt(0).toUpperCase(),
      program,
      phase: 1,
      readiness: 0,
      lastActive: "Just added",
      status: "on_track",
    };
    onAdd(newP);
    toast.success("Participant added", `${newP.name} has been added to ${program}.`);
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Add participant</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>FULL NAME</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Rivera"
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ROLE / NOTES</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Career changer, referred by partner org"
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROGRAM</label>
            <div className="flex flex-col gap-1.5">
              {PROGRAM_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setProgram(opt)}
                  className="px-3 py-2.5 rounded-xl cursor-pointer text-[11px] text-left transition-all"
                  style={{ background: program === opt ? `${accent}10` : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${program === opt ? `${accent}25` : "rgba(var(--ce-glass-tint),0.06)"}`, color: program === opt ? accent : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button onClick={handleAdd} disabled={!name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: name.trim() ? `${accent}12` : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${name.trim() ? `${accent}25` : "rgba(var(--ce-glass-tint),0.08)"}`, color: name.trim() ? accent : "var(--ce-text-quaternary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Plus className="w-3.5 h-3.5" /> Add participant
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Remove Participant Confirm ──────────────────────────────────────────────

function RemoveParticipantModal({ participant, accent, onClose, onConfirm }: {
  participant: Participant; accent: string; onClose: () => void; onConfirm: (id: string) => void;
}) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div className="relative w-full max-w-[380px] rounded-2xl overflow-hidden"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} transition={{ duration: 0.3, ease: EASE }}>
        <div className="px-5 py-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-status-error-rgb),0.1)", border: "1px solid rgba(var(--ce-status-error-rgb),0.15)" }}>
              <Trash2 className="w-4 h-4 text-[var(--ce-status-error)]" />
            </div>
            <div>
              <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Remove participant</span>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>This action cannot be undone</span>
            </div>
          </div>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
            Are you sure you want to remove <strong className="text-[var(--ce-text-primary)]">{participant.name}</strong> from the {participant.program} program? Their progress data will be archived.
          </p>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button onClick={() => { onConfirm(participant.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: "rgba(var(--ce-status-error-rgb),0.1)", border: "1px solid rgba(var(--ce-status-error-rgb),0.2)", color: "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ProgramsSurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = (["ngo", "agency"].includes(roleParam ?? "") ? roleParam : "ngo") as string;
  const accent = ROLE_ACCENT[role] ?? "var(--ce-role-ngo)";

  const [tab, setTab] = useState<"programs" | "grants" | "participants">("programs");
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS_DATA);
  const [grants, setGrants] = useState<Grant[]>(GRANTS);
  const [participants, setParticipants] = useState<Participant[]>(PARTICIPANTS);

  // New modal states
  const [enrollProgram, setEnrollProgram] = useState<Program | null>(null);
  const [grantAppTarget, setGrantAppTarget] = useState<Grant | null>(null);
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [removeParticipant, setRemoveParticipant] = useState<Participant | null>(null);

  // Enrollment handler
  const handleEnroll = (programId: string) => {
    setPrograms((prev) => prev.map((p) => {
      if (p.id !== programId) return p;
      const updated = { ...p, participants: p.participants + 1 };
      toast.success("Enrolled successfully", `New participant added to ${p.title}. ${updated.capacity - updated.participants} spots remaining.`);
      return updated;
    }));
  };

  // Grant application submit handler with status progression
  const handleGrantSubmit = (grantId: string) => {
    setGrants((prev) => prev.map((g) => {
      if (g.id !== grantId) return g;
      return { ...g, status: "submitted" as const };
    }));
    // Simulate "under review" after 2 seconds
    setTimeout(() => {
      setGrants((prev) => prev.map((g) => {
        if (g.id !== grantId) return g;
        if (g.status !== "submitted") return g;
        toast.info("Status update", `Your application for "${g.title}" is now under review.`);
        return { ...g, status: "under_review" as const };
      }));
    }, 2000);
  };

  // Add participant handler
  const handleAddParticipant = (p: Participant) => {
    setParticipants((prev) => [...prev, p]);
  };

  // Remove participant handler
  const handleRemoveParticipant = (id: string) => {
    const p = participants.find((pt) => pt.id === id);
    setParticipants((prev) => prev.filter((pt) => pt.id !== id));
    if (p) toast.success("Participant removed", `${p.name} has been removed and their data archived.`);
  };

  const handleNavigate = (target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`, programs: `/${role}/programs`, analytics: `/${role}/analytics`,
      messages: `/${role}/messages`, events: `/${role}/events`, landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  const totalParticipants = programs.filter(p => p.status === "active").reduce((a, p) => a + p.participants, 0);
  const fundedGrants = grants.filter(g => g.status === "funded");
  const openGrants = grants.filter(g => g.status === "open" || g.status === "applied");

  // Contextual bottom bar — updates based on what is selected / which tab is active
  const sophiaOverride = selectedGrant
    ? {
        message: `${selectedGrant.title} — ${selectedGrant.match}% match · ${selectedGrant.amount}`,
        chips: [
          { label: "Help with application", action: `Help me ${selectedGrant.status === "applied" ? "continue" : "start"} the application for "${selectedGrant.title}". ${selectedGrant.sophiaNote}` },
          { label: "Deadline strategy", action: `The deadline for "${selectedGrant.title}" is ${selectedGrant.deadline}. What's the best way to structure our time to submit a strong application?` },
        ],
      }
    : selectedProgram
    ? {
        message: `${selectedProgram.title} — ${selectedProgram.participants}/${selectedProgram.capacity} enrolled`,
        chips: [
          { label: "Analyze program", action: `Analyze "${selectedProgram.title}": ${selectedProgram.sophiaNote} What actions should I take?` },
          { label: "At-risk participants", action: `Which participants in "${selectedProgram.title}" are at risk and what should I do to re-engage them?` },
        ],
      }
    : tab === "grants"
    ? {
        message: `${openGrants.length} open grants — up to $205k available`,
        chips: [
          { label: "Best grant to apply", action: "Which open grant should I prioritize and why? Compare fit and effort." },
          { label: "Complete WIOA app", action: "Help me finish the WIOA grant application — what's missing?" },
        ],
      }
    : tab === "participants"
    ? {
        message: `2 participants at risk — 12 and 14 days inactive`,
        chips: [
          { label: "Re-engagement plan", action: "Which participants are most at risk of dropping out and what's the best re-engagement strategy?" },
          { label: "Progress summary", action: "Give me a summary of overall participant progress across all programs this quarter." },
        ],
      }
    : {
        message: "WIOA grant deadline in 28 days — application is 88% complete",
        chips: [
          { label: "Complete application", action: "Help me finish the WIOA grant application — what's missing?" },
          { label: "At-risk participants", action: "Which program participants are at risk of dropping out?" },
        ],
      };

  return (
    <RoleShell role={role as any} userName="Maria" userInitial="M" edgeGas={38} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[22px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Programs & Grants</h1>
            <p className="text-[13px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              {programs.filter(p => p.status === "active").length} active programs · {openGrants.length} open grants
            </p>
          </div>
          <button onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Plus className="w-3.5 h-3.5" /> New program
          </button>
        </motion.div>

        {/* KPI strip */}
        <motion.div className="grid grid-cols-4 gap-3 mb-5"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}>
          {[
            { label: "Active participants",  value: totalParticipants, color: accent },
            { label: "Avg placement rate",   value: `${Math.round(programs.filter(p => p.placementRate > 0).reduce((a, p) => a + p.placementRate, 0) / Math.max(programs.filter(p => p.placementRate > 0).length, 1))}%`, color: "var(--ce-lime)" },
            { label: "Grants funded",        value: `$${fundedGrants.reduce((a, g) => a + parseInt(g.amount.replace(/\D/g, "")), 0).toLocaleString()}`, color: "var(--ce-role-edgestar)" },
            { label: "Open applications",    value: openGrants.length, color: "var(--ce-role-edgepreneur)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl px-4 py-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <div className="text-[22px] tabular-nums mb-0.5" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{stat.value}</div>
              <div className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div className="flex items-center gap-1 mb-5 p-0.5 rounded-lg w-fit"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          {(["programs", "grants", "participants"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-all capitalize"
              style={{ background: tab === t ? "rgba(var(--ce-glass-tint),0.08)" : "transparent", color: tab === t ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
              {t}
            </button>
          ))}
        </motion.div>

        {/* Main layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
          <div>
            <AnimatePresence mode="wait">
              {/* Programs tab */}
              {tab === "programs" && (
                <motion.div key="programs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                  {programs.map((prog, i) => {
                    const fillPct = (prog.participants / prog.capacity) * 100;
                    const statusColor = prog.status === "active" ? accent : prog.status === "enrolling" ? "var(--ce-role-edgestar)" : prog.status === "complete" ? "var(--ce-lime)" : "var(--ce-text-quaternary)";
                    const statusLabel = prog.status === "active" ? "Active" : prog.status === "enrolling" ? "Enrolling" : prog.status === "complete" ? "Complete" : "Draft";
                    return (
                      <motion.div key={prog.id} className="rounded-xl p-4 cursor-pointer group"
                        style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: `1px solid ${prog.status === "active" ? `${accent}10` : "rgba(var(--ce-glass-tint),0.05)"}` }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3, ease: EASE }}
                        whileHover={{ y: -1 }} onClick={() => setSelectedProgram(prog)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}20`, fontFamily: "var(--font-body)" }}>{statusLabel}</span>
                              {prog.fundedBy && <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{prog.fundedBy}</span>}
                            </div>
                            <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{prog.title}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[12px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{prog.budget}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-[var(--ce-text-quaternary)] mb-3">
                          <div className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{prog.participants}/{prog.capacity}</div>
                          <div className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{prog.startDate} – {prog.endDate}</div>
                          {prog.placementRate > 0 && <div className="flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />{prog.placementRate}% placed</div>}
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{prog.phase}</span>
                            <span className="text-[10px] tabular-nums" style={{ color: statusColor, fontFamily: "var(--font-body)" }}>{Math.round(fillPct)}% full</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                            <motion.div className="h-full rounded-full" style={{ background: statusColor }}
                              initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ delay: 0.4, duration: 0.6, ease: EASE }} />
                          </div>
                        </div>
                        <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.02)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.05)" }}>
                          <SophiaMark size={11} glowing={false} />
                          <p className="text-[10px] text-[var(--ce-text-secondary)] leading-relaxed flex-1" style={{ fontFamily: "var(--font-body)" }}>{prog.sophiaNote}</p>
                        </div>
                        {prog.status === "enrolling" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setEnrollProgram(prog); }}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] cursor-pointer transition-all active:scale-[0.98]"
                            style={{ background: `${accent}08`, border: `1px solid ${accent}18`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                            <Plus className="w-3 h-3" /> Enroll participant
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Grants tab */}
              {tab === "grants" && (
                <motion.div key="grants" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2.5">
                  {grants.map((grant, i) => {
                    const cfg = GRANT_STATUS_CONFIG[grant.status];
                    return (
                      <motion.div key={grant.id} className="rounded-xl p-4 cursor-pointer group"
                        style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: `1px solid ${grant.status === "applied" ? "rgba(var(--ce-role-edgepreneur-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.05)"}` }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                        onClick={() => setSelectedGrant(grant)} whileHover={{ y: -1 }}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}20`, fontFamily: "var(--font-body)" }}>{cfg.label}</span>
                              <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{grant.category}</span>
                              {grant.daysUntil !== undefined && grant.daysUntil <= 30 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-status-error-rgb),0.08)", color: "var(--ce-status-error)", border: "1px solid rgba(var(--ce-status-error-rgb),0.15)", fontFamily: "var(--font-body)" }}>{grant.daysUntil}d left</span>
                              )}
                            </div>
                            <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{grant.title}</span>
                            <span className="text-[10px] text-[var(--ce-text-secondary)] block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{grant.funder}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[16px] text-[var(--ce-text-primary)] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{grant.amount}</div>
                            <div className="text-[9px] tabular-nums" style={{ color: grant.match >= 85 ? "var(--ce-lime)" : "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>{grant.match}% match</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Due: {grant.deadline}</span>
                          <div className="flex items-center gap-2">
                            {grant.status === "open" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setGrantAppTarget(grant); }}
                                className="text-[10px] px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:opacity-80"
                                style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                                Apply
                              </button>
                            )}
                            {(grant.status === "submitted" || grant.status === "under_review") && (
                              <span className="text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1"
                                style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}20`, color: cfg.color, fontFamily: "var(--font-body)" }}>
                                {grant.status === "under_review" && <Clock className="w-2.5 h-2.5" />}
                                {cfg.label}
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Participants tab */}
              {tab === "participants" && (
                <motion.div key="participants" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{participants.length} participants</span>
                    <button onClick={() => setAddParticipantOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.98]"
                      style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      <Plus className="w-3 h-3" /> Add participant
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.015)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                    <div className="grid px-4 py-2.5" style={{ gridTemplateColumns: "1fr 120px 80px 80px 80px 50px", borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)", gap: 12 }}>
                      {["PARTICIPANT", "PROGRAM", "PHASE", "READINESS", "STATUS", ""].map((h) => (
                        <span key={h} className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{h}</span>
                      ))}
                    </div>
                    {participants.map((p, i) => (
                      <ParticipantRowWithRemove key={p.id} p={p} accent={accent} isLast={i === participants.length - 1} onRemove={() => setRemoveParticipant(p)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <SophiaInsight
              message="Your Q1 2025 program had a 79% placement rate — 7 points above the national average. Sophia has drafted the outcomes narrative for your WIOA renewal."
              actionLabel="Review draft"
              onAction={() => {}}
              actionPrompt="Help me complete the WIOA grant application — draft the 24-month outcomes narrative using our Q1 placement data"
              delay={0.4}
            />
            <GlassCard delay={0.5}>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-3.5 h-3.5 text-[var(--ce-status-error)]" />
                <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Needs attention</span>
              </div>
              {[
                { name: "Deon P.", issue: "12 days inactive", severity: "high" },
                { name: "James K.", issue: "14 days inactive", severity: "high" },
                { name: "Nadia L.", issue: "Readiness below 60%", severity: "medium" },
              ].map((item, i, arr) => (
                <AtRiskRow key={item.name} item={item} accent={accent} isLast={i === arr.length - 1} />
              ))}
            </GlassCard>
            <GlassCard delay={0.6}>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-3.5 h-3.5" style={{ color: "var(--ce-lime)" }} />
                <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Grant pipeline</span>
              </div>
              {[
                { label: "Funded",  value: "$120,000", color: "var(--ce-lime)" },
                { label: "Applied", value: "$250,000", color: "var(--ce-role-edgepreneur)" },
                { label: "Open",    value: "$205,000", color: "var(--ce-role-edgestar)" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-1.5" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                  <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
                  <span className="text-[12px] tabular-nums" style={{ color: row.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Grant drawer */}
      <AnimatePresence>
        {selectedGrant && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGrant(null)} />
            <GrantDrawer grant={selectedGrant} accent={accent} onClose={() => setSelectedGrant(null)} onApply={(g) => setGrantAppTarget(g)} />
          </>
        )}
      </AnimatePresence>

      {/* Program drawer */}
      <AnimatePresence>
        {selectedProgram && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProgram(null)} />
            <ProgramDrawer program={selectedProgram} accent={accent} onClose={() => setSelectedProgram(null)}
              onViewParticipants={() => { setSelectedProgram(null); setTab("participants"); }} />
          </>
        )}
      </AnimatePresence>

      {/* Create program panel */}
      <AnimatePresence>
        {createOpen && (
          <CreateProgramPanel accent={accent} onClose={() => setCreateOpen(false)} onCreated={(p) => setPrograms((prev) => [...prev, p])} />
        )}
      </AnimatePresence>

      {/* Enrollment modal */}
      <AnimatePresence>
        {enrollProgram && (
          <EnrollmentModal program={enrollProgram} accent={accent} onClose={() => setEnrollProgram(null)} onEnroll={handleEnroll} />
        )}
      </AnimatePresence>

      {/* Grant application panel */}
      <AnimatePresence>
        {grantAppTarget && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setGrantAppTarget(null)} />
            <GrantApplicationPanel grant={grantAppTarget} accent={accent} onClose={() => setGrantAppTarget(null)} onSubmit={handleGrantSubmit} />
          </>
        )}
      </AnimatePresence>

      {/* Add participant modal */}
      <AnimatePresence>
        {addParticipantOpen && (
          <AddParticipantModal accent={accent} onClose={() => setAddParticipantOpen(false)} onAdd={handleAddParticipant} />
        )}
      </AnimatePresence>

      {/* Remove participant confirm */}
      <AnimatePresence>
        {removeParticipant && (
          <RemoveParticipantModal participant={removeParticipant} accent={accent} onClose={() => setRemoveParticipant(null)} onConfirm={handleRemoveParticipant} />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}