# CareerEdge Color System

> Complete color reference for both dark and light modes.
> Source of truth: `src/styles/theme.css` (CSS variables) + `src/app/components/tokens.ts` (JS tokens)

---

## How Colors Work

All colors are defined as **CSS custom properties** in `theme.css`. Components never hardcode hex values — they reference variables like `var(--ce-lime)` or use JS tokens from `tokens.ts` which themselves point to CSS vars.

- **Dark mode:** `:root` (default)
- **Light mode:** `:root.light` (toggled via `.light` class on `<html>`)
- **rgba composition:** Use RGB triplet vars: `rgba(var(--ce-lime-rgb), 0.2)`
- **Never use `color-mix()`** — use `rgba(var(--ce-*-rgb), alpha)` pattern instead

---

## Brand Colors

The two signature colors that define CareerEdge's visual identity.

| Token | CSS Variable | Dark Mode | Light Mode | Usage |
|-------|-------------|-----------|------------|-------|
| Lime | `--ce-lime` | `#B3FF3B` | `#16A34A` | EdgeGas, delight moments, achievements, CTAs |
| Lime muted | `--ce-lime-muted` | `rgba(179,255,59, 0.15)` | `rgba(22,163,74, 0.1)` | Lime backgrounds, subtle highlights |
| Lime RGB | `--ce-lime-rgb` | `179, 255, 59` | `22, 163, 74` | For rgba() composition |
| Cyan | `--ce-cyan` | `#22D3EE` | `#0891B2` | Sophia identity, intelligence signals |
| Cyan muted | `--ce-cyan-muted` | `rgba(34,211,238, 0.12)` | `rgba(8,145,178, 0.08)` | Cyan backgrounds |
| Cyan RGB | `--ce-cyan-rgb` | `34, 211, 238` | `8, 145, 178` | For rgba() composition |
| Forest | `--ce-forest` | `#042C01` | `#DCFCE7` | Deep green gradient base / light green tint |

---

## Tailwind Base Palette

These map to Tailwind utility classes: `bg-primary`, `text-foreground`, `border-border`, etc.

| Token | CSS Variable | Dark Mode | Light Mode | Usage |
|-------|-------------|-----------|------------|-------|
| Background | `--background` | `#0A0C10` | `#F8F9FC` | Page background |
| Foreground | `--foreground` | `#E8E8ED` | `#1A1D24` | Default text color |
| Primary | `--primary` | `#B3FF3B` (lime) | `#16A34A` (green) | Primary buttons, links |
| Primary foreground | `--primary-foreground` | `#0A0C10` | `#FFFFFF` | Text on primary buttons |
| Secondary | `--secondary` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.04)` | Secondary backgrounds |
| Secondary foreground | `--secondary-foreground` | `#E8E8ED` | `#1A1D24` | Text on secondary |
| Accent | `--accent` | `#22D3EE` (cyan) | `#0891B2` (teal) | Accent highlights, Sophia |
| Accent foreground | `--accent-foreground` | `#0A0C10` | `#FFFFFF` | Text on accent |
| Muted | `--muted` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.04)` | Muted backgrounds |
| Muted foreground | `--muted-foreground` | `#8B8FA0` | `#6B7280` | Muted text (WCAG AA: min 4.5:1) |
| Destructive | `--destructive` | `#EF4444` | `#DC2626` | Error buttons, delete actions |
| Destructive foreground | `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` | Text on destructive |
| Border | `--border` | `rgba(255,255,255, 0.08)` | `rgba(0,0,0, 0.08)` | Default borders |
| Input | `--input` | `transparent` | `transparent` | Input border (transparent) |
| Input background | `--input-background` | `rgba(255,255,255, 0.04)` | `rgba(0,0,0, 0.03)` | Input fill |
| Switch background | `--switch-background` | `rgba(255,255,255, 0.12)` | `rgba(0,0,0, 0.1)` | Toggle switch track |
| Ring | `--ring` | `rgba(178,255,59, 0.5)` | `rgba(16,163,74, 0.25)` | Focus ring |
| Card | `--card` | `rgba(255,255,255, 0.04)` | `rgba(0,0,0, 0.03)` | Card backgrounds |
| Card foreground | `--card-foreground` | `#E8E8ED` | `#1A1D24` | Card text |
| Popover | `--popover` | `#12141A` | `#FFFFFF` | Dropdown/popover bg |
| Popover foreground | `--popover-foreground` | `#E8E8ED` | `#1A1D24` | Popover text |

---

