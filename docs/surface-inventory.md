# Surface Inventory — Single Source of Truth

> **Last updated:** 2026-03-26
> **Purpose:** Complete inventory of every surface, feature, and sub-feature in CareerEdge. This is the ONE document to check before building anything.
> **Rule:** If it's not in this doc, it doesn't exist in our scope. If it IS in this doc and marked NOT BUILT, it needs building.

---

## How to Read This Doc

- **BUILT** = Component exists, routed, interactive
- **PARTIAL** = Component exists but missing features listed in production app
- **NOT BUILT** = No component, no route, nothing
- **EXPLORATION** = Design exploration only (landing page variations, etc.)
- **Production ref** = What the live Lovable app actually shows (ground truth)

---

## 1. Sidebar Navigation (Production App)

These are the nav items visible in the production app's sidebar. Each must have a corresponding surface.

### EdgeTools Section

| Nav Item | Our Component | Status | Gap |
|----------|--------------|--------|-----|
| **Dashboard** | `shell-synthesis.tsx` + `dashboards/*-dashboard.tsx` (8 roles) | **BUILT** | — |
| **EdgePathway** | `edgepath-option-a.tsx`, `edgepath-option-b.tsx`, `edgepath-option-c.tsx` | **PARTIAL** | Missing 8 of 12 sub-tabs (see Section 3) |
| **EdgeCareer** | `career-discovery.tsx` | **BUILT** | 30+ careers, 11 industries, archetype assessment |
| **Edge Productivity** | — | **NOT BUILT** | 7 tools: Sprint, Focus, Streak, Goals, Matrix, Intent, Retro |
| **EdgeWorkplace** | — | **NOT BUILT** | Not in our PRD. Needs scoping from production app. |
| **EdgeResources** | — | **NOT BUILT** | Learning/resource library. Not in our PRD. Needs scoping. |
| **ImmigrationEdge** | `surfaces/immigration-surface.tsx` | **BUILT** | Questionnaire → roadmap |
| **ScheduleEdge** | — | **NOT BUILT** | Calendar/scheduling surface. Not in our PRD. Needs scoping. |

### Marketplace Section (collapsed in sidebar)

| Nav Item | Our Component | Status | Gap |
|----------|--------------|--------|-----|
| **Coach/Mentor Browse** | `sessions.tsx` (Picks + Browse views) | **PARTIAL** | Browse exists within Sessions, not as standalone Marketplace surface |
| **Program Directory** | `surfaces/programs-surface.tsx` | **PARTIAL** | List exists, enrollment flow not built |
| **Grant Directory** | `surfaces/funding-surface.tsx` | **PARTIAL** | Browse exists, application flow not built |

### CommunityEdge Section (collapsed in sidebar)

| Nav Item | Our Component | Status | Gap |
|----------|--------------|--------|-----|
| **Community Feed** | — | **NOT BUILT** | Social/community features. Not in our PRD. |
| **Events** | `surfaces/events-surface.tsx` | **PARTIAL** | QR check-in UI, attendance not persisted |
| **Groups/Forums** | — | **NOT BUILT** | Not scoped |

### Always-Present Nav

| Item | Our Component | Status |
|------|--------------|--------|
| **Search (Cmd+K)** | `nav-explore-panel.tsx` | **BUILT** |
| **User Profile/Avatar** | Role badge in shell | **BUILT** |
| **Ask Sophia (FAB)** | `sophia-ask.tsx` + `sophia-voice-overlay.tsx` | **BUILT** |

---

## 2. Core Surfaces (Original 10 + Extensions)

