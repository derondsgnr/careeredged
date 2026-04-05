import { ScrollReveal } from "../animations/ScrollReveal";

interface TestimonialProps {
  quote: string;
  name: string;
  context: string;
  accentColor?: string;
}

export function Testimonial({ quote, name, context, accentColor = "#009EFA" }: TestimonialProps) {
  return (
    <section className="section bg-bg-darker-gray">
      <div className="container-main max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Quote */}
            <div className="flex-1">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={accentColor}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-large text-text-primary mb-8">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                  <span className="text-sm font-semibold" style={{ color: accentColor }}>
                    {name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{name}</p>
                  <p className="text-small text-text-secondary">{context}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
