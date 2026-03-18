# Landing Page — Product OS Audit

## Surface Definition
**What this is:** The public-facing marketing website for CareerEdge. This is NOT the app. This is the conversion surface — the first impression, the brand manifesto, the trust engine. Every person who ever uses CareerEdge will pass through this surface first.

**Proposed Navigation Structure:**
- Homepage (/)
- About (/about)
- EdgeJobs (/jobs) — public job board preview
- Explore Careers (/careers) — career discovery/browsing
- EdgePath (/edgepath) — roadmap product page
- Solutions dropdown: Individuals, Employers, Institutions, Government, NGOs
- Login (/login)
- Sign Up (/signup) → routes to onboarding flow
- Auth success → routes to dashboard (returning) or onboarding (new)

---

## CRITICAL SENSITIVITY FLAGS

### Immigration in the US Political Climate
ImmigrationEdge is a real product feature, but "immigration" is a third-rail word in US marketing right now. Questions:

1. **Do we mention ImmigrationEdge on the landing page at all?** Or do we reframe it entirely as "Global Career Mobility" / "International Professionals" / "Cross-Border Career Planning"? The feature itself doesn't change — just the public-facing language. My strong recommendation is to NEVER use the word "immigration" on the landing page. Instead: "Career guidance for international professionals" or "Navigate career transitions across borders." This is not hiding the feature — it's framing it in terms of the USER'S JOB (build a career in a new country) rather than the POLITICAL CATEGORY (immigration). Do you agree, or do you want to be more direct?

2. **If we have a Government audience page (/solutions/government)** — do we reference workforce development programs for immigrant populations, or keep it generic ("underserved communities", "workforce transitions")? Government agencies ARE a user type, and some will use CareerEdge for exactly this purpose. But the landing page copy needs to be bulletproof against political misreading.

3. **The "Individuals" solutions page** — does it reference international career seekers as a persona, or do we wait until they're inside the product (onboarding) to surface ImmigrationEdge? My instinct: mention it as one capability among many, framed around the user's ambition ("Building a career in a new country? We map the path."), not around their status.

### AI Positioning in the Current Climate
AI is simultaneously CareerEdge's biggest differentiator and biggest trust liability. People are:
- Tired of "AI-powered everything" claims
- Skeptical that AI can actually help with something as personal as career planning
- Afraid of data being used to train models
- Wary of AI replacing human judgment in hiring

Questions:

4. **How prominently do we lead with AI on the homepage?** Three options:
   - **A) AI-forward:** "Your AI career strategist" — Sophia is the hero, AI is the headline
   - **B) Outcome-forward:** "Your career, mapped" — the RESULT is the hero, AI is the enabler mentioned in supporting copy
   - **C) Hybrid:** The headline is human ("Your next move, clarified"), Sophia appears as a presence in the product screenshot but isn't named until the feature section -yes
   
   My recommendation is B or C. Leading with AI in 2026 risks sounding like every other product. Leading with the OUTCOME (clarity, a plan, an edge) and then revealing that AI powers it creates a stronger narrative arc: "Oh, this gives me a career roadmap... and it's powered by AI? That's the kind of AI I actually want."

