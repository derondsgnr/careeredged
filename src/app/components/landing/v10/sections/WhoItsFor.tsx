import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";

const seekerCards = [
  {
    title: "Students & New Grads",
    headline: "Turn your potential into a concrete plan.",
    description: "Degree in hand, next step unclear? Turn your potential into a concrete plan.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  },
  {
    title: "Career Changers",
    headline: "Your experience transfers further than you think.",
    description: "Ready for something different? Discover careers that match your strengths, not just your last title.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    title: "Global Professionals",
    headline: "Navigate a new market with confidence.",
    description: "Building a career in a new country? Navigate the path with guidance built for your situation.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
  {
    title: "Rising Leaders",
    headline: "Get the roadmap to get there faster.",
    description: "You know where you want to be. Get the roadmap and accountability to get there faster.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
  },
];

const orgLinks = [
  { label: "Employers", href: "/solutions/employers" },
  { label: "Institutions", href: "/solutions/institutions" },
  { label: "Government", href: "/solutions/government" },
  { label: "NGOs", href: "/solutions/ngos" },
];

export function WhoItsFor() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth || 600;
    const gap = 20;
    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  // Auto-scroll every 5s
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        const el = scrollRef.current;
        if (!el) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }, 5000);
    };

    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [scroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        {/* Header with arrows */}
        <div className="flex justify-between items-end mb-20">
          <div>
            <ScrollReveal variant="sm">
              <p className="text-eyebrow text-accent mb-8">For everyone</p>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="h2 text-text-primary">
                Built for wherever you are.
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="sm" delay={2}>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className={`w-12 h-12 rounded-full border border-border-light flex items-center justify-center transition-opacity duration-300 ${
                  canScrollLeft ? "opacity-100 hover:bg-bg-darker-gray" : "opacity-30 cursor-default"
                }`}
                disabled={!canScrollLeft}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className={`w-12 h-12 rounded-full border border-border-light flex items-center justify-center transition-opacity duration-300 ${
                  canScrollRight ? "opacity-100 hover:bg-bg-darker-gray" : "opacity-30 cursor-default"
                }`}
                disabled={!canScrollRight}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Cards — 2 visible, horizontal scroll */}
        <ScrollReveal>
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 testimonial-scroll snap-x snap-mandatory"
          >
            {seekerCards.map((card) => (
              <div
                key={card.title}
                data-card
                className="shrink-0 w-[calc(50%-10px)] snap-start rounded-[var(--radius-lg)] overflow-hidden flex flex-col"
              >
                {/* Image with title overlay */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-[28px] leading-[1.2] tracking-[-0.48px] font-normal text-white">{card.title}</h3>
                  </div>
                </div>

                {/* Description + CTA */}
                <div className="bg-bg-card p-8 flex-1 flex flex-col">
                  <p className="text-large text-text-primary font-medium mb-3">{card.headline}</p>
                  <p className="text-body text-text-secondary mb-6 flex-1">{card.description}</p>
                  <Link to="/signup" className="text-btn text-accent inline-flex items-center gap-2">
                    Get started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Organizations row — untouched */}
        <ScrollReveal>
          <div className="content-divider mt-20 mb-12" />
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8">
            <div className="max-w-xl">
              <p className="text-eyebrow text-accent mb-4">For organizations</p>
              <p className="text-large text-text-secondary">
                CareerEdge partners with employers, universities, government agencies, and NGOs to drive career outcomes at scale.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {orgLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="btn btn-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
