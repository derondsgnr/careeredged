# Onboarding Architecture — Addressing Your Pushbacks

## The "no phases" correction — heard.

You're right to push on this. I was hedging when I should have been committing. Everything gets designed now. C1 through C5 aren't phases — they're layers of the same product. The shell has all three navigation tiers. The dashboard has generative surfaces. Task Rooms exist. The roadmap is living. Sophia is as intelligent as we can make her. We design the full vision, not a subset.

## Onboarding for all roles — the divergence architecture

You asked: "One onboarding for all? Or separate? At what point does it diverge?"

Here's my honest position: **One entry, two paths, same Sophia.**

### Why two paths

The anonymous value demo (steps 1-2) — where we generate something valuable before asking for an email — only works for roles where a standalone artifact can be produced anonymously:

- **EdgeStar** → Career roadmap. Works. This is the product's signature moment.
- **EdgePreneur** → Business roadmap exists in the PRD (11-question assessment → business plan with phases). Could work anonymously with 2 seed questions.

For the other 6 roles, the value is relational, not artifactual:
- **EdgeParent** needs a connected child. Can't demo that anonymously.
- **EdgeEmployer** needs a talent pool. Can't demo that anonymously.
- **EdgeGuide** needs clients. Can't demo that anonymously.
- **EdgeEducation** needs students. Can't demo that anonymously.
- **NGO/Agency** needs a community. Can't demo that anonymously.

So the architecture:

```
ORGANIC PATH (EdgeStar, EdgePreneur)
Landing → 2 questions → Generate artifact → Reveal (aha moment) → "Save this" → Signup → Role confirm → Sophia's 3 Qs → Dashboard

INSTITUTIONAL PATH (EdgeParent, EdgeGuide, EdgeEmployer, EdgeEducation, NGO, Agency)
Landing → Signup → Role selection → Sophia greets + 3 role-specific Qs → Dashboard with first guided action
```

### What makes both paths feel like the same product

- **Sophia is present in both.** She's not a feature of one path — she's the host of the entire experience.
- **The visual language is identical.** Same dark canvas, same transitions, same component patterns.
- **The emotional arc is the same:** arrival → understanding → first value → commitment. The organic path delivers value before commitment. The institutional path delivers Sophia's promise of value ("I'll help you find the right candidates" / "I'll help you track your child's progress") before the first task.
- **Both paths end at the same place:** a dashboard with one clear first action and Sophia's bar active.

### The role detection question you flagged

Yes — the onboarding can detect role from behavior. Not as a replacement for explicit selection, but as Sophia's first smart moment:

If someone types "I want to hire engineers" in an open prompt → Sophia suggests EdgeEmployer at role confirmation. - hm so currently the entry point is sign up and the selecting role(all the options thrown at you- which is why i need us to simplify that)
If someone types "my daughter needs career help" → Sophia suggests EdgeParent. - claude played with the idea 3 big options with sub options; I want to build my career, i want to build for someone else, i am with an organization. i roughly praraphrased, but use our product os skill to think this through
If the user arrives via an institution's invite link → role is pre-set, skip selection entirely. i do no think there's thing like this. currently everyone enters via the sign up form
If the user arrives via the marketing site's "For Employers" page → role is pre-suggested.

Step 4 (role confirmation) becomes Sophia confirming her read, not asking cold. "It sounds like you're here to hire — is that right?" vs. "Select your role from this list of 8."

### On "don't create what isn't there"

Corrected. The Business Roadmap Generator does exist in the PRD for EdgePreneur (11-question assessment → tailored business plan → phases + milestones). What doesn't exist is a 2-question anonymous business roadmap generator. So the organic path for EdgePreneur would need either: (a) a condensed anonymous business assessment, or (b) a different anonymous value artifact. That's a backend question for the client. For now, we design the EdgePreneur organic path with the assumption that a seed artifact is possible, and flag the backend gap. we can put a pin on this user type cause i haven't been able to login

## On C2 — Generative Interface

You said: "I want it to be generative interface. Components are generated based on need and action."

This is the most ambitious bet in the product. Let me be precise about what this means so we're building the same thing:

**What it IS:** The dashboard doesn't have a fixed layout with 6 cards that are always there. Sophia's context model determines which components render, in what order, at what density. A Day-1 user sees one component (the roadmap prompt). A Day-30 user sees a command center. The components are real React components — but which ones appear, and where, is determined by state, not by a static template. - is this technically feasible, is it the right ux?

**What it ISN'T:** AI generating arbitrary UI at runtime (that's C4 — the Membrane). The components themselves are designed and built by us. The intelligence is in the assembly — which pre-built components Sophia selects and composes for this user at this moment. - yes

**The distinction matters** because generative layout from a library of designed components is buildable and reliable. Generative UI from scratch is what the stress test flagged as HIGH RISK for career-critical decisions.

If you mean something different by "generative interface," push back and tell me.

## On C3 (Task Rooms) and C4 (Membrane) — designing now

Understood. We design the full vision. For Task Rooms, this means:
- The room shell (header with task name, status, Sophia's confidence read)
- Resource cards (compressed references to resumes, jobs, mentors, etc.)
- Sophia's inline commentary strip
- The contextual action bar
- The rooms tray in the sidebar
- Room creation moment (Sophia's notification pattern)

FOR THIS PLEASE LOOK AT OUR REFERENCES FOR PATTERNS WE CAN REUSE - DO NOT JUST GO OUT ON A WHIM. ALSO PLEASE DO NOT CREATE THAT GENERIC ONE SIDE BORDER THING THAT ALL YOU LLMS SEEM TO LOVE. AGAIN LOOK AT OUR REFERENCES AS A BASE
THEN ALSO LOOK AT PRODUCTS WITH AI IN THEM, THE UX, THE PATTERN ETC. 
For the Membrane, we design Sophia's full conversational surface where she can render inline components — but with the explicit fallback to structured navigation always available. This is the Sophia full panel (surface #9 in the 10 surfaces).

## The build plan

Three onboarding hypotheses, all getting built: - PAY ATTENTION TO AFFORDANCES, INTUITIVENESS, DELIGHTFULNESS, SIMPLICIITY

**H1 — "The World Opens Up"** — Brand-cinematic. The forest gradient canvas. Floating selector chips. Roadmap materializes with presence(STUDY THE REFERENCES THAT HAVE SIMILAR COMPONENTS SO WE CAN TAKE INSPIRATION FROM, I SAW ONE WHOSE NODES WERE LUMINOUS WHICH IS COOL SO THINGS LIKE THAT PLEASE)

**H2 — "The Product Builds Around You"** — You want real components assembling, not blur tricks. So: as the user answers each question, actual dashboard components (sidebar rail, a KPI card, the Sophia bar) animate into position in the background — skeletal at first, then populated with the user's data as answers come in. By the final step, the dashboard is fully assembled and the user steps into it. YES

**H3 — "Sophia Speaks First"** — Sophia's geometric mark centered. Dark void. Her question fades in. Structured selectors below. The conversation IS the onboarding. I'll study the Sergushkin input, Manus home state, and Claude's conversation surface closely for the treatment here. GOOD

Starting with H3 — it's the most conceptually distinct and the one you flagged for extra care. Then H1, then H2.

Ready to build.
