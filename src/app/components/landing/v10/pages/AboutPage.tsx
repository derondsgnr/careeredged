import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { AboutHero } from "../about/AboutHero";
import { Mission } from "../about/Mission";
import { Values } from "../about/Values";
import { StatsSection } from "../about/StatsSection";
import { Team } from "../about/Team";
import { AboutCTA } from "../about/AboutCTA";

export function AboutPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
        <AboutHero />
        <Mission />
        <Values />
        <StatsSection />
        <Team />
        <AboutCTA />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
