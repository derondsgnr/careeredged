/**
 * Shared Patterns — Layer 0 Design System
 *
 * Reusable components derived from the CareerEdge design language.
 * All surfaces build from these primitives — ensures visual cohesion
 * across all 8 roles without per-surface custom patterns.
 *
 * Exports:
 *   EASE            — canonical spring curve used everywhere
 *   MOTION          — standard animation variant presets
 *   EmptyState      — role-aware empty state with CTA
 *   SophiaHandoff   — surface card for Sophia-delegated features
 *   SectionCard     — standard dashboard card frame with header
 *   QRModal         — shared QR display/scan modal
 *   DelightPulse    — lime pulse delight wrapper
 *   useLimeDelight  — hook to trigger delight pulse programmatically
 *   ExitChip        — cross-surface navigation chip
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Sparkles, X, QrCode, Camera, CheckCircle2, type LucideIcon,
} from "lucide-react";

// ─── Motion constants ─────────────────────────────────────────────────────────

export const EASE = [0.32, 0.72, 0, 1] as const;

export const MOTION = {
  /** Standard surface entry — fade + lift */
  surface: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: EASE },
  },
  /** Card stagger entry — use delay prop for sequence */
  card: (delay = 0) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay, ease: EASE },
  }),
  /** Sophia bar crossfade — 200ms */
  sophia: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  /** Delight pulse — 400ms spring, lime only */
  delight: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.04 },
    transition: { type: "spring", stiffness: 380, damping: 22 },
  },
} as const;

// ─── useLimeDelight ───────────────────────────────────────────────────────────

/**
 * Hook to trigger a lime delight pulse.
 * The product OS says: this is the ONLY place lime is expressive.
 * Call trigger() on milestone complete, EdgeGas earn, etc.
 */
export function useLimeDelight() {
  const [pulsing, setPulsing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    setPulsing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPulsing(false), 600);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { pulsing, trigger };
}

// ─── DelightPulse ─────────────────────────────────────────────────────────────

/**
 * Wraps content with a lime ring pulse on delight moments.
 * Brand guideline: brief, 400ms spring, gone in under a second.
 * Use sparingly — restraint is the delight.
 */
export function DelightPulse({
  active,
  children,
  className = "",
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ boxShadow: "0 0 0 2px rgba(179,255,59,0.5), 0 0 12px rgba(179,255,59,0.15)" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

/**
 * Role-aware empty state — the first thing a user sees on an unpopulated surface.
 * Design rule: one clear primary action, never strand the user.
 * Empty states must have:
 *   - A purposeful icon (not generic)
 *   - A title that names what's missing, not a feature
 *   - Body that explains the value, not the steps
 *   - A primary CTA styled with the role color
 *   - An optional Sophia shortcut ("Ask Sophia to help")
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  sophiaAction,
  roleColor = "#22D3EE",
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  sophiaAction?: { prompt: string; onClick: (prompt: string) => void };
  roleColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
    >
      {/* Icon container */}
      <motion.div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: `${roleColor}12`, border: `1px solid ${roleColor}20` }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: delay + 0.08, ease: EASE }}
      >
        <Icon className="w-7 h-7" style={{ color: roleColor }} />
      </motion.div>

      {/* Copy */}
      <h2
        className="text-[18px] text-[#E8E8ED] mb-2"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {title}
      </h2>
      <p
        className="text-[13px] text-[#6B7280] max-w-[300px] leading-relaxed mb-8"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {description}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        <button
          onClick={primaryAction.onClick}
          className="w-full px-4 py-3 rounded-xl text-[13px] cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${roleColor}22, ${roleColor}0A)`,
            border: `1px solid ${roleColor}28`,
            color: "#E8E8ED",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
        >
          {primaryAction.label}
        </button>

        {sophiaAction && (
          <button
            onClick={() => sophiaAction.onClick(sophiaAction.prompt)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-colors hover:bg-[rgba(34,211,238,0.06)]"
            style={{
              background: "rgba(34,211,238,0.04)",
              border: "1px solid rgba(34,211,238,0.1)",
              color: "#22D3EE",
              fontFamily: "var(--font-body)",
            }}
          >
            <Sparkles className="w-3 h-3" /> Ask Sophia
          </button>
        )}

        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="w-full px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.03)]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              color: "#6B7280",
              fontFamily: "var(--font-body)",
            }}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── SophiaHandoff ────────────────────────────────────────────────────────────

