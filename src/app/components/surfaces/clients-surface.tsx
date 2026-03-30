import { EASE } from "../tokens";
/**
 * Clients Surface — EdgeGuide
 *
 * Coaching client roster and relationship management.
 * Shows each client's roadmap phase, readiness, last session,
 * upcoming milestones, and whether they need the guide's attention.
 *
 * Layer 3 scope:
 * - Client roster with health signals
 * - Client detail drawer with roadmap progress + session history
 * - Session booking from client context
 * - Sophia guide-specific insights per client
 * - At-risk signal indicators
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { useSophia } from "../sophia-context";
import { toast } from "../ui/feedback";
import {
  Users, Calendar, Star, Check, ChevronRight, X,
  MessageSquare, Clock, TrendingUp, Target, Zap,
  AlertCircle, CheckCircle2, ArrowRight, Briefcase,
  BookOpen, Search, Filter, Plus, Archive,
} from "lucide-react";

const GUIDE_PURPLE = "var(--ce-role-guide)";

// ─── Types ───────────────────────────────────────────────────────────────────

type ClientHealth = "thriving" | "on_track" | "at_risk" | "inactive";

interface Session {
  id: string;
  date: string;
  topic: string;
  outcome: string;
  duration: string;
}

interface Client {
  id: string;
  name: string;
  initial: string;
  role: string;
  goal: string;
  phase: number;
  phaseLabel: string;
  progress: number;
  readiness: number;
  health: ClientHealth;
  lastSession: string;
  nextSession?: string;
  sessionsCompleted: number;
  milestonesDone: number;
  totalMilestones: number;
  earnings: number;
  sophiaNote: string;
  tags: string[];
  recentSessions: Session[];
  upcomingMilestone: string;
  lastActive: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Sharon Lee",
    initial: "S",
    role: "EdgeStar",
    goal: "Product Designer at a top-tier tech company",
    phase: 2,
    phaseLabel: "Build & Apply",
    progress: 63,
    readiness: 78,
    health: "thriving",
    lastSession: "Mar 16",
    nextSession: "Mar 21, 2 PM",
    sessionsCompleted: 8,
    milestonesDone: 10,
    totalMilestones: 16,
    earnings: 960,
    sophiaNote: "Sharon is your highest-momentum client. She completed 3 milestones in the last 2 weeks — above your cohort average of 1.4. Her portfolio is strong. Your next session should focus on application strategy and interview prep timing.",
    tags: ["Active", "High potential"],
    upcomingMilestone: "Complete Interaction Design module",
    lastActive: "Today",
    recentSessions: [
      { id: "s1", date: "Mar 16", topic: "Portfolio review — case study 2", outcome: "Reviewed UX flow. Action: add 3 more screens and a metrics section. Due by Mar 22.", duration: "55 min" },
      { id: "s2", date: "Mar 9",  topic: "Resume & LinkedIn optimization",   outcome: "Revised summary and top 3 bullets. ATS score went from 62 to 78 after changes.", duration: "45 min" },
      { id: "s3", date: "Feb 28", topic: "Target company strategy",           outcome: "Shortlisted 6 target companies. Figma and Vercel as tier 1. Cold outreach plan drafted.", duration: "60 min" },
    ],
  },
  {
    id: "c2",
    name: "Marcus Tan",
    initial: "M",
    role: "EdgeStar",
    goal: "UX Researcher at a mission-driven org",
    phase: 1,
    phaseLabel: "Discover & Position",
    progress: 40,
    readiness: 55,
    health: "on_track",
    lastSession: "Mar 10",
    nextSession: "Mar 24, 11 AM",
    sessionsCompleted: 4,
    milestonesDone: 4,
    totalMilestones: 10,
    earnings: 480,
    sophiaNote: "Marcus is progressing steadily but needs more clarity on his target niche. He's split between UX Research and Product Strategy. Your next session should help him commit — the lack of focus is slowing his LinkedIn optimization.",
    tags: ["Needs direction"],
    upcomingMilestone: "Build target company list",
    lastActive: "3 days ago",
    recentSessions: [
      { id: "s4", date: "Mar 10", topic: "Strengths mapping & positioning",  outcome: "Completed strengths inventory. Top 3: systems thinking, facilitation, synthesis. Job target still open.", duration: "60 min" },
      { id: "s5", date: "Mar 3",  topic: "Career goal clarification",         outcome: "Explored UX Research vs Product Strategy. Homework: informational interview with someone in each path.", duration: "45 min" },
    ],
  },
  {
    id: "c3",
    name: "Yolanda Reyes",
    initial: "Y",
    role: "EdgeStar",
    goal: "Data Science role in fintech",
    phase: 3,
    phaseLabel: "Interview & Close",
    progress: 88,
    readiness: 91,
    health: "thriving",
    lastSession: "Mar 15",
    nextSession: "Mar 22, 10 AM",
    sessionsCompleted: 14,
    milestonesDone: 19,
    totalMilestones: 22,
    earnings: 1680,
    sophiaNote: "Yolanda has 2 active interviews — Stripe and Plaid. She's your furthest-along client. The Stripe final round is March 25. Your upcoming session should be a full mock interview focused on the Stripe take-home.",
    tags: ["Interview stage", "High priority"],
    upcomingMilestone: "Stripe final round interview",
    lastActive: "Today",
    recentSessions: [
      { id: "s6", date: "Mar 15", topic: "Mock interview — Stripe case study", outcome: "Strong performance. Weak point: speed on SQL window functions. Drilled for 20 minutes. Marked ready for final.", duration: "75 min" },
      { id: "s7", date: "Mar 8",  topic: "Offer evaluation framework",          outcome: "Built evaluation rubric: comp, growth, mission, team. Used to score Stripe vs Plaid.", duration: "45 min" },
    ],
  },
  {
    id: "c4",
    name: "Deon Park",
    initial: "D",
    role: "EdgeStar",
    goal: "Software Engineer — backend focus",
    phase: 2,
    phaseLabel: "Build & Apply",
    progress: 28,
    readiness: 34,
    health: "at_risk",
    lastSession: "Feb 20",
    nextSession: undefined,
    sessionsCompleted: 3,
    milestonesDone: 3,
    totalMilestones: 12,
    earnings: 360,
    sophiaNote: "Deon has been inactive for 26 days. Last session ended with a clear next step (GitHub portfolio project) but they haven't logged in since. Sophia recommends a check-in message before the scheduled session lapse becomes a dropout.",
    tags: ["At risk", "Needs outreach"],
    upcomingMilestone: "Build GitHub portfolio project",
    lastActive: "26 days ago",
    recentSessions: [
      { id: "s8", date: "Feb 20", topic: "Technical skill gap analysis", outcome: "Identified gaps: system design, SQL, behavioral stories. Action: start GitHub project + LeetCode daily.", duration: "60 min" },
    ],
  },
  {
    id: "c5",
    name: "Amara Johnson",
    initial: "A",
    role: "EdgeStar",
    goal: "Product Manager — early-stage startup",
    phase: 1,
    phaseLabel: "Discover & Position",
    progress: 15,
    readiness: 28,
    health: "inactive",
    lastSession: "Jan 30",
    nextSession: undefined,
    sessionsCompleted: 1,
    milestonesDone: 1,
    totalMilestones: 8,
    earnings: 120,
    sophiaNote: "Amara has been inactive for 47 days after a strong first session. Sophia detects a common early-stage pattern: initial enthusiasm followed by overwhelm. A reframing session — focused on one small win — typically re-activates this profile.",
    tags: ["Inactive", "Needs reengagement"],
    upcomingMilestone: "Complete career goal identification",
    lastActive: "47 days ago",
    recentSessions: [
      { id: "s9", date: "Jan 30", topic: "Intro & goal setting", outcome: "Set goal: PM at an early-stage startup. Started strengths inventory. Scheduled weekly sessions.", duration: "45 min" },
    ],
  },
];

// ─── Health config ────────────────────────────────────────────────────────────

const HEALTH_CONFIG: Record<ClientHealth, { label: string; color: string; dot: string }> = {
  thriving: { label: "Thriving",  color: "var(--ce-lime)", dot: "var(--ce-lime)" },
  on_track: { label: "On track",  color: "var(--ce-role-edgestar)", dot: "var(--ce-role-edgestar)" },
  at_risk:  { label: "At risk",   color: "var(--ce-role-edgepreneur)", dot: "var(--ce-role-edgepreneur)" },
  inactive: { label: "Inactive",  color: "var(--ce-status-error)", dot: "var(--ce-status-error)" },
};

// ─── Star Rating Component ──────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className="cursor-pointer p-0.5 transition-transform hover:scale-110"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          <Star
            className="w-5 h-5 transition-colors"
            style={{
              color: i <= (hover || value) ? "var(--ce-lime)" : "var(--ce-text-quaternary)",
              fill: i <= (hover || value) ? "var(--ce-lime)" : "transparent",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Add Client Panel ───────────────────────────────────────────────────────

function AddClientPanel({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (client: Client) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phase, setPhase] = useState<string>("Discovery");

  const phaseMap: Record<string, { num: number; label: string }> = {
    Discovery: { num: 1, label: "Discover & Position" },
    "Skill Bridge": { num: 2, label: "Build & Apply" },
    Build: { num: 2, label: "Build & Apply" },
    Interview: { num: 3, label: "Interview & Close" },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const phaseInfo = phaseMap[phase];
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      initial: name.trim().charAt(0).toUpperCase(),
      role: "EdgeStar",
      goal: specialty.trim() || "Career transition",
      phase: phaseInfo.num,
      phaseLabel: phaseInfo.label,
      progress: 0,
      readiness: 10,
      health: "on_track",
      lastSession: "Not yet",
      nextSession: undefined,
      sessionsCompleted: 0,
      milestonesDone: 0,
      totalMilestones: 10,
      earnings: 0,
      sophiaNote: `${name.trim()} is a new client. Schedule an introductory session to assess their goals and build their initial roadmap.`,
      tags: ["New"],
      recentSessions: [],
      upcomingMilestone: "Complete intake assessment",
      lastActive: "Today",
    };
    onAdd(newClient);
    toast.success(`${name.trim()} added to your client roster`);
    onClose();
  };

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <span className="text-[15px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Add client</span>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NAME</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none transition-colors focus:ring-1"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.1)", background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EMAIL</label>
          <input
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="client@email.com"
            type="email"
            className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none transition-colors focus:ring-1"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.1)", background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}
          />
        </div>

        {/* Specialty */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SPECIALTY / GOAL</label>
          <input
            value={specialty} onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g., Product Designer at a FAANG"
            className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none transition-colors focus:ring-1"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.1)", background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}
          />
        </div>

        {/* Phase */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>INITIAL PHASE</label>
          <div className="flex gap-2 flex-wrap">
            {["Discovery", "Skill Bridge", "Build", "Interview"].map((p) => (
              <button
                key={p} type="button"
                onClick={() => setPhase(p)}
                className="px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-all"
                style={{
                  background: phase === p ? "rgba(var(--ce-role-guide-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.02)",
                  border: phase === p ? "1px solid rgba(var(--ce-role-guide-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
                  color: phase === p ? GUIDE_PURPLE : "var(--ce-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sophia note */}
        <div className="mt-2 rounded-xl p-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <SophiaMark size={12} glowing={false} />
            <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
          </div>
          <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            A new client will start with an intake assessment. Sophia will generate a personalized roadmap after the first session.
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </form>

      {/* Submit */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            const phaseInfo = phaseMap[phase];
            const newClient: Client = {
              id: `c-${Date.now()}`,
              name: name.trim(),
              initial: name.trim().charAt(0).toUpperCase(),
              role: "EdgeStar",
              goal: specialty.trim() || "Career transition",
              phase: phaseInfo.num,
              phaseLabel: phaseInfo.label,
              progress: 0,
              readiness: 10,
              health: "on_track",
              lastSession: "Not yet",
              nextSession: undefined,
              sessionsCompleted: 0,
              milestonesDone: 0,
              totalMilestones: 10,
              earnings: 0,
              sophiaNote: `${name.trim()} is a new client. Schedule an introductory session to assess their goals and build their initial roadmap.`,
              tags: ["New"],
              recentSessions: [],
              upcomingMilestone: "Complete intake assessment",
              lastActive: "Today",
            };
            onAdd(newClient);
            toast.success(`${name.trim()} added to your client roster`);
            onClose();
          }}
          disabled={!name.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: "rgba(var(--ce-role-guide-rgb),0.15)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.3)", color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          <Plus className="w-3.5 h-3.5" /> Add client
        </button>
      </div>
    </motion.div>
  );
}

// ─── Log Outcome Modal ──────────────────────────────────────────────────────

function LogOutcomeModal({
  client,
  onClose,
  onSave,
}: {
  client: Client;
  onClose: () => void;
  onSave: (data: { rating: number; notes: string; nextSteps: string }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  const handleSave = () => {
    if (rating === 0) return;
    onSave({ rating, notes, nextSteps });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.5)" }} onClick={onClose} />
      <motion.div
        className="relative w-[420px] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", backdropFilter: "blur(20px)" }}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <div>
            <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Log session outcome</span>
            <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{client.name}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto">
          {/* Rating */}
          <div>
            <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SESSION RATING</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SESSION NOTES</label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Key takeaways, progress made, blockers discussed..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none resize-none"
              style={{ border: "1px solid rgba(var(--ce-glass-tint),0.1)", background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}
            />
          </div>

          {/* Next steps */}
          <div>
            <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NEXT STEPS</label>
            <input
              value={nextSteps} onChange={(e) => setNextSteps(e.target.value)}
              placeholder="Action items for the client before next session"
              className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none"
              style={{ border: "1px solid rgba(var(--ce-glass-tint),0.1)", background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 py-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer transition-colors"
            style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={rating === 0}
            className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: "rgba(var(--ce-role-guide-rgb),0.15)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.3)", color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Save outcome
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Archive Confirmation Dialog ────────────────────────────────────────────

function ArchiveDialog({
  clientName,
  onClose,
  onConfirm,
}: {
  clientName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.5)" }} onClick={onClose} />
      <motion.div
        className="relative w-[360px] rounded-2xl overflow-hidden"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", backdropFilter: "blur(20px)" }}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <div className="px-5 py-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(var(--ce-status-error-rgb, 239,68,68),0.1)", border: "1px solid rgba(var(--ce-status-error-rgb, 239,68,68),0.15)" }}>
            <Archive className="w-5 h-5" style={{ color: "var(--ce-status-error)" }} />
          </div>
          <span className="text-[14px] text-[var(--ce-text-primary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Archive client</span>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Are you sure you want to archive {clientName}? They will be removed from your active client list.
          </p>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer transition-colors"
            style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: "rgba(var(--ce-status-error-rgb, 239,68,68),0.15)", border: "1px solid rgba(var(--ce-status-error-rgb, 239,68,68),0.25)", color: "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Archive
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Client Detail Drawer ────────────────────────────────────────────────────

function ClientDrawer({
  client,
  onClose,
  onNavigate,
  onLogOutcome,
  onArchive,
}: {
  client: Client;
  onClose: () => void;
  onNavigate: (t: string) => void;
  onLogOutcome: () => void;
  onArchive: () => void;
}) {
  const { openSophia } = useSophia();
  const [tab, setTab] = useState<"overview" | "sessions">("overview");
  const healthCfg = HEALTH_CONFIG[client.health];

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[440px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[17px]"
            style={{ background: "rgba(var(--ce-role-guide-rgb),0.12)", border: "1.5px solid rgba(var(--ce-role-guide-rgb),0.25)", color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 600 }}>
            {client.initial}
          </div>
          <div>
            <span className="text-[15px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{client.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: healthCfg.dot }} />
              <span className="text-[11px]" style={{ color: healthCfg.color, fontFamily: "var(--font-body)" }}>{healthCfg.label}</span>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Phase {client.phase}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-5 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {(["overview", "sessions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer capitalize transition-colors"
            style={{ background: tab === t ? "rgba(var(--ce-role-guide-rgb),0.1)" : "transparent", color: tab === t ? GUIDE_PURPLE : "var(--ce-text-secondary)", border: tab === t ? "1px solid rgba(var(--ce-role-guide-rgb),0.2)" : "1px solid transparent", fontFamily: "var(--font-body)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Progress */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>Phase {client.phase}: {client.phaseLabel}</span>
                  <span className="text-[12px] tabular-nums" style={{ color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 500 }}>{client.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: GUIDE_PURPLE }}
                    initial={{ width: 0 }} animate={{ width: `${client.progress}%` }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }} />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {[
                    { label: "Milestones", value: `${client.milestonesDone}/${client.totalMilestones}` },
                    { label: "Readiness",  value: `${client.readiness}%` },
                    { label: "Sessions",   value: client.sessionsCompleted },
                    { label: "Earned",     value: `$${client.earnings}` },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-[16px] tabular-nums text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.value}</div>
                      <div className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sophia note */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <SophiaMark size={12} glowing={false} />
                  <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's read</span>
                </div>
                <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{client.sophiaNote}</p>
              </div>

              {/* Goal & upcoming */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="mb-3">
                  <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>GOAL</span>
                  <span className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{client.goal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NEXT MILESTONE</span>
                  <span className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{client.upcomingMilestone}</span>
                </div>
              </div>

              {/* Session info */}
              <div className="px-5 py-4">
                {[
                  { label: "Last session",  value: client.lastSession },
                  { label: "Next session",  value: client.nextSession ?? "Not scheduled" },
                  { label: "Last active",   value: client.lastActive },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-1.5" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                    <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
                    <span className="text-[11px]" style={{ color: !client.nextSession && row.label === "Next session" ? "var(--ce-status-error)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "sessions" && (
            <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 py-4">
              <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SESSION HISTORY ({client.recentSessions.length} shown)</span>
              <div className="flex flex-col gap-3">
                {client.recentSessions.map((session) => (
                  <div key={session.id} className="rounded-xl p-3.5" style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{session.topic}</span>
                      <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{session.date} · {session.duration}</span>
                    </div>
                    <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{session.outcome}</p>
                  </div>
                ))}
                {client.recentSessions.length === 0 && (
                  <div className="text-center py-6">
                    <span className="text-[12px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>No sessions yet</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate("sessions")}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.2)", color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Calendar className="w-3.5 h-3.5" /> Book session
          </button>
          <button
            onClick={onLogOutcome}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: "rgba(var(--ce-lime-rgb, 179,255,59),0.08)", border: "1px solid rgba(var(--ce-lime-rgb, 179,255,59),0.18)", color: "var(--ce-lime)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Log outcome
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate("messages")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.06)] transition-colors" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>
            <MessageSquare className="w-3 h-3" /> Message
          </button>
          <button
            onClick={() => openSophia(`Show me ${client.name}'s full career roadmap — all phases, completed milestones, and what's coming next. Phase ${client.phase}: ${client.phaseLabel}, ${client.progress}% complete. Next milestone: ${client.upcomingMilestone}.`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
            <Target className="w-3 h-3" /> View roadmap
          </button>
        </div>
        <button
          onClick={onArchive}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-status-error-rgb,239,68,68),0.06)] transition-colors"
          style={{ background: "transparent", border: "1px solid rgba(var(--ce-glass-tint),0.05)", color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>
          <Archive className="w-3 h-3" /> Archive client
        </button>
      </div>
    </motion.div>
  );
}

// ─── Client Row ───────────────────────────────────────────────────────────────

function ClientRow({ client, onSelect }: { client: Client; onSelect: (c: Client) => void }) {
  const healthCfg = HEALTH_CONFIG[client.health];
  return (
    <motion.div
      className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors group"
      style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
      onClick={() => onSelect(client)}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.1 }}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] flex-shrink-0"
        style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.2)", color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 600 }}>
        {client.initial}
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{client.name}</span>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: healthCfg.dot, boxShadow: `0 0 4px ${healthCfg.dot}60` }} />
          <span className="text-[10px]" style={{ color: healthCfg.color, fontFamily: "var(--font-body)" }}>{healthCfg.label}</span>
        </div>
        <span className="text-[11px] text-[var(--ce-text-secondary)] truncate block" style={{ fontFamily: "var(--font-body)" }}>{client.goal}</span>
      </div>

      {/* Phase */}
      <div className="text-center w-20 flex-shrink-0">
        <div className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Ph.{client.phase}</div>
        <div className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{client.progress}%</div>
      </div>

      {/* Progress bar */}
      <div className="w-24 flex-shrink-0">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: healthCfg.color }}
            initial={{ width: 0 }} animate={{ width: `${client.progress}%` }} transition={{ delay: 0.3, duration: 0.5, ease: EASE }} />
        </div>
        <span className="text-[9px] text-[var(--ce-text-quaternary)] mt-0.5 block" style={{ fontFamily: "var(--font-body)" }}>
          {client.milestonesDone}/{client.totalMilestones} milestones
        </span>
      </div>

      {/* Next session */}
      <div className="w-32 flex-shrink-0 text-right">
        {client.nextSession ? (
          <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{client.nextSession}</span>
        ) : (
          <span className="text-[11px] text-[var(--ce-status-error)]" style={{ fontFamily: "var(--font-body)" }}>Not booked</span>
        )}
        <span className="text-[10px] text-[var(--ce-text-quaternary)] block" style={{ fontFamily: "var(--font-body)" }}>Last: {client.lastSession}</span>
      </div>

      <ChevronRight className="w-4 h-4 text-[var(--ce-text-quaternary)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ClientsSurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = "guide" as const;

  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<"all" | ClientHealth>("all");
  const [search, setSearch] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showLogOutcome, setShowLogOutcome] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleLogOutcome = (data: { rating: number; notes: string; nextSteps: string }) => {
    if (!selectedClient) return;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const newSession: Session = {
      id: `s-${Date.now()}`,
      date: dateStr,
      topic: `Session outcome (${data.rating}/5)`,
      outcome: [data.notes, data.nextSteps ? `Next steps: ${data.nextSteps}` : ""].filter(Boolean).join(". "),
      duration: "—",
    };
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              recentSessions: [newSession, ...c.recentSessions],
              sessionsCompleted: c.sessionsCompleted + 1,
              milestonesDone: Math.min(c.milestonesDone + 1, c.totalMilestones),
              lastSession: dateStr,
              lastActive: "Today",
            }
          : c
      )
    );
    // Update selected client in-place for the drawer
    setSelectedClient((prev) =>
      prev && prev.id === selectedClient.id
        ? {
            ...prev,
            recentSessions: [newSession, ...prev.recentSessions],
            sessionsCompleted: prev.sessionsCompleted + 1,
            milestonesDone: Math.min(prev.milestonesDone + 1, prev.totalMilestones),
            lastSession: dateStr,
            lastActive: "Today",
          }
        : prev
    );
    setShowLogOutcome(false);
    toast.success(`Session outcome logged for ${selectedClient.name}`);
  };

  const handleArchive = () => {
    if (!selectedClient) return;
    const name = selectedClient.name;
    setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
    setSelectedClient(null);
    setShowArchiveConfirm(false);
    toast.success(`${name} has been archived`);
  };

  const handleNavigate = (target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`, sessions: `/${role}/sessions`, clients: `/${role}/clients`,
      analytics: `/${role}/analytics`, messages: `/${role}/messages`, landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  const filtered = clients.filter((c) => {
    const matchesFilter = filter === "all" || c.health === filter;
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.goal.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const atRisk = clients.filter(c => c.health === "at_risk" || c.health === "inactive");
  const monthlyEarnings = clients.reduce((a, c) => a + c.earnings, 0);

  // Contextual Sophia bottom bar — updates when a client is selected
  const sophiaOverride = selectedClient
    ? {
        message: `${selectedClient.name} — ${HEALTH_CONFIG[selectedClient.health].label} · Phase ${selectedClient.phase}`,
        chips: [
          { label: "Session prep", action: `Help me prepare for my next session with ${selectedClient.name}. ${selectedClient.sophiaNote}` },
          { label: selectedClient.health === "at_risk" || selectedClient.health === "inactive" ? "Draft re-engagement" : "Draft check-in", action: `Draft a ${selectedClient.health === "at_risk" || selectedClient.health === "inactive" ? "re-engagement" : "check-in"} message for ${selectedClient.name} who has been ${selectedClient.health === "inactive" ? `inactive for ${selectedClient.lastActive}` : "on track but needs attention"}.` },
        ],
      }
    : {
        message: "Deon Park has been inactive 26 days — at risk of dropping out",
        chips: [
          { label: "Draft outreach to Deon", action: "Draft a re-engagement message for a coaching client (Deon Park) who has been inactive for 26 days" },
          { label: "Session prep for Yolanda", action: "Help me prepare for Yolanda's session — she has a Stripe final round on March 25" },
        ],
      };

  return (
    <RoleShell role={role} userName="Alice Chen" userInitial="A" edgeGas={85} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[22px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>My Clients</h1>
            <p className="text-[13px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              {clients.length} active clients · {atRisk.length} need attention
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddPanel(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
              style={{ background: "rgba(var(--ce-role-guide-rgb),0.15)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.3)", color: GUIDE_PURPLE, fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <Plus className="w-3.5 h-3.5" /> Add client
            </button>
            <button onClick={() => handleNavigate("sessions")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <Calendar className="w-3.5 h-3.5" /> Manage sessions
            </button>
          </div>
        </motion.div>

        {/* KPI strip */}
        <motion.div className="grid grid-cols-4 gap-3 mb-5"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}>
          {[
            { label: "Active clients",   value: clients.length,                  color: GUIDE_PURPLE },
            { label: "Monthly earnings", value: `$${monthlyEarnings.toLocaleString()}`, color: "var(--ce-lime)" },
            { label: "Sessions this mo", value: "12",                             color: "var(--ce-role-edgestar)"   },
            { label: "Need attention",   value: atRisk.length,                   color: atRisk.length > 0 ? "var(--ce-role-edgepreneur)" : "var(--ce-lime)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl px-4 py-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <div className="text-[22px] tabular-nums mb-0.5" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{stat.value}</div>
              <div className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 280px" }}>
          {/* Client roster */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}>
                <Search className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..."
                  className="flex-1 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none" style={{ fontFamily: "var(--font-body)" }} />
                {search && <button onClick={() => setSearch("")} className="cursor-pointer"><X className="w-3 h-3 text-[var(--ce-text-quaternary)]" /></button>}
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                {(["all", "thriving", "on_track", "at_risk", "inactive"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-2.5 py-1.5 rounded-md text-[10px] cursor-pointer capitalize transition-all"
                    style={{ background: filter === f ? "rgba(var(--ce-glass-tint),0.08)" : "transparent", color: filter === f ? "var(--ce-text-primary)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
                    {f === "on_track" ? "On track" : f === "at_risk" ? "At risk" : f}
                  </button>
                ))}
              </div>
            </div>

            <motion.div className="rounded-xl overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.015)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: EASE }}>
              {/* Table header */}
              <div className="flex items-center gap-4 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                <div className="w-9 flex-shrink-0" />
                <span className="flex-1 text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CLIENT</span>
                <span className="w-20 text-center text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PHASE</span>
                <span className="w-24 text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROGRESS</span>
                <span className="w-32 text-right text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NEXT SESSION</span>
                <div className="w-4" />
              </div>
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <ClientRow client={c} onSelect={setSelectedClient} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="py-12 flex flex-col items-center gap-2">
                  <Users className="w-6 h-6 text-[var(--ce-text-quaternary)]" />
                  <span className="text-[12px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>No clients match this filter</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <SophiaInsight
              message="Yolanda has her Stripe final round on March 25. Your March 22 session is 3 days before — perfect timing for a full mock interview. Sophia has a prep deck ready."
              actionLabel="View prep deck"
              onAction={() => {}}
              actionPrompt="Help me prepare for Yolanda's Stripe final round interview session — she has the interview on March 25 and I want to run a full mock with her on March 22"
              delay={0.4}
            />
            {/* At-risk clients */}
            {atRisk.length > 0 && (
              <GlassCard delay={0.5}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--ce-role-edgepreneur)]" />
                  <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Needs attention</span>
                </div>
                {atRisk.map((c, i) => (
                  <button key={c.id} onClick={() => setSelectedClient(c)}
                    className="w-full flex items-center gap-2.5 py-2 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-lg transition-colors text-left px-1"
                    style={{ borderBottom: i < atRisk.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: HEALTH_CONFIG[c.health].dot }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{c.name}</span>
                      <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{c.lastActive}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  </button>
                ))}
              </GlassCard>
            )}
            {/* Upcoming sessions */}
            <GlassCard delay={0.6}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3.5 h-3.5" style={{ color: GUIDE_PURPLE }} />
                <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Upcoming sessions</span>
              </div>
              {clients.filter(c => c.nextSession).slice(0, 3).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: GUIDE_PURPLE }} />
                    <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{c.name}</span>
                  </div>
                  <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{c.nextSession}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Client detail drawer */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)} />
            <ClientDrawer
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
              onNavigate={handleNavigate}
              onLogOutcome={() => setShowLogOutcome(true)}
              onArchive={() => setShowArchiveConfirm(true)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Add client panel */}
      <AnimatePresence>
        {showAddPanel && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddPanel(false)} />
            <AddClientPanel onClose={() => setShowAddPanel(false)} onAdd={handleAddClient} />
          </>
        )}
      </AnimatePresence>

      {/* Log outcome modal */}
      <AnimatePresence>
        {showLogOutcome && selectedClient && (
          <LogOutcomeModal
            client={selectedClient}
            onClose={() => setShowLogOutcome(false)}
            onSave={handleLogOutcome}
          />
        )}
      </AnimatePresence>

      {/* Archive confirmation */}
      <AnimatePresence>
        {showArchiveConfirm && selectedClient && (
          <ArchiveDialog
            clientName={selectedClient.name}
            onClose={() => setShowArchiveConfirm(false)}
            onConfirm={handleArchive}
          />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}