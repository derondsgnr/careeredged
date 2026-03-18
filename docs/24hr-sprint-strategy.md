# 24-Hour Sprint Strategy — Surfaces, Onboarding Audit, Execution Plan

---

## 1. Onboarding Audit — Is It Tight?

### What H2 covers (good)

The role routing is genuinely comprehensive. All 8 sub-intents have tailored question paths:

| Intent tier | Sub-intent | Target Q | Level Q | Covered? |
|---|---|---|---|---|
| Building my career | EdgeStar | What field? (7 options) | Where are you at? (6 levels) | Yes |
| Building my career | EdgePreneur | What stage? (4 options) | What industry? (6 options) | Yes |
| Guiding someone else | EdgeParent | Who are you supporting? (4 options) | What kind of support? (4 options) | Yes |
| Guiding someone else | EdgeGuide | What's your role? (4 options) | How many people? (4 options) | Yes |
| Representing an org | EdgeEmployer | Biggest hiring challenge? (4 options) | Org size? (4 options) | Yes |
| Representing an org | EdgeEducation | Institution type? (4 options) | Primary goal? (4 options) | Yes |
| Representing an org | EdgeNGO | Program focus? (4 options) | Operating scale? (4 options) | Yes |
| Representing an org | EdgeAgency | What initiative? (4 options) | Government level? (4 options) | Yes |

The 3-tier structure (intent → sub-intent → path-specific Qs) is solid IA. It avoids throwing 8 role options at the user cold. Instead: 3 choices → 2-4 choices → role-specific questions. That's good.

### What's missing or weak

**1. The "dashboard building" feeling didn't land.** User feedback: they liked H2's onboarding but "couldn't tell the dashboard was building around them." This is the core promise of H2 and it's not landing visually. The dashboard assembly in the background needs to be much more obvious — possibly with labels/annotations on each piece as it appears, or a more dramatic blur-to-sharp transition, or the pieces need to be larger/more recognizable.

**2. No anonymous value demo.** The onboarding brief defines the organic path as: 2 questions → generate artifact → reveal (aha moment) → "save this" → signup. H2 currently goes: intro → intent → sub → target → level → building → ready → signup. There's no roadmap generation before signup. The "building" step creates dashboard chrome, not a personalized artifact. For EdgeStar and EdgePreneur (the organic path users), the roadmap reveal before signup is the conversion mechanism. This is a gap.

**3. The organic vs institutional path split isn't implemented.** Per the architecture doc:
- **Organic (EdgeStar, EdgePreneur):** 2 Qs → generate artifact → reveal → save → signup → role confirm → Sophia 3 Qs → dashboard
- **Institutional (Parent, Guide, Employer, Edu, NGO, Agency):** Signup → role selection → Sophia greets → dashboard with first guided action

