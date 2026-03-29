import { EASE } from "../tokens";
/**
 * Family Surface — EdgeParent
 *
 * Multi-child: parents see all linked children in a selector at the top.
 * Switching child swaps all content — phases, milestones, notes, budget,
 * activity feed, and Sophia context.
 *
 * "Add child" opens QRModal from shared-patterns — parent shows their QR
 * (or scans the child's) to link accounts.
 *
 * Warm, not clinical. Designed around encouragement and awareness,
 * not surveillance.
 */

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { useSophia } from "../sophia-context";
import { QRModal } from "../shared-patterns";
import {
  Heart, Check, ChevronRight, ChevronDown, ChevronUp,
  MessageSquare, Calendar, Sparkles, Clock, Lock,
  Send, X, Target, BookOpen,
  Zap, Circle, ArrowUpRight, DollarSign, UserPlus,
} from "lucide-react";


// ─── Types ───────────────────────────────────────────────────────────────────

interface Milestone {
  id: string;
  label: string;
  phase: number;
  status: "done" | "current" | "upcoming" | "locked";
  completedDate?: string;
  time: string;
  category: "skill" | "action" | "resource";
  sophiaNote?: string;
  notes: ParentNote[];
}

interface ParentNote {
  id: string;
  text: string;
  timestamp: string;
  type: "encouragement" | "question" | "reflection";
}

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  status: "done" | "active" | "upcoming" | "locked";
  progress: number;
  milestoneCount: number;
  doneCount: number;
}

interface ActivityItem {
  label: string;
  time: string;
  type: "milestone" | "application" | "session";
}

interface BudgetPhaseData {
  id: number;
  title: string;
  status: "done" | "active" | "upcoming";
  spent: number;
  estimated: number;
  items: string[];
}

interface UpcomingItem {
  text: string;
  date: string;
  color: string;
}

interface ChildData {
  id: string;
  name: string;
  initial: string;
  goal: string;
  startDate: string;
  streak: number;
  daysActive: number;
  phases: Phase[];
  milestones: Milestone[];
  activity: ActivityItem[];
  budgetPhases: BudgetPhaseData[];
  upcoming: UpcomingItem[];
  sophiaMessage: string;
}

// ─── Data — Alex ─────────────────────────────────────────────────────────────

const ALEX_PHASES: Phase[] = [
  { id: 1, title: "Discover & Position",   subtitle: "Who Alex is and where they're headed",       status: "done",     progress: 1,   milestoneCount: 5, doneCount: 5 },
  { id: 2, title: "Build & Apply",         subtitle: "Skills, portfolio, and first applications",   status: "active",   progress: 0.6, milestoneCount: 8, doneCount: 5 },
  { id: 3, title: "Interview & Close",     subtitle: "Prep, practice, and getting the offer",       status: "upcoming", progress: 0,   milestoneCount: 6, doneCount: 0 },
  { id: 4, title: "Transition & Grow",     subtitle: "First 90 days and career momentum",           status: "locked",   progress: 0,   milestoneCount: 4, doneCount: 0 },
];