5. **Do we use the word "AI" in the primary headline?** Or do we save it for feature descriptions? yes this The reference analysis shows NextAI leading with it (they're selling to developers who WANT AI), but Scalient doesn't (they're selling to brands who want results). CareerEdge's audience wants CAREER RESULTS, not AI. Confirm your instinct here.

6. **Sophia's landing page presence** — do we:
   - Show her as a chat interface in a product screenshot (subtle, implies intelligence)
   - Have a dedicated "Meet Sophia" section (explicit, makes her a character)
   - Use her as an interactive element on the landing page itself (e.g., a demo conversation visitors can try)
   - Some combination? yes

7. **Data privacy messaging** — where and how prominently? Given AI anxiety, should we have:
   - A brief "Your data stays yours" line near the CTA
   - A dedicated trust/security section
   - Privacy mentioned in the FAQ only -yes
   - A trust badge system (SOC2, GDPR, etc.) in the footer or hero area

---

## DESIGN LEAD QUESTIONS

8. **Dark vs. light homepage default.** The reference analysis strongly favors dark hero → light features → dark social proof rhythm. But the in-app experience is dark glass throughout. Should the landing page:
   - Match the app's dark aesthetic end-to-end (cohesive but potentially heavy for marketing)
   - Use the dark/light rhythm from the references (more dynamic, better for long-scroll conversion) yes
   - Start dark (hero/above fold) and go light (below fold) — single transition, like "emerging from the product into the world"

9. **The hero visual.** What product screenshot do we show as the hero? Options:
   - The dashboard (shows breadth — "look at everything you get") 
   - An EdgePath roadmap (shows the core value prop — "you get a personalized plan") or this
   - A Sophia conversation (shows the AI differentiator — "you get a guide")
   - ResumeEdge optimization view (shows immediate utility — "fix your resume now") or this
   - A composite/collage (risks looking busy, but shows ecosystem) this
   
   My recommendation: EdgePath roadmap. It's the most visually distinctive, the most emotionally resonant ("here's YOUR path"), and the hardest for competitors to replicate. The dashboard is generic. The resume tool is commodity. The roadmap is ONLY CareerEdge.

10. **Typography on the landing page.** In-app we use Urbanist + Satoshi. For the landing page, do we:
    - Use the same type system (consistency)
    - Introduce a display/headline typeface for marketing moments (common practice — apps use one system, marketing uses a more expressive variant) - Schibsted Grotesk
    - Use Urbanist at much larger scales than in-app to create visual impact
    
    The references show heavy/bold headline typography as a signature move. Urbanist has the weight range to do this. Confirm we stay with Urbanist + Satoshi, or are you open to exploring?

11. **Photography direction.** The reference analysis recommends B&W for people photos to keep the color palette clean. Do you:
    - Have existing photography/team photos to use? - naa, use unsplash 
    - Want stock photography (B&W, diverse professionals)? yeah
    - Want NO photography — pure product screenshots + illustrations/abstract visuals? - one version of the variation
    - Want user-generated content / testimonial photos?

12. **The CE monogram usage on the landing page.** We now have the icon mark in forest green, white, and the full logo in cyan/white, blue/black, and all-white. For the landing page:
    - Nav: full logo (which color variant? White on dark header seems right)
    - Favicon/tab: icon mark
    - Footer: full logo
    - Any decorative/large-scale use of the monogram? (e.g., watermark, section divider, the "typography as architecture" idea from the reference analysis where a letter contains a screenshot) - explore

---

## PRODUCT MANAGER QUESTIONS

13. **Primary conversion goal.** What is the ONE thing we want a landing page visitor to do?
    - Sign up for a free account
    - Start with a specific tool (e.g., "Optimize your resume free")
    - Book a demo (for institutional/enterprise visitors)
    - Some combination with audience segmentation (seekers → sign up, employers → book demo) yes

14. **The multi-audience challenge.** CareerEdge serves 8 user types, but the landing page can only have ONE hero message. Who is the primary audience?
    - **Seekers first** (largest TAM, emotional hook, viral potential) — with secondary paths for employers/institutions
    - **Equal weight** — the homepage is a router that sends each audience to their solutions page
    - **Seeker-first hero, institutional CTA in nav** — "Get Your Edge" for seekers + "For Organizations" dropdown for B2B
    
    My recommendation: Seeker-first. The homepage should feel like it was made for a person looking for career help. Employers and institutions get prominent nav access to their solutions pages but don't dilute the hero. The emotional resonance of "someone who understands my career confusion" is stronger than "a platform for all stakeholders."

15. **The 5 solutions pages (Individuals, Employers, Institutions, Government, NGOs)** — are these:
    - Full, unique pages with distinct copy, visuals, and CTAs
    - Templated pages with the same structure but swapped content
    - Sections within a single "Solutions" page with anchor links
    
    This affects build scope significantly.

16. **EdgeJobs (/jobs) as a public page.** Is this:
    - A teaser/preview showing a few listings to drive sign-up (most common SaaS pattern) - this
    - A fully functional public job board (like Indeed — browsable without sign-up, apply requires account)
    - A product page explaining EdgeMatch's features (not actual listings)

17. **Explore Careers (/careers)** — is this:
    - A public version of the Career Discovery Hub (browse 30+ careers, salary data, growth projections)
    - A product page explaining EdgePath's career exploration features
    - Both — browsable career data + CTA to get a personalized roadmap - this

18. **EdgePath (/edgepath)** — is this:
    - A product page explaining what EdgePath does (features, benefits, screenshots)
    - An interactive demo ("Enter your current role and target role, see a preview roadmap") this 
    - A case study page ("Here's what an EdgePath roadmap looks like for a Marketing Manager → VP Marketing transition")

---

## BRAND STRATEGIST QUESTIONS

19. **The core claim for the landing page.** The PRD gives us "Your Career, Your Edge" as the tagline and "Get Your Edge" as the CTA. For the hero headline, we need something bigger. Candidates: - let's ease off on the edge, lets not be tacky about it
    - "Your Career, Edged Forward" (brand extension)
    - "The career platform that actually knows you" (differentiation from generic tools)
    - "From where you are to where you belong" (emotional, journey-focused)
    - "Career clarity in a world of noise" (problem-aware)
    - "Your next chapter, mapped" (outcome-focused, visual)
    - None of the above — do you have a direction?

20. **Brand voice on the landing page vs. in-app.** In-app, Sophia is warm, encouraging, professional. The landing page voice needs to be:
    - The same warmth (consistent, but might feel soft for a marketing page that needs to CONVERT)
    - More assertive/confident (CareerEdge as authority: "We know careers. We'll prove it.")
    - More provocative/challenger (CareerEdge vs. the status quo: "Job boards failed you. We won't.")
    - Poetic/editorial (CareerEdge as movement: "Every career has an inflection point. This is yours.") hm i feel more this

21. **The "EdgeOn!" motto** — does it appear on the landing page? It's very internal/community-feeling. Could work as a community section CTA or footer sign-off, but might feel odd in a public-facing hero. Your call. - meh no

22. **Naming on the landing page.** The product names (ResumeEdge, EdgePath, EdgeMatch, Sophia, EdgeGas, etc.) — do we:
    - Use them freely (establishes brand vocabulary but might confuse newcomers)
    - Introduce them with plain-language explanations first ("Our AI resume optimizer, ResumeEdge")
    - Avoid product names entirely on the homepage and save them for feature/product pages
    - Use them but ensure each is paired with a one-line descriptor on first mention - balance, i also don't want it plastered everywhere "edge"

---

## GROWTH LEAD / MARKETING QUESTIONS

23. **SEO strategy.** Which keywords should the landing page target?
    - "AI career coaching" / "AI career planning" — high intent but competitive
    - "career roadmap" / "career path planning" — more specific, less competitive
    - "resume optimizer" / "ATS resume checker" — high volume, commodity market
    - "career development platform" — broad, B2B-leaning
    - Are there specific long-tail terms you're targeting? - hm all of the above + also include AI seo 

24. **Social proof availability.** What do we have to work with?
    - User testimonials (real or can we create representative ones?)
    - University/employer partner logos
    - Press mentions or awards
    - Usage statistics (roadmaps generated, resumes optimized, etc.)
    - If none yet (pre-launch), do we use aspirational stats or skip social proof entirely? can have placeholder so they fill 

25. **The conversion funnel.** Typical SaaS landing page conversion paths:
    - **Direct:** Hero CTA → Sign up → Onboarding
    - **Educated:** Hero → Scroll features → CTA → Sign up
    - **Segmented:** Hero → "I'm a [seeker/employer/educator]" → Solutions page → Sign up
    - **Try-first:** Hero → Interactive demo/free tool → Sign up to save results
    
    Which model fits CareerEdge's current state? If we're pre-launch or early, the "try-first" model (let them use ResumeEdge or see a sample roadmap without signing up) can dramatically increase conversion. - try first per our onboarding 

26. **Pricing on the landing page.** The PRD shows Free / Edge Plus ($19/mo) / Edge Pro ($39/mo). Do we:
    - Show pricing on the homepage
    - Have a separate /pricing page linked from nav
    - Hide pricing entirely for now (common for pre-launch or enterprise-focused) - design but make optional to hide, do not let it degrade the amount of sections you want it to have

---

## MOTION DESIGNER QUESTIONS

27. **Scroll-driven animations.** The references show subtle scroll-triggered reveals. For Awwwards consideration:
    - Do we want parallax effects (subtle depth on scroll)?
    - Staggered card reveals (cards entering one by one as you scroll)?
    - Counter animations (numbers counting up when they enter viewport)?
    - Product screenshot entrance (floating up with the green glow intensifying)?
    - How aggressive? Awwwards wants motion, but CareerEdge's brand is restrained. Where's the line? restricted 

28. **Page transitions.** If this is a multi-page site (9 subpages), do we want:
    - Standard page loads (fast, reliable, boring)
    - SPA-style transitions with crossfades this
    - Signature transition (e.g., the green glow expanding to fill the screen between page loads)
    
29. **The hero animation.** What happens when the homepage first loads?
    - Headline types in (cursor effect, ties to the "live system" pattern from Axiom Zero)
    - Product screenshot fades up from the green glow
    - Elements stagger in (pill → headline → subtext → CTA → screenshot)
    - Minimal: everything is already there, the only motion is a subtle glow pulse
    - Something signature that becomes recognizable as "the CareerEdge moment" - variations, be creative

---

## SECURITY LEAD QUESTIONS

30. **Auth flow from landing page.** Login and Sign Up will route to auth pages. Confirm:
    - Sign up → onboarding flow (as per PRD Section 05)
    - Login → dashboard (if returning user)
    - Login → onboarding (if user exists but hasn't completed onboarding)
    - OAuth options: Google? Microsoft? LinkedIn? Email/password only?
    - Magic link option? - we had done this during onboarding

31. **Public data exposure.** The EdgeJobs and Explore Careers pages may show real data publicly. What's the comfort level?
    - Job listings: public titles/companies, apply requires auth?
    - Career data: public salary ranges and growth projections?
    - User counts or activity stats: real-time or curated?

---

## FINANCE LEAD QUESTIONS

32. **Pricing display strategy.** If pricing is shown:
    - Monthly only, annual only, or toggle?
    - Free tier prominent or hidden?
    - Enterprise "Contact us" tier?
    - EdgeGas credit economy — mentioned on landing page or too complex for first impression?

33. **The EdgeGas credit system** — do we explain it on the landing page? It's a differentiator (gamified engagement) but also complex. Mentioning it risks confusing newcomers. Ignoring it misses a unique selling point. Options:
    - Mention briefly in feature grid ("Earn credits as you progress")
    - Dedicated section explaining the economy
    - Save for in-app discovery this
    - Mention on the pricing page only

---

## COPY & MESSAGING DEEP-DIVE

### Consumer Psychology Considerations

34. **Loss aversion vs. aspiration.** Career marketing can go two ways:
    - **Fear-based:** "You're falling behind. Every day without a plan is a day wasted." (Effective but can feel manipulative)
    - **Aspiration-based:** "Your next chapter is waiting. Let's map it." (Warmer, aligns with brand, but less urgent)
    - **Problem-aware:** "Career planning shouldn't feel like guesswork." (Acknowledges pain without fear-mongering)
    
    Which emotional register should the landing page occupy?

35. **Specificity in claims.** Generic: "AI-powered career tools." Specific: "A personalized career roadmap in 4 minutes." Hyper-specific: "87% of users improve their ATS score by 20+ points in their first session."
    - How specific can we get? Do we have real data for specific claims?
    - If not, do we use projected/designed metrics, or stay general?

36. **The competitor contrast.** Should the landing page position against:
    - Job boards ("More than a job board — a career engine")
    - Career coaches ("The career coach that never sleeps, never judges, never bills by the hour")
    - LinkedIn ("The career tool LinkedIn should have been")
    - No direct competitor contrast — just stand on own merit
    
    I recommend against naming competitors. Position against the CATEGORY ("Job boards give you listings. We give you a plan.") not the BRAND.

37. **CTA copy.** "Get Your Edge" is the brand CTA. For the landing page, options:
    - "Get Your Edge" (brand-consistent)
    - "Start Free" (clear, low-commitment)
    - "Map Your Career" (outcome-specific)
    - "Get Started" (generic but proven)
    - "See Your Roadmap" (implies instant value)
    - Different CTAs at different scroll positions (hero: "Get Your Edge", mid-page after features: "Start Free", bottom: "Map Your Career Now")

---

## ENGINEERING QUESTIONS

38. **Tech approach for the landing page.** Options:
    - Build within the existing React/Vite app (shared codebase, faster to build, but landing page ships the entire app bundle)
    - Separate static site (Next.js, Astro, etc.) with links to the app for auth
    - **Within this Figma Make environment:** single React app with route-based code splitting — landing pages are lightweight routes, app surfaces are heavier routes
    
    Given our environment, we'll build it as part of the existing React app with the state-based surface switcher. The landing page routes will be simple components. Auth routes will transition to the onboarding/dashboard surfaces.

39. **Performance budget.** Awwwards sites are beautiful but often slow. For CareerEdge:
    - Hero LCP target: < 2.5s (with animations)
    - Total page weight: < 2MB (without product screenshots, which lazy-load)
    - Time to interactive: < 3s
    - Animations: GPU-accelerated only (transform, opacity), no layout-triggering animations

---

## QUESTIONS SPECIFICALLY ABOUT THE 3 VARIATIONS

40. **Variation differentiation.** When I produce 3 homepage variations, what axis should they differ on? - they should be distinct with dofferent philosophies but same content
    - **Visual style:** Same content, different visual treatments (e.g., V1: dark editorial, V2: dark/light rhythm, V3: bold/brutalist)
    - **Narrative strategy:** Same visual style, different story structures (e.g., V1: seeker-first emotional, V2: product-showcase technical, V3: social-proof-led credibility)
    - **Audience focus:** V1 targets seekers, V2 targets institutions, V3 tries to serve all equally
    - **A mix** of the above — each variation has a distinct visual AND narrative personality yes

41. **Which elements are LOCKED across all 3 variations?**
    - The CE logo and brand colors (obviously)
    - The nav structure (About, EdgeJobs, Explore Careers, EdgePath, Solutions dropdown, Login/Sign Up)?
    - The CTA copy?
    - The section order?
    - Or is everything negotiable?

42. **Awwwards calibration.** You said the standard is Awwwards. This means:
    - Typographic precision (tracking, leading, measure — every character matters)
    - At least one "signature moment" per variation (something a judge would screenshot)
    - Motion that serves narrative, not decoration
    - Technical execution that demonstrates mastery (no default shadows, no template gradients)
    - Restraint as a design choice (knowing what NOT to do)
    
    For calibration: should the variations lean more toward:
    - **SOTD (Site of the Day)** — polished, accessible, broadly impressive
    - **Developer Award** — technically ambitious, pushing browser capabilities
    - **Honorable Mention** — strong design, safe execution - hm all
    
    I'll aim for SOTD-level across all three. Confirm.

---

## SUMMARY: 42 Questions Across 9 Disciplines

| Discipline | Questions | Key Decisions |
|---|---|---|
| Sensitivity/Political | Q1-Q3 | Immigration language, government audience framing |
| AI Positioning | Q4-Q7 | How prominently to lead with AI, Sophia's presence, privacy |
| Design | Q8-Q12 | Dark/light rhythm, hero visual, typography, photography, logo |
| Product | Q13-Q18 | Conversion goal, audience priority, subpage scope |
| Brand | Q19-Q22 | Headline, voice, naming strategy |
| Marketing/Growth | Q23-Q26 | SEO, social proof, funnel model, pricing |
| Motion | Q27-Q29 | Scroll animations, transitions, hero animation |
| Security | Q30-Q31 | Auth flow, public data |
| Finance | Q32-Q33 | Pricing display, EdgeGas explanation |
| Copy/Psychology | Q34-Q37 | Emotional register, specificity, competitor contrast, CTA |
| Engineering | Q38-Q39 | Tech approach, performance |
| Variations | Q40-Q42 | Differentiation axis, locked elements, Awwwards target |

**Awaiting your answers. Take them in whatever order feels natural — batch by theme, rapid-fire, or stream of consciousness. I'll synthesize everything before touching a single line of code.**
