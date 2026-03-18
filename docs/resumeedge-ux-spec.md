# Surface 5: ResumeEdge — UX Spec

Before writing code. Using the 7-point framework.

---

## 1. The Job

**"Make my resume competitive for the roles I'm targeting — without me becoming a resume expert."**

Not "upload my resume." Not "use the AI resume tool." The user doesn't care about the tool. They care about the outcome: a resume that gets them interviews. Sophia's intelligence is the value — the surface is the delivery mechanism.

**The trust equation:** This is the ONLY surface where Sophia edits the user's own work. On EdgePath, she generates from scratch. On EdgeMatch, she recommends. Here, she touches something the user already wrote. That changes the dynamic from "show me what you built" to "show me what you changed about what I built." The UX must make the user feel IN CONTROL of their own document while benefiting from AI intelligence.


---

## 2. The States

### Empty (Day 0 — no resume uploaded)

The user clicked "ResumeEdge" from the nav. No resume exists in the system.

**What should happen:** NOT a file upload widget sitting alone on a page. Sophia meets them with two paths:

1. **"I have a resume"** → Upload flow (drag-drop or file picker). Sophia immediately parses it and shows what she found: name, current role, years of experience, key skills extracted. This instant parsing is the first trust moment — "she actually read it."

2. **"I need to build one"** → Sophia-guided creation. Step by step: contact info → experience (she asks "What did you do at [company]?" and generates bullet points from conversational input) → skills → education. The output is a formatted resume the user never had to "write."

**Why two paths matter:** The PRD says resume upload is part of onboarding (Option A). But many EdgeStar users — especially younger ones, career changers, or EdgePreneur users — don't HAVE a resume. "Upload your resume" as the only entry point is a dead end for ~30% of the audience. Sophia building it from conversation is the value prop for those users.

**Sophia's tone (empty state):** Direct. "Let's get your resume working for you. Got one already, or want to build from scratch?" No preamble.

### Active (resume uploaded/created, primary use state)

This is the daily driver. The user has a resume in the system and is optimizing it.

**The core layout — what the user sees:**

Two-column. Left: the resume document (real preview, not a form). Right: Sophia's analysis and controls.

**Left column — The Document:**
- Full resume rendered as it would appear on paper (A4/Letter proportions inside a glass card)
- Sections are interactive — click a section (Experience, Skills, Summary) to select it
- Selected sections show a subtle lime highlight border
- This is NOT a text editor. The user reads their resume here. Edits happen through Sophia or through an edit mode toggle.

**Right column — Sophia's Intelligence Panel:**
- **Score card** at the top. Overall score (0-100) with a breakdown:
  - ATS Compatibility (does it parse correctly?)
  - Keyword Match (against target roles from EdgePath)
  - Impact Language (are bullets achievement-oriented?)
  - Formatting & Structure
  - Each sub-score has a small gauge arc (reusing the dashboard gauge pattern)
  - The overall score is NOT a vanity metric. It's calibrated against the user's target roles from EdgePath. "78/100 for Product Designer roles" — specific, not generic.