const ALEX_MILESTONES: Milestone[] = [
  // Phase 1 — all done
  { id: "a-m1",  label: "Career goal identification",            phase: 1, status: "done",     completedDate: "Jan 18", time: "1h",   category: "action",   sophiaNote: "Alex chose Product Design with strong conviction. This matches their creative and systems-thinking strengths.", notes: [] },
  { id: "a-m2",  label: "Strengths & values mapping",           phase: 1, status: "done",     completedDate: "Jan 22", time: "2h",   category: "resource", sophiaNote: "Top strengths: visual communication, empathy, problem framing. These are in-demand for senior design roles.", notes: [] },
  { id: "a-m3",  label: "Target company research",              phase: 1, status: "done",     completedDate: "Jan 28", time: "3h",   category: "action",   notes: [] },
  { id: "a-m4",  label: "Build first case study",               phase: 1, status: "done",     completedDate: "Feb 14", time: "8h",   category: "skill",    sophiaNote: "Case study quality is strong — this is now Alex's most impressive portfolio piece.", notes: [{ id: "n1", text: "So proud of you for finishing this — you've been working on it for weeks!", timestamp: "Feb 15", type: "encouragement" }] },
  { id: "a-m5",  label: "LinkedIn profile optimized",           phase: 1, status: "done",     completedDate: "Mar 12", time: "2h",   category: "action",   notes: [] },
  // Phase 2 — mixed
  { id: "a-m6",  label: "Complete Interaction Design module",   phase: 2, status: "current",  time: "4h",   category: "skill",    sophiaNote: "Alex is 60% through this module. The remaining exercises are where hiring managers test candidates — important they don't rush.", notes: [] },
  { id: "a-m7",  label: "Build second case study",              phase: 2, status: "upcoming", time: "10h",  category: "skill",    notes: [] },
  { id: "a-m8",  label: "Networking outreach × 10",             phase: 2, status: "upcoming", time: "3h",   category: "action",   notes: [] },
  { id: "a-m9",  label: "Resume ATS optimization",              phase: 2, status: "done",     completedDate: "Mar 5",  time: "1h",   category: "action",   notes: [] },
  { id: "a-m10", label: "Portfolio review with mentor",         phase: 2, status: "done",     completedDate: "Mar 8",  time: "1h",   category: "action",   notes: [{ id: "n2", text: "Alice said your portfolio is coming together beautifully. You should be proud!", timestamp: "Mar 9", type: "encouragement" }] },
  { id: "a-m11", label: "Send first 3 applications",            phase: 2, status: "done",     completedDate: "Mar 15", time: "2h",   category: "action",   notes: [] },
  { id: "a-m12", label: "Salary research & negotiation prep",   phase: 2, status: "upcoming", time: "2h",   category: "resource", notes: [] },
  { id: "a-m13", label: "Cold outreach campaign",               phase: 2, status: "upcoming", time: "4h",   category: "action",   notes: [] },
  // Phase 3 — upcoming
  { id: "a-m14", label: "Mock interview practice × 3",          phase: 3, status: "upcoming", time: "6h",   category: "skill",    notes: [] },
  { id: "a-m15", label: "Design challenge preparation",         phase: 3, status: "upcoming", time: "5h",   category: "skill",    notes: [] },
  { id: "a-m16", label: "Behavioral interview stories",         phase: 3, status: "upcoming", time: "3h",   category: "resource", notes: [] },
  { id: "a-m17", label: "Live interview × Figma",               phase: 3, status: "locked",   time: "2h",   category: "action",   notes: [] },
  { id: "a-m18", label: "Offer evaluation & negotiation",       phase: 3, status: "locked",   time: "2h",   category: "action",   notes: [] },
  { id: "a-m19", label: "Decision & acceptance",                phase: 3, status: "locked",   time: "1h",   category: "action",   notes: [] },
  // Phase 4 — locked
  { id: "a-m20", label: "First 30 days plan",                   phase: 4, status: "locked",   time: "2h",   category: "resource", notes: [] },
  { id: "a-m21", label: "Stakeholder mapping",                  phase: 4, status: "locked",   time: "1h",   category: "action",   notes: [] },
  { id: "a-m22", label: "90-day review prep",                   phase: 4, status: "locked",   time: "2h",   category: "skill",    notes: [] },
  { id: "a-m23", label: "Long-term career strategy",            phase: 4, status: "locked",   time: "3h",   category: "resource", notes: [] },
];

const ALEX: ChildData = {
  id: "alex",
  name: "Alex",
  initial: "A",
  goal: "Product Designer",
  startDate: "Jan 15, 2026",
  streak: 12,
  daysActive: 62,
  phases: ALEX_PHASES,
  milestones: ALEX_MILESTONES,
  activity: [
    { label: "Completed Module 3: Microinteractions video",       time: "Today, 9am",  type: "milestone"   },
    { label: "Sent application to Vercel — Product Designer",     time: "Yesterday",   type: "application" },
    { label: "Logged 2h study session",                           time: "Yesterday",   type: "session"     },
    { label: "Mentor session with Alice Chen — portfolio review", time: "Mar 16",      type: "session"     },
    { label: "Opened Interaction Design module",                  time: "Mar 14",      type: "milestone"   },
    { label: "Application sent to Figma",                         time: "Mar 15",      type: "application" },
  ],
  budgetPhases: [
    { id: 1, title: "Discover & Position", status: "done",     spent: 450, estimated: 450,  items: ["LinkedIn Premium (3mo): $90", "Career coach intro session: $150", "Portfolio domain & hosting: $150", "Notion + tools: $60"] },
    { id: 2, title: "Build & Apply",       status: "active",   spent: 650, estimated: 1200, items: ["Interaction Design course: $400", "Portfolio hosting & tools: $150", "Networking events ×3: $200 (est.)", "Mentor sessions ×5: $450 (est.)"] },
    { id: 3, title: "Interview & Close",   status: "upcoming", spent: 0,   estimated: 800,  items: ["Mock interview sessions: $300", "Interview prep resources: $150", "Professional headshots: $200", "Travel for interviews: $150 (est.)"] },
    { id: 4, title: "Transition & Grow",   status: "upcoming", spent: 0,   estimated: 300,  items: ["First-week transport & meals: $150", "Professional attire: $150"] },
  ],
  upcoming: [
    { text: "Mentor session with Alice Chen", date: "Friday, 2 PM", color: "var(--ce-role-guide)" },
    { text: "Networking outreach milestone",  date: "Next Monday",   color: "var(--ce-role-parent)" },
    { text: "Phase 2 completion target",      date: "Apr 1",         color: "var(--ce-lime)" },
  ],
  sophiaMessage: "Alex is 60% through Phase 2 — ahead of schedule for their goal. Their biggest momentum driver has been consistent short sessions — averaging 1.4 hours/day. The Interaction Design module they're in now is critical for their top job targets. Great time to send encouragement.",
};

