import { ScrollReveal } from "../animations/ScrollReveal";

const painPoints = [
  "Scrolling hundreds of job listings at midnight. None of them feel right.",
  "Taking career quizzes that generate a PDF you screenshot and never open again.",
  "Asking friends for advice and getting \"follow your passion.\"",
  "Reading LinkedIn posts that make everyone else's career look effortless.",
  "Rewriting your resume for the fifth time, still not sure if it even works.",
];

export function Problem() {
  return (
    <section className="section section-dark">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left */}
          <div>
            <ScrollReveal variant="sm">
              <span className="text-eyebrow text-accent mb-6 block">The reality</span>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h2 className="h2 mb-8">
                You&apos;ve been here before.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-large opacity-70 max-w-lg">
                The tools you&apos;ve tried weren&apos;t built around you. They were built for everyone — which means they work for no one.
              </p>
            </ScrollReveal>
          </div>

          {/* Right — Pain list */}
          <div className="flex flex-col gap-4">
            {painPoints.map((point, i) => (
              <ScrollReveal key={i} variant="sm" delay={i + 1}>
                <div className="card-fill-hover flex gap-4 items-start p-4 rounded-[var(--radius-lg)] surface-glass group cursor-default">
                  <div className="w-1 h-full min-h-[24px] opacity-20 bg-current rounded-full group-hover:bg-[#9FFF07] group-hover:opacity-100 transition-all duration-500 shrink-0 mt-1" />
                  <p className="text-body opacity-80 group-hover:opacity-100 transition-opacity duration-500 relative z-[1]">
                    {point}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
