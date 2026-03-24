import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Route, FileCheck, Users, MessageCircle, Target } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V1: "The Editorial"
 * Typographic-led, poetic, maximum restraint.
 * Massive Urbanist headline. Dark editorial. Green glow as intelligence signal.
 * The roadmap preview is the hero visual.
 */

interface LandingV1Props {
  onNavigate: (page: string) => void;
}

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

// Animated section wrapper
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function LandingV1({ onNavigate }: LandingV1Props) {
  const stat1 = useCountUp(10247);
  const stat2 = useCountUp(87);
  const stat3 = useCountUp(23);

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Green glow — ambient intelligence signal */}
        <div
          className="absolute top-1/2 left-1/2 w-[900px] h-[600px] -translate-x-1/2 -translate-y-1/3 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--ce-lime-rgb),0.06) 0%, rgba(4,44,1,0.03) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(var(--ce-lime-rgb),0.06)",
              border: "1px solid rgba(var(--ce-lime-rgb),0.12)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-lime)] animate-pulse" />
            <span
              className="text-[12px] tracking-[0.02em]"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-lime)" }}
            >
              Now in beta
            </span>
            <span className="text-[12px]" style={{ color: "var(--ce-text-secondary)" }}>·</span>
            <span
              className="text-[12px]"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-tertiary)" }}
            >
              Career intelligence for everyone
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-[900px] mb-6"
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(40px, 7vw, 80px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--ce-text-primary)",
          }}
        >
          From where you are{" "}
          <br className="hidden sm:block" />
          to where you{" "}
          <span style={{ color: "var(--ce-lime)" }}>belong</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center max-w-[520px] mb-10"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 400,
            fontSize: "17px",
            lineHeight: 1.65,
            color: "var(--ce-text-tertiary)",
          }}
        >
          A personalized career roadmap in minutes. Guided by Sophia, 
          built around your goals, experience, and ambitions.
        </motion.p>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => onNavigate("signup")}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-lg text-[14px] transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 600,
              background: "var(--ce-lime)",
              color: "var(--ce-surface-0)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(var(--ce-lime-rgb),0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Get Your Edge
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => onNavigate("about")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-lg text-[14px] transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 500,
              background: "transparent",
              color: "var(--ce-text-tertiary)",
              border: "1px solid rgba(var(--ce-glass-tint),0.08)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.15)"; e.currentTarget.style.color = "var(--ce-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.08)"; e.currentTarget.style.color = "var(--ce-text-tertiary)"; }}
          >
            See how it works
          </button>
        </motion.div>

        {/* Hero product visual — Roadmap preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 lg:mt-20 w-full max-w-[1000px]"
        >
          {/* Glow beneath */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-[200px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(var(--ce-lime-rgb),0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Dashboard mockup — always renders as dark-themed app screenshot */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: "#0E1117",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="px-3 py-1 rounded-md text-[10px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    color: "#5C6370",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  careeredged.com/edgepath
                </div>
              </div>
            </div>

            {/* Roadmap content */}
            <div className="p-6 lg:p-8">
              {/* Sophia insight bar */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6"
                style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)" }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(34,211,238,0.15)" }}>
                  <Sparkles size={12} style={{ color: "#22D3EE" }} />
                </div>
                <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "#22D3EE" }}>
                  Sophia: Based on your experience in marketing, I mapped 4 phases to reach VP of Marketing at a Series B startup.
                </span>
              </div>

              {/* Roadmap phases */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { phase: "Phase 1", title: "Foundation", weeks: "Weeks 1–4", progress: 100, status: "Complete" },
                  { phase: "Phase 2", title: "Skills Gap", weeks: "Weeks 5–12", progress: 65, status: "In Progress" },
                  { phase: "Phase 3", title: "Network", weeks: "Weeks 13–20", progress: 0, status: "Upcoming" },
                  { phase: "Phase 4", title: "Launch", weeks: "Weeks 21–28", progress: 0, status: "Upcoming" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4"
                    style={{
                      background: p.progress === 100
                        ? "rgba(179,255,59,0.04)"
                        : "rgba(255,255,255,0.02)",
                      border: p.progress > 0 && p.progress < 100
                        ? "1px solid rgba(179,255,59,0.15)"
                        : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: "'Satoshi', sans-serif", color: "#9CA3AF" }}>
                      {p.phase}
                    </span>
                    <h4 className="mt-1 text-[14px]" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, color: "#E8E8ED" }}>
                      {p.title}
                    </h4>
                    <span className="text-[11px] mt-0.5 block" style={{ fontFamily: "'Satoshi', sans-serif", color: "#9CA3AF" }}>
                      {p.weeks}
                    </span>
                    <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.progress}%`,
                          background: p.progress === 100 ? "#B3FF3B" : "rgba(179,255,59,0.6)",
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] mt-2 block"
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        color: p.progress === 100 ? "#B3FF3B" : p.progress > 0 ? "#8B90A0" : "#5C6370",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-20 lg:py-24 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-16">
          {[
            { ref: stat1.ref, count: stat1.count, suffix: "+", label: "Career roadmaps generated", sub: "and counting" },
            { ref: stat2.ref, count: stat2.count, suffix: "%", label: "Average ATS score improvement", sub: "first session" },
            { ref: stat3.ref, count: stat3.count, suffix: "min", label: "Average time to first roadmap", sub: "from sign-up" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div ref={stat.ref} className="text-center">
                <span
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 700,
                    fontSize: "48px",
                    letterSpacing: "-0.03em",
                    color: "var(--ce-lime)",
                    lineHeight: 1,
                  }}
                >
                  {stat.count.toLocaleString()}{stat.suffix}
                </span>
                <span
                  className="text-[10px] ml-1 inline-block"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)", verticalAlign: "super" }}
                >
                  _
                </span>
                <p className="mt-2 text-[14px]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-primary)" }}>
                  {stat.label}
                </p>
                <p className="mt-0.5 text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                  {stat.sub}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES — BENTO ═══ */}
      <section className="py-20 lg:py-28 px-6" style={{ background: "var(--ce-surface-bg)" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <div className="mb-16 max-w-[560px]">
              <span
                className="text-[11px] uppercase tracking-[0.12em] block mb-4"
                style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-secondary)" }}
              >
                // What you get
              </span>
              <h2
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--ce-text-primary)",
                }}
              >
                Every tool your career needs.{" "}
                <span style={{ color: "var(--ce-text-secondary)" }}>Nothing it doesn't.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Route,
                title: "EdgePath",
                desc: "A personalized career roadmap from where you are to where you want to be. Phases, milestones, timelines — built around your reality.",
                accent: true,
              },
              {
                icon: FileCheck,
                title: "ResumeEdge",
                desc: "Three optimization engines. ATS scoring. Cover letter generation. Your resume, refined to compete.",
              },
              {
                icon: MessageCircle,
                title: "Sophia",
                desc: "Your career guide. She knows your journey, remembers your context, and meets you wherever you are in the platform.",
              },
              {
                icon: Target,
                title: "EdgeMatch",
                desc: "Jobs matched to your profile, your roadmap, and your trajectory — not just keywords. Apply with context, not cold.",
              },
              {
                icon: Users,
                title: "EdgeBuddy",
                desc: "Accountability matching. Get paired with someone on a parallel journey. Shared goals, regular check-ins, mutual momentum.",
              },
              {
                icon: Sparkles,
                title: "Career Discovery",
                desc: "Explore 30+ careers across 11 industries. Salary data, growth projections, and a 15-question assessment to find your archetype.",
              },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className="group rounded-xl p-6 lg:p-7 h-full transition-all duration-300"
                  style={{
                    background: feature.accent
                      ? "rgba(var(--ce-lime-rgb),0.03)"
                      : "rgba(var(--ce-glass-tint),0.02)",
                    border: feature.accent
                      ? "1px solid rgba(var(--ce-lime-rgb),0.1)"
                      : "1px solid rgba(var(--ce-glass-tint),0.04)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = feature.accent ? "rgba(var(--ce-lime-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = feature.accent ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"; }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-5"
                    style={{
                      background: feature.accent ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)",
                    }}
                  >
                    <feature.icon size={17} style={{ color: feature.accent ? "var(--ce-lime)" : "var(--ce-text-tertiary)" }} />
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "var(--ce-text-primary)",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[13px] leading-[1.65]"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROLE SECTIONS ═══ */}
      <section className="py-20 lg:py-28 px-6" style={{ background: "var(--ce-surface-bg)" }}>
        <div className="max-w-[1200px] mx-auto">
          {[
            {
              marker: "// For career seekers",
              headline: "Your next chapter, mapped.",
              body: "Whether you're starting out, switching fields, or leveling up — CareerEdge understands your situation and builds a plan that's actually yours. Not a template. Not a generic list. A roadmap with your name on it.",
              cta: "Start for free",
            },
            {
              marker: "// For employers",
              headline: "Hire with signal, not noise.",
              body: "Post roles individually or in bulk. Track candidates through customizable stages. Get analytics that show pipeline health, not just applicant counts. CareerEdge connects you with candidates who have context — they know why they're applying.",
              cta: "Learn more",
            },
            {
              marker: "// For institutions",
              headline: "Outcomes you can measure.",
              body: "Connect with students, track career outcomes for NACE and CSEA compliance, host virtual career fairs, and manage employer partnerships — all in one platform. Your career services office, modernized.",
              cta: "Learn more",
            },
          ].map((section, i) => (
            <Reveal key={i}>
              <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 py-16 lg:py-20"
                style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}
              >
                <div className="lg:col-span-3">
                  <span
                    className="text-[11px] tracking-[0.06em]"
                    style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-secondary)" }}
                  >
                    {section.marker}
                  </span>
                </div>
                <div className="lg:col-span-7">
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(24px, 3vw, 36px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: "var(--ce-text-primary)",
                    }}
                  >
                    {section.headline}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.7] mb-6"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
                  >
                    {section.body}
                  </p>
                  <button
                    onClick={() => onNavigate("signup")}
                    className="flex items-center gap-2 text-[13px] transition-colors duration-200 cursor-pointer"
                    style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-lime)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#c4ff6a"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-lime)"; }}
                  >
                    {section.cta}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ SOPHIA SECTION ═══ */}
      <section className="relative py-20 lg:py-28 px-6 overflow-hidden" style={{ background: "var(--ce-surface-bg)" }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--ce-role-edgestar-rgb),0.04) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <Reveal>
            <span
              className="text-[11px] uppercase tracking-[0.12em] block mb-6"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-secondary)" }}
            >
              // Meet Sophia
            </span>
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 4vw, 44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--ce-text-primary)",
              }}
            >
              A career guide that{" "}
              <span style={{ color: "var(--ce-role-edgestar)" }}>remembers</span>
            </h2>
            <p
              className="text-[16px] leading-[1.7] max-w-[600px] mx-auto mb-10"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
            >
              Sophia doesn't start from scratch every time. She knows your goals, 
              your progress, your context. Ask her anything — she'll meet you where 
              you are, not where a chatbot template starts.
            </p>
          </Reveal>

          {/* Chat mockup — always dark-themed to match app screenshot */}
          <Reveal delay={0.15}>
            <div
              className="rounded-xl p-5 text-left max-w-[540px] mx-auto"
              style={{
                background: "#0E1117",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                { from: "user", text: "I got a callback for the product manager role at Stripe." },
                { from: "sophia", text: "That's exciting — and it aligns with Phase 2 of your roadmap. Want me to pull up your interview prep materials and the company research I compiled last week?" },
                { from: "user", text: "Yes, and can you check if my resume is optimized for this specific JD?" },
                { from: "sophia", text: "Already on it. Your current resume scores 72% against this JD. I can boost that to 90%+ with three adjustments. Want to see them?" },
              ].map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-3 last:mb-0`}
                >
                  <div
                    className="max-w-[85%] px-4 py-2.5 rounded-xl text-[13px] leading-[1.6]"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      background: msg.from === "user"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(34,211,238,0.06)",
                      border: msg.from === "sophia" ? "1px solid rgba(34,211,238,0.08)" : "1px solid rgba(255,255,255,0.04)",
                      color: msg.from === "user" ? "#E8E8ED" : "#22D3EE",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TRUST / FAQ ═══ */}
      <section className="py-20 lg:py-28 px-6" style={{ background: "var(--ce-surface-bg)" }}>
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <h2
              className="text-center mb-12"
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--ce-text-primary)",
              }}
            >
              Questions
            </h2>
          </Reveal>

          <div className="flex flex-col gap-2">
            {[
              {
                q: "What makes CareerEdge different from a job board?",
                a: "Job boards give you listings. We give you a plan. CareerEdge maps your entire career trajectory — from skill gaps to milestones to matched opportunities — so you're not just applying, you're advancing.",
              },
              {
                q: "How does Sophia work?",
                a: "Sophia is your career guide. She learns your goals during onboarding, tracks your progress, and provides contextual guidance across every surface in the platform. She remembers — so you never repeat yourself.",
              },
              {
                q: "Is my data private?",
                a: "Your data stays yours. We don't sell it, share it, or use it to train models. You control what's visible and who sees it. Privacy isn't a feature — it's the default.",
              },
              {
                q: "Who is CareerEdge for?",
                a: "Career seekers, career changers, entrepreneurs, educators, employers, coaches, and organizations that care about career outcomes. The platform adapts to your role.",
              },
              {
                q: "Is it free?",
                a: "Core features are free forever. Advanced tools and expanded capabilities are available through our Plus and Pro plans.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <FAQItem question={item.q} answer={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden" style={{ background: "var(--ce-surface-bg)" }}>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--ce-lime-rgb),0.05) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        <div className="max-w-[600px] mx-auto text-center relative z-10">
          <Reveal>
            <h2
              className="mb-5"
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 4vw, 44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--ce-text-primary)",
              }}
            >
              Your career has an edge.
              <br />
              <span style={{ color: "var(--ce-lime)" }}>Find it.</span>
            </h2>
            <p
              className="text-[15px] leading-[1.7] mb-8 max-w-[420px] mx-auto"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
            >
              Start free. Get a personalized roadmap in minutes. 
              No credit card required.
            </p>
            <button
              onClick={() => onNavigate("signup")}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg text-[15px] transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 600,
                background: "var(--ce-lime)",
                color: "var(--ce-surface-0)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(var(--ce-lime-rgb),0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Get Your Edge
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}

// FAQ Accordion Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: open ? "rgba(var(--ce-glass-tint),0.02)" : "transparent",
        border: "1px solid",
        borderColor: open ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-glass-tint),0.03)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
      >
        <span
          className="text-[14px] text-left"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 500,
            color: open ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
          }}
        >
          {question}
        </span>
        <span
          className="text-[18px] transition-transform duration-200 ml-4 shrink-0"
          style={{
            color: open ? "var(--ce-lime)" : "var(--ce-text-quaternary)",
            transform: open ? "rotate(45deg)" : "rotate(0)",
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0" }}
      >
        <p
          className="px-5 pb-4 text-[13px] leading-[1.7]"
          style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}