// ─── Data — Jamie ────────────────────────────────────────────────────────────

const JAMIE_PHASES: Phase[] = [
  { id: 1, title: "Explore & Clarify",  subtitle: "Interests, strengths, and direction",          status: "active",   progress: 0.4, milestoneCount: 5, doneCount: 2 },
  { id: 2, title: "Skills & Portfolio", subtitle: "Building skills and proof of work",             status: "upcoming", progress: 0,   milestoneCount: 5, doneCount: 0 },
  { id: 3, title: "Apply & Interview",  subtitle: "Targeting internships and landing an offer",    status: "locked",   progress: 0,   milestoneCount: 4, doneCount: 0 },
  { id: 4, title: "Start & Reflect",    subtitle: "Making the most of the internship",             status: "locked",   progress: 0,   milestoneCount: 3, doneCount: 0 },
];

const JAMIE_MILESTONES: Milestone[] = [
  // Phase 1 — active (2/5 done)
  { id: "j-m1",  label: "Career interest discovery exercise",   phase: 1, status: "done",     completedDate: "Mar 5",  time: "1h",    category: "action",   sophiaNote: "Jamie showed strong interest in research and user empathy. UX Research Intern is a great fit for this stage.", notes: [] },
  { id: "j-m2",  label: "Strengths self-assessment",            phase: 1, status: "done",     completedDate: "Mar 10", time: "1h",    category: "resource", notes: [] },
  { id: "j-m3",  label: "Research 5 target companies",          phase: 1, status: "current",  time: "2h",    category: "action",   sophiaNote: "Encourage Jamie to look at companies with known internship programs — Figma, Notion, Linear, and early-stage startups are all strong fits.", notes: [] },
  { id: "j-m4",  label: "Talk to someone in UX Research",       phase: 1, status: "upcoming", time: "1h",    category: "action",   notes: [] },
  { id: "j-m5",  label: "Set 3-month goals with Sophia",        phase: 1, status: "upcoming", time: "30min", category: "skill",    notes: [] },
  // Phase 2 — upcoming
  { id: "j-m6",  label: "Complete: Intro to UX Research course", phase: 2, status: "upcoming", time: "8h",   category: "skill",    notes: [] },
  { id: "j-m7",  label: "Conduct a 3-person user interview",    phase: 2, status: "upcoming", time: "3h",    category: "skill",    notes: [] },
  { id: "j-m8",  label: "Build a research case study",          phase: 2, status: "upcoming", time: "6h",    category: "action",   notes: [] },
  { id: "j-m9",  label: "Create LinkedIn profile",              phase: 2, status: "upcoming", time: "1h",    category: "action",   notes: [] },
  { id: "j-m10", label: "Get 1 mentor session",                 phase: 2, status: "upcoming", time: "1h",    category: "resource", notes: [] },
  // Phase 3 — locked
  { id: "j-m11", label: "Send 5 internship applications",       phase: 3, status: "locked",   time: "3h",    category: "action",   notes: [] },
  { id: "j-m12", label: "Mock interview × 2",                   phase: 3, status: "locked",   time: "2h",    category: "skill",    notes: [] },
  { id: "j-m13", label: "Take-home research exercise",          phase: 3, status: "locked",   time: "4h",    category: "skill",    notes: [] },
  { id: "j-m14", label: "Offer review & acceptance",            phase: 3, status: "locked",   time: "1h",    category: "action",   notes: [] },
  // Phase 4 — locked
  { id: "j-m15", label: "First week check-in",                  phase: 4, status: "locked",   time: "30min", category: "action",   notes: [] },
  { id: "j-m16", label: "Mid-internship reflection",            phase: 4, status: "locked",   time: "1h",    category: "resource", notes: [] },
  { id: "j-m17", label: "Final project wrap-up & portfolio",    phase: 4, status: "locked",   time: "3h",    category: "skill",    notes: [] },
];

