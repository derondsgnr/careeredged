# EdgePath System Reference

> Comprehensive handoff document covering the full e2e user journey, every affordance, all states, interaction model, milestone behavior, view modes, navigation, Sophia integration, error/feedback/confirmation patterns, role variants, and implementation status.

> Consolidates: `surface-3-edgepath-ux-spec.md`, `edgepath-action-triage.md`, `edgepath-mindmap-feedback-response.md`, `edgepath-open-items-response.md`, `edgepath-paths-mindmap-taskroom-response.md`, `mindmap-open-bugs.md`

---

## 1. The Job

**"Understand where I am in my career journey and know exactly what to do next."**

Not "view my roadmap." The roadmap is a means. The job is orientation + next action. The user should leave this surface knowing: where they stand, what's working, what's behind, and what to do today.

---

## 2. Surface Architecture

### Three Layers

| Layer | Mode | Job | Frequency |
|---|---|---|---|
| **List View** | Default, full-width milestones | "What do I do next?" Check things off. | Daily. 90% of visits. |
| **Map View** | Mind map / spatial canvas | "What does my whole journey look like?" Explore, plan, choose paths. | Weekly. Planning/reflecting. |
| **Task Room** | Expanded milestone detail panel | "How do I actually complete THIS milestone?" Deep work, resources assembled. | Per task. When doing the work. |

List and Map are toggled via a `[List] [Map]` toggle in the header. Task Room is entered by clicking a milestone from either view.

### What the Surface Contains

```
┌─────────────────────────────────────────────────────────────┐
│  Top Nav (global, EdgePath pill active)                      │
├─────────────────────────────────────────────────────────────┤
│  Roadmap Header                                              │
│  [Title: "Revenue Ops Manager → Product Designer"]           │
│  [Archetype: Innovator-Strategist · Assessment: Complete]    │
│  [Roadmap selector ▾]  [★ Primary]  [List|Map toggle]  [⋯] │
├─────────────────────────────────────────────────────────────┤
│  Phase Strip (horizontal navigation)                         │
│  ● Phase 1 ─── ● Phase 2 ─── ○ Phase 3 ─── 🔒 Phase 4     │
│  [Complete]     [5/8, 63%]    [0/7]         [Locked]         │
├─────────────────────────────────────────────────────────────┤
│  Sophia Commentary Strip                                     │
│  ✦ "Phase 2 is your skill-building phase. You're 63%         │
│     through — on track for April 28."                        │
├─────────────────────────────────────────────────────────────┤
│  Content Area (List View or Map View)                        │
│                                                              │
│  LIST: Grouped milestones (Skills / Actions / Resources)     │
│  MAP: Spatial canvas with phase nodes + milestone branches   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Sophia Bottom Bar (global, context-aware to EdgePath)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. All States

### 3.1 Empty (Day 0 -- no roadmap exists)

The surface IS the creation flow. Not a blank page with a button.

| Element | Behavior |
|---|---|
| Background | Dot-grid pattern (Quarn reference). Empty workspace feel. |
| Center content | Sophia's mark, centered. "Let's map your path." |
| Inputs | Two fields: Current role, Target role. Nothing else. |
| Submit | "Generate Roadmap" CTA. |
| After submit | Roadmap materializes on this same surface (loading state, then active). |
| Assessment | Optional refinement after initial roadmap: "Want to make this more precise? Take the 7-minute assessment." Shown as a Sophia suggestion, not a gate. |
| No sidebar, no widgets | One job: create your roadmap. |

**What Sophia already knows (from onboarding):** Role selection, career stage, experience level, urgency, uploaded resume, profile answers. The "2 inputs" are simple for the USER but intelligent for Sophia -- she combines 10+ data points.

### 3.2 Loading (roadmap generating)

| Element | Behavior |
|---|---|
| Phase strip | Skeleton loads immediately (structure visible before content). |
| Phase fill-in | Sequential -- Phase 1 appears, then 2, then 3, then 4. Communicates intelligence working. |
| Sophia commentary | "Building your roadmap based on [target role]... analyzing 400+ skill pathways..." Specific, not generic "Loading..." |
| Duration | 2-5 seconds for AI generation. |

### 3.3 Active (has 1+ roadmaps, mid-journey)

Primary state. Daily driver. User visits 3-5x per week.

**At a glance the user sees:**
1. Which phase am I in? (spatial position in phase strip)
2. What's my progress in this phase? (% and milestone count)
3. What should I do today? (next unchecked milestone, not a list of everything)
4. Has anything changed? (Sophia's living updates since last visit)

**Progressive disclosure:**
- Only the CURRENT phase is expanded. Other phases are collapsed to summary: "Phase 1: Complete", "Phase 3: 0/7", "Phase 4: Locked"
- Within current phase: next 3 milestones prominent, rest under "Show all milestones"
- User always sees a manageable bite, not the full mountain

### 3.4 Dense (multiple roadmaps, power user)

| Element | Behavior |
|---|---|
| Roadmap selector | Dropdown above the phase strip. Default shows the primary (starred) roadmap. |
| Star toggle | Visible in the dropdown. One roadmap can be starred as Primary. |
| Primary roadmap | Used for EdgeMatch matching and school data sharing. |
| Example state | Primary: "UX Designer → Product Design Lead", Secondary: "Data Science pivot", Archived: "Previous path" |
| Surface behavior | Same surface, different data. Not a separate page. |

### 3.5 Stale (haven't visited in 3+ weeks)

| Element | Behavior |
|---|---|
| Sophia catch-up bar | "It's been 23 days. Your Phase 1 deadline is in 5 days. 3 things changed." |
| Tone | Not guilt. A catch-up summary. |
| CTA | "See what changed" or "Jump to current milestone" |

### 3.6 Error (generation failure)

| Element | Behavior |
|---|---|
| Sophia acknowledgment | "I couldn't generate a full roadmap for [unusual role]. Here's what I have -- want to refine?" |
| Partial results | Show whatever was generated. Never show nothing. |
| Recovery | Offer to try different inputs, contact support, or show related career paths. |

### 3.7 Phase Complete (celebration moment)

| Element | Behavior |
|---|---|
| Phase node | Transitions from "In Progress" to "Complete" -- node fills with lime, brief radial pulse. |
| Connection line | Line to next phase illuminates. |
| Sophia | Celebrates briefly (2 seconds), then pivots to what's next: "Phase 2 complete. Phase 3 focuses on job search strategy. Your resume is ready -- let's start applying. I've found 8 matching positions." |
| Duration | Celebration is 2 seconds, not 10. Earned, not manufactured. |

### 3.8 Ahead of Schedule

| Element | Behavior |
|---|---|
| Sophia notification | "You're 2 weeks ahead. At this pace, you'll complete Phase 3 by April 12 -- a month earlier than planned." |
| Tone | Positive reinforcement through data, not confetti. |

---

## 4. Phase Strip -- Interaction Model

The phase strip is the horizontal journey visualization at the top. It's the primary sub-navigation within EdgePath.

### Phase Node States

| State | Visual | Node Content | Progress Bar | Click Behavior |
|---|---|---|---|---|
| **Complete** | Lime bg, lime border, lime glow | Check icon (lime) | Full, lime gradient | Expands to show completed milestones (read-only recap) |
| **Active** | Cyan border, subtle glow | Pulsing cyan dot (2s animation loop) | Partial fill, cyan gradient | Expands to show active milestones (interactive) |
| **Upcoming** | Gray border | Phase number (gray) | Empty | Expands to show upcoming milestones (preview, not interactive) |
| **Locked** | Dark border | Lock icon or phase number (muted) | Empty | Click bounces with lock feedback. Sophia tooltip: "Phase 4 unlocks when you complete 2 more milestones in Phase 3." |

### Phase Node Information

Each node shows:
- Phase title (e.g., "Skill Bridge")
- Week range (e.g., "Weeks 4-8")
- Status badge: "Complete" (lime) or milestone count "5/8" (cyan) or nothing
- Progress bar below

### Connector Lines

Lines between phase nodes:
- Complete-to-next: lime gradient fading to gray
- Active-to-next: gray
- Upcoming/locked: faint gray

### Click Behavior

Clicking a phase node:
1. Sets it as the active view phase
2. Content area below updates to show that phase's milestones
3. Sophia commentary strip updates with phase-specific context
4. Locked phases reject click with subtle bounce animation + tooltip

---

## 5. Milestone Interaction Model

### Milestone Data Shape

```typescript
interface Milestone {
  id: string;
  label: string;
  category: "skill" | "action" | "resource";
  status: "done" | "current" | "upcoming" | "locked";
  time: string;                                          // estimated time (e.g., "8h")
  sophiaNote?: string;                                   // Sophia's contextual insight
  sophiaCoaching?: string;                               // deeper coaching (Task Room)
  resources?: { label: string; type: string }[];         // courses, books, articles, tools
  actions?: string[];                                    // action chips ("Start course", "Add to sprint")
  crossSurface?: { surface: string; note: string; icon: string; action: string }[];
  subTasks?: { id: string; label: string; done: boolean }[];
}
```

### Categories (grouped display)

| Category | Icon | Accent Color | Examples |
|---|---|---|---|
| **Skills to Build** | GraduationCap | Cyan `#22D3EE` | "Complete Figma fundamentals", "Learn design system principles" |
| **Actions to Take** | Target | Lime `#B3FF3B` | "Build first case study", "Get portfolio feedback from mentor" |
| **Resources to Complete** | BookOpen | Gray `#9CA3AF` | "Submit portfolio for ATS optimization" |

