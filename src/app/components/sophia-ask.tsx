/**
 * Sophia "Ask" — Unified Float → Panel interaction
 *
 * Content block types (11 total):
 *   cards        — data cards (jobs, milestones, contacts)
 *   scorecard    — score with animated breakdown bars
 *   checklist    — actionable task list with toggleable checkboxes
 *   comparison   — side-by-side table
 *   timeline     — vertical timeline with status rail
 *   skillBars    — skill gap visualization with target markers
 *   document     — annotated highlights (fix/warn/good)
 *   draft        — editable text draft (cover letter, message, email)
 *   resources    — link list (courses, articles, tools)
 *   metric       — big stat with context (salary, progress)
 *   actionDone   — confirmation banner (task completed)
 *   followups    — contextual follow-up chips (always last)
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  Sparkles, ArrowRight, ArrowUpRight, X, Send,
  Mic, Maximize2, Minimize2,
  AlertCircle, FileText, Target, Zap,
  CheckCircle2, Circle, ExternalLink,
  Copy, BookOpen, DollarSign, TrendingUp,
  Check, Heart, RefreshCw, ChevronRight,
  Square, Radio,
} from "lucide-react";
import { EASE, COLORS, FONT, TEXT, SURFACE, GLASS_TINT } from "./tokens";

// ─── Voice ──────────────────────────────────────────────────────────────────

type VoiceMode = "off" | "listening" | "processing" | "speaking";

const DEMO_VOICE_PHRASES = [
  "Show me my job matches",
  "What should I focus on today?",
  "Review my resume",
  "Help me draft an outreach message",
  "What skills am I missing?",
];

// Deterministic waveform bar heights — golden angle distribution
const VOICE_BARS = Array.from({ length: 22 }, (_, i) => {
  const phase = (i * 137.5) % 360;
  return {
    peak: 5 + Math.abs(Math.sin((phase * Math.PI) / 180)) * 14 + 4,
    delay: i * 0.038,
    duration: 0.3 + (i % 5) * 0.055,
  };
});

// ─── Types ──────────────────────────────────────────────────────────────────

export type SophiaAskMode = "stretch" | "drawer" | "panel" | "float";

interface SophiaAskProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: SophiaAskMode;
  initialMessage?: string | null;
  onClearInitial?: () => void;
  onNavigate?: (target: string) => void;
  /** When true, voice mode starts automatically as soon as the panel opens */
  autoVoice?: boolean;
  onClearAutoVoice?: () => void;
}

interface CardData { title: string; subtitle: string; value: string; color: string; }
interface ScoreData { label: string; score: number; maxScore: number; color: string; }
interface CheckItem { label: string; checked: boolean; sub?: string; }
interface CompareColumn { header: string; items: string[]; highlight?: boolean; }
interface TimelineStep { label: string; detail: string; status: "done" | "current" | "upcoming"; duration?: string; }
interface SkillBarData { name: string; current: number; target: number; gap: string; }
interface DocHighlight { text: string; type: "good" | "warn" | "fix"; }
interface DraftData { title: string; recipientContext?: string; body: string; }
interface ResourceItem { title: string; source: string; type: "course" | "article" | "tool" | "video"; url?: string; }
interface MetricData { value: string; label: string; context: string; trend?: "up" | "down" | "flat"; color: string; }
interface FollowupChip { label: string; icon: "ask" | "navigate" | "action"; navTarget?: string; }

interface VoiceActionData {
  prompt: string;
  type: "choice" | "confirm";
  choices?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
}

interface Message {
  id: string;
  role: "user" | "sophia";
  text: string;
  cards?: CardData[];
  scorecard?: { title: string; totalScore: number; maxTotal: number; scores: ScoreData[] };
  checklist?: { title: string; items: CheckItem[] };
  comparison?: { title: string; columns: CompareColumn[] };
  timeline?: { title: string; steps: TimelineStep[] };
  skillBars?: { title: string; bars: SkillBarData[] };
  document?: { title: string; type: string; highlights: DocHighlight[] };
  draft?: DraftData;
  resources?: { title: string; items: ResourceItem[] };
  metric?: MetricData[];
  actionDone?: { message: string; detail?: string };
  action?: { label: string; type: "navigate" | "action" };
  followups?: FollowupChip[];
  voiceAction?: VoiceActionData;
}

// ─── Scenario Router ────────────────────────────────────────────────────────
// Keywords → scenario ID. Ordered by specificity (most specific first).

const ROUTE_TABLE: [string[], string][] = [
  // Resume
  [["review my resume", "resume review", "check my resume", "analyze my resume", "how is my resume", "resume score", "ats score", "ats"], "resume-review"],
  [["optimize resume", "improve resume", "fix resume", "tailor resume", "resume for figma", "customize resume"], "resume-optimize"],
  [["resume format", "resume template", "resume structure", "resume layout"], "resume-format"],
  [["what score would", "what's my score after", "score after fixes", "score if i fix"], "resume-score-after"],

  // Interview
  [["figma interview", "prep for figma", "figma design challenge"], "interview-figma"],
  [["interview prep", "start interview", "prepare for interview", "mock interview", "practice interview"], "interview-prep"],
  [["behavioral interview", "behavioral question", "tell me about a time"], "interview-behavioral"],
  [["design challenge", "whiteboard challenge", "take-home", "design exercise"], "interview-challenge"],
  [["what questions do they ask", "common interview questions", "frequently asked", "what do they ask"], "interview-common-questions"],
  [["structure my failure", "failure story", "tell me about a failure", "biggest mistake"], "interview-failure-story"],
  [["common follow-up", "follow-up questions", "followup questions"], "interview-followups"],
  [["give me a different prompt", "another prompt", "different challenge", "another challenge"], "interview-alt-prompt"],
  [["show me a framework", "design framework", "problem-solving framework"], "interview-framework"],

  // Jobs & applications
  [["view matches", "job matches", "new matches", "show matches", "my matches"], "jobs-matches"],
  [["help me apply", "apply to", "application strategy", "where should i apply", "which jobs"], "jobs-apply"],
  [["why is figma", "why figma", "top match", "best match"], "jobs-why-figma"],
  [["compare jobs", "compare roles", "compare positions", "compare these", "which role", "which job"], "jobs-compare"],
  [["save job", "bookmark job", "shortlist"], "jobs-save"],
  [["what gaps do i have", "my gaps", "where am i weak", "weaknesses for"], "jobs-gaps"],
  [["which maximizes growth", "best for growth", "growth opportunity", "career growth"], "jobs-growth"],
  [["vercel referral", "referral contact", "who do i know at", "show vercel"], "jobs-referral-contact"],

  // Roadmap & milestones
  [["open roadmap", "my roadmap", "show roadmap", "roadmap progress", "where am i"], "roadmap-progress"],
  [["why this milestone", "why this order", "milestone order", "why first"], "roadmap-why-order"],
  [["next milestone", "what's next", "upcoming milestone"], "roadmap-next"],
  [["adjust the schedule", "change the schedule", "reschedule", "move the deadline"], "roadmap-adjust"],

  // Daily focus & strategy
  [["focus today", "what should i focus", "what to do today", "today's priority", "today's plan", "priorities today", "what should i start"], "strategy-today"],
  [["this week", "weekly plan", "week ahead", "what this week"], "strategy-week"],
  [["am i on track", "my progress", "how am i doing", "progress update", "status update", "my wins", "show my progress"], "strategy-progress"],
  [["what if i skip", "skip a day", "miss a day", "fall behind"], "strategy-skip-day"],
  [["what's slowing me", "slowing me down", "blockers", "what's blocking"], "strategy-blockers"],
  [["compare to benchmark", "how do i compare", "benchmark", "where do i stand"], "strategy-benchmark"],

  // Skills
  [["what skills", "skill gap", "skills do i need", "missing skills", "skill assessment", "my skills"], "skills-gap"],
  [["learn design systems", "design system course", "learn figma", "improve figma", "more on design"], "skills-learn"],
  [["courses", "resources", "tutorials", "where to learn", "learning resources", "show me resources", "show video content", "video content only"], "skills-resources"],
  [["which jds need", "which jobs need", "which roles require"], "skills-jd-match"],
  [["time commitment", "how long will", "how many hours"], "skills-time-commitment"],

  // Networking
  [["help me network", "networking", "who should i reach out", "connections", "outreach strategy"], "network-strategy"],
  [["draft outreach", "write outreach", "outreach message", "reach out to", "linkedin message", "connection request", "draft outreach to"], "network-draft-outreach"],
  [["referral", "get a referral", "ask for referral", "warm intro", "referral stats"], "network-referral"],
  [["who are the recruiters", "recruiter data", "show recruiter", "active recruiters"], "network-recruiters"],
  [["cold outreach", "cold message", "cold email", "cold dm", "cold outreach tips"], "network-cold-tips"],
  [["already spoke with", "i spoke with", "had a conversation with", "talked to"], "network-already-spoke"],

  // Documents & drafting
  [["cover letter", "write cover letter", "draft cover letter", "cover letter for"], "draft-cover-letter"],
  [["linkedin summary", "linkedin headline", "linkedin bio", "optimize linkedin", "linkedin optimization", "linkedin profile"], "draft-linkedin"],
  [["thank you note", "thank you email", "follow up email", "follow-up email", "post-interview"], "draft-thankyou"],
  [["elevator pitch", "pitch myself", "introduce myself", "self introduction"], "draft-pitch"],
  [["make it shorter", "shorten it", "more concise", "too long"], "draft-shorter"],
  [["make it more personal", "more personal", "personalize it"], "draft-personal"],
  [["make it warmer", "warmer tone", "friendlier"], "draft-warmer"],
  [["make it more conversational", "more conversational", "less formal"], "draft-conversational"],
  [["adapt for a recruiter", "recruiter version", "for a recruiter"], "draft-recruiter"],
  [["when should i send", "best time to send", "timing for sending"], "draft-timing"],
  [["customize this more", "edit this", "change this draft"], "draft-customize"],

  // Salary & negotiation
  [["salary", "compensation", "how much", "pay range", "negotiate", "negotiation", "offer"], "salary-info"],
  [["what if they lowball", "lowball", "low offer", "below range"], "salary-lowball"],
  [["compare benefits", "benefits package", "equity vs salary", "total comp"], "salary-benefits"],

  // Emotional / stuck
  [["i'm stuck", "i am stuck", "stuck", "overwhelmed", "don't know what to do", "lost", "confused", "frustrated", "scared", "nervous", "anxious", "imposter", "imposter syndrome"], "emotional-stuck"],
  [["not getting responses", "no callbacks", "no interviews", "ghosted", "rejected", "rejection"], "emotional-rejection"],
  [["motivat", "keep going", "give up", "want to quit", "discouraged"], "emotional-motivation"],
  [["just help me with one thing", "one small thing", "baby step", "easiest thing"], "emotional-one-thing"],
  [["need a different approach", "different strategy", "try something else", "not working"], "emotional-different"],

  // Meta
  [["what can you do", "what can you help", "how can you help", "your capabilities", "what do you do"], "meta-capabilities"],
];

function routeQuery(text: string): string {
  const lower = text.toLowerCase();
  for (const [keywords, scenarioId] of ROUTE_TABLE) {
    if (keywords.some(k => lower.includes(k))) return scenarioId;
  }
  return "fallback";
}

// ─── Scenario Data ──────────────────────────────────────────────────────────

