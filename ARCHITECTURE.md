# CareerEdge Architecture Reference

> For the implementing developer/agent. This document explains how the system behaves.

---

## Directory Structure

```
src/
├── main.tsx                          # Entry point → App.tsx → RouterProvider
├── app/
│   ├── routes.tsx                    # ALL route definitions (the app's spine)
│   ├── layouts/
│   │   └── root-layout.tsx           # App shell: theme, state, outlet context
│   └── components/
│       ├── ui/                       # 47 Radix-based primitives (buttons, dialogs, forms...)
│       ├── landing/                  # Landing pages + auth
│       │   ├── landing-nav.tsx       # [SHARED] Navigation bar for all landing pages
│       │   ├── landing-footer.tsx    # [SHARED] Footer for all landing pages
│       │   ├── auth-page.tsx         # [PRODUCTION] Login/signup forms
│       │   ├── landing-v1.tsx        # [PRODUCTION] Default landing (at /)
│       │   ├── landing-v2.tsx        # [EXPLORATION] "The Proof"
│       │   ├── landing-v3.tsx        # [EXPLORATION] "The Narrative"
│       │   ├── landing-v4.tsx        # [EXPLORATION] "The Architect"
│       │   ├── landing-v5.tsx        # [EXPLORATION] "The Conversation"
│       │   ├── landing-v6.tsx        # [EXPLORATION] "The Gallery"
│       │   ├── landing-v7.tsx        # [EXPLORATION] "The Data Canvas"
│       │   ├── landing-v8.tsx        # [EXPLORATION] "The Manifesto"
│       │   └── landing-v9.tsx        # [EXPLORATION] "The Ecosystem"
│       ├── dashboards/              # 8 role-specific dashboards
│       │   ├── edgepreneur-dashboard.tsx
│       │   ├── edgeparent-dashboard.tsx
│       │   ├── edgeguide-dashboard.tsx
│       │   ├── edgeemployer-dashboard.tsx
│       │   ├── edgeeducation-dashboard.tsx
│       │   ├── edgengo-dashboard.tsx
│       │   └── edgeagency-dashboard.tsx
│       ├── surfaces/                # Layer 3 role-specific surfaces
│       │   ├── family-surface.tsx + variations (A/B/C)
│       │   ├── clients-surface.tsx
│       │   ├── pipeline-surface.tsx
│       │   ├── events-surface.tsx
│       │   ├── programs-surface.tsx
│       │   ├── funding-surface.tsx
│       │   ├── immigration-surface.tsx
│       │   └── career-discovery.tsx
│       ├── shared-patterns.tsx       # [CRITICAL] Design system patterns
│       ├── sophia-patterns.tsx       # [CRITICAL] Sophia AI copilot rendering
│       ├── kpi-patterns.tsx          # [CRITICAL] Metrics and KPI components
│       ├── tokens.ts                 # [CRITICAL] Design tokens (motion, color, type)
│       ├── dev-tools.tsx             # Dev-only: role/theme/state/nav switcher
│       ├── shell-synthesis.tsx       # Production app shell
│       ├── role-shell.tsx            # Base shell wrapper
│       ├── edge-match.tsx            # Job matching surface
│       ├── resume-edge.tsx           # Resume builder surface
│       ├── messaging.tsx             # Chat/video messaging
│       ├── edgesight.tsx             # Analytics dashboard
│       ├── edgepath-option-a.tsx     # Career roadmap (default)
│       ├── task-room.tsx             # Goal workspaces
│       ├── sessions.tsx              # Peer accountability
│       └── guide-profile-edit.tsx    # Profile management
├── styles/
│   ├── theme.css                     # CSS variables (the color/surface system)
│   ├── fonts.css                     # Font imports
│   ├── index.css                     # Global styles
│   └── tailwind.css                  # Tailwind directives
└── imports/                          # SVG logos, Figma exports
    ├── TheLogo.tsx                   # Brand logo component [USED]
    └── *.svg, *.tsx                  # Legacy exports [MOSTLY UNUSED]
```

---

## Component Lifecycle: How a Surface Renders

Every surface follows this lifecycle:

```
1. User navigates to /:role/surface
2. routes.tsx matches the route
3. RootLayout renders (provides theme, state, outlet context)
4. Child component renders with three possible states:
   a. EMPTY — First visit, no data → EmptyState component
   b. BUILDING — Sophia is collecting data → Building flow (bounded card + progress bar)
   c. ACTIVE — Data exists → Full surface UI
```

### The Three States Pattern

```tsx
// Every major surface follows this:
function MySurface({ appState }) {
  if (appState === 'onboarding') return <EmptyState />;
  if (appState === 'empty') return <BuildingState />;
  return <ActiveState />;
}
```

### Component Wrapping Pattern