/**
 * Used when a feature is intentionally Sophia-delegated — not a dead end.
 * Makes it clear to the user that Sophia handles this conversationally
 * rather than stranding them on a blank page.
 *
 * Distinguish from EmptyState: EmptyState = "nothing here yet, do X."
 * SophiaHandoff = "Sophia handles this — ask her."
 */
export function SophiaHandoff({
  title,
  description,
  prompt,
  examples,
  onOpenSophia,
  delay = 0,
}: {
  title: string;
  description: string;
  prompt: string;
  examples?: string[];
  onOpenSophia: (message: string) => void;
  delay?: number;
}) {
  return (
    <motion.div
      className="rounded-2xl p-6"
      style={{
        background: "linear-gradient(145deg, rgba(34,211,238,0.05), rgba(255,255,255,0.02))",
        border: "1px solid rgba(34,211,238,0.1)",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <SophiaMark size={16} glowing={false} />
        <span
          className="text-[11px] text-[#22D3EE] tracking-wide"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "0.06em" }}
        >
          SOPHIA HANDLES THIS
        </span>
      </div>

      <h3
        className="text-[14px] text-[#E8E8ED] mb-1.5"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {title}
      </h3>
      <p
        className="text-[12px] text-[#6B7280] leading-relaxed mb-5"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {description}
      </p>

      {/* Example prompts */}
      {examples && examples.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => onOpenSophia(ex)}
              className="text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors hover:bg-[rgba(34,211,238,0.08)]"
              style={{
                background: "rgba(34,211,238,0.04)",
                border: "1px solid rgba(34,211,238,0.08)",
                color: "#9CA3AF",
                fontFamily: "var(--font-body)",
              }}
            >
              "{ex}"
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => onOpenSophia(prompt)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          background: "rgba(34,211,238,0.08)",
          border: "1px solid rgba(34,211,238,0.14)",
          color: "#22D3EE",
          fontFamily: "var(--font-body)",
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Ask Sophia
      </button>
    </motion.div>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

/**
 * Standard dashboard section container.
 * Every dashboard card on every role uses this as its shell.
 * Header: icon + title + optional badge + optional action.
 * Content: free slot.
 * Footer: optional exit chip row.
 */
export function SectionCard({
  title,
  icon: Icon,
  badge,
  action,
  exitChips,
  children,
  gradient = false,
  delay = 0.3,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  badge?: number | string;
  action?: { label: string; onClick: () => void };
  exitChips?: { label: string; onClick: () => void }[];
  children: React.ReactNode;
  gradient?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`rounded-xl p-5 ${className}`}
      style={
        gradient
          ? {
              background:
                "linear-gradient(145deg, rgba(34,211,238,0.04), rgba(255,255,255,0.02) 50%, rgba(179,255,59,0.02))",
              border: "1px solid rgba(34,211,238,0.07)",
            }
          : {
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
            }
      }
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#6B7280]" />
          <span
            className="text-[13px] text-[#E8E8ED]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {title}
          </span>
          {badge !== undefined && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                background: "rgba(34,211,238,0.08)",
                color: "#22D3EE",
                fontFamily: "var(--font-display)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-[11px] text-[#22D3EE] cursor-pointer hover:text-[#67E8F9] transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content slot */}
      {children}

      {/* Exit chips */}
      {exitChips && exitChips.length > 0 && (
        <div
          className="flex gap-2 mt-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {exitChips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "#9CA3AF",
                fontFamily: "var(--font-body)",
              }}
            >
              {chip.label} →
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── ExitChip ─────────────────────────────────────────────────────────────────

/**
 * Cross-surface navigation chip.
 * Used as connective tissue between surfaces.
 * Examples: "Optimize for this job →" (EdgeMatch → ResumeEdge)
 */
export function ExitChip({
  label,
  onClick,
  roleColor = "#22D3EE",
}: {
  label: string;
  onClick: () => void;
  roleColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
      style={{
        background: `${roleColor}0A`,
        border: `1px solid ${roleColor}18`,
        color: roleColor,
        fontFamily: "var(--font-body)",
      }}
    >
      {label} →
    </button>
  );
}

// ─── QR Code SVG ─────────────────────────────────────────────────────────────

function MockQRCode({ size = 160, color = "#E8E8ED" }: { size?: number; color?: string }) {
  const modules = 21;
  const mod = size / modules;

  // Finder pattern — the 3 corner squares that make it look like a QR code
  const Finder = ({ row, col }: { row: number; col: number }) => {
    const x = col * mod;
    const y = row * mod;
    const w = 7 * mod;
    const bg = "rgba(8,9,12,1)";
    return (
      <g>
        {/* Outer ring */}
        <rect x={x} y={y} width={w} height={w} rx={mod * 0.35} fill={color} />
        {/* Gap */}
        <rect x={x + mod} y={y + mod} width={5 * mod} height={5 * mod} rx={mod * 0.2} fill={bg} />
        {/* Center block */}
        <rect x={x + 2 * mod} y={y + 2 * mod} width={3 * mod} height={3 * mod} rx={mod * 0.12} fill={color} />
      </g>
    );
  };

  // Determine which cells to exclude from data fill
  const isExcluded = (r: number, c: number) => {
    if (r <= 7 && c <= 7) return true;   // TL finder + separator
    if (r <= 7 && c >= 13) return true;  // TR finder + separator
    if (r >= 13 && c <= 7) return true;  // BL finder + separator
    if (r === 6 || c === 6) return true; // Timing strips
    return false;
  };

  const dataCells: [number, number][] = [];
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (isExcluded(r, c)) continue;
      // Deterministic fill — looks like real QR data
      const v = (r * 11 + c * 7 + ((r * c) % 5) + ((r + c) % 3)) % 3;
      if (v === 0) dataCells.push([r, c]);
    }
  }

  // Timing strips
  const timingCells: [number, number][] = [];
  for (let i = 8; i <= 12; i++) {
    if (i % 2 === 0) {
      timingCells.push([6, i], [i, 6]);
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Timing */}
      {timingCells.map(([r, c]) => (
        <rect key={`t${r}${c}`} x={c * mod + 1} y={r * mod + 1} width={mod - 2} height={mod - 2} rx={1} fill={color} />
      ))}
      {/* Data */}
      {dataCells.map(([r, c]) => (
        <rect key={`d${r}${c}`} x={c * mod + 1} y={r * mod + 1} width={mod - 2} height={mod - 2} rx={1} fill={color} />
      ))}
      {/* Finders on top */}
      <Finder row={0} col={0} />
      <Finder row={0} col={14} />
      <Finder row={14} col={0} />
    </svg>
  );
}

// ─── QRModal ──────────────────────────────────────────────────────────────────

/**
 * Shared QR modal used across:
 *   - EdgeParent: link to child account
 *   - EdgeEducation: event check-in
 *   - EdgeBuddy: peer accountability pairing
 *
 * Two tabs: "Show my QR" (others scan you) and "Scan a QR" (you scan others).
 */
export function QRModal({
  isOpen,
  onClose,
  title = "Connect via QR",
  showLabel = "Show my QR",
  scanLabel = "Scan a QR",
  showDescription = "Let the other person scan this code",
  scanDescription = "Point your camera at their QR code",
  onScanComplete,
  roleColor = "#22D3EE",
  identifier = "CE-2026",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showLabel?: string;
  scanLabel?: string;
  showDescription?: string;
  scanDescription?: string;
  onScanComplete?: (code: string) => void;
  roleColor?: string;
  identifier?: string;
}) {
  const [tab, setTab] = useState<"show" | "scan">("show");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success">("idle");
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScan = () => {
    setScanState("scanning");
    scanTimerRef.current = setTimeout(() => {
      setScanState("success");
      onScanComplete?.(`${identifier}-${Date.now().toString(36).toUpperCase()}`);
    }, 2400);
  };

  const handleClose = () => {
    setScanState("idle");
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setScanState("idle");
      setTab("show");
    }
    return () => { if (scanTimerRef.current) clearTimeout(scanTimerRef.current); };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(8,9,12,0.8)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-[61] w-[360px]"
            style={{
              background: "rgba(14,16,20,0.98)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(24px)",
              borderRadius: 20,
            }}
            initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "-48%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.94, x: "-50%", y: "-48%" }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span
                className="text-[14px] text-[#E8E8ED]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {title}
              </span>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                <X className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-4 pb-0">
              {([
                { id: "show", label: showLabel, icon: QrCode },
                { id: "scan", label: scanLabel, icon: Camera },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); setScanState("idle"); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] cursor-pointer transition-colors"
                  style={{
                    background: tab === id ? "rgba(255,255,255,0.06)" : "transparent",
                    border: tab === id ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                    color: tab === id ? "#E8E8ED" : "#6B7280",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                {tab === "show" ? (
                  <motion.div
                    key="show"
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* QR display */}
                    <div
                      className="relative w-[180px] h-[180px] rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(8,9,12,0.9)",
                        border: `1px solid ${roleColor}20`,
                        boxShadow: `0 0 32px ${roleColor}10`,
                        padding: 12,
                      }}
                    >
                      <MockQRCode size={156} color="#E8E8ED" />
                      {/* Corner glow */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{ boxShadow: `inset 0 0 20px ${roleColor}08` }}
                      />
                    </div>

                    <p
                      className="text-[12px] text-[#6B7280] text-center"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {showDescription}
                    </p>

                    {/* Identifier */}
                    <div
                      className="px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <span
                        className="text-[10px] text-[#374151] tabular-nums"
                        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
                      >
                        {identifier}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="scan"
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Viewfinder */}
                    <div
                      className="relative w-[180px] h-[180px] rounded-2xl overflow-hidden flex items-center justify-center"
                      style={{
                        background: "rgba(0,0,0,0.85)",
                        border: `1px solid ${scanState === "success" ? "#B3FF3B" : roleColor}20`,
                      }}
                    >
                      {scanState === "idle" && (
                        <>
                          {/* Corner marks */}
                          {[
                            "top-2 left-2 border-t border-l",
                            "top-2 right-2 border-t border-r",
                            "bottom-2 left-2 border-b border-l",
                            "bottom-2 right-2 border-b border-r",
                          ].map((cls, i) => (
                            <div
                              key={i}
                              className={`absolute w-6 h-6 ${cls}`}
                              style={{ borderColor: roleColor, borderWidth: 2 }}
                            />
                          ))}
                          <Camera className="w-8 h-8 text-[#374151]" />
                        </>
                      )}

                      {scanState === "scanning" && (
                        <>
                          {/* Scanning line */}
                          <motion.div
                            className="absolute left-3 right-3 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${roleColor}, transparent)` }}
                            animate={{ top: ["20%", "80%", "20%"] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                          />
                          <span
                            className="text-[11px] text-[#9CA3AF] absolute bottom-3"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Scanning…
                          </span>
                        </>
                      )}

                      {scanState === "success" && (
                        <motion.div
                          className="flex flex-col items-center gap-2"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        >
                          <CheckCircle2 className="w-8 h-8 text-[#B3FF3B]" />
                          <span
                            className="text-[11px] text-[#B3FF3B]"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                          >
                            Connected
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <p
                      className="text-[12px] text-[#6B7280] text-center"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {scanDescription}
                    </p>

                    {scanState !== "success" && (
                      <button
                        onClick={handleScan}
                        disabled={scanState === "scanning"}
                        className="w-full py-3 rounded-xl text-[13px] cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-default"
                        style={{
                          background: `linear-gradient(135deg, ${roleColor}20, ${roleColor}08)`,
                          border: `1px solid ${roleColor}28`,
                          color: "#E8E8ED",
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}
                      >
                        {scanState === "scanning" ? "Scanning…" : "Start Scan"}
                      </button>
                    )}

                    {scanState === "success" && (
                      <button
                        onClick={handleClose}
                        className="w-full py-3 rounded-xl text-[13px] cursor-pointer"
                        style={{
                          background: "rgba(179,255,59,0.12)",
                          border: "1px solid rgba(179,255,59,0.2)",
                          color: "#B3FF3B",
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}
                      >
                        Done
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
