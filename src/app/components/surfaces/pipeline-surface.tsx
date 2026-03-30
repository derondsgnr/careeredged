import { EASE } from "../tokens";
/**
 * Pipeline Surface — EdgeEmployer
 *
 * Hiring pipeline management. Kanban (default) and list views.
 * Shared data model — the toggle is display-only.
 *
 * Layer 3 scope:
 * - Kanban: column-per-stage, candidate cards, stage advancement
 * - List: dense sortable table, same candidates
 * - Role filter (which open job)
 * - Candidate detail drawer (slide-in)
 * - Sophia insight per candidate / stage
 * - View preference persists in session state
 */

import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { useSophia } from "../sophia-context";
import { toast } from "../ui/feedback";
import { EmptyState } from "../ui/feedback";
import {
  Star, ArrowRight, Clock, Check, X, ChevronRight, ChevronDown,
  ChevronUp, MessageSquare, Calendar, Search, Briefcase, FileText,
  Kanban, List, UserPlus, XCircle, History,
} from "lucide-react";

const EMPLOYER_GREEN = "var(--ce-role-employer)";

// ─── Types ───────────────────────────────────────────────────────────────────

type Stage = "new" | "screening" | "interview" | "final" | "offer";
type SortKey = "name" | "match" | "stage" | "applied" | "activity";
type ViewMode = "kanban" | "list";

interface HistoryEntry {
  stage: Stage;
  timestamp: string;
  note: string;
}

interface Candidate {
  id: string;
  name: string;
  initial: string;
  role: string; // which job they applied to
  match: number;
  stage: Stage;
  skills: string[];
  appliedDate: string;
  lastActivity: string;
  location: string;
  sophiaNote: string;
  starred: boolean;
  status: "active" | "hold" | "rejected";
  history: HistoryEntry[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const JOBS = [
  { id: "all",       label: "All roles",           count: 18 },
  { id: "pd",        label: "Product Designer",     count: 12 },
  { id: "ux-lead",   label: "UX Lead",              count: 6  },
];

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: "new",       label: "New",         color: "var(--ce-text-secondary)" },
  { id: "screening", label: "Screening",   color: "var(--ce-role-edgestar)" },
  { id: "interview", label: "Interview",   color: "var(--ce-role-guide)" },
  { id: "final",     label: "Final Round", color: "var(--ce-role-edgepreneur)" },
  { id: "offer",     label: "Offer",       color: "var(--ce-role-employer)" },
];

const STAGE_ORDER: Stage[] = ["new", "screening", "interview", "final", "offer"];

