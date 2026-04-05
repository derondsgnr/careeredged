import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { SolutionHero } from "../solutions/SolutionHero";
import { StageSelector } from "../solutions/StageSelector";
import { FeatureBeats } from "../solutions/FeatureBeats";
import { Testimonial } from "../solutions/Testimonial";
import { SolutionCTA } from "../solutions/SolutionCTA";

export function SolutionIndividualsPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
      <SolutionHero
        eyebrow="CareerEdge — For Career Seekers"
        headline="One plan, built around you."
        subheadline="A personalized career plan with phases, milestones, and job matches — built around who you actually are."
        primaryCTA={{ label: "Get Your Roadmap", href: "/signup" }}
        secondaryCTA={{ label: "See how it works", href: "#features" }}
        proofStats={[
          { value: "12,000+", label: "professionals" },
          { value: "4.9 / 5", label: "avg rating" },
          { value: "4 min", label: "to your roadmap" },
        ]}
        floatingCard={{ value: "23", label: "roles matched to your profile", cta: "View matches →" }}
        image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
        patternColor="#9FFF07"
      />

      <StageSelector
        eyebrow="Where you are"
        headline="Built for wherever you are in your career."
        accentColor="#9FFF07"
        stages={[
          {
            title: "Students & New Grads",
            description: "Turn your degree into direction. Get a roadmap before you need a job.",
            cta: "Start here →",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80",
          },
          {
            title: "Career Changers",
            description: "Your experience transfers further than you think. See how.",
            cta: "Explore this →",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
          },
          {
            title: "International Professionals",
            description: "Navigate a new market with guidance built for your situation.",
            cta: "Learn more →",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
          },
          {
            title: "Rising Leaders",
            description: "You know the destination. Get the milestones to get there faster.",
            cta: "See the path →",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=80",
          },
        ]}
      />

      <FeatureBeats
        beats={[
          {
            tag: "Career Discovery",
            headline: "We start by listening.",
            body: "Answer a few questions about your experience, goals, and how you work best. In about 4 minutes, CareerEdge builds a profile of your strengths and career patterns — not from a template, but from what makes you different.",
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80",
          },
          {
            tag: "Career Roadmap",
            headline: "Then we build your roadmap.",
            body: "A personalized career plan with clear phases, skill milestones, and a timeline that fits your life. See which careers match your profile, what they pay, and exactly what it takes to get there.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
          },
          {
            tag: "Resume & Interview Prep",
            headline: "We get your resume ready.",
            body: "Upload your resume and get it scored instantly. See exactly where it falls short, what to fix, and how to make it speak the language that hiring systems and real humans want to read.",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&q=80",
          },
        ]}
        accentColor="#9FFF07"
      />

      <Testimonial
        quote="I spent months scrolling job listings feeling overwhelmed. CareerEdge gave me a structure I actually understood. I went from 'applying everywhere' to knowing the exact 3 roles I should be targeting. Three months later, I'm in one of them."
        name="Amara K."
        context="Career changer, now in product operations"
        accentColor="#9FFF07"
      />

      <SolutionCTA
        headline="Every week without a plan is a week of guessing."
        body="The roadmap takes 4 minutes. The clarity lasts."
        cta={{ label: "Get Your Roadmap", href: "/signup" }}
        patternColor="#9FFF07"
      />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
