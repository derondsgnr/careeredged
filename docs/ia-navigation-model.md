# Information Architecture & Navigation Model

## Before the IA: Things I need to push back on

### 1. Sophia as navigation — my honest position

You want to detach from traditional navigation and explore Sophia as the primary interaction layer. I understand why — the product has 8 roles and 20+ features, and a sidebar with 15 items is the problem, not the solution. But I'm going to argue that replacing structure with conversation is the wrong frame for this problem.

Here's why, through the product OS lens:

**Design Lead:** Spatial memory is how humans navigate repeated-use software. "My applications are the third item down" is a zero-cost retrieval. "Show me my applications" is a cognitive cost every single time. Linear's ⌘K didn't replace the sidebar — it made the sidebar unnecessary for *power users who already knew what they wanted*. New users still rely on the sidebar to learn the product's shape. CareerEdge has users who range from 17-year-old first-time career seekers to institutional admins managing 500 students. Conversational navigation helps the former and frustrates the latter.

**PM:** The navigation problem isn't "too many items." It's "every role sees the same items." An EdgeParent seeing ResumeEdge in their nav is noise. An EdgeEmployer seeing EdgeBuddy in their nav is confusion. The fix is **aggressive role-based filtering** — each role sees only their 4-7 relevant features. That's a manageable sidebar. Sophia doesn't need to replace navigation to solve this.

**What I'm actually proposing:** Three navigation tiers that coexist. Not one replacing the other.

1. **Spatial navigation (sidebar rail):** Collapsed icon sidebar like Flora/Linear. 4-7 items per role, max. Always there, always in the same place, builds muscle memory. Expands to labels on hover or toggle.

2. **Contextual navigation (Sophia bar):** Persistent bottom bar like the Sergushkin input reference. Sophia doesn't wait to be asked — she surfaces the next logical action based on context. "You have 3 unreviewed applications" or "Your resume hasn't been optimized for this week's saved jobs." This is the Claude conversation bar + the Manus home state.

3. **Command navigation (⌘K):** For users who know exactly what they want. "Go to EdgeMatch" / "Open my roadmap" / "Optimize resume." This is Linear's command palette. Fast, keyboard-first, no mouse needed.

The sidebar gives structure. Sophia gives intelligence. ⌘K gives speed. No single layer replaces the others. Each serves a different user state: exploring (sidebar), guided (Sophia), executing (⌘K).

**Where this differs from your instinct:** You want to remove the sidebar entirely and let Sophia be the front door. I think the sidebar should be minimal (rail, not full sidebar) but present — because the moment Sophia gives a wrong suggestion or the user doesn't know what to ask, they need a fallback that doesn't require typing. The sidebar is the safety net. Sophia is the trampoline.

If you disagree, I want to hear your reasoning — but this is my position based on the northstar products. None of them removed structured navigation. They all added intelligent layers on top.

### 2. The single-role limitation

The current system requires separate accounts per role. An EdgeParent who wants to build their own career needs a new email. This is a structural UX failure that no visual redesign fixes. 

**My recommendation:** Design the UI for eventual multi-role support (a role switcher in the sidebar/header), but don't build the backend. When the navigation shows a role badge and a subtle "switch role" affordance, the client sees the vision. The backend work becomes a future sprint. We're planting the seed architecturally without asking for schema changes now.

### 3. The "10 major surfaces" strategy — which 10?

You and Claude discussed 10 surfaces. Let me propose which 10 based on coverage, leverage, and component extraction potential.

---

## Feature-to-Role Mapping (Validated)

Source: PRD feature access matrix. I'm reorganizing by *user intent*, not product taxonomy.

### Shared across all/most roles:
- Sophia AI (all roles)
- Messages & Video (all roles)
- EdgeGroups (6 of 8 roles)
- SocialEdge Feed (7 of 8 roles)
- Profile / Settings (all roles)
- Notifications (all roles)
- EdgeGas display (all roles)

