# Surface 6: EdgeMatch (Job Board) — UX Spec

Speed-run spec. Established pattern with CareerEdge intelligence layered on top.

---

## 1. The Job

**"Find jobs that actually match my skills and goals — not just keyword spam."**

Every job board solves search. None of them solve MATCH. The user doesn't want 500 listings — they want the 12 that align with where they are in their career journey. Sophia's match intelligence is the differentiator. The layout is a solved problem. The intelligence is what makes it ours.

---

## 2. The States

### Empty (Day 0 — no profile context)

Rare state. Most users arrive with EdgePath context (target role, skills, phase). But if they navigate here before creating a roadmap:

- Sophia's bar: "I can find better matches if I know your target role. Want to set one up?" with a chip to start EdgePath.
- The job board still works — shows general listings. But match percentages are absent. Jobs display WITHOUT the match intelligence, which makes the surface feel generic. This is intentional pressure to complete EdgePath.
- A banner at top: "Complete your career profile to see personalized match scores." Not blocking, not guilt — just a value statement.

### Active (has EdgePath context, primary state)

**Three-panel layout:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Top Nav (EdgeMatch pill active)                                      │
├───────────┬───────────────────────────────────────┬──────────────────┤
│  Filters  │  Job Grid                             │  Detail Panel    │
│  (240px)  │  (flexible, 2-3 columns of cards)     │  (400px, slides │
│           │                                        │   in on select)  │
│  Role     │  ┌─────────┐  ┌─────────┐             │                  │
│  Location │  │ Job Card │  │ Job Card │             │  [Job Title]     │
│  Type     │  │ Match 92%│  │ Match 84%│             │  [Company]       │
│  Salary   │  │ Company  │  │ Company  │             │  [Match: 92%]    │
│  Remote   │  │ Location │  │ Location │             │  [Why you match] │
│  Skills   │  └─────────┘  └─────────┘             │  [Description]   │
│  Posted   │                                        │  [Apply / Save]  │
│  Match %  │  ┌─────────┐  ┌─────────┐             │                  │
│  ───────  │  │ Job Card │  │ Job Card │             │                  │
│  Saved ★  │  │ Match 78%│  │ Match 76%│             │                  │
│  Applied  │  │          │  │          │             │                  │
│           │  └─────────┘  └─────────┘             │                  │
├───────────┴───────────────────────────────────────┴──────────────────┤
│  Sophia Bottom Bar (context-aware to EdgeMatch)                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Filter Sidebar (left, 240px, collapsible on mobile):**
- Role category (from EdgePath target roles — auto-populated)
- Location (with remote toggle)
- Job type: Full-time / Part-time / Contract / Internship
- Salary range (slider)
- Experience level: Entry / Mid / Senior / Lead
- Skills (multi-select, pre-populated from profile)
- Posted: Last 24h / 7 days / 30 days
- Match threshold: minimum % (default 50%)
- Quick filters at top: "Saved" / "Applied" / "All"
- Filter chips appear above the grid when active, dismissable with ×