const CANDIDATES: Candidate[] = [
  // Product Designer
  { id: "c1",  name: "Sharon Lee",     initial: "S", role: "pd",      match: 94, stage: "interview", skills: ["Figma", "Design Systems", "User Research"],     appliedDate: "Mar 10", lastActivity: "Today",     location: "San Francisco, CA", sophiaNote: "Strongest portfolio in the batch. Her Airbnb redesign case study is exactly what you asked for. Interview performance has been excellent.", starred: true,  status: "active", history: [{ stage: "new", timestamp: "Mar 10, 9:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 12, 2:30 PM", note: "Passed initial portfolio review" }, { stage: "interview", timestamp: "Mar 15, 10:00 AM", note: "Advanced after strong screening call" }] },
  { id: "c2",  name: "Marcus Rivera",  initial: "M", role: "pd",      match: 89, stage: "interview", skills: ["Interaction Design", "Figma", "Prototyping"],    appliedDate: "Mar 11", lastActivity: "Yesterday", location: "New York, NY",      sophiaNote: "Strong interaction design background. Slightly weaker on systems thinking but compensates with velocity. Good culture fit signals.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 11, 10:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 13, 3:00 PM", note: "Moved to screening" }, { stage: "interview", timestamp: "Mar 17, 11:00 AM", note: "Passed screening" }] },
  { id: "c3",  name: "Aisha Patel",    initial: "A", role: "pd",      match: 86, stage: "screening", skills: ["UX Research", "Figma", "Accessibility"],          appliedDate: "Mar 12", lastActivity: "2 days ago", location: "Austin, TX",       sophiaNote: "Excellent research background. Accessibility specialization is rare. Consider for a research-heavy team.", starred: true,  status: "active", history: [{ stage: "new", timestamp: "Mar 12, 8:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 14, 1:00 PM", note: "Moved to screening — strong research background" }] },
  { id: "c4",  name: "James Park",     initial: "J", role: "pd",      match: 82, stage: "screening", skills: ["Product Design", "Sketch", "User Testing"],       appliedDate: "Mar 13", lastActivity: "3 days ago", location: "Seattle, WA",      sophiaNote: "Good generalist. Switch from Sketch to Figma is a minor concern — assess adaptability.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 13, 9:30 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 15, 4:00 PM", note: "Moved to screening" }] },
  { id: "c5",  name: "Elena Russo",    initial: "E", role: "pd",      match: 78, stage: "new",       skills: ["UI Design", "Framer", "Motion Design"],            appliedDate: "Mar 14", lastActivity: "5 days ago", location: "Los Angeles, CA",  sophiaNote: "Motion design specialist — rare skill. Strong if your roadmap includes richer interactions. Needs review.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 14, 11:00 AM", note: "Application received" }] },
  { id: "c6",  name: "David Kim",      initial: "D", role: "pd",      match: 75, stage: "new",       skills: ["Visual Design", "Figma", "Brand"],                  appliedDate: "Mar 15", lastActivity: "5 days ago", location: "Chicago, IL",      sophiaNote: "Heavy brand background. Needs assessment on product-specific experience.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 15, 2:00 PM", note: "Application received" }] },
  { id: "c7",  name: "Nadia Chen",     initial: "N", role: "pd",      match: 91, stage: "final",     skills: ["Design Systems", "Figma", "React"],                 appliedDate: "Mar 8",  lastActivity: "Today",     location: "San Francisco, CA", sophiaNote: "Top contender. Design systems depth + basic React is exactly the rare combo your team needs. Strong communicator in panel.", starred: true,  status: "active", history: [{ stage: "new", timestamp: "Mar 8, 9:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 9, 11:00 AM", note: "Fast-tracked — strong profile" }, { stage: "interview", timestamp: "Mar 12, 2:00 PM", note: "Excellent screening performance" }, { stage: "final", timestamp: "Mar 18, 10:00 AM", note: "Advanced to final round — panel unanimous" }] },
  { id: "c8",  name: "Tom Okafor",     initial: "T", role: "pd",      match: 72, stage: "new",       skills: ["UX Design", "Figma", "Usability Testing"],           appliedDate: "Mar 16", lastActivity: "Today",     location: "Remote",            sophiaNote: "Good fundamentals, limited senior-level impact quantification. Worth a screening call.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 16, 10:00 AM", note: "Application received" }] },
  { id: "c9",  name: "Rachel Wong",    initial: "R", role: "pd",      match: 88, stage: "offer",     skills: ["Design Systems", "Figma", "Research"],              appliedDate: "Mar 5",  lastActivity: "Today",     location: "San Francisco, CA", sophiaNote: "Offer extended. Competing with 2 other companies — Sophia recommends a founder call to accelerate decision.", starred: true,  status: "active", history: [{ stage: "new", timestamp: "Mar 5, 9:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 6, 3:00 PM", note: "Priority candidate — moved quickly" }, { stage: "interview", timestamp: "Mar 10, 11:00 AM", note: "Strong interview performance" }, { stage: "final", timestamp: "Mar 14, 2:00 PM", note: "Final round passed" }, { stage: "offer", timestamp: "Mar 18, 4:00 PM", note: "Offer extended — $145k base" }] },
  // UX Lead
  { id: "c10", name: "Luis Morales",   initial: "L", role: "ux-lead", match: 92, stage: "final",     skills: ["Design Leadership", "Figma", "Stakeholder Mgmt"], appliedDate: "Mar 9",  lastActivity: "Yesterday", location: "New York, NY",      sophiaNote: "Best leadership candidate so far. Has scaled a design team from 2 to 14. Panel gave unanimous strong hire signal.", starred: true,  status: "active", history: [{ stage: "new", timestamp: "Mar 9, 8:30 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 10, 2:00 PM", note: "Moved to screening" }, { stage: "interview", timestamp: "Mar 13, 10:00 AM", note: "Passed screening — leadership depth" }, { stage: "final", timestamp: "Mar 17, 3:00 PM", note: "Panel unanimous strong hire" }] },
  { id: "c11", name: "Priya Kapoor",   initial: "P", role: "ux-lead", match: 87, stage: "interview", skills: ["UX Strategy", "Design Systems", "Team Building"], appliedDate: "Mar 11", lastActivity: "2 days ago", location: "Remote",            sophiaNote: "Strong strategy background. Less hands-on than Luis but compensates with clear systems thinking.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 11, 11:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 13, 4:00 PM", note: "Moved to screening" }, { stage: "interview", timestamp: "Mar 16, 10:00 AM", note: "Passed screening" }] },
  { id: "c12", name: "Ben Nguyen",     initial: "B", role: "ux-lead", match: 79, stage: "screening", skills: ["Product Design", "Leadership", "Mentorship"],      appliedDate: "Mar 13", lastActivity: "4 days ago", location: "Austin, TX",       sophiaNote: "Growing into a lead role. Strong mentorship track record. May be slightly early for a VP-level scope.", starred: false, status: "active", history: [{ stage: "new", timestamp: "Mar 13, 9:00 AM", note: "Application received" }, { stage: "screening", timestamp: "Mar 15, 2:00 PM", note: "Moved to screening" }] },
];

