# Remaining Surfaces — Product OS Audit

## Validated Surface Inventory

### DONE (Built or In Progress)

| #   | Surface               | Status                                                                                     | Spec                                  |
| --- | --------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------- |
| 1   | Onboarding            | Built (H2). Open fixes: dashboard assembly visibility, roadmap gen, Sophia 3Qs, blur-lift. | `/docs/onboarding-architecture.md`    |
| 2   | App Shell + Dashboard | Built. Synthesis locked.                                                                   | `/docs/shell-dashboard-hypotheses.md` |
| 3   | EdgePath              | Built. All states. Sophia wired.                                                           | `/docs/surface-3-edgepath-ux-spec.md` |
| 4   | Sophia Ask            | Built. Float-to-Panel, 11 blocks, 47+ scenarios.                                           | `/docs/sophia-interaction-ux-spec.md` |
| 5   | ResumeEdge            | Built. Build from Scratch, Upload, Optimization, Exit chips. P2 items remain.(complete)    | `/docs/resumeedge-ux-spec.md`         |

### REMAINING (5 Surfaces)

| #   | Surface                   | Type               | Spec Status                             | Roles Affected                                                                                                                                  |
| --- | ------------------------- | ------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | **EdgeMatch (Job Board)** | Partial deep think | Spec DONE: `/docs/edgematch-ux-spec.md` | EdgeStar (browse/apply), EdgeEmployer (post), EdgeNGO (post), EdgeAgency (post)                                                                 |
| 7   | **EdgeSight / Analytics** | Speed run          | Spec NOT written                        | EdgeStar (EdgeBoard), EdgeEmployer (EdgeSight), EdgeEducation (outcomes), EdgeNGO (EdgeInsight), EdgeAgency (EdgeInsight), EdgeGuide (earnings) |
| 8   | **Messaging + Video**     | Speed run          | Spec NOT written                        | All 8 roles                                                                                                                                     |
| 9   | **Session/Booking**       | Speed run          | Spec NOT written                        | EdgeGuide (host), EdgeStar (book), EdgeEducation (office hours)                                                                                 |
| 10  | **Task Rooms**            | Deep think         | Spec DONE: `/docs/taskrooms-ux-spec.md` | EdgeStar, EdgePreneur, EdgeParent (read-only), EdgeGuide (assign/review)                                                                        |

### ALSO OPEN

- Onboarding H2 fixes (dashboard assembly, blur-lift, Sophia 3Qs, organic vs institutional path split)
- P2 ResumeEdge items
- 2 mind map bugs (`/docs/mindmap-open-bugs.md`)
- Cross-surface polish + transitions
- Component extraction into design system

---

## The 8 Roles — Surface Coverage Matrix

Each cell shows what that role DOES on that surface. Empty = no access.

| Surface             | EdgeStar                                                                   | EdgePreneur         | EdgeParent                             | EdgeGuide                                               | EdgeEmployer                            | EdgeEducation                            | EdgeNGO                      | EdgeAgency                          |
| ------------------- | -------------------------------------------------------------------------- | ------------------- | -------------------------------------- | ------------------------------------------------------- | --------------------------------------- | ---------------------------------------- | ---------------------------- | ----------------------------------- |
| **EdgeMatch**       | Browse, save, apply, track applications                                    | Browse (biz roles)  | —                                      | —                                                       | Post jobs, review applicants, pipeline  | Post internships                         | Post community jobs          | Post workforce jobs                 |
| **EdgeSight**       | EdgeBoard (personal career analytics)                                      | Biz metrics         | Child's progress (read-only)           | Earnings, session stats, client outcomes                | EdgeSight (6-tab hiring analytics, EEO) | NACE/CSEA outcomes, student adoption     | EdgeInsight (program impact) | EdgeInsight (workforce dev metrics) |
| **Messaging**       | Peer chat, mentor chat, Sophia threads                                     | Peer chat, Sophia   | Chat with child (linked)               | Client messaging, session follow-up                     | Candidate messaging                     | Student messaging, employer outreach     | Community messaging          | Stakeholder messaging               |
| **Video**           | Mentor calls, interview prep (Sophia)                                      | Advisor calls       | —                                      | Session delivery (paid/volunteer)                       | Interview calls                         | Office hours, career fair video          | Webinar hosting              | Webinar hosting                     |
| **Session/Booking** | Book mentors/coaches, session history                                      | Book advisors       | —                                      | Set availability, manage calendar, earnings per session | Schedule interviews                     | Office hours scheduling                  | Event scheduling             | Event scheduling                    |
| **Task Rooms**      | Enter rooms from EdgePath milestones, do focused work with Sophia coaching | Biz milestone rooms | View child's room progress (read-only) | Assign tasks, review completed rooms, leave feedback    | —                                       | Assign student tasks, review submissions | —                            | —                                   |

