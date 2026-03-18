# Sophia Interaction UX Spec — Validation & Hypotheses

## The Question

User wants the H2 bottom bar pattern: content area adapts to whatever task needs to be done, once complete it goes away. Before building 4 variations, validate this against top 1% products and the product OS skill.

---

## Validation Against Top 1% Products

### Products Examined (AI-assistant-in-product patterns only)

| Product | Pattern | Where AI Lives | What Happens After |
|---|---|---|---|
| **Cursor** | Bottom panel, expandable | Inline in editor, cmd+L | Collapses when done. Response stays visible until dismissed. |
| **Notion AI** | Inline, triggered by Space | Operates in the content itself | Result replaces the AI surface — it becomes the content. Gone. |
| **Figma AI** | Bottom command bar | Results in canvas | Bar returns to idle. Output lives in the design. |
| **Linear** | cmd+K modal | Centered overlay | Disappears after action. No persistent state. |
| **Claude** | Full-page bottom input | Conversation fills upward | Conversation persists. Never "goes away." |
| **ChatGPT** | Full-page bottom input | Same | Same — conversation is the product. |
| **Raycast** | Launcher overlay | AI chat is one mode in the launcher | Disappears when you switch focus. |
| **Arc** | cmd+T command bar | Top of browser | Disappears after navigation. |
| **GitHub Copilot Chat** | Side panel in VS Code | Right panel, resizable | Stays open until manually closed. Panel is persistent but collapsible. |

### The Split

The top 1% falls into two camps:

**Camp A: AI IS the product** (Claude, ChatGPT)
- The conversation surface is full-page, persistent, and the conversation never "goes away"
- This is wrong for CareerEdge — Sophia is a layer, not the product

**Camp B: AI is a layer within the product** (Cursor, Notion, Figma, Linear)
- The AI surface is ephemeral, contextual, and task-scoped
- It appears when needed, does its job, and recedes
- The user's primary focus (code, document, design, tasks) is never displaced
- **This is CareerEdge's model. Sophia is Camp B.**

### What Camp B products agree on

1. **The AI surface is secondary to the content surface.** Cursor's chat panel never exceeds 40% of the viewport. Notion's AI block appears inline, never a modal. Figma's AI bar is anchored to the bottom.

2. **Completion = dismissal.** When the task is done, the AI surface contracts. The output lives in the primary surface (the code, the document, the design). The AI doesn't linger.

3. **Escalation exists.** Cursor has inline suggestions (tiny) → inline chat (medium) → side panel (large). Notion has Space command (tiny) → AI block (medium) → "Ask AI" page (large). The AI surface scales with query complexity.

4. **Context is automatic, not declared.** Cursor knows your file. Notion knows your page. Figma knows your selection. The user never tells the AI where they are — it already knows. Sophia should already know the user is on EdgePath Phase 2 with 63% progress.

---

## Validation Against Product OS Skill

### Design Lead Checklist

- **One job per screen?** The bottom bar that adapts satisfies this — it presents one Sophia interaction at a time, in-context. A full right panel or modal risks competing with the primary content for attention.
- **30-second completion possible?** Quick queries (chip taps, single-turn questions) must resolve in the bar itself. Only multi-turn flows should escalate to a larger surface.
- **Empty/error/loading states designed?** The 4 hypotheses must spec: bar idle state, typing state, thinking/loading state, response state, error state ("I can't help with that here"), and completion/dismissal state.

### Motion Designer Checklist

- **Easing curves appropriate?** Bar expansion must use the project EASE curve `[0.32, 0.72, 0, 1]`.
- **300-600ms timing?** Bar expand: 300ms. Panel slide-in: 400ms. Dismissal: 200ms (faster out than in — this is an established pattern across all reference products).
- **State transitions smooth?** The transition from "idle bar" → "expanded conversation" must feel like the same surface stretching, not a new element appearing.

### PM Checklist

- **Tied to North Star?** Sophia engagement → task completion → career advancement. The faster Sophia resolves a query, the more the user trusts the product. Inline resolution (bar) has lower friction than panel resolution.
- **RICE scored?** High reach (every user, every page), high impact (Sophia IS the product differentiator), medium confidence (need to validate which pattern users prefer — hence 4 hypotheses), low effort (shared component, surface-adaptive).

### Brand Checklist

- **Within sensory grammar?** Sophia's surface uses cyan (#22D3EE) as the accent, glass depth, and the SophiaMark. The bar expansion should introduce a subtle cyan glow at the top edge — Sophia's "arriving" signature from the warmth mapping.
- **Follows lexicon?** Direct for functional moments, warm for emotional moments. The bar copy adapts per the warmth mapping doc.

