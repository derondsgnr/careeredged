# ImmigrationEdge — UX Specification

## Overview

ImmigrationEdge (user-facing: **Global Career Mobility**) helps international professionals understand credential transfer, licensing requirements, skills gaps, and career pathway mapping between countries.

**Route:** `/:role/immigration`
**File:** `src/app/components/surfaces/immigration-surface.tsx`

## Language & Sensitivity

### Non-Negotiable Rules
- **User-facing language:** Always "Global Career Mobility", "international career pathway", "credential transfer"
- **Never use publicly:** "immigration", "visa status", "immigrant", "alien" — these terms are internal/technical only
- **Data isolation:** Credential/country data stored in `ce-immigration-profile` in localStorage. This data is **architecturally isolated** from employer-facing surfaces (EdgeMatch, Pipeline). An employer viewing a candidate through EdgeMatch must NEVER see origin country, visa status, or credential evaluation data.
- **No visa status in onboarding:** This surface is the first time immigration-adjacent data is collected. It is opt-in — users navigate here voluntarily.

### Consent & Privacy
- Credential and origin data collected with implicit consent (user initiates the flow)
- Data never shared with employers — this is for personal guidance only
- User can reset/delete their analysis at any time (demo reset button, production: settings)

## Role Access

| Role | Access | Notes |
|---|---|---|
| EdgeStar | Full | All EdgeStars can access |
| EdgePreneur | Full | Non-US entrepreneurs (career mobility applies to founders too) |
| Other roles | No access | Not shown in NavExplorePanel |

## Navigation

### Entry Points
1. **NavExplorePanel** — Globe icon, orange accent, "ImmigrationEdge" label, "Global career mobility pathways" description
2. **Sophia contextual suggestion** — Only for users who have self-identified as international or saved jobs in foreign countries
3. **EdgePath cross-link** — If roadmap involves international milestones

### Exit Points
1. **EdgePath** — "Add visa milestones to your roadmap" → navigates to `/:role/edgepath`
2. **EdgeMatch** — "Jobs with visa sponsorship" → navigates to `/:role/jobs` (filtered)
3. **Sessions** — "Connect with a mobility guide" → navigates to `/:role/sessions` (Dr. Priya Sharma type)
4. **Dashboard** — "Back to dashboard" → navigates to `/:role`

## State Machine

```
Empty → Building → Active
```

### Empty State
- Globe icon (orange accent)
- "Global Career Mobility" heading
- "Understand how your credentials transfer and map your path" description
- Sophia mark with contextual pre-fill acknowledgment: "I already know you're in [field] with [X years]. I just need a couple details."
- "Get Started" CTA

### Building State (Sophia-Guided Questionnaire)

**Pattern:** ResumeEdge BuildingState (bounded conversation card, segmented progress bar, pinned input)

**Pre-fill Strategy (Critical — Sophia's Core UX Rule):**

Sophia NEVER re-asks what she already knows. She references existing data and only asks what's genuinely new.

| Data | Source | Sophia's Approach |
|---|---|---|
| Name | Auth/profile | References: "Hi Sharon..." |
| Field/industry | `targetField` from onboarding | References: "You're a Product Design professional..." |
| Career level | `careerLevel` from onboarding | References: "...with 3.5 years of experience" |
| Years of experience | ResumeEdge (if uploaded) | Auto-calculated, never asked |
| Education | ResumeEdge (if uploaded) | References: "I see Bachelor's in Visual Communication" |
| Target locations | EdgeMatch saved jobs | Pre-fills: "You've been looking at roles in Canada — is that where you're heading?" |

**Questions Asked (only what's new):**

1. **Origin country** — "Where did you study or qualify originally?"
   - Country picker pills (popular countries) + text input
   - Auto-submits on pill selection

2. **Destination country** — Pre-filled from saved jobs if available
   - "You've been looking at roles in Canada and US. Is that where you're heading?"
   - User confirms or selects different country

3. **Credentials** — "What degrees or certifications do you hold from [origin]?"
   - Pre-fills education from ResumeEdge: "I already see Bachelor's in Visual Communication"
   - User adds any additional certifications

**Generation Phase (4 steps):**
1. Evaluating credential transfer...
2. Mapping licensing requirements...
3. Analyzing skills gaps...
4. Building your mobility roadmap...

### Active State (Two-Column Layout)

**Left column — Roadmap Cards:**

1. **Timeline & Cost Summary** — Two KPI cards showing estimated timeline and total cost
2. **Credential Evaluation** — Each credential with transfer status (Full / Partial / Requires Eval), notes on evaluation process
3. **Licensing & Certification** — Required licenses, estimated time/cost, step-by-step process
4. **Skills Gap Analysis** — Current vs required level bars, recommendations
5. **Country Comparison** — Table comparing origin vs destination (hiring, salary, culture, resume format, networking)

**Right column — Sophia Suggestions (sticky):**

1. "Add to your EdgePath roadmap" → integrates visa milestones into EdgePath
2. "Jobs with visa sponsorship" → filters EdgeMatch for sponsoring employers
3. "Connect with a mobility guide" → links to Sessions
4. "Credential evaluation resources" → external resource links
5. Sophia insight card with personalized recommendation

## Sophia Integration

### Conversation Tone
- Warm, knowledgeable, never bureaucratic
- References what she already knows before asking
- Uses inline examples: "Most Product Designers in Canada need..."
- Never assumes jargon: "credential evaluation" not "FCE/WES assessment"

### Context Chips (Float Mode)
When user is on other surfaces, Sophia can suggest:
- "Map visa routes for [field] roles" (ask)
- "Show sponsorship costs" (ask)
- "Compare [saved country A] vs [saved country B] pathways" (navigate)

### Typed Suggestions
All suggestions are actionable:
- "Add these milestones to EdgePath" → button that wires to EdgePath
- "Filter jobs by sponsorship" → navigates to EdgeMatch with filter
- "Book a session with an international guide" → navigates to Sessions

## Design Tokens

- **Accent:** Orange (`COLORS.orange` / `--ce-status-warning`)
- **Icon:** Globe (lucide-react)
- **Fonts:** Urbanist (headings), Satoshi (body)
- **Cards:** `rgba(var(--ce-glass-tint),0.02)` background, `rgba(var(--ce-glass-tint),0.04)` border
- **Shell:** SophiaForwardBackground + SharedTopNav + mt-14

## Mobile (375px)

- Single column layout (right column stacks below)
- Country picker pills wrap naturally
- Conversation card maintains minHeight: 280px
- Active state cards stack vertically

## Data Model

```typescript
interface ImmigrationProfile {
  originCountry: string;
  destinationCountry: string;
  credentials: string[];
  fieldRef: string;        // from onboarding
  levelRef: string;        // from onboarding
  credentialEvaluation: CredentialEval[];
  licensingRequirements: LicenseReq[];
  skillsGap: SkillGap[];
  countryComparison: CountryCompare;
  estimatedTimeline: string;
  estimatedCost: string;
}
```

Stored in localStorage as `ce-immigration-profile`. Production: Supabase with RLS, isolated from employer-facing tables.
