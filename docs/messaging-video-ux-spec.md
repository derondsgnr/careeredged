# Surface 8: Messaging + Video — Speed-Run UX Spec

**Sprint scope:** Full messaging surface (all 5 thread types), video call UI, Sophia integration. All data mocked with simulated real-time behavior.

---

## 1. The Job

**"Stay connected to the people helping me move forward — without leaving the platform."**

Not "send messages." Not "use the chat feature." Messaging is the connective tissue between every other surface. When you apply for a job, the employer can reach you here. When you book a session, the thread lives here. When Sophia coaches you, the history is here. The value isn't the messaging tool — it's that every relationship on the platform has a persistent, contextual thread.

**The Sophia thread difference:** Every other messaging product separates AI chat from human chat. CareerEdge doesn't. Sophia threads sit alongside mentor threads, employer threads, and peer threads in the same conversation list. She's a participant, not a separate product. This is the design principle: Sophia is a person in your career network, not a tool in your toolbar.

---

## 2. The States

### Empty (Day 0 — no conversations)

New user, no threads.

**What happens:** Sophia auto-starts a welcome thread. When the user opens Messaging for the first time, they see one conversation in the list:

**Sophia** — "Welcome to your inbox"
> "This is where your career conversations live. Mentor chats, employer messages, session threads — they all show up here. I'm always available in this thread if you need me. For now, here's what you could do next:"

Chips:
- "Find a mentor →" (opens Session/Booking)
- "Browse roles →" (opens EdgeMatch)
- "Continue your roadmap →" (opens EdgePath)

The conversation list has Sophia's thread + a subtle "Your conversations will appear here" placeholder below.

### Active (multiple threads, daily use)

The primary use state. Multiple thread types in the list, unread indicators, Sophia threads interspersed with human threads.

### Notification (new message while on another surface)

The shell's notification system handles this. Additionally:
- Messaging nav item shows unread count badge (lime background, dark text)
- On surfaces with related threads: a small cyan dot on the relevant element (e.g., a job card in EdgeMatch if the employer messaged you)

---

## 3. The Layout

### Desktop (1440px reference)

**Three-panel layout:**

**Panel 1 — Conversation List (280px, left)**

Top: Search bar (glass input, full width, magnifying glass icon). Global search across all conversations — results show matching messages with thread context.

Below search: Filter chips — All | Direct | Groups | Sophia | Sessions | Applications. Selected chip gets lime fill.

Thread list entries, each showing:
- Avatar (40px, circular). Sophia gets her cyan ring. Session threads get a calendar icon overlay. Application threads get a briefcase icon overlay.
- Name / thread title
- Last message preview (truncated, 1 line)
- Timestamp (relative: "2m", "1h", "Yesterday")
- Unread indicator: small lime dot (8px) on the left edge of unread threads
- Pinned threads stick to the top with a subtle pin icon

Thread list sorted: pinned first, then by most recent message.

**Panel 2 — Active Thread (flex, center)**

Top bar (56px):
- Thread participant(s) avatar + name
- Thread type badge (subtle, right-aligned): "Session" / "Application" / "Group"
- Actions: pin, search within thread, video call button (if applicable), more menu (mute, archive, mark unread)
- If a summarizable thread: "Sophia Summary" button that expands a collapsible card at the top of the messages

Message area (scrollable):
- Messages flow bottom-up (newest at bottom)
- Human messages: glass bubble (rgba(255,255,255,0.05)), left-aligned for received, right-aligned for sent
- Sophia messages: distinct treatment — cyan-tinted glass bubble (rgba(34,211,238,0.08)), cyan left border (2px), her avatar always visible
- Message types:
  - **Text**: rendered with markdown support (bold, italic, links, code)
  - **File**: glass card with file type icon, name, size, download button. PDF/image preview inline.
  - **Image**: rendered inline, click to expand in lightbox
  - **Voice note**: waveform visualization in a pill, play button, duration
  - **Video message**: thumbnail with play overlay, duration badge
  - **Link preview**: card with favicon, title, description, thumbnail (if available)
  - **Session card**: styled card for scheduled calls — participant avatars, date/time, timezone, status badge (Upcoming / In Progress / Completed), [Join Call] button
  - **Smart reply chips**: appear above the input when Sophia suggests responses (2-3 contextual options)

