/**
 * Task Room — Full-page workspace scoped to a single milestone.
 * Two-column: primary content left, context panel right.
 * Wired: ← EdgePath (entry), → ResumeEdge, → EdgeMatch, Sophia coaching.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import { EdgeBuddy } from "./edge-buddy";
import { SophiaCtx } from "./sophia-context";
import { SophiaAsk } from "./sophia-ask";
import {
  Check, Clock, BookOpen, ExternalLink, ChevronDown, ChevronRight,
  FileText, Briefcase, Users, Sparkles, Target, Play, Pause,
  ArrowRight, Compass, Send, Mic, X, GraduationCap,
  ChevronUp, Maximize2, Minimize2, MessageSquare, Calendar,
  Lock, Share2, Eye, ChevronLeft,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

type NavigateFn = (target: string) => void;

// ─── Types & Data ───────────────────────────────────────────────────────────

interface SubTask {
  id: string;
  label: string;
  done: boolean;
  estimatedMinutes: number;
}

interface Resource {
  id: string;
  type: "course" | "book" | "article" | "tool" | "video";
  title: string;
  relevanceNote: string;
  status: "not_started" | "viewed" | "completed";
}

interface CoachingMessage {
  id: string;
  role: "sophia" | "user";
  content: string;
}

interface CrossSurfaceLink {
  surface: string;
  icon: typeof FileText;
  note: string;
  route: string;
  actionLabel: string;
}

// Room data per milestone
const ROOMS: Record<string, {
  title: string;
  phase: string;
  primaryContentType: "learning" | "creation" | "action";
  subTasks: SubTask[];
  resources: Resource[];
  crossSurface: CrossSurfaceLink[];
  coaching: CoachingMessage[];
}> = {
  m6: {
    title: "Complete Interaction Design Module",
    phase: "Phase 2 — Skill Bridge",
    primaryContentType: "learning",
    subTasks: [
      { id: "st1", label: "Watch Module 1: Principles of Interaction", done: true, estimatedMinutes: 45 },
      { id: "st2", label: "Watch Module 2: Feedback & Affordances", done: true, estimatedMinutes: 40 },
      { id: "st3", label: "Watch Module 3: Microinteractions", done: true, estimatedMinutes: 35 },
      { id: "st4", label: "Complete Exercise Set A: Pattern Recognition", done: false, estimatedMinutes: 45 },
      { id: "st5", label: "Build Mini-Project: Redesign a modal flow", done: false, estimatedMinutes: 120 },
      { id: "st6", label: "Submit for review", done: false, estimatedMinutes: 15 },
    ],
    resources: [
      { id: "r1", type: "course", title: "Interaction Design Foundation — IDF", relevanceNote: "Core curriculum. Modules 1-6 cover everything for this milestone.", status: "viewed" },
      { id: "r2", type: "book", title: "Microinteractions by Dan Saffer", relevanceNote: "Chapter 3 is the most relevant to your Phase 2 goals — focus on trigger patterns.", status: "not_started" },
      { id: "r3", type: "video", title: "Steve Schoger — Refactoring UI Interactions", relevanceNote: "30 min video. Shows practical interaction design decisions in real projects.", status: "completed" },
      { id: "r4", type: "article", title: "Nielsen Norman: Interaction Design Principles", relevanceNote: "Reference article. Good for the quiz at the end of Module 5.", status: "not_started" },
      { id: "r5", type: "tool", title: "Figma — Prototyping Workspace", relevanceNote: "Use this for the mini-project. Template pre-loaded with the modal component set.", status: "viewed" },
    ],
    crossSurface: [
      { surface: "ResumeEdge", icon: FileText, note: "Your resume should mention this skill after completion. I'll draft the bullet.", route: "resume", actionLabel: "Update resume" },
      { surface: "EdgeMatch", icon: Briefcase, note: "3 saved jobs list interaction design as required. Completing this moves their match from 78% → 88%.", route: "jobs", actionLabel: "View matching jobs" },
      { surface: "EdgeGuide", icon: Users, note: "Alice left a note: 'Focus on the accessibility section — your target companies audit for WCAG.'", route: "synthesis", actionLabel: "View Alice's note" },
      { surface: "Messages", icon: MessageSquare, note: "Ask Alice about accessibility best practices — she specializes in WCAG compliance.", route: "messages", actionLabel: "Ask your mentor" },
      { surface: "Sessions", icon: Calendar, note: "You just completed 3 modules — book a debrief with Alice. Debriefs after milestones accelerate your next phase.", route: "sessions", actionLabel: "Book mentor session" },
    ],
    coaching: [
      { id: "c1", role: "sophia", content: "This module has 3 video sections, 1 exercise set, and a mini-project. Most people finish in about 4 hours across 2-3 sessions. The exercises in Module 3 are what hiring managers actually test for — so don't rush those." },
      { id: "c2", role: "sophia", content: "You're halfway through. You breezed through the videos — nice pace. The exercise set is where most people slow down. Tip: focus on the 'why' behind each pattern, not just the 'what.' That's what interviewers ask about." },
      { id: "c3", role: "user", content: "What's the difference between a trigger and an affordance?" },
      { id: "c4", role: "sophia", content: "An affordance is what the element CAN do — a button affords clicking, a slider affords dragging. A trigger is what INITIATES the interaction — the click, the hover, the scroll. Think of it this way: the affordance is the promise, the trigger is the action. For your modal redesign project, this matters because the modal needs clear affordances (the X button affords closing) and predictable triggers (clicking outside closes it)." },
    ],
  },
  m4: {
    title: "Build First Case Study",
    phase: "Phase 2 — Skill Bridge",
    primaryContentType: "creation",
    subTasks: [
      { id: "st1", label: "Select a product to redesign", done: true, estimatedMinutes: 30 },
      { id: "st2", label: "Document current UX issues", done: true, estimatedMinutes: 60 },
      { id: "st3", label: "Create user flow diagrams", done: true, estimatedMinutes: 90 },
      { id: "st4", label: "Design high-fidelity screens", done: true, estimatedMinutes: 180 },
      { id: "st5", label: "Write case study narrative", done: true, estimatedMinutes: 120 },
      { id: "st6", label: "Get portfolio feedback from mentor", done: true, estimatedMinutes: 30 },
    ],
    resources: [
      { id: "r1", type: "article", title: "How to Write a UX Case Study — Bestfolios", relevanceNote: "Template structure for narrative case studies.", status: "completed" },
      { id: "r2", type: "tool", title: "Figma — Case Study Template", relevanceNote: "Pre-built template with sections and placeholder content.", status: "completed" },
    ],
    crossSurface: [
      { surface: "ResumeEdge", icon: FileText, note: "Case study added to your portfolio section. Resume updated.", route: "resume", actionLabel: "View resume" },
    ],
    coaching: [
      { id: "c1", role: "sophia", content: "Case study complete. This is now your strongest portfolio piece. Recruiters at Figma and Vercel both value redesign case studies — this directly improves your match for 5 saved jobs." },
    ],
  },
};

// EdgePreneur business room variants
const PRENEUR_ROOMS: Record<string, {
  title: string; phase: string; primaryContentType: "learning" | "creation" | "action";
  subTasks: SubTask[]; resources: Resource[]; crossSurface: CrossSurfaceLink[]; coaching: CoachingMessage[];
}> = {
  "pitch-deck": {
    title: "Build Your Pitch Deck",
    phase: "Phase 1 — Validate & Pitch",
    primaryContentType: "creation",
    subTasks: [
      { id: "pt1", label: "Define the problem statement (1 slide)", done: true, estimatedMinutes: 45 },
      { id: "pt2", label: "Articulate your solution and differentiation", done: true, estimatedMinutes: 60 },
      { id: "pt3", label: "Build your market sizing (TAM/SAM/SOM)", done: false, estimatedMinutes: 90 },
      { id: "pt4", label: "Draft the business model slide", done: false, estimatedMinutes: 60 },
      { id: "pt5", label: "Assemble the team slide", done: false, estimatedMinutes: 30 },
      { id: "pt6", label: "Design the full deck in Figma/Canva", done: false, estimatedMinutes: 180 },
    ],
    resources: [
      { id: "pr1", type: "article", title: "YC's Guide to Pitch Decks", relevanceNote: "The definitive framework. Follow this structure.", status: "viewed" },
      { id: "pr2", type: "tool", title: "Pitch Deck Template — Figma", relevanceNote: "Template pre-loaded. 12 slides, editable.", status: "viewed" },
      { id: "pr3", type: "video", title: "AirBnB's Original Pitch Deck — Teardown", relevanceNote: "Best-in-class example of market sizing and storytelling.", status: "not_started" },
    ],
    crossSurface: [
      { surface: "Sessions", icon: Calendar, note: "Book a session with a YC founder mentor — pitch feedback is highest-value input right now.", route: "sessions", actionLabel: "Book mentor session" },
      { surface: "EdgeMatch", icon: Briefcase, note: "3 investor accelerators are actively looking for ventures in your space.", route: "jobs", actionLabel: "View opportunities" },
    ],
    coaching: [
      { id: "pc1", role: "sophia", content: "Your problem statement is sharp. Most founders over-explain — you're not. The market sizing is where you'll lose investors if you guess. Use bottom-up methodology: start with your first 100 customers, not the total market." },
    ],
  },
  "market-validation": {
    title: "Validate Market Demand",
    phase: "Phase 1 — Validate & Pitch",
    primaryContentType: "action",
    subTasks: [
      { id: "mv1", label: "Define your target customer persona", done: true, estimatedMinutes: 60 },
      { id: "mv2", label: "Run 10 customer discovery interviews", done: false, estimatedMinutes: 300 },
      { id: "mv3", label: "Synthesise interview findings into insights", done: false, estimatedMinutes: 90 },
      { id: "mv4", label: "Identify top 3 pain points to validate", done: false, estimatedMinutes: 45 },
      { id: "mv5", label: "Build a landing page to test demand", done: false, estimatedMinutes: 120 },
    ],
    resources: [
      { id: "mr1", type: "article", title: "The Mom Test by Rob Fitzpatrick", relevanceNote: "Read before any customer interview. Changes how you ask questions.", status: "not_started" },
      { id: "mr2", type: "tool", title: "Customer Interview Template", relevanceNote: "Pre-loaded with 8 validated questions for SaaS discovery.", status: "viewed" },
    ],
    crossSurface: [
      { surface: "Sessions", icon: Calendar, note: "A session with a startup advisor would help you structure your discovery interviews before you run them.", route: "sessions", actionLabel: "Book advisor session" },
    ],
    coaching: [
      { id: "mc1", role: "sophia", content: "Customer discovery is where most founders go wrong — they ask about features instead of problems. The goal is to understand their world, not pitch your solution. Ask about their last experience with this problem, not whether they'd use your product." },
    ],
  },
};

// Default room for unknown milestones
const DEFAULT_ROOM = {
  title: "Task Room",
  phase: "Phase 2",
  primaryContentType: "learning" as const,
  subTasks: [
    { id: "st1", label: "Get started", done: false, estimatedMinutes: 30 },
  ],
  resources: [],
  crossSurface: [],
  coaching: [
    { id: "c1", role: "sophia" as const, content: "This room is being assembled. Tell me more about what you're working on and I'll gather the right resources." },
  ],
};

// ─── Sub-task Checklist ─────────────────────────────────────────────────────

function SubTaskList({ tasks, onToggle }: { tasks: SubTask[]; onToggle: (id: string) => void }) {
  const doneCount = tasks.filter((t) => t.done).length;
  const totalMinutes = tasks.reduce((a, t) => a + t.estimatedMinutes, 0);
  const doneMinutes = tasks.filter((t) => t.done).reduce((a, t) => a + t.estimatedMinutes, 0);
  const progress = tasks.length > 0 ? doneCount / tasks.length : 0;

  // Find "up next"
  const nextTask = tasks.find((t) => !t.done);

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: progress === 1 ? "#B3FF3B" : "linear-gradient(90deg, #22D3EE, #B3FF3B)" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
        <span className="text-[11px] text-[#6B7280] tabular-nums flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>
          {doneCount}/{tasks.length}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SUB-TASKS</span>
        <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>
          {Math.round(doneMinutes / 60)}h done · {Math.round((totalMinutes - doneMinutes) / 60)}h remaining
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {tasks.map((task) => {
          const isNext = task.id === nextTask?.id;
          return (
            <motion.div
              key={task.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              style={{
                background: isNext ? "rgba(34,211,238,0.02)" : "transparent",
                border: `1px solid ${isNext ? "rgba(34,211,238,0.06)" : "transparent"}`,
              }}
              onClick={() => onToggle(task.id)}
              layout
            >
              <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{
                background: task.done ? "rgba(179,255,59,0.1)" : "transparent",
                border: `1.5px solid ${task.done ? "#B3FF3B" : isNext ? "#22D3EE" : "rgba(255,255,255,0.1)"}`,
                width: 18, height: 18,
              }}>
                {task.done && <Check className="w-2.5 h-2.5 text-[#B3FF3B]" />}
              </div>
              <span className={`text-[12px] flex-1 ${task.done ? "text-[#6B7280] line-through" : isNext ? "text-[#E8E8ED]" : "text-[#9CA3AF]"}`}
                style={{ fontFamily: "var(--font-body)" }}>
                {task.label}
              </span>
              <span className="text-[10px] text-[#374151] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                {task.estimatedMinutes < 60 ? `${task.estimatedMinutes}m` : `${(task.estimatedMinutes / 60).toFixed(1)}h`}
              </span>
              {isNext && (
                <span className="text-[9px] text-[#22D3EE] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,211,238,0.06)", fontFamily: "var(--font-body)" }}>
                  Up next
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Coaching Thread ───────────────────────────────────────────────────────

function CoachingThread({ messages, onSend }: { messages: CoachingMessage[]; onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div>
      <button className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <SophiaMark size={14} glowing={false} />
        <span className="text-[10px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA COACHING</span>
        {collapsed ? <ChevronDown className="w-3 h-3 text-[#374151]" /> : <ChevronUp className="w-3 h-3 text-[#374151]" />}
      </button>

      {!collapsed && (
        <>
          <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto mb-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl px-3 py-2.5 ${msg.role === "sophia" ? "" : "ml-6"}`}
                style={{
                  background: msg.role === "sophia" ? "rgba(34,211,238,0.02)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${msg.role === "sophia" ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.05)"}`,
                }}
              >
                {msg.role === "sophia" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <SophiaMark size={10} glowing={false} />
                    <span className="text-[9px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
                  </div>
                )}
                <p className="text-[12px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ask Sophia about this task..."
              className="flex-1 text-[12px] text-[#E8E8ED] placeholder:text-[#374151] bg-transparent outline-none"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors">
              <Mic className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
            <button
              className="p-1 rounded-md hover:bg-[rgba(34,211,238,0.06)] cursor-pointer transition-colors"
              onClick={handleSubmit}
            >
              <Send className="w-3.5 h-3.5 text-[#22D3EE]" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Resource Cards ─────────────────────────────────────────────────────────

function ResourceList({ resources }: { resources: Resource[] }) {
  const [collapsed, setCollapsed] = useState(false);

  const typeIcons: Record<string, typeof BookOpen> = {
    course: GraduationCap,
    book: BookOpen,
    article: FileText,
    tool: Target,
    video: Play,
  };

  const statusColors: Record<string, string> = {
    not_started: "#374151",
    viewed: "#22D3EE",
    completed: "#B3FF3B",
  };

  return (
    <div>
      <button className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
        <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>RESOURCES ({resources.length})</span>
        {collapsed ? <ChevronDown className="w-3 h-3 text-[#374151]" /> : <ChevronUp className="w-3 h-3 text-[#374151]" />}
      </button>

      {!collapsed && (
        <div className="flex flex-col gap-1.5">
          {resources.map((r) => {
            const RIcon = typeIcons[r.type] || BookOpen;
            return (
              <div
                key={r.id}
                className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.015)] cursor-pointer transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.03)" }}
              >
                <RIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: statusColors[r.status] }} />
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{r.title}</span>
                  <span className="text-[10px] text-[#6B7280] block mt-0.5 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{r.relevanceNote}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{
                    background: `${statusColors[r.status]}10`,
                    color: statusColors[r.status],
                    fontFamily: "var(--font-body)",
                  }}>
                    {r.status === "not_started" ? "New" : r.status === "viewed" ? "Viewed" : "Done"}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#374151]" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Cross Surface Connections ──────────────────────────────────────────────

function CrossSurfaceConnections({ links, onNavigate }: { links: CrossSurfaceLink[]; onNavigate: NavigateFn }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <Compass className="w-3.5 h-3.5 text-[#6B7280]" />
        <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CONNECTIONS ({links.length})</span>
        {collapsed ? <ChevronDown className="w-3 h-3 text-[#374151]" /> : <ChevronUp className="w-3 h-3 text-[#374151]" />}
      </button>

      {!collapsed && (
        <div className="flex flex-col gap-1.5">
          {links.map((link, i) => {
            const LIcon = link.icon;
            return (
              <button
                key={i}
                className="flex items-start gap-2.5 w-full px-3 py-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.015)] cursor-pointer transition-colors text-left"
                style={{ border: "1px solid rgba(255,255,255,0.03)" }}
                onClick={() => onNavigate(link.route)}
              >
                <LIcon className="w-3.5 h-3.5 text-[#22D3EE] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#22D3EE] block mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{link.surface}</span>
                  <span className="text-[11px] text-[#9CA3AF] block leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{link.note}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#374151] flex-shrink-0 mt-0.5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Primary Content Area ───────────────────────────────────────────────────

function PrimaryContent({ type, title, isComplete }: { type: "learning" | "creation" | "action"; title: string; isComplete: boolean }) {
  if (isComplete) {
    return (
      <motion.div
        className="rounded-2xl p-8 flex flex-col items-center justify-center h-full min-h-[400px]"
        style={{
          background: "linear-gradient(145deg, rgba(179,255,59,0.03), rgba(34,211,238,0.02))",
          border: "1px solid rgba(179,255,59,0.08)",
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(179,255,59,0.1)", border: "2px solid rgba(179,255,59,0.2)" }}>
          <Check className="w-8 h-8 text-[#B3FF3B]" />
        </div>
        <h3 className="text-[18px] text-[#E8E8ED] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Complete</h3>
        <p className="text-[13px] text-[#9CA3AF] text-center max-w-[360px]" style={{ fontFamily: "var(--font-body)" }}>
          This milestone is done. The skill has been added to your profile and Sophia will update your resume accordingly.
        </p>
      </motion.div>
    );
  }

  if (type === "learning") {
    return (
      <div className="flex flex-col gap-5 h-full">
        {/* Video player placeholder */}
        <motion.div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            aspectRatio: "16/9",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                style={{ background: "rgba(34,211,238,0.1)", border: "2px solid rgba(34,211,238,0.2)" }}>
                <Play className="w-6 h-6 text-[#22D3EE] ml-0.5" />
              </div>
              <span className="text-[13px] text-[#9CA3AF] mt-3" style={{ fontFamily: "var(--font-body)" }}>
                Module 3: Microinteractions
              </span>
              <span className="text-[11px] text-[#374151] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>35 min</span>
            </div>
          </div>

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="h-full rounded-full" style={{ width: "0%", background: "#22D3EE" }} />
          </div>
        </motion.div>

        {/* Notes area */}
        <motion.div
          className="rounded-xl p-4 flex-1"
          style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
        >
          <span className="text-[10px] text-[#374151] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>YOUR NOTES</span>
          <textarea
            className="w-full h-32 text-[12px] text-[#E8E8ED] placeholder:text-[#374151] bg-transparent outline-none resize-none leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
            placeholder="Take notes as you go through the module... Sophia can reference these later."
            defaultValue="Triggers vs affordances: trigger = action that starts interaction. Affordance = what the element CAN do.&#10;&#10;Key principle: make triggers obvious and affordances consistent."
          />
          <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>Auto-saved</span>
            <span className="flex items-center gap-1 text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>
              <Check className="w-2.5 h-2.5" /> Saved
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Creation type
  return (
    <motion.div
      className="rounded-2xl p-6 h-full min-h-[400px]"
      style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
    >
      <span className="text-[10px] text-[#374151] block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>WORKSPACE</span>
      <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
        Your creation workspace for this milestone. Upload files, write notes, and track your progress here.
      </p>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function TaskRoom({ onNavigate, milestoneId = "m6", role = "edgestar" }: { onNavigate: NavigateFn; milestoneId?: string; role?: string }) {
  // Pick the right room data based on role + milestoneId
  const isPreneurRoom = role === "edgepreneur";
  const preneurRoomId = milestoneId === "pitch-deck" || milestoneId === "market-validation" ? milestoneId : "pitch-deck";
  const roomData = isPreneurRoom
    ? PRENEUR_ROOMS[preneurRoomId]
    : (ROOMS[milestoneId] || DEFAULT_ROOM);
  const isParentView = role === "parent";

  const [subTasks, setSubTasks] = useState(roomData.subTasks);
  const [coaching, setCoaching] = useState(roomData.coaching);
  const [contextCollapsed, setContextCollapsed] = useState(false);
  const [shareWithMentor, setShareWithMentor] = useState<Record<string, boolean>>({});
  const [showOpenRoomsNudge, setShowOpenRoomsNudge] = useState(true);

  // Sophia state for task room (no RoleShell wrapper here)
  const [sophiaMsg, setSophiaMsg] = useState<string | null>(null);
  const [sophiaOpen, setSophiaOpen] = useState(false);

  const handleToggleTask = useCallback((id: string) => {
    setSubTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const handleSendCoaching = useCallback((msg: string) => {
    const userMsg: CoachingMessage = { id: `u${Date.now()}`, role: "user", content: msg };
    setCoaching((prev) => [...prev, userMsg]);

    // Simulate Sophia response
    setTimeout(() => {
      const sophiaMsg: CoachingMessage = {
        id: `s${Date.now()}`,
        role: "sophia",
        content: "Good question. Let me think about that in context of your current progress and target roles...",
      };
      setCoaching((prev) => [...prev, sophiaMsg]);
    }, 1200);
  }, []);

  const doneCount = subTasks.filter((t) => t.done).length;
  const progress = subTasks.length > 0 ? Math.round((doneCount / subTasks.length) * 100) : 0;
  const isComplete = doneCount === subTasks.length;

  const openSophia = (msg?: string) => { setSophiaMsg(msg ?? null); setSophiaOpen(true); };

  return (
    <SophiaCtx.Provider value={{ openSophia, openVoice: () => {} }}>
    <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
      <SophiaForwardBackground />

      {/* Breadcrumb header */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-14 z-40 flex items-center px-6 gap-3"
        style={{
          background: "rgba(8,9,12,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
        }}
        initial={{ y: -56 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("synthesis")}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(179,255,59,0.08)" }}>
            <Sparkles className="w-3.5 h-3.5 text-[#B3FF3B]" />
          </div>
          <span className="text-[14px] text-[#E8E8ED] tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CareerEdge</span>
        </div>

        <span className="text-[#374151] text-[12px]">›</span>
        <button onClick={() => onNavigate("edgepath")} className="text-[12px] text-[#6B7280] hover:text-[#9CA3AF] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
          <Compass className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />EdgePath
        </button>
        <span className="text-[#374151] text-[12px]">›</span>
        <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>Task Room</span>
      </motion.div>

    <div className="px-6 mt-14 pb-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Room Header */}
        <motion.div
          className="pt-6 pb-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: isComplete ? "rgba(179,255,59,0.1)" : "rgba(34,211,238,0.08)" }}>
                {isComplete ? <Check className="w-3.5 h-3.5 text-[#B3FF3B]" /> : <GraduationCap className="w-3.5 h-3.5 text-[#22D3EE]" />}
              </div>
              <h1 className="text-[18px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {roomData.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 ml-8">
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{roomData.phase}</span>
              <span className="text-[10px] text-[#374151]">•</span>
              <span className="text-[11px] tabular-nums" style={{ color: isComplete ? "#B3FF3B" : "#22D3EE", fontFamily: "var(--font-body)" }}>
                {progress}% complete
              </span>
              <span className="text-[10px] text-[#374151]">•</span>
              <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
                Last visited 2h ago
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visible exit — for users unfamiliar with breadcrumbs */}
            <button
              onClick={() => onNavigate("edgepath")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to roadmap
            </button>

            <button
              className="p-2 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => setContextCollapsed(!contextCollapsed)}
              title={contextCollapsed ? "Show context panel" : "Hide context panel"}
            >
              {contextCollapsed ? <Maximize2 className="w-4 h-4 text-[#6B7280]" /> : <Minimize2 className="w-4 h-4 text-[#6B7280]" />}
            </button>

            {isComplete && (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer transition-colors"
                style={{
                  background: "rgba(179,255,59,0.08)",
                  border: "1px solid rgba(179,255,59,0.15)",
                  color: "#B3FF3B",
                  fontFamily: "var(--font-display)", fontWeight: 500,
                }}
                onClick={() => onNavigate("edgepath")}
              >
                <Check className="w-3.5 h-3.5" /> Mark milestone complete
              </button>
            )}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: contextCollapsed ? "1fr" : "1fr 360px" }}>
          {/* Left: Primary Content */}
          <div className="flex flex-col gap-4">
            {/* Open Rooms nudge — appears when ≥1 task done and sessions cross-surface exists */}
            <AnimatePresence>
              {showOpenRoomsNudge && doneCount > 0 && roomData.crossSurface.some(l => l.surface === "Sessions") && (
                <motion.div
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.05), rgba(179,255,59,0.025))", border: "1px solid rgba(34,211,238,0.1)" }}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <SophiaMark size={16} glowing={false} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] text-[#E8E8ED] block mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Good progress — book a session while it's fresh
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>
                      Your mentor can review your work and help you move faster on the next milestone.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onNavigate("sessions")}
                      className="text-[11px] px-3 py-1.5 rounded-lg cursor-pointer"
                      style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.15)", color: "#22D3EE", fontFamily: "var(--font-body)" }}
                    >
                      Book session →
                    </button>
                    <button onClick={() => setShowOpenRoomsNudge(false)} className="cursor-pointer">
                      <X className="w-3.5 h-3.5 text-[#374151]" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <PrimaryContent type={roomData.primaryContentType} title={roomData.title} isComplete={isComplete} />
          </div>

          {/* Right: Context Panel */}
          {!contextCollapsed && (
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
            >
              {/* Sub-tasks */}
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <SubTaskList tasks={subTasks} onToggle={handleToggleTask} />
              </div>

              {/* Coaching Thread with share-with-mentor toggle */}
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA COACHING</span>
                  <button
                    onClick={() => setShareWithMentor(prev => ({ ...prev, all: !prev.all }))}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer transition-colors"
                    style={{
                      background: shareWithMentor.all ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${shareWithMentor.all ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <Share2 className="w-2.5 h-2.5" style={{ color: shareWithMentor.all ? "#22D3EE" : "#374151" }} />
                    <span className="text-[9px]" style={{ color: shareWithMentor.all ? "#22D3EE" : "#374151", fontFamily: "var(--font-body)" }}>
                      {shareWithMentor.all ? "Shared with mentor" : "Share with mentor"}
                    </span>
                  </button>
                </div>
                {shareWithMentor.all && (
                  <motion.div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mb-2"
                    style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.08)" }}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <Users className="w-3 h-3 text-[#22D3EE]" />
                    <span className="text-[10px] text-[#22D3EE]" style={{ fontFamily: "var(--font-body)" }}>Alice Chen can see this thread · She'll be notified</span>
                  </motion.div>
                )}
                <CoachingThread messages={coaching} onSend={handleSendCoaching} />
              </div>

              {/* Resources */}
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <ResourceList resources={roomData.resources} />
              </div>

              {/* Cross-surface connections */}
              {roomData.crossSurface.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <CrossSurfaceConnections links={roomData.crossSurface} onNavigate={onNavigate} />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
    {/* EdgeBuddy — ambient focus companion (EdgeStar only) */}
    {role === "edgestar" && (
      <EdgeBuddy
        milestoneTitle={roomData.title}
        tasksCompleted={doneCount}
        totalTasks={subTasks.length}
        onSophiaOpen={openSophia}
      />
    )}

    {/* Sophia panel for EdgeBuddy quick prompts */}
    <SophiaAsk
      isOpen={sophiaOpen}
      onClose={() => { setSophiaOpen(false); setSophiaMsg(null); }}
      mode="panel"
      initialMessage={sophiaMsg}
      onClearInitial={() => setSophiaMsg(null)}
      onNavigate={onNavigate}
    />
    </div>
    </SophiaCtx.Provider>
  );
}