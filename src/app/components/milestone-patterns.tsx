/**
 * Milestone Patterns — Layer 1 Design System
 *
 * MilestoneRow: single milestone with status, category, and optional expansions.
 *
 * Variants:
 *   simple         — label + status dot + time estimate
 *   expandable     — chevron → opens Sophia note + resources + cross-surface links
 *   with-task-room — expandable + "Open task room →" CTA on current milestones
 *
 * Category normalization (3 systems → 1):
 *   skill / learn  → GraduationCap, cyan (var(--ce-role-edgestar))
 *   action         → Target, lime (var(--ce-lime))
 *   resource/habit → BookOpen, gray (var(--ce-text-secondary))
 *
 * Status:
 *   done           → solid check + muted text
 *   current        → accent dot + full text + expansion available
 *   upcoming       → dim dot + dim text
 *   locked         → lock icon + very dim text
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, ChevronDown, ChevronUp, Lock,
  GraduationCap, Target, BookOpen,
  ExternalLink, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SophiaMark } from "./sophia-mark";
import { EASE, COLORS, TEXT, FONT, SURFACE, CATEGORY_COLORS } from "./tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MilestoneStatus = "done" | "current" | "upcoming" | "locked";
export type MilestoneCategory = "skill" | "learn" | "action" | "resource" | "habit";

export interface MilestoneCrossSurface {
  surface: string;
  note: string;
  /** Surface key to navigate to when clicked, e.g. "sessions", "resume", "jobs" */
  navigateTo?: string;
}

export interface MilestoneData {
  id: string;
  label: string;
  category: MilestoneCategory;
  status: MilestoneStatus;
  time: string;
  sophiaNote?: string;
  resources?: { label: string; type: string }[];
  actions?: string[];
  crossSurface?: MilestoneCrossSurface[];
}

// ─── Category meta ────────────────────────────────────────────────────────────

function getCategoryMeta(category: MilestoneCategory): { icon: LucideIcon; color: string; label: string } {
  switch (category) {
    case "skill":
    case "learn":
      return { icon: GraduationCap, color: COLORS.cyan, label: "Skill" };
    case "action":
      return { icon: Target, color: COLORS.lime, label: "Action" };
    case "resource":
    case "habit":
    default:
      return { icon: BookOpen, color: "var(--ce-text-secondary)", label: "Resource" };
  }
}

// ─── Status indicator ─────────────────────────────────────────────────────────

function StatusDot({ status, accent }: { status: MilestoneStatus; accent: string }) {
  if (status === "done") {
    return (
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
      >
        <Check className="w-3 h-3" style={{ color: accent }} />
      </div>
    );
  }
  if (status === "current") {
    return (
      <div
        className="w-5 h-5 rounded-full flex-shrink-0"
        style={{
          background: `${accent}20`,
          border: `1.5px solid ${accent}`,
          boxShadow: `0 0 8px ${accent}40`,
        }}
      />
    );
  }
  if (status === "locked") {
    return (
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
      >
        <Lock className="w-2.5 h-2.5" style={{ color: "rgba(var(--ce-glass-tint),0.2)" }} />
      </div>
    );
  }
  // upcoming
  return (
    <div
      className="w-5 h-5 rounded-full flex-shrink-0"
      style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
    />
  );
}

// ─── MilestoneRow ─────────────────────────────────────────────────────────────

interface MilestoneRowProps {
  milestone: MilestoneData;
  accent: string;
  variant?: "simple" | "expandable" | "with-task-room";
  onOpenTaskRoom?: (id: string) => void;
  /** Called when a cross-surface chip with navigateTo is clicked */
  onNavigate?: (target: string) => void;
  delay?: number;
}

