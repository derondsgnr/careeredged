# Surface 9: Session/Booking — Speed-Run UX Spec

**Sprint scope:** Full booking flow for both sides (EdgeGuide host + EdgeStar booker), all 5 session types, payment UI mocked, calendar integration mocked. Sophia pre/post-session flows included.

---

## 1. The Job

**"Connect me with the right person at the right time — and make sure I'm ready when I get there."**

Not "book a session." Not "schedule a call." The user's job isn't calendar management — it's career acceleration through human connection. The booking is the means; the outcome of the session is the end. Sophia's pre-session prep and post-session follow-up are what make this more than Calendly.

**Two-sided surface:** This is the only surface where two roles have genuinely different primary actions on the same URL:
- **EdgeGuide (host):** "I want to help people and get compensated. Make it easy to manage."
- **EdgeStar (booker):** "I need guidance on something specific. Find me the right person and prep me."

Same surface, role-based rendering. URL: `/sessions`.

---

## 2. The States

### EdgeStar States

**Empty (no sessions booked, no history)**

Sophia meets them:
> "Sessions connect you with mentors, coaches, and peers who've been where you're heading. Let me help you find the right person."

Below: Sophia's picks — 3-4 recommended mentor cards based on the user's roadmap, target role, and learning style. Each card shows:
- Mentor avatar + name
- Specialty tags (e.g., "Product Management", "Resume Review", "International Career Mobility")
- Match reason: "Alice specializes in PM transitions — your target role"
- Availability preview: "Next available: Tomorrow, 2:00 PM"
- Session types offered + pricing (free/paid)
- Rating (if available)

Below Sophia's picks: "Browse all mentors →" opens the full browse view with filters.

**Active (sessions booked, history exists)**

The primary state. User sees:
1. **Upcoming Sessions** strip (horizontal scrolling cards)
2. **Sophia's Picks** (recommended mentors, refreshed based on roadmap progress)
3. **Session History** (completed sessions with notes, ratings, follow-ups)

**Pre-Session (2 hours before a scheduled session)**

Sophia sends a prep brief to the session thread (Messaging surface) and shows a prep card on the Sessions surface:

> **Session Prep — Alice Chen, Tomorrow 2:00 PM**
> "Based on your roadmap progress, here's what might be most valuable to discuss:"
> - Portfolio structure (you completed the case study milestone last week)
> - Interview prep for PM roles (you have 2 applications in "Interviewing" status)
> - Networking strategy for your target companies
>
> [Open session thread →] [Reschedule] [Cancel]

**Post-Session (after a session ends)**

Sophia prompts:
> "How was your session with Alice?"

The post-session flow:
1. **Rating** — mutual (both parties rate). Simple 5-star + optional text. Not a lengthy form.
2. **Sophia follow-up** — "Based on your session with Alice, I've identified 2 new tasks for your roadmap. Want me to add them?" [Yes, add them →] [Let me review first]
3. **Session notes** — editable by both parties. Sophia pre-populates with key takeaways if the session was recorded (with consent).
4. **Next session suggestion** — "Alice has availability next Thursday. Want to book a follow-up?" [Book follow-up →] [Not now]

### EdgeGuide States

**Empty (no availability set)**

Sophia:
> "Set your first available time to start accepting bookings. You'll be matched with users whose goals align with your expertise."

CTA: "Set up availability →" opens the availability editor.

Below: a preview of what their profile looks like to potential bookers (empty state version — "Your profile will appear here once you're set up").

**Active (availability set, sessions scheduled)**

