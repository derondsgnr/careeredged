# CareerEdge Implementation Audit — Affordance Gaps, Dead Ends, and Confusing Entry Points

**Date:** March 18, 2026  
**Context:** Full system audit of all 8 role implementations  
**Cross-referenced with:** PRD, Onboarding Architecture, Flow Audit, Shared Surfaces Audit

---

## EXECUTIVE SUMMARY

After auditing all 8 role implementations against the PRD and design documentation, I've identified **critical affordance gaps** that make core flows impossible to complete, numerous dead ends where clickable elements do nothing, and confusing entry points that don't match the PRD's intended journeys.

### SEVERITY BREAKDOWN

| Severity | Count | Description |
|----------|-------|-------------|
| **CRITICAL** | 8 | Core flows broken or impossible to complete (violates PRD journeys) |
| **HIGH** | 56+ | Dead interactive elements (buttons/links that do nothing) |
| **MEDIUM** | 15 | Missing role adaptations (surfaces only work for EdgeStar) |
| **LOW** | ~12 | Polish/UX improvements needed |

---

## PART 1: CRITICAL AFFORDANCE GAPS — BROKEN PRD JOURNEYS

These are **not** "missing features." These are flows the PRD explicitly defines as core user journeys, but there is **no UI affordance** to complete them.

### 🚨 CRITICAL #1: Parent Cannot Add or Link to Children

**PRD Journey (Parent role, line 28-29):**
> Journey: Sign-up → **Link to Child (QR)** → Involvement Level Setting → Read-Only Progress Tracking

**PRD Core Feature (lines 188-189):**
> Parent-Child Link: Parent scans child's QR to view read-only roadmap

**Current Implementation:**
- ✅ Parent can sign up
- ✅ Parent dashboard exists (`/src/app/components/dashboards/edgeparent-dashboard.tsx`)
- ❌ **ZERO affordance to link to a child**
- ❌ No QR scanner
- ❌ No "Add child" button
- ❌ No connection flow
- ❌ Dashboard shows hardcoded "Alex" with no way to change or add children

**User Impact:**
A parent completes onboarding, lands on dashboard, sees someone else's child ("Alex"), and has **no way** to connect to their actual child. The entire role is non-functional.

**Location to fix:**
- `/src/app/components/dashboards/edgeparent-dashboard.tsx` — Add "Connect to child" empty state or action button
- `/src/app/components/onboarding-h2.tsx` (lines 102-116) — After role confirmation, add QR scan step for parents

**Recommended fix:**
1. After parent completes onboarding, show: "Scan your child's QR code to link accounts"
2. QR scanner component (reference Sophia interaction patterns from `sophia-ask.tsx`)
3. Empty state on dashboard: "No children connected yet. Scan QR code to get started."

---

### 🚨 CRITICAL #2: EdgeBuddy / Peer Accountability — No Entry Point

**PRD Feature (lines 91, 187-188):**
> Accountability: QR-based session pairing with Edge Buddies  
> Edge Buddy Match: Generate/Scan QR to connect with a peer for accountability

**Current Implementation:**
- ❌ No "Find Edge Buddy" button anywhere
- ❌ No QR code generation for pairing
- ❌ No Edge Buddy list/roster
- ❌ Mentions in docs but zero UI affordance

**User Impact:**
PRD positions this as a core EdgeStar/EdgePreneur feature. Users have no way to discover or use it.

**Recommended fix:**
1. Add "Find accountability partner" card to EdgeStar/EdgePreneur dashboards
2. QR-based pairing flow (generate → scan → confirm)
3. Edge Buddy section showing connected peers

---

### 🚨 CRITICAL #3: QR Check-in for Events — No Institution Flow

**PRD Feature (lines 39, 190):**
> Key Action: QR Check-ins. Automates attendance tracking for physical and virtual workshops  
> Event Check-in: Student scans event QR (or Institution scans student QR) for attendance