---

## Product OS Audit — Per Surface

For each remaining surface, I'm running the full cross-functional checklist. **Your answers to these questions will let us write the speed-run specs and start building immediately.**

---

## SURFACE 6: EdgeMatch (Job Board)

Spec is written. These are the open questions the spec didn't fully resolve, plus Product OS validation.

### DESIGN

1. **The EdgeEmployer posting side** — the spec covers EdgeStar's browse/apply experience in detail. But EdgeEmployer needs to POST jobs, review applicants, and manage a pipeline. Is this a separate surface/view, or a mode switch within EdgeMatch? (Like how Airbnb hosts and guests use different views of the same product.) eeach user has their dashboard, does this answer this?
2. **NGO/Agency job posting** — do they get the same posting form as EdgeEmployer, or a simplified version? Do their listings look different to EdgeStars (e.g., tagged as "community opportunity" or "government program")? hm what's best?
3. **Application tracking states** — the spec lists: Saved > Applied > Viewed > Interviewing > Offer > Rejected. Are there any missing states? What about "Withdrawn" (user pulls their application)? hm? can users currently do that?
4. **Mobile layout** — three-panel (filters + grid + detail) won't work on mobile. Does it collapse to: filters as a drawer + card list + detail as full-screen overlay? Or something else? - look at how other products handle their mobile view

### PM

5. **What's the North Star metric for EdgeMatch?** Application-to-interview conversion? Match quality (do users apply to high-match jobs more)? Time to first application? validate
6. **Is there a "quick apply" flow?** Or does every application require going to the external job site? If CareerEdge handles applications natively, what data do we collect (just resume, or also cover letter, answers to screening questions)? hm build for both options, they can decide
7. **How does EdgeMatch connect to ResumeEdge?** When a user finds a job, can they "optimize resume for this job" — which opens ResumeEdge with the JD pre-loaded? validate

### ENGINEERING

8. **Job data source** — are jobs scraped, API-fed, or employer-posted only? This affects how job cards are structured (we might not have match % for scraped jobs without profile context). hm validate or include the varied components so i can still handoff for whenever they decide on something
9. **Real-time vs. cached** — does the match % calculate on page load, or is it pre-computed when the user's profile changes? validate

### AI

10. **Match % explanation** — the spec says Sophia explains WHY a job matches. Is this generated per-job on demand, or pre-computed? If on demand, what's the latency budget? If pre-computed, how often does it refresh? validate but i need the ui however
11. **"Jobs you should skip"** — does Sophia ever negatively recommend? "This job looks like a match but requires 5 years of Python and you have 1" — or is it always positive framing? balance

### MOTION

12. **Detail panel slide-in** — the spec shows a right panel that slides in on job select. Does it push the grid, or overlay? If push, the grid needs to reflow from 3 columns to 2. If overlay, the grid stays but gets a scrim. hm variations
13. **Match % animation** — does the match gauge animate on card hover, or only in the detail panel? both

### BRAND

14. **How do we differentiate from Indeed/LinkedIn visually?** The match intelligence is the product differentiator, but what's the visual differentiator? The glass cards + Sophia bar help, but is there a signature element for EdgeMatch specifically? - validate against of visual dna, references and the branding assets i have provided you

### SECURITY

15. **Application data** — when a user applies, what PII do we store? Resume (already in system), cover letter, screening answers? What's the retention policy if the user deletes their account? hm validate

### FINANCE

16. **Employer pricing** — do employers pay to post? Per listing? Subscription? Free tier? This affects whether we show "promoted" listings and how. hm afford for both, so i can hand off the ui and they can use either

