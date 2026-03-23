/**
 * KPI Patterns — Layer 1 Design System
 *
 * KPICard: dashboard metric card with optional gauge ring.
 * PhaseBar: horizontal phase progress strip (compact for dashboards, full for EdgePath).
 * KPIRow: thin grid wrapper — replaces role-shell KPIRow.
 *
 * Design rules:
 *   - Gauge ring uses exact 40×22 SVG (pathLength animation, 0.8s delay, EASE curve)
 *   - Phase dots: done = solid accent, active = glowing accent, upcoming = dim, locked = lock icon
 *   - Compact phase bar: used in all dashboards — no milestone list
 *   - Full phase bar: used in EdgePath — expandable milestones inline
 */

import { motion } from "motion/react";
import { Check, Lock } from "lucide-react";
import { EASE, SURFACE, TEXT, FONT } from "./tokens";

// ─── KPI Card ─────────────────────────────────────────────────────────────────

export interface KPICardItem {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
  /** 0–1 fractional value. Omit or pass null/undefined to hide the gauge ring. */
  gauge?: number | null;
}

export function KPICard({
  label,
  value,
  trend,
  icon,
  color,
  gauge,
  delay = 0,
}: KPICardItem & { delay?: number }) {
  const showGauge = gauge != null;

  return (
    <motion.div
      className="rounded-xl p-4"
      style={{ background: SURFACE.card, border: `1px solid ${SURFACE.cardBorder}` }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}10` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>

        {showGauge && (
          <svg width="40" height="22" viewBox="0 0 40 22">
            {/* Track */}
            <path
              d="M4 20 A16 16 0 0 1 36 20"
              fill="none"
              stroke="rgba(var(--ce-glass-tint),0.06)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Animated fill */}
            <motion.path
              d="M4 20 A16 16 0 0 1 36 20"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: gauge! }}
              transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
            />
          </svg>
        )}
      </div>

      <div
        className="text-[26px] tabular-nums"
        style={{ color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}
      >
        {value}
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px]" style={{ color: TEXT.tertiary, fontFamily: FONT.body }}>
          {label}
        </span>
        <span className="text-[10px]" style={{ color: "var(--ce-lime)", fontFamily: FONT.body }}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
}

/** Grid wrapper — drop-in replacement for the KPIRow in role-shell.tsx */
export function KPIRow({ kpis }: { kpis: KPICardItem[] }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${kpis.length}, 1fr)` }}
    >
      {kpis.map((kpi, i) => (
        <KPICard key={i} {...kpi} delay={0.25 + i * 0.08} />
      ))}
    </div>
  );
}

// ─── Phase Bar ────────────────────────────────────────────────────────────────

export interface PhaseItem {
  id: number;
  title: string;
  weeks?: string;
  status: "done" | "active" | "upcoming" | "locked";
  progress: number;  // 0–1
  milestonesDone?: number;
  milestonesTotal?: number;
}

interface PhaseBarProps {
  phases: PhaseItem[];
  accent: string;
  /** compact = dashboard strip, full = EdgePath with progress detail */
  variant?: "compact" | "full";
  delay?: number;
}

export function PhaseBar({ phases, accent, variant = "compact", delay = 0 }: PhaseBarProps) {
  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
    >
      {phases.map((phase) => (
        <div key={phase.id} className="flex-1">
          {/* Progress track */}
          <div
            className="h-1.5 rounded-full mb-2.5 overflow-hidden"
            style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}
          >
            {(phase.status === "active" || phase.status === "done") && (
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    phase.status === "done"
                      ? accent
                      : `linear-gradient(90deg, ${accent}, var(--ce-role-edgestar))`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${phase.progress * 100}%` }}
                transition={{ delay: delay + 0.4, duration: 0.8, ease: EASE }}
              />
            )}
          </div>

          {/* Label row */}
          <div className="flex items-center gap-1.5 mb-0.5">
            {phase.status === "locked" ? (
              <Lock className="w-2.5 h-2.5" style={{ color: "rgba(var(--ce-glass-tint),0.15)" }} />
            ) : phase.status === "done" ? (
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            ) : phase.status === "active" ? (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 6px ${accent}66` }}
              />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.1)" }} />
            )}
            <span
              className="text-[12px]"
              style={{
                color: phase.status !== "upcoming" && phase.status !== "locked" ? TEXT.primary : TEXT.tertiary,
                fontFamily: FONT.display,
                fontWeight: 500,
              }}
            >
              {phase.title}
            </span>
          </div>

          {/* Full variant: weeks + milestone count */}
          {variant === "full" && (
            <div className="flex items-center justify-between mt-0.5">
              {phase.weeks && (
                <span className="text-[10px]" style={{ color: TEXT.muted, fontFamily: FONT.body }}>
                  {phase.weeks}
                </span>
              )}
              {phase.milestonesTotal != null && (
                <span className="text-[10px] tabular-nums" style={{ color: TEXT.muted, fontFamily: FONT.body }}>
                  {phase.milestonesDone}/{phase.milestonesTotal}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}
