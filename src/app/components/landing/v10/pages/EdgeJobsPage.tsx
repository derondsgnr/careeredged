import { Link } from "react-router";
import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

const oldWay = [
  { icon: "🔍", text: "Keyword matching that misses context" },
  { icon: "📄", text: "Resumes disappearing into ATS black holes" },
  { icon: "📋", text: "Generic listings with no fit signal" },
  { icon: "😩", text: "Applying to 80 jobs, hearing back from 2" },
];

const newWay = [
  { text: "Matched by compatibility, not keywords", detail: "Your archetype, strengths, and career goals shape every recommendation." },
  { text: "Match percentage on every listing", detail: "See exactly how well a role fits you — and why — before you apply." },
  { text: "Skills gap analysis per role", detail: "Know what you already have and what to build. No guessing." },
  { text: "Immigration-aware filtering", detail: "Visa sponsorship, country requirements, and pathway compatibility built in." },
];

const steps = [
  { num: "01", headline: "Complete your profile", body: "Answer a 15-question archetype assessment. CareerEdge maps your strengths, goals, and constraints in about 4 minutes." },
  { num: "02", headline: "Get matched by compatibility", body: "EdgeMatch scores every role against your profile — not just your resume keywords, but who you actually are." },
  { num: "03", headline: "Apply with confidence", body: "See your match %, the skills gap, and what to highlight. Your resume and cover letter adapt to each role." },
];

