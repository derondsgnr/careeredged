# Messaging Surface — Pre-Build Validation

**Date:** March 17, 2026
**Method:** Product OS skill applied 3x (Design, Engineering, Brand/Motion)

---

## VALIDATION PASS 1: Design — Every Screen, Affordance, Button

### Screen 1: Conversation List Panel (280px, left)

| # | Element | Type | Behavior | Dead-End Risk |
|---|---------|------|----------|---------------|
| 1 | Search bar | Glass input, full-width | Filters thread list by name/content, client-side | Empty results → show "No conversations match" |
| 2 | Search clear button | X icon, appears when input has content | Clears search, restores full list | None |
| 3 | Filter chips: All | Chip button | Shows all threads, lime fill when selected | None |
| 4 | Filter chips: Direct | Chip button | Shows only DM threads | Empty filter → "No direct messages yet" |
| 5 | Filter chips: Groups | Chip button | Shows only group threads | Empty filter → "No groups yet" |
| 6 | Filter chips: Sophia | Chip button | Shows only Sophia threads | Always has at least welcome thread |
| 7 | Filter chips: Sessions | Chip button | Shows only session threads | Empty filter → "No session threads" |
| 8 | Filter chips: Applications | Chip button | Shows only application threads | Empty filter → "No application threads" |
| 9 | Thread entry — avatar | 40px circular | Visual identity | Sophia: cyan ring. Session: calendar overlay. Application: briefcase overlay |
| 10 | Thread entry — name | Text | Thread title | Truncated if long |
| 11 | Thread entry — preview | Text, 1 line | Last message preview | Truncated with ellipsis |
| 12 | Thread entry — timestamp | Relative text | "2m", "1h", "Yesterday" | None |
| 13 | Thread entry — unread dot | 8px lime dot, left edge | Visible on unread threads | Cleared when thread is selected |
| 14 | Thread entry — click | Full row clickable | Selects thread, loads in panel 2 | Cross-fade message area + context panel |
| 15 | Thread entry — pin icon | Small icon on pinned threads | Visual indicator only (pin/unpin in thread header) | None |
| 16 | Sophia thread — shimmer border | 1px animated gradient | Subtle visual distinction | Performance: CSS animation, not JS |
| 17 | Pinned thread sort | Pinned at top of list | Above regular sort | None |

### Screen 2: Active Thread Panel (flex, center)

**Header (56px):**

| # | Element | Type | Behavior | Dead-End Risk |
|---|---------|------|----------|---------------|
| 18 | Participant avatar + name | Display | Shows who this thread is with | Group: shows multiple avatars |
| 19 | Thread type badge | Subtle label | "Session" / "Application" / "Group" / none for DM | None |
| 20 | Pin button | Icon toggle | Pins/unpins the thread; pinned threads sort to top of list | Toast confirmation |
| 21 | Search within thread | Icon button | Opens inline search bar within messages | No results → "No messages match" |
| 22 | Video call button | Icon button | **Deferred:** opens Sophia with "I'd like to start a video call with [name]" | NOT a dead end — Sophia handles it |
| 23 | More menu button | Icon → dropdown | Opens dropdown with: Mute, Archive, Mark Unread | Each action → toast confirmation |
| 24 | More menu — Mute | Dropdown item | Toggles mute state, toast "Thread muted" | None |
| 25 | More menu — Archive | Dropdown item | Removes from list, toast "Thread archived" | None |
| 26 | More menu — Mark Unread | Dropdown item | Adds unread dot back, toast "Marked as unread" | None |
| 27 | Sophia Summary button | Text button, visible on threads with 20+ messages | Expands/collapses summary card at top of messages | Toggle state |

**Message Area:**