**Current Implementation:**
- ✅ EdgeEducation dashboard exists
- ❌ No event creation UI
- ❌ No QR code generation for events
- ❌ No attendance tracking
- ❌ "Events" nav pill exists but does nothing (opens Sophia prompt)

**User Impact:**
Educational institutions can't create events, can't track attendance. Core value prop missing.

**Recommended fix:**
1. Event management surface (create event → generate QR)
2. QR scanner for check-ins
3. Attendance roster/analytics

---

### 🚨 CRITICAL #4: Coach/Mentor Onboarding Missing Portfolio Setup

**PRD Journey (lines 45-46):**
> Journey: **Profile Verification → Portfolio Building** → Session Scheduling → Earnings Tracking

**Current Implementation:**
- ✅ Guide (coach/mentor) can sign up
- ❌ No portfolio builder
- ❌ No profile verification step
- ❌ No "Set up your coaching profile" flow
- ❌ Dashboard shows mock earnings but no profile setup affordance

**User Impact:**
Coaches complete onboarding but have no way to build the portfolio that clients would see when booking.

**Recommended fix:**
1. Post-onboarding: "Set up your coaching profile" flow
2. Portfolio builder (bio, specializations, rates, availability)
3. Profile preview

---

### 🚨 CRITICAL #5: NGO/Agency Grant Application — No UI

**PRD Feature (lines 54-56, 204):**
> System Logic: Grants can be applied for by NGOs/Institutions  
> Government Grant Portal: Browse grants, view deadlines, and apply (NGO/Institutions)

**Current Implementation:**
- ✅ EdgeNGO and EdgeAgency dashboards exist
- ❌ No grant portal
- ❌ No "Browse grants" surface
- ❌ No application form
- ❌ Agency dashboard has "Active Programs" but no grant creation

**User Impact:**
NGOs/Agencies can't apply for funding. Government agencies can't create grants. Core multi-sided marketplace broken.

**Recommended fix:**
1. Grant browser (Agency creates, NGO/Edu browses)
2. Application flow
3. Application tracking

---

### 🚨 CRITICAL #6: Employer Job Posting — No Creation Flow

**PRD Feature (line 204):**
> Job Board: Filter by career path and location, **apply directly**

**Current Implementation:**
- ✅ EdgeMatch shows jobs (browse mode for EdgeStar)
- ✅ EdgeMatch shows pipeline (employer view)
- ❌ **No "Post a job" button**
- ❌ No job creation form
- ❌ Employers can see mock pipeline but can't actually post jobs

**User Impact:**
Employers can't post jobs. The job board is view-only for everyone.

**Recommended fix:**
1. "Post a job" button on Employer EdgeMatch view
2. Job posting form (title, description, requirements, salary, etc.)
3. Posting confirmation → appears in pipeline

---

### 🚨 CRITICAL #7: Sophia Voice Mode — No Entry Point in Live Surfaces

**PRD Feature (line 272):**
> SOPHIA HAS THE ABILITY TO INTERACT VIA VOICE; USERS CAN CALL SOPHIE JUST LIKE CLAUDE VOICE

**Current Implementation:**
- ✅ Voice mode implemented in `sophia-ask.tsx` (ambient waveform, voice action cards)
- ❌ **No button to activate voice mode** in the Sophia overlay
- ❌ Users don't know voice exists
- ❌ Voice UI only appears in demo/dev mode

**User Impact:**
A signature feature (voice AI) is completely hidden from users.

**Recommended fix:**
1. Add microphone button to Sophia bottom bar and overlay
2. Visual indicator that voice is available
3. First-time tooltip: "Try asking Sophia by voice"

---

### 🚨 CRITICAL #8: Onboarding → Dashboard Handoff Broken for H1 and H3

**Documentation Reference (`flow-audit.md` line 75):**
> Onboarding H1 and H3 — No `onComplete` Callback. Only H2 fires `onComplete(role)` to transition to the dashboard with the correct role.