const SCENARIOS: Record<string, Message[]> = {

  // ── RESUME ─────────────────────────────────────────────

  "resume-review": [
    {
      id: "rr-1", role: "sophia",
      text: "I've analyzed your resume against your 5 saved job descriptions. Here's the breakdown:",
      scorecard: {
        title: "Resume Health", totalScore: 72, maxTotal: 100,
        scores: [
          { label: "ATS compatibility", score: 78, maxScore: 100, color: "var(--ce-lime)" },
          { label: "Keyword match", score: 65, maxScore: 100, color: "var(--ce-role-edgepreneur)" },
          { label: "Experience framing", score: 82, maxScore: 100, color: "var(--ce-lime)" },
          { label: "Impact quantification", score: 55, maxScore: 100, color: "var(--ce-status-error)" },
          { label: "Design role alignment", score: 80, maxScore: 100, color: "var(--ce-role-edgestar)" },
        ],
      },
    },
    {
      id: "rr-2", role: "sophia",
      text: "Your biggest gap is impact quantification — you describe what you did, not the measurable outcome. Here are the specific fixes:",
      document: {
        title: "Resume Annotations", type: "resume",
        highlights: [
          { text: '"Redesigned the onboarding flow" → "Redesigned onboarding flow, improving completion rate from 34% to 67% (+97%)"', type: "fix" },
          { text: '"Led design system work" → "Built and shipped design system adopted by 4 product teams, reducing component creation time by 60%"', type: "fix" },
          { text: '"Conducted user research" → Add sample size: "Conducted 23 user interviews across 3 segments"', type: "warn" },
          { text: '"Figma, Sketch, Adobe XD, Miro, Notion" → Tools section is strong, matches 5/5 target JDs', type: "good" },
        ],
      },
      followups: [
        { label: "Apply these fixes", icon: "action" },
        { label: "What score would fixes get me?", icon: "ask" },
        { label: "Show target JDs", icon: "navigate" },
      ],
    },
  ],

  "resume-optimize": [
    {
      id: "ro-1", role: "sophia",
      text: "I'll optimize for your top match: Product Designer at Figma (92% match). Here's what needs to change:",
      checklist: {
        title: "Figma PD Optimization", items: [
          { label: "Add 'design systems' keyword (appears 4x in JD)", checked: false, sub: "Missing entirely from your resume" },
          { label: "Quantify onboarding project impact", checked: false, sub: "'Redesigned onboarding' → needs conversion metrics" },
          { label: "Move Figma to first position in tools", checked: false, sub: "Signals primary tool proficiency" },
          { label: "Add collaborative language", checked: false, sub: "JD emphasizes 'cross-functional' 3 times" },
          { label: "Shorten summary to 2 lines", checked: false, sub: "Current 4 lines loses recruiter attention" },
        ],
      },
      followups: [
        { label: "Auto-apply all fixes", icon: "action" },
        { label: "Show the Figma JD", icon: "navigate" },
        { label: "What's my score after?", icon: "ask" },
      ],
    },
  ],

  "resume-format": [
    {
      id: "rf-1", role: "sophia",
      text: "For Product Designer roles, here's what the format should prioritize:",
      comparison: {
        title: "Resume Format — Best Practices",
        columns: [
          { header: "Section", items: ["Summary", "Experience", "Projects", "Skills", "Education"] },
          { header: "Your Current", items: ["4 lines, generic", "3 roles, no metrics", "Not included", "Tools list only", "Bottom, minimal"] },
          { header: "Recommended", items: ["2 lines, role-specific", "3 roles, impact-quantified", "2–3 case studies linked", "Tools + competencies", "Include relevant coursework"], highlight: true },
        ],
      },
      followups: [
        { label: "Rewrite my summary", icon: "action" },
        { label: "Add case study links", icon: "action" },
        { label: "See example resumes", icon: "navigate" },
      ],
    },
  ],

  // ── INTERVIEW ──────────────────────────────────────────

  "interview-prep": [
    {
      id: "ip-1", role: "sophia",
      text: "Based on your saved jobs, 4 of 5 companies use design challenge format. Here's a structured 5-day plan:",
      timeline: {
        title: "5-Day Interview Prep",
        steps: [
          { label: "Design challenge practice", detail: "2 timed exercises (45 min each)", status: "upcoming", duration: "Day 1–2" },
          { label: "Portfolio narrative", detail: "Structure 3 case studies: Problem → Process → Impact", status: "upcoming", duration: "Day 3" },
          { label: "System design", detail: "Practice designing a design system for a mid-stage startup", status: "upcoming", duration: "Day 4" },
          { label: "Mock interview + review", detail: "Full run-through with timed sections", status: "upcoming", duration: "Day 5" },
        ],
      },
    },
    {
      id: "ip-2", role: "sophia",
      text: "Want me to add this as milestones in your roadmap? I'll space it around your existing commitments and set daily 9am reminders.",
      followups: [
        { label: "Add to roadmap", icon: "action" },
        { label: "Adjust the schedule", icon: "ask" },
        { label: "What questions do they ask?", icon: "ask" },
      ],
    },
  ],

  "interview-figma": [
    {
      id: "if-1", role: "sophia",
      text: "Figma's design interview has 4 rounds. I pulled insights from 12 Glassdoor reviews and 3 public case studies from recent hires.",
      comparison: {
        title: "Figma Interview Rounds",
        columns: [
          { header: "Round", items: ["Portfolio Review", "Design Challenge", "Cross-functional", "Values & Culture"] },
          { header: "Duration", items: ["45 min", "60 min", "45 min", "30 min"] },
          { header: "Your Readiness", items: ["Strong", "Needs work", "Moderate", "Strong"], highlight: true },
        ],
      },
    },
    {
      id: "if-2", role: "sophia",
      text: "Design challenge is your weakest point. Figma challenges typically ask you to improve an existing product experience in 45 minutes. They're looking for structured thinking, not pixel perfection.",
      checklist: {
        title: "What Figma Looks For",
        items: [
          { label: "Structured approach (problem → constraints → exploration → solution)", checked: false, sub: "Talk through your process out loud" },
          { label: "User empathy in framing", checked: false, sub: "Start with 'who is this for' not 'what should it look like'" },
          { label: "Tradeoff articulation", checked: false, sub: "Show you can weigh options, not just pick one" },
          { label: "Figma proficiency", checked: false, sub: "Fast prototyping, auto-layout, components" },
        ],
      },
      followups: [
        { label: "Start practice challenge", icon: "action" },
        { label: "Show example submissions", icon: "navigate" },
        { label: "Prep my portfolio talk", icon: "action" },
      ],
    },
  ],

  "interview-behavioral": [
    {
      id: "ib-1", role: "sophia",
      text: "Based on your target companies, here are the 5 most common behavioral themes. I've mapped your experience to each:",
      comparison: {
        title: "Behavioral Interview Prep",
        columns: [
          { header: "Theme", items: ["Conflict resolution", "Leading without authority", "Ambiguous problems", "Cross-functional collab", "Failure & learning"] },
          { header: "Your Story", items: ["Design system pushback", "Onboarding redesign", "New market research", "Eng partnership on perf", "First portfolio review"], highlight: true },
          { header: "Strength", items: ["Strong", "Strong", "Needs structure", "Very strong", "Needs reframing"] },
        ],
      },
      followups: [
        { label: "Practice a question", icon: "action" },
        { label: "Help me structure my failure story", icon: "ask" },
        { label: "Common follow-up questions", icon: "ask" },
      ],
    },
  ],

  "interview-challenge": [
    {
      id: "ic-1", role: "sophia",
      text: "Let's practice a design challenge. I'll give you a prompt similar to what your target companies use, and we'll work through it in 45 minutes.",
      draft: {
        title: "Design Challenge Prompt",
        body: "Spotify wants to improve how users discover new podcasts. Currently, podcast discovery happens through search and homepage recommendations. Design an experience that helps users find podcasts related to their interests but outside their usual listening patterns.\n\nConstraints:\n• Mobile-first (iOS app)\n• Must integrate with existing Spotify UI patterns\n• Consider both new and power users\n• 45-minute time limit",
      },
    },
    {
      id: "ic-2", role: "sophia",
      text: "Before you start designing, I'd recommend spending the first 8 minutes on framing. Who is this for? What does success look like? What are you NOT solving? This is where most candidates differentiate themselves.",
      followups: [
        { label: "Start the timer", icon: "action" },
        { label: "Give me a different prompt", icon: "ask" },
        { label: "Show me a framework", icon: "ask" },
      ],
    },
  ],

  // ── JOBS ───────────────────────────────────────────────

  "jobs-matches": [
    {
      id: "jm-1", role: "sophia",
      text: "3 new matches since yesterday. Two are at companies you've saved.",
      cards: [
        { title: "Product Designer", subtitle: "Figma · San Francisco", value: "92%", color: "var(--ce-lime)" },
        { title: "UX Designer", subtitle: "Linear · Remote", value: "87%", color: "var(--ce-role-edgestar)" },
        { title: "Design Engineer", subtitle: "Vercel · Remote", value: "81%", color: "var(--ce-text-tertiary)" },
      ],
      followups: [
        { label: "Why is Figma my top match?", icon: "ask" },
        { label: "Compare these roles", icon: "ask" },
        { label: "Open EdgeMatch", icon: "navigate" },
      ],
      voiceAction: {
        prompt: "Figma's posting closes in 6 days. Want me to optimize your resume for it now?",
        type: "confirm",
        confirmLabel: "Yes, optimize for Figma",
        cancelLabel: "Show me all three first",
      },
    },
  ],

  "jobs-apply": [
    {
      id: "ja-1", role: "sophia",
      text: "Of your 23 matches, I'd prioritize 5 this week based on timing, fit, and your prep level:",
      cards: [
        { title: "Figma — Product Designer", subtitle: "Posting closes in 6 days", value: "Apply now", color: "var(--ce-lime)" },
        { title: "Linear — UX Designer", subtitle: "Rolling applications", value: "This week", color: "var(--ce-role-edgestar)" },
        { title: "Vercel — Design Engineer", subtitle: "Referral contact available", value: "This week", color: "var(--ce-role-edgestar)" },
        { title: "Notion — Product Designer", subtitle: "Posting is 2 weeks old", value: "Next week", color: "var(--ce-text-tertiary)" },
        { title: "Stripe — Design Systems", subtitle: "Needs portfolio update first", value: "After prep", color: "var(--ce-text-tertiary)" },
      ],
    },
    {
      id: "ja-2", role: "sophia",
      text: "Figma is urgent — 6 days left. Your resume is 92% matched but needs the impact quantification fixes. That's a 20-minute task.",
      followups: [
        { label: "Optimize resume for Figma", icon: "action" },
        { label: "Draft cover letter", icon: "action" },
        { label: "Show Vercel referral contact", icon: "ask" },
      ],
    },
  ],

  "jobs-why-figma": [
    {
      id: "jwf-1", role: "sophia",
      text: "Figma scores 92% because of 4 strong alignment signals:",
      cards: [
        { title: "Skill match", subtitle: "Figma proficiency + interaction design", value: "95%", color: "var(--ce-lime)" },
        { title: "Experience level", subtitle: "3–5 years required, you have 3.5", value: "90%", color: "var(--ce-lime)" },
        { title: "Culture signals", subtitle: "Portfolio-driven, collaborative", value: "88%", color: "var(--ce-role-edgestar)" },
        { title: "Location", subtitle: "SF-based, you're open to relocation", value: "100%", color: "var(--ce-lime)" },
      ],
      followups: [
        { label: "See the full JD", icon: "navigate" },
        { label: "What gaps do I have?", icon: "ask" },
        { label: "Start application", icon: "action" },
      ],
    },
  ],

  "jobs-compare": [
    {
      id: "jc-1", role: "sophia",
      text: "Here's how your top 3 matches compare across what matters most:",
      comparison: {
        title: "Role Comparison",
        columns: [
          { header: "Factor", items: ["Match score", "Salary range", "Growth potential", "Work style", "Interview difficulty", "Deadline"] },
          { header: "Figma", items: ["92%", "$145–175K", "High", "Hybrid (SF)", "Hard", "6 days"], highlight: true },
          { header: "Linear", items: ["87%", "$135–160K", "Very high", "Remote", "Medium", "Rolling"] },
          { header: "Vercel", items: ["81%", "$140–165K", "High", "Remote", "Medium", "2 weeks"] },
        ],
      },
      followups: [
        { label: "Which maximizes growth?", icon: "ask" },
        { label: "Apply to all three", icon: "action" },
        { label: "Salary negotiation tips", icon: "ask" },
      ],
    },
  ],

  "jobs-save": [
    {
      id: "js-1", role: "sophia",
      text: "Done — job saved to your shortlist.",
      actionDone: { message: "Job saved to shortlist", detail: "You now have 8 saved jobs. I'll track posting deadlines and notify you of changes." },
      followups: [
        { label: "View all saved jobs", icon: "navigate" },
        { label: "Set deadline reminders", icon: "action" },
      ],
    },
  ],

  // ── ROADMAP ────────────────────────────────────────────

  "roadmap-progress": [
    {
      id: "rp-1", role: "sophia",
      text: "Phase 1 — Foundation Building. 60% complete with 4 of 7 milestones done.",
      timeline: {
        title: "Phase 1 Progress",
        steps: [
          { label: "Resume audit", detail: "ATS score: 72 → 85", status: "done" },
          { label: "Portfolio review", detail: "3 case studies structured", status: "done" },
          { label: "Skills assessment", detail: "Figma, Research, Systems", status: "done" },
          { label: "LinkedIn profile setup", detail: "Basic profile complete", status: "done" },
          { label: "LinkedIn optimization", detail: "SEO + recruiter visibility", status: "current", duration: "~2 hours" },
          { label: "Networking outreach", detail: "10 target contacts identified", status: "upcoming" },
          { label: "Application strategy", detail: "Company prioritization", status: "upcoming" },
        ],
      },
      followups: [
        { label: "Why this order?", icon: "ask" },
        { label: "Am I on track?", icon: "ask" },
        { label: "Open EdgePath", icon: "navigate" },
      ],
    },
  ],

  "roadmap-why-order": [
    {
      id: "rwo-1", role: "sophia",
      text: "LinkedIn optimization comes before networking outreach because your target companies' recruiters check profiles before responding. The order creates a multiplier effect:",
      comparison: {
        title: "Sequence Impact",
        columns: [
          { header: "Approach", items: ["LinkedIn first → outreach", "Outreach first (cold)"] },
          { header: "Response Rate", items: ["~35%", "~12%"], highlight: true },
          { header: "Time to First Reply", items: ["2–3 days", "7–10 days"] },
        ],
      },
    },
    {
      id: "rwo-2", role: "sophia",
      text: "Build the asset before you use it. Every milestone is ordered so it amplifies the next one.",
      followups: [
        { label: "Start LinkedIn optimization", icon: "action" },
        { label: "Who are the recruiters?", icon: "ask" },
      ],
    },
  ],

  "roadmap-next": [
    {
      id: "rn-1", role: "sophia",
      text: "Your next milestone is LinkedIn optimization. Here's what it involves:",
      checklist: {
        title: "LinkedIn Optimization — Next Up",
        items: [
          { label: "Rewrite headline with role-specific keywords", checked: false, sub: "15 min · 'Product Designer | Design Systems | Figma'" },
          { label: "Optimize summary with achievement metrics", checked: false, sub: "20 min · I'll draft this for you" },
          { label: "Add featured section with case study links", checked: false, sub: "10 min · Use your portfolio URLs" },
          { label: "Update skills section for recruiter search", checked: false, sub: "5 min · Add 'Design Systems' and 'Prototyping'" },
          { label: "Request 2 recommendations", checked: false, sub: "5 min · I'll draft the ask message" },
        ],
      },
      followups: [
        { label: "Draft my LinkedIn summary", icon: "action" },
        { label: "Draft recommendation request", icon: "action" },
        { label: "Start now", icon: "action" },
      ],
    },
  ],

  // ── STRATEGY ───────────────────────────────────────────

  "strategy-today": [
    {
      id: "st-1", role: "sophia",
      text: "Based on your deadlines, momentum, and what will create the most impact — here's your stack for today:",
      checklist: {
        title: "Today's Priorities",
        items: [
          { label: "Finish LinkedIn headline + summary optimization", checked: false, sub: "45 min · highest leverage — 5 recruiters active this week" },
          { label: "Review 3 new job matches", checked: false, sub: "10 min · 2 at saved companies, 1 closing soon" },
          { label: "Complete Figma auto-layout exercise", checked: false, sub: "30 min · unlocks case study work tomorrow" },
        ],
      },
    },
    {
      id: "st-2", role: "sophia",
      text: "LinkedIn goes first because 5 recruiters at your target companies are active this week. Finishing before your outreach on Thursday triples response rate.",
      followups: [
        { label: "Start LinkedIn optimization", icon: "action" },
        { label: "Draft my LinkedIn summary", icon: "action" },
        { label: "Show the recruiter data", icon: "ask" },
      ],
    },
  ],

  "strategy-week": [
    {
      id: "sw-1", role: "sophia",
      text: "Here's your week mapped against your Phase 1 goals and application deadlines:",
      timeline: {
        title: "This Week's Plan",
        steps: [
          { label: "Monday–Tuesday", detail: "Complete LinkedIn optimization (current milestone)", status: "current", duration: "~2 hrs" },
          { label: "Wednesday", detail: "Review & respond to 3 job matches + start networking outreach", status: "upcoming", duration: "~1.5 hrs" },
          { label: "Thursday", detail: "Send 3 outreach messages (contacts prepped) + Figma exercise", status: "upcoming", duration: "~2 hrs" },
          { label: "Friday", detail: "Apply to Figma (deadline Sun) — resume + cover letter", status: "upcoming", duration: "~2 hrs" },
          { label: "Weekend", detail: "Portfolio case study polish (optional, high-impact)", status: "upcoming" },
        ],
      },
      followups: [
        { label: "Add this to my calendar", icon: "action" },
        { label: "Adjust the schedule", icon: "ask" },
        { label: "What if I skip a day?", icon: "ask" },
      ],
    },
  ],

  "strategy-progress": [
    {
      id: "sp-1", role: "sophia",
      text: "Here's your progress snapshot for this week:",
      metric: [
        { value: "60%", label: "Phase 1 Complete", context: "4 of 7 milestones done", trend: "up", color: "var(--ce-lime)" },
        { value: "3", label: "Applications Sent", context: "Goal: 5 this week", trend: "up", color: "var(--ce-role-edgestar)" },
        { value: "72", label: "ATS Score", context: "Up from 58 at start", trend: "up", color: "var(--ce-lime)" },
        { value: "5d", label: "Active Streak", context: "Longest: 8 days", trend: "up", color: "var(--ce-role-edgestar)" },
      ],
    },
    {
      id: "sp-2", role: "sophia",
      text: "You're ahead of schedule — most users at this phase are at 45% completion by this point. Your momentum on resume + portfolio is creating compound returns for the outreach phase.",
      followups: [
        { label: "What's slowing me down?", icon: "ask" },
        { label: "Compare to benchmark", icon: "ask" },
        { label: "Show full activity log", icon: "navigate" },
      ],
    },
  ],

  // ── SKILLS ─────────────────────────────────────────────

  "skills-gap": [
    {
      id: "sg-1", role: "sophia",
      text: "I've mapped your skills against requirements across your 5 saved Product Designer roles:",
      skillBars: {
        title: "Skill Gap Analysis",
        bars: [
          { name: "Figma / Design Tools", current: 70, target: 90, gap: "1 module left" },
          { name: "User Research", current: 55, target: 80, gap: "Biggest opportunity" },
          { name: "Design Systems", current: 45, target: 85, gap: "High priority" },
          { name: "Prototyping", current: 75, target: 80, gap: "Almost there" },
          { name: "Cross-functional collab", current: 80, target: 75, gap: "Exceeds target" },
          { name: "Data-informed design", current: 40, target: 70, gap: "Needs attention" },
        ],
      },
    },
    {
      id: "sg-2", role: "sophia",
      text: "Design Systems is your highest-leverage gap — it appears in 4 of 5 JDs and you're 40 points below target. Good news: your portfolio case study work this week directly builds this skill.",
      followups: [
        { label: "Create skill-building plan", icon: "action" },
        { label: "Which JDs need design systems?", icon: "ask" },
        { label: "Find courses", icon: "navigate" },
      ],
    },
  ],

  "skills-learn": [
    {
      id: "sl-1", role: "sophia",
      text: "Here's a focused learning path for your two biggest gaps — Design Systems and Data-informed Design:",
      timeline: {
        title: "2-Week Skill Sprint",
        steps: [
          { label: "Design Systems foundations", detail: "Figma tokens, component architecture, documentation", status: "upcoming", duration: "Week 1, Mon–Wed" },
          { label: "Build a mini system", detail: "Create 10 components with variants for your portfolio", status: "upcoming", duration: "Week 1, Thu–Fri" },
          { label: "Data-informed design intro", detail: "Learn to read analytics, set up success metrics", status: "upcoming", duration: "Week 2, Mon–Tue" },
          { label: "Case study integration", detail: "Add metrics sections to your portfolio case studies", status: "upcoming", duration: "Week 2, Wed–Fri" },
        ],
      },
      followups: [
        { label: "Add to roadmap", icon: "action" },
        { label: "Show me resources", icon: "navigate" },
        { label: "What's the time commitment?", icon: "ask" },
      ],
    },
  ],

  "skills-resources": [
    {
      id: "sr-1", role: "sophia",
      text: "Based on your skill gaps and learning style, here are my top picks:",
      resources: {
        title: "Curated Learning Resources",
        items: [
          { title: "Design Systems with Figma", source: "Figma · Free course", type: "course" },
          { title: "Practical Design Systems", source: "Smashing Magazine", type: "article" },
          { title: "Measuring Design Impact", source: "Google · Design Sprint", type: "video" },
          { title: "Component-Driven Development", source: "Storybook docs", type: "tool" },
          { title: "Design Metrics That Matter", source: "Julie Zhuo · Medium", type: "article" },
        ],
      },
      followups: [
        { label: "Save these to my plan", icon: "action" },
        { label: "More on design systems", icon: "ask" },
        { label: "Show video content only", icon: "ask" },
      ],
    },
  ],

  // ── NETWORKING ─────────────────────────────────────────

  "network-strategy": [
    {
      id: "ns-1", role: "sophia",
      text: "I've identified 10 contacts at your target companies. Here are the 3 highest-value connections:",
      cards: [
        { title: "Sarah Chen", subtitle: "Design Manager at Figma · 2nd connection", value: "High", color: "var(--ce-lime)" },
        { title: "Marcus Rivera", subtitle: "Sr. Designer at Linear · Same university", value: "High", color: "var(--ce-lime)" },
        { title: "Emily Park", subtitle: "Recruiter at Vercel · Actively hiring", value: "Direct", color: "var(--ce-role-edgestar)" },
      ],
    },
    {
      id: "ns-2", role: "sophia",
      text: "Sarah Chen is your strongest lead — she's a 2nd connection through your former colleague James. A warm intro is 5x more effective than a cold request.",
      followups: [
        { label: "Draft outreach to Sarah", icon: "action" },
        { label: "Show all 10 contacts", icon: "navigate" },
        { label: "Cold outreach tips", icon: "ask" },
      ],
    },
  ],

  "network-draft-outreach": [
    {
      id: "ndo-1", role: "sophia",
      text: "Here's a personalized outreach message for Sarah Chen at Figma. It references your mutual connection and is specifically not a job ask — it's a conversation starter:",
      draft: {
        title: "LinkedIn Message — Sarah Chen",
        recipientContext: "Design Manager at Figma · 2nd connection via James Park",
        body: "Hi Sarah,\n\nI came across your talk on Figma's design system evolution at Config — the way your team handled token architecture across platforms was exactly the problem I've been thinking about in my current work.\n\nI'm a product designer exploring my next role, and I'd love to hear how your team approaches design system adoption across product teams. James Park suggested I reach out — we worked together at [Company].\n\nWould you be open to a 15-minute chat sometime this week or next?\n\nBest,\nSharon",
      },
      followups: [
        { label: "Customize this more", icon: "ask" },
        { label: "Draft for Marcus Rivera", icon: "action" },
        { label: "Draft for Emily Park", icon: "action" },
      ],
    },
  ],

  "network-referral": [
    {
      id: "nr-1", role: "sophia",
      text: "Referral requests work best after at least one genuine conversation. Here's the sequence I'd recommend:",
      timeline: {
        title: "Referral Strategy",
        steps: [
          { label: "Send intro message", detail: "Conversation starter, not a job ask", status: "upcoming", duration: "Day 1" },
          { label: "Have a 15-min chat", detail: "Learn about their team, share your work", status: "upcoming", duration: "Day 3–5" },
          { label: "Follow up with value", detail: "Share a relevant article or insight", status: "upcoming", duration: "Day 7" },
          { label: "Ask about openings", detail: "Now you've built rapport — ask naturally", status: "upcoming", duration: "Day 10–14" },
        ],
      },
    },
    {
      id: "nr-2", role: "sophia",
      text: "The timeline feels slow, but referral hires have a 45% interview rate vs. 3% for cold applications. It's a 15x multiplier.",
      followups: [
        { label: "Start with Sarah Chen", icon: "action" },
        { label: "I already spoke with someone", icon: "ask" },
        { label: "Show referral stats", icon: "ask" },
      ],
    },
  ],

  // ── DRAFTING ───────────────────────────────────────────

  "draft-cover-letter": [
    {
      id: "dcl-1", role: "sophia",
      text: "Here's a cover letter tailored to the Figma Product Designer role. It maps your experience directly to their JD requirements:",
      draft: {
        title: "Cover Letter — Figma Product Designer",
        recipientContext: "Product Designer role · San Francisco · Posting closes in 6 days",
        body: "Dear Figma Design Team,\n\nI'm a product designer with 3.5 years of experience building design systems and interaction patterns that scale. Two things drew me to this role: Figma's commitment to making design accessible to everyone, and the specific challenge of evolving your design system across an expanding product surface.\n\nIn my current role, I built and shipped a design system adopted by 4 product teams, reducing component creation time by 60%. I also redesigned our onboarding flow, improving completion rates from 34% to 67%. These experiences directly map to what you're looking for — someone who can think systematically while keeping the user experience human.\n\nI'd love to discuss how my approach to component architecture and user research could contribute to Figma's next chapter.\n\nBest,\nSharon",
      },
      followups: [
        { label: "Make it shorter", icon: "ask" },
        { label: "Make it more personal", icon: "ask" },
        { label: "Adapt for Linear", icon: "action" },
      ],
    },
  ],

  "draft-linkedin": [
    {
      id: "dl-1", role: "sophia",
      text: "Here's an optimized LinkedIn headline and summary. The headline is keyword-loaded for recruiter search, and the summary tells your story in 3 lines:",
      draft: {
        title: "LinkedIn Profile Copy",
        body: "HEADLINE:\nProduct Designer | Design Systems · Interaction Design · User Research | Building experiences that scale\n\nSUMMARY:\nI design systems and experiences that make complex products feel simple. Over 3.5 years, I've built design systems adopted by 4+ product teams, redesigned onboarding flows that doubled completion rates, and conducted 50+ user interviews that shaped product strategy.\n\nCurrently exploring my next role — especially interested in teams where design systems and product thinking intersect. Open to SF-based or remote opportunities.",
      },
      followups: [
        { label: "Apply to my profile", icon: "action" },
        { label: "Add more keywords", icon: "ask" },
        { label: "Draft featured section", icon: "action" },
      ],
    },
  ],

  "draft-thankyou": [
    {
      id: "dty-1", role: "sophia",
      text: "Here's a thank-you email template. I've included a specific callback to something discussed — you'll want to personalize that part:",
      draft: {
        title: "Post-Interview Thank You",
        body: "Subject: Thank you — [Role] conversation\n\nHi [Name],\n\nThank you for taking the time to speak with me today about the [Role] position. I particularly enjoyed our conversation about [specific topic discussed — e.g., 'how your team approaches design system governance across product areas'].\n\nIt reinforced my excitement about the role — the challenge of [specific challenge mentioned] is exactly the kind of problem I love working on, and I believe my experience with [relevant experience] would translate well.\n\nPlease don't hesitate to reach out if you need any additional information. I look forward to hearing about next steps.\n\nBest,\nSharon",
      },
      followups: [
        { label: "Make it warmer", icon: "ask" },
        { label: "Make it shorter", icon: "ask" },
        { label: "When should I send this?", icon: "ask" },
      ],
    },
  ],

  "draft-pitch": [
    {
      id: "dp-1", role: "sophia",
      text: "Here's a 30-second elevator pitch structured as: who you are → what you do → what you're looking for → why it matters:",
      draft: {
        title: "Elevator Pitch",
        body: "I'm Sharon, a product designer with 3.5 years of experience focused on design systems and interaction design. I've built component systems used by 4 product teams and redesigned user flows that measurably improved engagement.\n\nRight now I'm looking for a role where I can combine systems thinking with hands-on product design — ideally at a company where the design team has real ownership over the product experience.\n\nWhat gets me most excited is the intersection of scalable design and user empathy — building things that work at scale without losing the human touch.",
      },
      followups: [
        { label: "Make it more conversational", icon: "ask" },
        { label: "Adapt for a recruiter", icon: "ask" },
        { label: "Practice delivering it", icon: "action" },
      ],
    },
  ],

  // ── SALARY ─────────────────────────────────────────────

  "salary-info": [
    {
      id: "sal-1", role: "sophia",
      text: "Based on your target roles, experience level, and location preferences — here's the market data:",
      metric: [
        { value: "$152K", label: "Median Base Salary", context: "Product Designer, 3–5 years, SF/Remote", trend: "up", color: "var(--ce-lime)" },
        { value: "$15–25K", label: "Equity Range", context: "Annual RSU grant at target companies", trend: "flat", color: "var(--ce-role-edgestar)" },
        { value: "$8–15K", label: "Signing Bonus", context: "Common at Figma, Vercel, Stripe", trend: "flat", color: "var(--ce-role-edgestar)" },
      ],
    },
    {
      id: "sal-2", role: "sophia",
      text: "Your range should be $145–175K base. Here's the negotiation framework I'd recommend:",
      comparison: {
        title: "Negotiation Strategy",
        columns: [
          { header: "Stage", items: ["Initial ask", "Counter offer", "Final leverage"] },
          { header: "What to say", items: ["'I'm targeting $165–175K based on market data'", "'The role scope aligns with senior-level compensation'", "'I have other processes — can we finalize by [date]?'"], highlight: true },
          { header: "Why it works", items: ["Anchors high, shows research", "Reframes from title to impact", "Creates urgency without ultimatum"] },
        ],
      },
      followups: [
        { label: "Practice negotiation", icon: "action" },
        { label: "What if they lowball?", icon: "ask" },
        { label: "Compare benefits packages", icon: "ask" },
      ],
    },
  ],

  // ── EMOTIONAL / SUPPORT ────────────────────────────────

  "emotional-stuck": [
    {
      id: "es-1", role: "sophia",
      text: "That feeling is completely normal — and it's actually a signal that you care about this. Let me help you get unstuck with one small move.",
    },
    {
      id: "es-2", role: "sophia",
      text: "Here's what I've noticed about your progress that you might be overlooking:",
      metric: [
        { value: "4", label: "Milestones Completed", context: "More than 75% of users at this stage", trend: "up", color: "var(--ce-lime)" },
        { value: "72", label: "ATS Score", context: "Started at 58 — that's real progress", trend: "up", color: "var(--ce-role-edgestar)" },
        { value: "3", label: "Applications Sent", context: "Ahead of your weekly goal", trend: "up", color: "var(--ce-lime)" },
      ],
    },
    {
      id: "es-3", role: "sophia",
      text: "You don't need a big move right now. Pick one thing that takes less than 15 minutes — momentum comes from motion, not motivation.",
      checklist: {
        title: "Small Wins (Under 15 min)",
        items: [
          { label: "Review one new job match", checked: false, sub: "2 min · just read it, no pressure to apply" },
          { label: "Update one resume bullet with metrics", checked: false, sub: "5 min · pick the easiest one" },
          { label: "Save one interesting company to your list", checked: false, sub: "1 min · browsing counts as progress" },
        ],
      },
      followups: [
        { label: "Just help me with one thing", icon: "ask" },
        { label: "Show my progress this week", icon: "ask" },
        { label: "I need a different approach", icon: "ask" },
      ],
    },
  ],

  "emotional-rejection": [
    {
      id: "er-1", role: "sophia",
      text: "Rejection stings, and I won't pretend otherwise. But here's the data that might reframe it:",
      metric: [
        { value: "3%", label: "Cold Application Rate", context: "Average interview conversion for cold apps", trend: "flat", color: "var(--ce-text-tertiary)" },
        { value: "35%", label: "Warm Outreach Rate", context: "With optimized profile + referral", trend: "up", color: "var(--ce-lime)" },
        { value: "12–15", label: "Average Applications", context: "Before landing an offer in your field", trend: "flat", color: "var(--ce-role-edgestar)" },
      ],
    },
    {
      id: "er-2", role: "sophia",
      text: "You're 3 applications in — statistically, you're exactly where you should be. The question isn't whether you'll get there, it's whether we can improve your conversion rate so it takes fewer tries. Let's look at what we can tighten:",
      followups: [
        { label: "Review my resume", icon: "ask" },
        { label: "Try warm outreach", icon: "action" },
        { label: "Help me debrief a rejection", icon: "ask" },
      ],
    },
  ],

  "emotional-motivation": [
    {
      id: "em-1", role: "sophia",
      text: "I want to show you something. Here's where you were when you started vs. where you are now:",
      comparison: {
        title: "Your Progress — Then vs. Now",
        columns: [
          { header: "Area", items: ["Resume", "Portfolio", "Skills mapped", "Target companies", "Network contacts", "Applications"] },
          { header: "Day 1", items: ["Unreviewed", "No structure", "0 assessed", "0 identified", "0 identified", "0 sent"], highlight: false },
          { header: "Today", items: ["72 ATS score", "3 case studies", "6 skills mapped", "5 companies saved", "10 contacts found", "3 sent"], highlight: true },
        ],
      },
    },
    {
      id: "em-2", role: "sophia",
      text: "You've built more foundation in two weeks than most people do in two months. The hard part isn't the work — it's trusting the process when results haven't arrived yet. They will.",
      followups: [
        { label: "What should I focus on today?", icon: "ask" },
        { label: "Show me my wins this week", icon: "ask" },
        { label: "I'm ready to keep going", icon: "action" },
      ],
    },
  ],

  // ── META ───────────────────────────────────────────────

  "meta-capabilities": [
    {
      id: "mc-1", role: "sophia",
      text: "I'm your career strategy partner. Here's everything I can help with:",
      comparison: {
        title: "What I Can Do",
        columns: [
          { header: "Category", items: ["Resume & docs", "Interview prep", "Job search", "Skills", "Networking", "Strategy", "Drafting"] },
          { header: "Examples", items: [
            "Review, optimize, tailor, format",
            "Mock interviews, challenges, behavioral prep",
            "Find matches, compare, apply, track deadlines",
            "Gap analysis, learning paths, resources",
            "Find contacts, draft outreach, referral strategy",
            "Daily focus, weekly plans, progress tracking",
            "Cover letters, LinkedIn, pitches, thank-you notes",
          ], highlight: true },
        ],
      },
      followups: [
        { label: "What should I start with?", icon: "ask" },
        { label: "Review my resume", icon: "ask" },
        { label: "Show my progress", icon: "ask" },
      ],
    },
  ],

  // ── RESUME FOLLOW-UPS ────────────────────────────────────

  "resume-score-after": [
    {
      id: "rsa-1", role: "sophia",
      text: "If you apply all 3 fixes I flagged, here's the projected change:",
      metric: [
        { value: "89", label: "Projected ATS Score", context: "Up from 72 — a 17-point jump", trend: "up", color: "var(--ce-lime)" },
        { value: "85", label: "Keyword Match", context: "Up from 65 — adding impact metrics helps", trend: "up", color: "var(--ce-role-edgestar)" },
        { value: "80", label: "Impact Quantification", context: "Up from 55 — biggest improvement area", trend: "up", color: "var(--ce-lime)" },
      ],
      followups: [
        { label: "Apply these fixes", icon: "action" },
        { label: "Which fix matters most?", icon: "ask" },
        { label: "Open resume", icon: "navigate" },
      ],
    },
  ],

  // ── INTERVIEW FOLLOW-UPS ───────────────────────────────

  "interview-common-questions": [
    {
      id: "icq-1", role: "sophia",
      text: "Based on Figma's interview process and similar Product Designer roles, here are the most common questions grouped by round:",
      checklist: {
        title: "Likely Questions by Round",
        items: [
          { label: "Portfolio walkthrough: 'Walk me through a project where you had to make hard tradeoffs'", checked: false, sub: "Round 1 — Almost guaranteed" },
          { label: "Systems thinking: 'How would you approach building a component library from scratch?'", checked: false, sub: "Round 2 — Design systems focus" },
          { label: "Cross-functional: 'Tell me about working with a PM who disagreed with your approach'", checked: false, sub: "Round 2–3 — Collaboration signal" },
          { label: "Impact: 'What's a design decision you made that measurably moved a metric?'", checked: false, sub: "Round 1–2 — Data-informed design" },
          { label: "Culture: 'What does good design collaboration look like to you?'", checked: false, sub: "Final round — Values alignment" },
        ],
      },
      followups: [
        { label: "Practice a question", icon: "action" },
        { label: "Help me structure my failure story", icon: "ask" },
        { label: "Start interview prep", icon: "action" },
      ],
    },
  ],

  "interview-failure-story": [
    {
      id: "ifs-1", role: "sophia",
      text: "Great instinct — the failure question trips people up because they either pick something too small or spiral into self-deprecation. Here's a framework:",
      comparison: {
        title: "STAR+ Framework for Failure Stories",
        columns: [
          { header: "Element", items: ["Situation", "Task", "Action", "Result", "+ Learning"] },
          { header: "Your Story", items: ["New market research project, unfamiliar domain", "Lead research for product expansion", "Relied on assumptions instead of user interviews", "Recommendations missed the mark, delayed launch 3 weeks", "Now always start with 5 quick user calls before strategy"], highlight: true },
        ],
      },
      followups: [
        { label: "Practice delivering it", icon: "action" },
        { label: "Common follow-up questions", icon: "ask" },
        { label: "What questions do they ask?", icon: "ask" },
      ],
    },
  ],

  "interview-followups": [
    {
      id: "ifu-1", role: "sophia",
      text: "After your main answers, interviewers typically probe deeper. Here are the follow-ups they'll ask and what they're really testing:",
      checklist: {
        title: "Common Follow-up Probes",
        items: [
          { label: "'What would you do differently?' — Testing self-awareness", checked: false, sub: "Have 1 genuine thing you'd change. Don't say 'nothing'" },
          { label: "'How did you measure success?' — Testing analytical thinking", checked: false, sub: "Always tie back to a metric, even qualitative ones" },
          { label: "'Who pushed back and how did you handle it?' — Testing resilience", checked: false, sub: "Show you adapted, not that you 'won'" },
          { label: "'What was the timeline?' — Testing execution speed", checked: false, sub: "Be specific — vagueness reads as padding" },
        ],
      },
      followups: [
        { label: "Practice a question", icon: "action" },
        { label: "Start interview prep", icon: "action" },
      ],
    },
  ],

  "interview-alt-prompt": [
    {
      id: "iap-1", role: "sophia",
      text: "Here's a different design challenge prompt, calibrated to Figma's style — they tend to focus on systems and scale:",
      draft: {
        title: "Design Challenge Prompt",
        body: "PROMPT: Design a notification system for a collaborative design tool used by teams of 5-50 people.\n\nCONSTRAINTS:\n- Users work across time zones\n- Some notifications are urgent (someone requesting review), some are ambient (comment on old file)\n- Mobile and desktop\n- Must not interrupt deep focus work\n\nTIME: 45 minutes\nDELIVERABLE: Flows, key screens, and a brief write-up of your approach",
      },
      followups: [
        { label: "Start the timer", icon: "action" },
        { label: "Show me a framework", icon: "ask" },
        { label: "Give me a different prompt", icon: "ask" },
      ],
    },
  ],

  "interview-framework": [
    {
      id: "ifr-1", role: "sophia",
      text: "Here's the framework I recommend for design challenges. Most candidates jump to UI — this will set you apart:",
      timeline: {
        title: "45-Minute Design Challenge Framework",
        steps: [
          { label: "Frame (8 min)", detail: "Who, what problem, success metrics, constraints, what you're NOT solving", status: "upcoming", duration: "8 min" },
          { label: "Explore (10 min)", detail: "3 rough directions, tradeoff analysis, pick one and justify", status: "upcoming", duration: "10 min" },
          { label: "Design (17 min)", detail: "Key flows, 3-4 screens, interaction notes, edge cases", status: "upcoming", duration: "17 min" },
          { label: "Polish & Present (10 min)", detail: "Clean up, add annotations, prep your narrative", status: "upcoming", duration: "10 min" },
        ],
      },
      followups: [
        { label: "Start practice challenge", icon: "action" },
        { label: "Give me a different prompt", icon: "ask" },
      ],
    },
  ],

  // ── JOBS FOLLOW-UPS ────────────────────────────────────

  "jobs-gaps": [
    {
      id: "jg-1", role: "sophia",
      text: "Comparing your profile against Figma's JD, here's where you're strong and where the gaps are:",
      skillBars: {
        title: "Gap Analysis — Figma Product Designer",
        bars: [
          { label: "Design Systems", current: 60, target: 90, color: "var(--ce-status-error)" },
          { label: "Prototyping", current: 85, target: 80, color: "var(--ce-lime)" },
          { label: "User Research", current: 75, target: 80, color: "var(--ce-role-edgepreneur)" },
          { label: "Cross-functional Collab", current: 82, target: 85, color: "var(--ce-role-edgestar)" },
          { label: "Data-Informed Design", current: 45, target: 70, color: "var(--ce-status-error)" },
        ],
      },
      followups: [
        { label: "Create skill-building plan", icon: "action" },
        { label: "How do I close the gap fast?", icon: "ask" },
        { label: "Compare these roles", icon: "ask" },
      ],
    },
  ],

  "jobs-growth": [
    {
      id: "jgr-1", role: "sophia",
      text: "Looking at career trajectory, not just the role itself:",
      comparison: {
        title: "Growth Potential Comparison",
        columns: [
          { header: "Factor", items: ["Team size to lead", "Promotion timeline", "Skill stretch", "Industry cachet", "Exit options"] },
          { header: "Figma", items: ["8-12 designers", "18-24 months to Senior", "High — design systems at scale", "Tier 1", "Exceptional"], highlight: true },
          { header: "Linear", items: ["3-5 designers", "12-18 months", "Very high — small team, high ownership", "Rising star", "Strong for startups"] },
          { header: "Vercel", items: ["5-8 designers", "18-24 months", "High — design engineering hybrid", "Tier 1 in dev tools", "Strong"] },
        ],
      },
      followups: [
        { label: "Which maximizes compensation?", icon: "ask" },
        { label: "Start application", icon: "action" },
        { label: "Open EdgeMatch", icon: "navigate" },
      ],
    },
  ],

  "jobs-referral-contact": [
    {
      id: "jrc-1", role: "sophia",
      text: "I found a connection path to Vercel through your network:",
      cards: [
        { title: "Emily Park", subtitle: "Design Recruiter at Vercel · Active on LinkedIn", value: "Direct", color: "var(--ce-lime)" },
        { title: "Marcus Rivera", subtitle: "Senior Designer at Vercel · 2nd connection via your university network", value: "Warm", color: "var(--ce-role-edgestar)" },
      ],
      followups: [
        { label: "Draft outreach to Sarah", icon: "action" },
        { label: "Draft for Marcus Rivera", icon: "action" },
        { label: "Draft for Emily Park", icon: "action" },
      ],
    },
  ],

  // ── ROADMAP FOLLOW-UPS ─────────────────────────────────

  "roadmap-adjust": [
    {
      id: "ra-1", role: "sophia",
      text: "What needs to change? Here's your current timeline — tell me what to shift:",
      timeline: {
        title: "Current Schedule",
        steps: [
          { label: "LinkedIn optimization", detail: "Currently due today", status: "active", duration: "~2 hrs" },
          { label: "Networking outreach", detail: "Thursday", status: "upcoming", duration: "~1.5 hrs" },
          { label: "Figma application", detail: "Friday (deadline Sunday)", status: "upcoming", duration: "~2 hrs" },
          { label: "Portfolio polish", detail: "Weekend (optional)", status: "upcoming" },
        ],
      },
      followups: [
        { label: "Push everything back 1 day", icon: "action" },
        { label: "What's the highest priority?", icon: "ask" },
        { label: "What if I skip a day?", icon: "ask" },
      ],
    },
  ],

  // ── STRATEGY FOLLOW-UPS ────────────────────────────────

  "strategy-skip-day": [
    {
      id: "ssd-1", role: "sophia",
      text: "Missing one day won't derail you — but which day matters. Here's the impact:",
      comparison: {
        title: "Skip Day Impact Analysis",
        columns: [
          { header: "Day", items: ["Today (LinkedIn)", "Thursday (Outreach)", "Friday (Figma app)"] },
          { header: "Impact", items: ["Low — push to tomorrow, recruiters still active", "Medium — delays warm intros by 3-5 days", "High — Figma deadline is Sunday, no buffer"], highlight: true },
          { header: "Recovery", items: ["Easy — 30 min tomorrow morning", "Moderate — rebook for Monday", "Difficult — rush or miss deadline"] },
        ],
      },
      followups: [
        { label: "Adjust the schedule", icon: "ask" },
        { label: "What should I focus on today?", icon: "ask" },
      ],
    },
  ],

  "strategy-blockers": [
    {
      id: "sb-1", role: "sophia",
      text: "Looking at your activity patterns, here's what I see:",
      metric: [
        { value: "2.3hrs", label: "Avg. daily active time", context: "Below the 3hr target for your phase", trend: "down", color: "var(--ce-role-edgepreneur)" },
        { value: "LinkedIn", label: "Biggest blocker", context: "Started 3 times, never finished — likely unclear on what to write", trend: "flat", color: "var(--ce-status-error)" },
        { value: "Resume", label: "Fastest completion", context: "You crushed the audit in one session", trend: "up", color: "var(--ce-lime)" },
      ],
      followups: [
        { label: "Start LinkedIn optimization", icon: "action" },
        { label: "Draft my LinkedIn summary", icon: "action" },
        { label: "What should I focus on today?", icon: "ask" },
      ],
    },
  ],

  "strategy-benchmark": [
    {
      id: "sbm-1", role: "sophia",
      text: "Here's how you compare to other CareerEdge users at the same phase:",
      comparison: {
        title: "Your Progress vs. Benchmark",
        columns: [
          { header: "Metric", items: ["Phase completion", "Resume score", "Applications sent", "Network contacts", "Daily active time"] },
          { header: "You", items: ["60%", "72/100", "12", "3", "2.3 hrs/day"], highlight: true },
          { header: "Avg User", items: ["45%", "65/100", "8", "2", "1.8 hrs/day"] },
          { header: "Top 10%", items: ["80%", "85/100", "18", "8", "3.5 hrs/day"] },
        ],
      },
      followups: [
        { label: "How do I reach top 10%?", icon: "ask" },
        { label: "What should I focus on today?", icon: "ask" },
        { label: "Open EdgePath", icon: "navigate" },
      ],
    },
  ],

  // ── SKILLS FOLLOW-UPS ──────────────────────────────────

  "skills-jd-match": [
    {
      id: "sjm-1", role: "sophia",
      text: "Here's which of your target JDs specifically call out design systems skills:",
      checklist: {
        title: "Design Systems in Your Target JDs",
        items: [
          { label: "Figma — Product Designer", checked: true, sub: "Explicit: 'Experience building and maintaining design systems'" },
          { label: "Linear — UX Designer", checked: true, sub: "Implicit: 'Component-driven design approach'" },
          { label: "Vercel — Design Engineer", checked: true, sub: "Core requirement: 'Design system architecture'" },
          { label: "Intercom — UX Lead", checked: true, sub: "Mentioned: 'Scale design through systems thinking'" },
          { label: "Stripe — Product Designer", checked: false, sub: "Not mentioned — focus is on interaction design" },
        ],
      },
      followups: [
        { label: "Create skill-building plan", icon: "action" },
        { label: "Find courses", icon: "navigate" },
      ],
    },
  ],

  "skills-time-commitment": [
    {
      id: "stc-1", role: "sophia",
      text: "Here's the realistic time breakdown for the 2-week skill sprint:",
      metric: [
        { value: "14hrs", label: "Total Time", context: "Spread across 10 days — about 1.5 hrs/day", trend: "flat", color: "var(--ce-role-edgestar)" },
        { value: "6hrs", label: "Design Systems Focus", context: "Highest leverage — appears in 4 of 5 JDs", trend: "up", color: "var(--ce-lime)" },
        { value: "4hrs", label: "Data-Informed Design", context: "Second priority — weak spot in your portfolio", trend: "up", color: "var(--ce-role-edgepreneur)" },
      ],
      followups: [
        { label: "Add to roadmap", icon: "action" },
        { label: "Can I do it in 1 week?", icon: "ask" },
        { label: "Add this to my calendar", icon: "action" },
      ],
    },
  ],

  // ── NETWORKING FOLLOW-UPS ──────────────────────────────

  "network-recruiters": [
    {
      id: "nrc-1", role: "sophia",
      text: "I've identified 5 active recruiters at your target companies who've posted or engaged in the last 7 days:",
      cards: [
        { title: "Emily Park", subtitle: "Design Recruiter, Vercel · Posted 2 days ago", value: "Active", color: "var(--ce-lime)" },
        { title: "David Kim", subtitle: "Talent Partner, Figma · Engaged yesterday", value: "Active", color: "var(--ce-lime)" },
        { title: "Lisa Chen", subtitle: "Recruiting Lead, Linear · Posted 4 days ago", value: "Active", color: "var(--ce-role-edgestar)" },
      ],
      followups: [
        { label: "Draft outreach to Sarah", icon: "action" },
        { label: "Cold outreach tips", icon: "ask" },
        { label: "Help me network", icon: "ask" },
      ],
    },
  ],

  "network-cold-tips": [
    {
      id: "nct-1", role: "sophia",
      text: "Cold outreach works when it's short, specific, and gives them a reason to respond. Here's the formula:",
      checklist: {
        title: "Cold Outreach Checklist",
        items: [
          { label: "Lead with their work, not your ask", checked: false, sub: "Reference something specific they shipped or wrote" },
          { label: "One question, not a life story", checked: false, sub: "Ask something they can answer in 2 sentences" },
          { label: "Under 80 words total", checked: false, sub: "Longer messages get ignored — respect their time" },
          { label: "No attachments on first contact", checked: false, sub: "Resume/portfolio comes after they respond" },
          { label: "Follow up once after 5 days", checked: false, sub: "Short: 'Just bumping this — no worries if not the right time'" },
        ],
      },
      followups: [
        { label: "Draft outreach to Sarah", icon: "action" },
        { label: "Help me network", icon: "ask" },
      ],
    },
  ],

  "network-already-spoke": [
    {
      id: "nas-1", role: "sophia",
      text: "That's great — tell me who you spoke with and how it went, and I'll help you figure out the best follow-up. In the meantime, here's the general post-conversation playbook:",
      checklist: {
        title: "Post-Conversation Next Steps",
        items: [
          { label: "Send thank-you within 24 hours", checked: false, sub: "Reference one specific thing from the conversation" },
          { label: "Connect on LinkedIn with a note", checked: false, sub: "If not already connected" },
          { label: "Add their referral suggestion to your tracker", checked: false, sub: "Did they mention anyone else to talk to?" },
          { label: "Update your outreach log", checked: false, sub: "I'll track this for your network analytics" },
        ],
      },
      followups: [
        { label: "Draft a thank-you note", icon: "ask" },
        { label: "Who should I talk to next?", icon: "ask" },
      ],
    },
  ],

  // ── DRAFT FOLLOW-UPS ───────────────────────────────────

  "draft-shorter": [
    {
      id: "ds-1", role: "sophia",
      text: "Shortened — I cut it to the essential signal. Every sentence now earns its place:",
      actionDone: { message: "Draft shortened", detail: "Removed 40% of the text. Core message preserved, fluff eliminated." },
      followups: [
        { label: "Make it more personal", icon: "ask" },
        { label: "Show me the result", icon: "ask" },
      ],
    },
  ],

  "draft-personal": [
    {
      id: "dp-1", role: "sophia",
      text: "I've added specific references to their recent work and your shared context. The message now reads like it could only be from you, to them.",
      actionDone: { message: "Draft personalized", detail: "Added 2 specific references — their Config talk and your shared design systems interest." },
      followups: [
        { label: "Make it shorter", icon: "ask" },
        { label: "When should I send this?", icon: "ask" },
      ],
    },
  ],

  "draft-warmer": [
    {
      id: "dw-1", role: "sophia",
      text: "Adjusted the tone — more conversational, less transactional. Kept the professionalism but added genuine warmth.",
      actionDone: { message: "Tone adjusted", detail: "Softened the opening, added a personal note, replaced formal phrasing with natural language." },
      followups: [
        { label: "Make it shorter", icon: "ask" },
        { label: "When should I send this?", icon: "ask" },
      ],
    },
  ],

  "draft-conversational": [
    {
      id: "dc-1", role: "sophia",
      text: "Rewrote it to sound like you'd actually say it out loud. No stiff phrasing, no corporate-speak.",
      actionDone: { message: "Tone updated", detail: "Replaced formal constructions with natural speech patterns. Reads like a real conversation now." },
      followups: [
        { label: "Practice delivering it", icon: "action" },
        { label: "Adapt for a recruiter", icon: "ask" },
      ],
    },
  ],

  "draft-recruiter": [
    {
      id: "drc-1", role: "sophia",
      text: "Recruiter version — shorter, more direct, leads with what they care about (role fit + availability):",
      draft: {
        title: "Recruiter-Adapted Version",
        body: "Hi [Name],\n\nI'm a product designer with 3.5 years in design systems and interaction design — your [Role] posting caught my eye because it maps closely to my recent work building a component system used by 4 product teams.\n\nI'd love to chat if you think there's a fit. Happy to share my portfolio.\n\nBest,\nSharon",
      },
      followups: [
        { label: "Make it shorter", icon: "ask" },
        { label: "When should I send this?", icon: "ask" },
      ],
    },
  ],

  "draft-timing": [
    {
      id: "dt-1", role: "sophia",
      text: "Timing matters more than people think. Here's the data:",
      metric: [
        { value: "Tue–Thu", label: "Best Days", context: "Response rates are 23% higher midweek", trend: "up", color: "var(--ce-lime)" },
        { value: "9–11am", label: "Best Time", context: "Their timezone — catch them during morning email triage", trend: "up", color: "var(--ce-role-edgestar)" },
        { value: "5 days", label: "Follow-up Window", context: "Wait 5 business days before a gentle bump", trend: "flat", color: "var(--ce-text-tertiary)" },
      ],
      followups: [
        { label: "Set a reminder to send", icon: "action" },
        { label: "Draft a follow-up", icon: "ask" },
      ],
    },
  ],

  "draft-customize": [
    {
      id: "dcu-1", role: "sophia",
      text: "What would you like to change? I can adjust tone, length, focus, or specific details. Or tell me what feels off and I'll fix it.",
      followups: [
        { label: "Make it shorter", icon: "ask" },
        { label: "Make it more personal", icon: "ask" },
        { label: "Make it warmer", icon: "ask" },
      ],
    },
  ],

  // ── SALARY FOLLOW-UPS ──────────────────────────────────

  "salary-lowball": [
    {
      id: "sl-1", role: "sophia",
      text: "If they come in below your range, don't panic. Most first offers have 10-20% room. Here's your playbook:",
      checklist: {
        title: "Lowball Response Strategy",
        items: [
          { label: "Don't react immediately — say 'Thank you, I'd like to review the full package'", checked: false, sub: "Buys you 24-48 hours to prepare" },
          { label: "Ask for the full comp breakdown in writing", checked: false, sub: "Base, bonus, equity, benefits, signing bonus" },
          { label: "Counter with data: 'Based on market data for this role, I was expecting $X–Y range'", checked: false, sub: "Use Levels.fyi, Glassdoor, and your CareerEdge salary data" },
          { label: "Negotiate non-salary if base is firm: equity, signing bonus, review cycle", checked: false, sub: "Some companies have strict bands but flexible equity" },
        ],
      },
      followups: [
        { label: "Practice negotiation", icon: "action" },
        { label: "Compare benefits packages", icon: "ask" },
      ],
    },
  ],

  "salary-benefits": [
    {
      id: "sben-1", role: "sophia",
      text: "Total compensation is more than base salary. Here's how your target companies stack up:",
      comparison: {
        title: "Benefits & Total Comp Comparison",
        columns: [
          { header: "Benefit", items: ["Base salary", "Annual bonus", "Equity (4yr)", "Health insurance", "401k match", "Learning budget", "Remote flexibility"] },
          { header: "Figma", items: ["$155-170K", "15%", "$120-200K", "Premium", "4%", "$5,000/yr", "Hybrid SF"], highlight: true },
          { header: "Linear", items: ["$135-160K", "None", "$80-150K", "Premium", "None", "$2,500/yr", "Fully remote"] },
          { header: "Vercel", items: ["$140-165K", "10%", "$100-180K", "Standard", "3%", "$3,000/yr", "Fully remote"] },
        ],
      },
      followups: [
        { label: "Which has the best total comp?", icon: "ask" },
        { label: "Help me negotiate", icon: "ask" },
      ],
    },
  ],

  // ── EMOTIONAL FOLLOW-UPS ───────────────────────────────

  "emotional-one-thing": [
    {
      id: "eot-1", role: "sophia",
      text: "Perfect. One thing. Here's the single highest-impact task you can do right now — it takes 5 minutes and moves three metrics:",
      checklist: {
        title: "Your One Thing",
        items: [
          { label: "Update your top resume bullet with one metric", checked: false, sub: "5 min · Turn 'Redesigned onboarding' into 'Redesigned onboarding, improving completion 34% → 67%'" },
        ],
      },
    },
    {
      id: "eot-2", role: "sophia",
      text: "That's it. One sentence, one number. It improves your ATS score, your interview talking points, AND your confidence. Want to do it now?",
      followups: [
        { label: "Start now", icon: "action" },
        { label: "Show me the full list", icon: "ask" },
        { label: "I did it!", icon: "ask" },
      ],
    },
  ],

  "emotional-different": [
    {
      id: "ed-1", role: "sophia",
      text: "Fair. If the current plan isn't clicking, let's figure out why and adjust. Usually it's one of three things:",
      cards: [
        { title: "The tasks feel too big", subtitle: "Solution: break into 10-min chunks", value: "Common", color: "var(--ce-role-edgestar)" },
        { title: "The order feels wrong", subtitle: "Solution: resequence around your energy", value: "Common", color: "var(--ce-role-edgestar)" },
        { title: "The goal feels unclear", subtitle: "Solution: reconnect with your 'why'", value: "Less common", color: "var(--ce-text-tertiary)" },
      ],
      followups: [
        { label: "Break things into smaller steps", icon: "ask" },
        { label: "What should I focus on today?", icon: "ask" },
        { label: "Adjust the schedule", icon: "ask" },
      ],
    },
  ],

  // ── FALLBACK ───────────────────────────────────────────

  "fallback": [
    {
      id: "fb-1", role: "sophia",
      text: "I'm not sure I have a specific playbook for that yet — but I can still help. Here's what I do have context on that might be useful:",
      cards: [
        { title: "Your resume", subtitle: "ATS score 72 · 3 fixes pending", value: "Review", color: "var(--ce-role-edgestar)" },
        { title: "Job matches", subtitle: "3 new since yesterday · 1 closing soon", value: "View", color: "var(--ce-lime)" },
        { title: "Next milestone", subtitle: "LinkedIn optimization · ~2 hours", value: "Start", color: "var(--ce-lime)" },
      ],
      followups: [
        { label: "What should I focus on today?", icon: "ask" },
        { label: "Review my resume", icon: "ask" },
        { label: "What can you help with?", icon: "ask" },
      ],
    },
  ],
};