## Sidebar

| Token | CSS Variable | Dark Mode | Light Mode |
|-------|-------------|-----------|------------|
| Sidebar bg | `--sidebar` | `#0D0F14` | `#F1F3F8` |
| Sidebar foreground | `--sidebar-foreground` | `#E8E8ED` | `#1A1D24` |
| Sidebar primary | `--sidebar-primary` | `#B3FF3B` | `#16A34A` |
| Sidebar primary fg | `--sidebar-primary-foreground` | `#0A0C10` | `#FFFFFF` |
| Sidebar accent | `--sidebar-accent` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.04)` |
| Sidebar accent fg | `--sidebar-accent-foreground` | `#E8E8ED` | `#1A1D24` |
| Sidebar border | `--sidebar-border` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.06)` |
| Sidebar ring | `--sidebar-ring` | `rgba(178,255,59, 0.3)` | `rgba(16,163,74, 0.25)` |

---

## Surface System

Layered surfaces from deepest background to foreground overlays.

| Token | CSS Variable | Dark Mode | Light Mode | Usage |
|-------|-------------|-----------|------------|-------|
| Void | `--ce-void` | `#08090C` | `#F8F9FC` | Deepest background layer |
| Surface 0 | `--ce-surface-0` | `#0A0C10` | `#F8F9FC` | Page background |
| Surface 1 | `--ce-surface-1` | `#12141A` | `#FFFFFF` | Cards, panels |
| Surface 2 | `--ce-surface-2` | `#1A1D24` | `#F1F3F8` | Elevated cards, sidebars |
| Surface 3 | `--ce-surface-3` | `#22252E` | `#E8EBF0` | Highest elevation |
| Surface bg | `--ce-surface-bg` | `#08090C` | `#F8F9FC` | Alias for component use |
| Surface card | `--ce-surface-card` | `rgba(255,255,255, 0.025)` | `rgba(255,255,255, 0.8)` | Card fill |
| Surface card border | `--ce-surface-card-border` | `rgba(255,255,255, 0.05)` | `rgba(0,0,0, 0.06)` | Card border |
| Surface hover | `--ce-surface-hover` | `rgba(255,255,255, 0.04)` | `rgba(0,0,0, 0.03)` | Hover state |
| Active nav | `--ce-surface-active-nav` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.04)` | Active nav pill bg |
| Active nav border | `--ce-surface-active-nav-border` | `rgba(255,255,255, 0.08)` | `rgba(0,0,0, 0.08)` | Active nav pill border |
| Divider | `--ce-surface-divider` | `rgba(255,255,255, 0.03)` | `rgba(0,0,0, 0.05)` | Section dividers |
| Overlay | `--ce-surface-overlay` | `rgba(10,12,16, 0.92)` | `rgba(255,255,255, 0.92)` | Modal backdrop |
| Modal bg | `--ce-surface-modal-bg` | `rgba(14,16,20, 0.98)` | `rgba(255,255,255, 0.98)` | Modal surface |

---

## Text Hierarchy

| Token | CSS Variable | Dark Mode | Light Mode | WCAG AA | Usage |
|-------|-------------|-----------|------------|---------|-------|
| Primary | `--ce-text-primary` | `#E8E8ED` | `#1A1D24` | Pass | Headings, values, active labels |
| Secondary | `--ce-text-secondary` | `#9CA3AF` | `#4B5563` | Pass | Body text, descriptions |
| Tertiary | `--ce-text-tertiary` | `#8B90A0` | `#6B7280` | Pass (min) | Subtext, timestamps, inactive labels |
| Quaternary | `--ce-text-quaternary` | `#5C6370` | `#6B7280` | Decorative | Very dim — dates, disabled states |
| Ghost | `--ce-text-ghost` | `#2A3040` | `#D1D5DB` | N/A | Watermarks, placeholder backgrounds |

**WCAG AA rules:**
- `--ce-text-tertiary` must be at least `#8B90A0` on dark (not `#6B6F7B`)
- `--muted-foreground` must be at least `#8B8FA0` on dark
- All body text must achieve 4.5:1 contrast ratio against its background
- `disabled:opacity-70` (not 50) — already-dim colors at 50% become invisible

---

## Glass & Borders

