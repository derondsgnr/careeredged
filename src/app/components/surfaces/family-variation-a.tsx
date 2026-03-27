/**
 * Family Variation A — "Constellation"
 *
 * Overview-first layout. Parents see ALL children as cards with radial
 * progress arcs (SVG gauge rings). Tapping a card expands into a detail
 * view with phases, milestones, notes, and Sophia. The overview gives the
 * gestalt; the detail gives depth.
 */

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { QRModal } from "../shared-patterns";
import { PhaseBar } from "../kpi-patterns";
import { EASE, SPRING, COLORS, TEXT, SURFACE, FONT } from "../tokens";
import {
  Check, Clock, Zap, UserPlus, ArrowLeft,
  Target, BookOpen, Lock, ChevronDown, ChevronRight,
  Calendar, DollarSign, MessageSquare, Heart, Send,
  Sparkles, Compass,
} from "lucide-react";


// ─── Types ───────────────────────────────────────────────────────────────────

interface ParentNote {
  id: string;
  text: string;
  timestamp: string;
  type: "encouragement" | "question" | "reflection";
}

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

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  status: "done" | "active" | "upcoming" | "locked";
  progress: number;
  milestoneCount: number;
  doneCount: number;
}

interface BudgetPhaseData {
  id: number;
  title: string;
  status: "done" | "active" | "upcoming";
  spent: number;
  estimated: number;
  items: string[];
}

interface ActivityItem {
  label: string;
  time: string;
  type: "milestone" | "application" | "session";
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
  upcoming: { text: string; date: string; color: string }[];
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
  // Phase 2 — mixed
  { id: "a-m6",  label: "Complete Interaction Design module",   phase: 2, status: "current",  time: "4h",   category: "skill",    sophiaNote: "Alex is 60% through this module. The remaining exercises are where hiring managers test candidates — important they don't rush.", notes: [] },
  { id: "a-m7",  label: "Build second case study",              phase: 2, status: "upcoming", time: "10h",  category: "skill",    notes: [] },
  { id: "a-m9",  label: "Resume ATS optimization",              phase: 2, status: "done",     completedDate: "Mar 5",  time: "1h",   category: "action",   notes: [] },
  { id: "a-m10", label: "Portfolio review with mentor",         phase: 2, status: "done",     completedDate: "Mar 8",  time: "1h",   category: "action",   notes: [{ id: "n2", text: "Alice said your portfolio is coming together beautifully. You should be proud!", timestamp: "Mar 9", type: "encouragement" }] },
  { id: "a-m11", label: "Send first 3 applications",            phase: 2, status: "done",     completedDate: "Mar 15", time: "2h",   category: "action",   notes: [] },
  { id: "a-m12", label: "Salary research & negotiation prep",   phase: 2, status: "upcoming", time: "2h",   category: "resource", notes: [] },
  // Phase 3 — upcoming
  { id: "a-m14", label: "Mock interview practice x 3",          phase: 3, status: "upcoming", time: "6h",   category: "skill",    notes: [] },
  { id: "a-m15", label: "Design challenge preparation",         phase: 3, status: "upcoming", time: "5h",   category: "skill",    notes: [] },
  { id: "a-m16", label: "Behavioral interview stories",         phase: 3, status: "upcoming", time: "3h",   category: "resource", notes: [] },
  // Phase 4 — locked
  { id: "a-m20", label: "First 30 days plan",                   phase: 4, status: "locked",   time: "2h",   category: "resource", notes: [] },
  { id: "a-m21", label: "Stakeholder mapping",                  phase: 4, status: "locked",   time: "1h",   category: "action",   notes: [] },
  { id: "a-m22", label: "90-day review prep",                   phase: 4, status: "locked",   time: "2h",   category: "skill",    notes: [] },
];

