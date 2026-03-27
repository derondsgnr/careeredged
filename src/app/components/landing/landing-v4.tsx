import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, ArrowUpRight, Grid3x3, Cpu, Route, Users, Sparkles, Shield } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V4: "The Architect"
 *
 * INSPIRATION: Linear + Vercel + Swiss Modernist Design
 *
 * Philosophy: Precision as beauty. Every pixel is measured.
 * The page itself IS the grid — a living blueprint that reveals
 * CareerEdge's systematic approach to career intelligence.
 *
 * DESIGN MOVES:
 * - Visible grid lines that fade in/out as you scroll
 * - Brand Pattern 01 (DNA tessellation) as a living, parallaxing background
 * - Asymmetric 12-column grid with intentional tension
 * - Thin border lines connecting sections (like architectural drawings)
 * - Monospace details for technical credibility
 * - Cursor-following gradient for spatial awareness
 * - Section numbers in large ghosted type
 * - Split-screen hero with type on left, animated diagram on right
 */

interface LandingV4Props {
  onNavigate: (page: string) => void;
}

// ─── Cursor Gradient ───────────────────────────────────────
function CursorGradient() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: useTransform(
          [springX, springY],
          ([cx, cy]) =>
            `radial-gradient(800px circle at ${cx}px ${cy}px, rgba(var(--ce-lime-rgb), 0.03), transparent 60%)`
        ),
      }}
    />
  );
}

// ─── Grid Overlay ──────────────────────────────────────────
function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.025 }}>
      <div className="max-w-[1400px] mx-auto h-full px-6 lg:px-10 grid grid-cols-12 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full"
            style={{ borderLeft: "1px solid var(--ce-text-primary)", borderRight: i === 11 ? "1px solid var(--ce-text-primary)" : "none" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Brand Pattern 01 — DNA Arrow Tessellation ─────────────
function BrandPatternBg() {
  const { scrollYProgress } = useScroll();
  const patternY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // SVG arrow element derived from the logo
  const arrowPath = "M0 0L20 15L0 30L8 15Z";

  return (
    <motion.div
      className="fixed top-0 right-0 w-[40vw] h-screen pointer-events-none z-0 overflow-hidden"
      style={{ y: patternY, opacity: 0.02 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dna-arrow" x="0" y="0" width="48" height="36" patternUnits="userSpaceOnUse">
            <path d={arrowPath} fill="var(--ce-lime)" transform="translate(4, 3)" />
            <path d={arrowPath} fill="var(--ce-lime)" transform="translate(28, 3) scale(-1, 1) translate(-20, 0)" />
            <path d={arrowPath} fill="var(--ce-lime)" transform="translate(16, 18)" />
          </pattern>
        </defs>
        <rect width="100%" height="200%" fill="url(#dna-arrow)" />
      </svg>
    </motion.div>
  );
}

// ─── Section Number ────────────────────────────────────────
function SectionNumber({ number }: { number: string }) {
  return (
    <span
      className="text-[120px] lg:text-[200px] font-bold leading-none select-none"
      style={{
        fontFamily: "'Urbanist', sans-serif",
        color: "transparent",
        WebkitTextStroke: "1px rgba(var(--ce-glass-tint), 0.04)",
        position: "absolute",
        top: "-40px",
        left: "-20px",
        zIndex: 0,
      }}
    >
      {number}
    </span>
  );
}

// ─── Reveal Animation ──────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Architectural Line ────────────────────────────────────
function ArchLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`w-full ${className}`}
      style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(var(--ce-glass-tint), 0.06), rgba(var(--ce-glass-tint), 0.06), transparent)" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
    />
  );
}

// ─── Metric Block ──────────────────────────────────────────
function MetricBlock({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="relative group">
      <div
        className="text-[48px] lg:text-[64px] font-bold tracking-[-0.04em] leading-none"
        style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
      >
        {value}
        <span style={{ color: "var(--ce-lime)", fontSize: "0.6em" }}>{suffix}</span>
      </div>
      <div
        className="mt-2 text-[11px] uppercase tracking-[0.16em]"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
      >
        {label}
      </div>
      <div
        className="absolute -bottom-3 left-0 w-8 h-[2px] transition-all duration-500 group-hover:w-full"
        style={{ background: "var(--ce-lime)" }}
      />
    </div>
  );
}

