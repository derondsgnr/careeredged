# EdgePath Action Triage — What stays, what moves, what Sophia absorbs

## The Problem

The current roadmap view has 18 interactive elements competing for attention:

**Top bar (6):** Set Primary, Live toggle, EdgeGas counter, Share Your Insight, Export, Regenerate

**Tab row 1 (7):** Pathways, Timeline, Quick Wins, Skills, Milestones, Jobs, Activity

**Tab row 2 (5):** Analytics, Insights, Compare, Budget, Support

The user hasn't even touched their roadmap yet and they've already been asked to parse 18 decisions. Every tab says "I'm important." When everything is important, nothing is.

## The Answer: Nothing gets deleted. Everything gets placed correctly.

Three buckets: **Surface** (always visible), **Sophia** (intelligence-driven, contextual), **Overflow** (available but not competing for attention).

---

### SURFACE — Always visible on EdgePath

These earn their screen real estate because the user needs them on every visit:

| Element | Why it stays | How it changes |
|---|---|---|
| **Pathways** | This IS the roadmap. It's not a tab — it's the default view. | Remove the tab. The phase strip + milestone list below IS "Pathways." It's the page itself, not a view within the page. |
| **Milestones** | The core action unit. Users come here to check things off. | Not a separate tab. Milestones are visible within each phase when you click on it. They're the content, not a filter. |
| **Timeline** | Spatial orientation — "where am I in the journey?" | The phase strip IS the timeline. Horizontal phases with dates/durations built in. No separate tab needed. A toggle between "phase view" and "timeline view" is fine if timeline means a Gantt-style expanded view, but it shouldn't be a peer tab to 11 others. |

**Result:** Zero tabs for the primary experience. The phase strip + milestone content IS the view. No tab selection needed to see your roadmap.

---

### SOPHIA — Intelligence-driven, appears when relevant

These are valuable but don't deserve permanent screen space. Sophia surfaces them at the right moment:

| Element | Current form | Sophia version |
|---|---|---|
| **Quick Wins** | A tab showing easy tasks | Sophia's commentary strip: "3 quick wins available in Phase 2 — want to see them?" Appears when the user has been inactive or when there are low-effort high-impact milestones. Not a permanent tab. |
| **Jobs** | A tab showing matching jobs | Sophia's right column: "4 jobs match your Phase 2 skills. 2 posted this week." Links to EdgeMatch with pre-filtered results. Jobs live in EdgeMatch — EdgePath shows the connection, not a duplicate job board. |
| **Insights** | A tab showing... insights? | This IS Sophia. The entire right column is insights. Phase commentary strip is insights. Milestone annotations are insights. Making "Insights" a tab is like making "Intelligence" a tab on an AI platform. It should be woven through everything. |
| **Quick Wins** | A tab you click to see easy wins | Sophia proactively surfaces these: "Before tackling Phase 3, here's a quick win: update your LinkedIn headline to match your new skills. Takes 5 minutes." Contextual, not a list. |
| **Compare** | A tab for pathway comparison | Sophia-triggered: "I see two viable paths for Phase 3: specialize in motion design vs. design systems. Want to compare?" Only appears when there's a genuine fork. Most phases don't have alternatives — showing an empty Compare tab is worse than not showing it. |
| **Support** | A tab for... getting support? | "Ask Sophia" is already the support mechanism. If this means linking to coaches/mentors, Sophia can surface it: "Feeling stuck on Phase 2? Alice (your EdgeGuide) has availability Thursday." |
| **Skills** | A tab listing required skills | Embedded in milestones. Each milestone shows which skills it builds. A separate skills tab is just a different lens on the same milestone data. If users want a skills gap view, Sophia can provide it: "Your Phase 2 skill gaps: Design Systems (0%), Figma Prototyping (30%), User Research (60%)." |

**Result:** 7 tabs eliminated. Zero information lost. Everything surfaces at the moment it's useful rather than sitting in a tab waiting to be discovered.

---

### OVERFLOW MENU (...) — Available but not competing

These are real actions but used rarely. They go behind a three-dot menu or a secondary action bar:

| Element | Why it's overflow | Where it lives |
|---|---|---|
| **Set Primary** | You do this once, maybe twice ever. | Star icon in the roadmap selector dropdown. When you switch between roadmaps, the star is right there. Not a persistent top-bar action. |
| **Export** | Occasional action, not a daily workflow. | Overflow menu (...) in the top-right. Export as PDF, share link, etc. |
| **Share Your Insight** | Cool feature, but not the reason you open EdgePath. | Overflow menu (...). Or Sophia prompts it after a phase completion: "Want to share your Phase 2 journey with your network?" |
| **Regenerate** | Destructive action that should require confirmation. Definitely not a casual top-bar button. | Overflow menu (...) with a confirmation dialog. Sophia can suggest it contextually: "Your target role has shifted. Want to regenerate your roadmap with the new direction?" |
| **EdgeGas counter** | Useful but belongs in the global nav, not per-surface. | Top nav bar (global), next to profile. Consistent everywhere, not just EdgePath. |
| **Live toggle** | What does "Live" mean? If it's real-time updates vs. static, that should be the default behavior (always live), not a toggle. If it means something else, it needs a clearer label. | Either remove (always live) or overflow menu as a setting. |

**Result:** Top bar goes from 6 actions to just the roadmap title + overflow menu (...). Clean.

---

### RELOCATED — Lives on a different surface entirely

| Element | Why it moves | Where it goes |
|---|---|---|
| **Analytics** | Career analytics = EdgeBoard. That's its dedicated surface. Duplicating it here creates maintenance burden and confuses "where do I go for analytics?" | EdgeBoard surface. Sophia can link: "Want to see how your progress compares to similar career changers? Check your EdgeBoard." |
| **Activity** | Activity feed already lives on the dashboard. Duplicating it here adds noise. | Dashboard's activity widget. EdgePath might show a "last 3 actions" mini-feed in the Sophia column, but not a full activity tab. |
| **Budget** | This is an EdgeParent feature (Family Budget Tracker - i think it might be available for edgestars that want to plan? i don't know is that good for the business model?). It shouldn't be a default tab for EdgeStar users. | Only visible when EdgeParent is viewing their child's roadmap. Even then, it might be a separate section within the parent's view, not a tab alongside Pathways and Skills. |

---

## The Result

**Before:** 6 top-bar actions + 12 tabs = 18 elements

**After:**
- **Top bar:** Roadmap title ("Revenue Ops Manager → Graphic Designer") + roadmap selector dropdown + overflow menu (...)  = 3 elements
- **Tabs:** Zero. The phase strip + milestone content IS the view.
- **Sophia column (right):** Absorbs Quick Wins, Jobs, Insights, Compare, Support, Skills — surfaced contextually
- **Overflow (...):** Set Primary, Export, Share, Regenerate, Live toggle
- **Other surfaces:** Analytics → EdgeBoard, Activity → Dashboard, Budget → EdgeParent view

**Information removed:** Zero.
**Decisions removed from the user:** 15.

---

## One Open Question

The current screenshot shows those three contextual tags at the top:
- "Available in your preferred format"
- "General fit for your profile"  
- "Your extensive experience is a strong asset"

These feel like Sophia's initial assessment summary. They're good — but they should be part of the narrative card below them, not floating tags. Tags imply filtering or categorization. These are statements. They could be Sophia's introductory sentence: "This roadmap is a strong fit for your profile — your extensive experience gives you a head start. Starting at Phase 2." - yeah

---

Your call. Push back on any of this or confirm and I'll update the UX spec with this triage baked in, then we build.