---

## SURFACE 7: EdgeSight / Analytics

Speed run. No spec written yet. These questions DEFINE the spec.

### DESIGN

1. **How many distinct dashboard views are there?** The IA doc mentions:
   - EdgeStar: **EdgeBoard** (personal career analytics — resume views, application stats, skill progress, roadmap velocity)
   - EdgeEmployer: **EdgeSight** (6 tabs — hiring funnel, applicant demographics, time-to-hire, source analytics, EEO compliance, cost-per-hire)
   - EdgeEducation: **Outcomes Tracking** (NACE/CSEA standards, student adoption, career readiness scores, employer engagement)
   - EdgeGuide: **Earnings + Impact** (sessions completed, revenue, client outcomes, retention)
   - EdgeNGO + EdgeAgency: **EdgeInsight** (program impact, participant outcomes, grant utilization, workforce metrics)
   - EdgeParent: child's progress (likely a simplified read-only version of EdgeBoard)
     Are these 6 separate components, or one analytics surface with role-based data/layout switching? hm what's best based on our product os skill

2. **Chart types needed** — which of these do we need? - we will use what works best, so all but used beautifully, like the references and how they made decisions on which to use for which data, not necessarily following the tarditional mappinsgs
   - Area chart (trends over time — applications, views, sessions)
   - Bar chart (comparisons — skills gap, category breakdowns)
   - Funnel chart (hiring pipeline, application stages)
   - Gauge/radial (scores, completion %)
   - Data table (detailed breakdowns, exportable)
   - Heatmap (activity calendar, engagement patterns)
   - Donut/pie (distribution — job types, demographics)

3. **Date range picker** — global (applies to all charts) or per-chart? Pre-set ranges (7d / 30d / 90d / 1y / all) or custom date picker? global, preset.

4. **Filter chips** — what global filters exist? Role, time period, what else? For EdgeEmployer: by job posting, department, source? For EdgeEducation: by cohort, program, school? contextualize and afford then validate to ensure you don't miss any surface that requires a filter

5. **Empty states** — a new EdgeStar with no applications has no analytics. What do we show? Sophia coaching ("Apply to your first job to start seeing analytics here") or sample/projected data? sophia

6. **Export** — can users download reports? PDF? CSV? Both? Which roles need export? validate

### PM

7. **Which role's analytics view do we build FIRST?** EdgeStar's EdgeBoard is the most common. EdgeEmployer's EdgeSight is the most complex (6 tabs). Which is the priority for this sprint? we will do phase by phase, we can cover edgestar in this sprint
8. **Are there any "insight" cards?** Not just charts but Sophia-generated observations: "Your resume gets 3x more views when you include quantified results" or "Applications spike on Mondays — consider applying Sunday night." validate but i think yes

### ENGINEERING

9. **All data is mocked for this sprint, correct?** We're building the visualization layer, not the data pipeline. Confirming so I use realistic mock data structures. yes

### AI

10. **Sophia insights in analytics** — does she comment on trends? "Your application rate dropped 40% this week — I noticed you haven't updated your resume since March." This is the AI layer on top of charts. Yes/no? If yes, where does it appear — a strip at the top, inline annotations on charts, or the Sophia bar? validate

### MOTION

11. **Chart entrance animations** — staggered reveal as you scroll? Or all charts load simultaneously? Gauge arcs animating from 0 to value? yes
12. **Number counters** — do KPI numbers count up from 0 (like the dashboard)? Or appear instantly? yes

### BRAND

13. **Color coding for chart data** — do we use the existing brand palette (lime for positive, cyan for neutral, red/warm for alerts)? Or a dedicated data visualization palette? same palette and you can expand if necessary

### SECURITY

14. **EdgeEmployer EEO data** — this is legally sensitive. Does the EEO tab have additional access controls within the employer org? (Only HR admins, not hiring managers?) hm i am unsure, validate?

### FINANCE

15. **Is analytics a premium feature?** Do all roles get full analytics, or is there a free tier (basic stats) vs. paid tier (full EdgeSight)? probably, but visualize still, they can decide the gating. This also means we will design paywall variations using our visual assets etc so they can have to use

---

## SURFACE 8: Messaging + Video