- **Section-by-section analysis** below the score. Each resume section gets a verdict:
  - ✓ Strong (green text, not reduced opacity — use #22C55E)
  - △ Could improve (amber — #F59E0B)
  - ✕ Needs attention (red — #EF4444)
  - Clicking a section verdict scrolls the left column to that section AND expands Sophia's specific suggestions

- **Sophia's suggestions** for the selected section:
  - Each suggestion is a glass card with: what to change, why, and a preview of the change
  - "Accept" and "Dismiss" actions per suggestion
  - "Accept All" for users who trust Sophia and want speed
  - Accepted changes apply to the document preview in real-time with a brief lime flash on the changed text

**The "Accept All vs. Review Each" tension — resolved:**

Two modes, toggled by a pill switch at the top of the right column:
- **Review Mode** (default): Sophia shows suggestions one section at a time. User accepts/dismisses each. Slower, higher trust.
- **Quick Optimize**: Sophia applies all suggestions at once. The left column shows a full diff view (before/after) with changed text highlighted. User can undo individual changes. Faster, power-user path.

Neither mode is "wrong." Review mode is the default because first-time users need to build trust. But after the third optimization session, Sophia might suggest: "Want to try Quick Optimize? You've accepted 94% of my suggestions so far."

### Optimizing (AI processing state — 10-30 seconds)

This happens when the user triggers analysis (upload, or "Optimize for [role]").

**NOT a spinner. NOT a progress bar.** Instead:

The score card shows each sub-score filling in sequentially:
1. "Parsing structure..." → Formatting & Structure score appears (2s)
2. "Scanning 400+ keywords for Product Designer..." → Keyword Match score appears (3s)
3. "Analyzing impact language..." → Impact Language score appears (3s)
4. "Checking ATS compatibility..." → ATS score appears (2s)
5. Overall score calculates and displays with the gauge animation

Each step gives the user something to read while waiting. It communicates intelligence, not delay. This is the same pattern as EdgePath's loading state (sequential phase fill-in) — consistent across surfaces.

Sophia's bottom bar during processing: "Reading your resume against 23 Product Designer listings in your area..." — specific context, not generic "Optimizing..."

### Multi-Target (optimizing for multiple roles)

The user's EdgePath might target "Product Designer" but they're also exploring "UX Researcher." Different roles need different keyword emphasis.

**How it works:**
- A "Target Role" selector above the score card. Pulls from EdgePath target roles automatically.
- Switching targets re-runs the analysis. Scores change. Suggestions change. The resume is the same — the optimization lens changes.
- "Save as version" creates a named variant: "Resume — Product Designer" / "Resume — UX Researcher"
- Versions are accessible from a dropdown in the document header
- Sophia connects this to EdgePath: "Your Phase 2 milestone includes 'Tailor resume for UX Research.' Want to create that version now?"

### Cover Letter (adjacent flow, same surface)

NOT a separate page. A tab or toggle within ResumeEdge: "Resume" | "Cover Letter"

When the user switches to Cover Letter:
- Left column shows the cover letter document (or empty state if none exists)
- Right column: Sophia asks for context — "Which role is this for?" (pulls from saved jobs in EdgeMatch) and "Anything specific you want to highlight?"
- Sophia generates a cover letter from: resume data + job description + user's highlight input
- Same review/edit model as the resume — suggestions, accept/dismiss

### Dense (power user, multiple versions + cover letters)

- Document switcher at the top: dropdown showing all resume versions + cover letters
- "Compare" action: side-by-side view of two versions (useful for A/B testing which resume gets more callbacks)
- Sophia tracks which version was sent to which application (via EdgeMatch integration): "Your UX Research version got 2 callbacks vs. 0 for the general version. Want to update your default?"

### Error States

- **Upload failure:** "I couldn't read that file. Try PDF, DOCX, or TXT." Not a generic error — specific format guidance.
- **Parse failure (unusual format):** Sophia shows what she COULD extract with gaps highlighted: "I found your experience and education, but couldn't parse your skills section. Want to add those manually?"
- **Optimization timeout:** "Still working on this — your resume has more experience than most. Give me another 10 seconds." (Acknowledge the delay, explain why, give a timeline.)

### Loading (initial page load, not AI processing)

- Document preview skeleton (gray blocks in A4 layout shape) loads immediately
- Score card shows empty gauges
- Sophia's panel shows "Loading your resume..." with her mark
- Everything fills in within 1-2 seconds from cached data

---

## 3. Navigation In/Out

### How users GET here
- **From top nav:** "ResumeEdge" pill in the navigation bar
- **From EdgePath:** Phase milestone "Optimize resume for target role" links directly here with the target role pre-selected
- **From EdgeMatch:** "Optimize for this job" on a job detail panel opens ResumeEdge with that job's requirements as the target
- **From Dashboard:** "Resume Score" KPI card links here. Resume-related Sophia insight ("Your resume hasn't been updated in 2 weeks") links here.
- **From Sophia:** "Optimize my resume" / "Check my resume score" / "Build a cover letter"

### How users LEAVE
- **To EdgeMatch:** "See jobs matching this resume" chip after optimization
- **To EdgePath:** "Back to roadmap" if they arrived from a milestone
- **To export:** Download PDF/DOCX (stays on page, file downloads)
- **Normal nav:** Click any other nav item

### Top nav state
- "ResumeEdge" pill is active/highlighted
- All other nav items remain accessible

### Sophia's bottom bar on this surface
- Idle: "Ask me to optimize a section, compare versions, or build a cover letter."
- After upload: "I've read your resume. Want me to score it against your target roles?"
- After optimization: "Your resume scored 84 for Product Designer. Want to try a different target?"
- Contextual: "You have 3 saved jobs you haven't tailored for yet." (pulls from EdgeMatch)

---

## 4. Friction Points

### Where the user will hesitate

1. **"Should I accept this change?"** — The #1 friction point. Every AI suggestion requires a trust decision. Mitigation: Show the WHY alongside the WHAT. Not just "Change 'Managed a team' to 'Led cross-functional team of 8 engineers'" but also "86% of Product Designer listings mention cross-functional leadership. This makes your experience match." Evidence-based suggestions reduce hesitation.

2. **"Is this actually MY resume anymore?"** — After accepting 20 suggestions, the user might feel disconnected from their own document. Mitigation: Always preserve the user's voice. Sophia's suggestions should enhance phrasing, not rewrite personality. And the "Original" version is always preserved — one click to compare or revert.

3. **"Which version should I send?"** — Multiple versions create decision paralysis. Mitigation: Sophia recommends. "For this Figma posting, your Product Designer version is the best match (91%). Send that one." Don't make the user decide — let them confirm.

4. **"How do I know the score is real?"** — A score without context is meaningless. Mitigation: The score is always relative to a target. "78/100 for Product Designer" means something. And each sub-score links to the specific evidence (which keywords are missing, which bullets lack impact verbs).

### Where cognitive load is highest

- The moment after first upload, when the user sees the score AND the suggestions AND the document simultaneously. Three new information channels at once. Mitigation: Sequential reveal. Show the document first (1s). Then the score (2s). Then "Want to see suggestions?" as a Sophia prompt — don't dump everything at once.

---

## 5. Sophia's Role — Specific to This Surface

Sophia is NOT a "resume optimizer button." She's a resume COACH who happens to have AI capabilities.

**What she does here:**

1. **Reads and understands** — "You have 6 years of experience, mostly in frontend development. Your strongest section is your project descriptions. Your weakest is your summary — it's generic."

2. **Connects to the bigger picture** — "Your EdgePath target is Product Design Lead. Your resume doesn't mention any design management experience. But your project at [Company] where you led 3 designers? That counts. Let me help you frame it."

3. **Explains her reasoning** — Every suggestion has a "why." Not just NLP output — human-readable reasoning. "I'm suggesting 'Increased conversion by 34%' instead of 'Improved website performance' because 23 of your target job listings mention measurable outcomes."

4. **Tracks results over time** — "Since we optimized your resume 2 weeks ago, you've had 3 callbacks. That's up from 0 in the prior month. The keyword changes seem to be working."

5. **Proactive nudges** — Sophia doesn't wait to be asked. "You saved 4 new jobs this week but haven't updated your resume for them. Two of them emphasize 'systems thinking' — want me to add that?"

**Sophia's tone on this surface:** More coach than assistant. Direct but encouraging. "Your experience section is strong. Let's make it land harder." Not "Great resume!" (performative) and not "Your resume needs significant improvement" (deflating).

---

## 6. The Delight Moment

**The first score reveal.**

The user uploads their resume. They've probably been told "your resume needs work" by well-meaning friends, or they've never had anyone actually evaluate it. The sequential score reveal — parsing, scanning, analyzing — builds anticipation. Then: "82/100 for Product Designer."

That's the moment. A specific, credible number tied to THEIR target role. Not a generic "your resume is good." A number that says "you're 82% of the way there, and I know exactly how to close the gap."

If the score is low (below 60), Sophia reframes: "You're at 47 right now. That's normal for a career changer — your experience is strong but the framing needs work. I can get you to 75+ in about 10 minutes." Not a judgment — a starting point with a clear path forward.

**Secondary delight:** Accepting a suggestion and watching the score tick UP in real-time. Each accepted change moves the gauge. The user is literally watching their resume get better. Progress as delight.

---

## 7. Reference Check — Behavioral, Not Visual

| Reference | What applies here | How |
|---|---|---|
| **Grammarly** | Inline annotation model. Score with breakdown. Section-by-section analysis. | ResumeEdge's right panel IS Grammarly's sidebar — score + suggestions — but contextual to career targets, not grammar rules. |
| **Notion AI** | Inline rewrite that replaces content in place. | Accepted suggestions apply directly to the document preview. No separate "output" panel. The result IS the document. |
| **Google Docs Suggestions** | Accept/reject per change with green/red highlighting. | Our accept/dismiss per suggestion mirrors this. But we add the WHY — Google Docs doesn't explain its suggestions. |
| **Figma Version History** | Named versions, side-by-side compare, revert to any point. | Resume versions follow this pattern. "Resume — Product Designer v3" with compare and revert. |
| **Cursor** | AI that operates on YOUR code with explanations. | Sophia operates on the user's resume with explanations. The trust model is identical: "I changed this because..." |

**What none of these references have:** Score calibrated against a target. Grammarly scores against grammar rules. We score against specific job targets. That's the differentiator. The resume isn't generically "good" — it's good FOR something.

---

## 8. Multi-Role Considerations

ResumeEdge is primarily an **EdgeStar** surface. But thinking in systems:

| Role | How they interact with ResumeEdge | Surface adaptation |
|---|---|---|
| **EdgeStar** | Primary user. Uploads, optimizes, manages versions, generates cover letters. Full feature set. | Full surface as described above. |
| **EdgePreneur** | May use it for business-related documents (pitch deck bios, founder profiles). Lower frequency. | Same surface, but Sophia's optimization targets shift from "job listings" to "investor expectations" and "startup role descriptions." |
| **EdgeGuide (Coach/Mentor)** | Reviews client resumes. Read-only view of the client's resume with ability to leave feedback. | A "Review Mode" variant: same left-column document view, but right column shows coach's annotation tools instead of AI suggestions. Coach can highlight sections and leave voice/text notes. |
| **EdgeParent** | Might want to view their child's resume progress. Read-only. | Minimal variant: document preview only, with Sophia's score visible. No edit capabilities. "Jamie's resume scores 78 for Software Engineer roles." |
| **EdgeEducation** | Tracks resume completion rates across students. Aggregate view. | Not individual ResumeEdge — this is an EdgeSight/Analytics data point. "234 of 500 students have completed resume optimization." |
| **EdgeEmployer** | Not directly relevant — they see resumes through the application pipeline, not ResumeEdge. | N/A for this surface. |

---

## 9. Component Extraction Potential

New components this surface produces for the design system:

1. **Document Preview Card** — A4-proportioned glass card rendering formatted document content. Reusable for cover letters, Interactive Resume, EdgeWorkplace templates.
2. **Score Gauge with Breakdown** — Overall score + sub-score gauges. Extends the dashboard gauge pattern. Reusable for Interview Simulator scores, EdgePath phase scores.
3. **AI Suggestion Card** — Glass card with: original text, suggested text, reason, accept/dismiss actions. Reusable for any AI-edit surface (Interview Simulator feedback, EdgePreneur pitch deck suggestions).
4. **Diff View** — Side-by-side or inline comparison of two text versions. Reusable for document versioning anywhere.
5. **Sequential Processing State** — Phased loading animation showing each analysis step. Already used in EdgePath, formalized here.
6. **File Upload Zone** — Drag-drop + file picker with parse confirmation. Reusable for document uploads anywhere.
7. **Version Selector** — Dropdown with named versions, star-for-default, compare action. Reusable for any multi-version content.

---

## Resolved Decisions

### 1. Score Calibration: Relative, Sophia-Explained

You're right — Sophia IS the explanation layer. The score is **relative**: "Your resume ranks in the top 22% of resumes targeting Product Designer roles in your area." Not just a number, but a position.

**How the AI handles relative scoring:**

The LLM (Gemini/Claude on the backend) evaluates the resume against a structured rubric derived from:
- **Job description analysis:** Extract the top 15-20 requirements/keywords from active listings matching the target role (pulled from EdgeMatch data + public job APIs)
- **Role benchmarking:** Compare the resume's structure, keyword density, and impact language against best practices for that specific role — not a generic resume rubric
- **Market context:** Factor in the user's location, experience level, and industry norms

The score output is a composite: "78/100 means your resume matches 78% of what employers in Product Design are looking for right now. You're missing systems design terminology and your summary doesn't mention design leadership — those are in 89% of listings."

Sophia contextualizes this naturally: "You're ahead of most people at your experience level. The gap is mostly in how you frame your leadership experience, not in what you've done." The relative framing makes the score feel credible because it's grounded in real market data, not abstract rules.

**Why this works better than absolute:** An absolute 78/100 is meaningless — against what standard? A relative "top 22%" tells the user exactly where they stand. And Sophia explaining the specific gaps ("missing systems design terminology") makes it actionable, not just a number.

### 2. Build from Scratch: Quick Start, Then Optimize

Option A confirmed. Sophia asks 4-5 targeted questions (current role, target role, years of experience, 2-3 key achievements) and generates a first-draft resume in under 3 minutes. This becomes the starting document. The user then enters the normal Active state and optimizes section by section.

The build flow uses the same Sophia conversational pattern from onboarding — familiar, not a new interaction to learn. And voice mode (see Section 11) makes this even faster: "Tell me about your last job" → Sophia listens, generates bullets.

### 3. Interactive Resume: A Mode Within ResumeEdge

Here's what "Interactive Resume" means: instead of a static PDF, the user gets a **shareable web page** — a personal URL (e.g., `careeredge.com/r/jordan-kim`) that renders their resume as a live, designed web page. Think of it like a Linktree for your career: it shows your resume content but styled with CareerEdge's design system, with clickable sections, links to portfolio items, and optionally a "Book a meeting" CTA (connecting to Session/Booking).

**Why it lives inside ResumeEdge:** It's the same content, different output format. The user's resume data is the source of truth. The Interactive Resume is a *view* of that data, not a separate document to maintain. Adding a third tab — **Resume | Cover Letter | Interactive** — keeps it unified.

The Interactive tab shows:
- A live preview of the web resume on the left (same two-column layout)
- Right column: customization controls (color accent, layout style, which sections to show/hide, custom URL slug, visibility toggle — public/private/link-only)
- "Share" button generates the link
- Sophia's role here: "Your Interactive Resume has been viewed 12 times this week. 3 viewers clicked through to your portfolio." — analytics on the shared page.

This becomes a powerful EdgeGuide tool too — coaches can say "Share your Interactive Resume with me" instead of asking for a file.

### 4. EdgeGuide Review Flow: In Scope

See new Section 10 below.

### 5. Voice Mode: Everywhere Sophia Appears

See new Section 11 below.

---

## 10. EdgeGuide Review Mode

When an EdgeGuide (coach/mentor) opens a client's resume through their client management panel, they see a modified version of ResumeEdge:

### Layout (same two-column, different right panel)

**Left column — The Document (read-only):**
- Same A4 glass card rendering as the EdgeStar view
- Sections are clickable — but instead of triggering AI suggestions, clicking a section opens an annotation input
- The coach sees the resume EXACTLY as the client sees it, including the current score

**Right column — Coach Review Panel:**
- **Client context card** at top: client name, their EdgePath target role, current resume score, last optimization date. This gives the coach situational awareness without having to ask.
- **Score breakdown** (read-only): the same gauges the client sees. The coach understands the AI's assessment before adding their own.
- **Annotation thread** per section: each resume section has a collapsible thread where the coach can:
  - Leave text feedback (typed or voice-to-text via Sophia voice)
  - Highlight specific phrases in the document (click-and-drag highlight on the left column, lime border appears, annotation attaches to that highlight)
  - Rate the section: Strong / Needs Work / Priority Fix (maps to the same ✓ / △ / ✕ system but from the coach's perspective)
  - Attach a resource: "Watch this video on writing impact bullets" — links from the coach's resource library
- **Summary card** at the bottom: once the coach finishes reviewing, they write (or voice-record) an overall summary. This becomes the top item the client sees when they return to their resume: "Your coach left feedback on 4 sections."

### How the client receives feedback

When the EdgeStar opens ResumeEdge after a coach review:
- A banner at the top: "Alex (your EdgeGuide) reviewed your resume. 4 annotations." — with the coach's avatar
- Each annotated section shows a small coach badge icon next to the section verdict
- Clicking the badge opens the coach's annotation inline — alongside Sophia's AI suggestions. The client sees BOTH perspectives: AI and human.
- Coach annotations and AI suggestions are visually distinct: coach annotations use the EdgeGuide accent color (distinct from Sophia's lime), AI suggestions use the standard glass card style

### Why this matters

Most career coaching is: "Send me your resume, I'll mark it up in Word, send it back." That's 3 roundtrips, 2 days, and the feedback is locked in a file. ResumeEdge makes coaching feedback LIVE inside the same surface where the client optimizes. The coach and AI work together — the coach provides human judgment ("This doesn't sound like you"), Sophia provides market intelligence ("This keyword appears in 89% of listings"). Neither replaces the other.

### Sophia's role for EdgeGuide on this surface

Sophia assists the COACH, not just the client:
- "Jordan hasn't updated their resume in 3 weeks. Their Phase 2 milestone is due Friday."
- "This client's summary section scores low on impact language. Here are 3 examples from similar roles you could reference."
- "You've reviewed 4 client resumes this week. Want to send a group tip about summary sections? 3 of 4 had the same issue."

---

## 11. Sophia Voice Mode — ResumeEdge Integration

Voice is not a separate feature — it's an input modality available everywhere Sophia appears. On ResumeEdge, voice is particularly powerful because resume content is inherently conversational ("Tell me what you did").

### Voice UI Pattern (consistent across all surfaces)

**The microphone affordance:**
- In Sophia's float card and panel input bar: a mic icon sits to the right of the text input, before the send button
- Tapping mic: the input bar transforms — text field dims, a pulsing lime waveform visualization replaces the placeholder text, indicating active listening
- The waveform is subtle (low amplitude oscillation, ~20px tall) — not a dramatic audio visualizer. It says "I'm listening" without dominating the surface
- Speaking: real-time transcription appears in the input field as the user speaks
- Pause detection (1.5s silence): Sophia auto-sends the transcribed message, same as pressing send
- Cancel: tap the mic icon again (now showing a stop icon) or tap anywhere outside the input bar

**Visual states:**
1. **Idle:** Mic icon, standard opacity
2. **Listening:** Mic icon pulses lime, waveform in input bar, "Listening..." label
3. **Processing:** Waveform freezes, transcribed text visible, Sophia's thinking indicator appears
4. **Response:** Normal Sophia response flow — text appears in the conversation, suggestions render as usual

### ResumeEdge-Specific Voice Scenarios

**Build from scratch (empty state):**
- User taps "Build from scratch" → Sophia asks "What's your current role?"
- User can TYPE or tap the mic and SAY "I'm a frontend developer at a startup"
- Sophia responds: "Got it. Tell me about your biggest project there."
- User speaks for 30-60 seconds about their project
- Sophia generates 3-4 resume bullet points from the spoken narrative
- User reviews, accepts/edits, moves to next section
- This is MUCH faster than typing resume bullets. Voice turns a 30-minute writing task into a 10-minute conversation.

**Section optimization (active state):**
- User selects the Experience section → taps mic
- "Hey Sophia, I forgot to mention that I also managed the design system migration. Can you add that?"
- Sophia: "I'll add a bullet about the design system migration. How many components were involved, and what was the impact?"
- User speaks the details → Sophia generates the bullet with quantified impact
- New bullet appears in the document preview with the lime flash

**Coach review (EdgeGuide mode):**
- Coach selects a section → taps mic → speaks their annotation
- Voice-to-text generates the written annotation automatically
- Coach can review/edit before posting, or auto-post on send
- Faster than typing feedback for each of 6+ sections

### Voice Across All Sophia Surfaces (standing rule)

This voice pattern — mic in input bar, waveform visualization, real-time transcription, pause-to-send — applies identically to:
- Sophia float card (bottom-right)
- Sophia panel (right-side expanded)
- Sophia on Dashboard
- Sophia on EdgePath
- Sophia on EdgeMatch
- Sophia on every future surface

The only thing that changes per surface is the CONTEXT Sophia uses to process the voice input. On ResumeEdge, she knows the user is talking about their resume. On EdgePath, she knows they're talking about their roadmap. The voice UX is the same everywhere — the intelligence adapts.