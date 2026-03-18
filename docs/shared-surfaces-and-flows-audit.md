# Shared Surfaces & Uncovered Flows — Full Audit

**Date:** March 17, 2026
**Context:** Post-Phase 1 dead-end wiring, pre-Messaging build

---

## SURFACES SHARED ACROSS ALL 8 ROLES

### Currently Built & Shared

| Surface | Component | Shared? | Role Adaptation? | Status |
|---------|-----------|---------|-----------------|--------|
| **Dashboard** | 7 role dashboards + ShellSynthesis | Yes (1 per role) | Full — each role has unique KPIs, cards, data | Complete |
| **EdgeMatch** | `edge-match.tsx` | Yes | Full — 8 role-specific views (browse, post, pipeline, etc.) | Complete |
| **App Shell** | `role-shell.tsx` | Yes | Full — role-specific nav pills, Sophia context, colors | Complete |
| **Sophia Ask** | `sophia-ask.tsx` | Yes | Partial — opens everywhere, but responses don't adapt per role/surface | Functional but generic |
| **Notifications** | In RoleShell + ShellSynthesis | Yes | No — same 4 mock notifications for every role | Needs role adaptation |
| **Profile Dropdown** | In RoleShell + ShellSynthesis | Yes | No — same 4 items for every role | Needs role adaptation |

### Currently Built BUT NOT Shared (EdgeStar Only)

| Surface | Component | Who Gets It | Who's Missing |
|---------|-----------|-------------|---------------|
| **EdgePath** | `edgepath-option-a/b/c.tsx` | EdgeStar | EdgePreneur (venture roadmap), Parent (read-only), Guide (client view) |
| **ResumeEdge** | `resume-edge.tsx` | EdgeStar | EdgePreneur (pitch deck variant?), Parent (read-only), Guide (review mode) |
| **Task Room** | `task-room.tsx` | EdgeStar | EdgePreneur (business milestone rooms), Guide (review mode), Parent (progress view) |

### NOT YET BUILT — Needed by All/Most Roles

| Surface | Spec Status | Roles That Need It | Notes |
|---------|-------------|-------------------|-------|
| **Messaging** | Spec locked (`messaging-video-ux-spec.md`) | All 8 | 5 thread types, Sophia integration, video calls. Phase 2 target. |
| **EdgeSight / Analytics** | Spec locked (`edgesight-ux-spec.md`) | All 8 (different data) | EdgeStar: personal career analytics. Employer: hiring pipeline. Edu/NGO/Agency: outcomes. Guide: earnings/impact. |
| **Session/Booking** | Spec locked (`session-booking-ux-spec.md`) | EdgeStar + Guide (primary), Edu/NGO (secondary) | Two-sided: Guide manages availability, EdgeStar books. |
| **Settings / Profile** | No spec | All 8 | Currently just Sophia prompts from profile dropdown. No actual surface. |

---

## FLOWS SHARED ACROSS ROLES BUT NOT YET BUILT

### 1. Cross-Surface Navigation Chips (Exit Chips)
**Spec says:** Every surface gets contextual exit chips connecting them. Examples:
- EdgeMatch job detail -> "Optimize your resume for this job" -> ResumeEdge with JD pre-loaded
- Task Room completion -> "Check your updated roadmap" -> EdgePath
- Session booking confirmation -> "Prepare in your Task Room" -> Task Room
- ResumeEdge completion -> "Find matching jobs" -> EdgeMatch

**Current state:** ResumeEdge has exit chips to EdgeMatch. That's it. No other surface has cross-surface exit chips.

**Impact:** All 8 roles. This is "the connective tissue of the platform" per your locked decisions.

### 2. Sophia Contextual Bottom Bar (per surface)
**Spec says:** Sophia's bottom bar should show surface-aware context:
- EdgeMatch: "3 new matches since yesterday"
- Sessions: "Prep for tomorrow's call with Alice"  
- Analytics: "Your resume views are up 40%"
- Task Room: "You were working on [sub-task]. Pick up where you left off?"

**Current state:** Each role's dashboard has Sophia context. But when you navigate to EdgeMatch, ResumeEdge, etc., the Sophia bar reverts to the dashboard's default context. The `sophiaOverride` prop exists on RoleShell but isn't used by any sub-surface.

**Impact:** All 8 roles on every surface.

### 3. Inline Unread Indicators Across Surfaces
**Spec says (Messaging Q15):** "Unread dots on individual thread list items, and inline indicators on surfaces that have related threads (e.g., a blue dot on a job card if the employer messaged you)."

**Current state:** Not implemented anywhere. Message badges exist on nav pills but no inline indicators on job cards, session cards, etc.

**Impact:** All 8 roles — ties Messaging to EdgeMatch, Sessions, Task Rooms.