### EdgeStar (Career Seeker) — the densest role:
- ResumeEdge (optimize, build from scratch, cover letter)
- Interview Simulator (text + voice modes)
- EdgePath (roadmap, career discovery, assessment, pathway compare)
- EdgeMatch (job board, apply, save, track)
- EdgeBuddy (accountability partner matching)
- EdgeProd (7 productivity tools)
- EdgeWorkplace (document templates + workspaces)
- AIEdge (AI literacy — out of scope per client)
- ImmigrationEdge (international seekers only)
- Interactive Resume (shareable web resume)
- EdgeBoard (career analytics)
- Application EdgeInsight (application analytics)
- My Schools (institution connection)
- Networking Assistant
- Courses (browse + enroll)

### EdgePreneur (Entrepreneur):
- Business Idea Validator
- Business Roadmap Generator
- Pitch Deck Generator
- Milestone Tracking
- EdgeProd

### EdgeParent:
- QR/Link Connection
- Child Progress Monitoring
- Family Roadmap (live sync)
- Family Budget Tracker

### EdgeGuide (Coach/Mentor):
- Session Management
- Course Creation
- Study Plan Creation
- Professional EdgeGroups
- Public Booking / Availability
- Earnings Dashboard

### EdgeEmployer:
- Company Profile
- Job Posting (single + bulk CSV)
- Application Review Pipeline
- EdgeSight Analytics (6 tabs)
- EEO Settings
- Career Fair Participation

### EdgeEducation:
- Student Connection (codes)
- Student Groups
- Virtual Career Fairs
- Outcomes Tracking (NACE/CSEA)
- Alumni Mentor Management
- Employer Hub / Partnership CRM
- Office Hours
- Courses & Study Plans
- Analytics
- Resources

### EdgeNGO:
- Resource Publishing
- Community Feed
- Job Posting
- Event Management
- EdgeInsight Analytics

### EdgeAgency:
- Grant Distribution
- Workforce Development Programs
- Job Posting
- Event Management
- EdgeInsight Analytics

---

## The 10 Major Surfaces

These are selected for: (a) cross-role impact, (b) component extraction potential, (c) first-impression weight, and (d) daily-use frequency.

| # | Surface | Why it's in the 10 | Roles affected | Components extracted |
|---|---------|-------------------|----------------|---------------------|
| 1 | **Onboarding flow** | First impression. Every user. Sets the UX tone. | All 8 | Stepper, Sophia conversational UI, role selector, input patterns, transition animations |
| 2 | **App shell (sidebar + header + Sophia bar)** | The persistent chrome. Present on every page. | All 8 | Sidebar rail, header, Sophia input bar, EdgeGas indicator, role badge, ⌘K palette, notification system |
| 3 | **Dashboard (role-adaptive home)** | Most returned-to screen. Each role has one. | All 8 | KPI cards, progress cards, Sophia insight strip, quick action cards, activity feed, chart components |
| 4 | **EdgePath (career roadmap)** | The product's core differentiator. Stickiness driver. | EdgeStar, EdgePreneur (biz view), EdgeParent (read-only), EdgeGuide (assign) | Phase cards, milestone nodes, progress visualization, timeline, Sophia commentary |
| 5 | **ResumeEdge** | #1 used EdgeStar feature. AI showcase. | EdgeStar | File upload, engine selector, AI processing states, score display, diff/comparison view, document preview, export controls |
| 6 | **EdgeMatch (job board)** | High-frequency repeat use. Shared surface. | EdgeStar (browse/apply), EdgeEmployer (post), NGO/Agency (post) | Job cards, filter system, search, application tracker, detail panel, save/apply actions |
| 7 | **EdgeSight / EdgeBoard (analytics)** | Data-dense dashboards across roles. | EdgeStar (EdgeBoard), EdgeEmployer (EdgeSight), EdgeEducation (outcomes), NGO/Agency (EdgeInsight) | Chart components (area, bar, funnel, gauge), KPI cards, data tables, filter chips, date pickers |
| 8 | **Messaging + Video** | Daily communication layer. Relationship surface. | All 8 | Conversation list, message thread, video call UI, file sharing, read receipts |
| 9 | **Sophia full panel** | The AI experience. Defines product intelligence. | All 8 | Chat interface, task history, suggestion chips, action cards, status indicators, skill loading |
| 10 | **Session/Booking management** | Monetization surface for guides. Shared scheduling pattern. | EdgeGuide (host), EdgeStar (book), EdgeEducation (office hours) | Calendar view, time slot picker, booking card, session detail, availability editor |