| # | Surface | Component(s) | Status | Variations |
|---|---------|-------------|--------|------------|
| 1 | **Onboarding** | `onboarding-h1.tsx`, `onboarding-h2.tsx`, `onboarding-h3.tsx` | **BUILT** | 3 hypotheses. H2 selected. |
| 2 | **App Shell + Dashboard** | `shell-synthesis.tsx`, `role-shell.tsx` | **BUILT** | Role-adaptive for all 8 roles |
| 3 | **EdgePath** | `edgepath-option-a.tsx`, `b.tsx`, `c.tsx`, `mindmap.tsx` | **PARTIAL** | See Section 3 for sub-feature gaps |
| 4 | **Sophia** | `sophia-ask.tsx`, `sophia-voice-overlay.tsx`, `sophia-patterns.tsx` | **BUILT** | Float, Panel, Voice, Bottom Bar |
| 5 | **ResumeEdge** | `resume-edge.tsx` | **BUILT** | 3 AI engines, ATS scoring |
| 6 | **EdgeMatch** | `edge-match.tsx` | **BUILT** | Job matching, filters, EdgePath connection |
| 7 | **EdgeSight/Analytics** | `edgesight.tsx` | **BUILT** | Role-aware dashboards |
| 8 | **Messaging + Video** | `messaging.tsx` | **BUILT** | DM, group, notifications |
| 9 | **Sessions/Booking** | `sessions.tsx` | **BUILT** | Calendar, time slots, coach browse |
| 10 | **Task Room** | `task-room.tsx` | **BUILT** | Milestone execution, embedded Sophia |
| 11 | **EdgeBuddy** | `edge-buddy.tsx`, `buddy-dashboard-card.tsx`, `buddy-pair-modal.tsx` | **BUILT** | Ambient companion, QR pairing |
| 12 | **ImmigrationEdge** | `surfaces/immigration-surface.tsx` | **BUILT** | Questionnaire → roadmap |
| 13 | **Career Discovery** | `career-discovery.tsx` | **BUILT** | 30+ careers, archetype assessment |
| 14 | **Guide Profile** | `guide-profile-edit.tsx`, `guide-profile-modal.tsx` | **BUILT** | Portfolio, rates, availability |
| 15 | **Edge Productivity** | — | **NOT BUILT** | 7 tools (see Section 4) |
| 16 | **EdgeWorkplace** | — | **NOT BUILT** | Needs scoping from production |
| 17 | **EdgeResources** | — | **NOT BUILT** | Needs scoping from production |
| 18 | **ScheduleEdge** | — | **NOT BUILT** | Needs scoping from production |
| 19 | **CommunityEdge** | — | **NOT BUILT** | Needs scoping from production |
| 20 | **Marketplace** | — (partial in `sessions.tsx`) | **NOT BUILT** | Needs dedicated surface |

---

## 3. EdgePath Sub-Features

### Tab Triage (RESOLVED — See `docs/edgepath-system-reference.md` Section 10)

The production Lovable app shows 12 tabs. **Our design system intentionally eliminated all 12 tabs.** This was a deliberate architectural decision documented in `edgepath-system-reference.md`:

> "Result: 0 tabs. 15 fewer decisions. Zero information lost."

Each former tab was triaged to a better home:

| Production Tab | Our Design Decision | Where It Lives Now | Status |
|----------------|--------------------|--------------------|--------|
| **Pathways** | IS the default view — the page itself | Phase strip + milestones | **BUILT** |
| **Milestones** | Visible within each phase. Content, not a filter. | Milestone rows in phase groups | **BUILT** |
| **Timeline** | Phase strip shows position, not time. Client wants Gantt-style visualization. | Phase strip ≠ Gantt | **NOT BUILT** — needs `[List] [Map] [Timeline]` third view mode |
| **Quick Wins** | Sophia surfaces contextually: "3 quick wins available" | Sophia commentary + chips | **BUILT** |
| **Jobs** | Sophia right column: "4 jobs match Phase 2 skills" → EdgeMatch | Cross-surface connections | **BUILT** |
| **Insights** | Sophia IS insights. Woven through everything. | 5 Sophia modes on EdgePath | **BUILT** |
| **Compare** | Sophia-triggered when genuine fork exists | Path Compare panel in Map View | **BUILT** |
| **Support** | "Ask Sophia" is the support mechanism | Sophia Float/Panel | **BUILT** |
| **Skills** | Embedded in milestones. Sophia provides skill gap on request. | Milestone categories + Sophia | **BUILT** |
| **Analytics** | Lives on EdgeBoard surface | `edgesight.tsx` | **BUILT** (separate surface) |
| **Activity** | Lives on Dashboard's activity widget | `shell-synthesis.tsx` | **BUILT** (on dashboard) |
| **Budget** | Needed for EdgeStar (transition costs), EdgePreneur (startup costs), EdgeParent (child support). NOT parent-only. | — | **NOT BUILT** — needs dedicated sub-feature |

**Most are intentional design decisions.** The production app's 12 tabs represent an older design that our system improved upon. **Exceptions:** Timeline (Gantt view) and Budget are genuine gaps that need building.

### EdgePath Celebration & Milestone Tracking