// ─── Candidate Card (Kanban) ──────────────────────────────────────────────────

function CandidateCard({
  candidate,
  onSelect,
  onAdvance,
  onStar,
}: {
  candidate: Candidate;
  onSelect: (c: Candidate) => void;
  onAdvance: (id: string) => void;
  onStar: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const stageInfo = STAGES.find((s) => s.id === candidate.stage)!;
  const canAdvance = STAGE_ORDER.indexOf(candidate.stage) < STAGE_ORDER.length - 1;

  const matchColor = candidate.match >= 90 ? "var(--ce-lime)" : candidate.match >= 80 ? EMPLOYER_GREEN : candidate.match >= 70 ? "var(--ce-role-edgepreneur)" : "var(--ce-text-tertiary)";

  return (
    <motion.div
      className="rounded-xl p-3.5 cursor-pointer relative"
      style={{
        background: hovered ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-glass-tint),0.025)",
        border: `1px solid ${candidate.starred ? "rgba(var(--ce-role-employer-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.06)"}`,
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(candidate)}
      layout
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
            style={{
              background: `${matchColor}15`,
              border: `1px solid ${matchColor}25`,
              color: matchColor,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            {candidate.initial}
          </div>
          <div>
            <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {candidate.name}
            </span>
            <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              {candidate.location}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onStar(candidate.id); }}
            className="cursor-pointer"
          >
            <Star
              className="w-3.5 h-3.5 transition-colors"
              style={{ color: candidate.starred ? "var(--ce-role-edgepreneur)" : "var(--ce-text-quaternary)", fill: candidate.starred ? "rgba(var(--ce-role-edgepreneur-rgb),0.3)" : "none" }}
            />
          </button>
          <div className="tabular-nums px-1.5 py-0.5 rounded" style={{
            background: `${matchColor}12`,
            color: matchColor,
            fontSize: 11,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}>
            {candidate.match}%
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {candidate.skills.slice(0, 2).map((skill) => (
          <span key={skill} className="text-[9px] px-2 py-0.5 rounded-full" style={{
            background: "rgba(var(--ce-glass-tint),0.04)",
            border: "1px solid rgba(var(--ce-glass-tint),0.06)",
            color: "var(--ce-text-secondary)",
            fontFamily: "var(--font-body)",
          }}>
            {skill}
          </span>
        ))}
        {candidate.skills.length > 2 && (
          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
            +{candidate.skills.length - 2}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
          <Clock className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />
          {candidate.lastActivity}
        </span>
        <AnimatePresence>
          {hovered && canAdvance && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => { e.stopPropagation(); onAdvance(candidate.id); }}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md cursor-pointer transition-colors"
              style={{
                background: `${EMPLOYER_GREEN}12`,
                border: `1px solid ${EMPLOYER_GREEN}20`,
                color: EMPLOYER_GREEN,
                fontFamily: "var(--font-body)",
              }}
            >
              Advance <ArrowRight className="w-2.5 h-2.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Sophia dot indicator if note exists */}
      {candidate.starred && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: EMPLOYER_GREEN, boxShadow: `0 0 4px ${EMPLOYER_GREEN}60` }} />
      )}
    </motion.div>
  );
}

// ─── Candidate Detail Drawer ──────────────────────────────────────────────────

