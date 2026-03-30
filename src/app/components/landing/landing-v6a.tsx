import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V6-A: "Conviction"
 *
 * VOICE: The Economist meets Linear.
 * Declarative. Provokes. Lets the work speak.
 *
 * Apple copy: one big idea, radical brevity, contrast
 * Linear: restraint + monochrome + rare color
 * Scalient: counter animations, trust cascade, generous whitespace
 * NO section labels. NO PowerPoint. Sharp corners. Editorial type.
 * Outcome-forward. Technology as enabler, never the headline.
 */

interface LandingV6AProps {
  onNavigate: (page: string) => void;
}

function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => { v += step; if (v >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(v)); }, 16);
    return () => clearInterval(t);
  }, [inView, end, duration]);
  return <span ref={ref}>{inView ? count.toLocaleString() : "0"}{suffix}</span>;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  );
}

export function LandingV6A({ onNavigate }: LandingV6AProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(var(--ce-cyan-rgb), 0.05) 0%, transparent 70%)", transform: "translateY(-50%)" }} />

        <motion.div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-8" style={{ background: "rgba(var(--ce-cyan-rgb), 0.06)", border: "1px solid rgba(var(--ce-cyan-rgb), 0.12)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ce-cyan)" }} />
                  <span className="text-[11px] tracking-[0.04em] font-medium" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-cyan)" }}>Now in Beta</span>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[72px] font-bold leading-[0.92] tracking-[-0.04em] mb-6" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                  A plan.
                  <br />
                  Not another
                  <br />
                  <span className="italic font-light" style={{ color: "var(--ce-cyan)" }}>job board.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="text-[15px] leading-[1.75] max-w-[380px] mb-8" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                  CareerEdge maps where you are to where you belong.
                  Resume optimization, job matching, and career intelligence
                  — connected through one system that remembers your goals.
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="flex flex-wrap items-center gap-4">
                  <button onClick={() => onNavigate("signup")} className="px-6 py-3.5 rounded-sm text-[13px] font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:gap-3.5" style={{ fontFamily: "'Satoshi', sans-serif", background: "var(--ce-cyan)", color: "#08090C" }}>
                    Get Your Edge <ArrowRight size={14} />
                  </button>
                  <button onClick={() => onNavigate("about")} className="px-6 py-3.5 rounded-sm text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-all duration-300 hover:gap-3.5" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint), 0.1)" }}>
                    See How It Works <ArrowUpRight size={14} />
                  </button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-8 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(var(--ce-cyan-rgb), 0.06) 0%, transparent 70%)" }} />
                <div className="relative rounded-sm overflow-hidden" style={{ border: "1px solid rgba(var(--ce-glass-tint), 0.06)", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" alt="Career roadmap dashboard" className="w-full" />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: "rgba(8,9,12,0.85)", backdropFilter: "blur(12px)" }}>
                    <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-cyan)" }}>
                      "23 roles match your profile right now."
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* TRUST */}
      <section className="py-12" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint), 0.03)", borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.03)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-center gap-12 lg:gap-20 opacity-25 flex-wrap">
            {["Stanford", "MIT", "Google", "Deloitte", "NYU", "McKinsey"].map((n) => (
              <span key={n} className="text-[13px] font-semibold tracking-[0.04em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TENSION */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[900px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-light leading-[1.3] tracking-[-0.02em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              You've rewritten your resume four times this month.
              Applied to jobs you're not sure about.
              Wondered if anyone actually reads these applications.
              <br /><br />
              <span style={{ color: "var(--ce-text-quaternary)" }}>
                The problem was never your resume.
                It was never having a direction to aim it.
              </span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="py-24 lg:py-32" style={{ background: "var(--ce-surface-1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-20">
            {[
              { end: 20, suffix: "pt", label: "average ATS score improvement", sub: "within one resume optimization" },
              { end: 5, suffix: "min", label: "to your first personalized roadmap", sub: "from signup to career clarity" },
              { end: 800, suffix: "+", label: "professions mapped", sub: "across every major industry" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div>
                  <div className="text-[56px] lg:text-[72px] font-bold leading-none tracking-[-0.04em] mb-3" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-lime)" }}>
                    <Counter end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="text-[14px] font-medium mb-1" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}>{s.label}</div>
                  <div className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}>{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-semibold leading-[1.1] tracking-[-0.03em] mb-4 max-w-[600px]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Six tools. One system.
              <br />
              <span style={{ color: "var(--ce-text-tertiary)" }}>Everything connected.</span>
            </h2>
            <p className="text-[14px] leading-[1.7] max-w-[440px] mb-16" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
              Your roadmap informs your resume. Your resume targets your matches.
              Your matches feed back to your roadmap. Nothing exists in isolation.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px]" style={{ background: "rgba(var(--ce-glass-tint), 0.04)" }}>
            {[
              { title: "EdgePath", sub: "Career roadmap built around who you are, not what keywords you match.", accent: "var(--ce-lime)" },
              { title: "ResumeEdge", sub: "Three optimization engines. Average 20-point ATS lift on first pass.", accent: "#8B5CF6" },
              { title: "EdgeMatch", sub: "Job matching by career fit, not keyword overlap. Smarter targeting.", accent: "#10B981" },
              { title: "EdgeProd", sub: "Sprint timers, goal tracking, and accountability. Stay in motion.", accent: "#F59E0B" },
              { title: "Global Mobility", sub: "Visa timelines, cost estimates, and relocation pathways for international careers.", accent: "#3B82F6" },
              { title: "EdgeBuddy", sub: "Paired accountability. Someone who checks in, not checks up.", accent: "#EC4899" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <div className="p-8 h-full group cursor-default" style={{ background: "var(--ce-surface-bg)" }}>
                  <div className="w-8 h-[2px] mb-6 transition-all duration-500 group-hover:w-14" style={{ background: item.accent }} />
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] mb-2" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{item.title}</h3>
                  <p className="text-[13px] leading-[1.65]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>{item.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDANCE */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(var(--ce-cyan-rgb), 0.03) 0%, transparent 55%)" }} />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-light leading-[1.15] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                  Guidance that
                  <br />
                  <span className="font-semibold" style={{ color: "var(--ce-cyan)" }}>remembers you.</span>
                </h2>
                <p className="text-[15px] leading-[1.75] max-w-[420px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                  Every recommendation is grounded in your goals, your constraints,
                  and your progress. Not generic advice — a system that knows where
                  you've been and where you're headed.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div className="rounded-sm p-6 space-y-4" style={{ background: "rgba(var(--ce-glass-tint), 0.025)", border: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-cyan-rgb), 0.1)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--ce-cyan)" }} />
                  </div>
                  <div className="rounded-sm px-4 py-3" style={{ background: "rgba(var(--ce-glass-tint), 0.03)" }}>
                    <p className="text-[13px] leading-[1.6]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}>
                      Based on your profile and transition goals, I found 3 roles
                      with strong career fit. One needs a skill you're 80% toward —
                      want me to show the gap?
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-10">
                  {["Show the gap", "Update my resume", "Compare roles"].map((chip, i) => (
                    <span key={chip} className="px-3 py-1.5 rounded-sm text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-80" style={{ background: i === 0 ? "rgba(var(--ce-cyan-rgb), 0.08)" : i === 1 ? "rgba(var(--ce-lime-rgb), 0.08)" : "rgba(var(--ce-glass-tint), 0.05)", color: i === 0 ? "var(--ce-cyan)" : i === 1 ? "var(--ce-lime)" : "var(--ce-text-tertiary)", border: `1px solid ${i === 0 ? "rgba(var(--ce-cyan-rgb), 0.15)" : i === 1 ? "rgba(var(--ce-lime-rgb), 0.15)" : "rgba(var(--ce-glass-tint), 0.08)"}` }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-24 lg:py-32" style={{ background: "var(--ce-surface-1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] font-light leading-[1.2] tracking-[-0.02em] mb-16" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Not just for job seekers. <span style={{ color: "var(--ce-text-quaternary)" }}>An entire network.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { role: "Career Seekers", accent: "var(--ce-cyan)" },
              { role: "Entrepreneurs", accent: "var(--ce-lime)" },
              { role: "Coaches & Mentors", accent: "#8B5CF6" },
              { role: "Employers", accent: "#3B82F6" },
              { role: "Institutions", accent: "#F97316" },
              { role: "Parents", accent: "#EC4899" },
              { role: "NGOs", accent: "#10B981" },
              { role: "Government", accent: "#6366F1" },
            ].map((item, i) => (
              <Reveal key={item.role} delay={i * 0.03}>
                <div className="group cursor-default pb-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                  <div className="w-6 h-[1.5px] mb-3 transition-all duration-400 group-hover:w-10" style={{ background: item.accent }} />
                  <span className="text-[14px] font-medium" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{item.role}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-16">
          <div className="space-y-16">
            {[
              { quote: "I was stuck between consulting and product for two years. Fifteen minutes with the assessment gave me more clarity than six months of coaching.", name: "Amara O.", context: "Product Lead, previously Deloitte" },
              { quote: "It remembered my visa constraints before I mentioned them. Recommendations factored in my need for sponsorship-friendly roles. Nothing else does that.", name: "Wei L.", context: "Software Engineer, transitioning from Shanghai" },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div>
                  <p className="text-[20px] sm:text-[24px] font-light leading-[1.5] tracking-[-0.01em] mb-6 italic" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px]" style={{ background: "rgba(var(--ce-glass-tint), 0.15)" }} />
                    <span className="text-[13px] font-medium" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>{t.name}</span>
                    <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}>{t.context}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 lg:py-32" style={{ background: "var(--ce-surface-1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] mb-2" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Start free. Upgrade when you're ready.
            </h2>
            <p className="text-[13px] mb-16" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}>No credit card required.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] rounded-sm overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint), 0.05)" }}>
            {[
              { name: "Free", price: "$0", period: "forever", features: ["Career assessment", "Basic roadmap", "1 resume optimization", "Community access"], hl: false },
              { name: "Edge Plus", price: "$19", period: "/mo", features: ["Advanced resume engines", "Priority guidance", "Enhanced analytics", "15 monthly credits"], hl: true },
              { name: "Edge Pro", price: "$39", period: "/mo", features: ["Unlimited tools", "Premium templates", "Full platform access", "35 monthly credits"], hl: false },
            ].map((p) => (
              <Reveal key={p.name}>
                <div className="p-8 h-full flex flex-col" style={{ background: p.hl ? "rgba(var(--ce-cyan-rgb), 0.025)" : "var(--ce-surface-bg)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[12px] font-mono tracking-[0.04em]" style={{ color: "var(--ce-text-quaternary)" }}>{p.name}</span>
                    {p.hl && <span className="text-[9px] font-mono tracking-[0.08em] px-2 py-0.5 rounded-sm" style={{ background: "rgba(var(--ce-cyan-rgb), 0.12)", color: "var(--ce-cyan)" }}>POPULAR</span>}
                  </div>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-[40px] font-bold tracking-[-0.03em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{p.price}</span>
                    <span className="text-[12px] font-mono" style={{ color: "var(--ce-text-quaternary)" }}>{p.period}</span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 mb-8">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full" style={{ background: p.hl ? "var(--ce-cyan)" : "var(--ce-text-quaternary)" }} />
                        <span className="text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onNavigate("signup")} className="w-full py-3 rounded-sm text-[12px] font-semibold tracking-[0.02em] cursor-pointer transition-all duration-200" style={{ background: p.hl ? "var(--ce-cyan)" : "transparent", color: p.hl ? "#08090C" : "var(--ce-text-secondary)", border: p.hl ? "none" : "1px solid rgba(var(--ce-glass-tint), 0.08)" }}>
                    {p.price === "$0" ? "Start Free" : "Get Started"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[900px] mx-auto px-6 lg:px-16 text-center">
          <Reveal>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-bold leading-[0.95] tracking-[-0.04em] mb-4" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Stop applying blind.
            </h2>
            <p className="text-[15px] mb-10" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
              Five minutes to a roadmap built around you.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <button onClick={() => onNavigate("signup")} className="px-8 py-4 rounded-sm text-[14px] font-semibold flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5 mx-auto" style={{ fontFamily: "'Satoshi', sans-serif", background: "var(--ce-cyan)", color: "#08090C" }}>
              Get Your Edge <ArrowUpRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
