# Build Priority Plan — Post-Audit

**Date:** March 17, 2026
**Context:** 8 of 10 surfaces built. ~56 dead-end interactions identified. User decision: dead pills open Sophia, build Messages per spec, prioritize depth over breadth across all 8 roles.

---

## Phase 1: Quick Wiring (eliminate all dead ends)

These are mechanical fixes — no new UX decisions needed.

### 1A. Dead Nav Pills → Open Sophia with Context
**Scope:** 15 pills across 8 roles
**How:** When a pill has no `surfaceId`, clicking it opens the Sophia overlay with a contextual initial message seeded from the pill's purpose.

| Role | Pill | Sophia opens with... |
|------|------|---------------------|
| EdgeStar | messages | "Show me my recent messages" |
| EdgePreneur | roadmap | "Show me my venture roadmap" |
| EdgePreneur | tasks | "What tasks should I focus on?" |
| EdgePreneur | messages | "Show me my recent messages" |
| EdgeParent | family | "How is Alex progressing?" |
| EdgeParent | messages | "Show me my messages with Alex" |
| EdgeGuide | sessions | "Show me my upcoming sessions" |
| EdgeGuide | clients | "Show me my client roster" |
| EdgeGuide | earnings | "How are my earnings this month?" |
| EdgeGuide | messages | "Show me my recent messages" |
| EdgeEmployer | pipeline | "Show me my hiring pipeline" |
| EdgeEmployer | analytics | "How are my job listings performing?" |
| EdgeEmployer | messages | "Show me applicant messages" |
| EdgeEducation | students | "Show me student progress" |
| EdgeEducation | events | "What career events are coming up?" |
| EdgeEducation | outcomes | "How are placement outcomes this quarter?" |
| EdgeEducation | messages | "Show me my recent messages" |
| EdgeNGO | programs | "Show me program participant progress" |
| EdgeNGO | impact | "What's our impact this quarter?" |
| EdgeNGO | messages | "Show me my recent messages" |
| EdgeAgency | programs | "Show me program performance" |
| EdgeAgency | impact | "What are our placement metrics?" |
| EdgeAgency | messages | "Show me my recent messages" |

**Estimate:** ~30 min. One change to `role-shell.tsx` — add a `sophiaPrompt` field to pills without `surfaceId`, and update `handleNavClick` to open Sophia when clicked.

### 1B. Dashboard Dead Buttons → Wire to Surfaces or Sophia
**Scope:** 23 elements across 7 role dashboards + ~8 in ShellSynthesis
**How:** Buttons that clearly map to a surface (e.g., "View all jobs" → EdgeMatch) get `onClick={() => onNavigate("jobs")}`. Buttons that are role-specific (e.g., "Full report" on analytics cards) open Sophia with context.
**Estimate:** ~45 min. Mechanical pass through each dashboard file.

### 1C. Notification Items → Navigate to Surface
**Scope:** 4 mock notifications in RoleShell
**How:** Each notification gets a `surfaceId`. Clicking it calls `onNavigate(surfaceId)` and closes the panel.
**Estimate:** ~15 min.

### 1D. Profile Dropdown → Sign Out + Settings
**Scope:** 2 buttons
**How:** Sign Out → `onNavigate("landing")`. Settings → open Sophia with "Help me update my profile settings" (since Settings surface is out of sprint scope per cross-cutting Q5).
**Estimate:** ~10 min.

### 1E. Onboarding H1/H3 → Add onComplete
**Scope:** 2 components
**How:** Add `onComplete` prop to both, fire it at the end of each flow with the selected role.
**Estimate:** ~20 min per component. Need to read each to find the completion point.

**Phase 1 Total: ~2 hours**

---

## Phase 2: New Surface — Messaging (Surface 8)

Per spec in `/docs/messaging-video-ux-spec.md`. This is the highest-priority new surface because every role has a Messages pill pointing to it.

### What to Build
1. **Three-panel layout** — Conversation list (280px) | Active thread (flex) | Context panel (280px, collapsible)
2. **5 thread types** with mock data — DM (2), Group (1), Sophia (2), Session (2), Application (1)
3. **Message types** — Text, file card, image (inline), link preview, session card, smart reply chips
4. **Sophia integration** — Distinct cyan treatment, smart replies, thread summarization card
5. **Typing indicator** — Animated dots (lime for Sophia, white for humans)
6. **Simulated real-time** — After user sends, typing indicator → mock response
7. **Filter chips** — All | Direct | Groups | Sophia | Sessions | Applications
8. **Search bar** — Filter conversations by name/content (client-side mock)
9. **Read receipts** — "Seen" text
10. **Unread indicators** — Lime dot on unread threads

