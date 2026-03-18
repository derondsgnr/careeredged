# ResumeEdge Post-Generation UX + Surface Strategy

## 1. The Post-Generation Correction Paradox

You're right to flag this. The current flow is:

```
Build from Scratch → Sophia generates resume → immediately shows optimization view with corrections
```

This is contradictory. Sophia just built this thing from your answers — why is she now telling you 4 things are wrong with her own work? That's the Upload flow's logic leaking into Build from Scratch. In Upload, corrections make total sense: you brought your resume, Sophia found problems. In Build from Scratch, she authored it.

### Two options to consider:

**Option A: Proud Presentation → Optional Optimization**

Sophia generates the resume and presents it in a "review what I built" state — no red flags, no corrections panel. The document appears clean. Sophia says something like:

> "Here's your first draft — I structured it around your achievement at TechCorp and tailored keywords for Product Designer roles. Take a look."

The user reads through. Then exit chips offer:
- "Optimize for a specific job posting" (paste a JD → THEN corrections appear, comparing resume vs. JD)
- "Edit a section" (inline editing)
- "Looks good — download"
- "Run ATS check" (triggers the scoring/correction view)

This way corrections are **user-initiated**, not Sophia second-guessing herself.

**Option B: Single-Pass Quality (what you'd expect from AI)**

Sophia generates and the result IS already optimized — the "optimization" view never exists for Build from Scratch. The resume comes out with strong keywords, quantified bullets, proper formatting because she had all the inputs. The only post-generation flow is review + edit.

Corrections/optimization only activate when the user pastes a specific job description to compare against, or uploads an existing resume later.

### My recommendation: Option A

Option B sounds ideal but removes a valuable feature (ATS scoring, keyword gap analysis). Option A preserves that power but puts the user in control. The key UX shift:

- **Upload flow**: Sophia finds problems → shows corrections (reactive)
- **Build from Scratch flow**: Sophia presents clean draft → user requests analysis (proactive)

**This means the `optimizing` state after Build from Scratch should land on a different view than after Upload.** Build from Scratch lands on a clean document preview with review-oriented chips. Upload lands on the current optimization view with the corrections panel.

### What needs to change in the code:

The `AnalyzingState → OptimizingState` transition after Build from Scratch should route to a new `ReviewState` instead of `OptimizingState`. The `ReviewState` shows:
- Clean A4 document preview (same component, no highlighted sections)
- Sophia message: proud presentation tone
- Exit chips: "Optimize for a job posting", "Edit sections", "Download", "Run ATS check"
- Clicking "Run ATS check" or "Optimize for a job posting" THEN transitions to `OptimizingState` with the corrections panel

---

## 2. Next Big Surfaces to Cover

### Remaining surface inventory:

| Surface | Spec Status | Complexity |
|---------|-------------|------------|
| ResumeEdge | Deep spec locked, P0/P1 built | Implementation refinement |
| EdgeMatch | Deep spec locked | Not yet built |
| Task Rooms | Deep spec locked | Not yet built |
| EdgeSight / Analytics | Speed-run spec needed | Medium — but varies wildly by role |
| Messaging + Video | Speed-run spec needed | Medium-high |
| Session / Booking | Speed-run spec needed | Medium |

### Recommended next build order:

1. **EdgeMatch** — locked spec, high user value, natural next after ResumeEdge (resume → job matching pipeline)
2. **Task Rooms** — locked spec, powers the milestone system already wired in Dashboard
3. **Session/Booking** — speed-run spec, then build
4. **Messaging + Video** — speed-run spec, then build
5. **EdgeSight/Analytics** — speed-run spec, then build (last because it's a read-only surface, no critical user flow depends on it)

---

## 3. Cross-Role Complexity: What Cannot Be One-Shot

This is the most important question. Here are the areas where one-shotting the spec will create debt or miss critical flows:

### A. Employer/Recruiter Experience (needs its own deep spec)

This is effectively a **different application** sharing the same shell. An employer:
- Posts jobs (creation flow, not consumption)
- Reviews candidate matches (EdgeMatch from the OTHER side — they see people, not jobs)
- Schedules interviews (Session/Booking from the OTHER side)
- Messages candidates (different Messaging context)
- Sees pipeline analytics (completely different EdgeSight)
- Gets Sophia in a different mode ("Which candidates match this role?" not "Which roles match me?")

**Why it can't be one-shot:** Every surface you've designed so far is job-seeker-centric. The employer sees a mirror image of almost every surface. EdgeMatch alone needs a full rethink: instead of "here are jobs that match your skills," it's "here are candidates that match your req." The card design, filters, scoring, and actions are all different.

**Recommendation:** Dedicated deep spec for the Employer experience. Not per-surface, but as a holistic experience that maps how each existing surface transforms for this role.

### B. Admin/Career Services Staff Experience (needs its own deep spec)

Staff members have a fundamentally different job:
- **Student management**: cohort views, individual student progress, intervention triggers
- **Outcome tracking**: employment rates, time-to-placement, satisfaction scores
- **Configuration**: managing available services, counselor assignments, program settings
- **Reporting**: institutional dashboards, exportable reports, compliance data
- **Sophia for staff**: "Which students are at risk of not completing their milestones?" — analytics-oriented, not career-guidance-oriented

**Why it can't be one-shot:** This is a management/admin tool. The information architecture is completely different (cohort-level vs. individual-level). The Dashboard alone needs to show KPIs, student pipelines, upcoming sessions, and alerts — none of which exist in the current student Dashboard.

**Recommendation:** Dedicated deep spec. This is Surface 11 or 12, not a variant of existing surfaces.

### C. Sophia's Multi-Role Behavior (needs systematic mapping, not per-surface)

You've documented Sophia's system in 3 spec files, but consider what happens across roles:

| Role | Sophia's Primary Mode | Example Prompt | Tone Shift |
|------|----------------------|----------------|------------|
| Student / Job Seeker | Career coach | "Help me write a cover letter" | Encouraging, structured |
| Career Changer | Transition guide | "How do I position my teaching experience for UX?" | Reframing, validating |
| Executive | Strategic advisor | "Review my board-ready resume" | Peer-level, concise |
| Employer | Recruiting assistant | "Find candidates with 5+ years in ML" | Professional, data-driven |
| Admin/Staff | Analytics assistant | "Which students haven't booked a session this month?" | Operational, summary-focused |

**Why it can't be one-shot:** The ACTION_MAP and NAV_MAP you built work for job seekers. An employer saying "help me with my resume" should get a completely different response than a student saying the same thing. The intent parsing layer needs role-awareness, and some actions simply don't exist for some roles (an employer can't "Build from Scratch").

**Recommendation:** A Sophia role-behavior matrix document that maps every action/intent to role-specific responses. This informs the multi-role system spec you already have but goes deeper into edge cases.

### D. EdgeMatch: Two-Sided Marketplace (needs careful flow mapping)

EdgeMatch isn't just "show jobs." It's a two-sided system:
- **Job seeker side** (specced): browse matches, apply, track applications
- **Employer side** (not specced): post jobs, review applicants, shortlist, reject, schedule interviews
- **Admin side** (not specced): moderate postings, track placement rates, intervene on stale applications

The matching algorithm's UX also differs: a job seeker sees "82% match" on a job card. An employer sees "82% match" on a candidate card. The trust model is different — job seekers need to trust the match score to apply; employers need to trust it to invest interview time.

**Recommendation:** EdgeMatch employer-side needs its own deep spec. The job-seeker spec is locked, but the employer counterpart is a separate design problem.

### E. Session/Booking: Multi-Party Scheduling (needs flow mapping)

This looks simple but has hidden complexity across roles:
- **Student** books with counselor → straightforward
- **Counselor** manages availability, sees student context before session, takes notes after → workflow tool
- **Employer** schedules interviews with candidates → different flow entirely (multi-candidate, panel interviews, time zone handling)
- **Admin** assigns counselors to students, manages counselor capacity, handles rescheduling/cancellation policies → configuration + oversight

**Recommendation:** Don't speed-run this. At minimum, map the flows for student, counselor, and employer as three distinct journey maps before writing the spec. The counselor experience alone (availability management, pre-session prep, post-session notes) is a mini-app.

### F. Messaging: Context-Dependent Communication (needs relationship mapping)

Who messages whom, and what context do they need?
- Student ↔ Counselor: ongoing relationship, session follow-ups, document sharing
- Student ↔ Employer: formal, application-linked, might need templates
- Counselor ↔ Admin: internal, operational
- Employer ↔ Admin: job posting questions, compliance

Each channel has different expectations for formality, response time, and what Sophia can help with (draft a thank-you note vs. draft a rejection email).

**Recommendation:** Don't speed-run this either. The messaging surface needs a relationship-context model that determines what features appear in each conversation type.

---

## Summary: What Needs Deep Specs vs. Speed Runs

### Needs deep spec (cannot one-shot):
1. **Employer/Recruiter holistic experience** — new spec
2. **Admin/Staff holistic experience** — new spec
3. **Sophia role-behavior matrix** — extends existing specs
4. **EdgeMatch employer side** — new spec
5. **Session/Booking** — upgrade from speed-run to medium spec (3 distinct user flows)
6. **Messaging** — upgrade from speed-run to medium spec (relationship-context model)

### Can remain speed-run:
1. **EdgeSight/Analytics (job seeker view only)** — the admin/employer analytics views fold into their respective deep specs

### The real priority question:
Do you want to finish building all job-seeker-facing surfaces first (EdgeMatch, Task Rooms, remaining speed-runs) and THEN tackle employer + admin? Or interleave them? The former gets you a complete demo for one persona faster. The latter forces you to solve the hard cross-role problems earlier.

---

*Awaiting your direction on the ResumeEdge post-gen UX (Option A vs B) and the surface/spec prioritization strategy.*