Currently all 8 paths follow the same flow. The institutional users (who can't get an anonymous artifact) are still going through the same sequence as EdgeStar users.

**4. Sophia's 3 follow-up questions (post-signup) aren't built.** The brief calls for 3 Sophia exchanges after role confirmation: employment status, biggest blocker, target timeline. These personalize the dashboard state. Not implemented yet.

**5. The "enter dashboard" transition isn't built.** The moment where the blur lifts and the user steps into their assembled dashboard — the payoff of the whole H2 concept — needs to exist as a real transition, not just a route change.

### Verdict

Role routing: **tight — all 8 covered with thoughtful per-role questions.**
Conversion flow: **has gaps — needs the anonymous artifact generation for organic users and the Sophia 3Qs for post-signup.**
Dashboard reveal: **concept is right, execution didn't land — needs visual rework.**

### What to do about it (within the 24hr crunch)

Don't rebuild onboarding from scratch. The role routing is done. Instead:
1. Fix the dashboard assembly visibility (make pieces more obvious, add labels)
2. Add the roadmap generation + reveal step for EdgeStar/EdgePreneur before signup
3. Add Sophia's 3 post-signup questions
4. Build the blur-lift "enter dashboard" transition

Estimate: 2-3 hours of focused work. Do this AFTER the surface sprint, not before — the dashboard needs to be finalized first since the onboarding builds toward it.

---

## 2. The 10 Surfaces — Full List

Per the IA doc, ranked by priority and component extraction value:

| # | Surface | Status | What it produces for the design system |
|---|---|---|---|
| 1 | **Onboarding** | Built (H2 selected, needs fixes above) | Stepper, Sophia conversational UI, role selector, input patterns, transitions |
| 2 | **App Shell + Dashboard** | Built (synthesis locked, needs polish) | Top nav, Sophia bar, KPI cards, gauge arcs, roadmap strip, activity feed, milestone timeline |
| 3 | **EdgePath (Career Roadmap)** | Not started | Phase cards, milestone nodes, progress visualization, timeline, Sophia commentary, living document patterns |
| 4 | **ResumeEdge** | Not started | File upload, engine selector, AI processing states, score display, diff/comparison view, document preview, export controls |
| 5 | **EdgeMatch (Job Board)** | Not started | Job cards, filter system, search, application tracker, detail panel, save/apply actions |
| 6 | **EdgeSight / EdgeBoard (Analytics)** | Not started | Chart components (area, bar, funnel, gauge), data tables, filter chips, date pickers |
| 7 | **Messaging + Video** | Not started | Conversation list, message thread, video call UI, file sharing |
| 8 | **Sophia Full Panel** | Not started | Chat interface, task history, suggestion chips, action cards, inline component rendering |
| 9 | **Session/Booking Management** | Not started | Calendar view, time slot picker, booking card, session detail, availability editor |
| 10 | **Task Rooms** | Not started | Room shell, resource cards, Sophia inline commentary, contextual action bar, rooms tray |

---

## 3. The 24-Hour Strategy

### The problem

8 surfaces unbuilt. ~20 hours of realistic working time. Each surface at full hypothesis-exploration depth (3 variations) takes 4-6 hours. That's 32-48 hours for 8 surfaces. We can't do 3 hypotheses per surface anymore.

### The approach: Single-shot informed builds

The hypothesis phase served its purpose for Surface 1 and 2 — we now know the visual language, the layout preferences, the component patterns. We don't need 3 variations for every remaining surface. We have enough signal:

- **Top nav from H2** (horizontal pills, no sidebar)
- **KPI cards with gauges from H3** (data visualization style)
- **Timeline/milestone pattern from H3** (vertical, checklist-style)
- **Sophia bottom bar from H3** (passive intelligence) - we still need to design sophie's ux 
- **Glass cards at rgba(255,255,255,0.025)** with 1px borders at 0.05 opacity
- **Color system locked:** #E8E8ED primary, #9CA3AF secondary, #6B7280 tertiary, #374151 quaternary, #1F2937 background text. Accents: #22D3EE cyan, #B3FF3B lime - this will be updated once branding is complete
- **Density: medium** — not as sparse as H2, not as dense as H3

Each surface gets ONE informed build using these established patterns. If something doesn't land, we iterate on that specific surface — not rebuild from scratch.

### Execution order (by dependency + leverage)

**Block 1 — Core EdgeStar tools (Hours 1-8)**
These three share layout patterns and are the surfaces EdgeStar users will spend 80% of their time in.

| Order | Surface | Time | Why this order |
|---|---|---|---|
| 1 | EdgePath (Roadmap detail) | 2.5h | The product's differentiator. Dashboard links to it. Uses phase/milestone patterns we already built. |
| 2 | ResumeEdge | 2.5h | Second most-used feature. AI processing states are a new pattern we need. |
| 3 | EdgeMatch (Jobs) | 2.5h | High-frequency surface. Card grid + filter + detail panel — common patterns but need to be built once. |

**Block 2 — Intelligence + Communication (Hours 8-14)**
The AI and social layers.

| Order | Surface | Time | Why this order |
|---|---|---|---|
| 4 | Sophia Full Panel | 2.5h | Defines the AI interaction pattern used everywhere. The Sophia bar on the dashboard opens into this. |
| 5 | Messaging + Video | 2h | Communication layer. Reuses card/list patterns from EdgeMatch. |
| 6 | EdgeSight/Analytics | 2h | Data-dense. Chart components get extracted here. Serves EdgeStar (EdgeBoard), Employer (EdgeSight), Edu (outcomes). |

**Block 3 — Scheduling + Advanced (Hours 14-18)**

| Order | Surface | Time | Why this order |
|---|---|---|---|
| 7 | Session/Booking | 2h | Calendar + time picker. Serves EdgeGuide (host) and EdgeStar (book). |
| 8 | Task Rooms | 2h | The most conceptually novel. Uses resource cards, room shell. References patterns from all previous surfaces. |

**Block 4 — Onboarding fixes + Polish (Hours 18-22)**

| Order | Surface | Time | Why this order |
|---|---|---|---|
| 9 | Onboarding H2 fixes | 2h | Dashboard assembly visibility, roadmap generation step, Sophia 3Qs, enter-dashboard transition |
| 10 | Cross-surface polish | 2h | Consistency pass, transition testing, responsive checks |

### What we're NOT doing in 24 hours

- Multiple hypotheses per surface (we have enough signal)
- Mobile-specific layouts (responsive within desktop, but not mobile-first redesigns)
- Role-specific dashboard variations (we build EdgeStar's dashboard; other role dashboards use the same components with different data)
- Backend integration (all mock data)
- Motion/animation polish beyond functional transitions (that's a refinement pass)

### Decision points

After Block 1 (the 3 core tools), we should check in:
- Are the patterns holding? Does EdgePath feel like the same product as the dashboard?
- Is the component vocabulary sufficient or do we need new atoms?
- Are we on time? If behind, we cut Task Rooms (surface 10) and fold its patterns into Sophia Full Panel.

---

## 4. Component System Emerging

From surfaces 1-2, we already have these reusable patterns:

**Layout:** Top nav bar, Sophia bottom bar, max-w-[1200px] centered content, two-column with 320px right sidebar
**Cards:** Glass card (0.025 bg, 0.05 border), gradient card (Sophia insight), job match card, KPI card with gauge
**Data:** Gauge arc SVG, phase progress bar, vertical timeline with nodes, tabbed content switcher
**Navigation:** Pill toggle with layoutId animation, icon+label+badge nav items
**Sophia:** Mark component, insight card, bottom bar with chips, "Ask Sophia" CTA
**Typography:** Display font for headings/labels/numbers, body font for content/descriptions, strict hex hierarchy

Surfaces 3-10 will add: phase detail cards, document preview, filter chips, chart components, calendar grid, chat thread, room shell, resource cards.

---

## 5. Next immediate action

Ship the two-column dashboard layout fix (done). Then start Block 1, Surface 3: EdgePath career roadmap detail view.

Should I start building EdgePath now?

So the MAJOR problem for this entire product and all the surfaces is the UX, Navigation, Intuitiveness, Frictoin and delight.
Is this at the core of how you intend to oneshot? or will you use ur product os skill to get those tight then one shot? based on their codebase

---

## 6. Response to Your Pushback — You're Right

No. The one-shot strategy as written was "we know the visual language, so just build." That's a UI-first approach. You're pointing at the actual hard problem: **the UX layer — flows, states, friction, navigation, Sophia's role, delight — is what makes or breaks each surface, and I was planning to wing it.**

That's the mistake. A beautiful EdgePath screen that has confusing navigation, unclear next actions, or a dead-end state is worse than an ugly one that flows well. The visual language IS locked. The interaction design for each surface IS NOT.

### Revised approach: UX spec → then build

For each surface, before writing a line of code:

**1. State the job.** What is the user trying to accomplish on this surface? One sentence. (Product OS: "One job per screen?")

**2. Map the states.** What does this surface look like when:
- Empty (first visit, no data)
- Active (mid-use, data present)
- Dense (power user, lots of data)
- Error/failure
- Loading

**3. Define navigation in/out.** How does the user GET here? How do they LEAVE? What does the top nav show? What does Sophia's bar say on this surface?

**4. Identify friction points.** Where will the user hesitate? Where will they not know what to do next? Where is the cognitive load highest?

**5. Place Sophia.** What does Sophia do on this surface specifically? Not generically "she helps" — what is her specific insight, suggestion, or action here?

**6. Define the delight moment.** What's the one thing on this surface that makes the user feel the product is smart, personal, or satisfying?

**7. Reference check.** Which reference patterns (Quarn, SpaceX, Sergushkin, Flora, Linear) apply to this surface's UX problems? Not visual — behavioral.

This takes 10-15 minutes of thinking per surface. Then the build is informed by real UX decisions, not just visual pattern-matching.

### What this changes about timing

Adds ~2 hours total across 8 surfaces for UX spec work. The builds should be FASTER though, because I'm not making UX decisions mid-code (which is where the real time waste happens — building something, realizing the flow doesn't work, rebuilding).

Net: roughly the same 20 hours, but the output quality is dramatically higher.

### The honest risk I was ignoring

I write code blind. I can't preview. Every UX decision I defer to "I'll figure it out while building" is a decision I'll probably get wrong and not catch. The UX spec forces me to think through what the user sees, does, and feels BEFORE I commit to code. That's not overhead — that's the only way this works.

### On Sophia's UX specifically

You flagged "we still need to design Sophia's UX." You're right — the bottom bar is a starting point, not a design. Before building the Sophia Full Panel (Surface 8), we need to define:
- What can Sophia do vs. what she can't (scope)
- How she communicates uncertainty vs. confidence
- The interaction pattern: chat? command? hybrid?
- How inline actions work (she suggests → user confirms → she executes)
- How she references past context without overwhelming
- The transition between bottom bar → full panel → back

This is one of the surfaces that might actually need 2 hypotheses, not one-shot. It's the product's defining interaction.

### On the color system

Noted — current palette is provisional until branding is complete. I'll keep using the established hex codes but won't bake them deeply into component logic. When branding finalizes, the swap should be token-level, not a rewrite.

### Revised next step

Before building EdgePath, I'll write the UX spec for it using the 7-point framework above. You review. Then I build. Want me to start with the EdgePath UX spec?