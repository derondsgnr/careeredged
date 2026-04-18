import { ScrollReveal } from "../animations/ScrollReveal";

export function Mission() {
  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — eyebrow + heading */}
          <div>
            <ScrollReveal variant="sm">
              <p className="text-eyebrow text-accent mb-8">Our mission</p>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="h2 text-text-primary">
                Everyone deserves a plan that fits who they actually are.
              </h2>
            </ScrollReveal>
          </div>

          {/* Right — body text */}
          <div>
            <ScrollReveal delay={1}>
              <p className="text-large text-text-secondary mb-8">
                Most career tools give you a list of jobs and call it guidance.
                We think that&apos;s backwards. You don&apos;t need more options — you
                need the right ones, mapped to your strengths, your goals, and
                your reality.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-large text-text-secondary mb-8">
                CareerEdge was built to close the gap between potential and
                opportunity. We combine behavioral science, labor market data,
                and AI to create career roadmaps that are genuinely personal.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={3}>
              <p className="text-large text-text-primary font-medium">
                Not templates. Not generic advice. A plan that&apos;s yours.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
