/**
 * Career Discovery — Browse 30+ careers, find your archetype
 *
 * States: Browse (default) → Detail (on card click) → Assessment (5-question) → Results
 * Route: /:role/careers (authenticated) + /careers (public)
 * Access: All roles
 *
 * Entry points: Landing nav, onboarding chip, EdgePath Day 0, dashboard card,
 * NavExplorePanel, Sophia contextual
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { RoleShell } from "./role-shell";
import { SophiaMark } from "./sophia-mark";
import {
  Search, Compass, TrendingUp, DollarSign, Clock, ChevronRight,
  ArrowRight, Check, X, Sparkles, GraduationCap, Briefcase,
  Heart, Lightbulb, Users, Zap, Target, Star, BarChart3,
  Code, Stethoscope, Building2, Palette, Wrench, Scale,
  BookOpen, Megaphone, FlaskConical, HardHat, Landmark,
  Filter, ArrowUpDown,
} from "lucide-react";

// ─── Career Data ────────────────────────────────────────────────────

const INDUSTRIES = [
  { id: "tech", label: "Technology", icon: Code },
  { id: "health", label: "Healthcare", icon: Stethoscope },
  { id: "finance", label: "Finance", icon: Building2 },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "engineering", label: "Engineering", icon: Wrench },
  { id: "education", label: "Education", icon: BookOpen },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "legal", label: "Legal", icon: Scale },
  { id: "science", label: "Science", icon: FlaskConical },
  { id: "trades", label: "Trades", icon: HardHat },
  { id: "government", label: "Government", icon: Landmark },
] as const;

type IndustryId = (typeof INDUSTRIES)[number]["id"];

interface Career {
  id: string;
  title: string;
  industry: IndustryId;
  description: string;
  salaryEntry: string;
  salaryMid: string;
  salarySenior: string;
  salaryAvg: number; // for sorting
  growth: number; // 5yr %
  transitionTime: string;
  skills: string[];
  education: string;
  archetype: string; // primary archetype match
  related: string[]; // related career IDs
}

const CAREERS: Career[] = [
  // Technology
  { id: "swe", title: "Software Engineer", industry: "tech", description: "Design, build, and maintain software systems. Work across frontend, backend, and infrastructure to ship products used by millions.", salaryEntry: "$75K", salaryMid: "$120K", salarySenior: "$180K+", salaryAvg: 120000, growth: 25, transitionTime: "6-12 months", skills: ["JavaScript", "Python", "System Design", "Git"], education: "Bachelor's in CS or bootcamp", archetype: "Builder", related: ["devops", "data-sci"] },
  { id: "prod-design", title: "Product Designer", industry: "tech", description: "Shape user experiences through research, prototyping, and visual design. Bridge user needs with business goals.", salaryEntry: "$65K", salaryMid: "$110K", salarySenior: "$165K+", salaryAvg: 110000, growth: 21, transitionTime: "3-8 months", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], education: "Bachelor's or portfolio-based", archetype: "Creator", related: ["ux-res", "content-strat"] },
  { id: "data-sci", title: "Data Scientist", industry: "tech", description: "Extract insights from complex datasets using statistics, machine learning, and domain expertise to drive decisions.", salaryEntry: "$80K", salaryMid: "$130K", salarySenior: "$190K+", salaryAvg: 130000, growth: 35, transitionTime: "8-14 months", skills: ["Python", "SQL", "Machine Learning", "Statistics"], education: "Master's preferred", archetype: "Analyst", related: ["ai-ml", "swe"] },
  { id: "devops", title: "DevOps Engineer", industry: "tech", description: "Build and maintain CI/CD pipelines, infrastructure, and deployment systems. Keep production reliable and scalable.", salaryEntry: "$80K", salaryMid: "$125K", salarySenior: "$175K+", salaryAvg: 125000, growth: 22, transitionTime: "6-10 months", skills: ["AWS/GCP", "Docker", "Kubernetes", "Terraform"], education: "Bachelor's in CS or equivalent", archetype: "Builder", related: ["swe", "cybersec"] },
  { id: "ai-ml", title: "AI/ML Engineer", industry: "tech", description: "Build intelligent systems using deep learning, NLP, and computer vision. Ship AI-powered features at scale.", salaryEntry: "$90K", salaryMid: "$150K", salarySenior: "$250K+", salaryAvg: 150000, growth: 40, transitionTime: "12-18 months", skills: ["PyTorch", "TensorFlow", "NLP", "Math"], education: "Master's or PhD preferred", archetype: "Innovator", related: ["data-sci", "swe"] },
  { id: "cybersec", title: "Cybersecurity Analyst", industry: "tech", description: "Protect organizations from cyber threats. Monitor, detect, and respond to security incidents.", salaryEntry: "$65K", salaryMid: "$105K", salarySenior: "$155K+", salaryAvg: 105000, growth: 32, transitionTime: "6-12 months", skills: ["Network Security", "SIEM", "Penetration Testing", "Compliance"], education: "Bachelor's + certifications", archetype: "Analyst", related: ["devops", "swe"] },
  // Healthcare
  { id: "rn", title: "Registered Nurse", industry: "health", description: "Provide direct patient care, coordinate treatment plans, and support patients through recovery.", salaryEntry: "$55K", salaryMid: "$80K", salarySenior: "$110K+", salaryAvg: 80000, growth: 12, transitionTime: "2-4 years", skills: ["Patient Care", "Clinical Skills", "EMR Systems", "Communication"], education: "BSN required", archetype: "Helper", related: ["pt", "health-info"] },
  { id: "pt", title: "Physical Therapist", industry: "health", description: "Help patients recover from injuries and improve mobility through personalized treatment programs.", salaryEntry: "$65K", salaryMid: "$90K", salarySenior: "$120K+", salaryAvg: 90000, growth: 17, transitionTime: "3-6 years", skills: ["Anatomy", "Exercise Science", "Patient Assessment", "Manual Therapy"], education: "DPT required", archetype: "Helper", related: ["rn", "health-info"] },
  { id: "health-info", title: "Health Informatics", industry: "health", description: "Bridge healthcare and technology. Design systems that improve patient outcomes through better data.", salaryEntry: "$60K", salaryMid: "$95K", salarySenior: "$140K+", salaryAvg: 95000, growth: 28, transitionTime: "6-12 months", skills: ["EHR Systems", "Data Analysis", "HIPAA", "SQL"], education: "Bachelor's + health IT cert", archetype: "Connector", related: ["rn", "data-sci"] },
  // Finance
  { id: "fin-analyst", title: "Financial Analyst", industry: "finance", description: "Analyze financial data, build models, and provide recommendations to guide business investment decisions.", salaryEntry: "$60K", salaryMid: "$95K", salarySenior: "$145K+", salaryAvg: 95000, growth: 9, transitionTime: "3-6 months", skills: ["Financial Modeling", "Excel", "SQL", "Valuation"], education: "Bachelor's in Finance/Accounting", archetype: "Analyst", related: ["quant", "fintech-pm"] },
  { id: "quant", title: "Quantitative Analyst", industry: "finance", description: "Apply mathematical models to financial markets. Build trading algorithms and risk models.", salaryEntry: "$100K", salaryMid: "$175K", salarySenior: "$300K+", salaryAvg: 175000, growth: 18, transitionTime: "12-24 months", skills: ["Python", "Statistics", "Stochastic Calculus", "C++"], education: "Master's or PhD in Math/CS", archetype: "Innovator", related: ["fin-analyst", "data-sci"] },
  { id: "fintech-pm", title: "FinTech Product Manager", industry: "finance", description: "Lead product strategy for financial technology products. Balance user needs, regulation, and business growth.", salaryEntry: "$85K", salaryMid: "$135K", salarySenior: "$200K+", salaryAvg: 135000, growth: 22, transitionTime: "3-8 months", skills: ["Product Strategy", "Agile", "Financial Regulation", "User Research"], education: "Bachelor's + domain experience", archetype: "Strategist", related: ["fin-analyst", "prod-design"] },
  // Creative
  { id: "ux-res", title: "UX Researcher", industry: "creative", description: "Uncover user needs through interviews, usability testing, and data analysis. Inform product decisions with evidence.", salaryEntry: "$65K", salaryMid: "$105K", salarySenior: "$155K+", salaryAvg: 105000, growth: 19, transitionTime: "3-6 months", skills: ["User Interviews", "Usability Testing", "Survey Design", "Data Synthesis"], education: "Bachelor's in HCI/Psychology", archetype: "Analyst", related: ["prod-design", "content-strat"] },
  { id: "content-strat", title: "Content Strategist", industry: "creative", description: "Plan, create, and manage content that drives engagement and supports business objectives across channels.", salaryEntry: "$55K", salaryMid: "$85K", salarySenior: "$130K+", salaryAvg: 85000, growth: 14, transitionTime: "2-4 months", skills: ["Content Planning", "SEO", "Analytics", "Copywriting"], education: "Bachelor's in Communications/Marketing", archetype: "Creator", related: ["growth-mkt", "prod-design"] },
  { id: "motion-design", title: "Motion Designer", industry: "creative", description: "Create animated graphics, transitions, and visual effects for digital products, brands, and media.", salaryEntry: "$55K", salaryMid: "$90K", salarySenior: "$140K+", salaryAvg: 90000, growth: 16, transitionTime: "3-6 months", skills: ["After Effects", "Lottie", "Framer Motion", "3D Animation"], education: "Bachelor's or portfolio-based", archetype: "Creator", related: ["prod-design", "content-strat"] },
  // Engineering
  { id: "civil-eng", title: "Civil Engineer", industry: "engineering", description: "Design and oversee construction of infrastructure — roads, bridges, buildings, and water systems.", salaryEntry: "$60K", salaryMid: "$85K", salarySenior: "$120K+", salaryAvg: 85000, growth: 7, transitionTime: "4-6 years", skills: ["AutoCAD", "Structural Analysis", "Project Management", "GIS"], education: "Bachelor's in Civil Engineering + PE", archetype: "Builder", related: ["mech-eng", "urban-plan"] },
  { id: "mech-eng", title: "Mechanical Engineer", industry: "engineering", description: "Design mechanical systems, from consumer products to industrial machinery. Solve physical world problems.", salaryEntry: "$65K", salaryMid: "$90K", salarySenior: "$130K+", salaryAvg: 90000, growth: 10, transitionTime: "4-6 years", skills: ["SolidWorks", "Thermodynamics", "FEA", "Manufacturing"], education: "Bachelor's in Mechanical Engineering", archetype: "Builder", related: ["civil-eng", "elec-eng"] },
  { id: "elec-eng", title: "Electrical Engineer", industry: "engineering", description: "Design electrical systems, circuits, and components for everything from smartphones to power grids.", salaryEntry: "$65K", salaryMid: "$95K", salarySenior: "$140K+", salaryAvg: 95000, growth: 11, transitionTime: "4-6 years", skills: ["Circuit Design", "MATLAB", "Embedded Systems", "Power Systems"], education: "Bachelor's in EE", archetype: "Builder", related: ["mech-eng", "swe"] },
  // Education
  { id: "instruct-design", title: "Instructional Designer", industry: "education", description: "Create effective learning experiences for corporate training, online courses, and educational programs.", salaryEntry: "$50K", salaryMid: "$75K", salarySenior: "$110K+", salaryAvg: 75000, growth: 15, transitionTime: "2-6 months", skills: ["Learning Theory", "Articulate", "Video Production", "Assessment Design"], education: "Master's in Education/ID preferred", archetype: "Creator", related: ["edtech-pm", "content-strat"] },
  { id: "edtech-pm", title: "EdTech Product Manager", industry: "education", description: "Lead product development for educational technology. Balance pedagogy, engagement, and business metrics.", salaryEntry: "$75K", salaryMid: "$115K", salarySenior: "$165K+", salaryAvg: 115000, growth: 20, transitionTime: "3-6 months", skills: ["Product Strategy", "Learning Analytics", "Agile", "User Research"], education: "Bachelor's + education domain", archetype: "Strategist", related: ["instruct-design", "fintech-pm"] },
  // Marketing
  { id: "growth-mkt", title: "Growth Marketer", industry: "marketing", description: "Drive user acquisition and retention through data-driven experiments across channels.", salaryEntry: "$55K", salaryMid: "$90K", salarySenior: "$145K+", salaryAvg: 90000, growth: 18, transitionTime: "2-4 months", skills: ["Analytics", "A/B Testing", "SEO/SEM", "Email Marketing"], education: "Bachelor's in Marketing/Business", archetype: "Strategist", related: ["content-strat", "brand-strat"] },
  { id: "brand-strat", title: "Brand Strategist", industry: "marketing", description: "Define brand positioning, messaging, and identity. Guide how organizations communicate with their audiences.", salaryEntry: "$55K", salaryMid: "$85K", salarySenior: "$135K+", salaryAvg: 85000, growth: 12, transitionTime: "2-4 months", skills: ["Brand Strategy", "Market Research", "Storytelling", "Visual Identity"], education: "Bachelor's in Marketing/Design", archetype: "Creator", related: ["growth-mkt", "content-strat"] },
  // Legal
  { id: "compliance", title: "Compliance Analyst", industry: "legal", description: "Ensure organizations meet regulatory requirements. Monitor policies, assess risks, and implement controls.", salaryEntry: "$55K", salaryMid: "$80K", salarySenior: "$120K+", salaryAvg: 80000, growth: 13, transitionTime: "3-6 months", skills: ["Regulatory Knowledge", "Risk Assessment", "Audit", "Documentation"], education: "Bachelor's in Law/Business", archetype: "Analyst", related: ["legal-tech", "fin-analyst"] },
  { id: "legal-tech", title: "Legal Technologist", industry: "legal", description: "Apply technology to improve legal processes. Build tools for contract analysis, e-discovery, and legal research.", salaryEntry: "$70K", salaryMid: "$110K", salarySenior: "$160K+", salaryAvg: 110000, growth: 24, transitionTime: "6-12 months", skills: ["Legal Knowledge", "Programming", "NLP", "Contract Analysis"], education: "JD + technical skills or CS + legal domain", archetype: "Innovator", related: ["compliance", "swe"] },
  // Science
  { id: "biotech", title: "Biotech Researcher", industry: "science", description: "Conduct research in molecular biology, genetics, or pharmacology to develop new therapies and diagnostics.", salaryEntry: "$55K", salaryMid: "$85K", salarySenior: "$130K+", salaryAvg: 85000, growth: 17, transitionTime: "4-8 years", skills: ["Lab Techniques", "Data Analysis", "Scientific Writing", "CRISPR/Gene Editing"], education: "PhD preferred", archetype: "Innovator", related: ["env-sci", "health-info"] },
  { id: "env-sci", title: "Environmental Scientist", industry: "science", description: "Study environmental systems and develop solutions for pollution, conservation, and climate challenges.", salaryEntry: "$50K", salaryMid: "$75K", salarySenior: "$110K+", salaryAvg: 75000, growth: 11, transitionTime: "4-6 years", skills: ["GIS", "Environmental Modeling", "Field Research", "Policy Analysis"], education: "Bachelor's or Master's in Environmental Science", archetype: "Helper", related: ["biotech", "urban-plan"] },
  // Trades
  { id: "electrician", title: "Electrician", industry: "trades", description: "Install, maintain, and repair electrical systems in residential, commercial, and industrial settings.", salaryEntry: "$40K", salaryMid: "$65K", salarySenior: "$95K+", salaryAvg: 65000, growth: 9, transitionTime: "4-5 years", skills: ["Electrical Code", "Troubleshooting", "Blueprint Reading", "Safety"], education: "Apprenticeship + license", archetype: "Builder", related: ["hvac", "mech-eng"] },
  { id: "hvac", title: "HVAC Technician", industry: "trades", description: "Install and service heating, ventilation, and air conditioning systems. High demand, stable career path.", salaryEntry: "$38K", salaryMid: "$58K", salarySenior: "$85K+", salaryAvg: 58000, growth: 13, transitionTime: "2-4 years", skills: ["HVAC Systems", "Refrigeration", "Electrical", "Customer Service"], education: "Trade school + EPA certification", archetype: "Builder", related: ["electrician", "elec-eng"] },
  // Government
  { id: "policy-analyst", title: "Policy Analyst", industry: "government", description: "Research and analyze public policies. Provide recommendations to government agencies and elected officials.", salaryEntry: "$50K", salaryMid: "$75K", salarySenior: "$110K+", salaryAvg: 75000, growth: 8, transitionTime: "2-4 months", skills: ["Research", "Data Analysis", "Policy Writing", "Stakeholder Management"], education: "Master's in Public Policy/Admin", archetype: "Strategist", related: ["urban-plan", "compliance"] },
  { id: "urban-plan", title: "Urban Planner", industry: "government", description: "Design land use plans and programs for communities. Balance development, sustainability, and community needs.", salaryEntry: "$48K", salaryMid: "$72K", salarySenior: "$105K+", salaryAvg: 72000, growth: 11, transitionTime: "2-4 years", skills: ["GIS", "Zoning Law", "Community Engagement", "Environmental Planning"], education: "Master's in Urban Planning", archetype: "Connector", related: ["policy-analyst", "civil-eng"] },
];

// ─── Assessment Data ────────────────────────────────────────────────

const ARCHETYPES = ["Innovator", "Strategist", "Helper", "Builder", "Analyst", "Creator", "Connector", "Leader"] as const;
type Archetype = (typeof ARCHETYPES)[number];

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: { id: string; label: string; icon: typeof Heart; archetype: Archetype }[];
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: "q1", category: "Legacy", question: "What do you want to be known for?", options: [
    { id: "q1-a", label: "Inventing something new", icon: Lightbulb, archetype: "Innovator" },
    { id: "q1-b", label: "Building things that last", icon: Wrench, archetype: "Builder" },
    { id: "q1-c", label: "Helping people grow", icon: Heart, archetype: "Helper" },
    { id: "q1-d", label: "Leading with vision", icon: Target, archetype: "Leader" },
  ]},
  { id: "q2", category: "Work Style", question: "How do you prefer to work?", options: [
    { id: "q2-a", label: "Deep focus, solo", icon: Code, archetype: "Analyst" },
    { id: "q2-b", label: "Collaborative teams", icon: Users, archetype: "Connector" },
    { id: "q2-c", label: "Creative exploration", icon: Palette, archetype: "Creator" },
    { id: "q2-d", label: "Strategic planning", icon: Compass, archetype: "Strategist" },
  ]},
  { id: "q3", category: "Problem Solving", question: "How do you approach challenges?", options: [
    { id: "q3-a", label: "Analyze data first", icon: BarChart3, archetype: "Analyst" },
    { id: "q3-b", label: "Brainstorm creative solutions", icon: Sparkles, archetype: "Creator" },
    { id: "q3-c", label: "Build a prototype quickly", icon: Zap, archetype: "Builder" },
    { id: "q3-d", label: "Rally the team", icon: Users, archetype: "Leader" },
  ]},
  { id: "q4", category: "Values", question: "What matters most in your work?", options: [
    { id: "q4-a", label: "Making an impact", icon: Heart, archetype: "Helper" },
    { id: "q4-b", label: "Pushing boundaries", icon: Lightbulb, archetype: "Innovator" },
    { id: "q4-c", label: "Connecting people & ideas", icon: Users, archetype: "Connector" },
    { id: "q4-d", label: "Winning the market", icon: TrendingUp, archetype: "Strategist" },
  ]},
  { id: "q5", category: "Environment", question: "What work setting energizes you?", options: [
    { id: "q5-a", label: "Fast-paced startup", icon: Zap, archetype: "Innovator" },
    { id: "q5-b", label: "Research lab or studio", icon: FlaskConical, archetype: "Analyst" },
    { id: "q5-c", label: "Mission-driven org", icon: Heart, archetype: "Helper" },
    { id: "q5-d", label: "Creative agency", icon: Palette, archetype: "Creator" },
  ]},
];

// ─── Hook: useArchetypeResult ───────────────────────────────────────

function useArchetypeResult() {
  const [result, setR] = useState<{ archetype: Archetype; scores: Record<Archetype, number> } | null>(() => {
    try { const s = localStorage.getItem("ce-archetype"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const save = (r: { archetype: Archetype; scores: Record<Archetype, number> }) => { setR(r); try { localStorage.setItem("ce-archetype", JSON.stringify(r)); } catch {} };
  const reset = () => { setR(null); try { localStorage.removeItem("ce-archetype"); } catch {} };
  return { result, save, reset } as const;
}

function calculateArchetype(answers: Record<string, string>): { archetype: Archetype; scores: Record<Archetype, number> } {
  const scores: Record<string, number> = {};
  ARCHETYPES.forEach(a => { scores[a] = 0; });

  Object.values(answers).forEach(optionId => {
    ASSESSMENT_QUESTIONS.forEach(q => {
      const opt = q.options.find(o => o.id === optionId);
      if (opt) scores[opt.archetype] = (scores[opt.archetype] || 0) + 1;
    });
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { archetype: sorted[0][0] as Archetype, scores: scores as Record<Archetype, number> };
}

function getMatchScore(career: Career, archetype: Archetype): number {
  if (career.archetype === archetype) return 85 + Math.floor(Math.random() * 14);
  // Partial matches
  const affinities: Record<Archetype, Archetype[]> = {
    Innovator: ["Creator", "Builder"], Strategist: ["Analyst", "Leader"], Helper: ["Connector", "Leader"],
    Builder: ["Innovator", "Analyst"], Analyst: ["Strategist", "Builder"], Creator: ["Innovator", "Connector"],
    Connector: ["Helper", "Creator"], Leader: ["Strategist", "Helper"],
  };
  if (affinities[archetype]?.includes(career.archetype as Archetype)) return 60 + Math.floor(Math.random() * 20);
  return 30 + Math.floor(Math.random() * 25);
}

// ─── Industry Icon Helper ───────────────────────────────────────────

function getIndustryIcon(id: IndustryId) {
  return INDUSTRIES.find(i => i.id === id)?.icon || Briefcase;
}
function getIndustryLabel(id: IndustryId) {
  return INDUSTRIES.find(i => i.id === id)?.label || id;
}

// ─── Career Card ────────────────────────────────────────────────────

function CareerCard({ career, selected, onClick, matchScore }: { career: Career; selected: boolean; onClick: () => void; matchScore?: number }) {
  const Icon = getIndustryIcon(career.industry);
  return (
    <motion.div
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-200"
      style={{
        background: selected ? "rgba(var(--ce-role-edgestar-rgb),0.03)" : "rgba(var(--ce-glass-tint),0.02)",
        border: `1px solid ${selected ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}`,
      }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
          <Icon className="w-4 h-4 text-ce-text-tertiary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[13px] text-ce-text-primary truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{career.title}</h3>
            {matchScore != null && (
              <span className="text-[10px] px-2 py-0.5 rounded-full tabular-nums flex-shrink-0 ml-2" style={{ background: matchScore >= 80 ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.04)", color: matchScore >= 80 ? "var(--ce-lime)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {matchScore}%
              </span>
            )}
          </div>
          <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{getIndustryLabel(career.industry)}</span>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-ce-text-quaternary" style={{ fontFamily: "var(--font-body)" }}>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{career.salaryMid}</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{career.growth}%</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{career.transitionTime}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {career.skills.slice(0, 3).map(s => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(var(--ce-glass-tint),0.03)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Detail Panel ───────────────────────────────────────────────────

function DetailPanel({ career, onClose, onNavigate, matchScore }: { career: Career; onClose: () => void; onNavigate?: (t: string) => void; matchScore?: number }) {
  const Icon = getIndustryIcon(career.industry);
  const salaries = [
    { level: "Entry", value: career.salaryEntry },
    { level: "Mid", value: career.salaryMid },
    { level: "Senior", value: career.salarySenior },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
              <Icon className="w-5 h-5" style={{ color: "var(--ce-role-edgestar)" }} />
            </div>
            <div>
              <h2 className="text-[16px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{career.title}</h2>
              <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{getIndustryLabel(career.industry)}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 cursor-pointer text-ce-text-quaternary hover:text-ce-text-tertiary transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {matchScore != null && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ background: matchScore >= 80 ? "rgba(var(--ce-lime-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.03)", border: `1px solid ${matchScore >= 80 ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.05)"}` }}>
            <Star className="w-3.5 h-3.5" style={{ color: matchScore >= 80 ? "var(--ce-lime)" : "var(--ce-text-tertiary)" }} />
            <span className="text-[12px]" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: matchScore >= 80 ? "var(--ce-lime)" : "var(--ce-text-secondary)" }}>{matchScore}% match with your archetype</span>
          </div>
        )}

        <p className="text-[12px] text-ce-text-secondary leading-relaxed mb-5" style={{ fontFamily: "var(--font-body)" }}>{career.description}</p>

        {/* Salary Breakdown */}
        <div className="mb-5">
          <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Salary Range</span>
          <div className="flex gap-2">
            {salaries.map(s => (
              <div key={s.level} className="flex-1 p-2.5 rounded-lg text-center" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
                <div className="text-[10px] text-ce-text-quaternary mb-1" style={{ fontFamily: "var(--font-body)" }}>{s.level}</div>
                <div className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth */}
        <div className="mb-5">
          <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>5-Year Growth</span>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(career.growth * 2, 100)}%`, background: career.growth >= 20 ? "var(--ce-lime)" : "var(--ce-role-edgestar)" }} />
            </div>
            <span className="text-[13px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{career.growth}%</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-5">
          <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Key Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {career.skills.map(s => (
              <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-5">
          <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Education</span>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-ce-text-tertiary" />
            <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{career.education}</span>
          </div>
        </div>

        {/* Transition Time */}
        <div className="mb-6">
          <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Time to Transition</span>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-ce-text-tertiary" />
            <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{career.transitionTime}</span>
          </div>
        </div>

        {/* Exit Points */}
        <div className="flex flex-col gap-2">
          <button onClick={() => onNavigate?.("jobs")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all"
            style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Briefcase className="w-3.5 h-3.5" /> See {career.title} jobs
          </button>
          <button onClick={() => onNavigate?.("edgepath")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all"
            style={{ background: "rgba(var(--ce-lime-rgb),0.06)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)", color: "var(--ce-lime)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Compass className="w-3.5 h-3.5" /> Build a roadmap
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Assessment Flow ────────────────────────────────────────────────

function AssessmentFlow({ onComplete, onClose }: { onComplete: (result: { archetype: Archetype; scores: Record<Archetype, number> }) => void; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [step, isTyping, generating]);

  useEffect(() => {
    if (!generating) return;
    const t = setTimeout(() => {
      const result = calculateArchetype(answers);
      onComplete(result);
    }, 2000);
    return () => clearTimeout(t);
  }, [generating, answers, onComplete]);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    if (step < ASSESSMENT_QUESTIONS.length - 1) {
      setIsTyping(true);
      setTimeout(() => { setIsTyping(false); setStep(prev => prev + 1); }, 800);
    } else {
      setIsTyping(true);
      setTimeout(() => { setIsTyping(false); setGenerating(true); }, 600);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-[560px] rounded-2xl overflow-hidden" style={{ background: "var(--ce-surface-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <SophiaMark size={24} glowing />
          <div className="flex-1">
            <h2 className="text-[15px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
              {generating ? "Finding your archetype..." : "Find Your Archetype"}
            </h2>
            <p className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
              {generating ? "Analyzing your responses" : `Question ${step + 1} of ${ASSESSMENT_QUESTIONS.length}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 cursor-pointer text-ce-text-quaternary hover:text-ce-text-tertiary"><X className="w-4 h-4" /></button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-5 pt-3">
          {ASSESSMENT_QUESTIONS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "var(--ce-role-edgestar)" }}
                animate={{ width: i < step ? "100%" : i === step ? (generating ? "100%" : "50%") : "0%" }} />
            </div>
          ))}
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="px-5 py-4 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 16rem)", minHeight: 240 }}>
          {/* Sophia intro */}
          <div className="flex gap-2.5">
            <SophiaMark size={14} />
            <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              5 quick questions to find your career archetype. Just pick what feels right — there are no wrong answers.
            </p>
          </div>

          {ASSESSMENT_QUESTIONS.map((q, i) => {
            if (i > step) return null;
            const answer = answers[q.id];
            const selectedOpt = q.options.find(o => o.id === answer);
            return (
              <div key={q.id} className="flex flex-col gap-3">
                {/* Sophia question */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
                    <span className="text-[9px] text-ce-text-quaternary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{q.category.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-ce-text-quaternary uppercase tracking-wider block mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{q.category}</span>
                    <p className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{q.question}</p>
                  </div>
                </motion.div>

                {/* Options (before answer) */}
                {!answer && i === step && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 gap-2 ml-7">
                    {q.options.map(opt => (
                      <button key={opt.id} onClick={() => handleSelect(q.id, opt.id)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-150"
                        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(var(--ce-role-edgestar-rgb),0.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.06)"; }}
                      >
                        <opt.icon className="w-3.5 h-3.5 text-ce-text-tertiary flex-shrink-0" />
                        <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* User answer */}
                {selectedOpt && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
                      <selectedOpt.icon className="w-3 h-3 text-ce-text-tertiary" />
                      <span className="text-[11px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{selectedOpt.label}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-center">
              <SophiaMark size={12} glowing />
              <div className="flex gap-1">{[0,1,2].map(i => <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ce-text-quaternary)" }} animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />)}</div>
            </motion.div>
          )}

          {/* Generating */}
          {generating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-6 gap-3">
              <motion.div className="w-10 h-10 rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--ce-role-edgestar)" }}
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
              <p className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Mapping your archetype...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Surface ───────────────────────────────────────────────────

export function CareerDiscovery() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = (roleParam || "edgestar") as "edgestar";

  const [search, setSearch] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<Set<IndustryId>>(new Set());
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [sortBy, setSortBy] = useState<"growth" | "salary" | "match">("growth");
  const [showAssessment, setShowAssessment] = useState(false);
  const { result: archetypeResult, save: saveArchetype, reset: resetArchetype } = useArchetypeResult();

  const onNavigate = useCallback((target: string) => {
    const paths: Record<string, string> = {
      home: `/${role}`, synthesis: `/${role}`, edgepath: `/${role}/edgepath`,
      resume: `/${role}/resume`, jobs: `/${role}/jobs`, messages: `/${role}/messages`,
      sessions: `/${role}/sessions`, analytics: `/${role}/analytics`,
      immigration: `/${role}/immigration`, careers: `/${role}/careers`, landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  }, [role, navigate]);

  const toggleIndustry = (id: IndustryId) => {
    setSelectedIndustries(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // Filter + sort
  const matchScores = useMemo(() => {
    if (!archetypeResult) return new Map<string, number>();
    const m = new Map<string, number>();
    CAREERS.forEach(c => m.set(c.id, getMatchScore(c, archetypeResult.archetype)));
    return m;
  }, [archetypeResult]);

  const filtered = useMemo(() => {
    let list = CAREERS.filter(c => {
      if (selectedIndustries.size > 0 && !selectedIndustries.has(c.industry)) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
    if (sortBy === "salary") list.sort((a, b) => b.salaryAvg - a.salaryAvg);
    else if (sortBy === "growth") list.sort((a, b) => b.growth - a.growth);
    else if (sortBy === "match" && archetypeResult) list.sort((a, b) => (matchScores.get(b.id) || 0) - (matchScores.get(a.id) || 0));
    return list;
  }, [search, selectedIndustries, sortBy, archetypeResult, matchScores]);

  const handleAssessmentComplete = useCallback((result: { archetype: Archetype; scores: Record<Archetype, number> }) => {
    saveArchetype(result);
    setShowAssessment(false);
    setSortBy("match");
  }, [saveArchetype]);

  const sophiaOverride = archetypeResult
    ? { message: `Your archetype is ${archetypeResult.archetype}. The grid is sorted by match %.`, chips: [{ label: "Build a roadmap", action: "edgepath" as const }, { label: "See matching jobs", action: "jobs" as const }] }
    : { message: "Browse 30+ careers or take the 5-question assessment to find your archetype.", chips: [{ label: "Start assessment", action: "ask" as const }] };

  return (
    <RoleShell role={role} userName="Sharon" userInitial="S" edgeGas={45} onNavigate={onNavigate} sophiaOverride={sophiaOverride} noPadding>
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Career Discovery</h1>
            <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
              {filtered.length} careers across {INDUSTRIES.length} industries
              {archetypeResult && <span> · Archetype: <span style={{ color: "var(--ce-role-edgestar)" }}>{archetypeResult.archetype}</span></span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!archetypeResult ? (
              <button onClick={() => setShowAssessment(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                <Sparkles className="w-3.5 h-3.5" /> Find your archetype
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
                <Star className="w-3.5 h-3.5" style={{ color: "var(--ce-role-edgestar)" }} />
                <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{archetypeResult.archetype}</span>
                <button onClick={() => { resetArchetype(); setSortBy("growth"); }} className="text-[10px] text-ce-text-quaternary hover:text-ce-text-tertiary cursor-pointer ml-1">Retake</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          {/* LEFT — Filters */}
          <div className="w-[200px] flex-shrink-0 flex flex-col gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
              <Search className="w-3.5 h-3.5 text-ce-text-quaternary" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search careers..." className="flex-1 bg-transparent outline-none text-[12px] text-ce-text-primary placeholder:text-ce-text-quaternary" style={{ fontFamily: "var(--font-body)" }} />
            </div>

            {/* Sort */}
            <div>
              <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sort by</span>
              <div className="flex flex-col gap-1">
                {([["growth", "Growth %"], ["salary", "Salary"], ...(archetypeResult ? [["match", "Match %"]] : [])] as [string, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setSortBy(key as any)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors text-left"
                    style={{ background: sortBy === key ? "rgba(var(--ce-role-edgestar-rgb),0.04)" : "transparent", color: sortBy === key ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
                    {sortBy === key && <Check className="w-3 h-3" />} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Industries</span>
              <div className="flex flex-col gap-1">
                {INDUSTRIES.map(ind => {
                  const active = selectedIndustries.has(ind.id);
                  const count = CAREERS.filter(c => c.industry === ind.id).length;
                  return (
                    <button key={ind.id} onClick={() => toggleIndustry(ind.id)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors text-left"
                      style={{ background: active ? "rgba(var(--ce-role-edgestar-rgb),0.04)" : "transparent", color: active ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
                      <ind.icon className="w-3 h-3 flex-shrink-0" />
                      <span className="flex-1">{ind.label}</span>
                      <span className="text-[9px] text-ce-text-quaternary">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sophia CTA */}
            <div className="mt-2 p-3 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
              <div className="flex items-center gap-2 mb-2">
                <SophiaMark size={14} />
                <span className="text-[11px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Not sure?</span>
              </div>
              <p className="text-[10px] text-ce-text-tertiary leading-relaxed mb-2" style={{ fontFamily: "var(--font-body)" }}>Take a 2-minute assessment to find careers that match your strengths.</p>
              <button onClick={() => setShowAssessment(true)} className="text-[10px] text-[var(--ce-role-edgestar)] cursor-pointer" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Start assessment →
              </button>
            </div>
          </div>

          {/* CENTER — Career Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              {filtered.map((career, i) => (
                <motion.div key={career.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <CareerCard
                    career={career}
                    selected={selectedCareer?.id === career.id}
                    onClick={() => setSelectedCareer(career)}
                    matchScore={archetypeResult ? matchScores.get(career.id) : undefined}
                  />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>No careers match your filters.</p>
                  <button onClick={() => { setSearch(""); setSelectedIndustries(new Set()); }} className="text-[12px] text-[var(--ce-role-edgestar)] mt-2 cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Clear filters</button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Detail Panel */}
          <div className="w-[320px] flex-shrink-0">
            <AnimatePresence mode="wait">
              {selectedCareer ? (
                <DetailPanel key={selectedCareer.id} career={selectedCareer} onClose={() => setSelectedCareer(null)} onNavigate={onNavigate} matchScore={archetypeResult ? matchScores.get(selectedCareer.id) : undefined} />
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <Compass className="w-8 h-8 text-ce-text-quaternary mb-3" />
                  <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Select a career to see details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      <AnimatePresence>
        {showAssessment && <AssessmentFlow onComplete={handleAssessmentComplete} onClose={() => setShowAssessment(false)} />}
      </AnimatePresence>
    </RoleShell>
  );
}