### Milestone Row -- Visual States

| State | Checkbox | Label | Time | Expand | Click Behavior |
|---|---|---|---|---|---|
| **Done** | Lime fill, check icon, spring animation on check | Strikethrough, `#6B7280` | Visible, muted | No expand chevron | No interaction (read-only) |
| **Current** | Cyan border, empty | Primary `#E8E8ED`, + cyan "Up next" indicator | Visible | Expanded by default | Click row to collapse/expand. Click checkbox to mark done. |
| **Upcoming** | Gray border, empty | Secondary `#9CA3AF` | Visible | Collapsed by default | Click row to expand (preview only). Checkbox not interactive. |
| **Locked** | Muted border | Muted `#6B7280` | Hidden | No | Click bounces. Tooltip: "Complete [prerequisite] first." |

### Checking a Milestone -- Feedback Sequence

This is critical. A hollow checkbox with no feedback kills trust.

1. **Checkbox animates:** Lime fill + check icon appears via spring animation (`stiffness: 500, damping: 20`)
2. **Label updates:** Text gets strikethrough + color fades to `#6B7280`
3. **Phase progress bar updates:** Immediately recalculates and re-animates fill width
4. **Phase strip node updates:** Milestone count updates (e.g., "5/8" → "6/8")
5. **Sophia commentary strip updates:** "Phase 2 now 75% complete. Next: [milestone name]."
6. **If last milestone in phase → Phase Completion moment** (Section 3.7)

### Expanded Milestone Content (Task Room Embryo)

When a milestone is expanded, the row grows to show:

