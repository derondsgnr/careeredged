/**
 * Brand Patterns Demo — Showcases patterns applied to real UI surfaces.
 */

import {
  PatternOverlay,
  BrandPatternCard,
} from "./brand-patterns";

export function BrandPatternsDemo() {
  return (
    <div className="min-h-screen p-8 space-y-12 max-w-6xl mx-auto" style={{ background: "var(--ce-surface-0)", color: "var(--ce-text-primary)" }}>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Brand Pattern System
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--ce-text-secondary)" }}>
          Three patterns from the Figma brand file, applied to surfaces with configurable color and opacity.
        </p>
      </div>

      {/* ─── 1. Full-color Pattern Swatches ──────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Raw Patterns (100%)
        </h2>
        <div className="grid grid-cols-3 gap-5">
          <BrandPatternCard
            pattern="tiles"
            containerClassName="h-52 rounded-2xl"
            contentClassName="flex flex-col items-center justify-center h-full gap-2"
          >
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
              Pattern 01
            </span>
            <span className="text-xs text-black/60 font-medium">Octagonal Tiles</span>
          </BrandPatternCard>

          <BrandPatternCard
            pattern="arrows"
            containerClassName="h-52 rounded-2xl"
            contentClassName="flex flex-col items-center justify-center h-full gap-2"
          >
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
              Pattern 02
            </span>
            <span className="text-xs text-white/60 font-medium">Tessellated Arrows</span>
          </BrandPatternCard>

          <BrandPatternCard
            pattern="chevrons"
            containerClassName="h-52 rounded-2xl"
            contentClassName="flex flex-col items-center justify-center h-full gap-2"
          >
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
              Pattern 03
            </span>
            <span className="text-xs text-white/60 font-medium">Chevron Stripes</span>
          </BrandPatternCard>
        </div>
      </section>

      {/* ─── 2. Hero / CTA Banner ────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Hero / CTA Banner
        </h2>
        <BrandPatternCard
          pattern="chevrons"
          bgColor="#00253A"
          color="#B3FF3B"
          opacity={0.25}
          scale={0.8}
          containerClassName="rounded-2xl"
          contentClassName="flex flex-col items-start justify-center p-10 min-h-[200px]"
        >
          <span className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#B3FF3B" }}>
            New Feature
          </span>
          <h3 className="text-3xl font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            AI-Powered Career Roadmaps
          </h3>
          <p className="mt-2 text-sm text-white/60 max-w-lg">
            Let Sophia analyze your skills and map the fastest path to your dream role. Personalized, actionable, and adaptive.
          </p>
          <button className="mt-6 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors" style={{ background: "#B3FF3B", color: "#00253A" }}>
            Get Started
          </button>
        </BrandPatternCard>
      </section>

      {/* ─── 3. KPI Stat Cards ───────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          KPI Cards (Subtle Overlay — 4-8%)
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Career Score", value: "72", change: "+4", pattern: "tiles" as const, color: "var(--ce-lime)" },
            { label: "Applications", value: "12", change: "+3 this week", pattern: "arrows" as const, color: "var(--ce-cyan)" },
            { label: "ATS Score", value: "87", change: "Resume v3", pattern: "chevrons" as const, color: "var(--ce-cyan)" },
            { label: "EdgeGas", value: "45", change: "Refills Wed", pattern: "tiles" as const, color: "var(--ce-lime)" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="relative overflow-hidden rounded-xl border"
              style={{
                background: "var(--ce-surface-card)",
                borderColor: "var(--ce-surface-card-border)",
              }}
            >
              <PatternOverlay
                pattern={kpi.pattern}
                opacity={0.05}
                bgColor="transparent"
                color={kpi.color}
              />
              <div className="relative z-10 p-5">
                <p className="text-xs font-medium mb-3" style={{ color: "var(--ce-text-tertiary)" }}>{kpi.label}</p>
                <p className="text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{kpi.value}</p>
                <p className="text-xs mt-1" style={{ color: "var(--ce-lime)" }}>{kpi.change}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. Feature Cards ────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Feature Cards (Medium Intensity — 8-12%)
        </h2>
        <div className="grid grid-cols-2 gap-5">
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{ background: "var(--ce-surface-1)", borderColor: "var(--ce-border-subtle)" }}
          >
            <PatternOverlay pattern="tiles" opacity={0.08} bgColor="transparent" color="var(--ce-lime)" scale={0.7} />
            <div className="relative z-10 p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--ce-lime-muted)" }}>
                  <span className="text-lg">&#x1F3AF;</span>
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>EdgePath</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ce-text-secondary)" }}>
                Your personalized career roadmap. Track milestones, build skills, and navigate to your next role with AI-powered guidance.
              </p>
              <div className="mt-5 flex gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--ce-lime-muted)", color: "var(--ce-lime)" }}>Phase 1</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--ce-glass-high)", color: "var(--ce-text-tertiary)" }}>60% Complete</span>
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{ background: "var(--ce-surface-1)", borderColor: "var(--ce-border-subtle)" }}
          >
            <PatternOverlay pattern="arrows" opacity={0.06} bgColor="transparent" color="var(--ce-cyan)" scale={0.8} />
            <div className="relative z-10 p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--ce-cyan-muted)" }}>
                  <span className="text-lg">&#x1F4BC;</span>
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>EdgeMatch</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ce-text-secondary)" }}>
                Smart job matching powered by your career profile. We surface roles aligned with your trajectory, not just keywords.
              </p>
              <div className="mt-5 flex gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--ce-cyan-muted)", color: "var(--ce-cyan)" }}>23 Matches</span>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--ce-glass-high)", color: "var(--ce-text-tertiary)" }}>3 New</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Sophia AI Card ───────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Sophia AI Surface
        </h2>
        <div
          className="relative overflow-hidden rounded-2xl border"
          style={{ background: "#042C01", borderColor: "rgba(179, 255, 59, 0.1)" }}
        >
          <PatternOverlay pattern="chevrons" opacity={0.12} bgColor="transparent" color="#B3FF3B" scale={0.6} />
          <div className="relative z-10 p-8 flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(179, 255, 59, 0.15)" }}>
              <span className="text-xl">&#x2726;</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                Sophia says
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Your resume scored 87/100 on ATS compatibility. I noticed your portfolio review is next. Want me to prepare tailored talking points for your target companies?
              </p>
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: "#B3FF3B", color: "#042C01" }}>
                  Yes, prepare them
                </button>
                <button className="px-4 py-2 rounded-full text-xs font-medium border" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Color + Pattern Combos ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Color Variations
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <BrandPatternCard pattern="tiles" bgColor="#70B600" color="#B3FF3B" opacity={0.8} containerClassName="h-32 rounded-xl" contentClassName="flex items-end p-4 h-full">
            <div><p className="text-xs font-semibold text-black/70">Olive + Lime</p><p className="text-[10px] text-black/40 mt-0.5">Brand primary</p></div>
          </BrandPatternCard>
          <BrandPatternCard pattern="arrows" bgColor="#22D3EE" color="rgba(255,255,255,0.2)" containerClassName="h-32 rounded-xl" contentClassName="flex items-end p-4 h-full">
            <div><p className="text-xs font-semibold text-white/90">Cyan + White</p><p className="text-[10px] text-white/50 mt-0.5">Sophia / AI accent</p></div>
          </BrandPatternCard>
          <BrandPatternCard pattern="chevrons" bgColor="#00253A" color="#B3FF3B" opacity={0.35} containerClassName="h-32 rounded-xl" contentClassName="flex items-end p-4 h-full">
            <div><p className="text-xs font-semibold text-white/90">Navy + Lime</p><p className="text-[10px] text-white/50 mt-0.5">Hero / premium</p></div>
          </BrandPatternCard>
          <BrandPatternCard pattern="chevrons" bgColor="#042C01" color="#B3FF3B" opacity={0.15} containerClassName="h-32 rounded-xl" contentClassName="flex items-end p-4 h-full">
            <div><p className="text-xs font-semibold text-white/80">Forest + Lime</p><p className="text-[10px] text-white/40 mt-0.5">Dark surfaces</p></div>
          </BrandPatternCard>
          <BrandPatternCard pattern="tiles" bgColor="#1A1A1B" color="rgba(34, 211, 238, 0.08)" containerClassName="h-32 rounded-xl" contentClassName="flex items-end p-4 h-full">
            <div><p className="text-xs font-semibold text-white/80">Near Black + Cyan</p><p className="text-[10px] text-white/40 mt-0.5">Subtle texture</p></div>
          </BrandPatternCard>
          <BrandPatternCard pattern="arrows" bgColor="#042C01" color="rgba(34, 211, 238, 0.15)" containerClassName="h-32 rounded-xl" contentClassName="flex items-end p-4 h-full">
            <div><p className="text-xs font-semibold text-white/80">Forest + Cyan</p><p className="text-[10px] text-white/40 mt-0.5">Accent crossover</p></div>
          </BrandPatternCard>
        </div>
      </section>

      {/* ─── 7. Scale Comparison ─────────────────────────────────── */}
      <section className="space-y-4 pb-12">
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Scale Variations
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[0.5, 0.8, 1.0, 1.5].map((s) => (
            <BrandPatternCard key={s} pattern="tiles" bgColor="#70B600" color="#B3FF3B" scale={s} containerClassName="h-28 rounded-xl" contentClassName="flex items-end p-3 h-full">
              <span className="text-[10px] font-semibold text-black/60">Scale {s}x</span>
            </BrandPatternCard>
          ))}
        </div>
      </section>
    </div>
  );
}