function getResponses(text: string): Message[] {
  const scenarioId = routeQuery(text);
  return SCENARIOS[scenarioId] || SCENARIOS["fallback"];
}

function shouldAutoExpand(query: string): boolean {
  const deepRoutes = ["resume-review", "resume-optimize", "resume-format", "interview-prep", "interview-figma", "interview-behavioral", "interview-challenge", "skills-gap", "skills-learn", "jobs-apply", "jobs-compare", "network-strategy", "network-draft-outreach", "network-referral", "draft-cover-letter", "draft-linkedin", "draft-thankyou", "draft-pitch", "salary-info", "emotional-stuck", "emotional-rejection", "emotional-motivation", "meta-capabilities", "strategy-week"];
  const id = routeQuery(query);
  return deepRoutes.includes(id);
}

// ─── Empty State — 3 contextual chips ───────────────────────────────────────

const CONTEXT_CHIPS = [
  { label: "What should I focus on today?", icon: "ask" as const, sub: "Based on your deadlines" },
  { label: "Review my resume", icon: "ask" as const, sub: "ATS score 72 · 3 fixes" },
  { label: "Help me apply to jobs", icon: "ask" as const, sub: "3 new matches · 1 closing soon" },
];

// ─── Navigation & Action Maps ───────────────────────────────────────────────

