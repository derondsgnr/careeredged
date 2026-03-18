# Remaining Surfaces — Answer Synthesis & Validated Recommendations

**Generated from:** Your inline answers in `/docs/remaining-surfaces-product-os-audit.md`
**Date:** March 17, 2026

---

## New Standing Rule (from Messaging Q10)

> "For questions that have to do with business and UI decisions, we must create the UI and they can then decide which direction they will go."

This applies going forward to all "unsure" and "build for both" answers. We build the UI for every option; the business team picks the direction from finished work, not wireframes.

---

## SURFACE 6: EdgeMatch — Answer Synthesis

### Direct Answers
| # | Question | Your Answer | Locked Decision |
|---|----------|-------------|-----------------|
| 6 | Quick apply vs. external? | "Build for both options, they can decide" | Build both flows: native apply (resume + optional cover letter + screening Qs) AND external redirect. Toggle in employer settings. |
| 7 | EdgeMatch → ResumeEdge connection? | "Validate" | **Validated: YES.** This is the highest-value cross-surface link. "Optimize for this job" button on every job detail panel → opens ResumeEdge with the JD pre-loaded. Exit chip back to EdgeMatch. This is already the pattern we established in ResumeEdge's exit chips. |
| 11 | Negative recommendations? | "Balance" | Sophia uses balanced framing. She won't say "skip this" — she'll say "Strong match on 4 of 6 criteria. The gap: they want 5 years Python, you have 1. Here's how to address that in your cover letter." Always actionable, never discouraging. |
| 13 | Match % animation | "Both" | Match gauge animates on card hover (subtle fill) AND in detail panel (full arc animation with percentage count-up). |

### Validated Recommendations (you said "validate")
| # | Question | Recommendation | Reasoning |
|---|----------|----------------|-----------|
| 1 | Employer posting — separate surface or mode switch? | **Mode switch within EdgeMatch.** Your answer ("each user has their dashboard") confirms each role has their own dashboard context, but EdgeMatch itself should be one surface with role-based rendering. EdgeStar sees browse/apply. EdgeEmployer sees their posted jobs + applicant pipeline. Same URL pattern (`/edgematch`), different view based on role. This is the Airbnb pattern — one product, role-based rendering. |
| 2 | NGO/Agency posting form | **Same posting form, simplified defaults.** NGOs/Agencies get the same form as EdgeEmployer but with role-appropriate defaults: salary field optional (many are volunteer/stipend), "opportunity type" pre-set to "Community" or "Government Program," and listings tagged visually for EdgeStars (a small badge: "Community Opportunity" / "Workforce Program"). Not a separate form — just smart defaults. |
| 3 | Application tracking — missing states? | **Add "Withdrawn."** Full states: Saved → Applied → Viewed → Interviewing → Offer → Accepted → Rejected → Withdrawn. "Withdrawn" is user-initiated (pull your application). Yes, users should be able to withdraw — it's standard and expected. Also add "Archived" as a terminal state for both rejected and withdrawn. |
| 4 | Mobile layout | **Research-validated pattern:** Filters as bottom sheet drawer → Card list (single column) → Job detail as full-screen slide-up overlay. This is how LinkedIn, Indeed, and Glassdoor all handle it. The filter drawer uses the same chip-based system from desktop but stacked vertically. The detail overlay has a handle for pull-down dismiss. |
| 5 | North Star metric | **Match-to-interview conversion rate.** Not just "did they apply" but "did the match intelligence lead to an interview?" This measures whether our matching is actually better than keyword search. Secondary: time-to-first-application (measures onboarding-to-value speed). |
| 8 | Job data source | **Build UI components for all three sources:** employer-posted (full data, match % available), API-fed (partial data, match % computed on load), scraped (minimal data, match % may be unavailable — show "Match data unavailable" state). This way the business team can plug in any source and the UI handles it gracefully. |
| 9 | Real-time vs. cached match % | **Pre-computed on profile change, cached.** Match % recalculates when: (a) user updates profile/resume, (b) user completes a roadmap milestone, (c) new job posted matching saved criteria. NOT on every page load — that's too expensive. Show "Updated 2 hours ago" timestamp on match data. |
| 10 | Match % explanation — on demand or pre-computed? | **Hybrid.** The match % itself is pre-computed. The natural-language explanation ("Why this matches") is generated on-demand when the user clicks "Why this match?" in the detail panel. Latency budget: <2 seconds. Show skeleton shimmer while generating. Build the UI for both the match badge and the expandable explanation panel. |
| 12 | Detail panel — push or overlay? | **Build both as variations.** V1: Overlay with scrim (grid stays, panel slides over). V2: Push (grid reflows from 3→2 columns). Let me recommend V1 (overlay) as default — it's less disruptive and keeps the user's scan position in the grid. But we build both. |
| 14 | Visual differentiator | **The match intelligence IS the visual differentiator.** Against brand DNA: indeed/LinkedIn show flat cards with text. We show glass cards with a radial match gauge, Sophia's contextual bar explaining WHY, and the green glow treatment on high-match cards. The signature element: a pulsing green ring on 90%+ matches. Combined with the dark glass aesthetic, this is visually nothing like Indeed. |
| 15 | Application PII | **Store only what's already in the system.** Resume (already uploaded), cover letter (generated in-platform), screening answers (if native apply). On account deletion: hard delete all application data within 30 days. Retention for active accounts: indefinite (it's their data). No new PII collection beyond what onboarding already captured. |
| 16 | Employer pricing | **Build UI for both models:** (a) Free posting with optional "boost" (promoted placement, costs per listing), (b) Subscription tiers (X posts/month). Show both in the employer dashboard. The "promoted" badge on listings is visually distinct (subtle gold/amber border, not intrusive). Business team picks the model. |