const JAMIE: ChildData = {
  id: "jamie",
  name: "Jamie",
  initial: "J",
  goal: "UX Research Intern",
  startDate: "Mar 1, 2026",
  streak: 8,
  daysActive: 21,
  phases: JAMIE_PHASES,
  milestones: JAMIE_MILESTONES,
  activity: [
    { label: "Completed: Strengths self-assessment",   time: "Mar 10",  type: "milestone" },
    { label: "Logged 45min study session",             time: "Mar 8",   type: "session"   },
    { label: "Career interest discovery done",         time: "Mar 5",   type: "milestone" },
    { label: "Joined CareerEdge — account linked",     time: "Mar 1",   type: "session"   },
  ],
  budgetPhases: [
    { id: 1, title: "Explore & Clarify",  status: "active",   spent: 0, estimated: 100, items: ["Notion (free plan): $0", "Domain & portfolio site: $100 (est.)"] },
    { id: 2, title: "Skills & Portfolio", status: "upcoming", spent: 0, estimated: 250, items: ["UX Research course: $150", "Tools & subscriptions: $50", "Mentor session: $50"] },
    { id: 3, title: "Apply & Interview",  status: "upcoming", spent: 0, estimated: 150, items: ["Travel for interviews: $100 (est.)", "Professional attire: $50"] },
    { id: 4, title: "Start & Reflect",    status: "upcoming", spent: 0, estimated: 50,  items: ["First-week transport: $50"] },
  ],
  upcoming: [
    { text: "Research 5 companies milestone",         date: "This week",    color: "var(--ce-role-parent)" },
    { text: "Talk to someone in UX Research",         date: "Next week",    color: "var(--ce-role-guide)" },
    { text: "Phase 1 completion target",              date: "Apr 15",       color: "var(--ce-lime)" },
  ],
  sophiaMessage: "Jamie is 2 weeks in and building strong habits — logging sessions 4–5 days a week. They're currently researching target companies for Phase 1. The best way to support them right now is with gentle curiosity, not pressure — ask what they're finding interesting.",
};

// ─── Children Registry ────────────────────────────────────────────────────────

const CHILDREN: ChildData[] = [ALEX, JAMIE];

// ─── Shared helpers ──────────────────────────────────────────────────────────

const PRESET_NOTES = [
  { label: "So proud of you!", type: "encouragement" as const },
  { label: "Keep going — you've got this", type: "encouragement" as const },
  { label: "This is a big deal. Celebrate it!", type: "encouragement" as const },
  { label: "You're making us proud every day", type: "encouragement" as const },
];

const categoryIcon = {
  skill:    <Zap className="w-3 h-3" />,
  action:   <Target className="w-3 h-3" />,
  resource: <BookOpen className="w-3 h-3" />,
};

// ─── Child Selector ───────────────────────────────────────────────────────────

