# Multi-Role Shell Architecture

**Purpose:** Define the navigation, dashboard, and routing for all 8 roles before building.

---

## The Cohesion Principle

You're right — cohesion across roles is non-negotiable. The current EdgeStar synthesis uses **H2's top nav bar** (horizontal pills, no sidebar, Sophia bar at bottom). Every role gets the same shell structure:

```
┌─────────────────────────────────────────────────────────────┐
│  [✦ CareerEdge]    [ pill | pill | pill | pill ]    [🔔 AV] │  ← Top nav (same structure)
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   Role-specific content                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ✦ Sophia: [contextual to role + state]     [Ask Sophia ▸] │  ← Sophia bar
└─────────────────────────────────────────────────────────────┘
```

What changes per role: pill labels, pill icons, pill count, dashboard cards, Sophia's context. What stays the same: layout, glass treatment, animation timing, typography, spacing, Sophia bar behavior, logo placement, notification/avatar position.

No sidebar for any role. The IA doc proposed it, but H2 won the synthesis for good reason — horizontal pills handle 3-5 items elegantly, and no role exceeds 5 nav items. Sidebar would fragment the visual language.

---

## Role Navigation Map

| Role | Nav Pills | Dashboard Hero |
|------|-----------|----------------|
| **EdgeStar** | Home · Roadmap · Resume · Jobs · Messages (5) | Roadmap progress + job matches + Sophia greeting |
| **EdgePreneur** | Home · Roadmap · Tasks · Messages (4) | Business roadmap + milestone velocity + Sophia |
| **EdgeParent** | Home · Family · Messages (3) | Child's progress summary + roadmap read-only + Sophia |
| **EdgeGuide** | Home · Sessions · Clients · Earnings · Messages (5) | This week's sessions + earnings + client outcomes |
| **EdgeEmployer** | Home · Jobs · Pipeline · Analytics · Messages (5) | Open positions + applicant funnel + hiring velocity |
| **EdgeEducation** | Home · Students · Events · Outcomes · Messages (5) | Student adoption + career readiness + upcoming events |
| **EdgeNGO** | Home · Programs · Jobs · Impact · Messages (5) | Active programs + participant outcomes + community jobs |
| **EdgeAgency** | Home · Programs · Jobs · Impact · Messages (5) | Workforce programs + grant utilization + job placements |

### Observations
- Every role has Home and Messages. Those are constants.
- EdgeNGO and EdgeAgency share identical nav structure — differentiated by dashboard data and Sophia's context, not navigation shape.
- EdgeParent is the lightest (3 pills). The dashboard does more heavy lifting since the nav is sparse.
- No role exceeds 5 pills. Top nav handles this perfectly.

---

## Dashboard Compositions (Per Role)

### EdgeStar (BUILT — reference pattern)
- **Sophia greeting** + contextual sentence
- **KPI row:** Career Score, EdgeGas, ATS Score, Applications
- **Roadmap strip:** horizontal phase progress
- **Two-column cards:** Next action + top job matches (left), Activity feed + upcoming sessions (right)
- **Sophia bar:** "You have 3 new job matches" + chips

### EdgePreneur
- **Sophia greeting:** "Good morning, Marcus. Your pitch deck milestone is 80% complete."
- **KPI row:** Business Score, EdgeGas, Milestones Completed, Network Connections
- **Roadmap strip:** Business roadmap phases (Validate → Build → Launch → Scale)
- **Two-column cards:** Current milestone focus (left), Advisor sessions + community activity (right)
- **Sophia bar:** "Your market validation survey has 12 responses. Want to analyze the results?"

### EdgeParent
- **Sophia greeting:** "Good afternoon, David. Alex made progress on their roadmap this week."
- **KPI row (simplified):** Child's Roadmap Progress, Tasks Completed This Week, Next Session
- **Child's roadmap strip:** read-only visualization of the linked child's EdgePath progress
- **Single-column cards:** Weekly progress summary, Recent milestones, Upcoming sessions/events
- **Sophia bar:** "Alex completed 2 milestones this week. Their interview prep is next."
- **Tone:** Supportive, not surveillance. "Here's how Alex is growing" not "Here's what Alex hasn't done."

### EdgeGuide
- **Sophia greeting:** "Good morning, Alice. You have 3 sessions today."
- **KPI row:** Sessions This Week, Monthly Earnings, Client Satisfaction, Active Clients
- **This week's calendar strip:** daily session blocks with client names
- **Two-column cards:** Today's sessions with prep briefs (left), Client progress summaries + pending reviews (right)
- **Sophia bar:** "Sharon's session is in 2 hours. She just completed a major milestone — suggest discussing portfolio structure."

### EdgeEmployer
- **Sophia greeting:** "Good morning, Rachel. 14 new applicants across your open roles."
- **KPI row:** Open Positions, Total Applicants, Interview Pipeline, Time-to-Hire Avg
- **Hiring funnel strip:** visual pipeline (Applied → Screened → Interview → Offer) with counts
- **Two-column cards:** Active job postings with applicant counts (left), Top candidates + upcoming interviews (right)
- **Sophia bar:** "3 candidates for Product Designer scored 90%+ match. Want to review them?"

### EdgeEducation
- **Sophia greeting:** "Good morning, Dr. Martinez. 23 students are actively using CareerEdge this week."
- **KPI row:** Student Adoption Rate, Career Readiness Score (avg), Employer Partnerships, Upcoming Events
- **Outcomes strip:** NACE/CSEA progress bars (knowledge, placement rates, skill acquisition)
- **Two-column cards:** Student cohort progress (left), Upcoming career fairs + office hours (right)
- **Sophia bar:** "Your Spring 2026 cohort has 68% career readiness — up from 52% last semester."

