import { ScrollReveal } from "../animations/ScrollReveal";

interface Step {
  title: string;
  description: string;
}

interface HowItWorksStepsProps {
  eyebrow: string;
  headline: string;
  steps: Step[];
  accentColor?: string;
}

export function HowItWorksSteps({ eyebrow, headline, steps, accentColor = "#009EFA" }: HowItWorksStepsProps) {
  return (
    <section className="section section-dark">
      <div className="container-main">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow opacity-50 mb-8">{eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delay={1}>
          <h2 className="h2 mb-20">{headline}</h2>
        </ScrollReveal>

        <div className={`grid gap-6 ${steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} variant="sm" delay={i + 1}>
              <div className="bg-current/5 rounded-[var(--radius-lg)] p-8 h-full relative overflow-hidden group">
                {/* Step number accent */}
                <span
                  className="text-[96px] leading-none font-normal absolute -top-4 -right-2 opacity-[0.06]"
                  style={{ color: accentColor }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-6" style={{ background: `${accentColor}20`, color: accentColor }}>
                    {i + 1}
                  </div>
                  <p className="text-large font-medium mb-3">{step.title}</p>
                  <p className="text-body opacity-60">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