### What to Defer (Video Call)
Video call UI is in-spec but is a mode-switch within messaging. Build the [Join Call] button on session cards but defer the actual video call view to Phase 3. This keeps the messaging surface complete without the video complexity.

### Role Adaptation
The conversation list and context panel adapt per role:
- **EdgeStar:** Sees mentor DMs, employer application threads, Sophia coaching threads, peer group
- **EdgePreneur:** Sees investor DMs, co-founder group, Sophia threads
- **EdgeParent:** Sees Alex's threads (read-only summaries), Sophia threads, counselor DMs
- **EdgeGuide:** Sees client DMs, session threads, Sophia threads, peer guide group
- **EdgeEmployer:** Sees applicant threads, Sophia threads, team group
- **EdgeEducation:** Sees student threads, employer partner DMs, Sophia, faculty group
- **EdgeNGO/Agency:** Sees participant threads, employer partner DMs, Sophia, program team group

### Component Architecture (from spec)
- `<MessagingLayout>` — three-panel orchestrator
- `<ConversationList>` — search, filters, thread entries
- `<ThreadEntry>` — avatar, preview, timestamp, unread
- `<ActiveThread>` — header, messages, input
- `<MessageBubble>` — polymorphic (text, file, image, session card, etc.)
- `<SophiaMessage>` — cyan treatment extends MessageBubble
- `<SmartReplies>` — horizontal chip strip
- `<ContextPanel>` — role-aware participant info
- `<TypingIndicator>` — animated dots

**Estimate:** ~3-4 hours for the full messaging surface with all 8 role thread sets.

---

## Phase 3: Remaining Surfaces

### 3A. EdgeSight/Analytics (Surface 7)
Per spec in `/docs/edgesight-ux-spec.md`. EdgeStar's EdgeBoard only this sprint.
- KPI row with count-up animation
- 4-5 chart types (area, bar, gauge, heatmap, donut) via recharts
- Sophia insight strip (2-3 cards)
- Date range presets (7d/30d/90d/1y)
- Filter chips (Applications/Resume/Roadmap/Skills)
- Empty and sparse states with Sophia coaching

**Estimate:** ~2-3 hours

### 3B. Session/Booking (Surface 9)
Per spec in `/docs/session-booking-ux-spec.md`. Two-sided: EdgeGuide host + EdgeStar booker.
- Mentor browse with Sophia's picks
- Calendar week view (guide) + slot list (booker)
- 5 session types
- Booking confirmation flow
- Pre-session prep card
- Post-session review/rating
- Payment UI (mocked)

**Estimate:** ~3-4 hours

### 3C. Video Call UI (deferred from Phase 2)
- Mode switch within messaging
- 2-person video layout
- Control bar (camera, mic, screen share, chat, end call)
- Sophia coaching panel (collapsible)
- Connecting/active/ended states

**Estimate:** ~2 hours

---

## Phase Summary

| Phase | Scope | Estimate | Dead Ends Fixed |
|-------|-------|----------|-----------------|
| 1 | Wire all dead ends | ~2 hrs | 56 → 0 |
| 2 | Messaging surface | ~3-4 hrs | + new surface |
| 3A | EdgeSight analytics | ~2-3 hrs | + new surface |
| 3B | Session/Booking | ~3-4 hrs | + new surface |
| 3C | Video Call | ~2 hrs | completes messaging |

**Total remaining: ~12-15 hours of build time**

---

## Questions Before Starting

1. **Phase 1 first or Phase 2 first?** I'd recommend Phase 1 first — it's fast and eliminates every dead end, making the existing 8 surfaces feel complete. Then Phase 2 (Messaging) as the first new build. But you may want the new surface first for a demo. Which order?

2. **Messaging: full spec or MVP?** The spec includes simulated real-time, typing indicators, smart replies, thread summarization, context panel, and search. That's the full build (~4 hrs). An MVP version (conversation list + active thread + basic message types, no context panel or simulated responses) would be ~2 hrs. Full or MVP?

3. **EdgeSight this sprint?** The spec says EdgeStar only. It's charts + Sophia insights. Useful for demo but lower urgency than Messaging (which every role needs). Confirm it's in scope or defer?