| # | Element | Type | Behavior | Dead-End Risk |
|---|---------|------|----------|---------------|
| 28 | Message list container | Scrollable, bottom-anchored | Newest at bottom, auto-scroll on new message | role="list" for accessibility |
| 29 | Sent message bubble | Glass bubble, right-aligned | User's messages | role="listitem" |
| 30 | Received message bubble | Glass bubble, left-aligned | Other participant's messages | role="listitem" |
| 31 | Sophia message bubble | Cyan-tinted glass, cyan left border, avatar visible | Sophia's distinct treatment | role="listitem" |
| 32 | Text message | Rendered text | Supports bold, italic, links | Links clickable |
| 33 | File message | Glass card | File type icon, name, size, download button | Download button → toast "Downloading..." |
| 34 | Image message | Inline render | Click → lightbox overlay | Lightbox has close button |
| 35 | Voice note | Waveform pill | Play button, duration label | Play toggles play/pause, simulated |
| 36 | Video message | Thumbnail + play overlay | Duration badge | Play → toast "Playing video..." |
| 37 | Link preview | Card | Favicon, title, description, thumbnail | Click → window.open (simulated) |
| 38 | Session card | Styled card | Participant avatars, date/time, timezone, status badge | Status: Upcoming/In Progress/Completed |
| 39 | Session card — [Join Call] | Button on session card | **Deferred video:** opens Sophia "I'd like to join the call with [name]" | NOT a dead end |
| 40 | Read receipt | "Seen" text below last sent | Grey text | None |
| 41 | Typing indicator | Glass pill, 3 dots | Sequential pulse (150ms offset), lime for Sophia, white for humans | aria-live="polite" |
| 42 | "↓ New messages" pill | Floating pill at top of message area | Visible when user scrolled up and new message arrives; click → smooth-scroll to bottom | None |
| 43 | Group message — sender name | Text above bubble | Shows who sent in group threads | None |

**Input Area (64px):**

| # | Element | Type | Behavior | Dead-End Risk |
|---|---------|------|----------|---------------|
| 44 | Text input | Glass bar, expandable | Placeholder: "Type a message...", expands to 4 lines max | None |
| 45 | Attachment button | Icon, left of input | Opens attachment menu (mock): File, Image, Voice | Each option → toast "Attachment selected" |
| 46 | Send button | Icon, right of input | Lime fill when content, glass when empty; sends message on click | Scale pulse animation 1.0→1.1→1.0 |
| 47 | Enter key | Keyboard | Sends message (Shift+Enter for newline) | None |
| 48 | Smart reply chips | Horizontal strip above input | 2-3 contextual options; tap sends immediately | Stagger-in animation, fade out on manual type |

### Screen 3: Context Panel (280px, right, collapsible)

| # | Element | Type | Behavior | Dead-End Risk |
|---|---------|------|----------|---------------|
| 49 | Collapse/expand toggle | Button on left edge | Hides/shows panel; thread area expands to fill | Smooth transition |
| 50 | **Mentor DM:** Profile card | Avatar, name, specialties, rating | Display | None |
| 51 | **Mentor DM:** "Your connection" | Text | "Specializes in [X] — your target role" | None |
| 52 | **Mentor DM:** Shared files | List | Files shared in this thread | Empty → "No files shared yet" |
| 53 | **Mentor DM:** Pinned messages | List | Pinned messages in this thread | Empty → "No pinned messages" |
| 54 | **Mentor DM:** Session history | List | Past sessions with this person | Empty → "No sessions yet" |
| 55 | **Mentor DM:** "Book a session" | Button | → Sophia "I'd like to book a session with [name]" (Session surface not built) | NOT a dead end |
| 56 | **Mentor DM:** "View their profile" | Button | → Sophia "Show me [name]'s full mentor profile" | NOT a dead end |
| 57 | **Employer DM:** Company card | Logo, name, role applied for | Display | None |
| 58 | **Employer DM:** Application status | Badge | Applied → Viewed → Interviewing → etc. | Display only |
| 59 | **Employer DM:** Job match % | Display | From EdgeMatch | Display only |
| 60 | **Employer DM:** "View job listing" | Button | → onNavigate("jobs") | Cross-surface navigation |
| 61 | **Employer DM:** "Optimize resume" | Button | → onNavigate("resume") | Cross-surface navigation |
| 62 | **Sophia:** Conversation topics | Tags | Auto-tagged: "Resume", "Interview Prep", "Roadmap" | None |
| 63 | **Sophia:** Thread summary | Text | Auto-generated summary | None |
| 64 | **Sophia:** Related surfaces | Links | EdgePath, ResumeEdge, EdgeMatch based on content | Each link → onNavigate(surface) |
| 65 | **Group:** Member list | Avatars + names | All group members | None |
| 66 | **Group:** Group description | Text | Purpose of group | None |
| 67 | **Group:** Shared files | List | Files shared in group | Empty → "No files shared" |
| 68 | **Group:** Pinned messages | List | Pinned in group | Empty → "No pinned messages" |
| 69 | **Session thread:** Session details | Card | Same as session card in messages | None |
| 70 | **Session thread:** Prep brief | Text | Sophia's prep notes | None |
| 71 | **Application thread:** Application card | Card | Status, company, role | None |

