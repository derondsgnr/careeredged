# Surface 7: EdgeSight / Analytics — Speed-Run UX Spec

**Sprint scope:** EdgeStar's EdgeBoard only. Other role dashboards (EdgeEmployer, EdgeEducation, EdgeGuide, EdgeNGO/Agency, EdgeParent) are post-sprint but the architecture supports role-based switching.

---

## 1. The Job

**"Show me if what I'm doing is actually working — without me having to figure out the data."**

Not "view your analytics." Not "check your dashboard." The user doesn't want to interpret charts. They want Sophia to tell them what's working, what isn't, and what to do about it. The charts are evidence for Sophia's recommendations — not the point itself.

**The insight equation:** Most career platforms show you data and leave you to draw conclusions. EdgeBoard is Sophia interpreting the data and telling you the story. The charts exist to PROVE her interpretation, not to make you do the work.

**Who uses this and why:**
- An EdgeStar 3 weeks into their roadmap wants to know: "Am I on track? Are employers seeing my resume? Should I change my approach?"
- They don't want 6 tabs of charts. They want Sophia to say: "Your resume views tripled after you added quantified results last Tuesday. Keep doing that."

---

## 2. The States

### Empty (Day 0 — no data yet)

The user opened EdgeBoard but has no applications, no resume views, no activity history.

**What happens:** NOT a blank dashboard with zero-value charts. Sophia meets them:

> "Your EdgeBoard tracks how your career moves are landing. Right now there's nothing to show — but that changes fast. Apply to your first role, and I'll start showing you what's working."

Below Sophia's message: a **projected trajectory card** — a glass card showing what their EdgeBoard WILL look like with sample data and a shimmer overlay indicating it's illustrative. Two CTA chips:
- "Find roles on EdgeMatch →"
- "Optimize your resume first →"

Never a dead end. Always a next step.

### Sparse (Week 1 — minimal data)

The user has 2-3 applications, maybe a resume upload. Not enough data for trend lines.

**What happens:** Sophia leads with what she HAS, not what's missing:

> "3 applications submitted. 1 resume view so far. Too early for trends, but here's what I'm watching."

Show: KPI cards with actual numbers (even if small), but trend arrows are suppressed (not enough data points). Charts that need time-series show a single data point with a "More data coming" annotation. Sophia insight strip says: "I'll have patterns to share after your 5th application."

### Active (Week 3+ — meaningful data)

The primary use state. Enough data for trends, comparisons, and Sophia's intelligence layer.

**What the user sees:** Full EdgeBoard — described in Section 3.

### Milestone (triggered by a threshold crossing)

When a metric crosses a meaningful threshold — resume views hit 50, application-to-interview rate exceeds 15%, roadmap hits 50% — Sophia calls it out:

> "Your interview rate just hit 18%. That's above average for your target roles. The resume changes from March 10 are working."

The relevant KPI card gets a brief lime pulse. EdgeGas +5 if it's a first-time threshold.

---

## 3. The Layout

### Desktop (1440px reference)

**Top strip — Sophia Insights (72px height)**
A horizontal glass strip spanning full width. Contains 2-3 Sophia insight cards, each a compact sentence with a small icon:
- 💡 "Resume views tripled since you added quantified results"  
- 📈 "Applications spike on Mondays — consider applying Sunday night"
- 🎯 "3 of your top matches posted new roles this week"

Insight cards are scrollable horizontally if more than 3. Each has a small "→" that deep-links to the relevant data point on the chart below.

**KPI row (120px height)**
Four glass cards in a row, each containing:
- Metric label (e.g., "Applications Sent")
- Current value (large number, counts up from 0 on load)
- Trend indicator: ↑12% or ↓5% with period label ("vs. last 30d")
- Trend color: lime for positive, amber for neutral, red for negative (proper hex, not opacity)
- Micro sparkline (last 30 data points, 40px tall, no axis labels)

**KPI cards for EdgeStar:**
1. **Applications Sent** — total applications in period
2. **Resume Views** — how many times their resume was viewed by employers
3. **Interview Rate** — applications that reached "Interviewing" status (%)
4. **Roadmap Velocity** — milestones completed per week vs. plan

**Date range bar (48px height)**
Horizontal bar with preset chips: 7d | 30d | 90d | 1y | All. Selected chip gets lime fill. This is GLOBAL — affects all charts below.

