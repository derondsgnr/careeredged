/**
 * H1 — "The World Opens Up"
 * 
 * Spatial canvas. Sophia appears at center. Questions answered → canvas expands.
 * Generating state: dots migrate to card positions → morph into card outlines → fill.
 * This transition is the core differentiator.
 * 
 * KEY MOTION DECISIONS:
 * - Mark entrance: spring (stiffness 200, damping 20), slight overshoot
 * - Tagline: 600ms AFTER mark settles, not simultaneously
 * - Card selection: lime pulse on selected, others fade to 40% + translate down 4px
 * - Generating: full-viewport overlay. Previous UI blurs. Dots migrate along curved
 *   paths to 4 card positions. Clusters form → ghost rectangles → fill with content.
 *   This is seamless — generating and roadmap are ONE continuous motion.
 * - Signup: blobs slow, roadmap blurs, signup card is the ONLY sharp element.
 * - Background: topographic contour lines (procedural SVG), very low opacity
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  ArrowRight, ArrowLeft, Check, Sparkles, User, Briefcase, Building2,
  Target, BookOpen, Compass, Zap, TrendingUp, Award, FileText, Users,
  MessageSquare, Calendar, Search, Rocket, Shield, Lightbulb, BarChart3,
  ChevronDown, ChevronRight, RefreshCw, RotateCcw,
} from "lucide-react";
import topoSvgPaths from "../../imports/svg-3bufurt997";
import { EditAnswersPanel } from "./edit-answers-panel";

type Step = "intro" | "intent" | "sub" | "target" | "level" | "generating" | "roadmap" | "signup";

interface Option { id: string; label: string; sub?: string; icon: React.ReactNode; }

const INTENTS: Option[] = [
  { id: "career", label: "I'm building my career", sub: "Job seeking, career change, skill development", icon: <User className="w-4 h-4" /> },
  { id: "someone", label: "I'm guiding someone else", sub: "My child, my students, my clients", icon: <Briefcase className="w-4 h-4" /> },
  { id: "org", label: "I represent an organization", sub: "Hiring, education, workforce development", icon: <Building2 className="w-4 h-4" /> },
];

const SUBS: Record<string, Option[]> = {
  career: [
    { id: "edgestar", label: "Looking for opportunities", sub: "Jobs, internships, transitions", icon: <Search className="w-4 h-4" /> },
    { id: "edgepreneur", label: "Building a business", sub: "Startup, freelance, entrepreneurship", icon: <Rocket className="w-4 h-4" /> },
  ],
  someone: [
    { id: "parent", label: "My child or family member", sub: "Parent, guardian, supporter", icon: <Shield className="w-4 h-4" /> },
    { id: "guide", label: "My clients or mentees", sub: "Coach, mentor, advisor", icon: <Lightbulb className="w-4 h-4" /> },
  ],
  org: [
    { id: "employer", label: "We're hiring talent", sub: "Recruit, pipeline, analytics", icon: <Users className="w-4 h-4" /> },
    { id: "edu", label: "Educational institution", sub: "Career services, outcomes", icon: <BookOpen className="w-4 h-4" /> },
    { id: "ngo", label: "Non-profit or NGO", sub: "Community, workforce dev", icon: <Target className="w-4 h-4" /> },
    { id: "agency", label: "Government agency", sub: "Workforce programs, grants", icon: <BarChart3 className="w-4 h-4" /> },
  ],
};

const TARGETS: Option[] = [
  { id: "design", label: "Product Design", icon: <Compass className="w-3.5 h-3.5" /> },
  { id: "eng", label: "Software Engineering", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "data", label: "Data Science", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "pm", label: "Product Management", icon: <Target className="w-3.5 h-3.5" /> },
  { id: "mktg", label: "Marketing", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "fin", label: "Finance", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "health", label: "Healthcare", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "edu", label: "Education", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "other", label: "Something else", icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const LEVELS: Option[] = [
  { id: "exploring", label: "Just exploring", sub: "Not sure yet", icon: <Compass className="w-4 h-4" /> },
  { id: "student", label: "Student", sub: "Currently in school", icon: <BookOpen className="w-4 h-4" /> },
  { id: "early", label: "Early career", sub: "0–2 years", icon: <Zap className="w-4 h-4" /> },
  { id: "mid", label: "Mid career", sub: "3–7 years", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "senior", label: "Senior", sub: "8+ years", icon: <Award className="w-4 h-4" /> },
  { id: "change", label: "Career changer", sub: "Transitioning fields", icon: <Rocket className="w-4 h-4" /> },
];

// ─── Path-specific questions for each sub-intent ────────────────────────────

interface PathQ {
  targetQ: string;
  targetOpts: Option[];
  levelQ: string;
  levelOpts: Option[];
}

const PATH_QS: Record<string, PathQ> = {
  edgestar: { targetQ: "What field are you targeting?", targetOpts: TARGETS, levelQ: "Where are you in your journey?", levelOpts: LEVELS },
  edgepreneur: {
    targetQ: "What stage is your business in?",
    targetOpts: [
      { id: "idea", label: "Just an idea", sub: "Validating the concept", icon: <Lightbulb className="w-3.5 h-3.5" /> },
      { id: "mvp", label: "Building an MVP", sub: "First version", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "launched", label: "Already launched", sub: "Looking to grow", icon: <Zap className="w-3.5 h-3.5" /> },
      { id: "scaling", label: "Scaling up", sub: "Ready to expand", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What industry?",
    levelOpts: [
      { id: "tech", label: "Tech / SaaS", icon: <Zap className="w-4 h-4" /> },
      { id: "health", label: "Health & Wellness", icon: <Shield className="w-4 h-4" /> },
      { id: "creative", label: "Creative & Media", icon: <Sparkles className="w-4 h-4" /> },
      { id: "retail", label: "Retail & E-commerce", icon: <Briefcase className="w-4 h-4" /> },
      { id: "services", label: "Professional Services", icon: <Users className="w-4 h-4" /> },
      { id: "other_biz", label: "Something else", icon: <Compass className="w-4 h-4" /> },
    ],
  },
  parent: {
    targetQ: "Who are you supporting?",
    targetOpts: [
      { id: "highschool", label: "High school student", sub: "College-bound", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "college", label: "College student", sub: "Career-bound", icon: <Award className="w-3.5 h-3.5" /> },
      { id: "postgrad", label: "Recent graduate", sub: "Job searching", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "adult", label: "Adult family member", sub: "Career transition", icon: <User className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What kind of support?",
    levelOpts: [
      { id: "explore", label: "Help them explore", sub: "Options and directions", icon: <Compass className="w-4 h-4" /> },
      { id: "resume", label: "Resume & applications", sub: "Practical help", icon: <FileText className="w-4 h-4" /> },
      { id: "interview", label: "Interview prep", sub: "Practice and feedback", icon: <MessageSquare className="w-4 h-4" /> },
      { id: "plan", label: "Full career plan", sub: "End-to-end support", icon: <Target className="w-4 h-4" /> },
    ],
  },
  guide: {
    targetQ: "What's your role?",
    targetOpts: [
      { id: "counselor", label: "School counselor", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "coach", label: "Career coach", icon: <Target className="w-3.5 h-3.5" /> },
      { id: "mentor", label: "Mentor", icon: <Lightbulb className="w-3.5 h-3.5" /> },
      { id: "advisor", label: "Academic advisor", icon: <Award className="w-3.5 h-3.5" /> },
    ],
    levelQ: "How many people?",
    levelOpts: [
      { id: "few", label: "1–5 individuals", icon: <User className="w-4 h-4" /> },
      { id: "group", label: "6–25 people", icon: <Users className="w-4 h-4" /> },
      { id: "program", label: "26–100 in a program", icon: <BarChart3 className="w-4 h-4" /> },
      { id: "large", label: "100+", icon: <Building2 className="w-4 h-4" /> },
    ],
  },
  employer: {
    targetQ: "Biggest hiring challenge?",
    targetOpts: [
      { id: "finding", label: "Finding candidates", icon: <Search className="w-3.5 h-3.5" /> },
      { id: "retention", label: "Retention", icon: <Shield className="w-3.5 h-3.5" /> },
      { id: "pipeline", label: "Talent pipeline", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: "diversity", label: "Diversity & inclusion", icon: <Users className="w-3.5 h-3.5" /> },
    ],
    levelQ: "Organization size?",
    levelOpts: [
      { id: "startup", label: "1–50 employees", icon: <Rocket className="w-4 h-4" /> },
      { id: "mid", label: "51–500", icon: <Building2 className="w-4 h-4" /> },
      { id: "enterprise", label: "500+", icon: <Briefcase className="w-4 h-4" /> },
      { id: "franchise", label: "Multi-location", icon: <Target className="w-4 h-4" /> },
    ],
  },
  edu: {
    targetQ: "What type of institution?",
    targetOpts: [
      { id: "k12", label: "K-12 school", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "community", label: "Community college", icon: <Building2 className="w-3.5 h-3.5" /> },
      { id: "university", label: "University", icon: <Award className="w-3.5 h-3.5" /> },
      { id: "bootcamp", label: "Bootcamp / Training", icon: <Zap className="w-3.5 h-3.5" /> },
    ],
    levelQ: "Primary goal?",
    levelOpts: [
      { id: "outcomes", label: "Student outcomes", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "placement", label: "Job placement", icon: <Target className="w-4 h-4" /> },
      { id: "curriculum", label: "Curriculum alignment", icon: <BookOpen className="w-4 h-4" /> },
      { id: "tracking", label: "Readiness tracking", icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  ngo: {
    targetQ: "Program focus?",
    targetOpts: [
      { id: "workforce", label: "Workforce development", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { id: "youth", label: "Youth employment", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "reentry", label: "Reentry programs", icon: <Shield className="w-3.5 h-3.5" /> },
      { id: "refugee", label: "Refugee resettlement", icon: <Compass className="w-3.5 h-3.5" /> },
    ],
    levelQ: "Operating scale?",
    levelOpts: [
      { id: "local", label: "Local community", icon: <Target className="w-4 h-4" /> },
      { id: "regional", label: "Regional", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "statewide", label: "Statewide", icon: <BarChart3 className="w-4 h-4" /> },
      { id: "national", label: "National", icon: <Award className="w-4 h-4" /> },
    ],
  },
  agency: {
    targetQ: "What initiative?",
    targetOpts: [
      { id: "wfdev", label: "Workforce development", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { id: "economic", label: "Economic development", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: "edreform", label: "Education reform", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "veterans", label: "Veteran services", icon: <Shield className="w-3.5 h-3.5" /> },
    ],
    levelQ: "Government level?",
    levelOpts: [
      { id: "city", label: "City / Municipal", icon: <Building2 className="w-4 h-4" /> },
      { id: "county", label: "County", icon: <Target className="w-4 h-4" /> },
      { id: "state", label: "State", icon: <BarChart3 className="w-4 h-4" /> },
      { id: "federal", label: "Federal", icon: <Award className="w-4 h-4" /> },
    ],
  },
};

interface Phase {
  id: number; title: string; duration: string; status: "active" | "upcoming";
  items: { text: string; icon: React.ReactNode }[];
  paths?: { id: string; title: string; recommended?: boolean }[];
  sophiaInsight?: string;
}

function makePhases(t: string): Phase[] {
  const tl = TARGETS.find(x => x.id === t)?.label || "your field";
  return [
    { id: 1, title: "Discover & Position", duration: "Weeks 1–3", status: "active", items: [
      { text: "Skills assessment", icon: <Compass className="w-3 h-3" /> },
      { text: `${tl} landscape research`, icon: <Search className="w-3 h-3" /> },
      { text: "Resume optimization", icon: <FileText className="w-3 h-3" /> },
      { text: "Target company mapping", icon: <Target className="w-3 h-3" /> },
    ], paths: [{ id: "portfolio", title: "Portfolio-first", recommended: true }, { id: "network", title: "Network-first" }],
    sophiaInsight: "Start here — your resume is the highest-leverage move right now." },
    { id: 2, title: "Build & Connect", duration: "Weeks 4–8", status: "upcoming", items: [
      { text: "Portfolio development", icon: <Zap className="w-3 h-3" /> },
      { text: "5 industry connections", icon: <Users className="w-3 h-3" /> },
      { text: "Mentor matching", icon: <MessageSquare className="w-3 h-3" /> },
    ], paths: [{ id: "depth", title: "Go deep" }, { id: "breadth", title: "Go wide", recommended: true }] },
    { id: 3, title: "Apply & Interview", duration: "Weeks 9–14", status: "upcoming", items: [
      { text: "10 targeted applications", icon: <Rocket className="w-3 h-3" /> },
      { text: "Mock interviews with Sophia", icon: <Sparkles className="w-3 h-3" /> },
      { text: "Negotiation prep", icon: <Shield className="w-3 h-3" /> },
    ] },
    { id: 4, title: "Launch & Grow", duration: "Weeks 15–20", status: "upcoming", items: [
      { text: "Offer evaluation", icon: <Award className="w-3 h-3" /> },
      { text: "First 90-day plan", icon: <Calendar className="w-3 h-3" /> },
      { text: "Growth milestones", icon: <TrendingUp className="w-3 h-3" /> },
    ] },
  ];
}

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Topographic Background ────────────────────────────────────────────────

function TopoBackground({ intensity }: { intensity: "normal" | "deep" | "dim" }) {
  // Real topographic contour paths from the Figma design file
  const topoPaths = [
    { d: topoSvgPaths.p338f9380, color: "#22D3EE" },
    { d: topoSvgPaths.p36a4b5b0, color: "#042C01" },
    { d: topoSvgPaths.p7035a40, color: "#042C01" },
    { d: topoSvgPaths.p3983ca60, color: "#22D3EE" },
    { d: topoSvgPaths.p1be07340, color: "#042C01" },
    { d: topoSvgPaths.p21888e60, color: "#042C01" },
    { d: topoSvgPaths.p3e16f200, color: "#22D3EE" },
    { d: topoSvgPaths.p9101500, color: "#042C01" },
    { d: topoSvgPaths.p2d0f2fc0, color: "#042C01" },
    { d: topoSvgPaths.p19740c00, color: "#22D3EE" },
    { d: topoSvgPaths.p80b8920, color: "#042C01" },
    { d: topoSvgPaths.p296fb600, color: "#042C01" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Forest green blob — upper-left, 80px blur */}
      <div className="absolute rounded-full"
        style={{
          width: "928px", height: "928px", left: "-239px", top: "-235px",
          background: "radial-gradient(circle, rgba(4,44,1,0.18) 0%, rgba(4,44,1,0.05) 40%, transparent 70%)",
          filter: "blur(80px)",
        }} />

      {/* Cyan blob — lower-right, 90px blur */}
      <div className="absolute rounded-full"
        style={{
          width: "693px", height: "693px", right: "-100px", bottom: "-100px",
          background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)",
          filter: "blur(90px)",
        }} />

      {/* Topographic contour lines from Figma — 2% opacity group */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1099 851" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.02 }}>
        <g>
          {topoPaths.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={p.color} strokeOpacity="0.6" strokeWidth="1.16" />
          ))}
        </g>
      </svg>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.018]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}

