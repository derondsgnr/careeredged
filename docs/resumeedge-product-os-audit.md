# ResumeEdge — Product OS Audit

Cross-functional evaluation of current implementation against the approved UX spec (`/docs/resumeedge-ux-spec.md`) using the Product OS skill (`/docs/product-os-skill.md`).

**Date:** 2026-03-17
**Status:** Exploration prototype, not production build

---

## DESIGN: Does this improve user experience?

### One job per screen?
**PASS (partially).** The active state has one job: optimize your resume with Sophia's coaching. But the empty state conflates two very different jobs into two buttons that lead to the same code path — which is the core failure. - this is okay if they haven't upload resume at any point. also should this be a todo

### Empty/error/loading states designed?

| State | Spec Requirement | Current Implementation | Verdict |
|-------|-----------------|----------------------|---------|
| **Empty — "I have a resume"** | Upload → Sophia immediately parses and shows extracted info (name, role, years, skills). First trust moment. | Upload → jumps straight to analyzing animation. No parse confirmation. No trust moment. | **FAIL** |
| **Empty — "Build from scratch"** | Sophia asks 4-5 targeted questions (current role, target role, years(didn't we collect this during onboarding?), achievements). Conversational. Voice-enabled. Generates first-draft resume in <3 min. Familiar onboarding pattern. | Calls `setState("analyzing")` — literally identical to upload. No conversation. No questions. No draft generation. The button exists but the flow doesn't. | **FAIL — MISSING ENTIRELY** |
| **Analyzing** | Sequential score reveal: each sub-score fills in with contextual copy ("Scanning 400+ keywords for Product Designer..."). Score gauges animate. Sophia contextualizes: "Reading your resume against 23 Product Designer listings in your area..." | Sequential steps with checkmarks. Functional but doesn't fill in score gauges — goes straight from analyzing to full active state. Steps are text-only, not connected to actual score display. | **PARTIAL** |
| **Active** | Sequential reveal: document first (1s) → score (2s) → "Want to see suggestions?" prompt. Don't dump everything at once. | All three panels (document, score, chat) appear simultaneously. Suggestions start immediately in chat. No pacing. Cognitive overload on first view. | **FAIL — violates friction point #4 from spec** |
| **Error states** | Upload failure, parse failure (with partial extraction), optimization timeout — all specified with exact Sophia copy. | None implemented. | **FAIL** |
| **Loading** | Document skeleton in A4 layout, empty gauges, "Loading your resume..." | Not implemented — no cached data scenario in prototype. | **N/A for prototype** |

### 30-second completion possible?
**N/A.** This is a longer-form interaction by nature (5-15 min). But individual suggestion accept/reject should be <5s — currently functional.

### Accessibility?
**NOT EVALUATED.** No keyboard nav, no aria labels, no screen reader considerations in current code. - also the colors, contrast

---

## Spec Feature Completeness

### What's implemented:

| Feature | Status | Notes |
|---------|--------|-------|
| Two-column layout (doc left, panel right) | **DONE** | Correct structure |
| Inline diffs on document | **DONE** | Strikethrough + green suggested. Good. |
| Section click → highlight | **DONE** | activeSuggestionKey + cyan border |
| Collapsible score bar | **DONE** | Compact → expanded. Space-efficient. |
| Score breakdown (4 sub-scores) | **DONE** | Flat bars, not gauge arcs as spec requires |
| Section verdicts (good/warn/fix) | **DONE** | In expanded score panel |
| Sophia coaching chat | **DONE** | Conversational flow with suggestion cards |
| Accept/Skip per suggestion | **DONE** | With undo capability |
| Score updates on accept | **DONE** | +4 per accept |
| Empty state (upload path) | **DONE** | Basic but functional |
| Analyzing animation | **DONE** | Sequential steps |
| Cross-surface nav | **DONE** | Top nav + onNavigate |
| Chat input with mic icon | **DONE** | Visual only — no voice functionality |

### What's missing entirely:

| Feature | Spec Section | Impact |
|---------|-------------|--------|
| **"Build from scratch" flow** | Section 2 (Empty), Section 9 (Resolved #2), Section 11 (Voice) | **CRITICAL** — ~30% of users don't have a resume. This is a dead end for them. The button exists but does nothing different from upload. |
| **Upload parse confirmation** | Section 2 (Empty) | **HIGH** — "She actually read it" is the first trust moment. Skipping it loses trust before the relationship starts. |
| **Sequential reveal** (doc → score → suggestions prompt) | Section 4 (Friction Points) | **HIGH** — Spec explicitly identifies cognitive overload as the highest friction point and prescribes pacing. We violate this. |
| **Review Mode vs Quick Optimize toggle** | Section 2 (Active) | **MEDIUM** — Two modes for different trust levels. Currently only review mode exists. |
| **Accept All** | Section 2 (Active) | **MEDIUM** — Power user path. Missing. |
| **Cover Letter tab** | Section 2 (Cover Letter) | **MEDIUM** — Not expected in first prototype, but specified. |
| **Interactive Resume tab** | Section 9 (Resolved #3) | **LOW for now** — Future feature, but architecturally it's a third tab. |
| **Multi-target role selector** | Section 2 (Multi-Target) | **MEDIUM** — Score is hardcoded to "Product Designer." No way to switch targets. |
| **Version management** | Section 2 (Dense) | **LOW for prototype** — Power user feature. |
| **A4/Letter document proportions** | Section 2 (Active) | **MEDIUM** — Spec says "rendered as it would appear on paper." Current doc is a free-flowing div, not paper-shaped. |
| **Score gauge arcs** | Section 2 (Active) | **LOW** — Flat bars work but don't match dashboard gauge pattern. |
| **Lime flash on accepted changes** | Section 2 (Active), Section 6 (Delight) | **MEDIUM** — "Progress as delight" — watching the score tick up AND seeing the change flash. We have score tick, missing the flash. |
| **Post-optimization chips** | Section 3 (Navigation Out) | **MEDIUM** — "See jobs matching this resume" chip. Currently no exit affordances. |
| **Sophia idle/contextual prompts** | Section 3 (Sophia's bottom bar) | **LOW** — Chat exists but no idle state contextual prompts. |
| **Voice mode** | Section 11 | **LOW for prototype** — Cross-surface feature, not ResumeEdge-specific. |
| **EdgeGuide review mode** | Section 10 | **LOW for prototype** — Role-specific variant. |

---

## PM: Does this move business metrics?

### Tied to North Star?
**PARTIAL.** The resume optimization flow works but isn't connected to EdgePath milestones or EdgeMatch job data. The spec explicitly requires:
- Target role pulled from EdgePath automatically
- "Optimize for this job" entry from EdgeMatch
- "Your Phase 2 milestone includes 'Tailor resume for UX Research'" — Sophia connecting surfaces

Currently, "Product Designer" is hardcoded. No dynamic connection.

### Success criteria defined?
From the spec, the delight moment is the **first score reveal**. The implementation has this but doesn't pace it correctly (sequential reveal). The secondary delight (score ticking up on accept) IS implemented.

### Missing cross-surface connections: - wire
- EdgePath → ResumeEdge with pre-selected target role: **NOT WIRED**
- EdgeMatch → ResumeEdge "Optimize for this job": **NOT WIRED**
- ResumeEdge → EdgeMatch "See matching jobs" after optimization: **NOT WIRED**
- Dashboard resume score KPI → ResumeEdge: **NOT WIRED**

---

## ENGINEERING: Is this technically sound?

### For a prototype: Acceptable.
- State management is local React state — fine for exploration
- Chat message IDs use `Date.now()` — collision risk but acceptable for demo
- No actual AI backend — expected; mock responses are reasonable
- The `advanceToNextSuggestion` uses `setSuggestionIndex` inside a state updater callback and reads from `INITIAL_SUGGESTIONS` constant — works but fragile

### Concern:
The `useEffect` for building initial chat messages has `suggestions` in scope but not in dependency array. Won't cause bugs because it only runs on state change to "active," but it's a code smell.

---

## AI: If AI-powered, is it reliable?

**N/A for prototype.** No real AI integration. But the spec defines clear requirements:
- LLM evaluates against structured rubric from job descriptions
- Relative scoring ("top 22% of resumes targeting Product Designer")
- Evidence-based suggestions with market data
- Guardrails and fallbacks for parse failures

None of this is implemented — nor should it be at this stage. But the mock data should demonstrate the SHAPE of real AI output. **Current mock data does this well** — suggestions have reasons citing percentages and job listing data.

---

## MOTION: Does interaction feel right?

| Element | Status |
|---------|--------|
| Page transitions | DONE — motion/react with EASE curve |
| Score bar expand/collapse | DONE — AnimatePresence |
| Analyzing steps | DONE — opacity transitions |
| **Lime flash on accepted change** | **MISSING** — spec's secondary delight moment |
| **Sequential reveal pacing** | **MISSING** — everything appears at once |
| **Score gauge animation** | **MISSING** — no gauge arcs, no fill animation |
| Chat auto-scroll | DONE — smooth scroll on new message |

---

## BRAND: Is this on-brand?

**MOSTLY PASS.**
- Dark glass aesthetic: Yes
- Green/lime accents: Yes (score badge, accept buttons, inline diff)
- Cyan for information/AI: Yes (section headers, Sophia accents)
- Proper hex hierarchy (#E8E8ED, #9CA3AF, #6B7280, #374151): Yes — no reduced opacity
- Typography: Uses --font-display and --font-body consistently
- SophiaMark integration: Yes

**One concern:** The inline diff uses `text-[#EF4444]/60` (Tailwind opacity modifier on a hex color) for strikethrough text. This violates the "no reduced opacity for text hierarchy" rule. Should use a proper hex code like `#EF444499` in style prop or a dedicated muted-red hex.

---

## MARKETING: Can we tell this story?

**PARTIAL.** The core value prop is visible: "Upload your resume → get a score against your target role → accept AI suggestions → watch your score improve." That's a clear story.

**But the "Build from scratch" story is broken.** The marketing angle of "Don't have a resume? Sophia will build one from a conversation" is arguably the MORE compelling story for career changers — and it doesn't work at all.

---

## FINANCE: Does the math work?

**N/A for prototype.** No pricing, no unit economics. But the spec's mention of voice mode and LLM-powered analysis has cost implications that should be tracked when moving to production.

---

## Summary: Priority Fixes

### P0 — Must fix before review is meaningful:
1. **Build from scratch flow** — Implement the Sophia-guided conversational resume builder (4-5 questions → generated draft → enter active state)
2. **Upload parse confirmation** — After "upload," show extracted info (name, role, years, skills) before entering analysis
3. **Sequential reveal** — Pace the active state: document first → score fills in → "Want to see my suggestions?" prompt

### P1 — Should fix for the exploration to be credible: fix
4. **A4 document proportions** — Make the left column look like a real document, not a content div
5. **Lime flash on accept** — Add brief flash animation when suggestion is applied to document
6. **Post-optimization exit chips** — "See matching jobs" → EdgeMatch, "Back to roadmap" → EdgePath
7. **Fix opacity text color** — Replace `text-[#EF4444]/60` with proper hex

### P2 — Can defer to component extraction phase:
8. Review Mode vs Quick Optimize toggle
9. Accept All button
10. Multi-target role selector
11. Score gauge arcs (instead of flat bars)
12. Cover Letter tab
13. Version management

---

## The "Build from Scratch" Question

This deserves its own callout because it's the biggest gap.

The spec describes this flow (Section 9, Resolved Decision #2):

> Sophia asks 4-5 targeted questions (current role, target role, years of experience, 2-3 key achievements) and generates a first-draft resume in under 3 minutes. This becomes the starting document. The user then enters the normal Active state.

The current implementation has a button labeled "Build from scratch with Sophia" that calls `setState("analyzing")` — the exact same code path as file upload. There is no conversation, no questions, no draft generation. The user sees the same analyzing animation and then the same pre-built mock resume.

**Why this matters systemically:** The user persona most likely to use "Build from scratch" is the career changer with no existing resume — exactly the persona the platform is designed for (EdgeStar). If we can't serve them on this surface, we're telling ~30% of our target users "come back when you have a resume." That's a product failure, not a UI bug.

**Implementation approach:** A new state `"building"` between empty and analyzing. Sophia asks questions in a chat-like interface (reusing the coaching chat component). After 4-5 exchanges, she generates the resume sections and transitions to active state with the generated content. The mock version would have pre-scripted Q&A with a 2-3 second "generating" pause before populating the document.
