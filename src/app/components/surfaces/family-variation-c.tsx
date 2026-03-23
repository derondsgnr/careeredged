/**
 * Family Surface — Variation C: "Command Center"
 *
 * Three-pane layout inspired by pro tools.
 * Left: persistent child list with sparkline progress.
 * Center: focused roadmap view (current phase milestones).
 * Right: contextual actions (Sophia, notes, budget).
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { EASE, COLORS, TEXT, SURFACE, FONT } from "../tokens";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { QRModal } from "../shared-patterns";
import {
  Heart, Check, Lock, Zap, Target, BookOpen,
  UserPlus, Calendar, MessageSquare, ChevronDown, ChevronUp,
  Send, Sparkles,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── Data ───────────────────────────────────────────────────────────────────

const ALEX: ChildData = {
  id: "alex",
  name: "Alex",
  initial: "A",
  goal: "Product Design Intern",
  startDate: "Feb 10, 2026",
  streak: 14,
  daysActive: 42,
  phases: [
    { id: 1, title: "Discover & Position", subtitle: "Clarify goals, build personal brand, and identify target roles", status: "done", progress: 1, milestoneCount: 5, doneCount: 5 },
    { id: 2, title: "Build & Apply", subtitle: "Create portfolio pieces, refine resume, and submit applications", status: "active", progress: 0.6, milestoneCount: 8, doneCount: 5 },
    { id: 3, title: "Interview & Close", subtitle: "Prepare for interviews, negotiate offers, and secure placement", status: "upcoming", progress: 0, milestoneCount: 6, doneCount: 0 },
    { id: 4, title: "Transition & Grow", subtitle: "Onboard successfully and set 90-day growth goals", status: "locked", progress: 0, milestoneCount: 4, doneCount: 0 },
  ],
  milestones: [
    // Phase 1
    { id: "a1", label: "Complete career interest assessment", phase: 1, status: "done", completedDate: "Feb 12", time: "30 min", category: "skill", notes: [] },
    { id: "a2", label: "Define target role and company list", phase: 1, status: "done", completedDate: "Feb 15", time: "1 hr", category: "action", notes: [] },
    { id: "a3", label: "Build LinkedIn profile", phase: 1, status: "done", completedDate: "Feb 18", time: "2 hrs", category: "action", notes: [] },
    { id: "a4", label: "Research 10 target companies", phase: 1, status: "done", completedDate: "Feb 22", time: "3 hrs", category: "resource", notes: [] },
    { id: "a5", label: "Get feedback on personal brand statement", phase: 1, status: "done", completedDate: "Feb 25", time: "45 min", category: "skill", notes: [] },
    // Phase 2
    { id: "a6", label: "Complete Figma portfolio case study #1", phase: 2, status: "done", completedDate: "Mar 1", time: "6 hrs", category: "skill", notes: [] },
    { id: "a7", label: "Complete Figma portfolio case study #2", phase: 2, status: "done", completedDate: "Mar 6", time: "5 hrs", category: "skill", notes: [] },
    { id: "a8", label: "Optimize resume with ATS keywords", phase: 2, status: "done", completedDate: "Mar 10", time: "2 hrs", category: "action", notes: [] },
    { id: "a9", label: "Submit 5 applications to target list", phase: 2, status: "done", completedDate: "Mar 14", time: "3 hrs", category: "action", notes: [] },
    { id: "a10", label: "Build portfolio website", phase: 2, status: "done", completedDate: "Mar 17", time: "8 hrs", category: "skill", notes: [] },
    { id: "a11", label: "Complete design challenge practice set", phase: 2, status: "current", time: "4 hrs", category: "skill", sophiaNote: "Alex is halfway through — the whiteboard challenge section is the hardest. A note of encouragement could help.", notes: [] },
    { id: "a12", label: "Request referrals from network contacts", phase: 2, status: "upcoming", time: "2 hrs", category: "action", notes: [] },
    { id: "a13", label: "Submit 5 more applications", phase: 2, status: "upcoming", time: "3 hrs", category: "action", notes: [] },
    // Phase 3
    { id: "a14", label: "Complete behavioral interview prep", phase: 3, status: "upcoming", time: "3 hrs", category: "skill", notes: [] },
    { id: "a15", label: "Mock interview with EdgeGuide", phase: 3, status: "upcoming", time: "1.5 hrs", category: "action", notes: [] },
    { id: "a16", label: "Prepare design presentation", phase: 3, status: "upcoming", time: "4 hrs", category: "skill", notes: [] },
    { id: "a17", label: "Attend 2 real interviews", phase: 3, status: "upcoming", time: "4 hrs", category: "action", notes: [] },
    { id: "a18", label: "Review and compare offers", phase: 3, status: "upcoming", time: "1 hr", category: "resource", notes: [] },
    { id: "a19", label: "Negotiate final offer terms", phase: 3, status: "upcoming", time: "1 hr", category: "action", notes: [] },
    // Phase 4
    { id: "a20", label: "Complete onboarding checklist", phase: 4, status: "locked", time: "2 hrs", category: "action", notes: [] },
    { id: "a21", label: "Set 30/60/90 day goals", phase: 4, status: "locked", time: "1 hr", category: "skill", notes: [] },
    { id: "a22", label: "Schedule mentor check-ins", phase: 4, status: "locked", time: "30 min", category: "resource", notes: [] },
    { id: "a23", label: "Write first-week reflection", phase: 4, status: "locked", time: "30 min", category: "action", notes: [] },
  ],
  activity: [
    { label: "Completed portfolio case study #2", time: "2 days ago", type: "milestone" },
    { label: "Submitted application to Figma", time: "3 days ago", type: "application" },
    { label: "Session with EdgeGuide Sarah", time: "4 days ago", type: "session" },
    { label: "Optimized resume — ATS score 87", time: "5 days ago", type: "milestone" },
    { label: "Applied to Notion design team", time: "6 days ago", type: "application" },
    { label: "Completed portfolio website v1", time: "1 week ago", type: "milestone" },
  ],
  budgetPhases: [
    { id: 1, title: "Discover & Position", status: "done", spent: 280, estimated: 300, items: ["LinkedIn Premium ($60)", "Career assessment tool ($40)", "Personal branding workshop ($120)", "Domain name + hosting ($60)"] },
    { id: 2, title: "Build & Apply", status: "active", spent: 120, estimated: 450, items: ["Figma Pro subscription ($45)", "Portfolio template ($35)", "Resume review service ($40)", "Application tracking tool ($0 — free)"] },
    { id: 3, title: "Interview & Close", status: "upcoming", spent: 0, estimated: 200, items: ["Mock interview coaching ($100)", "Professional outfit ($75)", "Travel to interviews ($25)"] },
    { id: 4, title: "Transition & Grow", status: "upcoming", spent: 0, estimated: 100, items: ["Onboarding supplies ($50)", "Professional development book bundle ($50)"] },
  ],
  upcoming: [
    { text: "Design challenge due", date: "Mar 23", color: "var(--ce-role-parent)" },
    { text: "EdgeGuide session", date: "Mar 25", color: "var(--ce-role-edgestar)" },
    { text: "Application deadline — Stripe", date: "Mar 28", color: "var(--ce-lime)" },
  ],
  sophiaMessage: "Alex is in a strong build phase — portfolio work is progressing well and applications are going out on schedule. The design challenge practice is the current focus. A quick note of support could boost momentum.",
};

const JAMIE: ChildData = {
  id: "jamie",
  name: "Jamie",
  initial: "J",
  goal: "UX Research Intern",
  startDate: "Mar 1, 2026",
  streak: 8,
  daysActive: 21,
  phases: [
    { id: 1, title: "Explore & Clarify", subtitle: "Discover interests, research UX paths, and set initial goals", status: "active", progress: 0.35, milestoneCount: 6, doneCount: 2 },
    { id: 2, title: "Skills & Portfolio", subtitle: "Learn research methods and build a case study portfolio", status: "upcoming", progress: 0, milestoneCount: 5, doneCount: 0 },
    { id: 3, title: "Apply & Interview", subtitle: "Target programs and prepare for research-specific interviews", status: "upcoming", progress: 0, milestoneCount: 4, doneCount: 0 },
    { id: 4, title: "Start & Reflect", subtitle: "Begin internship and establish growth habits", status: "locked", progress: 0, milestoneCount: 2, doneCount: 0 },
  ],
  milestones: [
    // Phase 1
    { id: "j1", label: "Complete UX career exploration module", phase: 1, status: "done", completedDate: "Mar 5", time: "1 hr", category: "skill", notes: [] },
    { id: "j2", label: "Shadow a UX researcher (virtual)", phase: 1, status: "done", completedDate: "Mar 10", time: "2 hrs", category: "action", notes: [] },
    { id: "j3", label: "Define target companies and programs", phase: 1, status: "current", time: "1.5 hrs", category: "action", sophiaNote: "Jamie is narrowing down their list — they've identified 6 companies so far. Encouraging focus on user research-heavy teams could help.", notes: [] },
    { id: "j4", label: "Read 3 UX research case studies", phase: 1, status: "upcoming", time: "2 hrs", category: "resource", notes: [] },
    { id: "j5", label: "Set up research reading habit", phase: 1, status: "upcoming", time: "30 min", category: "skill", notes: [] },
    { id: "j6", label: "Write personal research interest statement", phase: 1, status: "upcoming", time: "1 hr", category: "action", notes: [] },
    // Phase 2
    { id: "j7", label: "Complete user interview fundamentals course", phase: 2, status: "upcoming", time: "4 hrs", category: "skill", notes: [] },
    { id: "j8", label: "Conduct 3 practice user interviews", phase: 2, status: "upcoming", time: "3 hrs", category: "action", notes: [] },
    { id: "j9", label: "Build first UX research case study", phase: 2, status: "upcoming", time: "6 hrs", category: "skill", notes: [] },
    { id: "j10", label: "Create portfolio website", phase: 2, status: "upcoming", time: "5 hrs", category: "action", notes: [] },
    { id: "j11", label: "Get portfolio feedback from mentor", phase: 2, status: "upcoming", time: "1 hr", category: "resource", notes: [] },
    // Phase 3
    { id: "j12", label: "Apply to 5 UX research internships", phase: 3, status: "upcoming", time: "3 hrs", category: "action", notes: [] },
    { id: "j13", label: "Prepare for research-specific interview questions", phase: 3, status: "upcoming", time: "2 hrs", category: "skill", notes: [] },
    { id: "j14", label: "Complete take-home research exercise", phase: 3, status: "upcoming", time: "4 hrs", category: "action", notes: [] },
    { id: "j15", label: "Mock interview with EdgeGuide", phase: 3, status: "upcoming", time: "1.5 hrs", category: "action", notes: [] },
    // Phase 4
    { id: "j16", label: "Complete first-week onboarding", phase: 4, status: "locked", time: "2 hrs", category: "action", notes: [] },
    { id: "j17", label: "Set 30-day learning goals", phase: 4, status: "locked", time: "1 hr", category: "skill", notes: [] },
  ],
  activity: [
    { label: "Shadowed UX researcher at Spotify", time: "1 week ago", type: "session" },
    { label: "Completed career exploration module", time: "2 weeks ago", type: "milestone" },
    { label: "Joined CareerEdge platform", time: "3 weeks ago", type: "milestone" },
    { label: "First session with EdgeGuide", time: "2 weeks ago", type: "session" },
  ],
  budgetPhases: [
    { id: 1, title: "Explore & Clarify", status: "active", spent: 30, estimated: 120, items: ["UX research course subscription ($30)", "Books and resources ($0 — pending)"] },
    { id: 2, title: "Skills & Portfolio", status: "upcoming", spent: 0, estimated: 200, items: ["Portfolio hosting ($40)", "Usability testing tool ($60)", "Case study materials ($100)"] },
    { id: 3, title: "Apply & Interview", status: "upcoming", spent: 0, estimated: 150, items: ["Interview prep coaching ($100)", "Professional headshot ($50)"] },
    { id: 4, title: "Start & Reflect", status: "upcoming", spent: 0, estimated: 50, items: ["Onboarding supplies ($50)"] },
  ],
  upcoming: [
    { text: "Target company list due", date: "Mar 24", color: "var(--ce-role-parent)" },
    { text: "Research reading goal", date: "Mar 26", color: "var(--ce-role-edgestar)" },
    { text: "EdgeGuide check-in", date: "Mar 29", color: "var(--ce-lime)" },
  ],
  sophiaMessage: "Jamie is still early but building good habits — an 8-day streak shows commitment. Encouraging the research reading habit now will pay off when portfolio-building starts in Phase 2.",
};

const CHILDREN: ChildData[] = [ALEX, JAMIE];

// ─── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, { color: string; Icon: typeof Zap }> = {
  skill: { color: "var(--ce-role-edgestar)", Icon: Zap },
  action: { color: "var(--ce-lime)", Icon: Target },
  resource: { color: "var(--ce-text-tertiary)", Icon: BookOpen },
};

function getOverallProgress(child: ChildData): number {
  const total = child.phases.reduce((a, p) => a + p.milestoneCount, 0);
  const done = child.phases.reduce((a, p) => a + p.doneCount, 0);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function getActivePhaseNum(child: ChildData): number {
  const active = child.phases.find((p) => p.status === "active");
  return active?.id ?? 1;
}

function getTotalDone(children: ChildData[]): number {
  return children.reduce((a, c) => a + c.phases.reduce((b, p) => b + p.doneCount, 0), 0);
}

function getTotalSpent(children: ChildData[]): number {
  return children.reduce((a, c) => a + c.budgetPhases.reduce((b, bp) => b + bp.spent, 0), 0);
}

// ─── Note Presets ───────────────────────────────────────────────────────────

const NOTE_PRESETS = [
  "Keep going!",
  "So proud of you",
  "How can I help?",
  "You've got this!",
];

// ─── Left Pane ──────────────────────────────────────────────────────────────

function LeftPane({
  children,
  activeId,
  onSelect,
  onAddChild,
}: {
  children: ChildData[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddChild: () => void;
}) {
  const totalDone = getTotalDone(children);
  const totalSpent = getTotalSpent(children);

  return (
    <div
      style={{
        width: 240,
        minWidth: 240,
        background: "rgba(var(--ce-glass-tint),0.01)",
        borderRight: "1px solid rgba(var(--ce-glass-tint),0.04)",
        overflowY: "auto",
        paddingTop: 16,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Family summary */}
      <div style={{ padding: "0 16px 16px", borderBottom: `1px solid ${SURFACE.divider}` }}>
        <span
          className="text-[11px]"
          style={{
            fontFamily: FONT.display,
            fontWeight: 500,
            color: TEXT.tertiary,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Family
        </span>
        <div className="flex gap-3">
          <div>
            <span className="text-[16px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: COLORS.lime }}>{totalDone}</span>
            <span className="text-[10px] ml-1" style={{ color: TEXT.muted }}>done</span>
          </div>
          <div>
            <span className="text-[16px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}>${totalSpent}</span>
            <span className="text-[10px] ml-1" style={{ color: TEXT.muted }}>spent</span>
          </div>
        </div>
      </div>

      {/* Child cards */}
      <div style={{ padding: "8px 8px" }}>
        {children.map((child) => {
          const isActive = child.id === activeId;
          const pct = getOverallProgress(child);
          const activePhase = getActivePhaseNum(child);
          const totalMilestones = child.phases.reduce((a, p) => a + p.milestoneCount, 0);
          const doneMilestones = child.phases.reduce((a, p) => a + p.doneCount, 0);
          const hasNotes = child.milestones.some((m) => m.notes.length > 0);

          return (
            <motion.button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className="w-full text-left cursor-pointer"
              style={{
                borderRadius: 12,
                padding: "12px",
                marginBottom: 4,
                background: isActive ? "rgba(var(--ce-role-parent-rgb),0.06)" : "transparent",
                borderLeft: `3px solid ${isActive ? "var(--ce-role-parent)" : "transparent"}`,
                border: isActive
                  ? "1px solid rgba(var(--ce-role-parent-rgb),0.1)"
                  : "1px solid transparent",
                borderLeftWidth: 3,
                borderLeftColor: isActive ? "var(--ce-role-parent)" : "transparent",
                position: "relative",
              }}
              whileHover={!isActive ? { backgroundColor: "rgba(var(--ce-glass-tint),0.02)" } : undefined}
              transition={{ duration: 0.15 }}
            >
              {/* Unread notes badge */}
              {hasNotes && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--ce-role-parent)",
                  }}
                />
              )}

              {/* Top row */}
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(var(--ce-role-parent-rgb),0.1)",
                  }}
                >
                  <span className="text-[12px]" style={{ fontFamily: FONT.display, fontWeight: 600, color: "var(--ce-role-parent)" }}>
                    {child.initial}
                  </span>
                </div>
                <span
                  className="text-[13px]"
                  style={{
                    fontFamily: FONT.display,
                    fontWeight: 500,
                    color: isActive ? TEXT.primary : TEXT.secondary,
                  }}
                >
                  {child.name}
                </span>
              </div>

              {/* Goal */}
              <span className="text-[10px] block" style={{ color: TEXT.tertiary, fontFamily: FONT.body, marginTop: 4 }}>
                {child.goal}
              </span>

              {/* Mini gauge sparkline */}
              <div style={{ marginTop: 10 }}>
                <svg viewBox="0 0 120 8" style={{ width: "100%", height: 8 }}>
                  <rect x={0} y={0} width={120} height={8} rx={4} fill="rgba(var(--ce-glass-tint),0.06)" />
                  <motion.rect
                    x={0}
                    y={0}
                    height={8}
                    rx={4}
                    fill="var(--ce-role-parent)"
                    initial={{ width: 0 }}
                    animate={{ width: (pct / 100) * 120 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </svg>
                <div className="flex justify-between" style={{ marginTop: 4 }}>
                  <span className="text-[10px]" style={{ color: "var(--ce-role-parent)" }}>{pct}%</span>
                  <span className="text-[10px]" style={{ color: TEXT.muted }}>Ph.{activePhase}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-3" style={{ marginTop: 8 }}>
                <div className="flex items-center gap-1">
                  <Zap style={{ width: 10, height: 10, color: COLORS.lime }} />
                  <span className="text-[10px]" style={{ color: COLORS.lime }}>{child.streak}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check style={{ width: 10, height: 10, color: TEXT.tertiary }} />
                  <span className="text-[10px]" style={{ color: TEXT.tertiary }}>{doneMilestones}/{totalMilestones}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Add child */}
      <div style={{ padding: "0 8px 16px", marginTop: "auto" }}>
        <button
          onClick={onAddChild}
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
          style={{
            borderRadius: 12,
            padding: "10px 0",
            border: "1px dashed rgba(var(--ce-glass-tint),0.08)",
            background: "transparent",
            color: TEXT.tertiary,
          }}
        >
          <UserPlus style={{ width: 12, height: 12 }} />
          <span className="text-[11px]" style={{ fontFamily: FONT.body, color: TEXT.tertiary }}>Link child</span>
        </button>
      </div>
    </div>
  );
}

