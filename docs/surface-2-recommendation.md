# Next Surface Recommendation

## The answer: Surface #2 is the App Shell + Dashboard, designed together.

They're listed as surfaces 2 and 3 in the IA doc, but they're inseparable. The shell is the container; the dashboard is the first thing inside it. Designing either one alone produces a half-decision.

## Why this is the right call (product OS lens)

**PM:** Onboarding ends somewhere. Right now, all three hypotheses terminate at a signup overlay — and then what? The user signs up and lands... where? The dashboard inside the shell is the literal next screen after onboarding. If we don't design it, we can't evaluate whether onboarding's promise lands. The onboarding says "here's your roadmap / here's your dashboard" — Surface 2 is where we prove that wasn't a lie.

**Design:** The IA doc identifies the #1 product problem as navigation — 8 roles, 20+ features, and a current UI that shows everything to everyone. The shell IS the navigation solution. The three-tier model proposed in the IA doc (sidebar rail + Sophia bar + command palette) needs to be explored as interactive prototypes, not just described in a doc. This is where we make the structural bet.

**Engineering:** The shell architecture determines routing, layout components, persistent state (EdgeGas, notifications, role context), and the Sophia integration pattern. Every subsequent surface is a child of this frame. Building surfaces 4-10 without the shell means rebuilding them when the shell exists.

**Brand:** The shell is where the dark glass aesthetic, the Sophia bar, and the role identity live permanently. It's the brand's most repeated surface — more viewed than any individual screen. Getting this right matters more than any interior page.

## What this surface actually contains

From the IA doc's shell architecture:

- **Header** (~48-56px): Logo mark, role badge pill (EdgeStar/EdgeGuide/EdgeParent), search (triggers command palette), notification bell, user avatar
- **Sidebar rail** (~56-64px collapsed): Icons only, 4-6 items per role, labels on hover/expand, EdgeGas indicator at bottom, settings
- **Sophia bar** (bottom, ~64-80px): Context-aware status line, 2-3 suggestion chips, "Ask Sophia" expansion trigger — NOT a chat, a context engine
- **Command palette** (overlay): Triggered by search icon or keyboard shortcut, categorized commands per role
- **Dashboard content** (role-adaptive): KPI cards, progress visualization, Sophia insight strip, quick actions, activity feed

## Component extraction potential

This surface produces the most reusable components of any in the 10:

- Sidebar rail (used on every page)
- Header bar (used on every page)
- Sophia context bar (used on every page)
- KPI cards (reused in EdgeBoard, EdgeSight, all analytics)
- Progress cards (reused in EdgePath, EdgeProd)
- Quick action cards (reused across all role dashboards)
- Notification system (global)
- EdgeGas indicator (global)
- Role badge (global)
- Command palette (global)

That's ~10 components that appear on every subsequent surface we design.

## The hard questions before we start

1. **Which role's dashboard do we design first?** The IA doc says EdgeStar is the densest (most features). But designing only EdgeStar doesn't prove the shell works for all 8 roles. Recommendation: design the shell as role-agnostic chrome, then build EdgeStar's dashboard content first, with one other role (EdgeParent or EdgeGuide) as a contrast test to prove the shell adapts.

2. **The Sophia bar — do we commit to the three-tier navigation model from the IA doc, or do we explore alternatives?** The IA doc proposed sidebar + Sophia bar + command palette. Your original instinct was Sophia-as-navigation more aggressively. The IA doc pushed back on removing the sidebar entirely. This is the biggest design bet in the product — it needs to be resolved at this surface, not deferred.

3. **The Day 0 → Day 30 state transition — do we prototype both?** The IA doc describes the dashboard as radically different on Day 0 (single prompt, nothing else) vs. Day 30 (command center with pipeline, sessions, roadmap progress). If we only build one state, which one proves more? Day 0 connects directly to the onboarding flow we just built. Day 30 proves the product has depth.

4. **Do we also design mobile at this stage?** The shell architecture is fundamentally different on mobile (sidebar becomes bottom tab bar or hamburger, Sophia bar competes for space). The standing instructions say "responsive always." But exploring a single-hypothesis desktop shell + dashboard is already substantial. Do we do responsive in this pass, or nail desktop and come back?

5. **Should we do hypothesis variations like we did for onboarding, or commit to one direction?** Onboarding had 3 hypotheses because we were finding the voice. The shell/dashboard might benefit from 2 variations: one more traditional (clean sidebar + Sophia bar as described in IA doc) and one more experimental (Sophia-forward, minimal chrome). Or is one direction clear enough now from the onboarding work?

## My recommendation on sequencing

Don't answer all 5 questions now. Answer #2 (the Sophia bar bet) and #5 (hypotheses or single direction) — those two determine the scope. The rest can be decided as we go.