function CandidateDrawer({
  candidate,
  onClose,
  onAdvance,
  onStar,
  onReject,
  onNavigate,
}: {
  candidate: Candidate;
  onClose: () => void;
  onAdvance: (id: string) => void;
  onStar: (id: string) => void;
  onReject: (c: Candidate) => void;
  onNavigate: (t: string) => void;
}) {
  const { openSophia } = useSophia();
  const stageInfo = STAGES.find((s) => s.id === candidate.stage)!;
  const stageIdx = STAGE_ORDER.indexOf(candidate.stage);
  const canAdvance = stageIdx < STAGE_ORDER.length - 1;
  const nextStage = canAdvance ? STAGES[stageIdx + 1] : null;
  const matchColor = candidate.match >= 90 ? "var(--ce-lime)" : candidate.match >= 80 ? EMPLOYER_GREEN : candidate.match >= 70 ? "var(--ce-role-edgepreneur)" : "var(--ce-text-tertiary)";

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[16px]" style={{ background: `${matchColor}12`, border: `1.5px solid ${matchColor}25`, color: matchColor, fontFamily: "var(--font-display)", fontWeight: 600 }}>
            {candidate.initial}
          </div>
          <div>
            <span className="text-[15px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{candidate.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${stageInfo.color}12`, color: stageInfo.color, border: `1px solid ${stageInfo.color}20`, fontFamily: "var(--font-body)" }}>
                {stageInfo.label}
              </span>
              <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{candidate.location}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Match score */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>Match score</span>
            <span className="text-[24px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{candidate.match}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
            <motion.div className="h-full rounded-full" style={{ background: matchColor }}
              initial={{ width: 0 }} animate={{ width: `${candidate.match}%` }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }} />
          </div>
        </div>

        {/* Sophia note */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <SophiaMark size={12} glowing={false} />
            <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's read</span>
          </div>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {candidate.sophiaNote}
          </p>
        </div>

        {/* Stage progression */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>STAGE PROGRESSION</span>
          <div className="flex items-center gap-1">
            {STAGES.map((s, i) => {
              const sIdx = STAGE_ORDER.indexOf(s.id);
              const isActive = s.id === candidate.stage;
              const isDone = sIdx < stageIdx;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                      background: isDone ? `${EMPLOYER_GREEN}20` : isActive ? `${s.color}20` : "rgba(var(--ce-glass-tint),0.04)",
                      border: `1.5px solid ${isDone ? EMPLOYER_GREEN : isActive ? s.color : "rgba(var(--ce-glass-tint),0.1)"}`,
                      boxShadow: isActive ? `0 0 8px ${s.color}40` : "none",
                    }}>
                      {isDone ? <Check className="w-2.5 h-2.5" style={{ color: EMPLOYER_GREEN }} /> : null}
                    </div>
                    <span className="text-[8px] mt-1 text-center" style={{ color: isActive ? s.color : isDone ? EMPLOYER_GREEN : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>
                      {s.label}
                    </span>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className="h-px flex-1 mb-4" style={{ background: sIdx < stageIdx ? `${EMPLOYER_GREEN}40` : "rgba(var(--ce-glass-tint),0.06)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SKILLS</span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span key={skill} className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>DETAILS</span>
          {[
            { label: "Applied",         value: candidate.appliedDate },
            { label: "Last active",     value: candidate.lastActivity },
            { label: "Applying for",    value: JOBS.find(j => j.id === candidate.role)?.label ?? candidate.role },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
              <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Stage history timeline */}
        {candidate.history.length > 0 && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <History className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>STAGE HISTORY</span>
            </div>
            <div className="flex flex-col">
              {candidate.history.map((entry, i) => {
                const entryStageInfo = STAGES.find(s => s.id === entry.stage);
                const isLast = i === candidate.history.length - 1;
                return (
                  <div key={i} className="flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full mt-1" style={{ background: isLast ? (entryStageInfo?.color ?? "var(--ce-text-quaternary)") : `${EMPLOYER_GREEN}80`, border: isLast ? `2px solid ${entryStageInfo?.color ?? "var(--ce-text-quaternary)"}40` : "none" }} />
                      {!isLast && <div className="w-px flex-1 my-1" style={{ background: "rgba(var(--ce-glass-tint),0.08)" }} />}
                    </div>
                    {/* Content */}
                    <div className={`pb-3 ${isLast ? "" : ""}`}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {entryStageInfo?.label ?? entry.stage}
                        </span>
                        <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{entry.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{entry.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Drawer actions */}
      <div className="px-5 py-4 flex flex-col gap-2.5" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {canAdvance && nextStage && candidate.status !== "rejected" && (
          <button
            onClick={() => { onAdvance(candidate.id); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: `${EMPLOYER_GREEN}12`, border: `1px solid ${EMPLOYER_GREEN}25`, color: EMPLOYER_GREEN, fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Move to {nextStage.label}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => { onClose(); onNavigate("messages"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] transition-colors"
            style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>
            <MessageSquare className="w-3.5 h-3.5" /> Message
          </button>
          <button
            onClick={() => { onClose(); onNavigate("sessions"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-role-guide-rgb),0.08)] transition-colors"
            style={{ background: "rgba(var(--ce-role-guide-rgb),0.04)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.1)", color: "var(--ce-role-guide)", fontFamily: "var(--font-body)" }}>
            <Calendar className="w-3.5 h-3.5" /> Schedule
          </button>
          <button
            onClick={() => openSophia(`Review the resume and application materials for ${candidate.name} applying for ${JOBS.find(j => j.id === candidate.role)?.label ?? candidate.role}. Match score: ${candidate.match}%. Skills: ${candidate.skills.join(", ")}. Sophia noted: ${candidate.sophiaNote}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
            <FileText className="w-3.5 h-3.5" /> Resume
          </button>
          <button
            onClick={() => onStar(candidate.id)}
            className="px-3 py-2 rounded-xl cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: candidate.starred ? "var(--ce-role-edgepreneur)" : "var(--ce-text-tertiary)" }}
          >
            <Star className="w-3.5 h-3.5" style={{ fill: candidate.starred ? "rgba(var(--ce-role-edgepreneur-rgb),0.3)" : "none" }} />
          </button>
        </div>
        {candidate.status !== "rejected" && (
          <button
            onClick={() => { onReject(candidate); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-status-error-rgb),0.06)]"
            style={{ border: "1px solid rgba(var(--ce-status-error-rgb),0.12)", color: "var(--ce-status-error)", fontFamily: "var(--font-body)" }}>
            <XCircle className="w-3 h-3" /> Reject candidate
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Reject Modal ────────────────────────────────────────────────────────────

function RejectModal({
  candidate,
  onConfirm,
  onClose,
}: {
  candidate: Candidate;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(var(--ce-shadow-tint),0.5)" }} onClick={onClose} />
      <motion.div
        className="relative w-[420px] rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", backdropFilter: "blur(20px)" }}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-[var(--ce-status-error)]" />
            <span className="text-[15px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Reject {candidate.name}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>
        <p className="text-[12px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
          This will move {candidate.name} out of the active pipeline. Please provide a reason for the rejection.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection (e.g., not enough senior experience, culture fit concerns)..."
          className="w-full h-28 rounded-xl px-4 py-3 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none resize-none"
          style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }}
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-[12px] cursor-pointer transition-colors"
            style={{ color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }}>
            Cancel
          </button>
          <button
            onClick={() => { if (reason.trim()) onConfirm(reason.trim()); }}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "rgba(var(--ce-status-error-rgb),0.12)", border: "1px solid rgba(var(--ce-status-error-rgb),0.25)", color: "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Confirm rejection
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Add Candidate Panel ─────────────────────────────────────────────────────

function AddCandidatePanel({
  onSubmit,
  onClose,
}: {
  onSubmit: (data: { name: string; role: string; source: string; notes: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("pd");
  const [source, setSource] = useState("direct");
  const [notes, setNotes] = useState("");

  const canSubmit = name.trim().length > 0;

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" style={{ color: EMPLOYER_GREEN }} />
          <span className="text-[15px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Add candidate</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
          <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>FULL NAME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe"
            className="w-full px-3.5 py-2.5 rounded-xl text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
        </div>

        {/* Role */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ROLE APPLIED FOR</label>
          <div className="flex gap-2">
            {JOBS.filter(j => j.id !== "all").map((j) => (
              <button key={j.id} onClick={() => setRole(j.id)}
                className="flex-1 px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-all"
                style={{
                  background: role === j.id ? `${EMPLOYER_GREEN}12` : "rgba(var(--ce-glass-tint),0.03)",
                  border: `1px solid ${role === j.id ? `${EMPLOYER_GREEN}30` : "rgba(var(--ce-glass-tint),0.08)"}`,
                  color: role === j.id ? EMPLOYER_GREEN : "var(--ce-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}>
                {j.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOURCE</label>
          <div className="flex gap-2">
            {[
              { id: "referral", label: "Referral" },
              { id: "linkedin", label: "LinkedIn" },
              { id: "direct", label: "Direct" },
            ].map((s) => (
              <button key={s.id} onClick={() => setSource(s.id)}
                className="flex-1 px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-all"
                style={{
                  background: source === s.id ? `${EMPLOYER_GREEN}12` : "rgba(var(--ce-glass-tint),0.03)",
                  border: `1px solid ${source === s.id ? `${EMPLOYER_GREEN}30` : "rgba(var(--ce-glass-tint),0.08)"}`,
                  color: source === s.id ? EMPLOYER_GREEN : "var(--ce-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NOTES</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Initial notes about this candidate..."
            className="w-full h-24 rounded-xl px-3.5 py-3 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none resize-none"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }} />
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <button
          onClick={() => { if (canSubmit) onSubmit({ name: name.trim(), role, source, notes: notes.trim() }); }}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: `${EMPLOYER_GREEN}12`, border: `1px solid ${EMPLOYER_GREEN}25`, color: EMPLOYER_GREEN, fontFamily: "var(--font-display)", fontWeight: 500 }}>
          <UserPlus className="w-3.5 h-3.5" />
          Add to pipeline
        </button>
      </div>
    </motion.div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  candidates,
  onSelect,
  onAdvance,
  onStar,
}: {
  stage: typeof STAGES[0];
  candidates: Candidate[];
  onSelect: (c: Candidate) => void;
  onAdvance: (id: string) => void;
  onStar: (id: string) => void;
}) {
  return (
    <div className="flex flex-col min-w-[220px] flex-1">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: stage.color, boxShadow: `0 0 4px ${stage.color}50` }} />
          <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {stage.label}
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full tabular-nums" style={{ background: "rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
          {candidates.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1" style={{ minHeight: 80 }}>
        <AnimatePresence>
          {candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} onSelect={onSelect} onAdvance={onAdvance} onStar={onStar} />
          ))}
        </AnimatePresence>
        {candidates.length === 0 && (
          <div className="flex-1 rounded-xl flex items-center justify-center" style={{ border: "1px dashed rgba(var(--ce-glass-tint),0.06)", minHeight: 80 }}>
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── List View ───────────────────────────────────────────────────��────────────

function ListView({
  candidates,
  onSelect,
  onStar,
}: {
  candidates: Candidate[];
  onSelect: (c: Candidate) => void;
  onStar: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setAsc(!sortAsc);
    else { setSortKey(key); setAsc(false); }
  };
  const setAsc = setSortAsc;

  const sorted = [...candidates].sort((a, b) => {
    let diff = 0;
    if (sortKey === "match")    diff = a.match - b.match;
    if (sortKey === "name")     diff = a.name.localeCompare(b.name);
    if (sortKey === "stage")    diff = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage);
    if (sortKey === "applied")  diff = a.appliedDate.localeCompare(b.appliedDate);
    if (sortKey === "activity") diff = a.lastActivity.localeCompare(b.lastActivity);
    return sortAsc ? diff : -diff;
  });

  const ColHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => handleSort(k)} className="flex items-center gap-1 cursor-pointer hover:text-[var(--ce-text-tertiary)] transition-colors">
      <span className="text-[10px]" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: sortKey === k ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)" }}>
        {label}
      </span>
      {sortKey === k && (sortAsc ? <ChevronUp className="w-2.5 h-2.5 text-[var(--ce-text-secondary)]" /> : <ChevronDown className="w-2.5 h-2.5 text-[var(--ce-text-secondary)]" />)}
    </button>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.015)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
      {/* Table header */}
      <div className="grid px-4 py-2.5" style={{ gridTemplateColumns: "1fr 60px 120px 90px 90px 80px", borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)", gap: 12 }}>
        <ColHeader k="name"     label="CANDIDATE" />
        <ColHeader k="match"    label="MATCH" />
        <ColHeader k="stage"    label="STAGE" />
        <ColHeader k="applied"  label="APPLIED" />
        <ColHeader k="activity" label="LAST ACTIVE" />
        <span />
      </div>

      {/* Rows */}
      {sorted.map((c, i) => {
        const stageInfo = STAGES.find((s) => s.id === c.stage)!;
        const matchColor = c.match >= 90 ? "var(--ce-lime)" : c.match >= 80 ? EMPLOYER_GREEN : c.match >= 70 ? "var(--ce-role-edgepreneur)" : "var(--ce-text-tertiary)";
        return (
          <motion.div
            key={c.id}
            className="grid px-4 py-3 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] transition-colors items-center"
            style={{ gridTemplateColumns: "1fr 60px 120px 90px 90px 80px", borderBottom: i < sorted.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none", gap: 12 }}
            onClick={() => onSelect(c)}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25, ease: EASE }}
          >
            {/* Name */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] flex-shrink-0" style={{ background: `${matchColor}12`, color: matchColor, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {c.initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[var(--ce-text-primary)] truncate" style={{ fontFamily: "var(--font-body)" }}>{c.name}</span>
                  {c.starred && <Star className="w-3 h-3 flex-shrink-0" style={{ color: "var(--ce-role-edgepreneur)", fill: "rgba(var(--ce-role-edgepreneur-rgb),0.3)" }} />}
                </div>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] truncate block" style={{ fontFamily: "var(--font-body)" }}>{c.location}</span>
              </div>
            </div>
            {/* Match */}
            <span className="text-[13px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {c.match}%
            </span>
            {/* Stage */}
            <span className="text-[10px] px-2 py-1 rounded-full w-fit" style={{ background: `${stageInfo.color}10`, color: stageInfo.color, border: `1px solid ${stageInfo.color}20`, fontFamily: "var(--font-body)" }}>
              {stageInfo.label}
            </span>
            {/* Applied */}
            <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{c.appliedDate}</span>
            {/* Last active */}
            <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{c.lastActivity}</span>
            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button onClick={(e) => { e.stopPropagation(); onStar(c.id); }} className="cursor-pointer p-1 rounded hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors">
                <Star className="w-3 h-3" style={{ color: c.starred ? "var(--ce-role-edgepreneur)" : "var(--ce-text-quaternary)", fill: c.starred ? "rgba(var(--ce-role-edgepreneur-rgb),0.3)" : "none" }} />
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function PipelineSurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = "employer" as const;

  const [view, setView] = useState<ViewMode>("kanban");
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [selectedJob, setSelectedJob] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [jobDropOpen, setJobDropOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Candidate | null>(null);
  const [addPanelOpen, setAddPanelOpen] = useState(false);

  const handleNavigate = useCallback((target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`, pipeline: `/${role}/pipeline`,
      analytics: `/${role}/analytics`, messages: `/${role}/messages`,
      sessions: `/${role}/sessions`, landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  }, [navigate, role]);

  const handleAdvance = useCallback((id: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === "rejected") return c;
        const idx = STAGE_ORDER.indexOf(c.stage);
        if (idx >= STAGE_ORDER.length - 1) return c; // Already at offer — can't advance
        const next = STAGE_ORDER[idx + 1];
        if (!next) return c;
        // Validate sequential progression — no skipping
        const expectedNext = STAGE_ORDER[idx + 1];
        if (next !== expectedNext) return c;
        const nextLabel = STAGES.find(s => s.id === next)?.label ?? next;
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        toast.success(`Moved to ${nextLabel}`, `${c.name} advanced`);
        return {
          ...c,
          stage: next,
          lastActivity: "Today",
          history: [...c.history, { stage: next, timestamp, note: `Advanced to ${nextLabel}` }],
        };
      })
    );
    // Sync drawer if same candidate
    setSelectedCandidate((prev) => {
      if (!prev || prev.id !== id) return prev;
      const idx = STAGE_ORDER.indexOf(prev.stage);
      if (idx >= STAGE_ORDER.length - 1 || prev.status === "rejected") return prev;
      const next = STAGE_ORDER[idx + 1];
      if (!next) return prev;
      const nextLabel = STAGES.find(s => s.id === next)?.label ?? next;
      const now = new Date();
      const timestamp = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      return { ...prev, stage: next, lastActivity: "Today", history: [...prev.history, { stage: next, timestamp, note: `Advanced to ${nextLabel}` }] };
    });
  }, []);

  const handleReject = useCallback((id: string, reason: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const now = new Date();
        const timestamp = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        toast.info("Candidate rejected", c.name);
        return {
          ...c,
          status: "rejected" as const,
          lastActivity: "Today",
          history: [...c.history, { stage: c.stage, timestamp, note: `Rejected: ${reason}` }],
        };
      })
    );
    setRejectTarget(null);
  }, []);

  const handleAddCandidate = useCallback((data: { name: string; role: string; source: string; notes: string }) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const newCandidate: Candidate = {
      id: `c${Date.now()}`,
      name: data.name,
      initial: data.name.charAt(0).toUpperCase(),
      role: data.role,
      match: Math.floor(Math.random() * 20) + 65, // 65-85 initial match
      stage: "new",
      skills: [],
      appliedDate: dateStr,
      lastActivity: "Today",
      location: "—",
      sophiaNote: data.notes || "New candidate — Sophia will generate an assessment after profile review.",
      starred: false,
      status: "active",
      history: [{ stage: "new", timestamp, note: `Added via ${data.source}${data.notes ? `. ${data.notes}` : ""}` }],
    };
    setCandidates((prev) => [newCandidate, ...prev]);
    setAddPanelOpen(false);
    toast.success("Candidate added", `${data.name} added to pipeline`);
  }, []);

  const handleStar = useCallback((id: string) => {
    setCandidates((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const nowStarred = !c.starred;
      toast.info(nowStarred ? "Shortlisted" : "Removed from shortlist", c.name);
      return { ...c, starred: nowStarred };
    }));
    setSelectedCandidate((prev) => prev?.id === id ? { ...prev, starred: !prev.starred } : prev);
  }, []);

  const filtered = candidates.filter((c) => {
    if (c.status === "rejected") return false; // Hide rejected from active pipeline
    const matchesJob = selectedJob === "all" || c.role === selectedJob;
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesJob && matchesSearch;
  });

  // Contextual bottom bar — updates when a candidate is selected
  const sophiaOverride = selectedCandidate
    ? {
        message: `${selectedCandidate.name} — ${selectedCandidate.match}% match · ${STAGES.find(s => s.id === selectedCandidate.stage)?.label}`,
        chips: [
          { label: "Sophia's full read", action: `Give me a detailed assessment of candidate ${selectedCandidate.name} for the ${JOBS.find(j => j.id === selectedCandidate.role)?.label} role. ${selectedCandidate.sophiaNote}` },
          { label: "Draft interview invite", action: `Draft an interview invitation email for ${selectedCandidate.name} for the ${JOBS.find(j => j.id === selectedCandidate.role)?.label} position.` },
        ],
      }
    : {
        message: "Nadia Chen (91% match) is ready for an offer — 2 competitors are moving fast",
        chips: [
          { label: "Top candidates", action: "Show me the top 3 candidates across all roles and what I should do next to close them" },
          { label: "Pipeline strategy", action: "What's the current state of my hiring pipeline and what actions should I take this week?" },
        ],
      };

  // Stage summary for header
  const stageSummary = STAGES.map((s) => ({ ...s, count: filtered.filter((c) => c.stage === s.id).length }));

  return (
    <RoleShell role={role} userName="Jordan" userInitial="J" edgeGas={72} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1400px] mx-auto">
        {/* Page header */}
        <motion.div className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[22px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Hiring Pipeline
            </h1>
            <p className="text-[13px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              {filtered.length} candidates across {JOBS.filter(j => j.id !== "all").length} open roles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setAddPanelOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
              style={{ background: `${EMPLOYER_GREEN}12`, border: `1px solid ${EMPLOYER_GREEN}25`, color: EMPLOYER_GREEN, fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <UserPlus className="w-3.5 h-3.5" /> Add candidate
            </button>
            {/* View toggle */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
              {(["kanban", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-all"
                  style={{
                    background: view === v ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
                    color: view === v ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {v === "kanban" ? <Kanban className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stage summary strip */}
        <motion.div className="flex gap-2 mb-5"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}>
          {stageSummary.map((s) => (
            <div key={s.id} className="flex-1 rounded-xl px-3 py-2.5 flex items-center justify-between" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${s.count > 0 ? `${s.color}15` : "rgba(var(--ce-glass-tint),0.04)"}` }}>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.count > 0 ? s.color : "var(--ce-text-quaternary)" }} />
                <span className="text-[11px]" style={{ color: s.count > 0 ? "var(--ce-text-tertiary)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>{s.label}</span>
              </div>
              <span className="text-[15px] tabular-nums" style={{ color: s.count > 0 ? s.color : "var(--ce-text-quaternary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.count}</span>
            </div>
          ))}
        </motion.div>

        {/* Toolbar */}
        <motion.div className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.35, ease: EASE }}>
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}>
            <Search className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates or skills..."
              className="flex-1 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none"
              style={{ fontFamily: "var(--font-body)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="cursor-pointer">
                <X className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              </button>
            )}
          </div>

          {/* Job filter */}
          <div className="relative">
            <button
              onClick={() => setJobDropOpen(!jobDropOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
              style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}
            >
              <Briefcase className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
              <span className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                {JOBS.find((j) => j.id === selectedJob)?.label ?? "All roles"}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
            </button>
            <AnimatePresence>
              {jobDropOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-1 w-[200px] rounded-xl z-20 overflow-hidden"
                  style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", backdropFilter: "blur(16px)" }}
                  initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                >
                  {JOBS.map((j) => (
                    <button key={j.id} onClick={() => { setSelectedJob(j.id); setJobDropOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors text-left"
                      style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                      <span className="text-[12px]" style={{ color: selectedJob === j.id ? EMPLOYER_GREEN : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>{j.label}</span>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{j.count}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {view === "kanban" ? (
            <motion.div key="kanban" className="flex gap-4 overflow-x-auto pb-4"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              {STAGES.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  candidates={filtered.filter((c) => c.stage === stage.id)}
                  onSelect={setSelectedCandidate}
                  onAdvance={handleAdvance}
                  onStar={handleStar}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div key="list"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <ListView candidates={filtered} onSelect={setSelectedCandidate} onStar={handleStar} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Candidate detail drawer overlay */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setSelectedCandidate(null)} />
            <CandidateDrawer
              candidate={selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
              onAdvance={handleAdvance}
              onStar={handleStar}
              onNavigate={handleNavigate}
            />
          </>
        )}
      </AnimatePresence>
    </RoleShell>
  );
}