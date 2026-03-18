# Navigation Architecture — CareerEdge

**Status:** Resolved (March 2026)

---

## Root Cause of Inconsistency

Three independent `TopNav` implementations existed simultaneously:

| File | Pills | Router-aware? |
|---|---|---|
| `role-shell.tsx` → `TopNav` | Per `ROLE_CONFIGS` (5–7, role-specific) | ✓ `useNavigate` internal |
| `shell-synthesis.tsx` → `TopNav` | 7 hardcoded for EdgeStar only | ✗ `onNav` callback |
| `edgepath-option-a.tsx` → `TopNav` | 5 hardcoded, same for all roles | ✗ `onNavigate?.(target)` |

Result: navigating from the dashboard (7 pills) to EdgePath (5 pills) made Sessions and Analytics disappear. Switching roles on EdgePath showed the same hardcoded pills regardless of role identity.

**Fix:** `role-shell.tsx` now exports `SharedTopNav` — a standalone version of the canonical nav with URL-based active-pill detection built in. Both `edgepath-option-a.tsx` and `shell-synthesis.tsx` import and use it. `ROLE_CONFIGS` is the single source of truth for what pills each role sees.

---

## Navigation Layers

### Layer 1 — Top Bar (primary destinations)
5–7 pills per role drawn from `ROLE_CONFIGS`. Always visible, always consistent across all surfaces for a given role.

**Pills without a `surfaceId`** (e.g. Guide's "Clients", Employer's "Pipeline") open Sophia with a context prompt instead of navigating. Sophia then surfaces the data inline and offers a deep-link chip. This keeps the nav uncluttered while still providing access.

### Layer 2 — Sophia Bottom Bar (contextual / secondary)
The Sophia bar chips surface time-sensitive, role-specific actions that don't warrant a permanent nav slot. Examples:
- "Sharon's session is in 2 hrs" → chips: "View prep brief", "Message Sharon"
- "Your pitch deck is 80% done" → chip: "Continue in Task Room"

This is intentional: Sophia as ambient intelligence surfaces the right secondary destination at the right moment, rather than forcing users to scan a cluttered top bar.

### Layer 3 — Deep links (contextual entry only)
Some surfaces are intentionally **not** top-bar destinations. They are always reached contextually:

| Surface | Entry point | Why not top-bar? |
|---|---|---|
| Task Room (`/:role/taskroom/:id`) | EdgePath milestone chip, Sophia chip | Always tied to a specific milestone; makes no sense as a standalone landing |
| Archive routes | DevTools panel only | Design exploration, not user-facing |

Task Room has no primary nav pill by design. If a user asks Sophia "what tasks do I have?", she responds with a list and chips to the relevant room. This is the correct pattern.

---

## Route Inventory

| Route | Nav entry | Notes |
|---|---|---|
| `/` | — | Public landing |
| `/login` `/signup` | — | Auth flows |
| `/onboarding` | — | Reached post-signup |
| `/:role` | Home pill | Dashboard |
| `/:role/edgepath` | Roadmap pill | |
| `/:role/resume` | Resume pill | EdgeStar, EdgePreneur |
| `/:role/jobs` | Jobs / Opportunities pill | |
| `/:role/messages` | Messages pill | |
| `/:role/analytics` | Analytics / Earnings / Outcomes / Impact pill | Label varies by role |
| `/:role/sessions` | Sessions pill | EdgeStar, EdgePreneur, EdgeGuide |
| `/:role/taskroom` | Milestone chip → Sophia chip | Deep link only |
| `/:role/taskroom/:milestoneId` | Same | |
| `/archive/*` | DevTools NAVIGATE panel | Dev/design only |

### Roles where Sessions is not in `ROLE_CONFIGS` nav:
EdgeParent, EdgeEmployer, EdgeEducation, EdgeNGO, EdgeAgency — intentional. These roles access session-like scheduling through role-specific terminology (office hours, events, workshops) via Sophia chips, not a top-bar pill. If that changes, add `surfaceId: "sessions"` to the relevant role's pill in `ROLE_CONFIGS`.

---

## Adding a New Route

1. Add route to `routes.tsx`
2. Decide: primary nav or Sophia-guided?
   - **Primary:** add pill with `surfaceId` to relevant role(s) in `ROLE_CONFIGS` in `role-shell.tsx`
   - **Sophia-guided:** add pill with `sophiaPrompt` (no `surfaceId`) — Sophia opens with context and can chip to the destination
   - **Deep-link only:** add no pill; surface it through Sophia chips in the Sophia Bottom Bar context config
3. `SharedTopNav` auto-detects active pill via URL — no extra wiring needed