| Section | Content | Visual Treatment |
|---|---|---|
| **Sophia's Note** | Contextual insight (e.g., "6 of 8 target companies list this as required") | Cyan-tinted glass card with SophiaMark icon |
| **Resources** | Course links, book references, article links | List with BookOpen icon, type badge ("course", "book"), ExternalLink arrow |
| **Sub-tasks** | Breakable steps within the milestone | Checkable sub-task list (mini checklist) |
| **Cross-surface connections** | Links to other surfaces (ResumeEdge, EdgeMatch, EdgeGuide) | Linked items with surface icon, note, and ArrowRight. Clickable -- navigates to that surface. |
| **Action chips** | "Start course", "Add to EdgeProd sprint", "Ask Sophia for help" | Chip buttons. Primary chip (cyan bg), secondary chips (glass bg). |

### Cross-Surface Connections (implemented)

| Surface | Icon | Example Note | Click Behavior |
|---|---|---|---|
| ResumeEdge | FileText | "Resume needs update after this skill" | Navigate to ResumeEdge |
| EdgeMatch | Briefcase | "3 jobs require this skill" | Navigate to EdgeMatch with pre-filtered results |
| EdgeGuide | Users | "Alice left feedback on your approach" | Navigate to Messages with Alice's thread |

---

## 6. View Mode Toggle

### Toggle UI

```
[List] [Map]
```

Located in the roadmap header, right side. Two pills, one active.

### Behavior

| Action | Result |
|---|---|
| Click "Map" from List | Content area transitions to mind map canvas. Phase strip stays. Data is the same. |
| Click "List" from Map | Content area transitions back to grouped milestones. Scroll position resets to current phase. |
| State persistence | Selected view mode persists across visits (localStorage or user preference). |
| Data consistency | Both views show the same data. Checking a milestone in List shows as checked in Map, and vice versa. |

### Transition Animation

- List → Map: Milestones compress and reposition as spatial nodes (300ms, EASE curve)
- Map → List: Nodes expand into rows (300ms, EASE curve)
- Phase strip stays fixed during transition

---

## 7. Mind Map View -- Full Affordance Map

### Canvas Behavior

| Interaction | Behavior |
|---|---|
| **Drag** | Pan the canvas. Cursor changes to grab/grabbing. |
| **Scroll wheel** | Zoom in/out. Minimum 0.4x, maximum 1.5x. |
| **Zoom buttons** | +/- buttons in bottom-right corner. Reset button returns to 1x. |
| **Click phase node** | Expands to show milestones below as branching pills. Click again to collapse. |
| **Click milestone pill** | Opens Task Room panel (side panel, 420px wide, slides in from right). |
| **Click locked phase** | Bounce animation + lock icon pulse. No expansion. |
| **Escape key** | Closes any open panel (Task Room, Path Compare). |
| **Background click** | Closes any open panel. |

### Phase Node (Mind Map)

| Element | Visual |
|---|---|
| Circle | 72px, color-coded by status (complete=lime, active=cyan, upcoming=gray, locked=muted) |
| Label block | Below circle: phase title, week range, progress bar, milestone count |
| Path badge | If phase has multiple paths: "3 paths" badge with GitBranch icon. Clickable → opens Path Compare panel. |
| Expand indicator | ChevronDown when collapsed, ChevronDown rotated when expanded |
| Sophia annotation | Small ✦ mark on nodes where Sophia has an insight. Hover to see note inline. |

### Milestone Pill (Mind Map)

| Element | Visual |
|---|---|
| Shape | Rounded pill, ~200px wide |
| Status indicator | Left icon: CheckCircle2 (done, lime), Circle with pulsing dot (current, cyan), Circle (upcoming, gray), Lock (locked) |
| Label | Milestone title text |
| Time badge | Muted time estimate on right |
| Category color | Left border accent matches category (cyan/lime/gray) |
| Click | Opens Task Room panel for this milestone |
| Hover | Subtle brightness increase + pointer cursor |

### SVG Connection Lines

- Phase-to-phase: Horizontal lines on the phase rail
- Phase-to-milestone: Vertical/diagonal branches from phase node down to milestone pills
- Path forks: Diverging branches from a phase node when multiple paths exist. Active path branch is brighter. Non-chosen paths are subdued (0.2 opacity).

### First-Time Onboarding

When entering Map View for the first time:
- Sophia tooltip appears: "This is your journey as a map. Click a phase to see milestones. Click a milestone to open it. Drag to pan."
- Auto-dismissed after 5 seconds or on any interaction
- Not shown on subsequent visits (localStorage flag)

---

## 8. Task Room Panel

Slides in from the right (420px wide) when a milestone is clicked in Map View. This is the deep-work surface.

### Panel Structure

