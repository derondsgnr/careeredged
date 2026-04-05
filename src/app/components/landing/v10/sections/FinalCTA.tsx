import { useRef, useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

// ─── Brand shapes that spawn on cursor movement ──────────

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  shape: number;
  opacity: number;
}

/** Small brand-pattern SVG shapes */
function BrandShape({ shape, className }: { shape: number; className?: string }) {
  const color = "var(--ce-cyan)";
  const lime = "var(--ce-lime, #9FFF07)";

  switch (shape % 6) {
    case 0: // CE monogram arrow
      return (
        <svg width="40" height="40" viewBox="0 0 133 180" fill="none" className={className}>
          <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill={color} opacity="0.9"/>
          <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill={color} opacity="0.9"/>
        </svg>
      );
    case 1: // Hex shape
      return (
        <svg width="32" height="36" viewBox="0 0 20 22" fill="none" className={className}>
          <path d="M10 0L20 6V16L10 22L0 16V6L10 0Z" stroke={color} strokeWidth="1.2" fill={`${color}`} fillOpacity="0.1" opacity="0.85"/>
        </svg>
      );
    case 2: // Lime dot
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" className={className}>
          <circle cx="7" cy="7" r="6" fill={lime} opacity="0.85"/>
        </svg>
      );
    case 3: // Diamond
      return (
        <svg width="24" height="24" viewBox="0 0 14 14" fill="none" className={className}>
          <rect x="7" y="0" width="9.9" height="9.9" transform="rotate(45 7 0)" stroke={color} strokeWidth="1.2" fill={`${color}`} fillOpacity="0.08" opacity="0.8"/>
        </svg>
      );
    case 4: // Small crosshair
      return (
        <svg width="20" height="20" viewBox="0 0 12 12" fill="none" className={className}>
          <line x1="6" y1="0" x2="6" y2="12" stroke={lime} strokeWidth="1.2" opacity="0.8"/>
          <line x1="0" y1="6" x2="12" y2="6" stroke={lime} strokeWidth="1.2" opacity="0.8"/>
        </svg>
      );
    case 5: // Chevron
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className}>
          <polyline points="9 6 15 12 9 18" stroke={color} strokeWidth="2" opacity="0.85"/>
        </svg>
      );
  }
}

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);
  const lastSpawn = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    // Throttle: spawn at most every 50ms
    if (now - lastSpawn.current < 50) return;
    lastSpawn.current = now;

    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scatter from cursor position
    const scatter = 60;
    const px = x + (Math.random() - 0.5) * scatter * 2;
    const py = y + (Math.random() - 0.5) * scatter * 2;

    const newParticle: Particle = {
      id: idCounter.current++,
      x: px,
      y: py,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.7,
      shape: Math.floor(Math.random() * 6),
      opacity: 0.7 + Math.random() * 0.3,
    };

    setParticles((prev) => [...prev.slice(-30), newParticle]); // Cap at 30
  }, []);

  // Clean up faded particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 1800);
    return () => clearTimeout(timer);
  }, [particles]);

  // Attach mouse listener to section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section ref={sectionRef} className="section section-dark surface-glow-blue relative overflow-hidden" style={{ cursor: "default" }}>
      {/* Cursor-trail particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`,
              opacity: p.opacity,
              animation: "cta-particle-fade 1.8s ease-out forwards",
            }}
          >
            <BrandShape shape={p.shape} />
          </div>
        ))}
      </div>

      <div className="container-main max-w-3xl mx-auto text-center relative z-10">
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
