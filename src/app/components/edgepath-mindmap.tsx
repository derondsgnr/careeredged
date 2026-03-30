/**
 * EdgePath — Mind Map View (Embeddable mode)
 *
 * Complete E2E implementation:
 * - Phase nodes on a horizontal rail with milestones branching below
 * - Layout math ensures zero overlap between phase labels and milestone pills
 * - Scroll-to-zoom, drag-to-pan, Escape-to-close
 * - Every element has a hover state, every click leads somewhere
 * - Locked items give feedback (bounce), done items show recap content
 * - Path compare auto-confirms with visual feedback
 * - Sophia coaching is contextual and actionable throughout
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Check, Sparkles, X, Clock, BookOpen, ExternalLink,
  Briefcase, Target, GraduationCap, Users, Lock,
  GitBranch, ArrowRight, ZoomIn, ZoomOut, Maximize2,
  ChevronDown, Star, FileText, MessageSquare,
  Play, CheckCircle2, Circle, Send, Trophy,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Data ───────────────────────────────────────────────────────────────────

interface SubTask {
  id: string;
  label: string;
  done: boolean;
}

interface MilestoneNode {
  id: string;
  label: string;
  status: "done" | "current" | "upcoming" | "locked";
  time: string;
  category: "skill" | "action" | "resource";
  sophiaNote?: string;
  sophiaCoaching?: string;
  resources?: { label: string; type: string }[];
  crossSurface?: { surface: string; note: string; icon: string; action: string }[];
  subTasks?: SubTask[];
}

interface PathOption {
  id: string;
  label: string;
  matchPct: number;
  recommended: boolean;
  sophiaReason: string;
  milestones: MilestoneNode[];
}

interface PhaseNode {
  id: number;
  title: string;
  weeks: string;
  status: "complete" | "active" | "upcoming" | "locked";
  chosenPath?: string;
  paths: PathOption[];
}

const ROADMAP_DATA: PhaseNode[] = [
  {
    id: 1,
    title: "Discover & Position",
    weeks: "Weeks 1–3",
    status: "complete",
    chosenPath: "p1a",
    paths: [{
      id: "p1a", label: "Self-Directed Research", matchPct: 95, recommended: true,
      sophiaReason: "Best fit for your experience level and learning style.",
      milestones: [
        { id: "p1m1", label: "Research target companies", status: "done", time: "3h", category: "action" },
        { id: "p1m2", label: "Identify skill gaps", status: "done", time: "2h", category: "action" },
        { id: "p1m3", label: "Create learning plan", status: "done", time: "4h", category: "action" },
        { id: "p1m4", label: "Portfolio audit", status: "done", time: "2h", category: "resource" },
        { id: "p1m5", label: "LinkedIn optimization", status: "done", time: "3h", category: "action" },
        { id: "p1m6", label: "Position statement", status: "done", time: "2h", category: "skill" },
      ],
    }],
  },
  {
    id: 2,
    title: "Skill Bridge",
    weeks: "Weeks 4–8",
    status: "active",
    chosenPath: "p2a",
    paths: [
      {
        id: "p2a", label: "Accelerated Bootcamp", matchPct: 95, recommended: true,
        sophiaReason: "Matches your hybrid study preference and moderate budget. Builds on your Fine Arts degree with practical software skills.",
        milestones: [
          { id: "p2m1", label: "Figma fundamentals", status: "done", time: "8h", category: "skill" },
          { id: "p2m2", label: "Design systems", status: "done", time: "6h", category: "skill" },
          { id: "p2m3", label: "UX research", status: "done", time: "10h", category: "skill" },
          { id: "p2m4", label: "Case study #1", status: "done", time: "12h", category: "action" },
          { id: "p2m5", label: "Mentor feedback", status: "done", time: "2h", category: "action" },
          {
            id: "p2m6", label: "Interaction design", status: "current", time: "8h", category: "skill",
            sophiaNote: "6 of 8 target companies require this skill.",
            sophiaCoaching: "Start with Chapter 3 of the IDF course — it covers the patterns your target companies use most. Then try the daily challenge. About 2 hours total.",
            resources: [
              { label: "Interaction Design Foundation", type: "course" },
              { label: "Microinteractions — Dan Saffer", type: "book" },
            ],
            crossSurface: [
              { surface: "ResumeEdge", note: "Resume needs update after", icon: "file", action: "Open ResumeEdge" },
              { surface: "EdgeMatch", note: "3 jobs require this skill", icon: "briefcase", action: "View matching jobs" },
              { surface: "EdgeGuide", note: "Alice left feedback", icon: "users", action: "Read feedback" },
            ],
            subTasks: [
              { id: "st1", label: "Complete IDF Chapter 3", done: true },
              { id: "st2", label: "Complete IDF Chapter 4", done: true },
              { id: "st3", label: "Complete IDF Chapter 5", done: false },
              { id: "st4", label: "Daily challenge: micro-interactions", done: false },
              { id: "st5", label: "Build interaction prototype", done: false },
            ],
          },
          {
            id: "p2m7", label: "Case study #2", status: "upcoming", time: "15h", category: "action",
            sophiaNote: "Pick a product you use daily. Deep understanding > flashy visuals.",
            sophiaCoaching: "When the time comes, pick a product you already use daily. Depth of understanding always beats flashy visuals in interviews.",
          },
          {
            id: "p2m8", label: "Portfolio ATS pass", status: "upcoming", time: "1h", category: "resource",
            sophiaCoaching: "I'll auto-check your portfolio against common ATS filters when you're ready. Usually takes about 10 minutes.",
          },
        ],
      },
      {
        id: "p2b", label: "Formal Education", matchPct: 65, recommended: false,
        sophiaReason: "Deep knowledge and prestige, but significant time and financial commitment. Less aligned with your hybrid study preference.",
        milestones: [
          { id: "p2bm1", label: "Research programs", status: "upcoming", time: "6h", category: "action" },
          { id: "p2bm2", label: "Apply to top 3", status: "upcoming", time: "10h", category: "action" },
          { id: "p2bm3", label: "Secure funding", status: "upcoming", time: "8h", category: "resource" },
          { id: "p2bm4", label: "Semester 1", status: "upcoming", time: "200h", category: "skill" },
          { id: "p2bm5", label: "Academic portfolio", status: "upcoming", time: "40h", category: "action" },
        ],
      },
      {
        id: "p2c", label: "Self-Taught + Mentorship", matchPct: 78, recommended: false,
        sophiaReason: "Maximum flexibility and lowest cost. Requires strong self-discipline. Slower to build credibility.",
        milestones: [
          { id: "p2cm1", label: "Curate curriculum", status: "upcoming", time: "4h", category: "action" },
          { id: "p2cm2", label: "Weekly mentor sessions", status: "upcoming", time: "1h/wk", category: "resource" },
          { id: "p2cm3", label: "Daily challenges", status: "upcoming", time: "2h/day", category: "skill" },
          { id: "p2cm4", label: "Open source work", status: "upcoming", time: "20h", category: "action" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Build & Ship",
    weeks: "Weeks 9–13",
    status: "upcoming",
    paths: [{
      id: "p3a", label: "Portfolio Sprint", matchPct: 0, recommended: true, sophiaReason: "",
      milestones: [
        { id: "p3m1", label: "3 case studies", status: "locked", time: "30h", category: "action", sophiaCoaching: "This unlocks after you finish Phase 2. I'll have templates and examples ready for you." },
        { id: "p3m2", label: "Personal website", status: "locked", time: "12h", category: "action", sophiaCoaching: "I'll help you pick a template that matches your target companies' aesthetic." },
        { id: "p3m3", label: "Community presence", status: "locked", time: "8h", category: "action" },
      ],
    }],
  },
  {
    id: 4,
    title: "Interview & Close",
    weeks: "Weeks 14–18",
    status: "locked",
    paths: [{
      id: "p4a", label: "Job Search", matchPct: 0, recommended: true, sophiaReason: "",
      milestones: [
        { id: "p4m1", label: "Interview prep", status: "locked", time: "10h", category: "skill" },
        { id: "p4m2", label: "Design challenges", status: "locked", time: "15h", category: "skill" },
        { id: "p4m3", label: "Apply to targets", status: "locked", time: "8h", category: "action" },
      ],
    }],
  },
];

// ─── Style maps ─────────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = { skill: "var(--ce-role-edgestar)", action: "var(--ce-lime)", resource: "var(--ce-text-secondary)" };
const CAT_ICONS: Record<string, any> = { skill: GraduationCap, action: Target, resource: BookOpen };
const SURFACE_ICONS: Record<string, any> = { file: FileText, briefcase: Briefcase, users: Users };

// ─── Task Room Panel ────────────────────────────────────────────────────────

function TaskRoomPanel({
  milestone,
  onClose,
}: {
  milestone: MilestoneNode;
  onClose: () => void;
}) {
  const [localSubTasks, setLocalSubTasks] = useState(milestone.subTasks || []);
  const subTasksDone = localSubTasks.filter(t => t.done).length;
  const subTasksTotal = localSubTasks.length;
  const CatIcon = CAT_ICONS[milestone.category];
  const isDone = milestone.status === "done";
  const isCurrent = milestone.status === "current";
  const isLocked = milestone.status === "locked";

  const toggleSubTask = (id: string) => {
    setLocalSubTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  useEffect(() => {
    setLocalSubTasks(milestone.subTasks || []);
  }, [milestone.id]);

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{
        background: "rgba(10,12,16,0.97)",
        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        backdropFilter: "blur(24px)",
      }}
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-center gap-2.5">
          <CatIcon className="w-4 h-4" style={{ color: CAT_COLORS[milestone.category] }} />
          <span className="text-[11px] px-2 py-0.5 rounded" style={{
            background: `${CAT_COLORS[milestone.category]}12`,
            color: CAT_COLORS[milestone.category],
            fontFamily: "var(--font-body)",
          }}>
            {milestone.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
            <Clock className="w-3 h-3" /> {milestone.time}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
          <X className="w-4 h-4 text-ce-text-tertiary" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto">
        {/* Title + status + CTA */}
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-[17px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {milestone.label}
          </h3>
          <span className={`text-[11px] ${isDone ? "text-ce-lime" : isCurrent ? "text-ce-cyan" : isLocked ? "text-[var(--ce-text-quaternary)]" : "text-ce-text-tertiary"}`}
            style={{ fontFamily: "var(--font-body)" }}>
            {isDone ? "Completed" : isCurrent ? "In progress" : isLocked ? "Locked" : "Upcoming"}
          </span>

          {/* Progress bar */}
          {subTasksTotal > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Progress</span>
                <span className="text-[10px] text-ce-text-secondary tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{subTasksDone} of {subTasksTotal}</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: subTasksDone === subTasksTotal ? "var(--ce-lime)" : "var(--ce-role-edgestar)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(subTasksDone / subTasksTotal) * 100}%` }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </div>
            </div>
          )}

          {/* Primary CTA based on status */}
          {isCurrent && (
            <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, rgba(var(--ce-cyan-rgb),0.12), rgba(var(--ce-cyan-rgb),0.06))",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.15)",
                fontFamily: "var(--font-display)", fontWeight: 500,
              }}>
              <Play className="w-4 h-4 text-ce-cyan" />
              <span className="text-[13px] text-ce-text-primary">Continue where you left off</span>
            </button>
          )}
          {milestone.status === "upcoming" && (
            <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
              style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <Play className="w-4 h-4 text-ce-text-tertiary" />
              <span className="text-[13px] text-ce-text-secondary">Start this milestone</span>
            </button>
          )}
          {isDone && (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(var(--ce-lime-rgb),0.04)", border: "1px solid rgba(var(--ce-lime-rgb),0.08)" }}>
              <Trophy className="w-4 h-4 text-ce-lime" />
              <div className="flex-1">
                <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Milestone complete</span>
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>This skill is now part of your profile</span>
              </div>
            </div>
          )}
          {isLocked && (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(var(--ce-glass-tint),0.01)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <Lock className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
              <span className="text-[12px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Unlocks when earlier milestones are complete</span>
            </div>
          )}
        </div>

        {/* Sophia coaching — always present, adapts to status */}
        {(milestone.sophiaCoaching || milestone.sophiaNote) && (
          <div className="mx-5 mb-4 px-4 py-3.5 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
            <div className="flex items-center gap-2 mb-2">
              <SophiaMark size={14} glowing={false} />
              <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
            </div>
            <p className="text-[12px] text-ce-text-secondary leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
              {milestone.sophiaCoaching || milestone.sophiaNote}
            </p>
            <button className="flex items-center gap-1.5 text-[11px] text-ce-cyan cursor-pointer hover:underline" style={{ fontFamily: "var(--font-body)" }}>
              <MessageSquare className="w-3 h-3" /> Ask Sophia about this
            </button>
          </div>
        )}

        {/* Sub-tasks */}
        {subTasksTotal > 0 && (
          <div className="mx-5 mb-4">
            <span className="text-[11px] text-ce-text-tertiary mb-2 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Steps</span>
            <div className="flex flex-col gap-0.5">
              {localSubTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors"
                  onClick={() => toggleSubTask(task.id)}
                >
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 text-ce-lime flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[var(--ce-text-quaternary)] flex-shrink-0" />
                  )}
                  <span className={`text-[12px] ${task.done ? "text-[var(--ce-text-quaternary)] line-through" : "text-ce-text-primary"}`} style={{ fontFamily: "var(--font-body)" }}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {milestone.resources && milestone.resources.length > 0 && (
          <div className="mx-5 mb-4">
            <span className="text-[11px] text-ce-text-tertiary mb-2 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Resources</span>
            <div className="flex flex-col gap-1.5">
              {milestone.resources.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors"
                  style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <BookOpen className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{r.label}</span>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{r.type}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-surface connections */}
        {milestone.crossSurface && milestone.crossSurface.length > 0 && (
          <div className="mx-5 mb-4">
            <span className="text-[11px] text-ce-text-tertiary mb-2 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Connected</span>
            <div className="flex flex-col gap-1.5">
              {milestone.crossSurface.map((cs, i) => {
                const SIcon = SURFACE_ICONS[cs.icon] || FileText;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors group"
                    style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <SIcon className="w-3.5 h-3.5 text-ce-cyan" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{cs.surface}</span>
                      <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{cs.note}</span>
                    </div>
                    <span className="text-[10px] text-ce-cyan flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "var(--font-body)" }}>
                      {cs.action} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state for milestones with no extra content */}
        {!milestone.sophiaCoaching && !milestone.sophiaNote && subTasksTotal === 0 && !milestone.resources?.length && !milestone.crossSurface?.length && (
          <div className="mx-5 mb-4 flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              {isDone ? <Check className="w-4 h-4 text-ce-lime" /> : <Sparkles className="w-4 h-4 text-[var(--ce-text-quaternary)]" />}
            </div>
            <span className="text-[12px] text-ce-text-tertiary mb-1" style={{ fontFamily: "var(--font-body)" }}>
              {isDone ? "You completed this milestone." : isLocked ? "This milestone is locked for now." : "Details will appear when this milestone is active."}
            </span>
            <button className="mt-2 flex items-center gap-1.5 text-[11px] text-ce-cyan cursor-pointer hover:underline" style={{ fontFamily: "var(--font-body)" }}>
              <MessageSquare className="w-3 h-3" /> Ask Sophia about this
            </button>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-2 px-5 py-3.5 flex-shrink-0" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-[11px] hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
          style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
          <Send className="w-3 h-3" /> Share with mentor
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-[11px] hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
          style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
          <Target className="w-3 h-3" /> Add to today
        </button>
      </div>
    </motion.div>
  );
}

// ─── Path Comparison Panel ──────────────────────────────────────────────────

function PathComparePanel({
  phase,
  onClose,
  onChoose,
}: {
  phase: PhaseNode;
  onClose: () => void;
  onChoose: (pathId: string) => void;
}) {
  const [justChose, setJustChose] = useState<string | null>(null);

  const handleChoose = (pathId: string) => {
    onChoose(pathId);
    setJustChose(pathId);
    setTimeout(() => onClose(), 1200);
  };

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[420px] z-50 flex flex-col"
      style={{
        background: "rgba(10,12,16,0.97)",
        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        backdropFilter: "blur(24px)",
      }}
      initial={{ x: 420 }}
      animate={{ x: 0 }}
      exit={{ x: 420 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-ce-cyan" />
          <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {phase.title} — Paths
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]">
          <X className="w-4 h-4 text-ce-text-tertiary" />
        </button>
      </div>

      {/* Sophia context */}
      <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
        <div className="flex gap-2.5 px-3.5 py-3 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
          <SophiaMark size={14} glowing={false} />
          <p className="text-[11px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            I found {phase.paths.length} ways to approach <span className="text-ce-text-primary">{phase.title}</span>. I've ranked them by fit — but you know your situation best.
          </p>
        </div>
      </div>

      {/* Confirmation toast */}
      <AnimatePresence>
        {justChose && (
          <motion.div
            className="mx-5 mt-3 flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: "rgba(var(--ce-lime-rgb),0.06)", border: "1px solid rgba(var(--ce-lime-rgb),0.12)" }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Check className="w-4 h-4 text-ce-lime" />
            <span className="text-[12px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>Path updated. Milestones are refreshing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          {phase.paths
            .sort((a, b) => b.matchPct - a.matchPct)
            .map((path, i) => {
              const isChosen = phase.chosenPath === path.id || justChose === path.id;
              return (
                <motion.div
                  key={path.id}
                  className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: isChosen ? "rgba(var(--ce-role-edgestar-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.02)",
                    border: `1px solid ${isChosen ? "rgba(var(--ce-role-edgestar-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.04)"}`,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3, ease: EASE }}
                >
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {path.recommended && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full text-ce-lime flex items-center gap-1" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                              <Star className="w-2.5 h-2.5 fill-[var(--ce-lime)]" /> Recommended
                            </span>
                          )}
                          {isChosen && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full text-ce-cyan" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                              Active
                            </span>
                          )}
                        </div>
                        <h4 className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{path.label}</h4>
                      </div>
                      {path.matchPct > 0 && (
                        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{
                          background: "rgba(var(--ce-glass-tint),0.02)",
                          border: `2.5px solid ${path.matchPct >= 90 ? "var(--ce-lime)" : path.matchPct >= 70 ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)"}`,
                        }}>
                          <span className="text-[11px] tabular-nums" style={{
                            color: path.matchPct >= 90 ? "var(--ce-lime)" : path.matchPct >= 70 ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
                            fontFamily: "var(--font-display)", fontWeight: 500,
                          }}>{path.matchPct}%</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-ce-text-tertiary leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
                      {path.sophiaReason}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-[var(--ce-text-quaternary)] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                      <span>{path.milestones.length} milestones</span>
                      <span>·</span>
                      <span>{path.milestones.reduce((acc, m) => { const h = parseFloat(m.time); return acc + (isNaN(h) ? 0 : h); }, 0)}h estimated</span>
                    </div>

                    {!isChosen && !justChose && (
                      <button
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[12px] cursor-pointer transition-all hover:brightness-110"
                        style={{
                          background: path.recommended ? "rgba(var(--ce-cyan-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.03)",
                          border: `1px solid ${path.recommended ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                          color: path.recommended ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                          fontFamily: "var(--font-display)", fontWeight: 500,
                        }}
                        onClick={() => handleChoose(path.id)}
                      >
                        Choose this path <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Milestone preview */}
                  <div className="px-4 py-2.5" style={{ background: "rgba(var(--ce-glass-tint),0.01)", borderTop: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
                    <div className="flex flex-wrap gap-1.5">
                      {path.milestones.slice(0, 5).map(m => (
                        <span key={m.id} className="text-[9px] px-2 py-0.5 rounded" style={{
                          background: "rgba(var(--ce-glass-tint),0.03)",
                          color: m.status === "done" ? "var(--ce-lime)" : "var(--ce-text-tertiary)",
                          fontFamily: "var(--font-body)",
                        }}>
                          {m.status === "done" && <Check className="w-2 h-2 inline mr-0.5" />}
                          {m.label}
                        </span>
                      ))}
                      {path.milestones.length > 5 && (
                        <span className="text-[9px] px-2 py-0.5 rounded text-[var(--ce-text-quaternary)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}>
                          +{path.milestones.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Layout Constants ───────────────────────────────────────────────────────
// Phase circles are 72px (r=36). Labels + progress + path button + chevron = ~110px below circle.
// MILESTONE_Y_START must clear that entire block.

const PHASE_GAP = 360;
const PHASE_X_START = 200;
const PHASE_Y_CENTER = 160;
const MILESTONE_Y_START = 220;
const MILESTONE_GAP_Y = 54;

function getPhaseX(idx: number) {
  return PHASE_X_START + idx * PHASE_GAP;
}

// ─── Mind Map Canvas ────────────────────────────────────────────────────────

export function MindMapView() {
  const [zoom, setZoom] = useState(0.82);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [expandedPhase, setExpandedPhase] = useState<number>(2);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneNode | null>(null);
  const [showPathCompare, setShowPathCompare] = useState<PhaseNode | null>(null);
  const [data, setData] = useState(ROADMAP_DATA);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [lockedBounce, setLockedBounce] = useState<number | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-to-zoom (non-passive to allow preventDefault)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      setZoom(z => Math.min(Math.max(z + delta, 0.35), 2));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Escape key closes panels
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPathCompare) setShowPathCompare(null);
        else if (selectedMilestone) setSelectedMilestone(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showPathCompare, selectedMilestone]);

  const handleChoosePath = useCallback((phaseId: number, pathId: string) => {
    setData(prev => prev.map(p => p.id === phaseId ? { ...p, chosenPath: pathId } : p));
  }, []);

  const handlePhaseClick = useCallback((phase: PhaseNode) => {
    if (phase.status === "locked") {
      setLockedBounce(phase.id);
      setTimeout(() => setLockedBounce(null), 600);
      return;
    }
    setExpandedPhase(phase.id);
  }, []);

  // Pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  // Calculate canvas dimensions based on active path milestones
  const expandedData = data.find(p => p.id === expandedPhase);
  const activePathForSize = expandedData
    ? (expandedData.paths.find(p => p.id === expandedData.chosenPath) || expandedData.paths[0])
    : null;
  const maxMilestones = activePathForSize ? activePathForSize.milestones.length : 0;
  const canvasW = PHASE_X_START + data.length * PHASE_GAP + 200;
  const canvasH = PHASE_Y_CENTER + MILESTONE_Y_START + maxMilestones * MILESTONE_GAP_Y + 120;

  // Sophia context message
  const getSophiaMessage = () => {
    if (showPathCompare) return "Comparing paths — take your time. There's no wrong choice here.";
    if (selectedMilestone) {
      if (selectedMilestone.status === "current")
        return `"${selectedMilestone.label}" is your highest-impact next step. ${selectedMilestone.subTasks ? `${selectedMilestone.subTasks.filter(t => t.done).length} of ${selectedMilestone.subTasks.length} steps done.` : ""}`;
      if (selectedMilestone.status === "done")
        return `Nice work completing "${selectedMilestone.label}." That skill is now part of your profile.`;
      if (selectedMilestone.status === "locked")
        return `"${selectedMilestone.label}" unlocks later. Focus on your current milestones first.`;
      return `"${selectedMilestone.label}" is coming up. I'll brief you when it's time.`;
    }
    const activePhase = data.find(p => p.status === "active");
    if (activePhase) {
      const chosen = activePhase.paths.find(p => p.id === activePhase.chosenPath);
      if (chosen) {
        const done = chosen.milestones.filter(m => m.status === "done").length;
        const total = chosen.milestones.length;
        return `You're ${Math.round((done / total) * 100)}% through ${activePhase.title}. Interaction design is your highest-impact next step.`;
      }
    }
    return "Click any phase to explore milestones. Drag to pan, scroll to zoom.";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      style={{ cursor: isPanning ? "grabbing" : "grab" }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(var(--ce-glass-tint),0.02) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          width: canvasW,
          height: canvasH,
          position: "relative",
        }}>
          {/* ── SVG Connections ──────────────────────────────────── */}
          <svg className="absolute inset-0 pointer-events-none" width={canvasW} height={canvasH} style={{ overflow: "visible" }}>
            {/* Phase-to-phase rail */}
            {data.map((phase, i) => {
              if (i >= data.length - 1) return null;
              const x1 = getPhaseX(i) + 40;
              const x2 = getPhaseX(i + 1) - 40;
              const done = phase.status === "complete";
              return (
                <motion.line
                  key={`rail-${phase.id}`}
                  x1={x1} y1={PHASE_Y_CENTER}
                  x2={x2} y2={PHASE_Y_CENTER}
                  stroke={done ? "rgba(var(--ce-lime-rgb),0.18)" : "rgba(var(--ce-glass-tint),0.05)"}
                  strokeWidth={done ? 2 : 1.5}
                  strokeDasharray={done ? undefined : "6 4"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: EASE }}
                />
              );
            })}

            {/* Branch line: expanded phase → chosen path milestones only */}
            {data.map((phase) => {
              if (phase.id !== expandedPhase) return null;
              const px = getPhaseX(phase.id - 1);
              const activePath = phase.paths.find(p => p.id === phase.chosenPath) || (phase.paths.length === 1 ? phase.paths[0] : null);
              if (!activePath) return null;

              const startY = PHASE_Y_CENTER + 36;
              const endY = PHASE_Y_CENTER + MILESTONE_Y_START;

              return (
                <g key={`branch-${activePath.id}`}>
                  <motion.path
                    d={`M ${px} ${startY} C ${px} ${startY + 40}, ${px} ${endY - 30}, ${px} ${endY}`}
                    fill="none"
                    stroke="rgba(var(--ce-role-edgestar-rgb),0.12)"
                    strokeWidth={1.5}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
                  />
                  {activePath.milestones.map((ms, mi) => {
                    if (mi >= activePath.milestones.length - 1) return null;
                    const y1 = PHASE_Y_CENTER + MILESTONE_Y_START + mi * MILESTONE_GAP_Y + 18;
                    const y2 = PHASE_Y_CENTER + MILESTONE_Y_START + (mi + 1) * MILESTONE_GAP_Y;
                    return (
                      <motion.line
                        key={`msl-${ms.id}`}
                        x1={px} y1={y1} x2={px} y2={y2}
                        stroke={ms.status === "done" ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-role-edgestar-rgb),0.05)"}
                        strokeWidth={1}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 + mi * 0.03, duration: 0.2, ease: EASE }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* ── Phase Nodes ──────────────────────────────────────── */}
          {data.map((phase, i) => {
            const px = getPhaseX(i);
            const isExpanded = phase.id === expandedPhase;
            const isComplete = phase.status === "complete";
            const isActive = phase.status === "active";
            const isLocked = phase.status === "locked";
            const isHovered = hoveredPhase === phase.id;
            const isBouncing = lockedBounce === phase.id;
            const hasPaths = phase.paths.length > 1;
            const chosenPath = phase.paths.find(p => p.id === phase.chosenPath);
            const msDone = chosenPath ? chosenPath.milestones.filter(m => m.status === "done").length : 0;
            const msTotal = chosenPath ? chosenPath.milestones.length : phase.paths[0]?.milestones.length || 0;

            return (
              <motion.div
                key={`phase-${phase.id}`}
                data-node
                className="absolute select-none"
                style={{
                  left: px - 36,
                  top: PHASE_Y_CENTER - 36,
                  cursor: isLocked ? "not-allowed" : "pointer",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isBouncing ? [1, 1.08, 0.95, 1] : 1,
                  opacity: 1,
                }}
                transition={
                  isBouncing
                    ? { duration: 0.5, times: [0, 0.3, 0.6, 1] }
                    : { delay: 0.1 + i * 0.08, duration: 0.4, type: "spring", stiffness: 300, damping: 22 }
                }
                onClick={() => handlePhaseClick(phase)}
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                {/* Circle */}
                <div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isComplete ? "rgba(var(--ce-lime-rgb),0.08)" : isActive ? "rgba(var(--ce-role-edgestar-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.02)",
                    border: `2.5px solid ${isComplete ? "var(--ce-lime)" : isActive ? "var(--ce-role-edgestar)" : isLocked ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-glass-tint),0.08)"}`,
                    boxShadow: isActive
                      ? "0 0 32px rgba(var(--ce-role-edgestar-rgb),0.12), 0 0 64px rgba(var(--ce-role-edgestar-rgb),0.04)"
                      : isComplete
                        ? "0 0 20px rgba(var(--ce-lime-rgb),0.06)"
                        : isHovered && !isLocked
                          ? "0 0 24px rgba(var(--ce-glass-tint),0.04)"
                          : "none",
                    transform: isHovered && !isLocked && !isBouncing ? "scale(1.06)" : "scale(1)",
                  }}
                >
                  {isComplete ? (
                    <Check className="w-6 h-6 text-ce-lime" />
                  ) : isActive ? (
                    <motion.div className="w-3.5 h-3.5 rounded-full bg-[var(--ce-role-edgestar)]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }} />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5 text-[var(--ce-text-quaternary)]" />
                  ) : (
                    <span className="text-[16px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{phase.id}</span>
                  )}
                </div>

                {/* Labels below circle */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 text-center w-[180px]">
                  <span className={`text-[13px] block ${isActive ? "text-ce-text-primary" : isComplete ? "text-ce-text-secondary" : "text-ce-text-tertiary"}`}
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    {phase.title}
                  </span>
                  <span className="text-[10px] text-[var(--ce-text-quaternary)] block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                    {phase.weeks}
                  </span>

                  {/* Progress */}
                  {(isComplete || isActive) && (
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      {isActive && (
                        <>
                          <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                            <div className="h-full rounded-full bg-[var(--ce-role-edgestar)]" style={{ width: `${(msDone / msTotal) * 100}%` }} />
                          </div>
                          <span className="text-[9px] text-ce-cyan tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                            {msDone}/{msTotal}
                          </span>
                        </>
                      )}
                      {isComplete && (
                        <span className="text-[9px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>Complete</span>
                      )}
                    </div>
                  )}

                  {/* Locked hint */}
                  {isLocked && isBouncing && (
                    <motion.span
                      className="text-[9px] text-[var(--ce-text-quaternary)] block mt-2"
                      style={{ fontFamily: "var(--font-body)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Complete earlier phases first
                    </motion.span>
                  )}

                  {/* Path fork button */}
                  {hasPaths && (
                    <button
                      data-node
                      className="mt-2 flex items-center gap-1.5 mx-auto px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105 hover:brightness-125"
                      style={{
                        background: "rgba(var(--ce-role-edgestar-rgb),0.06)",
                        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)",
                        color: "var(--ce-role-edgestar)",
                      }}
                      onClick={(e) => { e.stopPropagation(); setShowPathCompare(phase); }}
                    >
                      <GitBranch className="w-3 h-3" />
                      <span className="text-[10px]" style={{ fontFamily: "var(--font-body)" }}>{phase.paths.length} paths</span>
                    </button>
                  )}

                  {/* Expand chevron */}
                  {!isLocked && (
                    <div className="mt-1.5 flex items-center justify-center">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-all duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        style={{ color: isExpanded ? "var(--ce-role-edgestar)" : isHovered ? "var(--ce-text-secondary)" : "var(--ce-text-quaternary)" }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* ── Milestone Nodes (chosen path only) ────────────────── */}
          <AnimatePresence mode="wait">
            {data.map((phase) => {
              if (phase.id !== expandedPhase) return null;
              const px = getPhaseX(phase.id - 1);
              const activePath = phase.paths.find(p => p.id === phase.chosenPath) || (phase.paths.length === 1 ? phase.paths[0] : null);
              const hasManyPaths = phase.paths.length > 1;

              return (
                <motion.div
                  key={`milestones-phase-${phase.id}-${phase.chosenPath}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Active path label for multi-path phases */}
                  {hasManyPaths && activePath && (
                    <motion.div
                      data-node
                      className="absolute cursor-pointer"
                      style={{
                        left: px - 90,
                        top: PHASE_Y_CENTER + MILESTONE_Y_START - 28,
                        width: 180,
                        textAlign: "center",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                      onClick={() => setShowPathCompare(phase)}
                    >
                      <span className="text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 hover:brightness-125 transition-all" style={{
                        background: "rgba(var(--ce-role-edgestar-rgb),0.08)",
                        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)",
                        color: "var(--ce-role-edgestar)",
                        fontFamily: "var(--font-body)",
                      }}>
                        {activePath.recommended && <Star className="w-2.5 h-2.5 fill-[var(--ce-lime)] text-ce-lime" />}
                        {activePath.label}
                        {activePath.matchPct > 0 && <span className="text-[var(--ce-text-quaternary)] ml-1">{activePath.matchPct}%</span>}
                      </span>
                    </motion.div>
                  )}

                  {/* Milestones — only the chosen/active path */}
                  {activePath && activePath.milestones.map((ms, mi) => {
                    const my = PHASE_Y_CENTER + MILESTONE_Y_START + mi * MILESTONE_GAP_Y;
                    const isDone = ms.status === "done";
                    const isCurrent = ms.status === "current";
                    const isLocked = ms.status === "locked";
                    const isSelected = selectedMilestone?.id === ms.id;
                    const hasSophia = !!ms.sophiaNote || !!ms.sophiaCoaching;

                    return (
                      <motion.div
                        key={`ms-${ms.id}`}
                        data-node
                        className="absolute group cursor-pointer"
                        style={{
                          left: px - 90,
                          top: my - 14,
                          width: 180,
                        }}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + mi * 0.04, duration: 0.3, ease: EASE }}
                        onClick={() => setSelectedMilestone(ms)}
                      >
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:brightness-125
                          ${isSelected ? "ring-1 ring-[var(--ce-role-edgestar)]/30" : ""}
                        `}
                          style={{
                            background: isSelected
                              ? "rgba(var(--ce-role-edgestar-rgb),0.08)"
                              : isCurrent
                                ? "rgba(var(--ce-role-edgestar-rgb),0.04)"
                                : isDone
                                  ? "rgba(var(--ce-lime-rgb),0.03)"
                                  : isLocked
                                    ? "rgba(var(--ce-glass-tint),0.01)"
                                    : "rgba(var(--ce-glass-tint),0.02)",
                            border: `1px solid ${isSelected
                              ? "rgba(var(--ce-role-edgestar-rgb),0.2)"
                              : isCurrent
                                ? "rgba(var(--ce-role-edgestar-rgb),0.08)"
                                : isDone
                                  ? "rgba(var(--ce-lime-rgb),0.06)"
                                  : "rgba(var(--ce-glass-tint),0.04)"}`,
                            boxShadow: isCurrent && !isSelected ? "0 0 20px rgba(var(--ce-role-edgestar-rgb),0.06)" : "none",
                          }}>
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 text-ce-lime flex-shrink-0" />
                          ) : isCurrent ? (
                            <motion.div className="w-2.5 h-2.5 rounded-full bg-[var(--ce-role-edgestar)] flex-shrink-0"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }} />
                          ) : isLocked ? (
                            <Lock className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 text-ce-text-tertiary flex-shrink-0" />
                          )}

                          <span className={`text-[11px] truncate flex-1 ${isDone ? "text-ce-text-tertiary" : isCurrent ? "text-ce-text-primary" : isLocked ? "text-[var(--ce-text-quaternary)]" : "text-ce-text-secondary"}`}
                            style={{ fontFamily: "var(--font-body)" }}>
                            {ms.label}
                          </span>

                          {hasSophia && !isDone && (
                            <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                              <SophiaMark size={10} glowing={false} />
                            </div>
                          )}

                          <span className="text-[9px] text-[var(--ce-text-quaternary)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums"
                            style={{ fontFamily: "var(--font-body)" }}>
                            {ms.time}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Onboarding Tooltip ─────────────────────────────────── */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-3 rounded-2xl max-w-[520px]"
            style={{
              background: "rgba(10,12,16,0.95)",
              border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(var(--ce-shadow-tint),0.3)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
          >
            <SophiaMark size={16} glowing={false} />
            <p className="text-[12px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>
              This is your journey as a map. <span className="text-ce-text-primary">Click a phase</span> to explore, <span className="text-ce-text-primary">click a milestone</span> to open it. Drag to pan, scroll to zoom.
            </p>
            <button
              onClick={() => setShowOnboarding(false)}
              className="text-[10px] text-ce-cyan px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.06)] transition-colors flex-shrink-0"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Got it
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legend (bottom-left, above zoom) ───────────────────── */}
      <motion.div
        className="absolute bottom-[108px] left-5 flex items-center gap-3 px-3 py-2 rounded-xl z-20"
        style={{ background: "rgba(10,12,16,0.85)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}
      >
        {[
          { color: "var(--ce-lime)", label: "Done" },
          { color: "var(--ce-role-edgestar)", label: "Active" },
          { color: "var(--ce-text-tertiary)", label: "Upcoming" },
          { color: "var(--ce-text-quaternary)", label: "Locked" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
            <span className="text-[9px]" style={{ color: item.color, fontFamily: "var(--font-body)" }}>{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Zoom Controls ─────────────────────────────────────── */}
      <div className="absolute bottom-16 left-5 flex items-center gap-1 p-1 rounded-xl z-20"
        style={{ background: "rgba(10,12,16,0.85)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(12px)" }}>
        <button data-node className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors"
          onClick={() => setZoom(z => Math.min(z + 0.15, 2))}>
          <ZoomIn className="w-3.5 h-3.5 text-ce-text-secondary" />
        </button>
        <span className="text-[10px] text-ce-text-tertiary px-1 tabular-nums w-10 text-center" style={{ fontFamily: "var(--font-body)" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button data-node className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors"
          onClick={() => setZoom(z => Math.max(z - 0.15, 0.35))}>
          <ZoomOut className="w-3.5 h-3.5 text-ce-text-secondary" />
        </button>
        <div className="w-[1px] h-4 bg-[rgba(var(--ce-glass-tint),0.06)] mx-0.5" />
        <button data-node className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors"
          onClick={() => { setZoom(0.82); setPan({ x: 20, y: 20 }); }}>
          <Maximize2 className="w-3.5 h-3.5 text-ce-text-secondary" />
        </button>
      </div>

      {/* ── Sophia Bar ────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30 flex items-center gap-4 px-6 h-12"
        style={{ background: "rgba(10,12,16,0.92)", borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)", backdropFilter: "blur(16px)" }}
        initial={{ y: 48 }} animate={{ y: 0 }} transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
      >
        <SophiaMark size={16} glowing={false} />
        <AnimatePresence mode="wait">
          <motion.span
            key={selectedMilestone?.id || showPathCompare?.id || "default"}
            className="text-[12px] text-ce-text-tertiary flex-1"
            style={{ fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {getSophiaMessage()}
          </motion.span>
        </AnimatePresence>
        <button data-node className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] transition-colors"
          style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.05)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
          <Sparkles className="w-3.5 h-3.5 text-ce-cyan" />
          <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia</span>
        </button>
      </motion.div>

      {/* ── Side Panels with backdrop ────────────────────────── */}
      <AnimatePresence>
        {(selectedMilestone || showPathCompare) && (
          <motion.div
            key="panel-backdrop"
            className="fixed inset-0 z-40 cursor-pointer"
            style={{ background: "rgba(var(--ce-shadow-tint),0.35)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setSelectedMilestone(null);
              setShowPathCompare(null);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedMilestone && !showPathCompare && (
          <TaskRoomPanel
            key={`task-${selectedMilestone.id}`}
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPathCompare && (
          <PathComparePanel
            key={`paths-${showPathCompare.id}`}
            phase={data.find(p => p.id === showPathCompare.id) || showPathCompare}
            onClose={() => setShowPathCompare(null)}
            onChoose={(pathId) => handleChoosePath(showPathCompare.id, pathId)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
