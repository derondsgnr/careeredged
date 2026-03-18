# Surface 3: EdgePath — UX Spec

Before writing code. Using the 7-point framework.

---

## 1. The Job

**"Understand where I am in my career journey and know exactly what to do next."**

Not "view my roadmap." The roadmap is a means. The job is orientation + next action. The user should leave this surface knowing: where they stand, what's working, what's behind, and what to do today.

---

## 2. The States

### Empty (Day 0 — no roadmap exists)

This is the most critical state. The user clicked "EdgePath" from the nav and has nothing yet. Most career tools show an empty table with "Create your first roadmap." That's a dead end disguised as a page.

**What should happen instead:** Sophia takes over. The surface IS the creation flow. Not a blank page with a button — the page itself IS the prompt.

- Sophia's mark, centered. "Let's map your path." Below: two inputs — current role, target role. That's it. Not 15 questions upfront. Two inputs → generate → the roadmap materializes on this same surface. The assessment (15 questions, archetypes) happens AFTER the initial roadmap is generated, as a refinement step. "Want to make this more precise? Take the 7-minute assessment."
- The background could use the dot-grid pattern from Quarn — empty but not void. A workspace waiting.
- No sidebar content, no widgets. One job: create your roadmap.

**Design question for you:** The PRD says the assessment is 15 questions → 18 archetypes → career matches. That's a separate sub-feature (Career Discovery Hub). Should the initial roadmap generation be simpler (2 inputs) with the full assessment as an optional depth layer? Or should the assessment be required before any roadmap generates? My position: simple first, depth optional. The onboarding already asked enough questions. Don't make them earn the roadmap twice. - okay, would the simple first cover a good enough base across all the career types? I think sophie should be intelligent here?

### Active (has 1 roadmap, mid-journey)

This is the primary state. The user has a generated roadmap with phases, milestones, and progress. This is the "daily driver" state — they'll visit this surface 3-5 times per week.

