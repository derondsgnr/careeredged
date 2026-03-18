# Sophia System Reference

> Comprehensive handoff document covering UX model, interaction patterns, response engine architecture, action wiring, navigation mapping, content blocks, scenario coverage, and known gaps.

> **This is Part I (EdgeStar).** Part II covering all 8 user roles is in [`sophia-multi-role-system.md`](./sophia-multi-role-system.md).

---

## 1. Sophia's Role in CareerEdge

Sophia is **Camp B** AI (a layer within the product, not the product itself). She lives alongside the user's primary surfaces (Dashboard, EdgePath, Resume, Jobs, Messages) and provides contextual intelligence, task execution, and emotional support.

**She is NOT a chatbot.** She's an AI copilot with structured responses, rich content blocks, and e2e wired actions that actually do things in the app.

### Where Sophia Lives

| Touchpoint | Location | Behavior |
|---|---|---|
| **Bottom Bar** | Fixed bottom of every page | Passive intelligence layer. Shows latest insight + suggestion chips. "Ask Sophia" button opens Float. |
| **Insight Card** | Dashboard right column | Proactive recommendation card with one CTA (e.g., "Start interview prep"). Clicking opens Float with that query. |
| **Float** | Bottom-right, 400px glass card | Quick queries. 1-3 turn conversations. Compact. |
| **Panel** | Right side panel, 420px | Deep conversations. Multi-turn. Auto-escalates from Float after 3 turns or complex queries. |

### Where Sophia Does NOT Live

Everything else on the dashboard navigates to its own section via the top nav. KPI cards, roadmap strip phases, milestone rows, activity items, job cards -- none of these open Sophia. They navigate to `roadmap`, `jobs`, `resume`, `home` etc.

---

## 2. Float-to-Panel Interaction Model

### Entry Points

| Entry | What Happens |
|---|---|
| Click "Ask Sophia" on bottom bar | Opens Float (empty state with context chips) |
| Click a bottom bar suggestion chip (e.g., "View matches") | Opens Float with that query pre-sent |
| Click Sophia Insight Card CTA | Opens Float with that query pre-sent |

### Escalation Rules

Float auto-expands to Panel when:
1. User clicks the expand (Maximize2) button manually
2. Conversation reaches 3 user turns
3. Query matches a "complex" route (detected by `shouldAutoExpand()`)

Complex queries that auto-expand: resume review, interview prep, skill gap analysis, application strategy, design challenge, networking, cover letter, salary negotiation.

### De-escalation

User can minimize Panel back to Float via the Minimize2 button. Closing either surface dismisses Sophia entirely and resets conversation state.

---

## 3. The Three Chip Types

Every followup chip has one of three types. Each type has distinct visual treatment and distinct behavior when clicked.

| Type | Icon | Visual | Click Behavior |
|---|---|---|---|
| **ask** | Sparkles (cyan) | Cyan bg/border (`rgba(34,211,238,0.06)`) | Sends label as a conversational query to Sophia. Sophia responds with a new scenario. |
| **action** | Zap (lime) | Lime bg/border (`rgba(179,255,59,0.06)`) | Shows user's action as a message, then shows a green `actionDone` confirmation banner with specific detail text. Side-effects are simulated. |
| **navigate** | ExternalLink (gray) | Gray bg/border (`rgba(255,255,255,0.03)`) | Closes Sophia. Switches the top nav pill to the target surface. User lands on that section. |

### Critical Wiring

- **Navigate chips** call `onNavigate(target)` then `onClose()`. The shell receives the target and sets `activeNav` state.
- **Action chips** look up the label in `ACTION_MAP`. If found, they add the user message + an `actionDone` confirmation message to the conversation. If not found, they fall through to ask behavior.
- **Ask chips** send the label through `routeQuery()` to find a matching scenario, then display the scenario's messages.

---

## 4. Response Engine Architecture

### Query Routing

```
User input (text or chip label)
    |
    v
routeQuery(text) -- lowercases, checks ROUTE_TABLE
    |
    v
ROUTE_TABLE: array of [keywords[], scenarioId]
    - First match wins (ordered by specificity)
    - Falls through to "fallback" if no match
    |
    v
SCENARIOS[scenarioId] -- returns Message[] array
    |
    v
Messages rendered sequentially with 600ms stagger
```

### Route Categories (7 total, 55 route entries)

| Category | Route Count | Scenario IDs |
|---|---|---|
| **Resume** | 4 | `resume-review`, `resume-optimize`, `resume-format`, `resume-score-after` |
| **Interview** | 9 | `interview-prep`, `interview-figma`, `interview-behavioral`, `interview-challenge`, `interview-common-questions`, `interview-failure-story`, `interview-followups`, `interview-alt-prompt`, `interview-framework` |
| **Jobs** | 8 | `jobs-matches`, `jobs-apply`, `jobs-why-figma`, `jobs-compare`, `jobs-save`, `jobs-gaps`, `jobs-growth`, `jobs-referral-contact` |
| **Roadmap** | 4 | `roadmap-progress`, `roadmap-why-order`, `roadmap-next`, `roadmap-adjust` |
| **Strategy** | 6 | `strategy-today`, `strategy-week`, `strategy-progress`, `strategy-skip-day`, `strategy-blockers`, `strategy-benchmark` |
| **Skills** | 5 | `skills-gap`, `skills-learn`, `skills-resources`, `skills-jd-match`, `skills-time-commitment` |
| **Networking** | 6 | `network-strategy`, `network-draft-outreach`, `network-referral`, `network-recruiters`, `network-cold-tips`, `network-already-spoke` |
| **Drafting** | 11 | `draft-cover-letter`, `draft-linkedin`, `draft-thankyou`, `draft-pitch`, `draft-shorter`, `draft-personal`, `draft-warmer`, `draft-conversational`, `draft-recruiter`, `draft-timing`, `draft-customize` |
| **Salary** | 3 | `salary-info`, `salary-lowball`, `salary-benefits` |
| **Emotional** | 5 | `emotional-stuck`, `emotional-rejection`, `emotional-motivation`, `emotional-one-thing`, `emotional-different` |
| **Meta** | 1 | `meta-capabilities` |
| **Fallback** | 1 | `fallback` |

