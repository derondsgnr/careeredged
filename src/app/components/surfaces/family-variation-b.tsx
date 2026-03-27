/**
 * Family Surface — Variation B: "Journal"
 *
 * Single-column, content-forward layout where each child's story unfolds
 * as a narrative. Warm, descriptive headings instead of data-first labels.
 * Sticky TabSwitcher-style pill bar for child selection.
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { EASE, COLORS, TEXT, SURFACE, FONT } from "../tokens";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { QRModal } from "../shared-patterns";
import {
  Heart, Check, Calendar, Compass, BookOpen,
  DollarSign, UserPlus, Send, ArrowUpRight,
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

// ─── Data: ALEX ──────────────────────────────────────────────────────────────

const ALEX: ChildData = {
  id: "alex",
  name: "Alex",
  initial: "A",
  goal: "Product Design Intern",
  startDate: "Feb 10, 2026",
  streak: 14,
  daysActive: 42,
  phases: [
    { id: 1, title: "Discover & Position", subtitle: "Self-assessment and market research", status: "done", progress: 1, milestoneCount: 5, doneCount: 5 },
    { id: 2, title: "Build & Apply", subtitle: "Portfolio and applications", status: "active", progress: 0.6, milestoneCount: 8, doneCount: 5 },
    { id: 3, title: "Interview & Close", subtitle: "Interviews and offers", status: "upcoming", progress: 0, milestoneCount: 6, doneCount: 0 },
    { id: 4, title: "Transition & Grow", subtitle: "Onboarding and growth", status: "locked", progress: 0, milestoneCount: 4, doneCount: 0 },
  ],
  milestones: [
    // Phase 1
    { id: "a1", label: "Complete design skills assessment", phase: 1, status: "done", completedDate: "Feb 14", time: "2 days", category: "skill", notes: [] },
    { id: "a2", label: "Research 10 target companies", phase: 1, status: "done", completedDate: "Feb 18", time: "4 days", category: "action", notes: [] },
    { id: "a3", label: "Define personal design philosophy", phase: 1, status: "done", completedDate: "Feb 22", time: "3 days", category: "skill", notes: [] },
    { id: "a4", label: "Set up portfolio site", phase: 1, status: "done", completedDate: "Feb 28", time: "5 days", category: "resource", notes: [] },
    // Phase 2
    { id: "a5", label: "Complete 2 case studies", phase: 2, status: "done", completedDate: "Mar 5", time: "6 days", category: "skill", notes: [{ id: "n1", text: "These case studies are incredible!", timestamp: "Mar 5", type: "encouragement" }] },
    { id: "a6", label: "Submit 5 applications", phase: 2, status: "done", completedDate: "Mar 10", time: "4 days", category: "action", notes: [] },
    { id: "a7", label: "Get portfolio review from mentor", phase: 2, status: "done", completedDate: "Mar 14", time: "3 days", category: "resource", notes: [] },
    { id: "a8", label: "Build interactive prototype project", phase: 2, status: "current", time: "5 days", category: "skill", sophiaNote: "Alex is making great progress on their Figma prototype. The interaction patterns show real growth.", notes: [] },
    { id: "a9", label: "Submit 5 more applications", phase: 2, status: "upcoming", time: "3 days", category: "action", notes: [] },
    { id: "a10", label: "Network with 3 designers at target companies", phase: 2, status: "upcoming", time: "4 days", category: "action", notes: [] },
    // Phase 3
    { id: "a11", label: "Complete mock interview with guide", phase: 3, status: "upcoming", time: "2 days", category: "skill", notes: [] },
    { id: "a12", label: "Prepare design challenge presentation", phase: 3, status: "upcoming", time: "3 days", category: "skill", notes: [] },
    { id: "a13", label: "Negotiate offer terms", phase: 3, status: "locked", time: "2 days", category: "action", notes: [] },
    // Phase 4
    { id: "a14", label: "Complete first-week onboarding plan", phase: 4, status: "locked", time: "2 days", category: "action", notes: [] },
    { id: "a15", label: "Set 90-day growth goals", phase: 4, status: "locked", time: "1 day", category: "skill", notes: [] },
  ],
  activity: [
    { label: "Completed case study: Mobile Banking Redesign", time: "2 hrs ago", type: "milestone" },
    { label: "Applied to Figma — Product Design Intern", time: "Yesterday", type: "application" },
    { label: "Portfolio review session with EdgeGuide", time: "2 days ago", type: "session" },
    { label: "Applied to Stripe — Design Intern", time: "3 days ago", type: "application" },
    { label: "Completed skills assessment milestone", time: "4 days ago", type: "milestone" },
    { label: "Career strategy session with Sophia", time: "5 days ago", type: "session" },
  ],
  budgetPhases: [
    { id: 1, title: "Discover", status: "done", spent: 280, estimated: 300, items: ["Portfolio hosting", "Design tools"] },
    { id: 2, title: "Build", status: "active", spent: 120, estimated: 450, items: ["Figma Pro", "Course subscription"] },
    { id: 3, title: "Interview", status: "upcoming", spent: 0, estimated: 200, items: ["Interview prep"] },
    { id: 4, title: "Transition", status: "upcoming", spent: 0, estimated: 100, items: ["Onboarding tools"] },
  ],
  upcoming: [
    { text: "Portfolio review deadline", date: "Mar 24", color: "var(--ce-role-parent)" },
    { text: "Design challenge workshop", date: "Mar 27", color: "var(--ce-role-guide)" },
    { text: "Prototype submission due", date: "Apr 1", color: "var(--ce-lime)" },
  ],
  sophiaMessage: "Alex is in the strongest part of their journey right now. Their portfolio is coming together beautifully, and the prototype project will be a standout piece. Two applications have moved to screening stage.",
};

// ─── Data: JAMIE ─────────────────────────────────────────────────────────────

const JAMIE: ChildData = {
  id: "jamie",
  name: "Jamie",
  initial: "J",
  goal: "UX Research Intern",
  startDate: "Mar 1, 2026",
  streak: 8,
  daysActive: 21,
  phases: [
    { id: 1, title: "Explore & Clarify", subtitle: "Interests and direction", status: "active", progress: 0.35, milestoneCount: 6, doneCount: 2 },
    { id: 2, title: "Skills & Portfolio", subtitle: "Build research portfolio", status: "upcoming", progress: 0, milestoneCount: 5, doneCount: 0 },
    { id: 3, title: "Apply & Interview", subtitle: "Applications and prep", status: "upcoming", progress: 0, milestoneCount: 4, doneCount: 0 },
    { id: 4, title: "Start & Reflect", subtitle: "Launch and reflect", status: "locked", progress: 0, milestoneCount: 2, doneCount: 0 },
  ],
  milestones: [
    // Phase 1
    { id: "j1", label: "Complete UX research interest survey", phase: 1, status: "done", completedDate: "Mar 5", time: "3 days", category: "skill", notes: [] },
    { id: "j2", label: "Read 5 UX research case studies", phase: 1, status: "done", completedDate: "Mar 12", time: "5 days", category: "resource", notes: [{ id: "jn1", text: "Proud of you for diving in!", timestamp: "Mar 12", type: "encouragement" }] },
    { id: "j3", label: "Shadow a UX researcher (informational interview)", phase: 1, status: "current", time: "4 days", category: "action", sophiaNote: "Jamie has reached out to two researchers on LinkedIn. Waiting to hear back.", notes: [] },
    { id: "j4", label: "Define target company list", phase: 1, status: "upcoming", time: "2 days", category: "action", notes: [] },
    { id: "j5", label: "Complete research methods overview", phase: 1, status: "upcoming", time: "3 days", category: "skill", notes: [] },
    { id: "j6", label: "Set learning goals for Phase 2", phase: 1, status: "upcoming", time: "1 day", category: "action", notes: [] },
    // Phase 2
    { id: "j7", label: "Conduct a practice usability test", phase: 2, status: "upcoming", time: "5 days", category: "skill", notes: [] },
    { id: "j8", label: "Write first research report", phase: 2, status: "upcoming", time: "4 days", category: "skill", notes: [] },
    { id: "j9", label: "Build research portfolio page", phase: 2, status: "locked", time: "5 days", category: "resource", notes: [] },
    // Phase 3
    { id: "j10", label: "Apply to 5 research internships", phase: 3, status: "locked", time: "3 days", category: "action", notes: [] },
    { id: "j11", label: "Complete mock research presentation", phase: 3, status: "locked", time: "2 days", category: "skill", notes: [] },
    // Phase 4
    { id: "j12", label: "Create first-week plan", phase: 4, status: "locked", time: "1 day", category: "action", notes: [] },
    { id: "j13", label: "Set reflection journal routine", phase: 4, status: "locked", time: "1 day", category: "skill", notes: [] },
  ],
  activity: [
    { label: "Read UX research case study: Airbnb", time: "1 day ago", type: "milestone" },
    { label: "Career exploration session with Sophia", time: "3 days ago", type: "session" },
    { label: "Completed interest survey milestone", time: "5 days ago", type: "milestone" },
    { label: "Onboarding session with EdgeGuide", time: "1 week ago", type: "session" },
  ],
  budgetPhases: [
    { id: 1, title: "Explore", status: "active", spent: 0, estimated: 100, items: ["Books", "Online courses"] },
    { id: 2, title: "Skills", status: "upcoming", spent: 0, estimated: 250, items: ["Research tools", "Portfolio hosting"] },
    { id: 3, title: "Apply", status: "upcoming", spent: 0, estimated: 150, items: ["Interview prep"] },
    { id: 4, title: "Start", status: "upcoming", spent: 0, estimated: 50, items: ["Onboarding"] },
  ],
  upcoming: [
    { text: "Informational interview scheduled", date: "Mar 25", color: "var(--ce-role-parent)" },
    { text: "Research methods workshop", date: "Mar 28", color: "var(--ce-role-guide)" },
    { text: "Phase 1 review with guide", date: "Apr 2", color: "var(--ce-lime)" },
  ],
  sophiaMessage: "Jamie is 2 weeks in and building strong habits. They're reading broadly and asking great questions. The informational interview this week will be a confidence booster.",
};

const CHILDREN: ChildData[] = [ALEX, JAMIE];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRESETS = [
  "So proud of you!",
  "Keep going \u2014 you\u2019ve got this",
  "This is a big deal!",
  "You\u2019re making us proud",
];

function getOverallProgress(child: ChildData): number {
  const totalMilestones = child.phases.reduce((s, p) => s + p.milestoneCount, 0);
  const totalDone = child.phases.reduce((s, p) => s + p.doneCount, 0);
  return totalMilestones > 0 ? Math.round((totalDone / totalMilestones) * 100) : 0;
}

function getActivePhase(child: ChildData): Phase | undefined {
  return child.phases.find((p) => p.status === "active");
}

function getCurrentMilestone(child: ChildData): Milestone | undefined {
  return child.milestones.find((m) => m.status === "current");
}

function getUpcomingMilestones(child: ChildData, count = 3): Milestone[] {
  return child.milestones.filter((m) => m.status === "upcoming").slice(0, count);
}

function getTotalDone(child: ChildData): number {
  return child.phases.reduce((s, p) => s + p.doneCount, 0);
}

const TYPE_CONFIG: Record<string, { color: string; Icon: typeof Check }> = {
  milestone: { color: "var(--ce-lime)", Icon: Check },
  session: { color: "var(--ce-role-guide)", Icon: Calendar },
  application: { color: "var(--ce-role-edgestar)", Icon: ArrowUpRight },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function FamilyVariationB() {
  const navigate = useNavigate();
  const [activeChild, setActiveChild] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const sentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const child = CHILDREN[activeChild];
  const overallPct = getOverallProgress(child);
  const activePhase = getActivePhase(child);
  const currentMilestone = getCurrentMilestone(child);
  const upcomingMilestones = getUpcomingMilestones(child);
  const totalDone = getTotalDone(child);
  const activePhaseNum = activePhase ? activePhase.id : 1;
  const totalPhases = child.phases.length;

  const totalBudgetSpent = child.budgetPhases.reduce((s, b) => s + b.spent, 0);
  const totalBudgetEst = child.budgetPhases.reduce((s, b) => s + b.estimated, 0);

  const handlePresetClick = (text: string) => {
    setNoteText(text);
  };

  const handleSendNote = () => {
    if (!noteText.trim()) return;
    setNoteSent(true);
    setNoteText("");
    if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
    sentTimerRef.current = setTimeout(() => setNoteSent(false), 1800);
  };

  const handleNavigate = (target: string) => {
    if (target === "landing") {
      navigate("/");
    } else {
      navigate(`/parent/${target}`);
    }
  };

  const sophiaOverride = {
    message: child.sophiaMessage,
    chips: [
      { label: `${child.name}'s roadmap`, action: "edgepath" },
      { label: "Send encouragement", action: "family" },
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
      <div className="max-w-[800px] mx-auto">
        {/* ─── Sticky Child Tab Bar ─────────────────────────────────────── */}
        <div
          className="sticky z-30 py-3 px-0"
          style={{
            top: 56,
            background: "var(--ce-surface-bg)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)",
          }}
        >
          <div className="flex items-center gap-2">
            {CHILDREN.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => {
                  setActiveChild(i);
                  setNoteText("");
                  setNoteSent(false);
                }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
                style={{
                  background: i === activeChild ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
                  border: i === activeChild ? "1px solid rgba(var(--ce-role-parent-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.06)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {i === activeChild && (
                  <motion.div
                    layoutId="child-tab-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "rgba(var(--ce-role-parent-rgb),0.1)",
                      border: "1px solid rgba(var(--ce-role-parent-rgb),0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div
                  className="relative w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(var(--ce-role-parent-rgb),0.12)" }}
                >
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 600 }}
                  >
                    {c.initial}
                  </span>
                </div>
                <span
                  className="relative text-[12px]"
                  style={{
                    color: i === activeChild ? TEXT.primary : TEXT.secondary,
                    fontFamily: FONT.display,
                    fontWeight: 500,
                  }}
                >
                  {c.name}
                </span>
              </motion.button>
            ))}

            <div className="flex-1" />

            <motion.button
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer"
              style={{
                background: "transparent",
                border: "1px dashed rgba(var(--ce-glass-tint),0.1)",
              }}
              whileHover={{ background: "rgba(var(--ce-glass-tint),0.02)" }}
              whileTap={{ scale: 0.97 }}
            >
              <UserPlus className="w-3.5 h-3.5" style={{ color: TEXT.muted }} />
              <span
                className="text-[11px]"
                style={{ color: TEXT.muted, fontFamily: FONT.body }}
              >
                Add
              </span>
            </motion.button>
          </div>
        </div>

        {/* ─── Child Content (AnimatePresence) ──────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {/* ─── Hero Section ──────────────────────────────────────── */}
            <div className="pt-6 pb-2">
              {/* Avatar + title */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(var(--ce-role-parent-rgb),0.08)",
                    border: "1.5px solid rgba(var(--ce-role-parent-rgb),0.15)",
                  }}
                >
                  <span
                    className="text-[24px]"
                    style={{ color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 600 }}
                  >
                    {child.initial}
                  </span>
                </div>
                <div>
                  <h1
                    className="text-[26px]"
                    style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}
                  >
                    {child.name}&rsquo;s Journey
                  </h1>
                  <p
                    className="text-[13px]"
                    style={{ fontFamily: FONT.body, color: TEXT.tertiary }}
                  >
                    Targeting {child.goal} &middot; Started {child.startDate}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 500 }}
                  >
                    {overallPct}% complete
                  </span>
                  <span
                    className="text-[12px]"
                    style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                  >
                    Phase {activePhaseNum} of {totalPhases}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--ce-role-parent), var(--ce-role-edgestar))" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${overallPct}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-6 mt-4">
                {[
                  { value: `${overallPct}%`, label: "Progress", color: "var(--ce-role-parent)" },
                  { value: totalDone, label: "Milestones", color: "var(--ce-lime)" },
                  { value: child.streak, label: "Day streak", color: "var(--ce-role-edgestar)" },
                ].map((stat, i) => (
                  <div key={i}>
                    <span
                      className="text-[20px] block"
                      style={{ fontFamily: FONT.display, fontWeight: 500, color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Section 1: Where they are ────────────────────────── */}
            <NarrativeSection
              icon={<Compass className="w-3.5 h-3.5" />}
              title="Where they are"
              color="var(--ce-role-parent)"
              delay={0.1}
            >
              {activePhase && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(var(--ce-role-parent-rgb),0.04)",
                    border: "1px solid rgba(var(--ce-role-parent-rgb),0.12)",
                  }}
                >
                  <p
                    className="text-[14px] mb-1"
                    style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}
                  >
                    {activePhase.title}
                  </p>
                  <p
                    className="text-[12px] mb-3"
                    style={{ fontFamily: FONT.body, color: TEXT.secondary }}
                  >
                    {activePhase.subtitle}
                  </p>

                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--ce-role-parent)" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${activePhase.progress * 100}%` }}
                        transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
                      />
                    </div>
                    <span
                      className="text-[11px]"
                      style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                    >
                      {activePhase.doneCount}/{activePhase.milestoneCount} milestones
                    </span>
                  </div>

                  {/* Current milestone highlight */}
                  {currentMilestone && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background: "var(--ce-role-parent)",
                            boxShadow: "0 0 8px rgba(var(--ce-role-parent-rgb),0.4)",
                          }}
                        />
                        <span
                          className="text-[11px]"
                          style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                        >
                          Currently working on:
                        </span>
                        <span
                          className="text-[12px]"
                          style={{ color: TEXT.primary, fontFamily: FONT.body }}
                        >
                          {currentMilestone.label}
                        </span>
                      </div>

                      {currentMilestone.sophiaNote && (
                        <div className="flex gap-2 mt-3">
                          <SophiaMark size={12} glowing={false} />
                          <p
                            className="text-[11px] leading-relaxed"
                            style={{ color: TEXT.secondary, fontFamily: FONT.body }}
                          >
                            {currentMilestone.sophiaNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </NarrativeSection>

            {/* ─── Section 2: What's coming ─────────────────────────── */}
            <NarrativeSection
              icon={<Calendar className="w-3.5 h-3.5" />}
              title="What&rsquo;s coming"
              color="var(--ce-role-guide)"
              delay={0.2}
            >
              <div className="flex flex-col">
                {upcomingMilestones.map((m, i) => (
                  <div key={m.id} className="flex gap-3">
                    {/* Left line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          background: i === 0 ? "rgba(var(--ce-role-guide-rgb),0.1)" : "transparent",
                          border: i === 0 ? "1.5px solid var(--ce-role-guide)" : "1.5px solid rgba(var(--ce-glass-tint),0.1)",
                          boxShadow: i === 0 ? "0 0 8px rgba(var(--ce-role-guide-rgb),0.3)" : "none",
                        }}
                      />
                      {i < upcomingMilestones.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-4">
                      <p
                        className="text-[12px]"
                        style={{ color: TEXT.secondary, fontFamily: FONT.body }}
                      >
                        {m.label}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ color: TEXT.muted, fontFamily: FONT.body }}
                      >
                        ~{m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </NarrativeSection>

            {/* ─── Section 3: Your encouragement ────────────────────── */}
            <NarrativeSection
              icon={<Heart className="w-3.5 h-3.5" />}
              title="Your encouragement"
              color="var(--ce-role-parent)"
              delay={0.3}
            >
              {/* Current milestone context */}
              {currentMilestone && (
                <div className="mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px]"
                    style={{
                      background: "rgba(var(--ce-role-parent-rgb),0.06)",
                      border: "1px solid rgba(var(--ce-role-parent-rgb),0.12)",
                      color: TEXT.tertiary,
                      fontFamily: FONT.body,
                    }}
                  >
                    For: {currentMilestone.label}
                  </span>
                </div>
              )}

              {/* Sent confirmation */}
              <AnimatePresence>
                {noteSent && (
                  <motion.div
                    className="flex items-center gap-2 mb-3 py-2.5 px-4 rounded-xl"
                    style={{
                      background: "rgba(var(--ce-role-parent-rgb),0.08)",
                      border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)",
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: [0.5, 1.3, 1] }}
                      transition={{ duration: 0.4 }}
                    >
                      <Heart
                        className="w-4 h-4"
                        style={{
                          color: "var(--ce-role-parent)",
                          filter: "drop-shadow(0 0 6px rgba(var(--ce-role-parent-rgb),0.5))",
                        }}
                      />
                    </motion.div>
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--ce-role-parent)", fontFamily: FONT.body }}
                    >
                      Note sent to {child.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preset chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {PRESETS.map((preset) => {
                  const isActive = noteText === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => handlePresetClick(preset)}
                      className="text-[11px] px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                      style={{
                        background: isActive ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
                        border: isActive ? "1px solid rgba(var(--ce-role-parent-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.06)",
                        color: isActive ? "var(--ce-role-parent)" : TEXT.secondary,
                        fontFamily: FONT.body,
                      }}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              {/* Textarea */}
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={`A word of encouragement for ${child.name}...`}
                rows={3}
                className="w-full text-[12px] rounded-xl px-4 py-3 mb-3 resize-none outline-none transition-all"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.03)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.07)",
                  color: TEXT.primary,
                  fontFamily: FONT.body,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(var(--ce-role-parent-rgb),0.2)";
                  e.target.style.boxShadow = "0 0 20px rgba(var(--ce-role-parent-rgb),0.06)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(var(--ce-glass-tint),0.07)";
                  e.target.style.boxShadow = "none";
                }}
              />

              {/* Send button */}
              <button
                onClick={handleSendNote}
                disabled={!noteText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all disabled:cursor-default"
                style={{
                  background: noteText.trim() ? "rgba(var(--ce-role-parent-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
                  border: noteText.trim() ? "1px solid rgba(var(--ce-role-parent-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.06)",
                  color: noteText.trim() ? "var(--ce-role-parent)" : TEXT.muted,
                  fontFamily: FONT.display,
                  fontWeight: 500,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Send note
              </button>
            </NarrativeSection>

            {/* ─── Section 4: Investment so far ─────────────────────── */}
            <NarrativeSection
              icon={<DollarSign className="w-3.5 h-3.5" />}
              title="Investment so far"
              color="var(--ce-lime)"
              delay={0.4}
            >
              {/* Total */}
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="text-[22px]"
                  style={{ color: "var(--ce-lime)", fontFamily: FONT.display, fontWeight: 500 }}
                >
                  ${totalBudgetSpent}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                >
                  of ${totalBudgetEst} est.
                </span>
              </div>

              {/* Segmented bar */}
              <div className="flex h-2 rounded-full overflow-hidden mb-2">
                {child.budgetPhases.map((bp) => {
                  const segWidth = totalBudgetEst > 0 ? (bp.estimated / totalBudgetEst) * 100 : 0;
                  const fillPct = bp.estimated > 0 ? (bp.spent / bp.estimated) * 100 : 0;
                  const segColor =
                    bp.status === "done" ? "var(--ce-lime)" :
                    bp.status === "active" ? "var(--ce-role-parent)" :
                    "rgba(var(--ce-glass-tint),0.06)";

                  return (
                    <div
                      key={bp.id}
                      className="h-full overflow-hidden"
                      style={{
                        width: `${segWidth}%`,
                        background: "rgba(var(--ce-glass-tint),0.06)",
                      }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${fillPct}%`,
                          background: segColor,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Phase labels */}
              <div className="flex justify-between">
                {child.budgetPhases.map((bp) => (
                  <span
                    key={bp.id}
                    className="text-[10px] truncate"
                    style={{ color: TEXT.muted, fontFamily: FONT.body, maxWidth: `${100 / child.budgetPhases.length}%` }}
                  >
                    {bp.title}
                  </span>
                ))}
              </div>
            </NarrativeSection>

            {/* ─── Section 5: Their story ───────────────────────────── */}
            <NarrativeSection
              icon={<BookOpen className="w-3.5 h-3.5" />}
              title="Their story"
              color={TEXT.tertiary}
              delay={0.5}
            >
              {child.activity.map((item, i) => {
                const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.milestone;
                const Icon = cfg.Icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2.5"
                    style={{
                      borderBottom: i < child.activity.length - 1 ? `1px solid ${SURFACE.divider}` : "none",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}10` }}
                    >
                      <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                    </div>
                    <span
                      className="text-[12px] flex-1"
                      style={{ color: TEXT.secondary, fontFamily: FONT.body }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-[10px] flex-shrink-0"
                      style={{ color: TEXT.muted, fontFamily: FONT.body }}
                    >
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </NarrativeSection>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Link a child"
        showLabel="My QR code"
        scanLabel="Scan child's QR"
        showDescription="Have your child scan this code from their app"
        scanDescription="Point your camera at your child's QR code"
        roleColor="var(--ce-role-parent)"
        identifier="CE-PARENT-2026"
      />
    </RoleShell>
  );
}

// ─── Narrative Section ───────────────────────────────────────────────────────

function NarrativeSection({
  icon,
  title,
  color,
  subtitle,
  delay = 0,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  subtitle?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}10` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <span
          className="text-[15px]"
          style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="text-[12px]"
            style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}
