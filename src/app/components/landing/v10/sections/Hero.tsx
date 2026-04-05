import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";
import patternHex from "../../../../../assets/pattern-hex.svg";
import patternCe from "../../../../../assets/pattern-ce.svg";

export function Hero() {
  return (
    <section className="section-hero bg-bg-primary relative overflow-hidden">
      {/* Hex grid pattern overlay (Scalient hero bg treatment) */}
      <img
        src={patternHex}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none"
      />

      <div className="container-main relative">
        {/* Centered hero content */}
        <div className="max-w-[960px] mx-auto text-center">
          <ScrollReveal variant="sm">
            <p className="text-eyebrow text-accent mb-8">CareerEdge</p>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <h1 className="h2 text-text-primary mb-8">
              <span className="text-reveal">
                <span className="text-reveal-inner">
                  Your career is personal. Your plan should be too.
                </span>
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <p className="text-large text-text-secondary mb-10 max-w-[540px] mx-auto">
              CareerEdge builds a career roadmap around who you actually are — your strengths, your goals, your timeline. Not a template. Not generic advice. A plan that&apos;s yours.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={3}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/signup" className="btn btn-primary">
                <BtnText>Get Your Roadmap</BtnText>
              </Link>
              <a href="#how-it-works" className="btn btn-secondary">
                <BtnText>See how it works</BtnText>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero image grid — 3-column like Anorva */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          <ScrollReveal variant="sm" delay={1}>
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-bg-darker-gray">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80"
                alt="Professional woman"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          {/* Middle card — lime green with arrow pattern */}
          <ScrollReveal variant="sm" delay={2}>
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden relative">
              {/* Lime green background */}
              <div className="absolute inset-0 bg-[#9FFF07]" />
              {/* Arrow pattern overlay — brand motif */}
              <img
                src={patternCe}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                style={{ filter: "brightness(0.4) saturate(0.5)" }}
              />
              {/* Content */}
              <div className="relative h-full p-8 flex flex-col justify-end">
                <p className="text-[80px] leading-[1] tracking-tight font-normal text-[#12110E]">12K+</p>
                <p className="text-body text-[#12110E]/70 mt-2">Roadmaps built for professionals across 190 countries</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="sm" delay={3}>
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-bg-darker-gray">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                alt="People collaborating"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
