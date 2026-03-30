import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V6-B: "Intimacy"
 *
 * VOICE: Apple's emotional register meets Airbnb's warmth.
 * Second person. Present tense. You're in the story.
 *
 * Apple: customer-context framing, curiosity gaps, radical brevity
 * Airbnb: "Belong anywhere" — aspiration, not mechanics
 * Scalient: generous whitespace = premium, testimonials with context
 * NO section labels. NO "Meet Sophia." Sharp corners.
 * Emotional job first: "Feel like someone smart is guiding me."
 * Photography: B&W with intentional color pops, people at crossroads.
 */

interface LandingV6BProps {
  onNavigate: (page: string) => void;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  );
}

function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} className="w-full h-full object-cover" style={{ y, scale: 1.1 }} loading="lazy" />
    </div>
  );
}

export function LandingV6B({ onNavigate }: LandingV6BProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* HERO — Emotional, no mechanics */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(var(--ce-cyan-rgb), 0.03) 0%, transparent 70%)" }} />

        <motion.div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full" style={{ opacity: heroOpacity }}>
          <div className="max-w-[680px]">
            <Reveal>
              <h1 className="text-[36px] sm:text-[48px] lg:text-[60px] xl:text-[68px] font-light leading-[1.08] tracking-[-0.03em] mb-8" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                Every career has
                <br />
                an inflection point.
                <br />
                <span className="font-semibold" style={{ color: "var(--ce-cyan)" }}>This is yours.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-[16px] leading-[1.8] max-w-[480px] mb-10" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                You don't need another job board. You need something that understands
                where you are, maps where you belong, and walks you there.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <button onClick={() => onNavigate("signup")} className="px-7 py-4 rounded-sm text-[14px] font-semibold flex items-center gap-2.5 cursor-pointer transition-all duration-300 hover:gap-4" style={{ fontFamily: "'Satoshi', sans-serif", background: "var(--ce-cyan)", color: "#08090C" }}>
                Get Your Edge <ArrowRight size={15} />
              </button>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* NARRATIVE — Show, don't label */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[900px] mx-auto px-6 lg:px-16">
          <Reveal>
            <p className="text-[20px] sm:text-[24px] lg:text-[28px] font-light leading-[1.5] tracking-[-0.01em]" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-secondary)" }}>
              <span style={{ color: "var(--ce-text-primary)" }}>You open your laptop.</span> Another rejection.
              You wonder if anyone actually reads these applications.
              You've rewritten your resume four times.
              <br /><br />
              <span style={{ color: "var(--ce-text-primary)" }}>Then you realize the problem isn't effort.</span>{" "}
              <span style={{ color: "var(--ce-cyan)" }}>It's direction.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* PHOTOGRAPHY — Intentional, asymmetric */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5">
              <Reveal>
                <ParallaxImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" alt="Person contemplating their next move" className="aspect-[3/4] rounded-sm grayscale hover:grayscale-0 transition-all duration-700" />
              </Reveal>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-4">
              <Reveal delay={0.08}>
                <ParallaxImage src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" alt="Career planning session" className="aspect-[16/9] rounded-sm" />
              </Reveal>
              <div className="grid grid-cols-2 gap-4">
                <Reveal delay={0.12}>
                  <ParallaxImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80" alt="Professional achieving a milestone" className="aspect-square rounded-sm" />
                </Reveal>
                <Reveal delay={0.16}>
                  <div className="aspect-square rounded-sm flex items-center justify-center p-6" style={{ background: "rgba(var(--ce-cyan-rgb), 0.04)", border: "1px solid rgba(var(--ce-cyan-rgb), 0.08)" }}>
                    <p className="text-[18px] lg:text-[22px] font-light leading-[1.3] text-center" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                      "Feel like someone
                      <br />
                      <span className="font-semibold italic" style={{ color: "var(--ce-cyan)" }}>smart</span> is
                      <br />
                      guiding me."
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES — Conversation, not feature list */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(var(--ce-cyan-rgb), 0.04) 0%, transparent 60%)" }} />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="lg:sticky lg:top-32">
                  <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-light leading-[1.15] tracking-[-0.02em] mb-4" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                    Guidance that
                    <br />
                    <span className="font-semibold italic" style={{ color: "var(--ce-cyan)" }}>remembers
                    <br />your story.</span>
                  </h2>
                  <p className="text-[14px] leading-[1.7]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
                    Every recommendation is grounded in your goals,
                    your constraints, and where you've already been.
                    It connects every tool to your roadmap and speaks
                    first so you don't have to figure out what to ask.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6 space-y-5">
              <motion.div className="flex gap-3" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(var(--ce-cyan-rgb), 0.1)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--ce-cyan)" }} />
                </div>
                <div className="rounded-sm px-4 py-3 max-w-[480px]" style={{ background: "rgba(var(--ce-glass-tint), 0.03)", border: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                  <p className="text-[13px] leading-[1.65]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}>
                    Based on your profile and transition goals, I found 3 roles
                    with strong career fit. One needs a skill you're 80% toward.
                    I've already drafted a resume angle — want to see it?
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex justify-end" initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}>
                <div className="rounded-sm px-4 py-3 max-w-[340px]" style={{ background: "rgba(var(--ce-lime-rgb), 0.04)", border: "1px solid rgba(var(--ce-lime-rgb), 0.1)" }}>
                  <p className="text-[13px] leading-[1.65]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}>
                    Yes — and factor in my H-1B timeline.
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex gap-3" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}>
                <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 mt-1" style={{ background: "rgba(var(--ce-cyan-rgb), 0.1)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--ce-cyan)" }} />
                </div>
                <div className="rounded-sm px-4 py-3 max-w-[480px]" style={{ background: "rgba(var(--ce-glass-tint), 0.03)", border: "1px solid rgba(var(--ce-glass-tint), 0.05)" }}>
                  <p className="text-[13px] leading-[1.65]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}>
                    Done. Filtered for sponsorship history. Your top match is
                    Product Strategy Lead — 87% career fit, 12 companies sponsored
                    for this role last year. Resume angle is ready.
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex flex-wrap gap-2 ml-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.65 }}>
                {["Show the resume angle", "Compare all three paths", "Show visa timeline"].map((chip, i) => (
                  <span key={chip} className="px-3 py-1.5 rounded-sm text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-80" style={{ background: i === 0 ? "rgba(var(--ce-cyan-rgb), 0.08)" : i === 1 ? "rgba(var(--ce-lime-rgb), 0.08)" : "rgba(var(--ce-glass-tint), 0.05)", color: i === 0 ? "var(--ce-cyan)" : i === 1 ? "var(--ce-lime)" : "var(--ce-text-tertiary)", border: `1px solid ${i === 0 ? "rgba(var(--ce-cyan-rgb), 0.15)" : i === 1 ? "rgba(var(--ce-lime-rgb), 0.15)" : "rgba(var(--ce-glass-tint), 0.08)"}` }}>
                    {chip}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLKIT — Grid, not cards with icons */}
      <section className="py-24 lg:py-32" style={{ background: "var(--ce-surface-1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <Reveal>
            <h2 className="text-[28px] sm:text-[36px] font-light leading-[1.2] tracking-[-0.02em] mb-4" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Everything connects. <span style={{ color: "var(--ce-text-tertiary)" }}>Nothing exists in isolation.</span>
            </h2>
            <p className="text-[14px] leading-[1.7] max-w-[440px] mb-16" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
              Your roadmap informs your resume. Your resume targets your matches.
              Your matches feed back to your roadmap. One system, six surfaces.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "EdgePath", sub: "Career roadmap built around who you are.", accent: "var(--ce-lime)" },
              { title: "ResumeEdge", sub: "Three engines. Average 20-point ATS lift.", accent: "#8B5CF6" },
              { title: "EdgeMatch", sub: "Jobs matched by career fit, not keywords.", accent: "#10B981" },
              { title: "EdgeProd", sub: "Sprint timers, goals, and accountability.", accent: "#F59E0B" },
              { title: "Global Mobility", sub: "Visa pathways and relocation intelligence.", accent: "#3B82F6" },
              { title: "EdgeBuddy", sub: "Paired accountability partners.", accent: "#EC4899" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <motion.div className="rounded-sm p-6 h-full group cursor-default" style={{ background: "rgba(var(--ce-glass-tint), 0.02)", border: "1px solid rgba(var(--ce-glass-tint), 0.04)" }} whileHover={{ y: -3, transition: { duration: 0.3 } }}>
                  <div className="w-8 h-[2px] mb-5 transition-all duration-400 group-hover:w-12" style={{ background: item.accent }} />
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] mb-1.5" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{item.title}</h3>
                  <p className="text-[13px] leading-[1.6]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>{item.sub}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="py-28 lg:py-36">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              { quote: "I was stuck between consulting and product for two years. The assessment gave me more clarity in fifteen minutes than six months of coaching.", name: "Amara O.", role: "Now Product Lead at Stripe", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80" },
              { quote: "It remembered I mentioned my daughter. When it recommended roles, it factored in remote work. No career tool has ever done that.", name: "David K.", role: "Engineering Manager, ex-Google", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="rounded-sm p-8 h-full flex flex-col" style={{ background: "rgba(var(--ce-glass-tint), 0.02)", border: "1px solid rgba(var(--ce-glass-tint), 0.04)" }}>
                  <p className="text-[16px] leading-[1.75] flex-1 mb-8 italic font-light" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-9 h-9 rounded-sm object-cover grayscale" />
                    <div>
                      <div className="text-[13px] font-semibold" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>{t.name}</div>
                      <div className="text-[11px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}>{t.role}</div>
                    </div>
                  </div>
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
            <h2 className="text-[32px] sm:text-[44px] lg:text-[56px] font-light leading-[1.1] tracking-[-0.03em] max-w-[600px] mx-auto mb-4" style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}>
              Your next chapter
              <br />
              <span className="font-semibold italic" style={{ color: "var(--ce-cyan)" }}>starts with clarity.</span>
            </h2>
            <p className="text-[15px] max-w-[340px] mx-auto mb-10" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}>
              Five minutes. A roadmap built for you.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <button onClick={() => onNavigate("signup")} className="px-8 py-4 rounded-sm text-[14px] font-semibold flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5 mx-auto" style={{ fontFamily: "'Satoshi', sans-serif", background: "var(--ce-cyan)", color: "#08090C" }}>
              Get Your Edge <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
