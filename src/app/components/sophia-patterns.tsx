/**
 * Sophia Patterns — Sophia Design System
 *
 * SophiaInsight: intelligent insight card. Pass explicit variant OR context
 * and let resolveVariant() pick the right one automatically.
 *
 * Variants:
 *   panel     — right-column glass card with message + action CTA (EdgePath, dashboards)
 *   inline    — compact tip embedded inside another card
 *   note      — message composer for parent→child communication (intent-driven)
 *   compact   — single-line tip with Sophia mark
 *
 * SophiaBottomBar: the fixed h-14 bottom bar present on all role shells.
 * Extracted from role-shell.tsx so it can be imported independently.
 *
 * Intent-based selection:
 *   context.role === "parent" && context.event === "milestone-completed" → "note"
 *   context.surface === "edgepath"  → "panel"
 *   default                         → "inline"
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mic, Send, Menu, LayoutGrid } from "lucide-react";
import { SophiaMark } from "./sophia-mark";
import { EASE, TEXT, SURFACE, FONT, COLORS } from "./tokens";

export type NavVariation = "A" | "B";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SophiaInsightVariant = "panel" | "inline" | "note" | "compact";

export interface SophiaIntentContext {
  role?: string;
  surface?: string;
  /** Semantic event: "milestone-completed", "child-linked", "application-sent", etc. */
  event?: string;
  /** Subject of the event: "Alex", a milestone label, etc. */
  subject?: string;
}

// ─── Intent resolver ─────────────────────────────────────────────────────────

function resolveVariant(ctx: SophiaIntentContext): SophiaInsightVariant {
  if (ctx.role === "parent" && ctx.event === "milestone-completed") return "note";
  if (ctx.surface === "edgepath") return "panel";
  if (ctx.surface === "dashboard") return "panel";
  return "inline";
}

// ─── Panel variant ────────────────────────────────────────────────────────────

function SophiaPanel({
  message,
  actionLabel,
  onAction,
  actionPrompt,
  delay,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionPrompt?: string;
  delay: number;
}) {
  return (
    <motion.div
      className="rounded-xl p-5"
      style={{
        background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.05), rgba(var(--ce-glass-tint),0.02) 50%, rgba(var(--ce-lime-rgb),0.02))",
        border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={14} glowing={false} />
        <span
          className="text-[11px] tracking-wide"
          style={{ color: COLORS.cyan, fontFamily: FONT.display, fontWeight: 500, letterSpacing: "0.06em" }}
        >
          SOPHIA
        </span>
      </div>

      <p className="text-[13px] leading-relaxed mb-4" style={{ color: TEXT.secondary, fontFamily: FONT.body }}>
        {message}
      </p>

      {(actionLabel || onAction) && (
        <button
          onClick={onAction}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.1), rgba(var(--ce-lime-rgb),0.05))",
            border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
            color: COLORS.cyan,
            fontFamily: FONT.body,
            fontSize: 12,
          }}
        >
          <Sparkles className="w-3 h-3" />
          {actionLabel ?? "Ask Sophia"}
        </button>
      )}
    </motion.div>
  );
}

// ─── Inline variant ───────────────────────────────────────────────────────────

function SophiaInline({
  message,
  actionLabel,
  onAction,
  delay,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-start gap-2.5 py-3 px-4 rounded-xl"
      style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3, ease: EASE }}
    >
      <SophiaMark size={12} glowing={false} />
      <p className="flex-1 text-[12px] leading-relaxed" style={{ color: TEXT.secondary, fontFamily: FONT.body }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-[11px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ color: COLORS.cyan, fontFamily: FONT.body }}
        >
          {actionLabel} →
        </button>
      )}
    </motion.div>
  );
}

// ─── Compact variant ──────────────────────────────────────────────────────────

function SophiaCompact({
  message,
  delay,
}: {
  message: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 text-[12px]"
      style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.25, ease: EASE }}
    >
      <SophiaMark size={10} glowing={false} />
      {message}
    </motion.div>
  );
}

// ─── Note variant ─────────────────────────────────────────────────────────────
// Intent: parent has just viewed a child's milestone → Sophia offers a note composer.

