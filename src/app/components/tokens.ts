/**
 * Design Tokens — Single Source of Truth
 *
 * All hardcoded values live here. Import from this file — do NOT define
 * EASE, SPRING, or color constants locally in any component.
 *
 * Usage:
 *   import { EASE, SPRING, ROLE_ACCENT, COLORS, TEXT, SURFACE, FONT } from "./tokens";
 */

// ─── Motion ──────────────────────────────────────────────────────────────────

/** Canonical cubic-bezier used for all transitions and animations. */
export const EASE = [0.32, 0.72, 0, 1] as const;

/** Spring config for physics-based transitions (modals, card entrances). */
export const SPRING = { stiffness: 160, damping: 24 } as const;

/** Spring config for snappy UI feedback (tabs, pills, toggles). */
export const SPRING_SNAPPY = { stiffness: 400, damping: 30 } as const;

/** Delight pulse spring — lime only, 400ms, gone in under a second. */
export const SPRING_DELIGHT = { stiffness: 380, damping: 22 } as const;

// ─── Role Types ──────────────────────────────────────────────────────────────

export type RoleId = "edgestar" | "edgepreneur" | "parent" | "guide" | "employer" | "edu" | "ngo" | "agency";

// ─── Role Accent Colors ───────────────────────────────────────────────────────
// Uses CSS vars so colors adapt to light/dark theme automatically.

export const ROLE_ACCENT: Record<string, string> = {
  edgestar:    "var(--ce-role-edgestar)",
  edgepreneur: "var(--ce-role-edgepreneur)",
  parent:      "var(--ce-role-parent)",
  guide:       "var(--ce-role-guide)",
  employer:    "var(--ce-role-employer)",
  edu:         "var(--ce-role-edu)",
  ngo:         "var(--ce-role-ngo)",
  agency:      "var(--ce-role-agency)",
};

/** RGB triplets for rgba() composition: `rgba(${ROLE_ACCENT_RGB[role]}, 0.1)` */
export const ROLE_ACCENT_RGB: Record<string, string> = {
  edgestar:    "var(--ce-role-edgestar-rgb)",
  edgepreneur: "var(--ce-role-edgepreneur-rgb)",
  parent:      "var(--ce-role-parent-rgb)",
  guide:       "var(--ce-role-guide-rgb)",
  employer:    "var(--ce-role-employer-rgb)",
  edu:         "var(--ce-role-edu-rgb)",
  ngo:         "var(--ce-role-ngo-rgb)",
  agency:      "var(--ce-role-agency-rgb)",
};

/** Helper: creates role-tinted background with opacity */
export function roleAccentBg(role: string, opacity: number): string {
  const rgb = ROLE_ACCENT_RGB[role] || ROLE_ACCENT_RGB.edgestar;
  return `rgba(${rgb}, ${opacity})`;
}

// ─── Brand Colors ─────────────────────────────────────────────────────────────
// Uses CSS vars so colors adapt to light/dark theme automatically.

export const COLORS = {
  cyan:   "var(--ce-role-edgestar)",   // Sophia primary / EdgeStar accent
  lime:   "var(--ce-lime)",            // EdgeGas / delight moments / trend up
  pink:   "var(--ce-role-parent)",     // Parent accent
  purple: "var(--ce-role-guide)",      // Guide accent / secondary
  amber:  "var(--ce-role-edgepreneur)",// EdgePreneur accent / warning
  green:  "var(--ce-role-employer)",   // Employer accent / success
  blue:   "var(--ce-role-edu)",        // Education accent
  orange: "var(--ce-role-ngo)",        // NGO accent
  indigo: "var(--ce-role-agency)",     // Agency accent
} as const;

// ─── Status Colors ───────────────────────────────────────────────────────────

export const STATUS = {
  success:      "var(--ce-status-success)",
  successMuted: "var(--ce-status-success-muted)",
  warning:      "var(--ce-status-warning)",
  warningMuted: "var(--ce-status-warning-muted)",
  error:        "var(--ce-status-error)",
  errorMuted:   "var(--ce-status-error-muted)",
  info:         "var(--ce-status-info)",
  infoMuted:    "var(--ce-status-info-muted)",
} as const;

export const STATUS_RGB = {
  success: "var(--ce-status-success-rgb)",
  warning: "var(--ce-status-warning-rgb)",
  error:   "var(--ce-status-error-rgb)",
  info:    "var(--ce-status-info-rgb)",
} as const;

// ─── Text Scale ───────────────────────────────────────────────────────────────
// Uses CSS custom properties so colors adapt to light/dark theme automatically.

export const TEXT = {
  primary:   "var(--ce-text-primary)",     // headings, values, active labels
  secondary: "var(--ce-text-secondary)",   // body text, descriptions
  tertiary:  "var(--ce-text-tertiary)",    // subtext, timestamps, inactive labels
  muted:     "var(--ce-text-quaternary)",  // very dim — dates in lists, disabled states
} as const;

// ─── Surface / Glass ──────────────────────────────────────────────────────────
// Uses CSS custom properties so surfaces adapt to light/dark theme automatically.

export const SURFACE = {
  bg:              "var(--ce-surface-bg)",
  card:            "var(--ce-surface-card)",
  cardBorder:      "var(--ce-surface-card-border)",
  hover:           "var(--ce-surface-hover)",
  activeNav:       "var(--ce-surface-active-nav)",
  activeNavBorder: "var(--ce-surface-active-nav-border)",
  divider:         "var(--ce-surface-divider)",
  subtleBorder:    "var(--ce-border-subtle)",
  overlay:         "var(--ce-surface-overlay)",
  modalBg:         "var(--ce-surface-modal-bg)",
} as const;

// ─── Glass Tint Helper ──────────────────────────────────────────────────────
// Use this for composing rgba() with variable tint: `rgba(var(--ce-glass-tint), 0.06)`
// In dark mode: white tint. In light mode: black tint. Adapts automatically.
export const GLASS_TINT = "var(--ce-glass-tint)" as const;
export const GAUGE_TRACK = "var(--ce-gauge-track)" as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const FONT = {
  display: "var(--font-display)",  // headings, labels, values — weight 500
  body:    "var(--font-body)",     // descriptions, meta text
} as const;

// ─── Pipeline Stage Colors (employer-specific, reused in pipeline-surface) ────

export const PIPELINE_STAGE_COLORS: Record<string, string> = {
  new:        "var(--ce-text-tertiary)",
  screening:  "var(--ce-role-edgestar)",
  interview:  "var(--ce-role-guide)",
  final:      "var(--ce-role-edgepreneur)",
  offer:      "var(--ce-role-employer)",
};

// ─── Category Colors (milestones across all role EdgePaths) ──────────────────

export const CATEGORY_COLORS = {
  // Normalized: skill/learn → same visual
  skill:    { color: "var(--ce-role-edgestar)", label: "Skill" },
  learn:    { color: "var(--ce-role-edgestar)", label: "Learn" },
  action:   { color: "var(--ce-lime)", label: "Action" },
  resource: { color: "var(--ce-text-secondary)", label: "Resource" },
  habit:    { color: "var(--ce-text-secondary)", label: "Habit" },
} as const;