---

## SURFACE 7: EdgeSight / Analytics — Answer Synthesis

### Direct Answers
| # | Question | Your Answer | Locked Decision |
|---|----------|-------------|-----------------|
| 3 | Date range picker | "Global, preset" | Global date range applies to all charts. Presets: 7d / 30d / 90d / 1y / All time. No custom date picker. |
| 5 | Empty states | "Sophia" | Sophia coaching in empty analytics: "Apply to your first job to start seeing analytics here" with a contextual CTA chip. |
| 7 | Which role first? | "EdgeStar in this sprint" | Build EdgeBoard (personal career analytics) first. Other role dashboards are post-sprint. |
| 8 | Insight cards | "Validate but I think yes" | **Validated: YES.** Sophia-generated insight cards are the differentiator. They appear as a strip above the charts: "Your resume gets 3x more views when you include quantified results." 2-3 insights max, refreshed weekly. |
| 9 | All data mocked | "Yes" | Mock data with realistic structures. |
| 11 | Chart entrance animations | "Yes" | Staggered reveal on scroll. Gauges animate 0→value. Line charts draw left to right. |
| 12 | Number counters | "Yes" | KPI numbers count up from 0 (same pattern as dashboard). |
| 13 | Color coding | "Same palette, expand if necessary" | Primary: lime (#B3FF3B) for positive/progress. Cyan (#22D3EE) for neutral/informational. Warm tones for alerts. Expand with: purple (#8B5CF6) for comparison data, amber (#F59E0B) for warnings. |

### Validated Recommendations
| # | Question | Recommendation | Reasoning |
|---|----------|----------------|-----------|
| 1 | How many dashboard views? | **One analytics surface, role-based data switching.** Per Product OS: avoid building 6 separate components when the structure is the same (KPI row → charts → insights). Build one `<AnalyticsDashboard>` component that accepts a `role` prop and renders role-appropriate data, chart types, and KPI labels. The layout skeleton is identical; the data and labels change. For this sprint: only EdgeStar's EdgeBoard. |
| 2 | Chart types | **All of them, used intentionally.** Area: trends (applications over time, views over time). Bar: comparisons (skills gap analysis). Gauge/radial: scores (ATS score, roadmap completion %). Data table: detailed breakdowns. Heatmap: activity calendar. Donut: distribution (job types applied to). No funnel for EdgeStar — that's EdgeEmployer's hiring pipeline chart (post-sprint). Use charts because they tell the story, not because they're traditional. |
| 4 | Filter chips for EdgeStar | **Filters for EdgeBoard:** Time period (global preset), Category (Applications / Resume / Roadmap / Skills), Status (Active / Completed / All). No role filter for EdgeStar — they only see their own data. For future EdgeEmployer build: add Job Posting, Department, Source filters. |
| 6 | Export | **PDF for reports, CSV for data tables.** EdgeStar probably doesn't need export (personal use). EdgeEmployer/EdgeEducation definitely need it (compliance, reporting). Build the export button but only show it for roles that need it. For this sprint (EdgeStar only): skip export, add post-sprint. |
| 10 | Sophia insights in analytics | **Strip at top + inline annotations.** Top strip: 2-3 headline insights. Inline: small annotation dots on charts that expand on hover to show Sophia's observation about that data point. "Applications spiked here — you updated your resume the day before." This is the intelligence layer that makes it more than a dashboard. |
| 14 | EEO data access controls | **Yes, restrict.** EEO compliance data should have an additional permission layer. Only users with "HR Admin" role within the employer org can see the EEO tab. Hiring managers see the other 5 tabs. Build a simple permission gate on the tab — if no access, show "Contact your HR administrator for EEO reporting." |
| 15 | Premium gating | **Build full analytics, design a paywall gate.** Show all charts to free users but with a blur/lock overlay on premium charts. "Upgrade to Edge Plus to unlock detailed analytics." Build the paywall card using existing brand assets. Business team decides which charts are gated. |

---

## SURFACE 8: Messaging + Video — Answer Synthesis

### Direct Answers
| # | Question | Your Answer | Locked Decision |
|---|----------|-------------|-----------------|
| 2 | Sophia visual treatment | "Yes" | Sophia has distinct visual treatment: cyan avatar ring, shimmer border on her bubble, cyan bubble background (vs. glass for humans). |
| 3 | Thread types | "Yes" | 5 thread types: DM, Group (EdgeGroups), Sophia thread, Session thread (auto-created on booking), Application thread (auto-created on apply). |
| 4 | Message types | "All" | Text, file, image, voice note, video message, link preview. All in scope. |
| 5 | Read receipts | "Seen" | Simple "Seen" text below message. No checkmarks or avatar stacks. |
| 7 | Search | "Global" | Global search across all conversations. |
| 8 | Pinned messages | "Yes" | Users can pin messages within a thread. Pinned messages accessible via a "Pinned" button in thread header. |
| 9 | Empty state | "Auto start welcome" | Sophia auto-starts a welcome thread for new users. |
| 10 | Video scope | "Provide the UI, they can decide" | **Build full native video call UI.** Controls: camera, mic, screen share, chat overlay, end call, recording indicator. Business team decides if they ship native or external integration. |
| 11 | Video controls | "That's all" | Camera on/off, mic on/off, screen share, chat overlay, end call, recording indicator. No whiteboard, no reactions. |
| 12 | Sophia in video | "Yes" | Sophia sidebar during video calls. Interview prep mode: prompts/tips in a collapsible panel. This is the novel, differentiating element. |
| 14 | Messaging standalone or embedded? | "Validate but I think so" | **Validated: Both.** Messaging is a standalone surface in the left nav AND contextually accessible from other surfaces. In EdgeMatch: "Message employer" opens a thread. In Task Rooms: "Ask your mentor" opens a thread. The standalone surface shows all threads; the embedded version opens a specific thread in a slide-over panel. |
| 15 | Notification integration | "Handled by shell but also have bubbles/indicators" | Notifications go through shell's system. Additionally: unread badges on the Messaging nav item, unread dots on individual thread list items, and inline indicators on surfaces that have related threads (e.g., a blue dot on a job card if the employer messaged you). |
| 17 | Real-time simulation | "Simulate" | Simulate real-time messaging. Typing indicators appear briefly, then a response slides in after a delay. |
| 18 | Smart replies | "Yes" | Sophia suggests contextual reply options at bottom of thread. 2-3 chips: "Thanks for the feedback!" / "Can we reschedule?" / "I'll review and get back to you." |
| 19 | Message summarization | "Yes" | Sophia can summarize long threads. Appears as a collapsible card at top of thread: "Summary: Alice suggested focusing on case studies. You agreed to complete 2 by Friday." |
| 22 | Sophia's tone in messaging | "Yes" (warm) | Sophia is warmer and more casual in messaging context vs. coaching mode. Less structured, more conversational. |

### Validated Recommendations
| # | Question | Recommendation | Reasoning |
|---|----------|----------------|-----------|
| 1 | Layout | **Three-panel on desktop:** conversation list (240px) → active thread → context panel (participant info, shared files, pinned messages, 280px). Context panel is collapsible. On mobile: conversation list → full-screen thread (context in a drawer). The third panel is the differentiator from Slack/iMessage — it shows career context ("This person is on Phase 2 of their roadmap, focus area: interview prep"). |
| 6 | Typing indicator | **On-brand animated dots:** Three dots in a glass pill, lime-green for Sophia, white for humans. Dots pulse sequentially (not simultaneously). Small, unobtrusive, positioned where the next message will appear. |
| 13 | Video call card in thread | **Yes.** Scheduled calls appear as a styled card in the thread: participant avatars, time/date, timezone, status (Upcoming / In Progress / Completed), and [Join Call] button. After the call: card updates to show duration + "Session notes" expandable. |
| 16 | Message history retention | **Infinite for prototype.** In production this would be role/tier dependent, but for our build we show infinite scroll with lazy loading. Oldest messages load on scroll-up with a skeleton shimmer. |
| 20-21 | Send/receive animations | **Research-validated delightful patterns:** Send: message bubble scales up from 0.95→1.0 with a subtle fade-in, slides up from the input area. The send button does a brief pulse on tap. Receive: incoming message slides in from the left with a gentle ease-out, slight bounce (0.5px). New message indicator: a pill slides down from the top of the thread "↓ New messages" if the user has scrolled up. |
| 23 | Message encryption | **Recommend: encrypted in transit (TLS) and at rest (AES-256). Not E2E for now** — E2E would prevent Sophia from reading threads for summarization and smart replies, which is a core feature. Flag this as a business/legal decision for production. For our build: no impact on UI. |
| 24 | File sharing | **Recommend:** Allow common file types (PDF, DOCX, XLSX, PNG, JPG, MP4). Size limit: 25MB. Show file type icon + name + size in the message bubble. Preview for images and PDFs inline. For production: virus scanning required. For our build: mock the upload flow with a progress bar. |
| 25 | Video as premium | **Build the UI for all users.** Design a paywall variation: free users see "Upgrade to access video calls" with a preview of the video UI behind a frosted glass overlay. Business team decides the gate. |

---

## SURFACE 9: Session/Booking — Answer Synthesis

### Direct Answers
| # | Question | Your Answer | Locked Decision |
|---|----------|-------------|-----------------|
| 3 | Time slot picker | "Yes" (both) | Both: calendar view for visual scanners + list of next available slots for quick bookers. Tab toggle between them. |
| 4 | Session types | "Provide UI and flows for all" | Build all 5: 1:1 Mentoring (30/60 min), Group Workshop, Office Hours (drop-in), Mock Interview (Sophia-facilitated), Career Coaching (paid). |
| 5 | Booking confirmation | "All" | Confirmation screen + calendar add (.ics) + auto-created thread + Sophia pre-session prep message. Full flow. |
| 7 | Empty state (guide) | "Yes" | Sophia: "Set your first available time to start accepting bookings." With a CTA to the availability setup flow. |
| 10 | Session prep | "Yes" | Sophia generates prep briefs for both parties. Guide gets mentee context. Mentee gets discussion suggestions based on roadmap progress. |
| 11 | Post-session flow | "Contextualize, provide UI and flow for all" | Build all: mutual rating/review, Sophia follow-up with roadmap updates, session notes (editable by both), next session suggestion. |
| 13 | Calendar integration | "Yes we mock" | Mock Google Calendar / Outlook sync. Show the integration UI but use mock data. |

### Validated Recommendations
| # | Question | Recommendation | Reasoning |
|---|----------|----------------|-----------|
| 1 | Two sides — separate or role-based? | **One surface, role-based rendering.** Same pattern as EdgeMatch. URL: `/sessions`. EdgeGuide sees: My Availability → Upcoming Sessions → Session History → Earnings. EdgeStar sees: Find a Mentor → My Bookings → Session History → Prep Hub. Same layout skeleton, different data and CTAs. |
| 2 | Calendar view | **Week view as default** with toggle to month and day. Week view shows time blocks (8am-8pm). Month shows dots on days with sessions. Day shows detailed hour-by-hour. EdgeGuide defaults to week (managing availability). EdgeStar defaults to list (booking slots). |
| 6 | Cancellation/reschedule | **Host sets their own policy.** Options during setup: "Flexible" (cancel anytime), "Moderate" (24hr notice), "Strict" (48hr notice). Display policy clearly on the booking page. Reschedule: always allowed with same notice period. Show a clear cancellation policy card on every booking confirmation. |
| 8 | Empty state (booker, no matches) | Sophia: "No mentors available for your focus area right now. I'll notify you when one becomes available." + CTA: "Explore other focus areas" or "Try a Sophia mock interview instead." Never a dead end. |
| 9 | Monetization | **Build UI for both free and paid.** Free mentors show "Free" badge. Paid coaches show price per session. Build the payment confirmation screen (Stripe-style) but mock the payment flow. Include: commission display for guides ("You earn $X, CareerEdge fee: $Y"). Business team sets the actual numbers. |
| 12 | Timezone handling | **Always show in viewer's timezone** with a small "(EST)" label. On the booking confirmation, show both timezones: "2:00 PM EST (your time) / 11:00 AM PST (Alice's time)." Timezone auto-detected from browser. Option to manually set in profile. |
| 14 | Sophia optimal timing | **Contextual chip in booking flow.** When an EdgeStar opens Sessions, Sophia checks roadmap progress and may show: "You just completed a major milestone — a debrief session this week would help. [Find a mentor →]". Not always — only when contextually relevant (milestone completion, skills gap identified, interview coming up). |
| 15 | Smart matching | **Sophia recommends first, browse second.** Default view: "Sophia's picks" (3-4 recommended mentors based on roadmap, target role, learning style) above a "Browse all" section with filters. The recommendation cards explain WHY: "Alice specializes in product management transitions — your target role." |
| 16-17 | Time slot selection + booking confirmation | **Slot selection:** hover highlights with green border, click expands to show confirm button with session details. Smooth height animation. **Booking confirmation:** checkmark draws itself (SVG path animation), session card assembles with a staggered reveal (date, time, mentor, topic). Warm, not celebratory — progress, not a party. A subtle green glow pulse. |
| 18 | Session surface tone | **Reframe:** Instead of "you're making progress by seeking guidance" (agreed, sounds patronizing), use the Sophia voice: "Good pairing. Alice has guided 12 people through transitions like yours." Let the CONTEXT do the warming — show the mentor's track record, relevance to the user's journey, and Sophia's confidence in the match. Warmth through specificity, not platitudes. |
| 19 | Payment data | **Delegate to Stripe.** We store: session ID, amount, status (paid/pending/refunded), timestamp. We do NOT store: card numbers, bank details. Stripe handles all PII. Build the UI to show payment status and history, but mock the Stripe integration. |
| 20 | Video recording consent | **This IS a product decision, not just business.** Recommendation: Both parties must consent before recording starts. UI: when host clicks "Record," the other party sees a modal: "Alice wants to record this session. [Allow] [Decline]." Recording indicator visible to both parties at all times (red dot + "Recording"). Recordings stored in session history, accessible to both parties. Either party can request deletion. |
| 21 | Revenue model | **Build UI that supports all models.** Show: per-session price, subscription option ("Unlimited sessions: $X/mo"), and commission structure. Mock all three. Let business pick. |