Every surface wraps in:
```tsx
<SophiaForwardBackground>    {/* Ambient background */}
  <SharedTopNav />            {/* Navigation pills */}
  <div className="mt-14">    {/* Offset for fixed nav */}
    {/* Surface content */}
  </div>
  <SophiaBottomBar />         {/* Sophia's persistent bar */}
</SophiaForwardBackground>
```

---

## Routing System

### Route Hierarchy
```
/ (RootLayout — provides context to all children)
├── /                           → LandingPage (V1)
├── /login                      → AuthPage
├── /signup                     → AuthPage
├── /onboarding                 → OnboardingH2
├── /:role                      → DashboardPage (role switcher)
├── /:role/jobs                 → EdgeMatch
├── /:role/resume               → ResumeEdge
├── /:role/messages             → Messaging
├── /:role/analytics            → EdgeSight
├── /:role/edgepath             → EdgePathOptionA
├── /:role/taskroom/:id         → TaskRoom
├── /:role/sessions             → Sessions
├── /:role/profile              → GuideProfileEditSurface
├── /:role/family               → FamilySurfaceSwitcher
├── /:role/clients              → ClientsSurface
├── /:role/pipeline             → PipelineSurface
├── /:role/events               → EventsSurface
├── /:role/programs             → ProgramsSurface
├── /:role/funding              → FundingSurface
├── /:role/immigration          → ImmigrationSurface
├── /:role/careers              → CareerDiscovery
├── /careers                    → CareerDiscovery (global)
└── /archive/                   → Design exploration archive
    ├── /archive/landing        → Landing page picker (V1-V9)
    ├── /archive/onboarding     → Onboarding picker (H1-H3)
    ├── /archive/shell          → Shell picker (H1-H3)
    └── /archive/edgepath       → EdgePath picker (A/B)
```

### The `:role` Parameter
Valid values: `edgestar`, `edgepreneur`, `parent`, `guide`, `employer`, `edu`, `ngo`, `agency`

The role determines:
- Which dashboard renders at `/:role`
- Which nav pills appear (4-7 per role)
- Which surfaces are accessible
- Sophia's tone and available scenarios

### Archive Routes (Exploration Only)
Everything under `/archive/*` is for design review. These routes render index pickers that link to each variation. They are NOT production routes and should be removed from the final build.

---

## State Management

### No Global Store
There is no Redux/Zustand/Jotai. State is managed via:
1. **Outlet Context** — RootLayout passes theme, appState, familyVariation, navVariation down
2. **localStorage** — Persists user preferences (theme, selected role, app state)
3. **Component State** — Local useState for UI interactions
4. **URL Params** — Role from `:role`, milestone from `:milestoneId`

### Context Shape (from RootLayout)
```typescript
{
  appState: 'onboarding' | 'empty' | 'active',
  setAppState: (state) => void,
  familyVariation: 'A' | 'B' | 'C',
  setFamilyVariation: (v) => void,
  theme: 'dark' | 'light',
  setTheme: (t) => void,
  navVariation: 'A' | 'B',
  setNavVariation: (v) => void
}
```

Access via `useOutletContext()` in any child route component.

---

## Theme System

### CSS Variables (theme.css)
All colors are CSS custom properties. Components NEVER hardcode hex values.

```css
/* Role accents */
--ce-role-edgestar: #22D3EE;        /* Cyan — Sophia/EdgeStar */
--ce-role-edgestar-rgb: 34, 211, 238; /* For rgba() composition */
--ce-role-edgepreneur: #F59E0B;
--ce-role-parent: #EC4899;
--ce-role-guide: #8B5CF6;
--ce-role-employer: #3B82F6;
--ce-role-edu: #10B981;
--ce-role-ngo: #F97316;
--ce-role-agency: #6366F1;

/* Brand */
--ce-lime: #B3FF3B;                  /* EdgeGas/delight/achievement */

/* Surfaces */
--ce-surface-bg: #08090C;            /* Dark mode base */
--ce-surface-card: rgba(255,255,255,0.03);
--ce-surface-cardBorder: rgba(255,255,255,0.06);

/* Text hierarchy */
--ce-text-primary: #F8FAFC;
--ce-text-secondary: #CBD5E1;
--ce-text-tertiary: #8B90A0;         /* Must meet WCAG AA 4.5:1 */
--ce-text-quaternary: #5C6370;

/* Status */
--ce-status-success: #22C55E;
--ce-status-warning: #EAB308;
--ce-status-error: #EF4444;
--ce-status-info: #3B82F6;
```