function SophiaNote({
  subject = "Alex",
  delay,
}: {
  subject?: string;
  delay: number;
}) {
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!note.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setNote(""); }, 2000);
  };

  return (
    <motion.div
      className="rounded-xl p-4"
      style={{
        background: "linear-gradient(145deg, rgba(var(--ce-role-parent-rgb),0.05), rgba(var(--ce-glass-tint),0.02))",
        border: "1px solid rgba(var(--ce-role-parent-rgb),0.1)",
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={13} glowing={false} />
        <span
          className="text-[11px] tracking-wide"
          style={{ color: "var(--ce-role-parent)", fontFamily: FONT.display, fontWeight: 500, letterSpacing: "0.06em" }}
        >
          SOPHIA SUGGESTS
        </span>
      </div>

      <p className="text-[12px] mb-3 leading-relaxed" style={{ color: TEXT.secondary, fontFamily: FONT.body }}>
        {sent ? `Note sent to ${subject} ✓` : `Leave a note for ${subject} about this milestone?`}
      </p>

      {!sent && (
        <>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`A word of encouragement for ${subject}...`}
            rows={2}
            className="w-full text-[12px] rounded-lg px-3 py-2.5 mb-3 resize-none outline-none"
            style={{
              background: "rgba(var(--ce-glass-tint),0.03)",
              border: "1px solid rgba(var(--ce-glass-tint),0.07)",
              color: TEXT.primary,
              fontFamily: FONT.body,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!note.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all disabled:opacity-40 disabled:cursor-default hover:brightness-110"
            style={{
              background: "rgba(var(--ce-role-parent-rgb),0.12)",
              border: "1px solid rgba(var(--ce-role-parent-rgb),0.2)",
              color: "var(--ce-role-parent)",
              fontFamily: FONT.body,
            }}
          >
            <Send className="w-3 h-3" /> Send note
          </button>
        </>
      )}
    </motion.div>
  );
}

// ─── SophiaInsight (main export) ──────────────────────────────────────────────

interface SophiaInsightProps {
  /** Explicit variant. If omitted, pass context for auto-resolution. */
  variant?: SophiaInsightVariant;
  /** Intent context — used when variant is omitted. */
  context?: SophiaIntentContext;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** For note variant: the child's name */
  subject?: string;
  delay?: number;
}

export function SophiaInsight({
  variant,
  context,
  message = "",
  actionLabel,
  onAction,
  subject,
  delay = 0,
}: SophiaInsightProps) {
  const resolved = variant ?? (context ? resolveVariant(context) : "panel");
  const subjectName = subject ?? context?.subject ?? "Alex";

  if (resolved === "note") return <SophiaNote subject={subjectName} delay={delay} />;
  if (resolved === "inline") return <SophiaInline message={message} actionLabel={actionLabel} onAction={onAction} delay={delay} />;
  if (resolved === "compact") return <SophiaCompact message={message} delay={delay} />;
  return <SophiaPanel message={message} actionLabel={actionLabel} onAction={onAction} delay={delay} />;
}

// ─── SophiaBottomBar (extracted from role-shell.tsx) ──────────────────────────

interface SophiaBottomBarProps {
  context: {
    message: string;
    chips: { label: string; action: string }[];
  };
  onAskSophia: () => void;
  onVoiceStart: () => void;
  onChipClick: (action: string) => void;
  /** Navigation variation — controls extra controls on the bar */
  navVariation?: NavVariation;
  /** Variation A: toggle the explore dock */
  onToggleExplore?: () => void;
  /** Variation B: current mode of the segmented toggle */
  exploreMode?: "chat" | "explore";
  /** Variation B: callback when segment changes */
  onExploreModeChange?: (mode: "chat" | "explore") => void;
}

export function SophiaBottomBar({
  context,
  onAskSophia,
  onVoiceStart,
  onChipClick,
  navVariation,
  onToggleExplore,
  exploreMode = "chat",
  onExploreModeChange,
}: SophiaBottomBarProps) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 h-14"
      style={{
        background: SURFACE.overlay,
        borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)",
        backdropFilter: "blur(16px)",
      }}
      initial={{ y: 56 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
    >
      {/* Variation A: Hamburger menu on the left */}
      {navVariation === "A" && onToggleExplore && (
        <button
          onClick={onToggleExplore}
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
          style={{
            background: "rgba(var(--ce-glass-tint),0.03)",
            border: "1px solid rgba(var(--ce-glass-tint),0.06)",
          }}
          title="Explore features"
        >
          <Menu className="w-4 h-4" style={{ color: TEXT.tertiary }} />
        </button>
      )}

      <SophiaMark size={18} glowing={false} />

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-[13px] truncate hidden sm:block" style={{ color: TEXT.tertiary, fontFamily: FONT.body }}>
          {context.message}
        </span>
        <div className="flex gap-2 flex-shrink-0">
          {context.chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onChipClick(chip.action)}
              className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors whitespace-nowrap"
              style={{
                background: "rgba(var(--ce-glass-tint),0.03)",
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                color: TEXT.secondary,
                fontFamily: FONT.body,
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice entry */}
      <button
        onClick={onVoiceStart}
        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(var(--ce-lime-rgb),0.08)] group flex-shrink-0"
        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        title="Talk to Sophia"
      >
        <Mic className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] group-hover:text-ce-lime transition-colors" />
      </button>

      {/* Variation B: Chat | Explore segment toggle */}
      {navVariation === "B" && onExploreModeChange ? (
        <div
          className="flex items-center rounded-lg overflow-hidden flex-shrink-0"
          style={{
            background: "rgba(var(--ce-glass-tint),0.03)",
            border: "1px solid rgba(var(--ce-glass-tint),0.08)",
          }}
        >
          <button
            onClick={() => onExploreModeChange("chat")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] cursor-pointer transition-all"
            style={{
              background: exploreMode === "chat" ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "transparent",
              color: exploreMode === "chat" ? COLORS.cyan : TEXT.tertiary,
              fontFamily: FONT.body,
              fontWeight: exploreMode === "chat" ? 500 : 400,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Chat
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(var(--ce-glass-tint),0.08)" }} />
          <button
            onClick={() => onExploreModeChange("explore")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] cursor-pointer transition-all"
            style={{
              background: exploreMode === "explore" ? "rgba(var(--ce-glass-tint),0.06)" : "transparent",
              color: exploreMode === "explore" ? TEXT.primary : TEXT.tertiary,
              fontFamily: FONT.body,
              fontWeight: exploreMode === "explore" ? 500 : 400,
            }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Explore
          </button>
        </div>
      ) : (
        /* Default / Variation A: Ask Sophia CTA */
        <button
          onClick={onAskSophia}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] transition-colors flex-shrink-0"
          style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: COLORS.cyan }} />
          <span className="text-[12px]" style={{ color: COLORS.cyan, fontFamily: FONT.body }}>Ask Sophia</span>
        </button>
      )}
    </motion.div>
  );
}