### What's NOT in the 10 (and how it gets covered):
- **EdgeProd** (7 productivity tools) → Uses dashboard cards, task lists, and timer components already extracted from surfaces 3 and 7
- **SocialEdge** → Feed component from dashboard activity feed + standard post/comment patterns
- **Course marketplace** → Card grid from EdgeMatch + detail panel pattern
- **EdgePreneur tools** (validator, pitch deck) → Form patterns from onboarding + output artifact from ResumeEdge
- **EdgeParent monitoring** → Read-only version of EdgePath + dashboard KPI cards
- **EdgeEmployer pipeline** → Kanban from EdgeSight analytics patterns
- **Settings/Profile** → Standard form patterns, already covered
- **EdgeGroups** → Feed + member list, reuses messaging and social components

The 10 surfaces produce a component library that covers ~85% of remaining screens through composition.

---

## Shell Architecture

### The persistent chrome — what's always visible

```
┌──────────────────────────────────────────────────────────┐
│  [☰]  CareerEdge    [role: EdgeStar ▾]    🔍  🔔  [AV] │  ← Header
├──┬───────────────────────────────────────────────────────┤
│  │                                                       │
│🏠│                                                       │
│📋│                                                       │
│💼│              Main Content Area                        │
│📊│                                                       │
│💬│                                                       │
│  │                                                       │
│──│                                                       │
│⛽│                                                       │
│⚙️│                                                       │
├──┴───────────────────────────────────────────────────────┤
│  ✦ Sophia: You have 3 jobs matching your updated resume  │  ← Sophia bar
│  [Suggestion 1]  [Suggestion 2]       [💬 Ask Sophia ▸] │
└──────────────────────────────────────────────────────────┘
```

### Header (top, ~48-56px):
- **Left:** Hamburger (mobile) or logo mark (desktop)
- **Center-left:** Product wordmark "CareerEdge" — but subtle, not large
- **Center:** Role badge pill — "EdgeStar" / "EdgeGuide" / "EdgeParent" — visible, not prominent. This tells the user what mode they're in. Future: role switcher dropdown.
- **Right:** Search icon (triggers ⌘K), notification bell (with count), user avatar (profile/settings dropdown)

### Sidebar rail (left, ~56-64px collapsed):
- Icons only, labels on hover. Expands to ~220px on toggle/hover.
- **Per-role items** — only what matters to this role:

**EdgeStar sees:**
- Home (dashboard)
- EdgePath (roadmap)
- ResumeEdge (resume tools)
- EdgeMatch (jobs)
- EdgeProd (productivity) 
- Messages

**EdgeParent sees:**
- Home (dashboard)
- Family Progress
- Budget Tracker
- Messages

**EdgeEmployer sees:**
- Home (dashboard)
- Jobs (post + manage)
- Pipeline (applications)
- EdgeSight (analytics)
- Messages

**EdgeGuide sees:**
- Home (dashboard)
- Sessions
- Courses
- Earnings
- Messages

4-6 items per role. That's a manageable spatial navigation. No scroll needed. No overwhelm.

### Sidebar footer (persistent):
- EdgeGas indicator: ⛽ icon + balance number + mini usage bar. Lime when healthy, amber when low.
- Settings gear icon
- Collapse/expand toggle

