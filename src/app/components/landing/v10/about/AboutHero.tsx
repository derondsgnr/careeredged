import { ScrollReveal } from "../animations/ScrollReveal";
import { ScrollTextReveal } from "../animations/ScrollTextReveal";

export function AboutHero() {
  return (
    <section className="section-hero section-dark">
      <div className="container-main">
        <div className="max-w-[960px] mx-auto text-center">
          <ScrollReveal variant="sm">
            <p className="text-eyebrow text-accent mb-8">About CareerEdge</p>
          </ScrollReveal>

          <ScrollTextReveal className="h1 mb-10">
            Career intelligence that maps where you are to where you belong.
          </ScrollTextReveal>

          <ScrollReveal delay={2}>
            <p className="text-large opacity-70 max-w-[600px] mx-auto mb-12">
              Guided by Sophia. Built around your journey. We believe everyone
              deserves a career plan that&apos;s actually personal.
            </p>
          </ScrollReveal>
        </div>

        {/* Hero image — wide cinematic aspect */}
        <ScrollReveal delay={3}>
          <div className="rounded-[var(--radius-lg)] overflow-hidden mt-8 aspect-[21/9]">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
              alt="Team collaboration"
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
