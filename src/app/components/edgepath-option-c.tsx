/**
 * EdgePath — Option C: Mind Map / Canvas Mode
 * 
 * Spatial visualization of the career roadmap as a node graph.
 * Phases as primary nodes, milestones as sub-nodes, path forks
 * as diverging branches. Flora canvas DNA + Weavy node connections.
 * 
 * This is the EXPLORATION/EDITING view:
 * - See the full journey spatially
 * - Choose between path forks
 * - Understand connections between milestones, skills, and outcomes
 * - Click a milestone node → opens Task Room embryo panel
 * 
 * The list view (Options A/B) is the EXECUTION view.
 * This is the PLANNING view.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import {
  Compass, Check, Sparkles, Zap, Star,
  Bell, Home, FileText, Search, MessageSquare,
  MoreHorizontal, ChevronRight, X,
  Clock, BookOpen, ExternalLink, Briefcase,
  Target, GraduationCap, Users, TrendingUp,
  Lock, GitBranch, ArrowRight, Maximize2, Minimize2,
  ZoomIn, ZoomOut, Move,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Data Model with Paths ──────────────────────────────────────────────────

interface MilestoneNode {
  id: string;
  label: string;
  status: "done" | "current" | "upcoming" | "locked";
  time: string;
  category: "skill" | "action" | "resource";
  sophiaNote?: string;
  resources?: { label: string; type: string; url?: string }[];
  crossSurface?: { surface: string; note: string; icon: string }[];
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
  chosenPath?: string; // path id if chosen
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
      id: "p1a",
      label: "Self-Directed Research",
      matchPct: 95,
      recommended: true,
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
        id: "p2a",
        label: "Accelerated Hybrid Bootcamp",
        matchPct: 95,
        recommended: true,
        sophiaReason: "Directly matches your preference for hybrid study and moderate budget. Builds on your Fine Arts degree with practical software skills — fastest route to portfolio and job placement.",
        milestones: [
          { id: "p2m1", label: "Complete Figma fundamentals", status: "done", time: "8h", category: "skill" },
          { id: "p2m2", label: "Design system principles", status: "done", time: "6h", category: "skill" },
          { id: "p2m3", label: "UX research foundations", status: "done", time: "10h", category: "skill" },
          { id: "p2m4", label: "Build first case study", status: "done", time: "12h", category: "action" },
          { id: "p2m5", label: "Portfolio feedback from mentor", status: "done", time: "2h", category: "action" },
          {
            id: "p2m6", label: "Interaction design module", status: "current", time: "8h", category: "skill",
            sophiaNote: "6 of 8 target companies list interaction design as required. Prioritize this over motion design.",
            resources: [
              { label: "Interaction Design Foundation", type: "course" },
              { label: "Microinteractions — Dan Saffer", type: "book" },
            ],
            crossSurface: [
              { surface: "ResumeEdge", note: "Resume needs update after this skill", icon: "file" },
              { surface: "EdgeMatch", note: "3 jobs require this skill", icon: "briefcase" },
              { surface: "EdgeGuide", note: "Alice left feedback on your approach", icon: "users" },
            ],
          },
          {
            id: "p2m7", label: "Case study #2 (redesign)", status: "upcoming", time: "15h", category: "action",
            sophiaNote: "Pick a product you use daily. Recruiters value deep understanding over flashy visuals.",
          },
          { id: "p2m8", label: "Portfolio ATS optimization", status: "upcoming", time: "1h", category: "resource" },
        ],
      },
      {
        id: "p2b",
        label: "Formal Post-Graduate Path",
        matchPct: 65,
        recommended: false,
        sophiaReason: "Offers deep knowledge and prestige, but significant time and financial commitment. May exceed your moderate budget. Less flexibility and less aligned with your hybrid study preference.",
        milestones: [
          { id: "p2bm1", label: "Research PGD programs", status: "upcoming", time: "6h", category: "action" },
          { id: "p2bm2", label: "Apply to top 3 programs", status: "upcoming", time: "10h", category: "action" },
          { id: "p2bm3", label: "Secure funding/scholarship", status: "upcoming", time: "8h", category: "resource" },
          { id: "p2bm4", label: "Complete semester 1 coursework", status: "upcoming", time: "200h", category: "skill" },
          { id: "p2bm5", label: "Academic portfolio", status: "upcoming", time: "40h", category: "action" },
        ],
      },
      {
        id: "p2c",
        label: "Self-Taught + Mentorship",
        matchPct: 78,
        recommended: false,
        sophiaReason: "Maximum flexibility and lowest cost. Requires strong self-discipline. Pairs well with your EdgeGuide sessions but slower to build credibility.",
        milestones: [
          { id: "p2cm1", label: "Curate learning curriculum", status: "upcoming", time: "4h", category: "action" },
          { id: "p2cm2", label: "Weekly mentor check-ins", status: "upcoming", time: "1h/wk", category: "resource" },
          { id: "p2cm3", label: "Daily practice challenges", status: "upcoming", time: "2h/day", category: "skill" },
          { id: "p2cm4", label: "Open source contributions", status: "upcoming", time: "20h", category: "action" },
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
      id: "p3a",
      label: "Portfolio Sprint",
      matchPct: 0,
      recommended: true,
      sophiaReason: "",
      milestones: [
        { id: "p3m1", label: "3 complete case studies", status: "locked", time: "30h", category: "action" },
        { id: "p3m2", label: "Personal brand website", status: "locked", time: "12h", category: "action" },
        { id: "p3m3", label: "Design community presence", status: "locked", time: "8h", category: "action" },
      ],
    }],
  },
  {
    id: 4,
    title: "Interview & Close",
    weeks: "Weeks 14–18",
    status: "locked",
    paths: [{
      id: "p4a",
      label: "Job Search",
      matchPct: 0,
      recommended: true,
      sophiaReason: "",
      milestones: [
        { id: "p4m1", label: "Interview preparation", status: "locked", time: "10h", category: "skill" },
        { id: "p4m2", label: "Design challenge practice", status: "locked", time: "15h", category: "skill" },
        { id: "p4m3", label: "Apply to target companies", status: "locked", time: "8h", category: "action" },
      ],
    }],
  },
];

// ─── Layout Constants ───────────────────────────────────────────────────────

const PHASE_SPACING_X = 320;
const PHASE_START_X = 120;
const PHASE_Y = 280;
const MILESTONE_OFFSET_Y = 80;
const MILESTONE_SPACING_Y = 52;
const PATH_BRANCH_OFFSET_X = -40;
const PATH_SPACING_Y = 220;

// ─── Top Nav ────────────────────────────────────────────────────────────────

const NAV_PILLS = [
  { id: "home", label: "Home", icon: Home },
  { id: "roadmap", label: "EdgePath", icon: Compass },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Search, badge: 23 },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
];

function TopNav() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-6"
      style={{
        background: "rgba(8,9,12,0.85)",
        borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.08)" }}>
          <Sparkles className="w-3.5 h-3.5 text-ce-lime" />
        </div>
        <span className="text-[14px] text-ce-text-primary tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CareerEdge</span>
      </div>

      <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        {NAV_PILLS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "roadmap";
          return (
            <button key={item.id} className="relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors">
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
                  layoutId="ep-nav-pill-c"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: isActive ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)" }} />
                <span className={`text-[13px] ${isActive ? "text-ce-text-primary" : "text-ce-text-tertiary"}`} style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                    background: isActive ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)",
                    color: isActive ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
                  }}>{item.badge}</span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(var(--ce-lime-rgb),0.06)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)" }}>
          <Zap className="w-3 h-3 text-ce-lime" />
          <span className="text-[11px] text-ce-lime tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>45</span>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
          <Bell className="w-4 h-4 text-ce-text-tertiary" />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.15), rgba(var(--ce-lime-rgb),0.1))", border: "1.5px solid rgba(var(--ce-glass-tint),0.08)" }}>
          <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>S</span>
        </div>
      </div>
    </motion.header>
  );
}

// ─── Task Room Panel (Slide-in detail for selected milestone) ───────────────

function TaskRoomPanel({
  milestone,
  onClose,
}: {
  milestone: MilestoneNode | null;
  onClose: () => void;
}) {
  if (!milestone) return null;

  const catColors = { skill: "var(--ce-role-edgestar)", action: "var(--ce-lime)", resource: "var(--ce-text-secondary)" };
  const catIcons = { skill: GraduationCap, action: Target, resource: BookOpen };
  const CatIcon = catIcons[milestone.category];
  const surfaceIcons: Record<string, any> = { file: FileText, briefcase: Briefcase, users: Users };

  return (
    <motion.div
      className="fixed top-14 right-0 bottom-0 w-[380px] z-30 flex flex-col"
      style={{
        background: "rgba(12,14,18,0.95)",
        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ x: 380 }}
      animate={{ x: 0 }}
      exit={{ x: 380 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-center gap-2">
          <CatIcon className="w-4 h-4" style={{ color: catColors[milestone.category] }} />
          <span className="text-[11px] px-2 py-0.5 rounded" style={{
            background: `${catColors[milestone.category]}10`,
            color: catColors[milestone.category],
            fontFamily: "var(--font-body)",
          }}>
            {milestone.category}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors">
          <X className="w-4 h-4 text-ce-text-tertiary" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-5 py-4">
        <h3 className="text-[16px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {milestone.label}
        </h3>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1 text-[var(--ce-text-quaternary)]">
            <Clock className="w-3 h-3" />
            <span className="text-[11px] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{milestone.time}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${milestone.status === "done" ? "text-ce-lime" : milestone.status === "current" ? "text-ce-cyan" : "text-ce-text-tertiary"}`}
            style={{ background: milestone.status === "done" ? "rgba(var(--ce-lime-rgb),0.06)" : milestone.status === "current" ? "rgba(var(--ce-role-edgestar-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.03)" }}>
            {milestone.status === "done" ? "Complete" : milestone.status === "current" ? "Up next" : "Upcoming"}
          </span>
        </div>

        {/* Sophia Note */}
        {milestone.sophiaNote && (
          <div className="mb-5 px-4 py-3 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
            <div className="flex items-center gap-2 mb-2">
              <SophiaMark size={14} glowing={false} />
              <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
            </div>
            <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {milestone.sophiaNote}
            </p>
          </div>
        )}

        {/* Resources */}
        {milestone.resources && milestone.resources.length > 0 && (
          <div className="mb-5">
            <span className="text-[11px] text-ce-text-tertiary mb-2 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Resources</span>
            <div className="flex flex-col gap-2">
              {milestone.resources.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
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

        {/* Cross-Surface Connections (Task Room embryo) */}
        {milestone.crossSurface && milestone.crossSurface.length > 0 && (
          <div className="mb-5">
            <span className="text-[11px] text-ce-text-tertiary mb-2 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Connected Surfaces</span>
            <div className="flex flex-col gap-2">
              {milestone.crossSurface.map((cs, i) => {
                const SIcon = surfaceIcons[cs.icon] || FileText;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <SIcon className="w-3.5 h-3.5 text-ce-cyan" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{cs.surface}</span>
                      <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{cs.note}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        {milestone.status === "current" && (
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[12px] hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, rgba(var(--ce-cyan-rgb),0.1), rgba(var(--ce-cyan-rgb),0.05))", border: "1px solid rgba(var(--ce-cyan-rgb),0.15)", color: "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <Sparkles className="w-3.5 h-3.5 text-ce-cyan" /> Start this milestone
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Path Selection Panel ───────────────────────────────────────────────────

function PathSelectionPanel({
  phase,
  onClose,
  onChoosePath,
}: {
  phase: PhaseNode;
  onClose: () => void;
  onChoosePath: (phaseId: number, pathId: string) => void;
}) {
  return (
    <motion.div
      className="fixed top-14 right-0 bottom-0 w-[420px] z-30 flex flex-col"
      style={{
        background: "rgba(12,14,18,0.95)",
        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        backdropFilter: "blur(20px)",
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
            Phase {phase.id}: Choose Your Path
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)]">
          <X className="w-4 h-4 text-ce-text-tertiary" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        <p className="text-[12px] text-ce-text-tertiary mb-5" style={{ fontFamily: "var(--font-body)" }}>
          {phase.paths.length} pathways available for <span className="text-ce-text-primary">{phase.title}</span>. Sophia recommends the highest-match option.
        </p>

        <div className="flex flex-col gap-4">
          {phase.paths
            .sort((a, b) => b.matchPct - a.matchPct)
            .map((path, i) => {
              const isChosen = phase.chosenPath === path.id;
              return (
                <motion.div
                  key={path.id}
                  className="rounded-xl p-4 cursor-pointer transition-all duration-200"
                  style={{
                    background: isChosen
                      ? "rgba(var(--ce-role-edgestar-rgb),0.04)"
                      : "rgba(var(--ce-glass-tint),0.02)",
                    border: `1px solid ${isChosen ? "rgba(var(--ce-role-edgestar-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.04)"}`,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }}
                  onClick={() => onChoosePath(phase.id, path.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {path.recommended && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full text-ce-lime" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                          <Star className="w-2.5 h-2.5 inline mr-0.5" /> Recommended
                        </span>
                      )}
                      {isChosen && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full text-ce-cyan" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                          Active
                        </span>
                      )}
                    </div>
                    {path.matchPct > 0 && (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: `2px solid ${path.matchPct >= 90 ? "var(--ce-lime)" : path.matchPct >= 70 ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)"}` }}>
                        <span className="text-[11px] tabular-nums" style={{ color: path.matchPct >= 90 ? "var(--ce-lime)" : path.matchPct >= 70 ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {path.matchPct}%
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-[14px] text-ce-text-primary mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{path.label}</h4>

                  {path.sophiaReason && (
                    <div className="flex gap-2 mb-3">
                      <SophiaMark size={12} glowing={false} />
                      <p className="text-[11px] text-ce-text-tertiary leading-relaxed italic" style={{ fontFamily: "var(--font-body)" }}>
                        {path.sophiaReason}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                    <span>{path.milestones.length} milestones</span>
                    <span>·</span>
                    <span>{path.milestones.filter((m) => m.status === "done").length} complete</span>
                  </div>

                  {!isChosen && (
                    <button
                      className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
                      style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                      onClick={(e) => { e.stopPropagation(); onChoosePath(phase.id, path.id); }}
                    >
                      <ArrowRight className="w-3 h-3" /> Choose This Path
                    </button>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Canvas (Mind Map) ──────────────────────────────────────────────────────

function MindMapCanvas() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneNode | null>(null);
  const [selectedPhaseForPaths, setSelectedPhaseForPaths] = useState<PhaseNode | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number>(2);
  const [data, setData] = useState(ROADMAP_DATA);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleChoosePath = useCallback((phaseId: number, pathId: string) => {
    setData((prev) =>
      prev.map((p) => (p.id === phaseId ? { ...p, chosenPath: pathId } : p))
    );
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  // Calculate positions for each node
  const getPhasePosition = (phase: PhaseNode) => ({
    x: PHASE_START_X + (phase.id - 1) * PHASE_SPACING_X,
    y: PHASE_Y,
  });

  const getActivePaths = (phase: PhaseNode) => {
    if (phase.paths.length <= 1) return phase.paths;
    return phase.paths;
  };

  const getMilestonePosition = (phase: PhaseNode, pathIndex: number, milestoneIndex: number, totalPaths: number) => {
    const phasePos = getPhasePosition(phase);
    const pathOffset = totalPaths > 1
      ? (pathIndex - (totalPaths - 1) / 2) * PATH_SPACING_Y
      : 0;

    return {
      x: phasePos.x + PATH_BRANCH_OFFSET_X + milestoneIndex * 46,
      y: phasePos.y + MILESTONE_OFFSET_Y + pathOffset,
    };
  };

  // Build SVG connection lines
  const renderConnections = () => {
    const lines: JSX.Element[] = [];

    data.forEach((phase, pi) => {
      const phasePos = getPhasePosition(phase);

      // Phase-to-phase connections
      if (pi < data.length - 1) {
        const nextPos = getPhasePosition(data[pi + 1]);
        const isComplete = phase.status === "complete";
        lines.push(
          <motion.line
            key={`phase-${phase.id}-to-${data[pi + 1].id}`}
            x1={phasePos.x + 24}
            y1={phasePos.y}
            x2={nextPos.x - 24}
            y2={nextPos.y}
            stroke={isComplete ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.06)"}
            strokeWidth={isComplete ? 2 : 1.5}
            strokeDasharray={isComplete ? undefined : "6 4"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + pi * 0.2, duration: 0.6, ease: EASE }}
          />
        );
      }

      // Phase to milestones / path branches
      if (phase.id === expandedPhase) {
        const paths = getActivePaths(phase);
        paths.forEach((path, pathIdx) => {
          const isChosen = phase.chosenPath === path.id;
          const isOnlyPath = paths.length === 1;
          const firstMilestonePos = getMilestonePosition(phase, pathIdx, 0, paths.length);

          // Branch line from phase to path start
          lines.push(
            <motion.path
              key={`branch-${phase.id}-${path.id}`}
              d={`M ${phasePos.x} ${phasePos.y + 24} C ${phasePos.x} ${phasePos.y + 50}, ${firstMilestonePos.x} ${firstMilestonePos.y - 20}, ${firstMilestonePos.x} ${firstMilestonePos.y}`}
              fill="none"
              stroke={isChosen || isOnlyPath ? "var(--ce-role-edgestar)" : "rgba(var(--ce-glass-tint),0.08)"}
              strokeWidth={isChosen || isOnlyPath ? 1.5 : 1}
              strokeDasharray={isChosen || isOnlyPath ? undefined : "4 3"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + pathIdx * 0.15, duration: 0.5, ease: EASE }}
            />
          );

          // Milestone-to-milestone connections
          path.milestones.forEach((m, mi) => {
            if (mi < path.milestones.length - 1) {
              const pos = getMilestonePosition(phase, pathIdx, mi, paths.length);
              const nextPos = getMilestonePosition(phase, pathIdx, mi + 1, paths.length);
              lines.push(
                <motion.line
                  key={`ms-${m.id}-to-${path.milestones[mi + 1].id}`}
                  x1={pos.x + 10}
                  y1={pos.y}
                  x2={nextPos.x - 10}
                  y2={nextPos.y}
                  stroke={m.status === "done" ? "rgba(var(--ce-lime-rgb),0.2)" : isChosen || isOnlyPath ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)"}
                  strokeWidth={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.7 + mi * 0.05, duration: 0.3, ease: EASE }}
                />
              );
            }
          });
        });
      }
    });

    return lines;
  };

  // Render phase nodes
  const renderPhaseNodes = () => {
    return data.map((phase) => {
      const pos = getPhasePosition(phase);
      const isExpanded = phase.id === expandedPhase;
      const isComplete = phase.status === "complete";
      const isActive = phase.status === "active";
      const isLocked = phase.status === "locked";
      const hasPaths = phase.paths.length > 1;

      return (
        <motion.div
          key={`phase-node-${phase.id}`}
          className="absolute cursor-pointer"
          style={{
            left: pos.x - 28,
            top: pos.y - 28,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 + phase.id * 0.1, duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => {
            if (!isLocked) setExpandedPhase(phase.id);
          }}
        >
          {/* Node circle */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: isComplete
                ? "rgba(var(--ce-lime-rgb),0.1)"
                : isActive
                  ? "rgba(var(--ce-role-edgestar-rgb),0.08)"
                  : "rgba(var(--ce-glass-tint),0.03)",
              border: `2.5px solid ${isComplete
                ? "var(--ce-lime)"
                : isActive
                  ? "var(--ce-role-edgestar)"
                  : isLocked
                    ? "rgba(var(--ce-glass-tint),0.04)"
                    : "rgba(var(--ce-glass-tint),0.08)"
                }`,
              boxShadow: isActive
                ? "0 0 24px rgba(var(--ce-role-edgestar-rgb),0.15), 0 0 48px rgba(var(--ce-role-edgestar-rgb),0.05)"
                : isComplete
                  ? "0 0 16px rgba(var(--ce-lime-rgb),0.08)"
                  : "none",
            }}
          >
            {isComplete ? (
              <Check className="w-5 h-5 text-ce-lime" />
            ) : isActive ? (
              <motion.div
                className="w-3 h-3 rounded-full bg-[var(--ce-role-edgestar)]"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
            ) : (
              <span className="text-[14px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{phase.id}</span>
            )}
          </div>

          {/* Phase label below */}
          <div className="absolute top-[62px] left-1/2 -translate-x-1/2 text-center w-[140px]">
            <span className={`text-[12px] block ${isActive ? "text-ce-text-primary" : isComplete ? "text-ce-text-secondary" : "text-ce-text-tertiary"}`}
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {phase.title}
            </span>
            <span className="text-[10px] text-[var(--ce-text-quaternary)] block" style={{ fontFamily: "var(--font-body)" }}>
              {phase.weeks}
            </span>
            {hasPaths && (
              <button
                className="mt-1 flex items-center gap-1 mx-auto text-[9px] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] transition-colors"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhaseForPaths(phase);
                }}
              >
                <GitBranch className="w-2.5 h-2.5" />
                {phase.paths.length} paths
              </button>
            )}
          </div>
        </motion.div>
      );
    });
  };

  // Render milestone nodes for expanded phase
  const renderMilestoneNodes = () => {
    const phase = data.find((p) => p.id === expandedPhase);
    if (!phase) return null;

    const paths = getActivePaths(phase);

    return paths.map((path, pathIdx) => {
      const isChosen = phase.chosenPath === path.id;
      const isOnlyPath = paths.length === 1;
      const showPath = isChosen || isOnlyPath;

      return (
        <div key={`path-${path.id}`}>
          {/* Path label */}
          {paths.length > 1 && (
            <motion.div
              className="absolute"
              style={{
                left: getMilestonePosition(phase, pathIdx, 0, paths.length).x - 20,
                top: getMilestonePosition(phase, pathIdx, 0, paths.length).y - 28,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3, ease: EASE }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
                  background: isChosen ? "rgba(var(--ce-role-edgestar-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.03)",
                  color: isChosen ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
                  border: `1px solid ${isChosen ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)"}`,
                  fontFamily: "var(--font-body)",
                }}>
                  {path.label}
                  {path.matchPct > 0 && ` · ${path.matchPct}%`}
                </span>
                {path.recommended && (
                  <Star className="w-2.5 h-2.5 text-ce-lime fill-[var(--ce-lime)]" />
                )}
              </div>
            </motion.div>
          )}

          {/* Milestone nodes */}
          {path.milestones.map((milestone, mi) => {
            const pos = getMilestonePosition(phase, pathIdx, mi, paths.length);
            const isDone = milestone.status === "done";
            const isCurrent = milestone.status === "current";
            const dimmed = !showPath && paths.length > 1;

            return (
              <motion.div
                key={`ms-node-${milestone.id}`}
                className="absolute cursor-pointer group"
                style={{
                  left: pos.x - 10,
                  top: pos.y - 10,
                  opacity: dimmed ? 0.3 : 1,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: dimmed ? 0.3 : 1 }}
                transition={{ delay: 0.6 + mi * 0.04, duration: 0.3, type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => {
                  if (showPath || paths.length === 1) setSelectedMilestone(milestone);
                }}
              >
                {/* Node dot */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isDone
                      ? "rgba(var(--ce-lime-rgb),0.15)"
                      : isCurrent
                        ? "rgba(var(--ce-role-edgestar-rgb),0.1)"
                        : "rgba(var(--ce-glass-tint),0.03)",
                    border: `2px solid ${isDone
                      ? "var(--ce-lime)"
                      : isCurrent
                        ? "var(--ce-role-edgestar)"
                        : "rgba(var(--ce-glass-tint),0.08)"
                      }`,
                    boxShadow: isCurrent ? "0 0 12px rgba(var(--ce-role-edgestar-rgb),0.2)" : "none",
                  }}
                >
                  {isDone && <Check className="w-2.5 h-2.5 text-ce-lime" />}
                  {isCurrent && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)]"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Tooltip label */}
                <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[120px] text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="px-2.5 py-1.5 rounded-lg text-[10px] text-ce-text-primary whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ background: "rgba(12,14,18,0.95)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)", backdropFilter: "blur(8px)" }}>
                    {milestone.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      );
    });
  };

  const canvasWidth = PHASE_START_X + data.length * PHASE_SPACING_X + 200;
  const canvasHeight = PHASE_Y + PATH_SPACING_Y + 200;

  return (
    <div className="relative flex-1 overflow-hidden" style={{ cursor: isPanning ? "grabbing" : "grab" }}>
      {/* Dot grid background */}
      <div className="absolute inset-0 canvas-bg" style={{
        backgroundImage: "radial-gradient(circle, rgba(var(--ce-glass-tint),0.02) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      {/* Canvas surface */}
      <div
        ref={canvasRef}
        className="absolute inset-0 canvas-bg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: canvasWidth,
            height: canvasHeight,
            position: "relative",
          }}
        >
          {/* SVG Layer for connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasWidth}
            height={canvasHeight}
            style={{ overflow: "visible" }}
          >
            {renderConnections()}
          </svg>

          {/* HTML Layer for nodes */}
          {renderPhaseNodes()}
          {renderMilestoneNodes()}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 left-6 flex items-center gap-1 p-1 rounded-xl z-20" style={{ background: "rgba(10,12,16,0.8)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(12px)" }}>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
          onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
        >
          <ZoomIn className="w-3.5 h-3.5 text-ce-text-secondary" />
        </button>
        <span className="text-[10px] text-ce-text-tertiary px-2 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
        >
          <ZoomOut className="w-3.5 h-3.5 text-ce-text-secondary" />
        </button>
        <div className="w-[1px] h-4 bg-[rgba(var(--ce-glass-tint),0.06)] mx-1" />
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        >
          <Maximize2 className="w-3.5 h-3.5 text-ce-text-secondary" />
        </button>
      </div>

      {/* Legend */}
      <motion.div
        className="absolute top-4 left-6 flex items-center gap-4 px-4 py-2.5 rounded-xl z-20"
        style={{ background: "rgba(10,12,16,0.8)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        {[
          { color: "var(--ce-lime)", label: "Complete" },
          { color: "var(--ce-role-edgestar)", label: "Active" },
          { color: "var(--ce-text-tertiary)", label: "Upcoming" },
          { color: "var(--ce-text-quaternary)", label: "Locked" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span className="text-[10px]" style={{ color: item.color, fontFamily: "var(--font-body)" }}>{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Side panels */}
      <AnimatePresence>
        {selectedMilestone && (
          <TaskRoomPanel
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
          />
        )}
        {selectedPhaseForPaths && !selectedMilestone && (
          <PathSelectionPanel
            phase={selectedPhaseForPaths}
            onClose={() => setSelectedPhaseForPaths(null)}
            onChoosePath={(phaseId, pathId) => {
              handleChoosePath(phaseId, pathId);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sophia Bottom Bar ──────────────────────────────────────────────────────

function SophiaBottomBar() {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-4 px-6 h-14"
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
          Click a phase to explore milestones. Click a milestone for details. Click
          <GitBranch className="w-3 h-3 inline mx-1 text-ce-cyan" />
          to compare paths.
        </span>
      </div>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] transition-colors" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}>
        <Sparkles className="w-3.5 h-3.5 text-ce-cyan" />
        <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia</span>
      </button>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function EdgePathOptionC() {
  return (
    <div className="h-screen w-full flex flex-col" style={{ backgroundColor: "var(--ce-void)" }}>
      <SophiaForwardBackground />
      <TopNav />
      <SophiaBottomBar />

      {/* Roadmap Header bar */}
      <motion.div
        className="mt-14 flex items-center justify-between px-6 py-3 z-10 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Revenue Ops Manager <span className="text-[var(--ce-text-quaternary)] mx-1">→</span> Product Designer
          </h1>
          <Star className="w-3.5 h-3.5 text-ce-lime fill-[var(--ce-lime)]" />
          <span className="text-[10px] text-ce-text-tertiary ml-2" style={{ fontFamily: "var(--font-body)" }}>
            Innovator-Strategist · Phase 2 active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px]" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>
            <Move className="w-3 h-3" /> Map View
          </div>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
            <MoreHorizontal className="w-4 h-4 text-ce-text-tertiary" />
          </button>
        </div>
      </motion.div>

      {/* Canvas */}
      <MindMapCanvas />
    </div>
  );
}