### Screen 4: Thread Summary Card (expandable at top of messages)

| # | Element | Type | Behavior | Dead-End Risk |
|---|---------|------|----------|---------------|
| 72 | Summary header | "Thread Summary" + timestamp | Display | None |
| 73 | Summary text | Sophia-generated paragraph | Display | None |
| 74 | Dismiss button | X or "Dismiss" | Hides card, button in header re-appears | None |

### Screen 5: Empty States

| # | State | What Shows | Dead-End Risk |
|---|-------|-----------|---------------|
| 75 | Day 0 (new user) | Sophia welcome thread in list, auto-selected | Always 1 thread |
| 76 | Empty filter result | "No [type] conversations yet" + Sophia suggestion | CTA chip to relevant surface |
| 77 | Empty search result | "No conversations match '[query]'" | Clear search button |
| 78 | Empty context panel section | "No [files/pins/sessions] yet" | Informational, not dead end |

---

## VALIDATION PASS 2: Engineering — State, Navigation, Data

### State Management

| State | Type | Scope | Notes |
|-------|------|-------|-------|
| selectedThreadId | string | MessagingLayout | Controls which thread is active |
| searchQuery | string | ConversationList | Filters threads client-side |
| activeFilter | enum | ConversationList | All/Direct/Groups/Sophia/Sessions/Applications |
| contextPanelOpen | boolean | MessagingLayout | Toggle for right panel |
| messageInputText | string | ActiveThread | Current input value |
| typingIndicatorVisible | boolean | ActiveThread | Shows during simulated response delay |
| threadSummaryExpanded | boolean | ActiveThread | Per-thread toggle |
| moreMenuOpen | boolean | ActiveThread | Header dropdown |
| threads | Thread[] | MessagingLayout | Mock data, mutable for new messages |
| lightboxImage | string \| null | ActiveThread | Currently expanded image |
| attachmentMenuOpen | boolean | ActiveThread | Attachment picker |

### Navigation Map

| From | Action | To | Method |
|------|--------|-----|--------|
| Any dashboard | Click "Messages" pill | Messaging surface | onNavigate("messages") in RoleShell |
| Notification panel | Click message notification | Messaging surface | onNavigate("messages") — note: can't deep-link to specific thread yet |
| Messaging context panel | "View job listing" | EdgeMatch | onNavigate("jobs") |
| Messaging context panel | "Optimize resume" | ResumeEdge | onNavigate("resume") |
| Messaging context panel | "Book a session" | Sophia | Opens Sophia overlay |
| Messaging Sophia thread chips | "Browse roles" | EdgeMatch | onNavigate("jobs") |
| Messaging Sophia thread chips | "Continue roadmap" | EdgePath | onNavigate("edgepath") |
| Messaging Sophia thread chips | "Find a mentor" | Sophia | Opens Sophia overlay (Session/Booking not built) |

### Mock Data Shape

```typescript
interface Thread {
  id: string;
  type: "dm" | "group" | "sophia" | "session" | "application";
  title: string;
  participants: Participant[];
  messages: Message[];
  unread: boolean;
  pinned: boolean;
  lastMessageTime: string;
  // Type-specific
  sessionDetails?: SessionDetails;
  applicationDetails?: ApplicationDetails;
  groupDetails?: GroupDetails;
}

interface Message {
  id: string;
  senderId: string;
  type: "text" | "file" | "image" | "voice" | "video" | "link" | "session_card" | "system";
  content: string;
  timestamp: string;
  // Type-specific
  fileDetails?: { name: string; size: string; type: string };
  imageUrl?: string;
  linkPreview?: { title: string; description: string; favicon: string; url: string };
  sessionCard?: SessionCardDetails;
}
```

### Thread Inventory Per Role

**EdgeStar (primary, fully detailed):**
1. DM — Alice Chen (mentor, Product Design Lead)
2. DM — Marcus Johnson (peer, fellow job seeker)
3. Group — "Product Design Cohort 2026" (5 members)
4. Sophia — Welcome thread ("Welcome to your inbox")
5. Sophia — Resume coaching ("Your resume needs quantified results")
6. Session — Upcoming with Alice Chen (prep brief included)
7. Session — Completed with Dr. Sarah Kim (follow-up included)
8. Application — Figma, Product Designer (employer messages, status: Interviewing)

