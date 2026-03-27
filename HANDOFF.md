# CareerEdge Developer Handoff

> **Last updated:** 2026-03-24
> **Branch:** `claude/distracted-cerf`
> **Status:** Design exploration phase — NOT production-deployed

---

## Quick Orientation

This codebase is a **React SPA** (Vite + React Router 7 + Tailwind 4 + Framer Motion). It contains:

1. **Production-ready application surfaces** — 8 role-based dashboards, 11+ feature surfaces, AI copilot system (Sophia), onboarding flows
2. **Design explorations** — 9 landing page variations, 3 shell hypotheses, 3 onboarding hypotheses
3. **Dead code** — a few orphaned files to be cleaned up

**The explorations are NOT production code.** They exist for design review and stakeholder selection. The developer wiring this up should implement the *chosen* variation into the production app, not ship all 9.

---

## File Status Legend

Every component falls into one of these categories:

| Status | Meaning | Action for Developer |
|--------|---------|---------------------|
| `PRODUCTION` | Actively routed, tested, wired into the app shell | Implement as-is, connect to backend |
| `EXPLORATION` | Design variation for review — accessible via `/archive/*` routes | Do NOT ship to production. Implement only the chosen one. |
| `SHARED-UTILITY` | Reusable pattern/component imported by multiple surfaces | Keep and reuse. These are the design system. |
| `DEAD` | Orphaned, superseded, or never routed | Safe to delete |
| `CONFIG` | Build/theme/tooling configuration | Keep as-is |

---

## What to Build vs. What to Ignore

### BUILD THESE (Production)

```
src/app/routes.tsx                    — Route definitions (the app's spine)
src/app/layouts/root-layout.tsx       — App shell, theme, state management
src/app/components/dev-tools.tsx      — Dev-only tools (strip from prod build)

src/app/components/landing/
  landing-nav.tsx                     — Shared landing navigation bar
  landing-footer.tsx                  — Shared landing footer
  auth-page.tsx                       — Login/signup forms
  landing-v1.tsx                      — Current default landing page (at /)

src/app/components/
  shell-synthesis.tsx                 — Production app shell (role-adaptive)
  role-shell.tsx                      — Base shell wrapper for all roles

src/app/components/dashboards/        — All 8 role dashboards (production)
src/app/components/surfaces/          — All Layer 3 surfaces (production)
src/app/components/ui/                — 47 Radix-based UI primitives (production)

Core surfaces:
  edge-match.tsx                      — Job matching (/:role/jobs)
  resume-edge.tsx                     — Resume builder (/:role/resume)
  messaging.tsx                       — Chat/video (/:role/messages)
  edgesight.tsx                       — Analytics (/:role/analytics)
  edgepath-option-a.tsx               — Career roadmap (/:role/edgepath)
  task-room.tsx                       — Goal workspaces (/:role/taskroom/:id)
  sessions.tsx                        — Peer accountability (/:role/sessions)
  guide-profile-edit.tsx              — Profile management (/:role/profile)

Shared patterns (the design system):
  shared-patterns.tsx                 — EmptyState, SophiaHandoff, SectionCard, QRModal
  sophia-patterns.tsx                 — SophiaInsight, SophiaBottomBar, intent rendering
  kpi-patterns.tsx                    — KPIRow, PhaseBar, PipelineBar
  tokens.ts                           — Motion, colors, typography, spacing tokens
```

### EXPLORATIONS (Review Only — Pick One to Build)