| Token | CSS Variable | Dark Mode | Light Mode | Usage |
|-------|-------------|-----------|------------|-------|
| Glass high | `--ce-glass-high` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.05)` | Prominent glass surfaces |
| Glass mid | `--ce-glass-mid` | `rgba(255,255,255, 0.04)` | `rgba(0,0,0, 0.03)` | Standard glass |
| Glass low | `--ce-glass-low` | `rgba(255,255,255, 0.02)` | `rgba(0,0,0, 0.015)` | Subtle glass |
| Glass tint (RGB) | `--ce-glass-tint` | `255, 255, 255` | `0, 0, 0` | rgba() base: `rgba(var(--ce-glass-tint), 0.06)` |
| Shadow tint (RGB) | `--ce-shadow-tint` | `0, 0, 0` | `0, 0, 0` | Shadow composition |
| Border subtle | `--ce-border-subtle` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.06)` | Light borders |
| Border medium | `--ce-border-medium` | `rgba(255,255,255, 0.1)` | `rgba(0,0,0, 0.1)` | Standard borders |
| Border strong | `--ce-border-strong` | `#2A2D38` | `#D1D5DB` | Heavy borders, dividers |
| Gauge track | `--ce-gauge-track` | `rgba(255,255,255, 0.06)` | `rgba(0,0,0, 0.06)` | Progress bar tracks |

---

## Role Accent Colors

Each of the 8 user roles has a signature color that shifts between modes for optimal contrast.

| Role | CSS Variable | Dark Mode | Light Mode | RGB Variable |
|------|-------------|-----------|------------|--------------|
| EdgeStar | `--ce-role-edgestar` | `#22D3EE` (cyan) | `#0891B2` (teal) | `--ce-role-edgestar-rgb` |
| EdgePreneur | `--ce-role-edgepreneur` | `#F59E0B` (amber) | `#D97706` (amber dark) | `--ce-role-edgepreneur-rgb` |
| Parent | `--ce-role-parent` | `#EC4899` (pink) | `#DB2777` (pink dark) | `--ce-role-parent-rgb` |
| Guide | `--ce-role-guide` | `#8B5CF6` (violet) | `#7C3AED` (violet dark) | `--ce-role-guide-rgb` |
| Employer | `--ce-role-employer` | `#10B981` (emerald) | `#059669` (emerald dark) | `--ce-role-employer-rgb` |
| Education | `--ce-role-edu` | `#3B82F6` (blue) | `#2563EB` (blue dark) | `--ce-role-edu-rgb` |
| NGO | `--ce-role-ngo` | `#F97316` (orange) | `#EA580C` (orange dark) | `--ce-role-ngo-rgb` |
| Agency | `--ce-role-agency` | `#6366F1` (indigo) | `#4F46E5` (indigo dark) | `--ce-role-agency-rgb` |

**Usage pattern:**
```tsx
// Solid color
style={{ color: 'var(--ce-role-edgestar)' }}

// With opacity via RGB triplet
style={{ background: 'rgba(var(--ce-role-edgestar-rgb), 0.1)' }}

// Via JS tokens
import { ROLE_ACCENT, roleAccentBg } from './tokens';
style={{ color: ROLE_ACCENT[role] }}
style={{ background: roleAccentBg(role, 0.1) }}
```

---

## Status Colors

| Status | CSS Variable | Dark Mode | Light Mode | Muted (Dark) | Muted (Light) |
|--------|-------------|-----------|------------|--------------|---------------|
| Success | `--ce-status-success` | `#10B981` | `#059669` | `rgba(16,185,129, 0.12)` | `rgba(5,150,105, 0.08)` |
| Warning | `--ce-status-warning` | `#F59E0B` | `#D97706` | `rgba(245,158,11, 0.12)` | `rgba(217,119,6, 0.08)` |
| Error | `--ce-status-error` | `#EF4444` | `#DC2626` | `rgba(239,68,68, 0.12)` | `rgba(220,38,38, 0.08)` |
| Info | `--ce-status-info` | `#3B82F6` | `#2563EB` | `rgba(59,130,246, 0.12)` | `rgba(37,99,235, 0.08)` |

Each status has an RGB triplet variable (`--ce-status-success-rgb`, etc.) for custom opacity composition.

---

## Chart Colors

Used by Recharts for data visualization. These do NOT change between dark/light mode.

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| Chart 1 | `--chart-1` | `#22D3EE` (cyan) | Primary data series |
| Chart 2 | `--chart-2` | `#B3FF3B` (lime) | Secondary data series |
| Chart 3 | `--chart-3` | `#F59E0B` (amber) | Tertiary data series |
| Chart 4 | `--chart-4` | `#8B5CF6` (violet) | Fourth data series |
| Chart 5 | `--chart-5` | `#EC4899` (pink) | Fifth data series |