---

## SURFACE 10: Task Rooms — Answer Synthesis

### Validated Recommendations (all were "validate")
| # | Question | Recommendation | Reasoning |
|---|----------|----------------|-----------|
| 1 | EdgeGuide review mode | **Review mode within the same room.** Guide enters the same room URL but sees a review overlay: submitted deliverables highlighted, a "Feedback" input per sub-task, an "Approve" / "Request changes" action. The room content is identical — the interaction layer changes. Not a separate view; a mode toggle (like Google Docs' Suggesting mode). |
| 2 | EdgeParent read-only view | **Progress bar + milestone completion status + time spent.** Parents see: overall room progress (X of Y sub-tasks done), time spent in room, and Sophia's summary of what was accomplished. They do NOT see: Sophia's coaching messages (that's private coaching), detailed work-in-progress, or draft deliverables. They see outputs, not process. This respects the user's autonomy while keeping parents informed. |
| 3 | EdgePreneur rooms | **Yes, different layouts.** Business milestone rooms need different tools: a pitch deck builder (instead of resume tools), a market validation tracker (instead of skills gap), a financial model workspace (instead of course completion). Same room STRUCTURE (sub-tasks, Sophia coaching, timer, resources) but different TOOLS per milestone type. Build 2-3 business room variants. |
| 4 | Room lifecycle | **Add "Blocked" state.** Full lifecycle: Created → Active → Paused → Blocked → Completed → Archived. "Blocked" = waiting on external input (mentor review, resource availability, prerequisite completion). Sophia proactively flags blocked rooms: "This room is waiting on Alice's feedback. I've nudged her." Auto-unblock when the blocker is resolved. |
| 5 | Room limits | **Build Sophia's nudge UI.** No hard cap, but Sophia nudges at 4+ open rooms: "You have 5 open rooms. Want to prioritize? I suggest focusing on [Room X] — it's closest to completion." Show a "Focus mode" option that dims non-priority rooms. Business team can set hard caps later via config. |
| 6 | State persistence | **Preserve everything.** Scroll position, open tabs, in-progress text (auto-save every 30s), video timestamp, selected sub-task. When user returns, Sophia acknowledges: "Welcome back. You were working on [sub-task]. Pick up where you left off?" |
| 7 | Cross-surface data mocking | **Mock with realistic cross-references.** Room resources should reference REAL surface data: "Your resume from ResumeEdge" (link), "Sophia's notes from your last coaching session" (link), "The JD from EdgeMatch for [Company]" (link). These are mock links but they demonstrate the cross-surface integration. Don't use placeholder data that doesn't connect — the connections ARE the feature. |
| 8 | Sophia coaching vs. regular | **Room-specific Sophia has elevated context.** She knows: current sub-task, time spent on it, resources viewed, deliverables submitted, mentor feedback received. She proactively coaches after 15+ minutes on a sub-task (not 20 — shorter threshold for rooms since they're focused work). Her tone is more coaching-oriented: "Try breaking this into smaller pieces" vs. the general "How can I help?" |
| 9 | Auto-generated sub-tasks | **Sophia generates, user edits.** When a room is created from a milestone, Sophia proposes 4-6 sub-tasks based on the milestone type and user's context. The user can: accept all, edit individual sub-tasks, add their own, remove suggestions. Quality bar: sub-tasks must be specific and actionable ("Draft 3 bullet points for your PM experience" not "Work on resume"). Show a "Sophia suggested" badge on auto-generated sub-tasks. |
| 10 | Room entry transition | **Zoom-in from milestone card + room assembly.** The milestone card on EdgePath scales up to fill the screen (300ms, ease-out), then the room panels (sub-tasks, resources, Sophia, workspace) slide/fade into their positions with a staggered reveal (50ms intervals). Reverse on exit: panels dissolve, room zooms back down to the milestone card. This reinforces the spatial relationship between the roadmap and the room. |
| 11 | Sub-task completion | **Checkmark draw + progress bar advance + Sophia acknowledgment.** Checkmark SVG path draws itself (200ms). Progress bar smoothly advances. If it's a significant completion (50%, 100%), Sophia chimes: "Halfway there" or "Room complete! Great work." The completed sub-task row gets a subtle green tint and slightly fades (not opacity — a lighter background to show it's done while remaining readable). |
| 12 | Room ambiance | **Yes, subtle background shift.** Rooms have a slightly different background tint: a warm undertone vs. the cool blue-black of the main app. Think #0C0E12 (main) vs. #0E0F14 with a very subtle warm noise texture. The effect should be subliminal — you feel contained without knowing why. The room header could also have a faint topographic pattern specific to the milestone type. |
| 13 | Mentor access to room content | **Outputs only, not coaching conversations.** Guides see: submitted deliverables, completed sub-tasks, time logs, and user-opted-to-share notes. They do NOT see: Sophia's private coaching messages, draft work, or abandoned attempts. The user controls what's visible via a "Share with mentor" toggle on each deliverable. This is a critical privacy boundary — coaching should feel safe. |

---

## Cross-Cutting Questions — Answers

| # | Question | Your Answer | Locked Decision |
|---|----------|-------------|-----------------|
| 1 | Sophia contextualizes per surface | "Yes" | Sophia's bottom bar shows surface-aware context. EdgeMatch: "3 new matches." Sessions: "Prep for tomorrow's call." Analytics: "Your resume views are up 40%." |
| 2 | Cross-surface navigation chips | "Yes" | Every surface gets contextual exit chips. After booking → "Prepare in your Task Room." After finding a job → "Optimize your resume." After completing a room → "Check your updated roadmap." These are the connective tissue of the platform. |
| 3 | Role switching | **Validated:** Role switcher in profile/settings area. When switching roles, the left nav updates to show role-appropriate surfaces. The URL structure stays the same (`/edgematch`) but the view renders differently. A small role badge in the nav shows current active role. No full page reload — smooth transition with the shell's existing animation system. |
| 4 | Notification unification | **Validated:** Single notification system in the shell. Notifications are typed: message, session, application, sophia_nudge, system. Each type has a distinct icon and color treatment. The notification panel groups by type or shows chronologically (user toggle). Surfaces that have related notifications show inline indicators (unread dots, badges). |
| 5 | "Not in the 10" surfaces | **Validated: No builds this sprint.** EdgeProd, SocialEdge, Course Marketplace, Interview Simulator, EdgeGroups, Settings/Profile — these are composed from components we're building in the 10 surfaces. Interview Simulator is the closest to needing its own build (it's a novel interaction), but it can wait. Settings/Profile is partially built already via onboarding's data model. Focus on the 10. |

---

## Summary: What We're Building This Sprint

### Priority 1 (Specs locked, ready to build)
1. **EdgeMatch** — all answers resolved. Build the browse/apply experience with role-based views, both panel variations, both apply flows.
2. **Task Rooms** — all answers resolved. Build the EdgeGuide review mode, EdgePreneur variants, room entry transition.

### Priority 2 (Speed-run specs needed, then build)
3. **EdgeSight / EdgeBoard** — EdgeStar analytics only this sprint. One analytics surface with role-based switching architecture, but only EdgeStar data for now.
4. **Messaging + Video** — full messaging surface with all 5 thread types, video call UI, Sophia integration.
5. **Session/Booking** — full booking flow with both sides (guide + booker), all 5 session types, payment UI mocked.

### Standing Rule Applied
For every business decision marked "unsure" (pricing models, commission rates, feature gating, encryption levels), we build the complete UI for all options. The business team picks from finished designs, not abstractions.

---

## Open Items for You

Three things I need before writing the speed-run specs:

1. **EdgeSight Q8 — Sophia insight cards:** You said "validate but I think yes." I validated YES. But: how many insight cards per dashboard load? I recommend 2-3 max, refreshed weekly. Agree?

2. **Messaging Q6 — Typing indicator:** You didn't answer this one. My recommendation: on-brand animated dots (lime for Sophia, white for humans) in a glass pill. Agree?

3. **Session Q2 — Calendar default view:** You didn't answer. My recommendation: week view default for guides, list view default for bookers. Agree?

If these are fine, I'll write all 3 speed-run specs in one pass.
