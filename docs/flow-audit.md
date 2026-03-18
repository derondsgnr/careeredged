# CareerEdge Flow Audit — What's Left

**Date:** March 17, 2026
**Status:** Post-EdgeMatch fix, pre-final sprint

---

## Summary

8 surfaces are built. Of those, **EdgeMatch** and **ResumeEdge** are the most complete (real sub-views, state management, role adaptation). The rest have structural shells but significant dead-end issues. Below is every incomplete flow, organized by severity.

---

## CRITICAL — Clicking something and nothing happens

### 1. Dead Nav Pills (15 of 17 pills go nowhere)

Every role's top nav has pills that highlight when clicked but show no content. Only `home`, `jobs`, `resume` (EdgeStar only), and `roadmap` (EdgeStar only) actually navigate.

| Role | Dead Pills |
|------|-----------|
| EdgeStar | `messages` |
| EdgePreneur | `roadmap`, `tasks`, `messages` |
| EdgeParent | `family`, `messages` |
| EdgeGuide | `sessions`, `clients`, `earnings`, `messages` |
| EdgeEmployer | `pipeline`, `analytics`, `messages` |
| EdgeEducation | `students`, `events`, `outcomes`, `messages` |
| EdgeNGO | `programs`, `impact`, `messages` |
| EdgeAgency | `programs`, `impact`, `messages` |

**Decision needed:** Do these become (a) in-dashboard tab views that swap content, (b) full separate surfaces, or (c) something else? Messages in particular is a platform-wide surface that every role needs.

### 2. Dashboard Cards — 23 Dead Buttons Across 7 Role Dashboards

Every role dashboard has `cursor-pointer` styled elements (cards, "View all" links, "Full report" buttons) with **zero onClick handlers**. They look clickable but do nothing. Examples:
- "View all" / "Full report" links on every dashboard section
- Individual list items (job listings, client cards, program cards)
- Action buttons ("Post opportunity", etc.)

### 3. ShellSynthesis (EdgeStar Dashboard) — ~8 Dead Interactive Elements

The EdgeStar dashboard has some wired elements (milestone cards navigate to Task Room, EdgePath link works) but several don't:
- Bell notification icon (no panel — RoleShell has one but ShellSynthesis uses its own shell)
- Avatar/profile button
- "Saved" / "Applied" filter tabs in job section
- "Ask Sophia about..." CTA

---

## HIGH — Flows that exist but don't adapt per role

### 4. EdgePath — Only EdgeStar Version Exists

All 8 roles see the same EdgeStar career roadmap when navigating to EdgePath. Only EdgeStar and EdgePreneur have the `roadmap` pill, but if any role navigates there (via Sophia chips or dashboard links), they see Sharon's milestones.

**Needed:** At minimum, role-gated entry. Ideally:
- EdgeStar/EdgePreneur: Full interactive roadmap (exists)
- Parent: Read-only view of child's roadmap
- Guide: Client roadmap with coaching annotations
- Employer/Edu/NGO/Agency: Not applicable (hide pill or show aggregate)

### 5. ResumeEdge — Only EdgeStar Version Exists

Same issue. All roles see Sharon's resume builder. 

**Needed:**
- EdgeStar/EdgePreneur: Full resume builder (exists)
- Parent: Read-only view of child's resume
- Guide: Client resume review mode with annotation tools
- Employer: Not applicable (they see resumes via EdgeMatch applicant panel)
- Edu/NGO/Agency: Aggregate resume analytics or not applicable

### 6. Onboarding H1 and H3 — No `onComplete` Callback

Only H2 fires `onComplete(role)` to transition to the dashboard with the correct role. H1 and H3 onboarding flows end but can't hand off to the app. Users finishing onboarding in H1 or H3 are stuck.

---

## MEDIUM — Partial flows with dead ends

### 7. Task Room — ~8 Dead Interactive Elements

Task Room has real milestone switching and Sophia conversation, but several elements are dead:
- Sidebar milestone items (cursor-pointer, no onClick)
- Resource links (no onClick)
- "Share progress" button
- Completion celebration CTA buttons

### 8. Notification Panel (RoleShell) — Items Not Actionable

The bell opens a notification panel with 4 notification items, but clicking individual notifications doesn't navigate anywhere. They should route to the relevant surface (e.g., "New job match" should go to EdgeMatch).

### 9. Profile Dropdown (RoleShell) — Settings/Sign Out Dead

The avatar opens a profile dropdown with Settings and Sign Out, but neither does anything.
- Settings should navigate to a settings surface (or show a modal)
- Sign Out should navigate back to landing/auth

### 10. Sophia Conversation — No Real Responses

SophiaAsk opens a conversation overlay but Sophia's responses are hardcoded. The conversation doesn't adapt to context (which surface, which role, what the user asked). This is acceptable for a prototype but worth noting.

### 11. EdgeMatch EdgeStar Browse — "Apply" Flow Ends at Toast

The apply button changes state (applied: true) and shows a toast, which is correct behavior. But there's no way to see/manage applications after applying. A "My Applications" view or filter would complete this.

---

## LOW — Polish items

### 12. Landing Page Nav Links

Landing V1/V2/V3 have nav items (How it Works, Pricing, About, etc.) that call `onNavigate` but the handler in App.tsx ignores unknown pages. These are subpages that don't exist yet.

### 13. EdgePath Option C

`edgepath-option-c.tsx` exists as a file but is never imported or wired in App.tsx.

### 14. EdgeMatch Filter Panel

The filter sidebar on EdgeMatch Browse has checkboxes that toggle state and filter the job list, which works. But the "Sophia Smart Filters" section at the bottom is decorative.

---

## Recommended Priority Order

Given ~2 hours remaining and the goal of "no dead ends for all 8 roles":

1. **Wire dashboard card buttons** — Quick win. Add onClick handlers to all 23 dead buttons across 7 dashboards. Most should navigate to the relevant surface (EdgeMatch, EdgePath, ResumeEdge) or open Sophia.

2. **Handle dead nav pills** — Two options:
   - **Fast:** Make them open Sophia with a contextual message ("Ask Sophia about your sessions")
   - **Real:** Build tab-view sub-surfaces for each (much more work)

3. **Wire notification items** — Make each notification navigate to the relevant surface.

4. **Wire profile dropdown** — Sign Out → landing page. Settings → modal or simple settings view.

5. **Onboarding H1/H3 onComplete** — Add the callback so all three hypotheses complete properly.

6. **EdgePath/ResumeEdge role gating** — At minimum, show a role-appropriate read-only view for non-primary roles. At maximum, build full role-adapted versions.

7. **Messages surface** — Every role has a Messages pill. This is the biggest missing surface.

---

## Numbers

| Category | Count |
|----------|-------|
| Dead nav pills | 15 |
| Dead dashboard buttons | 23 |
| Dead ShellSynthesis elements | ~8 |
| Dead Task Room elements | ~8 |
| Surfaces not role-adapted | 2 (EdgePath, ResumeEdge) |
| Missing surfaces | 1 (Messages) |
| Onboarding flows without handoff | 2 (H1, H3) |
| **Total dead-end interactions** | **~56** |