**Current Implementation:**
- ✅ H2 onboarding completes and navigates to correct role dashboard
- ❌ H1 onboarding completes but user is stuck (no navigation)
- ❌ H3 onboarding completes but user is stuck (no navigation)

**User Impact:**
If we ship H1 or H3 as the default onboarding, users finish onboarding and see nothing. Dead end.

**Location to fix:**
- `/src/app/components/onboarding-h1.tsx`
- `/src/app/components/onboarding-h3.tsx`

**Recommended fix:**
Add `onComplete` callback to both, matching H2's pattern.

---

## PART 2: HIGH PRIORITY — DEAD INTERACTIVE ELEMENTS (56+ instances)

These are elements styled as clickable (`cursor-pointer`, `onClick` handlers that do nothing, hover states) but with no actual functionality.

### Category A: Dead Nav Pills (15 instances)

**Reference:** `flow-audit.md` lines 16-30

Every role has nav pills that highlight on click but show no content. Only `home`, `jobs`, and `resume` (EdgeStar only) actually navigate.

| Role | Dead Pills | Current Behavior |
|------|-----------|------------------|
| **EdgeStar** | `messages` | Pill exists, navigates to `/edgestar/messages`, Messaging component renders |
| **EdgePreneur** | `roadmap`, `tasks` | Opens Sophia with prompt (not a surface) |
| **Parent** | `family` | Opens Sophia with prompt |
| **Guide** | `clients`, `earnings` (partial) | Clients: Sophia prompt; Earnings: navigates to analytics but shows wrong data |
| **Employer** | `pipeline`, `analytics` (partial) | Pipeline: Sophia prompt; Analytics: navigates but shows wrong data |
| **Education** | `students`, `events`, `outcomes` (partial) | Students/Events: Sophia prompts; Outcomes: navigates to analytics (wrong data) |
| **NGO** | `programs`, `impact` | Both open Sophia prompts |
| **Agency** | `programs`, `impact` | Both open Sophia prompts |

**Files to fix:**
- `/src/app/components/role-shell.tsx` (lines 52-169) — Nav pill configurations

**Recommended fix:**
Either (a) build the missing surfaces, or (b) make these open Sophia with better contextual responses (not generic prompts).

---

### Category B: Dead Dashboard Buttons (23+ instances)

**Reference:** `flow-audit.md` lines 34-39

Every role dashboard has "View all" links, "Full report" buttons, and individual card items styled with `cursor-pointer` but **zero `onClick` handlers**.

Examples from `/src/app/components/dashboards/`:

**EdgeParent Dashboard:**
- "View details" link on roadmap (line 61) — Works! (navigates to EdgePath)
- "View all activities" on weekly progress — Dead
- Individual milestone items in completed list — Dead
- "Send encouragement" button — Dead

**EdgePreneur Dashboard:**
- "View roadmap" — Dead
- "View all tasks" — Dead
- Revenue/funding cards — Dead
- Milestone cards — Dead

**EdgeGuide Dashboard:**
- "View all sessions" — Dead
- Individual client cards — Dead
- Earnings chart — Dead
- "View full report" — Dead

**EdgeEmployer Dashboard:**
- "View all openings" — Dead
- "View full pipeline" — Dead
- Individual job cards — Dead
- Candidate cards — Dead

**EdgeEducation Dashboard:**
- "View all students" — Dead
- Student cohort cards — Dead
- Event cards — Dead
- Outcomes chart — Dead

**EdgeNGO/Agency Dashboards:**
- Program cards — Dead
- "View all participants" — Dead
- Impact metrics — Dead

**Files to fix:**
All 7 dashboard files in `/src/app/components/dashboards/`

**Recommended fix:**
Wire every "View all" / "Full report" button to navigate to the relevant surface (EdgeMatch, EdgePath, Analytics, Sessions, etc.) or open a detail modal.

---