---

## The H2 Instinct — Validated With One Caveat

**Your instinct is correct:** The bottom bar should be the primary Sophia interaction surface. The content area adapts, shows the response or task UI, and dismisses when complete.

**The caveat:** Some interactions can't fit in an expanded bottom bar. Interview prep with back-and-forth. Resume review with a document preview. Career counseling with a conversation history. These need a larger surface.

**The pattern from the top 1%:** Escalation tiers.

```
Tier 1: Inline (bar stays same height)
  → Chip tap navigates directly
  → Single-line response appears in the context text area
  → Example: "You have 3 new matches" → user taps "View matches" → navigates

Tier 2: Expanded (bar grows to ~35-40% of viewport)
  → User types a question, Sophia responds with a 2-3 message exchange
  → Task UI appears (e.g., quick comparison, confirmation)
  → Example: "Should I prioritize Figma or UX Research?" → Sophia shows a comparison card → user decides → bar collapses

Tier 3: Full panel (right side panel or focused overlay)
  → Multi-turn conversation, document review, guided flow
  → Triggered by: "Continue in full view" link, or when Sophia detects complexity
  → Example: "Help me prep for my Figma interview" → Sophia opens panel with structured prep flow
  → This IS Surface #9 from the IA doc
```

This three-tier model is exactly what Cursor does. Inline completions → chat panel → full agent mode. Each tier is a natural escalation, never a jarring mode switch.

---

## The Chip Concern — Navigation vs. Conversation

Your worry about chips being confusing (some navigate, some start conversations) is valid. Here's how the top 1% solve it:

**Linear's approach:** All commands in ⌘K are actions. Some navigate ("Go to..."), some execute ("Create issue"), some search ("Find..."). The user doesn't think about the difference because the RESULT is immediate and obvious.

**The fix for CareerEdge:** Visual differentiation + immediate feedback.

| Chip Type | Visual Treatment | Behavior | Example |
|---|---|---|---|
| **Navigate** | Text + → arrow | Instant navigation, bar stays idle | "View matches →" |
| **Ask** | Text + Sophia mark (tiny) | Populates input + auto-sends, bar expands with response | "Why this milestone first?" |
| **Action** | Text + action icon (play, check) | Executes directly, brief confirmation in bar | "Start interview prep" (opens prep mode) |

The arrow (→) is universal shorthand for "this takes you somewhere." The Sophia mark is her identity. The action icon implies doing. Three visual cues, zero ambiguity.

Additionally: when a chip navigates, the bar context text updates to confirm ("Navigating to EdgeMatch..."). When a chip starts a conversation, the bar expands with Sophia's response. The user learns the difference through ONE interaction, not explanation.

---

## The 4 Hypotheses — What to Build