| Feature | Status | Details |
|---------|--------|---------|
| **Phase completion celebration** | **BUILT** | Full-screen modal: trophy animation, Sophia message, stats row, CTA. Auto-dismiss 8s. `PhaseCompletionCelebration` in `edgepath-option-a.tsx:525` |
| **Individual milestone feedback** | **BUILT** | Inline: checkbox lime animation, progress bar update, Sophia commentary update. No modal (by design — too interruptive for daily action). |
| **Dedicated milestone tracker** | **NOT BUILT** | No flat view of ALL milestones across ALL phases. Milestones only visible within their parent phase. May need a "My Tasks" flat list view. |

### EdgePath Header Actions (Triaged — See `edgepath-system-reference.md` Section 10)

| Production Action | Our Design Decision | Status |
|-------------------|--------------------|----|
| **Set Primary** | Star icon in roadmap selector dropdown | **BUILT** |
| **Live toggle** | Removed — always live is the default | **BY DESIGN** |
| **EdgeGas** | Global top nav (visible everywhere, not per-surface) | **BUILT** (in shell) |
| **Share Your Insight** | Overflow menu (⋯) → "Post journey update" | **BUILT** (in overflow) |
| **Export** | Overflow menu (⋯) → "Export as PDF" | **BUILT** (in overflow) |
| **Regenerate** | Overflow menu (⋯) → requires confirmation dialog | **BUILT** (in overflow) |
| **Fit tags** | Sophia communicates fit contextually instead | **BY DESIGN** |
| **Career narrative card** | Sophia commentary strip serves this differently | **PARTIAL** |

### EdgePath Sophia Integration (5 Modes — ALL BUILT)

| Mode | Description | Status |
|------|-------------|--------|
| **A: Phase Commentary Strip** | Persistent one-liner below phase strip | **BUILT** |
| **B: Ambient Annotations** | ✦ marks on Map View milestone nodes | **BUILT** |
| **C: Contextual Coaching** | Inside Task Room panel | **BUILT** |
| **D: Proactive Guidance** | Bottom bar context messages | **BUILT** |
| **E: Map-Level Intelligence** | Floating overview card in Map View | **BUILT** |

---

## 4. Edge Productivity — Sub-Features (NOT BUILT)

From PRD + production app. All 7 tools need building.

| Tool | Description | Priority |
|------|------------|----------|
| **Sprint** | Task sprints with timers, focused work sessions | HIGH |
| **Focus** | Pomodoro-style intervals with stats | HIGH |
| **Streak** | Daily consistency tracking, streak counter | MEDIUM |
| **Goals** | SMART Goal builder (5-step wizard) | HIGH |
| **Matrix** | Eisenhower priority matrix (urgent/important) | MEDIUM |
| **Intent** | Daily intention setting | LOW |
| **Retro** | Weekly retrospectives | LOW |

---

## 5. Layer 3 Surfaces (Role-Specific)

| Surface | Component | Roles | Status | Gap |
|---------|-----------|-------|--------|-----|
| **Family** | `surfaces/family-surface.tsx` (3 variations) | Parent, Edu | **PARTIAL** | Mock data, no real child roadmap integration |
| **Pipeline** | `surfaces/pipeline-surface.tsx` | Employer | **PARTIAL** | UI exists, no candidate state machine |
| **Events** | `surfaces/events-surface.tsx` | Edu, Institution | **PARTIAL** | QR UI, attendance not persisted |
| **Programs** | `surfaces/programs-surface.tsx` | NGO, Edu | **PARTIAL** | Browse exists, enrollment not built |
| **Clients** | `surfaces/clients-surface.tsx` | Guide | **PARTIAL** | Basic list, no management workflow |
| **Funding** | `surfaces/funding-surface.tsx` | NGO, Agency | **PARTIAL** | Browse exists, application not built |

---

## 6. Cross-Cutting Features

| Feature | Component | Status |
|---------|-----------|--------|
| **Parent-Child QR Link** | `child-link-modal.tsx` | **BUILT** |
| **EdgeBuddy QR Pairing** | `buddy-pair-modal.tsx` | **BUILT** |
| **Cmd+K Command Palette** | `nav-explore-panel.tsx` | **BUILT** |
| **Theme Toggle (Dark/Light)** | `ui/use-theme.ts` | **BUILT** |
| **Role-Based Nav Pills** | `role-shell.tsx` ROLE_CONFIGS | **BUILT** |
| **Sophia Bottom Bar** | `sophia-patterns.tsx` | **BUILT** |
| **EdgeGas Economy** | UI indicators only | **PARTIAL** — display only, no earn/spend logic |
| **QR System (infrastructure)** | Patterns in child-link + buddy-pair | **BUILT** |
| **Notifications** | — | **NOT BUILT** |
| **Settings/Preferences** | `settings.tsx` (SettingsPanel) | **BUILT** | 8 sections, all 8 roles, reusable Toggle + SettingRow primitives, slide-out panel via avatar in role-shell |

