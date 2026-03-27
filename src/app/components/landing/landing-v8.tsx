import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V8: "The Manifesto"
 *
 * INSPIRATION: Apple "Think Different" + Nike "Just Do It" + Stripe annual letters
 *
 * Philosophy: Ideology first, product second. Build desire through
 * belief before showing a single feature. One powerful idea per viewport.
 * Massive typography. Cinematic pacing. The product doesn't appear
 * until the user already wants it.
 *
 * DESIGN MOVES:
 * - One statement per full viewport
 * - 100px+ typography dominates every section
 * - No product screenshots until the final act
 * - Dark, brooding, powerful — near-black everything
 * - Scroll-linked opacity transitions
 * - Minimal color — lime only appears at the climax
 * - Generous negative space as a design element
 * - The manifesto reads like a speech
 */

interface LandingV8Props {
  onNavigate: (page: string) => void;
}

// ─── Full Viewport Statement ───────────────────────────────
function Statement({
  children,
  sub,
  align = "left",
}: {
  children: React.ReactNode;
  sub?: string;
  align?: "left" | "center" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);

  const alignment = align === "center" ? "text-center items-center" : align === "right" ? "text-right items-end" : "text-left items-start";

  return (
    <section ref={ref} className="min-h-screen flex items-center relative">
      <motion.div
        className={`max-w-[1400px] mx-auto px-6 lg:px-16 w-full flex flex-col ${alignment}`}
        style={{ opacity, y }}
      >
        <div className={`max-w-[900px] ${align === "center" ? "mx-auto" : ""}`}>
          {children}
        </div>
        {sub && (
          <p
            className={`text-[14px] lg:text-[16px] leading-[1.75] max-w-[480px] mt-8 ${align === "center" ? "mx-auto" : ""}`}
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
          >
            {sub}
          </p>
        )}
      </motion.div>
    </section>
  );
}

// ─── Manifesto Heading ─────────────────────────────────────
function H({ children, size = "xl", color = "var(--ce-text-primary)" }: { children: React.ReactNode; size?: "xl" | "lg" | "md"; color?: string }) {
  const sizes = {
    xl: "text-[48px] sm:text-[72px] lg:text-[96px] xl:text-[112px]",
    lg: "text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[84px]",
    md: "text-[32px] sm:text-[44px] lg:text-[56px] xl:text-[64px]",
  };

  return (
    <h2
      className={`${sizes[size]} font-bold leading-[0.92] tracking-[-0.045em]`}
      style={{ fontFamily: "'Urbanist', sans-serif", color }}
    >
      {children}
    </h2>
  );
}

