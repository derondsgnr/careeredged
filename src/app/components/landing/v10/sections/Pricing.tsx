import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to discover your path and start moving.",
    features: [
      "Career discovery assessment",
      "Personalized roadmap",
      "Resume scoring",
      "Community access",
      "Job matching (5/month)",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Edge Plus",
    price: "$19",
    period: "/ month",
    description: "For professionals who are actively in transition and need every edge.",
    features: [
      "Everything in Free",
      "Unlimited job matching",
      "Interview prep for any role",
      "Priority job matching",
      "Mentor connections",
      "Progress analytics",
    ],
    cta: "Start Edge Plus",
    featured: true,
  },
  {
    name: "Edge Pro",
    price: "$49",
    period: "/ month",
    description: "For leaders and teams who want the full intelligence layer.",
    features: [
      "Everything in Edge Plus",
      "Advanced career analytics",
      "Employer visibility features",
      "Priority support",
      "Team accounts available",
    ],
    cta: "Start Edge Pro",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <div className="text-center mb-16 relative">
          {/* Watermark (Scalient "PRICING" SVG treatment) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <span className="text-[200px] font-bold leading-none tracking-[-8px] opacity-[0.03] text-text-primary uppercase">Pricing</span>
          </div>

          <ScrollReveal variant="sm">
            <p className="text-eyebrow text-accent mb-8">Pricing</p>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <h2 className="h2 text-text-primary mb-4">
              Start free. Upgrade when ready.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <p className="text-large text-text-secondary max-w-2xl mx-auto">
              The free plan gives you everything to build a real career plan. No credit card required.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 max-w-[960px] mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} variant="sm" delay={i + 1}>
              <div
                className={`rounded-[var(--radius-lg)] p-6 h-full flex flex-col border ${
                  plan.featured
                    ? "bg-[#00253A] text-white border-[#00253A] dark:bg-white dark:text-[#12110E] dark:border-white"
                    : "bg-bg-card text-text-primary border-border-light"
                }`}
              >
                {/* Plan name — small, quiet label */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium tracking-[-0.2px]">{plan.name}</span>
                  {plan.featured && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#B3FF3B] text-[#B3FF3B]">
                      Popular
                    </span>
                  )}
                </div>

                {/* Price — the visual anchor, but not screaming */}
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-[36px] leading-[1] tracking-[-1.5px] font-normal">{plan.price}</span>
                  <span className={`text-sm ${plan.featured ? "opacity-50" : "text-text-secondary"}`}>
                    {plan.period}
                  </span>
                </div>

                {/* Description */}
                <p className={`text-sm mb-8 ${plan.featured ? "opacity-60" : "text-text-secondary"}`}>
                  {plan.description}
                </p>

                {/* Divider */}
                <div className={`h-px mb-6 ${plan.featured ? "bg-white/10 dark:bg-[#12110E]/10" : "bg-border-light"}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-accent shrink-0 mt-[3px]"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className={`text-sm leading-[20px] ${plan.featured ? "opacity-70" : "text-text-secondary"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/signup"
                  className={`btn text-center w-full ${
                    plan.featured ? "btn-inverted" : "btn-primary"
                  }`}
                >
                  <BtnText>{plan.cta}</BtnText>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