**Other roles: lighter variants** — Same 8-thread structure, relabeled names/titles/contexts per role identity. Shared Sophia threads, different DM/group/session/application contexts.

### Performance Targets (from spec)
- Conversation list render: <300ms ✓ (static data, no API)
- Thread switch: <400ms ✓ (React state swap + crossfade)
- Message send to visual: <100ms ✓ (optimistic append)
- Video call UI load: N/A (deferred)

---

## VALIDATION PASS 3: Brand, Motion, Accessibility

### Brand Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Dark glass aesthetic | ✓ | All panels use rgba glass |
| Green/lime accents | ✓ | Unread dots (#B3FF3B), send button, smart reply chips |
| Cyan for Sophia | ✓ | Sophia bubbles rgba(34,211,238,0.08), cyan border, cyan ring on avatar |
| Urbanist + Satoshi | ✓ | font-display for labels, font-body for messages |
| No reduced opacity for hierarchy | ✓ | Text hierarchy: #E8E8ED / #9CA3AF / #6B7280 / #374151 |
| Icons attached to text | ✓ | Thread type badges, file icons, attachment icons |
| Sophia as person not tool | ✓ | Sophia threads in same list as human threads |
| "International career mobility" not "immigration" | ✓ | No immigration language in mock data |
| AI augments not replaces | ✓ | Sophia suggests, doesn't auto-send |

### Motion Checklist

| Animation | Timing | Easing | Notes |
|-----------|--------|--------|-------|
| Message send | 200ms | ease-out | scale 0.95→1.0, fade in, slide up |
| Send button pulse | 200ms | ease-out | scale 1.0→1.1→1.0 |
| Message receive | 250ms | ease-out | slide from left |
| New messages pill | 300ms | spring | slides down from top |
| Typing indicator dots | 300ms cycle | ease-in-out | 100ms offset between dots |
| Thread selection border | 150ms | ease-out | lime left border slides in |
| Thread crossfade | 200ms | ease-out | message area + context panel |
| Smart reply appear | 200ms each, 50ms stagger | ease-out | stagger from left |
| Smart reply disappear | 150ms | ease-out | all fade simultaneously |
| Context panel toggle | 200ms | ease-out | slide left/right |

### Accessibility Checklist

| Element | ARIA | Notes |
|---------|------|-------|
| Message list | role="list" | Container |
| Message bubble | role="listitem" | Each message |
| Screen reader | "[Sender] said: [content], [time]" | aria-label on each message |
| Typing indicator | aria-live="polite" | "[Name] is typing" |
| Smart replies | aria-label="Suggested replies" | Region label |
| Smart reply chip | button with label | Each chip |
| Video call controls | aria-label per button | Deferred |
| Search | role="search" | Container |
| Filter chips | role="tablist" + role="tab" | Filter group |
| Thread list | role="listbox" | Selectable list |
| Thread entry | role="option" + aria-selected | Each thread |

---

## CROSS-SURFACE INTEGRATION CHECKLIST

### Changes to Other Components

| Component | Change | Why |
|-----------|--------|-----|
| `role-shell.tsx` | Add `noPadding` prop to remove px-6 and pb-20 from main | Messaging needs full-bleed layout |
| `App.tsx` | Replace messaging placeholder with `<Messaging role={activeRole} onNavigate={handleNavigate} />` | Wire the surface |
| `App.tsx` | Add `analytics` to Surface type for future | Prep for EdgeSight |

### Sophia Bar Override on Messaging

When on the Messaging surface, the Sophia bottom bar should show messaging-specific context:
- Message: "3 unread conversations" (or whatever is true)
- Chips: "Open EdgePath" / "Check your resume score"

This uses the existing `sophiaOverride` prop on RoleShell.

---

## FINAL CHECKLIST: ZERO DEAD ENDS

Every interactive element in the Messaging surface has one of:
1. A functional handler that changes visible state
2. A navigation to another surface via onNavigate
3. A Sophia fallback for features not yet built (Session/Booking, Video)
4. A toast notification for state changes (mute, archive, pin)

**Count:** 78 affordances identified, 0 dead ends.

---

## BUILD ORDER

1. Add `noPadding` prop to RoleShell
2. Create `/src/app/components/messaging.tsx` with all components and mock data
3. Update `App.tsx` to render Messaging with role prop
4. Validate every button/click works
