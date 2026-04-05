import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { SolutionHero } from "../solutions/SolutionHero";
import { StatsBar } from "../solutions/StatsBar";
import { FeatureBeats } from "../solutions/FeatureBeats";
import { Testimonial } from "../solutions/Testimonial";
import { SolutionCTA } from "../solutions/SolutionCTA";

export function SolutionEmployersPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
      <SolutionHero
        eyebrow="For Employers"
        headline="Hire people built for the role."
        subheadline="Stop reviewing resumes that don't match. Start connecting with candidates who have already mapped their career intent toward roles like yours."
        primaryCTA={{ label: "Request a demo", href: "#contact" }}
        secondaryCTA={{ label: "See how it works", href: "#features" }}
        image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
        patternColor="#14A9FF"
      />

      <StatsBar
        stats={[
          { value: "250+", label: "Average applications per role", note: "Most are generic and unqualified" },
          { value: "12", label: "Actually qualified candidates (out of 250)" },
          { value: "3×", label: "More relevant applications with CareerEdge", note: "Because candidates have mapped their career intent" },
        ]}
        accentColor="#14A9FF"
      />

      <FeatureBeats
        beats={[
          {
            tag: "Smart Matching",
            headline: "Signal, not noise.",
            body: "EdgeSight analyzes candidate roadmaps and career goals to surface genuine matches — not keyword hits. You see candidates who have actively mapped their path toward roles like yours. Less noise. Better signal.",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=80",
          },
          {
            tag: "Career Fair Tools",
            headline: "Meet candidates before they're available.",
            body: "Host virtual or in-person career fairs and connect with pre-qualified candidates from partner universities and communities. Your employer brand reaches people early — when decisions are still forming.",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=700&q=80",
          },
          {
            tag: "Hiring Analytics",
            headline: "Understand your pipeline, finally.",
            body: "Visibility into pipeline quality, candidate conversion, and hire-to-match accuracy. Understand your employer brand from the candidate side. Know what draws them to you — and what doesn't.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
          },
        ]}
        accentColor="#14A9FF"
      />

      <Testimonial
        quote="We used to spend three weeks screening before finding a qualified shortlist. With CareerEdge, we had 12 genuine candidates in the first 48 hours. The quality difference was obvious."
        name="Marcus T."
        context="Head of Talent, Series B startup"
        accentColor="#14A9FF"
      />

      <SolutionCTA
        headline="The right hire starts with the right match."
        body="Stop paying for volume. Start hiring for fit."
        cta={{ label: "Request a demo", href: "#contact" }}
        patternColor="#14A9FF"
      />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
