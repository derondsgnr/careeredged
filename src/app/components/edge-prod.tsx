/**
 * Edge Productivity — "Your Day"
 *
 * Unified daily productivity surface. 7 tools woven into one view:
 *   Sprint tasks ARE the page
 *   Focus timer attaches to individual tasks (▶ on task row)
 *   Streak is ambient (header counter)
 *   Goals via Sophia chip → panel
 *   Matrix is a layout toggle on the same task list
 *   Intent is a single editable line at top
 *   Retro surfaces contextually (end of week)
 *
 * Entry: Explore menu (Dock/Segment) — NOT a top nav pill.
 * Route: /:role/productivity
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SophiaMark } from "./sophia-mark";
import { RoleShell, GlassCard, type RoleId, type NavigateFn } from "./role-shell";
import { SophiaInsight } from "./sophia-patterns";
import {
  Zap, Flame, Target, Clock, Play, Pause, Square,
  Check, Plus, ChevronRight, ChevronDown, ChevronUp,
  Sparkles, Brain, RotateCcw,
  LayoutGrid, List, AlertCircle, Coffee,
  Pencil, X, Star, Calendar,
  FileText, Search, MessageSquare, Compass,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────

type TaskPriority = "urgent-important" | "not-urgent-important" | "urgent-not-important" | "not-urgent-not-important";
type TaskStatus = "todo" | "in_progress" | "done";
type SprintView = "list" | "matrix";

interface SprintTask {
  id: string;
  title: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
  crossLink?: { surfaceId: string; label: string; icon: LucideIcon };
  sophiaNote?: string;
  phaseRef?: string;
  focusMinutes: number;
}

interface GoalItem {
  id: string;
  title: string;
  target: string;
  progress: number;
  deadline: string;
  phaseRef?: string;
}

interface RetroEntry {
  wentWell: string[];
  couldImprove: string[];
  nextWeekFocus: string;
  weekStats: { tasksCompleted: number; focusHours: number; streakDays: number; goalsHit: number };
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_TASKS: SprintTask[] = [
  {
    id: "t1", title: "Complete interaction design module", timeEstimate: "2h",
    priority: "urgent-important", status: "in_progress",
    crossLink: { surfaceId: "edgepath", label: "Phase 2 milestone", icon: Compass },
    sophiaNote: "6 of 8 target companies require this — highest-impact action today.",
    phaseRef: "Phase 2 · Skill Bridge", focusMinutes: 45,
  },
  {
    id: "t2", title: "Apply to Figma Product Designer role", timeEstimate: "30m",
    priority: "urgent-important", status: "todo",
    crossLink: { surfaceId: "jobs", label: "94% match", icon: Search },
    sophiaNote: "Application window closes in 48 hours.",
    focusMinutes: 0,
  },
  {
    id: "t3", title: "Draft case study #2 — Resend redesign", timeEstimate: "3h",
    priority: "not-urgent-important", status: "todo",
    crossLink: { surfaceId: "resume", label: "Portfolio piece", icon: FileText },
    sophiaNote: "Your portfolio has 1 case study. Top candidates average 3.",
    phaseRef: "Phase 2 · Skill Bridge", focusMinutes: 0,
  },
  {
    id: "t4", title: "Review session prep for Alice", timeEstimate: "15m",
    priority: "urgent-not-important", status: "todo",
    crossLink: { surfaceId: "sessions", label: "Tomorrow 2pm", icon: Calendar },
    focusMinutes: 0,
  },
  {
    id: "t5", title: "Reply to Marcus about mock interview", timeEstimate: "10m",
    priority: "not-urgent-not-important", status: "done",
    crossLink: { surfaceId: "messages", label: "Thread", icon: MessageSquare },
    focusMinutes: 5,
  },
  {
    id: "t6", title: "Read design systems chapter 4", timeEstimate: "45m",
    priority: "not-urgent-important", status: "todo",
    phaseRef: "Phase 2 · Skill Bridge", focusMinutes: 0,
  },
];

const MOCK_GOALS: GoalItem[] = [
  { id: "g1", title: "Complete Phase 2 milestones", target: "8 of 12 milestones", progress: 67, deadline: "Apr 15", phaseRef: "Phase 2" },
  { id: "g2", title: "Apply to 10 target companies", target: "10 applications", progress: 30, deadline: "Apr 1" },
  { id: "g3", title: "Build 3 portfolio case studies", target: "3 case studies", progress: 33, deadline: "Apr 20", phaseRef: "Phase 2" },
  { id: "g4", title: "30 hours of focused skill-building", target: "30 hours", progress: 52, deadline: "Apr 30" },
];

const MOCK_RETRO: RetroEntry = {
  wentWell: ["Completed design systems module ahead of schedule", "Applied to 2 strong-fit roles"],
  couldImprove: ["Missed 2 focus blocks due to context-switching", "Case study #2 stalled — need to break it down"],
  nextWeekFocus: "Finish case study #2 draft and complete 3 more applications",
  weekStats: { tasksCompleted: 12, focusHours: 8.5, streakDays: 5, goalsHit: 2 },
};

const ROLE_NAMES: Record<RoleId, { name: string; initial: string }> = {
  edgestar: { name: "Jordan Kim", initial: "JK" },
  edgepreneur: { name: "Sam Rivera", initial: "SR" },
  parent: { name: "David Kim", initial: "DK" },
  guide: { name: "Alice Chen", initial: "AC" },
  employer: { name: "Sarah Park", initial: "SP" },
  edu: { name: "Dr. Williams", initial: "DW" },
  ngo: { name: "Maria Santos", initial: "MS" },
  agency: { name: "James Liu", initial: "JL" },
};

// ─── Focus Timer (floating card, bottom-right) ────────────────────────────

function FocusTimer({ taskTitle, onEnd, onMinimize }: {
  taskTitle: string;
  onEnd: (minutes: number) => void;
  onMinimize: () => void;
}) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Timer tick
  useState(() => {
    const interval = setInterval(() => {
      if (!isRunning) return;
      setSeconds(s => {
        if (s <= 1) {
          if (!isBreak) {
            toast("Focus block complete. Take a 5-minute break.", { icon: "☕" });
            setIsBreak(true);
            setIsRunning(false);
            return 5 * 60;
          } else {
            toast("Break's over. Ready for another round?", { icon: "⚡" });
            setIsBreak(false);
            setIsRunning(false);
            return 25 * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const progress = isBreak ? (1 - seconds / (5 * 60)) : (1 - seconds / (25 * 60));
  const elapsed = Math.round((Date.now() - startTimeRef.current) / 60000);

  return (
    <motion.div
      className="fixed bottom-20 right-6 z-50 rounded-2xl overflow-hidden"
      style={{ background: "rgba(8,9,12,0.95)", border: `1px solid ${isBreak ? "rgba(34,211,238,0.15)" : "rgba(179,255,59,0.15)"}`, backdropFilter: "blur(24px)", width: 280 }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="h-1 w-full" style={{ background: "rgba(255,255,255,0.04)" }}>
        <motion.div className="h-full rounded-r-full" style={{ background: isBreak ? "#22D3EE" : "#B3FF3B", width: `${progress * 100}%` }} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isBreak ? <Coffee className="w-3.5 h-3.5 text-[#22D3EE]" /> : <Brain className="w-3.5 h-3.5 text-[#B3FF3B]" />}
            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{isBreak ? "Break" : "Focus"}</span>
          </div>
          <button onClick={onMinimize} className="text-[#6B7280] hover:text-[#E8E8ED] cursor-pointer"><ChevronDown className="w-3.5 h-3.5" /></button>
        </div>
        <div className="text-center mb-3">
          <span className="text-[36px] tabular-nums tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: isBreak ? "#22D3EE" : "#B3FF3B" }}>
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </span>
        </div>
        <p className="text-[11px] text-[#6B7280] text-center mb-4 truncate" style={{ fontFamily: "var(--font-body)" }}>{taskTitle}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setIsRunning(!isRunning)} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background: isBreak ? "rgba(34,211,238,0.1)" : "rgba(179,255,59,0.1)", border: `1px solid ${isBreak ? "rgba(34,211,238,0.2)" : "rgba(179,255,59,0.2)"}` }}>
            {isRunning ? <Pause className="w-4 h-4" style={{ color: isBreak ? "#22D3EE" : "#B3FF3B" }} /> : <Play className="w-4 h-4" style={{ color: isBreak ? "#22D3EE" : "#B3FF3B" }} />}
          </button>
          <button onClick={() => onEnd(elapsed)} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Square className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Goals Panel (Sophia Ask style — right sidebar) ───────────────────────

function GoalsPanel({ goals, onClose }: { goals: GoalItem[]; onClose: () => void }) {
  return (
    <motion.div
      className="fixed top-14 right-0 bottom-0 z-50 overflow-y-auto"
      style={{ width: 380, background: "rgba(14,15,20,0.98)", borderLeft: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px)" }}
      initial={{ x: 380 }}
      animate={{ x: 0 }}
      exit={{ x: 380 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
              <Target className="w-4 h-4 text-[#B3FF3B]" />
            </div>
            <div>
              <h2 className="text-[16px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Goals</h2>
              <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{goals.filter(g => g.progress >= 100).length} of {goals.length} complete</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#E8E8ED] cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          {goals.map((goal, i) => (
            <motion.div key={goal.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25, ease: EASE }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{goal.title}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{goal.target} · Due {goal.deadline}</p>
                </div>
                <span className="text-[13px] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: goal.progress >= 75 ? "#B3FF3B" : goal.progress >= 50 ? "#22D3EE" : "#6B7280" }}>{goal.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <motion.div className="h-full rounded-full" style={{ background: goal.progress >= 75 ? "#B3FF3B" : goal.progress >= 50 ? "#22D3EE" : "rgba(255,255,255,0.15)" }}
                  initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: EASE }} />
              </div>
              {goal.phaseRef && (
                <p className="text-[10px] text-[#22D3EE] mt-2 flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}><Compass className="w-3 h-3" /> {goal.phaseRef}</p>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl flex items-start gap-3" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.08)" }}>
          <SophiaMark size={16} />
          <p className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>You're 15% ahead on Phase 2 milestones. At this pace, you'll hit your April target 5 days early.</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Retro Panel (same right sidebar pattern) ─────────────────────────────

function RetroPanel({ retro, onClose }: { retro: RetroEntry; onClose: () => void }) {
  return (
    <motion.div
      className="fixed top-14 right-0 bottom-0 z-50 overflow-y-auto"
      style={{ width: 380, background: "rgba(14,15,20,0.98)", borderLeft: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(24px)" }}
      initial={{ x: 380 }}
      animate={{ x: 0 }}
      exit={{ x: 380 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)" }}>
              <RotateCcw className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div>
              <h2 className="text-[16px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Weekly Retro</h2>
              <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Week of Mar 20–27</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#E8E8ED] cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Tasks done", value: retro.weekStats.tasksCompleted, color: "#B3FF3B" },
            { label: "Focus hours", value: retro.weekStats.focusHours, color: "#22D3EE" },
            { label: "Streak", value: `${retro.weekStats.streakDays}d`, color: "#F59E0B" },
            { label: "Goals hit", value: retro.weekStats.goalsHit, color: "#8B5CF6" },
          ].map((stat, i) => (
            <motion.div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25, ease: EASE }}>
              <p className="text-[18px] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-[12px] text-[#B3FF3B] mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>What went well</p>
          {retro.wentWell.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <Check className="w-3 h-3 text-[#B3FF3B] mt-0.5 shrink-0" />
              <p className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{item}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-[12px] text-[#F59E0B] mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>Adjust next week</p>
          {retro.couldImprove.map((item, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <AlertCircle className="w-3 h-3 text-[#F59E0B] mt-0.5 shrink-0" />
              <p className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{item}</p>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.08)" }}>
          <p className="text-[11px] text-[#22D3EE] mb-1" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>Next week focus</p>
          <p className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{retro.nextWeekFocus}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle, onStartFocus, onNavigate, delay = 0 }: {
  task: SprintTask;
  onToggle: () => void;
  onStartFocus: () => void;
  onNavigate?: NavigateFn;
  delay?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDone = task.status === "done";

  const priorityColors: Record<TaskPriority, string> = {
    "urgent-important": "#EF4444",
    "not-urgent-important": "#22D3EE",
    "urgent-not-important": "#F59E0B",
    "not-urgent-not-important": "#6B7280",
  };

  return (
    <motion.div className="rounded-xl overflow-hidden"
      style={{ background: isDone ? "rgba(179,255,59,0.02)" : "rgba(255,255,255,0.03)", border: `1px solid ${isDone ? "rgba(179,255,59,0.06)" : task.status === "in_progress" ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.05)"}` }}
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.25, ease: EASE }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onToggle} className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          style={{ background: isDone ? "rgba(179,255,59,0.15)" : "transparent", border: `1.5px solid ${isDone ? "#B3FF3B" : "rgba(255,255,255,0.12)"}` }}>
          <AnimatePresence>{isDone && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="w-3 h-3 text-[#B3FF3B]" /></motion.div>}</AnimatePresence>
        </button>
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: priorityColors[task.priority] }} />
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] ${isDone ? "line-through text-[#6B7280]" : "text-[#E8E8ED]"}`} style={{ fontFamily: "var(--font-body)", fontWeight: isDone ? 400 : 500 }}>{task.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}><Clock className="w-2.5 h-2.5 inline mr-0.5" />{task.timeEstimate}</span>
            {task.focusMinutes > 0 && <span className="text-[10px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}><Brain className="w-2.5 h-2.5 inline mr-0.5" />{task.focusMinutes}m focused</span>}
            {task.phaseRef && <span className="text-[10px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>· {task.phaseRef}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {!isDone && (
            <button onClick={onStartFocus} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.1)" }} title="Start focus block">
              <Play className="w-3 h-3 text-[#B3FF3B]" />
            </button>
          )}
          {task.crossLink && onNavigate && (
            <button onClick={() => onNavigate(task.crossLink!.surfaceId)} className="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <task.crossLink.icon className="w-3 h-3 text-[#6B7280]" />
              <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{task.crossLink.label}</span>
            </button>
          )}
          {task.sophiaNote && (
            <button onClick={() => setExpanded(!expanded)} className="text-[#6B7280] hover:text-[#9CA3AF] cursor-pointer">
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && task.sophiaNote && (
          <motion.div className="px-4 pb-3 flex items-start gap-2 ml-8" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: EASE }}>
            <SophiaMark size={14} />
            <p className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{task.sophiaNote}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Matrix View ──────────────────────────────────────────────────────────

function MatrixView({ tasks, onToggle, onStartFocus }: {
  tasks: SprintTask[];
  onToggle: (id: string) => void;
  onStartFocus: (id: string) => void;
}) {
  const quadrants: { key: TaskPriority; label: string; color: string }[] = [
    { key: "urgent-important", label: "Do first", color: "#EF4444" },
    { key: "not-urgent-important", label: "Schedule", color: "#22D3EE" },
    { key: "urgent-not-important", label: "Delegate", color: "#F59E0B" },
    { key: "not-urgent-not-important", label: "Eliminate", color: "#6B7280" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {quadrants.map((q) => {
        const qTasks = tasks.filter(t => t.priority === q.key);
        return (
          <div key={q.key} className="p-3 rounded-xl min-h-[140px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: q.color }} />
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{q.label}</span>
              <span className="text-[10px] text-[#4B5563] ml-auto" style={{ fontFamily: "var(--font-body)" }}>{qTasks.length}</span>
            </div>
            <div className="space-y-2">
              {qTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2">
                  <button onClick={() => onToggle(task.id)} className="w-4 h-4 rounded flex items-center justify-center shrink-0 cursor-pointer"
                    style={{ background: task.status === "done" ? "rgba(179,255,59,0.15)" : "transparent", border: `1.5px solid ${task.status === "done" ? "#B3FF3B" : "rgba(255,255,255,0.1)"}` }}>
                    {task.status === "done" && <Check className="w-2.5 h-2.5 text-[#B3FF3B]" />}
                  </button>
                  <p className={`text-[12px] flex-1 truncate ${task.status === "done" ? "line-through text-[#6B7280]" : "text-[#E8E8ED]"}`} style={{ fontFamily: "var(--font-body)" }}>{task.title}</p>
                  {task.status !== "done" && <button onClick={() => onStartFocus(task.id)} className="text-[#6B7280] hover:text-[#B3FF3B] cursor-pointer"><Play className="w-3 h-3" /></button>}
                </div>
              ))}
              {qTasks.length === 0 && <p className="text-[11px] text-[#4B5563] italic" style={{ fontFamily: "var(--font-body)" }}>No tasks</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export function EdgeProd({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  const [tasks, setTasks] = useState<SprintTask[]>(MOCK_TASKS);
  const [view, setView] = useState<SprintView>("list");
  const [intention, setIntention] = useState("Ship portfolio case study #2");
  const [editingIntention, setEditingIntention] = useState(false);
  const [intentionDraft, setIntentionDraft] = useState(intention);
  const streak = 5;
  const [focusTask, setFocusTask] = useState<string | null>(null);
  const [focusMinimized, setFocusMinimized] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [retroOpen, setRetroOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);

  const u = ROLE_NAMES[role];
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const totalTasks = tasks.length;
  const totalFocusMin = tasks.reduce((sum, t) => sum + t.focusMinutes, 0);
  const focusTaskObj = tasks.find(t => t.id === focusTask);
  const dayOfWeek = new Date().getDay();
  const isRetroDay = dayOfWeek === 5 || dayOfWeek === 6;

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t));
  }, []);

  const startFocus = useCallback((id: string) => {
    setFocusTask(id);
    setFocusMinimized(false);
    toast("Focus block started. 25 minutes of deep work.", { icon: "🧠" });
  }, []);

  const endFocus = useCallback((minutes: number) => {
    if (focusTask) setTasks(prev => prev.map(t => t.id === focusTask ? { ...t, focusMinutes: t.focusMinutes + minutes } : t));
    setFocusTask(null);
    setFocusMinimized(false);
  }, [focusTask]);

  const addTask = useCallback(() => {
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { id: `t${Date.now()}`, title: newTaskInput.trim(), timeEstimate: "30m", priority: "not-urgent-important", status: "todo", focusMinutes: 0 }]);
    setNewTaskInput("");
    setShowNewTask(false);
  }, [newTaskInput]);

  const saveIntention = useCallback(() => { setIntention(intentionDraft); setEditingIntention(false); }, [intentionDraft]);

  const sophiaOverride = {
    message: focusTask
      ? `Focus block active — ${focusTaskObj?.title}. Stay in the zone.`
      : doneTasks >= totalTasks - 1 ? `${doneTasks} of ${totalTasks} done. You're almost clear for the day.`
      : `${totalTasks - doneTasks} tasks remaining. The design module is highest-impact.`,
    chips: [
      ...(focusTask ? [] : [{ label: "Start focus block", action: "focus" }]),
      { label: "Review goals", action: "goals" },
      ...(isRetroDay ? [{ label: "Weekly retro", action: "retro" }] : []),
      { label: "What should I prioritize?", action: "What should I prioritize today based on my goals and deadlines?" },
    ],
  };

  return (
    <RoleShell role={role} userName={u.name} userInitial={u.initial} edgeGas={47}
      onNavigate={(target: string) => {
        if (target === "goals") { setGoalsOpen(true); return; }
        if (target === "retro") { setRetroOpen(true); return; }
        if (target === "focus") { const t = tasks.find(t => t.status !== "done"); if (t) startFocus(t.id); return; }
        onNavigate?.(target);
      }}
      sophiaOverride={sophiaOverride}
    >
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <motion.div className="pt-6 pb-4 flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35, ease: EASE }}>
          <div>
            <h1 className="text-[22px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Your Day</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{doneTasks} of {totalTasks} tasks · {Math.round(totalFocusMin / 60 * 10) / 10}h focused</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.12)" }}>
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[13px] tabular-nums text-[#F59E0B]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{streak}</span>
            </div>
            <div className="flex items-center rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {([{ id: "list" as SprintView, icon: List }, { id: "matrix" as SprintView, icon: LayoutGrid }]).map(v => (
                <button key={v.id} onClick={() => setView(v.id)} className="relative w-8 h-8 flex items-center justify-center rounded-md cursor-pointer">
                  {view === v.id && <motion.div className="absolute inset-0 rounded-md" style={{ background: "rgba(255,255,255,0.06)" }} layoutId="view-toggle" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <v.icon className={`w-3.5 h-3.5 relative z-10 ${view === v.id ? "text-[#E8E8ED]" : "text-[#6B7280]"}`} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sophia Daily Brief */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35, ease: EASE }}>
          <SophiaInsight message={`${totalTasks - doneTasks} tasks today. The interaction design module is your highest-impact action — 6 of 8 target companies require it.`} actionLabel="Start with it" onAction={() => { const t = tasks.find(t => t.id === "t1"); if (t) startFocus(t.id); }} delay={0.2} />
        </motion.div>

        {/* Daily Intention */}
        <motion.div className="mt-4 mb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}>
          {editingIntention ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(179,255,59,0.12)" }}>
              <Star className="w-3.5 h-3.5 text-[#B3FF3B] shrink-0" />
              <input value={intentionDraft} onChange={e => setIntentionDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveIntention(); if (e.key === "Escape") setEditingIntention(false); }}
                className="flex-1 bg-transparent text-[13px] text-[#E8E8ED] outline-none" style={{ fontFamily: "var(--font-body)" }} autoFocus />
              <button onClick={saveIntention} className="text-[#B3FF3B] cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={() => setEditingIntention(false)} className="text-[#6B7280] cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button onClick={() => { setEditingIntention(true); setIntentionDraft(intention); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl w-full text-left cursor-pointer group" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <Star className="w-3.5 h-3.5 text-[#B3FF3B] shrink-0" />
              <span className="text-[13px] text-[#E8E8ED] flex-1" style={{ fontFamily: "var(--font-body)" }}>{intention || "Set today's intention..."}</span>
              <Pencil className="w-3 h-3 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </motion.div>

        {/* Sprint Tasks */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35, ease: EASE }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#B3FF3B]" />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sprint</span>
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{doneTasks}/{totalTasks}</span>
            </div>
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "#B3FF3B" }} animate={{ width: `${(doneTasks / totalTasks) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
            </div>
          </div>

          {view === "list" ? (
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} onStartFocus={() => startFocus(task.id)} onNavigate={onNavigate} delay={0.3 + i * 0.04} />
              ))}
            </div>
          ) : (
            <MatrixView tasks={tasks} onToggle={toggleTask} onStartFocus={startFocus} />
          )}

          {/* Add task */}
          <AnimatePresence>
            {showNewTask ? (
              <motion.div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Plus className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                <input value={newTaskInput} onChange={e => setNewTaskInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addTask(); if (e.key === "Escape") setShowNewTask(false); }}
                  placeholder="What needs to get done?" className="flex-1 bg-transparent text-[13px] text-[#E8E8ED] outline-none placeholder-[#4B5563]" style={{ fontFamily: "var(--font-body)" }} autoFocus />
                <button onClick={addTask} className="text-[#B3FF3B] cursor-pointer text-[11px]" style={{ fontFamily: "var(--font-body)" }}>Add</button>
              </motion.div>
            ) : (
              <motion.button onClick={() => setShowNewTask(true)} className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl w-full cursor-pointer text-left"
                style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)" }} whileHover={{ background: "rgba(255,255,255,0.03)" }}>
                <Plus className="w-3.5 h-3.5 text-[#4B5563]" />
                <span className="text-[12px] text-[#4B5563]" style={{ fontFamily: "var(--font-body)" }}>Add task</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Weekly Retro Card (contextual) */}
        {isRetroDay && (
          <motion.div className="mt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.35, ease: EASE }}>
            <GlassCard delay={0.5}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)" }}><RotateCcw className="w-4 h-4 text-[#8B5CF6]" /></div>
                  <div>
                    <p className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>Weekly Retro</p>
                    <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{MOCK_RETRO.weekStats.tasksCompleted} tasks · {MOCK_RETRO.weekStats.focusHours}h focus · {MOCK_RETRO.weekStats.streakDays}-day streak</p>
                  </div>
                </div>
                <button onClick={() => setRetroOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)" }}>
                  <span className="text-[11px] text-[#8B5CF6]" style={{ fontFamily: "var(--font-body)" }}>Review</span>
                  <ChevronRight className="w-3 h-3 text-[#8B5CF6]" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {!isRetroDay && (
          <motion.div className="mt-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.35, ease: EASE }}>
            <button onClick={() => setRetroOpen(true)} className="flex items-center gap-2 text-[11px] text-[#4B5563] hover:text-[#6B7280] cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
              <RotateCcw className="w-3 h-3" /> Last week: {MOCK_RETRO.weekStats.tasksCompleted} tasks, {MOCK_RETRO.weekStats.focusHours}h focused <ChevronRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        <div className="h-20" />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {focusTask && !focusMinimized && focusTaskObj && <FocusTimer taskTitle={focusTaskObj.title} onEnd={endFocus} onMinimize={() => setFocusMinimized(true)} />}
      </AnimatePresence>
      <AnimatePresence>{goalsOpen && <GoalsPanel goals={MOCK_GOALS} onClose={() => setGoalsOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{retroOpen && <RetroPanel retro={MOCK_RETRO} onClose={() => setRetroOpen(false)} />}</AnimatePresence>
    </RoleShell>
  );
}