### Sophia bar (bottom, ~64-80px):
- Persistent across all pages
- **Idle state:** Single line of contextual text from Sophia. "You have 3 new job matches." / "Phase 2 milestone due in 3 days." / "Resume not optimized for your latest saved job."
- **Below the line:** 2-3 suggestion chips based on context. "View matches" / "Open roadmap" / "Optimize resume"
- **Right side:** "Ask Sophia ▸" button that expands the full Sophia panel (surface #9)
- **Typing state:** Input field replaces the idle text. Sophia responds inline for simple queries, opens full panel for complex ones.

This bar is NOT a chat. It's a context-aware status line with actionable suggestions. The full Sophia panel is the chat/agent experience.

### ⌘K Command palette:
- Triggered by: clicking search icon, pressing ⌘K / Ctrl+K, or typing "/" anywhere
- **Categorized commands** (like Quarn's "What happens next?" menu):
  - Recent: last 3 visited pages
  - Navigate: all available pages for this role
  - Actions: "Optimize resume" / "Start interview prep" / "Create roadmap"
  - Sophia: "Ask Sophia about..." (opens Sophia panel with pre-filled query)

---

## Navigation State Model — Lifecycle Adaptation

### Day 0 (just signed up, no data):
- Dashboard shows onboarding completion card as the hero element
- Sophia bar: "Let's start with your career roadmap — it takes 7 minutes."
- Sidebar items that need prerequisite data show subtle "setup needed" indicators (not disabled — that creates anxiety)
- Only 1-2 suggestion chips, not 3

### Day 1-7 (initial engagement):
- Dashboard shows roadmap as the primary card + Sophia's first insight
- Sophia bar becomes contextual: "Your resume scored 72 ATS. Let's push it to 85+."
- EdgeMatch becomes active once roadmap + resume exist
- Sidebar items light up as they become relevant (subtle animation, not dramatic)

### Day 14-30 (active user):
- Dashboard is a full command center: active applications, upcoming sessions, roadmap progress, Sophia's weekly brief
- Sophia bar surfaces time-sensitive items: "Interview with Figma in 2 days. Start prep?"
- ⌘K history is rich — the user's most common actions surface first

### Day 60+ (post-placement):
- Dashboard adapts: transitions from job search to career growth
- Sophia acknowledges the shift: "Role secured. Let's focus on your first 90 days."
- EdgePath updates to workplace success roadmap
- Some sidebar items naturally become less relevant (EdgeMatch deprioritizes)

---

## Role-Specific Navigation — What Changes Per Role

The shell (header, sidebar rail, Sophia bar) stays structurally identical across all roles. What changes:

| Element | What varies by role |
|---------|-------------------|
| Sidebar items | Different 4-6 icons per role |
| Role badge | Different label + color accent |
| Sophia's context | Different suggestions, different language |
| Dashboard layout | Different card composition |
| ⌘K commands | Different available actions |
| EdgeGas earning logic | Different triggers per role |

The user never feels like they're in a "different app." The shell is the same. The content adapts. This is how Apple handles different user types across the same OS — the chrome is constant, the experience is personalized.

---

## Open Questions Before We Start Building

1. **Dark only or dark + light?** The references and creative direction are dark-first. Should we design dark only for V1, or build a light mode toggle from the start? (My recommendation: dark only for V1. The brand identity is strongest in dark. Light mode is a V2 effort.) - dark mode for now

2. **Mobile — responsive or separate patterns?** The PRD mentions PWA + mobile-first. Are we designing responsive from desktop, or starting mobile? (My recommendation: desktop-first for V1 since we're building in this environment, but with responsive breakpoints in mind.) - responsive always

3. **The 11-step ResumeEdge flow — are we allowed to restructure it?** The backend has 11 steps. Can we visually collapse them into 3-4 perceived steps while the backend still processes 11? This is a UX question, not a functionality question. yes exactly the kind of thinking i need. We must make it all simple, easy to use navigate, seamless, intuitve. 

4. **Copy/tone — who writes it?** The current copy is generic ("What's on your mind?", "No meeting types available"). Are we writing new copy as part of this redesign, or is that a separate workstream? (My recommendation: we write contextual copy as we design. Copy IS design.) - yes we are also designing the copy

5. **Which role do we build the onboarding exploration for first?** EdgeStar is the obvious answer, but the onboarding brief has Sophia confirming role at step 4 — meaning steps 1-3 are role-agnostic. Should we build the shared onboarding (steps 1-3) + EdgeStar post-role-selection (steps 4-6)? - hm what do you suggest? based on great systems thinking from our northstar products with similar complexities how do we handle this?


Now; PLEASE CONFIRM THAT YOU READ EVERY DOCUMENT AND DIDN'T CHEAT BEFORE YOU GENERATED YOUR ANSWER

SECONDLY THIS IS WHAT CLAUDE AND I WERE PLAYING WITH FOR NAVIGATION IDEAS


icWebPro × CareerEdge™
Speculative
Pre-Design
Sophia as
Navigation
Five concepts for an AI that doesn't sit in a corner — it is the interface. Each one is a different architectural bet. Some are buildable now. Some are pointing at where the industry is heading. All of them are honest about the tradeoffs.

The shift being explored: Most apps organize around tools. You navigate to ResumeEdge, then EdgeMatch, then EdgePath — each a destination. The question is whether CareerEdge can organize around intent instead — where Sophia understands what you're trying to do and assembles the surface around it. Navigation becomes the escape hatch, not the front door.
1
Sophia as Executor
The Command Layer
"You tell Sophia what you want to accomplish. She doesn't just answer — she does it, across multiple tools, in one instruction."

The ⌘K command palette exists today but it only navigates. This takes it further: Sophia executes multi-step cross-product actions from a single natural language instruction. She's not a chatbot. She's an operator.

You write "optimize my resume for the product design job I saved yesterday" — Sophia retrieves the job, runs your resume through ResumeEdge, writes a tailored cover letter, creates a tracker entry, and notifies your EdgeGuide. That was previously 4 separate app flows. Now it's one instruction.

The closest analogue is Cursor — where you select code and say "fix this" and it acts, not just responds. Or Apple Intelligence's cross-app actions. The sidebar still exists as a fallback. The command layer becomes the primary interface for users who know what they want.

Drawn from
Cursor — execute not chat
Apple Intelligence — cross-app actions
Linear — command palette as power user interface
Glean — intent-driven retrieval + action
Feasibility Check
Core chat + navigation
NOW
Single-tool actions (run ResumeEdge)
NOW
Cross-tool chained actions
SOON
Background async execution
SOON
Full multi-agent orchestration
V2
Risk If It Fails
Sophia misunderstands the instruction and takes the wrong action on the wrong asset — e.g., overwrites a resume the user wasn't ready to change. Trust is destroyed.
Cold Start Condition
Works even for new users — the commands surface in the command palette as suggestions relevant to their onboarding state. Day-1 users see: "Build my first roadmap / Optimize my resume / Find jobs matching my skills."
What it feels like — interaction narrative
Sophia Command — ⌘K
S
Optimize my resume for the product design job I saved at Figma, and draft a cover letter
✦
→ retrieving saved job: "Product Designer · Figma · SF"
→ loading resume: Sharon_Resume_v3.pdf
→ running ResumeEdge AI analysis against job requirements...
→ generating cover letter draft...
✦
Done. Your resume went from 62 → 87 ATS score for this job. I've added 4 keywords from the job description and moved your interaction design experience up. Cover letter is in drafts — it references your work on design systems which they specifically called out. Want me to also reach out to your EdgeGuide about this role?
Changes made to Sharon_Resume_v3.pdf
87 ATS Match
Keywords added
Product thinking, Systems design, Figma prototyping
Section reordered
Interaction Design moved to position 2
Cover letter
Draft saved — ready to review
Application tracker
Entry created — "Figma · Applied" stage
Review Changes
Undo Edits
Apply to Another Job
Note: Sophia must show what she changed before confirming — she never overwrites silently. Confirmation step is non-negotiable for trust.
2
Generative Surfaces
The Adaptive Dashboard
"The same URL renders a different interface depending on where you are in your journey. The dashboard isn't a screen — it's Sophia's current read on what you need."

This is the Dynamic Island idea applied to the whole product. The interface density, layout, and content are generated by Sophia's context model — not by user preferences, not by templates.

Day 1 with no roadmap: one giant prompt. One action. Nothing else visible. Day 30 with an active job search: a command center — pipeline, upcoming prep sessions, Sophia's weekly intelligence brief on your target companies. Day 60 after landing a role: automatically transitions to an onboarding and progression dashboard.

The product isn't organised around features — it's organised around where the user is in their arc. Sophia decides what to show. The user never customizes a dashboard again.

Drawn from
Apple Dynamic Island
Spotify — home adapts by time of day
Notion AI — page content adapts to task
Vercel V0 — UI generation from context
Feasibility Check
State-based layout switching
NOW
Sophia-triggered widget visibility
NOW
Layout generation (not templates)
SOON
Full generative UI components
V2
Risk If It Fails
Sophia misjudges the user's state and shows the wrong layout — a returning power user gets a Day-1 empty state. Or layout changes unexpectedly, disorienting users who have built muscle memory.
The Override Rule
Always provide an escape: a minimal "Customize" toggle that lets the user pin specific widgets. Sophia's layout is the default, not the prison.
What it looks like — three states of the same dashboard
Dashboard
Day 1
✦ Build your roadmap
7 min · Sophia guides you
Nothing else until you've done this.
Dashboard
Day 30
✦
12 new jobs match your profile this week
Figma · Product Designer
Intercom · UX Lead
Phase 2 · 3 tasks remain
EdgePath
Interview Prep — Tuesday 2pm
EdgeGuide
Dashboard
Offer Accepted
✦ Role secured — Figma
Start date: Apr 14
21 days
Share your story
SocialEdge
Workplace prep roadmap
EdgePath
The layout transitions between states with Sophia's guidance — she announces the change: "You've applied to 8 roles this week. I've updated your dashboard to focus on interview prep." The user understands why it changed.
3
Goal-Centric Architecture
Task Rooms
"You're not in ResumeEdge or EdgeMatch. You're in 'My Figma Application' — a temporary workspace Sophia created around a specific goal. The tools come to you."

This is the deepest structural rethink. The organizing unit is not the tool — it's the task. When you're working toward a specific goal (applying to a specific job, completing a roadmap phase, preparing for an interview), Sophia creates a Task Room around it.

A Task Room contains everything relevant to that goal, pulled from across the product: the job card, your tailored resume, the cover letter, your notes, the interview prep checklist, your EdgeGuide connection, the tracker entry. The tools are assembled inside the task — not the other way around.

When the task is resolved — applied, declined, archived — the room is stored. You can return to it. Sophia can reference it. The product builds a memory of your journey, task by task. This mirrors how humans actually work — around outcomes, not around apps.

Drawn from
Linear — issue as organizing unit not tool
Figma — canvas where tools come to selection
Superhuman — email as task unit
Clay — research assembled around a contact
Feasibility Check
Task creation + routing
NOW
Manual tool assembly in a room
NOW
Sophia auto-assembles the room
SOON
Cross-task intelligence (Sophia references past rooms)
V2
Risk If It Fails
Room proliferation — users end up with 40 open task rooms they don't know how to manage. Sophia needs to proactively archive completed/stale rooms or this becomes its own navigation problem.
Works For / Not For
Works best for: job applications, interview prep, specific roadmap phases, mentorship sessions. Works less well for: general browsing, exploration, discovery. The sidebar is still needed for "I don't have a task yet, let me explore."
What a Task Room looks like
Task Room — My Figma Application
✦
I've created a task room for your Figma application. Everything you need is here — you don't need to navigate anywhere else. Status: Ready to apply.
My Figma Application
IN PROGRESS
Job
Product Designer · Figma · San Francisco · $140–180k
Resume
Sharon_Resume_v3_figma.pdf · 87 ATS
Cover letter
Draft ready — "Design Systems" angle
Interview prep
Not started · Sophia has 12 likely questions
EdgeGuide connection
Alice knows 2 Figma employees — ask for intro?
Sophia's read
Strong fit — your Systems Design background is rare here
Apply Now ↗
Start Interview Prep
Ask Alice for Intro
✦
You have 3 other active applications · Intercom deadline is Friday
View All →
Task Rooms are created by Sophia when she detects goal-oriented behavior (saved a job, started a roadmap phase, booked a mentor session). They can also be created manually: "Sophia, start a task room for my Intercom application."
4
Most Speculative
The Sophia Membrane
"There is no navigation. There is no sidebar. The entire interface is Sophia. You tell her what you want. She generates the UI component you need, inline, in the conversation. The product is a living conversation."

This is the most radical bet. Sophia IS the app. Like how this conversation with me is the whole interface — you don't navigate to a "reasoning tool" and a "search tool" separately. You just ask, and I bring the right capability to bear.

CareerEdge as a single conversation surface. "Show me my resume score." → Sophia renders a score card inline. "Find product manager jobs in London." → She renders a filterable job list inline. "Build my roadmap." → She starts the 9-question flow inline, and the roadmap appears in the conversation thread. Your career history is a thread you scroll through.

This is the Arc Browser model — browse by asking, not by clicking. Technically, this is now possible: Vercel's AI SDK supports streamable React components from the server. The UI isn't pre-built and navigated to — it's generated on demand and streamed into the conversation.

Drawn from
Claude — conversation as the full surface
Arc Browser — browse by asking
Vercel AI SDK — streamable React UI
ChatGPT artifacts — generated UI inline
Feasibility Check
Conversational UI wrapper
NOW
Inline component rendering
SOON
Generative UI from user intent
SOON
Full app as conversation
SPECULATIVE
Reliable enough for career decisions
HIGH RISK
The Fundamental Problem
CareerEdge is a career tool — decisions here are high-stakes. A conversational interface that halluccinates or gives wrong career guidance has real consequences. The higher the stakes, the more users need the safety of predictable, structured UI. This model works better for discovery and research than for executing important actions.
Where It Works
This model is powerful for the exploration/discovery phase — researching careers, asking Sophia about industries, getting a read on a company. Not yet right as the primary interface for executing applications, managing roadmaps, or booking sessions.
What it unlocks
Zero navigation cost. A user who doesn't know where anything is can get anything they need by describing it. Democratizes the full feature set — you don't need to explore to find value. Every feature is one sentence away.
The honest verdict
This is the right north star direction for this industry — it's where career tools will go in 3–5 years. As Sophia's accuracy and reliability increases, more of the interface can be conversation-driven. Start here as a companion mode, not the primary interface. Let it grow into primacy.
5
The Most Immediately Buildable
The Living Roadmap
"EdgePath isn't a document you create once. It's a living intelligence layer. Sophia updates it as you move — from your actions, from your EdgeGuide's feedback, from the job market. Your roadmap reflects today, not the day you made it."

The current roadmap (as seen in the screenshots) has a generated first run, then becomes static — a document with tabs. This concept makes the roadmap an active AI agent, not a static output.

When you complete a phase → Sophia marks it and prompts: "Phase 1 complete. Based on your timeline, we should revisit Phase 2." When you apply to a job → the roadmap notes it under relevant milestones. When your EdgeGuide gives you feedback → Sophia incorporates it as a note on the relevant section. When the job market shifts → Sophia surfaces a notification: "I've noticed rising demand for [skill] in your target companies — want me to add it to Phase 2?"

The roadmap becomes the source of truth for your career state. Sophia is its curator. Other features reference it — EdgeMatch filters by your roadmap's target role, ResumeEdge scores against your roadmap's skill requirements. Everything in the product points back to the roadmap.

Drawn from
Notion AI — living document intelligence
GitHub Copilot — inline suggestions on existing content
Lenny's Newsletter — intelligence layer over content
Linear — issues update with live signals
Feasibility Check
Roadmap progress tracking
NOW
Sophia notes on sections
NOW
Auto-update from EdgeGuide feedback
SOON
Job market signal integration
SOON
Sophia proactive roadmap edits
V2
Why This One First
EdgePath is already the most sophisticated feature in the product. The AI generation is good. The output is rich. This concept builds on existing infrastructure rather than replacing it. It's the highest leverage AI investment.
Navigation Implication
If the roadmap is the canonical source of truth, navigation to other features can be contextual from it — "based on Phase 2, you should look at these 5 courses, these 8 jobs, these 2 mentors." The roadmap becomes the home screen.
How Sophia communicates roadmap updates
✦
You completed 3 Phase 1 milestones this week — you're 2 weeks ahead of your original timeline
View Progress →
✦
Design Systems is trending in Figma, Notion, and Linear job posts right now — it's in your Phase 2 plan
See Jobs →
✦
Alice left feedback on your portfolio — I've added a note to your Phase 2 roadmap
Review →
✦
It's been 3 weeks since you opened your roadmap. Your Phase 1 deadline is in 5 days.
Resume →
These messages replace generic notification systems. Sophia surfaces insights that are specific to this user's roadmap, not generic product engagement nudges.
Stress Test
Every concept tested against what matters — because vision without rigor is just decoration.
Dimension	C1 — Command	C2 — Adaptive	C3 — Task Rooms	C4 — Membrane	C5 — Living Roadmap
Build time	2–4 weeks for basic version	3–6 weeks (state machine + layout logic)	4–8 weeks (room data model is new)	6–12 weeks, ongoing	2–4 weeks — builds on existing EdgePath
AI dependency	High — action parsing must be reliable	Medium — state inference, not generation	Medium — room assembly from context	Very high — entire UI is AI-generated	Medium — proactive notifications + analysis
Failure mode	Wrong action on wrong asset — irreversible	Wrong layout state — disorienting but recoverable	Room proliferation, stale rooms pile up	Hallucination on career-critical info	Roadmap drift — suggestions conflict with user's mental model
Fallback if AI fails	Returns to traditional navigation instantly	User can pin/override Sophia's layout	Manual room creation + standard tool navigation	Needs to fall back to traditional navigation — big degradation	Roadmap is still functional without proactive updates
New user (Day 1)	Command palette suggests context-aware Day-1 actions	Day-1 state is the simplest, most focused — benefits new users most	No tasks yet, no rooms yet — still needs traditional nav for discovery	Needs onboarding to learn the conversational model — friction	Roadmap doesn't exist yet — this activates after first roadmap creation
Sophia training req.	Intent parsing + action routing for each tool	State classification from user behavior signals	Goal detection + resource assembly per task type	Full UI generation + routing + content — hardest to train	Domain knowledge (career market signals) + context retrieval
Which northstar uses this	Cursor executes, not just assists	iPhone Dynamic Island, Spotify home, iOS	Linear issues, Superhuman, Clay	Arc, Claude, ChatGPT artifacts	Notion AI, GitHub Copilot, Linear
Verdict	BUILD NOW	NEXT PRIORITY	AFTER C2	NORTH STAR V2	BUILD NOW
The Synthesis — How These Fit Together
These five concepts aren't competing options — they're a layered architecture that gets built in sequence. The sidebar and traditional navigation never go away. They become the fallback — the safety net for users who need orientation. Sophia progressively takes over as primary interface as her reliability increases and users build trust in her.

The key principle from AI engineering applies here: start simple, expand trust, never go full-autonomous without a fallback. The most dangerous failure mode is building Sophia as the primary interface before she's reliable enough for the stakes involved. Career decisions — job applications, salary negotiations, roadmap strategy — are high-stakes. Users will accept an AI that's slightly wrong on music recommendations. They will not accept one that's slightly wrong on their career.

C4 (The Membrane) is the north star. It's where this goes. But it earns its way there by first proving itself in C1, C2, C3, and C5. Each one is a trust-building exercise. Each one proves Sophia's reliability in a bounded domain before she's trusted with a wider one.

Phase 1 — Now
Sophia Executes + Living Roadmap
C1 + C5. The command layer executes single and chained actions across existing tools. The roadmap becomes a living intelligence layer. Both build on current infrastructure. The sidebar doesn't change. Sophia gains agency, not primacy.
Phase 2 — Next
Adaptive Dashboard + Task Rooms
C2 + C3. The dashboard morphs based on Sophia's state model. Task Rooms bundle tools around goals. Navigation is now often unnecessary — Sophia brings the right surface to you. Traditional nav is still there, used less.
Phase 3 — V2 North Star
The Sophia Membrane
C4. After Sophia has proven herself reliable across C1–C5, the conversation layer can expand to become the primary interface. At this point, the traditional navigation is the fallback — not the front door. This is the product as it should be.
icWebPro × CareerEdge™ — Speculative AI Navigation Concepts
Sophia System v0.1