const ALEX: ChildData = {
  id: "alex",
  name: "Alex",
  initial: "A",
  goal: "Product Designer",
  startDate: "Feb 10, 2026",
  streak: 14,
  daysActive: 42,
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
    { id: 2, title: "Build & Apply",       status: "active",   spent: 650, estimated: 1200, items: ["Interaction Design course: $400", "Portfolio hosting & tools: $150", "Networking events x3: $200 (est.)", "Mentor sessions x5: $450 (est.)"] },
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
  { id: 1, title: "Explore & Clarify",  subtitle: "Interests, strengths, and direction",          status: "active",   progress: 0.35, milestoneCount: 6, doneCount: 2 },
  { id: 2, title: "Skills & Portfolio", subtitle: "Building skills and proof of work",             status: "upcoming", progress: 0,    milestoneCount: 5, doneCount: 0 },
  { id: 3, title: "Apply & Interview",  subtitle: "Targeting internships and landing an offer",    status: "upcoming", progress: 0,    milestoneCount: 4, doneCount: 0 },
  { id: 4, title: "Start & Reflect",    subtitle: "Making the most of the internship",             status: "locked",   progress: 0,    milestoneCount: 2, doneCount: 0 },
];

const JAMIE_MILESTONES: Milestone[] = [
  // Phase 1 — active (2 done)
  { id: "j-m1",  label: "Career interest discovery exercise",   phase: 1, status: "done",     completedDate: "Mar 5",  time: "1h",    category: "action",   sophiaNote: "Jamie showed strong interest in research and user empathy. UX Research Intern is a great fit for this stage.", notes: [] },
  { id: "j-m2",  label: "Strengths self-assessment",            phase: 1, status: "done",     completedDate: "Mar 10", time: "1h",    category: "resource", notes: [] },
  { id: "j-m3",  label: "Research 5 target companies",          phase: 1, status: "current",  time: "2h",    category: "action",   sophiaNote: "Encourage Jamie to look at companies with known internship programs — Figma, Notion, Linear, and early-stage startups are all strong fits.", notes: [] },
  // Phase 2 — upcoming
  { id: "j-m6",  label: "Complete: Intro to UX Research course", phase: 2, status: "upcoming", time: "8h",   category: "skill",    notes: [] },
  { id: "j-m7",  label: "Conduct a 3-person user interview",    phase: 2, status: "upcoming", time: "3h",    category: "skill",    notes: [] },
  { id: "j-m8",  label: "Build a research case study",          phase: 2, status: "upcoming", time: "6h",    category: "action",   notes: [] },
  // Phase 3 — locked
  { id: "j-m11", label: "Send 5 internship applications",       phase: 3, status: "locked",   time: "3h",    category: "action",   notes: [] },
  { id: "j-m12", label: "Mock interview x 2",                   phase: 3, status: "locked",   time: "2h",    category: "skill",    notes: [] },
  // Phase 4 — locked
  { id: "j-m15", label: "First week check-in",                  phase: 4, status: "locked",   time: "30min", category: "action",   notes: [] },
  { id: "j-m16", label: "Mid-internship reflection",            phase: 4, status: "locked",   time: "1h",    category: "resource", notes: [] },
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
  sophiaMessage: "Jamie is 2 weeks in and building strong habits — logging sessions 4-5 days a week. They're currently researching target companies for Phase 1. The best way to support them right now is with gentle curiosity, not pressure — ask what they're finding interesting.",
};

const CHILDREN: ChildData[] = [ALEX, JAMIE];


// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOverallProgress(child: ChildData): number {
  const totalMilestones = child.phases.reduce((s, p) => s + p.milestoneCount, 0);
  const totalDone = child.phases.reduce((s, p) => s + p.doneCount, 0);
  return totalMilestones > 0 ? totalDone / totalMilestones : 0;
}

function getActivePhase(child: ChildData): Phase | undefined {
  return child.phases.find((p) => p.status === "active");
}

function getCurrentMilestone(child: ChildData): Milestone | undefined {
  return child.milestones.find((m) => m.status === "current");
}

function getTotalDone(child: ChildData): number {
  return child.phases.reduce((s, p) => s + p.doneCount, 0);
}

function getTotalBudgetSpent(child: ChildData): number {
  return child.budgetPhases.reduce((s, p) => s + p.spent, 0);
}

function getTotalBudgetEstimated(child: ChildData): number {
  return child.budgetPhases.reduce((s, p) => s + p.estimated, 0);
}