function ChildSelector({
  children,
  selectedId,
  onSelect,
  onAddChild,
}: {
  children: ChildData[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddChild: () => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {children.map((child) => {
        const isActive = child.id === selectedId;
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
            style={{
              background: isActive ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
              border: `1px solid ${isActive ? "rgba(var(--ce-role-parent-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)"}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] text-[var(--ce-role-parent)] flex-shrink-0"
              style={{ background: "rgba(var(--ce-role-parent-rgb),0.12)", fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {child.initial}
            </div>
            <div className="text-left">
              <span
                className="text-[12px] block leading-tight"
                style={{ color: isActive ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {child.name}
              </span>
              <span
                className="text-[10px] block leading-tight"
                style={{ color: isActive ? "var(--ce-role-parent)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}
              >
                {child.goal}
              </span>
            </div>
          </button>
        );
      })}

      {/* Add child CTA */}
      <button
        onClick={onAddChild}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px dashed rgba(var(--ce-glass-tint),0.08)" }}
      >
        <UserPlus className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
        <span className="text-[12px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
          Add child
        </span>
      </button>
    </div>
  );
}

// ─── Budget Card ──────────────────────────────────────────────────────────────

function BudgetCard({ budgetPhases, childName }: { budgetPhases: BudgetPhaseData[]; childName: string }) {
  const [openPhase, setOpenPhase] = useState<number | null>(
    budgetPhases.find((p) => p.status === "active")?.id ?? null
  );

  const totalSpent     = budgetPhases.reduce((s, p) => s + p.spent, 0);
  const totalEstimated = budgetPhases.reduce((s, p) => s + p.estimated, 0);
  const pct = totalEstimated > 0 ? Math.round((totalSpent / totalEstimated) * 100) : 0;

  return (
    <GlassCard delay={0.5}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.08)" }}>
            <DollarSign className="w-3.5 h-3.5 text-ce-lime" />
          </div>
          <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Budget Tracker
          </span>
        </div>
        <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
          {childName}'s journey
        </span>
      </div>

      {/* Totals */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-[22px] text-ce-lime tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            ${totalSpent.toLocaleString()}
          </span>
          <span className="text-[11px] text-[var(--ce-text-secondary)] ml-1.5" style={{ fontFamily: "var(--font-body)" }}>
            of ${totalEstimated.toLocaleString()} est.
          </span>
        </div>
        <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>
          {pct}% used
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--ce-lime), var(--ce-role-edgestar))" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
        />
      </div>

      {/* Phase breakdown */}
      <div className="flex flex-col gap-1">
        {budgetPhases.map((phase) => {
          const isOpen = openPhase === phase.id;
          const color =
            phase.status === "done"   ? "var(--ce-lime)" :
            phase.status === "active" ? "var(--ce-role-parent)" :
            "rgba(var(--ce-glass-tint),0.15)";

          return (
            <div key={phase.id}>
              <button
                onClick={() => setOpenPhase(isOpen ? null : phase.id)}
                className="w-full flex items-center gap-2 py-2 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-lg px-1.5 -mx-1.5 transition-colors text-left"
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span
                  className="text-[11px] flex-1"
                  style={{ fontFamily: "var(--font-body)", color: phase.status === "upcoming" ? "var(--ce-text-quaternary)" : "var(--ce-text-tertiary)" }}
                >
                  Ph.{phase.id} {phase.title}
                </span>
                <span className="text-[11px] tabular-nums flex-shrink-0" style={{ fontFamily: "var(--font-body)", color }}>
                  {phase.spent > 0 ? `$${phase.spent}` : "—"} / ${phase.estimated}
                </span>
                <ChevronDown
                  className="w-3 h-3 flex-shrink-0 transition-transform"
                  style={{ color: "var(--ce-text-quaternary)", transform: isOpen ? "rotate(180deg)" : "none" }}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mb-1 flex flex-col gap-1">
                      {phase.items.map((item, i) => (
                        <span key={i} className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                          · {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sophia tip */}
      <div
        className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg"
        style={{ background: "rgba(var(--ce-lime-rgb),0.04)", border: "1px solid rgba(var(--ce-lime-rgb),0.08)" }}
      >
        <Sparkles className="w-3 h-3 text-ce-lime flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {budgetPhases.find((p) => p.status === "upcoming")
            ? `Phase ${budgetPhases.findIndex((p) => p.status === "upcoming") + 1} is coming up — review the budget estimate and set aside funds early.`
            : "Budget is tracking well for this journey."}
        </p>
      </div>
    </GlassCard>
  );
}

// ─── Note Composer ────────────────────────────────────────────────────────────

function NoteComposer({
  milestone,
  childName,
  onSubmit,
  onClose,
}: {
  milestone: Milestone;
  childName: string;
  onSubmit: (milestoneId: string, text: string, type: ParentNote["type"]) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 200);
  }, []);

  const handlePreset = (preset: typeof PRESET_NOTES[0]) => {
    setText(preset.label);
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(milestone.id, text.trim(), "encouragement");
      setText("");
      setSubmitted(false);
    }, 1800);
  };

  const statusLabel =
    milestone.status === "done"    ? `Completed ${milestone.completedDate}` :
    milestone.status === "current" ? "In progress now" :
    "Upcoming milestone";

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(var(--ce-role-parent-rgb),0.04)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.12)" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(var(--ce-role-parent-rgb),0.08)" }}>
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Heart className="w-3 h-3 text-[var(--ce-role-parent)] flex-shrink-0" />
            <span className="text-[11px] text-[var(--ce-role-parent)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Leave a note for {childName}
            </span>
          </div>
          <span className="text-[11px] text-[var(--ce-text-tertiary)] block truncate" style={{ fontFamily: "var(--font-body)" }}>
            {milestone.label}
          </span>
          <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
            {statusLabel}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
        </button>
      </div>

      {/* Sophia context */}
      {milestone.sophiaNote && (
        <div className="px-4 py-2.5 flex items-start gap-2" style={{ borderBottom: "1px solid rgba(var(--ce-role-parent-rgb),0.06)", background: "rgba(var(--ce-role-edgestar-rgb),0.02)" }}>
          <SophiaMark size={12} glowing={false} />
          <p className="text-[10px] text-[var(--ce-text-secondary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {milestone.sophiaNote}
          </p>
        </div>
      )}

      {/* Existing notes */}
      {milestone.notes.length > 0 && (
        <div className="px-4 py-3 flex flex-col gap-2" style={{ borderBottom: "1px solid rgba(var(--ce-role-parent-rgb),0.06)" }}>
          {milestone.notes.map((note) => (
            <div key={note.id} className="rounded-lg px-3 py-2" style={{ background: "rgba(var(--ce-role-parent-rgb),0.06)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.1)" }}>
              <p className="text-[11px] text-[var(--ce-text-primary)] leading-relaxed mb-1" style={{ fontFamily: "var(--font-body)" }}>
                "{note.text}"
              </p>
              <span className="text-[9px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                You · {note.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Compose area */}
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="sent"
              className="flex flex-col items-center py-5 gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)", border: "1.5px solid rgba(var(--ce-role-parent-rgb),0.25)" }}
                animate={{ scale: [1, 1.12, 1], boxShadow: ["0 0 0px rgba(var(--ce-role-parent-rgb),0)", "0 0 20px rgba(var(--ce-role-parent-rgb),0.3)", "0 0 0px rgba(var(--ce-role-parent-rgb),0)"] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Heart className="w-5 h-5 text-[var(--ce-role-parent)]" style={{ fill: "rgba(var(--ce-role-parent-rgb),0.3)" }} />
              </motion.div>
              <span className="text-[12px] text-[var(--ce-role-parent)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Note sent to {childName}
              </span>
              <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                They'll see it when they open their roadmap
              </span>
            </motion.div>
          ) : (
            <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Preset chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {PRESET_NOTES.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePreset(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-full cursor-pointer hover:border-[rgba(var(--ce-role-parent-rgb),0.3)] transition-colors"
                    style={{
                      background: text === preset.label ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
                      border: `1px solid ${text === preset.label ? "rgba(var(--ce-role-parent-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                      color: text === preset.label ? "var(--ce-role-parent)" : "var(--ce-text-tertiary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Text input */}
              <div className="rounded-xl overflow-hidden mb-3" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Write something encouraging for ${childName}...`}
                  rows={3}
                  className="w-full px-3 pt-3 pb-2 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                />
                <div className="flex items-center justify-between px-3 pb-2.5">
                  <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>⌘↵ to send</span>
                  <span className="text-[9px] tabular-nums" style={{ color: text.length > 200 ? "var(--ce-status-error)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>
                    {text.length}/240
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  background: text.trim() ? "rgba(var(--ce-role-parent-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
                  border: `1px solid ${text.trim() ? "rgba(var(--ce-role-parent-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                  color: text.trim() ? "var(--ce-role-parent)" : "var(--ce-text-quaternary)",
                  fontFamily: "var(--font-display)", fontWeight: 500,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Send note to {childName}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Phase Section ────────────────────────────────────────────────────────────

function PhaseSection({
  phase,
  milestones,
  selectedMilestoneId,
  onSelectMilestone,
}: {
  phase: Phase;
  milestones: Milestone[];
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string | null) => void;
}) {
  const [collapsed, setCollapsed] = useState(phase.status === "locked");
  const isLocked   = phase.status === "locked";
  const isDone     = phase.status === "done";
  const isActive   = phase.status === "active";
  const phaseColor = isDone ? "var(--ce-lime)" : isActive ? "var(--ce-role-parent)" : "var(--ce-text-quaternary)";

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(var(--ce-glass-tint),0.015)", border: `1px solid ${isActive ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}` }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + phase.id * 0.07, duration: 0.4, ease: EASE }}
    >
      {/* Phase header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors text-left"
        onClick={() => !isLocked && setCollapsed(!collapsed)}
        disabled={isLocked}
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
          background: isDone ? "rgba(var(--ce-lime-rgb),0.12)" : isActive ? "rgba(var(--ce-role-parent-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
          border: `1.5px solid ${isDone ? "rgba(var(--ce-lime-rgb),0.3)" : isActive ? "rgba(var(--ce-role-parent-rgb),0.3)" : "rgba(var(--ce-glass-tint),0.08)"}`,
        }}>
          {isDone   ? <Check   className="w-2.5 h-2.5" style={{ color: "var(--ce-lime)" }} /> :
           isActive ? <div className="w-2 h-2 rounded-full" style={{ background: "var(--ce-role-parent)", boxShadow: "0 0 6px rgba(var(--ce-role-parent-rgb),0.5)" }} /> :
           isLocked ? <Lock    className="w-2.5 h-2.5 text-[var(--ce-text-quaternary)]" /> :
                      <Circle  className="w-2.5 h-2.5 text-[var(--ce-text-quaternary)]" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: isLocked ? "var(--ce-text-quaternary)" : "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Phase {phase.id} — {phase.title}
            </span>
            {isActive && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)", color: "var(--ce-role-parent)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.2)", fontFamily: "var(--font-body)" }}>
                Active
              </span>
            )}
          </div>
          <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
            {phase.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] tabular-nums" style={{ color: phaseColor, fontFamily: "var(--font-body)" }}>
            {phase.doneCount}/{phase.milestoneCount}
          </span>
          <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: phaseColor }}
              initial={{ width: 0 }}
              animate={{ width: `${phase.progress * 100}%` }}
              transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
            />
          </div>
          {!isLocked && (
            collapsed
              ? <ChevronDown className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              : <ChevronUp   className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
          )}
        </div>
      </button>

      {/* Milestone list */}
      <AnimatePresence>
        {!collapsed && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-3 flex flex-col gap-0.5" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              {milestones.map((m) => {
                const isSelected = selectedMilestoneId === m.id;
                const isCurrent  = m.status === "current";
                const isDoneM    = m.status === "done";
                const hasNotes   = m.notes.length > 0;

                return (
                  <div key={m.id}>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-left transition-all"
                      style={{
                        background: isSelected ? "rgba(var(--ce-role-parent-rgb),0.06)" : isCurrent ? "rgba(var(--ce-role-parent-rgb),0.03)" : "transparent",
                        border: `1px solid ${isSelected ? "rgba(var(--ce-role-parent-rgb),0.15)" : isCurrent ? "rgba(var(--ce-role-parent-rgb),0.08)" : "transparent"}`,
                        marginTop: 2,
                      }}
                      onClick={() => onSelectMilestone(isSelected ? null : m.id)}
                    >
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        background: isDoneM ? "rgba(var(--ce-lime-rgb),0.1)" : isCurrent ? "rgba(var(--ce-role-parent-rgb),0.1)" : "transparent",
                        border: `1.5px solid ${isDoneM ? "var(--ce-lime)" : isCurrent ? "var(--ce-role-parent)" : "rgba(var(--ce-glass-tint),0.1)"}`,
                        boxShadow: isCurrent ? "0 0 6px rgba(var(--ce-role-parent-rgb),0.3)" : "none",
                      }}>
                        {isDoneM && <Check className="w-2 h-2 text-ce-lime" />}
                      </div>

                      <span
                        className="flex-1 text-[12px] min-w-0"
                        style={{ color: isDoneM ? "var(--ce-text-secondary)" : isCurrent ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                      >
                        {m.label}
                      </span>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasNotes && <Heart className="w-3 h-3" style={{ color: "var(--ce-role-parent)", fill: "rgba(var(--ce-role-parent-rgb),0.3)" }} />}
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)", color: "var(--ce-role-parent)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)", fontFamily: "var(--font-body)" }}>
                            In progress
                          </span>
                        )}
                        {isDoneM    && <span className="text-[9px] tabular-nums text-[var(--ce-text-quaternary)]"  style={{ fontFamily: "var(--font-body)" }}>{m.completedDate}</span>}
                        {!isDoneM && !isCurrent && <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>~{m.time}</span>}
                        <div style={{ color: "var(--ce-text-quaternary)" }}>{categoryIcon[m.category]}</div>
                        <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

function ActivityFeed({ activity }: { activity: ActivityItem[] }) {
  const typeColor = { milestone: "var(--ce-lime)", application: "var(--ce-role-edgestar)", session: "var(--ce-role-guide)" };
  const typeIcon  = {
    milestone:   <Check          className="w-3 h-3" />,
    application: <ArrowUpRight   className="w-3 h-3" />,
    session:     <Calendar       className="w-3 h-3" />,
  };

  return (
    <GlassCard delay={0.5}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
        <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Recent Activity
        </span>
      </div>
      <div className="flex flex-col gap-0">
        {activity.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < activity.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${typeColor[item.type]}10` }}>
              <div style={{ color: typeColor[item.type] }}>{typeIcon[item.type]}</div>
            </div>
            <span className="text-[12px] text-[var(--ce-text-tertiary)] flex-1 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {item.label}
            </span>
            <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0 whitespace-nowrap mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function FamilySurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { openSophia } = useSophia();
  const role = "parent" as const;

  const [selectedChildId,   setSelectedChildId  ] = useState<string>(CHILDREN[0].id);
  const [showAddChild,      setShowAddChild      ] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [milestonesByChild, setMilestonesByChild ] = useState<Record<string, Milestone[]>>(
    () => Object.fromEntries(CHILDREN.map((c) => [c.id, c.milestones]))
  );

  const activeChild = CHILDREN.find((c) => c.id === selectedChildId) ?? CHILDREN[0];
  const milestones  = milestonesByChild[selectedChildId] ?? [];
  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) ?? null;

  // Reset note composer when switching children
  useEffect(() => { setSelectedMilestoneId(null); }, [selectedChildId]);

  const handleNavigate = (target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`,
      family:    `/${role}/family`,
      messages:  `/${role}/messages`,
      sessions:  `/${role}/sessions`,
      landing:   "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  const handleAddNote = (milestoneId: string, text: string, type: ParentNote["type"]) => {
    setMilestonesByChild((prev) => ({
      ...prev,
      [selectedChildId]: (prev[selectedChildId] ?? []).map((m) =>
        m.id === milestoneId
          ? { ...m, notes: [...m.notes, { id: `n${Date.now()}`, text, timestamp: "Just now", type }] }
          : m
      ),
    }));
  };

  const sophiaOverride = {
    message: activeChild.sophiaMessage,
    chips: [
      { label: `How can I support ${activeChild.name}?`, action: `How can I best support my child through their career roadmap?` },
      { label: "What's coming next?",                    action: `What milestones is ${activeChild.name} working towards next?` },
    ],
    actionPrompt: `How is my child ${activeChild.name} doing in their career roadmap, and what's the best way I can support them right now?`,
  };

  const totalDone       = milestones.filter((m) => m.status === "done").length;
  const totalMilestones = milestones.filter((m) => m.status !== "locked").length;
  const overallPct      = totalMilestones > 0 ? Math.round((totalDone / totalMilestones) * 100) : 0;

  return (
    <RoleShell
      role={role}
      userName="David"
      userInitial="D"
      edgeGas={20}
      onNavigate={handleNavigate}
      sophiaOverride={sophiaOverride}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Child selector — persistent at top */}
        <motion.div
          className="pt-8 pb-5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35, ease: EASE }}
        >
          <ChildSelector
            children={CHILDREN}
            selectedId={selectedChildId}
            onSelect={setSelectedChildId}
            onAddChild={() => setShowAddChild(true)}
          />
        </motion.div>

        {/* Per-child content — keyed so it re-animates on switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChild.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {/* Header */}
            <div className="pb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] text-[var(--ce-role-parent)]"
                    style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)", fontFamily: "var(--font-display)", fontWeight: 600 }}
                  >
                    {activeChild.initial}
                  </div>
                  <div>
                    <h1 className="text-[22px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      {activeChild.name}'s Journey
                    </h1>
                    <p className="text-[12px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                      Targeting {activeChild.goal} · Started {activeChild.startDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-4">
                {[
                  { label: "Overall progress", value: `${overallPct}%`,        color: "var(--ce-role-parent)" },
                  { label: "Milestones done",  value: `${totalDone}`,           color: "var(--ce-lime)" },
                  { label: "Day streak",       value: `${activeChild.streak}`,  color: "var(--ce-role-edgestar)" },
                ].map((stat) => (
                  <div key={stat.label} className="text-right">
                    <div className="text-[20px] tabular-nums" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase progress bar strip */}
            <div className="flex gap-2 mb-6">
              {activeChild.phases.map((phase) => {
                const color = phase.status === "done" ? "var(--ce-lime)" : phase.status === "active" ? "var(--ce-role-parent)" : "rgba(var(--ce-glass-tint),0.06)";
                return (
                  <div key={phase.id} className="flex-1">
                    <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.progress * 100}%` }}
                        transition={{ delay: 0.3 + phase.id * 0.1, duration: 0.7, ease: EASE }}
                      />
                    </div>
                    <span className="text-[10px]" style={{ color: phase.status === "locked" ? "var(--ce-text-quaternary)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
                      Ph.{phase.id} {phase.status === "done" ? "✓" : phase.status === "active" ? "↑" : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Main two-column layout */}
            <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>

              {/* Left: Roadmap phases */}
              <div className="flex flex-col gap-3">
                {activeChild.phases.map((phase) => (
                  <PhaseSection
                    key={`${activeChild.id}-${phase.id}`}
                    phase={phase}
                    milestones={milestones.filter((m) => m.phase === phase.id)}
                    selectedMilestoneId={selectedMilestoneId}
                    onSelectMilestone={setSelectedMilestoneId}
                  />
                ))}
              </div>

              {/* Right: Dynamic panel */}
              <div className="flex flex-col gap-4">
                {/* Note composer — appears when milestone selected */}
                <AnimatePresence mode="wait">
                  {selectedMilestone ? (
                    <NoteComposer
                      key={selectedMilestone.id}
                      milestone={selectedMilestone}
                      childName={activeChild.name}
                      onSubmit={handleAddNote}
                      onClose={() => setSelectedMilestoneId(null)}
                    />
                  ) : (
                    <motion.div
                      key="note-prompt"
                      className="rounded-xl p-4 flex items-center gap-3"
                      style={{ background: "rgba(var(--ce-role-parent-rgb),0.03)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.08)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-role-parent-rgb),0.08)" }}>
                        <Heart className="w-4 h-4 text-[var(--ce-role-parent)]" />
                      </div>
                      <div>
                        <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          Leave a note
                        </span>
                        <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                          Select a milestone on the left to write a note for {activeChild.name}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sophia insight */}
                <SophiaInsight
                  message={activeChild.sophiaMessage}
                  actionLabel={`Ask Sophia about ${activeChild.name}`}
                  onAction={() => openSophia(`How is my child ${activeChild.name} doing in their career roadmap, and what's the best way I can support them right now?`)}
                  actionPrompt={`How is my child ${activeChild.name} doing in their career roadmap, and what's the best way I can support them right now?`}
                  delay={0.4}
                />

                {/* Budget Tracker */}
                <BudgetCard budgetPhases={activeChild.budgetPhases} childName={activeChild.name} />

                {/* Upcoming */}
                <GlassCard delay={0.55}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" />
                    <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Coming Up</span>
                  </div>
                  {activeChild.upcoming.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < activeChild.upcoming.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-[12px] text-[var(--ce-text-tertiary)] flex-1" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]"          style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
                    </div>
                  ))}
                </GlassCard>

                {/* Quick message */}
                <GlassCard delay={0.65}>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--ce-role-parent)]" />
                    <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Message {activeChild.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Great progress! 🙌", "How's it going?", "Need anything?", "Proud of you!"].map((msg) => (
                      <button
                        key={msg}
                        onClick={() => handleNavigate("messages")}
                        className="text-[11px] text-[var(--ce-text-tertiary)] px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-parent-rgb),0.06)] hover:text-[var(--ce-role-parent)] transition-colors"
                        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </GlassCard>

                {/* Activity feed */}
                <ActivityFeed activity={activeChild.activity} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add child — QR linking modal */}
      <QRModal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        title="Link a child's account"
        showLabel="My parent QR"
        scanLabel="Child's QR"
        showDescription="Have your child scan this from their CareerEdge app"
        scanDescription="Scan the QR code shown in your child's CareerEdge app"
        roleColor="var(--ce-role-parent)"
        identifier="PARENT-CE"
        onScanComplete={() => setShowAddChild(false)}
      />
    </RoleShell>
  );
}
