import { ScrollReveal } from "../animations/ScrollReveal";
import { CountUp } from "../animations/CountUp";

const stats = [
  { end: 12, suffix: "K+", label: "Roadmaps built" },
  { end: 190, suffix: "+", label: "Countries reached" },
  { end: 4.9, suffix: "", label: "Average rating", decimals: 1 },
  { end: 4, suffix: " min", label: "To your first plan" },
];

export function StatsSection() {
  return (
    <section className="section section-dark">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-5">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} variant="sm" delay={i + 1}>
              <div className="text-center lg:text-left">
                <p className="text-stat mb-2">
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    staggerDelay={i * 200}
                  />
                </p>
                <p className="text-body opacity-50">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