---

## 7. Landing Page & Auth

| Surface | Component | Status | Notes |
|---------|-----------|--------|-------|
| **Landing V1** "Editorial" | `landing/landing-v1.tsx` | EXPLORATION | |
| **Landing V2** "Proof" | `landing/landing-v2.tsx` | EXPLORATION | |
| **Landing V3** "Narrative" | `landing/landing-v3.tsx` | EXPLORATION | |
| **Landing V4** "Architect" | `landing/landing-v4.tsx` | EXPLORATION | |
| **Landing V5** "Conversation" | `landing/landing-v5.tsx` | EXPLORATION | |
| **Landing V6** "Gallery" | `landing/landing-v6.tsx` | EXPLORATION | |
| **Landing V7** "Data Canvas" | `landing/landing-v7.tsx` | EXPLORATION | |
| **Landing V8** "Manifesto" | `landing/landing-v8.tsx` | EXPLORATION | |
| **Landing V9** "Ecosystem" | `landing/landing-v9.tsx` | EXPLORATION | |
| **Landing V6-A** "Conviction" | `landing/landing-v6a.tsx` | EXPLORATION | V6 sub-variation |
| **Landing V6-B** "Intimacy" | `landing/landing-v6b.tsx` | EXPLORATION | V6 sub-variation |
| **Landing V6-C** "Precision" | `landing/landing-v6c.tsx` | EXPLORATION | V6 sub-variation |
| **Auth (Login/Signup)** | `landing/auth-page.tsx` | **BUILT** | |
| **Landing Nav** | `landing/landing-nav.tsx` | **BUILT** | Shared across all variations |
| **Landing Footer** | `landing/landing-footer.tsx` | **BUILT** | Shared across all variations |

---

## 8. Role Coverage Summary

| Role | Dashboard | Nav Pills | Surfaces | Sophia Scenarios | Overall |
|------|-----------|-----------|----------|------------------|---------|
| **EdgeStar** | BUILT | BUILT | 12/15 | 48 | 80% |
| **EdgePreneur** | BUILT | BUILT | 4/6 | Partial | 65% |
| **EdgeParent** | BUILT | BUILT | 3/4 | Partial | 75% |
| **EdgeGuide** | BUILT | BUILT | 6/7 | Partial | 70% |
| **EdgeEmployer** | BUILT | BUILT | 5/6 | Partial | 65% |
| **EdgeEducation** | BUILT | BUILT | 7/8 | Partial | 65% |
| **EdgeNGO** | BUILT | BUILT | 5/6 | Partial | 60% |
| **EdgeAgency** | BUILT | BUILT | 4/5 | Partial | 55% |

---

## 9. NOT BUILT — Complete List (Build Queue)

Priority: CRITICAL > HIGH > MEDIUM > LOW

### CRITICAL (blocks core user journeys)

| # | Surface/Feature | Effort Est. | Depends On |
|---|----------------|-------------|------------|
| 1 | **Edge Productivity** (7 tools) | Large | Standalone surface |
| 2 | **EdgePath sub-tabs** (Timeline, Quick Wins, Skills, Activity, Budget, Support, Insights) | Large | EdgePath architecture |
| 3 | **EdgePath header actions** (Live toggle, Share, Export, Regenerate, fit tags, career card) | Medium | EdgePath |

### HIGH (production app has them)

| # | Surface/Feature | Effort Est. | Depends On |
|---|----------------|-------------|------------|
| 4 | **EdgeWorkplace** | Unknown | Needs scoping from production |
| 5 | **EdgeResources** | Unknown | Needs scoping from production |
| 6 | **ScheduleEdge** | Medium | Calendar patterns |
| 7 | **Marketplace** (dedicated surface) | Medium | Sessions browse exists |
| 8 | **CommunityEdge** | Unknown | Needs scoping from production |

### MEDIUM (polish & integration)

| # | Surface/Feature | Effort Est. |
|---|----------------|-------------|
| 9 | **Notifications system** | Medium |
| 10 | **Settings/Preferences** | Small |
| 11 | **EdgeGas earn/spend logic** | Medium |
| 12 | **Layer 3 surface workflows** (enrollment, application, state machines) | Medium |

---

## 10. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-26 | Created from production app screenshot audit + codebase validation | Claude |
