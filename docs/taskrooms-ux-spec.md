# Surface 10: Task Rooms — UX Spec

Deep-think spec. Using the 7-point framework + extended sections for the novel interaction patterns.

---

## 1. The Job

**"I know WHAT to do. Now show me HOW and give me everything I need to do it — right here."**

Every other surface tells the user what to work on. Task Rooms are where they actually DO it. EdgePath says "Complete the Interaction Design module." Task Rooms provide: the module, the exercises, Sophia coaching you through it, your mentor's notes, the jobs that require this skill, and your progress — all assembled in one place so you never context-switch.

The metaphor is literal: you ENTER a room to work. You're not glancing at a card or checking a box — you're sitting down and doing the thing. When you leave, your progress is saved. When you come back, you're exactly where you left off.

**Why this surface is novel:** No career platform does this. LinkedIn Learning gives you courses. Indeed gives you job listings. None of them assemble YOUR specific resources, YOUR mentor's feedback, YOUR target jobs, and YOUR AI coach into a single workspace scoped to a single goal. The room IS the differentiator.

---

## 2. What IS a Task Room?

### The Definition

A Task Room is a **full-page dedicated workspace** scoped to a single EdgePath milestone or user-created goal. It assembles every relevant resource, action, context, and coaching element into one surface so the user can do focused work without leaving.

### Why Full Page (Not a Panel or Modal)

Your inline note said "it should feel like a room you enter." This rules out:
- **Modal:** Modals are interruptions. You don't "enter" a modal — you get stopped by one. A Task Room is a destination, not an interruption.
- **Side panel:** Panels are reference tools. You glance at a panel while doing something else. A Task Room IS the thing you're doing.
- **Expanded row:** The current milestone expansion in EdgePath is the embryo — but it's constrained to a list row. It can't hold a course player, a document editor, a coaching conversation, and resource cards simultaneously.

**Full page is the answer** because:
1. The room IS the user's workspace for this task. It deserves full attention.
2. It can hold rich content (video players, document previews, embedded tools) that can't fit in a panel.
3. It creates a clear psychological boundary: "I'm in work mode now." Entry and exit are transitions, not toggles.
4. Linear's issue detail, Notion's page view, and Figma's file view all confirm: when the user is DOING the work, the work gets the full screen.

### But The Shell Stays

Full page doesn't mean full-screen-no-chrome. The top nav remains. The sidebar rail remains (collapsed). Sophia's bottom bar remains. The user always knows where they are in the product and can navigate away. The room FILLS the content area — it doesn't replace the app.

