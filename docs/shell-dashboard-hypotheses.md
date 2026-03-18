# Shell + Dashboard: Three Hypotheses

## Shared constraints
- **Role:** EdgeStar (densest feature set — 6 nav items)
- **User state:** Day 10 — roadmap exists, resume uploaded, 3 applications sent. Enough data to show a real dashboard, not empty state.
- **User:** "Sharon", Product Design, Early Career
- **Desktop-first** — 1280px+ viewport

## H1: "The Corridor" — Linear/Flora DNA

**Architectural bet:** Spatial memory wins. Sidebar is permanent, minimal, iconic. Sophia is power-user accessible (command palette), not persistent. The content area is maximized. Every pixel serves data.

**Layout:**
- 52px icon-only sidebar rail (left) — 6 items + EdgeGas footer + settings
- 48px header bar (top) — breadcrumb path, search trigger (⌘K), notification bell, avatar
- Full content area — no Sophia bar stealing vertical space
- Sophia accessed via ⌘K overlay or sidebar icon

**Navigation model:** Sidebar for structure. ⌘K for speed. No conversational layer competing for attention.

**Dashboard composition:**
- 3-column KPI card row (Career Score gauge, EdgeGas balance, ATS Score)
- EdgePath progress strip — horizontal phase visualization, Phase 1 active
- 2-column below: Activity feed (left 60%), Sophia insight card + quick actions (right 40%)

**Visual signature:** Monochrome restraint. Lime appears ONLY on: active sidebar icon, EdgeGas indicator, achievement moments. Everything else is the gray hierarchy (#E8E8ED → #9CA3AF → #6B7280 → #374151). Dot-grid subtle background. Cards defined by 1px borders, no shadows.

**Typography:** Tight. 13px body, 11px labels, 24px hero numbers. Urbanist for headings, Satoshi for everything else. Dense but scannable.

**Drawn from:** Linear (sidebar rail), Flora (icon-only nav), Firecrawl (restrained accent), Vectra (card borders no shadows)

---

## H2: "Sophia Forward" — Claude/Manus DNA

**Architectural bet:** Sophia IS the experience. No sidebar. Horizontal top navigation as escape hatch. The dashboard is Sophia-curated — she surfaces what matters. Generous whitespace. The product feels like a smart companion, not a tool belt.

**Layout:**
- No sidebar at all
- 56px header — CareerEdge wordmark (left), horizontal nav pills (center: Home, Roadmap, Resume, Jobs, Messages), avatar + EdgeGas pill (right)
- Full-width content with generous max-width (1100px centered)
- 72px Sophia bar (bottom) — persistent, context-aware status line + suggestion chips + input

**Navigation model:** Sophia bar for guided flow. Nav pills for direct access. No spatial sidebar. The product organizes around Sophia's read on your state.

**Dashboard composition:**
- Sophia greeting area — her mark + "Good morning, Sharon. You have 2 new job matches and a milestone due Friday." One sentence, no cards yet.
- 2-column card area below: left = hero card (roadmap progress with inline phase visual), right = stacked: next action card + top job match card
- Bottom: Sophia bar with "You've been applying but haven't prepped for interviews yet — want to start?" + chips: "Start interview prep" / "View matches" / "Open roadmap"

**Visual signature:** Cyan/Sophia energy dominates. Cards have generous padding (24px+), rounded corners (16px). Background uses a very subtle gradient wash (forest → void). More breathing room, fewer elements, each one has presence.

**Typography:** Generous. 15px body, 28px greeting, 20px card titles. More vertical spacing between elements. The density is LOW — each card stands alone.

**Drawn from:** Claude (conversation-first home), Manus ("What can I do for you?"), Sergushkin (persistent input bar), Airbnb (horizontal category nav)

---

## H3: "Mission Control" — SpaceX/Quanta DNA

**Architectural bet:** Everything visible at once. Information density done right. The sidebar is a full navigation panel (not just icons). The dashboard is a command center with multiple data zones. Sophia bar lives at the bottom as contextual intelligence. The user sees their entire career state at a glance.

**Layout:**
- 220px expanded sidebar (always open) — labels + icons, grouped sections, EdgeGas progress bar, role badge at top
- 48px header — search bar (wide, center), notification bell, avatar
- Content area with multi-zone grid layout
- 64px Sophia bar (bottom, right of sidebar) — context line + 2 suggestion chips

**Navigation model:** All three tiers active simultaneously. Sidebar = spatial structure. Sophia bar = contextual intelligence. ⌘K = speed. The IA doc's proposal, fully realized.

**Dashboard composition:**
- Top hero zone: green gradient brand strip (Quanta reference) with user name + role + "Phase 1 of 4" progress
- 4-column KPI row: Career Score (gauge), Applications (12, +3 this week), ATS Score (87), EdgeGas (45 credits)
- 2-column main zone: Roadmap timeline card with milestones (left 55%), Activity feed + upcoming items (right 45%)
- Sophia insight card spanning full width below: "Your resume improvements are showing — 3x more responses this month."

**Visual signature:** Dense, layered, professional. Multiple glass tiers (high/mid/low opacity cards from the reference analysis). The green gradient brand signature at the top differentiates from generic dark dashboards. Sidebar has its own surface color (#0D0F14). Charts and data visualizations present.

**Typography:** Mixed density. Hero numbers are large (32px), labels are small (11px). Urbanist display headings. The contrast between large numbers and small labels creates scanning hierarchy. Tabular numbers for data.

**Drawn from:** SpaceX Mission Control (layered glass, contextual alerts), Quanta AI (gradient hero, mixed KPIs), Legal/Compliance (dense sidebar), Vectra (data density)