// ─── Feature Cell ──────────────────────────────────────────
function FeatureCell({
  icon: Icon,
  title,
  description,
  span = "col-span-1",
  accent = "var(--ce-lime)",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  span?: string;
  accent?: string;
}) {
  return (
    <motion.div
      className={`relative p-6 lg:p-8 rounded-xl group cursor-default ${span}`}
      style={{
        background: "rgba(var(--ce-glass-tint), 0.02)",
        border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
      }}
      whileHover={{
        borderColor: `rgba(var(--ce-glass-tint), 0.08)`,
        background: "rgba(var(--ce-glass-tint), 0.03)",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Accent dot */}
      <div
        className="w-2 h-2 rounded-full mb-5 transition-all duration-500 group-hover:w-8"
        style={{ background: accent }}
      />
      <Icon
        size={20}
        className="mb-4 transition-colors duration-300"
        style={{ color: "var(--ce-text-tertiary)" }}
      />
      <h3
        className="text-[16px] font-medium mb-2 tracking-[-0.01em]"
        style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="text-[13px] leading-[1.7]"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ─── Role Card (Architectural) ─────────────────────────────
function RoleCard({
  role,
  label,
  accent,
  description,
  index,
}: {
  role: string;
  label: string;
  accent: string;
  description: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.08}>
      <div
        className="relative p-6 group cursor-default"
        style={{
          borderLeft: `2px solid ${accent}`,
          background: "rgba(var(--ce-glass-tint), 0.01)",
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.2em] mb-3"
          style={{ fontFamily: "'Satoshi', sans-serif", color: accent }}
        >
          {role}
        </div>
        <h4
          className="text-[18px] font-medium mb-2 tracking-[-0.01em]"
          style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
        >
          {label}
        </h4>
        <p
          className="text-[13px] leading-[1.7]"
          style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
        >
          {description}
        </p>
        {/* Hover accent line */}
        <div
          className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-700 group-hover:w-full"
          style={{ background: accent }}
        />
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function LandingV4({ onNavigate }: LandingV4Props) {
  return (
    <div className="min-h-screen relative" style={{ background: "var(--ce-surface-bg)" }}>
      <CursorGradient />
      <GridOverlay />
      <BrandPatternBg />
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ HERO — Split Screen ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center pt-24 lg:pt-0">
          {/* Left — Typography */}
          <div className="lg:col-span-6 xl:col-span-5 relative z-10">
            <Reveal>
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-3"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
              >
                <div className="w-8 h-[1px]" style={{ background: "var(--ce-lime)" }} />
                Career Intelligence Platform
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                className="text-[40px] sm:text-[52px] lg:text-[60px] xl:text-[68px] font-semibold leading-[0.95] tracking-[-0.035em] mb-6"
                style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
              >
                Structured
                <br />
                direction for
                <br />
                <span style={{ color: "var(--ce-lime)" }}>every career.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="text-[15px] lg:text-[16px] leading-[1.75] max-w-[420px] mb-8"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
              >
                CareerEdge maps where you are to where you belong. AI-guided roadmaps,
                archetype matching, and an ecosystem connecting seekers, mentors,
                and institutions.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate("signup")}
                  className="px-7 py-3.5 rounded-lg text-[13px] font-medium flex items-center gap-2.5 cursor-pointer transition-all duration-300 hover:gap-4"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    background: "var(--ce-lime)",
                    color: "#08090C",
                  }}
                >
                  Start Your Roadmap
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => onNavigate("about")}
                  className="px-7 py-3.5 rounded-lg text-[13px] font-medium cursor-pointer transition-colors duration-300"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    color: "var(--ce-text-secondary)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.08)",
                  }}
                >
                  Meet Sophia
                </button>
              </div>
            </Reveal>

            {/* Micro detail — coordinates */}
            <Reveal delay={0.5}>
              <div
                className="mt-12 text-[10px] tracking-[0.1em]"
                style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
              >
                v2.4 · 18 archetypes · 800+ professions · 6 user roles
              </div>
            </Reveal>
          </div>

          {/* Right — Animated Blueprint Diagram */}
          <div className="lg:col-span-6 xl:col-span-7 relative">
            <Reveal delay={0.2}>
              <div className="relative aspect-square max-w-[580px] mx-auto lg:ml-auto">
                {/* Blueprint grid background */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.015)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                  }}
                >
                  {/* Grid dots */}
                  <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity: 0.3 }}>
                    <defs>
                      <pattern id="blueprint-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="0.5" fill="var(--ce-text-quaternary)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#blueprint-dots)" />
                  </svg>

                  {/* Animated connection lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
                    {/* Center node — Sophia */}
                    <motion.circle
                      cx="200" cy="200" r="32"
                      fill="rgba(34, 211, 238, 0.08)"
                      stroke="var(--ce-cyan)"
                      strokeWidth="1"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                    <motion.text
                      x="200" y="204"
                      textAnchor="middle"
                      fill="var(--ce-cyan)"
                      fontSize="10"
                      fontFamily="Satoshi, sans-serif"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      Sophia
                    </motion.text>

                    {/* Surrounding nodes — roles */}
                    {[
                      { x: 100, y: 90, label: "EdgeStar", color: "var(--ce-cyan)", delay: 0.6 },
                      { x: 300, y: 90, label: "Mentor", color: "#8B5CF6", delay: 0.7 },
                      { x: 330, y: 220, label: "Employer", color: "#10B981", delay: 0.8 },
                      { x: 280, y: 330, label: "Institution", color: "#3B82F6", delay: 0.9 },
                      { x: 120, y: 330, label: "NGO", color: "#F97316", delay: 1.0 },
                      { x: 70, y: 220, label: "Parent", color: "#EC4899", delay: 1.1 },
                    ].map((node, i) => (
                      <g key={i}>
                        {/* Connection line */}
                        <motion.line
                          x1="200" y1="200" x2={node.x} y2={node.y}
                          stroke={node.color}
                          strokeWidth="0.5"
                          strokeDasharray="4 4"
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 0.3 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: node.delay }}
                        />
                        {/* Node circle */}
                        <motion.circle
                          cx={node.x} cy={node.y} r="24"
                          fill={`${node.color}10`}
                          stroke={node.color}
                          strokeWidth="0.5"
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: node.delay + 0.2, type: "spring", stiffness: 200 }}
                        />
                        <motion.text
                          x={node.x} y={node.y + 4}
                          textAnchor="middle"
                          fill={node.color}
                          fontSize="8"
                          fontFamily="Satoshi, sans-serif"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.8 }}
                          viewport={{ once: true }}
                          transition={{ delay: node.delay + 0.4 }}
                        >
                          {node.label}
                        </motion.text>
                      </g>
                    ))}

                    {/* Orbiting particle */}
                    <motion.circle
                      r="3"
                      fill="var(--ce-lime)"
                      initial={{ offsetDistance: "0%" }}
                      animate={{ offsetDistance: "100%" }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      style={{
                        offsetPath: "path('M200,120 C280,120 330,180 330,220 C330,280 280,330 200,330 C120,330 70,280 70,220 C70,180 120,120 200,120')",
                      }}
                    />
                  </svg>

                  {/* Corner coordinates */}
                  <div className="absolute top-4 left-4 text-[9px] tracking-wider" style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}>
                    0,0
                  </div>
                  <div className="absolute bottom-4 right-4 text-[9px] tracking-wider" style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}>
                    ∞,∞
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ METRICS BAR ═══ */}
      <ArchLine className="my-0" />
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              <MetricBlock value="10k" suffix="+" label="Career roadmaps built" />
              <MetricBlock value="87" suffix="%" label="Goal completion rate" />
              <MetricBlock value="18" suffix="" label="Career archetypes" />
              <MetricBlock value="6" suffix="" label="Distinct user roles" />
            </div>
          </Reveal>
        </div>
      </section>
      <ArchLine />

      {/* ═══ SECTION 01 — THE SYSTEM ═══ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left — Section title */}
            <div className="lg:col-span-4 relative">
              <SectionNumber number="01" />
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-lime)" }}
                >
                  The System
                </div>
                <h2
                  className="text-[32px] lg:text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] mb-4"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  Intelligence,
                  <br />
                  not guesswork.
                </h2>
                <p
                  className="text-[14px] leading-[1.75] max-w-[360px]"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                >
                  Six integrated tools. One AI guide. Every career transition mapped
                  with precision — from first assessment to first offer.
                </p>
              </Reveal>
            </div>

            {/* Right — Feature grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Reveal delay={0.05}>
                <FeatureCell
                  icon={Sparkles}
                  title="Sophia"
                  description="AI career guide that knows your archetype, your goals, and your constraints. Always available, never generic."
                  accent="var(--ce-cyan)"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <FeatureCell
                  icon={Route}
                  title="EdgePath"
                  description="15-question archetype assessment maps you to 18 career profiles with salary, demand, and transition time."
                  accent="var(--ce-lime)"
                />
              </Reveal>
              <Reveal delay={0.15}>
                <FeatureCell
                  icon={Grid3x3}
                  title="EdgeProd"
                  description="Productivity suite with SMART goals, Pomodoro focus, OKR tracking, and accountability pairing."
                  accent="#F59E0B"
                />
              </Reveal>
              <Reveal delay={0.2}>
                <FeatureCell
                  icon={Cpu}
                  title="ResumeEdge"
                  description="AI-enhanced resume builder. Bullet enhancement, content review, and format optimization in one flow."
                  accent="#8B5CF6"
                />
              </Reveal>
              <Reveal delay={0.25}>
                <FeatureCell
                  icon={Users}
                  title="EdgeMatch"
                  description="Job matching powered by your archetype. Not keywords — compatibility. 23 roles match your first profile."
                  accent="#10B981"
                />
              </Reveal>
              <Reveal delay={0.3}>
                <FeatureCell
                  icon={Shield}
                  title="ImmigrationEdge"
                  description="Specialized pathway for international seekers. Visa timelines, cost calculators, and support mapping."
                  accent="#3B82F6"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ArchLine />

      {/* ═══ SECTION 02 — THE ROLES ═══ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="relative mb-16">
            <SectionNumber number="02" />
            <Reveal>
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-lime)" }}
              >
                The Ecosystem
              </div>
              <h2
                className="text-[32px] lg:text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] mb-4"
                style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
              >
                Six roles. One connected system.
              </h2>
              <p
                className="text-[14px] leading-[1.75] max-w-[520px]"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
              >
                Every role feeds the ecosystem. Seekers get guidance. Mentors build reputation.
                Institutions track outcomes. Everyone moves forward.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { role: "EdgeStar", label: "The Seeker", accent: "var(--ce-cyan)", description: "Career seekers mapping their next move with AI-guided roadmaps and archetype matching." },
              { role: "EdgeGuide", label: "The Mentor", accent: "#8B5CF6", description: "Verified coaches and volunteer mentors building portfolios and growing their practice." },
              { role: "EdgeParent", label: "The Supporter", accent: "#EC4899", description: "Parents tracking progress with read-only dashboards. Trust without overreach." },
              { role: "Institution", label: "The Educator", accent: "#3B82F6", description: "Universities and schools tracking career readiness, managing events, and measuring outcomes." },
              { role: "NGO", label: "The Community", accent: "#F97316", description: "Non-profits running career programs, tracking participants, and reporting impact." },
              { role: "Government", label: "The Funder", accent: "#6366F1", description: "Agencies distributing grants, reviewing applications, and overseeing workforce development." },
            ].map((item, i) => (
              <RoleCard key={item.role} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ArchLine />

      {/* ═══ SECTION 03 — SOPHIA ═══ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left — Sophia conversation mock */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Reveal>
                <div
                  className="rounded-xl p-6 lg:p-8 relative overflow-hidden"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.02)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                  }}
                >
                  {/* Sophia glow */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(34, 211, 238, 0.06) 0%, transparent 70%)",
                    }}
                  />

                  {/* Chat messages */}
                  <div className="space-y-4 relative z-10">
                    {[
                      { sender: "sophia", text: "Based on your assessment, you're a Strategist-Innovator hybrid. That's rare — only 4% of our users share this archetype." },
                      { sender: "user", text: "What does that mean for my career options?" },
                      { sender: "sophia", text: "It means you thrive at the intersection of vision and execution. I've mapped 23 roles that fit — the strongest match is Product Strategy Lead at 94%." },
                    ].map((msg, i) => (
                      <motion.div
                        key={i}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                      >
                        <div
                          className="max-w-[85%] px-4 py-3 rounded-xl text-[13px] leading-[1.65]"
                          style={{
                            fontFamily: "'Satoshi', sans-serif",
                            background: msg.sender === "sophia"
                              ? "rgba(34, 211, 238, 0.06)"
                              : "rgba(var(--ce-glass-tint), 0.04)",
                            border: msg.sender === "sophia"
                              ? "1px solid rgba(34, 211, 238, 0.1)"
                              : "1px solid rgba(var(--ce-glass-tint), 0.06)",
                            color: "var(--ce-text-primary)",
                          }}
                        >
                          {msg.sender === "sophia" && (
                            <span className="text-[10px] uppercase tracking-[0.12em] block mb-1.5" style={{ color: "var(--ce-cyan)" }}>
                              Sophia
                            </span>
                          )}
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 }}
                    >
                      <div
                        className="px-4 py-3 rounded-xl flex items-center gap-1.5"
                        style={{
                          background: "rgba(34, 211, 238, 0.04)",
                          border: "1px solid rgba(34, 211, 238, 0.06)",
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "var(--ce-cyan)" }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Sophia description */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative">
              <SectionNumber number="03" />
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-cyan)" }}
                >
                  Meet Sophia
                </div>
                <h2
                  className="text-[32px] lg:text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] mb-4"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  A person in your
                  <br />
                  network, not a bot.
                </h2>
                <p
                  className="text-[14px] leading-[1.75] max-w-[420px] mb-6"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                >
                  Sophia doesn't just answer questions — she anticipates them.
                  She knows your archetype, remembers your constraints,
                  and connects every surface of CareerEdge to your specific journey.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="space-y-3">
                  {[
                    "Gives context before making requests",
                    "Uses inline examples, never assumes jargon",
                    "Connects every surface to your roadmap",
                    "Zero AI cost — rule-based intelligence",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-[13px]"
                      style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                    >
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--ce-cyan)" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ArchLine />

      {/* ═══ SECTION 04 — CTA ═══ */}
      <section className="relative py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <div
              className="text-[10px] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
            >
              Begin
            </div>
            <h2
              className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.05] tracking-[-0.035em] mb-6"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Your career has
              <br />
              <span style={{ color: "var(--ce-lime)" }}>a structure.</span>
            </h2>
            <p
              className="text-[15px] leading-[1.75] max-w-[460px] mx-auto mb-10"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              Stop guessing. Start building with precision.
              15 questions. 18 archetypes. One roadmap built for you.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate("signup")}
                className="px-8 py-4 rounded-lg text-[14px] font-medium flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "var(--ce-lime)",
                  color: "#08090C",
                }}
              >
                Build Your Roadmap
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate("careers")}
                className="px-8 py-4 rounded-lg text-[14px] font-medium flex items-center gap-3 cursor-pointer transition-colors duration-300"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  color: "var(--ce-text-secondary)",
                  border: "1px solid rgba(var(--ce-glass-tint), 0.08)",
                }}
              >
                Explore Careers
                <ArrowUpRight size={15} />
              </button>
            </div>
          </Reveal>

          {/* Bottom architectural detail */}
          <Reveal delay={0.3}>
            <div
              className="mt-20 text-[10px] tracking-[0.1em] flex items-center justify-center gap-6"
              style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
            >
              <span>18 archetypes</span>
              <span>·</span>
              <span>800+ professions</span>
              <span>·</span>
              <span>6 roles</span>
              <span>·</span>
              <span>$0 to start</span>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
