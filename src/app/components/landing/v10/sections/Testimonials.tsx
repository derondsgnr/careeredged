import { ScrollReveal } from "../animations/ScrollReveal";

const testimonials = [
  {
    num: "01",
    quote:
      "CareerEdge showed me which careers fit my strengths and mapped exactly how to get there. I landed my first role 8 weeks after graduating.",
    name: "Chisom O.",
    context: "New grad, first product role",
    tag: "Career Discovery",
  },
  {
    num: "02",
    quote:
      "CareerEdge gave me an actual plan in 10 minutes. For the first time, I knew exactly what to do next instead of endlessly scrolling job boards.",
    name: "Damilola A.",
    context: "Marketing → UX Design",
    tag: "Career Change",
  },
  {
    num: "03",
    quote:
      "CareerEdge mapped the path for my new market and helped me translate my experience. I'm two roles ahead of where I expected to be.",
    name: "Sarah K.",
    context: "International professional, fintech",
    tag: "Global",
  },
  {
    num: "04",
    quote:
      "My resume was getting ignored. CareerEdge scored it, rewrote the weak spots, and prepped me for interviews. Two callbacks in the first week.",
    name: "James M.",
    context: "Senior developer, career pivot",
    tag: "Resume Prep",
  },
  {
    num: "05",
    quote:
      "As an international student, I had no idea how to break into the UK market. CareerEdge gave me a roadmap specific to my visa and my skills.",
    name: "Priya R.",
    context: "International student, data analytics",
    tag: "Roadmap",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#F59E0B]">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="shrink-0 w-[460px] bg-bg-card rounded-[var(--radius-lg)] border border-border-light p-8 flex flex-col transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
      {/* Top: number + stars */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-text-secondary">{t.num}</span>
        <Stars />
      </div>

      {/* Tag */}
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-border-light text-text-secondary self-start mb-6">
        {t.tag}
      </span>

      {/* Quote */}
      <blockquote className="text-body text-text-primary leading-relaxed mb-8 flex-1">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Divider */}
      <div className="h-px bg-border-light mb-5" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center">
          <span className="text-xs font-semibold text-accent">
            {t.name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{t.name}</p>
          <p className="text-small text-text-secondary">{t.context}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="section section-darker-gray overflow-hidden">
      <div className="container-main" style={{ marginBottom: "112px" }}>
        <ScrollReveal variant="sm">
          <p className="text-eyebrow text-accent mb-8">What they say</p>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <h2 className="h2 text-text-primary">
            Real plans. Real movement.
          </h2>
        </ScrollReveal>
      </div>

      {/* Marquee with edge fade */}
      <div className="relative">
        {/* Edge fades */}
        <div className="testimonial-fade-left absolute left-0 top-0 bottom-0 w-40 z-10 pointer-events-none" />
        <div className="testimonial-fade-right absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="marquee-testimonials flex gap-6 w-max">
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.num}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
