import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { SolutionHero } from "../solutions/SolutionHero";
import { ProgramTypes } from "../solutions/ProgramTypes";
import { HowItWorksSteps } from "../solutions/HowItWorksSteps";
import { SolutionCTA } from "../solutions/SolutionCTA";

export function SolutionGovernmentPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
      <SolutionHero
        eyebrow="For Government Agencies"
        headline="Workforce development built for the real world."
        subheadline="Targeted career programs, participant outcome tracking, and real opportunity for underserved communities — at scale."
        primaryCTA={{ label: "Get in touch", href: "#contact" }}
        secondaryCTA={{ label: "Learn more", href: "#features" }}
        proofStats={[
          { value: "40%", label: "faster time-to-placement" },
          { value: "3×", label: "program capacity" },
          { value: "60%", label: "less admin overhead" },
        ]}
        image="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&q=80"
        patternColor="#14A9FF"
      />

      <ProgramTypes
        eyebrow="Program types"
        headline="Built for the programs you run."
        accentColor="#14A9FF"
        programs={[
          {
            title: "Workforce Reentry",
            description: "Support individuals re-entering the workforce with personalized roadmaps, employer connections, and milestone tracking.",
            featured: true,
          },
          {
            title: "Youth Employment",
            description: "Connect young adults to career pathways with structured plans, mentorship, and skills development.",
          },
          {
            title: "Underserved Communities",
            description: "Deliver career services to populations with limited professional networks and non-traditional backgrounds.",
          },
        ]}
      />

      <HowItWorksSteps
        eyebrow="How it works"
        headline="From enrollment to outcome report."
        accentColor="#14A9FF"
        steps={[
          {
            title: "Enroll participants",
            description: "Add participants individually or in bulk. CareerEdge generates a personalized roadmap for each one automatically.",
          },
          {
            title: "Monitor milestones",
            description: "Track progress across all cohorts in real time. Identify who needs support before they fall behind.",
          },
          {
            title: "Report outcomes",
            description: "Generate funder-aligned outcome reports with a click. Placement rates, salary outcomes, program completion.",
          },
        ]}
      />

      <SolutionCTA
        headline="Career programs that create lasting change."
        body="Connect your agency with the tools to deliver real career outcomes for the communities you serve."
        cta={{ label: "Get in touch", href: "#contact" }}
        patternColor="#14A9FF"
      />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