```
┌──────────────────────────────────┐
│  [X] Close                        │
│  ┌──────────────────────────────┐ │
│  │ Phase 2 · Skill Bridge        │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │
│  │                                │ │
│  │ ■ Complete interaction design  │ │
│  │   module                       │ ���
│  │   ⏱ 8h estimated              │ │
│  │                                │ │
│  │ [▶ Continue where you left off]│ │  ← Primary CTA
│  │                                │ │
│  │ ── Sub-tasks ──────────────── │ │
│  │ ☑ Watch modules 1-3           │ │
│  │ ☑ Complete exercises           │ │
│  │ ○ Build mini-project           │ │
│  │ ○ Final assessment             │ │
│  │   Module 2 of 4               │ │
│  │                                │ │
│  │ ── Sophia ────────────────── │ │
│  │ ✦ "6 of 8 target companies   │ │
│  │    list this as required.      │ │
│  │    Here's what I'd do: start  │ │
│  │    with Chapter 3 of the IDF  │ │
│  │    course."                    │ │
│  │                                │ │
│  │ ── Resources ─────────────── │ │
│  │ 📖 IDF Course         [→]     │ │
│  │ 📖 Microinteractions  [→]     │ │
│  │                                │ │
│  │ ── Connected ─────────────── │ │
│  │ 📄 Resume: needs update [→]   │ │
│  │ 💼 3 jobs match       [→]     │ │
│  │ 👥 Alice left feedback [→]    │ │
│  │                                │ │
│  │ ── Actions ───────────────── │ │
│  │ [Ask Sophia] [Share w/ mentor] │ │
│  │ [Add to today's sprint]       │ │
│  └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### Panel Affordances

| Element | Behavior |
|---|---|
| **Close button (X)** | Closes panel, returns to map/list view |
| **Primary CTA** | "Continue where you left off" / "Start this milestone" / "Mark complete". Changes based on milestone state. |
| **Sub-task checkboxes** | Interactive. Checking updates the progress indicator ("Module 2 of 4"). Checking all → enables "Mark complete" CTA. |
| **Progress indicator** | "Module X of Y" counter below sub-tasks. Updates in real-time on check. |
| **Sophia coaching** | Not just a note -- it's guidance: "Here's what I'd do first" + concrete next step. |
| **Resource links** | Clickable. ExternalLink icon. Opens resource (course, article, etc.) |
| **Cross-surface links** | Clickable. Navigate to ResumeEdge, EdgeMatch, Messages. These are the roadmap's tentacles into the rest of the product. |
| **Action chips** | "Ask Sophia for help" → opens Sophia Float. "Share with mentor" → opens Messages. "Add to today's sprint" → adds to EdgeProd. |
| **Escape key** | Closes panel |
| **Background click** | Closes panel |

### Panel States by Milestone Status

| Milestone Status | Primary CTA | Sub-tasks | Resources | Sophia |
|---|---|---|---|---|
| **Done** | "Completed ✓" (disabled, green) | All checked (read-only) | Still visible | Recap note: "You completed this in 6h. Great pace." |
| **Current** | "Continue where you left off" | Interactive checkboxes | Active links | Coaching: "Here's what I'd do first..." |
| **Upcoming** | "Start this milestone" | Preview (not interactive) | Preview | Preview: "When you get here, focus on..." |
| **Locked** | "Locked -- complete [prerequisite] first" | Hidden | Hidden | "This unlocks after [X]. Focus on [current] for now." |

---

## 9. Path Comparison

### When Paths Appear

Not every phase has paths. Sophia only presents alternatives when there's a genuine, material fork. Constraints:
- Most phases: 1 path (no fork UI shown)
- Fork phases: Maximum 2 paths. A/B, never A/B/C. (Data model supports 3 for edge cases, but UI limits to 2 recommended.)
- Sophia always has a recommendation. The default is pre-selected.

### Path Compare Panel

Triggered by clicking the "3 paths" badge on a phase node in Map View, or Sophia's suggestion in List View: "I see two paths for this phase. Want to compare?"

| Element | Content |
|---|---|
| Panel type | Side panel or overlay (not full-screen) |
| Per-path card | Path name, match %, milestone preview, estimated duration, Sophia's reasoning |
| Recommendation | Sophia's recommended path highlighted with brighter border + "Recommended" badge |
| Non-recommended paths | Visible but subdued. Not hidden. |
| CTA per path | "Choose this path" button |
| Sophia reasoning | "I'd recommend the Accelerated path -- it matches your timeline and budget. Want to compare?" |

### Choosing a Path

1. User clicks "Choose this path"
2. Confirmation animation (brief pulse, path highlights)
3. Non-chosen paths collapse/fade
4. Milestones update to show the chosen path's milestones
5. Sophia commentary updates: "Great choice. [Path name] aligns with your timeline."

### Clicking a Non-Recommended Path

Sophia responds contextually: "That's a valid choice, but here's why I'd go the other way..." Not blocking, just contextualizing. The user can still choose it.

---

## 10. Roadmap Header -- All Affordances

### Visible Elements

| Element | Behavior |
|---|---|
| **Roadmap title** | "[Current Role] → [Target Role]" (e.g., "Revenue Ops Manager → Product Designer") |
| **Archetype line** | "Archetype: Innovator-Strategist · Assessment: Complete" OR "Refine with assessment →" (clickable, starts assessment flow) |
| **Roadmap selector** | Dropdown to switch between multiple roadmaps. Shows roadmap name + star indicator. |
| **Star toggle** | In the roadmap selector dropdown. Sets the primary roadmap. Only one can be primary. |
| **View toggle** | `[List] [Map]` pill toggle. |
| **Overflow menu (⋯)** | See below. |

### Overflow Menu Actions

| Action | Behavior | Frequency |
|---|---|---|
| **Export** | Export roadmap as PDF, share link | Occasional |
| **Share Your Insight** | Post journey update to network/SocialEdge | Occasional. Sophia may prompt after phase completion. |
| **Regenerate** | Regenerate roadmap with updated inputs. **Destructive -- requires confirmation dialog.** | Rare |
| **Settings** | Roadmap-specific settings (notifications, visibility) | Rare |

### What was REMOVED from the header

The original design had 6 top-bar actions + 12 tabs = 18 elements. After the action triage:

| Removed Element | Where It Went |
|---|---|
| Set Primary | Star icon in roadmap selector dropdown |
| EdgeGas counter | Global top nav (visible everywhere, not per-surface) |
| Live toggle | Removed entirely (always live is the default) |
| 12 tabs (Pathways, Timeline, Quick Wins, Skills, Milestones, Jobs, Activity, Analytics, Insights, Compare, Budget, Support) | See below |

### Tab Triage Results

| Former Tab | New Home |
|---|---|
| **Pathways** | IS the default view. Not a tab -- the page itself. |
| **Milestones** | Visible within each phase. Content, not a filter. |
| **Timeline** | Phase strip IS the timeline. |
| **Quick Wins** | Sophia surfaces contextually: "3 quick wins available." |
| **Jobs** | Sophia right column: "4 jobs match your Phase 2 skills." Links to EdgeMatch. |
| **Insights** | Sophia IS insights. Woven through everything. |
| **Compare** | Sophia-triggered when genuine fork exists. |
| **Support** | "Ask Sophia" is the support mechanism. |
| **Skills** | Embedded in milestones. Sophia provides skill gap view on request. |
| **Analytics** | Lives on EdgeBoard surface. |
| **Activity** | Lives on Dashboard's activity widget. |
| **Budget** | EdgeParent feature only. Not on EdgeStar's EdgePath. |

**Result:** 0 tabs. 15 fewer decisions. Zero information lost.

---

## 11. Sophia on EdgePath -- 5 Modes

### Mode A: Phase Commentary Strip (persistent)

| Location | Below phase strip, always visible |
|---|---|
| Content | One-line insight about the current phase |
| Updates | Based on state: on track / behind / phase complete / returning after absence |
| Examples | "Phase 2 is your skill-building phase. You're 63% through -- on track for April 28." / "Your Phase 1 deadline was 3 days ago. Want to adjust the timeline?" / "Nice. 4 more in this phase. The next one is [X]." |

### Mode B: Ambient Annotations (Map View)

| Location | Small ✦ marks attached to milestone nodes |
|---|---|
| Trigger | Hover the mark |
| Content | Inline note: "6 of 8 target companies need this" / "I'd prioritize this over motion design" |
| Behavior | Not interruptive. Passive intelligence woven into the graph. |

### Mode C: Contextual Coaching (Task Room Panel)

| Location | Inside expanded milestone / Task Room panel |
|---|---|
| Content | Mini-coaching: "Here's what I'd do first" → concrete step. "This connects to your resume" → cross-surface link. "Want me to break this down?" → generates sub-tasks. |
| Behavior | Actionable, not just informational. |

### Mode D: Proactive Guidance (Bottom Bar)

| Context | Bar Message |
|---|---|
| Viewing full map | "You're 62% through Phase 2. The interaction design module is your highest-impact next step." |
| Viewing a path fork | "I'd recommend the Accelerated path -- it matches your timeline and budget. Want to compare?" |
| Viewing a locked phase | "Phase 3 unlocks when you complete 2 more milestones in Phase 2." |
| Idle 10+ seconds | "Need help deciding? I can walk you through this phase." |
| Day 0 | "Let's build your roadmap -- it takes 2 minutes to start." |
| Active, on track | "Phase 2 is 65% complete. 2 milestones this week." |
| Active, behind | "Your Phase 1 deadline was 3 days ago. Want to adjust the timeline?" |
| After milestone check | "Nice. 4 more in this phase. The next one is [X]." |

### Mode E: Map-Level Intelligence (Overview Card)

| Location | Floating card in corner of Map View |
|---|---|
| Content | Journey-level insights: "You're on track to reach Phase 3 by Week 9" / "Your pace is 15% faster than similar career changers" / "Suggested focus this week: Interaction design + Case study prep" |
| Behavior | The "Living Roadmap" concept. Sophia observing the whole journey. |

### What Sophia Does NOT Do on EdgePath

- Does not talk unprompted (no auto-popups)
- Does not block navigation (no "you should do this first" gates)
- Does not create anxiety ("you're falling behind" -- never)
- Her presence is warmth, not pressure. Senior mentor, not project manager.

---

## 12. Navigation

### How Users GET to EdgePath

| Source | Mechanism | Landing State |
|---|---|---|
| Top nav | Click "EdgePath" pill | Last visited phase, or current phase |
| Dashboard roadmap strip | Click a phase pill | Deep link to that specific phase |
| Dashboard milestone row | Click a specific milestone | Deep link to that milestone (expanded) |
| Sophia | "Open my roadmap" / "Show Phase 2" / "What's my next milestone?" | Relevant phase or milestone |
| Other surfaces | EdgeMatch: "This job matches your Phase 2 target role" | Phase 2, with job context |
| Other surfaces | ResumeEdge: "Your resume is optimized for Phase 3 skills" | Phase 3, with resume context |

### How Users LEAVE EdgePath

| Exit | Mechanism |
|---|---|
| Top nav | Click any other nav item (Home, Resume, Jobs, Messages) |
| Cross-surface links | Milestone's connected surfaces: "Update resume → opens ResumeEdge" / "See matching jobs → opens EdgeMatch with pre-filtered results" |
| Sophia bar | Suggestions may lead elsewhere based on context |
| Overflow menu | Export, share (leaves page context temporarily) |

### What the Top Nav Shows

- EdgePath pill is highlighted (active)
- No sub-navigation needed in the top nav -- the phase strip IS the sub-navigation

---

## 13. Layout Hypotheses (Built)

Two layout hypotheses were built for List View. Both share the same phase strip, commentary strip, data model, and milestone interaction model.

### Option A: Two-Column with Persistent Sophia Panel

```
┌────────────────────────┬──────────────────┐
│  Phase Detail           │  Sophia Panel    │
│  (grouped milestones)   │  (intelligence)  │
│                         │                  │
│  Skills to Build        │  ✦ Sophia Card   │
│  ☑ Figma fundamentals   │  "Interaction    │
│  ☑ Design systems       │   design is your │
│  ○ Interaction design   │   priority..."   │
│                         │                  │
│  Actions to Take        │  💼 Job Matches  │
│  ☑ Build case study     │  4 jobs match    │
│  ○ Case study #2        │  your Phase 2    │
│                         │                  │
│  Resources              │  📊 Quick Wins   │
│  ○ ATS optimization     │  3 available     │
└────────────────────────┴──────────────────┘
```

- **Left:** Milestones grouped by category (Skills, Actions, Resources)
- **Right:** Sophia intelligence panel (insight card, job matches, quick wins, skill gaps)
- **Pro:** Sophia always visible, roadmap feels alive
- **Con:** Milestones feel narrower, similar layout to dashboard

### Option B: Inline Sophia Cards (Full-Width Feed)

```
┌──────────────────────────────────────────┐
│  Skills to Build                          │
│  ☑ Figma fundamentals                    │
│  ☑ Design systems                        │
│  ○ Interaction design                    │
│                                          │
│  ┌─ ✦ Sophia ──────────────────────────┐ │
│  │ "Interaction design is your         │ │
│  │  priority. 6/8 target companies..." │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  Actions to Take                          │
│  ☑ Build case study                      │
│  ○ Case study #2                         │
│                                          │
│  ┌─ 💼 3 jobs match Phase 2 skills ────┐ │
│  │ Figma · 92% | Linear · 87% | ...   │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  Resources                                │
│  ○ ATS optimization                      │
└──────────────────────────────────────────┘
```

- **Full-width:** Milestones get more room
- **Sophia cards inline:** Interspersed between milestone groups, like a feed
- **Pro:** More focused, intelligence hits harder when inline
- **Con:** Sophia cards can be scrolled past

**Recommendation:** Option B. Sophia's intelligence is more powerful woven INTO the content than sitting beside it. The dashboard already uses two-column -- EdgePath should feel different.

---

## 14. Feedback & Confirmation Patterns

### Milestone Check

| Step | Visual | Timing |
|---|---|---|
| 1. Checkbox fill | Lime bg + Check icon (spring) | Immediate |
| 2. Label strikethrough | Color fades + line-through | 100ms |
| 3. Progress bar update | Width re-animates | 200ms |
| 4. Count update | "5/8" → "6/8" in phase strip | 200ms |
| 5. Sophia strip update | New contextual message | 300ms |

### Sub-task Check (Task Room)

| Step | Visual | Timing |
|---|---|---|
| 1. Checkbox fill | Lime indicator | Immediate |
| 2. Counter update | "Module 2 of 4" → "Module 3 of 4" | 100ms |
| 3. If all checked | Primary CTA changes to "Mark complete" | 200ms |

### Phase Completion

| Step | Visual | Timing |
|---|---|---|
| 1. Final milestone check | Standard check animation | Immediate |
| 2. Phase node fill | Lime fill + radial pulse | 300ms |
| 3. Connection line illuminate | Line to next phase glows | 400ms |
| 4. Sophia celebration | Brief congratulation text | 500ms |
| 5. Sophia pivot | "Phase 3 focuses on..." | 2000ms |
| 6. Next phase unlocks | If locked, transitions to upcoming | 2000ms |

### Path Selection Confirmation

| Step | Visual | Timing |
|---|---|---|
| 1. "Choose this path" click | Button pulses | Immediate |
| 2. Selected path highlights | Brighter border/glow | 200ms |
| 3. Non-selected paths fade | Opacity to 0.2, then collapse | 300ms |
| 4. Milestones update | New path's milestones appear | 400ms |
| 5. Sophia confirmation | "Great choice. Aligns with your timeline." | 500ms |

### Locked Element Interaction

| Element | Feedback |
|---|---|
| Locked phase node | Subtle bounce (translateY: -2px → 0), lock icon pulses once |
| Locked milestone | Same bounce + Sophia tooltip: "Complete [X] first" |
| No frustration | Never blocks without explanation. Always tells you WHY and WHAT would unlock it. |

### Stale Return

| Step | Visual |
|---|---|
| 1. Sophia catch-up bar appears | Top of content, below phase strip. Different bg (amber tint). |
| 2. Content | "It's been [X] days. [Y] things changed. [Z] deadline approaching." |
| 3. CTA | "See what changed" → scrolls to changes. "Jump to current" → scrolls to current milestone. |
| 4. Dismissible | X button or auto-dismisses after viewing changes. |

---

## 15. Error & Edge Case Handling

| Scenario | Behavior |
|---|---|
| **Roadmap generation fails** | Sophia: "I couldn't generate a full roadmap for [role]. Here's what I have." Show partial results. "Want to refine?" CTA. |
| **Unusual/niche role** | Sophia generates broader roadmap, flags: "This is a niche transition. The assessment would help me map a sharper plan." |
| **Network error during check** | Optimistic UI: checkbox fills immediately. If save fails, checkbox reverts with subtle shake + toast: "Couldn't save. Try again." |
| **Empty phase (no milestones)** | Sophia: "This phase is being generated. Check back shortly." Skeleton milestones. |
| **All milestones done but phase not complete** | Edge case: shouldn't happen. If it does, auto-complete the phase with celebration. |
| **User tries to check upcoming milestone** | Checkbox is non-interactive. Subtle opacity treatment indicates it's not yet actionable. |
| **Multiple roadmaps, no primary set** | Prompt on first visit: "Star one roadmap as your Primary. This drives your job matching and school data sharing." |
| **Assessment flow abandoned mid-way** | Save progress. Next visit: "You're 8 of 15 questions in. Want to finish?" |
| **Roadmap regeneration** | Confirmation dialog: "This will replace your current roadmap. Your progress will be saved separately. Continue?" |
| **Mind map canvas overflow** | Auto-fit on load. User can pan/zoom to navigate. Reset button returns to default view. |

---

## 16. Role Variants

| Role | What Changes | What Stays |
|---|---|---|
| **EdgeStar** | Full access: create, edit, check, assess, compare pathways, navigate cross-surface | Layout, Sophia, phase strip, all affordances |
| **EdgePreneur** | "Business Roadmap" variant: phases are business stages (Idea, MVP, Launch, Scale). Milestones are business actions. Same surface, different data model. | Layout, Sophia, phase strip |
| **EdgeParent** | Read-only. Can see child's roadmap but NOT check milestones. Sophia's commentary shifts: "Alex completed 3 milestones this week." Phase strip shows child's name. | Layout, phase strip |
| **EdgeGuide** | Can view + annotate client roadmaps. "Leave feedback" action on milestones. Sophia: "3 of your clients are in Phase 2. Sarah is behind -- consider reaching out." | Layout, Sophia, phase strip |
| **EdgeEducation** | Can assign study plans. View student group roadmaps. Aggregate completion stats. | Layout, phase strip |

### EdgePreneur Business Phases

| Phase | EdgeStar Equivalent |
|---|---|
| Idea Validation | Discover & Position |
| MVP Development | Skill Bridge |
| Launch & Growth | Build & Ship |
| Scale & Optimize | Interview & Close (repurposed) |

### EdgeParent Read-Only Mode

- Milestones display without interactive checkboxes
- No overflow menu actions (Export, Regenerate)
- Sophia shifts to parent voice: "They completed the Figma course this week. Next: design systems."
- Budget Tracker link visible (EdgeParent-only feature)
- Connected child's name visible in header

---

## 17. Mobile Adaptation

| Element | Desktop | Mobile |
|---|---|---|
| Phase strip | Horizontal, all phases visible | Horizontal scroll, 2 phases visible at a time |
| View toggle | List/Map in header | List only (Map is desktop-only or significantly simplified) |
| Milestones | Full-width rows | Full-width, slightly tighter padding |
| Task Room panel | Right panel, 420px | Full-screen bottom sheet |
| Mind map | Full canvas with pan/zoom | Simplified vertical list with branching indicators (no full canvas) |
| Sophia commentary | Below phase strip | Below phase strip (same) |
| Overflow menu | Top-right ⋯ | Top-right ⋯ (same) |

---

## 18. Motion & Timing

| Transition | Duration | Easing |
|---|---|---|
| Phase strip entry | 500ms | `[0.32, 0.72, 0, 1]` |
| Phase progress bar fill | 800ms (staggered per phase) | `[0.32, 0.72, 0, 1]` |
| Sophia commentary appear | 400ms (500ms delay) | `[0.32, 0.72, 0, 1]` |
| Milestone row entry | 300ms (staggered 50ms per item) | `[0.32, 0.72, 0, 1]` |
| Milestone expand/collapse | 200ms | default |
| Checkbox check | Spring (`stiffness: 500, damping: 20`) | spring |
| Phase completion pulse | 300ms radial | ease-out |
| Task Room panel slide-in | 350ms | `[0.32, 0.72, 0, 1]` |
| Task Room panel slide-out | 250ms | `[0.32, 0.72, 0, 1]` |
| Path Compare panel | 350ms | `[0.32, 0.72, 0, 1]` |
| View mode transition (List↔Map) | 300ms | `[0.32, 0.72, 0, 1]` |
| Active phase node pulse | 2s infinite | ease-in-out |
| Locked element bounce | 200ms | spring |

---

## 19. Data Model Summary

### Roadmap

```typescript
interface Roadmap {
  id: string;
  title: string;                    // current role
  target: string;                   // target role
  archetype?: string;               // from assessment (optional)
  assessmentComplete: boolean;
  isPrimary: boolean;               // star toggle
  phases: Phase[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Phase

```typescript
interface Phase {
  id: number;
  title: string;                    // "Discover & Position", "Skill Bridge", etc.
  weeks: string;                    // "Weeks 1-3"
  status: "complete" | "active" | "upcoming" | "locked";
  progress: number;                 // 0-1
  milestonesDone: number;
  milestonesTotal: number;
  milestones: Milestone[];
  paths?: PathOption[];             // only if fork exists
  activePath?: string;              // selected path ID
}
```

### PathOption

```typescript
interface PathOption {
  id: string;
  label: string;                    // "Accelerated", "Portfolio-First", etc.
  matchPercent: number;
  duration: string;
  sophiaReasoning: string;
  isRecommended: boolean;
  milestones: Milestone[];
}
```

### Milestone

```typescript
interface Milestone {
  id: string;
  label: string;
  category: "skill" | "action" | "resource";
  status: "done" | "current" | "upcoming" | "locked";
  time: string;
  sophiaNote?: string;
  sophiaCoaching?: string;
  resources?: { label: string; type: string; url?: string }[];
  actions?: string[];
  crossSurface?: { surface: string; note: string; icon: string; action: string }[];
  subTasks?: SubTask[];
}
```

### SubTask

```typescript
interface SubTask {
  id: string;
  label: string;
  done: boolean;
}
```

---

## 20. Implementation Status

### Built & Working

| Component | File | Status |
|---|---|---|
| Option A (Two-Column) | `/src/app/components/edgepath-option-a.tsx` | Built. Full list view with Sophia right panel. |
| Option B (Inline Feed) | `/src/app/components/edgepath-option-b.tsx` | Built. Full-width milestones with inline Sophia cards. |
| Mind Map View | `/src/app/components/edgepath-mindmap.tsx` | Built. Canvas with phase nodes, milestone pills, Task Room panel, path compare. |
| View Toggle (List/Map) | Embedded in Options A and B | Built. Toggle switches between list and mind map. |
| Phase Strip | In Options A, B, and Mind Map | Built. Horizontal navigation with status indicators. |
| Sophia Commentary Strip | In Options A and B | Built. Context-aware one-liner. |
| Milestone Interaction | In Options A, B | Built. Check animation, expand/collapse, Sophia note, resources, cross-surface links, action chips. |
| Task Room Panel | In Mind Map | Built. Side panel with CTA, sub-tasks, coaching, resources, cross-surface, actions. |

### Known Bugs (from `mindmap-open-bugs.md`)

| Bug | Description | Root Cause Hypothesis |
|---|---|---|
| **Skill Bridge milestone overlap** | Milestone pills overlap with phase label block when expanded | CSS positioning conflict: phase label's absolute positioning vs. milestone nodes' absolute positioning within transformed canvas div. Constants were adjusted but didn't fix. May need to restructure milestones as children of phase node div. |
| **"3 Paths" button not opening** | Clicking path compare badge doesn't open PathComparePanel | `fixed` positioning breaks inside CSS `transform` ancestors. The button is inside the transformed canvas div. Click event coordinates and bubbling through the transform layer may be the issue. Consider moving trigger outside canvas transform. |

### Not Yet Built

| Feature | Priority | Notes |
|---|---|---|
| ~~Empty state (Day 0)~~ | ~~P0~~ | ~~Built: Sophia-guided creation flow with 2 inputs, dot-grid bg, Sophia mark, focused input states~~ |
| ~~Loading state~~ | ~~P0~~ | ~~Built: Sequential phase fill-in animation, cycling loading messages, progress indicator~~ |
| ~~Stale return catch-up bar~~ | ~~P1~~ | ~~Built: Amber-tinted bar with days-since count, "See what changed" CTA, dismissible~~ |
| ~~Phase completion celebration~~ | ~~P1~~ | ~~Built: Full-screen modal with trophy, radial pulse, stats, Sophia pivot message, "Continue to next" CTA~~ |
| ~~Multiple roadmaps selector~~ | ~~P1~~ | ~~Built: Dropdown with 3 roadmaps, star toggle, "Create new roadmap" action~~ |
| ~~"Ahead of schedule" notification~~ | ~~P1~~ | ~~Built: Lime/cyan banner with Rocket icon and data-driven message~~ |
| ~~Sophia Float wiring~~ | ~~P1~~ | ~~Built: "Ask Sophia" opens SophiaAsk component with context, insight card CTA wired, bottom bar chips wired~~ |
| ~~Overflow menu~~ | ~~P1~~ | ~~Built: Export, Share, Regenerate, Archive actions~~ |
| Assessment refinement flow | P2 | Optional 15-question assessment after initial roadmap |
| Pathway Compare in List View | P2 | Sophia-triggered comparison (currently Map-only) |
| Roadmap regeneration | P2 | Confirmation dialog + new generation |
| Mobile adaptation | P2 | Phase strip scroll, bottom sheet Task Room, simplified map |
| Real data integration | P3 | Supabase backend replacing mock data |

### Demo Controls

A "DEMO STATES" row at the bottom of the active view lets you trigger:
- **Empty (Day 0):** Full creation flow with inputs
- **Loading:** Sequential phase generation animation
- **Show Stale Bar:** Amber catch-up bar
- **Phase Celebration:** Full celebration modal with stats and Sophia pivot

---

## 21. File Locations

| File | Purpose |
|---|---|
| `/src/app/components/edgepath-option-a.tsx` | List View - Two-Column layout with Sophia right panel |
| `/src/app/components/edgepath-option-b.tsx` | List View - Inline Feed layout with interspersed Sophia cards |
| `/src/app/components/edgepath-mindmap.tsx` | Map View - Full spatial canvas with phase nodes, milestones, Task Room, path compare |
| `/docs/surface-3-edgepath-ux-spec.md` | Original UX spec (7-point framework) |
| `/docs/edgepath-action-triage.md` | Tab/action triage decisions |
| `/docs/edgepath-mindmap-feedback-response.md` | Mind map fixes, view toggle, Sophia behavior on map |
| `/docs/edgepath-open-items-response.md` | Layout decision, budget, archetype, assessment |
| `/docs/edgepath-paths-mindmap-taskroom-response.md` | Multiple paths, mind map architecture, Task Room concept |
| `/docs/mindmap-open-bugs.md` | Open bugs for mind map (milestone overlap, path compare button) |

---

## 22. Relationship to Sophia System

EdgePath is one of Sophia's heaviest surfaces. The Sophia System Reference (`sophia-system-reference.md`) documents 4 roadmap scenarios and 6 strategy scenarios that directly interact with EdgePath:

| Sophia Scenario | EdgePath Connection |
|---|---|
| `roadmap-progress` | Shows Phase 1 progress timeline. "Open EdgePath" navigate chip. |
| `roadmap-why-order` | Explains milestone ordering. "Start LinkedIn optimization" action. |
| `roadmap-next` | Shows next milestone checklist. "Start now" action. |
| `roadmap-adjust` | Shows current schedule. "Push everything back 1 day" action. |
| `strategy-today` | Pulls from EdgePath milestones for daily priorities. |
| `strategy-week` | Maps week against EdgePath deadlines. |
| `strategy-progress` | Reports EdgePath completion metrics. |

Navigate chips from Sophia that target EdgePath: "Open EdgePath", "Show me resources", "Find courses", "Show example submissions" -- all close Sophia and switch the top nav to `roadmap`.