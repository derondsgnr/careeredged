/**
 * H2 — "The Product Builds Around You"
 * 
 * Split-screen: conversation left, dashboard assembles right.
 * 
 * KEY MOTION DECISIONS:
 * - Dashboard components assemble in sync with user answers:
 *   intent → sidebar slides in | sub → top bar slides down | target → KPI cards fly in | level → sophia bar rises
 * - Building state: each build line triggers specific dashboard element to "fill"
 * - "Power on" moment: everything brightens simultaneously + brief lime flash
 * - Signup: dashboard blurs (4px), conversation panel centers and grows
 * - All entrances use spring physics (stiffness 160, damping 24)
 * - 200-300ms pauses between beat groups
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  ArrowLeft, Check, Sparkles, User, Briefcase, Building2,
  Target, BookOpen, Compass, Zap, TrendingUp, Award, FileText, Users,
  MessageSquare, Calendar, Search, Rocket, Shield, Lightbulb, BarChart3,
  Home, Bell, Settings, ChevronRight, ArrowRight, RefreshCw, RotateCcw,
} from "lucide-react";
import { EditAnswersPanel } from "./edit-answers-panel";

type Step = "intro" | "intent" | "sub" | "target" | "level" | "building" | "ready" | "signup";

interface Option { id: string; label: string; sub?: string; icon: React.ReactNode; }

const INTENTS: Option[] = [
  { id: "career", label: "Building my career", sub: "Jobs, skills, transitions", icon: <User className="w-4 h-4" /> },
  { id: "someone", label: "Guiding someone else", sub: "Students, children, clients", icon: <Briefcase className="w-4 h-4" /> },
  { id: "org", label: "Representing an org", sub: "Hiring, education, workforce", icon: <Building2 className="w-4 h-4" /> },
];

const SUBS: Record<string, Option[]> = {
  career: [
    { id: "edgestar", label: "Finding opportunities", icon: <Search className="w-4 h-4" /> },
    { id: "edgepreneur", label: "Building a business", icon: <Rocket className="w-4 h-4" /> },
  ],
  someone: [
    { id: "parent", label: "Family member", icon: <Shield className="w-4 h-4" /> },
    { id: "guide", label: "Clients / mentees", icon: <Lightbulb className="w-4 h-4" /> },
  ],
  org: [
    { id: "employer", label: "Hiring talent", icon: <Users className="w-4 h-4" /> },
    { id: "edu", label: "Educational institution", icon: <BookOpen className="w-4 h-4" /> },
    { id: "ngo", label: "Non-profit / NGO", icon: <Target className="w-4 h-4" /> },
    { id: "agency", label: "Government agency", icon: <BarChart3 className="w-4 h-4" /> },
  ],
};

const TARGETS: Option[] = [
  { id: "design", label: "Product Design", icon: <Compass className="w-3.5 h-3.5" /> },
  { id: "eng", label: "Software Engineering", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "data", label: "Data Science", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "pm", label: "Product Management", icon: <Target className="w-3.5 h-3.5" /> },
  { id: "mktg", label: "Marketing", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "fin", label: "Finance", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "other", label: "Something else", icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const LEVELS: Option[] = [
  { id: "exploring", label: "Exploring", icon: <Compass className="w-4 h-4" /> },
  { id: "student", label: "Student", icon: <BookOpen className="w-4 h-4" /> },
  { id: "early", label: "Early career", icon: <Zap className="w-4 h-4" /> },
  { id: "mid", label: "Mid career", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "senior", label: "Senior", icon: <Award className="w-4 h-4" /> },
  { id: "change", label: "Career changer", icon: <Rocket className="w-4 h-4" /> },
];

// ─── Path-specific questions for each sub-intent ────────────────────────────

interface PathQ {
  targetQ: string;
  targetOpts: Option[];
  levelQ: string;
  levelOpts: Option[];
}

const PATH_QS: Record<string, PathQ> = {
  edgestar: { targetQ: "What field?", targetOpts: TARGETS, levelQ: "Where are you at?", levelOpts: LEVELS },
  edgepreneur: {
    targetQ: "What stage?",
    targetOpts: [
      { id: "idea", label: "Just an idea", icon: <Lightbulb className="w-4 h-4" /> },
      { id: "mvp", label: "Building an MVP", icon: <Rocket className="w-4 h-4" /> },
      { id: "launched", label: "Already launched", icon: <Zap className="w-4 h-4" /> },
      { id: "scaling", label: "Scaling up", icon: <TrendingUp className="w-4 h-4" /> },
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
      { id: "highschool", label: "High school student", icon: <BookOpen className="w-4 h-4" /> },
      { id: "college", label: "College student", icon: <Award className="w-4 h-4" /> },
      { id: "postgrad", label: "Recent graduate", icon: <Rocket className="w-4 h-4" /> },
      { id: "adult", label: "Adult family member", icon: <User className="w-4 h-4" /> },
    ],
    levelQ: "What kind of support?",
    levelOpts: [
      { id: "explore", label: "Help them explore", icon: <Compass className="w-4 h-4" /> },
      { id: "resume", label: "Resume & applications", icon: <FileText className="w-4 h-4" /> },
      { id: "interview", label: "Interview prep", icon: <MessageSquare className="w-4 h-4" /> },
      { id: "plan", label: "Full career plan", icon: <Target className="w-4 h-4" /> },
    ],
  },
  guide: {
    targetQ: "What's your role?",
    targetOpts: [
      { id: "counselor", label: "School counselor", icon: <BookOpen className="w-4 h-4" /> },
      { id: "coach", label: "Career coach", icon: <Target className="w-4 h-4" /> },
      { id: "mentor", label: "Mentor", icon: <Lightbulb className="w-4 h-4" /> },
      { id: "advisor", label: "Academic advisor", icon: <Award className="w-4 h-4" /> },
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
      { id: "finding", label: "Finding candidates", icon: <Search className="w-4 h-4" /> },
      { id: "retention", label: "Retention", icon: <Shield className="w-4 h-4" /> },
      { id: "pipeline", label: "Talent pipeline", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "diversity", label: "Diversity & inclusion", icon: <Users className="w-4 h-4" /> },
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
      { id: "k12", label: "K-12 school", icon: <BookOpen className="w-4 h-4" /> },
      { id: "community", label: "Community college", icon: <Building2 className="w-4 h-4" /> },
      { id: "university", label: "University", icon: <Award className="w-4 h-4" /> },
      { id: "bootcamp", label: "Bootcamp / Training", icon: <Zap className="w-4 h-4" /> },
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
      { id: "workforce", label: "Workforce development", icon: <Briefcase className="w-4 h-4" /> },
      { id: "youth", label: "Youth employment", icon: <Rocket className="w-4 h-4" /> },
      { id: "reentry", label: "Reentry programs", icon: <Shield className="w-4 h-4" /> },
      { id: "refugee", label: "Refugee resettlement", icon: <Compass className="w-4 h-4" /> },
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
      { id: "wfdev", label: "Workforce development", icon: <Briefcase className="w-4 h-4" /> },
      { id: "economic", label: "Economic development", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "edreform", label: "Education reform", icon: <BookOpen className="w-4 h-4" /> },
      { id: "veterans", label: "Veteran services", icon: <Shield className="w-4 h-4" /> },
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

const EASE = [0.32, 0.72, 0, 1] as const;
const SPRING = { stiffness: 160, damping: 24 };

// ─── Dashboard Components ───────────────────────────────────────────────────

function DashboardSidebar({ visible, fillLevel }: { visible: boolean; fillLevel: number }) {
  if (!visible) return null;
  const items = [
    { icon: <Home className="w-[16px] h-[16px]" />, label: "Home", active: true },
    { icon: <Compass className="w-[16px] h-[16px]" />, label: "Roadmap" },
    { icon: <FileText className="w-[16px] h-[16px]" />, label: "Resume" },
    { icon: <Search className="w-[16px] h-[16px]" />, label: "Jobs" },
    { icon: <MessageSquare className="w-[16px] h-[16px]" />, label: "Prep" },
    { icon: <Users className="w-[16px] h-[16px]" />, label: "Network" },
  ];

  return (
    <motion.div className="absolute left-0 top-0 bottom-0 w-[52px] z-20 flex flex-col items-center py-3 gap-1"
      style={{ background: "linear-gradient(180deg, rgba(12,14,19,0.95) 0%, rgba(10,12,16,0.98) 100%)", borderRight: "1px solid rgba(255,255,255,0.04)" }}
      initial={{ x: -52, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", ...SPRING }}>
      <motion.div className="w-7 h-7 rounded-lg mb-4 flex items-center justify-center"
        animate={{ backgroundColor: fillLevel >= 1 ? "rgba(179,255,59,0.12)" : "rgba(255,255,255,0.04)" }}
        transition={{ duration: 0.6 }}>
        {fillLevel >= 1 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}><Sparkles className="w-3.5 h-3.5 text-[#B3FF3B]" /></motion.div>}
      </motion.div>
      {items.map((item, i) => (
        <motion.div key={i}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${item.active && fillLevel >= 1 ? "bg-[rgba(255,255,255,0.06)] text-[#B3FF3B]" : "text-[#374151]"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: fillLevel >= 1 ? (item.active ? 1 : 0.4) : 0.15 }}
          transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
          title={item.label}>
          {item.icon}
        </motion.div>
      ))}
      <div className="mt-auto">
        <motion.div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#374151]"
          animate={{ opacity: fillLevel >= 1 ? 0.35 : 0.1 }}>
          <Settings className="w-[16px] h-[16px]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardTopBar({ visible, filled, target }: { visible: boolean; filled: boolean; target: string | null }) {
  if (!visible) return null;
  const tl = TARGETS.find(t => t.id === target)?.label || "Dashboard";
  return (
    <motion.div className="absolute top-0 left-[52px] right-0 h-12 z-20 flex items-center justify-between px-4"
      style={{ background: "rgba(10,12,16,0.85)", borderBottom: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", ...SPRING }}>
      <div className="flex items-center gap-2">
        {filled ? (
          <motion.span className="text-[13px] text-[#9CA3AF]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ fontFamily: "var(--font-body)" }}>
            <span className="text-[#6B7280]">Home</span><span className="text-[#374151] mx-2">/</span>{tl}
          </motion.span>
        ) : <div className="h-3 w-20 rounded bg-[rgba(255,255,255,0.04)]" />}
      </div>
      <div className="flex items-center gap-2">
        <motion.div className="w-8 h-8 rounded-lg flex items-center justify-center" animate={{ backgroundColor: filled ? "rgba(255,255,255,0.04)" : "transparent" }}>
          {filled && <Bell className="w-3.5 h-3.5 text-[#6B7280]" />}
        </motion.div>
        <motion.div className="w-7 h-7 rounded-full" animate={{ backgroundColor: filled ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)" }}>
          {filled && <div className="w-full h-full rounded-full flex items-center justify-center text-[10px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>U</div>}
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardCards({ visible, fillLevel, target }: { visible: boolean; fillLevel: number; target: string | null }) {
  if (!visible) return null;
  const tl = TARGETS.find(t => t.id === target)?.label || "Your Field";
  const filled = fillLevel >= 4;

  const kpis = [
    { label: "Career Score", value: "72", icon: <Target className="w-3.5 h-3.5" />, color: "cyan" },
    { label: "EdgeGas", value: "50", icon: <Zap className="w-3.5 h-3.5" />, color: "lime" },
    { label: "ATS Score", value: "—", icon: <FileText className="w-3.5 h-3.5" />, color: "neutral" },
  ];

  return (
    <motion.div className="absolute top-14 left-[60px] right-4 z-10 flex flex-col gap-3 p-3"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}>
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={i} className="rounded-xl p-3.5"
            style={{
              background: filled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${filled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"}`,
              boxShadow: filled ? "inset 0 1px 1px rgba(255,255,255,0.03)" : "none",
            }}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.12, type: "spring", ...SPRING }}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                filled ? kpi.color === "cyan" ? "bg-[rgba(34,211,238,0.1)] text-[#22D3EE]" : kpi.color === "lime" ? "bg-[rgba(179,255,59,0.1)] text-[#B3FF3B]" : "bg-[rgba(255,255,255,0.04)] text-[#6B7280]"
                : "bg-[rgba(255,255,255,0.03)] text-[#1F2937]"
              }`}>{kpi.icon}</div>
              {filled ? <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{kpi.label}</span> : <div className="h-2 w-14 rounded bg-[rgba(255,255,255,0.03)]" />}
            </div>
            <div className="text-[20px] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: filled ? "#E8E8ED" : "#1F2937" }}>
              {filled ? kpi.value : "—"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Roadmap card */}
      <motion.div className="rounded-xl p-4"
        style={{
          background: fillLevel >= 2 ? "linear-gradient(171deg, rgba(4,44,1,0.08), rgba(255,255,255,0.03))" : "rgba(255,255,255,0.015)",
          border: `1px solid ${fillLevel >= 2 ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.03)"}`,
          boxShadow: fillLevel >= 2 ? "inset 0 1px 1px rgba(255,255,255,0.03), 0 0 20px rgba(34,211,238,0.02)" : "none",
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-3">
          {fillLevel >= 2 ? (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" style={{ boxShadow: "0 0 8px rgba(34,211,238,0.4)" }} />
              <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{tl} Roadmap</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.06)]" />
              <div className="h-3 w-24 rounded bg-[rgba(255,255,255,0.03)]" />
            </div>
          )}
          {fillLevel >= 2 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#22D3EE] bg-[rgba(34,211,238,0.08)] px-2 py-0.5 rounded-md" style={{ fontFamily: "var(--font-body)" }}>
              <Sparkles className="w-2.5 h-2.5" /> Phase 1
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(p => (
            <motion.div key={p} className="flex-1 h-1.5 rounded-full"
              animate={{ backgroundColor: fillLevel >= 2 && p === 1 ? "rgba(34,211,238,0.5)" : fillLevel >= 2 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)" }}
              transition={{ delay: 0.5 + p * 0.08 }} />
          ))}
        </div>
        {fillLevel >= 2 && (
          <>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-[11px] text-[#E8E8ED] bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.1)] px-2 py-1 rounded-md">
                <Check className="w-2.5 h-2.5 text-[#22D3EE]" /> Discover & Position
              </span>
              <span className="inline-flex text-[11px] text-[#6B7280] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] px-2 py-1 rounded-md">Weeks 1–3</span>
            </div>
            <div className="flex items-start gap-2 mt-3 px-3 py-2 rounded-lg" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.06)" }}>
              <Sparkles className="w-3 h-3 text-[#22D3EE] flex-shrink-0 mt-0.5" />
              <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>Start with resume optimization — it's the highest-leverage move.</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Sophia insight card */}
      <motion.div className="rounded-xl p-4"
        style={{
          background: filled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
          border: `1px solid ${filled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"}`,
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5" style={{ color: fillLevel >= 3 ? "#22D3EE" : "#1F2937" }} />
          <span className="text-[12px]" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: fillLevel >= 3 ? "#22D3EE" : "#1F2937" }}>Sophia</span>
        </div>
        {fillLevel >= 3 ? (
          <motion.p className="text-[13px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            Based on your profile, I'd start with resume optimization. Your ATS score will unlock after your first upload.
          </motion.p>
        ) : (
          <div className="flex flex-col gap-1.5"><div className="h-2 w-full rounded bg-[rgba(255,255,255,0.02)]" /><div className="h-2 w-3/4 rounded bg-[rgba(255,255,255,0.02)]" /></div>
        )}
      </motion.div>
    </motion.div>
  );
}

function DashboardSophiaBar({ visible, filled }: { visible: boolean; filled: boolean }) {
  if (!visible) return null;
  return (
    <motion.div className="absolute bottom-0 left-[52px] right-0 h-12 z-20 flex items-center px-3 gap-2.5"
      style={{ background: "rgba(10,12,16,0.9)", borderTop: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", ...SPRING }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: filled ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)" }}>
        <Sparkles className="w-3.5 h-3.5" style={{ color: filled ? "#22D3EE" : "#1F2937" }} />
      </div>
      <div className="flex-1 h-8 rounded-lg flex items-center px-3" style={{ background: filled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
        {filled && <span className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Ask Sophia anything...</span>}
      </div>
    </motion.div>
  );
}

// ─── Build Process (synced with dashboard fill) ─────────────────────────────

function BuildProcess({ target, onFillChange }: { target: string; onFillChange: (level: number) => void }) {
  const tl = TARGETS.find(x => x.id === target)?.label || "your field";
  const [active, setActive] = useState(0);

  const steps = [
    { text: "Setting up your toolkit...", icon: <Compass className="w-3.5 h-3.5" /> },
    { text: `Building your ${tl} roadmap...`, icon: <Target className="w-3.5 h-3.5" /> },
    { text: "Getting Sophia up to speed...", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { text: "Pulling your dashboard together...", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { text: "All set.", icon: <Check className="w-3.5 h-3.5" /> },
  ];

  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => {
      setActive(i);
      onFillChange(i + 1); // Sync: step 0 → fillLevel 1 (sidebar brightens), step 1 → fillLevel 2 (roadmap fills), etc.
    }, 400 + i * 1000));
    return () => timers.forEach(clearTimeout);
  }, [onFillChange]);

  return (
    <motion.div className="flex flex-col gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3">
        <SophiaMark size={40} glowing />
        <div>
          <div className="text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Setting things up</div>
          <div className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Based on what you told me.</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <motion.div key={i} className="flex items-center gap-3"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: i <= active ? 1 : 0.12, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.06, ease: EASE }}>
            <div className="w-5 flex items-center justify-center">
              {i < active ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  <Check className="w-3.5 h-3.5 text-[#22D3EE]" />
                </motion.div>
              ) : i === active ? (
                <motion.div className="w-2 h-2 rounded-full bg-[#22D3EE]"
                  animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
              ) : <div className="w-1.5 h-1.5 rounded-full bg-[#374151]" />}
            </div>
            <span className="flex items-center gap-2 text-[13px]"
              style={{ fontFamily: "var(--font-body)", color: i <= active ? "#9CA3AF" : "#374151" }}>
              <span className={i < active ? "text-[#22D3EE]" : i === active ? "text-[#6B7280]" : "text-[#374151]"}>{s.icon}</span>
              {s.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Conversation Option ────────────────────────────────────────────────────

function ConvoOption({ option, selected, onClick, delay }: { option: Option; selected: boolean; onClick: () => void; delay: number }) {
  return (
    <motion.button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer border transition-all ${
        selected ? "bg-[rgba(34,211,238,0.08)] border-[rgba(34,211,238,0.15)]" : "bg-[rgba(255,255,255,0.025)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]"
      }`}
      style={{ boxShadow: selected ? "0 0 16px rgba(34,211,238,0.04)" : "inset 0 1px 1px rgba(255,255,255,0.02)", willChange: "transform, opacity" }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      whileTap={{ scale: 0.98 }}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? "bg-[rgba(34,211,238,0.1)] text-[#22D3EE]" : "bg-[rgba(255,255,255,0.04)] text-[#6B7280]"}`}>{option.icon}</div>
      <div className="flex-1 text-left">
        <div className={`text-[13px] ${selected ? "text-[#E8E8ED]" : "text-[#9CA3AF]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{option.label}</div>
        {option.sub && <div className="text-[11px] text-[#6B7280]">{option.sub}</div>}
      </div>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-4 h-4 rounded-full bg-[#22D3EE] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-[#08090C]" /></motion.div>
      )}
    </motion.button>
  );
}

// ─── Signup Overlay ─────────────────────────────────────────────────────────

function SignupOverlay({ onDismiss, onComplete }: { onDismiss: () => void; onComplete?: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <motion.div className="absolute inset-0" style={{ backdropFilter: "blur(6px)", background: "rgba(8,9,12,0.5)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.div className="relative z-10 w-full max-w-sm mx-4"
        initial={{ y: 50, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", ...SPRING, delay: 0.2 }}>
        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(179,255,59,0.1), rgba(34,211,238,0.06))" }}>
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "linear-gradient(135deg, rgba(4,44,1,0.08) 0%, rgba(12,14,19,0.98) 30%)", boxShadow: "0 8px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <SophiaMark size={28} glowing />
              <div>
                <div className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Everything's set up.</div>
                <div className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Ready when you are.</div>
              </div>
            </div>
            <button onClick={onComplete} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-[#1a1a1a] hover:bg-white/90 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" /><span className="text-[11px] text-[#6B7280]">or</span><div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" /></div>
            <input type="email" placeholder="Where should I send this?" className="w-full px-3.5 py-2.5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-[#E8E8ED] placeholder:text-[#6B7280] focus:outline-none focus:border-[rgba(34,211,238,0.2)] text-[13px]" style={{ fontFamily: "var(--font-body)" }} />
            <button onClick={onComplete} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px]" style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C" }}>
              <Sparkles className="w-3.5 h-3.5" /> Save workspace
            </button>
            <p className="text-[11px] text-[#6B7280] text-center">Free. No catch.</p>
            <button onClick={onDismiss} className="text-[12px] text-[#374151] hover:text-[#6B7280] transition-colors cursor-pointer text-center" style={{ fontFamily: "var(--font-body)" }}>Maybe later</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Power On Flash ─────────────────────────────────────────────────────────

function PowerOnFlash() {
  return (
    <motion.div className="fixed inset-0 z-30 pointer-events-none"
      style={{ background: "rgba(179,255,59,0.03)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.6, times: [0, 0.15, 1] }} />
  );
}

// ─── Main H2 ────────────────────────────────────────────────────────────────

export function OnboardingH2({ onComplete }: { onComplete?: (role?: string) => void } = {}) {
  const [step, setStep] = useState<Step>("intro");
  const [intent, setIntent] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupDismissed, setSignupDismissed] = useState(false);
  const [buildFillLevel, setBuildFillLevel] = useState(0);
  const [showPowerOn, setShowPowerOn] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const hist = useRef<Step[]>([]);

  const go = useCallback((next: Step) => {
    setStep(prev => { hist.current.push(prev); return next; });
  }, []);

  const back = useCallback(() => {
    const prev = hist.current.pop();
    if (!prev) return;
    if (prev === "intent") { setIntent(null); setSub(null); setTarget(null); setLevel(null); }
    else if (prev === "sub") { setSub(null); setTarget(null); setLevel(null); }
    else if (prev === "target") { setTarget(null); setLevel(null); }
    else if (prev === "level") { setLevel(null); }
    setStep(prev);
  }, []);

  const handleEditChange = useCallback((field: "intent" | "sub" | "target" | "level", value: string) => {
    if (field === "intent") { setIntent(value); setSub(null); setTarget(null); setLevel(null); }
    else if (field === "sub") { setSub(value); setTarget(null); setLevel(null); }
    else if (field === "target") { setTarget(value); }
    else if (field === "level") { setLevel(value); }
  }, []);

  const pathQ = sub ? PATH_QS[sub] : null;
  const canBack = !["intro", "intent", "building"].includes(step);

  useEffect(() => { if (step === "intro") { const t = setTimeout(() => go("intent"), 2800); return () => clearTimeout(t); } }, [step, go]);
  useEffect(() => {
    if (step === "building") {
      const t = setTimeout(() => {
        setShowPowerOn(true);
        setTimeout(() => setShowPowerOn(false), 800);
        setStep(p => { hist.current.push(p); return "ready"; });
      }, 5500);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Dashboard visibility — progressive with each answer
  const showSidebar = !["intro", "intent"].includes(step);
  const showTopBar = !["intro", "intent", "sub"].includes(step);
  const showCards = !["intro", "intent", "sub", "target"].includes(step);
  const showSophiaBar = ["building", "ready", "signup"].includes(step);
  const isFilled = ["ready", "signup"].includes(step);
  const isSplit = step !== "intro";

  // fillLevel: 0 = skeleton, 1 = sidebar bright, 2 = roadmap fills, 3 = sophia card fills, 4 = KPIs animate, 5 = all bright
  const effectiveFillLevel = step === "building" ? buildFillLevel
    : isFilled ? 5
    : 0;

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: "#08090C" }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 80%)",
      }} />

      {/* Dashboard */}
      <DashboardSidebar visible={showSidebar} fillLevel={effectiveFillLevel} />
      <DashboardTopBar visible={showTopBar} filled={effectiveFillLevel >= 2} target={target} />
      <DashboardCards visible={showCards} fillLevel={effectiveFillLevel} target={target} />
      <DashboardSophiaBar visible={showSophiaBar} filled={effectiveFillLevel >= 3} />

      {/* Power on flash */}
      {showPowerOn && <PowerOnFlash />}

      {/* Conversation panel */}
      <div className={`absolute inset-0 z-30 flex items-center ${isSplit ? "justify-start pl-[68px]" : "justify-center"}`}>
        <motion.div className="flex flex-col" style={{ maxWidth: isSplit ? 360 : 440, width: "100%" }}
          layout transition={{ duration: 0.6, ease: EASE }}>

          <AnimatePresence>
            {canBack && (
              <motion.button onClick={back} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer mb-4 self-start"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                whileTap={{ scale: 0.95 }} style={{ fontFamily: "var(--font-body)" }}>
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div className="rounded-2xl p-6"
            style={{
              background: step === "intro" ? "transparent" : "rgba(12,14,19,0.88)",
              border: step === "intro" ? "none" : "1px solid rgba(255,255,255,0.05)",
              backdropFilter: step === "intro" ? "none" : "blur(24px)",
              boxShadow: step === "intro" ? "none" : "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.03)",
            }}
            layout transition={{ duration: 0.5, ease: EASE }}>

            <AnimatePresence mode="wait">
              {step === "intro" && (
                <motion.div key="intro" className="flex flex-col items-center gap-6" exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}>
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}>
                    <SophiaMark size={88} glowing />
                  </motion.div>
                  <motion.div className="text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: EASE }}>
                    <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "28px", color: "#E8E8ED" }}>
                      Let's build<br /><span style={{ color: "#22D3EE" }}>your workspace.</span>
                    </h1>
                    <p className="text-[#6B7280] text-sm mt-2" style={{ fontFamily: "var(--font-body)" }}>Every answer shapes what you see.</p>
                  </motion.div>
                </motion.div>
              )}

              {step === "intent" && (
                <motion.div key="intent" className="flex flex-col gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -12, transition: { duration: 0.3 } }}>
                  <div className="flex items-center gap-3">
                    <SophiaMark size={28} glowing={false} />
                    <span className="text-[#9CA3AF] text-[14px]" style={{ fontFamily: "var(--font-body)" }}>What brings you here?</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {INTENTS.map((o, i) => <ConvoOption key={o.id} option={o} selected={intent === o.id} onClick={() => { setIntent(o.id); setTimeout(() => go("sub"), 450); }} delay={0.3 + i * 0.1} />)}
                  </div>
                </motion.div>
              )}

              {step === "sub" && intent && (
                <motion.div key="sub" className="flex flex-col gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -12, transition: { duration: 0.3 } }}>
                  <div className="flex items-center gap-3">
                    <SophiaMark size={28} glowing={false} />
                    <span className="text-[#9CA3AF] text-[14px]" style={{ fontFamily: "var(--font-body)" }}>{intent === "career" ? "Tell me more." : intent === "someone" ? "Who?" : "What kind?"}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {SUBS[intent]?.map((o, i) => <ConvoOption key={o.id} option={o} selected={sub === o.id} onClick={() => { setSub(o.id); setTimeout(() => go("target"), 450); }} delay={0.2 + i * 0.08} />)}
                  </div>
                </motion.div>
              )}

              {step === "target" && (
                <motion.div key="target" className="flex flex-col gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -12, transition: { duration: 0.3 } }}>
                  <div className="flex items-center gap-3">
                    <SophiaMark size={28} glowing={false} />
                    <span className="text-[#9CA3AF] text-[14px]" style={{ fontFamily: "var(--font-body)" }}>{pathQ?.targetQ || "What field?"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(pathQ?.targetOpts || TARGETS).map((o, i) => (
                      <motion.button key={o.id} onClick={() => { setTarget(o.id); setTimeout(() => go("level"), 400); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-[13px] ${
                          target === o.id ? "bg-[rgba(34,211,238,0.08)] border-[rgba(34,211,238,0.15)] text-[#E8E8ED]" : "bg-[rgba(255,255,255,0.025)] border-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:border-[rgba(255,255,255,0.1)]"
                        }`}
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.04, duration: 0.3, ease: EASE }}
                        whileTap={{ scale: 0.96 }} style={{ fontFamily: "var(--font-body)" }}>
                        <span className={target === o.id ? "text-[#22D3EE]" : "text-[#6B7280]"}>{o.icon}</span>{o.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "level" && (
                <motion.div key="level" className="flex flex-col gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -12, transition: { duration: 0.3 } }}>
                  <div className="flex items-center gap-3">
                    <SophiaMark size={28} glowing={false} />
                    <span className="text-[#9CA3AF] text-[14px]" style={{ fontFamily: "var(--font-body)" }}>{pathQ?.levelQ || "Where are you at?"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(pathQ?.levelOpts || LEVELS).map((o, i) => <ConvoOption key={o.id} option={o} selected={level === o.id} onClick={() => { setLevel(o.id); setTimeout(() => go("building"), 400); }} delay={0.2 + i * 0.06} />)}
                  </div>
                </motion.div>
              )}

              {step === "building" && target && (
                <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <BuildProcess target={target} onFillChange={setBuildFillLevel} />
                </motion.div>
              )}

              {step === "ready" && (
                <motion.div key="ready" className="flex flex-col gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-3">
                    <SophiaMark size={32} glowing />
                    <div>
                      <div className="text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Everything's set up.</div>
                      <div className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Ready when you are.</div>
                    </div>
                  </div>
                  <motion.button onClick={() => setShowSignup(true)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C", boxShadow: "0 0 24px rgba(34,211,238,0.12)" }}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease: EASE }}
                    whileTap={{ scale: 0.97 }}>
                    <Sparkles className="w-4 h-4" /> Enter workspace <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#E8E8ED] transition-colors text-[13px]"
                    style={{ fontFamily: "var(--font-body)" }}>
                    Tell me more
                  </button>
                  <div className="flex items-center gap-4 justify-center">
                    <button className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RefreshCw className="w-3 h-3" /> Not quite right?</button>
                    <button onClick={() => setShowEditPanel(true)} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RotateCcw className="w-3 h-3" /> Adjust my answers</button>
                  </div>
                  {signupDismissed && (
                    <motion.button onClick={() => setShowSignup(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                      <Sparkles className="w-3 h-3 text-[#22D3EE]" /><span className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Save your workspace before you go</span>
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-4 right-4 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span className="text-[10px] tracking-[0.2em] text-[#1F2937]" style={{ fontFamily: "var(--font-display)" }}>CAREEREDGE</span>
      </motion.div>

      <AnimatePresence>
        {showSignup && <SignupOverlay onDismiss={() => { setShowSignup(false); setSignupDismissed(true); }} onComplete={() => { if (onComplete) onComplete(sub || undefined); }} />}
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
    </div>
  );
}