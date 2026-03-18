# Layer 3 Gate — Decision Log
_Recorded: March 18, 2026_

---

## 1. EdgeParent — Notes + Roadmap Configuration

### Notes: Confirmed ✓
Parents can add notes/encouragement on child milestones. Architecture accommodates this with no structural change — the parent TaskRoom branch is already a separate render path from the student view, so a note input is purely additive there. The Family surface (Layer 3) is also a natural home for notes at the relationship level.

### Roadmap Configuration: One decision needed before building

The current read-only architecture does not block parent roadmap configuration — it can be extended. But the UI pattern forks significantly on one product question:

| Model | Pattern | Student agency |
|---|---|---|
| **Parent suggests, student accepts** | Family surface → "Propose a goal" panel. Goal appears on student's EdgePath as a pending suggestion. Student or Sophia accepts/dismisses. | Preserved |
| **Parent sets** | Parent gets an edit mode on the child's EdgePath directly. Goals are applied without student input. | Reduced |

**Recommendation:** Build the suggest/accept model. It is consistent with the platform's student-agency philosophy, Sophia can mediate the handoff ("Your parent added a goal — want to add it to your roadmap?"), and it is less architecturally invasive. The directive "parent sets" model can be added later as a configuration option for EdgeEducation or EdgeNGO-managed cohorts where institutional control is expected.

**Decision needed from team:** Confirm suggest/accept as the parent roadmap config pattern before Layer 3 Family surface build. Roadmap config is not in scope for the Layer 3 Family MVP — notes only in Layer 3, config in a later pass once the model is confirmed.

---

## 2. EdgeEmployer Pipeline View — Both ✓

Build a kanban/list toggle. Both views share the same candidate data model — the toggle is a display switch, not a separate surface. Kanban will be the default (column-per-stage), list will be a dense sortable table. Toggle persists in local state per session.

---

## 3. Events QR Check-in — Build both, business decides default

Build both options in the UI:
- **In-app scanner** — camera permission request → viewfinder overlay → confirm check-in
- **Native handoff** — "Open camera" CTA that deep-links to the device camera app with a pre-scanned URL pattern

Both will be present. A toggle or settings flag will control which appears as the primary CTA. Business picks the default; no UI work is blocked.

---

## Layer 3 Surfaces — Build order

1. Family (EdgeParent + EdgeStar child view, notes in scope, config deferred)
2. Pipeline (EdgeEmployer, kanban + list toggle)
3. Events (all roles, QR dual-option)
4. Programs (EdgeEducation + EdgeNGO)
5. Clients (EdgeAgency)
6. Funding (EdgePreneur, teaser already in dashboard)
