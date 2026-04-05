import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

export function FinalCTA() {
  return (
    <section className="section section-dark surface-glow-blue">
      <div className="container-main max-w-3xl mx-auto text-center">
        <ScrollReveal variant="lg">
          <h2 className="h2 mb-8 max-w-[700px] mx-auto">
            <span className="text-reveal">
              <span className="text-reveal-inner">
                Every week without a plan is a week of guessing.
              </span>
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <p className="text-large opacity-70 mb-10 max-w-xl mx-auto">
            You&apos;ve read this far because something needs to change. The roadmap takes 4 minutes. The clarity lasts.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          <Link to="/signup" className="btn btn-inverted inline-flex items-center gap-2">
            <BtnText>
              <span className="inline-flex items-center gap-2">
                Get Your Roadmap
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </BtnText>
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={3}>
          <p className="text-small opacity-40 mt-6 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9FFF07] inline-block" />
            Free. No credit card. Takes 4 minutes.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