const categoryIcon: Record<string, React.ReactNode> = {
  skill:    <Zap className="w-3 h-3" />,
  action:   <Target className="w-3 h-3" />,
  resource: <BookOpen className="w-3 h-3" />,
};

const activityDotColor: Record<string, string> = {
  milestone: COLORS.pink,
  application: COLORS.cyan,
  session: COLORS.purple,
};

const PRESET_NOTES = [
  "So proud of you!",
  "Keep going — you've got this",
  "This is a big deal!",
  "You're making us proud",
];


// ─── Radial Gauge Ring ───────────────────────────────────────────────────────

function GaugeRing({ progress, delay = 0 }: { progress: number; delay?: number }) {
  const size = 64;
  const cx = 32;
  const cy = 32;
  const r = 26;
  const circumference = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(var(--ce-glass-tint),0.06)"
        strokeWidth={4}
      />
      {/* Progress */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--ce-role-parent)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        transform={`rotate(-90 ${cx} ${cy})`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        transition={{ delay: delay + 0.5, duration: 0.8, ease: EASE }}
      />
      {/* Center text */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill={TEXT.primary}
        style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 16 }}
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}


// ─── Child Orbit Card ────────────────────────────────────────────────────────

function ChildOrbitCard({
  child,
  index,
  onClick,
}: {
  child: ChildData;
  index: number;
  onClick: () => void;
}) {
  const progress = getOverallProgress(child);
  const activePhase = getActivePhase(child);
  const currentMilestone = getCurrentMilestone(child);
  const totalDone = getTotalDone(child);

  return (
    <motion.button
      onClick={onClick}
      className="rounded-2xl p-5 text-left cursor-pointer w-full"
      style={{
        background: SURFACE.card,
        border: `1px solid ${SURFACE.cardBorder}`,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4, ease: EASE }}
      whileHover={{
        y: -2,
        borderColor: "rgba(var(--ce-role-parent-rgb),0.15)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(var(--ce-role-parent-rgb),0.1)",
              border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)",
            }}
          >
            <span style={{ color: "var(--ce-role-parent)", fontSize: 16, fontFamily: FONT.display, fontWeight: 600 }}>
              {child.initial}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 14, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
              {child.name}
            </div>
            <div
              className="px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ fontSize: 10, color: TEXT.tertiary, background: "rgba(var(--ce-glass-tint),0.04)" }}
            >
              {child.goal}
            </div>
          </div>
        </div>

        {/* Gauge ring */}
        <GaugeRing progress={progress} delay={index * 0.1} />
      </div>

      {/* Phase strip */}
      <div className="mt-4">
        <PhaseBar phases={child.phases} accent="var(--ce-role-parent)" delay={0.4 + index * 0.15} />
      </div>

      {/* Stats row */}
      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: `1px solid ${SURFACE.divider}` }}
      >
        <span style={{ fontSize: 11, color: TEXT.secondary, fontFamily: FONT.body }}>
          Phase {activePhase?.id ?? "—"} active
        </span>
        <span className="flex items-center gap-1" style={{ fontSize: 11, color: COLORS.lime, fontFamily: FONT.body }}>
          <Zap className="w-3 h-3" style={{ color: COLORS.lime }} />
          {child.streak} day streak
        </span>
        <span className="flex items-center gap-1" style={{ fontSize: 11, color: COLORS.cyan, fontFamily: FONT.body }}>
          <Check className="w-3 h-3" style={{ color: COLORS.cyan }} />
          {totalDone} done
        </span>
      </div>

      {/* Current milestone */}
      {currentMilestone && (
        <div className="flex items-center gap-2 mt-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "var(--ce-role-parent)", boxShadow: "0 0 8px rgba(var(--ce-role-parent-rgb),0.4)" }}
          />
          <span
            className="truncate"
            style={{ fontSize: 11, color: TEXT.secondary, fontFamily: FONT.body }}
          >
            {currentMilestone.label}
          </span>
          <span style={{ fontSize: 11, color: TEXT.muted, fontFamily: FONT.body, flexShrink: 0 }}>
            {"\u2192"}
          </span>
        </div>
      )}
    </motion.button>
  );
}


