/**
 * H3 — "Sophia Speaks First"
 * 
 * A conversational interface. Sophia sends messages. User responds by tapping options.
 * 
 * KEY MOTION DECISIONS:
 * - Typing indicator (3 dots, 600-900ms) before EVERY Sophia message
 * - Option → user bubble MORPH (chip moves right, reshapes into user bubble)
 * - 300ms pause after user response before next Sophia message
 * - Thinking state: chat blurs, thinking bubble is the sole focus point
 * - Roadmap reveal: chat stays blurred, roadmap UNFOLDS from a line to full card
 *   at viewport center — NOT at the bottom of a scroll
 * - Signup: blur deepens, signup card rises from bottom with spring
 * 
 * SPRING CONFIGS:
 * - Mark entrance: stiffness 180, damping 22
 * - Card/panel entrance: stiffness 160, damping 24
 * - Button press: stiffness 400, damping 30
 * 
 * EASING:
 * - Content fade: [0.32, 0.72, 0, 1]
 * - Exit: [0.36, 0, 0.66, -0.56]
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Check, Sparkles, User, Briefcase, Building2,
  Target, BookOpen, Compass, Zap, TrendingUp, Award, FileText, Users,
  MessageSquare, Calendar, Search, Rocket, Shield, Lightbulb, BarChart3,
  ChevronDown, ChevronRight, RefreshCw, RotateCcw,
} from "lucide-react";
import topoSvgPaths from "../../imports/svg-3bufurt997";
import { EditAnswersPanel } from "./edit-answers-panel";

type Step = "intro" | "intent" | "sub" | "target" | "level" | "thinking" | "roadmap" | "signup";

interface Option { id: string; label: string; icon: React.ReactNode; }

const INTENTS: Option[] = [
  { id: "career", label: "Building my career", icon: <User className="w-3.5 h-3.5" /> },
  { id: "someone", label: "Guiding someone else", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: "org", label: "Representing an organization", icon: <Building2 className="w-3.5 h-3.5" /> },
];

const SUBS: Record<string, Option[]> = {
  career: [
    { id: "edgestar", label: "Finding opportunities", icon: <Search className="w-3.5 h-3.5" /> },
    { id: "edgepreneur", label: "Building a business", icon: <Rocket className="w-3.5 h-3.5" /> },
  ],
  someone: [
    { id: "parent", label: "Family member", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "guide", label: "Clients or mentees", icon: <Lightbulb className="w-3.5 h-3.5" /> },
  ],
  org: [
    { id: "employer", label: "Hiring talent", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "edu", label: "Education", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "ngo", label: "Non-profit", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "agency", label: "Government", icon: <BarChart3 className="w-3.5 h-3.5" /> },
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
  { id: "exploring", label: "Just exploring", icon: <Compass className="w-3.5 h-3.5" /> },
  { id: "student", label: "Student", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "early", label: "Early career", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "mid", label: "Mid career", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "senior", label: "Senior", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "change", label: "Career changer", icon: <Rocket className="w-3.5 h-3.5" /> },
];

// ─── Path Configs: per-sub-intent question chains ───────────────────────────

interface PathConfig {
  targetQ: string;
  targetOpts: Option[];
  levelQ: string;
  levelOpts: Option[];
  resultType: "roadmap" | "dashboard";
  thinkingSteps: string[];
  thinkingChecklist: (target: string) => string[];
  dashboardTitle?: (target: string) => string;
  dashboardSections?: (target: string, level: string) => DashboardCard[];
}

interface DashboardCard {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  accent?: boolean;
}

const PATH_CONFIGS: Record<string, PathConfig> = {
  edgestar: {
    targetQ: "What field are you aiming for?",
    targetOpts: TARGETS,
    levelQ: "Where are you in your journey?",
    levelOpts: LEVELS,
    resultType: "roadmap",
    thinkingSteps: ["Scanning the landscape", "Mapping skill requirements", "Identifying growth vectors", "Putting it all together"],
    thinkingChecklist: (t) => { const tl = TARGETS.find(x => x.id === t)?.label || "your field"; return ["Career landscape", `${tl} requirements`, "Growth vectors", "Personalized roadmap"]; },
  },
  edgepreneur: {
    targetQ: "What stage is your business in?",
    targetOpts: [
      { id: "idea", label: "Just an idea", icon: <Lightbulb className="w-3.5 h-3.5" /> },
      { id: "mvp", label: "Building an MVP", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "launched", label: "Already launched", icon: <Zap className="w-3.5 h-3.5" /> },
      { id: "scaling", label: "Scaling up", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What industry are you building in?",
    levelOpts: [
      { id: "tech", label: "Tech / SaaS", icon: <Zap className="w-3.5 h-3.5" /> },
      { id: "health", label: "Health & Wellness", icon: <Shield className="w-3.5 h-3.5" /> },
      { id: "creative", label: "Creative & Media", icon: <Sparkles className="w-3.5 h-3.5" /> },
      { id: "retail", label: "Retail & E-commerce", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { id: "services", label: "Professional Services", icon: <Users className="w-3.5 h-3.5" /> },
      { id: "other_biz", label: "Something else", icon: <Compass className="w-3.5 h-3.5" /> },
    ],
    resultType: "roadmap",
    thinkingSteps: ["Analyzing market landscape", "Mapping founder requirements", "Building milestone framework", "Personalizing your plan"],
    thinkingChecklist: (t) => { const stages: Record<string, string> = { idea: "Idea validation", mvp: "MVP development", launched: "Growth strategy", scaling: "Scale operations" }; return [stages[t] || "Business stage", "Market analysis", "Key milestones", "Founder roadmap"]; },
  },
  parent: {
    targetQ: "Tell me about who you're supporting.",
    targetOpts: [
      { id: "highschool", label: "High school student", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "college", label: "College student", icon: <Award className="w-3.5 h-3.5" /> },
      { id: "postgrad", label: "Recent graduate", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "adult", label: "Adult family member", icon: <User className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What kind of support are you looking for?",
    levelOpts: [
      { id: "explore", label: "Help them explore options", icon: <Compass className="w-3.5 h-3.5" /> },
      { id: "resume", label: "Resume & applications", icon: <FileText className="w-3.5 h-3.5" /> },
      { id: "interview", label: "Interview preparation", icon: <MessageSquare className="w-3.5 h-3.5" /> },
      { id: "plan", label: "Full career plan", icon: <Target className="w-3.5 h-3.5" /> },
    ],
    resultType: "dashboard",
    thinkingSteps: ["Understanding their stage", "Identifying relevant resources", "Building support toolkit", "Creating your dashboard"],
    thinkingChecklist: (t) => { const stages: Record<string, string> = { highschool: "High school pathways", college: "College to career", postgrad: "Graduate launch plan", adult: "Career transition" }; return [stages[t] || "Stage analysis", "Support resources", "Progress tracking", "Family dashboard"]; },
    dashboardTitle: (t) => { const labels: Record<string, string> = { highschool: "High School Student", college: "College Student", postgrad: "Recent Graduate", adult: "Family Member" }; return `Support Dashboard — ${labels[t] || "Your Person"}`; },
    dashboardSections: (t, l) => [
      { title: "Their Progress", value: "Ready to start", desc: "Track milestones and completed activities", icon: <TrendingUp className="w-4 h-4" />, accent: true },
      { title: "Shared Resources", value: "12 curated", desc: t === "highschool" ? "College prep, career quizzes, scholarship finder" : t === "college" ? "Internship tracker, skills builder, networking guide" : "Job search toolkit, resume templates, interview prep", icon: <BookOpen className="w-4 h-4" /> },
      { title: "Conversation Starters", value: "5 prompts", desc: "Guided questions to support without pressure", icon: <MessageSquare className="w-4 h-4" /> },
      { title: l === "plan" ? "Career Roadmap" : "Action Items", value: l === "plan" ? "4 phases" : "3 next steps", desc: l === "plan" ? "A complete plan you can walk through together" : "Quick wins to build momentum", icon: <Target className="w-4 h-4" /> },
    ],
  },
  guide: {
    targetQ: "What best describes your role?",
    targetOpts: [
      { id: "counselor", label: "School counselor", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "coach", label: "Career coach", icon: <Target className="w-3.5 h-3.5" /> },
      { id: "mentor", label: "Mentor", icon: <Lightbulb className="w-3.5 h-3.5" /> },
      { id: "advisor", label: "Academic advisor", icon: <Award className="w-3.5 h-3.5" /> },
    ],
    levelQ: "How many people are you currently working with?",
    levelOpts: [
      { id: "few", label: "1–5 individuals", icon: <User className="w-3.5 h-3.5" /> },
      { id: "group", label: "6–25 people", icon: <Users className="w-3.5 h-3.5" /> },
      { id: "program", label: "26–100 in a program", icon: <BarChart3 className="w-3.5 h-3.5" /> },
      { id: "large", label: "100+", icon: <Building2 className="w-3.5 h-3.5" /> },
    ],
    resultType: "dashboard",
    thinkingSteps: ["Analyzing your practice", "Configuring client tools", "Building tracking framework", "Setting up your workspace"],
    thinkingChecklist: (t) => { const roles: Record<string, string> = { counselor: "Student caseload", coach: "Client portfolio", mentor: "Mentee profiles", advisor: "Advisee tracking" }; return [roles[t] || "Role setup", "Client tools", "Progress tracking", "Guide dashboard"]; },
    dashboardTitle: (t) => { const labels: Record<string, string> = { counselor: "Counselor", coach: "Coach", mentor: "Mentor", advisor: "Advisor" }; return `${labels[t] || "Guide"} Dashboard`; },
    dashboardSections: (t, l) => {
      const scale = l === "few" ? "individual" : l === "group" ? "small group" : "program";
      return [
        { title: "Client Overview", value: l === "few" ? "1–5" : l === "group" ? "6–25" : l === "program" ? "26–100" : "100+", desc: `Manage ${scale} profiles, progress, and goals`, icon: <Users className="w-4 h-4" />, accent: true },
        { title: "Career Tools Library", value: "24 tools", desc: "Assessments, templates, and exercises to assign", icon: <Briefcase className="w-4 h-4" /> },
        { title: "Progress Reports", value: "Auto-generated", desc: `Track completion rates and outcomes across your ${scale}`, icon: <BarChart3 className="w-4 h-4" /> },
        { title: t === "counselor" ? "School Integration" : "Session Planner", value: t === "counselor" ? "LMS sync" : "Smart scheduling", desc: t === "counselor" ? "Sync with school systems and export reports" : "Plan sessions with AI-suggested agendas", icon: <Calendar className="w-4 h-4" /> },
      ];
    },
  },
  employer: {
    targetQ: "What's your biggest hiring challenge right now?",
    targetOpts: [
      { id: "finding", label: "Finding qualified candidates", icon: <Search className="w-3.5 h-3.5" /> },
      { id: "retention", label: "Employee retention", icon: <Shield className="w-3.5 h-3.5" /> },
      { id: "pipeline", label: "Building a talent pipeline", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: "diversity", label: "Diversity & inclusion", icon: <Users className="w-3.5 h-3.5" /> },
    ],
    levelQ: "How large is your organization?",
    levelOpts: [
      { id: "startup", label: "1–50 employees", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "mid", label: "51–500 employees", icon: <Building2 className="w-3.5 h-3.5" /> },
      { id: "enterprise", label: "500+ employees", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { id: "franchise", label: "Multi-location", icon: <Target className="w-3.5 h-3.5" /> },
    ],
    resultType: "dashboard",
    thinkingSteps: ["Analyzing hiring landscape", "Benchmarking your sector", "Configuring talent tools", "Building your workspace"],
    thinkingChecklist: (t) => { const challenges: Record<string, string> = { finding: "Candidate sourcing", retention: "Retention analysis", pipeline: "Pipeline strategy", diversity: "DEI benchmarks" }; return [challenges[t] || "Hiring analysis", "Market benchmarks", "Tool configuration", "Employer dashboard"]; },
    dashboardTitle: () => "Employer Dashboard",
    dashboardSections: (t, l) => [
      { title: "Talent Pool", value: "2,400+", desc: "Pre-vetted candidates matched to your requirements", icon: <Users className="w-4 h-4" />, accent: true },
      { title: t === "finding" ? "Smart Matching" : t === "retention" ? "Retention Insights" : t === "pipeline" ? "Pipeline Health" : "DEI Scorecard", value: t === "finding" ? "AI-powered" : t === "retention" ? "Risk alerts" : t === "pipeline" ? "3 stages" : "Benchmarked", desc: t === "finding" ? "Skills-based matching beyond keyword search" : t === "retention" ? "Identify at-risk employees before they leave" : t === "pipeline" ? "Nurture, ready, and active candidate pools" : "Track representation across hiring funnel", icon: <BarChart3 className="w-4 h-4" /> },
      { title: "Branded Career Page", value: "Customizable", desc: `Showcase culture to ${l === "startup" ? "attract early talent" : "reach top candidates"}`, icon: <Sparkles className="w-4 h-4" /> },
      { title: "Analytics", value: "Real-time", desc: "Time-to-hire, cost-per-hire, source effectiveness", icon: <TrendingUp className="w-4 h-4" /> },
    ],
  },
  edu: {
    targetQ: "What type of institution are you with?",
    targetOpts: [
      { id: "k12", label: "K-12 school", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "community", label: "Community college", icon: <Building2 className="w-3.5 h-3.5" /> },
      { id: "university", label: "University", icon: <Award className="w-3.5 h-3.5" /> },
      { id: "bootcamp", label: "Bootcamp / Training", icon: <Zap className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What's your primary goal?",
    levelOpts: [
      { id: "outcomes", label: "Improve student outcomes", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: "placement", label: "Job placement rates", icon: <Target className="w-3.5 h-3.5" /> },
      { id: "curriculum", label: "Curriculum alignment", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "tracking", label: "Career readiness tracking", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    ],
    resultType: "dashboard",
    thinkingSteps: ["Analyzing institutional needs", "Mapping student outcomes", "Configuring tracking tools", "Building your dashboard"],
    thinkingChecklist: (t) => { const types: Record<string, string> = { k12: "K-12 pathways", community: "Transfer & career tracks", university: "Degree-to-career mapping", bootcamp: "Completion & placement" }; return [types[t] || "Institution analysis", "Outcome metrics", "Student tools", "Education dashboard"]; },
    dashboardTitle: (t) => { const labels: Record<string, string> = { k12: "K-12", community: "Community College", university: "University", bootcamp: "Bootcamp" }; return `${labels[t] || "Education"} Dashboard`; },
    dashboardSections: (t, l) => [
      { title: "Student Cohorts", value: "Active tracking", desc: `Monitor ${t === "k12" ? "grade-level" : t === "bootcamp" ? "cohort" : "class"} progress and engagement`, icon: <Users className="w-4 h-4" />, accent: true },
      { title: l === "placement" ? "Placement Tracker" : l === "outcomes" ? "Outcome Analytics" : l === "curriculum" ? "Curriculum Map" : "Readiness Scores", value: l === "placement" ? "By employer" : l === "outcomes" ? "Real-time" : l === "curriculum" ? "Industry-aligned" : "Per student", desc: l === "placement" ? "Track where graduates land and employer satisfaction" : l === "outcomes" ? "Graduation, employment, and earnings data" : l === "curriculum" ? "Map coursework to in-demand skills" : "Individual and cohort readiness assessments", icon: <BarChart3 className="w-4 h-4" /> },
      { title: "Career Services Tools", value: "Full suite", desc: "Resume builder, interview prep, and job board for students", icon: <Briefcase className="w-4 h-4" /> },
      { title: "Employer Partnerships", value: "Network", desc: "Connect students directly with hiring organizations", icon: <Building2 className="w-4 h-4" /> },
    ],
  },
  ngo: {
    targetQ: "What's your program focus?",
    targetOpts: [
      { id: "workforce", label: "Workforce development", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { id: "youth", label: "Youth employment", icon: <Rocket className="w-3.5 h-3.5" /> },
      { id: "reentry", label: "Reentry programs", icon: <Shield className="w-3.5 h-3.5" /> },
      { id: "refugee", label: "Refugee resettlement", icon: <Compass className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What scale are you operating at?",
    levelOpts: [
      { id: "local", label: "Local community", icon: <Target className="w-3.5 h-3.5" /> },
      { id: "regional", label: "Regional", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: "statewide", label: "Statewide", icon: <BarChart3 className="w-3.5 h-3.5" /> },
      { id: "national", label: "National", icon: <Award className="w-3.5 h-3.5" /> },
    ],
    resultType: "dashboard",
    thinkingSteps: ["Analyzing program needs", "Mapping impact metrics", "Configuring participant tools", "Building your dashboard"],
    thinkingChecklist: (t) => { const focuses: Record<string, string> = { workforce: "Workforce outcomes", youth: "Youth engagement", reentry: "Reentry pathways", refugee: "Resettlement support" }; return [focuses[t] || "Program analysis", "Impact metrics", "Participant tools", "Impact dashboard"]; },
    dashboardTitle: (t) => { const labels: Record<string, string> = { workforce: "Workforce Development", youth: "Youth Employment", reentry: "Reentry Program", refugee: "Resettlement" }; return `${labels[t] || "Program"} Dashboard`; },
    dashboardSections: (t, l) => [
      { title: "Participant Tracking", value: l === "local" ? "Community" : l === "regional" ? "Multi-site" : "At scale", desc: "Enrollment, milestones, and individual progress", icon: <Users className="w-4 h-4" />, accent: true },
      { title: "Impact Metrics", value: "Grant-ready", desc: t === "workforce" ? "Employment rates, wage gains, retention" : t === "youth" ? "Engagement, completion, first job placement" : t === "reentry" ? "Recidivism reduction, employment, housing" : "Language proficiency, employment, integration", icon: <BarChart3 className="w-4 h-4" /> },
      { title: "Funder Reports", value: "Auto-generated", desc: "Export impact data formatted for grants and board presentations", icon: <FileText className="w-4 h-4" /> },
      { title: "Career Tools", value: "Participant access", desc: "Resume builder, job matching, and skills assessment for participants", icon: <Briefcase className="w-4 h-4" /> },
    ],
  },
  agency: {
    targetQ: "What initiative are you leading?",
    targetOpts: [
      { id: "wfdev", label: "Workforce development", icon: <Briefcase className="w-3.5 h-3.5" /> },
      { id: "economic", label: "Economic development", icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: "edreform", label: "Education reform", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: "veterans", label: "Veteran services", icon: <Shield className="w-3.5 h-3.5" /> },
    ],
    levelQ: "What level of government?",
    levelOpts: [
      { id: "city", label: "City / Municipal", icon: <Building2 className="w-3.5 h-3.5" /> },
      { id: "county", label: "County", icon: <Target className="w-3.5 h-3.5" /> },
      { id: "state", label: "State", icon: <BarChart3 className="w-3.5 h-3.5" /> },
      { id: "federal", label: "Federal", icon: <Award className="w-3.5 h-3.5" /> },
    ],
    resultType: "dashboard",
    thinkingSteps: ["Analyzing policy landscape", "Mapping regional data", "Configuring reporting tools", "Building your dashboard"],
    thinkingChecklist: (t) => { const initiatives: Record<string, string> = { wfdev: "Workforce data", economic: "Economic indicators", edreform: "Education metrics", veterans: "Veteran outcomes" }; return [initiatives[t] || "Policy analysis", "Regional benchmarks", "Reporting tools", "Agency dashboard"]; },
    dashboardTitle: (t) => { const labels: Record<string, string> = { wfdev: "Workforce Development", economic: "Economic Development", edreform: "Education Reform", veterans: "Veteran Services" }; return `${labels[t] || "Agency"} Dashboard`; },
    dashboardSections: (t, l) => [
      { title: "Regional Overview", value: l === "city" ? "Municipal" : l === "county" ? "County-wide" : l === "state" ? "Statewide" : "National", desc: "Aggregate employment, skills gap, and workforce data", icon: <BarChart3 className="w-4 h-4" />, accent: true },
      { title: t === "veterans" ? "Veteran Outcomes" : "Program Impact", value: "Real-time", desc: t === "veterans" ? "Transition success rates, employment, and utilization" : t === "wfdev" ? "Training completion, placement, and wage data" : t === "economic" ? "Job creation, business starts, and investment ROI" : "Student outcomes, readiness, and equity metrics", icon: <TrendingUp className="w-4 h-4" /> },
      { title: "Provider Network", value: "Connected", desc: "Coordinate across training providers, employers, and agencies", icon: <Users className="w-4 h-4" /> },
      { title: "Policy Reports", value: "Export-ready", desc: "Dashboards and data exports for legislative reporting", icon: <FileText className="w-4 h-4" /> },
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
      { text: `${tl} research`, icon: <Search className="w-3 h-3" /> },
      { text: "Resume for ATS", icon: <FileText className="w-3 h-3" /> },
      { text: "Target companies", icon: <Target className="w-3 h-3" /> },
    ],
    paths: [{ id: "portfolio", title: "Portfolio-first", recommended: true }, { id: "network", title: "Network-first" }],
    sophiaInsight: "Start here — your resume is the highest-leverage move right now.",
    },
    { id: 2, title: "Build & Connect", duration: "Weeks 4–8", status: "upcoming", items: [
      { text: "Portfolio pieces", icon: <Zap className="w-3 h-3" /> },
      { text: "Industry contacts", icon: <Users className="w-3 h-3" /> },
      { text: "Mentor match", icon: <MessageSquare className="w-3 h-3" /> },
    ], paths: [{ id: "depth", title: "Go deep" }, { id: "breadth", title: "Go wide", recommended: true }] },
    { id: 3, title: "Apply & Interview", duration: "Weeks 9–14", status: "upcoming", items: [
      { text: "Targeted applications", icon: <Rocket className="w-3 h-3" /> },
      { text: "Mock interviews", icon: <Sparkles className="w-3 h-3" /> },
      { text: "Negotiation prep", icon: <Shield className="w-3 h-3" /> },
    ]},
    { id: 4, title: "Launch & Grow", duration: "Weeks 15–20", status: "upcoming", items: [
      { text: "90-day plan", icon: <Calendar className="w-3 h-3" /> },
      { text: "Growth milestones", icon: <TrendingUp className="w-3 h-3" /> },
    ]},
  ];
}

function makeEntrepreneurPhases(stage: string): Phase[] {
  const stageLabel = PATH_CONFIGS.edgepreneur.targetOpts.find(x => x.id === stage)?.label || "your stage";
  return [
    { id: 1, title: "Validate & Research", duration: "Weeks 1–3", status: "active", items: [
      { text: "Market research", icon: <Search className="w-3 h-3" /> },
      { text: "Customer interviews", icon: <MessageSquare className="w-3 h-3" /> },
      { text: "Competitive analysis", icon: <Target className="w-3 h-3" /> },
      { text: "Value proposition", icon: <Lightbulb className="w-3 h-3" /> },
    ],
    sophiaInsight: `Starting from "${stageLabel}" — let's make sure the foundation is solid.`,
    },
    { id: 2, title: "Build & Test", duration: "Weeks 4–8", status: "upcoming", items: [
      { text: "MVP development", icon: <Rocket className="w-3 h-3" /> },
      { text: "User testing", icon: <Users className="w-3 h-3" /> },
      { text: "Iterate on feedback", icon: <RefreshCw className="w-3 h-3" /> },
    ]},
    { id: 3, title: "Launch & Monetize", duration: "Weeks 9–14", status: "upcoming", items: [
      { text: "Go-to-market plan", icon: <Zap className="w-3 h-3" /> },
      { text: "Pricing strategy", icon: <Award className="w-3 h-3" /> },
      { text: "First customers", icon: <Sparkles className="w-3 h-3" /> },
    ]},
    { id: 4, title: "Scale & Sustain", duration: "Weeks 15–24", status: "upcoming", items: [
      { text: "Growth channels", icon: <TrendingUp className="w-3 h-3" /> },
      { text: "Team building", icon: <Users className="w-3 h-3" /> },
      { text: "Funding strategy", icon: <Briefcase className="w-3 h-3" /> },
    ]},
  ];
}

// Smooth ease curves
const EASE_CONTENT = [0.32, 0.72, 0, 1] as const;

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-start gap-2.5 max-w-[85%]">
      <div className="flex-shrink-0 mt-1"><SophiaMark size={24} glowing={false} /></div>
      <div className="rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5 h-[42px]"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-[5px] h-[5px] rounded-full bg-[#6B7280]"
            animate={{ opacity: [0.25, 0.8, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }} />
        ))}
      </div>
    </div>
  );
}

// ─── Sophia Message (with typing-then-reveal sequence) ──────────────────────

function SophiaMsg({ text, typingMs = 700, onReady }: { text: string; typingMs?: number; onReady?: () => void }) {
  const [phase, setPhase] = useState<"typing" | "message">("typing");

  useEffect(() => {
    const t = setTimeout(() => { setPhase("message"); onReady?.(); }, typingMs);
    return () => clearTimeout(t);
  }, [typingMs, onReady]);

  if (phase === "typing") return <TypingDots />;

  return (
    <motion.div className="flex items-start gap-2.5 max-w-[85%]"
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE_CONTENT }}>
      <div className="flex-shrink-0 mt-1"><SophiaMark size={24} glowing={false} /></div>
      <div className="rounded-2xl rounded-tl-md px-4 py-3"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <span className="text-[14px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{text}</span>
      </div>
    </motion.div>
  );
}

// Static version for history
function SophiaMsgStatic({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 max-w-[85%]">
      <div className="flex-shrink-0 mt-1"><SophiaMark size={24} glowing={false} /></div>
      <div className="rounded-2xl rounded-tl-md px-4 py-3"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-[14px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{text}</span>
      </div>
    </div>
  );
}

function UserBubble({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <motion.div className="flex justify-end"
      initial={{ opacity: 0, y: 6, x: 6 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3, ease: EASE_CONTENT }}>
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-tr-md"
        style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(179,255,59,0.06))",
          border: "1px solid rgba(34,211,238,0.15)",
        }}>
        {icon && <span className="text-[#22D3EE]">{icon}</span>}
        <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>{text}</span>
      </div>
    </motion.div>
  );
}

// ─── Option Chips (staggered entrance, 300ms delay after message) ───────────

function OptionChips({ options, onSelect }: { options: Option[]; onSelect: (id: string) => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 300); return () => clearTimeout(t); }, []);
  if (!show) return null;

  return (
    <motion.div className="flex flex-wrap gap-2 pl-9"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE_CONTENT }}>
      {options.map((o, i) => (
        <motion.button key={o.id} onClick={() => onSelect(o.id)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl cursor-pointer text-[13px] text-[#9CA3AF] hover:text-[#E8E8ED] transition-colors"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "var(--font-body)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, scale: 0.92, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3, ease: EASE_CONTENT }}
          whileTap={{ scale: 0.96 }}
          whileHover={{ borderColor: "rgba(34,211,238,0.15)", background: "rgba(34,211,238,0.04)" }}>
          <span className="text-[#6B7280]">{o.icon}</span>
          {o.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── Thinking Overlay (blurs chat, centers the thinking bubble) ─────────────

function ThinkingOverlay({ target, onDone, pathConfig }: { target: string; onDone: () => void; pathConfig: PathConfig }) {
  const progress = useMotionValue(0);
  const displayPct = useTransform(progress, v => `${Math.round(v)}%`);
  const [activeStep, setActiveStep] = useState(0);

  const steps = pathConfig.thinkingSteps;
  const checklist = pathConfig.thinkingChecklist(target);

  useEffect(() => {
    // Smooth progress from 0 to 100
    const controls = animate(progress, 100, { duration: 5, ease: "easeInOut" });

    const timers = [
      setTimeout(() => setActiveStep(1), 1300),
      setTimeout(() => setActiveStep(2), 2600),
      setTimeout(() => setActiveStep(3), 3900),
      setTimeout(onDone, 5200),
    ];

    return () => { controls.stop(); timers.forEach(clearTimeout); };
  }, [progress, onDone]);

  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}>
      {/* Blur the chat behind */}
      <motion.div className="absolute inset-0"
        style={{ backdropFilter: "blur(12px)", background: "rgba(8,9,12,0.4)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_CONTENT }} />

      {/* Thinking card */}
      <motion.div className="relative z-10 flex items-start gap-3 max-w-md"
        initial={{ y: 20, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 24, delay: 0.3 }}>
        <div className="flex-shrink-0 mt-1"><SophiaMark size={32} glowing /></div>
        <div className="rounded-2xl rounded-tl-md px-5 py-5 min-w-[280px]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.3), 0 0 40px rgba(34,211,238,0.03)",
          }}>
          {/* Percentage */}
          <motion.div className="text-[28px] text-[#E8E8ED] tabular-nums mb-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, willChange: "contents" }}>
            {displayPct}
          </motion.div>

          {/* Current step label */}
          <div className="text-[13px] text-[#9CA3AF] mb-5" style={{ fontFamily: "var(--font-body)" }}>
            {steps[activeStep]}...
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-3">
            {checklist.map((label, i) => {
              const done = i < activeStep;
              const current = i === activeStep;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 flex items-center justify-center">
                    {done ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                        <Check className="w-4 h-4 text-[#22D3EE]" />
                      </motion.div>
                    ) : current ? (
                      <motion.div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"
                        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#374151]" />
                    )}
                  </div>
                  <span className={`text-[12px] ${done ? "text-[#9CA3AF]" : current ? "text-[#9CA3AF]" : "text-[#374151]"}`}
                    style={{ fontFamily: "var(--font-body)" }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Roadmap Visualization Modes ────────────────────────────────────────────

type RoadmapMode = "orbital" | "constellation" | "terrain";

function OrbitalView({ phases }: { phases: Phase[] }) {
  const cx = 200, cy = 200;
  const rings = [60, 100, 140, 175];
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {rings.map((r, i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={i === 0 ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)"}
            strokeWidth={i === 0 ? 1.5 : 0.5} strokeDasharray={i === 0 ? "none" : "3 6"}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }} />
        ))}
        {phases.map((p, i) => {
          const angle = -90 + i * 90, rad = (angle * Math.PI) / 180;
          const r = rings[i], x = cx + Math.cos(rad) * r, y = cy + Math.sin(rad) * r;
          const isActive = p.status === "active", nodeR = isActive ? 22 : 14;
          return (
            <motion.g key={p.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
              style={{ transformOrigin: `${x}px ${y}px` }}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)"} strokeWidth={0.5} strokeDasharray="2 4" />
              {isActive && <circle cx={x} cy={y} r={32} fill="none" stroke="rgba(34,211,238,0.08)" strokeWidth={1}>
                <animate attributeName="r" values="28;36;28" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.15;0.6" dur="3s" repeatCount="indefinite" />
              </circle>}
              <circle cx={x} cy={y} r={nodeR} fill={isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)"}
                stroke={isActive ? "#22D3EE" : "rgba(255,255,255,0.08)"} strokeWidth={isActive ? 1.5 : 0.5} />
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fill={isActive ? "#E8E8ED" : "#6B7280"}
                fontSize={isActive ? 11 : 9} fontFamily="var(--font-display)" fontWeight={500}>{i + 1}</text>
              <text x={x} y={y + nodeR + 14} textAnchor="middle" fill={isActive ? "#E8E8ED" : "#6B7280"}
                fontSize={10} fontFamily="var(--font-display)" fontWeight={500}>{p.title}</text>
              <text x={x} y={y + nodeR + 26} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="var(--font-body)">{p.duration}</text>
              {!isActive && <text x={x} y={y + nodeR + 38} textAnchor="middle" fill="#374151" fontSize={7} fontFamily="var(--font-body)">{p.items.length} milestones</text>}
            </motion.g>
          );
        })}
        <circle cx={cx} cy={cy} r={16} fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.15)" strokeWidth={1} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="#22D3EE" fontSize={8} fontFamily="var(--font-body)">YOU</text>
      </svg>
      {phases.filter(p => p.status === "active").map(p => (
        <motion.div key={p.id} className="absolute left-1/2 -translate-x-1/2 w-[220px]" style={{ top: "12px" }}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.4 }}>
          <div className="flex flex-wrap gap-1 justify-center">
            {p.items.map((item, mi) => (
              <span key={mi} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] ${mi === 0 ? "bg-[rgba(34,211,238,0.08)] text-[#E8E8ED]" : "bg-[rgba(255,255,255,0.02)] text-[#6B7280]"}`}>
                <span className={mi === 0 ? "text-[#22D3EE]" : "text-[#374151]"}>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ConstellationView({ phases }: { phases: Phase[] }) {
  const clusters = [{ cx: 100, cy: 80, spread: 35 }, { cx: 300, cy: 120, spread: 28 }, { cx: 80, cy: 260, spread: 25 }, { cx: 280, cy: 300, spread: 22 }];
  return (
    <div className="relative w-full aspect-[4/3] max-w-[420px] mx-auto">
      <svg viewBox="0 0 400 380" className="w-full h-full">
        {Array.from({ length: 40 }, (_, i) => (
          <motion.circle key={`bg-${i}`} cx={20 + (i * 97) % 360} cy={10 + (i * 73) % 360} r={0.5 + (i % 3) * 0.3}
            fill="rgba(255,255,255,0.08)" initial={{ opacity: 0 }}
            animate={{ opacity: [0.02, 0.12, 0.02] }} transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }} />
        ))}
        {clusters.slice(0, -1).map((c, i) => {
          const next = clusters[i + 1];
          return <motion.line key={`conn-${i}`} x1={c.cx} y1={c.cy} x2={next.cx} y2={next.cy}
            stroke="url(#constellation-grad)" strokeWidth={0.6} strokeDasharray="4 8"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.8 }} />;
        })}
        <defs>
          <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#B3FF3B" />
          </linearGradient>
        </defs>
        {phases.map((p, i) => {
          const cl = clusters[i], isActive = p.status === "active";
          const stars = p.items.map((_, si) => ({
            x: cl.cx + Math.cos(si * 1.8 + i) * cl.spread * (0.4 + (si % 3) * 0.25),
            y: cl.cy + Math.sin(si * 2.1 + i) * cl.spread * (0.3 + (si % 2) * 0.35),
            size: isActive ? 2.5 + (si === 0 ? 1.5 : 0) : 1.5,
          }));
          return (
            <motion.g key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.18 }}>
              {stars.slice(0, -1).map((s, si) => (
                <line key={si} x1={s.x} y1={s.y} x2={stars[si + 1].x} y2={stars[si + 1].y}
                  stroke={isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)"} strokeWidth={0.4} />
              ))}
              {stars.map((s, si) => (
                <motion.circle key={si} cx={s.x} cy={s.y} r={s.size}
                  fill={isActive && si === 0 ? "#22D3EE" : isActive ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.15)"}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.15 + si * 0.06, type: "spring", stiffness: 300, damping: 20 }}>
                  {isActive && si === 0 && <animate attributeName="r" values="3;4.5;3" dur="2.5s" repeatCount="indefinite" />}
                </motion.circle>
              ))}
              {isActive && <circle cx={cl.cx} cy={cl.cy} r={cl.spread + 8} fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth={1} strokeDasharray="2 4">
                <animate attributeName="r" values={`${cl.spread + 4};${cl.spread + 12};${cl.spread + 4}`} dur="4s" repeatCount="indefinite" />
              </circle>}
              <text x={cl.cx} y={cl.cy + cl.spread + 18} textAnchor="middle" fill={isActive ? "#E8E8ED" : "#6B7280"}
                fontSize={10} fontFamily="var(--font-display)" fontWeight={500}>{p.title}</text>
              <text x={cl.cx} y={cl.cy + cl.spread + 30} textAnchor="middle" fill="#374151" fontSize={8} fontFamily="var(--font-body)">
                {p.duration} · {p.items.length} milestones</text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

function TerrainView({ phases }: { phases: Phase[] }) {
  const bands = [{ x: 0, w: 110, peakY: 50 }, { x: 110, w: 100, peakY: 80 }, { x: 210, w: 100, peakY: 65 }, { x: 310, w: 90, peakY: 90 }];
  const terrainD = `M 0 200 C 30 200, 40 ${200 - bands[0].peakY * 1.2}, 55 ${200 - bands[0].peakY} S 90 ${200 - bands[0].peakY * 0.8}, 110 ${200 - bands[0].peakY * 0.5} S 140 ${200 - bands[1].peakY * 0.3}, 160 ${200 - bands[1].peakY} S 200 ${200 - bands[1].peakY * 0.7}, 210 ${200 - bands[1].peakY * 0.4} S 240 ${200 - bands[2].peakY * 0.3}, 260 ${200 - bands[2].peakY} S 300 ${200 - bands[2].peakY * 0.6}, 310 ${200 - bands[2].peakY * 0.3} S 340 ${200 - bands[3].peakY * 0.2}, 355 ${200 - bands[3].peakY} S 385 ${200 - bands[3].peakY * 0.5}, 400 200`;
  return (
    <div className="relative w-full aspect-[5/3] max-w-[440px] mx-auto">
      <svg viewBox="0 0 400 240" className="w-full h-full">
        {[180, 150, 120, 90, 60].map((y, i) => (
          <motion.line key={i} x1={0} y1={y} x2={400} y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth={0.5}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }} />
        ))}
        <motion.path d={terrainD} fill="none" stroke="url(#terrain-grad)" strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.4, ease: [0.32, 0.72, 0, 1] }} />
        <motion.path d={terrainD + " L 400 240 L 0 240 Z"} fill="url(#terrain-fill)" opacity={0.3}
          initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.5, duration: 0.8 }} />
        <defs>
          <linearGradient id="terrain-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#B3FF3B" />
          </linearGradient>
          <linearGradient id="terrain-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.08)" /><stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {phases.map((p, i) => {
          const band = bands[i], markerX = band.x + band.w * 0.5, markerY = 200 - band.peakY, isActive = p.status === "active";
          return (
            <motion.g key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.2, duration: 0.4 }}>
              <line x1={markerX} y1={markerY - 4} x2={markerX} y2={204}
                stroke={isActive ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.04)"} strokeWidth={0.5} strokeDasharray="2 3" />
              <circle cx={markerX} cy={markerY} r={isActive ? 5 : 3} fill={isActive ? "#22D3EE" : "rgba(255,255,255,0.12)"}
                stroke={isActive ? "rgba(34,211,238,0.3)" : "none"} strokeWidth={1}>
                {isActive && <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />}
              </circle>
              <text x={markerX} y={215} textAnchor="middle" fill={isActive ? "#E8E8ED" : "#6B7280"}
                fontSize={9} fontFamily="var(--font-display)" fontWeight={500}>{p.title}</text>
              <text x={markerX} y={227} textAnchor="middle" fill="#374151" fontSize={7} fontFamily="var(--font-body)">{p.duration}</text>
              <text x={markerX + 8} y={markerY - 8} textAnchor="start"
                fill={isActive ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.06)"} fontSize={7} fontFamily="var(--font-body)">{p.items.length} milestones</text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

const MODE_LABELS: { id: RoadmapMode; label: string }[] = [
  { id: "orbital", label: "Orbital" }, { id: "constellation", label: "Constellation" }, { id: "terrain", label: "Terrain" },
];

// ─── Roadmap Reveal Overlay ─────────────────────────────────────────────────

function RoadmapOverlay({ phases, target, onSave, onAdjust }: {
  phases: Phase[]; target: string;
  onSave: () => void; onAdjust: () => void;
}) {
  const tl = TARGETS.find(x => x.id === target)?.label || "Your Field";
  const [showCta, setShowCta] = useState(false);
  const [mode, setMode] = useState<RoadmapMode>("orbital");

  useEffect(() => { const t = setTimeout(() => setShowCta(true), 1800); return () => clearTimeout(t); }, []);

  return (
    <motion.div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="fixed inset-0"
        style={{ backdropFilter: "blur(10px)", background: "rgba(8,9,12,0.45)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE_CONTENT }} />

      <div className="relative z-10 w-full max-w-lg my-8 flex flex-col gap-5">
        {/* Sophia intro + mode toggle */}
        <motion.div className="flex items-start justify-between"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_CONTENT }}>
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 mt-1"><SophiaMark size={28} glowing /></div>
            <div>
              <span className="text-[14px] text-[#9CA3AF] block mb-0.5" style={{ fontFamily: "var(--font-body)" }}>Here's your roadmap for {tl}.</span>
              <span className="text-[11px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}><Sparkles className="w-2.5 h-2.5 inline mr-1 text-[#B3FF3B]" />Personalized</span>
            </div>
          </div>
          <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {MODE_LABELS.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${mode === m.id ? "bg-[rgba(34,211,238,0.1)] text-[#E8E8ED] border border-[rgba(34,211,238,0.15)]" : "text-[#6B7280] hover:text-[#9CA3AF] border border-transparent"}`}
                style={{ fontFamily: "var(--font-body)" }}>{m.label}</button>
            ))}
          </div>
        </motion.div>

        {/* Visualization */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: EASE_CONTENT }}>
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(10,12,16,0.8)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 4px 40px rgba(0,0,0,0.4)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                {mode === "orbital" && <OrbitalView phases={phases} />}
                {mode === "constellation" && <ConstellationView phases={phases} />}
                {mode === "terrain" && <TerrainView phases={phases} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTAs */}
        <AnimatePresence>
          {showCta && (
            <motion.div className="flex flex-col gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_CONTENT }}>
              <div className="flex gap-2">
                <motion.button onClick={onSave} className="flex items-center gap-2 px-5 py-3 rounded-xl cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C", boxShadow: "0 0 24px rgba(34,211,238,0.12), 0 2px 8px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.97 }}><Sparkles className="w-3.5 h-3.5" /> Save my roadmap</motion.button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.03)] transition-colors text-[13px]"
                  style={{ fontFamily: "var(--font-body)" }}>Tell me more</button>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RefreshCw className="w-3 h-3" /> Not quite right?</button>
                <button onClick={onAdjust} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RotateCcw className="w-3 h-3" /> Adjust my answers</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Dashboard Preview (for non-career paths) ──────────────────────────────

function DashboardPreview({ pathConfig, target, level, onSave, onAdjust }: {
  pathConfig: PathConfig; target: string; level: string;
  onSave: () => void; onAdjust: () => void;
}) {
  const title = pathConfig.dashboardTitle?.(target) || "Your Dashboard";
  const cards = pathConfig.dashboardSections?.(target, level) || [];
  const [showCta, setShowCta] = useState(false);

  useEffect(() => { const t = setTimeout(() => setShowCta(true), 1400); return () => clearTimeout(t); }, []);

  return (
    <motion.div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="fixed inset-0"
        style={{ backdropFilter: "blur(10px)", background: "rgba(8,9,12,0.45)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE_CONTENT }} />

      <div className="relative z-10 w-full max-w-lg my-8 flex flex-col gap-5">
        {/* Sophia intro */}
        <motion.div className="flex items-start gap-2.5"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_CONTENT }}>
          <div className="flex-shrink-0 mt-1"><SophiaMark size={28} glowing /></div>
          <div>
            <span className="text-[14px] text-[#9CA3AF] block mb-0.5" style={{ fontFamily: "var(--font-body)" }}>Here's what I've set up for you.</span>
            <span className="text-[11px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}><Sparkles className="w-2.5 h-2.5 inline mr-1 text-[#B3FF3B]" />Personalized to your answers</span>
          </div>
        </motion.div>

        {/* Dashboard title */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: EASE_CONTENT }}>
          <h2 className="text-[18px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{title}</h2>
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.2), rgba(179,255,59,0.1), transparent)" }} />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <motion.div key={i} className="rounded-xl p-4 flex flex-col gap-2"
              style={{
                background: card.accent ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${card.accent ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.05)"}`,
                boxShadow: card.accent ? "0 0 20px rgba(34,211,238,0.03)" : "none",
              }}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.12, duration: 0.35, ease: EASE_CONTENT }}>
              <div className="flex items-center gap-2">
                <span className={card.accent ? "text-[#22D3EE]" : "text-[#6B7280]"}>{card.icon}</span>
                <span className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{card.title}</span>
              </div>
              <div className="text-[16px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{card.value}</div>
              <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <AnimatePresence>
          {showCta && (
            <motion.div className="flex flex-col gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE_CONTENT }}>
              <div className="flex gap-2">
                <motion.button onClick={onSave} className="flex items-center gap-2 px-5 py-3 rounded-xl cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C", boxShadow: "0 0 24px rgba(34,211,238,0.12), 0 2px 8px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.97 }}><Sparkles className="w-3.5 h-3.5" /> Get started</motion.button>
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.06)] text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.03)] transition-colors text-[13px]"
                  style={{ fontFamily: "var(--font-body)" }}>Tell me more</button>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={onAdjust} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><RotateCcw className="w-3 h-3" /> Adjust my answers</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Signup Overlay ─────────────────────────────────────────────────────────