**What the user needs to see at a glance:**
1. Which phase am I in? (spatial position in the overall journey)
2. What's my progress in this phase? (% or milestone count)
3. What should I do today? (next unchecked milestone — not a list of everything, just the next one)
4. Has anything changed since last visit? (Sophia's living roadmap updates — new jobs matching this phase, mentor feedback, market signals)

**Layout thinking:**

The dashboard uses a horizontal roadmap strip at the top (phases as pills). EdgePath should expand on that — the strip becomes the primary navigation within this surface. Click a phase → the content below shows that phase's detail.

Below the phase strip:
- **Left (main area):** The phase detail — milestones as a checklist, but not a flat list. Grouped by category (Skills to build, Actions to take, Resources to complete). Each milestone has: checkbox, title, estimated time, and optionally a Sophia note.
- **Right (narrower column):** Sophia's commentary + contextual suggestions for THIS phase. "3 jobs match your Phase 2 skills" / "Alice (your EdgeGuide) left feedback on your portfolio" / "Design Systems is trending in your target companies."

This mirrors the two-column pattern from the dashboard — familiar, not a new layout to learn.

### Dense (multiple roadmaps, power user)

The PRD supports multiple roadmaps with a "Primary Roadmap" star-toggle. A power user might have:
- Primary: UX Designer → Product Design Lead
- Secondary: Exploring Data Science pivot
- Archived: Previous career path

**How to handle:** A roadmap selector above the phase strip. Default shows the primary (starred) roadmap. A dropdown or pill toggle to switch. Not a separate page — same surface, different data. The star-toggle is visible and obvious.

The Pathway Compare sub-feature (side-by-side comparison of pathway options within a phase) could render as a split view when activated — left and right showing two options. But this is an occasional action, not the default state.

### Loading

Roadmap generation takes time (AI). This is where trust is built or lost.

- The phase strip skeleton loads immediately (user sees the structure before the content).
- Each phase fills in sequentially — not all at once. Phase 1 appears, then 2, then 3. This communicates "intelligence is working" better than a spinner.
- Sophia's commentary: "Building your roadmap based on [target role]... analyzing 400+ skill pathways..." — specific, not generic "Loading..."

### Error / Stale

- Generation failure: Sophia acknowledges. "I couldn't generate a full roadmap for [unusual role]. Here's what I have — want to refine?" Show partial results, not nothing.
- Stale roadmap (haven't visited in 3+ weeks): Sophia's bar at the top: "It's been 23 days. Your Phase 1 deadline is in 5 days. 3 things changed." Not a guilt trip — a catch-up summary.

---

## 3. Navigation In/Out

### How users GET here
- **From dashboard:** Click "EdgePath" in the top nav bar. OR click the roadmap strip on the dashboard (it acts as a deep link to this surface). OR click a specific phase/milestone from the dashboard's Roadmap Todos widget.
- **From Sophia:** "Open my roadmap" / "Show Phase 2" / "What's my next milestone?"
- **From other surfaces:** EdgeMatch might link here ("This job matches your Phase 2 target role"). ResumeEdge might link here ("Your resume is optimized for your Phase 3 skills").

### How users LEAVE
- **Top nav:** Always present. Click any other nav item.
- **Contextual links OUT:** Milestones can link to relevant tools. "Complete your resume" → links to ResumeEdge. "Apply to 3 matching jobs" → links to EdgeMatch with pre-filtered results. These are the roadmap's tentacles into the rest of the product.
- **Sophia bar:** Always present at bottom. Suggestions may lead elsewhere based on context.

### What the top nav shows
- EdgePath is the active pill (highlighted).
- No sub-navigation needed — the phase strip IS the sub-navigation within this surface.

### What Sophia's bar says on this surface
Context-aware to the roadmap state:
- Day 0: "Let's build your roadmap — it takes 2 minutes to start."
- Active, on track: "Phase 2 is 65% complete. 2 milestones this week."
- Active, behind: "Your Phase 1 deadline was 3 days ago. Want to adjust the timeline?"
- After completing a milestone: "Nice. 4 more in this phase. The next one is [X]."

---

## 4. Friction Points

### Friction 1: The 15-question assessment wall
If we require the full Career Assessment before generating a roadmap, most users will bounce. The PRD says 15 weighted questions across 5 categories. That's a LOT after they already answered onboarding questions.

**Resolution:** Generate a "starter roadmap" from the 2 inputs (current → target role) + what Sophia already knows from onboarding. Surface the full assessment as a "Make this more precise" optional refinement. The roadmap gets better, not gated.

### Friction 2: Milestone overwhelm
A roadmap with 4 phases × 8 milestones = 32 items. That's a to-do list, not a roadmap. Users will feel overwhelmed and stop visiting.

**Resolution:** Only show the CURRENT phase expanded. Other phases are collapsed to a summary line ("Phase 1: Complete · Phase 3: 0/8 · Phase 4: Locked"). Within the current phase, show the next 3 milestones prominently, rest collapsed under "Show all milestones." The user always sees a manageable bite, not the full mountain.

### Friction 3: "I checked a milestone but nothing happened"
The current PRD describes milestones as checkable. If checking a box does nothing — no feedback, no Sophia reaction, no progress change — the action feels hollow.

**Resolution:** Checking a milestone triggers:
1. The checkbox animates (lime fill, brief pulse)
2. The phase progress bar updates immediately
3. Sophia's commentary strip updates: "Phase 2 now 75% complete. Next: [milestone name]."
4. If it's the last milestone in a phase → phase completion moment (larger celebration, Sophia congratulates, phase strip updates to "Complete" state)

### Friction 4: "What do I actually DO for this milestone?"
A milestone that says "Learn React fundamentals" with no actionable guidance is a wish, not a task.

**Resolution:** Each milestone can expand to show Sophia's recommendation: suggested resources (courses, articles), estimated time, and optionally a direct action ("Start course" / "Read article" / "Practice in EdgeProd"). The milestone isn't just a checkbox — it's a brief.

### Friction 5: Pathway Compare is confusing
Side-by-side comparison of pathway options within a phase is a powerful feature but could easily become overwhelming.

**Resolution:** Only surface Pathway Compare when there's a genuine fork — Sophia identifies that this phase has 2+ viable paths (e.g., "Learn React" vs. "Learn Vue" for a frontend role). Present it as a Sophia suggestion: "I see two paths for this phase. Want to compare?" Not always visible. Contextual.

---

## 5. Sophia's Role on This Surface

Sophia is the roadmap's curator. Not a passive display — an active intelligence layer.

**Specific behaviors:**

1. **Phase commentary strip** (persistent, below phase strip): One-line insight about the current phase. "Phase 2 is your skill-building phase. You're 65% through — 2 weeks ahead of schedule." Updates based on state.

2. **Milestone suggestions**: When a milestone is expanded, Sophia can annotate with specifics. "Based on your saved jobs, prioritize Design Systems over Motion Design — 4 of your target companies list it as required."

3. **Living updates**: When the user returns after time away, Sophia surfaces what changed: "Since your last visit: Design Systems demand increased 12% in your target companies. I've added it to Phase 2." The user sees the roadmap as alive, not static.

4. **Cross-surface connections**: "Your resume scored 72 for your Phase 2 target role. After completing the next 2 milestones, we should re-optimize." This connects EdgePath to ResumeEdge without navigation.

5. **Completion coaching**: When a phase is done, Sophia doesn't just say "congrats." She transitions: "Phase 2 complete. Phase 3 focuses on job search strategy. Your resume is ready — let's start applying. I've found 8 matching positions." Direct bridge to the next action.

---

## 6. The Delight Moment

**Phase completion.** When the user checks the final milestone in a phase, the phase node in the strip transitions from "In Progress" to "Complete" — the node fills with lime, a brief radial pulse, and the connection line to the next phase illuminates. Sophia's commentary celebrates briefly then immediately pivots to what's next. The celebration is 2 seconds, not 10. It's earned, not manufactured.

Secondary delight: **The "ahead of schedule" notification.** When a user is progressing faster than the estimated timeline, Sophia notes it: "You're 2 weeks ahead. At this pace, you'll complete Phase 3 by April 12 — a month earlier than planned." Positive reinforcement through data, not confetti.

---

## 7. Reference Patterns (Behavioral, Not Visual)

| Reference | Pattern borrowed | Applied to |
|---|---|---|
| **Quarn (command menu)** | Contextual "What happens next?" appearing at point of need | Milestone expansion: when you check one, the next surfaces with "Here's what's next" |
| **SpaceX (floating alerts)** | Contextual cards near relevant content | Sophia's phase commentary strip — not in a sidebar, not in a notification drawer. Inline, near the phase it's about. |
| **SpaceX (mode pills)** | Lightweight mode selectors for different views | Phase strip as horizontal navigation. Active phase is highlighted. Others are muted but accessible. |
| **Legal tool (trophy card)** | Green gradient treatment for deliverables/achievements | Phase completion card. Milestone achievement rendering. |
| **Sergushkin (suggestion chips)** | Contextual action suggestions below input | Below expanded milestones: "Start course" / "Read article" / "Practice" as action chips |
| **Linear (issue as organizing unit)** | The task IS the unit, not the tool | Each milestone is a self-contained brief with context, resources, and actions. Not just a checkbox in a list. |
| **PicGen (multi-panel workflow)** | Visible stages showing progress through a flow | The phase strip shows all phases, with the current one expanded below. User sees the whole journey, not just the current step. |

---

## 8. Role Variants

| Role | What changes | What stays |
|---|---|---|
| **EdgeStar** | Full access. Can create, edit, check milestones, take assessment, compare pathways. | Layout, Sophia bar, phase strip |
| **EdgePreneur** | "Business Roadmap" variant — phases are business stages (Idea, MVP, Launch, Scale). Milestones are business actions. Same surface, different data model. | Layout, Sophia bar, phase strip |
| **EdgeParent** | Read-only. Can see child's roadmap but not check milestones. Sophia's commentary shifts to parent-friendly: "Alex completed 3 milestones this week." Phase strip shows child's name. | Layout, phase strip |
| **EdgeGuide** | Can view + annotate client roadmaps. "Leave feedback" action on milestones. Sophia: "3 of your clients are in Phase 2. Sarah is behind — consider reaching out." | Layout, Sophia bar |

---

## 9. Open Questions for You

1. **The Career Discovery Hub (30+ careers, 11 industries)** — is this a separate surface/page, or a section within EdgePath? My instinct: it's the Day 0 state's secondary offering. "Don't know your target role? Explore careers first." It's a sub-view within EdgePath, not surface #11. yes that is correct

2. **Voice Profile ("2-3 min Sophia-guided recording → AI auto-extracts professional profile")** — is this part of onboarding, EdgePath creation, or its own thing? It feels like an alternative to typing your current role during roadmap creation. "Instead of typing, tell Sophia about yourself." yes exactly. users can speak to sophie instead of texting so thats an affordance across board

3. **The assessment (15 questions, 18 archetypes)** — should archetype results be displayed on this surface? A "Your archetype: Innovator-Strategist" badge somewhere? Or is that too noisy for the roadmap view?

4. **Multiple roadmaps** — how many is realistic? 2-3? Or should we cap it? UI gets messy above 3 active roadmaps. We can create for 3 but if their business model wants more, they can do so.

5. **The two-column layout** — do you want the right column (Sophia commentary + contextual suggestions) to persist, or should it be collapsible? On smaller screens it'll stack below. hm

---

## 10. Component Extraction Preview

Building this surface will produce these reusable components:

- **Phase strip** (horizontal phase navigation with status indicators) — already exists on dashboard, this is the full version
- **Milestone item** (checkbox + title + meta + expandable detail + action chips)
- **Phase detail card** (grouped milestones by category within a phase)
- **Sophia commentary strip** (inline contextual text, specific to any surface)
- **Pathway compare split view** (side-by-side comparison, reusable for any A/B decision)
- **Progress indicators** (phase %, milestone count, timeline estimation)
- **Empty state with Sophia prompt** (reusable for any surface's Day 0)

---

Ready to build when you confirm. Or push back on any of the above.