**Job Card (the repeating unit):**
- Glass card, standard dark treatment
- **Match percentage badge** — top-right corner, color-coded:
  - 85-100%: Lime (#B3FF3B) — "Strong match"
  - 70-84%: Cyan (#22D3EE) — "Good match"
  - 50-69%: Amber (#F59E0B) — "Partial match"
  - Below 50%: Gray (#6B7280) — no badge shown (filtered out by default)
- Company logo (small, top-left)
- Job title (primary text, #E8E8ED)
- Company name (secondary, #9CA3AF)
- Location + remote badge
- Key skills as 2-3 pill chips (matching user skills in lime, missing skills in default)
- Salary range (if available)
- Posted date (relative: "2d ago")
- Save (bookmark icon) and Quick Apply (if supported) actions in footer
- Status indicator if already applied: "Applied 3 days ago" in subtle text

**Detail Panel (right, 400px, slides in on card click):**
- Full job description
- Match breakdown — THIS is the intelligence:
  - **Skills match:** Which of the user's skills align, which are missing
  - **Experience match:** How their experience level maps
  - **EdgePath connection:** "This role aligns with your Phase 3 target. Completing 2 more milestones would increase your match to 96%."
  - **Sophia's take:** 2-3 sentences on why this is or isn't a good fit. "This is a strong match for your design leadership trajectory. The team size (8 reports) matches your Phase 4 goal. The only gap is Figma prototyping — but you're starting that module this week."
- **Action bar:**
  - "Save" (bookmark) — adds to saved jobs
  - "Apply" — opens application flow (see below)
  - "Optimize Resume for This Job" — navigates to ResumeEdge with this job's requirements as the target
  - "Not Interested" — hides the job, Sophia learns the preference
- Company overview (brief)
- Similar jobs carousel at bottom

### Applied (tracking state)

After applying, the job card state changes:
- Applied badge replaces match badge
- Status tracking:
  - **Applied** (gray) — submitted, waiting
  - **Viewed** (cyan) — employer viewed the application
  - **Interviewing** (lime) — moved to interview stage
  - **Offer** (lime, glowing) — received an offer
  - **Rejected** (red, muted) — not selected
  - **Withdrawn** (gray, dimmed) — user withdrew

A "My Applications" tab/view (toggled via the "Applied" quick filter) shows all applied jobs grouped by status. This is a mini kanban — not a separate page, just the same grid filtered and grouped.

### Loading

- Filter sidebar renders immediately (skeleton for dynamic filter counts)
- Job cards show skeleton placeholders (glass card shapes with gray blocks)
- Cards fill in with a staggered entrance animation (40ms offset per card)
- Match percentages appear after the card content (slight delay for the AI scoring)

### Error

- No results: "No jobs match your current filters. Try broadening your search." Sophia chip: "Want me to suggest related roles?"
- API failure: "Job listings are temporarily unavailable. Your saved jobs are still accessible." Show saved jobs as fallback.

---

## 3. Navigation In/Out

### How users GET here
- **Top nav:** "EdgeMatch" pill
- **EdgePath:** "3 jobs match this skill" cross-surface link on a milestone
- **Dashboard:** "23 new matches" KPI card or Sophia insight
- **Sophia:** "Show me job matches" / "Find Product Designer jobs"
- **ResumeEdge:** "See jobs matching this resume" chip after optimization

### How users LEAVE
- **To ResumeEdge:** "Optimize Resume for This Job" from detail panel
- **To EdgePath:** "Complete this milestone to qualify" link in match breakdown
- **To application:** External redirect if direct apply (opens in new tab)
- **Normal nav:** Any other nav item

### Sophia's bottom bar on this surface
- Idle: "Ask me to explain a match, find similar roles, or check your application status."
- After browsing: "You've looked at 8 Product Designer roles. The top 3 have something in common — they all want Figma prototyping. Want to prioritize that skill?"
- After saving: "Saved. Want me to optimize your resume for this posting?"
- After applying: "Applied. I'll track this and let you know when there's movement."

---

## 4. Friction Points

1. **"Why is this only 72%?"** — The match score needs explanation, not just a number. Clicking the match badge in the detail panel opens the full breakdown. Every percentage has evidence.

2. **"Apply" means different things.** Some jobs redirect to external sites. Some allow in-app apply. The user needs to know which BEFORE clicking. Label: "Apply on Company Site" vs "Quick Apply." Don't surprise them with a redirect.

3. **Information overload.** 200 job listings in a grid is overwhelming. Default sort: Match % (highest first). Default filter: 50%+ match. The user sees their BEST options first, not everything. Progressive loading (show 20, then "Load more").

4. **The "spray and pray" anti-pattern.** Users who apply to 50 jobs without optimizing for any. Sophia gently pushes back: "You've applied to 12 jobs this week. Your resume is only optimized for Product Designer roles — 7 of these are UX Research positions. Want to create a UX Research version?" Not blocking, not judging — coaching.

---

## 5. Sophia's Role — Specific to This Surface

1. **Match intelligence.** Not just "this job matches" but WHY. "This company has posted 3 similar roles in the past month — they're scaling their design team. Your leadership experience is rare in the applicant pool."

2. **Application coaching.** Before applying: "This listing emphasizes 'data-driven design.' Your resume mentions data twice. Want me to add your analytics dashboard project?" After applying: status tracking and interview prep suggestions.

3. **Pattern detection.** "You keep saving UX Research roles but your EdgePath targets Product Design. Want to explore UX Research as a secondary path?" Sophia notices discrepancies between stated goals and actual behavior.

4. **Market intelligence.** "Product Designer roles in your area have increased 15% this month. Salary ranges are trending up. Good time to apply." Data-driven nudges.

---

## 6. The Delight Moment

**The first match reveal.**

User completes their EdgePath setup, navigates to EdgeMatch for the first time. The grid populates with cards — but each one has a match percentage badge. Green, cyan, amber. The user sees "92% match" and thinks "something actually understood my profile." Clicking reveals the breakdown — and it's SPECIFIC. Not generic "you meet the requirements" but "your 4 years of React plus your design systems experience match exactly what this team needs."

Sophia's bar: "23 roles match your profile right now. Your top match is [Job Title] at [Company] — 94%."

That specificity IS the delight. Every other job board shows the same listings to everyone. EdgeMatch shows YOU why THIS job is YOUR match.

---

## 7. Multi-Role Considerations

| Role | How they interact with EdgeMatch | Surface adaptation |
|---|---|---|
| **EdgeStar** | Primary user. Browse, save, apply, track. Full feature set. | Full surface as described. |
| **EdgePreneur** | May browse for co-founder roles, freelance gigs, or partnership opportunities. Lower frequency. | Same surface, but filters include "Freelance" / "Co-founder" / "Partnership" types. Match scores calibrated against entrepreneurial skills, not job requirements. |
| **EdgeEmployer** | Posts jobs, not browses them. Different surface variant. | **Posting mode:** Instead of the job grid, employers see their posted listings with applicant counts, view metrics, and status. "Post New Job" CTA. A mini pipeline view per posting showing applicant funnel. This is a DIFFERENT right panel — not job detail, but applicant overview. |
| **EdgeGuide** | May browse on behalf of clients. | Can switch context: "Viewing as: Jordan Kim (client)" — sees the client's match scores, not their own. This helps coaches guide clients to the right opportunities. |
| **EdgeParent** | Read-only view of child's matches. | Minimal variant: same grid, but actions are "Share with [child's name]" instead of "Apply." No apply capability — the parent can flag opportunities, not apply on the child's behalf. |
| **EdgeEducation** | Tracks which jobs students are matching with. Aggregate view. | Not individual EdgeMatch. This feeds into EdgeSight analytics: "72% of graduating students match with roles paying $65K+." |
| **EdgeNGO / EdgeAgency** | Posts job listings for their programs. | Same posting mode as EdgeEmployer but simpler — fewer analytics, focused on program-specific roles (e.g., "Youth Career Mentor" posted by a community org). |

---

## 8. Component Extraction Potential

1. **Job Card** — Glass card with badge, company info, skills chips, action footer. Reusable as any "opportunity card" (courses, programs, events, grants).
2. **Match Badge** — Color-coded percentage chip with breakdown on click. Reusable for any scored/ranked item.
3. **Filter Sidebar** — Collapsible filter panel with multi-select, range sliders, toggles, chips. Reusable for any searchable list (courses, mentors, programs).
4. **Detail Panel (slide-in)** — Right panel that slides in on item selection. Reusable for any list → detail pattern.
5. **Application Status Tracker** — Status badge with stage progression. Reusable for any tracked process (program enrollment, grant applications).
6. **Search + Filter Chips** — Active filter display above results with dismissable chips. Standard pattern.

---

## 9. The Apply Flow

### In-App Quick Apply (when supported)

1. User clicks "Quick Apply" on detail panel
2. Modal/panel shows: pre-filled application from profile data
   - Name, email, phone (from profile)
   - Resume version selector (from ResumeEdge — Sophia recommends the best version for this job)
   - Cover letter selector (from ResumeEdge — or "Generate one for this job" button)
   - Optional: "Anything else?" freeform text
3. "Submit" sends the application
4. Confirmation: "Applied. I'll track this for you." Card status updates to "Applied."

### External Apply

1. User clicks "Apply on [Company Site]"
2. Confirmation: "This will open [company].com in a new tab. Want me to copy your optimized resume link?"
3. External site opens. EdgeMatch marks the job as "Applied (external)" for tracking.
4. Sophia follows up in 3 days: "You applied to [Job] on [date]. Have you heard back? [Yes, interviewing] [No response yet] [They passed]" — manual status update so tracking stays current.

---

## 10. Voice Mode

Same universal Sophia voice pattern (Section 11 of ResumeEdge spec applies).

ResumeEdge-specific voice scenarios:
- "Hey Sophia, find me Product Designer jobs in Austin that are remote-friendly" → Sophia applies filters, grid updates
- "Tell me about this match score" → Sophia explains the selected job's match breakdown
- "Apply to this one with my Product Designer resume" → Triggers Quick Apply flow with the right version pre-selected
