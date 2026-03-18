# Remaining Surface Triage — Deep Think vs. Speed Run

## What's Built (Surfaces 1–4 + Sophia)

| # | Surface | Status |
|---|---|---|
| 1 | Onboarding | H2 selected. Built. Needs fixes (dashboard assembly visibility, roadmap gen step, Sophia 3Qs, blur-lift transition). |
| 2 | App Shell + Dashboard | Synthesis locked. Built. |
| 3 | EdgePath | H1 two-column + mind map. Full states built (empty, loading, active, celebration, stale return, ahead of schedule, multiple roadmaps). Sophia wired. |
| 4 | Sophia Ask | Float → Panel. 11 content blocks, 47+ scenarios, route table, chip chaining, action/navigate/ask behaviors. Fully built. |

## What's Left (6 Surfaces)

| # | Surface | Deep Think? | Speed Run? | Why? |
|---|---|---|---|---|
| 5 | **ResumeEdge** | **YES** | No | Novel interaction patterns. AI trust is the core UX problem. |
| 6 | **EdgeMatch (Job Board)** | Partial | Mostly | Established pattern (card grid + filters + detail) BUT Sophia's matching intelligence and the save/apply/track flow need thought. |
| 7 | **EdgeSight / Analytics** | No | **YES** | Charts + filters + date pickers. Established. Data matters, not interaction. |
| 8 | **Messaging + Video** | No | **YES** | Standard conversation list + thread. Sophia's presence is the only novel element, and we've already defined her interaction model. |
| 9 | **Session/Booking** | No | **YES** | Calendar + time slots. Calendly pattern. Well-understood. |
| 10 | **Task Rooms** | **YES** | No | Conceptually the most novel surface. Defines how users DO the work. Needs the "room" metaphor, resource assembly, Sophia coaching mode. |

---

## The Two That Need Deep Thinking

### 1. ResumeEdge — The AI Trust Problem

This is the only surface where the AI *rewrites the user's work*. Every other Sophia interaction is advisory. Here, she edits your resume. That's a fundamentally different trust dynamic.

**UX questions that can't be speed-run:**

- **How do you show AI changes?** Full diff view? Side-by-side before/after? Inline annotations with accept/reject per section? Track-changes style? Each has different cognitive load and trust implications. hm side by side but with highlights + accept reject? idk what affordances would they need, we are catering to completely none technical people, probably older, haven't used a lot of tools etc
- **The scoring UX.** "Your resume scores 72% for Product Designer roles" — what does that mean? Is it a single number? A breakdown by category (keywords, formatting, experience match, ATS compatibility)? How granular before it's overwhelming? can we provide options?
- **Multiple versions.** Users will want "optimized for Figma" and "optimized for Linear" versions of the same resume. How do you manage versions without turning it into a file system? hm thoughts?
- **The AI processing state.** The resume goes through analysis → scoring → optimization. That's 10-30 seconds of waiting. What does the user see? A progress bar is lazy. What's the CareerEdge version of "here's what I'm doing while you wait"? we have none atm , we define it
- **Cover letter generation.** Is this a separate flow or part of the resume surface? Does Sophia generate it from scratch or from the resume + job description? How does the user edit it? hm let's think
- **The "accept all" vs. "review each" tension.** Power users want "just optimize it." Anxious users want to review every change. Both are valid. The UX needs to support both without making either feel like the wrong path.
- **Sophia's role.** She's not just processing — she's explaining WHY she made changes. "I moved your leadership experience above your technical skills because 7 of your target companies prioritize management experience." That's not a tooltip. That's a coaching conversation embedded in a document editor.

**Reference patterns to consider:**
- Grammarly's inline annotation model
- Google Docs suggestion mode
- Notion AI's inline rewrite
- Figma's version history
- But none of these have the "score against job targets" dimension

**Estimated spec time:** 30-45 min of real thinking before code.

### 2. Task Rooms — The "How Do I Actually Do This?" Problem

Every other surface tells the user WHAT to do. Task Rooms are where they DO it. This is the execution layer.

**UX questions that can't be speed-run:**

- **What IS a Task Room?** Is it a modal? A full page? A panel? A state within EdgePath? The metaphor matters. "Room" implies a space you enter and stay in. A panel implies a quick reference. These produce very different behaviors. It should feel like a room you enter
- **Resource assembly.** When Sophia says "Complete the Interaction Design module," what does the Task Room show? The course link? An embedded player? A checklist of sub-steps? All the related resources gathered in one place? The value prop is "everything you need for this task, assembled for you" — but what does that look like?
- **Sophia's coaching mode.** In the Task Room, Sophia shifts from advisor to coach. She's not saying "you should do X" — she's saying "you're doing X right now, here's how to do it better." That's a different interaction pattern than anything we've built.
- **Progress within a room.** Sub-tasks, time tracking, "where I left off" state. How does partial completion look? How does the user know they're 60% through a task?
- **The room tray.** The brief mentions a "rooms tray" — a persistent way to see your open/recent rooms. Is this a bottom bar? A sidebar? A dropdown? How many rooms can be "open"? hm what's the best ux, abstracting from similar behaviors and patterns in other top 1% products
- **Cross-surface context.** A Task Room for "Build case study #2" might pull in: the Figma course (resource), your current resume (for context), matching jobs (motivation), and Alice's feedback (mentor input). That's 4 surfaces worth of context in one room. How do you lay that out without it becoming a dashboard? look at our references
- **Entry and exit.** How do you enter a Task Room? From EdgePath milestone click? From Sophia suggestion? From the rooms tray? How do you leave? Back button? Close? Does leaving save state? validate best ux, affordance, friction, seamlessness,intuitiveness from similar products

