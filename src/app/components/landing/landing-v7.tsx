import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, animate } from "motion/react";
import { ArrowRight, TrendingUp, Zap, BarChart3, Activity } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V7: "The Data Canvas"
 *
 * INSPIRATION: Zentry + Bloomberg Terminal + Stripe's data viz
 *
 * Philosophy: The data IS the design. Numbers are not proof —
 * they're the visual identity. The page feels like you're already
 * inside the product. Live-feeling dashboards, morphing statistics.
 *
 * DESIGN MOVES:
 * - Hero is a live "data dashboard" that counts and shifts
 * - Floating data particles/dots in the background
 * - Real-time-feeling animated metrics
 * - Thin mono-spaced technical details throughout
 * - Data visualization as section dividers
 * - Terminal/console aesthetic for credibility
 * - Glowing data points and connection lines
 * - The page itself is the product demo
 */

interface LandingV7Props {
  onNavigate: (page: string) => void;
}

// ─── Animated Counter ──────────────────────────────────────
function AnimatedNumber({ target, duration = 2000, prefix = "", suffix = "" }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const ctrl = animate(0, target, {
      duration: duration / 1000,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Floating Data Particles ───────────────────────────────
function DataParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.05,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: i % 3 === 0 ? "var(--ce-lime)" : i % 3 === 1 ? "var(--ce-cyan)" : "var(--ce-text-quaternary)",
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Reveal ────────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Live Metric Card ──────────────────────────────────────
function LiveMetric({
  label,
  value,
  change,
  positive = true,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: React.ReactNode;
  change: string;
  positive?: boolean;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div
        className="p-5 rounded-xl group"
        style={{
          background: "rgba(var(--ce-glass-tint), 0.02)",
          border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <Icon size={16} style={{ color: "var(--ce-text-quaternary)" }} />
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "monospace",
              background: positive ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
              color: positive ? "#10B981" : "#EF4444",
            }}
          >
            {change}
          </span>
        </div>
        <div
          className="text-[32px] lg:text-[40px] font-bold tracking-[-0.04em] leading-none mb-1"
          style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
        >
          {value}
        </div>
        <div
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
        >
          {label}
        </div>
      </div>
    </Reveal>
  );
}

// ─── Data Visualization Bar Chart ──────────────────────────
function DataBarChart() {
  const bars = [
    { label: "Innovator", value: 85, color: "var(--ce-lime)" },
    { label: "Strategist", value: 72, color: "var(--ce-cyan)" },
    { label: "Visionary", value: 68, color: "#8B5CF6" },
    { label: "Builder", value: 91, color: "#F59E0B" },
    { label: "Helper", value: 64, color: "#EC4899" },
    { label: "Analyst", value: 78, color: "#3B82F6" },
  ];

  return (
    <div className="space-y-3">
      {bars.map((bar, i) => (
        <div key={bar.label} className="flex items-center gap-3">
          <div
            className="w-20 text-[11px] text-right"
            style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
          >
            {bar.label}
          </div>
          <div className="flex-1 h-6 rounded-sm overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint), 0.03)" }}>
            <motion.div
              className="h-full rounded-sm"
              style={{ background: bar.color, opacity: 0.6 }}
              initial={{ width: 0 }}
              whileInView={{ width: `${bar.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
            />
          </div>
          <div
            className="w-8 text-[11px]"
            style={{ fontFamily: "monospace", color: "var(--ce-text-tertiary)" }}
          >
            {bar.value}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Mini Sparkline ────────────────────────────────────────
function Sparkline({ color = "var(--ce-lime)", height = 40 }: { color?: string; height?: number }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 20; i++) {
      pts.push(Math.random() * 0.6 + 0.2 + (i / 20) * 0.3);
    }
    return pts;
  }, []);

  const pathData = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${(1 - p) * height}`)
    .join(" L");

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <motion.path
        d={`M${pathData}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.32, 0.72, 0, 1] }}
      />
    </svg>
  );
}

// ─── Terminal Line ─────────────────────────────────────────
function TerminalLine({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      <span style={{ color: "var(--ce-lime)" }}>→</span>
      <span
        className="text-[12px]"
        style={{ fontFamily: "monospace", color: "var(--ce-text-secondary)" }}
      >
        {text}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function LandingV7({ onNavigate }: LandingV7Props) {
  return (
    <div className="min-h-screen relative" style={{ background: "var(--ce-surface-bg)" }}>
      <DataParticles />
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ HERO — Live Data Dashboard ═══ */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full relative z-10">
          {/* Top status bar */}
          <Reveal>
            <div
              className="flex items-center gap-4 mb-8"
              style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)", fontSize: "11px" }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                System Active
              </span>
              <span>·</span>
              <span>v2.4.0</span>
              <span>·</span>
              <span>Last updated: just now</span>
            </div>
          </Reveal>

          {/* Hero headline */}
          <Reveal delay={0.1}>
            <h1
              className="text-[40px] sm:text-[56px] lg:text-[72px] font-bold leading-[0.95] tracking-[-0.04em] mb-4"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Career intelligence
              <br />
              in <span style={{ color: "var(--ce-cyan)" }}>real time.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p
              className="text-[15px] leading-[1.7] max-w-[480px] mb-12"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              Every career move, quantified. Every archetype, mapped.
              Every outcome, tracked. This is what career development looks like
              when it's driven by data.
            </p>
          </Reveal>

          {/* Live metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
            <LiveMetric
              label="Active Roadmaps"
              value={<AnimatedNumber target={10247} />}
              change="+12.4%"
              icon={Activity}
              delay={0.2}
            />
            <LiveMetric
              label="Completion Rate"
              value={<><AnimatedNumber target={87} suffix="%" /></>}
              change="+3.2%"
              icon={TrendingUp}
              delay={0.25}
            />
            <LiveMetric
              label="Avg Job Matches"
              value={<AnimatedNumber target={23} />}
              change="+8.1%"
              icon={Zap}
              delay={0.3}
            />
            <LiveMetric
              label="Archetypes"
              value={<AnimatedNumber target={18} />}
              change="stable"
              positive={true}
              icon={BarChart3}
              delay={0.35}
            />
          </div>

          {/* Mini sparklines row */}
          <Reveal delay={0.4}>
            <div className="grid grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: "Roadmaps/day", color: "var(--ce-lime)" },
                { label: "Completion trend", color: "var(--ce-cyan)" },
                { label: "Match accuracy", color: "#8B5CF6" },
                { label: "User growth", color: "#F59E0B" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.015)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.03)",
                  }}
                >
                  <Sparkline color={item.color} height={30} />
                  <div
                    className="text-[9px] uppercase tracking-[0.1em] mt-2"
                    style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ARCHETYPE DISTRIBUTION ═══ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left — Info */}
            <div className="lg:col-span-5">
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
                  style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ce-lime)" }} />
                  Archetype Distribution
                </div>
                <h2
                  className="text-[28px] lg:text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] mb-4"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  18 archetypes.
                  <br />
                  Each with unique DNA.
                </h2>
                <p
                  className="text-[14px] leading-[1.75] mb-8"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                >
                  Our 15-question assessment maps you to one of 18 career archetypes.
                  Each has distinct patterns for how they plan, execute, and grow.
                  Your archetype determines your roadmap.
                </p>
              </Reveal>

              {/* Terminal output */}
              <Reveal delay={0.2}>
                <div
                  className="rounded-lg p-4 space-y-1.5"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.02)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                  }}
                >
                  <TerminalLine text="sophia.assess(user)" delay={0.3} />
                  <TerminalLine text="mapping 15 dimensions..." delay={0.5} />
                  <TerminalLine text="archetype: Strategist-Innovator (94% match)" delay={0.7} />
                  <TerminalLine text="matched 23 roles in 4 industries" delay={0.9} />
                  <TerminalLine text="roadmap generated → 6 phases, 18 milestones" delay={1.1} />
                </div>
              </Reveal>
            </div>

            {/* Right — Bar chart */}
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div
                  className="rounded-xl p-6 lg:p-8"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.02)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.12em] mb-6 flex items-center justify-between"
                    style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
                  >
                    <span>Archetype Match Distribution</span>
                    <span>Last 30 days</span>
                  </div>
                  <DataBarChart />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ECOSYSTEM DATA ═══ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
              style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ce-cyan)" }} />
              Ecosystem Metrics
            </div>
            <h2
              className="text-[28px] lg:text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] mb-12"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Six roles. One data fabric.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {[
              { role: "EdgeStar", metric: "10,247", sub: "active roadmaps", color: "var(--ce-cyan)", spark: "var(--ce-cyan)" },
              { role: "Mentors", metric: "1,432", sub: "verified guides", color: "#8B5CF6", spark: "#8B5CF6" },
              { role: "Parents", metric: "3,891", sub: "connected families", color: "#EC4899", spark: "#EC4899" },
              { role: "Institutions", metric: "247", sub: "partner schools", color: "#3B82F6", spark: "#3B82F6" },
              { role: "NGOs", metric: "89", sub: "active programs", color: "#F97316", spark: "#F97316" },
              { role: "Government", metric: "12", sub: "agency partners", color: "#6366F1", spark: "#6366F1" },
            ].map((item, i) => (
              <Reveal key={item.role} delay={i * 0.06}>
                <div
                  className="p-5 rounded-xl group"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.02)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span
                        className="text-[11px] uppercase tracking-[0.1em]"
                        style={{ fontFamily: "monospace", color: item.color }}
                      >
                        {item.role}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-[28px] font-bold tracking-[-0.03em] leading-none mb-1"
                    style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                  >
                    {item.metric}
                  </div>
                  <div
                    className="text-[11px] mb-3"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                  >
                    {item.sub}
                  </div>
                  <Sparkline color={item.spark} height={24} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA — Data-Driven ═══ */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center relative z-10">
          <Reveal>
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-6 flex items-center justify-center gap-2"
              style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Ready to map
            </div>
            <h2
              className="text-[36px] sm:text-[48px] lg:text-[64px] font-bold leading-[0.95] tracking-[-0.04em] mb-6"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Your data point
              <br />
              <span style={{ color: "var(--ce-cyan)" }}>starts here.</span>
            </h2>
            <p
              className="text-[14px] leading-[1.7] max-w-[420px] mx-auto mb-10"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              15 questions. 4 minutes. One archetype that changes how you
              see your career. Join 10,000+ people who mapped their edge.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <button
              onClick={() => onNavigate("signup")}
              className="px-8 py-4 rounded-lg text-[14px] font-medium flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5 mx-auto"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                background: "var(--ce-cyan)",
                color: "#08090C",
              }}
            >
              Start Assessment
              <ArrowRight size={16} />
            </button>
          </Reveal>

          <Reveal delay={0.25}>
            <div
              className="mt-6 text-[11px] tracking-[0.08em]"
              style={{ fontFamily: "monospace", color: "var(--ce-text-quaternary)" }}
            >
              Free · No credit card · Your data stays yours
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
