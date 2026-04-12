/**
 * SocialEdge — Professional social feed
 *
 * Matches the live careeredged.com /feed surface with UX improvements:
 * - Progressive composer (collapsed → expanded on click)
 * - Smart contextual placeholders (Sophia infers from role)
 * - Grouped category chips (Share / Help / Learn / Connect)
 * - Named visibility options with audience descriptions
 * - Labelled Sophia AI draft assist (no guess-the-icon)
 * - Actionable empty state for Trending Topics
 * - Visible anonymous toggle (eye icon)
 * - Right rail with Sophia insight + Trending + Who to follow
 *
 * Routes: /:role/feed, /:role/feed/:postId (detail modal)
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import { EASE } from "../tokens";
import {
  ArrowLeft, ChevronDown, Heart, MessageSquare, Share2, Bookmark, Flag,
  Image as ImageIcon, Mic, Sparkles, Send, Globe, Eye, EyeOff,
  TrendingUp, UserPlus, Check, Plus, X, Copy,
  Trophy, Lightbulb, BookOpen, GraduationCap, Compass,
  Briefcase, Calendar as CalendarIcon, HelpCircle, Heart as HeartIcon,
  Users2, MessageCircle, ChevronUp,
  Rocket, Award, Network, Zap, Newspaper,
  type LucideIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryId =
  | "all"
  | "social"
  | "success"
  | "tips"
  | "insights"
  | "collaboration"
  | "resources"
  | "training"
  | "journey"
  | "jobs"
  | "events"
  | "questions"
  | "mentorship"
  | "entrepreneurship"
  | "scholarships"
  | "networking"
  | "motivation"
  | "news";

type AudienceId =
  | "public"
  | "edgestars"
  | "parents"
  | "coaches"
  | "ngo"
  | "government"
  | "employers";

interface FeedPost {
  id: string;
  author: { name: string; handle: string; initial: string; color: string; verified?: boolean };
  anonymous?: boolean;
  category: Exclude<CategoryId, "all">;
  audience: AudienceId;
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  hashtags?: string[];
}

interface FollowSuggestion {
  name: string;
  handle: string;
  initial: string;
  color: string;
  expertise: string;
  followed: boolean;
}

// ─── Category config ─────────────────────────────────────────────────────────

const CATEGORY_META: Record<Exclude<CategoryId, "all">, { label: string; Icon: LucideIcon; color: string; group: "share" | "help" | "learn" | "connect" }> = {
  social:        { label: "Social",              Icon: MessageCircle,   color: "var(--ce-cyan)",           group: "share" },
  success:       { label: "Success Stories",     Icon: Trophy,          color: "var(--ce-lime)",           group: "share" },
  journey:       { label: "EdgePath Journey",    Icon: Compass,         color: "var(--ce-cyan)",           group: "share" },
  questions:     { label: "Questions",           Icon: HelpCircle,      color: "var(--ce-role-guide)",     group: "help" },
  collaboration: { label: "Collaboration",       Icon: Users2,          color: "var(--ce-role-edgepreneur)", group: "help" },
  mentorship:    { label: "Mentorship",          Icon: HeartIcon,       color: "var(--ce-role-parent)",    group: "help" },
  tips:          { label: "Tips & Advice",       Icon: Lightbulb,       color: "var(--ce-lime)",           group: "learn" },
  insights:      { label: "Industry Insights",   Icon: TrendingUp,      color: "var(--ce-cyan)",           group: "learn" },
  resources:     { label: "Resources",           Icon: BookOpen,        color: "var(--ce-role-edu)",       group: "learn" },
  training:      { label: "Training",            Icon: GraduationCap,   color: "var(--ce-role-edu)",       group: "learn" },
  jobs:          { label: "Jobs & Opportunities",Icon: Briefcase,       color: "var(--ce-role-employer)",  group: "connect" },
  events:        { label: "Events",              Icon: CalendarIcon,    color: "var(--ce-role-edu)",       group: "connect" },
  entrepreneurship: { label: "Entrepreneurship", Icon: Rocket,          color: "var(--ce-role-edgepreneur)", group: "connect" },
  networking:    { label: "Networking",          Icon: Network,         color: "var(--ce-cyan)",           group: "connect" },
  scholarships:  { label: "Scholarships",        Icon: Award,           color: "var(--ce-lime)",           group: "learn" },
  news:          { label: "News",                Icon: Newspaper,       color: "var(--ce-text-tertiary)",  group: "learn" },
  motivation:    { label: "Motivation",          Icon: Zap,             color: "var(--ce-lime)",           group: "share" },
};

const ORDERED_CATEGORIES: Exclude<CategoryId, "all">[] = [
  "social", "success", "journey", "motivation",
  "questions", "collaboration", "mentorship",
  "tips", "insights", "resources", "training", "scholarships", "news",
  "jobs", "events", "entrepreneurship", "networking",
];

// ─── Audience config ─────────────────────────────────────────────────────────

const AUDIENCE_META: Record<AudienceId, { label: string; shortLabel: string; description: string; audienceCount: string }> = {
  public:     { label: "Everyone",             shortLabel: "Everyone",      description: "Anyone on CareerEdged can see this",             audienceCount: "12,400 people" },
  edgestars:  { label: "Just EdgeStars",       shortLabel: "EdgeStars",     description: "Career seekers and professionals only",            audienceCount: "8,200 people" },
  parents:    { label: "Parents only",         shortLabel: "Parents",       description: "EdgeParents supporting their children",             audienceCount: "1,100 people" },
  coaches:    { label: "Coaches & Mentors",    shortLabel: "Coaches",       description: "EdgeCoaches and EdgeMentors only",                audienceCount: "640 people" },
  ngo:        { label: "NGO Partners",         shortLabel: "NGO",           description: "Non-profit organizations only",                    audienceCount: "210 people" },
  government: { label: "Government Agencies",  shortLabel: "Government",    description: "Government agency partners only",                  audienceCount: "90 people" },
  employers:  { label: "Employers",            shortLabel: "Employers",     description: "Hiring managers and employer partners",            audienceCount: "420 people" },
};

const AUDIENCE_ORDER: AudienceId[] = ["public", "edgestars", "parents", "coaches", "ngo", "government", "employers"];

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_POSTS: FeedPost[] = [
  {
    id: "p1",
    author: { name: "Sarah K.", handle: "sarahk", initial: "S", color: "var(--ce-role-edgestar)", verified: true },
    category: "success",
    audience: "public",
    content: "Just landed my first product design role after 6 months on EdgePath! The mock interviews with Coach Maria made the difference. #CareerPivot #PhaseComplete",
    timestamp: "2h ago",
    likes: 47,
    comments: 12,
    liked: false,
    saved: false,
    hashtags: ["CareerPivot", "PhaseComplete"],
  },
  {
    id: "p2",
    author: { name: "James L.", handle: "jamesl", initial: "J", color: "var(--ce-role-edu)" },
    category: "questions",
    audience: "public",
    content: "Has anyone transitioned from marketing to product management? Looking for advice on how to position transferable skills. #CareerPivot #ProductManagement",
    timestamp: "4h ago",
    likes: 18,
    comments: 23,
    liked: false,
    saved: false,
    hashtags: ["CareerPivot", "ProductManagement"],
  },
  {
    id: "p3",
    author: { name: "Priya M.", handle: "priyam", initial: "P", color: "var(--ce-role-edgepreneur)" },
    category: "insights",
    audience: "public",
    content: "5 Things I Wish I Knew Before My H-1B Interview — from document prep to the questions they actually ask. Here's my honest breakdown after going through twice. #ImmigrationEdge #InterviewPrep",
    images: ["H-1B interview preparation checklist"],
    timestamp: "6h ago",
    likes: 92,
    comments: 34,
    liked: true,
    saved: true,
    hashtags: ["ImmigrationEdge", "InterviewPrep"],
  },
  {
    id: "p4",
    author: { name: "Coach Maria", handle: "coachmaria", initial: "M", color: "var(--ce-role-guide)", verified: true },
    category: "tips",
    audience: "coaches",
    content: "Remote salaries are converging globally — here's what I'm seeing in my coaching practice. Companies are moving toward location-agnostic bands, which changes the negotiation playbook entirely. #SalaryNegotiation",
    timestamp: "12h ago",
    likes: 156,
    comments: 41,
    liked: false,
    saved: false,
    hashtags: ["SalaryNegotiation"],
  },
  {
    id: "p5",
    anonymous: true,
    author: { name: "Anonymous", handle: "anonymous", initial: "?", color: "var(--ce-text-quaternary)" },
    category: "questions",
    audience: "public",
    content: "Been unemployed for 8 months. Feeling like I'm falling behind. Anyone else here in the same boat? How are you staying motivated?",
    timestamp: "1d ago",
    likes: 84,
    comments: 57,
    liked: false,
    saved: false,
  },
  {
    id: "p6",
    author: { name: "Fatima A.", handle: "fatimaa", initial: "F", color: "var(--ce-role-ngo)" },
    category: "insights",
    audience: "public",
    content: "How I negotiated a 40% salary increase as an immigrant professional. The key was data — I used EdgeMatch benchmarks to back every ask. #SalaryNegotiation #ImmigrationEdge",
    timestamp: "2d ago",
    likes: 284,
    comments: 56,
    liked: true,
    saved: false,
    hashtags: ["SalaryNegotiation", "ImmigrationEdge"],
  },
];

const MOCK_FOLLOW_SUGGESTIONS: FollowSuggestion[] = [
  { name: "Coach Alice",   handle: "coachalice",   initial: "A", color: "var(--ce-role-guide)",      expertise: "Product Design mentorship", followed: false },
  { name: "Marcus Wen",    handle: "marcusw",      initial: "M", color: "var(--ce-role-edgestar)",   expertise: "FAANG interview prep",       followed: false },
  { name: "Lena Okonkwo",  handle: "lenaok",       initial: "L", color: "var(--ce-role-edgepreneur)", expertise: "Bootstrapping founders",    followed: false },
];

const SOPHIA_PLACEHOLDER_PROMPTS: Record<string, string> = {
  edgestar:    "Share a Phase 2 win, ask the community a question, or post your progress…",
  edgepreneur: "Share what you're building, ask for founder advice, or post a milestone…",
  parent:      "Share what's working with your child, ask other parents a question…",
  guide:       "Share a coaching insight, answer a community question, or promote your group…",
  employer:    "Share a hiring win, post a job opening to the community, or ask EdgeStars a question…",
  edu:         "Share a student outcome, post an event, or ask the community for speakers…",
  ngo:         "Share program impact, post a grant opportunity, or ask for partners…",
  agency:      "Share policy updates, post a workforce program, or ask NGOs a question…",
};

const SOPHIA_DRAFT_SUGGESTIONS = [
  "Turn my latest milestone into a celebration post",
  "Draft a question to ask my EdgePath cohort",
  "Share an insight from my last coaching session",
  "Write an intro post for new followers",
];

const SUGGESTED_HASHTAGS = ["Phase2Wins", "CareerPivot", "InterviewPrep", "EdgePath", "ImmigrationEdge"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function CategoryChipBar({ value, onChange }: { value: CategoryId; onChange: (id: CategoryId) => void }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => onChange("all")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] flex-shrink-0 cursor-pointer transition-all whitespace-nowrap"
          style={{
            background: value === "all" ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
            border: value === "all" ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
            color: value === "all" ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
            fontFamily: "var(--font-body)",
            fontWeight: value === "all" ? 500 : 400,
          }}
        >
          All
        </button>
        {ORDERED_CATEGORIES.map((cat, i) => {
          const meta = CATEGORY_META[cat];
          const selected = value === cat;
          const Icon = meta.Icon;
          // Visual group divider — subtle gap between groups
          const prevGroup = i > 0 ? CATEGORY_META[ORDERED_CATEGORIES[i - 1]].group : null;
          const showDivider = prevGroup && prevGroup !== meta.group;
          return (
            <div key={cat} className="flex items-center gap-1.5 flex-shrink-0">
              {showDivider && <div className="w-px h-4" style={{ background: "rgba(var(--ce-glass-tint),0.1)" }} />}
              <button
                onClick={() => onChange(cat)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] cursor-pointer transition-all whitespace-nowrap"
                style={{
                  background: selected ? `${meta.color}18` : "rgba(var(--ce-glass-tint),0.04)",
                  border: selected ? `1px solid ${meta.color}40` : "1px solid rgba(var(--ce-glass-tint),0.08)",
                  color: selected ? meta.color : "var(--ce-text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: selected ? 500 : 400,
                }}
              >
                <Icon className="w-3 h-3" />
                {meta.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AudienceFilter({ value, onChange }: { value: AudienceId | "all"; onChange: (id: AudienceId | "all") => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = value === "all" ? "All Posts" : AUDIENCE_META[value].shortLabel;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
        style={{
          background: "rgba(var(--ce-glass-tint),0.04)",
          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
          color: "var(--ce-text-secondary)",
          fontFamily: "var(--font-body)",
        }}
        aria-expanded={open}
        aria-label="Filter posts by audience"
      >
        <Globe className="w-3 h-3" />
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-1 w-[240px] rounded-xl overflow-hidden z-50"
            style={{
              background: "rgba(14,16,20,0.98)",
              border: "1px solid rgba(var(--ce-glass-tint),0.12)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: EASE }}
          >
            <button
              onClick={() => { onChange("all"); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
              style={{
                background: value === "all" ? "rgba(var(--ce-cyan-rgb),0.08)" : "transparent",
                color: value === "all" ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Globe className="w-3 h-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div style={{ fontWeight: value === "all" ? 500 : 400 }}>All Posts</div>
                <div className="text-[9px] text-[var(--ce-text-quaternary)]">Everything across every audience</div>
              </div>
              {value === "all" && <Check className="w-3 h-3 flex-shrink-0" />}
            </button>
            <div className="h-px" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }} />
            {AUDIENCE_ORDER.map(aud => {
              const meta = AUDIENCE_META[aud];
              const selected = value === aud;
              return (
                <button
                  key={aud}
                  onClick={() => { onChange(aud); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
                  style={{
                    background: selected ? "rgba(var(--ce-cyan-rgb),0.08)" : "transparent",
                    color: selected ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: selected ? 500 : 400 }}>{meta.label}</div>
                    <div className="text-[9px] text-[var(--ce-text-quaternary)]">{meta.description}</div>
                  </div>
                  {selected && <Check className="w-3 h-3 flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InlineComposer({
  role,
  expanded,
  onExpand,
  onPost,
}: {
  role: string;
  expanded: boolean;
  onExpand: () => void;
  onPost: (post: { content: string; category: Exclude<CategoryId, "all">; audience: AudienceId; anonymous: boolean; images: number }) => void;
}) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Exclude<CategoryId, "all">>("social");
  const [audience, setAudience] = useState<AudienceId>("public");
  const [anonymous, setAnonymous] = useState(false);
  const [images, setImages] = useState(0);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sophiaOpen, setSophiaOpen] = useState(false);
  const audienceRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sophiaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholder = useMemo(() => SOPHIA_PLACEHOLDER_PROMPTS[role] ?? "Share an update, a question, or a win…", [role]);

  useEffect(() => {
    if (expanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [expanded]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (audienceRef.current && !audienceRef.current.contains(e.target as Node)) setAudienceOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (sophiaRef.current && !sophiaRef.current.contains(e.target as Node)) setSophiaOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost({ content: content.trim(), category, audience, anonymous, images });
    setContent("");
    setImages(0);
    setAnonymous(false);
    setCategory("social");
    setAudience("public");
  };

  const handleSophiaDraft = (prompt: string) => {
    const drafts: Record<string, string> = {
      "Turn my latest milestone into a celebration post":
        "Just completed Phase 2 of my EdgePath roadmap! Hit 3 milestones this week — LinkedIn optimization, portfolio review, and first round of outreach. The compounding effect is real. #Phase2Wins",
      "Draft a question to ask my EdgePath cohort":
        "For those who just finished Phase 2 — what helped you most with the interview prep milestone? Looking for practical resources, not generic advice. #EdgePath",
      "Share an insight from my last coaching session":
        "Biggest takeaway from today's coaching session: stop selling your past role. Start telling the story of the role you want. Totally changes how I'm framing my resume. #CareerPivot",
      "Write an intro post for new followers":
        "Hi everyone — I'm a career changer moving into product design from marketing. Following along on EdgePath for the next 90 days. Would love to connect with anyone on a similar journey. #CareerPivot",
    };
    setContent(drafts[prompt] ?? "");
    setSophiaOpen(false);
    textareaRef.current?.focus();
  };

  const remaining = 500 - content.length;
  const categoryMeta = CATEGORY_META[category];
  const audienceMeta = AUDIENCE_META[audience];
  const CategoryIcon = categoryMeta.Icon;

  if (!expanded) {
    // Collapsed state — single line call-to-post
    return (
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-left hover:bg-[rgba(var(--ce-glass-tint),0.05)]"
        style={{
          background: "rgba(var(--ce-glass-tint),0.03)",
          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
        }}
        aria-label="Compose a post"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(var(--ce-cyan-rgb),0.14)", border: "1px solid rgba(var(--ce-cyan-rgb),0.22)" }}
        >
          <span className="text-[12px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            JA
          </span>
        </div>
        <span className="flex-1 text-[12px] text-[var(--ce-text-tertiary)] truncate" style={{ fontFamily: "var(--font-body)" }}>
          {placeholder}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ImageIcon className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
          <Sparkles className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
          <Mic className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
        </div>
      </button>
    );
  }

  // Expanded composer
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="w-full rounded-2xl overflow-visible"
      style={{
        background: "rgba(var(--ce-glass-tint),0.04)",
        border: "1px solid rgba(var(--ce-cyan-rgb),0.18)",
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(var(--ce-cyan-rgb),0.14)", border: "1px solid rgba(var(--ce-cyan-rgb),0.22)" }}
        >
          {anonymous ? (
            <EyeOff className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
          ) : (
            <span className="text-[12px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              JA
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 500))}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-transparent resize-none outline-none text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
            aria-label="Post content"
          />
          {/* Images row */}
          {images > 0 && (
            <div className="mt-2 flex items-center gap-2">
              {Array.from({ length: images }).map((_, i) => (
                <div
                  key={i}
                  className="relative w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.1)" }}
                >
                  <ImageIcon className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
                  <button
                    onClick={() => setImages(images - 1)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(var(--ce-glass-tint),0.2)" }}
                    aria-label="Remove image"
                  >
                    <X className="w-2.5 h-2.5 text-[var(--ce-text-tertiary)]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer action bar */}
      <div
        className="flex items-center justify-between px-4 py-3 gap-2"
        style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
      >
        {/* Left controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Category picker */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => { setCategoryOpen(v => !v); setAudienceOpen(false); setSophiaOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                background: `${categoryMeta.color}12`,
                border: `1px solid ${categoryMeta.color}28`,
                color: categoryMeta.color,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
              aria-label={`Post category: ${categoryMeta.label}`}
            >
              <CategoryIcon className="w-3 h-3" />
              {categoryMeta.label}
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  className="absolute left-0 top-full mt-1 w-[240px] rounded-xl overflow-hidden z-50 max-h-[280px] overflow-y-auto"
                  style={{
                    background: "rgba(14,16,20,0.98)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.12)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: EASE }}
                >
                  {ORDERED_CATEGORIES.map(cat => {
                    const m = CATEGORY_META[cat];
                    const Icon = m.Icon;
                    const selected = category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setCategoryOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
                        style={{
                          background: selected ? `${m.color}12` : "transparent",
                          color: selected ? m.color : "var(--ce-text-secondary)",
                          fontFamily: "var(--font-body)",
                          fontWeight: selected ? 500 : 400,
                        }}
                      >
                        <Icon className="w-3 h-3 flex-shrink-0" />
                        <span className="flex-1">{m.label}</span>
                        {selected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audience picker */}
          <div className="relative" ref={audienceRef}>
            <button
              onClick={() => { setAudienceOpen(v => !v); setCategoryOpen(false); setSophiaOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.04)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
              aria-label={`Audience: ${audienceMeta.label}`}
            >
              <Globe className="w-3 h-3" />
              {audienceMeta.shortLabel}
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            <AnimatePresence>
              {audienceOpen && (
                <motion.div
                  className="absolute left-0 top-full mt-1 w-[260px] rounded-xl overflow-hidden z-50"
                  style={{
                    background: "rgba(14,16,20,0.98)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.12)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: EASE }}
                >
                  {AUDIENCE_ORDER.map(aud => {
                    const m = AUDIENCE_META[aud];
                    const selected = audience === aud;
                    return (
                      <button
                        key={aud}
                        onClick={() => { setAudience(aud); setAudienceOpen(false); }}
                        className="w-full flex flex-col items-start gap-0.5 px-3 py-2 text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
                        style={{
                          background: selected ? "rgba(var(--ce-cyan-rgb),0.08)" : "transparent",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <div className="w-full flex items-center gap-2">
                          <span style={{ color: selected ? "var(--ce-cyan)" : "var(--ce-text-primary)", fontWeight: selected ? 500 : 400 }}>
                            {m.label}
                          </span>
                          <span className="ml-auto text-[9px] text-[var(--ce-text-quaternary)]">{m.audienceCount}</span>
                          {selected && <Check className="w-3 h-3 text-[var(--ce-cyan)]" />}
                        </div>
                        <span className="text-[9px] text-[var(--ce-text-quaternary)] leading-snug">{m.description}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Anonymous toggle */}
          <button
            onClick={() => setAnonymous(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            style={{
              background: anonymous ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
              border: anonymous ? "1px solid rgba(var(--ce-text-secondary),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
              color: anonymous ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
              fontFamily: "var(--font-body)",
            }}
            aria-pressed={anonymous}
            aria-label={anonymous ? "Posting anonymously" : "Post as yourself"}
          >
            {anonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {anonymous ? "Anonymous" : "As you"}
          </button>

          {/* Image */}
          <button
            onClick={() => {
              if (images >= 4) {
                toast.error("Max 4 images per post");
                return;
              }
              setImages(images + 1);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)] text-[var(--ce-text-tertiary)]"
            style={{
              background: "transparent",
              border: "1px solid rgba(var(--ce-glass-tint),0.08)",
              fontFamily: "var(--font-body)",
            }}
            aria-label="Add image"
          >
            <ImageIcon className="w-3 h-3" />
            {images > 0 ? `${images}/4` : "Image"}
          </button>

          {/* Sophia draft */}
          <div className="relative" ref={sophiaRef}>
            <button
              onClick={() => { setSophiaOpen(v => !v); setCategoryOpen(false); setAudienceOpen(false); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-cyan-rgb),0.1)]"
              style={{
                background: "rgba(var(--ce-cyan-rgb),0.06)",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.18)",
                color: "var(--ce-cyan)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
              aria-label="Draft with Sophia"
            >
              <Sparkles className="w-3 h-3" />
              Draft with Sophia
            </button>
            <AnimatePresence>
              {sophiaOpen && (
                <motion.div
                  className="absolute left-0 top-full mt-1 w-[300px] rounded-xl overflow-hidden z-50"
                  style={{
                    background: "rgba(14,16,20,0.98)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: EASE }}
                >
                  <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                    <SophiaMark size={14} glowing />
                    <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Sophia drafts
                    </span>
                  </div>
                  {SOPHIA_DRAFT_SUGGESTIONS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleSophiaDraft(prompt)}
                      className="w-full text-left px-3 py-2 text-[11px] text-[var(--ce-text-secondary)] cursor-pointer hover:bg-[rgba(var(--ce-cyan-rgb),0.06)] transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Voice */}
          <button
            onClick={() => toast.success("Voice recording — simulated for demo")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)] text-[var(--ce-text-tertiary)]"
            style={{
              background: "transparent",
              border: "1px solid rgba(var(--ce-glass-tint),0.08)",
              fontFamily: "var(--font-body)",
            }}
            aria-label="Voice record"
          >
            <Mic className="w-3 h-3" />
          </button>
        </div>

        {/* Right side — counter + post */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[10px]"
            style={{
              color: remaining < 60 ? "var(--ce-status-warning)" : "var(--ce-text-quaternary)",
              fontFamily: "var(--font-body)",
              fontFeatureSettings: "'tnum'",
            }}
          >
            {remaining}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: content.trim() ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.04)",
              border: content.trim() ? "1px solid var(--ce-cyan)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
              color: content.trim() ? "#08090C" : "var(--ce-text-quaternary)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
            aria-label="Publish post"
          >
            <Send className="w-3 h-3" />
            Post
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Content renderer — linkify hashtags ─────────────────────────────────────

function PostContent({ text, onHashtagClick }: { text: string; onHashtagClick?: (tag: string) => void }) {
  const parts = text.split(/(\s+)/);
  return (
    <p
      className="text-[13px] text-[var(--ce-text-secondary)] leading-relaxed whitespace-pre-wrap"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {parts.map((part, i) => {
        if (part.startsWith("#") && part.length > 1) {
          return (
            <button
              key={i}
              onClick={() => onHashtagClick?.(part.slice(1))}
              className="cursor-pointer hover:underline"
              style={{ color: "var(--ce-cyan)", fontFamily: "var(--font-body)" }}
            >
              {part}
            </button>
          );
        }
        if (part.startsWith("@") && part.length > 1) {
          return (
            <span key={i} style={{ color: "var(--ce-cyan)" }}>
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

// ─── Feed post card ──────────────────────────────────────────────────────────

function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
  onHashtagClick,
  onAuthorClick,
}: {
  post: FeedPost;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
  onShare: () => void;
  onHashtagClick: (tag: string) => void;
  onAuthorClick: () => void;
}) {
  const catMeta = CATEGORY_META[post.category];
  const CategoryIcon = catMeta.Icon;
  const audMeta = AUDIENCE_META[post.audience];

  return (
    <GlassCard className="p-4">
      {/* Author row */}
      <div className="flex items-center gap-2.5 mb-3">
        <button
          onClick={onAuthorClick}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
          style={{ background: post.author.color }}
          aria-label={`View ${post.author.name}'s profile`}
        >
          <span className="text-[12px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {post.author.initial}
          </span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onAuthorClick}
              className="text-[12px] text-[var(--ce-text-primary)] truncate cursor-pointer hover:underline"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {post.author.name}
            </button>
            {post.author.verified && (
              <Check className="w-3 h-3" style={{ color: "var(--ce-cyan)" }} aria-label="Verified" />
            )}
            {!post.anonymous && (
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                @{post.author.handle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              {post.timestamp}
            </span>
            <span className="text-[10px] text-[var(--ce-text-quaternary)]">·</span>
            <Globe className="w-2.5 h-2.5 text-[var(--ce-text-quaternary)]" aria-label={audMeta.label} />
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              {audMeta.shortLabel}
            </span>
          </div>
        </div>
        <span
          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: `${catMeta.color}12`,
            color: catMeta.color,
            border: `1px solid ${catMeta.color}22`,
            fontFamily: "var(--font-body)",
          }}
        >
          <CategoryIcon className="w-2.5 h-2.5" />
          {catMeta.label}
        </span>
      </div>

      {/* Content */}
      <div className="mb-3">
        <PostContent text={post.content} onHashtagClick={onHashtagClick} />
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div
          className={`mb-3 rounded-xl overflow-hidden grid gap-1 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {post.images.map((img, i) => (
            <div
              key={i}
              className="w-full h-44 flex items-center justify-center"
              style={{ background: "rgba(var(--ce-glass-tint),0.05)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
            >
              <span className="text-[10px] text-[var(--ce-text-quaternary)] px-4 text-center" style={{ fontFamily: "var(--font-body)" }}>
                {img}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center gap-1 -mx-2">
        <ActionButton
          Icon={Heart}
          count={post.likes}
          active={post.liked}
          activeColor="var(--ce-status-error)"
          onClick={onLike}
          ariaLabel={post.liked ? "Unlike post" : "Like post"}
          filled={post.liked}
        />
        <ActionButton
          Icon={MessageSquare}
          count={post.comments}
          active={false}
          activeColor="var(--ce-cyan)"
          onClick={onComment}
          ariaLabel="Open comments"
        />
        <ActionButton
          Icon={Share2}
          count={undefined}
          active={false}
          activeColor="var(--ce-cyan)"
          onClick={onShare}
          ariaLabel="Share post"
        />
        <div className="ml-auto flex items-center gap-1">
          <ActionButton
            Icon={Bookmark}
            count={undefined}
            active={post.saved}
            activeColor="var(--ce-lime)"
            onClick={onSave}
            ariaLabel={post.saved ? "Unsave post" : "Save post"}
            filled={post.saved}
          />
          <ActionButton
            Icon={Flag}
            count={undefined}
            active={false}
            activeColor="var(--ce-status-warning)"
            onClick={() => toast.success("Reported — thanks for flagging")}
            ariaLabel="Report post"
          />
        </div>
      </div>
    </GlassCard>
  );
}

function ActionButton({
  Icon,
  count,
  active,
  activeColor,
  onClick,
  ariaLabel,
  filled = false,
}: {
  Icon: LucideIcon;
  count?: number;
  active: boolean;
  activeColor: string;
  onClick: () => void;
  ariaLabel: string;
  filled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.05)]"
      style={{
        color: active ? activeColor : "var(--ce-text-tertiary)",
        fontFamily: "var(--font-body)",
      }}
      aria-label={ariaLabel}
    >
      <Icon
        className="w-3.5 h-3.5"
        style={{ fill: filled ? activeColor : "none" }}
      />
      {typeof count === "number" && <span>{count}</span>}
    </button>
  );
}

// ─── Main surface ────────────────────────────────────────────────────────────

export function SocialEdgeSurface({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const [category, setCategory] = useState<CategoryId>("all");
  const [audience, setAudience] = useState<AudienceId | "all">("all");
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [follows, setFollows] = useState<FollowSuggestion[]>(MOCK_FOLLOW_SUGGESTIONS);
  const [activeHashtagFilter, setActiveHashtagFilter] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [commentsPost, setCommentsPost] = useState<FeedPost | null>(null);
  const [commentsText, setCommentsText] = useState("");

  // Filter posts
  const filteredPosts = useMemo(() => {
    let p = posts;
    if (category !== "all") p = p.filter(post => post.category === category);
    if (audience !== "all") p = p.filter(post => post.audience === audience);
    if (activeHashtagFilter) {
      p = p.filter(post => post.hashtags?.includes(activeHashtagFilter) || post.content.includes(`#${activeHashtagFilter}`));
    }
    return p;
  }, [posts, category, audience, activeHashtagFilter]);

  // Compute trending hashtags from posts
  const trendingHashtags = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => p.hashtags?.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [posts]);

  const handlePost = (input: { content: string; category: Exclude<CategoryId, "all">; audience: AudienceId; anonymous: boolean; images: number }) => {
    const hashtagMatches = input.content.match(/#(\w+)/g) ?? [];
    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      author: input.anonymous
        ? { name: "Anonymous", handle: "anonymous", initial: "?", color: "var(--ce-text-quaternary)" }
        : { name: "Joshua Adeoye", handle: "jadeoye", initial: "JA", color: "var(--ce-cyan)", verified: true },
      anonymous: input.anonymous,
      category: input.category,
      audience: input.audience,
      content: input.content,
      images: input.images > 0 ? Array.from({ length: input.images }, (_, i) => `Image ${i + 1}`) : undefined,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      hashtags: hashtagMatches.map(h => h.slice(1)),
    };
    setPosts(prev => [newPost, ...prev]);
    setComposerExpanded(false);
    toast.success("Post published");
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleSave = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
    toast.success("Saved to your bookmarks");
  };

  const handleFollow = (handle: string) => {
    setFollows(prev => prev.map(f => f.handle === handle ? { ...f, followed: !f.followed } : f));
    const target = follows.find(f => f.handle === handle);
    if (target && !target.followed) toast.success(`Following ${target.name}`);
  };

  const handleHashtagClick = (tag: string) => {
    setActiveHashtagFilter(prev => prev === tag ? null : tag);
  };

  const handleShareToMessages = (id: string) => {
    toast.success("Shared to your Messages");
    setSharingId(null);
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://careeredged.com/feed/${id}`);
    toast.success("Link copied");
    setSharingId(null);
  };

  const sophiaContext = useMemo(() => ({
    message: `Your cohort posted ${posts.length} updates this week — ${filteredPosts.length > 3 ? "plenty of inspiration" : "join the conversation"}.`,
    chips: [
      { label: "Compose a post", action: "compose" },
      { label: "Back to home", action: "home" },
    ],
  }), [posts, filteredPosts]);

  return (
    <RoleShell
      role={(role as any) || "edgestar"}
      onNavigate={onNavigate}
      sophiaOverride={sophiaContext}
    >
      <div className="pt-20 pb-24 px-4 sm:px-6 max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button
              onClick={() => onNavigate?.("synthesis")}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[22px] text-[var(--ce-text-primary)] leading-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                SocialEdge
              </h1>
              <p className="text-[12px] text-[var(--ce-text-tertiary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                Connect and share insights with your CareerEdged community
              </p>
            </div>
          </div>
          <AudienceFilter value={audience} onChange={setAudience} />
        </div>

        {/* Main layout: feed + right rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Center: feed */}
          <div className="min-w-0">
            {/* Category chips */}
            <div className="mb-4">
              <CategoryChipBar value={category} onChange={setCategory} />
            </div>

            {/* Active hashtag pill */}
            {activeHashtagFilter && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 flex items-center gap-2"
              >
                <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                  Filtered by
                </span>
                <button
                  onClick={() => setActiveHashtagFilter(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] cursor-pointer"
                  style={{
                    background: "rgba(var(--ce-cyan-rgb),0.12)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.3)",
                    color: "var(--ce-cyan)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  #{activeHashtagFilter}
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            {/* Composer */}
            <div className="mb-4">
              <InlineComposer
                role={role || "edgestar"}
                expanded={composerExpanded}
                onExpand={() => setComposerExpanded(true)}
                onPost={handlePost}
              />
            </div>

            {/* Sophia insight strip */}
            <div className="mb-4">
              <SophiaInsight
                variant="compact"
                message={`${posts.length} posts this week from your network — ${filteredPosts.length} match your filters.`}
              />
            </div>

            {/* Feed posts */}
            {filteredPosts.length === 0 ? (
              <GlassCard className="p-10 flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(var(--ce-cyan-rgb),0.08)", border: "1px solid rgba(var(--ce-cyan-rgb),0.18)" }}
                >
                  <MessageCircle className="w-5 h-5 text-[var(--ce-cyan)]" />
                </div>
                <h3 className="text-[14px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  No posts match your filters
                </h3>
                <p className="text-[12px] text-[var(--ce-text-tertiary)] mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  Try clearing your filters or being the first to post.
                </p>
                <button
                  onClick={() => {
                    setCategory("all");
                    setAudience("all");
                    setActiveHashtagFilter(null);
                    setComposerExpanded(true);
                  }}
                  className="px-4 py-2 rounded-lg text-[11px] cursor-pointer"
                  style={{
                    background: "rgba(var(--ce-cyan-rgb),0.12)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
                    color: "var(--ce-cyan)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                  }}
                >
                  Clear filters & compose
                </button>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE, delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <PostCard
                      post={post}
                      onLike={() => handleLike(post.id)}
                      onSave={() => handleSave(post.id)}
                      onComment={() => { setCommentsPost(post); setCommentsText(""); }}
                      onShare={() => setSharingId(sharingId === post.id ? null : post.id)}
                      onHashtagClick={handleHashtagClick}
                      onAuthorClick={() => onNavigate?.("profile")}
                    />
                    {/* Share popover */}
                    <AnimatePresence>
                      {sharingId === post.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-2 p-1 rounded-xl flex items-center gap-1"
                          style={{
                            background: "rgba(14,16,20,0.98)",
                            border: "1px solid rgba(var(--ce-glass-tint),0.12)",
                          }}
                        >
                          <button
                            onClick={() => handleCopyLink(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] text-[var(--ce-text-secondary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <Copy className="w-3 h-3" /> Copy link
                          </button>
                          <button
                            onClick={() => { handleShareToMessages(post.id); onNavigate?.("messages"); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] text-[var(--ce-text-secondary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <MessageCircle className="w-3 h-3" /> Share to Messages
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-3">
              {/* Sophia insight card */}
              <GlassCard className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <SophiaMark size={16} glowing />
                  <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Sophia's read
                  </span>
                </div>
                <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Posts about #InterviewPrep are trending in your cohort this week. Want to share how you've been preparing?
                </p>
                <button
                  onClick={() => { setComposerExpanded(true); }}
                  className="w-full px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors"
                  style={{
                    background: "rgba(var(--ce-cyan-rgb),0.08)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                    color: "var(--ce-cyan)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                  }}
                >
                  Compose a post
                </button>
              </GlassCard>

              {/* Trending topics */}
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-[var(--ce-cyan)]" />
                  <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Trending topics
                  </span>
                </div>
                {trendingHashtags.length === 0 ? (
                  <>
                    <p className="text-[10px] text-[var(--ce-text-tertiary)] leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
                      No trending yet. Try a starter hashtag Sophia suggests:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_HASHTAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => { setComposerExpanded(true); }}
                          className="px-2 py-1 rounded-full text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-cyan-rgb),0.08)]"
                          style={{
                            background: "rgba(var(--ce-glass-tint),0.04)",
                            border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                            color: "var(--ce-cyan)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {trendingHashtags.map(([tag, count], i) => (
                      <button
                        key={tag}
                        onClick={() => setActiveHashtagFilter(tag)}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.05)]"
                        style={{ background: activeHashtagFilter === tag ? "rgba(var(--ce-cyan-rgb),0.08)" : "transparent" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                            {i + 1}
                          </span>
                          <span className="text-[11px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-body)" }}>
                            #{tag}
                          </span>
                        </div>
                        <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                          {count} posts
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Who to follow */}
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
                  <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Who to follow
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {follows.map(sug => (
                    <div key={sug.handle} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: sug.color }}
                      >
                        <span className="text-[11px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {sug.initial}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-[var(--ce-text-primary)] truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {sug.name}
                        </div>
                        <div className="text-[9px] text-[var(--ce-text-quaternary)] truncate" style={{ fontFamily: "var(--font-body)" }}>
                          {sug.expertise}
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(sug.handle)}
                        className="px-2.5 py-1 rounded-lg text-[10px] cursor-pointer flex-shrink-0 transition-colors"
                        style={{
                          background: sug.followed ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-cyan-rgb),0.08)",
                          border: sug.followed ? "1px solid rgba(var(--ce-glass-tint),0.12)" : "1px solid rgba(var(--ce-cyan-rgb),0.22)",
                          color: sug.followed ? "var(--ce-text-tertiary)" : "var(--ce-cyan)",
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                        }}
                        aria-pressed={sug.followed}
                      >
                        {sug.followed ? "Following" : "Follow"}
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Comment drawer */}
      <AnimatePresence>
        {commentsPost && (
          <motion.div
            className="fixed inset-0 z-[9990] flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setCommentsPost(null)} />
            <motion.div
              className="relative w-full max-w-[420px] h-full flex flex-col"
              style={{
                background: "rgba(14,16,20,0.98)",
                backdropFilter: "blur(24px)",
                borderLeft: "1px solid rgba(var(--ce-glass-tint),0.1)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <h3 className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Comments · {commentsPost.comments}
                </h3>
                <button
                  onClick={() => setCommentsPost(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                  aria-label="Close comments"
                >
                  <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                  <p className="text-[11px] text-[var(--ce-text-secondary)] line-clamp-3" style={{ fontFamily: "var(--font-body)" }}>
                    {commentsPost.content}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <EmptyComment name="Coach Maria" initial="M" color="var(--ce-role-guide)" text="This resonates. Let me know if you want to do a 1:1 on this — happy to help shape it into a case study." time="1h ago" />
                  <EmptyComment name="James L." initial="J" color="var(--ce-role-edu)" text="Saved this. I'm going through the same transition." time="2h ago" />
                </div>
              </div>
              <div className="flex-shrink-0 p-4 flex items-center gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <input
                  type="text"
                  value={commentsText}
                  onChange={e => setCommentsText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent outline-none text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] px-3 py-2 rounded-lg"
                  style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }}
                />
                <button
                  onClick={() => {
                    if (!commentsText.trim()) return;
                    setPosts(prev => prev.map(p => p.id === commentsPost.id ? { ...p, comments: p.comments + 1 } : p));
                    setCommentsText("");
                    toast.success("Comment posted");
                  }}
                  disabled={!commentsText.trim()}
                  className="px-3 py-2 rounded-lg text-[11px] cursor-pointer disabled:opacity-60"
                  style={{
                    background: commentsText.trim() ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.04)",
                    color: commentsText.trim() ? "#08090C" : "var(--ce-text-quaternary)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside handler for share popover */}
      {sharingId && (
        <div className="fixed inset-0 z-[40]" onClick={() => setSharingId(null)} />
      )}
    </RoleShell>
  );
}

function EmptyComment({ name, initial, color, text, time }: { name: string; initial: string; color: string; text: string; time: string }) {
  return (
    <div className="flex gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: color }}
      >
        <span className="text-[10px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {initial}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {name}
          </span>
          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
            {time}
          </span>
        </div>
        <p className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
          {text}
        </p>
      </div>
    </div>
  );
}
