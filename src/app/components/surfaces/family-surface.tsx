/**
 * Family Surface — EdgeParent
 *
 * Warm, not clinical. Designed around encouragement and awareness,
 * not surveillance. Parents see Alex's journey, leave notes on milestones,
 * and get Sophia-guided context for how to help.
 *
 * Layer 3 scope:
 * - Full roadmap read view (all phases, all milestones)
 * - Note composer per milestone (encouragement, not directives)
 * - Recent activity feed
 * - Sophia parent-specific insight
 * - Roadmap config: deferred (suggest/accept model TBD)
 */

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard, SophiaInsight } from "../role-shell";
import { SophiaMark } from "../sophia-mark";
import {
  Heart, Check, ChevronRight, ChevronDown, ChevronUp,
  MessageSquare, Calendar, Sparkles, Clock, Lock,
  Send, X, Bookmark, Star, Target, BookOpen,
  TrendingUp, Zap, Circle, ArrowUpRight, Bell,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

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

// ─── Data ────────────────────────────────────────────────────────────────────

const CHILD = {
  name: "Alex",
  initial: "A",
  goal: "Product Designer",
  startDate: "Jan 15, 2026",
  streak: 12,
  daysActive: 62,
};

const PHASES: Phase[] = [
  { id: 1, title: "Discover & Position",   subtitle: "Who Alex is and where they're headed", status: "done",     progress: 1,    milestoneCount: 5, doneCount: 5 },
  { id: 2, title: "Build & Apply",         subtitle: "Skills, portfolio, and first applications", status: "active",   progress: 0.6,  milestoneCount: 8, doneCount: 5 },
  { id: 3, title: "Interview & Close",     subtitle: "Prep, practice, and getting the offer",     status: "upcoming", progress: 0,    milestoneCount: 6, doneCount: 0 },
  { id: 4, title: "Transition & Grow",     subtitle: "First 90 days and career momentum",          status: "locked",   progress: 0,    milestoneCount: 4, doneCount: 0 },
];

const MILESTONES: Milestone[] = [
  // Phase 1 — all done
  { id: "m1",  label: "Career goal identification",         phase: 1, status: "done",     completedDate: "Jan 18", time: "1h",  category: "action",   sophiaNote: "Alex chose Product Design with strong conviction. This matches their creative and systems-thinking strengths.", notes: [] },
  { id: "m2",  label: "Strengths & values mapping",        phase: 1, status: "done",     completedDate: "Jan 22", time: "2h",  category: "resource", sophiaNote: "Top strengths: visual communication, empathy, problem framing. These are in-demand for senior design roles.", notes: [] },
  { id: "m3",  label: "Target company research",           phase: 1, status: "done",     completedDate: "Jan 28", time: "3h",  category: "action",   notes: [] },
  { id: "m4",  label: "Build first case study",            phase: 1, status: "done",     completedDate: "Feb 14", time: "8h",  category: "skill",    sophiaNote: "Case study quality is strong — this is now Alex's most impressive portfolio piece.", notes: [{ id: "n1", text: "So proud of you for finishing this — you've been working on it for weeks!", timestamp: "Feb 15", type: "encouragement" }] },
  { id: "m5",  label: "LinkedIn profile optimized",        phase: 1, status: "done",     completedDate: "Mar 12", time: "2h",  category: "action",   notes: [] },
  // Phase 2 — mixed
  { id: "m6",  label: "Complete Interaction Design module", phase: 2, status: "current",  time: "4h",  category: "skill",    sophiaNote: "Alex is 60% through this module. The remaining exercises are where hiring managers test candidates — important they don't rush.", notes: [] },
  { id: "m7",  label: "Build second case study",           phase: 2, status: "upcoming", time: "10h", category: "skill",    notes: [] },
  { id: "m8",  label: "Networking outreach × 10",          phase: 2, status: "upcoming", time: "3h",  category: "action",   notes: [] },
  { id: "m9",  label: "Resume ATS optimization",           phase: 2, status: "done",     completedDate: "Mar 5", time: "1h",  category: "action",   notes: [] },
  { id: "m10", label: "Portfolio review with mentor",      phase: 2, status: "done",     completedDate: "Mar 8", time: "1h",  category: "action",   notes: [{ id: "n2", text: "Alice said your portfolio is coming together beautifully. You should be proud!", timestamp: "Mar 9", type: "encouragement" }] },
  { id: "m11", label: "Send first 3 applications",        phase: 2, status: "done",     completedDate: "Mar 15", time: "2h",  category: "action",   notes: [] },
  { id: "m12", label: "Salary research & negotiation prep", phase: 2, status: "upcoming", time: "2h",  category: "resource", notes: [] },
  { id: "m13", label: "Cold outreach campaign",            phase: 2, status: "upcoming", time: "4h",  category: "action",   notes: [] },
  // Phase 3 — upcoming
  { id: "m14", label: "Mock interview practice × 3",       phase: 3, status: "upcoming", time: "6h",  category: "skill",    notes: [] },
  { id: "m15", label: "Design challenge preparation",      phase: 3, status: "upcoming", time: "5h",  category: "skill",    notes: [] },
  { id: "m16", label: "Behavioral interview stories",      phase: 3, status: "upcoming", time: "3h",  category: "resource", notes: [] },
  { id: "m17", label: "Live interview × Figma",            phase: 3, status: "locked",   time: "2h",  category: "action",   notes: [] },
  { id: "m18", label: "Offer evaluation & negotiation",    phase: 3, status: "locked",   time: "2h",  category: "action",   notes: [] },
  { id: "m19", label: "Decision & acceptance",             phase: 3, status: "locked",   time: "1h",  category: "action",   notes: [] },
  // Phase 4 — locked
  { id: "m20", label: "First 30 days plan",               phase: 4, status: "locked",   time: "2h",  category: "resource", notes: [] },
  { id: "m21", label: "Stakeholder mapping",              phase: 4, status: "locked",   time: "1h",  category: "action",   notes: [] },
  { id: "m22", label: "90-day review prep",               phase: 4, status: "locked",   time: "2h",  category: "skill",    notes: [] },
  { id: "m23", label: "Long-term career strategy",        phase: 4, status: "locked",   time: "3h",  category: "resource", notes: [] },
];

const ACTIVITY = [
  { label: "Completed Module 3: Microinteractions video",       time: "Today, 9am",    type: "milestone" as const },
  { label: "Sent application to Vercel — Product Designer",     time: "Yesterday",     type: "application" as const },
  { label: "Logged 2h study session",                           time: "Yesterday",     type: "session" as const },
  { label: "Mentor session with Alice Chen — portfolio review", time: "Mar 16",        type: "session" as const },
  { label: "Opened Interaction Design module",                   time: "Mar 14",        type: "milestone" as const },
  { label: "Application sent to Figma",                         time: "Mar 15",        type: "application" as const },
];

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

// ─── Note Composer ────────────────────────────────────────────────────────────

function NoteComposer({
  milestone,
  onSubmit,
  onClose,
}: {
  milestone: Milestone;
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

  const statusLabel = milestone.status === "done"
    ? `Completed ${milestone.completedDate}`
    : milestone.status === "current"
    ? "In progress now"
    : "Upcoming milestone";

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(236,72,153,0.04)", border: "1px solid rgba(236,72,153,0.12)" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(236,72,153,0.08)" }}>
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Heart className="w-3 h-3 text-[#EC4899] flex-shrink-0" />
            <span className="text-[11px] text-[#EC4899]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Leave a note for Alex
            </span>
          </div>
          <span className="text-[11px] text-[#9CA3AF] block truncate" style={{ fontFamily: "var(--font-body)" }}>
            {milestone.label}
          </span>
          <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
            {statusLabel}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-[#6B7280]" />
        </button>
      </div>

      {/* Sophia context */}
      {milestone.sophiaNote && (
        <div className="px-4 py-2.5 flex items-start gap-2" style={{ borderBottom: "1px solid rgba(236,72,153,0.06)", background: "rgba(34,211,238,0.02)" }}>
          <SophiaMark size={12} glowing={false} />
          <p className="text-[10px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {milestone.sophiaNote}
          </p>
        </div>
      )}

      {/* Existing notes */}
      {milestone.notes.length > 0 && (
        <div className="px-4 py-3 flex flex-col gap-2" style={{ borderBottom: "1px solid rgba(236,72,153,0.06)" }}>
          {milestone.notes.map((note) => (
            <div key={note.id} className="rounded-lg px-3 py-2" style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.1)" }}>
              <p className="text-[11px] text-[#E8E8ED] leading-relaxed mb-1" style={{ fontFamily: "var(--font-body)" }}>
                "{note.text}"
              </p>
              <span className="text-[9px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
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
                style={{ background: "rgba(236,72,153,0.1)", border: "1.5px solid rgba(236,72,153,0.25)" }}
                animate={{ scale: [1, 1.12, 1], boxShadow: ["0 0 0px rgba(236,72,153,0)", "0 0 20px rgba(236,72,153,0.3)", "0 0 0px rgba(236,72,153,0)"] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Heart className="w-5 h-5 text-[#EC4899]" style={{ fill: "rgba(236,72,153,0.3)" }} />
              </motion.div>
              <span className="text-[12px] text-[#EC4899]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Note sent to Alex
              </span>
              <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
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
                    className="text-[10px] px-2.5 py-1 rounded-full cursor-pointer hover:border-[rgba(236,72,153,0.3)] transition-colors"
                    style={{
                      background: text === preset.label ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${text === preset.label ? "rgba(236,72,153,0.25)" : "rgba(255,255,255,0.06)"}`,
                      color: text === preset.label ? "#EC4899" : "#9CA3AF",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Text input */}
              <div className="rounded-xl overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write something encouraging for Alex..."
                  rows={3}
                  className="w-full px-3 pt-3 pb-2 text-[12px] text-[#E8E8ED] placeholder:text-[#374151] bg-transparent outline-none resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleSubmit(); }}
                />
                <div className="flex items-center justify-between px-3 pb-2.5">
                  <span className="text-[9px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>
                    ⌘↵ to send
                  </span>
                  <span className="text-[9px] tabular-nums" style={{ color: text.length > 200 ? "#EF4444" : "#374151", fontFamily: "var(--font-body)" }}>
                    {text.length}/240
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  background: text.trim() ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${text.trim() ? "rgba(236,72,153,0.25)" : "rgba(255,255,255,0.06)"}`,
                  color: text.trim() ? "#EC4899" : "#374151",
                  fontFamily: "var(--font-display)", fontWeight: 500,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Send note to Alex
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
  const isLocked = phase.status === "locked";
  const isDone = phase.status === "done";
  const isActive = phase.status === "active";

  const phaseColor = isDone ? "#B3FF3B" : isActive ? "#EC4899" : "#374151";

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${isActive ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.04)"}` }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + phase.id * 0.07, duration: 0.4, ease: EASE }}
    >
      {/* Phase header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left"
        onClick={() => !isLocked && setCollapsed(!collapsed)}
        disabled={isLocked}
      >
        {/* Status indicator */}
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
          background: isDone ? "rgba(179,255,59,0.12)" : isActive ? "rgba(236,72,153,0.12)" : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${isDone ? "rgba(179,255,59,0.3)" : isActive ? "rgba(236,72,153,0.3)" : "rgba(255,255,255,0.08)"}`,
        }}>
          {isDone
            ? <Check className="w-2.5 h-2.5" style={{ color: "#B3FF3B" }} />
            : isActive
            ? <div className="w-2 h-2 rounded-full" style={{ background: "#EC4899", boxShadow: "0 0 6px rgba(236,72,153,0.5)" }} />
            : isLocked
            ? <Lock className="w-2.5 h-2.5 text-[#374151]" />
            : <Circle className="w-2.5 h-2.5 text-[#374151]" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: isLocked ? "#374151" : "#E8E8ED", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Phase {phase.id} — {phase.title}
            </span>
            {isActive && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(236,72,153,0.1)", color: "#EC4899", border: "1px solid rgba(236,72,153,0.2)", fontFamily: "var(--font-body)" }}>
                Active
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
            {phase.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Progress fraction */}
          <span className="text-[11px] tabular-nums" style={{ color: phaseColor, fontFamily: "var(--font-body)" }}>
            {phase.doneCount}/{phase.milestoneCount}
          </span>
          {/* Mini progress bar */}
          <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
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
              ? <ChevronDown className="w-3.5 h-3.5 text-[#374151]" />
              : <ChevronUp className="w-3.5 h-3.5 text-[#374151]" />
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
            <div className="px-4 pb-3 flex flex-col gap-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {milestones.map((m) => {
                const isSelected = selectedMilestoneId === m.id;
                const isCurrent = m.status === "current";
                const isDoneM = m.status === "done";
                const hasNotes = m.notes.length > 0;

                return (
                  <div key={m.id}>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-left transition-all"
                      style={{
                        background: isSelected
                          ? "rgba(236,72,153,0.06)"
                          : isCurrent
                          ? "rgba(236,72,153,0.03)"
                          : "transparent",
                        border: `1px solid ${isSelected ? "rgba(236,72,153,0.15)" : isCurrent ? "rgba(236,72,153,0.08)" : "transparent"}`,
                        marginTop: 2,
                      }}
                      onClick={() => onSelectMilestone(isSelected ? null : m.id)}
                    >
                      {/* Status dot */}
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        background: isDoneM ? "rgba(179,255,59,0.1)" : isCurrent ? "rgba(236,72,153,0.1)" : "transparent",
                        border: `1.5px solid ${isDoneM ? "#B3FF3B" : isCurrent ? "#EC4899" : "rgba(255,255,255,0.1)"}`,
                        boxShadow: isCurrent ? "0 0 6px rgba(236,72,153,0.3)" : "none",
                      }}>
                        {isDoneM && <Check className="w-2 h-2 text-[#B3FF3B]" />}
                      </div>

                      {/* Label */}
                      <span
                        className="flex-1 text-[12px] min-w-0"
                        style={{
                          color: isDoneM ? "#6B7280" : isCurrent ? "#E8E8ED" : "#9CA3AF",
                          fontFamily: "var(--font-body)",
                          textDecoration: isDoneM ? "none" : "none",
                        }}
                      >
                        {m.label}
                      </span>

                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasNotes && (
                          <Heart className="w-3 h-3" style={{ color: "#EC4899", fill: "rgba(236,72,153,0.3)" }} />
                        )}
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(236,72,153,0.1)", color: "#EC4899", border: "1px solid rgba(236,72,153,0.15)", fontFamily: "var(--font-body)" }}>
                            In progress
                          </span>
                        )}
                        {isDoneM && (
                          <span className="text-[9px] tabular-nums text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>
                            {m.completedDate}
                          </span>
                        )}
                        {!isDoneM && !isCurrent && (
                          <span className="text-[9px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>
                            ~{m.time}
                          </span>
                        )}
                        <div style={{ color: "#374151" }}>{categoryIcon[m.category]}</div>
                        <ChevronRight className="w-3 h-3 text-[#374151]" />
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

function ActivityFeed() {
  const typeColor = {
    milestone:   "#B3FF3B",
    application: "#22D3EE",
    session:     "#8B5CF6",
  };
  const typeIcon = {
    milestone:   <Check className="w-3 h-3" />,
    application: <ArrowUpRight className="w-3 h-3" />,
    session:     <Calendar className="w-3 h-3" />,
  };

  return (
    <GlassCard delay={0.5}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
        <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Recent Activity
        </span>
      </div>
      <div className="flex flex-col gap-0">
        {ACTIVITY.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${typeColor[item.type]}10` }}>
              <div style={{ color: typeColor[item.type] }}>{typeIcon[item.type]}</div>
            </div>
            <span className="text-[12px] text-[#9CA3AF] flex-1 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {item.label}
            </span>
            <span className="text-[10px] text-[#374151] flex-shrink-0 whitespace-nowrap mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
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
  const role = (roleParam === "parent" ? "parent" : "parent") as "parent";

  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) ?? null;

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
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              notes: [
                ...m.notes,
                { id: `n${Date.now()}`, text, timestamp: "Just now", type },
              ],
            }
          : m
      )
    );
  };

  const sophiaOverride = {
    message: "Alex is 60% through Phase 2 — ahead of schedule for their goal. Their biggest momentum driver has been consistent short sessions — averaging 1.4 hours/day. The Interaction Design module they're in now is critical for their top job targets. Great time to send encouragement.",
    chips: [
      { label: "How can I support Alex?", action: "How can I best support my child through Phase 2 of their career roadmap?" },
      { label: "What's coming next?", action: "What milestones is my child working towards next and how long will they take?" },
    ],
    actionPrompt: "How is my child Alex doing in their career roadmap, and what's the best way I can support them right now?",
  };

  // KPI row data
  const totalDone = milestones.filter((m) => m.status === "done").length;
  const totalMilestones = milestones.filter((m) => m.status !== "locked").length;
  const overallPct = Math.round((totalDone / totalMilestones) * 100);

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
        {/* Header */}
        <motion.div
          className="pt-8 pb-6 flex items-start justify-between"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[15px] text-[#EC4899]"
                style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.15)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {CHILD.initial}
              </div>
              <div>
                <h1 className="text-[22px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {CHILD.name}'s Journey
                </h1>
                <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                  Targeting {CHILD.goal} · Started {CHILD.startDate}
                </p>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-4">
            {[
              { label: "Overall progress", value: `${overallPct}%`, color: "#EC4899" },
              { label: "Milestones done", value: `${totalDone}`, color: "#B3FF3B" },
              { label: "Day streak", value: `${CHILD.streak}`, color: "#22D3EE" },
            ].map((stat) => (
              <div key={stat.label} className="text-right">
                <div className="text-[20px] tabular-nums" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phase progress bar strip */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4, ease: EASE }}
        >
          {PHASES.map((phase) => {
            const color = phase.status === "done" ? "#B3FF3B" : phase.status === "active" ? "#EC4899" : "rgba(255,255,255,0.06)";
            return (
              <div key={phase.id} className="flex-1">
                <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.progress * 100}%` }}
                    transition={{ delay: 0.7 + phase.id * 0.1, duration: 0.7, ease: EASE }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: phase.status === "locked" ? "#374151" : "#6B7280", fontFamily: "var(--font-body)" }}>
                  Ph.{phase.id} {phase.status === "done" ? "✓" : phase.status === "active" ? "↑" : ""}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Main two-column layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>

          {/* Left: Roadmap phases */}
          <div className="flex flex-col gap-3">
            {PHASES.map((phase) => (
              <PhaseSection
                key={phase.id}
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
                  onSubmit={handleAddNote}
                  onClose={() => setSelectedMilestoneId(null)}
                />
              ) : (
                <motion.div
                  key="note-prompt"
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: "rgba(236,72,153,0.03)", border: "1px solid rgba(236,72,153,0.08)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(236,72,153,0.08)" }}>
                    <Heart className="w-4 h-4 text-[#EC4899]" />
                  </div>
                  <div>
                    <span className="text-[12px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Leave a note
                    </span>
                    <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                      Select a milestone on the left to write a note for Alex
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sophia insight */}
            <SophiaInsight
              message="Alex is 60% through Phase 2 — ahead of schedule for their goal. Their biggest momentum driver has been consistent short sessions — averaging 1.4 hours/day. The Interaction Design module they're in now is critical for their top job targets. Great time to send encouragement."
              actionLabel="Ask Sophia about Alex"
              onAction={() => {}}
              actionPrompt="How is my child Alex doing in their career roadmap, and what's the best way I can support them right now?"
              delay={0.4}
            />

            {/* Upcoming */}
            <GlassCard delay={0.55}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Coming Up</span>
              </div>
              {[
                { text: "Mentor session with Alice Chen", date: "Friday, 2 PM", color: "#8B5CF6" },
                { text: "Networking outreach milestone due", date: "Next Monday",  color: "#EC4899" },
                { text: "Phase 2 completion target",        date: "Apr 1",         color: "#B3FF3B" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[12px] text-[#9CA3AF] flex-1" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                  <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
                </div>
              ))}
            </GlassCard>

            {/* Quick message */}
            <GlassCard delay={0.65}>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-3.5 h-3.5 text-[#EC4899]" />
                <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Message Alex</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Great progress! 🙌", "How's it going?", "Need anything?", "Proud of you!"].map((msg) => (
                  <button
                    key={msg}
                    onClick={() => handleNavigate("messages")}
                    className="text-[11px] text-[#9CA3AF] px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(236,72,153,0.06)] hover:text-[#EC4899] transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Activity feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </RoleShell>
  );
}