**Reference patterns to consider:**
- Notion's page-as-workspace
- Linear's issue detail (focused context for one task)
- Figma's canvas (open space with assembled tools)
- But none of these have the AI coaching + cross-surface assembly dimension

**Estimated spec time:** 30-45 min of real thinking before code.

---

## The Four That Can Be Speed-Run

### 3. EdgeMatch (Job Board) — 80% established, 20% needs thought

The layout is a solved problem: filter sidebar + card grid + detail panel. The 20% that needs thought:
- How Sophia's match % is displayed and explained (not just "92% match" — WHY 92%?)
- The save → apply → track flow (what happens after you click Apply?)
- Application status tracking (applied, viewed, interviewing, offer, rejected)
- How EdgePath milestones connect to job requirements ("Complete interaction design to qualify for 3 more jobs")

**Can be speced in 10 min, built in 2h.**

### 4. Messaging + Video — Standard pattern

Conversation list (left) + thread (right). The only novel elements:
- Sophia can be a participant in conversations (mentor matches, interview prep)
- Video call UI (minimal — a call card with controls, not a full Zoom rebuild)
- File sharing within threads

**Can be speced in 10 min, built in 1.5h.**

### 5. EdgeSight / Analytics — Data display

Charts (area, bar, funnel, gauge), filter chips, date picker, data tables. Serves:
- EdgeStar → EdgeBoard (personal career analytics)
- Employer → EdgeSight (hiring analytics)
- Education → outcome tracking

The visual treatment is established (glass cards, our color system, gauge arcs from the dashboard). The only decision is which charts to show and what data they represent.

**Can be speced in 10 min, built in 1.5h.**

### 6. Session/Booking — Calendly pattern

Calendar grid + time slot picker + booking confirmation. Serves:
- EdgeGuide (host sessions, set availability)
- EdgeStar (book sessions with mentors/coaches)

Standard scheduling UI. The only CareerEdge-specific element is Sophia suggesting optimal session times based on the user's roadmap progress.

**Can be speced in 10 min, built in 1.5h.**

---

## Recommended Execution Order

| Order | Surface | Type | Time | Rationale | - we have established the navigation to all of this yes?
|---|---|---|---|---|
| **1** | **ResumeEdge** | Deep think → spec → build | 3h total | #2 most-used feature. Novel AI patterns. High component extraction value (document viewer, diff, score display, AI processing states). |
| **2** | **EdgeMatch** | Quick spec → build | 2h | High-frequency surface. Completes the core EdgeStar trio (EdgePath + Resume + Jobs). |
| **3** | **Task Rooms** | Deep think → spec → build | 3h total | Conceptually novel. Defines execution layer. References patterns from ALL previous surfaces. Build last because it pulls from everything. |
| **4** | **EdgeSight** | Speed run | 1.5h | Chart components for design system. Low UX risk. |
| **5** | **Messaging** | Speed run | 1.5h | Communication layer. Reuses list/card patterns. |
| **6** | **Session/Booking** | Speed run | 1.5h | Calendar + booking. Standard. |

**Total: ~12.5h for 6 surfaces.**

After these 6, the remaining work is:
- Onboarding H2 fixes (2h)
- Cross-surface polish + transitions (2h)
- Component extraction into design system (2-3h)

---

## Decision Point for You

Before I start ResumeEdge spec:

1. **Do you agree ResumeEdge and Task Rooms are the two that need deep thinking?** Or do you see complexity in EdgeMatch or Messaging that I'm underestimating? yes i agree

2. **Task Rooms timing.** I put it at #3 (after EdgeMatch) because it references patterns from all other surfaces. But it could also go first — since it defines HOW users complete EdgePath milestones, it arguably should inform EdgePath's milestone-click behavior. Your call.

3. **Any surfaces I'm missing?** The sprint strategy lists 10 surfaces. We've built 4. That leaves 6. But the PRD mentions features like Interview Simulator, Networking Assistant, Interactive Resume, EdgeProd (7 productivity tools) — are any of these in scope for this sprint, or are they post-10-surfaces work? yes we are covering the surface of all 8 user types from onboarding to new user to active user to log out so always think in systems so we create something beautiful 
