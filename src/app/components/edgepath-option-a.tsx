/**
 * EdgePath — Option A (H1): Two-Column with Persistent Sophia Panel
 * 
 * FULL E2E implementation:
 * - Empty state (Day 0): Sophia-guided creation flow with 2 inputs
 * - Loading state: Sequential phase fill-in animation
 * - Active state: Two-column with milestones left, Sophia right
 * - Phase completion celebration: Lime pulse, connection illuminate, Sophia pivot
 * - Stale return catch-up bar
 * - Multiple roadmaps selector with star toggle
 * - "Ahead of schedule" notification
 * - Sophia Float integration (Ask Sophia opens with context)
 * - View toggle: List ↔ Map
 */

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import { SophiaAsk } from "./sophia-ask";
import {
  Compass, ChevronRight, Check, Sparkles, ArrowUpRight,
  Clock, BookOpen, ExternalLink, MoreHorizontal, Star,
  ChevronDown, ChevronUp, Mic, Search, Zap,
  Target, TrendingUp, Users, Briefcase, GraduationCap,
  ArrowRight, FileText,
  List, Map, Lock, Trophy, Rocket, X, AlertCircle, Circle,
  ChevronLeft, Plus, Archive, RefreshCw, Download, Share2, Globe,
} from "lucide-react";
import { MindMapView } from "./edgepath-mindmap";
import { getRoleContext, type EdgePathRoleContext } from "./edgepath-context";
import { SharedTopNav } from "./role-shell";
import type { RoleId } from "./role-shell";
import { EASE } from "./tokens";

const SURFACE_ICONS: Record<string, any> = { file: FileText, briefcase: Briefcase, users: Users };

// ─── Types ──────────────────────────────────────────────────────────────────

type EdgePathState = "empty" | "loading" | "active";
type MilestoneStatus = "done" | "current" | "upcoming";

export interface Milestone {
  id: string;
  label: string;
  category: "skill" | "action" | "resource";
  status: MilestoneStatus;
  time: string;
  sophiaNote?: string;
  resources?: { label: string; type: string }[];
  actions?: string[];
  crossSurface?: { surface: string; note: string; icon: string }[];
}

export interface PhaseData {
  id: number;
  title: string;
  weeks: string;
  status: "complete" | "active" | "upcoming" | "locked";
  progress: number;
  milestonesDone: number;
  milestonesTotal: number;
}

/** Injectable data for role-specific EdgePath content. When provided,
 *  the component skips the empty/loading states and shows this data. */
export interface EdgePathData {
  /** Current role title, e.g. "Senior Manager". Shown as h1 left side. */
  roadmapTitle: string;
  /** Target role for career transitions, e.g. "Director". Renders as "Title → Target" in h1 and selector. */
  roadmapTarget?: string;
  /** Archetype name, e.g. "Executor-Builder". Renders as "Archetype: X · Assessment complete". */
  archetype?: string;
  /** Fallback metadata line when no archetype applies, e.g. "Very Active · Supporting Alex". */
  roadmapSubtitle?: string;
  phases: PhaseData[];
  /** Milestones per phase, keyed by phase.id */
  milestones: Record<number, Milestone[]>;
}

