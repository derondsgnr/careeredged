import { ScrollReveal } from "../animations/ScrollReveal";

const values = [
  {
    title: "Empathy first",
    description:
      "We build for real people in real transitions — not personas on a whiteboard. Every feature starts with the question: does this actually help someone move forward?",
  },
  {
    title: "Radical personalization",
    description:
      "Generic doesn't work. We treat every user's strengths, goals, and context as unique because they are. Our roadmaps reflect who you are, not who the algorithm thinks you should be.",
  },
  {
    title: "Clarity over complexity",
    description:
      "Career planning is already stressful. We strip away the noise and give you a clear path, clear milestones, and clear next steps. No jargon. No fluff.",
  },
  {
    title: "Global by default",
    description:
      "Careers don't stop at borders. We build for professionals in 190+ countries, with labor market intelligence that understands local context and global opportunity.",
  },
];

export function Values() {
  return (
    <section className="section section-darker-gray">
      <div className="container-main">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow text-accent mb-8">What we believe</p>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <h2 className="h2 text-text-primary mb-20">
            Built on principles, not assumptions.
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-5">
          {values.map((value, i) => (
            <ScrollReveal key={value.title} variant="sm" delay={i + 1}>
              <div className="bg-bg-card rounded-[var(--radius-lg)] border border-border-light p-8 lg:p-10 h-full card-fill-hover">
                <p className="h6 text-text-primary mb-4 relative z-[1]">{value.title}</p>
                <p className="text-body text-text-secondary relative z-[1]">
                  {value.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
