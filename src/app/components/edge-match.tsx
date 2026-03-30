import { EASE } from "./tokens";
/**
 * EdgeMatch — Job matching surface
 * Three-panel: filters left, card grid center, detail panel right (on selection).
 * Wired: → ResumeEdge, → EdgePath, Sophia match intelligence.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import {
  Search, MapPin, Building2, DollarSign, Clock, ChevronRight,
  Bookmark, BookmarkCheck, ExternalLink, Sparkles, FileText,
  Compass, X, Check, Briefcase, ArrowRight, Filter, Globe,
  Target, Users, Zap, Bell, Home, MessageSquare,
  Plus, Eye, TrendingUp, BarChart3, Share2, Send, ChevronDown,
} from "lucide-react";
import { RoleShell, type RoleId, type SophiaContext } from "./role-shell";


type NavigateFn = (target: string) => void;

// ─── Types & Data ───────────────────────────────────────────────────────────

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary: string;
  posted: string;
  match: number;
  type: "full-time" | "contract" | "part-time";
  skills: { name: string; matched: boolean }[];
  description: string;
  whyMatch: string;
  sophiaTake: string;
  edgePathConnection?: string;
  saved: boolean;
  applied: boolean;
  status?: "applied" | "viewed" | "interviewing" | "offer" | "rejected" | "withdrawn";
}

const JOBS: Job[] = [
  {
    id: "j1", title: "Product Designer", company: "Figma", location: "San Francisco, CA", remote: false,
    salary: "$140K – $180K", posted: "2d ago", match: 92, type: "full-time",
    skills: [
      { name: "Figma", matched: true }, { name: "Design Systems", matched: true },
      { name: "Prototyping", matched: true }, { name: "User Research", matched: false },
    ],
    description: "Join our design team to shape the future of collaborative design tools. You'll work on core product features used by millions of designers worldwide, focusing on component systems, prototyping workflows, and developer handoff experiences.",
    whyMatch: "Your design systems experience (from Phase 2) and Figma proficiency are direct matches. Your ops background gives you unique insight into workflow tools — Figma values this cross-functional perspective.",
    sophiaTake: "This is your strongest match. Figma's design challenge round tests prototyping speed — you're ready after completing the interaction design module. The team size (8 reports to Design Director) matches your Phase 4 leadership goal.",
    edgePathConnection: "Completing 'Interaction Design Module' would increase match to 96%.",
    saved: true, applied: false,
  },
  {
    id: "j2", title: "UX Lead", company: "Intercom", location: "Remote", remote: true,
    salary: "$130K – $165K", posted: "4d ago", match: 87, type: "full-time",
    skills: [
      { name: "Design Systems", matched: true }, { name: "Leadership", matched: true },
      { name: "User Research", matched: false }, { name: "Accessibility", matched: false },
    ],
    description: "Lead a team of 5 designers working on Intercom's messaging platform. Define design direction, establish quality standards, and mentor junior designers while contributing to high-impact features.",
    whyMatch: "Your team leadership from Revenue Ops (8 direct reports) directly translates. Design systems knowledge is a match. Missing: formal UX research methodology and accessibility certification.",
    sophiaTake: "Strong cultural fit — Intercom values cross-functional thinkers. The leadership component is your differentiator vs. other candidates. I'd prioritize the accessibility module in Phase 3 to close the remaining gap.",
    saved: false, applied: false,
  },
  {
    id: "j3", title: "Design Manager", company: "Vercel", location: "Remote", remote: true,
    salary: "$150K ��� $190K", posted: "1d ago", match: 84, type: "full-time",
    skills: [
      { name: "Design Systems", matched: true }, { name: "Figma", matched: true },
      { name: "Frontend Dev", matched: true }, { name: "Design Ops", matched: false },
    ],
    description: "Build and lead Vercel's product design function. Work closely with engineering on developer experience tools, design system architecture, and the visual identity of Next.js and related products.",
    whyMatch: "Rare match: your frontend engineering background + design skills is exactly what Vercel needs. Most design manager candidates don't understand the developer workflow — you do.",
    sophiaTake: "This is a stretch role but winnable. Your engineering background is a major advantage here. The gap is design ops experience — we can frame your Revenue Ops process work as adjacent experience in your cover letter.",
    saved: true, applied: true, status: "viewed",
  },
  {
    id: "j4", title: "Senior Product Designer", company: "Linear", location: "Remote", remote: true,
    salary: "$145K – $175K", posted: "6d ago", match: 79, type: "full-time",
    skills: [
      { name: "Interaction Design", matched: false }, { name: "Figma", matched: true },
      { name: "Prototyping", matched: true }, { name: "Motion Design", matched: false },
    ],
    description: "Design features for Linear's project management platform. Focus on interaction patterns, keyboard-first workflows, and micro-interactions that make the product feel exceptional.",
    whyMatch: "Your Figma skills and prototyping experience match. However, Linear's emphasis on interaction design and motion design are areas you're currently building in Phase 2.",
    sophiaTake: "Good match for after you complete Phase 2. Linear's hiring timeline is slow (4-6 weeks) — if you start the interaction design module now, you'll be ready by the time you'd interview.",
    edgePathConnection: "Complete Phase 2 milestones m6 and m7 to increase match to 91%.",
    saved: false, applied: false,
  },
  {
    id: "j5", title: "Product Designer", company: "Notion", location: "San Francisco, CA", remote: false,
    salary: "$135K – $170K", posted: "1w ago", match: 76, type: "full-time",
    skills: [
      { name: "Systems Thinking", matched: true }, { name: "User Research", matched: false },
      { name: "Figma", matched: true }, { name: "Content Design", matched: false },
    ],
    description: "Design features for Notion's core editing experience. Focus on block-based interfaces, collaborative workflows, and information architecture at scale.",
    whyMatch: "Your systems thinking from ops and Figma skills are matches. Gaps: formal user research methods and content design — Notion's writing-heavy product requires strong content design skills.",
    sophiaTake: "Worth saving for later. After Phase 3 (which covers content design fundamentals), your match would jump to 88%. Don't apply yet — build the skills first.",
    saved: false, applied: false,
  },
  {
    id: "j6", title: "UX Designer", company: "Stripe", location: "Remote", remote: true,
    salary: "$125K – $160K", posted: "3d ago", match: 71, type: "full-time",
    skills: [
      { name: "Data Visualization", matched: true }, { name: "Figma", matched: true },
      { name: "API Design", matched: false }, { name: "Fintech UX", matched: false },
    ],
    description: "Design developer-facing financial tools. Strong emphasis on data visualization, complex form design, and making technical concepts accessible to non-technical users.",
    whyMatch: "Your data visualization experience from dashboards at TechCorp is a direct match. Fintech and API design experience are gaps.",
    sophiaTake: "Interesting fit because of your data viz background. Stripe's interview process is rigorous (5 rounds) — I'd wait until after Phase 3 to apply. Save it and we'll revisit.",
    saved: false, applied: false,
  },
];

const MATCH_COLOR = (match: number) =>
  match >= 85 ? "var(--ce-lime)" : match >= 70 ? "var(--ce-role-edgestar)" : match >= 50 ? "var(--ce-role-edgepreneur)" : "var(--ce-text-tertiary)";

// ─── Filter Sidebar ─────────────────────────────────────────────────────────

function FilterSidebar({ filters, onFilterChange }: {
  filters: { remote: boolean; saved: boolean; applied: boolean; minMatch: number };
  onFilterChange: (key: string, value: any) => void;
}) {
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Filter className="w-4 h-4 text-ce-text-tertiary" />
        <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Filters</span>
      </div>

      {/* Quick filters */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>QUICK FILTERS</span>
        {[
          { key: "saved", label: "Saved", active: filters.saved },
          { key: "applied", label: "Applied", active: filters.applied },
          { key: "remote", label: "Remote only", active: filters.remote },
        ].map((f) => (
          <button
            key={f.key}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-colors text-left"
            style={{
              background: f.active ? "rgba(var(--ce-role-edgestar-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.015)",
              border: `1px solid ${f.active ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}`,
              color: f.active ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
            onClick={() => onFilterChange(f.key, !f.active)}
          >
            {f.active && <Check className="w-3 h-3" />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Match threshold */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>MIN MATCH %</span>
        <div className="flex gap-1">
          {[50, 70, 80, 90].map((v) => (
            <button
              key={v}
              className="flex-1 px-2 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors text-center tabular-nums"
              style={{
                background: filters.minMatch === v ? "rgba(var(--ce-role-edgestar-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.02)",
                border: `1px solid ${filters.minMatch === v ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}`,
                color: filters.minMatch === v ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
                fontFamily: "var(--font-body)",
              }}
              onClick={() => onFilterChange("minMatch", v)}
            >
              {v}%+
            </button>
          ))}
        </div>
      </div>

      {/* Target role */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>TARGET ROLE</span>
        <div className="px-3 py-2 rounded-lg text-[12px]"
          style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.03)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>
          <Compass className="w-3 h-3 inline mr-1.5 -mt-0.5" />
          Product Designer
          <span className="text-[10px] text-ce-text-tertiary block mt-0.5">From EdgePath</span>
        </div>
      </div>

      {/* Stats */}
      <div className="pt-3 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>MARKET INTEL</span>
        <div className="text-[11px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          <span className="text-ce-lime">↑ 15%</span> more Product Designer roles this month vs last.
        </div>
        <div className="text-[11px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          Average salary: <span className="text-ce-text-primary">$152K</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Job Card ───────────────────────────────────────────────────────────────

function JobCard({ job, isSelected, onClick, onToggleSave }: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
  onToggleSave: (id: string) => void;
}) {
  const matchColor = MATCH_COLOR(job.match);

  return (
    <motion.div
      className="rounded-xl p-4 cursor-pointer transition-all"
      style={{
        background: isSelected ? "rgba(var(--ce-role-edgestar-rgb),0.03)" : "rgba(var(--ce-glass-tint),0.02)",
        border: `1px solid ${isSelected ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}`,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.005 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
            <Building2 className="w-4 h-4 text-ce-text-tertiary" />
          </div>
          <div>
            <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.company}</span>
          </div>
        </div>

        {/* Match badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${matchColor}10` }}>
          <span className="text-[11px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}%</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-2.5 ml-[42px]">
        <span className="flex items-center gap-1 text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          <MapPin className="w-3 h-3" /> {job.location}
        </span>
        {job.remote && (
          <span className="flex items-center gap-1 text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>
            <Globe className="w-3 h-3" /> Remote
          </span>
        )}
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{job.posted}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 ml-[42px] mb-2.5">
        {job.skills.slice(0, 3).map((s) => (
          <span
            key={s.name}
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: s.matched ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.03)",
              color: s.matched ? "var(--ce-lime)" : "var(--ce-text-tertiary)",
              border: `1px solid ${s.matched ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}`,
              fontFamily: "var(--font-body)",
            }}
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Salary + actions */}
      <div className="flex items-center justify-between ml-[42px]">
        <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{job.salary}</span>
        <div className="flex items-center gap-2">
          {job.applied && job.status && (
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
              background: job.status === "viewed" ? "rgba(var(--ce-role-edgestar-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.03)",
              color: job.status === "viewed" ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
              fontFamily: "var(--font-body)",
            }}>
              {job.status === "applied" ? "Applied" : job.status === "viewed" ? "Viewed" : job.status}
            </span>
          )}
          <button
            className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            onClick={(e) => { e.stopPropagation(); onToggleSave(job.id); toast(job.saved ? "Removed from saved" : `Saved ${job.title} at ${job.company}`); }}
          >
            {job.saved ? (
              <BookmarkCheck className="w-4 h-4 text-ce-lime" />
            ) : (
              <Bookmark className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Job Detail Panel ───────────────────────────────────────────────────────

function NativeApplyModal({ job, onClose, onSubmit }: { job: Job; onClose: () => void; onSubmit: () => void }) {
  const [step, setStep] = useState<"form" | "done">("form");
  const [coverLetter, setCoverLetter] = useState(`Dear ${job.company} Hiring Team,\n\nI'm excited to apply for the ${job.title} role. My background in design systems and Figma perfectly aligns with your requirements...`);
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(var(--ce-shadow-tint),0.7)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-[520px] rounded-2xl overflow-hidden" style={{ background: "rgba(12,14,18,0.99)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} transition={{ duration: 0.22 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
          <div>
            <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Apply to {job.company}</span>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
          </div>
          <button onClick={onClose} className="text-ce-text-tertiary cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        {step === "form" ? (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-lime-rgb),0.05)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)" }}>
              <Check className="w-3 h-3 text-ce-lime" />
              <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>Resume v3 attached · ATS score 87</span>
            </div>
            <div>
              <label className="text-[10px] text-ce-text-tertiary block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>COVER LETTER</label>
              <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={6}
                className="w-full rounded-xl px-4 py-3 text-[12px] text-ce-text-primary resize-none outline-none"
                style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", fontFamily: "var(--font-body)" }} />
              <div className="flex items-center gap-1.5 mt-1">
                <SophiaMark size={12} glowing={false} />
                <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Sophia pre-drafted this based on the JD. Edit as needed.</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-ce-text-tertiary block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SCREENING QUESTIONS</label>
              {[
                { q: "Years of experience with Figma?", a: "4 years" },
                { q: "Have you built a design system used by 10+ engineers?", a: "Yes — at TechCorp, serving 35 engineers" },
              ].map((sq, i) => (
                <div key={i} className="mb-2">
                  <span className="text-[11px] text-ce-text-secondary block mb-1" style={{ fontFamily: "var(--font-body)" }}>{sq.q}</span>
                  <input defaultValue={sq.a} className="w-full px-3 py-2 rounded-lg text-[12px] text-ce-text-primary outline-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setStep("done"); onSubmit(); }}
                className="flex-1 py-3 rounded-xl text-[13px] cursor-pointer"
                style={{ background: "var(--ce-cyan)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Submit Application →
              </button>
              <button onClick={onClose}
                className="px-4 py-3 rounded-xl text-[12px] cursor-pointer"
                style={{ background: "rgba(var(--ce-glass-tint),0.03)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center gap-4 py-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.1)", border: "1px solid rgba(var(--ce-lime-rgb),0.2)" }}>
              <Check className="w-6 h-6 text-ce-lime" />
            </div>
            <div className="text-center">
              <p className="text-[15px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Application submitted</p>
              <p className="text-[12px] text-ce-text-tertiary mt-1" style={{ fontFamily: "var(--font-body)" }}>Sophia will track this and notify you of updates.</p>
            </div>
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function JobDetailPanel({ job, onClose, onToggleSave, onApply, onNavigate, onWithdraw }: {
  job: Job;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onApply: (id: string, native?: boolean) => void;
  onNavigate: NavigateFn;
  onWithdraw?: (id: string) => void;
}) {
  const [showNativeApply, setShowNativeApply] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [loadingWhy, setLoadingWhy] = useState(false);

  const handleExpandWhy = () => {
    if (whyExpanded) { setWhyExpanded(false); return; }
    setLoadingWhy(true);
    setTimeout(() => { setLoadingWhy(false); setWhyExpanded(true); }, 800);
  };

  const matchColor = MATCH_COLOR(job.match);

  return (
    <motion.div
      className="rounded-xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]"
      style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Header */}
      <div className="p-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-[16px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.title}</h3>
            <span className="text-[13px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{job.company}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] cursor-pointer transition-colors">
            <X className="w-4 h-4 text-ce-text-tertiary" />
          </button>
        </div>

        {/* Match score prominent */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${matchColor}10`, border: `1px solid ${matchColor}20` }}>
            <Target className="w-3.5 h-3.5" style={{ color: matchColor }} />
            <span className="text-[14px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}% match</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
            <MapPin className="w-3 h-3" /> {job.location} {job.remote && "· Remote"}
          </span>
        </div>
        <span className="text-[10px] text-[var(--ce-text-quaternary)] mb-3 block" style={{ fontFamily: "var(--font-body)" }}>Match updated 2 hours ago · refreshes when your profile changes</span>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
          <span>{job.type}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* Skills match */}
        <div>
          <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SKILLS MATCH</span>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{
                  background: s.matched ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-status-error-rgb),0.04)",
                  color: s.matched ? "var(--ce-lime)" : "var(--ce-status-error)",
                  border: `1px solid ${s.matched ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-status-error-rgb),0.06)"}`,
                  fontFamily: "var(--font-body)",
                }}
              >
                {s.matched ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Why you match — expandable on-demand */}
        <div className="rounded-xl overflow-hidden" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.02)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.05)" }}>
          <button onClick={handleExpandWhy} className="w-full flex items-center justify-between px-3.5 py-2.5 cursor-pointer text-left">
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>WHY YOU MATCH</span>
            <div className="flex items-center gap-1.5">
              {loadingWhy && <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Analysing...</span>}
              <ChevronDown className="w-3 h-3 text-[var(--ce-text-quaternary)]" style={{ transform: whyExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </div>
          </button>
          <AnimatePresence>
            {loadingWhy && (
              <motion.div className="px-3.5 pb-3" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                <div className="flex flex-col gap-1.5">
                  {[80, 60, 90].map((w, i) => (
                    <motion.div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "rgba(var(--ce-role-edgestar-rgb),0.08)" }}
                      animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </motion.div>
            )}
            {whyExpanded && !loadingWhy && (
              <motion.div className="px-3.5 pb-3.5" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{job.whyMatch}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sophia's take */}
        <div className="rounded-xl p-3.5" style={{
          background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.03), rgba(var(--ce-cyan-rgb),0.015))",
          border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)",
        }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <SophiaMark size={14} glowing={false} />
            <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA'S TAKE</span>
          </div>
          <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{job.sophiaTake}</p>
        </div>

        {/* EdgePath connection */}
        {job.edgePathConnection && (
          <button
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.04)] transition-colors text-left w-full"
            style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.02)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.05)", fontFamily: "var(--font-body)" }}
            onClick={() => onNavigate("edgepath")}
          >
            <Compass className="w-4 h-4 text-ce-cyan flex-shrink-0" />
            <span className="text-ce-text-secondary flex-1">{job.edgePathConnection}</span>
            <ArrowRight className="w-3.5 h-3.5 text-ce-cyan flex-shrink-0" />
          </button>
        )}

        {/* Description */}
        <div>
          <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>DESCRIPTION</span>
          <p className="text-[12px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{job.description}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="p-4 flex-shrink-0 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        {!job.applied ? (
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer"
              style={{ background: "rgba(var(--ce-cyan-rgb),0.1)", border: "1px solid rgba(var(--ce-cyan-rgb),0.2)", color: "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              onClick={() => setShowNativeApply(true)}
            >
              <Send className="w-3.5 h-3.5 text-ce-cyan" /> Apply natively
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer"
              style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
              onClick={() => { onApply(job.id); toast.success(`Redirecting to ${job.company}`); }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Apply on {job.company}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px]"
              style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
              <Check className="w-3.5 h-3.5 text-ce-lime" />
              {job.status === "withdrawn" ? "Withdrawn" : "Applied"}
            </div>
            {job.status !== "withdrawn" && (
              <button onClick={() => { onWithdraw?.(job.id); toast("Application withdrawn"); }}
                className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer"
                style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                Withdraw
              </button>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
            onClick={() => onNavigate("resume")}>
            <FileText className="w-3.5 h-3.5 text-ce-cyan" /> Optimize Resume
          </button>
          {job.applied && (
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer"
              style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
              onClick={() => onNavigate("messages")}>
              <MessageSquare className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" /> Message Employer
            </button>
          )}
          <button className="px-3 py-2 rounded-xl cursor-pointer"
            style={{ background: job.saved ? "rgba(var(--ce-lime-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${job.saved ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.06)"}` }}
            onClick={() => { onToggleSave(job.id); toast(job.saved ? "Removed" : `Saved ${job.title}`); }}>
            {job.saved ? <BookmarkCheck className="w-4 h-4 text-ce-lime" /> : <Bookmark className="w-4 h-4 text-ce-text-tertiary" />}
          </button>
        </div>
      </div>

      {/* Native apply modal */}
      <AnimatePresence>
        {showNativeApply && (
          <NativeApplyModal
            job={job}
            onClose={() => setShowNativeApply(false)}
            onSubmit={() => { onApply(job.id, true); setShowNativeApply(false); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function EdgeMatch({ onNavigate }: { onNavigate: NavigateFn }) {
  const [jobs, setJobs] = useState(JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ remote: false, saved: false, applied: false, minMatch: 50 });
  const [panelMode, setPanelMode] = useState<"overlay" | "push">("overlay");

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleSave = useCallback((id: string) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, saved: !j.saved } : j));
  }, []);

  const handleApply = useCallback((id: string, native?: boolean) => {
    const job = jobs.find(j => j.id === id);
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, applied: true, status: "applied" } : j));
    if (!native) toast.success(`Redirecting to ${job?.company || "company"}`, { description: "Application tracked in EdgeMatch." });
  }, [jobs]);

  const handleWithdraw = useCallback((id: string) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: "withdrawn" } : j));
  }, []);

  // Apply filters
  const filteredJobs = jobs.filter((j) => {
    if (filters.remote && !j.remote) return false;
    if (filters.saved && !j.saved) return false;
    if (filters.applied && !j.applied) return false;
    if (j.match < filters.minMatch) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.match - a.match);

  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--ce-void)" }}>
      <SophiaForwardBackground />
    <div className="px-6 pb-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
        >
          <div>
            <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              EdgeMatch
            </h1>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
              {filteredJobs.length} roles match your profile · Sorted by match strength
            </span>
          </div>
          {/* Panel mode toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Panel mode:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              {(["overlay", "push"] as const).map(m => (
                <button key={m} onClick={() => setPanelMode(m)} className="px-2.5 py-1 rounded-md text-[10px] cursor-pointer capitalize"
                  style={{ background: panelMode === m ? "rgba(var(--ce-glass-tint),0.06)" : "transparent", color: panelMode === m ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ce-text-quaternary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles or companies..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-[12px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none"
              style={{
                background: "rgba(var(--ce-glass-tint),0.02)",
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        </motion.div>

        {/* Active filter chips */}
        {(filters.remote || filters.saved || filters.applied || filters.minMatch > 50) && (
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filters.remote && (
              <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", color: "var(--ce-role-edgestar)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", fontFamily: "var(--font-body)" }}
                onClick={() => handleFilterChange("remote", false)}>
                Remote <X className="w-2.5 h-2.5" />
              </span>
            )}
            {filters.saved && (
              <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                style={{ background: "rgba(var(--ce-lime-rgb),0.06)", color: "var(--ce-lime)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)", fontFamily: "var(--font-body)" }}
                onClick={() => handleFilterChange("saved", false)}>
                Saved <X className="w-2.5 h-2.5" />
              </span>
            )}
            {filters.minMatch > 50 && (
              <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                style={{ background: "rgba(var(--ce-glass-tint),0.03)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}
                onClick={() => handleFilterChange("minMatch", 50)}>
                {filters.minMatch}%+ <X className="w-2.5 h-2.5" />
              </span>
            )}
          </motion.div>
        )}

        {/* Three-panel layout — push mode reflows grid, overlay mode keeps grid */}
        <div className="grid gap-5" style={{ gridTemplateColumns: selectedJob && panelMode === "push" ? "200px 1fr 400px" : "200px 1fr" }}>
          {/* Left: Filters */}
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

          {/* Center: Job Grid */}
          <div className="flex flex-col gap-3 relative">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-8 h-8 text-[var(--ce-text-quaternary)] mb-3" />
                <p className="text-[14px] text-ce-text-tertiary mb-1" style={{ fontFamily: "var(--font-body)" }}>No jobs match your current filters.</p>
                <button
                  className="text-[12px] text-ce-cyan cursor-pointer"
                  style={{ fontFamily: "var(--font-body)" }}
                  onClick={() => setFilters({ remote: false, saved: false, applied: false, minMatch: 50 })}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job, i) => (
                <motion.div key={job.id} transition={{ delay: i * 0.04 }}>
                  <JobCard
                    job={job}
                    isSelected={selectedJobId === job.id}
                    onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                    onToggleSave={handleToggleSave}
                  />
                </motion.div>
              ))
            )}
          </div>

          {/* Overlay mode: sliding panel from the right edge, z-stacked above center */}
          <AnimatePresence>
            {selectedJob && panelMode === "overlay" && (
              <motion.div className="fixed top-14 right-0 bottom-0 w-[440px] z-30"
                initial={{ x: 440, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 440, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}>
                <div className="h-full overflow-y-auto" style={{ background: "rgba(8,9,12,0.95)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}>
                  <JobDetailPanel job={selectedJob} onClose={() => setSelectedJobId(null)} onToggleSave={handleToggleSave} onApply={handleApply} onNavigate={onNavigate} onWithdraw={handleWithdraw} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Push mode: third column */}
          <AnimatePresence>
            {selectedJob && panelMode === "push" && (
              <JobDetailPanel
                job={selectedJob}
                onClose={() => setSelectedJobId(null)}
                onToggleSave={handleToggleSave}
                onApply={handleApply}
                onNavigate={onNavigate}
                onWithdraw={handleWithdraw}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── Employer Posting Data ──────────────────────────────────────────────────

interface PostedJob {
  id: string;
  title: string;
  department: string;
  location: string;
  remote: boolean;
  salary: string;
  posted: string;
  status: "active" | "paused" | "closed";
  applicants: number;
  newApplicants: number;
  views: number;
  topMatch: number;
  pipeline: { applied: number; screened: number; interview: number; offer: number };
}

const POSTED_JOBS: PostedJob[] = [
  { id: "p1", title: "Product Designer", department: "Design", location: "San Francisco, CA", remote: false, salary: "$140K – $180K", posted: "Mar 1", status: "active", applicants: 34, newApplicants: 8, views: 287, topMatch: 96, pipeline: { applied: 34, screened: 14, interview: 5, offer: 0 } },
  { id: "p2", title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", remote: true, salary: "$160K – $200K", posted: "Feb 28", status: "active", applicants: 52, newApplicants: 12, views: 445, topMatch: 94, pipeline: { applied: 52, screened: 22, interview: 8, offer: 1 } },
  { id: "p3", title: "Data Scientist", department: "Analytics", location: "New York, NY", remote: false, salary: "$130K – $165K", posted: "Mar 5", status: "active", applicants: 28, newApplicants: 4, views: 198, topMatch: 91, pipeline: { applied: 28, screened: 10, interview: 3, offer: 0 } },
  { id: "p4", title: "UX Researcher", department: "Design", location: "Remote", remote: true, salary: "$120K – $150K", posted: "Mar 10", status: "active", applicants: 19, newApplicants: 3, views: 142, topMatch: 88, pipeline: { applied: 19, screened: 7, interview: 2, offer: 0 } },
  { id: "p5", title: "Product Manager", department: "Product", location: "San Francisco, CA", remote: false, salary: "$150K – $190K", posted: "Mar 14", status: "active", applicants: 9, newApplicants: 1, views: 67, topMatch: 85, pipeline: { applied: 9, screened: 3, interview: 0, offer: 0 } },
];

// ─── Employer Posting Mode ──────────────────────────────────────────────────

// ─── Applicant data ─────────────────────────────────────────────────────────

interface Applicant {
  id: string;
  name: string;
  initial: string;
  match: number;
  role: string;
  skills: { name: string; matched: boolean }[];
  experience: string;
  location: string;
  stage: "applied" | "screened" | "interview" | "offer" | "rejected";
  appliedDate: string;
  resumeSummary: string;
  sophiaTake: string;
}

const APPLICANTS: Applicant[] = [
  { id: "a1", name: "Sharon Lee", initial: "S", match: 96, role: "Product Designer", skills: [{ name: "Figma", matched: true }, { name: "Design Systems", matched: true }, { name: "Prototyping", matched: true }, { name: "User Research", matched: true }], experience: "6 years", location: "San Francisco, CA", stage: "interview", appliedDate: "Mar 3", resumeSummary: "Senior Product Designer at Meta, previously at Airbnb. Led design system serving 200+ designers. Strong Figma and prototyping skills.", sophiaTake: "Top candidate. Her design systems experience at Meta directly maps to this role. Interview her for leadership potential — she managed 4 reports at Airbnb." },
  { id: "a2", name: "James Chen", initial: "J", match: 92, role: "Product Designer", skills: [{ name: "Figma", matched: true }, { name: "Design Systems", matched: true }, { name: "Frontend Dev", matched: true }, { name: "Motion Design", matched: false }], experience: "5 years", location: "Remote", stage: "screened", appliedDate: "Mar 5", resumeSummary: "Full-stack designer at Vercel. Unique hybrid of design + frontend engineering. Built component libraries used by 50+ engineers.", sophiaTake: "Rare hybrid profile — his engineering skills give him an edge for implementation speed. Gap is motion design, but this is trainable. Strong technical hire." },
  { id: "a3", name: "Priya Patel", initial: "P", match: 89, role: "Product Designer", skills: [{ name: "User Research", matched: true }, { name: "Figma", matched: true }, { name: "Accessibility", matched: true }, { name: "Design Systems", matched: false }], experience: "4 years", location: "New York, NY", stage: "applied", appliedDate: "Mar 8", resumeSummary: "UX Designer at Spotify. Strong research methodology and accessibility focus. Led WCAG 2.1 AA compliance initiative.", sophiaTake: "Research-first designer — great for teams that need more user insight. She doesn't have design systems experience yet, but her accessibility skills are rare and valuable." },
  { id: "a4", name: "Marcus Rivera", initial: "M", match: 85, role: "Product Designer", skills: [{ name: "Figma", matched: true }, { name: "Prototyping", matched: true }, { name: "Data Viz", matched: true }, { name: "Leadership", matched: false }], experience: "3 years", location: "Austin, TX", stage: "applied", appliedDate: "Mar 10", resumeSummary: "Product Designer at Stripe. Focused on data visualization and dashboard design. Built internal design tools.", sophiaTake: "Strong data visualization background — good if this role involves analytics surfaces. Less leadership experience, better suited as a senior IC than a lead." },
  { id: "a5", name: "Elena Voss", initial: "E", match: 82, role: "Product Designer", skills: [{ name: "Figma", matched: true }, { name: "Brand Design", matched: false }, { name: "Prototyping", matched: true }, { name: "User Research", matched: false }], experience: "3 years", location: "Remote", stage: "rejected", appliedDate: "Mar 1", resumeSummary: "Designer at a brand agency. Transitioning from brand to product design. Strong visual skills but limited product experience.", sophiaTake: "Talented visual designer but not yet product-ready for this role. Recommend reaching out again in 6-12 months after she builds more product experience." },
];

const STAGE_COLORS: Record<string, string> = { applied: "var(--ce-text-tertiary)", screened: "var(--ce-role-edgestar)", interview: "var(--ce-lime)", offer: "var(--ce-role-employer)", rejected: "var(--ce-status-error)" };
const STAGE_LABELS: Record<string, string> = { applied: "Applied", screened: "Screened", interview: "Interviewing", offer: "Offer", rejected: "Passed" };

function EmployerPostingMode({ onNavigate, roleId }: { onNavigate: NavigateFn; roleId: RoleId }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [viewMode, setViewMode] = useState<"listings" | "applicants" | "edit">("listings");
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [applicants, setApplicants] = useState(APPLICANTS);
  const [editStatus, setEditStatus] = useState<string>("active");
  const selected = selectedId ? POSTED_JOBS.find(j => j.id === selectedId) : null;
  const isSimple = roleId === "ngo" || roleId === "agency";
  const postLabel = isSimple ? "Post Opportunity" : "Post New Job";
  const surfaceLabel = roleId === "ngo" ? "Community Opportunities" : roleId === "agency" ? "Workforce Opportunities" : "Job Postings";
  const selApplicant = selectedApplicant ? applicants.find(a => a.id === selectedApplicant) : null;

  const handleStageChange = (applicantId: string, newStage: Applicant["stage"]) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, stage: newStage } : a));
    const a = applicants.find(x => x.id === applicantId);
    toast.success(`${a?.name} moved to ${STAGE_LABELS[newStage]}`);
  };

  // ── Applicant list view ──
  if (viewMode === "applicants" && selected) {
    return (
      <div className="pt-4 pb-4">
        <div className="max-w-[1400px] mx-auto">
          <motion.div className="pt-4 pb-5 flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
            <div className="flex items-center gap-3">
              <button onClick={() => { setViewMode("listings"); setSelectedApplicant(null); }} className="flex items-center gap-1.5 text-[12px] text-ce-text-tertiary cursor-pointer hover:text-ce-text-secondary transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Listings
              </button>
            </div>
          </motion.div>
          <motion.div className="mb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
            <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{selected.title} — Applicants</h1>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{applicants.length} candidates · Sorted by match strength</span>
          </motion.div>

          {/* Pipeline summary */}
          <motion.div className="flex items-center gap-4 mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {(["applied", "screened", "interview", "offer", "rejected"] as const).map((stage) => {
              const count = applicants.filter(a => a.stage === stage).length;
              return (
                <div key={stage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                  <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{STAGE_LABELS[stage]}</span>
                  <span className="text-[11px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{count}</span>
                </div>
              );
            })}
          </motion.div>

          <div className="grid gap-5" style={{ gridTemplateColumns: selApplicant ? "1fr 420px" : "1fr" }}>
            {/* Applicant list */}
            <div className="flex flex-col gap-2">
              {applicants.sort((a, b) => b.match - a.match).map((a, i) => {
                const mc = MATCH_COLOR(a.match);
                return (
                  <motion.div key={a.id} className="rounded-xl p-4 cursor-pointer transition-all" style={{ background: selectedApplicant === a.id ? "rgba(var(--ce-role-edgestar-rgb),0.03)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${selectedApplicant === a.id ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}` }}
                    onClick={() => setSelectedApplicant(selectedApplicant === a.id ? null : a.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04, duration: 0.4, ease: EASE }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${mc}12` }}>
                          <span className="text-[12px]" style={{ color: mc, fontFamily: "var(--font-display)", fontWeight: 500 }}>{a.initial}</span>
                        </div>
                        <div>
                          <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{a.name}</span>
                          <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{a.experience} · {a.location} · Applied {a.appliedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${STAGE_COLORS[a.stage]}12`, color: STAGE_COLORS[a.stage], fontFamily: "var(--font-body)" }}>{STAGE_LABELS[a.stage]}</span>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${mc}10` }}>
                          <span className="text-[11px] tabular-nums" style={{ color: mc, fontFamily: "var(--font-display)", fontWeight: 500 }}>{a.match}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 ml-[48px] mt-2">
                      {a.skills.map(s => (
                        <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: s.matched ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.03)", color: s.matched ? "var(--ce-lime)" : "var(--ce-text-tertiary)", border: `1px solid ${s.matched ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}`, fontFamily: "var(--font-body)" }}>{s.name}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Applicant detail panel */}
            <AnimatePresence>
              {selApplicant && (
                <motion.div className="rounded-xl overflow-hidden flex flex-col h-[calc(100vh-14rem)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3, ease: EASE }}>
                  <div className="p-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${MATCH_COLOR(selApplicant.match)}12` }}>
                          <span className="text-[14px]" style={{ color: MATCH_COLOR(selApplicant.match), fontFamily: "var(--font-display)", fontWeight: 500 }}>{selApplicant.initial}</span>
                        </div>
                        <div>
                          <h3 className="text-[16px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{selApplicant.name}</h3>
                          <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{selApplicant.experience} · {selApplicant.location}</span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedApplicant(null)} className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] cursor-pointer"><X className="w-4 h-4 text-ce-text-tertiary" /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${MATCH_COLOR(selApplicant.match)}10`, border: `1px solid ${MATCH_COLOR(selApplicant.match)}20` }}>
                        <Target className="w-3.5 h-3.5" style={{ color: MATCH_COLOR(selApplicant.match) }} />
                        <span className="text-[14px] tabular-nums" style={{ color: MATCH_COLOR(selApplicant.match), fontFamily: "var(--font-display)", fontWeight: 500 }}>{selApplicant.match}% match</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${STAGE_COLORS[selApplicant.stage]}12`, color: STAGE_COLORS[selApplicant.stage], fontFamily: "var(--font-body)" }}>{STAGE_LABELS[selApplicant.stage]}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                    {/* Skills */}
                    <div>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SKILLS MATCH</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selApplicant.skills.map(s => (
                          <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: s.matched ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-status-error-rgb),0.04)", color: s.matched ? "var(--ce-lime)" : "var(--ce-status-error)", border: `1px solid ${s.matched ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-status-error-rgb),0.06)"}`, fontFamily: "var(--font-body)" }}>
                            {s.matched ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}{s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Resume summary */}
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(var(--ce-glass-tint),0.015)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>RESUME SUMMARY</span>
                      <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selApplicant.resumeSummary}</p>
                    </div>
                    {/* Sophia take */}
                    <div className="rounded-xl p-3.5" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.03), rgba(var(--ce-cyan-rgb),0.015))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
                      <div className="flex items-center gap-1.5 mb-1.5"><SophiaMark size={14} glowing={false} /><span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA'S ASSESSMENT</span></div>
                      <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selApplicant.sophiaTake}</p>
                    </div>
                    {/* Move to stage */}
                    <div>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>MOVE TO STAGE</span>
                      <div className="flex flex-wrap gap-2">
                        {(["applied", "screened", "interview", "offer", "rejected"] as const).filter(s => s !== selApplicant.stage).map(stage => (
                          <button key={stage} onClick={() => handleStageChange(selApplicant.id, stage)} className="text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors" style={{ background: `${STAGE_COLORS[stage]}08`, border: `1px solid ${STAGE_COLORS[stage]}18`, color: STAGE_COLORS[stage], fontFamily: "var(--font-body)" }}>
                            {STAGE_LABELS[stage]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-shrink-0 flex gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <button onClick={() => toast.success(`Message sent to ${selApplicant.name}`)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}><MessageSquare className="w-4 h-4 text-ce-cyan" /> Message</button>
                    <button onClick={() => toast(`Downloading ${selApplicant.name}'s resume`)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}><FileText className="w-3.5 h-3.5" /> Resume</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // ── Edit listing view ──
  if (viewMode === "edit" && selected) {
    return (
      <div className="pt-4 pb-4">
        <div className="max-w-[680px] mx-auto">
          <motion.div className="pt-4 pb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
            <button onClick={() => setViewMode("listings")} className="flex items-center gap-1.5 text-[12px] text-ce-text-tertiary cursor-pointer hover:text-ce-text-secondary transition-colors mb-4" style={{ fontFamily: "var(--font-body)" }}>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Listings
            </button>
            <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Edit Listing</h1>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{selected.title} · Posted {selected.posted}</span>
          </motion.div>
          <motion.div className="rounded-xl p-6 flex flex-col gap-5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: EASE }}>
            <div>
              <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Job Title</label>
              <input type="text" defaultValue={selected.title} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Department</label>
                <input type="text" defaultValue={selected.department} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
              </div>
              <div>
                <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Location</label>
                <input type="text" defaultValue={selected.location} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Salary Range</label>
              <input type="text" defaultValue={selected.salary} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
            </div>
            <div>
              <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Description</label>
              <textarea defaultValue="Join our team to build the next generation of product experiences..." rows={5} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary outline-none resize-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
            </div>
            <div>
              <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Status</label>
              <div className="flex gap-2">
                {(["active", "paused", "closed"] as const).map(s => (
                  <button key={s} onClick={() => setEditStatus(s)} className="text-[12px] px-4 py-2 rounded-lg cursor-pointer" style={{ background: editStatus === s ? "rgba(var(--ce-role-employer-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${editStatus === s ? "rgba(var(--ce-role-employer-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)"}`, color: editStatus === s ? "var(--ce-role-employer)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
              </div>
            </div>
            {/* Sophia optimization suggestion */}
            <div className="rounded-xl p-3.5" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.03), rgba(var(--ce-cyan-rgb),0.015))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
              <div className="flex items-center gap-1.5 mb-1.5"><SophiaMark size={14} glowing={false} /><span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA'S SUGGESTION</span></div>
              <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>Adding "remote-friendly" and specific tool requirements (e.g., "Figma, design systems") to your description could increase qualified applications by ~20%.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setViewMode("listings"); toast.success("Listing updated successfully"); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "linear-gradient(135deg, rgba(var(--ce-cyan-rgb),0.1), rgba(var(--ce-role-edgestar-rgb),0.06))", border: "1px solid rgba(var(--ce-cyan-rgb),0.15)", color: "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>Save Changes</button>
              <button onClick={() => setViewMode("listings")} className="px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>Cancel</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Main listings view ──
  return (
    <div className="pt-4 pb-4">
      <div className="max-w-[1400px] mx-auto">
        <motion.div className="pt-4 pb-5 flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{surfaceLabel}</h1>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{POSTED_JOBS.length} active listings · {POSTED_JOBS.reduce((s, j) => s + j.newApplicants, 0)} new applicants</span>
          </div>
          <button onClick={() => setShowPostForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "linear-gradient(135deg, rgba(var(--ce-cyan-rgb),0.1), rgba(var(--ce-role-edgestar-rgb),0.06))", border: "1px solid rgba(var(--ce-cyan-rgb),0.15)", color: "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Plus className="w-4 h-4" /> {postLabel}
          </button>
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: selected ? "1fr 400px" : "1fr" }}>
          <div className="flex flex-col gap-3">
            {POSTED_JOBS.map((job, i) => (
              <motion.div key={job.id} className="rounded-xl p-4 cursor-pointer transition-all" style={{ background: selectedId === job.id ? "rgba(var(--ce-role-edgestar-rgb),0.03)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${selectedId === job.id ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}` }}
                onClick={() => setSelectedId(selectedId === job.id ? null : job.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: EASE }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-role-employer-rgb),0.06)" }}><Briefcase className="w-4 h-4 text-[var(--ce-role-employer)]" /></div>
                    <div>
                      <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                      <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.department} · {job.location}{job.remote ? " · Remote" : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-employer-rgb),0.06)", color: "var(--ce-role-employer)", fontFamily: "var(--font-body)" }}>{job.status}</span>
                    <span className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Posted {job.posted}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-[44px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-ce-text-tertiary" />
                    <span className="text-[12px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{job.applicants}</span>
                    <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>applicants</span>
                    {job.newApplicants > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-ce-cyan" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", fontFamily: "var(--font-body)" }}>+{job.newApplicants} new</span>}
                  </div>
                  <div className="flex items-center gap-1.5"><Eye className="w-3 h-3 text-ce-text-tertiary" /><span className="text-[12px] text-ce-text-secondary tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{job.views} views</span></div>
                  <div className="flex items-center gap-1.5"><Target className="w-3 h-3 text-ce-lime" /><span className="text-[12px] text-ce-lime tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{job.topMatch}% top match</span></div>
                </div>
                {!isSimple && (
                  <div className="flex items-center gap-2 ml-[44px] mt-3">
                    {(["applied", "screened", "interview", "offer"] as const).map((stage, si) => {
                      const colors = ["var(--ce-text-tertiary)", "var(--ce-role-edgestar)", "var(--ce-lime)", "var(--ce-role-employer)"];
                      return (<div key={stage} className="flex items-center gap-1.5"><div className="h-1.5 rounded-full" style={{ width: `${Math.max(job.pipeline[stage] * 1.2, 8)}px`, background: colors[si] }} /><span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{job.pipeline[stage]}</span></div>);
                    })}
                    <span className="text-[9px] text-[var(--ce-text-quaternary)] ml-1" style={{ fontFamily: "var(--font-body)" }}>Applied → Screened → Interview → Offer</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div className="rounded-xl overflow-hidden flex flex-col h-[calc(100vh-14rem)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="p-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[16px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{selected.title}</h3>
                      <span className="text-[13px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{selected.department} · {selected.salary}</span>
                    </div>
                    <button onClick={() => setSelectedId(null)} className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] cursor-pointer"><X className="w-4 h-4 text-ce-text-tertiary" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>APPLICANT PIPELINE</span>
                    {(["applied", "screened", "interview", "offer"] as const).map((stage, i) => {
                      const count = selected.pipeline[stage]; const maxCount = selected.pipeline.applied;
                      const colors = ["var(--ce-text-tertiary)", "var(--ce-role-edgestar)", "var(--ce-lime)", "var(--ce-role-employer)"]; const labels = ["Applied", "Screened", "Interviewing", "Offer"];
                      return (<div key={stage} className="flex items-center gap-3 mb-2"><span className="text-[11px] text-ce-text-tertiary w-20" style={{ fontFamily: "var(--font-body)" }}>{labels[i]}</span><div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}><motion.div className="h-full rounded-full" style={{ background: colors[i] }} initial={{ width: 0 }} animate={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: EASE }} /></div><span className="text-[12px] text-ce-text-primary tabular-nums w-6 text-right" style={{ fontFamily: "var(--font-body)" }}>{count}</span></div>);
                    })}
                  </div>
                  <div className="rounded-xl p-3.5" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.03), rgba(var(--ce-cyan-rgb),0.015))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
                    <div className="flex items-center gap-1.5 mb-1.5"><SophiaMark size={14} glowing={false} /><span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SOPHIA'S INSIGHT</span></div>
                    <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                      {selected.newApplicants > 5 ? `Strong candidate flow — ${selected.newApplicants} new this week. Your ${selected.topMatch}% top match indicates well-targeted requirements.` : `View-to-apply rate of ${Math.round(selected.applicants / selected.views * 100)}% — I can suggest description optimizations to attract more qualified candidates.`}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>TOP CANDIDATES</span>
                    {APPLICANTS.slice(0, 3).map((c, i) => (
                      <div key={c.id} onClick={() => { setViewMode("applicants"); setSelectedApplicant(c.id); }} className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-lg px-2" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${MATCH_COLOR(c.match)}12` }}>
                          <span className="text-[10px]" style={{ color: MATCH_COLOR(c.match), fontFamily: "var(--font-display)", fontWeight: 500 }}>{c.initial}</span>
                        </div>
                        <div className="flex-1"><span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{c.name}</span><span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{STAGE_LABELS[c.stage]}</span></div>
                        <span className="text-[11px] tabular-nums" style={{ color: MATCH_COLOR(c.match), fontFamily: "var(--font-display)", fontWeight: 500 }}>{c.match}%</span>
                        <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex-shrink-0 flex gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <button onClick={() => setViewMode("applicants")} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}><Users className="w-4 h-4 text-ce-cyan" /> View All Applicants</button>
                  <button onClick={() => { setEditStatus(selected.status); setViewMode("edit"); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}><FileText className="w-3.5 h-3.5" /> Edit Listing</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Post Job Modal */}
        <AnimatePresence>
          {showPostForm && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0" style={{ background: "rgba(8,9,12,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setShowPostForm(false)} />
              <motion.div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl p-6" style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
                initial={{ y: 24, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.97 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[16px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{postLabel}</h3>
                  <button onClick={() => setShowPostForm(false)} className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] cursor-pointer"><X className="w-4 h-4 text-ce-text-tertiary" /></button>
                </div>
                <div className="flex flex-col gap-4">
                  <div><label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Job Title</label><input type="text" placeholder="e.g. Product Designer" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Department</label><input type="text" placeholder="e.g. Design" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} /></div>
                    <div><label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Location</label><input type="text" placeholder="e.g. Remote" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} /></div>
                  </div>
                  <div><label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Salary Range</label><input type="text" placeholder="e.g. $120K – $160K" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} /></div>
                  <div><label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Description</label><textarea placeholder="Describe the role, responsibilities, and requirements..." rows={3} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none resize-none" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} /></div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setShowPostForm(false); toast.success("Job posted successfully", { description: "Sophia will start matching candidates immediately." }); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "linear-gradient(135deg, var(--ce-role-edgestar), var(--ce-cyan))", color: "var(--ce-void)", fontFamily: "var(--font-display)", fontWeight: 500 }}><Sparkles className="w-3.5 h-3.5" /> Publish Listing</button>
                    <button onClick={() => setShowPostForm(false)} className="px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Parent Read-Only Mode ──────────────────────────────────────────────────

function ParentMatchView({ onNavigate }: { onNavigate: NavigateFn }) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [shared, setShared] = useState<Set<string>>(new Set());
  const selectedJob = selectedJobId ? JOBS.find(j => j.id === selectedJobId) : null;

  const handleShare = (jobId: string, jobTitle: string, company: string) => {
    if (!shared.has(jobId)) {
      setShared(prev => { const n = new Set(prev); n.add(jobId); return n; });
      toast.success(`Shared ${jobTitle} at ${company} with Alex`, { description: "They'll see it in their EdgeMatch feed." });
    }
  };

  return (
    <div className="pt-4 pb-4">
      <div className="max-w-[1400px] mx-auto">
        <motion.div className="pt-4 pb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
          <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Alex's Job Matches</h1>
          <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{JOBS.length} roles match Alex's profile · You can share opportunities with them</span>
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: selectedJob ? "1fr 400px" : "1fr" }}>
          <div className="flex flex-col gap-3">
            {JOBS.map((job, i) => {
              const matchColor = MATCH_COLOR(job.match);
              return (
                <motion.div key={job.id} className="rounded-xl p-4 cursor-pointer transition-all" style={{ background: selectedJobId === job.id ? "rgba(var(--ce-role-parent-rgb),0.03)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${selectedJobId === job.id ? "rgba(var(--ce-role-parent-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}` }}
                  onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: EASE }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}><Building2 className="w-4 h-4 text-ce-text-tertiary" /></div>
                      <div>
                        <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                        <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.company} · {job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${matchColor}10` }}>
                        <span className="text-[11px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}%</span>
                      </div>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] cursor-pointer" style={{ background: shared.has(job.id) ? "rgba(var(--ce-role-employer-rgb),0.06)" : "rgba(var(--ce-role-parent-rgb),0.06)", border: `1px solid ${shared.has(job.id) ? "rgba(var(--ce-role-employer-rgb),0.1)" : "rgba(var(--ce-role-parent-rgb),0.1)"}`, color: shared.has(job.id) ? "var(--ce-role-employer)" : "var(--ce-role-parent)", fontFamily: "var(--font-body)" }} onClick={(e) => { e.stopPropagation(); handleShare(job.id, job.title, job.company); }}>
                        {shared.has(job.id) ? <><Check className="w-3 h-3" /> Shared</> : <><Share2 className="w-3 h-3" /> Share with Alex</>}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-[42px]">
                    <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{job.salary}</span>
                    {job.remote && <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Remote</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedJob && (
              <motion.div className="rounded-xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="p-5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div><h3 className="text-[16px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{selectedJob.title}</h3><span className="text-[13px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.company}</span></div>
                    <button onClick={() => setSelectedJobId(null)} className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] cursor-pointer"><X className="w-4 h-4 text-ce-text-tertiary" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                  <div className="rounded-xl p-3.5" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.03), rgba(var(--ce-role-parent-rgb),0.02))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
                    <div className="flex items-center gap-1.5 mb-1.5"><SophiaMark size={14} glowing={false} /><span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>FOR DAVID (PARENT)</span></div>
                    <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.sophiaTake} This could be a great conversation starter with Alex about their career direction.</p>
                  </div>
                  <p className="text-[12px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.description}</p>
                </div>
                <div className="p-4 flex gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <button onClick={() => handleShare(selectedJob.id, selectedJob.title, selectedJob.company)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: shared.has(selectedJob.id) ? "rgba(var(--ce-role-employer-rgb),0.06)" : "rgba(var(--ce-role-parent-rgb),0.08)", border: `1px solid ${shared.has(selectedJob.id) ? "rgba(var(--ce-role-employer-rgb),0.1)" : "rgba(var(--ce-role-parent-rgb),0.12)"}`, color: shared.has(selectedJob.id) ? "var(--ce-role-employer)" : "var(--ce-role-parent)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{shared.has(selectedJob.id) ? <><Check className="w-4 h-4" /> Shared with Alex</> : <><Share2 className="w-4 h-4" /> Share with Alex</>}</button>
                  <button onClick={() => onNavigate("synthesis")} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}><MessageSquare className="w-3.5 h-3.5" /> Discuss with Alex</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Guide Client Context Mode ──────────────────────────────────────────────

function GuideMatchView({ onNavigate }: { onNavigate: NavigateFn }) {
  const [clientIdx, setClientIdx] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<Set<string>>(new Set());
  const [noted, setNoted] = useState<Set<string>>(new Set());
  const clients = [
    { name: "Sharon Lee", role: "Product Design", initial: "S" },
    { name: "Marcus Johnson", role: "Software Engineering", initial: "M" },
    { name: "Priya Sharma", role: "Data Science", initial: "P" },
  ];
  const client = clients[clientIdx];
  const selectedJob = selectedJobId ? JOBS.find(j => j.id === selectedJobId) : null;

  const handleRecommend = (jobId: string, jobTitle: string) => {
    setRecommended(prev => { const n = new Set(prev); n.add(jobId); return n; });
    toast.success(`Recommended ${jobTitle} to ${client.name}`, { description: "They'll see this in their saved jobs with your note." });
  };

  return (
    <div className="pt-4 pb-4">
      <div className="max-w-[1400px] mx-auto">
        <motion.div className="pt-4 pb-5 flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EdgeMatch</h1>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Viewing matches for {client.name} · {JOBS.length} roles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Viewing as:</span>
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              {clients.map((c, i) => (
                <button key={i} onClick={() => { setClientIdx(i); setSelectedJobId(null); setRecommended(new Set()); }} className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer">
                  {clientIdx === i && <motion.div className="absolute inset-0 rounded-lg" style={{ background: "rgba(var(--ce-role-guide-rgb),0.08)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.12)" }} layoutId="guide-client-pill" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <div className="relative z-10 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)", color: "var(--ce-role-guide)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{c.initial}</div>
                    <span className={`text-[11px] ${clientIdx === i ? "text-ce-text-primary" : "text-ce-text-tertiary"}`} style={{ fontFamily: "var(--font-body)" }}>{c.name.split(" ")[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="rounded-xl p-3.5 mb-5 flex items-start gap-3" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-guide-rgb),0.04), rgba(var(--ce-role-edgestar-rgb),0.02))", border: "1px solid rgba(var(--ce-role-guide-rgb),0.08)" }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease: EASE }}>
          <SophiaMark size={16} glowing={false} />
          <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {client.name} has been saving UX Research roles but their roadmap targets {client.role}. You might want to discuss whether they're considering a path change, or if these are stretch explorations.
          </p>
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: selectedJob ? "1fr 400px" : "1fr" }}>
          <div className="flex flex-col gap-3">
            {JOBS.map((job, i) => {
              const matchColor = MATCH_COLOR(job.match);
              const isRec = recommended.has(job.id);
              return (
                <motion.div key={job.id} className="rounded-xl p-4 cursor-pointer transition-all" style={{ background: selectedJobId === job.id ? "rgba(var(--ce-role-guide-rgb),0.03)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${selectedJobId === job.id ? "rgba(var(--ce-role-guide-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)"}` }}
                  onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04, duration: 0.4, ease: EASE }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}><Building2 className="w-4 h-4 text-ce-text-tertiary" /></div>
                      <div>
                        <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{job.title}</span>
                        <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{job.company} · {job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: `${matchColor}10` }}>
                        <span className="text-[11px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{job.match}%</span>
                      </div>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] cursor-pointer" style={{ background: isRec ? "rgba(var(--ce-role-employer-rgb),0.06)" : "rgba(var(--ce-role-guide-rgb),0.06)", border: `1px solid ${isRec ? "rgba(var(--ce-role-employer-rgb),0.1)" : "rgba(var(--ce-role-guide-rgb),0.1)"}`, color: isRec ? "var(--ce-role-employer)" : "var(--ce-role-guide)", fontFamily: "var(--font-body)" }} onClick={(e) => { e.stopPropagation(); if (!isRec) handleRecommend(job.id, job.title); }}>
                        {isRec ? <><Check className="w-3 h-3" /> Sent</> : <><Send className="w-3 h-3" /> Recommend</>}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-[42px]">
                    <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{job.salary}</span>
                    {job.remote && <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Remote</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guide detail panel */}
          <AnimatePresence>
            {selectedJob && (
              <motion.div className="rounded-xl overflow-hidden flex flex-col h-[calc(100vh-14rem)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3, ease: EASE }}>
                <div className="p-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[16px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{selectedJob.title}</h3>
                      <span className="text-[13px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.company}</span>
                    </div>
                    <button onClick={() => setSelectedJobId(null)} className="p-1 rounded-md hover:bg-[rgba(var(--ce-glass-tint),0.04)] cursor-pointer"><X className="w-4 h-4 text-ce-text-tertiary" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${MATCH_COLOR(selectedJob.match)}10`, border: `1px solid ${MATCH_COLOR(selectedJob.match)}20` }}>
                      <Target className="w-3.5 h-3.5" style={{ color: MATCH_COLOR(selectedJob.match) }} />
                      <span className="text-[14px] tabular-nums" style={{ color: MATCH_COLOR(selectedJob.match), fontFamily: "var(--font-display)", fontWeight: 500 }}>{selectedJob.match}% match</span>
                    </div>
                    <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>for {client.name}</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SKILLS MATCH</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map(s => (
                        <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: s.matched ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-status-error-rgb),0.04)", color: s.matched ? "var(--ce-lime)" : "var(--ce-status-error)", border: `1px solid ${s.matched ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-status-error-rgb),0.06)"}`, fontFamily: "var(--font-body)" }}>
                          {s.matched ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}{s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-3.5" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-guide-rgb),0.04), rgba(var(--ce-role-edgestar-rgb),0.02))", border: "1px solid rgba(var(--ce-role-guide-rgb),0.08)" }}>
                    <div className="flex items-center gap-1.5 mb-1.5"><SophiaMark size={14} glowing={false} /><span className="text-[10px] text-[var(--ce-role-guide)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>COACHING NOTE</span></div>
                    <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.sophiaTake}</p>
                  </div>
                  {selectedJob.edgePathConnection && (
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.02)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.05)" }}>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ROADMAP CONNECTION</span>
                      <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.edgePathConnection}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>DESCRIPTION</span>
                    <p className="text-[12px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{selectedJob.description}</p>
                  </div>
                </div>
                <div className="p-4 flex-shrink-0 flex gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  <button onClick={() => { if (!recommended.has(selectedJob.id)) handleRecommend(selectedJob.id, selectedJob.title); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: recommended.has(selectedJob.id) ? "rgba(var(--ce-role-employer-rgb),0.06)" : "rgba(var(--ce-role-guide-rgb),0.08)", border: `1px solid ${recommended.has(selectedJob.id) ? "rgba(var(--ce-role-employer-rgb),0.1)" : "rgba(var(--ce-role-guide-rgb),0.12)"}`, color: recommended.has(selectedJob.id) ? "var(--ce-role-employer)" : "var(--ce-role-guide)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    {recommended.has(selectedJob.id) ? <><Check className="w-4 h-4" /> Recommended</> : <><Send className="w-4 h-4" /> Recommend to {client.name.split(" ")[0]}</>}
                  </button>
                  <button onClick={() => { if (!noted.has(selectedJob.id)) { setNoted(prev => { const n = new Set(prev); n.add(selectedJob.id); return n; }); toast.success(`Added to session notes for ${client.name}`); } }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ background: noted.has(selectedJob.id) ? "rgba(var(--ce-role-employer-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${noted.has(selectedJob.id) ? "rgba(var(--ce-role-employer-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.06)"}`, color: noted.has(selectedJob.id) ? "var(--ce-role-employer)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>{noted.has(selectedJob.id) ? <><Check className="w-3.5 h-3.5" /> In Session Notes</> : <><FileText className="w-3.5 h-3.5" /> Add to Session Notes</>}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Education Aggregate Mode ───────────────────────────────────────────────

function EduAggregateView({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div className="pt-4 pb-4">
      <div className="max-w-[1200px] mx-auto">
        <motion.div className="pt-4 pb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
          <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Student Job Market</h1>
          <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Aggregate view of job matches across your student cohorts</span>
        </motion.div>

        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Matches", value: "847", trend: "+12% vs last month", color: "var(--ce-role-edu)" },
            { label: "Avg Match Score", value: "74%", trend: "+3% this semester", color: "var(--ce-role-edgestar)" },
            { label: "Students w/ 80%+", value: "38%", trend: "56 students", color: "var(--ce-lime)" },
            { label: "Top Hiring Companies", value: "12", trend: "Actively recruiting", color: "var(--ce-role-guide)" },
          ].map((kpi, i) => (
            <motion.div key={i} className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: EASE }}>
              <div className="text-[24px] text-ce-text-primary tabular-nums mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{kpi.value}</div>
              <span className="text-[11px] text-ce-text-tertiary block" style={{ fontFamily: "var(--font-body)" }}>{kpi.label}</span>
              <span className="text-[10px]" style={{ color: kpi.color, fontFamily: "var(--font-body)" }}>{kpi.trend}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <motion.div className="rounded-xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4, ease: EASE }}>
            <span className="text-[13px] text-ce-text-primary block mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Match Distribution by Role</span>
            {[
              { role: "Software Engineering", pct: 32, students: 47, color: "var(--ce-role-edgestar)" },
              { role: "Product Design", pct: 24, students: 35, color: "var(--ce-lime)" },
              { role: "Data Science", pct: 18, students: 26, color: "var(--ce-role-guide)" },
              { role: "Product Management", pct: 14, students: 20, color: "var(--ce-role-edgepreneur)" },
              { role: "UX Research", pct: 12, students: 17, color: "var(--ce-role-parent)" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <span className="text-[11px] text-ce-text-tertiary w-[140px]" style={{ fontFamily: "var(--font-body)" }}>{r.role}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: r.color }} initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: EASE }} />
                </div>
                <span className="text-[10px] text-ce-text-secondary tabular-nums w-20 text-right" style={{ fontFamily: "var(--font-body)" }}>{r.students} students</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="rounded-xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4, ease: EASE }}>
            <span className="text-[13px] text-ce-text-primary block mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Top Employers Matching Students</span>
            {[
              { company: "Google", openRoles: 8, avgMatch: 82 },
              { company: "Figma", openRoles: 4, avgMatch: 79 },
              { company: "Meta", openRoles: 12, avgMatch: 76 },
              { company: "Vercel", openRoles: 3, avgMatch: 74 },
              { company: "Stripe", openRoles: 6, avgMatch: 71 },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 4 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}><Building2 className="w-3.5 h-3.5 text-ce-text-tertiary" /></div>
                <span className="text-[12px] text-ce-text-primary flex-1" style={{ fontFamily: "var(--font-body)" }}>{e.company}</span>
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{e.openRoles} roles</span>
                <span className="text-[11px] text-ce-cyan tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{e.avgMatch}% avg</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div className="rounded-xl p-4 mt-5 flex items-start gap-3" style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.03), rgba(var(--ce-role-edu-rgb),0.02))", border: "1px solid rgba(var(--ce-role-edu-rgb),0.08)" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.4, ease: EASE }}>
          <SophiaMark size={16} glowing={false} />
          <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            72% of your graduating students match with roles paying $65K+. The Design cohort is outperforming — their average match score is 82% compared to 71% across all programs.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Role-Aware Wrapper ─────────────────────────────────────────────────────

const ROLE_NAMES: Record<RoleId, { name: string; initial: string }> = {
  edgestar: { name: "Sharon", initial: "S" },
  edgepreneur: { name: "Marcus", initial: "M" },
  parent: { name: "David", initial: "D" },
  guide: { name: "Alice", initial: "A" },
  employer: { name: "Rachel", initial: "R" },
  edu: { name: "Dr. Martinez", initial: "M" },
  ngo: { name: "James", initial: "J" },
  agency: { name: "Director Liu", initial: "L" },
};

// ─── Sophia Context Per Role on EdgeMatch ────────────────────────────────────

const SOPHIA_EDGEMATCH: Record<RoleId, { message: string; chips: { label: string; action: string }[] }> = {
  edgestar: {
    message: "Ask me to explain a match, find similar roles, or check your application status.",
    chips: [{ label: "Explain my top match", action: "explain" }, { label: "Optimize resume", action: "resume" }],
  },
  edgepreneur: {
    message: "Looking for co-founders, advisors, or freelance gigs? I can filter by opportunity type.",
    chips: [{ label: "Find co-founders", action: "filter-cofounder" }, { label: "Freelance opportunities", action: "filter-freelance" }],
  },
  parent: {
    message: "Alex has 23 matches this week. The strongest are in Product Design — want me to highlight the best ones?",
    chips: [{ label: "Show top matches", action: "filter-top" }, { label: "Share all to Alex", action: "share-all" }],
  },
  guide: {
    message: "Sharon is exploring roles outside her roadmap. Want to discuss this pattern in your next session?",
    chips: [{ label: "Prep session talking points", action: "session-prep" }, { label: "Compare client targets", action: "compare" }],
  },
  employer: {
    message: "3 candidates for Product Designer scored 90%+ match. Your listing views are up 42% this week.",
    chips: [{ label: "Review top candidates", action: "review" }, { label: "Optimize listing", action: "optimize" }],
  },
  edu: {
    message: "72% of graduating students match with roles paying $65K+. The Design cohort leads at 82% avg match.",
    chips: [{ label: "View by cohort", action: "cohort" }, { label: "Export report", action: "export" }],
  },
  ngo: {
    message: "12 new applicants for community programs this week. 3 match at 85%+ — ready for screening.",
    chips: [{ label: "Review applicants", action: "review" }, { label: "Post new opportunity", action: "post" }],
  },
  agency: {
    message: "Q1 workforce placement targets are 78% achieved. 8 new candidates match open positions.",
    chips: [{ label: "Review matches", action: "review" }, { label: "View placement metrics", action: "metrics" }],
  },
};

export function EdgeMatchForRole({ role, onNavigate }: { role: RoleId; onNavigate: NavigateFn }) {
  const u = ROLE_NAMES[role];
  const sophiaCtx = SOPHIA_EDGEMATCH[role];

  const renderContent = () => {
    switch (role) {
      case "employer":
      case "ngo":
      case "agency":
        return <EmployerPostingMode onNavigate={onNavigate} roleId={role} />;
      case "parent":
        return <ParentMatchView onNavigate={onNavigate} />;
      case "guide":
        return <GuideMatchView onNavigate={onNavigate} />;
      case "edu":
        return <EduAggregateView onNavigate={onNavigate} />;
      default:
        return <EdgeMatchBrowse onNavigate={onNavigate} />;
    }
  };

  return (
    <RoleShell role={role} userName={u.name} userInitial={u.initial} edgeGas={45} onNavigate={onNavigate} activeNav="jobs" sophiaOverride={sophiaCtx}>
      {renderContent()}
    </RoleShell>
  );
}

// ─── Browse mode (extracted from EdgeMatch for RoleShell wrapping) ─────────

function EdgeMatchBrowse({ onNavigate }: { onNavigate: NavigateFn }) {
  const [jobs, setJobs] = useState(JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ remote: false, saved: false, applied: false, minMatch: 50 });

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleSave = useCallback((id: string) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, saved: !j.saved } : j));
  }, []);

  const handleApply = useCallback((id: string) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, applied: true, status: "applied" as const } : j));
    const job = jobs.find(j => j.id === id);
    toast.success(`Application submitted to ${job?.company || "company"}`, { description: "Sophia will track this and notify you of any updates." });
  }, [jobs]);

  const filteredJobs = jobs.filter((j) => {
    if (filters.remote && !j.remote) return false;
    if (filters.saved && !j.saved) return false;
    if (filters.applied && !j.applied) return false;
    if (j.match < filters.minMatch) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.match - a.match);

  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null;

  return (
    <div className="pt-4 pb-4">
      <div className="max-w-[1400px] mx-auto">
        <motion.div className="pt-4 pb-5 flex items-center justify-between" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[20px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EdgeMatch</h1>
            <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{filteredJobs.length} roles match your profile · Sorted by match strength</span>
          </div>
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ce-text-quaternary)]" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search roles or companies..." className="w-full pl-9 pr-3 py-2 rounded-xl text-[12px] text-ce-text-primary placeholder:text-[var(--ce-text-quaternary)] outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
          </div>
        </motion.div>

        {(filters.remote || filters.saved || filters.applied || filters.minMatch > 50) && (
          <motion.div className="flex items-center gap-2 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filters.remote && <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", color: "var(--ce-role-edgestar)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)", fontFamily: "var(--font-body)" }} onClick={() => handleFilterChange("remote", false)}>Remote <X className="w-2.5 h-2.5" /></span>}
            {filters.saved && <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer" style={{ background: "rgba(var(--ce-lime-rgb),0.06)", color: "var(--ce-lime)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)", fontFamily: "var(--font-body)" }} onClick={() => handleFilterChange("saved", false)}>Saved <X className="w-2.5 h-2.5" /></span>}
            {filters.minMatch > 50 && <span className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} onClick={() => handleFilterChange("minMatch", 50)}>{filters.minMatch}%+ <X className="w-2.5 h-2.5" /></span>}
          </motion.div>
        )}

        <div className="grid gap-5" style={{ gridTemplateColumns: selectedJob ? "200px 1fr 400px" : "200px 1fr" }}>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          <div className="flex flex-col gap-3">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-8 h-8 text-[var(--ce-text-quaternary)] mb-3" />
                <p className="text-[14px] text-ce-text-tertiary mb-1" style={{ fontFamily: "var(--font-body)" }}>No jobs match your current filters.</p>
                <button className="text-[12px] text-ce-cyan cursor-pointer" style={{ fontFamily: "var(--font-body)" }} onClick={() => setFilters({ remote: false, saved: false, applied: false, minMatch: 50 })}>Clear all filters</button>
              </div>
            ) : filteredJobs.map((job, i) => (
              <motion.div key={job.id} transition={{ delay: i * 0.04 }}>
                <JobCard job={job} isSelected={selectedJobId === job.id} onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)} onToggleSave={handleToggleSave} />
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {selectedJob && <JobDetailPanel job={selectedJob} onClose={() => setSelectedJobId(null)} onToggleSave={handleToggleSave} onApply={handleApply} onNavigate={onNavigate} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}