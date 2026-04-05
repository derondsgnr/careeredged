import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Hero } from "../sections/Hero";
import { Problem } from "../sections/Problem";
import { Shift } from "../sections/Shift";
import { HowItWorks } from "../sections/HowItWorks";
import { SocialProof } from "../sections/SocialProof";
import { Testimonials } from "../sections/Testimonials";
import { WhoItsFor } from "../sections/WhoItsFor";
import { FAQ } from "../sections/FAQ";
import { FinalCTA } from "../sections/FinalCTA";
import { Footer } from "../sections/Footer";

export function HomePage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Shift />
        <HowItWorks />
        <SocialProof />
        <Testimonials />
        <WhoItsFor />
        {/* <Pricing /> — moved to dedicated /pricing page */}
        <FAQ />
        <FinalCTA />
        {/* <CTABand /> — disabled */}
      </main>
      <Footer />
    </LandingWrapper>
  );
}
