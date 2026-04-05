import { ScrollReveal } from "../animations/ScrollReveal";

export function PricingHero() {
  return (
    <section className="section-hero bg-bg-primary">
      <div className="container-main text-center">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow text-accent mb-8">Pricing</p>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <h1 className="h1 text-text-primary mb-8 max-w-[800px] mx-auto">
            Start free. Upgrade when ready.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          <p className="text-large text-text-secondary max-w-[560px] mx-auto">
            The free plan gives you everything to build a real career plan. No
            credit card required. Upgrade when you need the full edge.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
