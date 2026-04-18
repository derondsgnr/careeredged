# CareerEdged

**CareerEdged is an AI-powered career development platform** that goes beyond job searching. It gives every type of career stakeholder — job seekers, entrepreneurs, parents, employers, mentors, institutions — a personalised roadmap, an intelligent companion, and a community to grow with.

> **Note on the live product:** This repository represents the original design and engineering vision for CareerEdged. The deployed product at [careeredged.com](https://careeredged.com) is operated by the product owner and may reflect decisions that differ from this codebase.

---

## The Core Idea

Most career tools are built for one type of person in one moment of their career. CareerEdged is built around the reality that careers are nonlinear, that support looks different for everyone, and that the best guidance comes from someone who knows you — not a job board algorithm.

At the centre of the platform is **Sophia**, a conversational AI companion who acts less like a chatbot and more like a knowledgeable person in your network. She gives context before she asks for anything, speaks in plain language, connects your data across surfaces, and guides you from uncertainty to clarity.

---

## Who It's For — The Role System

CareerEdged serves eight distinct roles, each with its own dashboard, navigation, and set of surfaces tailored to their context:

| Role | Who They Are |
|------|-------------|
| **EdgeStar** | The job seeker — actively navigating a career transition or growth path |
| **EdgePreneur** | The entrepreneur — building something and managing the business side of their career |
| **EdgeParent** | The parent — supporting their child's educational and career journey |
| **EdgeGuide** | The mentor or career coach — running sessions, managing clients, and building a practice |
| **EdgeEmployer** | The hiring organisation — sourcing, matching, and managing talent |
| **EdgeEducation** | The institution — connecting students to pathways and opportunities |
| **EdgeNGO** | The non-profit — delivering career support to communities |
| **EdgeAgency** | The recruitment agency — managing pipelines and placements at scale |

Each role sees only what's relevant to them. Navigation, Sophia's tone, empty states, and surface defaults all adapt to role context automatically.

---

## Key Surfaces

### EdgePath — Career Roadmap
A living, phased roadmap built by Sophia from the user's goals, history, and skills. Tracks milestones, visualises progress, surfaces budget implications, and connects to every other surface in the platform.

### EdgeMatch — Job Discovery
Role-matched job listings with fit scores, a full application tracker (Saved → Applied → Interview → Offer), and Sophia coaching at every stage. Immigration-aware for international candidates.

### ResumeEdge — Resume Builder
Sophia-guided resume creation with inline editing, section-by-section coaching, and tailored suggestions that reference the user's actual EdgePath goals.

### Sessions — Coaching & Mentorship
Book, manage, and run 1:1 sessions with coaches and mentors. Includes calendar integration, session notes, and history — for both clients and guides.

### SocialEdge — Community Feed
A role-aware social feed with 18 content categories grouped by intent (Share / Help / Learn / Connect). Posts support rich interactions: like, comment, share, save, and report. Sophia surfaces trending topics and suggests relevant posts.

### EdgeGroups — Cohort Communities
Structured groups led by coaches and industry experts. Members join themed cohorts, participate in threaded discussions, group chat, shared resources, and live events. Edge Plus unlocks premium groups.

### EdgeCoach & Mentor Discovery
Browse and filter verified coaches and mentors by specialisation, availability, and fit. View detailed profiles and book directly.

### ImmigrationEdge
Tracks visa status, work authorisation, and immigration milestones alongside the career roadmap. Contextually surfaces to relevant roles.

### Supporting Surfaces
EdgeMarket (freelance marketplace), Courses (structured learning), Budget (financial planning), ScheduleEdge (session scheduling), and Analytics (performance insights) complete the ecosystem.

---

## Sophia — The AI Companion

Sophia is not a feature. She is the connective tissue of the entire platform.

She appears as a persistent presence at the bottom of every surface, proactively surfacing relevant insights, suggesting next actions, and offering contextual chips that navigate the user forward. She never assumes jargon. She gives context before she asks for anything. She speaks like a person, not a product.

**Sophia operates across three interaction modes:**
- **Bottom bar** — always-on, surface-aware insight strip with action chips
- **Guided flows** — bounded conversation card for structured data collection (onboarding, resume building, goal setting)
- **Full overlay** — voice-enabled deep conversation mode for open-ended coaching

---

## Navigation Architecture

CareerEdged uses a three-tier navigation system:

1. **Spatial (top nav pills)** — the 4–7 daily-driver surfaces for each role, always visible
2. **Contextual (Sophia chips + cross-surface links)** — Sophia surfaces related actions inline; surfaces link to each other meaningfully
3. **Command (Cmd+K)** — global command palette for power users

The top nav is intentionally constrained. New surfaces live in the **Explore menu** (accessible via the Dock or Segment nav), not as additional pills. The navigation is designed to feel light and never overwhelming.

---

## Design Language

CareerEdged is built with a strong visual opinion:

- **Dark by default** — base surface `#08090C`, near-black with depth through layering
- **Cyan as primary** — `#22D3EE` for all CTAs, primary actions, brand marks, and headings
- **Lime as delight** — `#B3FF3B` reserved exclusively for achievements, scores, streaks, trend indicators, and completion states — never for primary actions
- **Glassmorphism** — surfaces use subtle `rgba` backgrounds with blur and thin borders, not flat cards
- **Typography** — Urbanist for display and headings, Satoshi for body
- **Motion** — 200–300ms transitions, spring physics for entrances via Framer Motion
- **Brand patterns** — the CE logo mark tessellated as a repeating SVG pattern; diagonal line-by-line reveal animation for hero moments

Design northstars: Linear, Vercel, Airbnb, Claude, Resend, Duolingo, Firecrawl, Deel, Boundless.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | Framer Motion (motion v12) |
| UI Primitives | Radix UI |
| Forms | React Hook Form |
| Toasts | Sonner |
| Icons | Lucide React |
| Build | Vite 6 |

All colours are CSS variables — no hardcoded hex values in components. The theme system (`theme.css` + `tokens.ts`) is the single source of truth for every visual token in the product.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5191` by default.

Use the **Demo Controls** panel (visible in dev) to switch between roles, states, themes, and Edge Plus subscription status without logging in.

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── landing/           # Public website pages
│   │   ├── dashboards/        # Role-specific dashboards
│   │   ├── surfaces/          # Product surfaces
│   │   ├── ui/                # Primitive UI components
│   │   └── shared-patterns.tsx / sophia-patterns.tsx / kpi-patterns.tsx
│   ├── routes.tsx             # Full routing table
│   └── theme.css              # Design token CSS variables
└── assets/                    # Brand SVGs and static assets
```

---

## Internal Docs

Product documentation lives in `/docs`:

- `product-prd.md` — full product requirements
- `sophia-system-reference.md` — Sophia's UX, voice, and behaviour spec
- `ia-navigation-model.md` — navigation architecture and role-based IA
- `brand-guidelines.md` — visual identity and design rules
- `surface-inventory.md` — complete surface and feature inventory
- `website-sitemap.md` — public marketing site page inventory

---

*Built with intention. Designed to give every career its edge.*
