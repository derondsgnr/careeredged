import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Route, FileCheck, MessageCircle, Target, ArrowDown } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V3: "The Narrative"
 * Scroll-driven storytelling. Each section is a chapter.
 * Dark→light rhythm. Sophia introduced as a character mid-scroll.
 * Most ambitious motion design. The "experience" variation.
 * Typography-as-architecture moments.
 */

interface LandingV3Props {
  onNavigate: (page: string) => void;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return { count, ref };
}

// Typing cursor effect
function TypedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, text, delay]);

  return (
    <span ref={ref}>
      {displayed}
      <span className="animate-pulse" style={{ color: "var(--ce-lime)" }}>|</span>
    </span>
  );
}

export function LandingV3({ onNavigate }: LandingV3Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const s1 = useCountUp(10247);
  const s2 = useCountUp(87);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--ce-void)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ CH.1: THE OPENING ═══ */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(var(--ce-glass-tint),0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Green glow — large, soft */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(1,33,44,0.15) 0%, rgba(var(--ce-cyan-rgb),0.03) 30%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />

        <motion.div className="relative z-10 text-center max-w-[1000px]">
          {/* CE monogram — large, architectural */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <svg width="52" height="70" viewBox="0 0 133 180" fill="none" className="mx-auto">
              <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="rgba(var(--ce-cyan-rgb),0.3)"/>
              <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="rgba(var(--ce-cyan-rgb),0.3)"/>
              <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="rgba(var(--ce-cyan-rgb),0.3)"/>
            </svg>
          </motion.div>

          {/* Headline — massive, poetic */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(42px, 8vw, 96px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--ce-text-primary)",
            }}
          >
            Every career has
            <br />
            an inflection point
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6 text-[17px] max-w-[440px] mx-auto"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)", lineHeight: 1.65 }}
          >
            <span style={{ color: "var(--ce-text-secondary)" }}>This is yours.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-10"
          >
            <button
              onClick={() => onNavigate("signup")}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg text-[15px] cursor-pointer transition-all duration-200"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, background: "var(--ce-cyan)", color: "var(--ce-surface-0)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(var(--ce-cyan-rgb),0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Map your career
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowDown size={16} style={{ color: "var(--ce-text-quaternary)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ CH.2: THE PROBLEM ═══ */}
      <section className="py-28 lg:py-36 px-6" style={{ background: "var(--ce-void)" }}>
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.12em] block mb-8" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-quaternary)" }}>
              // The problem
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3.5vw, 36px)",
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              color: "var(--ce-text-primary)",
            }}>
              You know where you want to go.{" "}
              <span style={{ color: "var(--ce-text-tertiary)" }}>
                But the path is unclear. Job boards give you listings, not direction. 
                Career coaches cost $200/hour. LinkedIn shows you where others went, 
                not where you should go.
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8" style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3.5vw, 36px)",
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              color: "var(--ce-text-primary)",
            }}>
              Career planning shouldn't feel like guesswork.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ CH.3: THE ANSWER ═══ */}
      <section className="py-28 lg:py-36 px-6" style={{ background: "#0C0E12" }}>
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.12em] block mb-8" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-quaternary)" }}>
              // The answer
            </span>
          </Reveal>

          {/* Large statement */}
          <Reveal delay={0.1}>
            <h2 className="mb-16" style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ce-text-primary)",
            }}>
              Career<br />
              <span style={{ color: "var(--ce-cyan)" }}>intelligence</span>
            </h2>
          </Reveal>

          {/* Feature cards — staggered scroll reveal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                icon: Route,
                chapter: "01",
                title: "Your path, mapped",
                desc: "Tell us where you are and where you want to be. In minutes, you have a roadmap — phases, milestones, timelines — built around your specific situation.",
              },
              {
                icon: FileCheck,
                chapter: "02",
                title: "Your resume, sharpened",
                desc: "Three engines optimize your resume for ATS systems, recruiter preferences, and human readability. Specific, not generic. Scored, not guessed.",
              },
              {
                icon: Target,
                chapter: "03",
                title: "Your jobs, matched",
                desc: "Not keyword matching — trajectory matching. Jobs aligned with your roadmap, your skills, your direction. Apply with context, not cold.",
              },
              {
                icon: MessageCircle,
                chapter: "04",
                title: "Your guide, Sophia",
                desc: "She knows your goals, your progress, your context. Ask her anything about your career — she meets you where you are, not where a template starts.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className="rounded-xl p-7 lg:p-8 h-full group transition-all duration-300"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.02)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.04)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-cyan-rgb),0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.04)"; }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] tracking-[0.08em]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-quaternary)" }}>
                      {item.chapter}
                    </span>
                    <div className="h-px flex-1" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }} />
                    <item.icon size={16} style={{ color: "var(--ce-text-tertiary)" }} />
                  </div>
                  <h3 className="mb-3" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "20px", color: "var(--ce-text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-[1.7]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CH.4: SOPHIA ═══ */}
      <section className="relative py-28 lg:py-36 px-6 overflow-hidden" style={{ background: "var(--ce-void)" }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--ce-role-edgestar-rgb),0.04) 0%, transparent 55%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-[900px] mx-auto relative z-10">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.12em] block mb-8" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-quaternary)" }}>
              // Meet Sophia
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mb-6" style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--ce-text-primary)",
            }}>
              Not a chatbot.{" "}
              <span style={{ color: "var(--ce-role-edgestar)" }}>A career guide.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-[16px] leading-[1.7] max-w-[600px] mb-12" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
              Sophia understands career trajectories, not just keywords. She remembers 
              every conversation, tracks your progress across tools, and provides guidance 
              that's specific to your situation — not templated advice.
            </p>
          </Reveal>

          {/* Conversation */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat */}
              <div
                className="rounded-xl p-5"
                style={{ background: "rgba(18,20,26,0.6)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
              >
                <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.12)" }}>
                    <Sparkles size={11} style={{ color: "var(--ce-role-edgestar)" }} />
                  </div>
                  <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-role-edgestar)" }}>Sophia</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)] animate-pulse" />
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { from: "sophia", text: "You've completed 3 of 6 milestones in Phase 2. The skills gap is closing — your project management cert finishes next week." },
                    { from: "user", text: "What should I focus on after the cert?" },
                    { from: "sophia", text: "Two things: your portfolio needs a case study showing cross-functional leadership, and there are 4 VP-level roles that just opened at companies on your target list. Want me to pull them up?" },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-[90%] px-3.5 py-2.5 rounded-xl text-[12px] leading-[1.6]"
                        style={{
                          fontFamily: "'Satoshi', sans-serif",
                          background: msg.from === "user" ? "rgba(var(--ce-glass-tint),0.05)" : "rgba(var(--ce-role-edgestar-rgb),0.05)",
                          border: msg.from === "sophia" ? "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" : "1px solid rgba(var(--ce-glass-tint),0.04)",
                          color: msg.from === "user" ? "var(--ce-text-primary)" : "var(--ce-text-secondary)",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What makes her different */}
              <div className="flex flex-col gap-4 justify-center">
                {[
                  { title: "Remembers everything", desc: "Never re-asks what she already knows. Your goals, your history, your context — always present." },
                  { title: "Cross-surface awareness", desc: "Progress on your roadmap informs her resume advice. A new job match updates her interview prep. Everything connects." },
                  { title: "Guidance, not answers", desc: "She points you toward decisions, doesn't make them for you. Your career, your agency." },
                ].map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] mb-1" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, color: "var(--ce-text-primary)" }}>
                        {point.title}
                      </h4>
                      <p className="text-[12px] leading-[1.65]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CH.5: THE NUMBERS — LIME SECTION ═══ */}
      <section className="py-24 lg:py-28 px-6" style={{ background: "var(--ce-cyan)" }}>
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.12em] block mb-6" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "rgba(10,12,16,0.4)" }}>
              // By the numbers
            </span>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-20">
            <Reveal delay={0.1}>
              <div ref={s1.ref}>
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "-0.04em", color: "var(--ce-surface-0)", lineHeight: 1 }}>
                  {s1.count.toLocaleString()}
                </span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(10,12,16,0.4)", marginLeft: "4px" }}>+</span>
                <p className="mt-2 text-[15px]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "rgba(10,12,16,0.7)" }}>
                  Career roadmaps generated
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div ref={s2.ref}>
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "-0.04em", color: "var(--ce-surface-0)", lineHeight: 1 }}>
                  {s2.count}
                </span>
                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(10,12,16,0.4)", marginLeft: "4px" }}>%</span>
                <p className="mt-2 text-[15px]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "rgba(10,12,16,0.7)" }}>
                  Average ATS score improvement
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CH.6: ECOSYSTEM ═══ */}
      <section className="py-28 lg:py-36 px-6" style={{ background: "var(--ce-void)" }}>
        <div className="max-w-[800px] mx-auto">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.12em] block mb-8" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "var(--ce-text-quaternary)" }}>
              // Not just for seekers
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mb-12" style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--ce-text-primary)",
            }}>
              A career ecosystem.{" "}
              <span style={{ color: "var(--ce-text-tertiary)" }}>Every stakeholder, connected.</span>
            </h2>
          </Reveal>

          <div className="flex flex-col gap-4">
            {[
              { label: "Career Seekers", desc: "Roadmaps, resumes, job matching, career discovery" },
              { label: "Employers", desc: "Post roles, track pipelines, access hiring analytics" },
              { label: "Institutions", desc: "Student outcomes, career fairs, NACE/CSEA compliance" },
              { label: "Coaches & Mentors", desc: "Sessions, courses, public booking, earnings" },
              { label: "International Professionals", desc: "Cross-border career planning, credential evaluation" },
              { label: "NGOs & Government", desc: "Resource management, workforce programs, grant distribution" },
            ].map((role, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className="flex items-center justify-between py-5 transition-all duration-200 group cursor-default"
                  style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
                >
                  <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "17px", color: "var(--ce-text-primary)" }}>
                    {role.label}
                  </span>
                  <span
                    className="text-[13px] hidden sm:block transition-colors duration-200"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                  >
                    {role.desc}
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--ce-text-quaternary)" }} className="group-hover:translate-x-1 transition-transform duration-200 shrink-0 ml-4" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CH.7: CLOSE ═══ */}
      <section className="relative py-32 lg:py-40 px-6 overflow-hidden" style={{ background: "var(--ce-surface-0)" }}>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(var(--ce-cyan-rgb),0.04) 0%, transparent 55%)", filter: "blur(100px)" }}
        />

        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ce-text-primary)",
            }}>
              The next chapter
              <br />
              <span style={{ color: "var(--ce-cyan)" }}>starts here</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 text-[16px] leading-[1.7] max-w-[440px] mx-auto mb-10" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
              Free to start. No credit card. Your roadmap in minutes.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <button
              onClick={() => onNavigate("signup")}
              className="group inline-flex items-center gap-2 px-9 py-4.5 rounded-lg text-[16px] cursor-pointer transition-all duration-200"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, background: "var(--ce-cyan)", color: "var(--ce-surface-0)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(var(--ce-cyan-rgb),0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Get Your Edge
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}