### Category C: Dead Elements in ShellSynthesis (EdgeStar Dashboard) (~8 instances)

**Reference:** `flow-audit.md` lines 42-47

The EdgeStar dashboard (`/src/app/components/shell-synthesis.tsx`) has some working elements (milestone cards navigate to Task Room) but several dead ones:

- Bell notification icon — Opens panel (works!) but individual notifications don't navigate
- Avatar/profile button — Opens dropdown (works!) but "Settings" and "Sign Out" don't work
- "Saved" / "Applied" filter tabs in job section — No filter logic
- "Ask Sophia about..." CTA — Dead (should open Sophia with pre-filled message)

**Recommended fix:**
1. Wire notification items to navigate to relevant surfaces
2. Wire "Settings" to settings surface or modal
3. Wire "Sign Out" to sign out and navigate to landing
4. Wire filter tabs to actually filter job list
5. Wire "Ask Sophia" CTAs to open Sophia overlay with pre-filled message

---

### Category D: Dead Task Room Elements (~8 instances)

**Reference:** `flow-audit.md` lines 82-88

Task Room (`/src/app/components/task-room.tsx`) has real milestone switching and Sophia conversation, but:

- Sidebar milestone items — `cursor-pointer` styling, no `onClick`
- Resource links — No `onClick`
- "Share progress" button — No `onClick`
- Completion celebration CTA buttons — No `onClick`

**Recommended fix:**
Wire all interactive elements.

---

### Category E: Profile Dropdown Dead Items (2 instances)

**Reference:** `flow-audit.md` lines 93-98

In RoleShell (`/src/app/components/role-shell.tsx`), the avatar dropdown has:
- "Settings" — No `onClick` handler
- "Sign Out" — No `onClick` handler

**Recommended fix:**
1. Settings → navigate to settings surface or modal
2. Sign Out → clear state, navigate to `/login`

---

### Category F: Notification Panel Dead Items (4 instances)

**Reference:** `flow-audit.md` lines 90-92

RoleShell notification panel opens, shows 4 notifications, but clicking them does nothing.

**Recommended fix:**
Wire each notification type to navigate to relevant surface:
- "New job match" → EdgeMatch
- "Session reminder" → Sessions
- "Milestone completed" → EdgePath or Task Room
- "Message received" → Messages

---

## PART 3: MEDIUM PRIORITY — ROLE ADAPTATION GAPS (15 instances)

Surfaces that exist but only work for EdgeStar. Other roles see EdgeStar's data.

### Issue 1: EdgePath Only Shows EdgeStar Roadmap

**Reference:** `flow-audit.md` lines 52-61, `shared-surfaces-and-flows-audit.md` lines 25-26

**Current state:**
All 8 roles see Sharon's (EdgeStar) career roadmap when navigating to `/[role]/edgepath`.

**PRD expectation:**
- EdgeStar: Career roadmap (current implementation)
- EdgePreneur: Business/venture roadmap
- Parent: Read-only view of child's roadmap
- Guide: Client roadmap with coaching annotations
- Employer/Edu/NGO/Agency: Not applicable

**Recommended fix:**
Gate EdgePath by role. Show empty state or Sophia redirect for roles where it doesn't apply.

---

### Issue 2: ResumeEdge Only Shows EdgeStar Resume

**Reference:** `flow-audit.md` lines 63-72

**Current state:**
All roles see Sharon's resume builder.

**PRD expectation:**
- EdgeStar/EdgePreneur: Full resume builder (current)
- Parent: Read-only view of child's resume
- Guide: Client resume review mode
- Employer: Not applicable (they see resumes via EdgeMatch applicant panel)
- Edu/NGO/Agency: Not applicable

**Recommended fix:**
Role-gate ResumeEdge.

---

### Issue 3: Task Room Only Has EdgeStar Milestones

**Current state:**
Task Room shows EdgeStar's "Build Portfolio" milestone for all roles.