```
┌──────────────────────────────────────────────────────────────┐
│  Top Nav (EdgePath pill active, breadcrumb: EdgePath > Room)  │
├────┬─────────────────────────────────────────────────────────┤
│Rail│  Task Room: "Complete Interaction Design Module"         │
│    │                                                          │
│    │  ┌──────────────────────┐  ┌─────────────────────────┐  │
│    │  │                      │  │                         │  │
│    │  │   Primary Content    │  │   Context Panel         │  │
│    │  │   (course, editor,   │  │   (Sophia coaching,     │  │
│    │  │    exercise, etc.)   │  │    resources, related   │  │
│    │  │                      │  │    surfaces, mentor     │  │
│    │  │                      │  │    notes)               │  │
│    │  │                      │  │                         │  │
│    │  └──────────────────────┘  └─────────────────────────┘  │
│    │                                                          │
│    │  ┌──────────────────────────────────────────────────┐   │
│    │  │  Sub-task Progress Bar                            │   │
│    │  └──────────────────────────────────────────────────┘   │
├────┴─────────────────────────────────────────────────────────┤
│  Sophia Bottom Bar (coaching mode)                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. The States

### Empty (task has no resources assembled yet)

Rare but possible — user creates a custom milestone without resources.

- Sophia fills the gap: "This task doesn't have pre-assembled resources yet. Tell me more about what you're trying to do and I'll gather what you need."
- Manual assembly: user can add resources themselves (link, file, note)
- Sophia suggests: "Based on this milestone's title, here are 3 resources I found..." with accept/dismiss per suggestion

### Fresh (first entry into a room)

- The room loads with everything pre-assembled by Sophia (resources, sub-tasks, context cards)
- Sophia's coaching intro appears in the context panel: "This module has 3 parts. Most people finish it in about 4 hours across 2-3 sessions. Want to start with Part 1?"
- Sub-task list is fully unchecked
- Progress bar at 0%

### In Progress (mid-work, the daily state)

- Some sub-tasks checked, some not
- Progress bar shows current completion
- "Where I left off" indicator: the last sub-task the user was working on is highlighted with a cyan border
- Sophia's context panel shows progress-aware coaching: "You're halfway through. The exercises in Part 2 are where most people slow down — want me to walk you through the first one?"
- Resources the user has opened are marked (subtle checkmark or "Viewed" badge)

### Complete (all sub-tasks done)

- All checkboxes filled (lime)
- Progress bar at 100%
- Sophia celebrates briefly: "Interaction Design — done. This puts you at 75% through Phase 2. Your resume should mention this now — want me to add it?"
- Action chips: "Mark milestone complete" (updates EdgePath), "Update resume" (navigates to ResumeEdge), "See matching jobs" (navigates to EdgeMatch with this skill filtered)
- The room stays accessible for reference but is visually "completed" — muted tones, completed badge

### Stale (started but abandoned for 2+ weeks)

- Sophia's catch-up bar at top: "You started this 18 days ago and finished Part 1. Want to pick up where you left off?"
- "Where I left off" indicator is prominent
- Resources may have been updated: "The IDF course added a new section since you last visited."

### Loading

- Room layout skeleton loads immediately (two-column structure visible)
- Resources load progressively (titles first, then previews)
- Sophia's coaching message loads last (intentional — the content matters more than the commentary)

---

## 4. Room Layout — The Two-Column Workspace

### Left Column: Primary Content (60-65% width)

This is where the WORK happens. The content type adapts based on the milestone's nature:

**For learning milestones ("Complete Interaction Design module"):**
- Embedded course player / content viewer at top (video, reading, interactive exercise)
- Below: exercise workspace (if the course has hands-on components)
- Below: notes area (user can take notes that persist in this room)

**For creation milestones ("Build case study #2"):**
- Document/artifact workspace (simplified editor for the deliverable)
- Template or starting framework provided by Sophia
- File upload for external work (e.g., Figma file link, PDF upload)

**For action milestones ("Get portfolio feedback from mentor"):**
- Communication workspace — message thread with the mentor, scoped to this task
- File sharing area (share the portfolio draft)
- Scheduling widget (book a review session — connects to Session/Booking)

**For assessment milestones ("Take the design systems quiz"):**
- Quiz/assessment interface
- Progress through questions
- Results summary on completion

**The key insight:** The left column is not one fixed layout. It's a content-adaptive workspace. Sophia determines what type of primary content this milestone needs and assembles the right workspace components. The SHELL is consistent (header, progress bar, sub-tasks). The CONTENT adapts.

### Right Column: Context Panel (35-40% width)

This is the intelligence layer — everything the user needs to understand WHY they're doing this and HOW it connects.

**Always present:**

1. **Sub-task Checklist** — at the top of the context panel. The breakdown of the milestone into actionable steps:
   - ☑ Watch module 1-3 (1.5h)
   - ☑ Complete exercise set A (45min)
   - ○ Build mini-project (2h) ← "Up next" indicator
   - ○ Submit for review (30min)
   Each sub-task has: checkbox, label, estimated time. Checking a sub-task updates the progress bar. Simple, satisfying.

2. **Sophia Coaching Card** — the coaching conversation scoped to this task. Not the global Sophia — a task-specific thread:
   - Sophia's initial guidance: "This module covers 4 principles. Focus on consistency and feedback — they come up in 80% of design system interviews."
   - User can ask questions: "What's the difference between a design token and a variable?"
   - Sophia responds with task-aware context. She knows what module the user is on, what sub-task they're working on, what their EdgePath target is.
   - This coaching thread persists across sessions. When the user returns, the conversation is still there.

3. **Resource Assembly** — everything gathered for this task:
   - Course links (with "Open" button that loads in the primary content area)
   - Books/articles (with preview cards — title, author, why it's relevant)
   - Tools needed (Figma, VSCode, etc. — with download/access links)
   - Related documents from the user's own work (their resume, their portfolio)
   - Each resource has a small relevance note from Sophia: "Chapter 3 is the most relevant to your Phase 2 goals"

4. **Cross-Surface Connections** — how this task connects to the rest of their journey:
   - **ResumeEdge:** "Your resume should mention this skill after completion. I'll draft the bullet."
   - **EdgeMatch:** "3 saved jobs list this as required. Completing this moves their match from 78% → 88%."
   - **EdgeGuide:** "Alice left a note: 'Focus on the accessibility section — your target companies audit for WCAG.'"
   - Each connection is a clickable glass card with surface icon, note, and action.

**Conditionally present:**

5. **Mentor/Coach Notes** — if an EdgeGuide has left feedback for this specific task
6. **Peer Activity** — if EdgeBuddies are working on the same milestone: "Jordan completed this yesterday. Want to compare notes?"
7. **Time Tracker** — if the user has started a focused work session (EdgeProd Pomodoro integration)

### The Context Panel is Collapsible

For users who want full-screen focus on the primary content, the context panel collapses to a thin rail (icons only: sub-tasks, Sophia, resources, connections). Click an icon to expand that section as an overlay. This is the Cursor/VS Code pattern — sidebar collapses but sections are always one click away.

---

## 5. Navigation In/Out

### How Users ENTER a Task Room

**From EdgePath (primary entry):**
- **List View:** Click a milestone row → brief expansion (embryo). Within the expansion, "Open Task Room" button → full-page transition. OR: double-click a milestone to go directly to the room.
- **Map View:** Click a milestone node → room opens. The mind map's spatial click naturally leads to a deep dive.
- **Sophia suggestion:** "Ready to start the Interaction Design module?" → chip click opens the room directly.

**From Dashboard:**
- "Continue where you left off" card → opens the most recent in-progress room.
- EdgePath Roadmap Todos widget → milestone click → same as EdgePath list view.

**From Sophia (any surface):**
- "Open my Interaction Design room" / "What was I working on?" → opens the relevant room.

**From the Room Tray:**
- See Section 8 below.

### The Entry Transition

This matters. "Entering a room" should FEEL like entering a room.

The transition from EdgePath to Task Room:
1. The clicked milestone card/row grows (scale animation, 400ms, spring easing)
2. The rest of the EdgePath content fades to black (200ms)
3. The milestone card morphs into the Task Room header (shared element transition)
4. The room layout fades in below the header (300ms, staggered — left column first, context panel second)
5. Total transition: ~600ms

This is the Figma file-open pattern: the file card in the dashboard grows into the canvas. The user sees continuity between the item they clicked and the space they entered.

### How Users EXIT a Task Room

**Back navigation (primary):**
- Breadcrumb in top nav: "EdgePath > Interaction Design Module" — click "EdgePath" to return
- Browser back button works (history state is pushed on entry)
- Keyboard: Escape key exits to EdgePath (with confirmation if there's unsaved work)

**Transition out:**
1. Room content fades (200ms)
2. The header morphs back into the milestone row/card (reverse of entry)
3. EdgePath fades back in with the milestone now showing updated progress
4. Total: ~500ms

**State is always saved.** There is no "save" button. Sub-task progress, notes, Sophia conversation, time spent — all persist automatically. The user can leave and return at any time without losing anything. Auto-save indicator in the header: small "Saved" text with a checkmark, updates on every change.

**Cross-navigation:** Clicking any nav item (Dashboard, ResumeEdge, EdgeMatch) exits the room and navigates normally. State is saved automatically.

---

## 6. Sophia's Coaching Mode — This Surface Changes Everything

On every other surface, Sophia is an **advisor**. She observes and recommends. "You should optimize your resume." "This job matches your skills." She's reactive.

In Task Rooms, Sophia becomes a **coach**. She's IN the work WITH the user. She sees what they're doing in real-time and actively guides them.

### What Coaching Mode Looks Like

**Proactive prompts (Sophia initiates):**
- "You've been on this exercise for 15 minutes. Want a hint?"
- "Most people struggle with the spacing section. Here's the key principle: [specific guidance]."
- "You're moving fast through the theory. The quiz at the end focuses heavily on token naming conventions — make sure you understand Section 3."
- "You've completed 3 sub-tasks in one session. Nice pace. Want to keep going or take a break? The Pomodoro timer says you've been at it for 52 minutes."

**Reactive coaching (user asks):**
- User: "I don't understand the difference between design tokens and CSS variables"
- Sophia: "Think of it this way: CSS variables are the implementation. Design tokens are the decision. You decide 'primary-blue is #2563EB' (that's the token). The CSS variable is how that decision gets applied in code. For your case study, tokens matter because [Company X] uses a token-based system."

**Progress-aware encouragement (Sophia warmth mapping):**
- At 25%: Direct. "Part 1 done. Part 2 is the core — this is where the real learning happens."
- At 50%: Warm. "Halfway. The concepts from Part 2 are already showing up in your case study draft — you're connecting the dots."
- At 75%: Direct. "One section left. This should take about 45 minutes."
- At 100%: Warm. "Done. This skill puts you ahead of 70% of applicants for your target roles. Let me update your resume."

### Coaching Mode vs. Normal Sophia

| Aspect | Normal Sophia (other surfaces) | Coaching Sophia (Task Rooms) |
|---|---|---|
| **Initiation** | Mostly reactive — user asks | Proactive — Sophia prompts at key moments |
| **Context depth** | Surface-level ("you're on EdgePath Phase 2") | Deep ("you're on exercise 3 of Part 2, you've been stuck for 8 minutes, your answer to exercise 2 was strong") |
| **Tone** | Advisor. Informative. | Coach. Encouraging + challenging. |
| **Persistence** | Conversation resets between sessions | Conversation persists. "Last time you asked about token naming — here's a follow-up." |
| **Response type** | Structured blocks (content cards, lists, chips) | More conversational. Still uses content blocks for resources, but coaching is prose. |
| **Escalation** | Float → Panel based on complexity | Always in the context panel. No float. The coaching thread IS the panel. |

### Sophia Coaching for EdgeGuide

When a coach/mentor is present in the room (via EdgeGuide integration), Sophia adapts:

- **To the client (EdgeStar):** "Alice has reviewed your case study draft. She left 3 annotations. Want to see them?"
- **To the coach (EdgeGuide):** "Jordan has completed Parts 1-3 but is stuck on the final exercise. Their common pattern is rushing through theory — they might need a conceptual discussion before attempting it again."

Sophia assists BOTH parties. She gives the coach insight into the client's learning patterns, and gives the client the coach's feedback contextualized within their progress.

---

## 7. Friction Points

1. **"This is overwhelming."** The room assembles 5+ types of content (course, sub-tasks, resources, connections, coaching). First-time users need progressive disclosure. Default state: sub-tasks and primary content visible. Resources, connections, and coaching expand on demand. After the first room, the user has the mental model and can have everything visible.

2. **"I don't know where to start."** Sophia's coaching intro solves this: "Start with [first sub-task]. It takes about 30 minutes." One clear action, not a wall of options.

3. **"When am I done?"** The progress bar + sub-task completion make this unambiguous. Every checked sub-task moves the bar. At 100%, Sophia confirms completion and offers next steps. No ambiguity about "is this enough?"

4. **"I need to come back to this."** Auto-save + "Where I left off" indicator. The user NEVER has to worry about losing progress. And the Room Tray (Section 8) makes returning to any room instant.

5. **"The course is external."** Many resources will be external links (Coursera, YouTube, books). The room can't embed everything. For external resources: "Open in new tab" with a note "When you're done, come back and check this off." The room is the ORCHESTRATOR, not the player for everything. But where possible (videos, articles, PDFs), inline rendering in the primary content area.

---

## 8. The Room Tray — Persistent Access to Open Rooms

### The Problem

Users will have multiple rooms in various states: one in progress, one completed last week, one they haven't started. They need a way to see and access their rooms without navigating through EdgePath every time.

### Validating Against Top 1% Products

| Product | Pattern | What it does |
|---|---|---|
| **Chrome/Arc** | Tab bar | Persistent horizontal strip. Shows all open contexts. Click to switch. Visual indicator for active tab. |
| **VS Code** | Open Editors in sidebar + tab bar | Tabs at top for open files. Sidebar shows the full list. Both access points to the same thing. |
| **Linear** | "My Issues" filtered view + sidebar | Not tabs — a filtered list in the sidebar showing assigned items. Click to navigate. |
| **Notion** | Sidebar page tree + Recent Pages | Pages in the sidebar. "Recent" section for quick access. Breadcrumb for current location. |
| **Figma** | Recents on home + tab bar in editor | Tab bar for open files within the editor. Recents grid on the home screen. |

**The pattern that fits CareerEdge:** A combination of Notion's "Recent Pages" and Chrome's tab concept, adapted for our sidebar rail.

### The Room Tray Design

**Where it lives:** In the sidebar rail, below the main nav icons. A dedicated "Rooms" icon (DoorOpen or LayoutGrid) that expands to show the user's active rooms.

**Collapsed state (rail):** The Rooms icon shows a badge count of in-progress rooms (e.g., a "3" indicator).

**Expanded state (hover or click):**
A flyout panel (280px) showing:

```
┌─────────────────────────────┐
│  My Rooms                    │
│                              │
│  IN PROGRESS                 │
│  ┌─────────────────────────┐ │
│  │ ● Interaction Design    │ │
│  │   Phase 2 · 60% done    │ │
│  │   Last: 2 hours ago     │ │
│  └─────────────────────────┘ │
│  ┌─────────────────────────┐ │
│  │ ● Build Case Study #2   │ │
│  │   Phase 2 · 25% done    │ │
│  │   Last: 3 days ago      │ │
│  └─────────────────────────┘ │
│                              │
│  RECENTLY COMPLETED          │
│  ┌─────────────────────────┐ │
│  │ ✓ Figma Fundamentals    │ │
│  │   Phase 1 · Complete    │ │
│  │   Completed 5 days ago  │ │
│  └─────────────────────────┘ │
│                              │
│  View all rooms →            │
└─────────────────────────────┘
```

Each room card shows:
- Status indicator (● in-progress = cyan, ✓ complete = lime)
- Room name (milestone title)
- Phase association
- Progress percentage
- Last visited (relative time)
- Click → navigates directly to the room (entry transition)

**"View all rooms"** navigates to EdgePath with the "Rooms" filter active — showing all milestones that have been opened as rooms, grouped by status.

### How Many Rooms Can Be "Open"?

All of them. There's no limit to rooms in progress. But the tray shows a maximum of 5 (3 in-progress, 2 recently completed) to keep it scannable. "View all rooms" for the full list.

This is NOT a tab bar that must stay in memory. Each room is a route, not a persistent state. Entering a room loads its saved state. The tray is a navigation shortcut, not a process manager.

---

## 9. The Delight Moment

**The first room entry.**

The user clicks a milestone on EdgePath. The card grows, the page transforms, and suddenly they're in a workspace that has EVERYTHING assembled for them: the course, the exercises, Sophia's coaching, their mentor's notes, the jobs that need this skill. They didn't search for any of this. They didn't open 5 tabs. It was all there, waiting.

Sophia's first coaching message: "This module has 3 parts. Most people finish in about 4 hours. The exercises in Part 2 are what hiring managers actually test for — so don't rush those."

That's the moment: "This platform actually helps me DO the work, not just tells me what to do."

**Secondary delight:** Completing a room and watching it ripple through the system. The milestone checks off in EdgePath. The progress bar moves. Sophia offers to update the resume. The match percentage on 3 saved jobs goes up. One action in one room improves everything — the system is connected, and the user SEES the connections.

---

## 10. Reference Check — Behavioral, Not Visual

| Reference | What applies here | How |
|---|---|---|
| **Notion page** | Full-page workspace scoped to one thing. Blocks of mixed content types. Sidebar for navigation. | Task Room IS a Notion page — but purpose-built for career tasks instead of freeform. The block model (content + resources + coaching) is similar, but curated instead of blank. |
| **Linear issue detail** | Focused view for one work item. Context sidebar with metadata, comments, connections. | Task Room's two-column layout mirrors Linear's issue → detail + context. But we add AI coaching and resource assembly that Linear doesn't have. |
| **Cursor** | AI coaching within a workspace. The AI sees what you're doing and offers contextual help. | Sophia in coaching mode IS Cursor's copilot — but for career tasks instead of code. Same principle: AI is embedded in the work, not adjacent to it. |
| **Figma file-open transition** | Card in dashboard → grows into full canvas. Shared element animation. Clear entry/exit. | Our milestone → room transition follows this exact pattern. The continuity between the card and the workspace builds spatial awareness. |
| **Quarn node cards (Reference Batch 1)** | Minimal identity cards for resources. Icon + title + status. | Resource cards in the context panel follow this pattern. A course link is a node card: icon, title, status ("Viewed" / "Not started"), one action ("Open"). |

**What none of these references have:** Cross-surface assembly. Notion doesn't know your resume. Linear doesn't know your job matches. Cursor doesn't know your career goals. Task Rooms assemble intelligence FROM the entire product INTO the workspace. That's the novel contribution.

---

## 11. Multi-Role Considerations

| Role | How they interact with Task Rooms | Surface adaptation |
|---|---|---|
| **EdgeStar** | Primary user. Enters rooms from EdgePath milestones. Does the work. Full feature set. | Full surface as described. |
| **EdgePreneur** | Rooms for business milestones: "Validate market size", "Draft pitch deck section 2", "Build financial model." | Same room structure, but primary content area shows business-specific tools (canvas templates, financial calculators, pitch deck editor). Sophia coaches in business context. |
| **EdgeGuide** | Enters a client's room to review progress, leave annotations, coach directly. | **Coach view:** Same room layout, but the coach sees the client's sub-task progress + a coach annotation layer. Coach can leave notes on specific sub-tasks, record voice feedback, and Sophia assists with coaching insights ("Jordan tends to rush through theory sections — suggest a deeper discussion on this topic"). |
| **EdgeParent** | Views child's room progress. Read-only. | **Observer view:** Simplified room showing: milestone title, sub-task progress (read-only), time spent, Sophia's summary of the child's progress. No editing, no coaching — just visibility. "Jamie completed 3 of 5 sub-tasks and has spent 2.5 hours on this module." |
| **EdgeEducation** | Tracks room completion rates across students. Aggregate. | Not individual rooms — this feeds EdgeSight: "78% of students have completed the Portfolio Development room. Average completion time: 6.2 hours." |
| **EdgeEmployer** | Not directly relevant. | N/A. |

---

## 12. Component Extraction Potential

New components this surface produces:

1. **Room Layout Shell** — Full-page two-column workspace with collapsible context panel. Reusable for any focused work surface (Interview Simulator workspace, EdgePreneur business planning workspace).
2. **Sub-task Checklist** — Compact checklist with time estimates, progress tracking, and "up next" indicator. Reusable in EdgeProd task lists, Sprint planning.
3. **Coaching Thread** — Persistent, context-aware Sophia conversation scoped to a specific task. Reusable in Interview Simulator (coaching during practice), ResumeEdge (section-specific coaching).
4. **Resource Assembly Grid** — Collection of resource cards (courses, books, tools, files) with relevance notes and status badges. Reusable in Dashboard widgets, EdgePath resource sections.
5. **Cross-Surface Connection Cards** — Cards showing how the current task connects to other surfaces. Reusable in any surface that has cross-references.
6. **Room Tray (Sidebar Flyout)** — Persistent access panel for in-progress items. Reusable as a generic "recent items" or "in-progress items" pattern.
7. **Shared Element Page Transition** — Card-to-full-page morphing animation. Reusable for any list → detail → full-page pattern.
8. **Progress Bar with Sub-task Binding** — Progress bar that automatically updates based on checklist completion. Reusable in EdgePath phases, onboarding steps.

---

## 13. Data Model Sketch

This isn't the backend spec, but the surface needs to know what data it displays:

```typescript
interface TaskRoom {
  id: string;
  milestoneId: string;                    // link to EdgePath milestone
  userId: string;
  title: string;                          // from milestone label
  phase: string;                          // from EdgePath phase
  status: "not_started" | "in_progress" | "complete";
  progress: number;                       // 0-100, calculated from sub-tasks
  lastVisited: Date;
  totalTimeSpent: number;                 // in minutes
  
