# CareerEdge — Project Rules

## Mandatory Build Process (Non-Negotiable Gate)

Before ANY feature, surface, or component work:

1. **Read docs** — PRD (`docs/product-prd.md`), Sophia system (`docs/sophia-system-reference.md`, `docs/sophia-multi-role-system.md`), navigation (`docs/ia-navigation-model.md`, `docs/nav-architecture.md`), UX specs for related surfaces, and brand guidelines (`docs/brand-guidelines.md`)
2. **Validate with product-team-os** — Run the product-team-os skill. Cross-reference against northstar products (Duolingo, Linear, Vercel, Airbnb, Claude, Resend). Ask yourself: would these products build it this way?
3. **Ask questions** — If anything is unclear about placement, entry/exit points, Sophia integration, or navigation impact, ask BEFORE building. Present your understanding and get confirmation.
4. **Audit existing patterns** — Search the codebase for similar patterns. If a matching pattern exists, reuse it. If not, validate against northstars then build 3 variations (wired through DevTools, not inline toggles).

## Core Principles

### Sophia & Navigation Are Everything
Every decision revolves around Sophia and the navigation system. Documentation exists for both — always reference it. Sophia is "a person in your network" — she speaks conversationally, gives context before requests, uses inline examples, and never assumes jargon. Navigation uses three tiers: spatial (top nav pills), contextual (Sophia/cross-links), and command (Cmd+K). Each role sees only 4-7 nav items. One-time tasks do NOT get nav pills.

### Contextual Connectivity
The entire application is contextual — everything is tastefully and carefully connected and cohesive. Nothing exists in isolation. EdgeMatch knows about ImmigrationEdge. EdgePath knows about Sessions. Every surface connects to the others through Sophia, cross-surface links, and shared data. If you build a feature that doesn't connect to the system, it's wrong.

### Entry & Exit Points
Every feature MUST have clear entry points (how users get there) and exit points (where users go next). After implementing, verify every entry point clicks through, every exit point navigates correctly, no orphaned states exist. If an exit leads to an unbuilt feature, note it explicitly and bring it up — don't stub lazily.

### No Dead Ends
After implementing any feature, verify: every button does something, every nav item routes somewhere, every action has feedback. If parts need more scoping, document them explicitly and raise them — don't leave silent dead ends.

### No Stubs, No "Coming Soon"
When told to build a surface or feature, BUILD IT FULLY. Never stub interactions with toast messages like "coming soon" or "not yet available." Every button, drawer, modal, form, and action must be functionally complete with real UI behavior — not placeholder text. If a feature genuinely can't be built without external dependencies, raise it BEFORE building and get explicit approval. Stubbing wastes time and creates technical debt that has to be revisited.

## Design & UX Rules

### Reuse Patterns, Don't Reinvent
- Search the codebase for existing patterns before creating new ones
- `SharedTopNav` for surface headers — never render a surface without the shell
- `ResumeEdge BuildingState` pattern for Sophia-guided data collection (bounded conversation card with maxHeight, segmented progress bar, pinned input)
- `child-link-modal.tsx` blueprint for multi-stage modals
- `shared-patterns.tsx` for QRModal, EmptyState, SophiaHandoff, SectionCard
- `kpi-patterns.tsx` for KPI rows and phase bars
- `sophia-patterns.tsx` for Sophia mark, bottom bar, insights
- If a genuinely new pattern is needed, build 3 variations via DevTools (not inline toggles)

### Dev Tools, Not Inline UI
All variant switching, demo controls, and design exploration toggles go through the existing DevTools system (`dev-tools.tsx` + `root-layout.tsx` state). NEVER create custom inline toggles or switchers. Follow the `familyVariation` pattern exactly.

### Mobile Responsive
Every surface must work at 375px (mobile) and 768px (tablet). If the surface genuinely can't work on mobile, show a tasteful "Best experienced on desktop" message. Never ignore mobile.

### No Walls of Text
Empty states should be minimal — icon, one heading, one line of description, immediate action. No paragraphs, no long explanations, no AI-generated feel. Study how ResumeEdge and Guide Profile empty states work.

