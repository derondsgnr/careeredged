import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { SolutionHero } from "../solutions/SolutionHero";
import { StatsBar } from "../solutions/StatsBar";
import { FeatureBeats } from "../solutions/FeatureBeats";
import { SolutionCTA } from "../solutions/SolutionCTA";

export function SolutionNGOsPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
      <SolutionHero
        eyebrow="For Non-Profit Organizations"
        headline="Multiply the impact of every program."
        subheadline="Manage programs, track community impact, and connect participants to resources that actually move them forward."
        primaryCTA={{ label: "Get in touch", href: "#contact" }}
        secondaryCTA={{ label: "Learn more", href: "#features" }}
        floatingCard={{ value: "2×", label: "employment outcomes for participants" }}
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
        patternColor="#B3FF3B"
      />

      <StatsBar
        stats={[
          { value: "2×", label: "Increase in participant employment outcomes" },
          { value: "78%", label: "Of funders report improved outcome visibility" },
          { value: "60%", label: "Reduction in program admin time" },
        ]}
        variant="dark"
        accentColor="#B3FF3B"
      />

      <FeatureBeats
        beats={[
          {
            tag: "Program Management",
            headline: "Manage programs without managing chaos.",
            body: "Track participant progress, manage cohorts, and document outcomes — all in one place. CareerEdge gives your team the visibility to catch problems early and celebrate wins as they happen.",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80",
          },
          {
            tag: "Impact Reporting",
            headline: "Tell your impact story with data.",
            body: "Generate funder-ready reports on career placements, salary outcomes, skill development, and community reach. Turn your participants' wins into the proof that sustains your mission.",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80",
          },
          {
            tag: "Participant Support",
            headline: "Every participant gets a real plan.",
            body: "Not a generic resource list. A personalized career roadmap built around each participant's background, goals, and local market. The guidance your team would give if there were time to give it to everyone.",
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80",
          },
        ]}
        accentColor="#B3FF3B"
      />

      <SolutionCTA
        headline="Your mission, at scale."
        body="Run better programs, prove impact, and serve more people."
        cta={{ label: "Get in touch", href: "#contact" }}
        patternColor="#B3FF3B"
      />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
