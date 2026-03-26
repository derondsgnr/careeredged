# EdgePath Gaps — Scoping Document (v2)

> **Date:** 2026-03-26
> **Status:** Draft — needs client approval
> **Replaces:** v1 (which proposed 4 toggle modes — rejected as un-tasteful and against our IA principles)

---

## Design Philosophy Reminder

Before scoping, the principles we're designing within:

1. **"0 tabs. 15 fewer decisions. Zero information lost."** — We killed 12 tabs deliberately. We don't add them back.
2. **Three nav tiers** — Spatial (top bar), Contextual (Sophia bar), Command (⌘K). New features distribute across these tiers.
3. **One job per screen** — EdgePath's job is "Understand where I am and know what to do next." Everything serves that job or it doesn't belong here.
4. **Progressive disclosure** — Only current phase expanded. Show the bite, not the mountain.
5. **No toggles for what can be woven in** — If data can be surfaced within the existing layout, it should be. New modes are a last resort.

The question for each gap: **Where does this information naturally surface so the user sees it without a new interaction layer?**

---

## Gap 1: Timeline (Time Visualization)

### What the client wants
A way to see **when** things happen — not just what order. The phase strip shows sequence. They want temporal awareness: weeks, months, deadlines, a sense of calendar.

### Why a Gantt toggle is the wrong answer
A `[List] [Map] [Timeline]` toggle creates three parallel universes of the same data. The user has to decide which mode to be in. That's a decision tax. Notion has this problem — people get lost between Board/Table/Timeline/Calendar views of the same database. Linear solved it by not having view toggles at all — there's one view, and it adapts.

### The right answer: Time is a dimension of the phase strip, not a separate view

The phase strip already shows phases horizontally. Right now it shows: title, milestone count, status. **Add time to what's already there.**

**What changes on the phase strip:**

```
Current:
● Phase 1 ─── ● Phase 2 ─── ○ Phase 3 ─── 🔒 Phase 4
[Complete]     [5/8, 63%]    [0/7]         [Locked]

Proposed:
● Phase 1 ─── ● Phase 2 ─── ○ Phase 3 ─── 🔒 Phase 4
[✓ Complete]   [5/8 · 63%]   [0/7]         [Locked]
[Jan-Feb]      [Mar 4-28]    [Apr 1-30]    [May]
               ▼ 2 days left
```

Each phase node gains a **time range label** below the progress info. The active phase gets a **countdown or pace indicator**: "2 days left" / "2 weeks ahead" / "3 days overdue" (amber, not red — warmth, not pressure).

**What Sophia does with time:**
- Commentary strip already exists. It already says things like "You're 63% through." Now it adds: "Phase 2 ends March 28. At your pace, you'll finish March 25 — 3 days early."
- If behind: "Phase 2 was due March 20. Want to adjust the timeline, or push through this week?"

**The expanded milestone row already shows `time` estimates.** Each milestone has an `8h` or `4h` label. This is the data. It just needs a date projection computed from the phase timeline.

**For the user who really wants the Gantt:**
- Sophia can render it as a structured content block in her panel. "Show me my timeline" → Sophia renders a horizontal bar chart in her response. It's a **Sophia capability**, not a view mode. This is how Linear handles it — timeline is a feature of the project, not a mode of the interface.
- Or: the overflow menu (⋯) gets an "Export timeline" option that generates a visual PDF/image.

### What to build

**Two layers — ambient time awareness + on-demand Gantt:**

**Layer 1 — Phase strip time labels (always visible):**
Add time range + pace indicator to each phase node. No interaction change. Pure data enrichment.

**Layer 2 — "Show timeline" quick action (on-demand Gantt):**
A chip in the Sophia bottom bar: `[Show timeline]`. Clicking it opens a **slide-up overlay panel** (not a view mode, not a page) showing a Gantt chart of the full roadmap. Same pattern as Path Compare in the mind map — contextual, dismissable, panel-based.

The Gantt panel:
- Slides up from bottom or in from right (like Task Room panel)
- Horizontal bars for each phase, time on X-axis
- Today marker (cyan dashed line)
- Milestone dots within bars (lime = done, cyan = current, gray = upcoming)
- Click a milestone dot → opens Task Room (same deep-link)
- Dismiss: click outside, press Escape, or click X
- Not a mode. Not persistent. A **lens** you look through momentarily, then put down.

This follows the same pattern as:
- Path Compare panel (Sophia-triggered, overlay, dismissable)
- Task Room panel (deep-link, slide-in, escape to close)
- Sophia Float (quick interaction, not a mode switch)