  subTasks: SubTask[];
  resources: Resource[];
  crossSurfaceLinks: CrossSurfaceLink[];
  coachingThread: CoachingMessage[];
  mentorAnnotations: Annotation[];
  userNotes: string;                      // freeform notes taken in the room
  
  primaryContentType: "learning" | "creation" | "action" | "assessment";
  primaryContentConfig: object;           // type-specific config
}

interface SubTask {
  id: string;
  label: string;
  done: boolean;
  estimatedMinutes: number;
  completedAt?: Date;
}

interface Resource {
  id: string;
  type: "course" | "book" | "article" | "tool" | "file" | "video";
  title: string;
  url: string;
  relevanceNote: string;                  // Sophia's note on why this resource matters
  status: "not_started" | "viewed" | "completed";
}

interface CrossSurfaceLink {
  surface: "resume" | "edgematch" | "edgeguide" | "edgepath" | "analytics";
  icon: string;
  note: string;                           // "3 jobs require this skill"
  action: string;                         // navigation target
  actionLabel: string;                    // "View matching jobs"
}

interface CoachingMessage {
  id: string;
  role: "sophia" | "user" | "coach";
  content: string;
  timestamp: Date;
  context?: {                             // what the user was doing when this was sent
    subTaskId?: string;
    resourceId?: string;
    timeInRoom?: number;
  };
}
```

---

## 14. Voice Mode in Task Rooms

Same universal pattern (ResumeEdge spec Section 11). Task-room-specific scenarios:

**During learning:**
- "Sophia, explain design tokens in simpler terms" → coaching response
- "What's the most important concept in this section?" → Sophia highlights the key takeaway
- "I'm stuck on exercise 3" → Sophia provides a hint based on common stumbling points

**During creation:**
- "I want to describe my case study — can you help me structure it?" → Sophia listens, generates an outline
- "Add a section about the user research I did" → Sophia drafts the section from spoken description (same pattern as ResumeEdge build-from-scratch)

**For coaches:**
- "Leave a note on sub-task 3" → voice-to-text annotation
- "How long has Jordan spent on this room?" → Sophia provides the data

---

## 15. Open Questions for Your Review

1. **Room creation — automatic or manual?** When a user clicks a milestone in EdgePath, does the room always exist (pre-assembled by Sophia) or does the user explicitly "Create Room" for milestones they want deep workspaces for? My position: auto-create on first click. The room should already be there, assembled. Making users create rooms adds friction and most won't bother. auto and a user can have multiple rooms

2. **Custom rooms (not tied to EdgePath).** Can users create rooms for goals outside their roadmap? E.g., "Prep for coffee chat with Lisa" — not an EdgePath milestone but a legitimate focused workspace. My position: yes, a "Create Room" action exists, but it's secondary. The primary entry is always through EdgePath milestones.

3. **Room sharing.** Can an EdgeStar share a room with their EdgeBuddy for collaborative work? E.g., both working on the same module, seeing each other's progress, discussing in the coaching thread? This is powerful but complex. My position: P2 feature, document the intent but don't spec the interaction yet. yes document intent

4. **Embedded vs. linked content.** For courses on external platforms (Coursera, Udemy), should the room try to embed the content (iframe) or just link to it? Embedding is a better UX but comes with technical constraints (CORS, authentication, responsive rendering). My position: link with smart tracking. "Open course (opens in new tab)" and when the user returns, Sophia asks "Did you finish Part 2?" to manually advance progress. Embedding is a future enhancement.- yes this works