**PRD expectation:**
- EdgeStar: Career milestones (current)
- EdgePreneur: Business milestones (pitch deck, MVP, etc.)
- Parent: Read-only progress view of child's task rooms
- Guide: Review/feedback mode on client task rooms

**Recommended fix:**
Role-based milestone data.

---

### Issue 4: Analytics Surface Only Has EdgeStar Data

**Reference:** `validation-report-surfaces-e2e.md` lines 137-139

**Current state:**
EdgeSight/Analytics surface exists but only has EdgeStar analytics (applications, ATS score, etc.).

**PRD expectation:**
- EdgeStar: Personal career analytics (current)
- Employer: Hiring pipeline analytics
- Edu: Student outcomes/placement rates
- Guide: Session stats, earnings, client progress
- NGO/Agency: Program impact metrics

**Recommended fix:**
Create role-based analytics layouts.

---

### Issue 5: Messaging Shows Same Threads for All Roles

**Current implementation:**
Messaging (`/src/app/components/messaging.tsx`) exists and renders, but thread data is hardcoded per role with placeholder names.

**PRD expectation:**
Different thread types per role (Application threads, Session threads, Group threads, etc.)

**Recommended fix:**
Role-based thread lists.

---

## PART 4: CONFUSING ENTRY POINTS

These are flows where the entry point exists but is confusing, hidden, or doesn't match user expectations.

### Confusion 1: Signup Doesn't Show Role Selection

**Current flow:**
1. User lands on homepage
2. Clicks "Sign up"
3. Sees email/password form
4. Completes form → navigates to `/onboarding`
5. Onboarding asks role selection

**PRD expectation (lines 48-51):**
> If someone types "I want to hire engineers" in an open prompt → Sophia suggests EdgeEmployer at role confirmation  
> If the user arrives via an institution's invite link → role is pre-set, skip selection entirely  
> If the user arrives via the marketing site's "For Employers" page → role is pre-suggested

**Issue:**
Role selection happens AFTER signup, but the signup form is generic. Users don't know what they're signing up for.

**Recommended fix:**
1. Add "Who is this for?" selector BEFORE email/password form (show 3 role categories: "Building my career", "Guiding someone else", "Representing an org")
2. Pre-fill onboarding role based on selection
3. Or: Make landing page CTAs role-specific ("For Job Seekers", "For Employers", etc.) and pre-fill role

---

### Confusion 2: Sophia Bottom Bar Exists But Voice Mode Hidden

**Current state:**
Sophia bottom bar exists on every surface. Clicking it opens the full Sophia overlay. But voice mode has no entry point.

**Issue:**
Users don't know Sophia has voice. The mic icon/button doesn't exist in the UI.

**Recommended fix:**
Add mic button to Sophia bottom bar and Sophia overlay header.

---

### Confusion 3: EdgeMatch "Apply" Flow Has No Follow-Up

**Reference:** `flow-audit.md` lines 104-106

**Current state:**
User applies to job → Toast appears: "Applied successfully" → No follow-up.

**Issue:**
Where do I see my applications? Where do I track status?

**Recommended fix:**
1. Add "View my applications" link in toast
2. Add "Applications" tab/filter to EdgeMatch
3. Auto-create Application thread in Messaging (per spec)

---

### Confusion 4: Parent Sees "Alex" But No Indication This Is Placeholder

**Current state:**
Parent dashboard shows: "Good afternoon, David. Alex is making steady progress."

**Issue:**
New parent thinks "Who is Alex? Why am I seeing someone else's child?"

**Recommended fix:**
Empty state: "No children connected yet. Scan your child's QR code to link accounts."

---

### Confusion 5: Top Nav Pills Don't Indicate What's Clickable

**Current state:**
Nav pills all look the same. Some navigate to surfaces, some open Sophia prompts, some do nothing.

**Issue:**
No visual distinction. Users click "Pipeline" expecting a surface, get a Sophia prompt instead.

