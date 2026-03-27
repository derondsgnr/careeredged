import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V6: "The Gallery"
 *
 * INSPIRATION: Lusion v3 + Fashion Editorial + Museum Exhibitions
 *
 * Philosophy: Career development as art. Each product feature is
 * treated as an exhibit piece — full-bleed visuals, dramatic scale
 * shifts, and a magazine-style editorial flow.
 *
 * DESIGN MOVES:
 * - Full-viewport hero with single powerful image + overlaid type
 * - Dramatic scale contrast (tiny captions next to massive headlines)
 * - Asymmetric image placement — photos break the grid intentionally
 * - Brand Pattern 02 (lime grid) as texture overlay on photos
 * - Horizontal scrolling gallery for features
 * - Generous white/dark space — nothing feels crowded
 * - Typography as texture — overlapping, layered, rotated
 * - Split-tone sections (dark/light alternation)
 */

interface LandingV6Props {
  onNavigate: (page: string) => void;
}

// ─── Reveal ────────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Parallax Image ────────────────────────────────────────
function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ y, scale: 1.15 }}
        loading="lazy"
      />
    </div>
  );
}

// ─── Gallery Card ──────────────────────────────────────────
function GalleryCard({
  number,
  title,
  description,
  accent,
  image,
}: {
  number: string;
  title: string;
  description: string;
  accent: string;
  image: string;
}) {
  return (
    <motion.div
      className="flex-shrink-0 w-[320px] sm:w-[380px] group cursor-default"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Image */}
      <div
        className="aspect-[4/5] rounded-xl overflow-hidden mb-5 relative"
        style={{ border: "1px solid rgba(var(--ce-glass-tint), 0.04)" }}
      >
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            backgroundImage: `repeating-conic-gradient(${accent}20 0% 25%, transparent 0% 50%)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Number */}
        <div
          className="absolute top-4 left-4 text-[11px] tracking-[0.15em]"
          style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}
        >
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: accent }} />
        <h3
          className="text-[20px] font-semibold tracking-[-0.02em]"
          style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-[13px] leading-[1.7] ml-4"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function LandingV6({ onNavigate }: LandingV6Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ HERO — Full Viewport Image ═══ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            alt="Modern workspace with dramatic lighting"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(8,9,12,0.3) 0%, rgba(8,9,12,0.7) 50%, rgba(8,9,12,0.95) 100%)" }}
          />
        </motion.div>

        {/* Hero type — editorial overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-20 lg:pb-28"
          style={{ opacity: heroOpacity }}
        >
          {/* Tiny label */}
          <Reveal>
            <div
              className="text-[10px] uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(255,255,255,0.4)" }}
            >
              Career Intelligence / Est. 2024
            </div>
          </Reveal>

          {/* Massive headline */}
          <Reveal delay={0.1}>
            <h1
              className="text-[48px] sm:text-[72px] lg:text-[96px] xl:text-[120px] font-bold leading-[0.88] tracking-[-0.04em] mb-6"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Career
              <br />
              <span className="italic font-light" style={{ color: "var(--ce-lime)" }}>Edged.</span>
            </h1>
          </Reveal>

          {/* Subline + CTA */}
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-16">
              <p
                className="text-[15px] leading-[1.7] max-w-[340px]"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
              >
                The intersection of AI intelligence and human ambition.
                Your career, mapped with precision.
              </p>
              <button
                onClick={() => onNavigate("signup")}
                className="px-6 py-3 rounded-full text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-all duration-300 hover:gap-4 w-fit"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "var(--ce-lime)",
                  color: "#08090C",
                }}
              >
                Discover Your Archetype
                <ArrowRight size={14} />
              </button>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* ═══ EDITORIAL STATEMENT ═══ */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-2">
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] lg:sticky lg:top-32"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                >
                  01 / The Problem
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-8 lg:col-start-4">
              <Reveal>
                <h2
                  className="text-[28px] sm:text-[36px] lg:text-[44px] font-light leading-[1.25] tracking-[-0.02em] mb-8"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  Career platforms treat you like a keyword.
                  <br />
                  <span style={{ color: "var(--ce-text-tertiary)" }}>
                    We treat you like a person with a specific archetype,
                    a unique path, and goals that actually matter.
                  </span>
                </h2>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ASYMMETRIC PHOTO BLOCK ═══ */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Large image */}
            <div className="lg:col-span-7">
              <Reveal>
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
                  alt="Team collaboration"
                  className="aspect-[4/3] rounded-xl"
                />
              </Reveal>
            </div>
            {/* Stacked smaller images */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6">
              <Reveal delay={0.1}>
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Professional woman"
                  className="aspect-[3/2] rounded-xl"
                />
              </Reveal>
              <Reveal delay={0.2}>
                <div
                  className="flex-1 min-h-[160px] rounded-xl flex items-center justify-center p-8"
                  style={{
                    background: "var(--ce-lime)",
                  }}
                >
                  <p
                    className="text-[24px] lg:text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-center"
                    style={{ fontFamily: "'Urbanist', sans-serif", color: "#08090C" }}
                  >
                    18 archetypes.
                    <br />
                    One is yours.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HORIZONTAL SCROLL GALLERY — Features ═══ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-12">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-3"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                >
                  02 / The Collection
                </div>
                <h2
                  className="text-[32px] lg:text-[44px] font-semibold leading-[1.05] tracking-[-0.03em]"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  Six tools, one ecosystem.
                </h2>
              </div>
              <div
                className="hidden lg:block text-[12px] tracking-[0.05em]"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
              >
                Scroll →
              </div>
            </div>
          </Reveal>
        </div>

        {/* Horizontal scroll track */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-6 lg:px-16 pb-6" style={{ width: "fit-content" }}>
            <GalleryCard
              number="01"
              title="EdgePath"
              description="15-question archetype assessment. Maps you to careers with salary, demand, and transition data."
              accent="var(--ce-lime)"
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
            />
            <GalleryCard
              number="02"
              title="Sophia"
              description="AI guide who knows your archetype, remembers your constraints, and connects everything."
              accent="var(--ce-cyan)"
              image="https://images.unsplash.com/photo-1531746790095-e5cb57f5a9f8?w=600&q=80"
            />
            <GalleryCard
              number="03"
              title="ResumeEdge"
              description="AI-enhanced resume builder with bullet optimization and intelligent formatting."
              accent="#8B5CF6"
              image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80"
            />
            <GalleryCard
              number="04"
              title="EdgeProd"
              description="Productivity suite. SMART goals, Pomodoro focus, OKRs, and accountability pairing."
              accent="#F59E0B"
              image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80"
            />
            <GalleryCard
              number="05"
              title="EdgeMatch"
              description="Job matching by archetype compatibility. 23 average matches on first profile."
              accent="#10B981"
              image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80"
            />
            <GalleryCard
              number="06"
              title="ImmigrationEdge"
              description="International career pathways. Visa timelines, cost calculators, and support networks."
              accent="#3B82F6"
              image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80"
            />
          </div>
        </div>
      </section>

      {/* ═══ ROLES — EDITORIAL SPREAD ═══ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-2">
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] lg:sticky lg:top-32"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                >
                  03 / Who It's For
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-8 lg:col-start-4">
              <Reveal>
                <h2
                  className="text-[28px] sm:text-[36px] lg:text-[44px] font-light leading-[1.25] tracking-[-0.02em]"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  Not just seekers.
                  <br />
                  <span style={{ color: "var(--ce-text-tertiary)" }}>
                    An entire ecosystem of people who care about careers.
                  </span>
                </h2>
              </Reveal>
            </div>
          </div>

          {/* Role grid — magazine layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { role: "Seekers", accent: "var(--ce-cyan)", sub: "AI-guided roadmaps & archetype matching" },
              { role: "Mentors", accent: "#8B5CF6", sub: "Build your practice, grow your reputation" },
              { role: "Parents", accent: "#EC4899", sub: "Support with visibility, not control" },
              { role: "Institutions", accent: "#3B82F6", sub: "Track outcomes & manage career events" },
              { role: "NGOs", accent: "#F97316", sub: "Scale career programs with impact data" },
              { role: "Government", accent: "#6366F1", sub: "Fund workforce development with oversight" },
            ].map((item, i) => (
              <Reveal key={item.role} delay={i * 0.06}>
                <div className="group cursor-default">
                  {/* Accent line */}
                  <div
                    className="w-12 h-[2px] mb-4 transition-all duration-500 group-hover:w-20"
                    style={{ background: item.accent }}
                  />
                  <h3
                    className="text-[24px] font-semibold tracking-[-0.02em] mb-2"
                    style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                  >
                    {item.role}
                  </h3>
                  <p
                    className="text-[13px] leading-[1.7]"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                  >
                    {item.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FULL-BLEED SOPHIA MOMENT ═══ */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Cyan glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.04) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 text-center relative z-10">
          <Reveal>
            <div
              className="text-[10px] uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-cyan)" }}
            >
              Meet Sophia
            </div>
            <h2
              className="text-[32px] sm:text-[48px] lg:text-[64px] font-light leading-[1.1] tracking-[-0.03em] max-w-[800px] mx-auto mb-8"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Not a bot.
              <br />
              <span className="font-semibold italic" style={{ color: "var(--ce-cyan)" }}>
                A person in your network.
              </span>
            </h2>
            <p
              className="text-[15px] leading-[1.75] max-w-[480px] mx-auto"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              She anticipates your questions, connects every surface to your roadmap,
              and remembers your constraints. Career intelligence that feels personal.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ FINAL CTA — Full Bleed ═══ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80"
          alt="Forward momentum"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(8, 9, 12, 0.85)" }}
        />

        <div className="relative z-10 text-center px-6">
          <Reveal>
            <h2
              className="text-[36px] sm:text-[52px] lg:text-[72px] font-bold leading-[0.95] tracking-[-0.04em] mb-8"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Your next move,
              <br />
              <span className="italic font-light" style={{ color: "var(--ce-lime)" }}>mapped.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <button
              onClick={() => onNavigate("signup")}
              className="px-8 py-4 rounded-full text-[14px] font-medium flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5 mx-auto"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                background: "var(--ce-lime)",
                color: "#08090C",
              }}
            >
              Start Free
              <ArrowUpRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