// ─── Scroll Progress Indicator ─────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "var(--ce-lime)",
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function LandingV8({ onNavigate }: LandingV8Props) {
  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <ScrollProgress />
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ ACT I — THE OPENING ═══ */}
      <Statement>
        <div
          className="text-[10px] uppercase tracking-[0.3em] mb-8"
          style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
        >
          A manifesto for careers
        </div>
        <H>
          Your career
          <br />
          is not
          <br />
          a lottery.
        </H>
      </Statement>

      {/* ═══ ACT I — THE PROBLEM ═══ */}
      <Statement
        align="right"
        sub="Every year, millions of people make career decisions based on job board algorithms that know nothing about who they are."
      >
        <H size="lg" color="var(--ce-text-tertiary)">
          But everyone
          <br />
          treats it
          <br />
          like one.
        </H>
      </Statement>

      {/* ═══ ACT I — THE INDICTMENT ═══ */}
      <Statement align="center">
        <H size="md" color="var(--ce-text-quaternary)">
          Job boards match keywords.
          <br />
          Career coaches charge thousands.
          <br />
          AI tools give generic advice.
        </H>
      </Statement>

      {/* ═══ PAUSE — Breath ═══ */}
      <section className="h-[50vh] flex items-center justify-center">
        <motion.div
          className="w-[1px] h-24"
          style={{ background: "rgba(var(--ce-glass-tint), 0.06)" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
      </section>

      {/* ═══ ACT II — THE TURN ═══ */}
      <Statement>
        <div
          className="text-[10px] uppercase tracking-[0.3em] mb-8"
          style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-lime)" }}
        >
          What if
        </div>
        <H color="var(--ce-lime)">
          Someone
          <br />
          actually
          <br />
          understood.
        </H>
      </Statement>

      {/* ═══ ACT II — THE ARCHETYPE ═══ */}
      <Statement
        align="center"
        sub="Not a personality test. Not a quiz. A 15-question assessment that maps you to one of 18 career archetypes — and changes how you see every opportunity."
      >
        <H size="lg">
          You're not a keyword.
          <br />
          You're an <span style={{ color: "var(--ce-cyan)" }}>archetype.</span>
        </H>
      </Statement>

      {/* ═══ ACT II — SOPHIA ═══ */}
      <Statement
        align="right"
        sub="Sophia isn't a chatbot. She's the person in your network who actually knows what they're talking about. She remembers your constraints, anticipates your questions, and connects every tool to your specific journey."
      >
        <H size="lg">
          Guided by
          <br />
          <span style={{ color: "var(--ce-cyan)" }}>Sophia.</span>
        </H>
      </Statement>

      {/* ═══ ACT II — THE ECOSYSTEM ═══ */}
      <Statement sub="Seekers, mentors, parents, institutions, NGOs, and government agencies — all connected through one intelligent system. Your mentor sees your roadmap. Your institution tracks outcomes. Everyone moves forward.">
        <H size="lg">
          Not just
          <br />
          for you.
          <br />
          <span style={{ color: "var(--ce-text-tertiary)" }}>
            For everyone
            <br />
            around you.
          </span>
        </H>
      </Statement>

      {/* ═══ PAUSE — The Numbers ═══ */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
              {[
                { value: "10k+", label: "Roadmaps built" },
                { value: "87%", label: "Goals completed" },
                { value: "18", label: "Career archetypes" },
                { value: "$0", label: "To start" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <div
                    className="text-[48px] lg:text-[72px] font-bold tracking-[-0.04em] leading-none mb-2"
                    style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-lime)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-[0.15em]"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ACT III — THE PRODUCT (finally) ═══ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.3em] mb-12 text-center"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
            >
              What you get
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "EdgePath", desc: "Career discovery through archetype matching", accent: "var(--ce-lime)" },
                { name: "Sophia", desc: "AI guide that knows you, not keywords", accent: "var(--ce-cyan)" },
                { name: "ResumeEdge", desc: "AI-enhanced resume building", accent: "#8B5CF6" },
                { name: "EdgeProd", desc: "Goals, focus, and accountability tools", accent: "#F59E0B" },
                { name: "EdgeMatch", desc: "Job matching by archetype compatibility", accent: "#10B981" },
                { name: "ImmigrationEdge", desc: "International career pathways", accent: "#3B82F6" },
              ].map((tool, i) => (
                <motion.div
                  key={tool.name}
                  className="py-6 group"
                  style={{ borderTop: `1px solid rgba(var(--ce-glass-tint), 0.04)` }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: tool.accent }} />
                    <h3
                      className="text-[18px] font-semibold tracking-[-0.01em]"
                      style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                    >
                      {tool.name}
                    </h3>
                  </div>
                  <p
                    className="text-[13px] leading-[1.7] ml-4"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                  >
                    {tool.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ THE CLOSE ═══ */}
      <Statement align="center">
        <H>
          Your career
          <br />
          has a <span style={{ color: "var(--ce-lime)" }}>structure.</span>
        </H>
        <div className="mt-12">
          <button
            onClick={() => onNavigate("signup")}
            className="px-10 py-5 rounded-lg text-[15px] font-medium flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5 mx-auto"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              background: "var(--ce-lime)",
              color: "#08090C",
            }}
          >
            Find Your Archetype
            <ArrowRight size={17} />
          </button>
          <p
            className="mt-5 text-[12px]"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
          >
            Free. 15 questions. 4 minutes.
          </p>
        </div>
      </Statement>

      {/* Final breath */}
      <section className="h-[30vh]" />

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