**Recommended fix:**
1. Pills that navigate: Current design
2. Pills that open Sophia: Add subtle Sophia icon or different styling
3. Pills that are disabled: Reduce opacity or remove entirely

---

## PART 5: LOW PRIORITY — POLISH ITEMS

### 1. Landing Page Nav Links Go Nowhere
**Reference:** `flow-audit.md` lines 112-113

Landing page has "How it Works", "Pricing", "About" nav items that call `onNavigate` but routes don't exist.

**Fix:** Either remove these or build landing subpages.

---

### 2. EdgePath Option C Exists But Not Wired
**Reference:** `flow-audit.md` lines 115-117

`edgepath-option-c.tsx` file exists but is never imported or used.

**Fix:** Either wire it to archive routes or delete it.

---

### 3. EdgeMatch Filter Panel — Sophia Smart Filters Decorative
**Reference:** `flow-audit.md` lines 119-122

Sophia Smart Filters section at bottom of filter panel is decorative (no functionality).

**Fix:** Either make it functional or remove it.

---

## PART 6: CROSS-CUTTING ISSUES

### Issue 1: No Cross-Surface Exit Chips

**Reference:** `shared-surfaces-and-flows-audit.md` lines 43-51

**Spec says:**
Every surface should have contextual exit chips connecting them:
- EdgeMatch job detail → "Optimize your resume for this job" → ResumeEdge
- Task Room completion → "Check your updated roadmap" → EdgePath
- Session booking → "Prepare in your Task Room" → Task Room

**Current state:**
ResumeEdge has exit chips to EdgeMatch. That's it. No other cross-surface connections.

**Impact:**
All 8 roles. This is the "connective tissue" of the platform.

**Recommended fix:**
Systematically add exit chips to every major surface.

---

### Issue 2: Sophia Bottom Bar Doesn't Adapt Per Surface

**Reference:** `shared-surfaces-and-flows-audit.md` lines 54-62

**Spec says:**
Sophia's context should change based on current surface:
- EdgeMatch: "3 new matches since yesterday"
- Sessions: "Prep for tomorrow's call with Alice"
- Analytics: "Your resume views are up 40%"

**Current state:**
Sophia bar shows dashboard context everywhere. The `sophiaOverride` prop exists on RoleShell but no surface uses it.

**Recommended fix:**
Pass surface-specific context to RoleShell from each surface component.

---

### Issue 3: No Inline Unread Indicators

**Reference:** `shared-surfaces-and-flows-audit.md` lines 64-70

**Spec says:**
Unread dots on job cards if employer messaged, on session cards if coach sent prep, etc.

**Current state:**
Message badges exist on nav pills only. No inline indicators anywhere.

**Recommended fix:**
Add unread state to EdgeMatch job cards, Session cards, etc., based on related message threads.

---

## SUMMARY TABLE: WHAT NEEDS FIXING

| Category | Count | Urgency | Estimated Effort |
|----------|-------|---------|------------------|
| **Critical affordance gaps** | 8 | 🔴 URGENT | 2-3 days per flow |
| **Dead nav pills** | 15 | 🟠 HIGH | 1-2 days (either build surfaces or better Sophia prompts) |
| **Dead dashboard buttons** | 23+ | 🟠 HIGH | 1 day (wire to existing surfaces) |
| **Dead elements (other)** | 18+ | 🟠 HIGH | 1 day |
| **Role adaptation gaps** | 15 | 🟡 MEDIUM | 2-3 days (role-gate existing surfaces) |
| **Confusing entry points** | 5 | 🟡 MEDIUM | 1 day |
| **Cross-surface flows** | 3 | 🟡 MEDIUM | 2 days |
| **Polish items** | 12 | 🟢 LOW | 1 day |

---

## RECOMMENDED SPRINT PRIORITIES

