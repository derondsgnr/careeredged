import { EASE } from "../tokens";
/**
 * Workplace Surface — EdgeWorkplace
 *
 * Professional documents, templates & workspaces for all roles.
 * 100+ templates across career, business, brand, and immigration categories.
 * Sophia guides workspace setup and template selection.
 *
 * States: Empty → Building (2-step Sophia flow) → Active (3 tabs)
 * Route: /:role/workplace
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  FileText, FilePlus, FolderOpen, Search, Share2, Pencil,
  Trash2, Plus, ChevronRight, ArrowRight, Sparkles, BookOpen,
  Briefcase, Globe, User, Check, X, Copy, ExternalLink, Circle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type TemplateCategory = "career" | "business" | "brand" | "immigration";

interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  complexity: "simple" | "moderate" | "advanced";
  industry?: string;
  previewLines: string[];
}

interface UserDocument {
  id: string;
  title: string;
  templateId: string;
  status: "draft" | "final" | "shared";
  lastEdited: string;
  shareLink?: string;
}

interface Workspace {
  id: string;
  name: string;
  docCount: number;
  lastActivity: string;
  color: string;
}

// ─── Category config ────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<TemplateCategory, { label: string; color: string; icon: React.ReactNode }> = {
  career:      { label: "Career",      color: "var(--ce-role-edgestar)",    icon: <Briefcase className="w-3 h-3" /> },
  business:    { label: "Business",    color: "var(--ce-role-edgepreneur)", icon: <BookOpen className="w-3 h-3" /> },
  brand:       { label: "Brand",       color: "var(--ce-role-guide)",       icon: <User className="w-3 h-3" /> },
  immigration: { label: "Immigration", color: "var(--ce-role-parent)",      icon: <Globe className="w-3 h-3" /> },
};

const STATUS_CONFIG: Record<UserDocument["status"], { label: string; color: string }> = {
  draft:  { label: "Draft",  color: "var(--ce-status-warning)" },
  final:  { label: "Final",  color: "var(--ce-status-success)" },
  shared: { label: "Shared", color: "var(--ce-role-edgestar)" },
};

const COMPLEXITY_DOTS: Record<Template["complexity"], number> = {
  simple: 1,
  moderate: 2,
  advanced: 3,
};

// ─── Mock Templates ─────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  { id: "t1", title: "Professional Resume", category: "career", description: "ATS-optimized resume with modern formatting.", complexity: "moderate", previewLines: ["PROFESSIONAL SUMMARY", "3-5 sentences highlighting your expertise", "EXPERIENCE", "Company Name \u00b7 Role \u00b7 Duration"] },
  { id: "t2", title: "Cover Letter", category: "career", description: "Targeted cover letter with personalized opening.", complexity: "simple", previewLines: ["Dear Hiring Manager,", "Opening paragraph \u2014 why this role", "Body \u2014 key qualifications", "Closing \u2014 call to action"] },
  { id: "t3", title: "Thank You Note", category: "career", description: "Post-interview follow-up with personal touch.", complexity: "simple", previewLines: ["Subject: Thank you \u2014 [Role] Interview", "Personalized opening", "Key discussion point reference", "Reiterate enthusiasm + next steps"] },
  { id: "t4", title: "Reference List", category: "career", description: "Formatted reference sheet with contact details.", complexity: "simple", previewLines: ["PROFESSIONAL REFERENCES", "Name \u00b7 Title \u00b7 Company", "Relationship \u00b7 Years known", "Contact: email \u00b7 phone"] },
  { id: "t5", title: "Business Plan", category: "business", description: "Comprehensive plan with financials and market analysis.", complexity: "advanced", industry: "Startups", previewLines: ["EXECUTIVE SUMMARY", "Market Opportunity & TAM", "Revenue Model & Unit Economics", "Financial Projections (3-Year)"] },
  { id: "t6", title: "Pitch Deck Outline", category: "business", description: "10-slide pitch structure used by top accelerators.", complexity: "moderate", previewLines: ["1. Problem Statement", "2. Solution & Demo", "3. Market Size & Traction", "4. Business Model & Ask"] },
  { id: "t7", title: "Project Proposal", category: "business", description: "Client-ready proposal with scope and timeline.", complexity: "moderate", previewLines: ["PROJECT OVERVIEW", "Scope of Work & Deliverables", "Timeline & Milestones", "Investment & Payment Terms"] },
  { id: "t8", title: "LinkedIn Summary", category: "brand", description: "Optimized LinkedIn About section for your target role.", complexity: "simple", previewLines: ["Hook \u2014 one compelling sentence", "Career narrative (3-4 sentences)", "Key achievements with metrics", "CTA \u2014 what you\u2019re looking for"] },
  { id: "t9", title: "Portfolio Bio", category: "brand", description: "Short professional bio for portfolio sites.", complexity: "simple", previewLines: ["[Name] is a [role] based in [city]", "Specializing in [expertise areas]", "Previously at [notable companies]", "Featured in [publications/awards]"] },
  { id: "t10", title: "Personal Statement", category: "brand", description: "Grad school or fellowship application essay.", complexity: "advanced", previewLines: ["Opening anecdote or insight", "Academic + professional journey", "Why this program specifically", "Future goals & contribution"] },
  { id: "t11", title: "Credential Evaluation Report", category: "immigration", description: "Document for foreign credential assessment.", complexity: "advanced", previewLines: ["APPLICANT INFORMATION", "Credential: Degree \u00b7 Institution \u00b7 Country", "Evaluation: US/CA Equivalency", "Recommended Actions & Timeline"] },
  { id: "t12", title: "Skills Assessment Letter", category: "immigration", description: "Professional skills mapping for visa applications.", complexity: "moderate", previewLines: ["SKILLS ASSESSMENT", "Occupation: [ANZSCO/NOC Code]", "Qualifications vs. Requirements", "Gap Analysis & Recommendations"] },
];

// ─── Mock User Documents ─────────────────────────────────────────────────────

const MOCK_DOCUMENTS: UserDocument[] = [
  { id: "d1", title: "Software Engineer Resume \u2014 v3", templateId: "t1", status: "final", lastEdited: "Mar 26, 2026" },
  { id: "d2", title: "TechCorp Cover Letter", templateId: "t2", status: "draft", lastEdited: "Mar 25, 2026" },
  { id: "d3", title: "Q1 Consulting Proposal", templateId: "t7", status: "shared", lastEdited: "Mar 22, 2026", shareLink: "https://ce.link/q1proposal" },
  { id: "d4", title: "Personal Statement \u2014 Grad School", templateId: "t10", status: "draft", lastEdited: "Mar 20, 2026" },
];

// ─── Mock Workspaces ─────────────────────────────────────────────────────────

const MOCK_WORKSPACES: Workspace[] = [
  { id: "w1", name: "Job Applications", docCount: 3, lastActivity: "Mar 26, 2026", color: "var(--ce-role-edgestar)" },
  { id: "w2", name: "Freelance Clients", docCount: 2, lastActivity: "Mar 22, 2026", color: "var(--ce-status-warning)" },
];

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 max-w-[520px] mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.1)" }}>
          <FileText className="w-6 h-6" style={{ color: "var(--ce-role-edgestar)" }} />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[20px] text-[var(--ce-text-primary)] mb-2"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        Your Professional Workspace
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-[14px] text-[var(--ce-text-tertiary)] mb-8 leading-relaxed"
        style={{ fontFamily: "var(--font-body)" }}
      >
        100+ templates, AI customization, and organized workspaces.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onClick={onStart}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] cursor-pointer transition-all active:scale-[0.97]"
        style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        <BookOpen className="w-4 h-4" /> Browse Templates
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-[12px] text-[var(--ce-text-quaternary)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <SophiaMark size={14} glowing={false} />
        I can help you find the right template for any professional document.
      </motion.div>
    </div>
  );
}

// ─── Building State ──────────────────────────────────────────────────────────

const DOC_TYPES = [
  { label: "Resumes & Cover Letters", value: "career" },
  { label: "Business Plans", value: "business" },
  { label: "Personal Branding", value: "brand" },
  { label: "Immigration Docs", value: "immigration" },
  { label: "Other", value: "other" },
];

function BuildingState({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [projectInput, setProjectInput] = useState("");

  return (
    <div className="max-w-[520px] mx-auto px-4 py-12">
      <GlassCard>
        <div className="p-5">
          {/* Progress bar */}
          <div className="flex items-center gap-1.5 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--ce-role-edgestar)" }}
                  initial={{ width: 0 }}
                  animate={{ width: step >= s ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <SophiaMark size={16} glowing />
                  <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    What type of documents do you work with most?
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {DOC_TYPES.map((dt) => (
                    <button
                      key={dt.value}
                      onClick={() => setSelectedType(dt.value)}
                      className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all"
                      style={{
                        background: selectedType === dt.value ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
                        border: `1px solid ${selectedType === dt.value ? "rgba(var(--ce-role-edgestar-rgb),0.3)" : "rgba(var(--ce-glass-tint),0.08)"}`,
                        color: selectedType === dt.value ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { if (selectedType) setStep(2); }}
                  disabled={!selectedType}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <SophiaMark size={16} glowing />
                  <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Any active projects I should organize into workspaces?
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg text-[11px]" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                  <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: "var(--ce-role-edgestar)" }} />
                  I see you already have a resume in EdgeCareer — I'll link that here.
                </div>

                <input
                  type="text"
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  placeholder="e.g. Job search, freelance gigs, grad school apps..."
                  className="w-full px-3 py-2 rounded-lg text-[12px] mb-4 outline-none"
                  style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-colors"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={onComplete}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] cursor-pointer transition-all active:scale-[0.97]"
                    style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Set up workspace <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Template Card (A4 proportioned) ─────────────────────────────────────────

function TemplateCard({ template, onUse }: { template: Template; onUse: (t: Template) => void }) {
  const cat = CATEGORY_CONFIG[template.category];
  const dots = COMPLEXITY_DOTS[template.complexity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
      style={{
        aspectRatio: "210/297",
        background: "rgba(var(--ce-glass-tint),0.03)",
        border: "1px solid rgba(var(--ce-glass-tint),0.08)",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: `${cat.color}10`, color: cat.color, border: `1px solid ${cat.color}20`, fontFamily: "var(--font-body)" }}
          >
            {cat.icon}{cat.label}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Circle
                key={i}
                className="w-2 h-2"
                style={{
                  color: i < dots ? cat.color : "var(--ce-text-quaternary)",
                  fill: i < dots ? cat.color : "none",
                  opacity: i < dots ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
        <span className="text-[13px] text-[var(--ce-text-primary)] block leading-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {template.title}
        </span>
      </div>

      {/* Preview lines */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-2">
        {template.previewLines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: i === 0 ? cat.color : "rgba(var(--ce-glass-tint),0.15)" }} />
            <span className="text-[10px] leading-snug" style={{ color: i === 0 ? "var(--ce-text-secondary)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onUse(template); }}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] cursor-pointer transition-all opacity-0 group-hover:opacity-100 active:scale-[0.97]"
          style={{ background: `${cat.color}10`, border: `1px solid ${cat.color}20`, color: cat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          <FilePlus className="w-3 h-3" /> Use Template
        </button>
      </div>
    </motion.div>
  );
}

// ─── Document Row ────────────────────────────────────────────────────────────

function DocumentRow({ doc, onEdit, onShare, onDelete }: { doc: UserDocument; onEdit: () => void; onShare: () => void; onDelete: () => void }) {
  const status = STATUS_CONFIG[doc.status];
  const tmpl = TEMPLATES.find((t) => t.id === doc.templateId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="flex items-center justify-between px-4 py-3 rounded-xl group transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.03)]"
      style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
          <FileText className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[12px] text-[var(--ce-text-primary)] block truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {doc.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            {tmpl && (
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                {tmpl.title}
              </span>
            )}
            <span className="text-[10px]" style={{ color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>\u00b7</span>
            <span className="text-[10px]" style={{ color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>{doc.lastEdited}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="text-[9px] px-2 py-0.5 rounded-full"
          style={{ background: `${status.color}10`, color: status.color, border: `1px solid ${status.color}20`, fontFamily: "var(--font-body)" }}
        >
          {status.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors" aria-label="Edit document">
            <Pencil className="w-3 h-3 text-[var(--ce-text-tertiary)]" />
          </button>
          <button onClick={onShare} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors" aria-label="Share document">
            <Share2 className="w-3 h-3 text-[var(--ce-text-tertiary)]" />
          </button>
          <button onClick={onDelete} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors" aria-label="Delete document">
            <Trash2 className="w-3 h-3 text-[var(--ce-text-tertiary)]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Workspace Card ──────────────────────────────────────────────────────────

function WorkspaceCard({ workspace, onClick }: { workspace: Workspace; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer group transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.03)]"
      style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)", borderLeft: `3px solid ${workspace.color}` }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${workspace.color}10` }}>
        <FolderOpen className="w-4 h-4" style={{ color: workspace.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[13px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {workspace.name}
        </span>
        <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
          {workspace.docCount} docs \u00b7 {workspace.lastActivity}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-[var(--ce-text-quaternary)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

// ─── Active State ────────────────────────────────────────────────────────────

function ActiveState({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const [activeTab, setActiveTab] = useState<"templates" | "documents" | "workspaces">("templates");
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<UserDocument[]>(MOCK_DOCUMENTS);

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: "templates", label: "Templates" },
    { id: "documents", label: "My Documents" },
    { id: "workspaces", label: "Workspaces" },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-4 py-6">
      {/* Sophia bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl"
        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
      >
        <SophiaMark size={14} glowing={false} />
        <span className="text-[12px] text-[var(--ce-text-tertiary)] flex-1" style={{ fontFamily: "var(--font-body)" }}>
          Your workspace — templates, docs, and projects organized.
        </span>
        <div className="flex items-center gap-1.5">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate("resume")}
                className="text-[10px] px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)" }}
              >
                Open EdgeCareer
              </button>
              <button
                onClick={() => onNavigate("edgepath")}
                className="text-[10px] px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)" }}
              >
                View EdgePath
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex-1 py-2 rounded-lg text-[12px] cursor-pointer transition-colors"
            style={{
              color: activeTab === tab.id ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
              fontFamily: "var(--font-display)",
              fontWeight: activeTab === tab.id ? 500 : 400,
              background: activeTab === tab.id ? "rgba(var(--ce-glass-tint),0.06)" : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Templates Tab */}
        {activeTab === "templates" && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-[12px] outline-none"
                  style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", "career", "business", "brand", "immigration"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className="px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-all"
                    style={{
                      background: categoryFilter === cat ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
                      border: `1px solid ${categoryFilter === cat ? "rgba(var(--ce-role-edgestar-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.07)"}`,
                      color: categoryFilter === cat ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {cat === "all" ? "All" : CATEGORY_CONFIG[cat].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
                >
                  <TemplateCard
                    template={template}
                    onUse={(t) => {
                      toast.success(`Template "${t.title}" ready`, "Start editing your new document.");
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-5 h-5 text-[var(--ce-text-quaternary)] mx-auto mb-2" />
                <span className="text-[12px] text-[var(--ce-text-tertiary)] block" style={{ fontFamily: "var(--font-body)" }}>
                  No templates match your search.
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                {documents.length} document{documents.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => { setActiveTab("templates"); toast.info("Pick a template to create a new document."); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.97]"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                <Plus className="w-3 h-3" /> Create New
              </button>
            </div>

            {documents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {documents.map((doc, i) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25, ease: EASE }}
                  >
                    <DocumentRow
                      doc={doc}
                      onEdit={() => toast.info(`Editing "${doc.title}"`, "Document editor opening...")}
                      onShare={() => {
                        if (doc.shareLink) {
                          navigator.clipboard?.writeText(doc.shareLink);
                          toast.success("Link copied", doc.shareLink);
                        } else {
                          toast.success("Share link created", "Link copied to clipboard.");
                        }
                      }}
                      onDelete={() => {
                        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
                        toast.success(`"${doc.title}" deleted`);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-5 h-5 text-[var(--ce-text-quaternary)] mx-auto mb-2" />
                <span className="text-[13px] text-[var(--ce-text-secondary)] block mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  No documents yet
                </span>
                <span className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                  Create your first document from a template.
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Workspaces Tab */}
        {activeTab === "workspaces" && (
          <motion.div
            key="workspaces"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                {MOCK_WORKSPACES.length} workspace{MOCK_WORKSPACES.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => toast.info("New workspace", "Workspace creation coming soon.")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.97]"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                <Plus className="w-3 h-3" /> New Workspace
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {MOCK_WORKSPACES.map((ws, i) => (
                <motion.div
                  key={ws.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25, ease: EASE }}
                >
                  <WorkspaceCard
                    workspace={ws}
                    onClick={() => toast.info(`${ws.name}`, "Workspace detail coming soon.")}
                  />
                </motion.div>
              ))}
            </div>

            {/* Sophia insight */}
            <SophiaInsight
              variant="inline"
              message="3 documents could use updating based on your latest EdgePath progress."
              actionLabel="Review updates"
              onAction={() => toast.info("Reviewing document updates...")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Surface ────────────────────────────────────────────────────────────

export function WorkplaceSurface({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const [surfaceState, setSurfaceState] = useState<"empty" | "building" | "active">(() => {
    try {
      const stored = localStorage.getItem("ce-workplace-data");
      return stored ? "active" : "empty";
    } catch {
      return "empty";
    }
  });

  const handleComplete = () => {
    try {
      localStorage.setItem("ce-workplace-data", JSON.stringify({ setup: true, ts: Date.now() }));
    } catch {}
    setSurfaceState("active");
    toast.success("Workspace ready", "Your templates and workspaces are set up.");
  };

  return (
    <RoleShell role={(role as any) || "edgestar"} activePill="workplace" onNavigate={onNavigate}>
      <div className="mt-14">
        <AnimatePresence mode="wait">
          {surfaceState === "empty" && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <EmptyState onStart={() => setSurfaceState("building")} />
            </motion.div>
          )}

          {surfaceState === "building" && (
            <motion.div
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <BuildingState onComplete={handleComplete} />
            </motion.div>
          )}

          {surfaceState === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <ActiveState role={role} onNavigate={onNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RoleShell>
  );
}
