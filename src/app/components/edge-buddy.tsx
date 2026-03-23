/**
 * EdgeBuddy — Ambient Focus Companion (EdgeStar only)
 *
 * Layer 4: EdgeBuddy ambient pattern.
 *
 * EdgeBuddy is a quiet, non-intrusive presence during deep work sessions
 * (TaskRoom, EdgePath). It:
 *   - Tracks session time automatically
 *   - Shows a focus streak and current milestone
 *   - Provides one-tap Sophia access without navigating away
 *   - Celebrates task completions with a brief pulse animation
 *   - Nudges break time after 45min of continuous work
 *
 * Design principles:
 *   - Ambient, not demanding. Never interrupts.
 *   - Minimizes to a 36px mark — almost invisible when not needed.
 *   - Expands on hover or tap. Contracts on any outward click.
 *   - Position: bottom-right, sits above the Sophia bottom bar.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { useSophia } from "./sophia-context";
import {
  Timer, Zap, Coffee, ChevronDown, Sparkles,
  CheckCircle2, Target, Flame, Users,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// Format seconds to M:SS
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Break nudge threshold (seconds)
const BREAK_NUDGE_AT = 45 * 60; // 45 minutes

interface EdgeBuddyProps {
  milestoneTitle: string;
  tasksCompleted?: number;
  totalTasks?: number;
  /** Called when EdgeBuddy asks Sophia — surfaces can intercept */
  onSophiaOpen?: (message: string) => void;
}

