import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { Pricing } from "../sections/Pricing";
import { FAQ } from "../sections/FAQ";
import { PricingHero } from "../pricing/PricingHero";
import { PricingCompare } from "../pricing/PricingCompare";

export function PricingPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
        <PricingHero />
        <Pricing />
        <PricingCompare />
        <FAQ />
      </main>
      <Footer />
    </LandingWrapper>
  );
}