export function MilestoneRow({
  milestone,
  accent,
  variant = "simple",
  onOpenTaskRoom,
  onNavigate,
  delay = 0,
}: MilestoneRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { icon: CategoryIcon, color: catColor } = getCategoryMeta(milestone.category);
  const isExpandable = variant !== "simple" && milestone.status === "current";
  const showTaskRoom = variant === "with-task-room" && milestone.status === "current";

  const labelColor =
    milestone.status === "done"
      ? TEXT.muted
      : milestone.status === "current"
      ? TEXT.primary
      : milestone.status === "locked"
      ? "rgba(var(--ce-glass-tint),0.2)"
      : TEXT.tertiary;

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: EASE }}
    >
      {/* Main row */}
      <div
        className={`flex items-center gap-3 py-2.5 ${isExpandable ? "cursor-pointer" : ""}`}
        style={{ borderBottom: `1px solid ${SURFACE.divider}` }}
        onClick={isExpandable ? () => setExpanded((v) => !v) : undefined}
      >
        <StatusDot status={milestone.status} accent={accent} />

        {/* Category icon */}
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: `${catColor}10` }}
        >
          <CategoryIcon className="w-3 h-3" style={{ color: catColor }} />
        </div>

        <span
          className="flex-1 text-[12px] min-w-0"
          style={{
            color: labelColor,
            fontFamily: FONT.body,
            textDecoration: milestone.status === "done" ? "line-through" : "none",
            textDecorationColor: "rgba(var(--ce-glass-tint),0.15)",
          }}
        >
          {milestone.label}
        </span>

        <span
          className="text-[10px] tabular-nums flex-shrink-0"
          style={{ color: TEXT.muted, fontFamily: FONT.body }}
        >
          {milestone.time}
        </span>

        {isExpandable && (
          <div style={{ color: TEXT.muted }}>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && isExpandable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              className="ml-8 mb-3 mt-1 rounded-xl p-4"
              style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}
            >
              {/* Sophia note */}
              {milestone.sophiaNote && (
                <div className="flex gap-2.5 mb-4">
                  <SophiaMark size={14} glowing={false} />
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: TEXT.secondary, fontFamily: FONT.body }}
                  >
                    {milestone.sophiaNote}
                  </p>
                </div>
              )}

              {/* Resources */}
              {milestone.resources && milestone.resources.length > 0 && (
                <div className="mb-3">
                  <p
                    className="text-[10px] mb-2"
                    style={{ color: TEXT.muted, fontFamily: FONT.display, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Resources
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {milestone.resources.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px]"
                        style={{ color: TEXT.secondary, fontFamily: FONT.body }}
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.cyan }} />
                        {r.label}
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(var(--ce-glass-tint),0.04)", color: TEXT.muted, fontFamily: FONT.body }}
                        >
                          {r.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross-surface connections */}
              {milestone.crossSurface && milestone.crossSurface.length > 0 && (
                <div className="mb-3">
                  <p
                    className="text-[10px] mb-2"
                    style={{ color: TEXT.muted, fontFamily: FONT.display, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    Connected surfaces
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {milestone.crossSurface.map((cs, i) => {
                      const isNav = !!cs.navigateTo && !!onNavigate;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-[11px] rounded-md transition-colors ${isNav ? "cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] px-1.5 py-0.5 -mx-1.5" : ""}`}
                          style={{ color: TEXT.secondary, fontFamily: FONT.body }}
                          onClick={isNav ? () => onNavigate!(cs.navigateTo!) : undefined}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: COLORS.cyan }}
                          />
                          <span className="flex-1">
                            <span style={{ color: TEXT.primary }}>{cs.surface}</span>
                            {" — "}
                            {cs.note}
                          </span>
                          {isNav && <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" style={{ color: COLORS.cyan }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Task room CTA */}
              {showTaskRoom && onOpenTaskRoom && (
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenTaskRoom(milestone.id); }}
                  className="flex items-center gap-1.5 text-[11px] mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: accent, fontFamily: FONT.body }}
                >
                  Open task room <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MilestoneList ────────────────────────────────────────────────────────────

/** Renders a list of milestone rows for a phase. */
export function MilestoneList({
  milestones,
  accent,
  variant = "simple",
  onOpenTaskRoom,
  onNavigate,
}: {
  milestones: MilestoneData[];
  accent: string;
  variant?: "simple" | "expandable" | "with-task-room";
  onOpenTaskRoom?: (id: string) => void;
  onNavigate?: (target: string) => void;
}) {
  return (
    <div>
      {milestones.map((m, i) => (
        <MilestoneRow
          key={m.id}
          milestone={m}
          accent={accent}
          variant={variant}
          onOpenTaskRoom={onOpenTaskRoom}
          onNavigate={onNavigate}
          delay={i * 0.04}
        />
      ))}
    </div>
  );
}