export function EdgeBuddy({
  milestoneTitle,
  tasksCompleted = 0,
  totalTasks = 0,
  onSophiaOpen,
}: EdgeBuddyProps) {
  const { openSophia } = useSophia();
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [paused, setPaused] = useState(false);
  const [breakNudge, setBreakNudge] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(tasksCompleted);
  const containerRef = useRef<HTMLDivElement>(null);

  // Delayed entrance — 2 seconds after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Session timer
  useEffect(() => {
    if (!visible || paused) return;
    const interval = setInterval(() => {
      setSessionSecs((s) => {
        const next = s + 1;
        if (next === BREAK_NUDGE_AT) setBreakNudge(true);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, paused]);

  // Celebrate task completion
  useEffect(() => {
    if (tasksCompleted > prevCompleted) {
      setCelebrated(true);
      setTimeout(() => setCelebrated(false), 2400);
    }
    setPrevCompleted(tasksCompleted);
  }, [tasksCompleted, prevCompleted]);

  // Close on outside click
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const handleSophia = (message: string) => {
    onSophiaOpen?.(message);
    openSophia(message);
    setExpanded(false);
  };

  if (!visible) return null;

  const progressPct = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
  const needsBreak = breakNudge && !paused;

  const QUICK_PROMPTS = [
    { label: "What should I focus on next?", icon: <Target className="w-3 h-3" /> },
    { label: "I'm stuck on this task", icon: <Sparkles className="w-3 h-3" /> },
    { label: "How long will this take?", icon: <Timer className="w-3 h-3" /> },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed z-[48]"
      style={{ bottom: 68, right: 20 }} // sits above 56px sophia bar + 12px gap
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          // ── Expanded card ───────────────────────────────────
          <motion.div
            key="expanded"
            className="w-[260px] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,12,16,0.96)",
              border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(var(--ce-shadow-tint),0.5), 0 0 0 1px rgba(var(--ce-role-edgestar-rgb),0.04)",
            }}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3.5 py-2.5"
              style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
            >
              <div className="flex items-center gap-2">
                <SophiaMark size={16} glowing={false} />
                <span
                  className="text-[11px] text-ce-cyan"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  EdgeBuddy
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors"
              >
                <ChevronDown className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              </button>
            </div>

            {/* Break nudge (if triggered) */}
            <AnimatePresence>
              {needsBreak && (
                <motion.div
                  className="flex items-center gap-2 px-3.5 py-2"
                  style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.05)", borderBottom: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.1)" }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Coffee className="w-3 h-3 text-[var(--ce-role-edgepreneur)] flex-shrink-0" />
                  <span className="text-[10px] text-[var(--ce-role-edgepreneur)]" style={{ fontFamily: "var(--font-body)" }}>
                    45min in — a 5 min break will improve focus
                  </span>
                  <button
                    onClick={() => { setBreakNudge(false); setPaused(true); setTimeout(() => setPaused(false), 5 * 60 * 1000); }}
                    className="ml-auto text-[9px] cursor-pointer px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.1)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}
                  >
                    Take it
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Celebration banner */}
            <AnimatePresence>
              {celebrated && (
                <motion.div
                  className="flex items-center justify-center gap-2 py-2"
                  style={{ background: "rgba(var(--ce-lime-rgb),0.05)", borderBottom: "1px solid rgba(var(--ce-lime-rgb),0.1)" }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-ce-lime" />
                  <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Task complete — nice work
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Session stats */}
            <div className="px-3.5 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              {/* Milestone name */}
              <p
                className="text-[11px] text-ce-text-tertiary mb-2.5 truncate"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {milestoneTitle}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <Timer className="w-3 h-3" />, label: "Session", value: formatTime(sessionSecs), color: paused ? "var(--ce-text-tertiary)" : "var(--ce-role-edgestar)" },
                  { icon: <Flame className="w-3 h-3" />, label: "Tasks", value: `${tasksCompleted}/${totalTasks}`, color: "var(--ce-lime)" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <div style={{ color: stat.color }}>{stat.icon}</div>
                    <span
                      className="text-[12px] tabular-nums"
                      style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
                {/* Pause / resume */}
                <button
                  onClick={() => setPaused(!paused)}
                  className="ml-auto text-[9px] cursor-pointer px-2 py-0.5 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
                  style={{ color: paused ? "var(--ce-role-edgestar)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
                >
                  {paused ? "Resume" : "Pause"}
                </button>
              </div>

              {/* Progress bar */}
              {totalTasks > 0 && (
                <div className="mt-2.5">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--ce-role-edgestar), var(--ce-lime))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <span className="text-[9px] text-[var(--ce-text-quaternary)] mt-1 block" style={{ fontFamily: "var(--font-body)" }}>
                    {progressPct}% of milestone complete
                  </span>
                </div>
              )}
            </div>

            {/* Quick Sophia prompts */}
            <div className="px-3.5 py-2.5">
              <span className="text-[9px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                QUICK HELP
              </span>
              <div className="flex flex-col gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSophia(p.label)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-left transition-colors group"
                    style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                  >
                    <div style={{ color: "var(--ce-text-quaternary)" }} className="group-hover:text-ce-cyan transition-colors flex-shrink-0">
                      {p.icon}
                    </div>
                    <span
                      className="text-[10px] text-ce-text-secondary group-hover:text-ce-text-primary transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buddy section — shows when paired */}
            {(() => {
              try {
                const bd = localStorage.getItem("ce-buddy");
                if (!bd) return null;
                const buddy = JSON.parse(bd);
                return (
                  <div className="px-3.5 py-2.5" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <span className="text-[9px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      YOUR BUDDY
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.12)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)" }}>
                        {buddy.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-ce-text-primary truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{buddy.name}</div>
                        <div className="text-[9px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{buddy.frequency} check-ins</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSophia(`Check in with ${buddy.name} — what should I update them on?`)}
                      className="mt-2 w-full py-1.5 rounded-md text-[10px] cursor-pointer transition-colors flex items-center justify-center gap-1"
                      style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", color: "var(--ce-role-edgestar)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", fontFamily: "var(--font-body)" }}
                    >
                      <Users className="w-3 h-3" />
                      Check in with {buddy.name.split(" ")[0]}
                    </button>
                  </div>
                );
              } catch { return null; }
            })()}
          </motion.div>
        ) : (
          // ── Minimized pill ──────────────────────────────────
          <motion.button
            key="minimized"
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer group"
            style={{
              background: "rgba(10,12,16,0.9)",
              border: `1px solid ${celebrated ? "rgba(var(--ce-lime-rgb),0.3)" : needsBreak ? "rgba(var(--ce-role-edgepreneur-rgb),0.25)" : "rgba(var(--ce-role-edgestar-rgb),0.12)"}`,
              backdropFilter: "blur(16px)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: celebrated
                ? ["0 0 0px rgba(var(--ce-lime-rgb),0)", "0 0 20px rgba(var(--ce-lime-rgb),0.2)", "0 0 0px rgba(var(--ce-lime-rgb),0)"]
                : needsBreak
                ? ["0 0 0px rgba(var(--ce-role-edgepreneur-rgb),0)", "0 0 16px rgba(var(--ce-role-edgepreneur-rgb),0.15)", "0 0 0px rgba(var(--ce-role-edgepreneur-rgb),0)"]
                : "0 0 0px rgba(var(--ce-shadow-tint),0)",
            }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
            title="EdgeBuddy — focus companion"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Animated dot */}
            <motion.div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: celebrated ? "var(--ce-lime)" : needsBreak ? "var(--ce-role-edgepreneur)" : paused ? "var(--ce-text-quaternary)" : "var(--ce-role-edgestar)",
              }}
              animate={{
                boxShadow: paused
                  ? "none"
                  : celebrated
                  ? ["0 0 3px rgba(var(--ce-lime-rgb),0.8)", "0 0 8px rgba(var(--ce-lime-rgb),0.4)", "0 0 3px rgba(var(--ce-lime-rgb),0.8)"]
                  : ["0 0 3px rgba(var(--ce-role-edgestar-rgb),0.8)", "0 0 6px rgba(var(--ce-role-edgestar-rgb),0.3)", "0 0 3px rgba(var(--ce-role-edgestar-rgb),0.8)"],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="text-[11px] tabular-nums"
              style={{ color: paused ? "var(--ce-text-quaternary)" : "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {formatTime(sessionSecs)}
            </span>
            <SophiaMark size={12} glowing={false} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