### Suggestions Must Be Typed & Interactive
If Sophia suggests something, the suggestion must be connected to the actual UI. "Apply this" must visibly change something. Suggestions should be typed (photo → upload button, headline → inline diff, specialization → selectable pills). Never create disconnected decoration.

### Inline Editing Over Restart
When users need to edit data they've already provided, support inline editing (click field → edit in place → save). NEVER send users back to the beginning of a flow. Show pencil icons on hover as affordance.

### Pre-fill From Existing Data
If Sophia already knows something from onboarding or another surface, don't ask again. Reference existing data and skip redundant questions. This is stated in Sophia's UX spec.

### Top Nav Bar Is Frozen
The current nav pills per role are FINAL. No new surfaces get added to the top nav bar unless there is an explicit, justified reason approved by the user. New surfaces are accessed via the Explore menu (Dock/Segment), Sophia chips, cross-surface links, or dashboard cards. The top nav bar is reserved for daily-driver surfaces only — adding to it degrades the entire navigation system. If you think something deserves a nav pill, ask first and justify why it can't live in the Explore menu.

## Technical Rules

### Theme System
- All colors MUST use CSS variables from `theme.css` — never hardcode hex/rgba in components
- `tokens.ts` is the single source of truth for motion, role accents, text scale, and surface tokens
- Role accent colors use `var(--ce-role-{role})` with RGB triplets for rgba composition
- Status colors: `var(--ce-status-success/warning/error/info)` with muted variants
- Glass tint: use `rgba(var(--ce-glass-tint), opacity)` for theme-adaptive tinting
- NEVER use `color-mix()` — use `rgba(var(--ce-*-rgb), alpha)` pattern instead

### WCAG AA Compliance
- All text must meet 4.5:1 contrast ratio against its background
- `--muted-foreground` must be at least #8B8FA0 on dark, not #6B6F7B
- `--ce-text-tertiary` must be at least #8B90A0 on dark
- `--ce-text-quaternary` must be at least #5C6370 on dark
- `disabled:opacity-70` (not 50) — already-dim colors at 50% become invisible
- All SVG logos need `role="img" aria-label="..."`
- Sophia dynamic content needs `aria-live="polite"`
- Icon-only buttons need `aria-label`

### Component Architecture
- Surfaces follow three states: Empty → Building → Active
- Each state wraps in `SophiaForwardBackground` + `SharedTopNav` + `mt-14` offset
- Large surfaces use lazy loading via React Router
- Forms use React Hook Form + `ui/form.tsx`
- Animations use Framer Motion with tokens from `tokens.ts` (EASE, SPRING, SPRING_SNAPPY)
- Toast notifications via Sonner

### File Organization
- UI primitives: `src/app/components/ui/`
- Surfaces: `src/app/components/` (top level)
- Dashboards: `src/app/components/dashboards/`
- Landing/auth: `src/app/components/landing/`
- Layer 3 surfaces: `src/app/components/surfaces/`
- Shared patterns: `shared-patterns.tsx`, `kpi-patterns.tsx`, `sophia-patterns.tsx`

## Brand & Visual
- Dark mode base: #08090C (near-black)
- **Primary brand color: Cyan #22D3EE (dark) / #0891B2 (light)** — use for ALL CTAs, primary buttons, heading accents, logos, brand marks, nav CTA buttons, pricing recommended tiers, and primary action gradients
- **Delight accent: Lime #B3FF3B (dark) / #16A34A (light)** — use ONLY for EdgeGas, achievements, completion states, scores/match%, trend-up arrows, data visualization, success checkmarks, streak counts, typing cursors, and delight pulse animations. NEVER for CTAs, logos, or primary buttons.
- **Logo colors: white, black, or cyan ONLY** — never lime. Use `BRAND.logo` from tokens.ts.
- Use `COLORS.primary` (cyan) for new CTAs. Use `COLORS.lime` only for delight/data.
- Typography: Urbanist (display/headings), Satoshi (body)
- Glassmorphism: subtle rgba backgrounds with blur, thin borders
- Motion: 200-300ms transitions, spring physics for entrances

## Northstar Products
Apple, Linear, Airbnb, Vercel, Claude, Resend, Firecrawl, Duolingo, Boundless, Deel, Calendly — reference these for IA, information hierarchy, interaction patterns, visual craft, and empty states.