The guide sees:
1. **This Week's Calendar** (week view default, time blocks with sessions)
2. **Upcoming Sessions** (list view with booker details + Sophia's context brief)
3. **Earnings Summary** (glass card: this month / all time, sessions completed, average rating)
4. **Session History** (completed sessions with notes, ratings, earnings per session)

**Pending Review (sessions awaiting guide's post-session notes/feedback)**

Badge on Session History: "2 sessions need your feedback." Sophia: "Sharon and Marcus are waiting for your session notes. Want to knock those out?"

---

## 3. The Layout

### EdgeStar — Booking Flow

**Step 1: Find a Mentor**

Two view modes (tab toggle):

**Sophia's Picks (default):**
3-4 recommended mentor cards in a grid. Each card:
- Glass card (standard treatment)
- Avatar (64px) + name + specialty tags
- Match reason from Sophia (1 line, cyan text)
- Session types offered (chips: "1:1 Mentoring", "Mock Interview", etc.)
- Price (if paid): "$75/hr" or "Free" badge
- Availability preview: "Next available: Tomorrow 2:00 PM"
- Rating: stars + count
- [Book Session] button (lime)

**Browse All:**
Filterable list/grid of all available mentors.
Filters: Specialty (multi-select), Session Type, Price Range (free / $0-50 / $50-100 / $100+), Availability (this week / next week / anytime), Rating (4+, 3+), Language.

**Step 2: Select Session Type**

After selecting a mentor, the user picks a session type. This is a modal or slide-over showing what the mentor offers:
- 1:1 Mentoring (30 min / 60 min) — description, price
- Mock Interview — description, price, "Sophia will coach you during the call"
- Career Coaching — description, price
- (Only types the mentor has enabled)

Each option is a selectable glass card.

**Step 3: Pick a Time**

Two sub-views (tab toggle):

**Calendar View (visual scanners):**
Month calendar with available dates highlighted (lime dot). Selecting a date reveals time slots for that day in a side panel. Available slots are glass pills with the time. Unavailable slots are hidden (not greyed out — don't show unavailable times).

**List View (quick bookers):**
"Next available times" — a flat list of the next 10-15 available slots across the coming 2 weeks. Each entry: "Tuesday, March 18 — 2:00 PM EST" as a selectable glass card.

Timezone display: all times in the user's timezone with a small "(EST)" label. A toggle to see the mentor's timezone too.

**Selecting a time slot:**
- Slot highlights with lime border on hover
- Click: slot expands to show a mini confirmation — date, time, session type, mentor, price. [Confirm Booking] button.
- The expansion is a smooth height animation (300ms, ease-out)

**Step 4: Confirmation**

Full-screen confirmation card (centered, glass):
- ✓ checkmark animation (SVG path draw, 400ms)
- "Session booked with Alice Chen"
- Date, time, both timezones
- Session type + duration
- Price paid (if applicable) or "Free session"
- [Add to Calendar] — dropdown: Google Calendar / Apple Calendar / Outlook (.ics download)
- Sophia message: "I'll send you a prep brief 2 hours before. See you there."
- [Go to session thread →] — opens the auto-created thread in Messaging
- [Back to Sessions]

**What happens in the background:**
1. Session thread auto-created in Messaging (both parties added)
2. Sophia schedules a prep brief (2 hours before)
3. Calendar event created (mocked)
4. Notification sent to the guide

### EdgeGuide — Host Management

**Availability Editor**

A week-view calendar (7 columns, 8am-8pm rows) where the guide sets recurring availability:
- Drag to create time blocks (green fill)
- Click a block to edit: set session types available during this block, set duration options, set pricing
- Toggle: "Repeat weekly" (default on) or one-time availability
- Break times: can mark blocks as "break" (grey, not bookable)

Below the calendar:
- **Cancellation policy selector:** Flexible / Moderate (24hr) / Strict (48hr). Shown to bookers during booking.
- **Session type configuration:** which session types they offer, pricing for each, max sessions per day

**Upcoming Sessions View**

List of upcoming sessions, each entry:
- Booker avatar + name
- Date, time, duration
- Session type
- Sophia's context brief preview: "Sharon has completed 60% of her Interaction Design module..."
- [View full prep →] opens the session thread
- [Reschedule] [Cancel]

**Earnings Dashboard (glass card)**

- This month: total earnings, session count, average per session
- All time: same metrics
- Payout status: "Next payout: March 31" (mocked Stripe integration)
- Average rating + review count

### Session Types — Detailed Layouts

**1:1 Mentoring (30/60 min)**
Standard video call. No special UI beyond the base video call surface (from Messaging spec). Sophia coaching panel available but opt-in.

**Group Workshop (multiple attendees)**
Gallery view in video (up to 6 participants visible). Host controls: mute all, spotlight, breakout rooms (future). Attendee list in the context panel.

**Office Hours (drop-in — EdgeEducation)**
No booking required. The guide sets "office hours" blocks. During those blocks, a "Join Office Hours" button appears on the guide's profile. Multiple users can join. Queue system: if the guide is in a 1:1, others wait in a lobby. Sophia: "You're 3rd in line. Estimated wait: 10 minutes."

**Mock Interview (Sophia-facilitated)**
Sophia coaching panel is ON by default (user can minimize). Sophia provides:
- Interview questions relevant to the user's target role
- Timer per question (2-minute suggested response time)
- Real-time coaching tips in the side panel: "Good — you quantified that result. Now connect it to business impact."
- Post-interview debrief: Sophia summarizes performance, strengths, areas to improve

**Career Coaching (paid)**
Same as 1:1 mentoring but with payment confirmation before booking. Payment confirmation card: "You'll be charged $75 for this 60-minute session." [Confirm & Pay] / [Cancel]. Mocked Stripe checkout flow — shows a card input form (non-functional, mock data pre-filled).

### Desktop Layout (1440px reference)

**EdgeStar view:**
- Left: upcoming sessions strip (horizontal) + Sophia's picks grid + session history
- When in booking flow: modal/slide-over sequence (steps 1-4)
- Session history: list with expandable entries (click to see notes, rating, follow-up)

**EdgeGuide view:**
- Left: week calendar (availability + booked sessions)
- Right: earnings card + upcoming sessions list
- Bottom: session history

### Mobile (390px reference)

**EdgeStar:**
- Tabbed interface: "Find" | "Upcoming" | "History"
- Find: Sophia's picks cards (single column) + Browse All button
- Booking flow: full-screen step-by-step (bottom sheet style)
- Calendar time picker: simplified — list view default, calendar toggle available

**EdgeGuide:**
- Tabbed interface: "Calendar" | "Sessions" | "Earnings"
- Calendar: day view default (easier on mobile), swipe between days
- Availability editing: tap a time slot to add/edit, bottom sheet for settings

---

## 4. Sophia Integration

### Pre-Session Prep Brief (2 hours before)

**For the booker:**
> "Your session with Alice is at 2:00 PM. Based on your roadmap, here's what might be most valuable to discuss:"
> - [Topic 1 from roadmap context]
> - [Topic 2 from recent activity]
> - [Topic 3 — question to ask the mentor]
> "Want me to add anything else?"

**For the guide:**
> "Your session with Sharon is at 2:00 PM. Here's what I know about her:"
> - Roadmap: Phase 2 of 4, Interaction Design focus
> - Recent activity: completed 2 case study milestones, optimized resume (score: 82)
> - She has 2 applications in "Interviewing" status at Google and Figma
> "She might want to discuss portfolio structure or interview prep."

Both appear as messages in the session thread AND as a prep card on the Sessions surface.

### Smart Matching

When EdgeStar opens Sessions, Sophia evaluates:
1. User's current roadmap phase + milestones
2. Target role requirements vs. current skills (from EdgeBoard data)
3. Recently completed milestones (session debrief is highest-value right after a milestone)
4. Previous session ratings + topics
5. Mentor availability and specialties

She surfaces 3-4 picks with natural-language match reasons. If she has strong conviction: "I'd prioritize a session with Alice this week — you just completed a major milestone and a debrief would accelerate your next phase."

### Post-Session Follow-Up

Sophia posts in the session thread:
> "Session complete. Here's what I picked up:"
> - [Key takeaway 1]
> - [Key takeaway 2]
> - "Alice suggested you focus on case studies. I've drafted 2 new tasks for your roadmap. Want me to add them?"
> [Add to roadmap →] [Review first →] [Dismiss]

If the user accepts, Sophia creates Task Room entries linked to the session.

### Optimal Timing Nudges

Sophia proactively suggests booking sessions at high-value moments:
- Milestone completion: "You just finished Phase 2 — a debrief session would help solidify what you learned."
- Interview coming up: "You have an interview with Google next week. Want to do a mock interview with Alice?"
- Roadmap stall: "You haven't made progress in 5 days. Sometimes talking through a block helps. [Find a mentor →]"

These appear as Sophia bar contextual messages on the Sessions surface and as nudges on the Dashboard.

---

## 5. Motion

### Time Slot Selection
- Hover: slot border transitions to lime (150ms)
- Click: slot smoothly expands to show confirmation details (300ms, ease-out). Other slots fade slightly (not opacity — darker tint).
- Confirm: slot collapses, transitions to step 4 confirmation

### Booking Confirmation
- Checkmark: SVG path draw animation (400ms, ease-out)
- Session details: stagger in below the checkmark (3 items, 50ms intervals, 300ms each)
- Sophia message: fades in last (200ms delay after details)
- Subtle green glow pulse on the confirmation card border (one cycle, 600ms)

### Calendar Interactions
- Day selection: selected day gets lime background with a smooth fill (150ms)
- Month transition: crossfade (200ms)
- Week view scroll: smooth momentum scrolling
- Availability block creation (guide): block draws from drag start to cursor position, snapping to 30-min intervals

### Session Card Animations
- Upcoming session cards: enter with a subtle slide-up + fade (200ms, staggered)
- Session completing (status change): brief pulse on the status badge
- Earnings number update: counts up from previous value (400ms)

### Reduced Motion
All expansions and draws become instant. Crossfades and status changes remain. Counting animations reduced to simple value swap.

---

## 6. Cross-Surface Connections

### Entry Points INTO Sessions
- **EdgePath**: "Book a mentor session" chip on milestones → opens Sessions with Sophia's picks filtered to milestone-relevant mentors
- **EdgeBoard (Analytics)**: "Book a mentor session" chip on skills gap chart → opens Sessions with specialties pre-filtered
- **Dashboard**: upcoming session card → opens Sessions at that session's detail
- **Sophia bar (any surface)**: "Want to book a session?" contextual suggestion → opens Sessions
- **Messaging**: "Book a follow-up" button in session thread → opens booking flow with the same mentor pre-selected

### Exit Points FROM Sessions
- **After booking**: "Prepare in your Task Room →" → EdgePath/Task Room for relevant milestone
- **After booking**: "Optimize your resume before the session →" → ResumeEdge
- **Session thread**: "Open in Messaging →" → Messaging surface at the session thread
- **Post-session**: "Check your updated roadmap →" → EdgePath (if Sophia added tasks)
- **Post-session**: "View your analytics →" → EdgeBoard

---

## 7. Build Notes

### Mock Data Requirements
- 4 mock mentors/guides:
  - Alice Chen — Product Management, paid ($75/hr), 4.9 rating, 23 sessions completed
  - Marcus Johnson — UX Design, free (volunteer), 4.7 rating, 45 sessions completed
  - Dr. Priya Sharma — International Career Mobility, paid ($100/hr), 5.0 rating, 12 sessions completed
  - James Okafor — Interview Prep, free, 4.6 rating, 67 sessions completed
- 3 upcoming sessions (one today, one tomorrow, one next week)
- 5 completed sessions with ratings, notes, and Sophia follow-ups
- Availability data for all 4 mentors (realistic time blocks across 2 weeks)
- One session in "post-session" state (awaiting rating)

### Component Architecture
- `<SessionsLayout>` — role-based orchestrator (EdgeStar vs EdgeGuide view)
- `<SophiaPicks>` — recommended mentor grid with match reasons
- `<MentorCard>` — avatar, specialties, price, availability, rating
- `<MentorBrowse>` — filterable grid of all mentors
- `<BookingFlow>` — multi-step modal (session type → time → confirmation)
- `<TimeSlotPicker>` — calendar view + list view tabs
- `<CalendarView>` — month calendar with available date indicators
- `<ListSlotView>` — flat list of next available times
- `<BookingConfirmation>` — animated confirmation card
- `<UpcomingSessions>` — horizontal scroll strip of session cards
- `<SessionHistory>` — expandable list of completed sessions
- `<PostSessionFlow>` — rating + Sophia follow-up + notes
- `<PrepBriefCard>` — Sophia's pre-session prep
- `<AvailabilityEditor>` — week-view drag-to-create (EdgeGuide)
- `<EarningsCard>` — guide earnings summary
- `<PaymentConfirmation>` — mocked Stripe checkout
- `<SessionTypeSelector>` — session type cards

### Timezone Handling
- Detect user timezone from browser (`Intl.DateTimeFormat().resolvedOptions().timeZone`)
- Store all times in UTC, display in user's local timezone
- On booking confirmation: show both timezones
- Mock mentors are in different timezones (EST, PST, IST, WAT) to demonstrate the display

### Accessibility
- Calendar: keyboard navigable (arrow keys for days, Enter to select, Escape to close)
- Time slots: focusable, selectable with Enter/Space
- Booking flow steps: announced via `aria-live` regions
- Rating: keyboard-operable star selector with `aria-label="Rate [n] out of 5 stars"`
- Screen readers: session cards announce all details (mentor name, date, time, type, status)

### Performance Budget
- Sessions surface initial load: <500ms
- Booking flow step transitions: <200ms
- Calendar month switch: <150ms
- Confirmation animation: <600ms total
