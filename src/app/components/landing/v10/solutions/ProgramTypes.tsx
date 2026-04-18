import { ScrollReveal } from "../animations/ScrollReveal";
import { textSafeColor } from "../lib/colors";

interface Program {
  title: string;
  description: string;
  featured?: boolean;
}

interface ProgramTypesProps {
  eyebrow: string;
  headline: string;
  programs: Program[];
  accentColor?: string;
}

export function ProgramTypes({ eyebrow, headline, programs, accentColor = "#B3FF3B" }: ProgramTypesProps) {
  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow mb-8" style={{ color: textSafeColor(accentColor) }}>{eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delay={1}>
          <h2 className="h2 text-text-primary mb-16">{headline}</h2>
        </ScrollReveal>

        <div className={`grid gap-5 ${programs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {programs.map((p, i) => (
            <ScrollReveal key={p.title} variant="sm" delay={i + 1}>
              <div
                className={`rounded-[var(--radius-lg)] p-8 h-full border transition-colors duration-500 ${
                  p.featured
                    ? "bg-[#00253A] text-white border-[#00253A]"
                    : "bg-bg-card text-text-primary border-border-light"
                }`}
              >
                {p.featured && (
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4 inline-block"
                    style={{ background: `${accentColor}20`, color: accentColor }}
                  >
                    Featured
                  </span>
                )}
                <h3 className="text-large font-medium mb-3">{p.title}</h3>
                <p className={`text-body ${p.featured ? "opacity-70" : "text-text-secondary"}`}>{p.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