```
Landing Pages (accessible at /archive/landing):
  landing-v1.tsx    — "The Editorial"      (currently the default at /)
  landing-v2.tsx    — "The Proof"          (product-as-hero, numbers-driven)
  landing-v3.tsx    — "The Narrative"      (scroll-driven storytelling)
  landing-v4.tsx    — "The Architect"      (Swiss grid, precision, Linear-inspired)
  landing-v5.tsx    — "The Conversation"   (page IS a chat with Sophia, anti-SaaS)
  landing-v6.tsx    — "The Gallery"        (fashion editorial, museum exhibition)
  landing-v7.tsx    — "The Data Canvas"    (Bloomberg terminal, data IS design)
  landing-v8.tsx    — "The Manifesto"      (ideology first, Apple Think Different)
  landing-v9.tsx    — "The Ecosystem"      (multi-audience constellation map)

Shell Hypotheses (accessible at /archive/shell):
  shell-h1.tsx      — "The Corridor"       (single-pane vertical)
  shell-h3.tsx      — "Mission Control"    (three-pane command center)

Onboarding Hypotheses (accessible at /archive/onboarding):
  onboarding-h1.tsx — "World Opens Up"
  onboarding-h3.tsx — "Sophia Speaks First"

EdgePath Alternatives (accessible at /archive/edgepath):
  edgepath-option-b.tsx — Alternative layout
```

### DEAD CODE (Safe to Delete)

```
edgepath-option-c.tsx     — Exists but never routed or imported
state-toggle.tsx          — Superseded by dev-tools.tsx
src/imports/UiUxOverhaulProject*.tsx  — Legacy Figma exports, unused
src/imports/svg-*.ts      — Auto-generated SVG data, mostly unused
dist/                     — Build output (gitignored)
node_modules/             — Dependencies (gitignored)
```

---

## Landing Page Variations — Design Philosophy

Each variation answers the same question differently: **"How do you convince someone that CareerEdge is worth trying?"**

### V4: The Architect (868 lines)
**Inspired by:** Linear, Vercel, Swiss Modernist Design
**Philosophy:** Precision as beauty. Every pixel is measured. The page IS the grid.
**Key moves:** Visible grid lines, 12-column asymmetric layout, cursor-following gradient, monospace details, architectural connector lines, split-screen hero
**Best for:** Technical audience, credibility-first positioning

### V5: The Conversation (638 lines)
**Inspired by:** Kriss.ai, Claude
**Philosophy:** The entire landing page IS a conversation with Sophia. Anti-SaaS warmth.
**Key moves:** Message bubbles that reveal on scroll, photography of real people, interactive choices, no traditional hero, warm cyan glow, rounded forms
**Best for:** Emotional connection, human-AI warmth positioning

### V6: The Gallery (516 lines)
**Inspired by:** Lusion v3, Fashion Editorial, Museum Exhibitions
**Philosophy:** Career development as art. Features treated as exhibit pieces.
**Key moves:** Full-bleed visuals, dramatic scale contrast, asymmetric photos, horizontal scrolling gallery, typography as texture, generous whitespace
**Best for:** Premium positioning, brand-forward, aspirational audience

### V7: The Data Canvas (588 lines)
**Inspired by:** Zentry, Bloomberg Terminal, Stripe's data viz
**Philosophy:** The data IS the design. Numbers are the visual identity.
**Key moves:** Live dashboard hero, floating data particles, animated metrics, terminal aesthetic, data viz as section dividers, glowing connection lines
**Best for:** Data-savvy audience, "product as proof" positioning

### V8: The Manifesto (356 lines)
**Inspired by:** Apple "Think Different", Nike, Stripe annual letters
**Philosophy:** Ideology first, product second. Build desire through belief.
**Key moves:** One statement per viewport, 100px+ typography, no screenshots until final act, scroll-linked opacity, lime appears only at climax, cinematic pacing
**Best for:** Brand launch, emotional resonance, bold positioning

### V9: The Ecosystem (627 lines)
**Inspired by:** Airbnb (multi-audience), Constellation maps, Boundless
**Philosophy:** Show the network, not the product. Each role is a planet in orbit.
**Key moves:** Orbital visualization, role-hover shifts accent color, selecting role transforms page, Sophia at center, horizontal tabs for switching, morphing sections
**Best for:** Multi-sided marketplace positioning, showing the full ecosystem

---

## How Things Connect