**Total: 63 route entries, 47 unique scenarios + 1 fallback = 48 scenarios.**

---

## 5. Content Block Types (11)

Each Sophia message can contain text + zero or more content blocks. Blocks render in this order:

| Block | Type Key | Data Shape | Use Case | Example |
|---|---|---|---|---|
| **Cards** | `cards` | `CardData[]` | Job matches, contacts, milestone lists | 3 job cards with match % |
| **Scorecard** | `scorecard` | `{ title, totalScore, maxTotal, scores[] }` | Resume health, career score | ATS score 72/100 with 5 sub-scores |
| **Checklist** | `checklist` | `{ title, items[] }` | Daily priorities, optimization steps | 5 toggleable checkboxes with sub-text |
| **Comparison** | `comparison` | `{ title, columns[] }` | Role comparison, format comparison | Side-by-side table with highlight column |
| **Timeline** | `timeline` | `{ title, steps[] }` | Roadmap progress, prep plans, weekly plan | Vertical timeline with done/current/upcoming states |
| **Skill Bars** | `skillBars` | `{ title, bars[] }` | Skill gap visualization | Animated bars with current vs. target markers |
| **Document** | `document` | `{ title, type, highlights[] }` | Resume annotations | Color-coded fix/warn/good highlights |
| **Draft** | `draft` | `{ title, recipientContext?, body }` | Cover letter, outreach message, pitch | Copyable text block with recipient context |
| **Resources** | `resources` | `{ title, items[] }` | Learning resources | Link list with source and type badges |
| **Metric** | `metric` | `MetricData[]` | Progress stats, salary data, projected scores | Big stat cards with trend arrows and context |
| **ActionDone** | `actionDone` | `{ message, detail? }` | Task completion confirmation | Green banner: "Resume fixes applied" |

### Block Rendering Rules

- Blocks render in the order listed above (scorecard before checklist before comparison, etc.)
- A message can have multiple blocks (e.g., `scorecard` + `document` + `followups`)
- `followups` always render last, after all other blocks
- `actionDone` renders as a green confirmation banner with CheckCircle2 icon
- Checklists are interactive -- checkboxes toggle on click

---

## 6. Navigation Map (NAV_MAP)

Maps navigate-chip labels to top nav target IDs. When a navigate chip is clicked, Sophia closes and the app navigates to this section.

| Chip Label | Nav Target |
|---|---|
| `Open EdgeMatch` | `jobs` |
| `Open EdgePath` | `roadmap` |
| `Show target JDs` | `jobs` |
| `View all saved jobs` | `jobs` |
| `See example resumes` | `resume` |
| `See the full JD` | `jobs` |
| `Show full activity log` | `home` |
| `View all 23` | `jobs` |
| `Open resume` | `resume` |
| `Show example submissions` | `roadmap` |
| `Show the Figma JD` | `jobs` |
| `Find courses` | `roadmap` |
| `Show all 10 contacts` | `messages` |
| `Show my progress this week` | `home` |
| `Show me resources` | `roadmap` |

---

## 7. Action Map (ACTION_MAP)

Maps action-chip labels to confirmation messages. When an action chip is clicked, the user sees their action echoed as a message, then Sophia responds with a green `actionDone` banner.