### Light Mode
Applied via `.light` class on root element. Key shifts:
- Lime (#B3FF3B) → Green (#16A34A)
- Cyan (#22D3EE) → Teal (#0891B2)
- Backgrounds invert to white/gray

### JS Design Tokens (tokens.ts)
```typescript
EASE           // [0.32, 0.72, 0, 1] — canonical easing
SPRING         // { stiffness: 160, damping: 24 } — standard entrances
SPRING_SNAPPY  // { stiffness: 400, damping: 30 } — quick interactions
SPRING_DELIGHT // { stiffness: 380, damping: 22 } — lime-only celebrations
ROLE_ACCENT    // CSS var references per role
COLORS         // Named color tokens
STATUS         // Status color tokens
TEXT           // Text hierarchy tokens
SURFACE        // Surface color tokens
FONT           // { display: 'Urbanist', body: 'Satoshi' }
```

---

## Sophia AI Copilot System

### What Sophia Is
Sophia is an AI copilot that lives alongside the user. She is NOT a chatbot — she is a contextual intelligence layer that uses structured content blocks.

### Where She Renders
1. **Bottom Bar** (`SophiaBottomBar`) — Persistent on every page. Shows latest insight + suggestion chips.
2. **Float** — Bottom-right 400px glass card for quick 1-3 turn conversations.
3. **Panel** — Right sidebar for deep multi-turn conversations.

### Sophia's Content Blocks (11 types)
Scorecards, checklists, timelines, skill bars, drafts, comparisons, etc. All rendered via `sophia-patterns.tsx`.

### Chip Types (3)
- **Ask** (cyan) — Opens a conversation
- **Action** (lime) — Executes something
- **Navigate** (gray) — Closes Sophia, routes to a surface

### Integration Points
- Every dashboard has a Sophia insight card
- Every surface can trigger Sophia's float or panel
- Sophia references data from ALL surfaces (contextual connectivity)

---

## DevTools System

`dev-tools.tsx` provides a draggable overlay panel for design/development:

- **Role Switcher** — Instantly navigate between 8 role dashboards
- **State Toggle** — Switch between onboarding/empty/active states
- **Theme Toggle** — Dark/light mode
- **Nav Variation** — Dock (A) vs Segment (B) navigation styles
- **Family Variation** — 3 family surface layouts (only on /family route)
- **Route Navigator** — Quick-jump to any route
- **Landing Pages** — Links to all 9 landing variations

**For production:** Strip DevTools entirely. It's gated behind a dev flag.

---

## Dependency Graph (What Imports What)

```
tokens.ts (0 deps)
    ↓ imported by
shared-patterns.tsx (tokens, sophia-mark, motion, lucide)
    ↓ imported by
sophia-patterns.tsx (shared-patterns, tokens, sophia-mark)
    ↓ imported by
kpi-patterns.tsx (tokens, recharts)
    ↓ imported by
All dashboards and surfaces
    ↓ rendered by
shell-synthesis.tsx / role-shell.tsx
    ↓ rendered by
routes.tsx (DashboardPage component)
    ↓ rendered by
root-layout.tsx (RootLayout)
    ↓ rendered by
App.tsx → main.tsx
```

### Key External Dependencies
| Package | Version | Used For |
|---------|---------|----------|
| react | 18.3.1 | UI framework |
| react-router | 7.13.0 | Client-side routing |
| motion/react | 12.23.24 | Animations (Framer Motion) |
| @radix-ui/* | latest | UI primitive behaviors |
| react-hook-form | 7.55.0 | Form state management |
| recharts | 2.15.2 | Charts and data visualization |
| lucide-react | 0.487.0 | Icon library |
| sonner | 2.0.3 | Toast notifications |
| tailwindcss | 4.1.12 | Utility CSS |
| date-fns | 3.6.0 | Date formatting |
| react-dnd | 16.0.1 | Drag and drop |
| canvas-confetti | 1.9.4 | Celebration effects |

---

## What's NOT Built Yet (Backend Required)

All data in the current codebase is **mock/hardcoded**. The implementing developer needs to:

1. **Authentication** — Auth forms exist but no provider (Supabase Auth, Clerk, etc.)
2. **API Layer** — Create `src/app/services/api.ts` for centralized API calls
3. **Data Models** — Define TypeScript interfaces in `src/app/types/`
4. **Real-time** — Messaging surface needs WebSocket/real-time backend
5. **File Upload** — Resume upload, photo upload need storage backend
6. **EdgeGas Economy** — Credit earn/spend logic needs backend tracking
7. **Sophia AI** — Intent resolution needs LLM integration
8. **Error Boundaries** — Add React ErrorBoundary at root level
9. **Lazy Loading** — Add route-level code splitting for large surfaces
10. **Testing** — No tests exist yet

---

## WCAG AA Compliance Notes

These are already enforced in the codebase but must be maintained:

- Text contrast: 4.5:1 minimum against backgrounds
- `--ce-text-tertiary`: minimum #8B90A0 on dark
- `disabled:opacity-70` (not 50) — dim colors at 50% become invisible
- SVG logos: `role="img" aria-label="..."`
- Sophia content: `aria-live="polite"`
- Icon-only buttons: `aria-label` required
