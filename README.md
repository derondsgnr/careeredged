<div align="center">

<img src="public/careeredge-logo.svg" alt="CareerEdged" width="64" />

# CareerEdged

### Go Beyond Job Searching. Build Your Career.

Personalised roadmaps. AI-powered guidance. A community built around your career.

[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat&logo=framer&logoColor=white)](https://www.framer.com/motion)

[Live Product](https://careeredged.com) · [Figma Source](https://www.figma.com/design/V3YcSgpihR0bS2fObmOicn/Careeredgde)

</div>

---

> **Note on the live product:** This repository is the original design and engineering reference for CareerEdged. The deployed product at [careeredged.com](https://careeredged.com) is operated by the product owner and may reflect decisions that differ from this codebase.

---

## What Is CareerEdged?

Most career platforms are built for one moment — the job search. CareerEdged is built for the entire career journey.

It's a role-aware platform that adapts to who you are — whether you're a job seeker figuring out your next move, an entrepreneur managing the business of your career, a mentor building a coaching practice, or an employer searching for the right match. Every person gets a version of the product built around their actual context, not a generic dashboard.

At the heart of it is **Sophia** — an AI companion who doesn't just answer questions. She connects the dots across your data, surfaces what matters before you ask, and speaks to you like someone who actually knows your situation.

---

## The Role System

CareerEdged is not one product. It's eight, unified under one platform.

| Role | Description |
|------|-------------|
| 🌟 **EdgeStar** | The job seeker navigating a career transition or growth path |
| 🚀 **EdgePreneur** | The entrepreneur managing the business side of their career |
| ❤️ **EdgeParent** | The parent supporting their child's educational and career journey |
| 📖 **EdgeGuide** | The career coach or mentor running sessions and managing clients |
| 🏢 **EdgeEmployer** | The hiring organisation sourcing, matching, and managing talent |
| 🎓 **EdgeEducation** | The institution connecting students to pathways and opportunities |
| 🌍 **EdgeNGO** | The non-profit delivering career support to communities |
| 📋 **EdgeAgency** | The recruitment agency managing pipelines and placements at scale |

Every role gets its own dashboard, its own set of surfaces, its own navigation, and its own version of Sophia. Switch roles in the demo to see the platform transform entirely.

---

## Core Surfaces

<table>
<tr>
<td width="50%">

### 🗺️ EdgePath — Career Roadmap
A living, phased roadmap built by Sophia from your goals, history, and skills. Tracks milestones, visualises progress, surfaces budget implications, and connects to every other surface in the platform.

</td>
<td width="50%">

### 🔍 EdgeMatch — Job Discovery
Role-matched listings with AI fit scores and a full application tracker — Saved → Applied → Interview → Offer. Immigration-aware for international candidates.

</td>
</tr>
<tr>
<td>

### 📄 ResumeEdge — Resume Builder
Sophia-guided resume creation with inline editing, section-by-section coaching, and tailored suggestions drawn from your actual EdgePath goals — not generic tips.

</td>
<td>

### 📅 Sessions — Coaching & Mentorship
Book, manage, and run 1:1 sessions with coaches and mentors. Calendar integration, session notes, and full history for both clients and guides.

</td>
</tr>
<tr>
<td>

### 💬 SocialEdge — Community Feed
A role-aware social feed with 18 content categories across four intent groups: Share, Help, Learn, Connect. Like, comment, share, save, and report — with Sophia surfacing what's worth your attention.

</td>
<td>

### 👥 EdgeGroups — Cohort Communities
Structured groups led by coaches and industry experts. Threaded discussions, live group chat, shared resources, and events. Premium groups unlock with **Edge Plus**.

</td>
</tr>
<tr>
<td>

### 🌐 ImmigrationEdge
Tracks visa status, work authorisation, and immigration milestones alongside the career roadmap. Surfaces contextually to relevant roles without cluttering the experience for those it doesn't apply to.

</td>
<td>

### ✨ EdgeCoach & Mentor Discovery
Browse and filter verified coaches and mentors by specialisation, availability, and fit. View detailed profiles and book directly into Sessions.

</td>
</tr>
</table>

**Also included:** EdgeMarket (freelance marketplace), Courses (structured learning), Budget (financial planning), ScheduleEdge, Analytics, Community, EdgeWorkplace, and more.

---

## Sophia — The AI at the Centre

Sophia is the connective tissue of CareerEdged. She isn't a chatbot appended to the product — she's built into every surface, every decision, every transition.

She operates across three modes:

**→ The Bottom Bar** — always present, always contextual. A persistent insight strip at the bottom of every surface with a message and action chips. She knows which surface you're on, what tab you're looking at, and what you've done before. She surfaces what's relevant before you think to ask.

**→ Guided Flows** — when you need to give Sophia information (onboarding, resume building, goal setting), she collects it through a bounded conversation card — not a form, not a wizard. She gives context, uses inline examples, and never assumes you know the terminology.

**→ Full Overlay** — voice-enabled deep conversation mode for open-ended coaching. Ask Sophia anything. She knows your EdgePath, your applications, your sessions, your progress.

> Sophia is "a person in your network who happens to know everything about your career."

---

## Edge Plus

Edge Plus is the platform's subscription layer — unlocking premium EdgeGroups, advanced analytics, priority coach matching, and enhanced Sophia capabilities. It's woven into the product as a contextual upgrade rather than a hard gate, surfacing naturally when a user reaches a premium feature.

---

## Design Language

CareerEdged has a strong visual identity built on a few non-negotiable decisions:

```
Background   →  #08090C       Near-black. No pure black, no grey.
Primary      →  #22D3EE       Cyan. Every CTA, every brand mark, every primary action.
Delight      →  #B3FF3B       Lime. Scores, achievements, streaks, completion. Never buttons.
Typography   →  Urbanist + Satoshi
Radius       →  12–16px across surfaces, 999px for pills
Motion       →  200–300ms transitions, spring physics for entrances
```

Surfaces are built with glassmorphism — `rgba` backgrounds, blur, thin borders — layered to create depth without heaviness. Every colour in the codebase is a CSS variable. Nothing is hardcoded.

The brand pattern — the CE logo mark tessellated across a grid — appears as a diagonal line-by-line reveal animation for hero moments and as a subtle background texture across premium surfaces.

**Design northstars:** Linear, Vercel, Claude, Airbnb, Resend, Duolingo, Firecrawl, Deel, Boundless.

---

## Navigation Architecture

Three tiers, deliberately constrained:

1. **Spatial** — top nav pills. 4–7 surfaces per role. These are the daily drivers. The nav is frozen by design — adding surfaces degrades the whole system.
2. **Contextual** — Sophia chips and cross-surface links. The product connects itself. EdgeMatch knows about ImmigrationEdge. EdgePath knows about Sessions. Nothing exists in isolation.
3. **Command** — `Cmd+K`. Global palette for power users.

New surfaces enter the product through the **Explore menu** in the Dock — not by growing the top nav.

---

## Tech Stack

| | |
|--|--|
| **Framework** | React 19 + TypeScript |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **Animation** | Framer Motion (motion v12) |
| **UI Primitives** | Radix UI |
| **Forms** | React Hook Form |
| **Notifications** | Sonner |
| **Icons** | Lucide React |
| **Build Tool** | Vite 6 |

The entire design token system lives in `theme.css` and `tokens.ts`. Every motion value, role accent colour, spacing scale, and glass tint is defined once and referenced everywhere.

---

## Running Locally

```bash
# Clone
git clone https://github.com/derondsgnr/careeredged.git
cd careeredged

# Install
npm install

# Start
npm run dev
```

Opens at **http://localhost:5191**

The **Demo Controls** panel (visible in development) lets you switch between all 8 roles, surface states (Empty / Onboarding / Active), light and dark themes, and Edge Plus subscription status — no login required.

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── landing/            Public website & marketing pages
│   │   ├── dashboards/         Role-specific dashboards (8 roles)
│   │   ├── surfaces/           Product surfaces (20+ surfaces)
│   │   ├── ui/                 Primitive components (shadcn-based)
│   │   ├── shared-patterns.tsx Reusable surface patterns
│   │   ├── sophia-patterns.tsx Sophia UI components
│   │   └── kpi-patterns.tsx    KPI and data display patterns
│   ├── routes.tsx              Complete routing table
│   └── theme.css               CSS design token system
└── docs/                       Product documentation
```

---

## Docs

| Document | Contents |
|----------|----------|
| `docs/product-prd.md` | Full product requirements |
| `docs/sophia-system-reference.md` | Sophia's UX, voice, and behaviour spec |
| `docs/sophia-multi-role-system.md` | How Sophia adapts across roles |
| `docs/ia-navigation-model.md` | Navigation architecture and role-based IA |
| `docs/brand-guidelines.md` | Visual identity and design rules |
| `docs/surface-inventory.md` | Complete surface and feature inventory |
| `docs/website-sitemap.md` | Public marketing site page inventory |

---

<div align="center">

*Built with intention. Designed to give every career its edge.*

</div>