// ─── Glass Card ─────────────────────────────────────────────────────────────

function GlassCard({ children, selected, onClick, delay = 0, allSelected }: {
  children: React.ReactNode; selected?: boolean; onClick?: () => void; delay?: number; allSelected?: string | null;
}) {
  // When another card is selected, this card fades and translates
  const isOtherSelected = allSelected !== null && !selected;

  return (
    <motion.div onClick={onClick}
      className={`relative group ${onClick ? "cursor-pointer" : ""}`}
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: isOtherSelected ? 0.4 : 1, y: isOtherSelected ? 4 : 0, scale: 1 }}
      transition={{ duration: 0.4, delay: selected ? 0 : delay, ease: EASE }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      style={{ willChange: "transform, opacity" }}>
      {/* Gradient border */}
      <div className={`absolute -inset-px rounded-2xl transition-opacity duration-300 ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
        style={{ background: selected ? "linear-gradient(135deg, rgba(34,211,238,0.3), rgba(179,255,59,0.15))" : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))", borderRadius: "16px" }} />
      {/* Lime pulse on selection */}
      {selected && (
        <motion.div className="absolute -inset-px rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(179,255,59,0.2), rgba(34,211,238,0.1))", borderRadius: "16px" }}
          initial={{ opacity: 0.4 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
      )}
      <div className={`relative rounded-2xl border transition-all duration-300 ${selected ? "bg-[rgba(34,211,238,0.06)] border-transparent" : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.05)] group-hover:bg-[rgba(255,255,255,0.05)]"}`}
        style={{ boxShadow: selected ? "inset 0 1px 1px rgba(255,255,255,0.06), 0 0 30px rgba(34,211,238,0.04)" : "inset 0 1px 1px rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.2)" }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Generating + Roadmap as ONE continuous overlay ─────────────────────────

function GeneratingAndRoadmapOverlay({ target, phases, onSave, onAdjust }: {
  target: string; phases: Phase[]; onSave: () => void; onAdjust: () => void;
}) {
  const tl = TARGETS.find(x => x.id === target)?.label || "your career";
  const progress = useMotionValue(0);
  const displayPct = useTransform(progress, v => `${Math.round(v)}%`);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [showCta, setShowCta] = useState(false);
  const [expandedUpcoming, setExpandedUpcoming] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = animate(progress, 100, { duration: 5, ease: "easeInOut" });
    const t1 = setTimeout(() => setPhase("reveal"), 5200);
    const t2 = setTimeout(() => setPhase("done"), 6000);
    const t3 = setTimeout(() => setShowCta(true), 7500);
    return () => { ctrl.stop(); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [progress]);

  const statusTexts = [
    `Scanning the ${tl} landscape...`,
    `Mapping ${tl} pathways...`,
    "Identifying growth vectors...",
    "Putting it all together...",
  ];
  const statusIdx = useTransform(progress, [0, 25, 50, 75], [0, 1, 2, 3]);

  // Dot positions
  const cardTargets = useMemo(() => [
    { x: 26, y: 18 }, { x: 74, y: 25 }, { x: 26, y: 60 }, { x: 72, y: 62 }
  ], []);

  const dots = useMemo(() => Array.from({ length: 32 }, (_, i) => ({
    sx: 15 + Math.sin(i * 1.7 + 0.3) * 30 + (i % 5) * 12,
    sy: 10 + Math.cos(i * 1.1 + 0.5) * 25 + (i % 4) * 10,
    tx: cardTargets[i % 4].x + Math.sin(i * 2.3) * 6,
    ty: cardTargets[i % 4].y + Math.cos(i * 1.8) * 4,
    size: 1 + (i % 3) * 0.5,
    group: i % 4,
  })), [cardTargets]);

  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Blur previous UI */}
      <motion.div className="absolute inset-0"
        style={{ backdropFilter: "blur(8px)", background: "rgba(8,9,12,0.4)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE }} />

      <div className="relative z-10 w-full max-w-3xl mx-4 flex flex-col items-center gap-8">
        {/* Loading state */}
        <AnimatePresence>
          {phase === "loading" && (
            <motion.div className="flex flex-col items-center gap-6"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}>
              <SophiaMark size={48} glowing />
              <div className="flex flex-col items-center gap-2">
                <motion.div className="text-[28px] text-[#E8E8ED] tabular-nums"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{displayPct}</motion.div>
                <motion.p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {statusTexts[Math.min(3, Math.floor(progress.get() / 25))]}
                </motion.p>
              </div>

              {/* Constellation dots */}
              <div className="relative w-full max-w-md h-32">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="conn-h1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" /><stop offset="100%" stopColor="#B3FF3B" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  {dots.map((d, i) => {
                    const p = progress.get();
                    const migrating = p > 55;
                    const clustering = p > 80;
                    return (
                      <motion.circle key={i} r={d.size}
                        fill={i % 6 === 0 ? "#B3FF3B" : i % 3 === 0 ? "#22D3EE" : "rgba(255,255,255,0.3)"}
                        animate={{
                          cx: migrating ? d.tx + (clustering ? Math.sin(i) * 1.5 : Math.sin(i) * 5) : d.sx + Math.sin(i * 0.8) * 2,
                          cy: migrating ? d.ty + (clustering ? Math.cos(i) * 1.5 : Math.cos(i) * 4) : d.sy + Math.cos(i * 0.8) * 1.5,
                          opacity: migrating ? 0.7 : 0.2,
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }} />
                    );
                  })}
                  {/* Connection curves form late */}
                  {progress.get() > 75 && [[0, 1], [1, 3], [0, 2]].map(([a, b], i) => (
                    <motion.path key={`c${i}`}
                      d={`M ${cardTargets[a].x} ${cardTargets[a].y} Q ${(cardTargets[a].x + cardTargets[b].x) / 2 + (i === 0 ? 0 : i === 1 ? 5 : -5)} ${(cardTargets[a].y + cardTargets[b].y) / 2 + (i === 0 ? -6 : 4)} ${cardTargets[b].x} ${cardTargets[b].y}`}
                      stroke="url(#conn-h1)" strokeWidth="0.3" fill="none"
                      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.4 }}
                      transition={{ duration: 1, delay: i * 0.2 }} />
                  ))}
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap reveal */}
        {(phase === "reveal" || phase === "done") && (
          <motion.div className="w-full flex flex-col items-center gap-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EASE }}>
            <div className="flex flex-col items-center gap-3">
              <SophiaMark size={36} glowing />
              <motion.p className="text-[#9CA3AF] text-center max-w-md" style={{ fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: EASE }}>
                Here's your roadmap. I've organized it by what matters most right now.
              </motion.p>
            </div>

            {/* Spatial roadmap */}
            <div className="relative w-full" style={{ height: "540px" }}>
              {/* Connection SVGs */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="road-conn" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" /><stop offset="50%" stopColor="#B3FF3B" stopOpacity="0.2" /><stop offset="100%" stopColor="#22D3EE" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="road-glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {[[370, 110, 420, 90, 430, 75, 480, 85], [520, 200, 480, 270, 350, 290, 280, 300], [330, 390, 380, 400, 420, 385, 460, 370]].map((c, i) => (
                  <motion.path key={i} d={`M ${c[0]} ${c[1]} C ${c[2]} ${c[3]}, ${c[4]} ${c[5]}, ${c[6]} ${c[7]}`}
                    stroke="url(#road-conn)" strokeWidth="1.5" fill="none" filter="url(#road-glow)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 + i * 0.3, ease: EASE }} />
                ))}
              </svg>

              {/* Phase cards */}
              {phases.map((p, i) => {
                const layouts = [
                  { left: "0%", top: "0%", width: "48%", scale: 1, z: 4 },
                  { left: "52%", top: "0%", width: "46%", scale: 0.92, z: 3 },
                  { left: "0%", top: "55%", width: "46%", scale: 0.88, z: 2 },
                  { left: "50%", top: "55%", width: "48%", scale: 0.85, z: 1 },
                ];
                const l = layouts[i];
                const isActive = p.status === "active";
                const isExpanded = expandedUpcoming === p.id;

                return (
                  <motion.div key={p.id} className="absolute" style={{ left: l.left, top: l.top, width: l.width, zIndex: l.z }}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: l.scale, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.18, ease: EASE }}>
                    <div className={`relative rounded-2xl ${isActive ? "p-px" : ""}`}
                      style={isActive ? { background: "linear-gradient(135deg, rgba(34,211,238,0.35), rgba(179,255,59,0.2), rgba(34,211,238,0.1))" } : {}}>
                      <div className={`rounded-2xl p-5 ${isActive ? "" : ""}`}
                        style={{
                          background: isActive ? "linear-gradient(135deg, rgba(4,44,1,0.2) 0%, rgba(12,14,19,0.95) 50%, rgba(34,211,238,0.03) 100%)" : "rgba(255,255,255,0.025)",
                          border: isActive ? "none" : "1px solid rgba(255,255,255,0.06)",
                          boxShadow: isActive ? "inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(34,211,238,0.04)" : "inset 0 1px 1px rgba(255,255,255,0.02), 0 2px 12px rgba(0,0,0,0.3)",
                          backdropFilter: "blur(20px)",
                        }}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              {isActive && <motion.div className="absolute -inset-1.5 rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.3), transparent)" }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />}
                              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-[#22D3EE]" : "bg-[#374151]"}`} style={isActive ? { boxShadow: "0 0 10px rgba(34,211,238,0.5)" } : {}} />
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-[0.08em] ${isActive ? "bg-[rgba(34,211,238,0.08)] text-[#22D3EE]" : "bg-[rgba(255,255,255,0.03)] text-[#6B7280]"}`} style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                              {isActive && <Sparkles className="w-2.5 h-2.5" />}Phase {p.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{p.duration}</span>
                            {isActive && <span className="inline-flex items-center gap-1 text-[11px] text-[#22D3EE] cursor-pointer">Begin <ChevronRight className="w-3 h-3" /></span>}
                          </div>
                        </div>

                        <h3 className={`mb-3 ${isActive ? "text-[#E8E8ED]" : "text-[#9CA3AF]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: isActive ? "17px" : "15px" }}>{p.title}</h3>

                        {isActive && (
                          <>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {p.items.map((item, mi) => (
                                <span key={mi} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] ${mi === 0 ? "bg-[rgba(34,211,238,0.08)] text-[#E8E8ED] border border-[rgba(34,211,238,0.12)]" : "bg-[rgba(255,255,255,0.025)] text-[#6B7280] border border-[rgba(255,255,255,0.04)]"}`} style={{ fontFamily: "var(--font-body)" }}>
                                  <span className={mi === 0 ? "text-[#22D3EE]" : "text-[#374151]"}>{item.icon}</span>{item.text}
                                </span>
                              ))}
                            </div>
                            {p.paths && (
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] text-[#374151] uppercase tracking-wider">Paths:</span>
                                {p.paths.map(pt => (
                                  <span key={pt.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${pt.recommended ? "bg-[rgba(34,211,238,0.08)] text-[#22D3EE] border border-[rgba(34,211,238,0.1)]" : "bg-[rgba(255,255,255,0.02)] text-[#6B7280] border border-[rgba(255,255,255,0.03)]"}`}>
                                    {pt.recommended && <Sparkles className="w-2.5 h-2.5" />}{pt.title}
                                  </span>
                                ))}
                              </div>
                            )}
                            {p.sophiaInsight && (
                              <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.06)" }}>
                                <Sparkles className="w-3 h-3 text-[#22D3EE] flex-shrink-0 mt-0.5" />
                                <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{p.sophiaInsight}</span>
                              </div>
                            )}
                          </>
                        )}

                        {!isActive && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#374151]">{p.items.length} milestones{p.paths && ` · ${p.paths.length} paths`}</span>
                            <button onClick={() => setExpandedUpcoming(isExpanded ? null : p.id)} className="text-[#374151] hover:text-[#6B7280] cursor-pointer transition-colors">
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-3.5 h-3.5" /></motion.div>
                            </button>
                          </div>
                        )}
                        <AnimatePresence>
                          {!isActive && isExpanded && (
                            <motion.div className="flex flex-wrap gap-1.5 mt-3" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                              {p.items.map((item, mi) => (
                                <span key={mi} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] bg-[rgba(255,255,255,0.02)] text-[#6B7280] border border-[rgba(255,255,255,0.03)]">
                                  <span className="text-[#374151]">{item.icon}</span>{item.text}
                                </span>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTAs */}
            <AnimatePresence>
              {showCta && (
                <motion.div className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                  <motion.button onClick={onSave} className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C", boxShadow: "0 0 30px rgba(34,211,238,0.15), 0 4px 12px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.97 }}>
                    <Sparkles className="w-4 h-4" /> Save my roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                  <button className="flex items-center gap-2 px-5 py-3.5 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#E8E8ED] transition-colors text-[14px]"
                    style={{ fontFamily: "var(--font-body)" }}>
                    Tell me more
                  </button>
                  <div className="flex items-center gap-5 mt-1">
                    <button className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RefreshCw className="w-3.5 h-3.5" /> Not quite right?</button>
                    <button onClick={onAdjust} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RotateCcw className="w-3.5 h-3.5" /> Adjust my answers</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Signup Overlay ─────────────────────────────────────────────────────────

function SignupOverlay({ onDismiss, onComplete }: { onDismiss: () => void; onComplete?: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <motion.div className="absolute inset-0" style={{ backdropFilter: "blur(12px)", background: "rgba(8,9,12,0.6)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.div className="relative z-10 w-full max-w-sm mx-4"
        initial={{ y: 50, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 24, delay: 0.2 }}>
        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.25), rgba(179,255,59,0.15), rgba(34,211,238,0.08))" }}>
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "linear-gradient(135deg, rgba(4,44,1,0.1) 0%, rgba(12,14,19,0.98) 30%)", boxShadow: "0 8px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <SophiaMark size={28} glowing />
              <div>
                <div className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>This map is yours.</div>
                <div className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Sign in to keep it.</div>
              </div>
            </div>
            <button onClick={() => onComplete?.()} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-[#1a1a1a] hover:bg-white/90 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" /><span className="text-[11px] text-[#6B7280]">or</span><div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" /></div>
            <input type="email" placeholder="Where should I send this?" className="w-full px-4 py-3 rounded-xl border border-[rgba(255,255,255,0.06)] text-[#E8E8ED] placeholder:text-[#6B7280] focus:outline-none focus:border-[rgba(34,211,238,0.3)] transition-colors" style={{ background: "rgba(255,255,255,0.03)", fontFamily: "var(--font-body)", fontSize: "14px" }} />
            <button onClick={() => onComplete?.()} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer" style={{ background: "linear-gradient(135deg, #B3FF3B, #22D3EE)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C" }}>
              <Sparkles className="w-4 h-4" /> Save my roadmap
            </button>
            <p className="text-[11px] text-[#6B7280] text-center">Free. No catch.</p>
            <button onClick={onDismiss} className="text-[12px] text-[#374151] hover:text-[#6B7280] transition-colors cursor-pointer text-center" style={{ fontFamily: "var(--font-body)" }}>Maybe later</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function OnboardingH1({ onComplete }: { onComplete?: (role?: string) => void } = {}) {
  const [step, setStep] = useState<Step>("intro");
  const [intent, setIntent] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupDismissed, setSignupDismissed] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const hist = useRef<Step[]>([]);

  const go = useCallback((next: Step) => { setStep(prev => { hist.current.push(prev); return next; }); }, []);
  const back = useCallback(() => {
    const prev = hist.current.pop();
    if (!prev) return;
    if (prev === "intent") { setIntent(null); setSub(null); setTarget(null); setLevel(null); }
    else if (prev === "sub") { setSub(null); setTarget(null); setLevel(null); }
    else if (prev === "target") { setTarget(null); setLevel(null); }
    else if (prev === "level") { setLevel(null); }
    setStep(prev);
  }, []);

  const pathQ = sub ? PATH_QS[sub] : null;
  const canBack = !["intro", "intent", "generating", "roadmap"].includes(step);
  const isOverlay = step === "generating" || step === "roadmap";

  useEffect(() => { if (step === "intro") { const t = setTimeout(() => go("intent"), 2600); return () => clearTimeout(t); } }, [step, go]);

  const sophia = (s: Step) => {
    switch (s) {
      case "intent": return "What brings you to CareerEdge?";
      case "sub": return intent === "career" ? "What kind of edge are you looking for?" : intent === "someone" ? "Who are you supporting?" : "Tell me about your organization.";
      case "target": return pathQ?.targetQ || "What field are you aiming for?";
      case "level": return pathQ?.levelQ || "Where are you in your journey?";
      default: return "";
    }
  };

  const handleEditChange = useCallback((field: "intent" | "sub" | "target" | "level", value: string) => {
    if (field === "intent") { setIntent(value); setSub(null); setTarget(null); setLevel(null); }
    else if (field === "sub") { setSub(value); setTarget(null); setLevel(null); }
    else if (field === "target") { setTarget(value); }
    else if (field === "level") { setLevel(value); }
  }, []);

  const phases = target ? makePhases(target) : [];
  const bgIntensity = isOverlay ? "deep" : step === "intro" ? "normal" : "normal";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#08090C" }}>
      <TopoBackground intensity={bgIntensity} />

      <AnimatePresence>
        {canBack && (
          <motion.button onClick={back} className="absolute top-6 left-6 z-30 flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} whileTap={{ scale: 0.95 }} style={{ fontFamily: "var(--font-body)" }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div key="intro" className="flex flex-col items-center gap-8" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}>
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <SophiaMark size={100} glowing />
              </motion.div>
              <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5, ease: EASE }}>
                <h1 className="text-[#E8E8ED] text-center" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "32px" }}>
                  Your world is about to<br /><span style={{ color: "#B3FF3B" }}>open up.</span>
                </h1>
              </motion.div>
            </motion.div>
          )}

          {step === "intent" && (
            <motion.div key="intent" className="flex flex-col items-center gap-10 w-full max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}>
              <motion.div className="flex flex-col items-center gap-4" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <SophiaMark size={40} glowing={false} />
                <motion.p className="text-[#9CA3AF] text-center max-w-md" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: EASE }} style={{ fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{sophia("intent")}</motion.p>
              </motion.div>
              <div className="grid gap-3 w-full">
                {INTENTS.map((o, i) => (
                  <GlassCard key={o.id} selected={intent === o.id} allSelected={intent} onClick={() => { setIntent(o.id); setTimeout(() => go("sub"), 500); }} delay={0.5 + i * 0.12}>
                    <div className="flex items-center gap-4 p-5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${intent === o.id ? "bg-[rgba(34,211,238,0.1)] text-[#22D3EE]" : "bg-[rgba(255,255,255,0.04)] text-[#6B7280] group-hover:text-[#9CA3AF]"}`}>{o.icon}</div>
                      <div><div className="text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{o.label}</div><div className="text-[13px] text-[#6B7280] mt-0.5">{o.sub}</div></div>
                      {intent === o.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="ml-auto w-5 h-5 rounded-full bg-[#22D3EE] flex items-center justify-center"><Check className="w-3 h-3 text-[#08090C]" /></motion.div>}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {step === "sub" && intent && (
            <motion.div key="sub" className="flex flex-col items-center gap-10 w-full max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}>
              <div className="flex flex-col items-center gap-4">
                <SophiaMark size={40} glowing={false} />
                <motion.p className="text-[#9CA3AF] text-center max-w-md" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: EASE }} style={{ fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{sophia("sub")}</motion.p>
              </div>
              <div className="grid gap-3 w-full">
                {SUBS[intent]?.map((o, i) => (
                  <GlassCard key={o.id} selected={sub === o.id} allSelected={sub} onClick={() => { setSub(o.id); setTimeout(() => go("target"), 500); }} delay={0.5 + i * 0.1}>
                    <div className="flex items-center gap-4 p-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${sub === o.id ? "bg-[rgba(34,211,238,0.1)] text-[#22D3EE]" : "bg-[rgba(255,255,255,0.04)] text-[#6B7280]"}`}>{o.icon}</div>
                      <div><div className="text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{o.label}</div><div className="text-[12px] text-[#6B7280] mt-0.5">{o.sub}</div></div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {step === "target" && (
            <motion.div key="target" className="flex flex-col items-center gap-10 w-full max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}>
              <div className="flex flex-col items-center gap-4">
                <SophiaMark size={40} glowing={false} />
                <motion.p className="text-[#9CA3AF] text-center max-w-md" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: EASE }} style={{ fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{sophia("target")}</motion.p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {(pathQ?.targetOpts || TARGETS).map((o, i) => (
                  <motion.button key={o.id} onClick={() => { setTarget(o.id); setTimeout(() => go("level"), 450); }}
                    className={`flex items-center gap-2.5 pl-3 pr-4 py-3 rounded-xl cursor-pointer border transition-all duration-200 ${target === o.id ? "border-[rgba(179,255,59,0.2)] text-[#E8E8ED]" : "border-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:border-[rgba(255,255,255,0.1)] hover:text-[#E8E8ED]"}`}
                    style={{ background: target === o.id ? "linear-gradient(135deg, rgba(179,255,59,0.08), rgba(34,211,238,0.04))" : "rgba(255,255,255,0.025)", fontFamily: "var(--font-body)", fontSize: "14px", willChange: "transform, opacity" }}
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.35, ease: EASE }}
                    whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                    <span className={target === o.id ? "text-[#B3FF3B]" : "text-[#6B7280]"}>{o.icon}</span>{o.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "level" && (
            <motion.div key="level" className="flex flex-col items-center gap-10 w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}>
              <div className="flex flex-col items-center gap-4">
                <SophiaMark size={40} glowing={false} />
                <motion.p className="text-[#9CA3AF] text-center max-w-md" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4, ease: EASE }} style={{ fontFamily: "var(--font-body)", lineHeight: 1.6 }}>{sophia("level")}</motion.p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {(pathQ?.levelOpts || LEVELS).map((o, i) => (
                  <GlassCard key={o.id} selected={level === o.id} allSelected={level} onClick={() => { setLevel(o.id); setTimeout(() => go("generating"), 450); }} delay={0.5 + i * 0.08}>
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${level === o.id ? "bg-[rgba(34,211,238,0.1)] text-[#22D3EE]" : "bg-[rgba(255,255,255,0.04)] text-[#6B7280]"}`}>{o.icon}</div>
                      <div>
                        <div className={`text-[14px] ${level === o.id ? "text-[#E8E8ED]" : "text-[#9CA3AF]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{o.label}</div>
                        {o.sub && <div className="text-[11px] text-[#6B7280] mt-0.5">{o.sub}</div>}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generating + Roadmap as one continuous overlay */}
      <AnimatePresence>
        {isOverlay && target && (
          <GeneratingAndRoadmapOverlay
            target={target} phases={phases}
            onSave={() => setShowSignup(true)}
            onAdjust={() => setShowEditPanel(true)}
          />
        )}
      </AnimatePresence>

      {/* Edit Answers Panel */}
      <AnimatePresence>
        {showEditPanel && intent && sub && target && level && pathQ && (
          <EditAnswersPanel
            intent={intent}
            sub={sub}
            target={target}
            level={level}
            targetOptions={pathQ.targetOpts}
            levelOptions={pathQ.levelOpts}
            targetLabel={pathQ.targetQ.replace("?", "")}
            levelLabel={pathQ.levelQ.replace("?", "")}
            onClose={() => setShowEditPanel(false)}
            onChange={handleEditChange}
          />
        )}
      </AnimatePresence>

      <motion.div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
        <span className="text-[11px] tracking-[0.2em] text-[#1F2937]" style={{ fontFamily: "var(--font-display)" }}>CAREEREDGE</span>
      </motion.div>

      <AnimatePresence>
        {showSignup && <SignupOverlay onDismiss={() => { setShowSignup(false); setSignupDismissed(true); }} onComplete={() => onComplete?.("edgestar")} />}
      </AnimatePresence>
    </div>
  );
}