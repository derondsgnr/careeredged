/**
 * ImmigrationEdge — Global Career Mobility Surface
 *
 * Helps international professionals understand credential transfer,
 * licensing requirements, skills gaps, and career pathway mapping.
 *
 * States: Empty → Building (Sophia-guided, 2-3 questions) → Active (two-column roadmap)
 * Route: /:role/immigration
 * Roles: EdgeStar (all) + EdgePreneur (non-US)
 *
 * CRITICAL:
 * - User-facing language: "Global Career Mobility" (never "immigration")
 * - Data isolation: credential/visa data NEVER exposed to employer surfaces
 * - Pre-fill: Sophia uses onboarding + ResumeEdge + EdgeMatch data, only asks what's new
 * - Stored in localStorage as `ce-immigration-profile`, isolated from employer access
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { RoleShell } from "../role-shell";
import { SophiaMark } from "../sophia-mark";
import {
  Globe, ArrowRight, Check, ChevronRight, Send, Mic,
  GraduationCap, MapPin, FileCheck, BarChart3, Scale,
  Clock, DollarSign, Sparkles, ExternalLink, Users,
  ArrowLeft, Search, BookOpen,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────

interface CredentialEval {
  credential: string;
  origin: string;
  transferStatus: "full" | "partial" | "requires-eval";
  notes: string;
}

interface LicenseReq {
  license: string;
  required: boolean;
  estimatedTime: string;
  estimatedCost: string;
  steps: string[];
}

interface SkillGap {
  skill: string;
  currentLevel: "none" | "basic" | "intermediate" | "advanced";
  requiredLevel: "basic" | "intermediate" | "advanced" | "expert";
  recommendation: string;
}

interface CountryCompare {
  origin: string;
  destination: string;
  differences: { area: string; origin: string; destination: string }[];
}

interface ImmigrationProfile {
  originCountry: string;
  destinationCountry: string;
  credentials: string[];
  fieldRef: string;
  levelRef: string;
  credentialEvaluation: CredentialEval[];
  licensingRequirements: LicenseReq[];
  skillsGap: SkillGap[];
  countryComparison: CountryCompare;
  estimatedTimeline: string;
  estimatedCost: string;
}

// ─── Hook: useImmigrationProfile ────────────────────────────────────

export function useImmigrationProfile() {
  const [profile, setP] = useState<ImmigrationProfile | null>(() => {
    try { const s = localStorage.getItem("ce-immigration-profile"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const save = (p: ImmigrationProfile) => { setP(p); try { localStorage.setItem("ce-immigration-profile", JSON.stringify(p)); } catch {} };
  const reset = () => { setP(null); try { localStorage.removeItem("ce-immigration-profile"); } catch {} };
  return { profile, save, reset } as const;
}

// ─── Mock: Pre-filled user context (simulates onboarding + ResumeEdge data) ─

const USER_CONTEXT = {
  name: "Sharon",
  targetField: "Product Design",
  careerLevel: "Mid-career",
  yearsExperience: 3.5,
  education: "Bachelor's in Visual Communication",
  savedJobLocations: ["Canada", "United States"],
};

// ─── Mock: Generated roadmap data ───────────────────────────────────

function generateMockRoadmap(origin: string, destination: string, credentials: string[]): Omit<ImmigrationProfile, "originCountry" | "destinationCountry" | "credentials" | "fieldRef" | "levelRef"> {
  return {
    credentialEvaluation: [
      { credential: credentials[0] || "Bachelor's degree", origin, transferStatus: "partial", notes: `Recognized in ${destination} with credential evaluation from WES or IQAS. Processing takes 8-12 weeks.` },
      ...(credentials.length > 1 ? [{ credential: credentials[1], origin, transferStatus: "requires-eval" as const, notes: `Professional certification requires ${destination}-specific examination. Contact the regulatory body for equivalency assessment.` }] : []),
    ],
    licensingRequirements: [
      { license: `${USER_CONTEXT.targetField} Professional Certification`, required: false, estimatedTime: "3-6 months", estimatedCost: "$500-1,200", steps: ["Submit credential evaluation", "Complete bridging coursework (if required)", "Pass certification exam", "Register with professional body"] },
      { license: "Language Proficiency (IELTS/CELPIP)", required: true, estimatedTime: "1-2 months prep", estimatedCost: "$300-400", steps: ["Register for exam", "Score minimum CLB 7 (IELTS 6.0+)", "Submit results with application"] },
    ],
    skillsGap: [
      { skill: `${destination} design standards & regulations`, currentLevel: "none", requiredLevel: "intermediate", recommendation: `Take an online ${destination} design standards course. Most employers value local market knowledge.` },
      { skill: "Cross-cultural communication", currentLevel: "intermediate", requiredLevel: "advanced", recommendation: "Your international background is an asset. Frame it as a strength in applications." },
      { skill: `${destination} business practices`, currentLevel: "basic", requiredLevel: "intermediate", recommendation: "Join local professional associations and attend networking events." },
    ],
    countryComparison: {
      origin, destination,
      differences: [
        { area: "Hiring timeline", origin: "2-4 weeks typical", destination: "4-8 weeks with multiple rounds" },
        { area: "Salary negotiation", origin: "Often fixed by company", destination: "Expected to negotiate — research market rates" },
        { area: "Work culture", origin: "Hierarchical, relationship-driven", destination: "Flat structure, results-driven" },
        { area: "Resume format", origin: "Photo + personal details common", destination: "No photo, skills-focused, ATS-optimized" },
        { area: "Professional networks", origin: "In-person referrals primary", destination: "LinkedIn + professional associations critical" },
      ],
    },
    estimatedTimeline: "4-8 months",
    estimatedCost: "$2,500 - $5,800",
  };
}

// ─── Popular Countries ──────────────────────────────────────────────

const POPULAR_COUNTRIES = [
  "Nigeria", "India", "Philippines", "Brazil", "Ghana", "Kenya",
  "South Africa", "Pakistan", "Bangladesh", "Egypt", "Colombia", "Mexico",
  "China", "Vietnam", "Ethiopia", "United Kingdom", "Germany", "France",
];

const DESTINATION_COUNTRIES = [
  "Canada", "United States", "United Kingdom", "Australia",
  "Germany", "Netherlands", "New Zealand", "Ireland",
];

// ─── Empty State ────────────────────────────────────────────────────

function EmptyState({ onStart }: { onStart: () => void }) {
  const rgb = "var(--ce-status-warning-rgb, 234,179,8)";

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 max-w-[520px] mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.12)` }}>
          <Globe className="w-6 h-6" style={{ color: `rgba(${rgb},1)` }} />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[20px] text-ce-text-primary mb-2"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        Global Career Mobility
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-[14px] text-ce-text-tertiary mb-8 leading-relaxed"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Understand how your credentials transfer and map your path to a new country.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8 max-w-[400px]"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
      >
        <SophiaMark size={20} glowing />
        <p className="text-[12px] text-ce-text-secondary text-left leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          I already know you're in {USER_CONTEXT.targetField} with {USER_CONTEXT.yearsExperience} years of experience. I just need a couple of details to map your international pathway.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        onClick={onStart}
        className="group flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] cursor-pointer transition-all duration-200"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, background: `rgba(${rgb},0.12)`, color: `rgba(${rgb},1)`, border: `1px solid rgba(${rgb},0.15)` }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Get Started
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </div>
  );
}

// ─── Building State (Sophia-Guided) ─────────────────────────────────

interface BuildStep {
  id: string;
  icon: typeof Globe;
  question: string;
  placeholder: string;
  sophiaFollowUp: string;
  type: "country-origin" | "country-dest" | "credentials";
}

const BUILD_STEPS: BuildStep[] = [
  {
    id: "origin",
    icon: MapPin,
    question: `You're a ${USER_CONTEXT.targetField} professional with ${USER_CONTEXT.yearsExperience} years of experience. To map how your credentials transfer — where did you study or qualify originally?`,
    placeholder: "Select or type your country...",
    sophiaFollowUp: "Got it. That helps me understand which credential evaluation pathway applies.",
    type: "country-origin",
  },
  {
    id: "destination",
    icon: Globe,
    question: USER_CONTEXT.savedJobLocations.length > 0
      ? `I noticed you've been looking at roles in ${USER_CONTEXT.savedJobLocations.join(" and ")}. Is that where you're heading?`
      : "Which country are you planning to build your career in?",
    placeholder: "Select your destination country...",
    sophiaFollowUp: "Great choice. Let me check credential requirements and licensing for that market.",
    type: "country-dest",
  },
  {
    id: "credentials",
    icon: GraduationCap,
    question: `What degrees or professional certifications do you hold from your home country? I already see "${USER_CONTEXT.education}" from your profile.`,
    placeholder: "e.g., Master's in Computer Science, PMP certification...",
    sophiaFollowUp: "Perfect. I have everything I need. Give me a moment to analyze your pathway...",
    type: "credentials",
  },
];

const GEN_STEPS = [
  "Evaluating credential transfer...",
  "Mapping licensing requirements...",
  "Analyzing skills gaps...",
  "Building your mobility roadmap...",
];

function BuildingState({ onComplete, onBack }: { onComplete: (profile: ImmigrationProfile) => void; onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const rgb = "var(--ce-status-warning-rgb, 234,179,8)";

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [currentStep, isTyping, generating, genStep, answers]);

  // Auto-focus
  useEffect(() => {
    if (!isTyping && !generating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep, isTyping, generating]);

  // Generation phase
  useEffect(() => {
    if (!generating) return;
    const delays = [800, 1600, 2400, 3200];
    const timers = delays.map((d, i) => setTimeout(() => setGenStep(i + 1), d));
    timers.push(setTimeout(() => {
      const origin = answers.origin || "Nigeria";
      const dest = answers.destination || "Canada";
      const creds = (answers.credentials || USER_CONTEXT.education).split(",").map(s => s.trim());
      const roadmap = generateMockRoadmap(origin, dest, creds);
      onComplete({
        originCountry: origin,
        destinationCountry: dest,
        credentials: creds,
        fieldRef: USER_CONTEXT.targetField,
        levelRef: USER_CONTEXT.careerLevel,
        ...roadmap,
      });
    }, 4000));
    return () => timers.forEach(clearTimeout);
  }, [generating, answers, onComplete]);

  const handleSubmit = () => {
    if (!input.trim() || isTyping || generating) return;
    const step = BUILD_STEPS[currentStep];
    setAnswers(prev => ({ ...prev, [step.id]: input.trim() }));
    setInput("");
    setShowCountryPicker(false);

    if (currentStep < BUILD_STEPS.length - 1) {
      setIsTyping(true);
      setTimeout(() => { setIsTyping(false); setCurrentStep(prev => prev + 1); }, 1000);
    } else {
      setIsTyping(true);
      setTimeout(() => { setIsTyping(false); setGenerating(true); }, 800);
    }
  };

  const selectCountry = (country: string) => {
    setInput(country);
    setShowCountryPicker(false);
    // Auto-submit after selection
    setTimeout(() => {
      const step = BUILD_STEPS[currentStep];
      setAnswers(prev => ({ ...prev, [step.id]: country }));
      setInput("");
      if (currentStep < BUILD_STEPS.length - 1) {
        setIsTyping(true);
        setTimeout(() => { setIsTyping(false); setCurrentStep(prev => prev + 1); }, 1000);
      } else {
        setIsTyping(true);
        setTimeout(() => { setIsTyping(false); setGenerating(true); }, 800);
      }
    }, 100);
  };

  const countries = BUILD_STEPS[currentStep]?.type === "country-origin" ? POPULAR_COUNTRIES : DESTINATION_COUNTRIES;

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SophiaMark size={28} glowing />
        <div className="flex-1">
          <h2 className="text-[16px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
            {generating ? "Analyzing your pathway" : "Global Career Mobility"}
          </h2>
          <p className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
            {generating ? "This takes a moment..." : `Question ${currentStep + 1} of ${BUILD_STEPS.length}`}
          </p>
        </div>
        <button onClick={onBack} className="text-[11px] text-ce-text-quaternary hover:text-ce-text-tertiary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {BUILD_STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `rgba(${rgb},1)` }}
              animate={{ width: i < currentStep ? "100%" : i === currentStep ? (generating ? "100%" : "50%") : "0%" }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>

      {/* Conversation thread */}
      <div
        ref={scrollRef}
        className="rounded-xl overflow-y-auto px-4 py-4 flex flex-col gap-4 mb-4"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)", maxHeight: "calc(100vh - 22rem)", minHeight: 280 }}
      >
        {BUILD_STEPS.map((step, i) => {
          if (i > currentStep) return null;
          const answer = answers[step.id];
          return (
            <div key={step.id} className="flex flex-col gap-3">
              {/* Sophia question */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `rgba(${rgb},0.1)` }}>
                  <step.icon className="w-2.5 h-2.5" style={{ color: `rgba(${rgb},1)` }} />
                </div>
                <p className="text-[12px] text-ce-text-primary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{step.question}</p>
              </motion.div>

              {/* Country picker (for country steps, before answer) */}
              {!answer && i === currentStep && (step.type === "country-origin" || step.type === "country-dest") && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-1.5 ml-7">
                  {countries.map(c => (
                    <button key={c} onClick={() => selectCountry(c)} className="px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all duration-150" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${rgb},0.25)`; e.currentTarget.style.color = `rgba(${rgb},1)`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.06)"; e.currentTarget.style.color = "var(--ce-text-secondary)"; }}
                    >{c}</button>
                  ))}
                </motion.div>
              )}

              {/* User answer */}
              {answer && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
                  <div className="max-w-[85%] px-3 py-2 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.05)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <p className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{answer}</p>
                  </div>
                </motion.div>
              )}

              {/* Sophia follow-up */}
              {answer && step.sophiaFollowUp && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-2.5">
                  <SophiaMark size={12} />
                  <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{step.sophiaFollowUp}</p>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-center">
            <SophiaMark size={12} glowing />
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ce-text-quaternary)" }}
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Generation progress */}
        {generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2.5 mb-2">
              <SophiaMark size={12} glowing />
              <p className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>Perfect. Analyzing your pathway now...</p>
            </div>
            {GEN_STEPS.map((label, i) => (
              <motion.div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                style={{ background: genStep > i ? `rgba(${rgb},0.03)` : "rgba(var(--ce-glass-tint),0.015)", border: `1px solid ${genStep > i ? `rgba(${rgb},0.08)` : "rgba(var(--ce-glass-tint),0.04)"}` }}
                animate={{ opacity: genStep >= i ? 1 : 0.3 }}
              >
                {genStep > i ? (
                  <Check className="w-3.5 h-3.5" style={{ color: `rgba(${rgb},1)` }} />
                ) : genStep === i ? (
                  <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent" style={{ borderColor: `rgba(${rgb},0.6)` }}
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)" }} />
                )}
                <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: genStep > i ? "var(--ce-text-secondary)" : "var(--ce-text-quaternary)" }}>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      {!generating && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder={BUILD_STEPS[currentStep]?.placeholder}
            disabled={isTyping}
            className="flex-1 bg-transparent outline-none text-[13px] text-ce-text-primary placeholder:text-ce-text-quaternary"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button onClick={handleSubmit} disabled={!input.trim() || isTyping}
            className="p-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-40"
            style={{ background: input.trim() ? `rgba(${rgb},0.1)` : "transparent", color: input.trim() ? `rgba(${rgb},1)` : "var(--ce-text-quaternary)" }}>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Active State (Two-Column Roadmap) ──────────────────────────────

function ActiveState({ profile, onNavigate, onReset }: { profile: ImmigrationProfile; onNavigate?: (s: string) => void; onReset: () => void }) {
  const rgb = "var(--ce-status-warning-rgb, 234,179,8)";

  const statusColor = (status: string) => {
    if (status === "full") return "var(--ce-status-success)";
    if (status === "partial") return `rgba(${rgb},1)`;
    return "var(--ce-status-error)";
  };

  const statusLabel = (status: string) => {
    if (status === "full") return "Fully Recognized";
    if (status === "partial") return "Partial — Evaluation Needed";
    return "Requires Full Evaluation";
  };

  const levelWidth = (level: string) => {
    const map: Record<string, number> = { none: 0, basic: 25, intermediate: 50, advanced: 75, expert: 100 };
    return map[level] || 0;
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `rgba(${rgb},0.08)` }}>
            <Globe className="w-5 h-5" style={{ color: `rgba(${rgb},1)` }} />
          </div>
          <div>
            <h1 className="text-[18px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
              {profile.originCountry} → {profile.destinationCountry}
            </h1>
            <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
              {USER_CONTEXT.targetField} · {USER_CONTEXT.careerLevel} · {profile.estimatedTimeline} estimated
            </p>
          </div>
        </div>
        <button onClick={() => onNavigate?.("home")} className="text-[12px] text-ce-text-tertiary hover:text-ce-text-secondary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to dashboard
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* LEFT — Roadmap Cards */}
        <div className="flex flex-col gap-5">
          {/* Timeline & Cost Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-ce-text-quaternary" />
                <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Timeline</span>
              </div>
              <span className="text-[22px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{profile.estimatedTimeline}</span>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-3.5 h-3.5 text-ce-text-quaternary" />
                <span className="text-[10px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Estimated Cost</span>
              </div>
              <span className="text-[22px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{profile.estimatedCost}</span>
            </div>
          </motion.div>

          {/* Credential Evaluation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4" style={{ color: `rgba(${rgb},1)` }} />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Credential Evaluation</span>
            </div>
            {profile.credentialEvaluation.map((cred, i) => (
              <div key={i} className="py-3" style={{ borderBottom: i < profile.credentialEvaluation.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{cred.credential}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${statusColor(cred.transferStatus)}15`, color: statusColor(cred.transferStatus), fontFamily: "var(--font-body)" }}>
                    {statusLabel(cred.transferStatus)}
                  </span>
                </div>
                <p className="text-[11px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{cred.notes}</p>
              </div>
            ))}
          </motion.div>

          {/* Licensing Requirements */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-4 h-4" style={{ color: `rgba(${rgb},1)` }} />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Licensing & Certification</span>
            </div>
            {profile.licensingRequirements.map((lic, i) => (
              <div key={i} className="py-3" style={{ borderBottom: i < profile.licensingRequirements.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{lic.license}</span>
                  <div className="flex items-center gap-3 text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                    <span>{lic.estimatedTime}</span>
                    <span>{lic.estimatedCost}</span>
                  </div>
                </div>
                <div className="ml-3 flex flex-col gap-1">
                  {lic.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: `rgba(${rgb},0.4)` }} />
                      <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Skills Gap */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4" style={{ color: `rgba(${rgb},1)` }} />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Skills Gap Analysis</span>
            </div>
            {profile.skillsGap.map((gap, i) => (
              <div key={i} className="py-3" style={{ borderBottom: i < profile.skillsGap.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{gap.skill}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <div className="text-[9px] text-ce-text-quaternary mb-1" style={{ fontFamily: "var(--font-body)" }}>Current</div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${levelWidth(gap.currentLevel)}%`, background: "var(--ce-text-tertiary)" }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] text-ce-text-quaternary mb-1" style={{ fontFamily: "var(--font-body)" }}>Required</div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${levelWidth(gap.requiredLevel)}%`, background: `rgba(${rgb},1)` }} />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{gap.recommendation}</p>
              </div>
            ))}
          </motion.div>

          {/* Country Comparison */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4" style={{ color: `rgba(${rgb},1)` }} />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {profile.countryComparison.origin} vs {profile.countryComparison.destination}
              </span>
            </div>
            <div className="overflow-hidden rounded-lg" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              {/* Header row */}
              <div className="grid grid-cols-3 gap-0" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
                <div className="px-3 py-2 text-[10px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Area</div>
                <div className="px-3 py-2 text-[10px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{profile.countryComparison.origin}</div>
                <div className="px-3 py-2 text-[10px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{profile.countryComparison.destination}</div>
              </div>
              {profile.countryComparison.differences.map((diff, i) => (
                <div key={i} className="grid grid-cols-3 gap-0" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
                  <div className="px-3 py-2.5 text-[11px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{diff.area}</div>
                  <div className="px-3 py-2.5 text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{diff.origin}</div>
                  <div className="px-3 py-2.5 text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{diff.destination}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <button onClick={onReset} className="text-[10px] text-ce-text-quaternary cursor-pointer hover:text-ce-text-tertiary transition-colors self-start" style={{ fontFamily: "var(--font-body)" }}>
            Reset analysis (demo)
          </button>
        </div>

        {/* RIGHT — Sophia Suggestions */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-20">
            <div className="flex items-center gap-2 mb-1">
              <SophiaMark size={16} />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Next Steps</span>
            </div>
            <div className="text-[12px] text-ce-text-tertiary mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Based on your {profile.originCountry} → {profile.destinationCountry} pathway
            </div>

            {/* Action cards */}
            {[
              { icon: Sparkles, label: "Add to your EdgePath roadmap", description: "Integrate visa and credential milestones into your career roadmap", action: "edgepath", color: "var(--ce-role-edgestar)" },
              { icon: Search, label: "Jobs with visa sponsorship", description: `${profile.destinationCountry} employers that sponsor international talent`, action: "jobs", color: "var(--ce-role-employer)" },
              { icon: Users, label: "Connect with a mobility guide", description: "Book a session with an international career specialist", action: "sessions", color: "var(--ce-role-guide)" },
              { icon: BookOpen, label: "Credential evaluation resources", description: "WES, IQAS, and recognized evaluation bodies", action: "resources", color: `rgba(${rgb},1)` },
            ].map((item, i) => (
              <motion.button
                key={item.action}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => item.action !== "resources" && onNavigate?.(item.action)}
                className="w-full text-left p-3.5 rounded-xl mb-3 cursor-pointer group transition-all duration-200"
                style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-ce-text-primary mb-0.5 flex items-center gap-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      {item.label}
                      <ChevronRight className="w-3 h-3 text-ce-text-quaternary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{item.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Sophia insight */}
            <div className="mt-4 p-3.5 rounded-xl" style={{ background: `rgba(${rgb},0.03)`, border: `1px solid rgba(${rgb},0.08)` }}>
              <div className="flex items-start gap-2">
                <SophiaMark size={14} glowing />
                <p className="text-[11px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Your {USER_CONTEXT.targetField} background is in demand in {profile.destinationCountry}. The credential evaluation is the first critical step — I'd recommend starting that this week while you continue your job search.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Surface ───────────────────────────────────────────────────

export function ImmigrationSurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = (roleParam || "edgestar") as "edgestar" | "edgepreneur";
  const { profile, save, reset } = useImmigrationProfile();
  const [state, setState] = useState<"empty" | "building" | "active">(() => profile ? "active" : "empty");

  const onNavigate = useCallback((target: string) => {
    const paths: Record<string, string> = {
      home: `/${role}`,
      synthesis: `/${role}`,
      edgepath: `/${role}/edgepath`,
      resume: `/${role}/resume`,
      jobs: `/${role}/jobs`,
      messages: `/${role}/messages`,
      sessions: `/${role}/sessions`,
      analytics: `/${role}/analytics`,
      immigration: `/${role}/immigration`,
      landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  }, [role, navigate]);

  const handleComplete = useCallback((p: ImmigrationProfile) => {
    save(p);
    setState("active");
  }, [save]);

  const handleReset = useCallback(() => {
    reset();
    setState("empty");
  }, [reset]);

  // Contextual Sophia override based on current state
  const sophiaOverride = state === "active" && profile
    ? {
        message: `Your ${profile.originCountry} → ${profile.destinationCountry} pathway is mapped. Credential evaluation is the first critical step.`,
        chips: [
          { label: "Add to EdgePath", action: "edgepath" as const },
          { label: "Sponsoring jobs", action: "jobs" as const },
          { label: "Book a guide", action: "sessions" as const },
        ],
      }
    : {
        message: `I can help you understand how your ${USER_CONTEXT.targetField} credentials transfer internationally.`,
        chips: [
          { label: "Start assessment", action: "ask" as const },
        ],
      };

  return (
    <RoleShell
      role={role}
      userName="Sharon"
      userInitial="S"
      edgeGas={45}
      onNavigate={onNavigate}
      sophiaOverride={sophiaOverride}
      noPadding
    >
      {state === "empty" && <EmptyState onStart={() => setState("building")} />}
      {state === "building" && <BuildingState onComplete={handleComplete} onBack={() => setState("empty")} />}
      {state === "active" && profile && <ActiveState profile={profile} onNavigate={onNavigate} onReset={handleReset} />}
    </RoleShell>
  );
}
