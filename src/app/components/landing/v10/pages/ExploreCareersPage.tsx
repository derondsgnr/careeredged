import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { LandingWrapper } from "../LandingWrapper";
import { Navbar } from "../sections/Navbar";
import { Footer } from "../sections/Footer";
import { ScrollReveal } from "../animations/ScrollReveal";
import { BtnText } from "../ui/BtnText";

const industries = [
  { id: "tech", label: "Technology" },
  { id: "healthcare", label: "Healthcare" },
  { id: "finance", label: "Finance" },
  { id: "education", label: "Education" },
  { id: "creative", label: "Creative" },
  { id: "engineering", label: "Engineering" },
];

interface Career {
  title: string;
  salary: string;
  growth: string;
  skills: string[];
  roadmapSteps: string[];
  detailedSalary: string;
}

const careersByIndustry: Record<string, Career[]> = {
  tech: [
    { title: "Product Manager", salary: "$120K–$180K", growth: "+22%", skills: ["Strategy", "User Research", "Data Analysis", "Agile"], roadmapSteps: ["Complete archetype assessment", "Build PM portfolio", "Target 15 high-match roles", "Prep case studies"], detailedSalary: "Base: $135K · Equity: $40K · Total: $175K avg" },
    { title: "UX Designer", salary: "$95K–$150K", growth: "+16%", skills: ["Figma", "Prototyping", "User Testing", "Design Systems"], roadmapSteps: ["Complete design assessment", "Build case study portfolio", "Apply to 10 match roles", "Refine presentation skills"], detailedSalary: "Base: $110K · Bonus: $15K · Total: $125K avg" },
    { title: "Data Engineer", salary: "$130K–$200K", growth: "+35%", skills: ["Python", "SQL", "Cloud", "ETL Pipelines"], roadmapSteps: ["Assess technical depth", "Fill cloud certification gap", "Target data-first companies", "Build pipeline portfolio"], detailedSalary: "Base: $155K · Equity: $50K · Total: $205K avg" },
    { title: "DevOps Engineer", salary: "$125K–$185K", growth: "+28%", skills: ["Kubernetes", "CI/CD", "AWS", "Terraform"], roadmapSteps: ["Map current infrastructure skills", "Get AWS certified", "Build automation portfolio", "Target Series B+ startups"], detailedSalary: "Base: $145K · Equity: $35K · Total: $180K avg" },
  ],
  healthcare: [
    { title: "Health Informatics Analyst", salary: "$80K–$120K", growth: "+18%", skills: ["EHR Systems", "Data Analysis", "HIPAA", "SQL"], roadmapSteps: ["Complete health data assessment", "Get CAHIMS certification", "Target hospital systems", "Build compliance portfolio"], detailedSalary: "Base: $95K · Bonus: $10K · Total: $105K avg" },
    { title: "Clinical Research Coordinator", salary: "$55K–$85K", growth: "+12%", skills: ["Protocol Management", "Patient Recruiting", "IRB Compliance", "Data Collection"], roadmapSteps: ["Assess research experience", "Get SOCRA certification", "Target CROs and academic centers", "Build trial management portfolio"], detailedSalary: "Base: $68K · Bonus: $7K · Total: $75K avg" },
    { title: "Healthcare Consultant", salary: "$90K–$160K", growth: "+24%", skills: ["Strategy", "Process Optimization", "Change Management", "Analytics"], roadmapSteps: ["Map consulting readiness", "Build healthcare domain knowledge", "Target Big 4 health practices", "Develop case study deck"], detailedSalary: "Base: $115K · Bonus: $25K · Total: $140K avg" },
    { title: "Biostatistician", salary: "$85K–$140K", growth: "+20%", skills: ["R", "SAS", "Clinical Trials", "Statistical Modeling"], roadmapSteps: ["Assess quantitative skills", "Complete SAS certification", "Target pharma companies", "Publish analysis portfolio"], detailedSalary: "Base: $105K · Bonus: $15K · Total: $120K avg" },
  ],
  finance: [
    { title: "Financial Analyst", salary: "$70K–$120K", growth: "+9%", skills: ["Financial Modeling", "Excel", "Valuation", "Reporting"], roadmapSteps: ["Assess quantitative aptitude", "Build modeling portfolio", "Target mid-market firms", "Prep for case interviews"], detailedSalary: "Base: $85K · Bonus: $20K · Total: $105K avg" },
    { title: "FinTech Product Manager", salary: "$130K–$190K", growth: "+30%", skills: ["Payments", "APIs", "Compliance", "Product Strategy"], roadmapSteps: ["Map fintech domain knowledge", "Build regulatory understanding", "Target Series A-C fintechs", "Develop product case studies"], detailedSalary: "Base: $150K · Equity: $45K · Total: $195K avg" },
    { title: "Risk Analyst", salary: "$75K–$130K", growth: "+14%", skills: ["Risk Modeling", "Python", "Basel III", "Stress Testing"], roadmapSteps: ["Complete risk assessment profile", "Get FRM certification", "Target bulge bracket banks", "Build quantitative portfolio"], detailedSalary: "Base: $95K · Bonus: $25K · Total: $120K avg" },
    { title: "Investment Analyst", salary: "$80K–$150K", growth: "+11%", skills: ["Valuation", "Due Diligence", "Market Research", "Financial Modeling"], roadmapSteps: ["Assess analytical skills", "Complete CFA Level 1", "Target PE/VC firms", "Build deal analysis portfolio"], detailedSalary: "Base: $100K · Bonus: $40K · Total: $140K avg" },
  ],
  education: [
    { title: "Instructional Designer", salary: "$65K–$100K", growth: "+15%", skills: ["Curriculum Design", "LMS", "E-learning Tools", "Assessment"], roadmapSteps: ["Complete learning design assessment", "Build course portfolio", "Target EdTech companies", "Get CPTD certification"], detailedSalary: "Base: $78K · Bonus: $8K · Total: $86K avg" },
    { title: "EdTech Product Manager", salary: "$110K–$165K", growth: "+26%", skills: ["Learning Science", "Product Strategy", "User Research", "Data"], roadmapSteps: ["Map EdTech domain knowledge", "Build learning product cases", "Target growth-stage EdTech", "Develop outcome metrics portfolio"], detailedSalary: "Base: $130K · Equity: $30K · Total: $160K avg" },
    { title: "Academic Program Director", salary: "$75K–$120K", growth: "+8%", skills: ["Program Management", "Accreditation", "Faculty Relations", "Budget"], roadmapSteps: ["Assess leadership readiness", "Build accreditation knowledge", "Target R1 universities", "Develop program outcomes deck"], detailedSalary: "Base: $90K · Bonus: $12K · Total: $102K avg" },
    { title: "Learning Experience Designer", salary: "$80K–$125K", growth: "+21%", skills: ["UX for Learning", "Prototyping", "Accessibility", "Storytelling"], roadmapSteps: ["Complete design assessment", "Build interactive learning portfolio", "Target corporate L&D teams", "Get accessibility certification"], detailedSalary: "Base: $95K · Bonus: $10K · Total: $105K avg" },
  ],
  creative: [
    { title: "Brand Strategist", salary: "$90K–$145K", growth: "+13%", skills: ["Brand Identity", "Positioning", "Research", "Copywriting"], roadmapSteps: ["Assess strategic thinking", "Build brand case studies", "Target agencies + in-house", "Develop positioning framework"], detailedSalary: "Base: $110K · Bonus: $15K · Total: $125K avg" },
    { title: "Content Strategist", salary: "$80K–$130K", growth: "+17%", skills: ["SEO", "Editorial Planning", "Analytics", "Storytelling"], roadmapSteps: ["Map content domain skills", "Build editorial portfolio", "Target SaaS companies", "Develop content frameworks"], detailedSalary: "Base: $100K · Bonus: $12K · Total: $112K avg" },
    { title: "Motion Designer", salary: "$85K–$140K", growth: "+19%", skills: ["After Effects", "Cinema 4D", "Storyboarding", "Brand Animation"], roadmapSteps: ["Complete creative assessment", "Build motion reel", "Target product companies", "Learn 3D fundamentals"], detailedSalary: "Base: $105K · Bonus: $10K · Total: $115K avg" },
    { title: "Creative Director", salary: "$130K–$200K", growth: "+10%", skills: ["Team Leadership", "Visual Direction", "Client Management", "Campaign Strategy"], roadmapSteps: ["Assess leadership readiness", "Build campaign portfolio", "Target agency CD roles", "Develop team management skills"], detailedSalary: "Base: $160K · Bonus: $30K · Total: $190K avg" },
  ],
  engineering: [
    { title: "Mechanical Engineer", salary: "$75K–$120K", growth: "+7%", skills: ["CAD", "FEA", "Prototyping", "GD&T"], roadmapSteps: ["Assess technical depth", "Get PE license", "Target automotive/aerospace", "Build design portfolio"], detailedSalary: "Base: $90K · Bonus: $10K · Total: $100K avg" },
    { title: "Systems Engineer", salary: "$100K–$160K", growth: "+15%", skills: ["Systems Architecture", "Requirements", "V&V", "MBSE"], roadmapSteps: ["Map systems thinking skills", "Get INCOSE certification", "Target defense/space companies", "Build architecture portfolio"], detailedSalary: "Base: $125K · Bonus: $20K · Total: $145K avg" },
    { title: "Robotics Engineer", salary: "$110K–$175K", growth: "+25%", skills: ["ROS", "C++", "Computer Vision", "Controls"], roadmapSteps: ["Assess robotics fundamentals", "Build demo projects", "Target automation companies", "Publish technical portfolio"], detailedSalary: "Base: $135K · Equity: $25K · Total: $160K avg" },
    { title: "Civil Engineer", salary: "$70K–$110K", growth: "+6%", skills: ["AutoCAD", "Structural Analysis", "Project Management", "Codes"], roadmapSteps: ["Complete engineering assessment", "Get PE license", "Target infrastructure firms", "Build project portfolio"], detailedSalary: "Base: $85K · Bonus: $8K · Total: $93K avg" },
  ],
};