The chip appears contextually — Sophia surfaces it when time-awareness is relevant:
- When user is behind schedule
- When viewing a phase with a deadline approaching
- When comparing paths with different timelines
- Or always present as a persistent quick action on EdgePath

### Effort: Small-Medium
Phase strip labels (small) + Gantt overlay panel component (medium — new visual component but contained scope, no routing or state management).

---

## Gap 2: Budget

### What the client wants
Career transition costs visible — not buried, not in a separate surface. EdgeStar sees certification costs. EdgePreneur sees startup costs. EdgeParent sees what they're investing in their child.

### Why a separate surface or tab is the wrong answer
Budget is not a daily-driver action. Nobody opens CareerEdge to "check my budget." They open it to see their roadmap, check their milestones, and get Sophia's guidance. Budget is **context that enriches those actions** — "This certification costs $299" is useful when you're looking at the milestone, not when you're looking at a budget spreadsheet.

This is the Airbnb principle: pricing isn't on a separate "pricing" page. It's on the listing. Right where you're making the decision.

### The right answer: Budget lives on milestones and on the Sophia panel

**Layer 1 — On the milestone itself:**

Each milestone that has a cost shows a small cost indicator inline. Not a separate section. Not a collapsible panel. A data point on the row, like the time estimate.

```
Current milestone row:
○  Complete Figma fundamentals          Skill · 8h

With budget:
○  Complete Figma fundamentals          Skill · 8h · $299
                                                     ^^^^
                                        subtle, same weight as time estimate
```

If the cost is $0 or free, show nothing (absence = free). Only costs above $0 appear. The cost label is the same visual weight as the time estimate — a data point, not a feature.

**Layer 2 — Sophia surfaces the aggregate:**

Sophia's commentary strip and right panel already provide phase-level intelligence. Budget becomes another dimension she comments on:

- "Phase 2 estimated cost: $650. You've completed $299 in paid milestones."
- "The IDF course is free — I found it as an alternative to the $149 option."
- "You've invested $1,200 across your journey. Your target salary increase projects a 18x return."

This is a **Sophia insight**, not a UI widget. She surfaces it when it's relevant — when viewing expensive milestones, when completing paid ones, when comparing paths with different costs.

**Layer 3 — Phase strip gets a budget line (optional, for EdgePreneur):**

For EdgePreneur specifically, business costs are higher-stakes. The phase strip could show a second line: `$2,400 / $5,000 budget` below the milestone count. But only for roles where budget is central to the journey. For EdgeStar, it's overkill — Sophia's contextual comments are enough.

**Layer 4 — Dashboard budget card (EdgePreneur + EdgeParent):**

For roles where budget IS a primary concern, the **dashboard** (not EdgePath) gets a budget summary card:

```
┌─────────────────────────────────┐
│  Career Investment              │
│  $1,200 spent · $2,800 remaining│
│  ██████████░░░░░░░░ 30%         │
│                                 │
│  ✦ "3 upcoming milestones have  │
│     free alternatives."         │
│  [See alternatives →]           │
└─────────────────────────────────┘
```

This follows the dashboard pattern — a card that summarizes, with a Sophia insight and a chip to dig deeper.

### What to build
1. **Milestone cost field:** Add `estimatedCost` to milestone data. Display inline next to time estimate.
2. **Sophia budget scenarios:** 3-4 scenarios for cost awareness, free alternatives, ROI projection
3. **Dashboard budget card:** For EdgePreneur and EdgeParent roles — summary card with Sophia insight
4. **Phase strip cost line:** EdgePreneur only — `$spent / $budget` below milestone count

### Effort: Small
Cost field on milestones + Sophia scenarios + one dashboard card component.

---

## Gap 3: Milestone Tracker ("What do I do today?")

### What the client wants
A way to see all tasks across all phases in one view. A flat "to-do list" that answers "What do I do today?" without navigating phases.

### Why a fourth view toggle is the wrong answer
Same reason as before: adding `[Tasks]` to `[List] [Map]` creates decision tax. Also: EdgePath's current List view already shows milestones grouped by category within the active phase, with the next 3 prominent. The "what do I do today?" question is ALREADY answered — but only for the current phase.

The actual gap: milestones from Phase 3 that are "quick wins" you could do now aren't visible because Phase 3 is collapsed. And milestones across multiple roadmaps aren't aggregated anywhere.

### The right answer: The dashboard IS the task tracker

Look at what already exists: `RoadmapTodos` on `shell-synthesis.tsx` (line 159) is a vertical timeline of milestones with dates, status indicators, and "Open task room →" links. **This is the milestone tracker.** It just needs to be elevated.

