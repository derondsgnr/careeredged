import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

interface SolutionCTAProps {
  headline: string;
  body: string;
  cta: { label: string; href: string };
  patternColor?: string;
}

export function SolutionCTA({ headline, body, cta, patternColor = "#14A9FF" }: SolutionCTAProps) {
  return (
    <section className="section section-dark">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Accent pattern bleed */}
          <div
            className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: patternColor }}
          />

          <ScrollReveal variant="lg">
            <h2 className="h2 mb-8 max-w-[700px] mx-auto">{headline}</h2>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <p className="text-large opacity-70 mb-10 max-w-xl mx-auto">{body}</p>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <Link to={cta.href} className="btn btn-primary"><BtnText>{cta.label}</BtnText></Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
