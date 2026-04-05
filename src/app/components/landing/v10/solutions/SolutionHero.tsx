import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";
import patternCe from "../../../../../assets/pattern-ce.svg";

interface ProofStat {
  value: string;
  label: string;
}

interface SolutionHeroProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  proofStats?: ProofStat[];
  floatingCard?: { value: string; label: string; cta?: string };
  image: string;
  patternColor?: string;
}

export function SolutionHero({
  eyebrow,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  proofStats,
  floatingCard,
  image,
  patternColor = "#009EFA",
}: SolutionHeroProps) {
  return (
    <section className="section-hero section-dark">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <ScrollReveal variant="sm">
              <p className="text-eyebrow opacity-50 mb-8">{eyebrow}</p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="h2 mb-6">{headline}</h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-large opacity-70 mb-10 max-w-[480px]">{subheadline}</p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-wrap gap-3">
                <Link to={primaryCTA.href} className="btn btn-primary">
                  <BtnText>{primaryCTA.label}</BtnText>
                </Link>
                {secondaryCTA && (
                  <Link to={secondaryCTA.href} className="btn btn-secondary">
                    <BtnText>{secondaryCTA.label}</BtnText>
                  </Link>
                )}
              </div>
            </ScrollReveal>

            {/* Proof bar */}
            {proofStats && (
              <ScrollReveal delay={4}>
                <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
                  {proofStats.map((s) => (
                    <div key={s.label}>
                      <p className="text-[24px] leading-[1.2] tracking-[-0.48px] font-normal">{s.value}</p>
                      <p className="text-sm opacity-50">{s.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right — image with pattern accent */}
          <ScrollReveal delay={2} className="relative">
            <div className="aspect-[4/3] rounded-[var(--radius-xl)] overflow-hidden relative">
              <img src={image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B0E]/40 to-transparent" />
            </div>
            {/* Lime green pattern card behind image */}
            <div className="absolute -bottom-4 -right-4 w-[45%] h-[65%] rounded-[var(--radius-xl)] overflow-hidden -z-10">
              <div className="absolute inset-0 bg-[#9FFF07]" />
              <img
                src={patternCe}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                style={{ filter: "brightness(0.4) saturate(0.5)" }}
              />
            </div>
            {/* Floating card */}
            {floatingCard && (
              <div className="absolute bottom-6 left-6 bg-[#111820] rounded-[var(--radius-lg)] p-5 border border-white/10">
                <p className="text-[28px] leading-[1.1] tracking-[-0.48px] font-normal text-white">{floatingCard.value}</p>
                <p className="text-sm text-white/60">{floatingCard.label}</p>
                {floatingCard.cta && (
                  <p className="text-xs text-accent mt-2">{floatingCard.cta}</p>
                )}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
