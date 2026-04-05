import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

export function AboutCTA() {
  return (
    <section className="section section-dark surface-glow-blue">
      <div className="container-main max-w-3xl mx-auto text-center">
        <ScrollReveal variant="lg">
          <h2 className="h2 mb-8">
            Ready to see what a real career plan looks like?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <p className="text-large opacity-70 mb-10 max-w-xl mx-auto">
            It takes 4 minutes. No credit card. No generic advice. Just a
            roadmap built around you.
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
      </div>
    </section>
  );
}
