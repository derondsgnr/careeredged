import { useState } from "react";
import { ScrollReveal } from "../animations/ScrollReveal";
import { textSafeColor } from "../lib/colors";

interface Stage {
  title: string;
  description: string;
  cta: string;
  image: string;
}

interface StageSelectorProps {
  eyebrow: string;
  headline: string;
  stages: Stage[];
  accentColor?: string;
}

export function StageSelector({ eyebrow, headline, stages, accentColor = "#009EFA" }: StageSelectorProps) {
  const [active, setActive] = useState(0);

  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow mb-8" style={{ color: textSafeColor(accentColor) }}>{eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delay={1}>
          <h2 className="h2 text-text-primary mb-16">{headline}</h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — options */}
          <div className="flex flex-col gap-2">
            {stages.map((stage, i) => (
              <ScrollReveal key={stage.title} variant="sm" delay={i + 1}>
                <button
                  onClick={() => setActive(i)}
                  className={`w-full text-left p-6 rounded-[var(--radius-lg)] transition-all duration-500 border ${
                    active === i
                      ? "bg-bg-card border-border-light"
                      : "bg-transparent border-transparent hover:bg-bg-card/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-large font-medium text-text-primary mb-2">{stage.title}</p>
                      <p className={`text-body text-text-secondary transition-all duration-500 ${active === i ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                        {stage.description}
                      </p>
                    </div>
                    <span className="text-sm shrink-0 mt-1" style={{ color: textSafeColor(accentColor) }}>{stage.cta}</span>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Right — image */}
          <ScrollReveal className="hidden lg:block">
            <div className="sticky top-32 rounded-[var(--radius-lg)] overflow-hidden aspect-[4/3]">
              {stages.map((stage, i) => (
                <img
                  key={stage.title}
                  src={stage.image}
                  alt={stage.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