### Sprint 1: Stop the Bleeding (Critical Affordances)
1. **Parent → Child linking** — Biggest gap. Without this, parent role is useless.
2. **Employer job posting** — Without this, job board is read-only.
3. **Onboarding H1/H3 handoff** — Without this, 2 of 3 onboarding flows are broken.
4. **Sophia voice entry point** — Signature feature is hidden.

### Sprint 2: Wire Dead Ends (High-Impact, Low-Effort)
5. **Dashboard buttons** → navigate to surfaces (23 instances, ~1 day)
6. **Notification items** → navigate to surfaces (4 instances)
7. **Profile dropdown** → Settings/Sign Out (2 instances)
8. **Nav pills** → Either build missing surfaces or better Sophia prompts (15 instances)

### Sprint 3: Role Adaptation
9. **EdgePath role gating** — Show only to roles where it applies
10. **ResumeEdge role gating** — Same
11. **Analytics role-based data** — Show relevant KPIs per role
12. **Messaging role-based threads** — Already implemented, just needs data wiring

### Sprint 4: Cross-Surface Connective Tissue
13. **Exit chips** — Connect all major surfaces
14. **Sophia contextual bar** — Adapt per surface
15. **Inline unread indicators** — Tie Messaging to other surfaces

---

## VALIDATION CHECKLIST

To validate fixes, test these user journeys:

- [ ] **Parent journey:** Sign up → Link to child (QR) → See child's progress → Navigate to child's roadmap (read-only)
- [ ] **EdgeStar journey:** Sign up → Complete onboarding → Land on dashboard → Navigate to all 6 nav pills → All work or show appropriate messaging
- [ ] **Employer journey:** Sign up → Post a job → See it in pipeline → Review applicant
- [ ] **Guide journey:** Sign up → Set up portfolio → Manage availability → Book session
- [ ] **NGO journey:** Sign up → Browse grants → Apply to grant
- [ ] **EdgeBuddy flow:** Find accountability partner → Scan QR → Connect → See peer in list
- [ ] **Event check-in flow:** (Edu) Create event → Generate QR → (EdgeStar) Scan QR → Check in confirmed
- [ ] **Voice mode:** Open Sophia → Click mic → Speak → See transcription → Get response

---

## APPENDIX: FILES REQUIRING CHANGES

### Critical Fixes
- `/src/app/components/dashboards/edgeparent-dashboard.tsx` — Add child linking affordance
- `/src/app/components/onboarding-h1.tsx` — Add onComplete callback
- `/src/app/components/onboarding-h3.tsx` — Add onComplete callback
- `/src/app/components/edge-match.tsx` — Add job posting form (employer view)
- `/src/app/components/sophia-ask.tsx` — Add voice mode entry point (mic button)

### High Priority Fixes
- `/src/app/components/role-shell.tsx` — Wire notification items, profile dropdown
- `/src/app/components/dashboards/edgepreneur-dashboard.tsx` — Wire all buttons
- `/src/app/components/dashboards/edgeguide-dashboard.tsx` — Wire all buttons
- `/src/app/components/dashboards/edgeemployer-dashboard.tsx` — Wire all buttons
- `/src/app/components/dashboards/edgeeducation-dashboard.tsx` — Wire all buttons
- `/src/app/components/dashboards/edgengo-dashboard.tsx` — Wire all buttons
- `/src/app/components/dashboards/edgeagency-dashboard.tsx` — Wire all buttons
- `/src/app/components/shell-synthesis.tsx` — Wire notification items, filter tabs, Ask Sophia CTAs

### Medium Priority Fixes
- `/src/app/components/edgepath-option-a.tsx` — Add role gating
- `/src/app/components/resume-edge.tsx` — Add role gating
- `/src/app/components/task-room.tsx` — Add role gating
- `/src/app/components/edgesight.tsx` — Add role-based data switching
- `/src/app/components/messaging.tsx` — Already role-adapted, needs data wiring

---

**END OF AUDIT**