### 4. Application Thread Auto-Creation
**Spec says (Messaging Q3):** When a user applies to a job in EdgeMatch, an "Application thread" is auto-created in Messaging.

**Current state:** EdgeMatch apply flow shows a toast. No thread creation.

**Impact:** EdgeStar, EdgePreneur (applicants) + EdgeEmployer, Edu, NGO, Agency (posters).

### 5. Session Thread Auto-Creation
**Spec says (Session/Booking Q5):** Booking confirmation auto-creates a thread + Sophia pre-session prep message.

**Current state:** Session/Booking surface doesn't exist yet.

**Impact:** EdgeStar + Guide primarily, Edu/NGO secondarily.

### 6. "My Applications" View
**Spec says (Flow Audit #11):** After applying in EdgeMatch, there's no way to see/manage applications. Need an "Applied" filter/view.

**Current state:** EdgeMatch has "Saved" and "Applied" tabs in ShellSynthesis dashboard but they're filter tabs within the dashboard job section, not a proper applications management view.

**Impact:** EdgeStar, EdgePreneur (anyone who applies).

### 7. Role Switching Flow
**Spec says (Cross-Cutting Q3):** Role switcher in profile/settings. Smooth transition, no full page reload.

**Current state:** Dev toolbar at the bottom of App.tsx allows role switching. No in-app role switcher for users.

**Impact:** Users with multiple roles (e.g., someone who is both an EdgeStar and a Guide).

### 8. Sophia Welcome Thread (First-Time User)
**Spec says (Messaging Q9):** Sophia auto-starts a welcome thread for new users.

**Current state:** No welcome thread. Onboarding flows end at dashboard.

**Impact:** All 8 roles on first login.

### 9. EdgeMatch -> ResumeEdge Cross-Surface Link
**Spec says (EdgeMatch Q7, validated):** "Optimize for this job" button on every job detail panel -> opens ResumeEdge with the JD pre-loaded.

**Current state:** Not implemented. Job detail panels have no ResumeEdge link.

**Impact:** EdgeStar, EdgePreneur.

### 10. Task Room Entry from EdgePath
**Spec says (Task Rooms Q10):** Milestone card on EdgePath zooms to fill screen, then room panels assemble.

**Current state:** ShellSynthesis dashboard milestones navigate to Task Room. EdgePath itself has milestone cards but clicking them doesn't open Task Room.

**Impact:** EdgeStar, EdgePreneur.

---

## ROLE-SPECIFIC SURFACES/FLOWS NOT YET BUILT

| Role | Missing Surface/Flow | Priority |
|------|---------------------|----------|
| **EdgePreneur** | Venture roadmap (EdgePath variant), Business task rooms, Pitch deck builder room | Medium |
| **Parent** | Read-only roadmap view, Read-only task room progress view, Child's resume view | Medium |
| **Guide** | Task Room review mode (approve/feedback), Client roster surface, Session management, Earnings dashboard, Availability setup | High |
| **Employer** | Applicant pipeline surface, Job posting form, Hiring analytics | High |
| **Education** | Student roster, Event management, Outcomes dashboard, Curriculum alignment | Medium |
| **NGO** | Program management, Participant tracking, Impact dashboard | Medium |
| **Agency** | Program management, Workforce metrics, Placement tracking | Medium |

---

## SUMMARY: WHAT'S ACTUALLY SHARED vs. ROLE-SPECIFIC

**Truly shared (same surface, role-based rendering):**
1. Messaging (all 8) — NOT BUILT
2. EdgeSight/Analytics (all 8, different data) — NOT BUILT  
3. Settings/Profile (all 8) — NOT BUILT
4. Cross-surface exit chips (all 8) — NOT BUILT
5. Sophia contextual bar per surface (all 8) — PARTIALLY BUILT

**Shared but needs role variants:**
6. EdgePath (4 roles: star, preneur, parent, guide) — ONLY EDGESTAR
7. ResumeEdge (3 roles: star, preneur, guide) — ONLY EDGESTAR
8. Task Room (4 roles: star, preneur, guide, parent) — ONLY EDGESTAR
9. Session/Booking (2 primary + 2 secondary roles) — NOT BUILT

**Role-specific (not shared):**
10. Employer pipeline, NGO/Agency program management, Edu student roster — NOT BUILT

---

## DECISION NEEDED

Given the plan to build Messaging (full spec) + EdgeSight (this sprint), the question is:

**Do we also tackle the cross-surface flows (exit chips, Sophia contextual bar, inline unread indicators) as part of the Messaging build?** These are the "connective tissue" and would make Messaging feel integrated rather than isolated. They're relatively small lifts individually but add up.

Or do we treat those as a separate Phase 3 after Messaging + EdgeSight are standing?