// ─── Family Activity Timeline ────────────────────────────────────────────────

function FamilyTimeline({ children }: { children: ChildData[] }) {
  // Merge and take 6 most recent
  const merged = children
    .flatMap((child) =>
      child.activity.map((a) => ({ ...a, childName: child.name, childInitial: child.initial }))
    )
    .slice(0, 6);

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4" style={{ color: TEXT.tertiary }} />
        <span style={{ fontSize: 13, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
          Family Activity
        </span>
        <span
          className="px-2 py-0.5 rounded-full ml-auto"
          style={{ fontSize: 10, color: TEXT.tertiary, background: "rgba(var(--ce-glass-tint),0.04)", fontFamily: FONT.body }}
        >
          Recent
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {merged.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06, duration: 0.3, ease: EASE }}
          >
            {/* Color dot */}
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: activityDotColor[item.type] ?? TEXT.muted }}
            />
            {/* Child initial badge */}
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(var(--ce-role-parent-rgb),0.1)",
                fontSize: 8,
                color: "var(--ce-role-parent)",
                fontFamily: FONT.display,
                fontWeight: 600,
              }}
            >
              {item.childInitial}
            </div>
            {/* Label */}
            <span className="flex-1 truncate" style={{ fontSize: 12, color: TEXT.secondary, fontFamily: FONT.body }}>
              {item.childName}: {item.label}
            </span>
            {/* Time */}
            <span className="flex-shrink-0" style={{ fontSize: 10, color: TEXT.muted, fontFamily: FONT.body }}>
              {item.time}
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}


// ─── Note Composer (inline in detail view right column) ──────────────────────

