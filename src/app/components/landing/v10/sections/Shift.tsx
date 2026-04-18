import { ScrollReveal } from "../animations/ScrollReveal";
import { ScrollTextReveal } from "../animations/ScrollTextReveal";

export function Shift() {
  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        {/* Header block — max 630px like Anorva's .header-tittle-section-card */}
        <ScrollReveal variant="sm">
          <p className="text-eyebrow text-accent mb-8">A different way</p>
        </ScrollReveal>

        <ScrollTextReveal className="h2 text-text-primary max-w-[800px] mb-20">
          What if someone actually mapped it out for you?
        </ScrollTextReveal>

        {/* 2-column editorial layout like Anorva's case study block */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Left — text content */}
          <ScrollReveal delay={1}>
            <div className="bg-bg-card rounded-[var(--radius-lg)] p-8 lg:p-10 h-full">
              <p className="text-large text-text-primary mb-8">
                Not a list of jobs. Not a personality quiz result you screenshot and forget. A real career roadmap — with phases, milestones, timelines, and jobs that match who you actually are.
              </p>
              <p className="text-large text-text-secondary mb-8">
                CareerEdge starts by understanding you. Not just your resume — your strengths, how you think, what environments you thrive in, where you want to be in two years.
              </p>
              <p className="text-large text-text-primary font-medium">
                Then it builds the plan to get you there.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — editorial image */}
          <ScrollReveal delay={2}>
            <div className="rounded-[var(--radius-lg)] overflow-hidden h-full min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80"
                alt="Team planning session"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