// ─── Center Pane ────────────────────────────────────────────────────────────

function CenterPane({
  child,
  selectedPhaseId,
  onPhaseSelect,
  selectedMilestone,
  onMilestoneSelect,
}: {
  child: ChildData;
  selectedPhaseId: number;
  onPhaseSelect: (id: number) => void;
  selectedMilestone: Milestone | null;
  onMilestoneSelect: (m: Milestone | null) => void;
}) {
  const phase = child.phases.find((p) => p.id === selectedPhaseId)!;
  const phaseMilestones = child.milestones.filter((m) => m.phase === selectedPhaseId);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 24px" }}>
      {/* Header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={child.id}
          className="flex items-center justify-between"
          style={{ marginBottom: 20 }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <span className="text-[18px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}>
            {child.name}'s Roadmap
          </span>
          <span className="text-[11px]" style={{ color: TEXT.tertiary }}>Started {child.startDate}</span>
        </motion.div>
      </AnimatePresence>

      {/* Phase Selector */}
      <div
        className="flex gap-1.5"
        style={{
          padding: 4,
          borderRadius: 12,
          background: "rgba(var(--ce-glass-tint),0.02)",
          border: "1px solid rgba(var(--ce-glass-tint),0.04)",
          marginBottom: 20,
        }}
      >
        {child.phases.map((p) => {
          const isActive = p.id === selectedPhaseId;
          const isLocked = p.status === "locked";
          const isDone = p.status === "done";

          return (
            <motion.button
              key={p.id}
              onClick={() => !isLocked && onPhaseSelect(p.id)}
              disabled={isLocked}
              className="relative"
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: FONT.display,
                fontWeight: 500,
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.5 : 1,
                color: isActive ? "var(--ce-role-parent)" : isDone ? COLORS.lime : isLocked ? TEXT.muted : TEXT.tertiary,
                background: isActive ? "rgba(var(--ce-role-parent-rgb),0.08)" : "transparent",
                border: isActive ? "1px solid rgba(var(--ce-role-parent-rgb),0.15)" : "1px solid transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
              layout
            >
              {isActive && (
                <motion.div
                  layoutId="phase-pill"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    background: "rgba(var(--ce-role-parent-rgb),0.08)",
                    border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                Ph.{p.id} · {p.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Phase Detail Card */}
      <div
        style={{
          borderRadius: 16,
          padding: 20,
          background: SURFACE.card,
          border: `1px solid ${SURFACE.cardBorder}`,
          marginBottom: 16,
        }}
      >
        <div className="text-[14px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}>
          {phase.title}
        </div>
        <div className="text-[12px]" style={{ color: TEXT.secondary, marginBottom: 12 }}>
          {phase.subtitle}
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, borderRadius: 9999, background: "rgba(var(--ce-glass-tint),0.06)", marginBottom: 4 }}>
          <motion.div
            style={{ height: 6, borderRadius: 9999, background: "var(--ce-role-parent)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${phase.progress * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <span className="text-[11px]" style={{ color: TEXT.tertiary }}>
          {phase.doneCount} of {phase.milestoneCount} milestones
        </span>
      </div>

      {/* Milestone List */}
      <div>
        {phaseMilestones.map((m, i) => {
          const cat = CATEGORY_MAP[m.category];
          const CatIcon = cat.Icon;
          const isClickable = m.status === "done" || m.status === "current";
          const isSelected = selectedMilestone?.id === m.id;

          return (
            <div key={m.id}>
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                className="flex items-center gap-3"
                style={{
                  padding: "12px 0",
                  borderBottom: `1px solid ${SURFACE.divider}`,
                  cursor: isClickable ? "pointer" : "default",
                  background: isSelected ? "rgba(var(--ce-role-parent-rgb),0.03)" : "transparent",
                  borderRadius: isSelected ? 8 : 0,
                  paddingLeft: isSelected ? 8 : 0,
                  paddingRight: isSelected ? 8 : 0,
                }}
                onClick={() => isClickable && onMilestoneSelect(isSelected ? null : m)}
              >
                {/* Status dot */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    ...(m.status === "done" && {
                      background: "rgba(var(--ce-lime-rgb),0.1)",
                      border: "1px solid rgba(var(--ce-lime-rgb),0.3)",
                    }),
                    ...(m.status === "current" && {
                      background: "rgba(var(--ce-role-parent-rgb),0.2)",
                      border: "1.5px solid var(--ce-role-parent)",
                      boxShadow: "0 0 8px rgba(var(--ce-role-parent-rgb),0.3)",
                    }),
                    ...(m.status === "upcoming" && {
                      background: "rgba(var(--ce-glass-tint),0.03)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                    }),
                    ...(m.status === "locked" && {
                      background: "rgba(var(--ce-glass-tint),0.02)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.05)",
                    }),
                  }}
                >
                  {m.status === "done" && <Check style={{ width: 10, height: 10, color: COLORS.lime }} />}
                  {m.status === "locked" && <Lock style={{ width: 8, height: 8, color: "rgba(var(--ce-glass-tint),0.15)" }} />}
                </div>

                {/* Category icon */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: `${cat.color}1A`,
                  }}
                >
                  <CatIcon style={{ width: 12, height: 12, color: cat.color }} />
                </div>

                {/* Label */}
                <span
                  className="flex-1 text-[12px]"
                  style={{
                    fontFamily: FONT.body,
                    color:
                      m.status === "done"
                        ? TEXT.muted
                        : m.status === "current"
                        ? TEXT.primary
                        : m.status === "upcoming"
                        ? TEXT.tertiary
                        : "rgba(var(--ce-glass-tint),0.2)",
                    textDecoration: m.status === "done" ? "line-through" : "none",
                  }}
                >
                  {m.label}
                </span>

                {/* Time */}
                <span className="text-[10px] flex-shrink-0" style={{ color: TEXT.muted, fontVariantNumeric: "tabular-nums" }}>
                  {m.time}
                </span>

                {/* In progress badge */}
                {m.status === "current" && (
                  <span
                    className="text-[9px] flex-shrink-0"
                    style={{
                      padding: "2px 6px",
                      borderRadius: 9999,
                      background: "rgba(var(--ce-role-parent-rgb),0.1)",
                      color: "var(--ce-role-parent)",
                      border: "1px solid rgba(var(--ce-role-parent-rgb),0.15)",
                    }}
                  >
                    In progress
                  </span>
                )}
              </motion.div>

              {/* Sophia inline note */}
              {m.status === "current" && m.sophiaNote && (
                <div
                  className="flex items-start gap-2"
                  style={{
                    marginLeft: 32,
                    marginTop: 4,
                    marginBottom: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(var(--ce-role-edgestar-rgb),0.03)",
                    border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)",
                  }}
                >
                  <SophiaMark size={12} glowing={false} />
                  <span className="text-[11px] leading-relaxed" style={{ color: TEXT.secondary }}>
                    {m.sophiaNote}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Right Pane ─────────────────────────────────────────────────────────────

function RightPane({
  child,
  selectedMilestone,
  onClearMilestone,
}: {
  child: ChildData;
  selectedMilestone: Milestone | null;
  onClearMilestone: () => void;
}) {
  const [tab, setTab] = useState<"insights" | "budget">("insights");
  const [noteText, setNoteText] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const [expandedBudget, setExpandedBudget] = useState<number | null>(null);

  const handleSendNote = () => {
    if (!noteText.trim()) return;
    setNoteSent(true);
    setTimeout(() => {
      setNoteSent(false);
      setNoteText("");
      onClearMilestone();
    }, 1500);
  };

  const totalSpent = child.budgetPhases.reduce((a, b) => a + b.spent, 0);
  const totalEstimated = child.budgetPhases.reduce((a, b) => a + b.estimated, 0);

  const STATUS_DOT_COLOR: Record<string, string> = {
    done: COLORS.lime,
    active: "var(--ce-role-parent)",
    upcoming: TEXT.muted,
  };

  return (
    <div
      style={{
        width: 320,
        minWidth: 320,
        background: "rgba(var(--ce-glass-tint),0.01)",
        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.04)",
        overflowY: "auto",
        padding: "24px 16px 24px",
      }}
    >
      {/* Tab toggle */}
      <div
        className="flex gap-1"
        style={{
          padding: 2,
          borderRadius: 8,
          background: "rgba(var(--ce-glass-tint),0.03)",
          border: "1px solid rgba(var(--ce-glass-tint),0.04)",
          marginBottom: 16,
        }}
      >
        {(["insights", "budget"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 text-center cursor-pointer"
            style={{
              padding: "6px 0",
              borderRadius: 6,
              fontSize: 11,
              fontFamily: FONT.display,
              fontWeight: 500,
              background: tab === t ? "rgba(var(--ce-glass-tint),0.06)" : "transparent",
              border: tab === t ? "1px solid rgba(var(--ce-glass-tint),0.08)" : "1px solid transparent",
              color: tab === t ? TEXT.primary : TEXT.tertiary,
            }}
          >
            {t === "insights" ? "Insights" : "Budget"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "insights" ? (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {/* Sophia Insight */}
            <div style={{ marginBottom: 16 }}>
              <SophiaInsight
                message={child.sophiaMessage}
                actionLabel={`Ask about ${child.name}`}
                delay={0.3}
              />
            </div>

            {/* Note composer or prompt */}
            <AnimatePresence mode="wait">
              {selectedMilestone ? (
                <motion.div
                  key="composer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    background: "linear-gradient(145deg, rgba(var(--ce-role-parent-rgb),0.05), rgba(var(--ce-glass-tint),0.02))",
                    border: "1px solid rgba(var(--ce-role-parent-rgb),0.1)",
                    marginBottom: 16,
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                    <Heart style={{ width: 12, height: 12, color: "var(--ce-role-parent)" }} />
                    <span className="text-[12px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}>
                      Note for {child.name}
                    </span>
                  </div>
                  <div className="text-[10px]" style={{ color: TEXT.muted, marginBottom: 10 }}>
                    On: {selectedMilestone.label}
                  </div>

                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 10 }}>
                    {NOTE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setNoteText(preset)}
                        className="text-[10px] cursor-pointer"
                        style={{
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(var(--ce-role-parent-rgb),0.06)",
                          border: "1px solid rgba(var(--ce-role-parent-rgb),0.1)",
                          color: "var(--ce-role-parent)",
                          fontFamily: FONT.body,
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {!noteSent ? (
                    <>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Write something encouraging..."
                        rows={2}
                        className="w-full resize-none outline-none text-[12px]"
                        style={{
                          background: "rgba(var(--ce-glass-tint),0.03)",
                          border: "1px solid rgba(var(--ce-glass-tint),0.07)",
                          borderRadius: 8,
                          padding: "8px 12px",
                          color: TEXT.primary,
                          fontFamily: FONT.body,
                          marginBottom: 10,
                        }}
                      />
                      <button
                        onClick={handleSendNote}
                        disabled={!noteText.trim()}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
                        style={{
                          padding: "8px 0",
                          borderRadius: 8,
                          fontSize: 12,
                          fontFamily: FONT.display,
                          fontWeight: 500,
                          color: "#fff",
                          background: noteText.trim()
                            ? "linear-gradient(135deg, var(--ce-role-parent), #DB2777)"
                            : "rgba(var(--ce-role-parent-rgb),0.2)",
                          border: "none",
                        }}
                      >
                        <Send style={{ width: 12, height: 12 }} />
                        Send note
                      </button>
                    </>
                  ) : (
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      style={{ padding: 12 }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    >
                      <Heart style={{ width: 16, height: 16, color: "var(--ce-role-parent)" }} />
                      <span className="text-[13px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: "var(--ce-role-parent)" }}>
                        Sent!
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    background: "rgba(var(--ce-role-parent-rgb),0.03)",
                    border: "1px solid rgba(var(--ce-role-parent-rgb),0.08)",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  <Heart style={{ width: 16, height: 16, color: "rgba(var(--ce-role-parent-rgb),0.4)", margin: "0 auto 8px" }} />
                  <span className="text-[12px]" style={{ color: TEXT.secondary, fontFamily: FONT.body }}>
                    Select a milestone to leave a note
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upcoming */}
            <div style={{ marginBottom: 16 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                <Calendar style={{ width: 12, height: 12, color: TEXT.tertiary }} />
                <span className="text-[11px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.tertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Coming Up
                </span>
              </div>
              {child.upcoming.map((item, i) => (
                <div key={i} className="flex items-center gap-2" style={{ padding: "6px 0" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <span className="flex-1 text-[11px]" style={{ color: TEXT.secondary, fontFamily: FONT.body }}>{item.text}</span>
                  <span className="text-[10px]" style={{ color: TEXT.muted, fontVariantNumeric: "tabular-nums" }}>{item.date}</span>
                </div>
              ))}
            </div>

            {/* Quick message */}
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                <MessageSquare style={{ width: 12, height: 12, color: TEXT.tertiary }} />
                <span className="text-[11px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.tertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Message {child.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Great progress!", "How's it going?", "Need anything?", "Proud of you!"].map((msg) => (
                  <button
                    key={msg}
                    className="text-[10px] cursor-pointer"
                    style={{
                      padding: "5px 10px",
                      borderRadius: 8,
                      background: "rgba(var(--ce-glass-tint),0.03)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                      color: TEXT.secondary,
                      fontFamily: FONT.body,
                    }}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {/* Total */}
            <div style={{ marginBottom: 16 }}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: COLORS.lime }}>
                  ${totalSpent}
                </span>
                <span className="text-[11px]" style={{ color: TEXT.tertiary }}>of ${totalEstimated} est.</span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, borderRadius: 9999, background: "rgba(var(--ce-glass-tint),0.06)", marginTop: 8 }}>
                <motion.div
                  style={{
                    height: 6,
                    borderRadius: 9999,
                    background: `linear-gradient(90deg, ${COLORS.lime}, var(--ce-role-edgestar))`,
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${totalEstimated > 0 ? (totalSpent / totalEstimated) * 100 : 0}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>
            </div>

            {/* Phase breakdown */}
            {child.budgetPhases.map((bp) => {
              const isExpanded = expandedBudget === bp.id;
              return (
                <div key={bp.id} style={{ marginBottom: 4 }}>
                  <button
                    onClick={() => setExpandedBudget(isExpanded ? null : bp.id)}
                    className="w-full flex items-center gap-2 cursor-pointer"
                    style={{
                      padding: "10px 0",
                      borderBottom: `1px solid ${SURFACE.divider}`,
                      background: "transparent",
                      border: "none",
                      borderBottomWidth: 1,
                      borderBottomStyle: "solid",
                      borderBottomColor: SURFACE.divider,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_DOT_COLOR[bp.status], flexShrink: 0 }} />
                    <span className="flex-1 text-left text-[11px]" style={{ fontFamily: FONT.display, fontWeight: 500, color: TEXT.primary }}>
                      {bp.title}
                    </span>
                    <span className="text-[10px]" style={{ color: TEXT.tertiary, fontVariantNumeric: "tabular-nums" }}>
                      ${bp.spent} / ${bp.estimated}
                    </span>
                    {isExpanded ? (
                      <ChevronUp style={{ width: 12, height: 12, color: TEXT.muted }} />
                    ) : (
                      <ChevronDown style={{ width: 12, height: 12, color: TEXT.muted }} />
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "8px 0 8px 14px" }}>
                          {bp.items.map((item, i) => (
                            <div key={i} className="text-[10px]" style={{ color: TEXT.muted, padding: "3px 0", fontFamily: FONT.body }}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Sophia budget tip */}
            <div
              className="flex items-start gap-2"
              style={{
                marginTop: 16,
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(var(--ce-lime-rgb),0.03)",
                border: "1px solid rgba(var(--ce-lime-rgb),0.08)",
              }}
            >
              <Sparkles style={{ width: 12, height: 12, color: COLORS.lime, flexShrink: 0, marginTop: 1 }} />
              <span className="text-[11px] leading-relaxed" style={{ color: TEXT.secondary, fontFamily: FONT.body }}>
                {child.name}'s Phase 2 spending is tracking under budget. Consider allocating leftover funds toward interview prep resources.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function FamilyVariationC() {
  const navigate = useNavigate();
  const [activeChildId, setActiveChildId] = useState(CHILDREN[0].id);
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(() => {
    const child = CHILDREN[0];
    const active = child.phases.find((p) => p.status === "active");
    return active?.id ?? 1;
  });
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const activeChild = CHILDREN.find((c) => c.id === activeChildId)!;

  const handleChildSelect = (id: string) => {
    setActiveChildId(id);
    setSelectedMilestone(null);
    const child = CHILDREN.find((c) => c.id === id)!;
    const active = child.phases.find((p) => p.status === "active");
    setSelectedPhaseId(active?.id ?? 1);
  };

  const handlePhaseSelect = (id: number) => {
    setSelectedPhaseId(id);
    setSelectedMilestone(null);
  };

  const handleNavigate = (target: string) => {
    if (target === "landing") {
      navigate("/");
    } else if (target === "synthesis") {
      navigate("/parent");
    } else {
      navigate(`/parent/${target}`);
    }
  };

  return (
    <RoleShell
      role="parent"
      userName="David"
      userInitial="D"
      edgeGas={20}
      onNavigate={handleNavigate}
      noPadding
      sophiaOverride={{
        message: `${activeChild.name} has a ${activeChild.streak}-day streak — things are moving`,
        chips: [
          { label: `View ${activeChild.name}'s roadmap`, action: "family" },
          { label: "Ask Sophia", action: "sophia" },
        ],
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 320px",
          gap: 0,
          height: "calc(100vh - 56px - 56px)",
        }}
      >
        <LeftPane
          children={CHILDREN}
          activeId={activeChildId}
          onSelect={handleChildSelect}
          onAddChild={() => setQrOpen(true)}
        />
        <CenterPane
          child={activeChild}
          selectedPhaseId={selectedPhaseId}
          onPhaseSelect={handlePhaseSelect}
          selectedMilestone={selectedMilestone}
          onMilestoneSelect={setSelectedMilestone}
        />
        <RightPane
          child={activeChild}
          selectedMilestone={selectedMilestone}
          onClearMilestone={() => setSelectedMilestone(null)}
        />
      </div>

      <QRModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Link Child Account"
        showLabel="Show my QR"
        scanLabel="Scan child's QR"
        showDescription="Have your child scan this code with their CareerEdge app"
        scanDescription="Point your camera at your child's QR code"
        roleColor="var(--ce-role-parent)"
        identifier="CE-PARENT-2026"
      />
    </RoleShell>
  );
}
