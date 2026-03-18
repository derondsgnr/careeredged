# EdgePath Mind Map — Feedback Response

## 1. "Can't figure out how to get into the mind map from H1 and H2"

This is my mistake. The mind map is sitting as a separate hypothesis (H3) when it should be a **view mode toggle inside the surface**. In the real product, a user on EdgePath should see:

```
[ List View ]  [ Map View ]
```

…as a toggle in the header bar. Not a separate build. The H1/H2/H3 switcher is our review tool — the user never sees it. So right now there's no product-level way to switch views. Fixing this by embedding the mind map as a toggle mode inside Options A and B.

## 2. "Is it fully functional? Can't figure out how to use it"

It's not discoverable enough. Problems:

- **Milestone nodes are 20px dots.** Too small. No labels visible by default. You have to hover to see what a dot represents. That's a desktop power-user pattern, not a first-use pattern.
- **No onboarding moment.** The first time you enter Map View, there should be a brief Sophia-guided hint: "This is your journey. Click any phase to explore. Drag to pan." Not a modal — a contextual card.
- **Phase expansion isn't obvious.** You click a phase circle to expand its milestones, but nothing tells you to do that. The phase nodes need a visible affordance — either always show a collapsed preview of milestones, or show an "expand" indicator.
- **The "3 paths" badge is tiny.** The main differentiating feature of the mind map (seeing path forks) is hidden behind a 9px badge.

Fixes:
- Milestone nodes become **labeled pills** (not just dots) — always showing the label, not just on hover
- Phase nodes show a **milestone count preview** and expand/collapse indicator
- Path forks render as **visible branches with path labels** by default, not hidden behind a badge
- First-time Sophia tooltip guides the interaction
- Clear visual feedback on click — selected node glows, panel slides in with animation

## 3. "What's the side drawer? What am I supposed to do next?"

The Task Room panel is currently read-only. It shows information but doesn't answer: **"What's my next action?"** That's a fundamental failure — the whole point of the Task Room embryo is to make milestones actionable.

Fixes:
- **Primary CTA at the top**, not buried: "Start this milestone" / "Mark complete" / "Continue where you left off"
- **Progress indicator** if the milestone has sub-steps (e.g., "Module 3 of 8 complete")
- **Sophia's coaching** framed as guidance, not just information: "Here's what I'd do: start with Chapter 3 of the IDF course, then try the daily challenge. Should take about 2 hours."
- **Sub-task checklist** — break the milestone into concrete steps the user can check off
- **Quick actions at the bottom**: "Ask Sophia for help" / "Share with mentor" / "Add to today's sprint"
- The cross-surface connections should be **actionable links**, not just labels: "Update resume → opens ResumeEdge" / "See matching jobs → opens EdgeMatch"

## 4. "What would Sophia's behavior and UX be here?"

This is the most important question. The mind map without Sophia is just a pretty graph. Sophia is what makes it a **planning tool**.

### Sophia's modes in the mind map:

**A. Ambient annotations (always visible)**
- Small Sophia marks (✦) attached to specific nodes where she has something to say
- Hovering the mark shows her note inline: "6 of 8 target companies need this" / "I'd prioritize this over motion design"
- These are not interruptive — they're passive intelligence woven into the graph

**B. Path recommendation (on path forks)**
- When a phase has multiple paths, Sophia's recommendation is visually clear: the recommended path branch glows brighter, has her mark on it, and shows the match %
- The non-recommended paths are visible but subdued — not hidden, just secondary
- Clicking a non-recommended path triggers Sophia: "That's a valid choice, but here's why I'd go the other way…" — not blocking, just contextualizing

**C. Contextual coaching (in the Task Room panel)**
- When you click a milestone, Sophia's section in the panel isn't just a note — it's a **mini-coaching conversation**:
  - "Here's what I'd do first" → concrete next step
  - "This connects to your resume" → cross-surface link with reasoning
  - "Want me to break this down into smaller steps?" → generates sub-tasks
  - "Alice (your EdgeGuide) left a note about this" → mentor integration

**D. Proactive guidance (bottom bar)**
- The Sophia bar at the bottom adapts based on what the user is looking at:
  - Viewing the full map: "You're 62% through Phase 2. The interaction design module is your highest-impact next step."
  - Viewing a path fork: "I'd recommend the Accelerated path — it matches your timeline and budget. Want to compare?"
  - Viewing a locked phase: "Phase 3 unlocks when you complete 2 more milestones in Phase 2."
  - Idle for 10+ seconds: "Need help deciding? I can walk you through this phase."

**E. Map-level intelligence (overview)**
- A floating Sophia card in the corner that shows journey-level insights:
  - "You're on track to reach Phase 3 by Week 9"
  - "Your pace is 15% faster than similar career changers"
  - "Suggested focus this week: Interaction design + Case study prep"
- This is the "Living Roadmap" concept — Sophia observing the whole journey and surfacing what matters

### What Sophia does NOT do in the map:
- She doesn't talk unprompted (no auto-popups)
- She doesn't block navigation (no "you should do this first" gates)
- She doesn't create anxiety ("you're falling behind" — never)
- Her presence is **warmth, not pressure**. She's the senior mentor sitting next to you, not the project manager checking your progress.

---

## What I'm building now

1. ✅ **View mode toggle** (List ↔ Map) inside the EdgePath header — accessible from both H1 and H2
2. ✅ **Rebuilt mind map** with labeled milestone pills, visible path branches, clear click affordances, Sophia onboarding tooltip
3. ✅ **Actionable Task Room panel** with primary CTA ("Continue where you left off"), sub-task checklist with checkable items, Sophia coaching with "Ask Sophia for help" link, cross-surface action links ("Open ResumeEdge", "View matching jobs"), and bottom actions ("Share with mentor", "Add to today")
4. ✅ **Sophia ambient annotations** — small ✦ marks on milestone nodes that have Sophia notes, visible on hover
5. ✅ **Adaptive Sophia bar** that changes message based on what you're looking at (milestone selected, path comparison open, default overview)
6. ✅ **Sophia onboarding tooltip** when entering Map View: "This is your journey as a map. Click a phase to see milestones. Click a milestone to open it. Drag to pan."
7. ✅ **Path comparison panel** — click "3 paths" on Phase 2 to see all three pathways with match %, Sophia reasoning, milestone previews, and "Choose this path" CTAs
8. ✅ **H3 removed from EdgePath** — the mind map is now a mode toggle within H1 and H2, not a separate hypothesis