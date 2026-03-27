/**
 * Shared Feedback System
 * - toast() helpers with brand styling
 * - EmptyState component (role-colored)
 * - SkeletonBlock component (shimmer loading)
 * - ConfirmDialog component
 * - BannerAlert component
 */

import { motion, AnimatePresence } from "motion/react";
import { toast as sonnerToast } from "sonner";
import { Check, AlertCircle, Info, X, Sparkles, Zap } from "lucide-react";
import { TEXT, SURFACE, GLASS_TINT } from "../tokens";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Toast helpers ────────────────────────────────────────────────────────────
// Wrap sonner's toast with our brand styling

export const toast = {
  success: (msg: string, description?: string) =>
    sonnerToast.success(msg, {
      description,
      style: {
        background: SURFACE.modalBg,
        border: "1px solid rgba(var(--ce-lime-rgb),0.2)",
        color: TEXT.primary,
        fontFamily: "var(--font-body)",
      },
      icon: <Check className="w-4 h-4 text-ce-lime" />,
    }),

  error: (msg: string, description?: string) =>
    sonnerToast.error(msg, {
      description,
      style: {
        background: SURFACE.modalBg,
        border: "1px solid rgba(var(--ce-status-error-rgb),0.2)",
        color: TEXT.primary,
        fontFamily: "var(--font-body)",
      },
      icon: <X className="w-4 h-4 text-[var(--ce-status-error)]" />,
    }),

  info: (msg: string, description?: string) =>
    sonnerToast(msg, {
      description,
      style: {
        background: SURFACE.modalBg,
        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)",
        color: TEXT.primary,
        fontFamily: "var(--font-body)",
      },
      icon: <Info className="w-4 h-4 text-ce-cyan" />,
    }),

  sophia: (msg: string) =>
    sonnerToast(msg, {
      style: {
        background: SURFACE.modalBg,
        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)",
        color: TEXT.primary,
        fontFamily: "var(--font-body)",
      },
      icon: <Sparkles className="w-4 h-4 text-ce-cyan" />,
    }),

  warning: (msg: string, description?: string) =>
    sonnerToast.warning(msg, {
      description,
      style: {
        background: SURFACE.modalBg,
        border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.2)",
        color: TEXT.primary,
        fontFamily: "var(--font-body)",
      },
      icon: <AlertCircle className="w-4 h-4 text-[var(--ce-role-edgepreneur)]" />,
    }),
};

// ─── Skeleton Block ───────────────────────────────────────────────────────────

export function SkeletonBlock({
  className = "",
  style,
  rounded = "rounded-lg",
}: {
  className?: string;
  style?: React.CSSProperties;
  rounded?: string;
}) {
  return (
    <div
      className={`${rounded} ${className} overflow-hidden`}
      style={{
        background: `rgba(${GLASS_TINT},0.04)`,
        ...style,
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${GLASS_TINT},0.04), transparent)`,
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function SkeletonKPIRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl p-4" style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}>
          <SkeletonBlock className="h-4 w-16 mb-3" />
          <SkeletonBlock className="h-8 w-20 mb-2" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-4" style={{ background: `rgba(${GLASS_TINT},0.025)`, border: `1px solid rgba(${GLASS_TINT},0.05)` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <SkeletonBlock className="h-3 w-16 mb-2" />
          <SkeletonBlock className="h-4 w-48 mb-1" />
          <SkeletonBlock className="h-3 w-32" />
        </div>
        <SkeletonBlock className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBlock className="h-1.5 w-full rounded-full mb-3" />
      <div className="flex gap-3">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5" style={{ borderBottom: `1px solid rgba(${GLASS_TINT},0.04)` }}>
      <SkeletonBlock className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <SkeletonBlock className="h-3 w-32 mb-1.5" />
        <SkeletonBlock className="h-2.5 w-48" />
      </div>
      <SkeletonBlock className="h-3 w-16" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
  accent = "var(--ce-role-edgestar)",
  delay = 0.2,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  accent?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${accent}10`, border: `1px solid ${accent}18` }}
      >
        <div style={{ color: accent }}>{icon}</div>
      </div>
      <h3 className="text-[15px] text-[var(--ce-text-primary)] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        {title}
      </h3>
      <p className="text-[13px] text-[var(--ce-text-secondary)] leading-relaxed mb-5 max-w-[280px]" style={{ fontFamily: "var(--font-body)" }}>
        {description}
      </p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          <Zap className="w-3.5 h-3.5" />
          {action}
        </button>
      )}
    </motion.div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  confirmColor = "var(--ce-status-error)",
  isDangerous = false,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: string;
  isDangerous?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" style={{ background: SURFACE.overlay, backdropFilter: "blur(4px)" }} onClick={onCancel} />
          <motion.div
            className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
            style={{ background: SURFACE.modalBg, border: `1px solid ${isDangerous ? "rgba(var(--ce-status-error-rgb),0.15)" : `rgba(${GLASS_TINT},0.08)`}` }}
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="px-5 py-5">
              {isDangerous && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4" style={{ background: "rgba(var(--ce-status-error-rgb),0.1)", border: "1px solid rgba(var(--ce-status-error-rgb),0.2)" }}>
                  <AlertCircle className="w-5 h-5 text-[var(--ce-status-error)]" />
                </div>
              )}
              <h3 className="text-[16px] text-[var(--ce-text-primary)] mb-2 text-center" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {title}
              </h3>
              <p className="text-[13px] text-[var(--ce-text-secondary)] leading-relaxed text-center" style={{ fontFamily: "var(--font-body)" }}>
                {description}
              </p>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
                style={{ border: `1px solid rgba(${GLASS_TINT},0.08)`, color: TEXT.tertiary, fontFamily: "var(--font-body)" }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: `${confirmColor}15`, border: `1px solid ${confirmColor}30`, color: confirmColor, fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Banner Alert ─────────────────────────────────────────────────────────────

export function BannerAlert({
  type = "info",
  message,
  action,
  onAction,
  onDismiss,
}: {
  type?: "info" | "warning" | "success" | "error";
  message: string;
  action?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}) {
  const config = {
    info:    { color: "var(--ce-role-edgestar)", icon: <Info className="w-4 h-4" /> },
    warning: { color: "var(--ce-role-edgepreneur)", icon: <AlertCircle className="w-4 h-4" /> },
    success: { color: "var(--ce-lime)", icon: <Check className="w-4 h-4" /> },
    error:   { color: "var(--ce-status-error)", icon: <X className="w-4 h-4" /> },
  }[type];

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
      style={{ background: `${config.color}08`, border: `1px solid ${config.color}18` }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <div style={{ color: config.color }}>{config.icon}</div>
      <span className="flex-1 text-[12px]" style={{ color: TEXT.tertiary, fontFamily: "var(--font-body)" }}>
        {message}
      </span>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-[11px] cursor-pointer hover:underline flex-shrink-0"
          style={{ color: config.color, fontFamily: "var(--font-body)" }}
        >
          {action}
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="cursor-pointer flex-shrink-0">
          <X className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
        </button>
      )}
    </motion.div>
  );
}