interface RoadmapData {
  id: string;
  title: string;
  /** Optional — omit for pre-seeded paths that don't use the "From → To" format */
  target?: string;
  archetype: string;
  assessmentComplete: boolean;
  isPrimary: boolean;
  /** Full override for the metadata line in the dropdown (e.g. "Involvement: Very Active") */
  metadataLine?: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const ROADMAPS: RoadmapData[] = [
  { id: "r1", title: "Revenue Ops Manager", target: "Product Designer", archetype: "Innovator-Strategist", assessmentComplete: true, isPrimary: true },
  { id: "r2", title: "Revenue Ops Manager", target: "Data Scientist", archetype: "", assessmentComplete: false, isPrimary: false },
  { id: "r3", title: "Previous Path", target: "UX Researcher", archetype: "Helper-Analyst", assessmentComplete: true, isPrimary: false },
];

const INITIAL_PHASES: PhaseData[] = [
  { id: 1, title: "Discover & Position", weeks: "Weeks 1–3", status: "complete", progress: 1.0, milestonesDone: 6, milestonesTotal: 6 },
  { id: 2, title: "Skill Bridge", weeks: "Weeks 4–8", status: "active", progress: 0.625, milestonesDone: 5, milestonesTotal: 8 },
  { id: 3, title: "Build & Ship", weeks: "Weeks 9–13", status: "upcoming", progress: 0, milestonesDone: 0, milestonesTotal: 7 },
  { id: 4, title: "Interview & Close", weeks: "Weeks 14–18", status: "locked", progress: 0, milestonesDone: 0, milestonesTotal: 5 },
];

const PHASE_2_MILESTONES: Milestone[] = [
  { id: "m1", label: "Complete Figma fundamentals course", category: "skill", status: "done", time: "8h" },
  { id: "m2", label: "Learn design system principles", category: "skill", status: "done", time: "6h" },
  { id: "m3", label: "Complete UX research foundations", category: "skill", status: "done", time: "10h" },
  { id: "m4", label: "Build first case study", category: "action", status: "done", time: "12h" },
  { id: "m5", label: "Get portfolio feedback from mentor", category: "action", status: "done", time: "2h" },
  {
    id: "m6", label: "Complete interaction design module", category: "skill", status: "current", time: "8h",
    sophiaNote: "Based on your saved jobs, 6 of 8 target companies list interaction design as required. Prioritize this over motion design.",
    resources: [
      { label: "Interaction Design Foundation", type: "course" },
      { label: "Microinteractions by Dan Saffer", type: "book" },
    ],
    actions: ["Start course", "Add to EdgeProd sprint"],
    crossSurface: [
      { surface: "ResumeEdge", note: "Resume needs update after this skill", icon: "file" },
      { surface: "EdgeMatch", note: "3 jobs require this skill", icon: "briefcase" },
      { surface: "Sessions", note: "Book a debrief with Alice — she specializes in interaction design milestones like this one.", icon: "users" },
    ],
  },
  {
    id: "m7", label: "Redesign a real product (case study #2)", category: "action", status: "upcoming", time: "15h",
    sophiaNote: "Pick a product you use daily. Recruiters value redesigns that show deep understanding over flashy visuals.",
  },
  { id: "m8", label: "Submit portfolio for ATS optimization", category: "resource", status: "upcoming", time: "1h" },
];

const CATEGORY_META = {
  skill: { label: "Skills to Build", icon: GraduationCap, color: "var(--ce-role-edgestar)" },
  action: { label: "Actions to Take", icon: Target, color: "var(--ce-lime)" },
  resource: { label: "Resources to Complete", icon: BookOpen, color: "var(--ce-text-secondary)" },
};

// ─── Empty State (Day 0) ────────────────────────────────────────────────────

function EmptyState({ role, onGenerate, onOpenSophia }: { role: RoleId; onGenerate: (current: string, target: string) => void; onOpenSophia: (msg: string) => void }) {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [focused, setFocused] = useState<"current" | "target" | null>(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative" style={{ backgroundColor: "var(--ce-void)" }}>
      <SophiaForwardBackground />
      <SharedTopNav role={role} onOpenSophia={onOpenSophia} />

      {/* Dot grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "radial-gradient(circle, rgba(var(--ce-glass-tint),0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <motion.div
        className="relative z-10 flex flex-col items-center max-w-[520px] w-full px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Sophia mark */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
        >
          <SophiaMark size={48} glowing />
        </motion.div>

        {/* Greeting */}
        <motion.h1
          className="text-[28px] text-ce-text-primary mb-2 text-center"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
        >
          Let's map your path.
        </motion.h1>

        <motion.p
          className="text-[14px] text-ce-text-tertiary mb-10 text-center"
          style={{ fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
        >
          Tell me where you are and where you want to go. I'll build a roadmap from what I already know about you.
        </motion.p>

        {/* Input fields */}
        <motion.div
          className="w-full flex flex-col gap-4 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
        >
          {/* Current role */}
          <div className="relative">
            <label className="text-[10px] text-[var(--ce-text-quaternary)] mb-1.5 block tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              WHERE YOU ARE NOW
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              onFocus={() => setFocused("current")}
              onBlur={() => setFocused(null)}
              placeholder="e.g. Revenue Ops Manager"
              className="w-full px-4 py-3.5 rounded-xl text-[14px] text-ce-text-primary placeholder-[var(--ce-text-quaternary)] outline-none transition-all duration-200"
              style={{
                fontFamily: "var(--font-body)",
                background: focused === "current" ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-glass-tint),0.025)",
                border: `1.5px solid ${focused === "current" ? "rgba(var(--ce-role-edgestar-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                boxShadow: focused === "current" ? "0 0 20px rgba(var(--ce-role-edgestar-rgb),0.06)" : "none",
              }}
            />
          </div>

          {/* Arrow connector */}
          <div className="flex justify-center">
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] rotate-90" />
            </motion.div>
          </div>

          {/* Target role */}
          <div className="relative">
            <label className="text-[10px] text-[var(--ce-text-quaternary)] mb-1.5 block tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              WHERE YOU WANT TO GO
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              onFocus={() => setFocused("target")}
              onBlur={() => setFocused(null)}
              placeholder="e.g. Product Designer"
              className="w-full px-4 py-3.5 rounded-xl text-[14px] text-ce-text-primary placeholder-[var(--ce-text-quaternary)] outline-none transition-all duration-200"
              style={{
                fontFamily: "var(--font-body)",
                background: focused === "target" ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-glass-tint),0.025)",
                border: `1.5px solid ${focused === "target" ? "rgba(var(--ce-lime-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                boxShadow: focused === "target" ? "0 0 20px rgba(var(--ce-lime-rgb),0.06)" : "none",
              }}
            />
          </div>
        </motion.div>

        {/* Generate CTA */}
        <motion.button
          className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl cursor-pointer text-[15px] transition-all duration-300"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            background: currentRole && targetRole
              ? "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.12), rgba(var(--ce-lime-rgb),0.08))"
              : "rgba(var(--ce-glass-tint),0.02)",
            border: `1.5px solid ${currentRole && targetRole ? "rgba(var(--ce-role-edgestar-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.04)"}`,
            color: currentRole && targetRole ? "var(--ce-text-primary)" : "var(--ce-text-quaternary)",
            boxShadow: currentRole && targetRole ? "0 0 30px rgba(var(--ce-role-edgestar-rgb),0.08)" : "none",
          }}
          onClick={() => currentRole && targetRole && onGenerate(currentRole, targetRole)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4, ease: EASE }}
          whileHover={currentRole && targetRole ? { scale: 1.01 } : {}}
          whileTap={currentRole && targetRole ? { scale: 0.99 } : {}}
        >
          <Compass className="w-4.5 h-4.5" style={{ color: currentRole && targetRole ? "var(--ce-role-edgestar)" : "var(--ce-text-quaternary)" }} />
          Generate Roadmap
        </motion.button>

        {/* Sophia sub-note */}
        <motion.p
          className="text-[11px] text-[var(--ce-text-quaternary)] mt-4 text-center"
          style={{ fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          I already know your experience and goals from onboarding. This gets you started — you can refine later.
        </motion.p>
      </motion.div>
    </div>
  );
}

// ─── Loading State ──────────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  "Analyzing your career gap...",
  "Mapping 400+ skill pathways...",
  "Building your personalized phases...",
  "Identifying quick wins...",
];

function LoadingState({ role, currentRole, targetRole, onComplete, onOpenSophia }: { role: RoleId; currentRole: string; targetRole: string; onComplete: () => void; onOpenSophia: (msg: string) => void }) {
  const [visiblePhases, setVisiblePhases] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(0);

  useEffect(() => {
    // Cycle loading messages
    const msgTimer = setInterval(() => {
      setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length);
    }, 1200);

    // Phase fill-in sequence
    const delays = [800, 1800, 2800, 3800];
    const timers = delays.map((d, i) => setTimeout(() => setVisiblePhases(i + 1), d));

    // Complete after all phases
    const done = setTimeout(onComplete, 5000);

    return () => {
      clearInterval(msgTimer);
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative" style={{ backgroundColor: "var(--ce-void)" }}>
      <SophiaForwardBackground />
      <SharedTopNav role={role} onOpenSophia={onOpenSophia} />

      <motion.div
        className="relative z-10 flex flex-col items-center max-w-[640px] w-full px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* Sophia mark with pulse */}
        <motion.div className="mb-6">
          <SophiaMark size={40} glowing />
        </motion.div>

        {/* Roadmap title */}
        <motion.h2
          className="text-[20px] text-ce-text-primary mb-2 text-center"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
        >
          {currentRole} <span className="text-[var(--ce-text-quaternary)] mx-2">→</span> {targetRole}
        </motion.h2>

        {/* Loading message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingMsg}
            className="text-[13px] text-ce-cyan mb-10 text-center"
            style={{ fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {LOADING_MESSAGES[loadingMsg]}
          </motion.p>
        </AnimatePresence>

        {/* Phase skeleton strip */}
        <div className="w-full flex items-center gap-0 mb-8">
          {INITIAL_PHASES.map((phase, i) => {
            const revealed = i < visiblePhases;
            return (
              <div key={phase.id} className="flex items-center flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    {/* Phase node */}
                    <motion.div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: revealed ? "rgba(var(--ce-role-edgestar-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.02)",
                        border: `2px solid ${revealed ? "rgba(var(--ce-role-edgestar-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.04)"}`,
                      }}
                      initial={false}
                      animate={{
                        scale: revealed ? [1, 1.15, 1] : 1,
                        borderColor: revealed ? "rgba(var(--ce-role-edgestar-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.04)",
                      }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {revealed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <Check className="w-3 h-3 text-ce-cyan" />
                        </motion.div>
                      ) : (
                        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }} />
                      )}
                    </motion.div>

                    {/* Phase info */}
                    <div className="min-w-0">
                      <motion.span
                        className="text-[12px] block truncate"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                          color: revealed ? "var(--ce-text-primary)" : "var(--ce-text-ghost)",
                        }}
                        animate={{ color: revealed ? "var(--ce-text-primary)" : "var(--ce-text-ghost)" }}
                        transition={{ duration: 0.4 }}
                      >
                        {phase.title}
                      </motion.span>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{phase.weeks}</span>
                    </div>
                  </div>

                  {/* Progress bar skeleton */}
                  <div className="h-1 rounded-full overflow-hidden ml-10" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
                    {revealed && (
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, var(--ce-role-edgestar), rgba(var(--ce-role-edgestar-rgb),0.3))" }}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                    )}
                  </div>
                </div>

                {i < INITIAL_PHASES.length - 1 && (
                  <div className="w-6 h-[2px] mx-1 flex-shrink-0 mt-[-12px]" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--ce-role-edgestar), var(--ce-lime))" }}
              initial={{ width: "0%" }}
              animate={{ width: `${(visiblePhases / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          <span className="text-[11px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
            {visiblePhases}/4 phases
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Stale Return Bar ───────────────────────────────────────────────────────

function StaleReturnBar({ daysSince, onDismiss }: { daysSince: number; onDismiss: () => void }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-5 py-3 rounded-xl mb-4"
      style={{
        background: "linear-gradient(135deg, rgba(var(--ce-role-edgepreneur-rgb),0.06), rgba(var(--ce-glass-tint),0.02))",
        border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.1)",
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <SophiaMark size={16} glowing={false} />
      <span className="text-[12px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>
        It's been <span className="text-[var(--ce-role-edgepreneur)]">{daysSince} days</span>. Your Phase 2 deadline is in 5 days. 3 things changed since your last visit.
      </span>
      <button
        className="text-[11px] text-[var(--ce-role-edgepreneur)] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-edgepreneur-rgb),0.08)] transition-colors flex-shrink-0"
        style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.1)", fontFamily: "var(--font-body)" }}
      >
        See what changed
      </button>
      <button onClick={onDismiss} className="cursor-pointer flex-shrink-0 hover:bg-[rgba(var(--ce-glass-tint),0.04)] rounded-md p-1 transition-colors">
        <X className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
      </button>
    </motion.div>
  );
}

// ─── Ahead of Schedule Banner ───────────────────────────────────────────────

function AheadOfScheduleBanner() {
  return (
    <motion.div
      className="flex items-center gap-3 px-5 py-3 rounded-xl mb-4"
      style={{
        background: "linear-gradient(135deg, rgba(var(--ce-lime-rgb),0.04), rgba(var(--ce-role-edgestar-rgb),0.03))",
        border: "1px solid rgba(var(--ce-lime-rgb),0.08)",
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <Rocket className="w-4 h-4 text-ce-lime flex-shrink-0" />
      <span className="text-[12px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>
        You're <span className="text-ce-lime">2 weeks ahead of schedule</span>. At this pace, you'll complete Phase 2 by April 12 — a month earlier than planned.
      </span>
    </motion.div>
  );
}

// ─── Phase Completion Celebration ───────────────────────────────────────────

function PhaseCompletionCelebration({ phaseTitle, nextPhaseTitle, onDismiss }: {
  phaseTitle: string;
  nextPhaseTitle: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />

      {/* Celebration card */}
      <motion.div
        className="relative z-10 max-w-[440px] w-full mx-6 rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(var(--ce-lime-rgb),0.06), rgba(8,9,12,0.95) 40%, rgba(var(--ce-role-edgestar-rgb),0.04))",
          border: "1px solid rgba(var(--ce-lime-rgb),0.12)",
          boxShadow: "0 0 60px rgba(var(--ce-lime-rgb),0.08), 0 0 120px rgba(var(--ce-role-edgestar-rgb),0.04)",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Radial pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ border: "2px solid rgba(var(--ce-lime-rgb),0.15)" }}
          animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Trophy */}
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, rgba(var(--ce-lime-rgb),0.12), rgba(var(--ce-lime-rgb),0.04))", border: "1px solid rgba(var(--ce-lime-rgb),0.15)" }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
        >
          <Trophy className="w-7 h-7 text-ce-lime" />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-[22px] text-ce-text-primary mb-2"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {phaseTitle} complete
        </motion.h2>

        {/* Sophia message */}
        <motion.div
          className="flex items-start gap-2.5 text-left mt-5 px-4 py-3.5 rounded-xl"
          style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <SophiaMark size={16} glowing={false} />
          <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {nextPhaseTitle} focuses on applying your skills. Your resume is optimized for this phase — let's start building your portfolio and applying.
            <span className="text-ce-cyan"> I've found 8 matching positions.</span>
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex justify-center gap-6 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {[
            { label: "Milestones", value: "8/8", color: "var(--ce-lime)" },
            { label: "Time", value: "34h", color: "var(--ce-role-edgestar)" },
            { label: "Ahead by", value: "2 wks", color: "var(--ce-lime)" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-[18px] tabular-nums block" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{stat.value}</span>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer text-[13px] hover:brightness-110 transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.1), rgba(var(--ce-lime-rgb),0.06))",
            border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
            color: "var(--ce-text-primary)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <ArrowRight className="w-4 h-4 text-ce-cyan" />
          Continue to {nextPhaseTitle}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Multiple Roadmaps Selector ─────────────────────────────────────────────

function RoadmapSelector({ roadmaps, activeId, onSelect, onTogglePrimary, onCreateNew }: {
  roadmaps: RoadmapData[];
  activeId: string;
  onSelect: (id: string) => void;
  onTogglePrimary: (id: string) => void;
  /** Triggered by "Create new roadmap" — caller decides whether to show empty state or open Sophia */
  onCreateNew?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = roadmaps.find((r) => r.id === activeId)!;

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        onClick={() => setOpen(!open)}
      >
        <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
          {active.title}{active.target ? ` → ${active.target}` : ""}
        </span>
        {active.isPrimary && <Star className="w-3 h-3 text-ce-lime fill-[var(--ce-lime)]" />}
        <ChevronDown className={`w-3 h-3 text-[var(--ce-text-quaternary)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute top-full left-0 mt-2 w-[320px] rounded-xl z-50 overflow-hidden"
              style={{
                background: "rgba(12,14,18,0.98)",
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                boxShadow: "0 16px 48px rgba(var(--ce-shadow-tint),0.5)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div className="p-1.5">
                {roadmaps.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors"
                    onClick={() => { onSelect(r.id); setOpen(false); }}
                  >
                    <button
                      className="flex-shrink-0 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); onTogglePrimary(r.id); }}
                    >
                      <Star
                        className={`w-3.5 h-3.5 transition-colors ${r.isPrimary ? "text-ce-lime fill-[var(--ce-lime)]" : "text-[var(--ce-text-quaternary)]"}`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[12px] block truncate ${r.id === activeId ? "text-ce-text-primary" : "text-ce-text-secondary"}`}
                        style={{ fontFamily: "var(--font-body)" }}>
                        {r.title}{r.target ? ` → ${r.target}` : ""}
                      </span>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                        {r.metadataLine ?? (r.assessmentComplete ? `Archetype: ${r.archetype}` : "Assessment incomplete")}
                        {r.isPrimary && " · Primary"}
                      </span>
                    </div>
                    {r.id === activeId && <Check className="w-3.5 h-3.5 text-ce-cyan flex-shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <button
                  className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-[11px] text-ce-text-tertiary cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                  onClick={() => { setOpen(false); onCreateNew?.(); }}
                >
                  <Plus className="w-3 h-3" /> Create new roadmap
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Overflow Menu ──────────────────────────────────────────────────────────

function OverflowMenu() {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: Download, label: "Export as PDF", color: "var(--ce-text-secondary)" },
    { icon: Share2, label: "Share your insight", color: "var(--ce-text-secondary)" },
    { icon: RefreshCw, label: "Regenerate roadmap", color: "var(--ce-role-edgepreneur)" },
    { icon: Archive, label: "Archive roadmap", color: "var(--ce-text-tertiary)" },
  ];

  return (
    <div className="relative">
      <button
        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
        style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal className="w-4 h-4 text-ce-text-tertiary" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute top-full right-0 mt-2 w-[200px] rounded-xl z-50 overflow-hidden p-1.5"
              style={{
                background: "rgba(12,14,18,0.98)",
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                boxShadow: "0 16px 48px rgba(var(--ce-shadow-tint),0.5)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors"
                    style={{ color: item.color, fontFamily: "var(--font-body)" }}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-3.5 h-3.5" /> {item.label}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─���─ Phase Strip ────────────────────────────────────────────────────────────

function PhaseStrip({ phases, activePhase, onPhaseClick, celebratingPhase }: {
  phases: PhaseData[];
  activePhase: number;
  onPhaseClick: (id: number) => void;
  celebratingPhase: number | null;
}) {
  return (
    <motion.div
      className="rounded-2xl p-5"
      style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center gap-0">
        {phases.map((phase, i) => {
          const isActive = phase.id === activePhase;
          const isComplete = phase.status === "complete";
          const isLocked = phase.status === "locked";
          const isCelebrating = phase.id === celebratingPhase;

          return (
            <div key={phase.id} className="flex items-center flex-1">
              <button
                className="flex-1 group cursor-pointer"
                onClick={() => {
                  if (isLocked) return;
                  onPhaseClick(phase.id);
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {/* Node */}
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 relative"
                    style={{
                      background: isComplete || isCelebrating
                        ? "rgba(var(--ce-lime-rgb),0.12)"
                        : isActive
                          ? "rgba(var(--ce-role-edgestar-rgb),0.1)"
                          : "rgba(var(--ce-glass-tint),0.03)",
                      border: `2px solid ${isComplete || isCelebrating
                        ? "rgba(var(--ce-lime-rgb),0.3)"
                        : isActive
                          ? "var(--ce-role-edgestar)"
                          : isLocked
                            ? "rgba(var(--ce-glass-tint),0.04)"
                            : "rgba(var(--ce-glass-tint),0.06)"
                        }`,
                      boxShadow: isCelebrating
                        ? "0 0 24px rgba(var(--ce-lime-rgb),0.3)"
                        : isActive
                          ? "0 0 16px rgba(var(--ce-role-edgestar-rgb),0.15)"
                          : "none",
                    }}
                    animate={isCelebrating ? {
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 24px rgba(var(--ce-lime-rgb),0.3)",
                        "0 0 40px rgba(var(--ce-lime-rgb),0.5)",
                        "0 0 24px rgba(var(--ce-lime-rgb),0.3)",
                      ],
                    } : {}}
                    transition={isCelebrating ? { duration: 1, repeat: 2, ease: "easeInOut" } : {}}
                  >
                    {isComplete || isCelebrating ? (
                      <Check className="w-3.5 h-3.5 text-ce-lime" />
                    ) : isActive ? (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[var(--ce-role-edgestar)]"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3 text-[var(--ce-text-ghost)]" />
                    ) : (
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{phase.id}</span>
                    )}
                  </motion.div>

                  <div className="min-w-0">
                    <span
                      className={`text-[13px] block truncate ${isActive ? "text-ce-text-primary" : isComplete ? "text-ce-text-secondary" : isLocked ? "text-[var(--ce-text-ghost)]" : "text-ce-text-tertiary"}`}
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {phase.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{phase.weeks}</span>
                      {isComplete && (
                        <span className="text-[9px] text-ce-lime px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-lime-rgb),0.06)" }}>Complete</span>
                      )}
                      {isActive && (
                        <span className="text-[9px] text-ce-cyan tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                          {phase.milestonesDone}/{phase.milestonesTotal}
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[9px] text-[var(--ce-text-ghost)]" style={{ fontFamily: "var(--font-body)" }}>Locked</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full overflow-hidden ml-11" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                  {(isComplete || isActive) && (
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: isComplete
                          ? "linear-gradient(90deg, var(--ce-lime), rgba(var(--ce-lime-rgb),0.4))"
                          : "linear-gradient(90deg, var(--ce-role-edgestar), rgba(var(--ce-role-edgestar-rgb),0.3))",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.progress * 100}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: EASE }}
                    />
                  )}
                </div>
              </button>

              {/* Connector line */}
              {i < phases.length - 1 && (
                <motion.div
                  className="w-8 h-[2px] mx-1 flex-shrink-0 mt-[-12px]"
                  style={{
                    background: isComplete
                      ? "linear-gradient(90deg, rgba(var(--ce-lime-rgb),0.2), rgba(var(--ce-glass-tint),0.06))"
                      : "rgba(var(--ce-glass-tint),0.04)",
                  }}
                  animate={isCelebrating ? {
                    background: [
                      "rgba(var(--ce-glass-tint),0.04)",
                      "linear-gradient(90deg, rgba(var(--ce-lime-rgb),0.3), rgba(var(--ce-role-edgestar-rgb),0.2))",
                      "linear-gradient(90deg, rgba(var(--ce-lime-rgb),0.2), rgba(var(--ce-glass-tint),0.06))",
                    ],
                  } : {}}
                  transition={isCelebrating ? { duration: 1.5, ease: "easeInOut" } : {}}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Sophia Commentary Strip ────────────────────────────────────────────────

function SophiaCommentary({ message, accentText }: { message: string; accentText?: string }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.04), rgba(var(--ce-glass-tint),0.015))",
        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
    >
      <SophiaMark size={16} glowing={false} />
      <span className="text-[12px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>
        {message}
        {accentText && <span className="text-ce-cyan ml-1">{accentText}</span>}
      </span>
    </motion.div>
  );
}

// ─── Milestone Item ─────────────────────────────────────────────────────────

function MilestoneItem({ milestone, index, onCheck, onOpenRoom, onNavigate }: { milestone: Milestone; index: number; onCheck?: (id: string) => void; onOpenRoom?: (id: string) => void; onNavigate?: (target: string) => void }) {
  const [expanded, setExpanded] = useState(milestone.status === "current");
  const [checked, setChecked] = useState(milestone.status === "done");
  const [justChecked, setJustChecked] = useState(false);

  const categoryMeta = CATEGORY_META[milestone.category];

  const handleCheck = () => {
    if (!checked && milestone.status !== "upcoming") {
      setChecked(true);
      setJustChecked(true);
      setExpanded(false);
      onCheck?.(milestone.id);
      setTimeout(() => setJustChecked(false), 1000);
    }
  };

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.05, duration: 0.3, ease: EASE }}
    >
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          background: expanded ? "rgba(var(--ce-glass-tint),0.03)" : "transparent",
          border: expanded ? "1px solid rgba(var(--ce-glass-tint),0.06)" : "1px solid transparent",
        }}
        onClick={() => milestone.status !== "done" && !checked && setExpanded(!expanded)}
      >
        {/* Checkbox */}
        <button
          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 cursor-pointer"
          style={{
            background: checked ? "rgba(var(--ce-lime-rgb),0.15)" : "transparent",
            border: `1.5px solid ${checked ? "var(--ce-lime)" : milestone.status === "current" ? "var(--ce-role-edgestar)" : "rgba(var(--ce-glass-tint),0.1)"}`,
            boxShadow: justChecked ? "0 0 12px rgba(var(--ce-lime-rgb),0.3)" : "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCheck();
          }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Check className="w-3 h-3 text-ce-lime" />
            </motion.div>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[13px] transition-all duration-300 ${checked ? "text-ce-text-tertiary line-through" : milestone.status === "current" ? "text-ce-text-primary" : "text-ce-text-secondary"}`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {milestone.label}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-[var(--ce-text-quaternary)]">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{milestone.time}</span>
              </div>
              {!checked && (
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                  className="cursor-pointer"
                >
                  {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />}
                </button>
              )}
            </div>
          </div>

          {/* Current indicator */}
          {milestone.status === "current" && !checked && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)]" style={{ boxShadow: "0 0 6px rgba(var(--ce-role-edgestar-rgb),0.4)" }} />
              <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Up next</span>
            </div>
          )}

          {/* Expanded detail */}
          <AnimatePresence>
            {expanded && !checked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {milestone.sophiaNote && (
                  <div className="mt-3 flex gap-2 px-3 py-2.5 rounded-lg" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
                    <SophiaMark size={14} glowing={false} />
                    <p className="text-[11px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                      {milestone.sophiaNote}
                    </p>
                  </div>
                )}

                {milestone.resources && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {milestone.resources.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors">
                        <BookOpen className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                        <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{r.label}</span>
                        <span className="text-[9px] text-[var(--ce-text-quaternary)] px-1.5 py-0.5 rounded" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>{r.type}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[var(--ce-text-quaternary)] ml-auto" />
                      </div>
                    ))}
                  </div>
                )}

                {milestone.crossSurface && (
                  <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
                    <span className="text-[9px] text-[var(--ce-text-quaternary)] mb-1.5 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Connected surfaces</span>
                    <div className="flex flex-col gap-1">
                      {milestone.crossSurface.map((cs, i) => {
                        const SIcon = SURFACE_ICONS[cs.icon] || FileText;
                        const isSessionsChip = cs.surface === "Sessions";
                        return (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors"
                            onClick={(e) => { if (isSessionsChip && onNavigate) { e.stopPropagation(); onNavigate("sessions"); } }}>
                            <SIcon className="w-3 h-3 text-ce-cyan" />
                            <span className="text-[10px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>{cs.surface}: {cs.note}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-[var(--ce-text-quaternary)]" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {milestone.actions && (
                  <div className="mt-2.5 flex gap-2">
                    {milestone.actions.map((a, i) => (
                      <button
                        key={i}
                        className="text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                        style={{
                          background: i === 0 ? "rgba(var(--ce-role-edgestar-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.03)",
                          border: `1px solid ${i === 0 ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)"}`,
                          color: i === 0 ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)",
                          fontFamily: "var(--font-body)",
                        }}
                        onClick={(e) => { e.stopPropagation(); if (i === 0 && onOpenRoom) onOpenRoom(milestone.id); }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Phase Detail (Left Column) ─────────────────────────────────────────────

function PhaseDetail({ milestones, onMilestoneCheck, onOpenRoom, onNavigate }: { milestones: Milestone[]; onMilestoneCheck: (id: string) => void; onOpenRoom?: (id: string) => void; onNavigate?: (target: string) => void }) {
  const categories = ["skill", "action", "resource"] as const;

  return (
    <div className="flex flex-col gap-5">
      {categories.map((cat) => {
        const catMilestones = milestones.filter((m) => m.category === cat);
        if (catMilestones.length === 0) return null;
        const meta = CATEGORY_META[cat];
        const Icon = meta.icon;
        const doneCount = catMilestones.filter((m) => m.status === "done").length;

        return (
          <motion.div
            key={cat}
            className="rounded-xl"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
              <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
              <span className="text-[12px]" style={{ color: meta.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{meta.label}</span>
              <span className="text-[10px] text-[var(--ce-text-quaternary)] ml-auto tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                {doneCount}/{catMilestones.length}
              </span>
            </div>
            <div className="p-1">
              {catMilestones.map((m, i) => (
                <MilestoneItem key={m.id} milestone={m} index={i} onCheck={onMilestoneCheck} onOpenRoom={onOpenRoom} onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Sophia Panel (Right Column) ────────────────────────────────────────────

function SophiaPanel({ onAskSophia, roleContext, onNavigate }: { onAskSophia: (query: string) => void; roleContext?: EdgePathRoleContext; onNavigate?: (target: string) => void }) {
  const panel = roleContext?.sophiaPanel;

  if (panel) {
    return (
      <div className="flex flex-col gap-4">
        {/* Sophia Insight */}
        <motion.div
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.05), rgba(var(--ce-glass-tint),0.02) 50%, rgba(var(--ce-lime-rgb),0.02))",
            border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center gap-2 mb-3">
            <SophiaMark size={18} glowing={false} />
            <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
          </div>
          <p className="text-[13px] text-ce-text-secondary leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
            {panel.sophiaInsight.message}
          </p>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px] hover:brightness-110 transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.1), rgba(var(--ce-lime-rgb),0.05))",
              border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
              color: "var(--ce-text-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
            }}
            onClick={() => onAskSophia(panel.sophiaInsight.actionQuery)}
          >
            <Sparkles className="w-3.5 h-3.5 text-ce-cyan" /> {panel.sophiaInsight.actionLabel}
          </button>
        </motion.div>

        {/* Skill Progress — only if provided */}
        {panel.skillProgress && (
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-ce-cyan" />
              <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Skill Progress</span>
            </div>
            {panel.skillProgress.map((s, i) => (
              <div key={i} className="mb-2.5 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{s.skill}</span>
                  <span className="text-[10px] tabular-nums" style={{ color: s.color, fontFamily: "var(--font-body)" }}>{s.pct}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ delay: 1.0 + i * 0.1, duration: 0.6, ease: EASE }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quick Wins */}
        <motion.div
          className="rounded-xl p-4"
          style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-[var(--ce-role-edgepreneur)]" />
            <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Quick Wins</span>
            <span className="text-[9px] text-[var(--ce-role-edgepreneur)] px-1.5 py-0.5 rounded-full ml-auto" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.06)" }}>
              {panel.quickWins.length} available
            </span>
          </div>
          {panel.quickWins.map((qw, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-md px-2 transition-colors">
              <Circle className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              <span className="text-[11px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>{qw.label}</span>
              <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{qw.time}</span>
            </div>
          ))}
        </motion.div>

        {/* Job Matches — rendered when showJobMatches: true and jobs data provided */}
        {panel.showJobMatches && panel.jobs && panel.jobs.length > 0 && (
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-ce-lime" />
              <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Phase Job Matches</span>
            </div>
            {panel.jobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 py-2" style={{ borderTop: i > 0 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.company}</span>
                </div>
                <span className="text-[10px] text-ce-lime px-2 py-0.5 rounded-full tabular-nums" style={{ background: "rgba(var(--ce-lime-rgb),0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {job.match}%
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Mentor Connection — rendered when showMentor: true and mentor data provided */}
        {panel.showMentor && panel.mentor && (
          <motion.div
            className="rounded-xl p-4"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.15), rgba(var(--ce-lime-rgb),0.1))", border: "1.5px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <span className="text-[11px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{panel.mentor.initial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{panel.mentor.name}</span>
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{panel.mentor.role} · Next session {panel.mentor.nextSession}</span>
              </div>
            </div>
            <p className="text-[11px] text-ce-text-tertiary mt-2 italic" style={{ fontFamily: "var(--font-body)" }}>
              "{panel.mentor.quote}"
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  // Default EdgeStar content
  return (
    <div className="flex flex-col gap-4">
      {/* Sophia Insight Card */}
      <motion.div
        className="rounded-xl p-5"
        style={{
          background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.05), rgba(var(--ce-glass-tint),0.02) 50%, rgba(var(--ce-lime-rgb),0.02))",
          border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-2 mb-3">
          <SophiaMark size={18} glowing={false} />
          <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
          <span className="text-[9px] text-[var(--ce-text-quaternary)] ml-auto" style={{ fontFamily: "var(--font-body)" }}>2 min ago</span>
        </div>
        <p className="text-[13px] text-ce-text-secondary leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
          Your interaction design module is the highest-leverage milestone right now. 6 of your 8 target companies list it as required. Complete this before case study #2.
        </p>
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px] hover:brightness-110 transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.1), rgba(var(--ce-lime-rgb),0.05))",
            border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
            color: "var(--ce-text-primary)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
          onClick={() => onAskSophia("Help me start the interaction design module")}
        >
          <Sparkles className="w-3.5 h-3.5 text-ce-cyan" /> Start interaction design
        </button>
      </motion.div>

      {/* Job Matches */}
      <motion.div
        className="rounded-xl p-4"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-3.5 h-3.5 text-ce-lime" />
          <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Phase 2 Job Matches</span>
        </div>
        <p className="text-[11px] text-ce-text-tertiary mb-3" style={{ fontFamily: "var(--font-body)" }}>
          4 jobs match your Phase 2 skills. 2 posted this week.
        </p>
        {[
          { title: "Product Designer", company: "Figma", match: 92 },
          { title: "UX Designer", company: "Linear", match: 87 },
        ].map((job, i) => (
          <div key={i} className="flex items-center gap-3 py-2" style={{ borderTop: i > 0 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
            <div className="flex-1 min-w-0">
              <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
              <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.company}</span>
            </div>
            <span className="text-[10px] text-ce-lime px-2 py-0.5 rounded-full tabular-nums" style={{ background: "rgba(var(--ce-lime-rgb),0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {job.match}%
            </span>
          </div>
        ))}
        <button className="text-[11px] text-ce-text-tertiary hover:text-ce-text-secondary mt-2 cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
          View all 4 matches →
        </button>
      </motion.div>

      {/* Skills Progress */}
      <motion.div
        className="rounded-xl p-4"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-ce-cyan" />
          <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Skill Progress</span>
        </div>
        {[
          { skill: "Figma", pct: 85, color: "var(--ce-lime)" },
          { skill: "UX Research", pct: 70, color: "var(--ce-role-edgestar)" },
          { skill: "Interaction Design", pct: 15, color: "var(--ce-role-edgestar)" },
          { skill: "Design Systems", pct: 45, color: "var(--ce-text-secondary)" },
        ].map((s, i) => (
          <div key={i} className="mb-2.5 last:mb-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{s.skill}</span>
              <span className="text-[10px] tabular-nums" style={{ color: s.color, fontFamily: "var(--font-body)" }}>{s.pct}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.6, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Wins */}
      <motion.div
        className="rounded-xl p-4"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-[var(--ce-role-edgepreneur)]" />
          <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Quick Wins</span>
          <span className="text-[9px] text-[var(--ce-role-edgepreneur)] px-1.5 py-0.5 rounded-full ml-auto" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.06)" }}>3 available</span>
        </div>
        {[
          { label: "Update LinkedIn headline", time: "5 min" },
          { label: "Add design tools to profile", time: "3 min" },
          { label: "Follow 5 design leaders", time: "10 min" },
        ].map((qw, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-md px-2 transition-colors">
            <Circle className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
            <span className="text-[11px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>{qw.label}</span>
            <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{qw.time}</span>
          </div>
        ))}
      </motion.div>

      {/* Mentor Connection */}
      <motion.div
        className="rounded-xl p-4"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.15), rgba(var(--ce-lime-rgb),0.1))", border: "1.5px solid rgba(var(--ce-glass-tint),0.08)" }}>
            <span className="text-[11px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>A</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>Alice Chen</span>
            <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Your EdgeGuide · Next session Friday</span>
          </div>
        </div>
        <p className="text-[11px] text-ce-text-tertiary mt-2 italic" style={{ fontFamily: "var(--font-body)" }}>
          "Focus on one strong case study over two mediocre ones."
        </p>
      </motion.div>

      {/* Global Career Mobility — cross-link to ImmigrationEdge */}
      <motion.div
        className="rounded-xl p-4 cursor-pointer group"
        style={{ background: "rgba(234,179,8,0.03)", border: "1px solid rgba(234,179,8,0.08)" }}
        onClick={() => onNavigate?.("immigration")}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.4, ease: EASE }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(234,179,8,0.08)" }}>
            <Globe className="w-4 h-4" style={{ color: "rgb(234,179,8)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Global Career Mobility</span>
            <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>See how your credentials transfer internationally</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-ce-text-quaternary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sophia Bottom Bar ──────────────────────────────────────────────────────

function SophiaBottomBar({ message, chips, onAskSophia }: {
  message: string;
  chips: string[];
  onAskSophia: (query?: string) => void;
}) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-4 px-6 h-14"
      style={{
        background: "rgba(10,12,16,0.92)",
        borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)",
        backdropFilter: "blur(16px)",
      }}
      initial={{ y: 56 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
    >
      <SophiaMark size={18} glowing={false} />
      <div className="flex-1 flex items-center gap-3">
        <span className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          {message}
        </span>
        <div className="flex gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              className="text-[11px] text-ce-text-secondary px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
              style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}
              onClick={() => onAskSophia(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] transition-colors"
        style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}
        onClick={() => onAskSophia()}
      >
        <Sparkles className="w-3.5 h-3.5 text-ce-cyan" />
        <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia</span>
      </button>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function EdgePathOptionA({ role = "edgestar", data, embedded = false, onOpenTaskRoom, onNavigate, headerExtra }: { role?: string; data?: EdgePathData; embedded?: boolean; onOpenTaskRoom?: (milestoneId: string) => void; onNavigate?: (target: string) => void; headerExtra?: ReactNode } = {}) {
  // ─── Role Context ───────────────────────────────────────────────────────
  const roleContext = getRoleContext(role);

  // ─── State ──────────────────────────────────────────────────────────────
  const [edgePathState, setEdgePathState] = useState<EdgePathState>(data ? "active" : "active");
  const initialActivePhase = data?.phases?.find(p => p.status === "active")?.id ?? 2;
  const [activePhase, setActivePhase] = useState(initialActivePhase);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [phases, setPhases] = useState<PhaseData[]>(data?.phases ?? INITIAL_PHASES);
  const [milestones, setMilestones] = useState<Milestone[]>(
    data ? (data.milestones[initialActivePhase] ?? []) : PHASE_2_MILESTONES
  );
  const [showStaleBar, setShowStaleBar] = useState(true);
  const [showAheadBanner, setShowAheadBanner] = useState(true);
  const [celebratingPhase, setCelebratingPhase] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedPhaseTitle, setCompletedPhaseTitle] = useState("");

  // Sophia state
  const [sophiaOpen, setSophiaOpen] = useState(false);
  const [sophiaInitialMessage, setSophiaInitialMessage] = useState<string | null>(null);

  // Commentary state
  const [commentaryMsg, setCommentaryMsg] = useState(roleContext.sophiaActiveDefault);
  const [commentaryAccent, setCommentaryAccent] = useState<string | undefined>(undefined);

  // Sophia bar state
  const [barMessage, setBarMessage] = useState(roleContext.sophiaActiveDefault);
  const [barChips, setBarChips] = useState(["Quick wins", "What's next?"]);

  // Roadmap selector — seed from injected data so the selector reflects the actual path title.
  // When the user creates additional roadmaps (via "Create new roadmap"), they are appended here.
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>(
    data
      ? [{ id: "r-data", title: data.roadmapTitle, target: data.roadmapTarget, archetype: data.archetype ?? "", assessmentComplete: !!data.archetype, isPrimary: true, metadataLine: data.archetype ? undefined : data.roadmapSubtitle }]
      : ROADMAPS
  );
  const [activeRoadmapId, setActiveRoadmapId] = useState(data ? "r-data" : "r1");

  // Loading state
  const [loadingCurrentRole, setLoadingCurrentRole] = useState("");
  const [loadingTargetRole, setLoadingTargetRole] = useState("");

  // ─── Handlers ─────────────────────────────────────────────────────────

  const handleGenerate = useCallback((current: string, target: string) => {
    setLoadingCurrentRole(current);
    setLoadingTargetRole(target);
    setEdgePathState("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setEdgePathState("active");
  }, []);

  const handleMilestoneCheck = useCallback((id: string) => {
    const activePhaseTitle = phases.find(p => p.id === activePhase)?.title ?? `Phase ${activePhase}`;
    const nextPhaseTitle = phases.find(p => p.id === activePhase + 1)?.title ?? "Next Phase";

    setMilestones((prev) => {
      const updated = prev.map((m) => m.id === id ? { ...m, status: "done" as const } : m);
      const doneCount = updated.filter((m) => m.status === "done").length;
      const total = updated.length;

      // Update active phase progress
      setPhases((prevPhases) => prevPhases.map((p) =>
        p.id === activePhase ? { ...p, milestonesDone: doneCount, progress: doneCount / total } : p
      ));

      // Update commentary
      const remaining = total - doneCount;
      if (remaining > 0) {
        const next = updated.find((m) => m.status !== "done");
        setCommentaryMsg(`${activePhaseTitle} now ${Math.round((doneCount / total) * 100)}% complete.`);
        setCommentaryAccent(next ? `Next: ${next.label}` : undefined);
        setBarMessage(`${activePhaseTitle} is ${Math.round((doneCount / total) * 100)}% complete. ${remaining} milestone${remaining > 1 ? "s" : ""} remaining.`);
      }

      // Phase completion
      if (doneCount === total) {
        setCelebratingPhase(activePhase);
        setCompletedPhaseTitle(activePhaseTitle);
        setTimeout(() => {
          setShowCelebration(true);
        }, 1500);
        setTimeout(() => {
          setCelebratingPhase(null);
          setPhases((pp) => pp.map((p) => {
            if (p.id === activePhase) return { ...p, status: "complete" as const, progress: 1 };
            if (p.id === activePhase + 1) return { ...p, status: "active" as const };
            return p;
          }));
          setCommentaryMsg(`${activePhaseTitle} complete! Moving to ${nextPhaseTitle}.`);
          setCommentaryAccent(undefined);
          setBarMessage(`${activePhaseTitle} complete. ${nextPhaseTitle} starts now.`);
          setBarChips([`What's in ${nextPhaseTitle}?`, "What's next?"]);
        }, 3000);

        // Promote next current milestone
        const firstUpcoming = updated.findIndex((m) => m.status === "upcoming");
        if (firstUpcoming !== -1) {
          updated[firstUpcoming] = { ...updated[firstUpcoming], status: "current" };
        }
      } else {
        // Find the first non-done milestone and set it as current
        let foundCurrent = false;
        return updated.map((m) => {
          if (m.status === "done") return m;
          if (!foundCurrent) {
            foundCurrent = true;
            return { ...m, status: "current" as const };
          }
          return { ...m, status: "upcoming" as const };
        });
      }

      return updated;
    });
  }, [activePhase, phases]);

  const handleAskSophia = useCallback((query?: string) => {
    if (query) {
      setSophiaInitialMessage(query);
    }
    setSophiaOpen(true);
  }, []);

  const handleTogglePrimary = useCallback((id: string) => {
    setRoadmaps((prev) => prev.map((r) => ({ ...r, isPrimary: r.id === id })));
  }, []);

  const handleSophiaNavigate = useCallback((target: string) => {
    setSophiaOpen(false);
    setSophiaInitialMessage(null);
    // In production: navigate to target surface
  }, []);

  // ─── Render States ────────────────────────────────────────────────────

  if (edgePathState === "empty") {
    return <EmptyState role={role as RoleId} onGenerate={handleGenerate} onOpenSophia={(msg) => { setSophiaInitialMessage(msg); setSophiaOpen(true); }} />;
  }

  if (edgePathState === "loading") {
    return <LoadingState role={role as RoleId} currentRole={loadingCurrentRole} targetRole={loadingTargetRole} onComplete={handleLoadingComplete} onOpenSophia={(msg) => { setSophiaInitialMessage(msg); setSophiaOpen(true); }} />;
  }

  // ─── Map View ─────────────────────────────────────────────────────────

  if (viewMode === "map") {
    return (
      <div className="h-screen w-full flex flex-col" style={{ backgroundColor: "var(--ce-void)" }}>
        <SophiaForwardBackground />
        {!embedded && <SharedTopNav role={role as RoleId} onOpenSophia={(msg) => { setSophiaInitialMessage(msg); setSophiaOpen(true); }} />}

        <motion.div
          className={`${embedded ? "" : "mt-14"} flex items-center justify-between px-6 py-3 z-10 flex-shrink-0`}
          style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <RoadmapSelector
              roadmaps={roadmaps}
              activeId={activeRoadmapId}
              onSelect={setActiveRoadmapId}
              onTogglePrimary={handleTogglePrimary}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                style={{ background: "transparent", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                onClick={() => setViewMode("list")}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
            </div>
            <OverflowMenu />
          </div>
        </motion.div>

        <MindMapView />

        {/* Sophia Float */}
        <SophiaAsk
          isOpen={sophiaOpen}
          onClose={() => { setSophiaOpen(false); setSophiaInitialMessage(null); }}
          mode="float"
          initialMessage={sophiaInitialMessage}
          onClearInitial={() => setSophiaInitialMessage(null)}
          onNavigate={handleSophiaNavigate}
        />
      </div>
    );
  }

  // ─── List View (Active) ───────────────────────────────────────────────

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId)!;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--ce-void)" }}>
      <SophiaForwardBackground />
      {!embedded && <SharedTopNav role={role as RoleId} onOpenSophia={(msg) => { setSophiaInitialMessage(msg); setSophiaOpen(true); }} />}
      {!embedded && <SophiaBottomBar message={barMessage} chips={barChips} onAskSophia={handleAskSophia} />}

      <main className={`${embedded ? "pb-6" : "mt-14 pb-20"} px-6`}>
        <div className="max-w-[1200px] mx-auto">
          {/* Roadmap Header */}
          <motion.div
            className={`pt-8 ${headerExtra ? "pb-4" : "pb-5"} flex ${headerExtra ? "items-start" : "items-center"} justify-between`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
          >
            <div>
              {/* Title row — always shows roadmap title + primary star */}
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[20px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {data
                    ? <>{data.roadmapTitle}{data.roadmapTarget ? <><span className="text-[var(--ce-text-quaternary)] mx-1">→</span>{data.roadmapTarget}</> : null}</>
                    : <>{activeRoadmap.title}{activeRoadmap.target ? <><span className="text-[var(--ce-text-quaternary)] mx-1">→</span>{activeRoadmap.target}</> : null}</>
                  }
                </h1>
                {activeRoadmap.isPrimary && <Star className="w-4 h-4 text-ce-lime fill-[var(--ce-lime)]" />}
              </div>

              {/* Metadata line — archetype or subtitle for injected data, archetype/assessment for generated */}
              {data ? (
                data.archetype ? (
                  <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                    Archetype: <span className="text-ce-text-secondary">{data.archetype}</span> · Assessment complete
                  </span>
                ) : data.roadmapSubtitle ? (
                  <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                    {data.roadmapSubtitle}
                  </span>
                ) : null
              ) : (
                <div className="flex items-center gap-3">
                  {activeRoadmap.assessmentComplete ? (
                    <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                      Archetype: <span className="text-ce-text-secondary">{activeRoadmap.archetype}</span> · Assessment complete
                    </span>
                  ) : (
                    <button className="text-[11px] text-ce-cyan cursor-pointer hover:underline" style={{ fontFamily: "var(--font-body)" }}>
                      Refine with assessment →
                    </button>
                  )}
                </div>
              )}

              {/* headerExtra — injected below the title/metadata block (e.g. parent tab switcher) */}
              {headerExtra && <div className="mt-3">{headerExtra}</div>}
            </div>

            <div className="flex items-center gap-2">
              {/* RoadmapSelector — always shown. Seeded from data when injected; uses ROADMAPS for EdgeStar. */}
              <RoadmapSelector
                roadmaps={roadmaps}
                activeId={activeRoadmapId}
                onSelect={setActiveRoadmapId}
                onTogglePrimary={handleTogglePrimary}
                onCreateNew={() => embedded
                  ? handleAskSophia("I want to create a new roadmap")
                  : setEdgePathState("empty")
                }
              />
              {/* View toggle */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                  style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}
                >
                  <List className="w-3.5 h-3.5" /> List
                </button>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
                  style={{ background: "transparent", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                  onClick={() => setViewMode("map")}
                >
                  <Map className="w-3.5 h-3.5" /> Map
                </button>
              </div>
              <OverflowMenu />
            </div>
          </motion.div>

          {/* Stale Return Bar */}
          <AnimatePresence>
            {showStaleBar && (
              <StaleReturnBar daysSince={23} onDismiss={() => setShowStaleBar(false)} />
            )}
          </AnimatePresence>

          {/* Ahead of Schedule Banner */}
          {showAheadBanner && !showStaleBar && <AheadOfScheduleBanner />}

          {/* Phase Strip */}
          <div className="mb-4">
            <PhaseStrip
              phases={phases}
              activePhase={activePhase}
              onPhaseClick={(phaseId) => {
                setActivePhase(phaseId);
                if (data) setMilestones(data.milestones[phaseId] ?? []);
              }}
              celebratingPhase={celebratingPhase}
            />
          </div>

          {/* Sophia Commentary */}
          <div className="mb-5">
            <SophiaCommentary message={commentaryMsg} accentText={commentaryAccent} />
          </div>

          {/* Two-Column: Milestones left, Sophia panel right */}
          <div className="grid grid-cols-[1fr_320px] gap-5">
            <PhaseDetail milestones={milestones} onMilestoneCheck={handleMilestoneCheck} onOpenRoom={onOpenTaskRoom} onNavigate={onNavigate} />
            <SophiaPanel onAskSophia={handleAskSophia} roleContext={roleContext} onNavigate={onNavigate} />
          </div>

          {/* State demo controls */}
          <motion.div
            className="mt-8 flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <span className="text-[10px] text-[var(--ce-text-quaternary)] mr-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>DEMO STATES</span>
            {[
              { label: "Empty (Day 0)", state: "empty" as EdgePathState },
              { label: "Loading", state: "loading" as EdgePathState },
            ].map((demo) => (
              <button
                key={demo.state}
                className="text-[10px] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
                style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                onClick={() => {
                  if (demo.state === "loading") {
                    setLoadingCurrentRole("Revenue Ops Manager");
                    setLoadingTargetRole("Product Designer");
                  }
                  setEdgePathState(demo.state);
                }}
              >
                {demo.label}
              </button>
            ))}
            <button
              className="text-[10px] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
              style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              onClick={() => setShowStaleBar(true)}
            >
              Show Stale Bar
            </button>
            <button
              className="text-[10px] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
              style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              onClick={() => {
                setShowCelebration(true);
                setCompletedPhaseTitle("Skill Bridge");
              }}
            >
              Phase Celebration
            </button>
          </motion.div>
        </div>
      </main>

      {/* Phase Completion Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <PhaseCompletionCelebration
            phaseTitle={completedPhaseTitle}
            nextPhaseTitle={phases.find(p => p.id === (celebratingPhase ?? activePhase) + 1)?.title ?? "Next Phase"}
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      {/* Sophia Float */}
      <SophiaAsk
        isOpen={sophiaOpen}
        onClose={() => { setSophiaOpen(false); setSophiaInitialMessage(null); }}
        mode="stretch"
        initialMessage={sophiaInitialMessage}
        onClearInitial={() => setSophiaInitialMessage(null)}
        onNavigate={handleSophiaNavigate}
      />
    </div>
  );
}
