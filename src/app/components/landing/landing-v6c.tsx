import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V6-C: "Precision"
 *
 * VOICE: Linear meets Swiss International.
 * Declarative. Data carries the narrative. Silence is design.
 *
 * Linear: monochrome + rare color, sequential layout, restraint
 * Apple: radical brevity, pyramid structure
 * Scalient: counter animations, pricing transparency
 * Swiss: grid discipline, monospace details, connector lines
 * NO labels. NO decoration. Numbers speak. Space speaks.
 */

interface LandingV6CProps {
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
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  );
}

export function LandingV6C({ onNavigate }: LandingV6CProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* HERO — Data IS the visual */}
      <section ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden pt-[72px] pb-20 lg:pb-28">
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(var(--ce-glass-tint), 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--ce-glass-tint), 0.4) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

        <motion.div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full" style={{ opacity: heroOpacity }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-6" style={{ color: "var(--ce-text-quaternary)" }}>Career Intelligence Platform</div>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[80px] font-bold leading-[0.92] tracking-[-0.04em] mb-6" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                  Direction,
                  <br />
                  not <span className="italic font-light" style={{ color: "var(--ce-lime)" }}>listings.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-[15px] leading-[1.75] max-w-[420px] mb-8" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                  A career roadmap built around your goals, your constraints,
                  and your trajectory. Resume optimization. Job matching. Progress tracking.
                  One connected system.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <button onClick={() => onNavigate("signup")} className="px-6 py-3.5 rounded-sm text-[13px] font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:gap-3.5" style={{ fontFamily: "'Satoshi', sans-serif", background: "var(--ce-lime)", color: "#08090C" }}>
                  Start Free <ArrowRight size={14} />
                </button>
              </Reveal>
            </div>

            {/* Specs column */}
            <div className="lg:col-span-3 lg:col-start-10">
              <Reveal delay={0.18}>
                <div className="space-y-5">
                  {[
                    { label: "Professions mapped", value: "800+" },
                    { label: "Skills indexed", value: "400+" },
                    { label: "Time to first value", value: "<5 min" },
                    { label: "Avg ATS improvement", value: "+20 pts" },
                  ].map((item) => (
                    <div key={item.label} className="pb-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.04)" }}>
                      <div className="text-[11px] font-mono tracking-[0.04em] mb-1" style={{ color: "var(--ce-text-quaternary)" }}>{item.label}</div>
                      <div className="text-[16px] font-semibold tracking-[-0.01em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TENSION — One line, no labels */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[900px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[24px] sm:text-[32px] lg:text-[40px] font-light leading-[1.3] tracking-[-0.02em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Job boards give you listings.
              <br />
              Career coaches charge by the hour.
              <br />
              <span style={{ color: "var(--ce-text-quaternary)" }}>Neither gives you a plan.</span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* TOOLS — Precision grid with data */}
      <section className="py-24 lg:py-32" style={{ background: "var(--ce-surface-1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] mb-16" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Six surfaces. One system.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12">
            {[
              { title: "EdgePath", metric: "800+", unit: "careers mapped", sub: "Career roadmap built around your goals, constraints, and transition probability.", accent: "var(--ce-lime)" },
              { title: "ResumeEdge", metric: "+20", unit: "avg ATS lift", sub: "Three optimization engines: HumanTone, RecruiterBlueprint, ATS Precision.", accent: "#8B5CF6" },
              { title: "EdgeMatch", metric: "23", unit: "avg matches", sub: "Job matching by career fit. Not keywords — trajectory alignment.", accent: "#10B981" },
              { title: "EdgeProd", metric: "7", unit: "tools", sub: "Sprint, Focus, Streak, Goals, Matrix, Intent, Retro. Productivity as a system.", accent: "#F59E0B" },
              { title: "Global Mobility", metric: "190+", unit: "countries", sub: "Visa timelines, cost estimates, and pathways for international careers.", accent: "#3B82F6" },
              { title: "EdgeBuddy", metric: "QR", unit: "instant pair", sub: "Accountability partnerships. Someone who checks in, not checks up.", accent: "#EC4899" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <motion.div className="group cursor-default" whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
                  <div className="h-[1.5px] mb-6 transition-all duration-500 group-hover:h-[2px]" style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] mb-3" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{item.title}</h3>
                  <div className="mb-3">
                    <span className="text-[36px] lg:text-[44px] font-bold leading-none tracking-[-0.04em]" style={{ fontFamily: "'Urbanist', sans-serif", color: item.accent }}>{item.metric}</span>
                    <span className="text-[10px] font-mono tracking-[0.08em] ml-2 uppercase" style={{ color: "var(--ce-text-quaternary)" }}>{item.unit}</span>
                  </div>
                  <p className="text-[13px] leading-[1.6]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>{item.sub}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDANCE — Architectural */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(var(--ce-cyan-rgb), 0.025) 0%, transparent 50%)" }} />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <Reveal>
                <h2 className="text-[28px] sm:text-[36px] font-light leading-[1.15] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                  Career guidance
                  <br />
                  <span className="font-semibold" style={{ color: "var(--ce-cyan)" }}>that remembers you.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="space-y-4">
                  {[
                    { label: "Structured content types", value: "11" },
                    { label: "Suggestion modes", value: "3" },
                    { label: "Scenarios covered", value: "118" },
                    { label: "Surfaces connected", value: "All" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.04)" }}>
                      <span className="text-[12px] font-mono tracking-[0.04em]" style={{ color: "var(--ce-text-quaternary)" }}>{item.label}</span>
                      <span className="text-[13px] font-semibold" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-cyan)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: "rgba(var(--ce-glass-tint), 0.025)", borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.04)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--ce-cyan)" }} />
                  <span className="text-[11px] font-mono tracking-[0.04em]" style={{ color: "var(--ce-text-quaternary)" }}>guidance.panel</span>
                </div>
                <div className="p-5 space-y-4" style={{ background: "rgba(var(--ce-glass-tint), 0.01)" }}>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(var(--ce-cyan-rgb), 0.1)" }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--ce-cyan)" }} />
                    </div>
                    <div>
                      <p className="text-[13px] leading-[1.6] mb-3" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}>
                        Your profile has 87% alignment with Product Strategy Lead.
                        The gap: one certification you're 80% toward completing.
                      </p>
                      <div className="rounded-sm p-3 space-y-2" style={{ background: "rgba(var(--ce-glass-tint), 0.03)", border: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                        <div className="text-[10px] font-mono tracking-[0.08em] mb-2" style={{ color: "var(--ce-text-quaternary)" }}>FIT SCORECARD</div>
                        {[
                          { skill: "Strategic Thinking", pct: 95 },
                          { skill: "Product Sense", pct: 88 },
                          { skill: "Technical Fluency", pct: 72 },
                          { skill: "Stakeholder Mgmt", pct: 91 },
                        ].map((s) => (
                          <div key={s.skill} className="flex items-center gap-3">
                            <span className="text-[11px] w-[120px] flex-shrink-0" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>{s.skill}</span>
                            <div className="flex-1 h-1 rounded-sm overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint), 0.05)" }}>
                              <motion.div className="h-full rounded-sm" style={{ background: s.pct > 85 ? "var(--ce-lime)" : "var(--ce-cyan)", width: `${s.pct}%` }} initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
                            </div>
                            <span className="text-[11px] font-mono w-8 text-right" style={{ color: "var(--ce-text-tertiary)" }}>{s.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-20 lg:py-28" style={{ background: "var(--ce-surface-1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[24px] sm:text-[32px] font-light tracking-[-0.02em] mb-12" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Eight roles. One ecosystem.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { role: "Seekers", count: "12 surfaces" },
              { role: "Entrepreneurs", count: "4 surfaces" },
              { role: "Mentors", count: "6 surfaces" },
              { role: "Parents", count: "3 surfaces" },
              { role: "Employers", count: "5 surfaces" },
              { role: "Institutions", count: "7 surfaces" },
              { role: "NGOs", count: "5 surfaces" },
              { role: "Government", count: "4 surfaces" },
            ].map((item, i) => (
              <Reveal key={item.role} delay={i * 0.03}>
                <div className="pb-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                  <div className="text-[15px] font-semibold tracking-[-0.01em] mb-1" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{item.role}</div>
                  <div className="text-[11px] font-mono tracking-[0.04em]" style={{ color: "var(--ce-text-quaternary)" }}>{item.count}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] mb-2" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Transparent pricing.
            </h2>
            <p className="text-[13px] font-mono tracking-[0.02em] mb-16" style={{ color: "var(--ce-text-quaternary)" }}>No hidden fees. No credit card to start.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] rounded-sm overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint), 0.05)" }}>
            {[
              { name: "Free", price: "$0", period: "/forever", features: ["Career assessment", "Basic roadmap", "1 resume optimization", "Community access"], hl: false },
              { name: "Edge Plus", price: "$19", period: "/month", features: ["Advanced resume engines", "Priority guidance", "Enhanced analytics", "15 monthly credits"], hl: true },
              { name: "Edge Pro", price: "$39", period: "/month", features: ["Unlimited tools", "Premium templates", "Full platform access", "35 monthly credits"], hl: false },
            ].map((p) => (
              <Reveal key={p.name}>
                <div className="p-8 h-full flex flex-col" style={{ background: p.hl ? "rgba(var(--ce-lime-rgb), 0.02)" : "var(--ce-surface-bg)" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[12px] font-mono tracking-[0.04em]" style={{ color: "var(--ce-text-quaternary)" }}>{p.name}</span>
                    {p.hl && <span className="text-[9px] font-mono tracking-[0.08em] px-2 py-0.5 rounded-sm" style={{ background: "rgba(var(--ce-lime-rgb), 0.12)", color: "var(--ce-lime)" }}>POPULAR</span>}
                  </div>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-[44px] font-bold tracking-[-0.03em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{p.price}</span>
                    <span className="text-[12px] font-mono" style={{ color: "var(--ce-text-quaternary)" }}>{p.period}</span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 mb-8">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full" style={{ background: p.hl ? "var(--ce-lime)" : "var(--ce-text-quaternary)" }} />
                        <span className="text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onNavigate("signup")} className="w-full py-3 rounded-sm text-[12px] font-mono tracking-[0.04em] cursor-pointer transition-all duration-200" style={{ background: p.hl ? "var(--ce-lime)" : "transparent", color: p.hl ? "#08090C" : "var(--ce-text-secondary)", border: p.hl ? "none" : "1px solid rgba(var(--ce-glass-tint), 0.08)" }}>
                    {p.price === "$0" ? "START FREE" : "GET STARTED"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-12" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint), 0.03)", borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.03)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-center gap-12 lg:gap-20 opacity-20 flex-wrap">
            {["Stanford", "MIT", "Google", "Deloitte", "NYU", "McKinsey"].map((n) => (
              <span key={n} className="text-[12px] font-mono tracking-[0.06em]" style={{ color: "var(--ce-text-primary)" }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <Reveal>
                <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-bold leading-[0.95] tracking-[-0.04em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                  See the path.
                  <br />
                  <span style={{ color: "var(--ce-lime)" }}>Walk the path.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <Reveal delay={0.08}>
                <button onClick={() => onNavigate("signup")} className="px-8 py-4 rounded-sm text-[13px] font-semibold flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5" style={{ fontFamily: "'Satoshi', sans-serif", background: "var(--ce-lime)", color: "#08090C" }}>
                  Start Free <ArrowUpRight size={15} />
                </button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