const NAV_MAP: Record<string, string> = {
  "Open EdgeMatch": "jobs",
  "Open EdgePath": "roadmap",
  "Show target JDs": "jobs",
  "View all saved jobs": "jobs",
  "See example resumes": "resume",
  "See the full JD": "jobs",
  "Show full activity log": "home",
  "View all 23": "jobs",
  "Open resume": "resume",
  "Show example submissions": "roadmap",
  "Show the Figma JD": "jobs",
  "Find courses": "roadmap",

  "Show all 10 contacts": "messages",
  "Show my progress this week": "home",
  "Show me resources": "roadmap",
};

const ACTION_MAP: Record<string, { message: string; detail?: string }> = {
  "Apply these fixes": { message: "Resume fixes applied", detail: "3 bullet points updated with impact metrics. ATS score recalculating..." },
  "Auto-apply all fixes": { message: "All optimizations applied", detail: "5 changes made to your resume. New ATS score: 89 (+17)" },
  "Add to roadmap": { message: "Added to your roadmap", detail: "New milestone created in Phase 1. Due date set based on your schedule." },
  "Add this to my calendar": { message: "Added to calendar", detail: "5 sessions scheduled across this week with 9am reminders." },
  "Start now": { message: "Let's go!", detail: "I've opened your LinkedIn profile editor. Follow the checklist above." },
  "Apply to my profile": { message: "LinkedIn profile updated", detail: "Headline and summary applied. Changes may take a few hours to index." },
  "Save these to my plan": { message: "Resources saved to your plan", detail: "5 resources added to your learning path in EdgePath." },
  "Start the timer": { message: "Timer started — 45 minutes", detail: "I'll check in at the halfway point and give you a 5-minute warning." },
  "Start practice challenge": { message: "Challenge started", detail: "Timer is running. I'll stay here to answer questions as you work." },
  "Set deadline reminders": { message: "Reminders set", detail: "You'll get notifications 3 days and 1 day before each posting closes." },
  "Start interview prep": { message: "Interview prep mode activated", detail: "I've added the 5-day plan to your roadmap. Day 1 starts tomorrow." },
  "Start with Sarah Chen": { message: "Outreach sequence started", detail: "I've drafted your intro message. Review it above and send when ready." },
  "Try warm outreach": { message: "Switching to warm outreach", detail: "I've identified 3 warm contacts. Let's start with the strongest lead." },
  "Draft for Marcus Rivera": { message: "Draft ready for Marcus", detail: "Personalized for Linear. Referencing your shared university." },
  "Draft for Emily Park": { message: "Draft ready for Emily", detail: "Direct recruiter message for Vercel. Referencing the Design Engineer role." },
  "Adapt for Linear": { message: "Cover letter adapted", detail: "Updated for UX Designer at Linear. Emphasizing remote collaboration." },
  "I'm ready to keep going": { message: "That's the spirit!", detail: "Daily priorities refreshed. Let's pick up where you left off." },
  "Start application": { message: "Application started", detail: "Opening Figma's application page. Resume and cover letter ready." },
  "Apply to all three": { message: "Application batch started", detail: "Preparing tailored resumes. Starting with Figma (deadline in 6 days)." },
  "Rewrite my summary": { message: "Summary rewritten", detail: "New 2-line summary optimized for Product Designer roles." },
  "Add case study links": { message: "Case study section added", detail: "3 case study links formatted with titles and descriptions." },
  "Prep my portfolio talk": { message: "Portfolio talk prep started", detail: "I've created a structure for your 3 strongest case studies." },
  "Start LinkedIn optimization": { message: "LinkedIn optimization started", detail: "Opening your LinkedIn profile. Follow the checklist step by step." },
  "Draft my LinkedIn summary": { message: "Draft ready", detail: "See the optimized headline and summary above. Copy when ready." },
  "Draft recommendation request": { message: "Recommendation request drafted", detail: "Personalized message for your former manager. See above." },
  "Create skill-building plan": { message: "Skill plan created", detail: "2-week sprint added to your roadmap. Starting with Design Systems." },
  "Add to calendar": { message: "Added to calendar", detail: "Sessions scheduled with daily reminders." },
  "Optimize resume for Figma": { message: "Optimizing for Figma", detail: "Applying 5 JD-specific changes. See checklist above." },
  "Draft cover letter": { message: "Cover letter drafted", detail: "Tailored to Figma Product Designer. Review above." },
  "Practice a question": { message: "Practice mode started", detail: "I'll ask you a question, then give feedback on your answer. Ready?" },
  "Draft outreach to Sarah": { message: "Draft ready", detail: "Personalized LinkedIn message for Sarah Chen. See the draft above." },
  "Draft featured section": { message: "Featured section drafted", detail: "3 featured items: top case study, design systems article, and a project highlight." },
  "Practice delivering it": { message: "Practice mode started", detail: "Read your pitch aloud, then I'll give you feedback on clarity and pacing." },
  "Practice negotiation": { message: "Negotiation practice started", detail: "I'll play the hiring manager. Start with your ask when you're ready." },
  "Push everything back 1 day": { message: "Schedule shifted", detail: "All deadlines moved back 1 day. Figma app now due Saturday (still before Sunday deadline)." },
  "Set a reminder to send": { message: "Reminder set", detail: "I'll remind you Tuesday at 9am — optimal send time." },
};