| Action Label | Confirmation Message | Detail |
|---|---|---|
| `Apply these fixes` | Resume fixes applied | 3 bullet points updated with impact metrics. ATS score recalculating... |
| `Auto-apply all fixes` | All optimizations applied | 5 changes made to your resume. New ATS score: 89 (+17) |
| `Add to roadmap` | Added to your roadmap | New milestone created in Phase 1. Due date set based on your schedule. |
| `Add this to my calendar` | Added to calendar | 5 sessions scheduled across this week with 9am reminders. |
| `Start now` | Let's go! | I've opened your LinkedIn profile editor. Follow the checklist above. |
| `Apply to my profile` | LinkedIn profile updated | Headline and summary applied. Changes may take a few hours to index. |
| `Save these to my plan` | Resources saved to your plan | 5 resources added to your learning path in EdgePath. |
| `Start the timer` | Timer started -- 45 minutes | I'll check in at the halfway point and give you a 5-minute warning. |
| `Start practice challenge` | Challenge started | Timer is running. I'll stay here to answer questions as you work. |
| `Set deadline reminders` | Reminders set | You'll get notifications 3 days and 1 day before each posting closes. |
| `Start interview prep` | Interview prep mode activated | I've added the 5-day plan to your roadmap. Day 1 starts tomorrow. |
| `Start with Sarah Chen` | Outreach sequence started | I've drafted your intro message. Review it above and send when ready. |
| `Try warm outreach` | Switching to warm outreach | I've identified 3 warm contacts. Let's start with the strongest lead. |
| `Draft for Marcus Rivera` | Draft ready for Marcus | Personalized for Linear. Referencing your shared university. |
| `Draft for Emily Park` | Draft ready for Emily | Direct recruiter message for Vercel. Referencing the Design Engineer role. |
| `Adapt for Linear` | Cover letter adapted | Updated for UX Designer at Linear. Emphasizing remote collaboration. |
| `I'm ready to keep going` | That's the spirit! | Daily priorities refreshed. Let's pick up where you left off. |
| `Start application` | Application started | Opening Figma's application page. Resume and cover letter ready. |
| `Apply to all three` | Application batch started | Preparing tailored resumes. Starting with Figma (deadline in 6 days). |
| `Rewrite my summary` | Summary rewritten | New 2-line summary optimized for Product Designer roles. |
| `Add case study links` | Case study section added | 3 case study links formatted with titles and descriptions. |
| `Prep my portfolio talk` | Portfolio talk prep started | I've created a structure for your 3 strongest case studies. |
| `Start LinkedIn optimization` | LinkedIn optimization started | Opening your LinkedIn profile. Follow the checklist step by step. |
| `Draft my LinkedIn summary` | Draft ready | Personalized headline and summary optimized for recruiter search. |
| `Draft recommendation request` | Recommendation request drafted | Personalized message for your former manager. See above. |
| `Create skill-building plan` | Skill plan created | 2-week sprint added to your roadmap. Starting with Design Systems. |
| `Add to calendar` | Added to calendar | Sessions scheduled with daily reminders. |
| `Optimize resume for Figma` | Optimizing for Figma | Applying 5 JD-specific changes. See checklist above. |
| `Draft cover letter` | Cover letter drafted | Tailored to Figma Product Designer. Review above. |
| `Practice a question` | Practice mode started | I'll ask you a question, then give feedback on your answer. Ready? |
| `Draft outreach to Sarah` | Draft ready | Personalized LinkedIn message for Sarah Chen. See the draft above. |
| `Draft featured section` | Featured section drafted | 3 featured items: top case study, design systems article, and a project highlight. |
| `Practice delivering it` | Practice mode started | Read your pitch aloud, then I'll give you feedback on clarity and pacing. |
| `Practice negotiation` | Negotiation practice started | I'll play the hiring manager. Start with your ask when you're ready. |
| `Push everything back 1 day` | Schedule shifted | All deadlines moved back 1 day. Figma app now due Saturday (still before Sunday deadline). |
| `Set a reminder to send` | Reminder set | I'll remind you Tuesday at 9am -- optimal send time. |

---

## 8. Scenario Detail: Conversation Flows

Each scenario is a pre-authored sequence of Sophia messages with content blocks and followup chips. Below is every scenario, its trigger, content blocks used, and the followup chip chain.

### 8.1 Resume Flows

#### `resume-review`
- **Triggers:** "review my resume", "resume review", "check my resume", "ats score"
- **Auto-expands:** Yes
- **Messages:**
  1. Scorecard (Resume Health, 72/100, 5 sub-scores)
  2. Document (Resume Annotations, 4 highlights: 2 fix, 1 warn, 1 good)
- **Followups:** Apply these fixes (action) | What score would fixes get me? (ask -> `resume-score-after`) | Show target JDs (navigate -> jobs)

#### `resume-optimize`
- **Triggers:** "optimize resume", "improve resume", "fix resume", "resume for figma"
- **Messages:**
  1. Checklist (Figma PD Optimization, 5 items)
- **Followups:** Auto-apply all fixes (action) | Show the Figma JD (navigate -> jobs) | What's my score after? (ask -> `resume-score-after`)

#### `resume-format`
- **Triggers:** "resume format", "resume template", "resume structure"
- **Messages:**
  1. Comparison (Resume Format Best Practices, 3 columns)
- **Followups:** Rewrite my summary (action) | Add case study links (action) | See example resumes (navigate -> resume)

#### `resume-score-after`
- **Triggers:** "what score would", "what's my score after", "score after fixes"
- **Messages:**
  1. Metric (3 projected scores: ATS 89, Keyword 85, Impact 80)
- **Followups:** Apply these fixes (action) | Which fix matters most? (ask -> fallback*) | Open resume (navigate -> resume)

### 8.2 Interview Flows

#### `interview-prep`
- **Triggers:** "interview prep", "start interview", "prepare for interview"
- **Auto-expands:** Yes
- **Messages:**
  1. Timeline (5-Day Interview Prep, 4 steps)
  2. Text (offer to add milestones to roadmap)
- **Followups:** Add to roadmap (action) | Adjust the schedule (ask -> `roadmap-adjust`) | What questions do they ask? (ask -> `interview-common-questions`)

#### `interview-figma`
- **Triggers:** "figma interview", "prep for figma"
- **Auto-expands:** Yes
- **Messages:**
  1. Comparison (Figma Interview Rounds, 4 rounds with readiness)
  2. Checklist (What Figma Looks For, 4 items)
- **Followups:** Start practice challenge (action) | Show example submissions (navigate -> roadmap) | Prep my portfolio talk (action)

