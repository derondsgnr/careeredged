import { EASE } from "../tokens";
/**
 * Funding Surface — EdgePreneur
 *
 * Funding discovery and application management for founders.
 * Matches by venture stage, category, and readiness.
 * Sophia guides pitch preparation and application prioritization.
 *
 * Layer 3 scope:
 * - Funding opportunity cards (accelerators, grants, angels, VCs, partnerships)
 * - Stage + category filter
 * - Opportunity detail drawer with Sophia pitch prep
 * - Active applications tracker
 * - Sophia funding strategy insight
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { useSophia } from "../sophia-context";
import { toast } from "../ui/feedback";
import { FormattedNumberInput } from "../ui/formatted-number-input";
import {
  TrendingUp, DollarSign, Calendar, ChevronRight, X, Star,
  Zap, Target, Clock, Check, ArrowRight, Users,
  Rocket, Globe, Award, BookOpen, Filter, Search,
  Sparkles, FileText, Edit3, Send, Loader2, AlertTriangle,
} from "lucide-react";

const PRENEUR_GOLD = "var(--ce-role-edgepreneur)";

// ─── Types ───────────────────────────────────────────────────────────────────

type FundingType   = "accelerator" | "grant" | "angel" | "vc" | "partnership";
type VentureStage  = "idea" | "mvp" | "early" | "growth";
type AppStatus     = "not_started" | "in_progress" | "submitted" | "interview" | "accepted" | "rejected";

interface FundingOpp {
  id: string;
  name: string;
  type: FundingType;
  amount: string;
  amountMax?: string;
  deadline: string;
  daysUntil?: number;
  stage: VentureStage[];
  match: number;
  location: string;
  description: string;
  equity?: string;
  notablePortfolio?: string[];
  sophiaNote: string;
  appStatus: AppStatus;
  starred: boolean;
  requirements: string[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<FundingType, { label: string; color: string; icon: React.ReactNode }> = {
  accelerator:  { label: "Accelerator",   color: "var(--ce-text-secondary)", icon: <Rocket className="w-3 h-3" /> },
  grant:        { label: "Grant",         color: "var(--ce-text-secondary)", icon: <Award className="w-3 h-3" /> },
  angel:        { label: "Angel",         color: "var(--ce-text-secondary)", icon: <Users className="w-3 h-3" /> },
  vc:           { label: "VC",            color: "var(--ce-text-secondary)", icon: <TrendingUp className="w-3 h-3" /> },
  partnership:  { label: "Partnership",   color: "var(--ce-text-secondary)", icon: <Globe className="w-3 h-3" /> },
};

const STAGE_LABELS: Record<VentureStage, string> = {
  idea:   "Idea",
  mvp:    "MVP",
  early:  "Early",
  growth: "Growth",
};

const APP_STATUS_CONFIG: Record<AppStatus, { label: string; color: string }> = {
  not_started: { label: "Not started",  color: "var(--ce-text-tertiary)" },
  in_progress: { label: "In progress",  color: "var(--ce-text-secondary)" },
  submitted:   { label: "Submitted",    color: "var(--ce-lime)" },
  interview:   { label: "Interview",    color: "var(--ce-text-secondary)" },
  accepted:    { label: "Accepted",     color: "var(--ce-lime)" },
  rejected:    { label: "Rejected",     color: "var(--ce-status-error)" },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const OPPORTUNITIES: FundingOpp[] = [
  {
    id: "f1",
    name: "Y Combinator — W26 Batch",
    type: "accelerator",
    amount: "$500,000",
    deadline: "April 6, 2026",
    daysUntil: 19,
    stage: ["mvp", "early"],
    match: 88,
    location: "San Francisco (in-person)",
    equity: "7%",
    description: "The world's most prestigious accelerator. 3-month program in SF. $500k investment for 7% equity. Access to YC's global alumni network and Demo Day investors.",
    notablePortfolio: ["Airbnb", "Stripe", "DoorDash", "Coinbase"],
    sophiaNote: "Your current stage is a strong fit for YC's W26 batch. Your SaaS metrics (MRR growth +18% MoM) are in the top 20% of applicants I've analyzed. Main weakness: the team narrative needs to explain why you're the right people for this problem. Sophia recommends 3 focused revisions to the application before submission.",
    appStatus: "in_progress",
    starred: true,
    requirements: ["Working product or strong prototype", "2+ co-founders preferred", "Clear market size articulation", "Demo video (2 min max)"],
  },
  {
    id: "f2",
    name: "First Round Capital — Seed",
    type: "vc",
    amount: "$500,000",
    amountMax: "$3,000,000",
    deadline: "Rolling",
    stage: ["mvp", "early"],
    match: 82,
    location: "Remote-friendly",
    equity: "15–25%",
    description: "First Round invests at the earliest stage, often pre-product. Known for exceptional founder support and network. Focus on B2B SaaS, marketplace, consumer, and deep tech.",
    notablePortfolio: ["Uber", "Square", "Warby Parker", "Notion"],
    sophiaNote: "First Round has backed 3 companies in the HR/career tech space in the last 18 months. Your product overlaps with their investment thesis around 'future of work.' Sophia recommends a warm intro via your YC alumni connection before cold outreach.",
    appStatus: "not_started",
    starred: false,
    requirements: ["Pre-revenue OK", "Strong founding team story", "Clear wedge into a large market", "Warm intro preferred"],
  },
  {
    id: "f3",
    name: "NSF SBIR Phase I Grant",
    type: "grant",
    amount: "$275,000",
    deadline: "March 31, 2026",
    daysUntil: 13,
    stage: ["idea", "mvp"],
    match: 74,
    location: "US-based companies",
    description: "Non-dilutive federal grant for technology innovation with commercial potential. Phase I is $275k for proof-of-concept. Phase II can follow with up to $1.8M.",
    sophiaNote: "Non-dilutive capital at this stage is valuable. The 13-day deadline is tight but achievable — the application is mostly narrative. Sophia has pre-filled 60% of it using your pitch deck. Main gaps: R&D methodology section and societal impact statement.",
    appStatus: "not_started",
    starred: true,
    requirements: ["US-based LLC or C-Corp", "Technology with scientific merit", "Clear commercialization plan", "PI with technical background"],
  },
  {
    id: "f4",
    name: "Backstage Capital — Pre-Seed",
    type: "angel",
    amount: "$25,000",
    amountMax: "$100,000",
    deadline: "Rolling",
    stage: ["idea", "mvp"],
    match: 91,
    location: "Remote",
    equity: "5–8%",
    description: "Backstage Capital invests in founders who are underrepresented in venture capital. Focus on early-stage startups with strong founder-market fit.",
    sophiaNote: "91% match — your highest across all opportunities. Backstage specifically targets founders your background represents. Application is lightweight and decision time is under 4 weeks. Sophia recommends applying this week.",
    appStatus: "not_started",
    starred: false,
    requirements: ["Underrepresented founder", "Clear problem-solution fit", "Early traction preferred but not required", "1-page pitch OK"],
  },
  {
    id: "f5",
    name: "Techstars — Chicago 2026",
    type: "accelerator",
    amount: "$120,000",
    deadline: "May 1, 2026",
    daysUntil: 44,
    stage: ["mvp", "early"],
    match: 79,
    location: "Chicago, IL (in-person)",
    equity: "6%",
    description: "Techstars Chicago's 13-week accelerator. Strong corporate sponsor network (United, Motorola, McDonald's). $120k investment for 6% equity.",
    notablePortfolio: ["DigitalOcean", "ClassPass", "SendGrid"],
    sophiaNote: "Good backup option if YC doesn't pan out. Techstars Chicago has stronger enterprise connections than YC for B2B plays. Their mentor network is deep in workforce tech — high strategic value for your category.",
    appStatus: "not_started",
    starred: false,
    requirements: ["MVP with at least 1 paying customer", "Committable to Chicago for 13 weeks", "Full-time founding team"],
  },
  {
    id: "f6",
    name: "Google for Startups — EdTech Track",
    type: "partnership",
    amount: "$100,000",
    deadline: "April 30, 2026",
    daysUntil: 43,
    stage: ["mvp", "early", "growth"],
    match: 86,
    location: "Remote",
    description: "Google Cloud credits + $100k equity-free cash + access to Google's EdTech ecosystem. Non-dilutive. Strong for companies building on Google infrastructure.",
    sophiaNote: "High match given your stack. The equity-free structure makes this especially attractive as a supplement to your seed raise — it extends runway without dilution. Apply in parallel with YC — they're not mutually exclusive.",
    appStatus: "submitted",
    starred: true,
    requirements: ["EdTech or adjacent category", "Building on Google Cloud", "Post-MVP preferred", "Strong social impact angle"],
  },
];

// ─── Opportunity Detail Drawer ────────────────────────────────────────────────

function OpportunityDrawer({
  opp,
  onClose,
  onStar,
  onApply,
}: {
  opp: FundingOpp;
  onClose: () => void;
  onStar: (id: string) => void;
  onApply: (opp: FundingOpp) => void;
}) {
  const { openSophia } = useSophia();
  const typeCfg = TYPE_CONFIG[opp.type];
  const statusCfg = APP_STATUS_CONFIG[opp.appStatus];
  const matchColor = opp.match >= 85 ? "var(--ce-lime)" : opp.match >= 75 ? PRENEUR_GOLD : "var(--ce-text-tertiary)";

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[440px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: `${typeCfg.color}12`, color: typeCfg.color, border: `1px solid ${typeCfg.color}20`, fontFamily: "var(--font-body)" }}>
              {typeCfg.icon}{typeCfg.label}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${statusCfg.color}10`, color: statusCfg.color, border: `1px solid ${statusCfg.color}20`, fontFamily: "var(--font-body)" }}>
              {statusCfg.label}
            </span>
          </div>
          <span className="text-[14px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{opp.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onStar(opp.id)} className="cursor-pointer">
            <Star className="w-4 h-4" style={{ color: opp.starred ? PRENEUR_GOLD : "var(--ce-text-quaternary)", fill: opp.starred ? "rgba(var(--ce-role-edgepreneur-rgb),0.3)" : "none" }} />
          </button>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Match + amount */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[22px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {opp.amount}{opp.amountMax && <span className="text-[14px] text-[var(--ce-text-secondary)]"> – {opp.amountMax}</span>}
              </div>
              {opp.equity && <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>Equity: {opp.equity}</span>}
            </div>
            <div className="text-right">
              <div className="text-[28px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{opp.match}%</div>
              <div className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>match</div>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
            <motion.div className="h-full rounded-full" style={{ background: matchColor }}
              initial={{ width: 0 }} animate={{ width: `${opp.match}%` }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              <Calendar className="w-3 h-3" />{opp.deadline}{opp.daysUntil && ` · ${opp.daysUntil}d left`}
            </div>
            <div className="flex items-center gap-1.5 text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              <Globe className="w-3 h-3" />{opp.location}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{opp.description}</p>
        </div>

        {/* Sophia note */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <SophiaMark size={12} glowing={false} />
            <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's read</span>
          </div>
          <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{opp.sophiaNote}</p>
        </div>

        {/* Requirements */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>REQUIREMENTS</span>
          <div className="flex flex-col gap-1.5">
            {opp.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-3 h-3 text-[var(--ce-text-quaternary)] mt-0.5 flex-shrink-0" />
                <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        {opp.notablePortfolio && (
          <div className="px-5 py-4">
            <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>NOTABLE PORTFOLIO</span>
            <div className="flex flex-wrap gap-1.5">
              {opp.notablePortfolio.map((co) => (
                <span key={co} className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>{co}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-4 flex flex-col gap-2.5" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {(opp.appStatus === "not_started" || opp.appStatus === "in_progress") && (
          <button
            onClick={() => onApply(opp)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{
              background: opp.appStatus === "not_started" ? `${PRENEUR_GOLD}12` : "rgba(var(--ce-role-edgestar-rgb),0.1)",
              border: `1px solid ${opp.appStatus === "not_started" ? `${PRENEUR_GOLD}25` : "rgba(var(--ce-role-edgestar-rgb),0.2)"}`,
              color: opp.appStatus === "not_started" ? PRENEUR_GOLD : "var(--ce-role-edgestar)",
              fontFamily: "var(--font-display)", fontWeight: 500,
            }}>
            {opp.appStatus === "not_started"
              ? <><Rocket className="w-3.5 h-3.5" /> Start application</>
              : <><FileText className="w-3.5 h-3.5" /> Continue application</>}
          </button>
        )}
        {opp.appStatus === "submitted" && (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px]"
            style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.15)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>
            <Check className="w-3.5 h-3.5" /> Submitted — awaiting response
          </div>
        )}
        <button
          onClick={() => openSophia(`Help me prepare my pitch for "${opp.name}". ${opp.sophiaNote} What should I emphasize, what are the judges looking for, and what are my biggest gaps?`)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-lime-rgb),0.06)] transition-colors"
          style={{ background: "rgba(var(--ce-lime-rgb),0.03)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>
          <Sparkles className="w-3.5 h-3.5" /> Prep pitch with Sophia
        </button>
      </div>
    </motion.div>
  );
}

// ─── Application Panel (3-step slide-in) ─────────────────────────────────────

const DRAFT_KEY = "ce-funding-drafts";

interface AppFormData {
  orgName: string;
  contactEmail: string;
  amountRequesting: string;
  projectDescription: string;
  impactStatement: string;
}

const EMPTY_FORM: AppFormData = {
  orgName: "",
  contactEmail: "",
  amountRequesting: "",
  projectDescription: "",
  impactStatement: "",
};

function loadDraft(oppId: string): AppFormData {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_FORM;
    const drafts = JSON.parse(raw);
    return drafts[oppId] ?? EMPTY_FORM;
  } catch {
    return EMPTY_FORM;
  }
}

function saveDraft(oppId: string, data: AppFormData) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    const drafts = raw ? JSON.parse(raw) : {};
    drafts[oppId] = data;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch {
    // silent — localStorage may be full
  }
}

function clearDraft(oppId: string) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const drafts = JSON.parse(raw);
    delete drafts[oppId];
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch {
    // silent
  }
}

function ApplicationPanel({
  opp,
  onClose,
  onSubmitted,
}: {
  opp: FundingOpp;
  onClose: () => void;
  onSubmitted: (oppId: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AppFormData>(() => loadDraft(opp.id));
  const [submitting, setSubmitting] = useState(false);

  const steps = ["Basic info", "Narrative", "Review & submit"];

  // Auto-save draft on form change
  useEffect(() => {
    saveDraft(opp.id, form);
  }, [form, opp.id]);

  const canAdvanceStep0 = form.orgName.trim() && form.contactEmail.trim() && form.amountRequesting.trim();
  const canAdvanceStep1 = form.projectDescription.trim() && form.impactStatement.trim();

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      clearDraft(opp.id);
      onSubmitted(opp.id);
      setSubmitting(false);
      onClose();
      toast.success("Application submitted", `Your application for ${opp.name} has been sent`);
    }, 1200);
  };

  const inputStyle = {
    background: "rgba(var(--ce-glass-tint),0.04)",
    border: "1px solid rgba(var(--ce-glass-tint),0.08)",
    fontFamily: "var(--font-body)",
  } as const;

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Apply — {opp.name}
          </span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors">
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </button>
        </div>
        {/* Segmented progress bar */}
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: i <= step ? PRENEUR_GOLD : "transparent" }}
                  initial={{ width: 0 }}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </div>
              <span className="text-[9px]" style={{
                color: i === step ? PRENEUR_GOLD : i < step ? "var(--ce-text-secondary)" : "var(--ce-text-quaternary)",
                fontFamily: "var(--font-body)",
              }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="app-s0" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ORGANIZATION NAME</label>
                <input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  placeholder="e.g. EdgeTech Inc." className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                  style={inputStyle} />
              </div>
              <div>
                <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CONTACT EMAIL</label>
                <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="you@company.com" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                  style={inputStyle} />
              </div>
              <div>
                <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>AMOUNT REQUESTING</label>
                <FormattedNumberInput value={form.amountRequesting} onChange={(v) => setForm({ ...form, amountRequesting: v })}
                  placeholder="e.g. 250000" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                  style={inputStyle} />
                <span className="text-[10px] text-[var(--ce-text-quaternary)] mt-1 block" style={{ fontFamily: "var(--font-body)" }}>
                  {opp.name} offers {opp.amount}{opp.amountMax ? ` – ${opp.amountMax}` : ""}
                </span>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="app-s1" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROJECT DESCRIPTION</label>
                <textarea value={form.projectDescription} onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                  placeholder="Describe your project, what problem it solves, and your current traction..."
                  rows={5} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none resize-none leading-relaxed"
                  style={inputStyle} />
              </div>
              <div>
                <label className="text-[10px] text-[var(--ce-text-secondary)] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>IMPACT STATEMENT</label>
                <textarea value={form.impactStatement} onChange={(e) => setForm({ ...form, impactStatement: e.target.value })}
                  placeholder="How will this funding accelerate your growth and create impact?"
                  rows={4} className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none resize-none leading-relaxed"
                  style={inputStyle} />
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.1)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <SophiaMark size={12} glowing={false} />
                  <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's tip</span>
                </div>
                <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Be specific about metrics. Mention your MRR, user count, or pilot results. Quantified traction outperforms general narratives in competitive applications.
                </p>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="app-s2" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-3">
              <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                {[
                  { label: "Opportunity",       value: opp.name },
                  { label: "Organization",      value: form.orgName || "(empty)" },
                  { label: "Contact email",     value: form.contactEmail || "(empty)" },
                  { label: "Amount requesting", value: form.amountRequesting ? `$${Number(form.amountRequesting).toLocaleString()}` : "(empty)" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
                    <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-body)" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Narrative preview */}
              <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROJECT DESCRIPTION</span>
                <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed line-clamp-4" style={{ fontFamily: "var(--font-body)" }}>
                  {form.projectDescription || "(empty)"}
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>IMPACT STATEMENT</span>
                <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed line-clamp-4" style={{ fontFamily: "var(--font-body)" }}>
                  {form.impactStatement || "(empty)"}
                </p>
              </div>

              <p className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed mt-1" style={{ fontFamily: "var(--font-body)" }}>
                Once submitted, you can track your application status on this surface. Sophia will notify you of any updates.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-5 py-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
            style={{ border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
            Back
          </button>
        )}
        <button
          onClick={step < 2 ? () => setStep(step + 1) : handleSubmit}
          disabled={(step === 0 && !canAdvanceStep0) || (step === 1 && !canAdvanceStep1) || submitting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: `${PRENEUR_GOLD}12`,
            border: `1px solid ${PRENEUR_GOLD}25`,
            color: PRENEUR_GOLD,
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
        >
          {submitting
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
            : step < 2
              ? <><ArrowRight className="w-3.5 h-3.5" /> Continue</>
              : <><Send className="w-3.5 h-3.5" /> Submit application</>}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Opportunity Card ─────────────────────────────────────────────────────────

function OppCard({ opp, onSelect, onStar }: { opp: FundingOpp; onSelect: (o: FundingOpp) => void; onStar: (id: string) => void }) {
  const typeCfg = TYPE_CONFIG[opp.type];
  const statusCfg = APP_STATUS_CONFIG[opp.appStatus];
  const matchColor = opp.match >= 85 ? "var(--ce-lime)" : opp.match >= 75 ? PRENEUR_GOLD : "var(--ce-text-tertiary)";

  return (
    <motion.div
      className="rounded-xl p-4 cursor-pointer group relative"
      style={{
        background: "rgba(var(--ce-glass-tint),0.025)",
        border: `1px solid ${opp.starred ? `${PRENEUR_GOLD}15` : opp.appStatus !== "not_started" ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.05)"}`,
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(opp)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: `${typeCfg.color}12`, color: typeCfg.color, border: `1px solid ${typeCfg.color}20`, fontFamily: "var(--font-body)" }}>
              {typeCfg.icon}{typeCfg.label}
            </span>
            {opp.appStatus !== "not_started" && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${statusCfg.color}10`, color: statusCfg.color, border: `1px solid ${statusCfg.color}20`, fontFamily: "var(--font-body)" }}>
                {statusCfg.label}
              </span>
            )}
            {opp.daysUntil !== undefined && opp.daysUntil <= 30 && (() => {
              const urgent = opp.daysUntil! < 3;
              const warn = !urgent && opp.daysUntil! < 7;
              const badgeColor = urgent ? "var(--ce-status-error)" : warn ? "var(--ce-status-warning)" : "var(--ce-text-secondary)";
              const badgeBgRgb = urgent ? "var(--ce-status-error-rgb)" : warn ? "var(--ce-status-warning-rgb)" : "var(--ce-glass-tint)";
              return (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full tabular-nums" style={{
                  background: `rgba(${badgeBgRgb},${urgent ? 0.12 : warn ? 0.1 : 0.04})`,
                  color: badgeColor,
                  border: `1px solid rgba(${badgeBgRgb},${urgent ? 0.25 : warn ? 0.2 : 0.08})`,
                  fontFamily: "var(--font-body)",
                }}>
                  {opp.daysUntil}d left
                </span>
              );
            })()}
          </div>
          <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{opp.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onStar(opp.id); }} className="cursor-pointer">
            <Star className="w-3.5 h-3.5 transition-colors" style={{ color: opp.starred ? PRENEUR_GOLD : "var(--ce-text-quaternary)", fill: opp.starred ? "rgba(var(--ce-role-edgepreneur-rgb),0.3)" : "none" }} />
          </button>
          <div className="text-right">
            <div className="text-[14px] tabular-nums" style={{ color: matchColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{opp.match}%</div>
            <div className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>match</div>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-[10px] text-[var(--ce-text-quaternary)] mb-3">
        <div className="flex items-center gap-1"><DollarSign className="w-2.5 h-2.5" />{opp.amount}{opp.equity && ` · ${opp.equity}`}</div>
        <div className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{opp.deadline}</div>
        <div className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{opp.location.split("(")[0].trim()}</div>
      </div>

      {/* Stage tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {opp.stage.map((s) => (
          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
            {STAGE_LABELS[s]}
          </span>
        ))}
      </div>

      {/* Sophia teaser */}
      <div className="flex items-start gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <SophiaMark size={10} glowing={false} />
        <span className="text-[10px] text-[var(--ce-text-secondary)] line-clamp-1 flex-1" style={{ fontFamily: "var(--font-body)" }}>
          {opp.sophiaNote.slice(0, 80)}…
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function FundingSurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = "edgepreneur" as const;

  const [opps, setOpps] = useState<FundingOpp[]>(OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<FundingOpp | null>(null);
  const [applyingOpp, setApplyingOpp] = useState<FundingOpp | null>(null);
  const [typeFilter, setTypeFilter] = useState<FundingType | "all">("all");
  const [stageFilter, setStageFilter] = useState<VentureStage | "all">("all");
  const [search, setSearch] = useState("");

  // Keep selectedOpp in sync with mutable opps state
  useEffect(() => {
    if (selectedOpp) {
      const fresh = opps.find((o) => o.id === selectedOpp.id);
      if (fresh && (fresh.appStatus !== selectedOpp.appStatus || fresh.starred !== selectedOpp.starred)) {
        setSelectedOpp(fresh);
      }
    }
  }, [opps, selectedOpp]);

  const handleNavigate = (target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`, roadmap: `/${role}/edgepath`, funding: `/${role}/funding`,
      messages: `/${role}/messages`, milestones: `/${role}/taskroom`, landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  const handleStar = (id: string) => {
    setOpps((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const nowStarred = !o.starred;
      toast.info(nowStarred ? "Added to watchlist" : "Removed from watchlist", o.name);
      return { ...o, starred: nowStarred };
    }));
    setSelectedOpp((prev) => prev?.id === id ? { ...prev, starred: !prev.starred } : prev);
  };

  const handleApply = (opp: FundingOpp) => {
    // Set status to in_progress when opening application
    setOpps((prev) => prev.map((o) => o.id === opp.id && o.appStatus === "not_started" ? { ...o, appStatus: "in_progress" as AppStatus } : o));
    setSelectedOpp(null);
    setApplyingOpp(opp);
  };

  const handleSubmitted = (oppId: string) => {
    setOpps((prev) => prev.map((o) => o.id === oppId ? { ...o, appStatus: "submitted" as AppStatus } : o));
    setSelectedOpp((prev) => prev?.id === oppId ? { ...prev, appStatus: "submitted" as AppStatus } : prev);
  };

  const filtered = opps.filter((o) => {
    const matchesType  = typeFilter  === "all" || o.type === typeFilter;
    const matchesStage = stageFilter === "all" || o.stage.includes(stageFilter);
    const matchesSearch = !search || o.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStage && matchesSearch;
  });

  const activeApps = opps.filter(o => o.appStatus !== "not_started" && o.appStatus !== "rejected");
  const starred = opps.filter(o => o.starred);
  const urgentDeadlines = opps.filter(o => o.daysUntil !== undefined && o.daysUntil <= 20);

  // Contextual Sophia bottom bar — updates when an opportunity is selected
  const sophiaOverride = selectedOpp
    ? {
        message: `${selectedOpp.name} — ${selectedOpp.match}% match · ${selectedOpp.amount}`,
        chips: [
          { label: selectedOpp.appStatus === "not_started" ? "Start application" : "Continue application", action: `Help me ${selectedOpp.appStatus === "not_started" ? "start" : "continue"} my application for "${selectedOpp.name}". ${selectedOpp.sophiaNote}` },
          { label: "Prep pitch", action: `Help me prepare my pitch for "${selectedOpp.name}". ${selectedOpp.sophiaNote} What should I emphasize and what are my gaps?` },
        ],
      }
    : {
        message: "YC application is in progress — deadline in 19 days, 3 revisions recommended",
        chips: [
          { label: "Review my YC app", action: "Review my Y Combinator application and tell me the 3 things that will most improve my chances" },
          { label: "Funding strategy", action: "What's the best funding strategy for my stage — which opportunities should I prioritize and in what order?" },
        ],
      };

  return (
    <RoleShell role={role} userName="Jordan" userInitial="J" edgeGas={55} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[22px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Funding</h1>
            <p className="text-[13px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              {filtered.length} opportunities matched · {activeApps.length} active applications
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer"
            style={{ background: "rgba(var(--ce-lime-rgb),0.08)", border: "1px solid rgba(var(--ce-lime-rgb),0.15)", color: "var(--ce-lime)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            <Sparkles className="w-3.5 h-3.5" /> Funding strategy
          </button>
        </motion.div>

        {/* KPI strip */}
        <motion.div className="grid grid-cols-4 gap-3 mb-5"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}>
          {[
            { label: "Opportunities matched",  value: opps.length,                                                      color: PRENEUR_GOLD },
            { label: "Total available",         value: `$${(4645000).toLocaleString()}`,                                 color: "var(--ce-text-secondary)"    },
            { label: "Active applications",     value: activeApps.length,                                                color: "var(--ce-text-secondary)"    },
            { label: "Urgent deadlines",        value: urgentDeadlines.length,                                           color: urgentDeadlines.length > 0 ? "var(--ce-status-error)" : "var(--ce-text-quaternary)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl px-4 py-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <div className="text-[22px] tabular-nums mb-0.5" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{stat.value}</div>
              <div className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 280px" }}>
          {/* Opportunity list */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}>
                <Search className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search opportunities..."
                  className="flex-1 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] bg-transparent outline-none" style={{ fontFamily: "var(--font-body)" }} />
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                {(["all", "accelerator", "grant", "angel", "vc", "partnership"] as const).map((t) => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className="px-2.5 py-1.5 rounded-md text-[10px] cursor-pointer capitalize transition-all"
                    style={{ background: typeFilter === t ? "rgba(var(--ce-glass-tint),0.08)" : "transparent", color: typeFilter === t ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                    {t === "all" ? "All" : TYPE_CONFIG[t as FundingType]?.label ?? t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {filtered
                  .sort((a, b) => b.match - a.match)
                  .map((opp, i) => (
                    <motion.div key={opp.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}>
                      <OppCard opp={opp} onSelect={setSelectedOpp} onStar={handleStar} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <SophiaInsight
              message="Apply to YC, Backstage Capital, and Google for Startups in parallel. Non-dilutive (Google) + equity (YC) + underrepresented (Backstage) is the optimal stack for your stage."
              actionLabel="Build my plan"
              onAction={() => {}}
              actionPrompt="Build me a prioritized funding strategy — which opportunities should I apply to in what order, and what's the optimal stack for my current venture stage?"
              delay={0.4}
            />

            {/* Active applications */}
            {activeApps.length > 0 && (
              <GlassCard delay={0.5}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-3.5 h-3.5" style={{ color: PRENEUR_GOLD }} />
                  <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Active applications</span>
                </div>
                {activeApps.map((opp, i) => {
                  const statusCfg = APP_STATUS_CONFIG[opp.appStatus];
                  return (
                    <button key={opp.id} onClick={() => setSelectedOpp(opp)}
                      className="w-full flex items-center gap-2.5 py-2 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-lg px-1 text-left transition-colors"
                      style={{ borderBottom: i < activeApps.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusCfg.color }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-[var(--ce-text-primary)] block truncate" style={{ fontFamily: "var(--font-body)" }}>{opp.name}</span>
                        <span className="text-[10px]" style={{ color: statusCfg.color, fontFamily: "var(--font-body)" }}>{statusCfg.label}{opp.daysUntil ? ` · ${opp.daysUntil}d` : ""}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0" />
                    </button>
                  );
                })}
              </GlassCard>
            )}

            {/* Starred */}
            {starred.length > 0 && (
              <GlassCard delay={0.6}>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-3.5 h-3.5" style={{ color: PRENEUR_GOLD, fill: "rgba(var(--ce-role-edgepreneur-rgb),0.3)" }} />
                  <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Starred</span>
                </div>
                {starred.map((opp, i) => (
                  <button key={opp.id} onClick={() => setSelectedOpp(opp)}
                    className="w-full flex items-center gap-2 py-2 cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.02)] rounded-lg px-1 text-left transition-colors"
                    style={{ borderBottom: i < starred.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                    <span className="text-[11px] text-[var(--ce-text-tertiary)] flex-1 truncate" style={{ fontFamily: "var(--font-body)" }}>{opp.name}</span>
                    <span className="text-[10px] tabular-nums" style={{ color: opp.match >= 85 ? "var(--ce-lime)" : PRENEUR_GOLD, fontFamily: "var(--font-body)" }}>{opp.match}%</span>
                  </button>
                ))}
              </GlassCard>
            )}

            {/* Deadline alerts */}
            {urgentDeadlines.length > 0 && (
              <GlassCard delay={0.7}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-[var(--ce-status-error)]" />
                  <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Deadline alerts</span>
                </div>
                {urgentDeadlines.map((opp, i) => (
                  <div key={opp.id} className="flex items-center gap-2 py-1.5" style={{ borderBottom: i < urgentDeadlines.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: opp.daysUntil! <= 7 ? "var(--ce-status-error)" : "var(--ce-role-edgepreneur)" }} />
                    <span className="text-[11px] text-[var(--ce-text-tertiary)] flex-1 truncate" style={{ fontFamily: "var(--font-body)" }}>{opp.name}</span>
                    <span className="text-[10px] tabular-nums" style={{ color: opp.daysUntil! <= 7 ? "var(--ce-status-error)" : "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>{opp.daysUntil}d</span>
                  </div>
                ))}
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      {/* Opportunity drawer */}
      <AnimatePresence>
        {selectedOpp && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOpp(null)} />
            <OpportunityDrawer opp={selectedOpp} onClose={() => setSelectedOpp(null)} onStar={handleStar} onApply={handleApply} />
          </>
        )}
      </AnimatePresence>

      {/* Application panel */}
      <AnimatePresence>
        {applyingOpp && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(var(--ce-shadow-tint),0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setApplyingOpp(null)} />
            <ApplicationPanel opp={applyingOpp} onClose={() => setApplyingOpp(null)} onSubmitted={handleSubmitted} />
          </>
        )}
      </AnimatePresence>
    </RoleShell>
  );
}