function NoteComposerInline({
  milestone,
  childName,
  onClose,
}: {
  milestone: Milestone;
  childName: string;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 200);
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setText(""); onClose(); }, 1800);
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(var(--ce-role-parent-rgb),0.04)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.12)" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(var(--ce-role-parent-rgb),0.08)" }}>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-[var(--ce-role-parent)]" />
          <span style={{ fontSize: 11, color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 500 }}>
            Note for {childName}
          </span>
        </div>
        <button onClick={onClose} className="text-[10px] cursor-pointer hover:opacity-70" style={{ color: TEXT.muted, fontFamily: FONT.body }}>
          Cancel
        </button>
      </div>

      <div className="px-4 py-2" style={{ borderBottom: "1px solid rgba(var(--ce-role-parent-rgb),0.06)" }}>
        <span style={{ fontSize: 10, color: TEXT.muted, fontFamily: FONT.body }}>
          On: {milestone.label}
        </span>
      </div>

      {milestone.sophiaNote && (
        <div className="px-4 py-2 flex items-start gap-2" style={{ borderBottom: "1px solid rgba(var(--ce-role-parent-rgb),0.06)", background: "rgba(var(--ce-role-edgestar-rgb),0.02)" }}>
          <SophiaMark size={11} glowing={false} />
          <p style={{ fontSize: 10, color: TEXT.tertiary, fontFamily: FONT.body, lineHeight: 1.5 }}>
            {milestone.sophiaNote}
          </p>
        </div>
      )}

      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              className="flex flex-col items-center py-4 gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)", border: "1.5px solid rgba(var(--ce-role-parent-rgb),0.25)" }}
                animate={{ scale: [1, 1.12, 1], boxShadow: ["0 0 0px rgba(var(--ce-role-parent-rgb),0)", "0 0 20px rgba(var(--ce-role-parent-rgb),0.3)", "0 0 0px rgba(var(--ce-role-parent-rgb),0)"] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Heart className="w-4 h-4 text-[var(--ce-role-parent)]" style={{ fill: "rgba(var(--ce-role-parent-rgb),0.3)" }} />
              </motion.div>
              <span style={{ fontSize: 12, color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 500 }}>
                Sent to {childName}
              </span>
            </motion.div>
          ) : (
            <motion.div key="compose" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {PRESET_NOTES.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setText(preset)}
                    className="cursor-pointer transition-colors"
                    style={{
                      fontSize: 10, padding: "4px 10px", borderRadius: 999,
                      background: text === preset ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
                      border: `1px solid ${text === preset ? "rgba(var(--ce-role-parent-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                      color: text === preset ? "var(--ce-role-parent)" : TEXT.secondary,
                      fontFamily: FONT.body,
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Write something for ${childName}...`}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl text-[12px] bg-transparent outline-none resize-none mb-2.5"
                style={{ fontFamily: FONT.body, color: TEXT.primary, background: `rgba(var(--ce-glass-tint),0.03)`, border: `1px solid rgba(var(--ce-glass-tint),0.07)` }}
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSend(); }}
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  background: text.trim() ? "rgba(var(--ce-role-parent-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
                  border: `1px solid ${text.trim() ? "rgba(var(--ce-role-parent-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                  color: text.trim() ? "var(--ce-role-parent)" : TEXT.muted,
                  fontFamily: FONT.display, fontWeight: 500,
                }}
              >
                <Send className="w-3.5 h-3.5" /> Send note
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// ─── Detail View ─────────────────────────────────────────────────────────────

function DetailView({
  child,
  onBack,
  onNavigate,
}: {
  child: ChildData;
  onBack: () => void;
  onNavigate: (surface: string) => void;
}) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(
    child.phases.find((p) => p.status === "active")?.id ?? null
  );
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const selectedMilestone = child.milestones.find((m) => m.id === selectedMilestoneId) ?? null;

  const overallProgress = getOverallProgress(child);
  const totalDone = getTotalDone(child);
  const totalBudgetSpent = getTotalBudgetSpent(child);
  const totalBudgetEstimated = getTotalBudgetEstimated(child);
  const budgetProgress = totalBudgetEstimated > 0 ? totalBudgetSpent / totalBudgetEstimated : 0;
  const nextBudgetPhase = child.budgetPhases.find((p) => p.status === "upcoming");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 mb-4 cursor-pointer hover:opacity-70 transition-opacity"
        style={{ fontSize: 12, color: TEXT.tertiary, fontFamily: FONT.body }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to family
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(var(--ce-role-parent-rgb),0.1)",
              border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)",
            }}
          >
            <span style={{ color: "var(--ce-role-parent)", fontSize: 18, fontFamily: FONT.display, fontWeight: 600 }}>
              {child.initial}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 18, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
              {child.name}'s Journey
            </div>
            <div style={{ fontSize: 12, color: TEXT.tertiary, fontFamily: FONT.body }}>
              {child.goal} · Started {child.startDate}
            </div>
          </div>
        </div>

        {/* Cross-surface links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("edgepath")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
            style={{ fontSize: 11, color: TEXT.secondary, fontFamily: FONT.body, background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
          >
            <Compass className="w-3 h-3" style={{ color: "var(--ce-role-parent)" }} />
            View roadmap
          </button>
          <button
            onClick={() => onNavigate("messages")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[rgba(var(--ce-role-parent-rgb),0.06)]"
            style={{ fontSize: 11, color: TEXT.secondary, fontFamily: FONT.body, background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
          >
            <MessageSquare className="w-3 h-3" style={{ color: "var(--ce-role-parent)" }} />
            Message
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-5">
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 20, color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 600 }}>
            {Math.round(overallProgress * 100)}%
          </span>
          <span style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body }}>overall</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" style={{ color: COLORS.lime }} />
          <span style={{ fontSize: 13, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
            {totalDone}
          </span>
          <span style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body }}>milestones</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" style={{ color: COLORS.cyan }} />
          <span style={{ fontSize: 13, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
            {child.streak}
          </span>
          <span style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body }}>day streak</span>
        </div>
      </div>

      {/* Phase progress bar strip */}
      <div className="mb-6">
        <PhaseBar phases={child.phases} accent="var(--ce-role-parent)" variant="full" delay={0.2} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Left: Phase sections */}
        <div className="flex flex-col gap-3">
          {child.phases.map((phase) => {
            const isExpanded = expandedPhase === phase.id;
            const phaseMilestones = child.milestones.filter((m) => m.phase === phase.id);
            const isLocked = phase.status === "locked";

            return (
              <GlassCard key={phase.id}>
                <button
                  onClick={() => !isLocked && setExpandedPhase(isExpanded ? null : phase.id)}
                  className={`w-full flex items-center justify-between ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={isLocked}
                >
                  <div className="flex items-center gap-3">
                    {isLocked ? (
                      <Lock className="w-4 h-4" style={{ color: "rgba(var(--ce-glass-tint),0.15)" }} />
                    ) : phase.status === "done" ? (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.12)", border: "1px solid rgba(var(--ce-lime-rgb),0.3)" }}>
                        <Check className="w-2.5 h-2.5" style={{ color: COLORS.lime }} />
                      </div>
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: "rgba(var(--ce-role-parent-rgb),0.2)", border: "2px solid var(--ce-role-parent)", boxShadow: "0 0 6px rgba(var(--ce-role-parent-rgb),0.3)" }}
                      />
                    )}
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, color: isLocked ? TEXT.muted : TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
                          Phase {phase.id}: {phase.title}
                        </span>
                        {phase.status === "active" && (
                          <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, background: "rgba(var(--ce-role-parent-rgb),0.1)", color: "var(--ce-role-parent)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.2)", fontFamily: FONT.body }}>
                            Active
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body }}>
                        {phase.doneCount}/{phase.milestoneCount} milestones · {phase.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {phase.progress > 0 && (
                      <span style={{ fontSize: 11, color: "var(--ce-role-parent)", fontFamily: FONT.body }}>
                        {Math.round(phase.progress * 100)}%
                      </span>
                    )}
                    {!isLocked && (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: TEXT.tertiary }} />
                      ) : (
                        <ChevronRight className="w-4 h-4" style={{ color: TEXT.tertiary }} />
                      )
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      className="mt-3 pt-3 flex flex-col"
                      style={{ borderTop: `1px solid ${SURFACE.divider}` }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {phaseMilestones.map((ms) => {
                        const isClickable = ms.status === "done" || ms.status === "current";
                        const isSelected = selectedMilestoneId === ms.id;
                        const hasNotes = ms.notes.length > 0;

                        return (
                          <div key={ms.id}>
                            <div
                              className={`flex items-center gap-2.5 py-2 px-2 rounded-lg transition-all ${isClickable ? "cursor-pointer hover:bg-[rgba(var(--ce-role-parent-rgb),0.03)]" : ""}`}
                              style={{
                                background: isSelected ? "rgba(var(--ce-role-parent-rgb),0.06)" : "transparent",
                                border: isSelected ? "1px solid rgba(var(--ce-role-parent-rgb),0.15)" : "1px solid transparent",
                                marginBottom: 2,
                              }}
                              onClick={isClickable ? () => setSelectedMilestoneId(isSelected ? null : ms.id) : undefined}
                            >
                              {/* Status indicator */}
                              {ms.status === "done" ? (
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: "rgba(var(--ce-lime-rgb),0.1)", border: "1px solid rgba(var(--ce-lime-rgb),0.3)" }}
                                >
                                  <Check className="w-3 h-3" style={{ color: COLORS.lime }} />
                                </div>
                              ) : ms.status === "current" ? (
                                <div
                                  className="w-5 h-5 rounded-full flex-shrink-0"
                                  style={{
                                    background: "rgba(var(--ce-role-parent-rgb),0.15)",
                                    border: "2px solid var(--ce-role-parent)",
                                    boxShadow: "0 0 8px rgba(var(--ce-role-parent-rgb),0.3)",
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-5 h-5 rounded-full border flex-shrink-0"
                                  style={{ borderColor: "rgba(var(--ce-glass-tint),0.1)" }}
                                />
                              )}
                              {/* Category icon */}
                              <div style={{ color: ms.status === "done" ? TEXT.muted : TEXT.tertiary }}>
                                {categoryIcon[ms.category]}
                              </div>
                              {/* Label */}
                              <span
                                className="flex-1"
                                style={{
                                  fontSize: 12,
                                  color: ms.status === "done" ? TEXT.secondary : TEXT.primary,
                                  fontFamily: FONT.body,
                                  textDecoration: ms.status === "done" ? "line-through" : "none",
                                  textDecorationColor: "rgba(var(--ce-glass-tint),0.15)",
                                }}
                              >
                                {ms.label}
                              </span>
                              {/* Right side indicators */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {hasNotes && <Heart className="w-3 h-3" style={{ color: "var(--ce-role-parent)", fill: "rgba(var(--ce-role-parent-rgb),0.3)" }} />}
                                {ms.status === "current" && (
                                  <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 9, background: "rgba(var(--ce-role-parent-rgb),0.1)", color: "var(--ce-role-parent)", border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)", fontFamily: FONT.body }}>
                                    In progress
                                  </span>
                                )}
                                <span style={{ fontSize: 10, color: TEXT.muted, fontFamily: FONT.body }}>
                                  {ms.completedDate ?? ms.time}
                                </span>
                              </div>
                            </div>

                            {/* Sophia inline note for current milestone */}
                            {ms.status === "current" && ms.sophiaNote && (
                              <div
                                className="ml-8 mb-2 mt-0.5 flex items-start gap-2 px-3 py-2 rounded-lg"
                                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}
                              >
                                <SophiaMark size={11} glowing={false} />
                                <p style={{ fontSize: 11, color: TEXT.secondary, fontFamily: FONT.body, lineHeight: 1.5 }}>
                                  {ms.sophiaNote}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Note composer / prompt — dynamic based on milestone selection */}
          <AnimatePresence mode="wait">
            {selectedMilestone ? (
              <NoteComposerInline
                key={selectedMilestone.id}
                milestone={selectedMilestone}
                childName={child.name}
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
                  <span className="block" style={{ fontSize: 12, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
                    Leave a note
                  </span>
                  <span style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body }}>
                    Tap a milestone to write a note for {child.name}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sophia Insight */}
          <SophiaInsight
            variant="panel"
            message={child.sophiaMessage}
            actionLabel={`Ask about ${child.name}`}
            onAction={() => onNavigate("sessions")}
            delay={0.3}
          />

          {/* Budget tracker */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4" style={{ color: COLORS.lime }} />
              <span style={{ fontSize: 13, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
                Budget
              </span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div>
                <span className="tabular-nums" style={{ fontSize: 20, color: COLORS.lime, fontFamily: FONT.display, fontWeight: 500 }}>
                  ${totalBudgetSpent.toLocaleString()}
                </span>
                <span style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body, marginLeft: 6 }}>
                  of ${totalBudgetEstimated.toLocaleString()} est.
                </span>
              </div>
              <span style={{ fontSize: 11, color: COLORS.lime, fontFamily: FONT.body }}>
                {Math.round(budgetProgress * 100)}% used
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--ce-lime), var(--ce-role-edgestar))" }}
                initial={{ width: 0 }}
                animate={{ width: `${budgetProgress * 100}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              />
            </div>
            {/* Sophia budget tip */}
            {nextBudgetPhase && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(var(--ce-lime-rgb),0.04)", border: "1px solid rgba(var(--ce-lime-rgb),0.08)" }}
              >
                <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: COLORS.lime }} />
                <p style={{ fontSize: 11, color: TEXT.tertiary, fontFamily: FONT.body, lineHeight: 1.5 }}>
                  Phase {nextBudgetPhase.id} ({nextBudgetPhase.title}) is coming up — budget est. ${nextBudgetPhase.estimated}. Set aside funds early.
                </p>
              </div>
            )}
          </GlassCard>

          {/* Upcoming */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: COLORS.purple }} />
              <span style={{ fontSize: 13, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
                Coming Up
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {child.upcoming.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="flex-1" style={{ fontSize: 12, color: TEXT.secondary, fontFamily: FONT.body }}>
                    {item.text}
                  </span>
                  <span style={{ fontSize: 10, color: TEXT.muted, fontFamily: FONT.body, flexShrink: 0 }}>
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick message */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--ce-role-parent)" }} />
              <span style={{ fontSize: 13, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
                Message {child.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Great progress!", "How's it going?", "Need anything?", "Proud of you!"].map((msg) => (
                <button
                  key={msg}
                  onClick={() => onNavigate("messages")}
                  className="cursor-pointer transition-colors hover:bg-[rgba(var(--ce-role-parent-rgb),0.06)] hover:text-[var(--ce-role-parent)]"
                  style={{
                    fontSize: 11, color: TEXT.secondary, padding: "6px 10px", borderRadius: 8,
                    background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                    fontFamily: FONT.body,
                  }}
                >
                  {msg}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}


// ─── Main Component ──────────────────────────────────────────────────────────

export function FamilyVariationA() {
  const navigate = useNavigate();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const selectedChild = CHILDREN.find((c) => c.id === selectedChildId) ?? null;

  const handleNavigate = (surface: string) => {
    const routes: Record<string, string> = {
      synthesis: "/parent",
      family: "/parent/family",
      messages: "/parent/messages",
      sessions: "/parent/sessions",
      edgepath: "/parent/edgepath",
      settings: "/parent/settings",
      landing: "/",
    };
    navigate(routes[surface] ?? "/parent");
  };

  const sophiaOverride = selectedChild
    ? {
        message: selectedChild.sophiaMessage,
        chips: [
          { label: `How is ${selectedChild.name} doing?`, action: `Give me an update on ${selectedChild.name}'s progress across all milestones` },
          { label: "What should I focus on?", action: `What should I focus on next to support ${selectedChild.name}'s development?` },
        ],
      }
    : {
        message: "Both Alex and Jamie are making progress. Ask me about either child.",
        chips: [
          { label: "Family overview", action: "Give me an overview of how all my children are progressing" },
          { label: "Compare progress", action: "Compare my children's progress across their roadmaps" },
        ],
      };

  return (
    <RoleShell
      role="parent"
      userName="David"
      userInitial="D"
      edgeGas={20}
      onNavigate={handleNavigate}
      sophiaOverride={sophiaOverride}
    >
      <div className="px-4 sm:px-6 pb-32">
        <AnimatePresence mode="wait">
          {selectedChild ? (
            <DetailView
              key={selectedChild.id}
              child={selectedChild}
              onBack={() => setSelectedChildId(null)}
              onNavigate={handleNavigate}
            />
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {/* Greeting area */}
              <div className="pt-8 pb-6">
                <h1 style={{ fontSize: 22, color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}>
                  Your family
                </h1>
                <p style={{ fontSize: 13, color: TEXT.tertiary, fontFamily: FONT.body, marginTop: 4 }}>
                  {CHILDREN.length} children linked · All making progress
                </p>
              </div>

              {/* Family Sophia Insight */}
              <div className="mb-5">
                <SophiaInsight
                  variant="inline"
                  message="Both Alex and Jamie are on track this week. Alex is approaching a big milestone in Phase 2, and Jamie is building strong daily habits."
                  actionLabel="Family overview"
                  onAction={() => handleNavigate("edgepath")}
                />
              </div>

              {/* Child Orbit Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
                {CHILDREN.map((child, i) => (
                  <ChildOrbitCard
                    key={child.id}
                    child={child}
                    index={i}
                    onClick={() => setSelectedChildId(child.id)}
                  />
                ))}

                {/* Add child card */}
                <motion.button
                  onClick={() => setQrOpen(true)}
                  className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "1px dashed rgba(var(--ce-glass-tint),0.08)",
                    minHeight: 120,
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
                  whileHover={{ borderColor: "rgba(var(--ce-glass-tint),0.15)" }}
                >
                  <UserPlus className="w-6 h-6" style={{ color: TEXT.tertiary }} />
                  <span style={{ fontSize: 12, color: TEXT.tertiary, fontFamily: FONT.body }}>
                    Link another child
                  </span>
                </motion.button>
              </div>

              {/* Family Activity Timeline */}
              <FamilyTimeline children={CHILDREN} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Link a Child"
        showLabel="Show my parent QR"
        scanLabel="Scan child's QR"
      />
    </RoleShell>
  );
}