**Chart grid (remaining viewport)**
Two columns of charts in glass cards, each with:
- Title + subtitle (what this chart shows in plain language, not jargon)
- The chart itself
- A small Sophia annotation dot (cyan) on notable data points — hover to reveal her observation

**Chart 1 (left, wide): Application Activity — Area Chart**
Time-series showing applications submitted over time. Filled area with lime gradient (lime-500 at top, transparent at bottom). Points where the user did something notable (uploaded new resume, completed a milestone) are marked with vertical annotation lines. Sophia annotations: "You updated your resume here → views jumped."

**Chart 2 (right, square): Skills Gap — Horizontal Bar Chart**
Shows the user's top 8 skills with two bars each: "Your level" (lime) vs. "Market demand" (cyan). The gap between them is the opportunity. Sorted by gap size descending. Skills data comes from EdgePath roadmap + target role requirements.

**Chart 3 (left, square): Application Funnel — Funnel/Sankey**
Stages: Applied → Viewed → Interview → Offer. Each stage shows count and conversion %. The drop-off between stages is the story — Sophia annotates the biggest drop: "60% of your applications aren't being viewed. Let's optimize your resume keywords."

**Chart 4 (right, square): Activity Heatmap — Calendar Heatmap**
GitHub-style contribution grid showing daily activity (applications, resume edits, course completions, session bookings). Green intensity scale. Helps the user see their own consistency patterns. Sophia: "You're most active on Tuesdays and Thursdays."

**Chart 5 (full width): Resume Score Over Time — Line Chart**
Tracks the user's ResumeEdge score over time. Key inflection points annotated: "Score jumped from 62 to 78 when you added quantified results." This connects EdgeBoard to ResumeEdge — your actions on one surface show results on another.

**Chart 6 (left, square): Job Match Distribution — Donut Chart**
Distribution of saved/applied jobs by match percentage ranges: 90%+ (excellent), 70-89% (good), 50-69% (stretch), <50% (reach). Sophia insight: "You're applying mostly to 70-89% matches — that's strategic."

**Chart 7 (right, square): Roadmap Progress — Radial/Gauge**
Overall roadmap completion (%) as a radial gauge. Inner ring shows phase breakdown. Animated arc from 0 to current value on load. Below the gauge: "Phase 2 of 4 — Estimated completion: June 2026."

### Filter Chips (below date range bar)
Category filter: All | Applications | Resume | Roadmap | Skills
Status filter: Active | Completed | All