### EdgeNGO
- **Sophia greeting:** "Good morning, James. Your workforce program has 45 active participants."
- **KPI row:** Active Programs, Participants, Job Placements This Month, Grant Utilization
- **Program strip:** active programs with participation rates
- **Two-column cards:** Program outcomes (left), Community jobs + upcoming events (right)
- **Sophia bar:** "12 participants completed interview prep this week. Placement rate is trending up."

### EdgeAgency
- **Sophia greeting:** "Good morning, Director Liu. 3 workforce development programs are in progress."
- **KPI row:** Active Programs, Total Participants, Placements, Budget Utilization
- **Program strip:** programs with milestone tracking
- **Two-column cards:** Program metrics by region (left), Upcoming events + stakeholder reports (right)
- **Sophia bar:** "Q1 placement targets are 78% achieved. The tech reskilling program is outperforming."

---

## Routing & Onboarding Connection

### How onboarding maps to role shells

The H2 onboarding flow captures role at the "sub" step:
```
Intent → Sub-role → Target/Context → Level → Building → Ready → Signup
```

Sub-role IDs already in onboarding code:
- `edgestar` → EdgeStar shell
- `edgepreneur` → EdgePreneur shell  
- `parent` → EdgeParent shell
- `guide` → EdgeGuide shell
- `employer` → EdgeEmployer shell
- `edu` → EdgeEducation shell
- `ngo` → EdgeNGO shell
- `agency` → EdgeAgency shell

After signup, the app routes to the correct role's dashboard. The `handleAuth` callback in App.tsx needs to be role-aware.

### Surface routing per role

Each role's nav pills map to surfaces:

**EdgeStar:** home→synthesis, roadmap→edgepath, resume→resume, jobs→jobs, messages→messages
**EdgePreneur:** home→preneur-dash, roadmap→preneur-roadmap, tasks→preneur-tasks, messages→messages
**EdgeParent:** home→parent-dash, family→parent-family, messages→messages
**EdgeGuide:** home→guide-dash, sessions→guide-sessions, clients→guide-clients, earnings→guide-earnings, messages→messages
**EdgeEmployer:** home→employer-dash, jobs→employer-jobs, pipeline→employer-pipeline, analytics→employer-analytics, messages→messages
**EdgeEducation:** home→edu-dash, students→edu-students, events→edu-events, outcomes→edu-outcomes, messages→messages
**EdgeNGO:** home→ngo-dash, programs→ngo-programs, jobs→ngo-jobs, impact→ngo-impact, messages→messages
**EdgeAgency:** home→agency-dash, programs→agency-programs, jobs→agency-jobs, impact→agency-impact, messages→messages

For this sprint: only the dashboard (home) surface is fully built per role. Other nav pills show a placeholder surface indicating the surface exists but is pending build. This lets us test navigation + dashboard without building every sub-surface for every role.

### What the tester sees

1. Open app → Landing page
2. Sign up → Onboarding H2 → select role (e.g., "Hiring talent" = EdgeEmployer)
3. Complete onboarding → drops into EdgeEmployer dashboard with correct nav pills
4. Nav pills work — clicking "Jobs" shows the employer's job posting surface (or placeholder)
5. Role badge visible in header — "EdgeEmployer"
6. Sophia bar is contextual to the role

### Dev toggle (existing pattern)

The existing dev toolbar at bottom-right gets a role switcher added. Quick-switch between all 8 roles without re-doing onboarding. This is for testing only.

---

## Build Plan

### Shared components (build once, used by all)
1. `<RoleShell>` — the universal shell with top nav + Sophia bar. Accepts `role` prop, renders correct pills.
2. `<TopNavBar>` — extracted from shell-synthesis.tsx. Accepts `pills[]` prop.
3. `<SophiaBar>` — extracted from shell-synthesis.tsx. Accepts `context` prop.
4. `<DashboardKPIRow>` — reusable KPI card row. Accepts `cards[]` prop.
5. `<RoleBadge>` — small pill showing current role in header.

### Per-role components (unique to each)
Each role gets one file: `<[Role]Dashboard>` containing their dashboard composition. They all use the shared components above but with role-specific data, labels, and Sophia context.

### Onboarding connection
Modify H2 onboarding's completion handler to pass the selected sub-role ID. App.tsx uses this to set the active role and render the correct shell.

---

## Product OS Validation

**Design:** One job per screen? Yes — each dashboard answers "What should I do next?" for that role. 30-second comprehension? Yes — KPI row + Sophia greeting tells the story instantly. Empty/error/loading states? Each role has Day 0 coaching from Sophia.

**PM:** Does this move metrics? Each dashboard drives the role's primary action (apply for EdgeStar, post for EdgeEmployer, book for EdgeGuide, monitor for EdgeParent). Tied to North Star per role.

**Engineering:** Scalable? One shell component, role-based data switching. Adding a 9th role is a config change, not a structural change.

**Brand:** Cohesive? Same glass treatment, same animation system, same typography, same Sophia personality (adjusted tone per context, not per role). Role badge is the only visual indicator of which role is active.

**Motion:** Same entrance animations across all roles. KPI count-up, staggered card reveal, Sophia bar slide-up. No role gets special motion treatment — cohesion.

**AI:** Sophia's context changes per role but her behavior is identical: greeting, insight, suggestion chips, Ask Sophia expansion. She remembers everything from onboarding — never re-asks.