**What changes on the dashboard:**

The `RoadmapTodos` card currently shows 6 milestones from Phase 1 only. Enhance it:

1. **Cross-phase:** Show the next 5-8 milestones regardless of which phase they're in. Phase badge on each item.
2. **Cross-roadmap:** If user has multiple roadmaps, aggregate milestones across all of them. Roadmap badge on each item.
3. **Time grouping:** Group by "Today" / "This Week" / "Upcoming" instead of listing sequentially.
4. **Sophia's daily brief at the top:** "3 tasks today. Start with design systems — highest-impact." This replaces a filter system. Sophia IS the filter.

```
┌─────────────────────────────────────────┐
│  ✦ 3 tasks today. Design systems is     │
│     your highest-impact action.          │
├─────────────────────────────────────────┤
│  TODAY                                   │
│  ○  Design Systems module    P2 · 8h     │
│     Due today · Open task room →         │
│  ○  Build case study #2      P2 · 4h     │
│  ○  Portfolio review          P2 · 1h     │
│                                          │
│  THIS WEEK                               │
│  ○  Interaction design cert   P2 · 6h    │
│  ○  Apply to 3 jobs           P3 · 3h    │  ← cross-phase!
│                                          │
│  4 more upcoming →                       │
└─────────────────────────────────────────┘
```

**What changes on EdgePath:**

Nothing. EdgePath's job stays "roadmap orientation + phase work." The dashboard's job is "daily command center." The milestone tracker IS the dashboard. Each item clicks through to the Task Room (deep link, as designed).

**For the "See all" power user:**

"4 more upcoming →" at the bottom of the dashboard card deep-links to EdgePath's List view with all phases visible (not just current). This is progressive disclosure — the dashboard shows the bite, EdgePath shows the mountain when you ask for it.

**Sophia's role:**

Bottom bar on the dashboard already shows context. Now it prioritizes: "Design Systems module is your highest-impact task today. It connects to 4 of your target jobs." This is Sophia doing the sorting, not a filter UI.

### What to build
1. **Enhance `RoadmapTodos`:** Cross-phase + cross-roadmap aggregation, time grouping (Today/This Week/Upcoming)
2. **Sophia daily brief:** Top of the card, one sentence, prioritized by impact
3. **"See all" deep link:** Bottom of card, opens EdgePath with expanded view
4. **EdgePath "all milestones" mode:** When deep-linked from dashboard, temporarily expand all phases (not a toggle — a state triggered by navigation context)

### Effort: Small-Medium
Enhancement of existing dashboard component + Sophia scenario + deep-link state on EdgePath.

---

## Summary

| Gap | Solution | Where It Lives | New UI? |
|-----|----------|---------------|---------|
| **Timeline** | Time labels on phase strip + "Show timeline" quick action → Gantt overlay panel | Phase strip enhancement + Sophia bar chip + overlay panel | 1 new overlay component (Gantt panel) |
| **Budget** | Cost field on milestones + Sophia budget insights + dashboard card (Preneur/Parent) | Inline on milestones + Sophia + Dashboard | Milestone field + 1 dashboard card |
| **Milestone tracker** | Enhanced `RoadmapTodos` on dashboard with cross-phase/roadmap aggregation + Sophia daily brief | Dashboard (existing card, enhanced) | Enhancement of existing component |

### What we're NOT building
- No new view toggles
- No new tabs
- No new surfaces
- No new nav pills

### What we ARE building
- Smarter phase strip (time awareness)
- Smarter milestones (cost awareness)
- Smarter dashboard card (cross-phase aggregation)
- Smarter Sophia (budget + timeline + daily priority scenarios)

Every enhancement follows the existing architecture. Sophia gets more contextual scenarios. Existing components get richer data. No new navigation layers. No new cognitive load.

### Build Order
1. **Dashboard milestone enhancement** — highest daily-use impact, builds on existing component
2. **Milestone cost fields + Sophia budget scenarios** — small, high perceived value
3. **Phase strip time labels** — visual enhancement, no interaction change

---

## Northstar Validation

| Principle | How This Scope Aligns |
|-----------|----------------------|
| **Linear** | No view modes. One view that shows what you need. Timeline is a property, not a mode. |
| **Airbnb** | Price on the listing, not on a pricing page. Cost on the milestone, not on a budget tab. |
| **Apple** | Progressive disclosure. Show the bite. "See all" reveals more when asked. |
| **Duolingo** | Daily driver is the home screen. Your "tasks today" are the first thing you see. |
| **Vercel** | Dashboard as command center. Everything surfaced, nothing hunted for. |