function CareerCard({ career, index }: { career: Career; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
      className="rounded-[var(--radius-lg)] overflow-hidden flex flex-col"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
      }}
    >
      {/* Visible portion */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h3 className="text-large font-bold text-text-primary">{career.title}</h3>
          <span
            className="text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: "rgba(179,255,59,0.12)", color: "#B3FF3B" }}
          >
            {career.growth}
          </span>
        </div>

        <p className="text-[20px] font-bold tracking-tight text-text-primary" style={{ fontFamily: "'Urbanist', sans-serif" }}>
          {career.salary}
        </p>

        <div className="flex flex-wrap gap-2">
          {career.skills.map((s) => (
            <span
              key={s}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border-light text-text-secondary"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Blurred portion — roadmap + detailed salary */}
      <div className="relative px-6 pb-6 pt-2">
        {/* Divider */}
        <div className="h-px mb-4" style={{ background: "var(--border-light)" }} />

        {/* Blurred content */}
        <div className="select-none" style={{ filter: "blur(6px)", pointerEvents: "none" }}>
          <p className="text-[11px] uppercase tracking-wider text-text-secondary mb-3" style={{ fontWeight: 600 }}>
            Your pathway
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {career.roadmapSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "rgba(20,169,255,0.12)", color: "#14A9FF" }}>
                  {i + 1}
                </div>
                <span className="text-[12px] text-text-secondary">{step}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-text-secondary">{career.detailedSalary}</p>
        </div>

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Link
            to="/signup"
            className="btn btn-primary !py-2.5 !px-5 !text-[13px] z-10"
          >
            Sign up to unlock pathway
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ExploreCareersPage() {
  const [activeIndustry, setActiveIndustry] = useState("tech");

  return (
    <LandingWrapper>
      <Navbar />
      <main>
        {/* ═══ HERO + INDUSTRY SELECTOR ═══ */}
        <section className="section-hero section-dark">
          <div className="container-main text-center">
            <ScrollReveal variant="sm">
              <p className="text-eyebrow text-accent mb-8">Explore Careers</p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="h2 text-text-on-dark mb-8 max-w-[800px] mx-auto">
                What career actually<br />
                <span className="text-accent">fits you?</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-large opacity-60 mb-12 max-w-[520px] mx-auto">
                Browse careers by industry. See real salary data, growth projections, and the skills that matter — then unlock your personalized pathway.
              </p>
            </ScrollReveal>

            {/* Industry pills */}
            <ScrollReveal delay={3}>
              <div className="flex flex-wrap justify-center gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setActiveIndustry(ind.id)}
                    className="px-5 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-300"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      background: activeIndustry === ind.id ? "rgba(20,169,255,0.15)" : "rgba(255,255,255,0.04)",
                      color: activeIndustry === ind.id ? "#14A9FF" : "rgba(255,255,255,0.5)",
                      border: `1px solid ${activeIndustry === ind.id ? "rgba(20,169,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ CAREER GRID ═══ */}
        <section className="section bg-bg-primary">
          <div className="container-main">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {careersByIndustry[activeIndustry].map((career, i) => (
                  <CareerCard key={career.title} career={career} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ═══ THE DATABASE ═══ */}
        <section className="section section-dark">
          <div className="container-main text-center">
            <ScrollReveal>
              <p className="text-eyebrow text-accent mb-8">The database</p>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="h2 text-text-on-dark mb-12">
                30+ careers mapped.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 max-w-[800px] mx-auto">
                {[
                  { value: "30+", label: "Careers" },
                  { value: "6", label: "Industries" },
                  { value: "120+", label: "Skills mapped" },
                  { value: "Real", label: "Salary data" },
                  { value: "Live", label: "Growth rates" },
                  { value: "Custom", label: "Pathways" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[24px] font-bold tracking-tight text-white mb-1" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                      {stat.value}
                    </p>
                    <p className="text-[11px] opacity-40">{stat.label}</p>
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
                Find the career that<br />
                <span className="text-accent">fits who you are.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="text-large text-text-secondary mb-10">
                Complete a 4-minute assessment and unlock personalized career pathways with salary data, skill gaps, and a step-by-step roadmap.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <Link to="/signup" className="btn btn-primary">
                <BtnText>Find Your Career Match</BtnText>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </LandingWrapper>
  );
}