Speed run. No spec written yet.

### DESIGN

1. **Layout** — standard two-panel (conversation list left, thread right)? Or three-panel (list, thread, participant info/context)? hm validate
2. **Sophia as participant** — Sophia can appear IN a conversation (e.g., interview prep thread, mentor debrief). Does she have a distinct visual treatment from human participants yes? (Her avatar, a shimmer border, a different bubble color?)
3. **Thread types** — are there different thread categories? yes
   - Direct message (1:1)
   - Group chat (EdgeGroups)
   - Sophia thread (AI conversation pulled from Ask Sophia history)
   - Session thread (auto-created when a session is booked, like Calendly's thread)
   - Application thread (auto-created when you apply to a job, employer can message)
4. **Message types** — text, file attachment, image, voice note, video message, link preview? Which of these are in scope? all
5. **Read receipts** — yes/no? If yes, how displayed (checkmarks, avatars, or just "seen")? seen
6. **Typing indicator** — standard animated dots? Or something more on-brand?
7. **Search within messages** — global search across all conversations, or only within current thread? global
8. **Pinned messages** — can users pin important messages within a thread? yes
9. **Empty state** — new user with no conversations. What does Sophia say? Does she auto-start a welcome thread? auto start welcome

### VIDEO

10. **Video scope** — are we building a full video call UI, or a "click to join" that opens an external tool (Zoom, Google Meet)? provide the ui, tehy can decide; this is a rule moving forward. For questions that have to do with business and Ui decisions, we must create the Ui and they can then decide which direction they will go.
11. **If native video UI** — what controls? Camera on/off, mic on/off, screen share, chat overlay, end call, recording indicator. Anything else? thats all
12. **Sophia in video** — can Sophia provide real-time coaching during a video call? (e.g., interview prep mode where she shows prompts/tips in a sidebar while you're on a mock call.) This is the novel element. yes
13. **Video call card** — when a call is scheduled, does it appear as a card in the thread? "Session with Alice Chen — Tomorrow 2:00 PM — [Join Call]"? hm validate

### PM

14. **Is messaging a standalone surface or embedded in other surfaces?** Can you message from within EdgeMatch (message an employer about a listing)? From Task Rooms (ask your mentor a question)? validate but i think so
15. **Notification integration** — new messages trigger notifications. Are notifications a separate surface we need to build, or are they handled by the shell's existing notification system? handled by the shell but also have bubbles or indicators on components that may apply
16. **Message history retention** — how far back can users scroll? Infinite? 90 days? Role-dependent?

### ENGINEERING

17. **Real-time vs. polling** — messages need to feel instant. For this prototype, are we simulating real-time, or just showing a static thread? simulate

### AI

18. **Smart replies** — does Sophia suggest reply options? "Thanks for the feedback!" / "Can we reschedule?" / "I'll review and get back to you." Like Gmail's smart reply but career-context-aware. yes
19. **Message summarization** — for long threads, can Sophia summarize? "In this thread: Alice suggested you focus on case studies, you agreed to complete 2 by Friday." yes

### MOTION

20. **Message send animation** — bubble slides up from input? Fades in? The send button animation? hm look at the delightful products and how they handle this
21. **New message indicator** — how does an incoming message animate into the thread? hm look at the delightful products and how they handle this

### BRAND

22. **Sophia's voice in messaging** — is she formal or warm here? Messaging is inherently casual. Does her tone shift from the coaching tone in Task Rooms? yes

### SECURITY

23. **Message encryption** — are messages encrypted at rest? In transit? End-to-end? This affects architecture significantly. unsure
24. **File sharing** — what file types are allowed? Size limits? Virus scanning? unsure

### FINANCE

25. **Is video a premium feature?** Free tier gets messaging only, paid gets video? Or video is included? unsure

---

## SURFACE 9: Session/Booking

Speed run. No spec written yet.

### DESIGN

1. **Two sides of the same surface:**
   - **EdgeGuide (host):** Set availability, manage calendar, view upcoming sessions, session history, earnings per session, cancellation policy.
   - **EdgeStar (booker):** Browse available slots, book, reschedule, cancel, session history, pre-session prep (Sophia: "Your session with Alice is in 2 hours — here's what to discuss based on your roadmap").
     Are these two separate views, or one surface with role-based rendering? validate based on our system design

2. **Calendar view** — week view (7 columns, time rows)? Month view? Day view? Which is the default? Can users toggle between them?

3. **Time slot picker** — when booking, does the user see:
   - A calendar with available dates highlighted, then time slots for the selected date?
   - A list of next available slots (like Calendly's "pick a time" view)?
   - Both (calendar for visual scanners, list for quick bookers)? yes

4. **Session types** — are there different session categories?
   - 1:1 Mentoring (30 min / 60 min)
   - Group workshop (multiple attendees)
   - Office hours (drop-in, no booking required — EdgeEducation)
   - Mock interview (Sophia-facilitated)
   - Career coaching (paid — EdgeGuide monetization) provide ui and flows for all

5. **Booking confirmation** — what happens after booking?
   - Confirmation screen with calendar add (Google/Apple/Outlook .ics)?
   - Auto-created message thread between booker and host?
   - Sophia pre-session prep message? all

6. **Cancellation/reschedule** — what's the policy? 24-hour notice? Flexible? Does the host set their own policy? How is this displayed? validate

7. **Empty state (guide)** — a new EdgeGuide with no availability set. What does Sophia say? "Set your first available time to start accepting bookings." yes

8. **Empty state (booker)** — EdgeStar looking for sessions but no mentors match their needs. What happens?

### PM

9. **Monetization** — the PRD mentions paid coaches. How does payment work? Does CareerEdge take a commission? Is pricing set by the guide or suggested by the platform? Is there a free tier (volunteer mentors) vs. paid tier (professional coaches)? unsure
10. **Session prep** — does Sophia generate a prep brief for both parties before the session? "Alice: your mentee Sharon has completed 60% of her Interaction Design module and just optimized her resume. She might want to discuss portfolio structure." yes
11. **Post-session flow** — after a session ends, what happens? contextualize but provide ui and flow for all
    - Rating/review (mutual or one-sided)?
    - Sophia follow-up: "Based on your session with Alice, I've added 2 new tasks to your roadmap."
    - Session notes (editable by both parties)?
    - Next session suggestion?

### ENGINEERING

12. **Timezone handling** — users in different timezones booking the same guide. How is this displayed? Always show both timezones? Convert to viewer's timezone? validate
13. **Calendar integration** — do we sync with Google Calendar / Outlook? Or is this CareerEdge-only? For the prototype, are we mocking this? yes we mock

### AI

14. **Sophia's optimal timing** — the PRD mentions Sophia suggesting optimal session times based on roadmap progress. How does this manifest? A chip in the booking flow: "Sophia suggests: Book a session this week — you just completed a major milestone and a debrief would help."?
15. **Smart matching** — when an EdgeStar clicks "Find a mentor," does Sophia recommend specific guides based on the user's roadmap, target role, and learning style? Or is it a browse-and-filter pattern?

### MOTION

16. **Time slot selection** — does selecting a slot animate (highlight, expand, show confirm button)? Calendar day transitions?
17. **Booking confirmation** — celebratory micro-interaction? Checkmark animation? Confetti would be off-brand — what's the CareerEdge equivalent?

### BRAND

18. **Session surface tone** — booking is transactional. How do we keep the warmth? Sophia's pre-session messages? The "you're making progress by seeking guidance" framing? hm that phrase sounds somehow

### SECURITY

19. **Payment data** — if sessions are paid, where does payment processing happen? Stripe integration? What PII do we store vs. delegate to the payment processor? up to business
20. **Video session recording** — if sessions can be recorded, who owns the recording? Both parties must consent. How is consent captured? up to business but you can validate and suggest if it is also a product decision and problem

### FINANCE

21. **Revenue model** — what % commission does CareerEdge take on paid sessions? Is there a subscription model for unlimited sessions? Or pay-per-session? unsure

---

## SURFACE 10: Task Rooms

Spec is written and approved. These are the remaining Product OS questions not covered by the spec.

### DESIGN

1. **EdgeGuide's view of Task Rooms** — the spec covers EdgeStar entering and doing work. But EdgeGuides need to ASSIGN tasks, REVIEW completed rooms, and LEAVE FEEDBACK. Is this a separate "review mode" of the same room, or a different view entirely? review mode but validate
2. **EdgeParent's read-only view** — how much of the room does the parent see? Just the progress bar? Or can they see the resources, Sophia's coaching messages, sub-task completion? validate
3. **EdgePreneur rooms** — the business roadmap has different milestone types (validate idea, build pitch deck, find co-founder). Do these rooms have different layouts/tools than career milestones? validate but i think yes

### PM

4. **Room lifecycle** — Created > Active > Paused > Completed > Archived. Are there any missing states? Can a room be "blocked" (waiting on external input, e.g., mentor review)? hm validate
5. **Room limits** — how many rooms can be open simultaneously? Is there a cap? Does having too many open rooms trigger a Sophia nudge ("You have 5 open rooms — want to prioritize?")? up to business but provide mock/ui/flow

### ENGINEERING

6. **State persistence** — when a user leaves and returns, what state is preserved? Scroll position? Open tabs? In-progress text? Video timestamp? validate
7. **Room resource assembly** — the spec mentions pulling resources from multiple surfaces (courses, resume, jobs, mentor notes). For the prototype, are we mocking all cross-surface data? yes and you must validate so uou dont cheat

### AI

8. **Sophia coaching mode** — the spec defines this but: how does coaching mode differ from regular Sophia? Does she have access to room-specific context (current sub-task, time spent, resources viewed)? Does she proactively offer help ("You've been on this sub-task for 20 minutes — want a hint?")? validate
9. **Auto-generated sub-tasks** — does Sophia break down a milestone into sub-tasks automatically, or are sub-tasks pre-defined in the roadmap? If auto-generated, what's the quality bar? validate

### MOTION

10. **Room entry transition** — the spec says entering a room is a "transition, not a toggle." What does this look like? A zoom-in from the milestone card? A door-opening metaphor? A crossfade with the room assembling its panels? validate
11. **Sub-task completion** — when marking a sub-task done, what's the micro-interaction? Checkmark + progress bar advance + Sophia acknowledgment?

### BRAND

12. **Room ambiance** — the "room" metaphor suggests a contained space. Should there be a subtle background shift (slightly different tint/texture) to reinforce "you're in a room now"?

### SECURITY

13. **Mentor access to room content** — when a guide reviews a room, can they see everything the user did (including Sophia coaching conversation)? Or only the outputs/deliverables? Privacy boundary matters here. validate

---

## Cross-Cutting Questions (Apply to ALL Remaining Surfaces)

### SYSTEM-LEVEL

1. **Sophia's bottom bar** — it persists across all surfaces. On each new surface, does she contextualize? E.g., on EdgeMatch: "I see 3 new jobs matching your target role" vs. on Session/Booking: "You have a session with Alice tomorrow — want to prep?" yes
2. **Cross-surface navigation chips** — ResumeEdge already has exit chips to EdgeMatch/EdgePath. Should EVERY surface have contextual exit chips? E.g., after booking a session → "Prepare in your Task Room" or after finding a job → "Optimize your resume for this listing." yes
3. **Role switching** — the IA doc recommends designing for multi-role support. When an EdgeGuide who is also an EdgeStar switches roles, do they see different surfaces in their nav? Or is it the same nav with different data? hm validate
4. **Notification unification** — messages, session reminders, application updates, Sophia nudges — do all notifications go through one system? Or are they surface-specific? validate
5. **The "not in the 10" surfaces** — EdgeProd, SocialEdge, Course Marketplace, Interview Simulator, EdgeGroups, Settings/Profile — these are covered by component composition from the 10 surfaces. But do any need even a minimal build during this sprint, or are they entirely post-sprint? uh validate

---

## Next Steps

Once you answer the questions above, I can:

1. Write the 3 speed-run specs (EdgeSight, Messaging + Video, Session/Booking) in one pass
2. Begin building EdgeMatch (spec is locked, just needs your answers to the 16 questions above)
3. Begin building Task Rooms (spec is locked, just needs your answers to the 13 questions above)

The questions are numbered so you can answer by number: e.g., "EdgeMatch Q1: same surface, mode switch" or "EdgeSight Q7: EdgeStar first."