All four share:
- Same bottom bar idle state (H2's SophiaBar pattern)
- Same suggestion chips with the visual differentiation above
- Same SophiaMark, same cyan accent, same EASE curve
- Context-aware messages based on current surface

**What differs: how the bar expands when the user engages.**

### Hypothesis A: "The Stretch"
The bar stretches upward. The conversation grows inside the bar's expanded height. Content area above shrinks proportionally. The bar IS the conversation surface.
- **Reference:** Claude's input area (conceptually), but capped at 40% viewport
- **Best for:** Quick exchanges (1-3 turns)
- **Weakness:** Long conversations feel cramped; content displacement

### Hypothesis B: "The Drawer"  
The bar triggers a drawer that slides up from the bottom, overlaying 50-60% of the viewport. A handle at the top lets the user drag to resize. Content is visible but dimmed behind.
- **Reference:** Mobile sheet pattern (iOS, Google Maps), adapted for desktop
- **Best for:** Medium conversations, task UIs (comparison cards, quick forms)
- **Weakness:** Overlaying content means the user can't reference what's behind it easily

### Hypothesis C: "The Panel"
The bar stays as-is. Clicking "Ask Sophia" or typing slides a right-side panel in (like the existing TaskRoom panel in the mind map). Content area shrinks. The panel has full conversation + task UI capability.
- **Reference:** GitHub Copilot Chat, Cursor's side panel, Figma's inspector
- **Best for:** Multi-turn conversations, document review, guided flows
- **Weakness:** Feels "heavier" — users may hesitate to open it for simple questions

### Hypothesis D: "The Float"
A floating card (glass, rounded, ~400px wide) rises from the bar's "Ask Sophia" button position. Anchored to bottom-right. Doesn't displace content. Can be dragged/repositioned. Has its own conversation thread.
- **Reference:** Intercom/Drift chat widgets, but with CareerEdge glass treatment
- **Best for:** Ongoing conversations while working, doesn't interrupt flow
- **Weakness:** Risk of feeling like a generic chat widget; doesn't feel "built-in"

### My Recommendation (before you see them)

**Combine A + C with escalation.** Start with A (bar stretches for quick queries). If the conversation exceeds 3 turns or Sophia detects complexity, offer "Open full view →" which transitions to C (right panel). This matches the Cursor pattern exactly and satisfies both the quick-query and deep-conversation use cases.

But build all 4 so you can feel the difference.

---

## Decision: Float → Panel (Cherry-picked)

**User chose:** Float for quick queries, Panel for deep conversations, with Float expandable to Panel.

**Implementation:** Single unified component that starts as Float (compact glass card, bottom-right) and auto-expands to Panel (right side panel) when:
1. User clicks the expand button
2. Conversation exceeds 3 turns
3. Query is detected as complex (resume review, interview prep, skill gap analysis, application strategy, networking)

User can minimize Panel back to Float at any time.

### Adaptive Content Types Built

| Content Type | Renders As | Triggered By |
|---|---|---|
| **cards** | Data cards with title, subtitle, value badge | Job matches, milestone lists, contact lists |
| **scorecard** | Score with animated breakdown bars | Resume review, career score |
| **checklist** | Interactive checkable task list | Daily focus, optimization steps |
| **comparison** | Side-by-side table with color-coded highlights | Interview rounds, strategy comparison |
| **timeline** | Vertical timeline with status rail | Roadmap progress, prep plans |
| **skill-bars** | Animated skill bars with target markers | Skill gap analysis |
| **document** | Annotated document highlights (fix/warn/good) | Resume annotations |
| **followup-chips** | Contextual follow-up suggestions (ask/action/navigate) | After every Sophia response |

### Scenarios Covered

1. **View matches** → Job cards with match percentages
2. **Open roadmap** → Timeline with milestone statuses
3. **What should I focus on today** → Priority checklist with time estimates
4. **Review my resume** → Scorecard + annotated document (auto-expands to Panel)
5. **Optimize resume** → Checklist of specific fixes
6. **Start interview prep** → Timeline plan (auto-expands to Panel)
7. **Help me prep for my Figma interview** → Comparison table of interview rounds
8. **What skills do I need** → Skill bars with gap analysis (auto-expands to Panel)
9. **Why this milestone first** → Comparison table with data
10. **Why is Figma my top match** → Cards with alignment scores
11. **Help me apply** → Prioritized application cards with urgency
12. **Help me network** → Contact cards with connection strength

---

## Shared Component Architecture

Regardless of which hypothesis wins, the shared component (`SophiaInteraction`) has these states:

```
idle       → Context text + chips (current bar)
focused    → Input active, chips visible, bar may have subtle glow
thinking   → Typing indicator, SophiaMark pulses cyan
responding → Sophia's response renders (text, cards, comparison UI)
acting     → Task UI (e.g., "Choose path A or B", "Confirm booking")
complete   → Brief confirmation, then transition back to idle (200ms)
error      → "I can't help with that here. Try [suggestion]."
```

This state machine is the Sergushkin reference's exact model, adapted for Sophia. One component, 7 states, context-adaptive content.

---

## Surface-Adaptive Behavior (Per Your Q4)

The shared component adapts its **content**, not its **structure**:

| Surface | Idle Text | Chips | Response Style |
|---|---|---|---|
| Dashboard | "3 new job matches since yesterday" | View matches →, Open roadmap →, Ask why | Inline stats, navigation |
| EdgePath (list) | "Phase 2 is 63% complete. 2 milestones this week." | Quick wins, Compare paths, Why this order? | Milestone comparison cards |
| EdgePath (map) | Dynamic per selection (getSophiaMessage) | Explore phase →, Ask about milestone | Spatial annotation |
| ResumeEdge | "Your resume scores 72 ATS. 3 quick fixes available." | Show fixes, Optimize →, Compare versions | Diff view, score breakdown |
| EdgeMatch | "23 roles match your profile. 5 new today." | View new →, Refine search, Why these? | Job comparison cards |

Same component. Different content. Sophia feels adaptive because she IS — the data changes, not the interface.