Selecting a category filter highlights only the relevant charts (others dim slightly — NOT opacity reduction, use a darker background tint like #0A0C10 vs. the standard #0E1117).

### Mobile (390px reference)

Single column. Sophia insight strip scrolls horizontally. KPI cards in a 2×2 grid. Charts stack vertically, full-width. Date range and filters in a sticky bar below the header. Charts are touch-interactive (tap to see data points, long-press for Sophia annotation).

### Paywall Variation

For potential premium gating: charts 3-7 covered with a frosted glass overlay. Visible but blurred. A card overlay: "Unlock detailed analytics with Edge Plus" with feature bullets and a CTA. Charts 1-2 and the KPI row are always free — the user needs SOMETHING to see value.

---

## 4. Sophia Integration

### Insight Strip (top)
- 2-3 insights, refreshed weekly (or on significant data change)
- Generated from cross-surface data: resume edits + application outcomes + roadmap progress
- Tone: observational, never judgmental. "Your resume gets 3x more views with quantified results" not "Your resume needs quantified results."
- Each insight has a deep-link arrow to the supporting chart

### Chart Annotations
- Small cyan dots (8px) on notable data points across all charts
- Hover/tap reveals a Sophia tooltip: "You completed a milestone here — notice how application views increased the following week?"
- Annotations are sparse — max 2-3 per chart. Too many and they become noise.

### Sophia Bar (bottom, persistent)
Surface-aware context. On EdgeBoard, Sophia's bar shows:
- "Your resume views are up 40% this week" (if true)
- "Ready to see what roles match your updated profile?" (cross-surface chip to EdgeMatch)
- "Your next session with Alice is tomorrow — want to prep?" (if applicable)

### Empty State Coaching
When specific charts have no data:
- Application funnel with 0 applications: Sophia ghost text inside the chart area: "Apply to a role and I'll show you how it's tracking."
- Skills gap with no target roles: "Set your target role on EdgePath and I'll compare your skills to what employers want."

---

## 5. Motion

### Entry
- KPI cards stagger in from bottom (50ms intervals, 300ms each, ease-out)
- Numbers count up from 0 to value (600ms, ease-out-cubic)
- Trend arrows fade in after numbers finish
- Sparklines draw left-to-right (400ms)

### Charts
- Charts stagger as they enter viewport (intersection observer, 100ms intervals)
- Area chart: fills from bottom up (500ms, ease-out)
- Bar chart: bars grow from left (300ms each, 50ms stagger)
- Donut: segments animate clockwise from 12 o'clock (600ms)
- Gauge: arc sweeps from 0 to value (800ms, spring easing)
- Heatmap: cells fade in row by row (30ms per row)
- Line chart: path draws left to right (600ms)
- Funnel: stages slide in from left, staggered (50ms, 300ms each)

### Interactions
- Date range chip selection: charts crossfade to new data (200ms)
- Filter chip selection: non-matching charts dim (150ms), matching charts pulse briefly
- Sophia annotation hover: tooltip fades in (150ms) with a subtle scale from 0.95→1.0
- KPI card hover: subtle lift (translateY -2px, 150ms)

### Reduced Motion
All counting, drawing, and staggering replaced with instant render. Crossfades remain (they aid comprehension, not just delight).

---

## 6. Cross-Surface Connections

### From EdgeBoard
- "Optimize your resume →" chip on the Resume Score chart → opens ResumeEdge
- "Find matching roles →" chip on the Job Match Distribution chart → opens EdgeMatch with the user's top match filters pre-set
- "Continue your roadmap →" chip on the Roadmap Progress gauge → opens EdgePath at current phase
- "Book a mentor session →" chip on the Skills Gap chart (when gaps are significant) → opens Session/Booking

### To EdgeBoard
- ResumeEdge: after optimizing → "See how this affects your analytics →" chip
- EdgeMatch: after applying → "Track this application in EdgeBoard →" chip
- EdgePath: after completing a milestone → "Your EdgeBoard just updated →" chip
- Session/Booking: after a session → "See your updated metrics →" chip

---

## 7. Build Notes

### Mock Data Requirements
- 90 days of mock application data (3-5 applications/week with realistic outcomes)
- Resume score history (5-8 data points over 90 days, showing improvement)
- Skills gap data against "Product Designer" target role (8 skills with varying gaps)
- Activity heatmap data (daily activity counts for 90 days)
- Roadmap progress (Phase 2 of 4, 63% overall)

### Component Architecture
- `<EdgeBoard>` — orchestrator, handles date range + filter state
- `<KPIRow>` — four KPI cards, accepts data array
- `<SophiaInsightStrip>` — horizontal scrolling insight cards
- `<AnalyticsChart>` — wrapper that handles glass card, title, Sophia annotations, loading state
- Individual chart components: `<AreaChart>`, `<BarChart>`, `<FunnelChart>`, `<Heatmap>`, `<DonutChart>`, `<GaugeChart>`, `<LineChart>`
- `<DateRangeBar>` — preset chip selector
- `<FilterChips>` — category/status filters
- `<PaywallOverlay>` — frosted glass gate for premium charts

### Role-Based Architecture (post-sprint prep)
The `<EdgeBoard>` component accepts a `role` prop. For this sprint, only `role="edgestar"` is implemented. The data shape, KPI definitions, chart selection, and Sophia insights all key off this prop. When we build EdgeEmployer's EdgeSight later, we swap the data config — the layout skeleton stays identical.

### Charts Library
Use `recharts`. All charts get the glass card treatment (background: rgba(255,255,255,0.03), border: 1px solid rgba(255,255,255,0.06), border-radius: 16px). Chart colors from brand palette: lime (#B3FF3B) primary, cyan (#22D3EE) secondary, amber (#F59E0B) warning, purple (#8B5CF6) comparison, red (#EF4444) negative.

### Accessibility
- All charts must have `aria-label` describing what they show
- KPI numbers announced by screen readers after count-up completes (use `aria-live="polite"`)
- Color is never the sole indicator — pair with icons or text labels
- Heatmap cells need tooltip accessible via keyboard (Tab + Enter)

### Performance Budget
- Initial render (above fold: insight strip + KPI row): <500ms
- Full chart grid rendered: <1.5s (staggered load helps perceived performance)
- Chart interactions (hover, filter): <100ms response
