# EdgePath — Multiple Paths, Mind Map Mode, and Task Rooms

Three connected questions. Let me take them in order, then show how they fit together.

---

## 1. Multiple paths within phases — Good UX?

Yes, but only when Sophia controls the gates.

Career transitions genuinely have forks. "Learn React" vs "Learn Vue" for a frontend role is a real decision. "Portfolio-first" vs "network-first" approach is a real strategic choice. Pretending the path is always linear would be dishonest — and users would feel it.

**What makes it good UX:**
- Some phases genuinely have 2 viable approaches. Showing both respects the user's agency.
- Sophia can recommend one ("Based on your profile, I'd go portfolio-first — your work speaks louder than your network right now") while showing the alternative exists.
- It creates a natural moment for mentor/EdgeGuide involvement: "Want to talk through this fork with Alice?"

**What makes it bad UX:**
- If EVERY phase has multiple paths, the roadmap becomes a choose-your-own-adventure book. The user came for guidance, not more decisions.
- If paths are generated just to show optionality (when there's really only one sensible path), it's false agency. Worse than no choice.
- If the user has to fully understand both paths before choosing, they're doing Sophia's job for her.

**My position:** Paths within phases are a strong affordance, but with these constraints:
1. Most phases should have ONE path. Sophia only presents alternatives when there's a genuine, material fork.
2. Maximum 2 paths per fork (never 3+). A/B, not A/B/C.
3. Sophia always has a recommendation. The default is pre-selected. The user overrides, not selects from scratch.
4. The fork visualization should feel like a brief detour in the journey, not a split in the road. You're still going to Phase 3 either way — you're choosing HOW you get there.

This is already how we triaged it (Pathway Compare is Sophia-triggered, not a tab). But it means the DATA MODEL supports branching, and the visualization needs to handle it.

Which brings us to your real question.

---

## 2. Mind map visualization — can it work? Is it the edit mode?

We already discussed this in the motion redesign doc. I said the product should have a full interactive node canvas for the roadmap. You're now asking: is the mind map the MODE where you edit/explore, while the linear list is the mode where you execute?

**Yes. Exactly. Two modes of the same data.**

Here's the architecture:

### View Mode (what we just built in Options A/B) — the daily driver
- Linear. Scannable. Actionable.
- Phase strip at top → milestone list below → check things off.
- This is where you spend 90% of your time. Open, check a milestone, leave.
- Sophia weaves intelligence into this view (inline cards or sidebar).
- Optimized for: speed, clarity, "what do I do today?"

### Map Mode (the mind map) — the exploration/editing layer
- Spatial. Canvas-based. Shows the full landscape.
- Phases as large nodes. Milestones as smaller nodes branching from phases. Paths as diverging branches that reconverge at the next phase.
- You can: zoom in/out, pan, see the whole journey, drill into a phase, rearrange milestones, add custom milestones, choose between paths.
- Sophia annotations appear as small cards attached to nodes ("I'd prioritize this one").
- This is Flora meets Weavy meets Obsidian graph view.
- Optimized for: understanding, planning, editing, "let me see the big picture."

**Why this works for CareerEdge specifically:**

1. **The roadmap IS a graph, not a list.** Phases → milestones → skills → jobs → resources — these are nodes with connections. A linear view flattens what is actually a spatial structure. The mind map shows the truth.

2. **Path forks are natural in a mind map.** A branch in a mind map is obvious — two lines diverging from one node. In a linear list, showing forks is awkward (nested lists? toggle groups?). The mind map makes branching intuitive.

3. **Flora's canvas DNA is already in our reference stack.** Dark canvas, dot-grid, spatial blocks with connection points. We're not inventing a new paradigm — we're applying one we already studied.

4. **Editing feels natural on a canvas.** Dragging a milestone to reorder? That's canvas behavior. Adding a custom milestone? Click empty space → new node. Removing one? Right-click → delete. This is more intuitive than editing a checklist.

**Why this has risks:**

1. **Mind maps look impressive but get messy fast.** A roadmap with 4 phases × 8 milestones × 2 paths = 80+ nodes. That's a wall of dots. You need aggressive progressive disclosure — collapse phases, show only the active branch, let users zoom.

2. **Canvas UX is hard to get right on mobile.** Pinch-zoom, pan, node selection on a small screen — this is substantially harder than a scrollable list. The mind map may need to be desktop-only or significantly adapted for mobile.

3. **Engineering cost.** A proper canvas renderer with drag/drop, zoom, pan, node connections, and animation is 6-12 weeks minimum. This is not a CSS layout — it's a canvas rendering problem (HTML canvas, SVG, or a library like react-flow).

4. **Users who just want to check a box.** Some users will NEVER use the mind map. They want the list. They want to check "Complete Figma course" and leave. The mind map is there for users who want to understand and plan, not for everyone.

**My recommendation:** The mind map is real and should exist. But it's a toggle within EdgePath, not the default. The default is the linear view (execution mode). The mind map is the "Edit my path" / "See the big picture" mode. A clear toggle between them — like Linear's List vs Board vs Timeline views, or Notion's Table vs Board vs Calendar.

For this sprint: I can prototype what the mind map mode would FEEL like — a simplified canvas showing phases as nodes with branching, milestones as sub-nodes, path forks visible. Not fully interactive (no real drag/drop, no canvas rendering library) but enough to evaluate whether the visualization works for your data. The real implementation would need react-flow or similar.

**Question back at you:** Do you want me to prototype the mind map mode now as a third EdgePath option? Or document it in the spec and build it in a separate sprint? It's a substantial visualization challenge and I want to give it proper treatment, not rush a half-version.

---

## 3. Is this the Task Room entry point?

Yes. This is exactly the connection.

From your onboarding brief: "The organizing unit is not the tool — it's the task. When you're working toward a specific goal, Sophia creates a Task Room around it."

Here's how it flows:

```
EdgePath (View Mode)          EdgePath (Map Mode)           Task Room
┌─────────────────┐         ┌─────────────────────┐      ┌──────────────────────┐
│ Phase 2          │         │     ●─── Phase 1    │      │ Task Room:           │
│ ☑ Figma course   │         │     │               │      │ "Interaction Design" │
│ ☑ Design systems │         │     ●─── Phase 2    │      │                      │
│ ○ Interaction ←──│── or ──│→    ├── Interaction ←│──→  │ ☑ Watch module 1-3   │
│   design module  │ click   │     ├── Case study   │      │ ○ Complete exercises  │
│ ○ Case study #2  │         │     └── Portfolio    │      │ ○ Build mini-project  │
│                  │         │     │               │      │                      │
│                  │         │     ●─── Phase 3    │      │ Resources:           │
└─────────────────┘         └─────────────────────┘      │ · IDF Course link    │
                                                          │ · Microinteractions   │
                                                          │   (book)             │
                                                          │                      │
                                                          │ Sophia:              │
                                                          │ "6 of 8 target       │
                                                          │  companies need this"│
                                                          │                      │
                                                          │ Related:             │
                                                          │ · Resume (needs      │
                                                          │   update after)      │
                                                          │ · 3 jobs match this  │
                                                          │   skill              │
                                                          └──────────────────────┘
```

The entry point is a milestone click — from EITHER view. In the list view, clicking a milestone expands it (brief mode) or opens its Task Room (deep mode). In the mind map, clicking a milestone node opens its Task Room.

The Task Room is where tools converge around a goal:
- The milestone itself (what to do)
- Sophia's guidance (why it matters, how to approach it)
- Resources (courses, articles, tools)
- Cross-surface connections (resume needs update after this, jobs that require this skill)
- Sub-tasks (if the milestone breaks into smaller steps)
- EdgeGuide notes (if your mentor left feedback)

**This means EdgePath has THREE layers:**

| Layer | Mode | Job | Used... |
|-------|------|-----|---------|
| **View** | List (Options A/B) | "What do I do next?" Check things off. | Daily. 90% of visits. |
| **Map** | Mind map / canvas | "What does my whole journey look like?" Explore, plan, choose paths, edit. | Weekly. When planning or reflecting. |
| **Room** | Task Room | "How do I actually complete THIS milestone?" Deep work, resources assembled. | Per task. When doing the work. |

View → Map → Room. Each layer goes deeper. The user starts at the surface and drills in when they need more.

**But here's the important part:** Task Rooms are a Phase 2 concept (from the implementation phases in the brief). They require a new data model ("room assembly from context" — 4-8 weeks build time). For this sprint, the milestone expansion (showing Sophia's note, resources, action chips) is the EMBRYO of a Task Room. It's the same information, just rendered inline instead of as a dedicated workspace.

---

## Summary of positions

| Question | My position |
|----------|-------------|
| Multiple paths within phases | Good affordance. Sophia-controlled gates. Max 2 paths per fork. Most phases = 1 path. |
| Mind map as edit mode | Yes, as a MODE toggle within EdgePath. Not the default. Prototype feasible, but full build needs canvas library. |
| Task Room connection | Task Room = deep mode entered from a milestone. The milestone brief we already built is the embryo. Full Task Rooms are Phase 2. |

---

## What I need from you

1. **Mind map prototype now or later?** I can build a simplified version as a third EdgePath option showing the canvas/node visualization. It won't have real drag/drop but will show the spatial structure, branching paths, and node interactions. Or we spec it and build it in a dedicated sprint.

2. **How deep should the Task Room embryo go?** Right now, expanding a milestone shows: Sophia note + resources + action chips. Should I push this further toward a "mini Task Room" — showing cross-surface connections (resume impact, matching jobs, mentor notes) inside the expanded milestone? That would be cheap to build and would test whether the Task Room concept resonates before building the full thing.

3. **Path forks in the current prototype?** Should I add branching path visualization to Options A and B now? In the list view, a fork would render as a "Choose your path" card between milestone groups. In the mind map, it's natural branching.