export function EdgeJobsPage() {
  return (
    <LandingWrapper>
      <Navbar />
      <main>
        {/* ═══ HERO ═══ */}
        <section className="section-hero section-dark">
          <div className="container-main max-w-[960px] mx-auto text-center">
            <ScrollReveal variant="sm">
              <p className="text-eyebrow text-accent mb-8">EdgeJobs</p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="h2 text-text-on-dark mb-8">
                You're not unqualified.<br />
                <span className="text-accent">You're just mismatched.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-large opacity-70 mb-10 max-w-[560px] mx-auto">
                Job boards match keywords. EdgeMatch matches people. See which roles actually fit your strengths, your goals, and your life — not just your last job title.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/signup" className="btn btn-primary">
                  <BtnText>See Your Matches</BtnText>
                </Link>
                <a href="#how-it-works" className="btn btn-secondary">
                  <BtnText>How it works</BtnText>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ THE PROBLEM / THE SHIFT ═══ */}
        <section className="section bg-bg-primary">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Old way */}
              <div>
                <ScrollReveal variant="sm">
                  <p className="text-eyebrow text-text-secondary mb-6">The old way</p>
                </ScrollReveal>
                <ScrollReveal delay={1}>
                  <h2 className="h3 text-text-primary mb-10">
                    Job boards weren't built for you.
                  </h2>
                </ScrollReveal>
                <div className="flex flex-col gap-5">
                  {oldWay.map((item, i) => (
                    <ScrollReveal key={item.text} variant="sm" delay={i + 1}>
                      <div className="flex items-start gap-4 p-5 rounded-[var(--radius-lg)] surface-glass">
                        <span className="text-[20px] shrink-0">{item.icon}</span>
                        <p className="text-body text-text-secondary">{item.text}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* New way */}
              <div>
                <ScrollReveal variant="sm">
                  <p className="text-eyebrow text-accent mb-6">The EdgeMatch way</p>
                </ScrollReveal>
                <ScrollReveal delay={1}>
                  <h2 className="h3 text-text-primary mb-10">
                    Compatibility over keywords.
                  </h2>
                </ScrollReveal>
                <div className="flex flex-col gap-5">
                  {newWay.map((item, i) => (
                    <ScrollReveal key={item.text} variant="sm" delay={i + 1}>
                      <div className="flex flex-col gap-2 p-5 rounded-[var(--radius-lg)] bg-bg-card border border-border-light">
                        <p className="text-body text-text-primary font-medium">{item.text}</p>
                        <p className="text-small text-text-secondary">{item.detail}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ INTERFACE PREVIEW ═══ */}
        <section className="section section-dark">
          <div className="container-main">
            <div className="text-center mb-16">
              <ScrollReveal variant="sm">
                <p className="text-eyebrow text-accent mb-8">What you'll see</p>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <h2 className="h2 text-text-on-dark mb-6">
                  Every job, scored for you.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="text-large opacity-60 max-w-[520px] mx-auto">
                  No more guessing. Every listing shows how well it fits your profile.
                </p>
              </ScrollReveal>
            </div>

            {/* Mock job cards */}
            <ScrollReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[960px] mx-auto">
                {[
                  { title: "Product Designer", company: "Linear", match: 94, salary: "$120K–$165K", location: "Remote", skills: ["Figma", "Design Systems", "Prototyping"] },
                  { title: "UX Researcher", company: "Airbnb", match: 87, salary: "$135K–$180K", location: "San Francisco", skills: ["User Interviews", "Data Analysis", "Synthesis"] },
                  { title: "Brand Strategist", company: "Vercel", match: 82, salary: "$110K–$145K", location: "Remote", skills: ["Brand Identity", "Positioning", "Copywriting"] },
                ].map((job) => (
                  <div
                    key={job.title}
                    className="rounded-[var(--radius-lg)] p-6 flex flex-col gap-4"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-body font-semibold text-white mb-1">{job.title}</p>
                        <p className="text-small opacity-50">{job.company} · {job.location}</p>
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-full text-[12px] font-bold"
                        style={{
                          background: job.match >= 90 ? "rgba(179,255,59,0.15)" : "rgba(20,169,255,0.15)",
                          color: job.match >= 90 ? "#B3FF3B" : "#14A9FF",
                        }}
                      >
                        {job.match}%
                      </div>
                    </div>
                    <p className="text-small opacity-60">{job.salary}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    {/* Compatibility bar */}
                    <div className="mt-auto">
                      <div className="flex justify-between text-[11px] opacity-40 mb-1.5">
                        <span>Compatibility</span>
                        <span>{job.match}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${job.match}%`,
                            background: job.match >= 90 ? "#B3FF3B" : "#14A9FF",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="section bg-bg-primary">
          <div className="container-main max-w-[800px] mx-auto">
            <div className="text-center mb-20">
              <ScrollReveal variant="sm">
                <p className="text-eyebrow text-accent mb-8">How it works</p>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <h2 className="h2 text-text-primary">
                  Three steps to better matches.
                </h2>
              </ScrollReveal>
            </div>

            <div className="flex flex-col gap-12">
              {steps.map((step, i) => (
                <ScrollReveal key={step.num} delay={i + 1}>
                  <div className="flex gap-8 items-start">
                    <span
                      className="text-[48px] font-bold tracking-tight shrink-0 leading-none"
                      style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--accent)", opacity: 0.3 }}
                    >
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-large font-bold text-text-primary mb-2">{step.headline}</h3>
                      <p className="text-body text-text-secondary">{step.body}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROOF ═══ */}
        <section className="section section-dark">
          <div className="container-main">
            <ScrollReveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { value: "10,247", label: "Roadmaps built" },
                  { value: "94%", label: "Avg match accuracy" },
                  { value: "190+", label: "Countries" },
                  { value: "4.9", label: "User rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-[36px] lg:text-[48px] font-bold tracking-tight leading-none mb-2"
                      style={{ fontFamily: "'Urbanist', sans-serif", color: "#fff" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-small opacity-40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="section bg-bg-primary">
          <div className="container-main max-w-[700px] mx-auto text-center">
            <ScrollReveal>
              <h2 className="h2 text-text-primary mb-6">
                Stop applying everywhere.<br />
                <span className="text-accent">Start applying right.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-large text-text-secondary mb-10">
                Free. No credit card. Takes 4 minutes to get your first matches.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <Link to="/signup" className="btn btn-primary">
                <BtnText>See Your Matches</BtnText>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </LandingWrapper>
  );
}