Read receipts: small "Seen" text below the last sent message, grey (#6B7280).

Typing indicator: glass pill with three dots, positioned where the next message would appear. Dots pulse sequentially (150ms offset). Lime dots for Sophia, white (#D1D5DB) dots for humans.

Input area (64px min, expands):
- Glass input bar with placeholder: "Type a message..."
- Left: attachment button (opens file/image/voice picker)
- Right: send button (lime fill when input has content, glass when empty)
- Send button does a brief scale pulse (1.0→1.1→1.0, 200ms) on tap
- Input expands vertically as text wraps (max 4 lines before scroll)

**Panel 3 — Context Panel (280px, right, collapsible)**

This panel is the differentiator. It shows career context for the conversation participant.

For a mentor thread:
- Mentor profile card (avatar, name, specialties, rating)
- "Your connection": how this mentor relates to your roadmap ("Specializes in Product Management transitions — your target role")
- Shared files in this thread
- Pinned messages
- Session history with this person
- Quick actions: "Book a session" / "View their profile"

For an employer thread:
- Company card (logo, name, role applied for)
- Application status badge (Applied → Viewed → Interviewing → etc.)
- Job match % from EdgeMatch
- Quick actions: "View job listing" / "Optimize resume for this role"

For a Sophia thread:
- Conversation topics (auto-tagged: "Resume", "Interview Prep", "Roadmap")
- Thread summary (auto-generated)
- Related surfaces: links to EdgePath, ResumeEdge, etc. based on conversation content

For a group thread:
- Member list with avatars
- Group purpose/description
- Shared files and pinned messages

Toggle button to collapse/expand (on the panel's left edge). Collapsed state: panel hidden, thread area expands.

### Mobile (390px reference)

Single-panel navigation:
1. Conversation list (full screen) — tap a thread to enter it
2. Active thread (full screen) — back button returns to list. Swipe right to go back.
3. Context panel: accessible via a "ℹ" button in the thread top bar, opens as a bottom sheet (60% height)

Search: tappable bar at top of conversation list, expands into full-screen search on focus.

Smart replies: horizontal scrolling chips above the keyboard.

---

## 4. Thread Types — Detailed Behavior

### Direct Message (1:1)
Standard human-to-human chat. No special behavior beyond the context panel showing career context.

### Group Chat (EdgeGroups)
Multiple participants. Shows all avatars in the thread header. Message bubbles include sender name above the bubble. Typing indicator shows who is typing: "Alice is typing..."

### Sophia Thread
Auto-created during onboarding welcome. Additional Sophia threads are created when:
- User asks Sophia a multi-turn question from any surface's Sophia bar (thread persists here)
- User clicks "Continue this conversation" from any Sophia interaction

Sophia threads have a shimmer border on the thread list entry (very subtle, 1px animated gradient). Her messages always show her avatar. Smart replies are more frequent in Sophia threads.

### Session Thread
Auto-created when a session is booked. Thread title: "Session with [Name] — [Date]"
Pre-session: Sophia posts a prep brief for both parties (as a message in the thread).
Post-session: Sophia posts a follow-up with action items extracted from the session.
The session card (join/reschedule/cancel) is pinned at the top.

### Application Thread
Auto-created when the user applies to a job (native apply only, not external redirect).
Thread title: "[Company Name] — [Role Title]"
The employer can initiate conversation. The application status card is pinned at the top and updates as the status changes (Applied → Viewed → Interviewing → etc.).

---

## 5. Video Call UI

### Entering a Call
From a session thread: user taps [Join Call] on the session card. The messaging surface transitions to the video call view (not a new page — a mode switch within the same surface).

From the thread top bar: user taps the video call icon to initiate an ad-hoc call. The other participant sees a "Video call from [Name]" notification with Accept/Decline.

### Video Call Layout (Desktop)

**Main area: participant video feeds**
- 2-person call: side-by-side (equal size) or speaker-focused (active speaker large, other in corner PiP)
- Self-view: small PiP in bottom-right corner (draggable)
- Glass card styling on video frames (subtle border, rounded corners — 16px)
- When camera is off: show avatar on dark glass background with name label

**Bottom control bar (64px, glass, centered):**
- Camera toggle (icon + label: "Camera")
- Mic toggle (icon + label: "Mic")
- Screen share button
- Chat overlay toggle (opens the thread in a right panel during the call)
- End call (red background pill)
- Recording indicator: when recording, a red dot + "Recording" badge appears top-left of the viewport. Both parties see it.

**Sophia Coaching Panel (right side, 320px, collapsible)**
Available in interview prep mode and session coaching mode. Contains:
- Real-time prompts from Sophia based on conversation context
- For mock interviews: suggested answers, timing feedback ("You've been talking for 3 minutes — try to be more concise"), body language reminders
- For mentor sessions: roadmap-relevant talking points, questions to ask
- The panel is opt-in — user must enable "Sophia Coaching" before or during the call
- Sophia's text appears with a typing animation (like she's listening and responding in real-time)

### Video Call Layout (Mobile)

Full-screen active speaker. Self-view PiP in top-right corner. Controls in a bottom bar (auto-hides after 3 seconds of no interaction, tap to reveal). Sophia coaching panel: swipe from right edge to reveal a half-screen overlay. No screen share on mobile.

### Call States
- **Connecting**: "Connecting to [Name]..." with a pulsing avatar
- **Active**: live video feeds with controls
- **Reconnecting**: "Reconnecting..." with a spinner, video feeds freeze
- **Ended**: "Call ended — [duration]" with Sophia follow-up: "How did that go? I can add notes to your session thread." Return to messaging thread.

---

## 6. Sophia Integration

### Smart Replies
Sophia observes the conversation context and suggests 2-3 reply chips:
- After receiving feedback: "Thanks for the feedback!" / "I'll work on that"
- After a scheduling message: "That works for me" / "Can we reschedule?"
- After an employer message: "Thank you for the update" / "I'd love to learn more about the role"

Smart replies appear in a horizontal strip above the input. Tapping one sends it immediately (with a brief sent animation). They fade out after the user starts typing manually.

### Thread Summarization
For threads with 20+ messages, a "Sophia Summary" button appears in the thread header. Tapping it reveals a collapsible card at the top of the message list:

> **Thread Summary** (updated 2 hours ago)
> Alice suggested focusing on case studies for your portfolio. You agreed to complete 2 by Friday. She also recommended the Google UX certificate program and offered to review your work.

The summary refreshes when new significant messages are added. Users can dismiss the summary card.

### Contextual Awareness
Sophia knows what surface the user came from. If they opened Messaging from EdgeMatch (via "Message employer"), Sophia pre-populates context:
- The application thread opens directly
- Smart replies are job-application-aware: "Thank you for considering my application" / "I'm available for an interview at your convenience"

### Sophia's Tone in Messaging
Warmer and more conversational than coaching mode. She uses shorter sentences. Fewer bullet points. More natural phrasing. She matches the informality of the medium while staying professional.

Examples:
- Coaching (Task Room): "Let's break this milestone into sub-tasks. Here are 4 I'd suggest based on your target role..."
- Messaging: "Hey — just wanted to flag that Alice replied to your portfolio review. Want me to summarize her feedback?"

---

## 7. Motion

### Message Send
- Sent message bubble: scales up from 0.95→1.0, fades in (200ms, ease-out), slides up from input area position
- Send button: brief scale pulse (1.0→1.1→1.0, 200ms)
- The input area smoothly resets to single-line height

### Message Receive
- Incoming message: slides in from left (for received) with ease-out (250ms)
- If user is scrolled up: "↓ New messages" pill slides down from the top of the message area (300ms, spring easing). Tapping it smooth-scrolls to the bottom.

### Typing Indicator
- Appears where the next message would render
- Three dots in a glass pill, pulsing sequentially (each dot: 300ms cycle, 100ms offset between dots)
- Fades in (150ms) when typing starts, fades out (150ms) when typing stops

### Thread Selection
- On desktop: selected thread in the list gets a lime left border (2px) that slides in (150ms)
- Message area crossfades between threads (200ms)
- Context panel content crossfades (200ms)

### Video Call Transitions
- Entering call: messaging thread slides left and fades, video UI slides in from right (400ms, ease-out)
- Ending call: reverse — video fades, thread slides back in
- Control bar: auto-hides after 3s of no interaction, slides down (200ms). Mouse movement / tap reveals it, slides up (200ms).

### Smart Reply Chips
- Appear: stagger in from left (50ms intervals, 200ms each, ease-out)
- Disappear (when user types): all fade out simultaneously (150ms)
- On tap: chip scales down (0.95) briefly, then the message appears as a sent bubble

### Reduced Motion
All slides become instant renders. Fades remain. Typing indicator dots use opacity change instead of scale pulse.

---

## 8. Cross-Surface Connections

### Entry Points INTO Messaging
- **EdgeMatch**: "Message employer" on a job listing → opens/creates an Application thread
- **Session/Booking**: booking creates a Session thread automatically
- **Task Rooms**: "Ask your mentor" → opens the mentor's DM thread
- **EdgePath**: "Discuss with your mentor" milestone chip → opens mentor DM
- **Shell notification**: tapping a message notification → opens the relevant thread

### Exit Points FROM Messaging
- **Application thread**: "View job listing →" chip → EdgeMatch detail
- **Session thread**: "Prep for your session →" chip → Session/Booking prep view
- **Sophia thread**: "Open in full Sophia →" chip → Ask Sophia surface
- **Mentor DM context panel**: "Book a session →" → Session/Booking
- **Employer DM context panel**: "Optimize resume for this role →" → ResumeEdge with JD pre-loaded

### Notification Indicators on Other Surfaces
- EdgeMatch: cyan dot on a job card if the employer sent a message
- Session/Booking: "1 new message" badge on upcoming session cards
- Shell nav: unread count badge on Messaging icon

---

## 9. Build Notes

### Mock Data Requirements
- 8-10 mock threads covering all 5 types:
  - 2 DMs (one mentor, one peer)
  - 1 group chat (EdgeGroup: "Product Design Cohort 2026")
  - 2 Sophia threads (onboarding welcome, resume coaching conversation)
  - 2 session threads (one upcoming with prep brief, one completed with follow-up)
  - 1 application thread (with employer messages and status progression)
- Each thread: 10-30 messages with varied types (text, file, image, link preview, session card)
- Smart reply chips on the most recent received message in each thread
- One thread with 25+ messages to demonstrate the summarization feature

### Component Architecture
- `<MessagingLayout>` — three-panel orchestrator, handles thread selection state
- `<ConversationList>` — search, filters, thread entries
- `<ThreadEntry>` — avatar, preview, timestamp, unread indicator
- `<ActiveThread>` — top bar, message list, input area
- `<MessageBubble>` — polymorphic: text, file, image, voice, video, link preview, session card
- `<SophiaMessage>` — extends MessageBubble with cyan treatment
- `<SmartReplies>` — horizontal chip strip
- `<ThreadSummary>` — collapsible Sophia summary card
- `<ContextPanel>` — role-aware participant/thread context
- `<VideoCall>` — full call UI with controls and Sophia coaching panel
- `<TypingIndicator>` — animated dot pill
- `<NewMessagePill>` — scroll-to-bottom indicator

### Simulated Real-Time Behavior
- After the user sends a message, simulate a typing indicator (1.5-3s random delay) followed by a contextual response
- In Sophia threads: Sophia responds. In human threads: the mock participant responds with pre-written contextual replies.
- New message notification badge updates in real-time (increment unread count on simulated incoming)

### Accessibility
- All message bubbles have `role="listitem"` within a `role="list"` container
- Screen readers announce: "[Sender name] said: [message content], [timestamp]"
- Video call controls: keyboard navigable, each button has `aria-label`
- Typing indicator: `aria-live="polite"` announces "[Name] is typing"
- Smart replies: announced as "Suggested replies" with individual chip labels

### Performance Budget
- Conversation list render: <300ms
- Thread switch (crossfade + message render): <400ms
- Message send to visual confirmation: <100ms
- Video call UI load: <1s

---

## 10. Cross-Surface Inline Check-In Pattern

### The Problem
Dashboard cards (EdgeParent check-in, EdgeBuddy accountability) need to send messages without navigating away from the dashboard. The receiver needs to see these messages in their Messaging inbox.

### The Pattern: Message Queue

**Architecture:** `message-queue.ts` provides a localStorage-backed queue that bridges dashboard surfaces and the Messaging surface.

**Sender flow (dashboard chip → queue → toast):**
1. User taps an inline check-in chip (e.g., "Great progress!", "How's your week?")
2. `queueMessage()` writes the message to localStorage with recipient info
3. Toast confirmation appears: `Sent to Alex: "Great progress!"`
4. User stays on the dashboard — no navigation required

**Receiver flow (Messaging surface consumes queue):**
1. When Messaging surface mounts, `consumeMessages()` reads and clears the queue
2. If a DM thread for the recipient exists, the message is appended
3. If no thread exists, a new DM thread is created at the top of the conversation list
4. The thread shows the message with "Just now" timestamp and smart reply suggestions

### Where This Pattern Is Used

| Surface | Sender | Recipient | Chips |
|---|---|---|---|
| EdgeParent dashboard | Parent (David) | Child (Alex Chen) | "Great progress!", "How's it going?", "Need anything?" |
| EdgeBuddy dashboard card | EdgeStar (Sharon) | Buddy (Jordan Rivera) | "How's your week?", "Hit a milestone!", "Need accountability?" |
| EdgeBuddy focus companion | EdgeStar (Sharon) | Buddy (Jordan Rivera) | "How's it going?", "Made progress!" |

### Design Rules
- Chips are pre-written — the user does NOT type a message (friction-free)
- Toast is the only feedback — no modal, no navigation, no loading state
- The Messaging surface is the canonical conversation view — chips are a shortcut entry point, not a replacement
- "Open full conversation" link below chips navigates to the Messages surface for longer exchanges
- On the receiver's side, the message appears as a normal DM with smart reply suggestions

### Sophia Integration
Sophia does NOT mediate check-in messages. These are direct peer-to-peer (or parent-to-child) messages. Sophia's role is in the Sophia thread — she can reference check-in activity ("I noticed you and Jordan haven't checked in this week") but doesn't intercept or rewrite the messages.

### Implementation
- `src/app/components/message-queue.ts` — queue utility (queueMessage, consumeMessages, peekMessages)
- `src/app/components/messaging.tsx` — consumes queue on mount via useEffect
- `src/app/components/dashboards/edgeparent-dashboard.tsx` — parent check-in chips
- `src/app/components/buddy-dashboard-card.tsx` — buddy check-in chips
- `src/app/components/edge-buddy.tsx` — focus companion buddy chips