---

## Shadows

| Token | CSS Variable | Dark Mode | Light Mode |
|-------|-------------|-----------|------------|
| Card | `--ce-shadow-card` | `0 1px 3px rgba(0,0,0, 0.2)` | `0 1px 3px rgba(0,0,0, 0.04), 0 1px 2px rgba(0,0,0, 0.06)` |
| Elevated | `--ce-shadow-elevated` | `0 4px 12px rgba(0,0,0, 0.3)` | `0 4px 12px rgba(0,0,0, 0.06), 0 2px 4px rgba(0,0,0, 0.04)` |
| Modal | `--ce-shadow-modal` | `0 16px 48px rgba(0,0,0, 0.5)` | `0 16px 48px rgba(0,0,0, 0.12), 0 4px 16px rgba(0,0,0, 0.08)` |

---

## Specialized Tokens (JS only)

From `tokens.ts` — these map role accents to functional meanings:

### Pipeline Stage Colors (Employer surfaces)
| Stage | Token | Maps To |
|-------|-------|---------|
| New | `PIPELINE_STAGE_COLORS.new` | `--ce-text-tertiary` (gray) |
| Screening | `PIPELINE_STAGE_COLORS.screening` | `--ce-role-edgestar` (cyan) |
| Interview | `PIPELINE_STAGE_COLORS.interview` | `--ce-role-guide` (violet) |
| Final | `PIPELINE_STAGE_COLORS.final` | `--ce-role-edgepreneur` (amber) |
| Offer | `PIPELINE_STAGE_COLORS.offer` | `--ce-role-employer` (emerald) |

### Category Colors (EdgePath milestones)
| Category | Token | Maps To |
|----------|-------|---------|
| Skill | `CATEGORY_COLORS.skill` | `--ce-role-edgestar` (cyan) |
| Learn | `CATEGORY_COLORS.learn` | `--ce-role-edgestar` (cyan) |
| Action | `CATEGORY_COLORS.action` | `--ce-lime` (lime/green) |
| Resource | `CATEGORY_COLORS.resource` | `--ce-text-secondary` (gray) |
| Habit | `CATEGORY_COLORS.habit` | `--ce-text-secondary` (gray) |

---

## Typography

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Display font | `--font-display` | `'Urbanist', system-ui, sans-serif` |
| Body font | `--font-body` | `'Satoshi', system-ui, sans-serif` |

**Weight rules:**
- `--font-weight-medium`: 500 (headings, labels, buttons)
- `--font-weight-normal`: 400 (body, inputs, descriptions)

**Heading scale:**
- h1: `--text-2xl`, weight 500, line-height 1.2, font-display
- h2: `--text-xl`, weight 500, line-height 1.3, font-display
- h3: `--text-lg`, weight 500, line-height 1.4, font-display
- h4: `--text-base`, weight 500, line-height 1.5, font-body

---

## Radius

| Token | Value |
|-------|-------|
| `--radius` | `0.75rem` (12px) |
| `--radius-sm` | `calc(0.75rem - 4px)` = 8px |
| `--radius-md` | `calc(0.75rem - 2px)` = 10px |
| `--radius-lg` | `0.75rem` = 12px |
| `--radius-xl` | `calc(0.75rem + 4px)` = 16px |

---

## Quick Reference: Dark vs Light Side-by-Side

### Backgrounds
| Layer | Dark | Light |
|-------|------|-------|
| Void | `#08090C` | `#F8F9FC` |
| Page | `#0A0C10` | `#F8F9FC` |
| Card | `#12141A` | `#FFFFFF` |
| Elevated | `#1A1D24` | `#F1F3F8` |
| Highest | `#22252E` | `#E8EBF0` |

### Text
| Level | Dark | Light |
|-------|------|-------|
| Primary | `#E8E8ED` | `#1A1D24` |
| Secondary | `#9CA3AF` | `#4B5563` |
| Tertiary | `#8B90A0` | `#6B7280` |
| Quaternary | `#5C6370` | `#6B7280` |

### Brand Accents
| Color | Dark | Light |
|-------|------|-------|
| Lime/Primary | `#B3FF3B` | `#16A34A` |
| Cyan/Accent | `#22D3EE` | `#0891B2` |

### Glass tint direction
| Mode | Tint RGB | Effect |
|------|----------|--------|
| Dark | `255, 255, 255` | White glass over dark backgrounds |
| Light | `0, 0, 0` | Black glass over light backgrounds |
