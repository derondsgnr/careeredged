/**
 * Parent EdgePath — "My Path"
 *
 * Thin wrapper: two-tab surface over EdgePathOptionA.
 *   - My Career   → role="parent-career"  with career progression data
 *   - Support Journey → role="parent-support" with child-support data
 *
 * Accent: var(--ce-role-parent) (parent pink)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell } from "./role-shell";
import type { NavigateFn } from "./role-shell";
import { EdgePathOptionA } from "./edgepath-option-a";
import type { EdgePathData, Milestone, PhaseData } from "./edgepath-option-a";
import { TabSwitcher } from "./tab-switcher";
import { EASE } from "./tokens";

// ─── Career Data ──────────────────────────────────────────────────────────────

const CAREER_PHASES: PhaseData[] = [
  { id: 1, title: "Assess",   weeks: "Week 1–2",  status: "complete", progress: 1,    milestonesDone: 4, milestonesTotal: 4 },
  { id: 2, title: "Upskill",  weeks: "Week 3–8",  status: "active",   progress: 0.25, milestonesDone: 1, milestonesTotal: 4 },
  { id: 3, title: "Position", weeks: "Week 9–14", status: "upcoming",  progress: 0,    milestonesDone: 0, milestonesTotal: 4 },
  { id: 4, title: "Advance",  weeks: "Week 15+",  status: "locked",   progress: 0,    milestonesDone: 0, milestonesTotal: 4 },
];

const CAREER_MILESTONES: Record<number, Milestone[]> = {
  1: [
    { id: "ca1", label: "Complete skills inventory & gap analysis",        category: "action", status: "done",     time: "2h",    sophiaNote: "Identified leadership and strategic communication as top growth areas for your next step." },
    { id: "ca2", label: "Map current role vs. target role delta",          category: "skill",  status: "done",     time: "1h",    sophiaNote: "Gap: 1–2 years of cross-functional project ownership to reach Director-level scope." },
    { id: "ca3", label: "Career alignment conversation with manager",      category: "action", status: "done",     time: "30min", sophiaNote: "Manager is supportive. Suggested leading the Q2 initiative as your stretch assignment." },
    { id: "ca4", label: "Set 6-month career targets",                      category: "action", status: "done",     time: "1h",    sophiaNote: "Target: Step into senior manager scope by Q3 with 1 stretch project delivered." },
  ],
  2: [
    { id: "cu1", label: "Complete: Strategic Leadership Fundamentals course", category: "skill",    status: "current",  time: "6h",     sophiaNote: "You're 40% through. Week 4 covers stakeholder influence — the most relevant module for your gap." },
    { id: "cu2", label: "Lead a cross-functional initiative (stretch assignment)", category: "action", status: "upcoming", time: "Ongoing", sophiaNote: "Your manager suggested the Q2 product launch. This is the biggest leverage point for your next step." },
    { id: "cu3", label: "Build 2 documented project case studies",            category: "action",   status: "upcoming", time: "4h",     sophiaNote: "Focus on measurable outcomes — cost saved, revenue influenced, team results." },
    { id: "cu4", label: "Expand professional network by 10 senior connections", category: "resource", status: "upcoming", time: "Ongoing", sophiaNote: "Quality over quantity. Target people doing the job you want in 2 years." },
  ],
  3: [
    { id: "cp1", label: "Update LinkedIn & resume for target role",        category: "action", status: "upcoming", time: "2h" },
    { id: "cp2", label: "Brief sponsor or mentor on your career ambitions", category: "action", status: "upcoming", time: "45min" },
    { id: "cp3", label: "Research 5 target opportunities (internal & external)", category: "skill", status: "upcoming", time: "3h" },
    { id: "cp4", label: "Prepare interview stories + portfolio walkthrough", category: "action", status: "upcoming", time: "4h" },
  ],
  4: [
    { id: "cv1", label: "Negotiate compensation and role clarity",         category: "action",   status: "upcoming", time: "2h" },
    { id: "cv2", label: "Build your 90-day onboarding plan",               category: "action",   status: "upcoming", time: "2h" },
    { id: "cv3", label: "Establish early wins in new scope",               category: "resource", status: "upcoming", time: "Ongoing" },
    { id: "cv4", label: "Complete 6-month career review",                  category: "skill",    status: "upcoming", time: "1h" },
  ],
};

const CAREER_DATA: EdgePathData = {
  roadmapTitle: "Senior Manager",
  roadmapTarget: "Director",
  archetype: "Executor-Builder",
  phases: CAREER_PHASES,
  milestones: CAREER_MILESTONES,
};

// ─── Support Journey Data ──────────────────────────────────────────────────────

const SUPPORT_PHASES: PhaseData[] = [
  { id: 1, title: "Understand", weeks: "Week 1–2",  status: "complete", progress: 1,    milestonesDone: 4, milestonesTotal: 4 },
  { id: 2, title: "Connect",    weeks: "Week 3–5",  status: "active",   progress: 0.25, milestonesDone: 1, milestonesTotal: 4 },
  { id: 3, title: "Support",    weeks: "Week 6–10", status: "upcoming",  progress: 0,    milestonesDone: 0, milestonesTotal: 4 },
  { id: 4, title: "Empower",    weeks: "Week 11+",  status: "locked",   progress: 0,    milestonesDone: 0, milestonesTotal: 4 },
];

const SUPPORT_MILESTONES: Record<number, Milestone[]> = {
  1: [
    { id: "u1", label: "Read: How modern job searching works",          category: "skill",    status: "done",     time: "20 min",  sophiaNote: "Covers ATS systems, LinkedIn, and how companies actually hire today." },
    { id: "u2", label: "Watch: What employers look for in 2025",        category: "skill",    status: "done",     time: "15 min",  sophiaNote: "Key shifts from 2010–2025 and what soft skills matter most." },
    { id: "u3", label: "Complete: Career support style assessment",     category: "action",   status: "done",     time: "10 min",  sophiaNote: "Understand your natural coaching style and where to adjust." },
    { id: "u4", label: "Habit: Ask one open-ended career question per week", category: "resource", status: "done", time: "Ongoing", sophiaNote: "Avoid yes/no questions. Try 'What's exciting you most right now?'" },
  ],
  2: [
    { id: "c1", label: "Link your child's CareerEdge account",          category: "action",   status: "done",     time: "5 min",   sophiaNote: "Gives you read-only access to their roadmap and milestones." },
    { id: "c2", label: "Set your involvement level preference",         category: "action",   status: "current",  time: "2 min",   sophiaNote: "Very Active, Active, or Observer — you can change anytime." },
    { id: "c3", label: "Schedule a weekly check-in (15 min)",          category: "resource", status: "upcoming", time: "Ongoing", sophiaNote: "Keep it low-pressure. Ask about their process, not their outcomes." },
    { id: "c4", label: "Send your first milestone encouragement note",  category: "action",   status: "upcoming", time: "5 min",   sophiaNote: "Go to Family → tap any milestone → write a note. Alex will see it." },
  ],
  3: [
    { id: "s1", label: "Review: How to give resume feedback without rewriting it", category: "skill",  status: "upcoming", time: "10 min" },
    { id: "s2", label: "Practice: Ask Sophia for coaching tips on their current phase", category: "action", status: "upcoming", time: "5 min" },
    { id: "s3", label: "Celebrate: Acknowledge their next completed phase", category: "action",   status: "upcoming", time: "Moment" },
    { id: "s4", label: "Read: When to step in and when to step back",   category: "skill",    status: "upcoming", time: "15 min" },
  ],
  4: [
    { id: "e1", label: "Transition to Observer mode",                   category: "action",   status: "upcoming", time: "2 min" },
    { id: "e2", label: "Reflect: Write a note to your child on their growth", category: "action", status: "upcoming", time: "15 min" },
    { id: "e3", label: "Celebrate their first career win",              category: "resource", status: "upcoming", time: "Moment" },
    { id: "e4", label: "Complete: Your support journey review",         category: "skill",    status: "upcoming", time: "10 min" },
  ],
};

const SUPPORT_DATA: EdgePathData = {
  roadmapTitle: "Supporting Alex",
  roadmapSubtitle: "Involvement: Very Active",
  phases: SUPPORT_PHASES,
  milestones: SUPPORT_MILESTONES,
};

// ─── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { id: "career",  label: "My Career" },
  { id: "support", label: "Support Journey" },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export function ParentEdgepath({
  onNavigate,
  onOpenTaskRoom,
}: {
  onNavigate?: NavigateFn;
  onOpenTaskRoom?: (milestoneId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"career" | "support">("career");

  return (
    <RoleShell
      role="parent"
      userName="David"
      userInitial="D"
      edgeGas={20}
      onNavigate={onNavigate}
    >
      {/* Single EdgePath instance — tab switcher lives inside the header via headerExtra,
          eliminating the double-header. The EdgePath header IS the page header. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <EdgePathOptionA
            role={activeTab === "career" ? "parent-career" : "parent-support"}
            data={activeTab === "career" ? CAREER_DATA : SUPPORT_DATA}
            embedded
            headerExtra={
              <TabSwitcher
                tabs={TABS}
                active={activeTab}
                onChange={(id) => setActiveTab(id as "career" | "support")}
                variant="pill"
                accent="var(--ce-role-parent)"
                layoutId="parent-edgepath-tabs"
              />
            }
            onOpenTaskRoom={onOpenTaskRoom}
            onNavigate={onNavigate}
          />
        </motion.div>
      </AnimatePresence>
    </RoleShell>
  );
}
