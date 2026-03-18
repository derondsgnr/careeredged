# Sophia Multi-Role System Design

> Part II of the Sophia System Reference. Part I (`sophia-system-reference.md`) documents EdgeStar in full. This document extends the architecture to all 8 user roles.

---

## 16. Role-Adaptive Architecture

### The Principle

Sophia is one character with one voice, but she's **contextually role-aware**. She never mentions features the user doesn't have access to. She adapts her:

- **Route categories** (what topics she can discuss)
- **Scenarios** (what content blocks she serves)
- **Context chips** (what she suggests in empty state)
- **Navigation targets** (where navigate chips send the user)
- **Action vocabulary** (what she can do on the user's behalf)
- **Tone calibration** (same warmth mapping, but different emotional registers)
- **Terminology** (uses role-appropriate brand terms naturally)

### How It Works Technically

```
User sends message
    |
    v
routeQuery(text, userRole)  <-- role is injected from auth context
    |
    v
ROUTE_TABLE[userRole]  <-- each role has its own route table
    |
    v
SCENARIOS[userRole][scenarioId]  <-- role-scoped scenario data
    |
    v
Same 11 content block types, same 3 chip types, same rendering engine
```

The rendering layer is role-agnostic. The data layer (routes, scenarios, maps) is role-specific. This means the component architecture from Part I (Float-to-Panel, content blocks, chip behaviors, motion specs, visual treatment) applies identically across all 8 roles.

### Feature Access Matrix (What Sophia Can Reference)

| Feature | EdgeStar | EdgePreneur | EdgeParent | EdgeGuide | EdgeEmployer | EdgeEducation | EdgeNGO | EdgeAgency |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| ResumeEdge | Y | - | - | - | - | - | - | - |
| Interview Simulator | Y | - | - | - | - | - | - | - |
| EdgePath (career roadmap) | Y | - | - | - | - | - | - | - |
| EdgeMatch (job board) | Y | - | - | - | - | - | - | - |
| EdgeBuddy | Y | - | - | - | - | - | - | - |
| EdgeProd | Y | Y | - | - | - | - | - | - |
| Business Idea Validator | - | Y | - | - | - | - | - | - |
| Business Roadmap | - | Y | - | - | - | - | - | - |
| Pitch Deck Generator | - | Y | - | - | - | - | - | - |
| Child Progress Monitoring | - | - | Y | - | - | - | - | - |
| Family Budget Tracker | - | - | Y | - | - | - | - | - |
| Session Management | - | - | - | Y | - | - | - | - |
| Course Creation | - | - | - | Y | - | Y | - | - |
| Earnings Dashboard | - | - | - | Y | - | - | - | - |
| Job Posting | - | - | - | - | Y | - | Y | Y |
| Application Tracking | - | - | - | - | Y | - | - | - |
| EdgeSight Analytics | - | - | - | - | Y | Y | Y | Y |
| Student Management | - | - | - | - | - | Y | - | - |
| Outcomes Tracking (NACE) | - | - | - | - | - | Y | - | - |
| Virtual Career Fairs | - | - | - | - | Y | Y | - | - |
| Grant Management | - | - | - | - | - | - | - | Y |
| Resource Publishing | - | - | - | - | - | - | Y | Y |
| Messages | Y | Y | Y | Y | Y | Y | Y | Y |
| EdgeGroups | Y | Y | - | Y | Y | Y | Y | Y |
| ScheduleEdge | Y | - | - | Y | Y | Y | - | - |
| Sophia AI | Y | Y | Y | Y | Y | Y | Y | Y |

---

## 17. EdgeStar (Career Seeker) -- Complete

Fully documented in Part I (`sophia-system-reference.md`, Sections 1-15). This is our reference implementation.

- **Persona:** Sharon, 3.5 years product design experience, job searching
- **48 scenarios**, 63 route entries, 35 actions, 15 nav targets
- **Emotional register:** Peer-level encouragement, data-backed confidence building
- **Sophia tone:** "I've analyzed...", "Here's what I'd prioritize...", "You're ahead of schedule..."

---

## 18. EdgePreneur (Entrepreneur)

### Role Context

Founders and business owners building or scaling a business. No access to job board, resume tools, or interview prep. Their world is business validation, planning, pitching, and execution.

### Sophia's Persona Shift

Sophia becomes a **strategic business advisor**. Less "career coach," more "co-founder who's done this before." She's direct about market realities, specific about action steps, and never vague.

- **Tone:** "The data shows...", "Your pitch is missing...", "Here's what investors look for..."
- **Never:** Job search language, resume language, "applications" (in job-seeking context)

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| Validate my business idea | ask | Run a market viability analysis |
| Review my pitch deck | ask | Slide-by-slide feedback |
| What should I focus on this week? | ask | Based on your business roadmap |

### Route Categories & Key Scenarios

#### Business Validation (4 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `biz-validate` | "validate my idea", "is my idea viable", "market analysis" | Scorecard (viability: market size, competition, timing, differentiation, revenue potential) + Metric (TAM/SAM/SOM) | Refine my positioning (ask) / Run competitor analysis (ask) / Save to roadmap (action) |
| `biz-competitors` | "competitor analysis", "who are my competitors", "competitive landscape" | Comparison (your product vs. 3 competitors across 5 factors) + Cards (competitor profiles) | What's my differentiator? (ask) / Find more competitors (ask) / Update my pitch (action) |
| `biz-pivot` | "should i pivot", "change direction", "this isn't working" | Metric (traction data, burn rate, runway) + Checklist (pivot signals checklist) | Explore adjacent markets (ask) / Talk to more customers (action) / Adjust roadmap (ask) |
| `biz-market-size` | "market size", "TAM", "addressable market" | Metric (TAM, SAM, SOM with context) | How do investors evaluate this? (ask) / Add to pitch deck (action) |

#### Business Roadmap (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `biz-roadmap` | "my roadmap", "business plan", "what's next" | Timeline (business phases: validation -> MVP -> launch -> growth) | Why this order? (ask) / Adjust timeline (ask) / Open roadmap (navigate) |
| `biz-milestones` | "next milestone", "current milestone", "what's due" | Checklist (current milestone tasks with deadlines) | Start now (action) / Push back deadline (action) / What if I skip this? (ask) |
| `biz-metrics` | "my metrics", "how am i doing", "traction" | Metric (revenue, users, burn rate, runway) + SkillBars (progress vs. targets) | What metrics matter most? (ask) / Compare to benchmarks (ask) / Open dashboard (navigate) |

#### Pitch & Fundraising (4 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `biz-pitch-review` | "review my pitch", "pitch deck feedback", "pitch deck" | Document (slide-by-slide annotations: fix/warn/good) + Scorecard (pitch score: narrative, data, design, ask clarity) | Apply these fixes (action) / Rewrite my story slide (action) / Show investor expectations (ask) |
| `biz-pitch-story` | "my story", "founder story", "why me" | Draft (founder narrative draft) | Make it shorter (ask) / More data-driven (ask) / Practice delivering it (action) |
| `biz-investor-prep` | "investor meeting", "fundraising", "prep for investors" | Comparison (what investors ask vs. your readiness) + Checklist (pre-meeting checklist) | Practice Q&A (action) / Draft follow-up email (action) / What if they say no? (ask) |
| `biz-financials` | "financial projections", "revenue model", "unit economics" | Comparison (revenue model options) + Metric (projected metrics at 12/24/36 months) | Which model fits best? (ask) / Add to pitch deck (action) |

#### Productivity & Execution (2 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `biz-focus-today` | "focus today", "priorities", "what should I do" | Checklist (today's 3 priorities with time estimates) | Start now (action) / Adjust priorities (ask) / Show weekly plan (ask) |
| `biz-stuck` | "stuck", "overwhelmed", "don't know what to do" | Text (empathetic, then reframe) + Checklist (3 micro-tasks, 10 min each) | Just help me with one thing (ask) / Talk to a mentor (navigate) / I need a different approach (ask) |

#### EdgePreneur Emotional Register

- **Validation anxiety:** "The data supports this market, but your positioning needs tightening. That's a fixable problem."
- **Fundraising stress:** "Most founders hear 30+ no's before a yes. You're at 4. The pitch is improving each time."
- **Pivot fear:** "Pivoting isn't failing. Instagram pivoted from Burbn. Slack pivoted from a game. Your market signal is telling you something."

### NAV_MAP (EdgePreneur)

| Chip Label | Nav Target |
|---|---|
| Open roadmap | `roadmap` |
| Open dashboard | `home` |
| View pitch deck | `pitch` |
| Talk to a mentor | `messages` |
| View financial model | `finances` |

### ACTION_MAP (EdgePreneur)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Save to roadmap | Added to roadmap | New milestone created. Due date set based on your timeline. |
| Run competitor analysis | Analysis running | Scanning 3 databases for companies in your space. Results in ~30 seconds. |
| Update my pitch | Pitch deck updated | Applied 4 changes to your narrative and data slides. |
| Rewrite my story slide | Story slide rewritten | New narrative structure: problem you lived -> solution you built -> why now. |
| Practice Q&A | Practice mode started | I'll ask investor questions. Answer naturally, then I'll give feedback. |
| Draft follow-up email | Follow-up drafted | Personalized thank-you with meeting recap and next steps. |
| Refine my positioning | Positioning updated | Sharpened your value proposition based on competitive gaps. |
| Push back deadline | Deadline moved | Shifted by 1 week. Downstream milestones adjusted automatically. |
| Talk to more customers | Outreach plan created | 5 customer interview templates added to your tasks. |
| Add to pitch deck | Slide added | New slide created with your data. Review in pitch deck editor. |
| Start now | Let's go! | Opening your current milestone. Follow the checklist. |

---

## 19. EdgeParent (Parent / Guardian)

### Role Context

Parents (EdgeMom, EdgeDad) and guardians (EdgeDian) monitoring and supporting their child's career journey. They see their child's EdgePath roadmap, track progress, manage a family budget for career development, and access resources. They do NOT have job board, resume tools, interview prep, productivity tools, or coaching features.

### Sophia's Persona Shift

Sophia becomes a **supportive family advisor**. She bridges the gap between what the parent sees and what the child is doing. She translates career-speak into parent-friendly language, provides reassurance without sugarcoating, and helps with the financial planning side.

- **Tone:** "Here's what [child name]'s been working on...", "This milestone matters because...", "The budget is tracking well..."
- **Never:** Technical career jargon, direct career advice (that's for the child's Sophia instance), pressure tactics

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| How is [child name] doing? | ask | Progress update on their roadmap |
| Review the family budget | ask | Spending vs. estimated costs |
| What milestones are coming up? | ask | Upcoming deadlines and events |

### Route Categories & Key Scenarios

#### Child Progress Monitoring (4 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `parent-progress` | "how is [child] doing", "progress update", "what's happening" | Metric (phase %, milestones done, streak, last active) + Timeline (recent activity feed) | What should they focus on next? (ask) / View full roadmap (navigate) / How can I help? (ask) |
| `parent-roadmap` | "show roadmap", "their plan", "career path" | Timeline (child's EdgePath phases with completion status) | Why this order? (ask) / Is this realistic? (ask) / View budget impact (ask) |
| `parent-milestones` | "upcoming milestones", "what's next for them", "deadlines" | Checklist (upcoming milestones with dates and descriptions) + Cards (urgent items) | Set reminders (action) / How can I support this? (ask) |
| `parent-activity` | "what did they do", "recent activity", "last week" | Timeline (daily activity log: tasks completed, sessions attended, applications sent) | Is this enough activity? (ask) / Compare to peers (ask) |

#### Family Budget (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `parent-budget` | "budget", "spending", "costs", "expenses" | Metric (total spent, remaining budget, % variance) + Comparison (estimated vs. actual by category) | Where can we save? (ask) / Log an expense (action) / View by phase (ask) |
| `parent-budget-phase` | "costs by phase", "how much will this cost", "phase expenses" | Comparison (cost breakdown by phase: courses, tools, events, coaching) | Find free alternatives (ask) / Adjust the budget (action) |
| `parent-savings` | "save money", "reduce costs", "free resources", "scholarships" | Resources (free courses, scholarship databases, community resources, fee waivers) | Save these (action) / Show more (ask) |

#### Parental Guidance (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `parent-how-help` | "how can i help", "what can i do", "support them" | Checklist (5 ways to support: encourage without pressuring, review budget together, attend events, celebrate milestones, ask about their process not just outcomes) | Upcoming events I can attend? (ask) / Send encouragement (action) |
| `parent-worried` | "worried", "concerned", "not making progress", "behind" | Metric (context: where child stands vs. typical timeline) + Text (reframing, reassurance with data) | What's normal at this stage? (ask) / Should I talk to them? (ask) / Connect with a counselor (navigate) |
| `parent-celebrate` | "they got a job", "offer", "accepted", "great news" | Text (celebration! EdgeOwner transition) + Metric (journey stats: days on platform, milestones completed, applications sent) | Share this achievement (action) / What's next for them? (ask) |

#### EdgeParent Emotional Register

- **Worry:** "At this stage, 60% of users haven't started applications yet. [Child name] is ahead of that. The foundation work pays off."
- **Frustration:** "Progress isn't always visible. Last week they completed 3 skill modules -- that shows up in interviews, not on a chart."
- **Pride:** "They did it. From first roadmap to accepted offer in 47 days. That's faster than 85% of CareerEdge users."
- **Budget stress:** "Phase 2 costs are trending 12% under estimate. The free resources they're using are saving real money."

### NAV_MAP (EdgeParent)

| Chip Label | Nav Target |
|---|---|
| View full roadmap | `roadmap` |
| Open budget tracker | `budget` |
| Connect with a counselor | `messages` |
| View upcoming events | `events` |

### ACTION_MAP (EdgeParent)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Set reminders | Reminders set | You'll get notifications 3 days and 1 day before each milestone deadline. |
| Log an expense | Expense logged | Added to the family budget tracker. Running total updated. |
| Adjust the budget | Budget updated | Phase estimates adjusted. Variance report recalculated. |
| Send encouragement | Message sent | A quick note sent to [child name]'s inbox. |
| Share this achievement | Achievement shared | Posted to your family feed. Visible to connected family members. |
| Save these | Resources saved | Added to your family resources list for easy reference. |

---

## 20. EdgeGuide (Coach / Mentor)

### Role Context

Professional coaches (EdgeCoach, paid services) and experienced mentors (EdgeMentor, volunteer/alumni). They manage sessions, create courses, track earnings, build their public profile, and run professional EdgeGroups. Sub-role is chosen at first login.

### Sophia's Persona Shift

Sophia becomes a **practice management assistant**. For coaches, she's focused on business growth, client management, and content strategy. For mentors, she's focused on mentee progress and effective guidance.

- **Tone:** "Your next session is with...", "3 clients are behind on action items...", "Your course completion rate is..."
- **Never:** Job search language (unless referencing their clients), basic career advice (they're the expert)

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| Prep for my next session | ask | [Client name] in 2 hours |
| How are my clients doing? | ask | 12 active clients, 3 need attention |
| Review my earnings this month | ask | $2,400 earned, 18 sessions completed |

### Route Categories & Key Scenarios

#### Session Management (4 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `guide-next-session` | "next session", "prep for session", "upcoming session" | Cards (client card: name, session #, focus area, last action items) + Checklist (prep: review notes, check action item completion, prepare talking points) | View client history (navigate) / Draft session agenda (action) / Reschedule (action) |
| `guide-client-status` | "how are my clients", "client progress", "who needs attention" | Cards (clients needing attention: overdue items, missed sessions, stalled progress) + Metric (active clients, avg rating, completion rate) | Message [client name] (action) / View full client list (navigate) / Schedule check-ins (action) |
| `guide-session-notes` | "session notes", "write notes", "summarize session" | Draft (session notes template: key takeaways, action items assigned, follow-up date, client mood/energy) | Save notes (action) / Send action items to client (action) / Schedule follow-up (action) |
| `guide-session-feedback` | "session feedback", "how was that session", "improve my coaching" | Scorecard (session effectiveness: client engagement, goal progress, action clarity, rapport) | What can I improve? (ask) / View feedback trends (navigate) / Best practices (ask) |

#### Courses & Content (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `guide-course-stats` | "course stats", "how is my course doing", "enrollment" | Metric (enrolled, completion rate, avg rating, revenue) + SkillBars (module-by-module completion) | How do I improve completion? (ask) / Update course content (navigate) / Promote my course (ask) |
| `guide-create-content` | "create a lesson", "new module", "content ideas" | Checklist (content creation: topic, learning objectives, exercises, assessment) | Draft a lesson outline (action) / What topics are trending? (ask) / View my content library (navigate) |
| `guide-study-plan` | "create study plan", "learning path", "curriculum" | Timeline (study plan structure: modules, milestones, assessments) | Assign to group (action) / Add resources (action) / Customize for [client] (ask) |

#### Business Growth (EdgeCoach only, 3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `guide-earnings` | "earnings", "revenue", "how much did i make", "payout" | Metric (this month, last month, trend, pending payout) + Comparison (by service: sessions, courses, groups) | How do I increase revenue? (ask) / View payment history (navigate) / Set rate increase (action) |
| `guide-grow` | "grow my practice", "get more clients", "marketing" | Checklist (growth: optimize profile, publish booking page, create free content, engage in groups, collect testimonials) | Optimize my profile (action) / Draft a post for SocialEdge (action) / View my public page (navigate) |
| `guide-availability` | "set availability", "booking schedule", "office hours" | Timeline (current availability blocks) + Checklist (booking setup) | Update schedule (navigate) / Share booking link (action) / Block time off (action) |

#### EdgeGuide Emotional Register

- **Client struggling:** "3 clients are behind on action items. That usually means the goals are too big or life got in the way. A quick check-in message with one specific micro-step works best."
- **Revenue plateau:** "Your session rate is competitive but you're capped at 15 hours/week. The leverage move is courses -- time investment is front-loaded but revenue compounds."
- **Imposter syndrome:** "Your session completion rate is 92% and your avg client rating is 4.7. The numbers say you're doing this well."
- **Content doubt:** "Your last module had an 89% completion rate. That's in the top 10% of courses on the platform."

### NAV_MAP (EdgeGuide)

| Chip Label | Nav Target |
|---|---|
| View full client list | `clients` |
| View client history | `clients` |
| Update course content | `courses` |
| View my content library | `courses` |
| View my public page | `profile` |
| Update schedule | `schedule` |
| View payment history | `earnings` |
| View feedback trends | `analytics` |

### ACTION_MAP (EdgeGuide)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Draft session agenda | Agenda drafted | Structured outline based on last session's action items and client goals. |
| Reschedule | Session rescheduled | Moved to next available slot. Client notified automatically. |
| Message [client name] | Message sent | Quick check-in sent to their inbox. |
| Schedule check-ins | Check-ins scheduled | 3 follow-up sessions added to your calendar for this week. |
| Save notes | Notes saved | Session notes attached to client record. Visible in client history. |
| Send action items to client | Action items sent | Client received their 3 action items with due dates. |
| Schedule follow-up | Follow-up scheduled | Next session booked. Calendar invite sent. |
| Draft a lesson outline | Outline drafted | Module structure created with learning objectives. Ready to edit. |
| Assign to group | Study plan assigned | 12 members in the group will see the plan in their dashboard. |
| Add resources | Resources added | 3 resources linked to the study plan modules. |
| Set rate increase | Rate updated | New rate effective for sessions booked after today. Existing bookings unchanged. |
| Optimize my profile | Profile optimized | Updated headline, bio, and specializations based on your top-performing content. |
| Draft a post for SocialEdge | Draft ready | Post created highlighting your expertise. Ready to publish. |
| Share booking link | Link copied | Your public booking URL is ready to share. |
| Block time off | Time blocked | Availability updated. No bookings during this period. |

---

## 21. EdgeEmployer (Hiring Manager)

### Role Context

Hiring managers posting jobs, reviewing applicants, managing a pipeline, and analyzing hiring metrics. They interact with EdgeSight Analytics, career fairs, and EEO compliance tools.

### Sophia's Persona Shift

Sophia becomes a **recruiting operations partner**. She surfaces pipeline insights, helps draft job descriptions, identifies bottlenecks, and provides hiring analytics. Data-forward, efficiency-focused.

- **Tone:** "Your pipeline has a bottleneck at...", "3 candidates are ready for next stage...", "This JD is missing..."
- **Never:** Career seeker language, empathetic career coaching tone

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| Pipeline check | ask | 47 candidates across 3 roles |
| Review new applicants | ask | 12 new since yesterday |
| How's my time-to-hire? | ask | Currently 24 days avg |

### Route Categories & Key Scenarios

#### Pipeline Management (4 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `emp-pipeline` | "pipeline", "candidate pipeline", "where are we" | Metric (total candidates, by stage, conversion rates) + Comparison (funnel: applied -> screened -> phone -> onsite -> offer) | Where's the bottleneck? (ask) / View candidates at [stage] (navigate) / Compare to benchmark (ask) |
| `emp-bottleneck` | "bottleneck", "stuck candidates", "slow hiring", "taking too long" | Metric (stage-by-stage time, where delays are) + Checklist (unblock: schedule interviews, send feedback, follow up) | Schedule batch interviews (action) / Draft rejection emails (action) / Show me the data (navigate) |
| `emp-candidates` | "new applicants", "review candidates", "who applied" | Cards (top candidates: name, match score, experience, applied date) | Compare top 3 (ask) / Move to phone screen (action) / View full applicant list (navigate) |
| `emp-compare-candidates` | "compare candidates", "who should i interview", "rank candidates" | Comparison (skills, experience, culture fit, availability, salary expectations) | Schedule interviews (action) / Request more info (action) / Reject with feedback (action) |

#### Job Posting (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `emp-post-job` | "post a job", "new listing", "create posting" | Checklist (title, description, requirements, salary, location, type, EEO tags) | Draft job description (action) / Use a template (navigate) / Preview listing (action) |
| `emp-jd-review` | "review job description", "improve my listing", "optimize posting" | Document (JD annotations: fix/warn/good for inclusivity, clarity, keyword optimization) + Scorecard (JD quality score) | Apply fixes (action) / Add salary range (action) / See similar postings (navigate) |
| `emp-bulk-post` | "bulk upload", "CSV", "multiple jobs" | Checklist (CSV format requirements) + Text (instructions) | Download template (action) / Upload CSV (navigate) / Help me format (ask) |

#### Analytics (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `emp-analytics` | "hiring analytics", "metrics", "how are we doing" | Metric (time-to-hire, cost-per-hire, offer acceptance rate, pipeline velocity) | Compare to industry (ask) / Where can we improve? (ask) / Open EdgeSight (navigate) |
| `emp-benchmark` | "benchmark", "industry comparison", "how do we compare" | Comparison (your metrics vs. industry avg vs. top quartile) | What's dragging us down? (ask) / Set improvement targets (action) |
| `emp-diversity` | "diversity", "EEO", "inclusion", "representation" | Metric (diversity stats by stage) + Comparison (pipeline vs. hired demographics) | Configure EEO settings (navigate) / Improve JD inclusivity (ask) |

#### EdgeEmployer Emotional Register

- **Pipeline frustration:** "The bottleneck is at phone screen -- 8 candidates have been waiting 5+ days. Scheduling 3 batch slots this week would clear the backlog."
- **Bad hire fear:** "Your structured interview process reduces mis-hire risk by 40%. The comparison data shows a clear top candidate."
- **Time pressure:** "Hiring takes longer than anyone plans for. Your conversion rate is actually above industry average -- the volume is the issue, not the quality."

### NAV_MAP (EdgeEmployer)

| Chip Label | Nav Target |
|---|---|
| View candidates at [stage] | `pipeline` |
| View full applicant list | `applications` |
| Open EdgeSight | `analytics` |
| Use a template | `jobs` |
| See similar postings | `jobs` |
| Configure EEO settings | `settings` |
| Download template | `jobs` |
| Show me the data | `analytics` |
| Upload CSV | `jobs` |

### ACTION_MAP (EdgeEmployer)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Schedule batch interviews | Interviews scheduled | 3 time slots created. Calendar invites sent to candidates and interviewers. |
| Draft rejection emails | Drafts ready | Personalized rejection emails for 5 candidates. Review before sending. |
| Move to phone screen | Candidate advanced | Moved to Phone Screen stage. Notification sent. |
| Request more info | Request sent | Follow-up email sent to candidate requesting additional materials. |
| Reject with feedback | Rejection sent | Constructive feedback email sent. Candidate record updated. |
| Draft job description | JD drafted | Based on similar roles and your company profile. Ready to edit. |
| Preview listing | Preview ready | Job listing preview generated. Review before publishing. |
| Apply fixes | JD updated | 3 inclusivity and clarity fixes applied. Quality score improved. |
| Add salary range | Salary added | Range added to listing. Listings with salary get 30% more applicants. |
| Download template | Template downloaded | CSV template with all required fields and examples. |
| Set improvement targets | Targets set | Improvement goals added to your EdgeSight dashboard. |
| Schedule interviews | Interviews scheduled | Time slots created and invites sent. |

---

## 22. EdgeEducation (Institution Staff)

### Role Context

University/college career services staff managing students, tracking placement outcomes, hosting career fairs, connecting with employers. Sub-roles: Admin (full access), Grad Services, Undergrad Services, Counselor. Each has different permissions but shares the same Sophia.

### Sophia's Persona Shift

Sophia becomes an **institutional operations analyst**. She surfaces student outcomes data, identifies at-risk students, helps prepare compliance reports, and manages employer relationships. She's NACE/CSEA-aware.

- **Tone:** "Your placement rate this quarter is...", "12 students haven't completed outcome surveys...", "The career fair has 8 confirmed employers..."
- **Never:** Individual career advice (she does that for students, not staff), casual language

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| Outcome survey status | ask | 67% response rate, 34 pending |
| Upcoming career fair check | ask | Spring Fair in 12 days, 8 booths filled |
| Students needing follow-up | ask | 5 students at risk of disengagement |

### Route Categories & Key Scenarios

#### Student Management (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `edu-student-status` | "student status", "how are students doing", "at-risk students" | Cards (at-risk students: name, last active, issues) + Metric (active students, engagement rate, avg progress) | Message these students (action) / View student details (navigate) / Assign to counselor (action) |
| `edu-student-groups` | "student groups", "cohorts", "by major" | Comparison (group comparison: size, avg progress, placement rate, engagement) | Create new group (navigate) / Send broadcast (action) / Export data (action) |
| `edu-office-hours` | "office hours", "appointments", "counseling schedule" | Timeline (upcoming appointments: student, reason, time) + Checklist (prep for each) | View student file (navigate) / Reschedule (action) / Block time off (action) |

#### Outcomes & Compliance (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `edu-outcomes` | "outcomes", "placement rate", "NACE", "CSEA", "report" | Metric (placement rate, knowledge rate, survey response rate) + Comparison (by cohort, by program) | Who hasn't responded? (ask) / Generate evidence package (action) / Compare to last year (ask) |
| `edu-survey-status` | "survey status", "who hasn't responded", "outreach" | Cards (non-respondents: name, last contact, attempts) + Checklist (outreach steps) | Send reminder batch (action) / Draft personal outreach (action) / View response trends (navigate) |
| `edu-evidence` | "evidence package", "compliance report", "export" | Checklist (evidence package components: survey data, verification records, outcome categories, employment data) | Generate ZIP (action) / Preview report (navigate) / Verify pending records (navigate) |

#### Career Fairs & Employers (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `edu-fair-status` | "career fair", "fair status", "upcoming fair" | Metric (registered employers, booth count, student registrations) + Timeline (fair timeline: registration -> employer deadline -> student RSVP -> event day) | Invite more employers (action) / Send student reminder (action) / View booth assignments (navigate) |
| `edu-employer-hub` | "employer relationships", "partnerships", "recruiter engagement" | Cards (top employer partners: company, health score, hires this year, engagement) + Metric (partnership health overall) | Contact [employer] (action) / View interaction log (navigate) / Schedule meeting (action) |
| `edu-alumni` | "alumni mentors", "mentor matching", "alumni" | Cards (available mentors: name, industry, capacity, avg rating) + Metric (mentor program stats) | Match to students (action) / Invite new mentors (action) / View program analytics (navigate) |

#### EdgeEducation Emotional Register

- **Survey fatigue:** "Outcome reporting is tedious but your data is helping 200+ students this year. 67% response rate is above the national average."
- **Low engagement:** "5 students dropped off this month. A quick personal message re-engages 60% of inactive students within a week."
- **Fair pressure:** "8 employers confirmed with 12 days to go. Last year at this point you had 6. You're ahead."

### NAV_MAP (EdgeEducation)

| Chip Label | Nav Target |
|---|---|
| View student details | `students` |
| View student file | `students` |
| Create new group | `students` |
| View response trends | `analytics` |
| Preview report | `outcomes` |
| Verify pending records | `outcomes` |
| View booth assignments | `fairs` |
| View interaction log | `employers` |
| View program analytics | `analytics` |

### ACTION_MAP (EdgeEducation)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Message these students | Messages sent | Personal check-in sent to 5 at-risk students. |
| Assign to counselor | Students assigned | 3 students assigned to available counselors. Sessions auto-suggested. |
| Send broadcast | Broadcast sent | Message delivered to all 45 members of the selected group. |
| Export data | Export ready | CSV with group analytics downloaded. |
| Generate evidence package | Evidence package generating | Compiling survey data, verification records, and outcome categories. ZIP will be ready in ~2 minutes. |
| Send reminder batch | Reminders sent | Survey reminder sent to 34 non-respondents. Follow-up scheduled in 5 days. |
| Draft personal outreach | Outreach drafted | Personalized message for [student name]. Review before sending. |
| Invite more employers | Invitations sent | Outreach email sent to 10 targeted employers based on industry match. |
| Send student reminder | Reminder sent | Career fair reminder sent to all registered students with event details. |
| Contact [employer] | Message drafted | Personalized message for [company name] ready to send. |
| Schedule meeting | Meeting scheduled | Calendar invite sent. Video room auto-created. |
| Match to students | Matches created | 5 student-mentor matches suggested based on industry and interests. Review before confirming. |
| Invite new mentors | Invitations sent | Outreach sent to 8 alumni with mentoring potential. |
| Reschedule | Appointment moved | Rescheduled to next available slot. Student notified. |
| Block time off | Time blocked | Office hours blocked. Students see updated availability. |

---

## 23. EdgeNGO (Non-Profit Organization)

### Role Context

Non-profit organizations publishing career resources, posting jobs within their org, hosting events, tracking engagement analytics, and managing community programs. They cannot apply to jobs, and don't have resume/interview/productivity tools.

### Sophia's Persona Shift

Sophia becomes a **program impact analyst**. She helps NGOs understand their reach, optimize resource publishing, and track community engagement. Focused on impact metrics and community outcomes.

- **Tone:** "Your workshop reached 340 participants...", "This resource has a 23% click-through rate...", "3 programs are underperforming..."
- **Never:** Individual career advice, job application language

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| Community engagement this week | ask | 1,200 resource views, 45 event signups |
| Program performance check | ask | 3 active programs, 1 needs attention |
| Draft a resource post | ask | Publish to the platform catalog |

### Route Categories & Key Scenarios

#### Resource & Program Management (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `ngo-resources` | "my resources", "what's performing", "engagement" | Cards (top resources by views/clicks) + Metric (total views, click-through rate, signups) | Create new resource (navigate) / Boost underperforming (ask) / View analytics (navigate) |
| `ngo-programs` | "programs", "workforce programs", "impact" | Metric (participants, completion rate, employment outcomes) + Comparison (program-by-program breakdown) | Which program needs help? (ask) / Create new program (navigate) / Export impact report (action) |
| `ngo-publish` | "publish", "create resource", "post a resource" | Checklist (resource publishing: type selection, title, description, target audience, category tags) | Preview listing (action) / Schedule publication (action) / View catalog (navigate) |

#### Community & Events (2 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `ngo-events` | "events", "workshops", "career events" | Timeline (upcoming events with registration count) + Cards (past events with attendance data) | Create new event (navigate) / Promote event (action) / View event analytics (navigate) |
| `ngo-community` | "community feed", "announcements", "post update" | Draft (announcement draft for community feed) | Publish now (action) / Schedule for later (action) / Preview (action) |

#### EdgeNGO Emotional Register

- **Low engagement:** "Your resume workshop had lower attendance this month, but the completion rate was your highest ever. Quality over quantity."
- **Impact validation:** "Your free skills program placed 23 participants into jobs this quarter. That's a 34% placement rate -- above the national average for workforce programs."
- **Resource fatigue:** "Your top 3 resources account for 80% of engagement. Consider updating the others or archiving low-performers to keep the catalog focused."

### NAV_MAP (EdgeNGO)

| Chip Label | Nav Target |
|---|---|
| Create new resource | `resources` |
| View catalog | `resources` |
| View analytics | `analytics` |
| Create new event | `events` |
| View event analytics | `analytics` |
| Create new program | `programs` |

### ACTION_MAP (EdgeNGO)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Export impact report | Report generating | Compiling program outcomes, participation data, and engagement metrics. PDF ready in ~1 minute. |
| Preview listing | Preview ready | Resource listing preview generated. Review before publishing. |
| Schedule publication | Publication scheduled | Resource will publish at your chosen date and time. |
| Promote event | Promotion sent | Event shared to community feed and sent to 200+ subscribers. |
| Publish now | Published | Resource is now live in the platform catalog. |
| Schedule for later | Scheduled | Post will publish at your chosen time. |
| Preview | Preview ready | Draft preview generated. Review before publishing. |

---

## 24. EdgeAgency (Government Agency)

### Role Context

Government agencies managing grant distribution, workforce development programs, job posting for public-sector roles, and tracking program impact. Similar to NGO but with additional grant management and regulatory oversight capabilities.

### Sophia's Persona Shift

Sophia becomes a **workforce development operations partner**. She focuses on grant allocation efficiency, program outcomes, and compliance reporting. Formal but efficient.

- **Tone:** "Grant allocation for Q2 is at...", "12 applications pending review...", "Workforce program outcomes show..."
- **Never:** Casual language, individual career coaching, business advice

### Context Chips (Empty State)

| Chip | Type | Sub-text |
|---|---|---|
| Grant distribution status | ask | $240K allocated, $180K disbursed |
| Workforce program outcomes | ask | 3 active programs, 450 participants |
| Pending grant applications | ask | 12 applications awaiting review |

### Route Categories & Key Scenarios

#### Grant Management (3 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `gov-grants` | "grants", "grant status", "funding", "distribution" | Metric (total budget, allocated, disbursed, remaining) + Comparison (by program, by region) | Review pending applications (navigate) / Adjust allocations (ask) / Export financial report (action) |
| `gov-applications` | "grant applications", "pending review", "applicants" | Cards (pending applications: org name, amount requested, program, date) | Approve [org name] (action) / Request more info (action) / View application details (navigate) |
| `gov-impact` | "impact", "program outcomes", "workforce outcomes" | Metric (employment rate post-program, retention rate, avg earnings increase) + Comparison (program-by-program outcomes) | Generate impact report (action) / Which program is most effective? (ask) / Compare to targets (ask) |

#### Programs & Events (2 scenarios)

| Scenario ID | Triggers | Content Blocks | Followup Chain |
|---|---|---|---|
| `gov-programs` | "workforce programs", "training programs", "initiatives" | Timeline (active programs with participant counts and completion rates) + Metric (program health) | Create new program (navigate) / View participant data (navigate) / Adjust program (ask) |
| `gov-events` | "career fairs", "job expos", "training events" | Timeline (upcoming events) + Metric (registration stats) | Create event (navigate) / Promote event (action) / View past events (navigate) |

#### EdgeAgency Emotional Register

- **Budget pressure:** "75% of Q2 allocation is disbursed with 2 months remaining. Current burn rate is sustainable."
- **Impact validation:** "These programs are changing employment outcomes for real communities. Post-program employment rate is 67% -- above the 55% target."
- **Compliance concern:** "All active programs are within reporting requirements. The next compliance deadline is 6 weeks out."

### NAV_MAP (EdgeAgency)

| Chip Label | Nav Target |
|---|---|
| Review pending applications | `grants` |
| View application details | `grants` |
| Create new program | `programs` |
| View participant data | `programs` |
| Create event | `events` |
| View past events | `events` |

### ACTION_MAP (EdgeAgency)

| Action Label | Confirmation Message | Detail |
|---|---|---|
| Export financial report | Report generating | Compiling grant allocation, disbursement, and remaining budget data. PDF ready in ~1 minute. |
| Approve [org name] | Grant approved | Approval notification sent. Funds queued for disbursement. |
| Request more info | Request sent | Follow-up email sent to applicant organization requesting additional documentation. |
| Generate impact report | Impact report generating | Compiling employment outcomes, retention data, and program metrics across all active programs. |
| Promote event | Promotion published | Event shared to platform feed and sent to registered organizations. |

---

## 25. Cross-Role Shared Scenarios

Some scenarios are shared across multiple roles with role-appropriate data injected at render time:

### Messages & Communication (all roles)

| Scenario ID | Triggers | Content Blocks |
|---|---|---|
| `shared-messages` | "messages", "inbox", "unread" | Cards (recent messages) + Metric (unread count) |
| `shared-draft-message` | "draft a message", "write to", "send a message" | Draft (message draft with recipient context) |

### EdgeGas & Gamification (all roles)

| Scenario ID | Triggers | Content Blocks |
|---|---|---|
| `shared-edgegas` | "my EdgeGas", "credits", "points", "how many credits" | Metric (current balance, earned this month, spent) + Comparison (earning opportunities relevant to role) |
| `shared-rank` | "my rank", "EdgeRank", "level", "leaderboard" | Metric (current rank, XP, next level threshold) + Timeline (rank progression) |

### ScheduleEdge (EdgeStar, EdgeGuide, EdgeEmployer, EdgeEducation)

| Scenario ID | Triggers | Content Blocks |
|---|---|---|
| `shared-schedule` | "my schedule", "calendar", "upcoming" | Timeline (next 7 days of scheduled events) |
| `shared-book` | "book a session", "schedule meeting" | Checklist (booking flow steps) |

### Meta / Help (all roles)

| Scenario ID | Triggers | Content Blocks |
|---|---|---|
| `shared-capabilities` | "what can you do", "help", "what can you help with" | Comparison (role-specific capabilities matrix -- only shows features available to this role) |
| `shared-settings` | "settings", "preferences", "account" | Checklist (common settings: notifications, privacy, accessibility) |

---

## 26. Sophia's Tone Matrix Across Roles

The warmth mapping (warm for emotional moments, direct for functional) applies to every role, but the CONTENT of each mode differs:

| Role | Direct Mode Example | Warm Mode Example |
|---|---|---|
| **EdgeStar** | "3 fixes needed. ATS score: 72." | "You've built more in two weeks than most do in two months." |
| **EdgePreneur** | "Burn rate: $8K/mo. Runway: 6 months." | "Pivoting isn't failing. Your market signal is telling you something." |
| **EdgeParent** | "Phase 2 starts next week. Budget on track." | "They're making progress even when it doesn't look like it." |
| **EdgeGuide** | "12 active clients. 3 behind on action items." | "Your session completion rate is 92%. The numbers say you're doing this well." |
| **EdgeEmployer** | "Pipeline bottleneck at phone screen. 8 candidates waiting." | "Hiring takes longer than anyone plans for. Your conversion rate is actually above average." |
| **EdgeEducation** | "67% survey response rate. 34 pending." | "Outcome reporting is tedious but your data is helping 200+ students this year." |
| **EdgeNGO** | "Workshop attendance: 340. Cost per participant: $12." | "Your free resume workshop had the highest completion rate on the platform this month." |
| **EdgeAgency** | "12 applications pending. $60K unallocated." | "These programs are changing employment outcomes for real communities." |

---

## 27. Scenario Count Summary

| Role | Route Categories | Scenarios | Actions | Nav Targets |
|---|---|---|---|---|
| EdgeStar | 11 | 48 | 35 | 15 |
| EdgePreneur | 4 | 13 | 11 | 5 |
| EdgeParent | 3 | 10 | 6 | 4 |
| EdgeGuide | 3 | 10 | 15 | 8 |
| EdgeEmployer | 3 | 10 | 12 | 9 |
| EdgeEducation | 3 | 9 | 15 | 9 |
| EdgeNGO | 2 | 5 | 7 | 6 |
| EdgeAgency | 2 | 5 | 5 | 6 |
| Shared (cross-role) | 3 | 8 | -- | -- |
| **Total** | -- | **118** | **106** | **62** |

---

## 28. Implementation Priority

Based on release phases from the PRD:

| Priority | Role | Phase | Rationale |
|---|---|---|---|
| P0 (build now) | EdgeStar | Phase 1 | Primary user, 80%+ of early traffic, fully designed |
| P1 (next sprint) | EdgePreneur | Phase 3 | Second consumer role, distinct surface |
| P1 (next sprint) | EdgeGuide | Phase 3 | Revenue-generating role, coach tools |
| P2 (following sprint) | EdgeEmployer | Phase 3 | B2B role, pipeline tools |
| P2 (following sprint) | EdgeParent | Phase 3 | Support role, simpler surface |
| P3 (later) | EdgeEducation | Phase 4 | Institutional, complex compliance |
| P4 (ecosystem) | EdgeNGO | Phase 5 | Community role |
| P4 (ecosystem) | EdgeAgency | Phase 5 | Government role |

### Build Strategy Per Role

1. **Implement EdgeStar fully** (done in current prototype, needs production wiring)
2. **For each new role:** Copy the architecture pattern (route table + scenarios + action map + nav map), replace the data, keep the same rendering engine and UI components
3. **The component code doesn't change.** Only the data layer (scenarios, maps) is role-specific
4. **Shared scenarios** are registered once and available to all roles
5. **Role detection** happens at the auth/session level and injects `userRole` into the routing function

---

## 29. Architecture Diagram

```
                    +-------------------+
                    |   Auth Context    |
                    |  (userRole, user) |
                    +--------+----------+
                             |
                             v
+----------------------------+----------------------------+
|                    Sophia Engine                         |
|                                                          |
|  +-------------+    +---------------+    +------------+  |
|  | Route Table |    | Scenario Data |    | Action Map |  |
|  | (per role)  |--->| (per role)    |    | (per role) |  |
|  +-------------+    +---------------+    +------------+  |
|         |                  |                    |         |
|         v                  v                    v         |
|  +------------------------------------------------------+|
|  |              Conversation Engine                      ||
|  |  routeQuery() -> getScenario() -> renderMessages()   ||
|  +------------------------------------------------------+|
|         |                                                 |
|         v                                                 |
|  +------------------------------------------------------+|
|  |              Rendering Layer (shared)                 ||
|  |  11 content blocks + 3 chip types + motion specs     ||
|  |  Float-to-Panel UI + typing indicator + scroll       ||
|  +------------------------------------------------------+|
|                                                          |
+----------------------------------------------------------+
                             |
                             v
                    +--------+----------+
                    |   Shell / App     |
                    |  onNavigate()     |
                    |  onClose()        |
                    +-------------------+
```

The rendering layer is 100% role-agnostic. Every role uses the same:
- 11 content block renderers
- 3 chip type behaviors (ask/action/navigate)
- Float-to-Panel interaction model
- Motion specs and timing
- Visual treatment (colors, fonts, glass effects)
- Conversation engine (typing indicator, message stagger, auto-scroll)

Only the DATA changes per role. This is the key architectural insight.
