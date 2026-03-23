/**
 * TabSwitcher — Layer 1 Design System
 *
 * Unified tab and option switcher. Three variants:
 *
 *   pill         — horizontal pill nav (top nav, surface tabs). Active pill has
 *                  animated background via layoutId.
 *   underline    — horizontal tabs with animated underline (view toggles, dual-mode).
 *   option-grid  — card-style option picker (onboarding, involvement level, role select).
 *                  Supports subtitle per option.
 *
 * All variants share the same props surface — just change variant.
 */

import { motion } from "motion/react";
import { EASE, SPRING_SNAPPY, TEXT, SURFACE, FONT } from "./tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  subtitle?: string;     // option-grid only — description below label
  disabled?: boolean;
}

interface TabSwitcherProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  /** pill = nav, underline = view toggle, option-grid = card picker */
  variant?: "pill" | "underline" | "option-grid";
  accent?: string;       // active color for underline + option-grid
  layoutId?: string;     // unique per switcher for layoutId isolation
  className?: string;
}

// ─── Pill Variant ─────────────────────────────────────────────────────────────

function PillSwitcher({ tabs, active, onChange, layoutId = "tab-pill" }: TabSwitcherProps) {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-default"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ background: SURFACE.activeNav, border: `1px solid ${SURFACE.activeNavBorder}` }}
                layoutId={layoutId}
                transition={{ type: "spring", ...SPRING_SNAPPY }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              {tab.icon && (
                <div style={{ color: isActive ? TEXT.primary : TEXT.tertiary }}>
                  {tab.icon}
                </div>
              )}
              <span
                className="text-[13px]"
                style={{ color: isActive ? TEXT.primary : TEXT.tertiary, fontFamily: FONT.body }}
              >
                {tab.label}
              </span>
              {tab.badge != null && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)",
                    color: isActive ? "var(--ce-role-edgestar)" : TEXT.tertiary,
                    fontFamily: FONT.body,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Underline Variant ────────────────────────────────────────────────────────

function UnderlineSwitcher({
  tabs,
  active,
  onChange,
  accent = "var(--ce-role-edgestar)",
  layoutId = "tab-underline",
}: TabSwitcherProps) {
  return (
    <div
      className="flex gap-1 p-0.5 rounded-lg"
      style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] cursor-pointer transition-all disabled:opacity-40"
            style={{
              background: isActive ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
              border: isActive ? "1px solid rgba(var(--ce-glass-tint),0.08)" : "1px solid transparent",
              color: isActive ? TEXT.primary : TEXT.tertiary,
              fontFamily: FONT.body,
            }}
          >
            {tab.icon && <div>{tab.icon}</div>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Option Grid Variant ──────────────────────────────────────────────────────

function OptionGridSwitcher({
  tabs,
  active,
  onChange,
  accent = "var(--ce-role-edgestar)",
  layoutId = "tab-option",
}: TabSwitcherProps) {
  const cols = tabs.length <= 2 ? 2 : tabs.length === 3 ? 3 : 2;

  return (
    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className="relative rounded-xl p-4 text-left cursor-pointer transition-all disabled:opacity-40 disabled:cursor-default"
            style={{
              background: isActive ? `${accent}0A` : SURFACE.card,
              border: `1.5px solid ${isActive ? `${accent}30` : SURFACE.cardBorder}`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                layoutId={layoutId}
                style={{ background: `${accent}06`, border: `1.5px solid ${accent}30` }}
                transition={{ type: "spring", ...SPRING_SNAPPY }}
              />
            )}
            <div className="relative z-10">
              {tab.icon && (
                <div className="mb-2" style={{ color: isActive ? accent : TEXT.tertiary }}>
                  {tab.icon}
                </div>
              )}
              <div
                className="text-[13px]"
                style={{
                  color: isActive ? TEXT.primary : TEXT.secondary,
                  fontFamily: FONT.display,
                  fontWeight: 500,
                }}
              >
                {tab.label}
              </div>
              {tab.subtitle && (
                <div
                  className="text-[11px] mt-1 leading-relaxed"
                  style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                >
                  {tab.subtitle}
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function TabSwitcher(props: TabSwitcherProps) {
  const { variant = "pill" } = props;
  if (variant === "underline") return <UnderlineSwitcher {...props} />;
  if (variant === "option-grid") return <OptionGridSwitcher {...props} />;
  return <PillSwitcher {...props} />;
}