#### `interview-behavioral`
- **Triggers:** "behavioral interview", "behavioral question"
- **Messages:**
  1. Comparison (Behavioral themes mapped to user's stories, 5 themes)
- **Followups:** Practice a question (action) | Help me structure my failure story (ask -> `interview-failure-story`) | Common follow-up questions (ask -> `interview-followups`)

#### `interview-challenge`
- **Triggers:** "design challenge", "whiteboard challenge", "take-home"
- **Auto-expands:** Yes
- **Messages:**
  1. Draft (Design Challenge Prompt, Spotify podcast discovery)
  2. Text (framing advice)
- **Followups:** Start the timer (action) | Give me a different prompt (ask -> `interview-alt-prompt`) | Show me a framework (ask -> `interview-framework`)

#### `interview-common-questions`
- **Triggers:** "what questions do they ask", "common interview questions"
- **Messages:**
  1. Checklist (Likely Questions by Round, 5 items with round tags)
- **Followups:** Practice a question (action) | Help me structure my failure story (ask -> `interview-failure-story`) | Start interview prep (action)

#### `interview-failure-story`
- **Triggers:** "structure my failure", "failure story"
- **Messages:**
  1. Comparison (STAR+ Framework, user's story mapped)
- **Followups:** Practice delivering it (action) | Common follow-up questions (ask -> `interview-followups`) | What questions do they ask? (ask -> `interview-common-questions`)

#### `interview-followups`
- **Triggers:** "common follow-up", "follow-up questions"
- **Messages:**
  1. Checklist (Common Follow-up Probes, 4 items with what they're testing)
- **Followups:** Practice a question (action) | Start interview prep (action)

#### `interview-alt-prompt`
- **Triggers:** "give me a different prompt", "another prompt"
- **Messages:**
  1. Draft (New prompt: notification system for collaborative design tool)
- **Followups:** Start the timer (action) | Show me a framework (ask -> `interview-framework`) | Give me a different prompt (ask -> self-referential, will re-show same)

#### `interview-framework`
- **Triggers:** "show me a framework", "design framework"
- **Messages:**
  1. Timeline (45-Minute Design Challenge Framework, 4 phases with time budgets)
- **Followups:** Start practice challenge (action) | Give me a different prompt (ask -> `interview-alt-prompt`)

### 8.3 Jobs Flows

#### `jobs-matches`
- **Triggers:** "view matches", "job matches", "new matches"
- **Messages:**
  1. Cards (3 job matches with % scores)
- **Followups:** Why is Figma my top match? (ask -> `jobs-why-figma`) | Compare these roles (ask -> `jobs-compare`) | Open EdgeMatch (navigate -> jobs)

#### `jobs-apply`
- **Triggers:** "help me apply", "application strategy", "where should i apply"
- **Auto-expands:** Yes
- **Messages:**
  1. Cards (5 prioritized jobs with urgency tags)
  2. Text (Figma urgency + 20-min fix suggestion)
- **Followups:** Optimize resume for Figma (action) | Draft cover letter (action) | Show Vercel referral contact (ask -> `jobs-referral-contact`)

#### `jobs-why-figma`
- **Triggers:** "why is figma", "why figma", "top match"
- **Messages:**
  1. Cards (4 alignment signals with % scores)
- **Followups:** See the full JD (navigate -> jobs) | What gaps do I have? (ask -> `jobs-gaps`) | Start application (action)

#### `jobs-compare`
- **Triggers:** "compare jobs", "compare roles", "compare these", "which role"
- **Messages:**
  1. Comparison (6-factor comparison across Figma/Linear/Vercel)
- **Followups:** Which maximizes growth? (ask -> `jobs-growth`) | Apply to all three (action) | Salary negotiation tips (ask -> `salary-info`)

#### `jobs-save`
- **Triggers:** "save job", "bookmark job", "shortlist"
- **Messages:**
  1. ActionDone (Job saved to shortlist)
- **Followups:** View all saved jobs (navigate -> jobs) | Set deadline reminders (action)

#### `jobs-gaps`
- **Triggers:** "what gaps do i have", "my gaps", "where am i weak"
- **Messages:**
  1. SkillBars (Gap Analysis, 5 skills with current vs. target)
- **Followups:** Create skill-building plan (action) | How do I close the gap fast? (ask -> fallback*) | Compare these roles (ask -> `jobs-compare`)

#### `jobs-growth`
- **Triggers:** "which maximizes growth", "best for growth"
- **Messages:**
  1. Comparison (Growth Potential, 5 factors across 3 companies)
- **Followups:** Which maximizes compensation? (ask -> `salary-info`) | Start application (action) | Open EdgeMatch (navigate -> jobs)

#### `jobs-referral-contact`
- **Triggers:** "vercel referral", "referral contact", "who do i know at"
- **Messages:**
  1. Cards (2 contacts with connection strength)
- **Followups:** Draft outreach to Sarah (action) | Draft for Marcus Rivera (action) | Draft for Emily Park (action)

### 8.4 Roadmap Flows

#### `roadmap-progress`
- **Triggers:** "open roadmap", "my roadmap", "roadmap progress"
- **Messages:**
  1. Timeline (Phase 1 Progress, 7 milestones with statuses)
- **Followups:** Why this order? (ask -> `roadmap-why-order`) | Am I on track? (ask -> `strategy-progress`) | Open EdgePath (navigate -> roadmap)

#### `roadmap-why-order`
- **Triggers:** "why this milestone", "why this order"
- **Messages:**
  1. Comparison (Sequence Impact -- LinkedIn first vs. outreach first)
  2. Text (multiplier effect explanation)
- **Followups:** Start LinkedIn optimization (action) | Who are the recruiters? (ask -> `network-recruiters`)

#### `roadmap-next`
- **Triggers:** "next milestone", "what's next"
- **Messages:**
  1. Checklist (LinkedIn Optimization, 5 items with time estimates)
- **Followups:** Draft my LinkedIn summary (action) | Draft recommendation request (action) | Start now (action)

#### `roadmap-adjust`
- **Triggers:** "adjust the schedule", "change the schedule", "reschedule"
- **Messages:**
  1. Timeline (Current Schedule, 4 items with durations)
- **Followups:** Push everything back 1 day (action) | What's the highest priority? (ask -> fallback*) | What if I skip a day? (ask -> `strategy-skip-day`)

### 8.5 Strategy Flows

#### `strategy-today`
- **Triggers:** "focus today", "what should i focus", "today's priority", "what should i start"
- **Messages:**
  1. Checklist (Today's Priorities, 3 items with time estimates)
  2. Text (why LinkedIn goes first)
- **Followups:** Start LinkedIn optimization (action) | Draft my LinkedIn summary (action) | Show the recruiter data (ask -> `network-recruiters`)

#### `strategy-week`
- **Triggers:** "this week", "weekly plan", "week ahead"
- **Messages:**
  1. Timeline (This Week's Plan, 5 days mapped)
- **Followups:** Add this to my calendar (action) | Adjust the schedule (ask -> `roadmap-adjust`) | What if I skip a day? (ask -> `strategy-skip-day`)

#### `strategy-progress`
- **Triggers:** "am i on track", "my progress", "how am i doing", "my wins"
- **Messages:**
  1. Metric (4 stats: phase %, apps sent, ATS score, streak)
  2. Text (encouragement + benchmark context)
- **Followups:** What's slowing me down? (ask -> `strategy-blockers`) | Compare to benchmark (ask -> `strategy-benchmark`) | Show full activity log (navigate -> home)

#### `strategy-skip-day`
- **Triggers:** "what if i skip", "skip a day", "miss a day"
- **Messages:**
  1. Comparison (Skip Day Impact Analysis, 3 days with impact/recovery)
- **Followups:** Adjust the schedule (ask -> `roadmap-adjust`) | What should I focus on today? (ask -> `strategy-today`)

#### `strategy-blockers`
- **Triggers:** "what's slowing me", "slowing me down", "blockers"
- **Messages:**
  1. Metric (3 stats: avg daily time, biggest blocker, fastest completion)
- **Followups:** Start LinkedIn optimization (action) | Draft my LinkedIn summary (action) | What should I focus on today? (ask -> `strategy-today`)

#### `strategy-benchmark`
- **Triggers:** "compare to benchmark", "how do i compare", "where do i stand"
- **Messages:**
  1. Comparison (Your Progress vs. You/Avg User/Top 10% across 5 metrics)
- **Followups:** How do I reach top 10%? (ask -> fallback*) | What should I focus on today? (ask -> `strategy-today`) | Open EdgePath (navigate -> roadmap)

### 8.6 Skills Flows

#### `skills-gap`
- **Triggers:** "what skills", "skill gap", "skills do i need"
- **Messages:**
  1. SkillBars (Skill Gap Analysis, 6 skills)
  2. Text (highest-leverage gap identification)
- **Followups:** Create skill-building plan (action) | Which JDs need design systems? (ask -> `skills-jd-match`) | Find courses (navigate -> roadmap)

#### `skills-learn`
- **Triggers:** "learn design systems", "design system course", "more on design"
- **Messages:**
  1. Timeline (2-Week Skill Sprint, 4 phases)
- **Followups:** Add to roadmap (action) | Show me resources (navigate -> roadmap) | What's the time commitment? (ask -> `skills-time-commitment`)

#### `skills-resources`
- **Triggers:** "courses", "resources", "tutorials", "show video content"
- **Messages:**
  1. Resources (5 curated items: courses, articles, videos, tools)
- **Followups:** Save these to my plan (action) | More on design systems (ask -> `skills-learn`) | Show video content only (ask -> self, re-shows resources)

#### `skills-jd-match`
- **Triggers:** "which jds need", "which jobs need", "which roles require"
- **Messages:**
  1. Checklist (Design Systems in Your Target JDs, 5 JDs with match status)
- **Followups:** Create skill-building plan (action) | Find courses (navigate -> roadmap)

#### `skills-time-commitment`
- **Triggers:** "time commitment", "how long will", "how many hours"
- **Messages:**
  1. Metric (3 stats: total time, design systems hours, data-informed hours)
- **Followups:** Add to roadmap (action) | Can I do it in 1 week? (ask -> fallback*) | Add this to my calendar (action)

### 8.7 Networking Flows

#### `network-strategy`
- **Triggers:** "help me network", "networking", "who should i reach out"
- **Auto-expands:** Yes
- **Messages:**
  1. Cards (3 highest-value contacts)
  2. Text (warm intro recommendation for Sarah Chen)
- **Followups:** Draft outreach to Sarah (action) | Show all 10 contacts (navigate -> messages) | Cold outreach tips (ask -> `network-cold-tips`)

#### `network-draft-outreach`
- **Triggers:** "draft outreach", "outreach message", "linkedin message"
- **Messages:**
  1. Draft (LinkedIn Message for Sarah Chen, full personalized message)
- **Followups:** Customize this more (ask -> `draft-customize`) | Draft for Marcus Rivera (action) | Draft for Emily Park (action)

#### `network-referral`
- **Triggers:** "referral", "get a referral", "warm intro"
- **Messages:**
  1. Timeline (Referral Strategy, 4-step sequence over 14 days)
  2. Text (15x multiplier data point)
- **Followups:** Start with Sarah Chen (action) | I already spoke with someone (ask -> `network-already-spoke`) | Show referral stats (ask -> `network-referral`, re-shows)

#### `network-recruiters`
- **Triggers:** "who are the recruiters", "recruiter data", "show recruiter"
- **Messages:**
  1. Cards (3 active recruiters with recency)
- **Followups:** Draft outreach to Sarah (action) | Cold outreach tips (ask -> `network-cold-tips`) | Help me network (ask -> `network-strategy`)

#### `network-cold-tips`
- **Triggers:** "cold outreach", "cold message", "cold email"
- **Messages:**
  1. Checklist (Cold Outreach Checklist, 5 rules)
- **Followups:** Draft outreach to Sarah (action) | Help me network (ask -> `network-strategy`)

#### `network-already-spoke`
- **Triggers:** "already spoke with", "i spoke with", "talked to"
- **Messages:**
  1. Text (ask for details + provide general playbook)
  2. Checklist (Post-Conversation Next Steps, 4 items)
- **Followups:** Draft a thank-you note (ask -> `draft-thankyou`) | Who should I talk to next? (ask -> `network-strategy`)

### 8.8 Drafting Flows

#### `draft-cover-letter`
- **Triggers:** "cover letter", "write cover letter"
- **Auto-expands:** Yes
- **Messages:**
  1. Draft (Cover Letter for Figma PD, full letter with recipient context)
- **Followups:** Make it shorter (ask -> `draft-shorter`) | Make it more personal (ask -> `draft-personal`) | Adapt for Linear (action)

#### `draft-linkedin`
- **Triggers:** "linkedin summary", "linkedin headline", "optimize linkedin"
- **Messages:**
  1. Draft (LinkedIn headline + summary, keyword-optimized)
- **Followups:** Apply to my profile (action) | Add more keywords (ask -> fallback*) | Draft featured section (action)

#### `draft-thankyou`
- **Triggers:** "thank you note", "thank you email", "follow up email"
- **Messages:**
  1. Draft (Post-Interview Thank You, templated with placeholders)
- **Followups:** Make it warmer (ask -> `draft-warmer`) | Make it shorter (ask -> `draft-shorter`) | When should I send this? (ask -> `draft-timing`)

#### `draft-pitch`
- **Triggers:** "elevator pitch", "pitch myself", "introduce myself"
- **Messages:**
  1. Draft (Elevator Pitch, 3-paragraph structure)
- **Followups:** Make it more conversational (ask -> `draft-conversational`) | Adapt for a recruiter (ask -> `draft-recruiter`) | Practice delivering it (action)

#### `draft-shorter`
- **Triggers:** "make it shorter", "shorten it", "more concise"
- **Messages:**
  1. ActionDone (Draft shortened, 40% cut)
- **Followups:** Make it more personal (ask -> `draft-personal`) | Show me the result (ask -> fallback*)

#### `draft-personal`
- **Triggers:** "make it more personal", "more personal", "personalize it"
- **Messages:**
  1. ActionDone (Draft personalized, 2 specific references added)
- **Followups:** Make it shorter (ask -> `draft-shorter`) | When should I send this? (ask -> `draft-timing`)

#### `draft-warmer`
- **Triggers:** "make it warmer", "warmer tone", "friendlier"
- **Messages:**
  1. ActionDone (Tone adjusted)
- **Followups:** Make it shorter (ask -> `draft-shorter`) | When should I send this? (ask -> `draft-timing`)

#### `draft-conversational`
- **Triggers:** "make it more conversational", "less formal"
- **Messages:**
  1. ActionDone (Tone updated, natural speech patterns)
- **Followups:** Practice delivering it (action) | Adapt for a recruiter (ask -> `draft-recruiter`)

#### `draft-recruiter`
- **Triggers:** "adapt for a recruiter", "recruiter version"
- **Messages:**
  1. Draft (Recruiter-Adapted Version, shorter/more direct)
- **Followups:** Make it shorter (ask -> `draft-shorter`) | When should I send this? (ask -> `draft-timing`)

#### `draft-timing`
- **Triggers:** "when should i send", "best time to send"
- **Messages:**
  1. Metric (3 stats: best days, best time, follow-up window)
- **Followups:** Set a reminder to send (action) | Draft a follow-up (ask -> `draft-thankyou`)

#### `draft-customize`
- **Triggers:** "customize this more", "edit this", "change this draft"
- **Messages:**
  1. Text (asks what to change, offers options)
- **Followups:** Make it shorter (ask -> `draft-shorter`) | Make it more personal (ask -> `draft-personal`) | Make it warmer (ask -> `draft-warmer`)

### 8.9 Salary Flows

#### `salary-info`
- **Triggers:** "salary", "compensation", "negotiate", "offer"
- **Auto-expands:** Yes
- **Messages:**
  1. Metric (3 stats: market range, your target, negotiation room)
  2. Comparison (Negotiation playbook: what to say / why it works)
- **Followups:** Practice negotiation (action) | What if they lowball? (ask -> `salary-lowball`) | Compare benefits packages (ask -> `salary-benefits`)

#### `salary-lowball`
- **Triggers:** "what if they lowball", "lowball", "low offer"
- **Messages:**
  1. Checklist (Lowball Response Strategy, 4 steps)
- **Followups:** Practice negotiation (action) | Compare benefits packages (ask -> `salary-benefits`)

#### `salary-benefits`
- **Triggers:** "compare benefits", "benefits package", "total comp"
- **Messages:**
  1. Comparison (Benefits & Total Comp, 7 factors across 3 companies)
- **Followups:** Which has the best total comp? (ask -> fallback*) | Help me negotiate (ask -> `salary-info`)

### 8.10 Emotional Flows

#### `emotional-stuck`
- **Triggers:** "stuck", "overwhelmed", "frustrated", "imposter syndrome"
- **Messages:**
  1. Text (empathetic acknowledgment)
  2. Checklist (Unsticking Protocol, 3 micro-tasks)
- **Followups:** Just help me with one thing (ask -> `emotional-one-thing`) | Show my progress this week (ask -> `strategy-progress`) | I need a different approach (ask -> `emotional-different`)

#### `emotional-rejection`
- **Triggers:** "rejected", "rejection", "ghosted", "no interviews"
- **Messages:**
  1. Metric (3 stats: cold rate, warm rate, avg applications before offer)
  2. Text (statistical reframing + encouragement)
- **Followups:** Review my resume (ask -> `resume-review`) | Try warm outreach (action) | Help me debrief a rejection (ask -> `emotional-rejection`, re-shows)

#### `emotional-motivation`
- **Triggers:** "keep going", "give up", "want to quit"
- **Messages:**
  1. Comparison (Your Progress Then vs. Now, 6 metrics)
  2. Text (encouragement with evidence)
- **Followups:** What should I focus on today? (ask -> `strategy-today`) | Show me my wins this week (ask -> `strategy-progress`) | I'm ready to keep going (action)

#### `emotional-one-thing`
- **Triggers:** "just help me with one thing", "one small thing", "baby step"
- **Messages:**
  1. Checklist (Your One Thing, single 5-min task)
  2. Text (why this one thing matters for 3 metrics)
- **Followups:** Start now (action) | Show me the full list (ask -> fallback*) | I did it! (ask -> fallback*)

#### `emotional-different`
- **Triggers:** "need a different approach", "different strategy", "not working"
- **Messages:**
  1. Cards (3 common reasons things feel off, with solutions)
- **Followups:** Break things into smaller steps (ask -> fallback*) | What should I focus on today? (ask -> `strategy-today`) | Adjust the schedule (ask -> `roadmap-adjust`)

### 8.11 Meta

#### `meta-capabilities`
- **Triggers:** "what can you do", "what can you help", "how can you help"
- **Messages:**
  1. Comparison (7 capability categories with details)
- **Followups:** What should I start with? (ask -> `strategy-today`) | Review my resume (ask -> `resume-review`) | Show my progress (ask -> `strategy-progress`)

### 8.12 Fallback

#### `fallback`
- **Triggers:** Any unmatched query
- **Messages:**
  1. Text (honest "I don't have a playbook for that")
  2. Cards (3 things Sophia does have context on: resume, jobs, next milestone)
- **Followups:** What should I focus on today? (ask -> `strategy-today`) | Review my resume (ask -> `resume-review`) | What can you help with? (ask -> `meta-capabilities`)

---

## 9. Known Gaps & Dead Ends

Followup chips marked with * in Section 8 hit the fallback because no specific scenario exists. These are acceptable as 3rd-level-deep follow-ups where the fallback provides useful recovery. But they should eventually get dedicated scenarios:

| Dead-End Chip | Appears In | Recommended Fix |
|---|---|---|
| `Which fix matters most?` | `resume-score-after` | Create `resume-priority-fix` scenario with a ranked list |
| `How do I close the gap fast?` | `jobs-gaps` | Create `skills-fast-track` scenario with accelerated plan |
| `Can I do it in 1 week?` | `skills-time-commitment` | Create `skills-compressed` scenario with compressed timeline |
| `How do I reach top 10%?` | `strategy-benchmark` | Create `strategy-top-tier` scenario with specific targets |
| `Break things into smaller steps` | `emotional-different` | Create `strategy-micro-tasks` scenario |
| `What's the highest priority?` | `roadmap-adjust` | Add route to `strategy-today` (partial match exists but "highest priority" doesn't match current keywords) |
| `Show me the result` | `draft-shorter` | Re-render the modified draft with a `draft-result` scenario |
| `I did it!` | `emotional-one-thing` | Create `emotional-celebration` scenario with confetti and next step |
| `Show me the full list` | `emotional-one-thing` | Route to `strategy-today` or create an expanded task list |
| `Add more keywords` | `draft-linkedin` | Create `draft-keywords` scenario showing keyword optimization |
| `Which has the best total comp?` | `salary-benefits` | Create `salary-total-comp` scenario with ranked total comp |

### Self-Referential Chips

Some chips re-trigger the same scenario they appear in. This works but feels like a loop:

| Chip | Scenario | Behavior |
|---|---|---|
| `Give me a different prompt` | `interview-alt-prompt` | Re-shows same alternate prompt |
| `Show referral stats` | `network-referral` | Re-shows same referral data |
| `Show video content only` | `skills-resources` | Re-shows same resource list |
| `Help me debrief a rejection` | `emotional-rejection` | Re-shows same rejection data |

These should ideally show variant responses or filtered content.

---

## 10. Empty State & Context Chips

When Sophia opens with no query, she shows an empty state with 3 contextual chips:

| Chip | Type | Sub-text |
|---|---|---|
| What should I focus on today? | ask | Based on your deadlines |
| Review my resume | ask | ATS score 72 -- 3 fixes |
| Help me apply to jobs | ask | 3 new matches -- 1 closing soon |

These are hardcoded in `CONTEXT_CHIPS`. In production, they should be dynamically generated based on the user's current state, deadlines, and recent activity.

---

## 11. Dashboard Wiring Summary

| Dashboard Element | Click Behavior | Target |
|---|---|---|
| KPI Cards (Career Score, Applications, ATS, EdgeGas) | Static -- no click handler | -- |
| Roadmap Strip phases | Navigate via top nav | `roadmap` |
| "View full roadmap" link | Navigate via top nav | `roadmap` |
| Milestone rows (Phase 1 Milestones) | Navigate via top nav | `roadmap` |
| Activity items | Static -- no click handler | -- |
| Upcoming items | Static -- no click handler | -- |
| Top Jobs cards | Navigate via top nav | `jobs` |
| "View all 23" link | Navigate via top nav | `jobs` |
| Sophia Insight Card CTA | Opens Sophia Float with query | Sophia |
| Bottom Bar suggestion chips | Opens Sophia Float with query | Sophia |
| Bottom Bar "Ask Sophia" button | Opens Sophia Float (empty state) | Sophia |

---

## 12. Component API

```typescript
interface SophiaAskProps {
  isOpen: boolean;               // Controls visibility
  onClose: () => void;           // Called when user closes Sophia
  mode?: SophiaAskMode;          // "stretch" | "drawer" | "panel" | "float" (currently only float->panel used)
  initialMessage?: string | null; // Pre-populated query (from chips/CTAs)
  onClearInitial?: () => void;   // Clears initialMessage after sending
  onNavigate?: (target: string) => void; // Called when navigate chip clicked (target = nav ID)
}
```

### Shell Integration

```tsx
<SophiaAsk
  isOpen={sophiaOpen}
  onClose={handleClose}
  mode="stretch"
  initialMessage={initialMessage}
  onClearInitial={() => setInitialMessage(null)}
  onNavigate={(target) => {
    setActiveNav(target);      // Switch top nav pill
    setSophiaOpen(false);       // Close Sophia
    setInitialMessage(null);    // Clear message
  }}
/>
```

---

## 13. Motion & Timing

| Transition | Duration | Easing |
|---|---|---|
| Float appear | 300ms | `[0.32, 0.72, 0, 1]` |
| Float dismiss | 300ms | `[0.32, 0.72, 0, 1]` |
| Panel slide-in | 350ms | `[0.32, 0.72, 0, 1]` |
| Panel slide-out | 350ms | `[0.32, 0.72, 0, 1]` |
| Message appear | 250ms | `[0.32, 0.72, 0, 1]` |
| Content block appear | 300ms | `[0.32, 0.72, 0, 1]` |
| Followup chips appear | 250ms (300ms delay) | default |
| Typing indicator pulse | 1.5s infinite | ease-in-out |
| Message stagger between Sophia messages | 600ms | -- |
| Typing indicator before first response | 700ms | -- |

---

## 14. Visual Treatment Reference

### Text Hierarchy (no reduced opacity)

| Level | Hex | Usage |
|---|---|---|
| Primary | `#E8E8ED` | User messages, headings, primary labels |
| Secondary | `#9CA3AF` | Sophia body text, descriptions |
| Tertiary | `#6B7280` | Sub-labels, metadata |
| Quaternary | `#374151` | Timestamps, fine print, placeholders |
| Muted | `#1F2937` | Disabled states |

### Accent Colors

| Color | Hex | Usage |
|---|---|---|
| Cyan | `#22D3EE` | Sophia's identity, ask chips, career score |
| Lime | `#B3FF3B` | Actions, positive metrics, high match scores |
| Amber | `#F59E0B` | Warnings, medium scores |
| Red | `#EF4444` | Errors, low scores, critical gaps |
| White (glass) | `rgba(255,255,255,0.025)` | Card backgrounds |
| White (border) | `rgba(255,255,255,0.05)` | Card borders |

### Fonts

| Token | Usage |
|---|---|
| `var(--font-display)` | Headings, labels, scores, navigation (Urbanist) |
| `var(--font-body)` | Body text, descriptions, chips (Satoshi) |

---

## 15. Implementation Notes for Production

### What's Currently Simulated

Everything in the current implementation uses pre-authored scenario data. In production, these would be replaced by:

1. **Query routing** -> LLM intent classification or semantic search
2. **Scenario responses** -> LLM-generated responses with structured output (content blocks as tool calls)
3. **Action execution** -> Real API calls (update resume, save to roadmap, send outreach, etc.)
4. **Navigation** -> Real React Router navigation (currently just switches `activeNav` state)
5. **Context chips** -> Dynamically generated from user state (deadlines, recent activity, phase progress)
6. **User data** -> Real profile data from Supabase (currently hardcoded as "Sharon", career score 72, etc.)

### What's Architecturally Sound

1. **Three chip types with distinct behaviors** -- this pattern holds for production
2. **Float-to-Panel escalation** -- this interaction model is validated
3. **Content block system** -- the 11 block types cover all current use cases
4. **ActionDone pattern** -- confirmation banners are the right UX for completed actions
5. **Navigation callback pattern** -- `onNavigate` prop is clean and extensible
6. **Route table pattern** -- keyword matching can be swapped for LLM classification without changing the scenario/response layer

### File Locations

| File | Purpose |
|---|---|
| `/src/app/components/sophia-ask.tsx` | Main Sophia component (types, routing, scenarios, renderers, conversation engine, Float/Panel UI) |
| `/src/app/components/sophia-mark.tsx` | Sophia's animated logo mark |
| `/src/app/components/shell-synthesis.tsx` | Dashboard shell with Sophia integration |
| `/docs/sophia-interaction-ux-spec.md` | Original UX spec with hypothesis validation |
| `/docs/sophia-warmth-mapping.md` | Tone rules: warm for emotional, direct for functional |

---

## Continue to Part II

**[Sophia Multi-Role System Design](./sophia-multi-role-system.md)** extends this architecture to all 8 user roles: EdgeStar, EdgePreneur, EdgeParent, EdgeGuide, EdgeEmployer, EdgeEducation, EdgeNGO, and EdgeAgency. It covers 118 total scenarios, 106 actions, 62 nav targets, role-specific tone matrices, and the implementation priority roadmap.