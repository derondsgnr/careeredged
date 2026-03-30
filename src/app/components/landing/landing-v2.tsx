import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Route, FileCheck, MessageCircle, Target, Users, Sparkles, BarChart3, GraduationCap, Building2, Shield } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V2: "The Proof"
 * Product-as-hero. Dashboard screenshot with green glow.
 * Numbers. Feature bento grid. Pricing preview. Social proof-led.
 * More conventional SaaS but executed at exceptional quality.
 * Dark/light section rhythm.
 */

interface LandingV2Props {
  onNavigate: (page: string) => void;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
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

export function LandingV2({ onNavigate }: LandingV2Props) {
  const s1 = useCountUp(10247);
  const s2 = useCountUp(87);
  const s3 = useCountUp(4);

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-[140px] pb-20 lg:pb-28 px-6 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--ce-cyan-rgb),0.05) 0%, rgba(4,44,1,0.02) 45%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(var(--ce-cyan-rgb),0.06)", border: "1px solid rgba(var(--ce-cyan-rgb),0.1)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-cyan)] animate-pulse" />
              <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-cyan)" }}>
                Free for career seekers
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-5"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 6vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ce-text-primary)",
            }}
          >
            Career clarity in
            <br />
            <span style={{ color: "var(--ce-cyan)" }}>minutes, not months</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center max-w-[520px] mx-auto mb-10"
            style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "17px", lineHeight: 1.65, color: "var(--ce-text-tertiary)" }}
          >
            Personalized roadmaps. Optimized resumes. Matched opportunities. 
            One platform that understands your entire career journey.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex justify-center items-center gap-4 mb-16"
          >
            <button
              onClick={() => onNavigate("signup")}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-lg text-[14px] cursor-pointer transition-all duration-200"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, background: "var(--ce-cyan)", color: "var(--ce-surface-0)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(var(--ce-cyan-rgb),0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Start free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="px-7 py-3.5 rounded-lg text-[14px] cursor-pointer transition-all duration-200"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-tertiary)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ce-text-primary)"; e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-text-tertiary)"; e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.08)"; }}
            >
              Watch demo
            </button>
          </motion.div>

          {/* Product screenshot — Dashboard composite */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] h-[250px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(var(--ce-cyan-rgb),0.07) 0%, transparent 65%)",
                filter: "blur(70px)",
              }}
            />
            <div
              className="relative rounded-xl overflow-hidden mx-auto max-w-[1100px]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.9)",
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                boxShadow: "0 50px 100px rgba(var(--ce-shadow-tint),0.5), 0 0 0 1px rgba(var(--ce-glass-tint),0.02)",
              }}
            >
              {/* Chrome */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-12 gap-4">
                  {/* Left sidebar hint */}
                  <div className="hidden lg:flex col-span-2 flex-col gap-3">
                    {["Dashboard", "EdgePath", "ResumeEdge", "EdgeMatch", "Sophia"].map((item, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-lg text-[11px]"
                        style={{
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 500,
                          color: i === 0 ? "var(--ce-text-primary)" : "var(--ce-text-quaternary)",
                          background: i === 0 ? "rgba(var(--ce-glass-tint),0.04)" : "transparent",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main content area */}
                  <div className="col-span-12 lg:col-span-10">
                    {/* Sophia bar */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5"
                      style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}
                    >
                      <Sparkles size={13} style={{ color: "var(--ce-role-edgestar)" }} />
                      <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-role-edgestar)" }}>
                        3 new jobs match your Phase 2 skills. 2 applications need follow-up.
                      </span>
                    </div>

                    {/* KPI row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                      {[
                        { label: "Roadmap Progress", value: "42%", trend: "+8% this week" },
                        { label: "ATS Score", value: "87", trend: "+15 from baseline" },
                        { label: "Applications", value: "12", trend: "3 interviews" },
                        { label: "EdgeGas", value: "850", trend: "+50 today" },
                      ].map((kpi, i) => (
                        <div
                          key={i}
                          className="rounded-lg p-3"
                          style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
                        >
                          <span className="text-[10px] block" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
                            {kpi.label}
                          </span>
                          <span
                            className="text-[22px] block mt-1"
                            style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, color: "var(--ce-text-primary)", letterSpacing: "-0.02em" }}
                          >
                            {kpi.value}
                          </span>
                          <span className="text-[10px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-lime)" }}>
                            {kpi.trend}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Roadmap mini */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Foundation", pct: 100 },
                        { label: "Skills Gap", pct: 65 },
                        { label: "Network", pct: 0 },
                        { label: "Launch", pct: 0 },
                      ].map((p, i) => (
                        <div key={i} className="rounded-lg p-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
                          <span className="text-[10px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>{p.label}</span>
                          <div className="mt-2 h-1 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.pct === 100 ? "var(--ce-lime)" : "rgba(var(--ce-lime-rgb),0.6)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ LOGO BAR ═══ */}
      <section className="py-12 px-6" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.03)", borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-center text-[11px] mb-6" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-quaternary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Built for universities, employers, and career services
          </p>
          <div className="flex items-center justify-center gap-10 lg:gap-16 flex-wrap">
            {["Stanford", "MIT", "Google", "Deloitte", "NYU"].map((name) => (
              <span
                key={name}
                className="text-[14px]"
                style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, color: "var(--ce-text-ghost)", letterSpacing: "-0.01em" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            { ref: s1.ref, val: s1.count.toLocaleString() + "+", label: "Roadmaps generated" },
            { ref: s2.ref, val: s2.count + "%", label: "Avg ATS improvement" },
            { ref: s3.ref, val: s3.count + " min", label: "To first roadmap" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div ref={s.ref} className="text-center">
                <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "44px", letterSpacing: "-0.03em", color: "var(--ce-cyan)", lineHeight: 1 }}>
                  {s.val}
                </span>
                <p className="mt-2 text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-secondary)" }}>
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES BENTO — LIGHT SECTION ═══ */}
      <section className="py-20 lg:py-28 px-6" style={{ background: "var(--ce-surface-0)" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ce-surface-0)" }}>
                Everything connects
              </h2>
              <p className="mt-4 text-[15px] max-w-[480px] mx-auto" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)", lineHeight: 1.65 }}>
                Six integrated tools that share context, so your progress in one flows into all the others.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Route, title: "EdgePath", desc: "Personalized career roadmaps with phases, milestones, and timelines tailored to your specific transition.", accent: true },
              { icon: FileCheck, title: "ResumeEdge", desc: "Three optimization engines. Real ATS scoring. Cover letters matched to specific job descriptions." },
              { icon: Target, title: "EdgeMatch", desc: "Jobs matched to your trajectory, not just keywords. Applied with the context of your entire career plan." },
              { icon: MessageCircle, title: "Sophia", desc: "A career guide that remembers your journey. Context-aware across every surface. Never starts from scratch." },
              { icon: Users, title: "EdgeBuddy", desc: "Accountability partners on parallel journeys. Shared goals, regular check-ins, mutual progress." },
              { icon: BarChart3, title: "EdgeBoard", desc: "Visual analytics on your career progress. Shareable with institutions, mentors, or anyone you choose." },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className="rounded-xl p-6 h-full transition-all duration-200"
                  style={{
                    background: f.accent ? "var(--ce-surface-0)" : "white",
                    border: f.accent ? "none" : "1px solid var(--ce-text-ghost)",
                  }}
                  onMouseEnter={(e) => { if (!f.accent) e.currentTarget.style.borderColor = "var(--ce-text-ghost)"; }}
                  onMouseLeave={(e) => { if (!f.accent) e.currentTarget.style.borderColor = "var(--ce-text-ghost)"; }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      background: f.accent ? "rgba(var(--ce-lime-rgb),0.1)" : "#F3F4F6",
                    }}
                  >
                    <f.icon size={17} style={{ color: f.accent ? "var(--ce-lime)" : "var(--ce-text-tertiary)" }} />
                  </div>
                  <h3 className="mb-2" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "16px", color: f.accent ? "var(--ce-text-primary)" : "var(--ce-surface-0)" }}>
                    {f.title}
                  </h3>
                  <p className="text-[13px] leading-[1.65]" style={{ fontFamily: "'Satoshi', sans-serif", color: f.accent ? "var(--ce-text-secondary)" : "var(--ce-text-tertiary)" }}>
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR — DARK ═══ */}
      <section className="py-20 lg:py-28 px-6" style={{ background: "var(--ce-void)" }}>
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <h2 className="text-center mb-16" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ce-text-primary)" }}>
              Built for every side of the career ecosystem
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Users, title: "Career Seekers", items: ["Personalized roadmaps", "Resume optimization", "Job matching", "Career discovery"] },
              { icon: Building2, title: "Employers", items: ["Bulk job posting", "Pipeline tracking", "Hiring analytics", "Career fair participation"] },
              { icon: GraduationCap, title: "Institutions", items: ["Student outcomes tracking", "NACE/CSEA compliance", "Virtual career fairs", "Employer partnerships"] },
              { icon: Sparkles, title: "Coaches & Mentors", items: ["Session management", "Course creation", "Public booking pages", "Earnings dashboard"] },
              { icon: Shield, title: "NGOs & Government", items: ["Resource management", "Grant distribution", "Workforce programs", "Impact analytics"] },
              { icon: Target, title: "International Professionals", items: ["Cross-border career planning", "Credential evaluation", "Skills gap analysis", "Country comparison"] },
            ].map((role, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className="rounded-xl p-6 h-full"
                  style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
                >
                  <role.icon size={20} style={{ color: "var(--ce-text-secondary)" }} className="mb-4" />
                  <h3 className="mb-3" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "16px", color: "var(--ce-text-primary)" }}>
                    {role.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {role.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Check size={12} style={{ color: "var(--ce-cyan)" }} />
                        <span className="text-[12px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW — LIGHT ═══ */}
      <section className="py-20 lg:py-28 px-6" style={{ background: "var(--ce-surface-0)" }}>
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <h2 className="text-center mb-4" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ce-surface-0)" }}>
              Simple, transparent pricing
            </h2>
            <p className="text-center mb-12 text-[15px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
              Start free. Upgrade when you're ready.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Free", price: "$0", period: "forever",
                features: ["Career roadmap", "Basic resume tools", "Job matching", "Sophia guidance", "Career discovery"],
                cta: "Get started", recommended: false,
              },
              {
                name: "Edge Plus", price: "$19", period: "/month",
                features: ["Everything in Free", "15 EdgeGas credits/mo", "Advanced resume engines", "Priority support", "Enhanced analytics"],
                cta: "Start free trial", recommended: true,
              },
              {
                name: "Edge Pro", price: "$39", period: "/month",
                features: ["Everything in Plus", "35 EdgeGas credits/mo", "Unlimited coaching tools", "Premium templates", "Full platform access"],
                cta: "Start free trial", recommended: false,
              },
            ].map((tier, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className="rounded-xl p-6 h-full flex flex-col relative"
                  style={{
                    background: tier.recommended ? "var(--ce-surface-0)" : "white",
                    border: tier.recommended ? "1px solid rgba(var(--ce-cyan-rgb),0.2)" : "1px solid var(--ce-text-ghost)",
                  }}
                >
                  {tier.recommended && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px]"
                      style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, background: "var(--ce-cyan)", color: "var(--ce-surface-0)" }}
                    >
                      Recommended
                    </div>
                  )}
                  <h3 className="mb-1" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "18px", color: tier.recommended ? "var(--ce-text-primary)" : "var(--ce-surface-0)" }}>
                    {tier.name}
                  </h3>
                  <div className="mb-5">
                    <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "36px", color: tier.recommended ? "var(--ce-text-primary)" : "var(--ce-surface-0)", letterSpacing: "-0.02em" }}>
                      {tier.price}
                    </span>
                    <span className="text-[13px] ml-1" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
                      {tier.period}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5 mb-6 flex-1">
                    {tier.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Check size={13} style={{ color: tier.recommended ? "var(--ce-cyan)" : "var(--ce-text-secondary)" }} />
                        <span className="text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", color: tier.recommended ? "var(--ce-text-secondary)" : "var(--ce-text-tertiary)" }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate("signup")}
                    className="w-full py-3 rounded-lg text-[13px] cursor-pointer transition-all duration-200"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 600,
                      background: tier.recommended ? "var(--ce-cyan)" : "transparent",
                      color: tier.recommended ? "var(--ce-surface-0)" : "var(--ce-surface-0)",
                      border: tier.recommended ? "none" : "1px solid var(--ce-text-ghost)",
                    }}
                    onMouseEnter={(e) => { if (tier.recommended) { e.currentTarget.style.transform = "translateY(-1px)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {tier.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA — DARK ═══ */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden" style={{ background: "var(--ce-void)" }}>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(var(--ce-cyan-rgb),0.05) 0%, transparent 60%)", filter: "blur(80px)" }}
        />
        <div className="max-w-[600px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="mb-5" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ce-text-primary)" }}>
              Ready to find your edge?
            </h2>
            <p className="text-[15px] leading-[1.7] mb-8" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
              Join thousands of career seekers who mapped their next move. Free, no credit card.
            </p>
            <button
              onClick={() => onNavigate("signup")}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg text-[15px] cursor-pointer transition-all duration-200"
              style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, background: "var(--ce-cyan)", color: "var(--ce-surface-0)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(var(--ce-cyan-rgb),0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Get Your Edge
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
