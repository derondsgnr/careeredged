import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { SolutionHero } from "../solutions/SolutionHero";
import { HowItWorksSteps } from "../solutions/HowItWorksSteps";
import { FeatureBeats } from "../solutions/FeatureBeats";
import { SolutionCTA } from "../solutions/SolutionCTA";

export function SolutionInstitutionsPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
      <SolutionHero
        eyebrow="For Educational Institutions"
        headline="Turn career services into a competitive advantage."
        subheadline="Give every student a personalized roadmap, track employment outcomes automatically, and demonstrate ROI to your institution's leadership — without adding headcount."
        primaryCTA={{ label: "Talk to us", href: "#contact" }}
        secondaryCTA={{ label: "See how it works", href: "#features" }}
        image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
        patternColor="#9FFF07"
      />

      <HowItWorksSteps
        eyebrow="How it works"
        headline="Outcome tracking, end to end."
        accentColor="#9FFF07"
        steps={[
          {
            title: "Enroll your students",
            description: "Connect your student population to CareerEdge in a single step. Every student gets a personalized career roadmap automatically.",
          },
          {
            title: "Track outcomes",
            description: "Monitor employment milestones, skill development, and job placement progress across your entire student body in real time.",
          },
          {
            title: "Report results",
            description: "Generate NACE/CSEA-aligned outcome reports on demand. Show leadership and accreditors exactly what your career services team delivers.",
          },
        ]}
      />

      <FeatureBeats
        beats={[
          {
            tag: "Compliance & Reporting",
            headline: "NACE/CSEA reporting without the spreadsheets.",
            body: "Automated outcome tracking aligned with NACE and CSEA standards. Generate reports, document employer relationships, and demonstrate ROI to your institution's leadership.",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80",
          },
          {
            tag: "Career Fair Tools",
            headline: "Virtual and in-person, coordinated.",
            body: "Manage employer relationships, student registrations, and event logistics in one place. CareerEdge handles the coordination so your team can focus on the conversations.",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=700&q=80",
          },
          {
            tag: "Employer Partnerships",
            headline: "Connect students to the right employers.",
            body: "Students are matched with employers based on their roadmaps and stated career goals — not generic applications. Your employer partners get better candidates. Your students get more relevant opportunities.",
            image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&q=80",
          },
        ]}
        accentColor="#9FFF07"
      />

      <SolutionCTA
        headline="Better outcomes for every student."
        body="Turn career services into a true competitive advantage for your institution."
        cta={{ label: "Talk to us", href: "#contact" }}
        patternColor="#9FFF07"
      />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