// ─── Content Block Renderers ────────────────────────────────────────────────

function ScoreCardBlock({ data }: { data: NonNullable<Message["scorecard"]> }) {
  return (
    <motion.div className="rounded-xl p-4 mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[22px] tabular-nums" style={{ color: data.totalScore >= 80 ? "var(--ce-lime)" : data.totalScore >= 60 ? "var(--ce-role-edgepreneur)" : "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{data.totalScore}</span>
          <span className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>/{data.maxTotal}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.scores.map((s, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{s.label}</span>
              <span className="text-[10px] tabular-nums" style={{ color: s.color, fontFamily: "var(--font-body)" }}>{s.score}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
              <motion.div className="h-full rounded-full" style={{ background: s.color }} initial={{ width: 0 }} animate={{ width: `${(s.score / s.maxScore) * 100}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: EASE }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ChecklistBlock({ data }: { data: NonNullable<Message["checklist"]> }) {
  const [items, setItems] = useState(data.items);
  const toggle = (idx: number) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, checked: !it.checked } : it));

  return (
    <motion.div className="rounded-xl p-4 mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <span className="text-[11px] text-[var(--ce-text-tertiary)] block mb-2.5" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
      <div className="flex flex-col gap-0.5">
        {items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)} className="flex items-start gap-2.5 px-2 py-2 rounded-lg text-left cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.02)]">
            <div className="mt-0.5 flex-shrink-0">
              {item.checked ? <CheckCircle2 className="w-4 h-4 text-ce-lime" /> : <Circle className="w-4 h-4 text-[var(--ce-text-quaternary)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[12px] block ${item.checked ? "text-[var(--ce-text-secondary)] line-through" : "text-[var(--ce-text-primary)]"}`} style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
              {item.sub && <span className="text-[10px] text-[var(--ce-text-quaternary)] block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{item.sub}</span>}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ComparisonBlock({ data }: { data: NonNullable<Message["comparison"]> }) {
  const rowCount = data.columns[0]?.items.length || 0;
  return (
    <motion.div className="rounded-xl overflow-hidden mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>{data.columns.map((col, ci) => <th key={ci} className="px-3 py-2 text-left"><span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>{col.header}</span></th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, ri) => (
              <tr key={ri} style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
                {data.columns.map((col, ci) => (
                  <td key={ci} className="px-3 py-2">
                    <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: col.highlight ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)" }}>{col.items[ri]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function TimelineBlock({ data }: { data: NonNullable<Message["timeline"]> }) {
  return (
    <motion.div className="rounded-xl p-4 mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <span className="text-[11px] text-[var(--ce-text-tertiary)] block mb-3" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
      <div className="flex flex-col gap-0">
        {data.steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center w-4 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: step.status === "done" ? "var(--ce-lime)" : step.status === "current" ? "var(--ce-role-edgestar)" : "rgba(var(--ce-glass-tint),0.08)", boxShadow: step.status === "current" ? "0 0 8px rgba(var(--ce-role-edgestar-rgb),0.4)" : "none" }} />
              {i < data.steps.length - 1 && <div className="w-px flex-1 min-h-[20px]" style={{ background: step.status === "done" ? "rgba(var(--ce-lime-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)" }} />}
            </div>
            <div className="pb-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] ${step.status === "done" ? "text-[var(--ce-text-secondary)]" : "text-[var(--ce-text-primary)]"}`} style={{ fontFamily: "var(--font-body)" }}>{step.label}</span>
                {step.duration && <span className="text-[9px] text-[var(--ce-text-quaternary)] px-1.5 py-0.5 rounded" style={{ background: "rgba(var(--ce-glass-tint),0.03)", fontFamily: "var(--font-body)" }}>{step.duration}</span>}
              </div>
              <span className="text-[10px] text-[var(--ce-text-quaternary)] block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SkillBarsBlock({ data }: { data: NonNullable<Message["skillBars"]> }) {
  return (
    <motion.div className="rounded-xl p-4 mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <span className="text-[11px] text-[var(--ce-text-tertiary)] block mb-3" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
      <div className="flex flex-col gap-2.5">
        {data.bars.map((bar, i) => {
          const exceeds = bar.current >= bar.target;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>{bar.name}</span>
                <span className="text-[9px]" style={{ color: exceeds ? "var(--ce-lime)" : "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>{bar.gap}</span>
              </div>
              <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                <div className="absolute top-0 bottom-0 w-px z-10" style={{ left: `${bar.target}%`, background: "rgba(var(--ce-glass-tint),0.15)" }} />
                <motion.div className="h-full rounded-full" style={{ background: exceeds ? "var(--ce-lime)" : bar.current >= bar.target * 0.8 ? "var(--ce-role-edgestar)" : "var(--ce-role-edgepreneur)" }} initial={{ width: 0 }} animate={{ width: `${bar.current}%` }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }} />
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-4 mt-1">
          <div className="flex items-center gap-1.5"><div className="w-2 h-1 rounded-full bg-[var(--ce-role-edgestar)]" /><span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Your level</span></div>
          <div className="flex items-center gap-1.5"><div className="w-px h-2.5" style={{ background: "rgba(var(--ce-glass-tint),0.15)" }} /><span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Target</span></div>
        </div>
      </div>
    </motion.div>
  );
}

function DocumentBlock({ data }: { data: NonNullable<Message["document"]> }) {
  const styles = {
    good: { icon: "var(--ce-lime)", bg: "rgba(var(--ce-lime-rgb),0.04)", border: "rgba(var(--ce-lime-rgb),0.08)", label: "Strong" },
    warn: { icon: "var(--ce-role-edgepreneur)", bg: "rgba(var(--ce-role-edgepreneur-rgb),0.04)", border: "rgba(var(--ce-role-edgepreneur-rgb),0.08)", label: "Improve" },
    fix:  { icon: "var(--ce-status-error)", bg: "rgba(var(--ce-status-error-rgb),0.04)", border: "rgba(var(--ce-status-error-rgb),0.08)", label: "Fix" },
  };
  return (
    <motion.div className="rounded-xl overflow-hidden mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <FileText className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
        <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {data.highlights.map((h, i) => {
          const s = styles[h.type];
          return (
            <div key={i} className="px-3 py-2.5 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div className="flex items-center gap-1.5 mb-1">
                {h.type === "good" && <CheckCircle2 className="w-3 h-3" style={{ color: s.icon }} />}
                {h.type === "warn" && <AlertCircle className="w-3 h-3" style={{ color: s.icon }} />}
                {h.type === "fix" && <Target className="w-3 h-3" style={{ color: s.icon }} />}
                <span className="text-[9px]" style={{ color: s.icon, fontFamily: "var(--font-body)", fontWeight: 500 }}>{s.label}</span>
              </div>
              <p className="text-[11px] text-[var(--ce-text-primary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{h.text}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DraftBlock({ data }: { data: NonNullable<Message["draft"]> }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(data.body).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div className="rounded-xl overflow-hidden mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-ce-cyan" />
          <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.04)]" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: copied ? "var(--ce-lime)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {data.recipientContext && (
        <div className="px-4 py-2" style={{ background: "rgba(var(--ce-glass-tint),0.01)", borderBottom: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
          <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{data.recipientContext}</span>
        </div>
      )}
      <div className="px-4 py-3">
        <pre className="text-[11px] text-[var(--ce-text-primary)] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>{data.body}</pre>
      </div>
    </motion.div>
  );
}

function ResourcesBlock({ data }: { data: NonNullable<Message["resources"]> }) {
  const typeIcons = { course: BookOpen, article: FileText, tool: Zap, video: TrendingUp };
  const typeColors = { course: "var(--ce-role-edgestar)", article: "var(--ce-text-secondary)", tool: "var(--ce-lime)", video: "var(--ce-role-edgepreneur)" };
  return (
    <motion.div className="rounded-xl p-4 mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      <span className="text-[11px] text-[var(--ce-text-tertiary)] block mb-2.5" style={{ fontFamily: "var(--font-body)" }}>{data.title}</span>
      <div className="flex flex-col gap-1.5">
        {data.items.map((item, i) => {
          const Icon = typeIcons[item.type];
          const color = typeColors[item.type];
          return (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.02)]" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.03)" }}>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{item.title}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{item.source}</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MetricBlock({ data }: { data: NonNullable<Message["metric"]> }) {
  return (
    <motion.div className="grid grid-cols-2 gap-2 mt-1" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
      {data.map((m, i) => (
        <div key={i} className="rounded-xl p-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[20px] tabular-nums" style={{ color: m.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{m.value}</span>
            {m.trend === "up" && <TrendingUp className="w-3 h-3 text-ce-lime" />}
          </div>
          <span className="text-[10px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{m.label}</span>
          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{m.context}</span>
        </div>
      ))}
    </motion.div>
  );
}

function ActionDoneBlock({ data }: { data: NonNullable<Message["actionDone"]> }) {
  return (
    <motion.div className="rounded-xl px-4 py-3 mt-1 flex items-start gap-3" style={{ background: "rgba(var(--ce-lime-rgb),0.04)", border: "1px solid rgba(var(--ce-lime-rgb),0.08)" }} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE }}>
      <CheckCircle2 className="w-4 h-4 text-ce-lime flex-shrink-0 mt-0.5" />
      <div>
        <span className="text-[12px] text-ce-lime block" style={{ fontFamily: "var(--font-body)" }}>{data.message}</span>
        {data.detail && <span className="text-[10px] text-[var(--ce-text-secondary)] block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{data.detail}</span>}
      </div>
    </motion.div>
  );
}

// ─── Voice Action Card ───────────────────────────────────────────────────────
// Surfaces inline in the chat feed when Sophia needs a decision during voice.
// Large touch-friendly targets — modality-aware.

function VoiceActionCard({ data, onResolve }: { data: VoiceActionData; onResolve: (choice: string) => void }) {
  const [resolved, setResolved] = useState<string | null>(null);

  const handleChoose = (choice: string) => {
    setResolved(choice);
    setTimeout(() => onResolve(choice), 400);
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden mt-1"
      style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ borderBottom: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
        <Radio className="w-3 h-3 text-ce-cyan" />
        <span className="text-[9px] text-ce-cyan" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}>VOICE ACTION</span>
      </div>

      <div className="px-3.5 py-3">
        <p className="text-[12px] text-[var(--ce-text-primary)] mb-3 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {data.prompt}
        </p>

        <AnimatePresence mode="wait">
          {resolved ? (
            <motion.div
              key="resolved"
              className="flex items-center gap-2 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle2 className="w-4 h-4 text-ce-lime" />
              <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>{resolved}</span>
            </motion.div>
          ) : data.type === "confirm" ? (
            <motion.div key="confirm" className="flex gap-2">
              <button
                onClick={() => handleChoose(data.confirmLabel || "Yes")}
                className="flex-1 py-2.5 rounded-lg text-[11px] cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "rgba(var(--ce-lime-rgb),0.1)", border: "1px solid rgba(var(--ce-lime-rgb),0.2)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}
              >
                {data.confirmLabel || "Yes"}
              </button>
              <button
                onClick={() => handleChoose(data.cancelLabel || "Not now")}
                className="flex-1 py-2.5 rounded-lg text-[11px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.04)] active:scale-[0.98]"
                style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              >
                {data.cancelLabel || "Not now"}
              </button>
            </motion.div>
          ) : (
            <motion.div key="choices" className="flex flex-col gap-1.5">
              {(data.choices || []).map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoose(choice)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-[11px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.06)] active:scale-[0.99]"
                  style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}
                >
                  {choice}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Voice Bar ───────────────────────────────────────────────────────────────
// Replaces InputBar when voice mode is active. Compact — doesn't take over the panel.

function VoiceBar({ mode, transcript, onStop }: {
  mode: Exclude<VoiceMode, "off">;
  transcript: string;
  onStop: () => void;
}) {
  const isListening = mode === "listening";
  const isProcessing = mode === "processing";
  const isSpeaking = mode === "speaking";
  const barColor = isSpeaking ? "var(--ce-role-edgestar)" : "var(--ce-lime)";

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
      style={{
        background: isSpeaking ? "rgba(var(--ce-role-edgestar-rgb),0.04)" : "rgba(var(--ce-lime-rgb),0.04)",
        border: `1px solid ${isSpeaking ? "rgba(var(--ce-role-edgestar-rgb),0.15)" : "rgba(var(--ce-lime-rgb),0.12)"}`,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {/* Label + transcript */}
      <div className="flex flex-col min-w-0" style={{ width: 70 }}>
        <span className="text-[9px] flex-shrink-0" style={{ color: barColor, fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
          {isListening ? "Listening" : isProcessing ? "Thinking…" : "Sophia"}
        </span>
        {transcript && (
          <span className="text-[9px] text-[var(--ce-text-secondary)] truncate block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
            "{transcript}"
          </span>
        )}
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-[2.5px] flex-1 justify-center" style={{ height: 26 }}>
        {VOICE_BARS.map((bar, i) => (
          <motion.div
            key={i}
            className="rounded-full flex-shrink-0"
            style={{ width: 2, background: barColor }}
            animate={isProcessing ? {
              height: [2, 4, 2],
              opacity: [0.15, 0.3, 0.15],
            } : {
              height: [2, bar.peak, 2],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: isProcessing ? 1.4 : bar.duration,
              repeat: Infinity,
              repeatType: "mirror",
              delay: isProcessing ? i * 0.05 : bar.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Stop button */}
      <button
        onClick={onStop}
        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-110 active:scale-95 flex-shrink-0"
        style={{ background: "rgba(var(--ce-status-error-rgb),0.1)", border: "1px solid rgba(var(--ce-status-error-rgb),0.2)" }}
        title="Stop"
      >
        <Square className="w-3 h-3" style={{ color: "var(--ce-status-error)", fill: "var(--ce-status-error)" }} />
      </button>
    </motion.div>
  );
}

function CardsBlock({ cards }: { cards: CardData[] }) {
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {cards.map((card, i) => (
        <motion.div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.25, ease: EASE }}>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{card.title}</span>
            <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{card.subtitle}</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full tabular-nums flex-shrink-0" style={{ background: `${card.color}15`, color: card.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{card.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function FollowupChips({ chips, onChipClick }: { chips: FollowupChip[]; onChipClick: (chip: FollowupChip) => void }) {
  const chipStyles = {
    ask: { bg: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "rgba(var(--ce-role-edgestar-rgb),0.1)", color: "var(--ce-role-edgestar)", Icon: Sparkles },
    action: { bg: "rgba(var(--ce-lime-rgb),0.06)", border: "rgba(var(--ce-lime-rgb),0.1)", color: "var(--ce-lime)", Icon: Zap },
    navigate: { bg: "rgba(var(--ce-glass-tint),0.03)", border: "rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", Icon: ExternalLink },
  };
  return (
    <motion.div className="flex flex-wrap gap-1.5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.25 }}>
      {chips.map((chip, i) => {
        const s = chipStyles[chip.icon];
        return (
          <button key={i} onClick={() => onChipClick(chip)} className="text-[10px] px-2.5 py-1 rounded-full cursor-pointer transition-all hover:brightness-125 flex items-center gap-1" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: "var(--font-body)" }}>
            <s.Icon className="w-2.5 h-2.5" />
            {chip.label}
          </button>
        );
      })}
    </motion.div>
  );
}

// ─── Message Renderer ──────────────────────────────────���────────────────────

function SophiaMessage({ message, onFollowup, onVoiceAction }: { message: Message; onFollowup: (chip: FollowupChip) => void; onVoiceAction?: (choice: string) => void }) {
  if (message.role === "user") {
    return (
      <motion.div className="flex justify-end mb-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
        <div className="max-w-[85%] px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
          <p className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>{message.text}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="flex justify-start mb-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
      <div className="max-w-[95%] flex gap-2.5">
        <div className="flex-shrink-0 mt-1"><SophiaMark size={16} glowing={false} /></div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
            <p className="text-[12px] text-[var(--ce-text-primary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{message.text}</p>
          </div>
          {message.cards && <CardsBlock cards={message.cards} />}
          {message.scorecard && <ScoreCardBlock data={message.scorecard} />}
          {message.checklist && <ChecklistBlock data={message.checklist} />}
          {message.comparison && <ComparisonBlock data={message.comparison} />}
          {message.timeline && <TimelineBlock data={message.timeline} />}
          {message.skillBars && <SkillBarsBlock data={message.skillBars} />}
          {message.document && <DocumentBlock data={message.document} />}
          {message.draft && <DraftBlock data={message.draft} />}
          {message.resources && <ResourcesBlock data={message.resources} />}
          {message.metric && <MetricBlock data={message.metric} />}
          {message.actionDone && <ActionDoneBlock data={message.actionDone} />}
          {message.voiceAction && onVoiceAction && (
            <VoiceActionCard data={message.voiceAction} onResolve={onVoiceAction} />
          )}
          {message.action && (
            <button onClick={() => onFollowup({ label: message.action!.label, icon: message.action!.type === "navigate" ? "navigate" : "action" })} className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors hover:brightness-125" style={{ background: message.action.type === "navigate" ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-lime-rgb),0.06)", border: `1px solid ${message.action.type === "navigate" ? "rgba(var(--ce-glass-tint),0.08)" : "rgba(var(--ce-lime-rgb),0.1)"}`, color: message.action.type === "navigate" ? "var(--ce-text-tertiary)" : "var(--ce-lime)", fontFamily: "var(--font-body)" }}>
              {message.action.label}
              {message.action.type === "navigate" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          )}
          {message.followups && <FollowupChips chips={message.followups} onChipClick={onFollowup} />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div className="flex items-center gap-2.5 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SophiaMark size={16} glowing={false} />
      <div className="flex gap-1 px-3 py-2.5 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
        {[0, 1, 2].map((i) => <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />)}
      </div>
    </motion.div>
  );
}

// ─── Input Bar ──────────────────────────────────────────────────────────────

function InputBar({ onSend, onVoiceStart }: { onSend: (text: string) => void; onVoiceStart: () => void }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSend = () => { if (!text.trim()) return; onSend(text.trim()); setText(""); };

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all" style={{ background: focused ? "rgba(var(--ce-glass-tint),0.05)" : "rgba(var(--ce-glass-tint),0.03)", border: `1px solid ${focused ? "rgba(var(--ce-role-edgestar-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.06)"}`, boxShadow: focused ? "0 0 20px rgba(var(--ce-role-edgestar-rgb),0.04)" : "none" }}>
      <SophiaMark size={16} glowing={false} />
      <input ref={inputRef} type="text" value={text} placeholder="Ask Sophia anything..." className="flex-1 bg-transparent text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] focus:outline-none" style={{ fontFamily: "var(--font-body)" }} onChange={(e) => setText(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
      <button
        onClick={onVoiceStart}
        className="px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-lime-rgb),0.06)] transition-colors group"
        style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        title="Talk to Sophia"
      >
        <Mic className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] group-hover:text-ce-lime transition-colors" />
      </button>
      <button onClick={handleSend} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all" style={{ background: text.trim() ? "rgba(var(--ce-role-edgestar-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${text.trim() ? "rgba(var(--ce-role-edgestar-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)"}` }}>
        <Send className={`w-3.5 h-3.5 ${text.trim() ? "text-ce-cyan" : "text-[var(--ce-text-quaternary)]"}`} />
      </button>
    </div>
  );
}

// ─── Conversation Engine ────────────────────────────────────────────────────

function useConversation(initialMessage: string | null | undefined, onClearInitial?: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasSentInitial = useRef(false);

  const sendMessage = useCallback((text: string) => {
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const responses = getResponses(text);
    let delay = 700;
    responses.forEach((resp, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { ...resp, id: `${resp.id}-${Date.now()}-${i}` }]);
        if (i === responses.length - 1) setIsTyping(false);
      }, delay);
      delay += 600;
    });
  }, []);

  const addActionDone = useCallback((userMsg: Message, confirmMsg: Message) => {
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, confirmMsg]);
      setIsTyping(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (initialMessage && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage(initialMessage);
      onClearInitial?.();
    }
  }, [initialMessage, sendMessage, onClearInitial]);

  const turnCount = messages.filter(m => m.role === "user").length;
  return { messages, isTyping, sendMessage, addActionDone, turnCount };
}

// ─── Main Export: Float → Panel ─────────────────────────────────────────────

export function SophiaAsk({ isOpen, onClose, initialMessage, onClearInitial, onNavigate, autoVoice, onClearAutoVoice }: SophiaAskProps) {
  const { messages, isTyping, sendMessage, addActionDone, turnCount } = useConversation(isOpen ? initialMessage : null, onClearInitial);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  // ── Voice state ────────────────────────────────────────────────────────────
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("off");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const voicePhraseIdx = useRef(0);
  const voiceTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearVoiceTimers = () => {
    voiceTimers.current.forEach(clearTimeout);
    voiceTimers.current = [];
  };

  const startVoice = () => {
    clearVoiceTimers();
    const phrase = DEMO_VOICE_PHRASES[voicePhraseIdx.current % DEMO_VOICE_PHRASES.length];
    voicePhraseIdx.current += 1;
    setVoiceMode("listening");
    setVoiceTranscript("");

    // Type out transcript character by character
    let charIdx = 0;
    const typeNext = () => {
      charIdx++;
      setVoiceTranscript(phrase.slice(0, charIdx));
      if (charIdx < phrase.length) {
        const t = setTimeout(typeNext, 55 + Math.random() * 40);
        voiceTimers.current.push(t);
      } else {
        // Auto-process after a beat
        const t = setTimeout(() => stopVoice(phrase), 1200);
        voiceTimers.current.push(t);
      }
    };
    const t = setTimeout(typeNext, 400);
    voiceTimers.current.push(t);
  };

  const stopVoice = (phraseOverride?: string) => {
    clearVoiceTimers();
    const finalPhrase = phraseOverride || voiceTranscript;
    if (!finalPhrase.trim()) { setVoiceMode("off"); return; }

    setVoiceMode("processing");
    const t1 = setTimeout(() => {
      sendMessage(finalPhrase);
      setVoiceMode("speaking");
      const t2 = setTimeout(() => {
        setVoiceMode("off");
        setVoiceTranscript("");
      }, 2800);
      voiceTimers.current.push(t2);
    }, 800);
    voiceTimers.current.push(t1);
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) { clearVoiceTimers(); setVoiceMode("off"); setVoiceTranscript(""); }
  }, [isOpen]);

  // Auto-voice: start listening immediately when triggered from mic button
  useEffect(() => {
    if (isOpen && autoVoice && voiceMode === "off") {
      const t = setTimeout(() => {
        startVoice();
        onClearAutoVoice?.();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, autoVoice]);

  const handleVoiceAction = (choice: string) => {
    sendMessage(choice);
  };

  useEffect(() => { if (initialMessage && shouldAutoExpand(initialMessage)) setExpanded(true); }, [initialMessage]);
  useEffect(() => { if (turnCount >= 3 && !expanded) setExpanded(true); }, [turnCount, expanded]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { if (!isOpen) setExpanded(false); }, [isOpen]);

  const handleFollowup = (chip: FollowupChip) => {
    // Navigate chips: close Sophia, navigate to target
    if (chip.icon === "navigate") {
      const target = chip.navTarget || NAV_MAP[chip.label];
      if (target && onNavigate) {
        onNavigate(target);
        onClose();
      }
      return;
    }

    // Action chips: show user message + actionDone confirmation
    if (chip.icon === "action") {
      const actionResult = ACTION_MAP[chip.label];
      if (actionResult) {
        // Show the user's action as a message
        const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: chip.label };
        const confirmMsg: Message = {
          id: `action-${Date.now()}`,
          role: "sophia",
          text: "",
          actionDone: actionResult,
        };
        addActionDone(userMsg, confirmMsg);
        return;
      }
      // No specific action result — fall through to ask behavior
    }

    // Ask chips (default): send as a conversational query
    if (shouldAutoExpand(chip.label) && !expanded) setExpanded(true);
    sendMessage(chip.label);
  };

  // Wrapper for text input (always treated as an ask)
  const handleTextSend = (text: string) => {
    if (shouldAutoExpand(text) && !expanded) setExpanded(true);
    sendMessage(text);
  };

  const emptyState = (
    <div className="flex flex-col items-center gap-5 py-8">
      <SophiaMark size={28} glowing />
      <div className="text-center px-4">
        <p className="text-[13px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Hey Sharon
        </p>
        <p className="text-[11px] text-[var(--ce-text-secondary)] max-w-[260px]" style={{ fontFamily: "var(--font-body)" }}>
          I'm tracking your roadmap, skills, and job matches. What do you need?
        </p>
      </div>
      <div className="flex flex-col gap-1.5 w-full max-w-[320px]">
        {CONTEXT_CHIPS.map((chip, i) => (
          <button key={i} onClick={() => handleFollowup(chip)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: chip.icon === "ask" ? "rgba(var(--ce-role-edgestar-rgb),0.06)" : "rgba(var(--ce-lime-rgb),0.06)", border: `1px solid ${chip.icon === "ask" ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-lime-rgb),0.1)"}` }}>
              {chip.icon === "ask" ? <Sparkles className="w-3.5 h-3.5 text-ce-cyan" /> : <Zap className="w-3.5 h-3.5 text-ce-lime" />}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{chip.label}</span>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{chip.sub}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );

  const body = (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3">
      {messages.length === 0 ? emptyState : (
        <>
          {messages.map((msg) => (
            <SophiaMessage
              key={msg.id}
              message={msg}
              onFollowup={handleFollowup}
              onVoiceAction={handleVoiceAction}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </>
      )}
    </div>
  );

  const input = (
    <div className="px-5 pb-4 pt-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
      <AnimatePresence mode="wait">
        {voiceMode !== "off" ? (
          <VoiceBar
            key="voice"
            mode={voiceMode}
            transcript={voiceTranscript}
            onStop={() => stopVoice()}
          />
        ) : (
          <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <InputBar onSend={handleTextSend} onVoiceStart={startVoice} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && !expanded && (
        <motion.div key="float" className="fixed z-50 flex flex-col" style={{ bottom: 72, right: 24, width: 400, maxHeight: "65vh", background: "var(--ce-surface-overlay)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)", borderRadius: 20, backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(var(--ce-shadow-tint),0.5), 0 0 1px rgba(var(--ce-role-edgestar-rgb),0.15)" }} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ duration: 0.3, ease: EASE }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <div className="flex items-center gap-2">
              <SophiaMark size={16} glowing={false} />
              <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setExpanded(true)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors" title="Expand to panel"><Maximize2 className="w-3 h-3 text-[var(--ce-text-quaternary)]" /></button>
              <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"><X className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" /></button>
            </div>
          </div>
          {body}
          {input}
        </motion.div>
      )}

      {isOpen && expanded && (
        <motion.div key="panel" className="fixed top-14 right-0 bottom-14 z-40 flex flex-col" style={{ width: 420, background: "var(--ce-surface-overlay)", borderLeft: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)", backdropFilter: "blur(24px)", boxShadow: "-10px 0 40px rgba(var(--ce-shadow-tint),0.2)" }} initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }} transition={{ duration: 0.35, ease: EASE }}>
          <div className="absolute top-0 left-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, rgba(var(--ce-role-edgestar-rgb),0.15), transparent 50%)" }} />
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <div className="flex items-center gap-2">
              <SophiaMark size={16} glowing={false} />
              <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
              <span className="text-[9px] text-[var(--ce-text-quaternary)] px-1.5 py-0.5 rounded-md" style={{ background: "rgba(var(--ce-glass-tint),0.03)", fontFamily: "var(--font-body)" }}>Dashboard</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setExpanded(false)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors" title="Minimize"><Minimize2 className="w-3 h-3 text-[var(--ce-text-quaternary)]" /></button>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}><X className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" /></button>
            </div>
          </div>
          {body}
          {input}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