function SignupOverlay({ onDismiss, onComplete }: { onDismiss: () => void; onComplete?: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <motion.div className="absolute inset-0"
        style={{ backdropFilter: "blur(16px)", background: "rgba(8,9,12,0.6)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />

      <motion.div className="relative z-10 w-full max-w-sm mx-4"
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.2 }}>
        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.25), rgba(179,255,59,0.15), rgba(34,211,238,0.08))" }}>
          <div className="rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: "linear-gradient(135deg, rgba(4,44,1,0.1) 0%, rgba(12,14,19,0.98) 30%)", boxShadow: "0 8px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <SophiaMark size={28} glowing />
              <div>
                <div className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Want to keep this?</div>
                <div className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>I'll remember everything.</div>
              </div>
            </div>
            <button onClick={() => onComplete?.()} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-[#1a1a1a] hover:bg-white/90 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" /><span className="text-[11px] text-[#6B7280]">or</span><div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" /></div>
            <input type="email" placeholder="Where should I send this?" className="w-full px-3.5 py-2.5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] text-[#E8E8ED] placeholder:text-[#6B7280] focus:outline-none focus:border-[rgba(34,211,238,0.2)] text-[13px]" style={{ fontFamily: "var(--font-body)" }} />
            <button onClick={() => onComplete?.()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-[13px]" style={{ background: "linear-gradient(135deg, #22D3EE, #B3FF3B)", fontFamily: "var(--font-display)", fontWeight: 500, color: "#08090C" }}>
              <Sparkles className="w-3.5 h-3.5" /> Get started free
            </button>
            <p className="text-[11px] text-[#6B7280] text-center">Free. No catch.</p>
            <button onClick={onDismiss} className="text-[12px] text-[#374151] hover:text-[#6B7280] transition-colors cursor-pointer text-center" style={{ fontFamily: "var(--font-body)" }}>Maybe later</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main H3 ────────────────────────────────────────────────────────────────

export function OnboardingH3({ onComplete }: { onComplete?: (role?: string) => void } = {}) {
  const [step, setStep] = useState<Step>("intro");
  const [intent, setIntent] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupDismissed, setSignupDismissed] = useState(false);
  const [msgReady, setMsgReady] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const hist = useRef<Step[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<{ type: "sophia" | "user"; content: string; icon?: React.ReactNode }[]>([]);

  const go = useCallback((next: Step) => {
    setMsgReady(false);
    setStep(prev => { hist.current.push(prev); return next; });
  }, []);

  const back = useCallback(() => {
    const prev = hist.current.pop();
    if (!prev) return;
    if (prev === "intent") { setIntent(null); setSub(null); setTarget(null); setLevel(null); setHistory([]); }
    else if (prev === "sub") { setSub(null); setTarget(null); setLevel(null); setHistory(h => h.slice(0, 2)); }
    else if (prev === "target") { setTarget(null); setLevel(null); setHistory(h => h.slice(0, 4)); }
    else if (prev === "level") { setLevel(null); setHistory(h => h.slice(0, 6)); }
    setMsgReady(false);
    setStep(prev);
  }, []);

  const canBack = !["intro", "intent", "thinking", "roadmap"].includes(step);

  useEffect(() => { if (step === "intro") { const t = setTimeout(() => go("intent"), 2400); return () => clearTimeout(t); } }, [step, go]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 80);
    }
  }, [step, history, msgReady]);

  const handleIntent = (id: string) => {
    setIntent(id);
    const o = INTENTS.find(x => x.id === id)!;
    setTimeout(() => {
      setHistory(h => [...h, { type: "sophia", content: "Hey! I'm Sophia. What brings you to CareerEdge?" }, { type: "user", content: o.label, icon: o.icon }]);
      go("sub");
    }, 500);
  };

  const handleSub = (id: string) => {
    setSub(id);
    const o = SUBS[intent!]?.find(x => x.id === id)!;
    const q = intent === "career" ? "Got it — what kind of edge are you looking for?" : intent === "someone" ? "Who are you supporting?" : "Tell me about your organization.";
    setTimeout(() => {
      setHistory(h => [...h, { type: "sophia", content: q }, { type: "user", content: o.label, icon: o.icon }]);
      go("target");
    }, 500);
  };

  const handleTarget = (id: string) => {
    setTarget(id);
    const pc = sub ? PATH_CONFIGS[sub] : null;
    const o = pc?.targetOpts.find(x => x.id === id) || TARGETS.find(x => x.id === id)!;
    const q = pc?.targetQ || "What field are you aiming for?";
    setTimeout(() => {
      setHistory(h => [...h, { type: "sophia", content: q }, { type: "user", content: o.label, icon: o.icon }]);
      go("level");
    }, 450);
  };

  const handleLevel = (id: string) => {
    setLevel(id);
    const pc = sub ? PATH_CONFIGS[sub] : null;
    const o = pc?.levelOpts.find(x => x.id === id) || LEVELS.find(x => x.id === id)!;
    const q = pc?.levelQ || "Where are you in your journey?";
    setTimeout(() => {
      setHistory(h => [...h, { type: "sophia", content: q }, { type: "user", content: o.label, icon: o.icon }]);
      go("thinking");
    }, 450);
  };

  const handleEditChange = useCallback((field: "intent" | "sub" | "target" | "level", value: string) => {
    if (field === "intent") { setIntent(value); setSub(null); setTarget(null); setLevel(null); }
    else if (field === "sub") { setSub(value); setTarget(null); setLevel(null); }
    else if (field === "target") { setTarget(value); }
    else if (field === "level") { setLevel(value); }
  }, []);

  const pathConfig = sub ? PATH_CONFIGS[sub] : null;
  const phases = target ? (sub === "edgepreneur" ? makeEntrepreneurPhases(target) : makePhases(target)) : [];

  const sophiaCopy = {
    intent: "Hey! I'm Sophia. What brings you to CareerEdge?",
    sub: intent === "career" ? "Got it — what kind of edge are you looking for?" : intent === "someone" ? "Who are you supporting?" : "Tell me about your organization.",
    target: pathConfig?.targetQ || "What field are you aiming for?",
    level: pathConfig?.levelQ || "Where are you in your journey?",
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ backgroundColor: "#08090C" }}>
      {/* Background — clean void */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(34,211,238,0.03) 0%, transparent 70%)" }} />
        {/* Subtle topo lines from Figma — very low opacity for H3 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1099 851" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.008 }}>
          <path d={topoSvgPaths.p338f9380} fill="none" stroke="#22D3EE" strokeOpacity="0.6" strokeWidth="1.16" />
          <path d={topoSvgPaths.p3e16f200} fill="none" stroke="#22D3EE" strokeOpacity="0.6" strokeWidth="1.16" />
          <path d={topoSvgPaths.p21888e60} fill="none" stroke="#042C01" strokeOpacity="0.6" strokeWidth="1.16" />
          <path d={topoSvgPaths.p2d0f2fc0} fill="none" stroke="#042C01" strokeOpacity="0.6" strokeWidth="1.16" />
        </svg>
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }} />
      </div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-2">
          {canBack && (
            <motion.button onClick={back} className="flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors cursor-pointer mr-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.95 }} style={{ fontFamily: "var(--font-body)" }}>
              <RotateCcw className="w-3 h-3" /> Redo
            </motion.button>
          )}
          <SophiaMark size={20} glowing={false} />
          <span className="text-[13px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
          <span className="flex items-center gap-1 text-[10px] text-[#22D3EE] bg-[rgba(34,211,238,0.08)] px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" /> Online
          </span>
        </div>
        <span className="text-[10px] tracking-[0.15em] text-[#1F2937]" style={{ fontFamily: "var(--font-display)" }}>CAREEREDGE</span>
      </div>

      {/* Chat stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-xl mx-auto px-5 py-6 flex flex-col gap-4">
          {/* History (dimmed) */}
          {history.map((msg, i) => (
            <div key={i} style={{ opacity: 0.4 }}>
              {msg.type === "sophia" ? <SophiaMsgStatic text={msg.content} /> : <UserBubble text={msg.content} icon={msg.icon} />}
            </div>
          ))}

          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" className="flex flex-col items-center justify-center py-24 gap-6" exit={{ opacity: 0, y: -16, transition: { duration: 0.4 } }}>
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}>
                  <SophiaMark size={72} glowing />
                </motion.div>
                <motion.p className="text-[#6B7280] text-center text-sm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5, ease: EASE_CONTENT }} style={{ fontFamily: "var(--font-body)" }}>
                  Starting conversation...
                </motion.p>
              </motion.div>
            )}

            {step === "intent" && (
              <motion.div key="intent" className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SophiaMsg text={sophiaCopy.intent} typingMs={800} onReady={() => setMsgReady(true)} />
                {msgReady && <OptionChips options={INTENTS} onSelect={handleIntent} />}
              </motion.div>
            )}

            {step === "sub" && intent && (
              <motion.div key="sub" className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SophiaMsg text={sophiaCopy.sub} typingMs={700} onReady={() => setMsgReady(true)} />
                {msgReady && <OptionChips options={SUBS[intent] || []} onSelect={handleSub} />}
              </motion.div>
            )}

            {step === "target" && (
              <motion.div key="target" className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SophiaMsg text={sophiaCopy.target} typingMs={600} onReady={() => setMsgReady(true)} />
                {msgReady && <OptionChips options={pathConfig?.targetOpts || TARGETS} onSelect={handleTarget} />}
              </motion.div>
            )}

            {step === "level" && (
              <motion.div key="level" className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SophiaMsg text={sophiaCopy.level} typingMs={600} onReady={() => setMsgReady(true)} />
                {msgReady && <OptionChips options={pathConfig?.levelOpts || LEVELS} onSelect={handleLevel} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Thinking overlay — blurs chat, centers thinking bubble */}
      <AnimatePresence>
        {step === "thinking" && target && pathConfig && (
          <ThinkingOverlay target={target} pathConfig={pathConfig} onDone={() => {
            setStep(p => { hist.current.push(p); return "roadmap"; });
          }} />
        )}
      </AnimatePresence>

      {/* Result overlay — roadmap for career paths, dashboard for others */}
      <AnimatePresence>
        {step === "roadmap" && pathConfig && (
          pathConfig.resultType === "roadmap" ? (
            <RoadmapOverlay
              phases={phases}
              target={target!}
              onSave={() => setShowSignup(true)}
              onAdjust={() => setShowEditPanel(true)}
            />
          ) : (
            <DashboardPreview
              pathConfig={pathConfig}
              target={target!}
              level={level!}
              onSave={() => setShowSignup(true)}
              onAdjust={() => setShowEditPanel(true)}
            />
          )
        )}
      </AnimatePresence>

      {/* Signup overlay */}
      <AnimatePresence>
        {showSignup && <SignupOverlay onDismiss={() => { setShowSignup(false); setSignupDismissed(true); }} onComplete={() => onComplete?.("edgestar")} />}
      </AnimatePresence>

      {/* Edit Answers Panel */}
      <AnimatePresence>
        {showEditPanel && intent && sub && target && level && pathConfig && (
          <EditAnswersPanel
            intent={intent}
            sub={sub}
            target={target}
            level={level}
            targetOptions={pathConfig.targetOpts}
            levelOptions={pathConfig.levelOpts}
            targetLabel={pathConfig.targetQ.replace("?", "").replace("What's your ", "").replace("What ", "").replace("Tell me about ", "")}
            levelLabel={pathConfig.levelQ.replace("?", "").replace("What's your ", "").replace("How ", "").replace("What ", "")}
            onClose={() => setShowEditPanel(false)}
            onChange={handleEditChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}