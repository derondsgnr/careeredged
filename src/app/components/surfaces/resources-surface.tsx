import { EASE } from "../tokens";
/**
 * EdgeResources — Learning Library Surface
 *
 * Curated resources, learning paths, and tools matched to career stage.
 * Sophia guides initial topic selection, then curates a personalized feed.
 *
 * States: Empty → Building (2-step Sophia-guided) → Active (4 tabs)
 * Route: /:role/resources
 * Roles: All roles (primary: EdgeStar, EdgePreneur)
 *
 * Cross-surface: EdgePath milestones, Sessions booking
 * Storage: localStorage `ce-resource-bookmarks`
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  BookOpen, Search, Bookmark, BookmarkCheck, Play, FileText,
  Wrench, GraduationCap, Award, Clock, ChevronRight, ArrowRight,
  Star, Sparkles, ExternalLink, Filter, X, Check, Send,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ResourceType = "article" | "video" | "tool" | "course" | "scholarship" | "workshop";

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  source: string;
  description: string;
  duration: string;
  tags: string[];
  url: string;
  bookmarked: boolean;
  sophiaReason?: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  resourceCount: number;
  completedCount: number;
  estimatedHours: number;
  milestoneLinked?: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ResourceType, { label: string; color: string; icon: React.ReactNode }> = {
  article:     { label: "Article",     color: "var(--ce-text-secondary)",     icon: <FileText className="w-3 h-3" /> },
  video:       { label: "Video",       color: "var(--ce-text-secondary)",    icon: <Play className="w-3 h-3" /> },
  tool:        { label: "Tool",        color: "var(--ce-text-secondary)",    icon: <Wrench className="w-3 h-3" /> },
  course:      { label: "Course",      color: "var(--ce-text-secondary)",    icon: <GraduationCap className="w-3 h-3" /> },
  scholarship: { label: "Scholarship", color: "var(--ce-text-secondary)",    icon: <Award className="w-3 h-3" /> },
  workshop:    { label: "Workshop",    color: "var(--ce-text-secondary)",    icon: <Star className="w-3 h-3" /> },
};

const FOCUS_PILLS = ["Technical Skills", "Industry Knowledge", "Soft Skills", "Certifications", "Job Search"] as const;

const FILTER_CHIPS: { label: string; value: ResourceType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Videos", value: "video" },
  { label: "Tools", value: "tool" },
  { label: "Courses", value: "course" },
  { label: "Scholarships", value: "scholarship" },
  { label: "Workshops", value: "workshop" },
];

// ─── Data ────────────────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  { id: "r1", title: "Negotiating Remote Salaries in 2026", type: "article", source: "Harvard Business Review", description: "How to benchmark and negotiate compensation for remote-first roles in the current market.", duration: "5 min read", tags: ["negotiation", "remote", "salary"], url: "#", bookmarked: false, sophiaReason: "Matches your EdgePath milestone: 'Salary Negotiation Prep'" },
  { id: "r2", title: "Building a Portfolio That Lands Interviews", type: "article", source: "Smashing Magazine", description: "Case studies from designers who went from zero callbacks to multiple offers with portfolio redesigns.", duration: "8 min read", tags: ["portfolio", "design", "interviews"], url: "#", bookmarked: false, sophiaReason: "Your resume shows design experience — this aligns with your next milestone" },
  { id: "r3", title: "Understanding H-1B Alternatives", type: "article", source: "Boundless Immigration", description: "A comprehensive guide to O-1, L-1, TN, and other visa categories for skilled professionals.", duration: "12 min read", tags: ["immigration", "visa", "h1b"], url: "#", bookmarked: false },
  { id: "r4", title: "Mock Interview Masterclass", type: "video", source: "CareerEdge Studio", description: "Full-length mock interview with real-time feedback from hiring managers at top companies.", duration: "42 min video", tags: ["interviews", "practice", "feedback"], url: "#", bookmarked: false, sophiaReason: "You have an interview prep session in 5 days — watch this first" },
  { id: "r5", title: "Personal Branding on LinkedIn", type: "video", source: "LinkedIn Learning", description: "Build a profile that attracts recruiters and demonstrates your unique value proposition.", duration: "18 min video", tags: ["linkedin", "branding", "profile"], url: "#", bookmarked: false },
  { id: "r6", title: "The STAR Method Deep Dive", type: "video", source: "CareerEdge Studio", description: "How to structure behavioral interview answers using the Situation-Task-Action-Result framework.", duration: "14 min video", tags: ["interviews", "star", "behavioral"], url: "#", bookmarked: false },
  { id: "r7", title: "Salary Calculator", type: "tool", source: "Levels.fyi", description: "Compare compensation packages across companies, roles, and locations with cost-of-living adjustments.", duration: "Interactive tool", tags: ["salary", "compensation", "tools"], url: "#", bookmarked: false, sophiaReason: "Use this before your salary negotiation milestone" },
  { id: "r8", title: "Resume Keywords Analyzer", type: "tool", source: "CareerEdge", description: "Scan your resume against job descriptions to find missing keywords and optimize for ATS systems.", duration: "Interactive tool", tags: ["resume", "keywords", "ats"], url: "#", bookmarked: false },
  { id: "r9", title: "Cover Letter Generator", type: "tool", source: "CareerEdge", description: "AI-assisted cover letter drafting that matches your resume to specific job requirements.", duration: "Interactive tool", tags: ["cover-letter", "writing", "tools"], url: "#", bookmarked: false },
  { id: "r10", title: "UX Research Fundamentals", type: "course", source: "Google Career Certificates", description: "Learn user research methods, usability testing, and how to synthesize findings into actionable insights.", duration: "4-week course", tags: ["ux", "research", "google"], url: "#", bookmarked: false, sophiaReason: "Aligns with your target role: UX Researcher" },
  { id: "r11", title: "Data Science Bootcamp Prep", type: "course", source: "Coursera", description: "Pre-bootcamp foundations covering Python, statistics, and data manipulation with pandas.", duration: "6-week course", tags: ["data-science", "python", "prep"], url: "#", bookmarked: false },
  { id: "r12", title: "Product Management Essentials", type: "course", source: "Reforge", description: "Core PM skills: prioritization frameworks, user stories, roadmap planning, and stakeholder management.", duration: "8-week course", tags: ["product", "management", "strategy"], url: "#", bookmarked: false },
  { id: "r13", title: "Google Career Certificate Scholarship", type: "scholarship", source: "Google.org", description: "Full scholarship for Google Career Certificates in UX Design, Data Analytics, or IT Support.", duration: "Apply by May 15", tags: ["scholarship", "google", "certificate"], url: "#", bookmarked: false, sophiaReason: "You qualify based on your profile — deadline in 48 days" },
  { id: "r14", title: "Boundless Future Fund", type: "scholarship", source: "Boundless", description: "Financial assistance for international professionals pursuing U.S. career certifications and credentials.", duration: "Rolling applications", tags: ["scholarship", "international", "funding"], url: "#", bookmarked: false },
  { id: "r15", title: "Workforce Innovation Scholarship", type: "scholarship", source: "Department of Labor", description: "Federal funding for workforce development training programs in high-demand fields.", duration: "Apply by June 1", tags: ["scholarship", "federal", "training"], url: "#", bookmarked: false },
  { id: "r16", title: "Interview Confidence Workshop", type: "workshop", source: "CareerEdge Live", description: "Live 90-minute workshop on managing interview anxiety, body language, and projecting confidence.", duration: "90 min workshop", tags: ["interviews", "confidence", "live"], url: "#", bookmarked: false, sophiaReason: "Next session: April 8 — I can auto-register you" },
  { id: "r17", title: "Networking for Introverts", type: "workshop", source: "CareerEdge Live", description: "Practical strategies for building professional relationships when networking feels unnatural.", duration: "60 min workshop", tags: ["networking", "soft-skills", "live"], url: "#", bookmarked: false },
  { id: "r18", title: "Writing Effective Cold Emails", type: "article", source: "Lenny's Newsletter", description: "Templates and frameworks for reaching out to hiring managers and getting responses.", duration: "6 min read", tags: ["cold-email", "outreach", "templates"], url: "#", bookmarked: false },
];

const LEARNING_PATHS: LearningPath[] = [
  { id: "lp1", title: "Break into UX in 30 Days", description: "A structured path from portfolio building to landing your first UX role, curated from top resources.", resourceCount: 8, completedCount: 3, estimatedHours: 24, milestoneLinked: "Build Portfolio" },
  { id: "lp2", title: "Technical Interview Prep", description: "Everything you need to ace behavioral and technical interviews at top companies.", resourceCount: 12, completedCount: 0, estimatedHours: 36, milestoneLinked: "Interview Ready" },
  { id: "lp3", title: "Personal Brand Building", description: "Build a compelling online presence across LinkedIn, portfolio, and professional communities.", resourceCount: 6, completedCount: 2, estimatedHours: 12, milestoneLinked: "Online Presence" },
  { id: "lp4", title: "Salary Negotiation Toolkit", description: "Research, practice, and frameworks for negotiating the best offer.", resourceCount: 5, completedCount: 0, estimatedHours: 8, milestoneLinked: "Salary Negotiation Prep" },
];

// ─── Resource Card ───────────────────────────────────────────────────────────

function ResourceCard({
  resource,
  onBookmark,
  delay = 0,
}: {
  resource: Resource;
  onBookmark: (id: string) => void;
  delay?: number;
}) {
  const cfg = TYPE_CONFIG[resource.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: EASE }}
    >
      <GlassCard delay={0}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
                style={{
                  background: `${cfg.color}12`,
                  border: `1px solid ${cfg.color}20`,
                  color: cfg.color,
                  fontFamily: "var(--font-body)",
                }}
              >
                {cfg.icon}
                {cfg.label}
              </span>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                {resource.source}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-[13px] text-[var(--ce-text-primary)] mb-1 leading-snug"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {resource.title}
            </h3>

            {/* Description — 1 line truncated */}
            <p
              className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed truncate mb-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {resource.description}
            </p>

            {/* Duration + Sophia reason */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                  {resource.duration}
                </span>
              </div>
            </div>

            {resource.sophiaReason && (
              <div className="flex items-start gap-1.5 mt-2">
                <Sparkles className="w-3 h-3 text-[var(--ce-role-edgestar)] flex-shrink-0 mt-0.5" />
                <span className="text-[10px] text-[var(--ce-role-edgestar)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {resource.sophiaReason}
                </span>
              </div>
            )}
          </div>

          {/* Bookmark toggle */}
          <button
            onClick={() => onBookmark(resource.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
          >
            {resource.bookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-[var(--ce-role-edgestar)]" />
            ) : (
              <Bookmark className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
            )}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Learning Path Card ──────────────────────────────────────────────────────

function PathCard({
  path,
  onContinue,
  delay = 0,
}: {
  path: LearningPath;
  onContinue: (id: string) => void;
  delay?: number;
}) {
  const progress = path.resourceCount > 0 ? (path.completedCount / path.resourceCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: EASE }}
    >
      <GlassCard delay={0}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="text-[13px] text-[var(--ce-text-primary)] mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {path.title}
            </h3>
            <p
              className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {path.description}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--ce-text-quaternary)] flex-shrink-0" />
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--ce-role-edgestar)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: EASE, delay: delay + 0.2 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
              {path.completedCount} of {path.resourceCount} completed
            </span>
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              ~{path.estimatedHours}h total
            </span>
          </div>
          <button
            onClick={() => onContinue(path.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.12)]"
            style={{
              background: "rgba(var(--ce-role-edgestar-rgb),0.08)",
              border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)",
              color: "var(--ce-role-edgestar)",
              fontFamily: "var(--font-body)",
            }}
          >
            {path.completedCount > 0 ? "Continue" : "Start"}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {path.milestoneLinked && (
          <div className="flex items-center gap-1.5 mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <Sparkles className="w-3 h-3 text-[var(--ce-role-edgestar)]" />
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              Linked to EdgePath: {path.milestoneLinked}
            </span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ResourcesSurface({ role: roleProp, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = roleProp ?? roleParam ?? "edgestar";

  const [surfaceState, setSurfaceState] = useState<"empty" | "building" | "active">("empty");
  const [buildStep, setBuildStep] = useState(0);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");

  const [activeTab, setActiveTab] = useState<"foryou" | "browse" | "saved" | "paths">("foryou");
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [browseFilter, setBrowseFilter] = useState<ResourceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ce-resource-bookmarks");
      if (stored) {
        const bookmarkedIds: string[] = JSON.parse(stored);
        setResources((prev) =>
          prev.map((r) => ({ ...r, bookmarked: bookmarkedIds.includes(r.id) }))
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist bookmarks
  const toggleBookmark = (id: string) => {
    setResources((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, bookmarked: !r.bookmarked } : r
      );
      const bookmarkedIds = updated.filter((r) => r.bookmarked).map((r) => r.id);
      localStorage.setItem("ce-resource-bookmarks", JSON.stringify(bookmarkedIds));
      const target = updated.find((r) => r.id === id);
      if (target?.bookmarked) {
        toast.success("Saved to your library");
      }
      return updated;
    });
  };

  const handleNavigate = (target: string) => {
    if (onNavigate) {
      onNavigate(target);
      return;
    }
    const paths: Record<string, string> = {
      edgepath: `/${role}/edgepath`,
      sessions: `/${role}/sessions`,
      resources: `/${role}/resources`,
      synthesis: `/${role}`,
      landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  // Filtered resources for Browse tab
  const browseResources = resources.filter((r) => {
    const matchesType = browseFilter === "all" || r.type === browseFilter;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // For You — resources with sophiaReason
  const forYouResources = resources.filter((r) => r.sophiaReason);

  // Saved
  const savedResources = resources.filter((r) => r.bookmarked);

  // Sophia override for bottom bar
  const sophiaOverride =
    surfaceState === "empty"
      ? {
          message: "I'll curate learning resources matched to your goals.",
          chips: [
            { label: "Open EdgePath", action: "Show me my EdgePath milestones and career roadmap" },
            { label: "Book a session", action: "Help me book a coaching session" },
          ],
        }
      : {
          message: "Your learning library — curated for your career stage.",
          chips: [
            { label: "Open EdgePath", action: "Show me my EdgePath milestones and career roadmap" },
            { label: "Book a session", action: "Help me book a coaching session" },
          ],
        };

  const userName = role === "edgestar" ? "Alex" : role === "edgepreneur" ? "Jordan" : "User";
  const userInitial = userName[0];

  // ─── Empty State ─────────────────────────────────────────────────────────

  if (surfaceState === "empty") {
    return (
      <RoleShell role={role as any} userName={userName} userInitial={userInitial} edgeGas={42} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center py-32 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)" }}
            >
              <BookOpen className="w-7 h-7 text-[var(--ce-role-edgestar)]" />
            </div>
            <h1
              className="text-[20px] text-[var(--ce-text-primary)] mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Your Learning Library
            </h1>
            <p
              className="text-[13px] text-[var(--ce-text-secondary)] max-w-[340px] mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Curated resources, learning paths, and tools matched to your career stage.
            </p>
            <button
              onClick={() => setSurfaceState("building")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: "rgba(var(--ce-role-edgestar-rgb),0.1)",
                border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)",
                color: "var(--ce-role-edgestar)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              Explore Resources
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Building State ──────────────────────────────────────────────────────

  if (surfaceState === "building") {
    return (
      <RoleShell role={role as any} userName={userName} userInitial={userInitial} edgeGas={42} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="max-w-[520px] mx-auto py-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Progress */}
            <div className="flex items-center gap-1.5 mb-8">
              {[0, 1].map((s) => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{
                    background: s <= buildStep
                      ? "var(--ce-role-edgestar)"
                      : "rgba(var(--ce-glass-tint),0.08)",
                  }}
                />
              ))}
            </div>

            <GlassCard delay={0.1}>
              <div
                className="rounded-xl p-4 overflow-y-auto"
                style={{ maxHeight: 420 }}
              >
                {/* Sophia header */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="flex-shrink-0 mt-0.5">
                    <SophiaMark size={20} />
                  </div>
                  <div>
                    <span
                      className="text-[13px] text-[var(--ce-text-primary)] block mb-1"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {buildStep === 0
                        ? "What are you focused on learning?"
                        : "Any specific topics you want me to track?"}
                    </span>
                    <span
                      className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {buildStep === 0
                        ? "Pick one or more areas — I'll prioritize resources that match."
                        : "I'll curate resources based on your EdgePath milestone: 'Build Portfolio'"}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {buildStep === 0 ? (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {/* Focus pills */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {FOCUS_PILLS.map((pill) => {
                          const selected = selectedFocus.includes(pill);
                          return (
                            <button
                              key={pill}
                              onClick={() =>
                                setSelectedFocus((prev) =>
                                  selected
                                    ? prev.filter((p) => p !== pill)
                                    : [...prev, pill]
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] cursor-pointer transition-all"
                              style={{
                                background: selected
                                  ? "rgba(var(--ce-role-edgestar-rgb),0.12)"
                                  : "rgba(var(--ce-glass-tint),0.03)",
                                border: selected
                                  ? "1px solid rgba(var(--ce-role-edgestar-rgb),0.25)"
                                  : "1px solid rgba(var(--ce-glass-tint),0.07)",
                                color: selected
                                  ? "var(--ce-role-edgestar)"
                                  : "var(--ce-text-secondary)",
                                fontFamily: "var(--font-body)",
                              }}
                            >
                              {selected && <Check className="w-3 h-3" />}
                              {pill}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setBuildStep(1)}
                        disabled={selectedFocus.length === 0}
                        className="w-full py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          background: "rgba(var(--ce-role-edgestar-rgb),0.1)",
                          border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)",
                          color: "var(--ce-role-edgestar)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}
                      >
                        Continue
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      {/* Topic input */}
                      <div
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
                        style={{
                          background: "rgba(var(--ce-glass-tint),0.03)",
                          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                        }}
                      >
                        <Search className="w-4 h-4 text-[var(--ce-text-quaternary)] flex-shrink-0" />
                        <input
                          value={topicInput}
                          onChange={(e) => setTopicInput(e.target.value)}
                          placeholder="e.g. React, product design, data analysis..."
                          className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                          style={{ fontFamily: "var(--font-body)" }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSurfaceState("active");
                              toast.success("Your learning library is ready");
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            setSurfaceState("active");
                            toast.success("Your learning library is ready");
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(var(--ce-role-edgestar-rgb),0.1)]"
                        >
                          <Send className="w-3.5 h-3.5 text-[var(--ce-role-edgestar)]" />
                        </button>
                      </div>

                      {/* Skip option */}
                      <button
                        onClick={() => {
                          setSurfaceState("active");
                          toast.success("Your learning library is ready");
                        }}
                        className="w-full text-center text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer hover:text-[var(--ce-text-secondary)] transition-colors py-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Skip — show me everything
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Active State ────────────────────────────────────────────────────────

  return (
    <RoleShell role={role as any} userName={userName} userInitial={userInitial} edgeGas={42} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
        >
          <div>
            <h1
              className="text-[22px] text-[var(--ce-text-primary)] mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Resources
            </h1>
            <p
              className="text-[13px] text-[var(--ce-text-secondary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {resources.length} resources · {LEARNING_PATHS.length} learning paths
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate("edgepath")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                border: "1px solid rgba(var(--ce-glass-tint),0.07)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Open EdgePath
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleNavigate("sessions")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                border: "1px solid rgba(var(--ce-glass-tint),0.07)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Book a session
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          className="flex items-center gap-1 mb-6 p-0.5 rounded-lg w-fit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        >
          {([
            { key: "foryou", label: "For You" },
            { key: "browse", label: "Browse" },
            { key: "saved", label: "Saved" },
            { key: "paths", label: "Paths" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-3.5 py-1.5 rounded-md text-[12px] cursor-pointer transition-all"
              style={{
                background: activeTab === tab.key ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
                color: activeTab === tab.key ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {tab.label}
              {tab.key === "saved" && savedResources.length > 0 && (
                <span
                  className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.12)", color: "var(--ce-role-edgestar)" }}
                >
                  {savedResources.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── For You Tab ─────────────────────────────────────────── */}
          {activeTab === "foryou" && (
            <motion.div
              key="foryou"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
                <div className="flex flex-col gap-3">
                  {forYouResources.map((r, i) => (
                    <ResourceCard key={r.id} resource={r} onBookmark={toggleBookmark} delay={i * 0.05} />
                  ))}
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-4">
                  <SophiaInsight
                    message="I've curated these resources based on your EdgePath milestones and career goals. Bookmark what resonates — I'll learn your preferences over time."
                    actionLabel="View EdgePath"
                    onAction={() => handleNavigate("edgepath")}
                    actionPrompt="Show me my EdgePath milestones so I can see what resources align with my goals"
                    delay={0.3}
                  />

                  <GlassCard delay={0.4}>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-3.5 h-3.5 text-[var(--ce-role-edgestar)]" />
                      <span
                        className="text-[13px] text-[var(--ce-text-primary)]"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                      >
                        Quick stats
                      </span>
                    </div>
                    {[
                      { label: "Resources saved", value: savedResources.length, color: "var(--ce-role-edgestar)" },
                      { label: "Paths in progress", value: LEARNING_PATHS.filter((p) => p.completedCount > 0).length, color: "var(--ce-lime)" },
                      { label: "New this week", value: 4, color: "var(--ce-role-edu)" },
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between py-2"
                        style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}
                      >
                        <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                          {stat.label}
                        </span>
                        <span
                          className="text-[14px] tabular-nums"
                          style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Browse Tab ──────────────────────────────────────────── */}
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {/* Search + Filter */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2.5"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.03)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                  }}
                >
                  <Search className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip.value}
                    onClick={() => setBrowseFilter(chip.value)}
                    className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                    style={{
                      background: browseFilter === chip.value ? "rgba(var(--ce-glass-tint),0.08)" : "rgba(var(--ce-glass-tint),0.02)",
                      border: browseFilter === chip.value
                        ? "1px solid rgba(var(--ce-glass-tint),0.15)"
                        : "1px solid rgba(var(--ce-glass-tint),0.06)",
                      color: browseFilter === chip.value ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {browseResources.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} onBookmark={toggleBookmark} delay={i * 0.04} />
                ))}
              </div>

              {browseResources.length === 0 && (
                <div
                  className="rounded-xl p-12 flex flex-col items-center gap-3"
                  style={{ border: "1px dashed rgba(var(--ce-glass-tint),0.06)" }}
                >
                  <Search className="w-8 h-8 text-[var(--ce-text-quaternary)]" />
                  <span className="text-[13px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                    No resources match your search
                  </span>
                  <button
                    onClick={() => { setSearchQuery(""); setBrowseFilter("all"); }}
                    className="text-[12px] cursor-pointer"
                    style={{ color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Saved Tab ───────────────────────────────────────────── */}
          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {savedResources.length > 0 ? (
                <div className="flex flex-col gap-3 max-w-[680px]">
                  {savedResources.map((r, i) => (
                    <ResourceCard key={r.id} resource={r} onBookmark={toggleBookmark} delay={i * 0.05} />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-xl p-12 flex flex-col items-center gap-3"
                  style={{ border: "1px dashed rgba(var(--ce-glass-tint),0.06)" }}
                >
                  <Bookmark className="w-8 h-8 text-[var(--ce-text-quaternary)]" />
                  <span
                    className="text-[13px] text-[var(--ce-text-quaternary)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Bookmark resources to find them here later.
                  </span>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="text-[12px] cursor-pointer"
                    style={{ color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}
                  >
                    Browse resources →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Paths Tab ───────────────────────────────────────────── */}
          {activeTab === "paths" && (
            <motion.div
              key="paths"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
                <div className="flex flex-col gap-3">
                  {LEARNING_PATHS.map((path, i) => (
                    <PathCard
                      key={path.id}
                      path={path}
                      onContinue={(id) => {
                        toast.success(`Opening "${path.title}"...`);
                      }}
                      delay={i * 0.06}
                    />
                  ))}
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-4">
                  <SophiaInsight
                    message="Completing 'Break into UX' would advance your EdgePath by 2 milestones. You're 3 resources away from finishing."
                    actionLabel="Continue path"
                    onAction={() => toast.success("Opening 'Break into UX in 30 Days'...")}
                    actionPrompt="Help me continue the 'Break into UX in 30 Days' learning path — what should I work on next?"
                    delay={0.3}
                  />

                  <GlassCard delay={0.4}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--ce-role-edgestar)]" />
                      <span
                        className="text-[13px] text-[var(--ce-text-primary)]"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                      >
                        Path tips
                      </span>
                    </div>
                    {[
                      "Users who complete a path are 3.2x more likely to hit their next milestone",
                      "Each path is linked to EdgePath milestones — progress syncs automatically",
                      "Paths are updated weekly with new resources from top sources",
                    ].map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 py-1.5"
                        style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}
                      >
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--ce-text-quaternary)" }} />
                        <span
                          className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {tip}
                        </span>
                      </div>
                    ))}
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RoleShell>
  );
}
