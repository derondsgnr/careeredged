# CareerEdge Public Website Sitemap

> Single source of truth for all public-facing website pages (NOT the web app).
> Derived from `docs/landing-page-product-os-audit.md` and founder answers.

---

## Navigation Structure

```
Homepage (/)
About (/about)
EdgeJobs (/jobs)
Explore Careers (/careers)
EdgePath (/edgepath)
Solutions (dropdown)
  ├── Individuals (/solutions/individuals)
  ├── Employers (/solutions/employers)
  ├── Institutions (/solutions/institutions)
  ├── Government (/solutions/government)
  └── NGOs (/solutions/ngos)
Pricing (/pricing) — optional, can be hidden
Login (/login)
Sign Up (/signup)
```

---

## Page Inventory

### Main Pages

| # | Page | Route | Purpose | Notes |
|---|------|-------|---------|-------|
| 1 | **Homepage** | `/` | Hero, features, social proof, conversion | Seeker-first hero. Dark/light rhythm. 3 variations built. |
| 2 | **About** | `/about` | Company story, team, mission | B&W photography for people. Asymmetric editorial layout. |
| 3 | **EdgeJobs** | `/jobs` | Public job board preview | Teaser showing a few listings to drive sign-up. Full access requires auth. |
| 4 | **Explore Careers** | `/careers` | Browse careers + CTA to get personalized roadmap | Browsable career data (30+ careers, salary, growth) + product CTA. |
| 5 | **EdgePath** | `/edgepath` | Interactive demo of the roadmap product | "Enter your current role and target role, see a preview roadmap." |
| 6 | **Login** | `/login` | Returning user authentication | Routes to dashboard (returning) or onboarding (incomplete). |
| 7 | **Sign Up** | `/signup` | New user registration | Routes to Sophia-guided onboarding flow. |

### Solutions Pages (Nav Dropdown)

| # | Page | Route | Audience | Purpose |
|---|------|-------|----------|---------|
| 8 | **Individuals** | `/solutions/individuals` | EdgeStars, career seekers | Seeker value prop. May reference international professionals (not "immigration"). |
| 9 | **Employers** | `/solutions/employers` | Hiring managers, recruiters | Recruiting, EdgeSight analytics, career fair participation. |
| 10 | **Institutions** | `/solutions/institutions` | Universities, career services | Student outcomes, NACE/CSEA compliance, virtual career fairs. |
| 11 | **Government** | `/solutions/government` | Government agencies | Workforce development, grant distribution. Sensitive framing — use "underserved communities" not "immigrant populations." |
| 12 | **NGOs** | `/solutions/ngos` | Non-profit organizations | Program management, community impact, resource publishing. |

### Optional / Conditional Pages

| # | Page | Route | Notes |
|---|------|-------|-------|
| 13 | **Pricing** | `/pricing` | Free / Edge Plus ($19/mo) / Edge Pro ($39/mo). Designed but toggleable — can be hidden pre-launch without degrading section count. |

---

## Auth Flow (from website into app)

```
Sign Up → Onboarding (Sophia-guided, 6 steps) → Role-specific dashboard
Login → Dashboard (if returning + onboarding complete)
Login → Onboarding (if account exists but onboarding incomplete)
```

Auth methods: Email/password, Google OAuth, Magic link (implemented during onboarding).

---

## Key Design Decisions (from Product OS Audit)

- **Seeker-first hero** — homepage speaks to career seekers first; employers/institutions get nav access to solutions pages
- **Try-first conversion model** — let visitors use a tool (ResumeEdge or sample roadmap) before requiring sign-up
- **No "immigration" language** — reframe as "Global Career Mobility" / "International Professionals"
- **Outcome-forward AI positioning** — lead with career results, reveal AI as the enabler
- **Dark/light section rhythm** — dark hero → light features → dark social proof → light pricing → dark footer
- **Product screenshots as hero visuals** — not stock photography
- **B&W photography for people** — keeps lime/green palette clean
- **SPA-style page transitions** — crossfade between pages
- **EdgeGas credit system** — save for in-app discovery, not on landing page
- **Naming balance** — use product names but pair with plain-language descriptors on first mention; don't plaster "Edge" everywhere

---

## Total Page Count: ~13

7 main pages + 5 solutions pages + 1 optional (pricing)

---

## Source Documents

- `docs/landing-page-product-os-audit.md` — Full 42-question audit with founder answers
- `docs/reference-analysis-landing-page.md` — Visual reference analysis (8 references)
- `src/app/components/landing/` — Built landing page variations (v1, v2, v3)