### Route Architecture
```
/                         → Landing (V1 default)
/login, /signup           → Auth forms
/onboarding               → Onboarding H2 (default)
/:role                    → Role dashboard (8 roles)
/:role/jobs               → EdgeMatch
/:role/resume             → ResumeEdge
/:role/messages           → Messaging
/:role/analytics          → EdgeSight
/:role/edgepath           → EdgePath (career roadmap)
/:role/taskroom/:id       → Task Room
/:role/sessions           → Sessions
/:role/profile            → Profile editor
/:role/family             → Family surface (3 variations A/B/C)
/:role/clients            → Clients (employer/agency)
/:role/pipeline           → Hiring pipeline
/:role/events             → Events
/:role/programs           → Programs (edu/ngo)
/:role/funding            → Funding (agency)
/:role/immigration        → Global Career Mobility
/:role/careers            → Career Discovery Hub
/archive/*                → All design explorations
```

### State Flow
```
index.html → main.tsx → App.tsx → RouterProvider → routes.tsx → RootLayout
                                                                    ↓
                                                        Outlet Context:
                                                        - appState (onboarding|empty|active)
                                                        - familyVariation (A|B|C)
                                                        - theme (dark|light)
                                                        - navVariation (A|B)
                                                                    ↓
                                                            Child Routes
```

### Shared Pattern Dependencies
```
tokens.ts ← (imported by ~60 files — the design token source of truth)
    ↑
shared-patterns.tsx ← (EmptyState, SophiaHandoff, SectionCard)
    ↑
sophia-patterns.tsx ← (SophiaInsight, SophiaBottomBar)
    ↑
kpi-patterns.tsx ← (KPIRow, PhaseBar, PipelineBar)
    ↑
All dashboards and surfaces
```

### Theme System
```
src/styles/theme.css     — CSS variables (colors, surfaces, glass, gauges)
src/app/components/tokens.ts  — JS tokens (motion, role accents, text scale)
tailwind.config.ts       — Font families, theme extensions
```

Colors use CSS variables: `var(--ce-role-edgestar)`, `var(--ce-status-success)`, etc.
Role accents have RGB variants for rgba composition: `rgba(var(--ce-role-edgestar-rgb), 0.2)`

### Sophia System
Sophia (the AI copilot) has three render modes:
1. **Bottom Bar** — persistent on every page, shows latest insight
2. **Float** — bottom-right 400px card for quick conversations
3. **Panel** — right sidebar for deep multi-turn conversations

All Sophia rendering goes through `sophia-patterns.tsx` which uses intent-based resolution.

---

## For the Implementing Developer

### Getting Started
```bash
npm install
npm run dev          # Starts on port 5173 (or next available)
```

### Key Decisions Needed
1. **Which landing page variation?** — Stakeholder must pick 1 of 9
2. **Which shell hypothesis?** — H2 is current default
3. **Which onboarding flow?** — H2 is current default
4. **Backend API shape** — All data is currently mock. Centralize in `/src/app/services/api.ts`

### What's NOT Done Yet
- No backend/API integration (all mock data)
- No authentication flow (forms exist, no auth provider)
- No error boundaries at root level
- No lazy loading (all imports are eager)
- No automated tests
- No CI/CD pipeline
- EdgeGas economy logic (earn/spend) is UI-only

### Tech Stack
- React 18.3.1 + React Router 7.13.0
- Vite 6.3.5 + Tailwind CSS 4.1.12
- Framer Motion 12.23.24
- Radix UI (full primitive suite)
- React Hook Form 7.55.0
- Recharts 2.15.2
- Lucide React icons
- Sonner (toast notifications)

### 8 Supported Roles
`edgestar` | `edgepreneur` | `parent` | `guide` | `employer` | `edu` | `ngo` | `agency`

Each role has its own dashboard, nav items (4-7 pills), and surface access rules. See `routes.tsx` for routing and `dev-tools.tsx` for the role switcher.
