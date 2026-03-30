import { EASE } from "../tokens";
/**
 * EdgeMarket Surface — Unified Opportunity Discovery Hub
 *
 * Aggregates internships, jobs, scholarships, events, partnerships, and
 * accelerators into a single discovery feed matched to the user's
 * career stage and EdgePath roadmap.
 *
 * States: Empty → Building (2-step Sophia-guided) → Active (filter + grid + drawer)
 * Route: /:role/market
 * Roles: All roles (primary: EdgeStar, EdgePreneur)
 *
 * Cross-surface: EdgePath roadmap, ResumeEdge prep, Sessions coaching
 * Storage: localStorage `ce-market-data`
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  ShoppingBag, Search, Bookmark, BookmarkCheck, MapPin, Globe,
  Calendar, Clock, ArrowRight, ChevronRight, X, Check, Sparkles,
  Star, TrendingUp, ExternalLink, Briefcase, GraduationCap,
  Users, Send, Circle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type OpportunityType = "internship" | "job" | "scholarship" | "event" | "partnership" | "accelerator";
type MatchLevel = "strong" | "good" | "moderate";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  description: string;
  deadline: string;
  location: string;
  isRemote: boolean;
  matchLevel: MatchLevel;
  tags: string[];
  saved: boolean;
  requirements: string[];
  sophiaNote?: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<OpportunityType, { label: string; color: string; icon: React.ReactNode }> = {
  internship:   { label: "Internship",   color: "var(--ce-role-edgestar)",    icon: <GraduationCap className="w-3 h-3" /> },
  job:          { label: "Job",          color: "var(--ce-lime)",             icon: <Briefcase className="w-3 h-3" /> },
  scholarship:  { label: "Scholarship",  color: "var(--ce-role-edgepreneur)", icon: <Star className="w-3 h-3" /> },
  event:        { label: "Event",        color: "var(--ce-role-edu)",         icon: <Calendar className="w-3 h-3" /> },
  partnership:  { label: "Partnership",  color: "var(--ce-role-guide)",       icon: <Users className="w-3 h-3" /> },
  accelerator:  { label: "Accelerator",  color: "var(--ce-role-employer)",    icon: <TrendingUp className="w-3 h-3" /> },
};

const INTEREST_PILLS = ["Internships", "Jobs", "Scholarships", "Events", "Partnerships", "Accelerators"] as const;

const FILTER_CHIPS: { label: string; value: OpportunityType | "all" }[] = [
  { label: "All",           value: "all" },
  { label: "Internships",   value: "internship" },
  { label: "Jobs",          value: "job" },
  { label: "Scholarships",  value: "scholarship" },
  { label: "Events",        value: "event" },
  { label: "Partnerships",  value: "partnership" },
  { label: "Accelerators",  value: "accelerator" },
];

const MATCH_CONFIG: Record<MatchLevel, { label: string; color: string }> = {
  strong:   { label: "Strong Fit",   color: "var(--ce-lime)" },
  good:     { label: "Good Fit",     color: "var(--ce-role-edgestar)" },
  moderate: { label: "Moderate",     color: "var(--ce-text-quaternary)" },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const OPPORTUNITIES: Opportunity[] = [
  { id: "o1", title: "Product Design Intern", organization: "Airbnb", type: "internship", description: "Join Airbnb's design team for a 12-week summer program focused on mobile experiences and design systems.", deadline: "Apr 30, 2026", location: "Remote", isRemote: true, matchLevel: "strong", tags: ["design", "ux", "mobile"], saved: false, requirements: ["Currently enrolled in a design program", "Portfolio with 2+ case studies", "Figma proficiency required"], sophiaNote: "Your portfolio project aligns perfectly with their design systems focus." },
  { id: "o2", title: "Data Science Intern", organization: "Google", type: "internship", description: "10-week research internship analyzing user behavior patterns across Google Workspace products.", deadline: "May 15, 2026", location: "New York, NY", isRemote: false, matchLevel: "good", tags: ["data", "python", "analytics"], saved: false, requirements: ["MS or PhD in a quantitative field", "Experience with Python and SQL", "Published research preferred"], sophiaNote: "Your data analytics coursework matches 3 of their 4 requirements." },
  { id: "o3", title: "Software Engineering Intern", organization: "Stripe", type: "internship", description: "Build payment infrastructure features used by millions of businesses worldwide.", deadline: "Apr 20, 2026", location: "San Francisco, CA", isRemote: false, matchLevel: "good", tags: ["engineering", "payments", "api"], saved: false, requirements: ["CS major or equivalent experience", "Strong fundamentals in algorithms", "Experience with any backend language"] },
  { id: "o4", title: "Frontend Engineer", organization: "Linear", type: "job", description: "Build the next generation of project management tools with a focus on speed, craft, and developer experience.", deadline: "Open", location: "Remote", isRemote: true, matchLevel: "strong", tags: ["react", "typescript", "frontend"], saved: false, requirements: ["3+ years frontend experience", "Deep knowledge of React and TypeScript", "Eye for design and micro-interactions"], sophiaNote: "Linear is a northstar product — this role matches your Phase 2 career goal." },
  { id: "o5", title: "Growth Marketing Manager", organization: "Stripe", type: "job", description: "Lead user acquisition campaigns and optimize conversion funnels for Stripe's self-serve products.", deadline: "May 1, 2026", location: "San Francisco, CA", isRemote: false, matchLevel: "good", tags: ["marketing", "growth", "analytics"], saved: false, requirements: ["5+ years in growth or performance marketing", "Experience with A/B testing frameworks", "SQL and data visualization skills"] },
  { id: "o6", title: "Product Manager", organization: "Vercel", type: "job", description: "Define and ship developer tools that power the modern web. Work closely with engineering and design.", deadline: "Open", location: "Remote", isRemote: true, matchLevel: "moderate", tags: ["product", "developer-tools", "strategy"], saved: false, requirements: ["3+ years product management experience", "Technical background preferred", "Experience with developer-facing products"] },
  { id: "o7", title: "Google Career Certificate Scholarship", organization: "Google.org", type: "scholarship", description: "Full scholarship covering Google Career Certificates in UX Design, Data Analytics, or IT Support.", deadline: "May 15, 2026", location: "Online", isRemote: true, matchLevel: "strong", tags: ["scholarship", "google", "certificate"], saved: false, requirements: ["U.S. resident or eligible work authorization", "Demonstrate financial need", "Commit to completing the program within 6 months"], sophiaNote: "You qualify based on your profile — deadline is 48 days away." },
  { id: "o8", title: "Boundless Future Fund", organization: "Boundless", type: "scholarship", description: "Financial assistance for international professionals pursuing U.S. career certifications and credentials.", deadline: "Rolling", location: "Online", isRemote: true, matchLevel: "moderate", tags: ["scholarship", "international", "funding"], saved: false, requirements: ["International professional background", "Pursuing U.S. career certification", "Essay describing career goals"] },
  { id: "o9", title: "Workforce Innovation Grant", organization: "Department of Labor", type: "scholarship", description: "Federal funding for workforce development training programs in high-demand technology fields.", deadline: "Jun 1, 2026", location: "Online", isRemote: true, matchLevel: "good", tags: ["grant", "federal", "training"], saved: false, requirements: ["Enrolled in an approved training program", "U.S. citizen or permanent resident", "Demonstrate career transition goals"] },
  { id: "o10", title: "AI Career Summit 2026", organization: "CareerEdge Live", type: "event", description: "Two-day virtual summit featuring hiring managers from top AI companies, live resume reviews, and networking.", deadline: "Apr 15, 2026", location: "Virtual", isRemote: true, matchLevel: "strong", tags: ["ai", "networking", "summit"], saved: false, requirements: ["Register by April 10", "Prepare 30-second elevator pitch", "Upload resume for live review sessions"], sophiaNote: "3 companies attending match your target employer list." },
  { id: "o11", title: "NYC Tech Networking Night", organization: "Tech:NYC", type: "event", description: "In-person networking event with startup founders, hiring managers, and investors in the NYC tech ecosystem.", deadline: "Apr 20, 2026", location: "New York, NY", isRemote: false, matchLevel: "good", tags: ["networking", "startups", "nyc"], saved: false, requirements: ["RSVP required — limited to 150 attendees", "Bring business cards or digital profile", "Professional attire recommended"] },
  { id: "o12", title: "Startup Co-founder Matching", organization: "Y Combinator", type: "partnership", description: "YC's official co-founder matching program connecting technical and business founders for the next batch.", deadline: "May 30, 2026", location: "Remote", isRemote: true, matchLevel: "strong", tags: ["startup", "cofounder", "yc"], saved: false, requirements: ["Strong technical or domain expertise", "Available for full-time commitment", "Based in U.S. or willing to relocate"], sophiaNote: "Your entrepreneurial profile scores high on their matching criteria." },
  { id: "o13", title: "Mentor Partnership Program", organization: "First Round Capital", type: "partnership", description: "6-month mentorship pairing early-career professionals with experienced operators from First Round's network.", deadline: "May 10, 2026", location: "Remote", isRemote: true, matchLevel: "good", tags: ["mentorship", "venture", "career"], saved: false, requirements: ["1-3 years professional experience", "Clear mentorship goals", "Commit to bi-weekly 30-min sessions"] },
  { id: "o14", title: "Techstars Social Impact Accelerator", organization: "Techstars", type: "accelerator", description: "13-week accelerator for startups building technology solutions for social and environmental challenges.", deadline: "Jun 15, 2026", location: "Boulder, CO", isRemote: false, matchLevel: "moderate", tags: ["accelerator", "social-impact", "startup"], saved: false, requirements: ["Working prototype or MVP", "Team of 2-4 co-founders", "Mission-driven product focus"] },
  { id: "o15", title: "500 Global Batch 35", organization: "500 Global", type: "accelerator", description: "4-month seed-stage accelerator with $150K investment, global mentor network, and demo day access.", deadline: "Jul 1, 2026", location: "San Francisco, CA", isRemote: false, matchLevel: "good", tags: ["accelerator", "seed", "investment"], saved: false, requirements: ["Incorporated company with traction", "Full-time founding team", "Clear path to $1M ARR"] },
];

// ─── Opportunity Card ────────────────────────────────────────────────────────

function OpportunityCard({
  opportunity,
  onSave,
  onClick,
  delay = 0,
}: {
  opportunity: Opportunity;
  onSave: (id: string) => void;
  onClick: (opp: Opportunity) => void;
  delay?: number;
}) {
  const cfg = TYPE_CONFIG[opportunity.type];
  const match = MATCH_CONFIG[opportunity.matchLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: EASE }}
    >
      <GlassCard delay={0}>
        <div
          className="cursor-pointer"
          onClick={() => onClick(opportunity)}
        >
          {/* Header: type badge + bookmark */}
          <div className="flex items-start justify-between mb-2">
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(opportunity.id);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            >
              {opportunity.saved ? (
                <BookmarkCheck className="w-4 h-4 text-[var(--ce-role-edgestar)]" />
              ) : (
                <Bookmark className="w-4 h-4 text-[var(--ce-text-quaternary)]" />
              )}
            </button>
          </div>

          {/* Title */}
          <h3
            className="text-[13px] text-[var(--ce-text-primary)] mb-0.5 leading-snug"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {opportunity.title}
          </h3>

          {/* Organization */}
          <p
            className="text-[11px] text-[var(--ce-text-tertiary)] mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {opportunity.organization}
          </p>

          {/* Description — 2 lines truncated */}
          <p
            className="text-[12px] text-[var(--ce-text-secondary)] leading-relaxed mb-3"
            style={{
              fontFamily: "var(--font-body)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {opportunity.description}
          </p>

          {/* Bottom row: deadline, location, match */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                {opportunity.deadline}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {opportunity.isRemote ? (
                <Globe className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              ) : (
                <MapPin className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              )}
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                {opportunity.isRemote ? "Remote" : opportunity.location}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Circle
                className="w-2 h-2"
                style={{ fill: match.color, color: match.color }}
              />
              <span
                className="text-[10px]"
                style={{ color: match.color, fontFamily: "var(--font-body)" }}
              >
                {match.label}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Detail Drawer ───────────────────────────────────────────────────────────

function DetailDrawer({
  opportunity,
  onClose,
  onSave,
  onNavigate,
}: {
  opportunity: Opportunity;
  onClose: () => void;
  onSave: (id: string) => void;
  onNavigate: (target: string) => void;
}) {
  const cfg = TYPE_CONFIG[opportunity.type];
  const match = MATCH_CONFIG[opportunity.matchLevel];
  const isEvent = opportunity.type === "event";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[50]"
        style={{ background: "rgba(0,0,0,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        className="fixed top-0 right-0 bottom-0 z-[50] w-[400px] max-w-[90vw] overflow-y-auto"
        style={{
          background: "var(--ce-surface-primary)",
          borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            >
              <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
            </button>
          </div>

          {/* Type badge */}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] mb-4"
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

          {/* Title + Org */}
          <h2
            className="text-[18px] text-[var(--ce-text-primary)] mb-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {opportunity.title}
          </h2>
          <p
            className="text-[13px] text-[var(--ce-text-tertiary)] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {opportunity.organization}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                {opportunity.deadline}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {opportunity.isRemote ? (
                <Globe className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              )}
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                {opportunity.isRemote ? "Remote" : opportunity.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="w-2.5 h-2.5" style={{ fill: match.color, color: match.color }} />
              <span className="text-[11px]" style={{ color: match.color, fontFamily: "var(--font-body)" }}>
                {match.label}
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-[12px] text-[var(--ce-text-secondary)] leading-relaxed mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {opportunity.description}
          </p>

          {/* Requirements */}
          <div className="mb-5">
            <h4
              className="text-[12px] text-[var(--ce-text-primary)] mb-2.5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Requirements
            </h4>
            <ul className="space-y-1.5">
              {opportunity.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sophia note */}
          {opportunity.sophiaNote && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5"
              style={{
                background: "rgba(var(--ce-role-edgestar-rgb),0.05)",
                border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)",
              }}
            >
              <SophiaMark size={18} />
              <p
                className="text-[11px] text-[var(--ce-role-edgestar)] leading-relaxed flex-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {opportunity.sophiaNote}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {opportunity.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px]"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                  color: "var(--ce-text-quaternary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => {
                toast.success(isEvent ? "Registered successfully" : "Application started");
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: "rgba(var(--ce-role-edgestar-rgb),0.1)",
                border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)",
                color: "var(--ce-role-edgestar)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              {isEvent ? "Register" : "Apply"}
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSave(opportunity.id)}
              className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.04)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: opportunity.saved ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              {opportunity.saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Cross-surface links */}
          <div
            className="pt-5 space-y-2"
            style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
          >
            <button
              onClick={() => onNavigate("resume")}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
              style={{
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                fontFamily: "var(--font-body)",
                color: "var(--ce-text-secondary)",
              }}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--ce-role-edgestar)]" />
                Prep my resume for this opportunity
              </span>
              <ArrowRight className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
            </button>
            <button
              onClick={() => onNavigate("sessions")}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
              style={{
                border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                fontFamily: "var(--font-body)",
                color: "var(--ce-text-secondary)",
              }}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--ce-role-edgestar)]" />
                Discuss with a career coach
              </span>
              <ArrowRight className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function EdgeMarketSurface({ role: roleProp, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = roleProp ?? roleParam ?? "edgestar";

  const [surfaceState, setSurfaceState] = useState<"empty" | "building" | "active">("empty");
  const [buildStep, setBuildStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");

  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES);
  const [activeFilter, setActiveFilter] = useState<OpportunityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ce-market-data");
      if (stored) {
        const savedIds: string[] = JSON.parse(stored);
        setOpportunities((prev) =>
          prev.map((o) => ({ ...o, saved: savedIds.includes(o.id) }))
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Toggle save
  const toggleSave = (id: string) => {
    setOpportunities((prev) => {
      const updated = prev.map((o) =>
        o.id === id ? { ...o, saved: !o.saved } : o
      );
      const savedIds = updated.filter((o) => o.saved).map((o) => o.id);
      localStorage.setItem("ce-market-data", JSON.stringify(savedIds));
      const target = updated.find((o) => o.id === id);
      if (target?.saved) {
        toast.success("Opportunity saved");
      }
      // Also update selectedOpportunity if open
      if (selectedOpportunity?.id === id) {
        setSelectedOpportunity(updated.find((o) => o.id === id) ?? null);
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
      resume: `/${role}/resume`,
      resources: `/${role}/resources`,
      synthesis: `/${role}`,
      landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  // Filtered opportunities
  const filtered = opportunities.filter((o) => {
    const matchesType = activeFilter === "all" || o.type === activeFilter;
    const matchesSearch =
      !searchQuery ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const strongFits = filtered.filter((o) => o.matchLevel === "strong").length;

  // Sophia override for bottom bar
  const sophiaOverride =
    surfaceState === "empty"
      ? {
          message: "I'll find opportunities that match your career stage and goals.",
          chips: [
            { label: "View roadmap", action: "Show me my EdgePath milestones and career roadmap" },
            { label: "Prep resume", action: "Help me update my resume for job applications" },
          ],
        }
      : {
          message: "Your opportunity feed — matched to your roadmap.",
          chips: [
            { label: "View roadmap", action: "Show me my EdgePath milestones and career roadmap" },
            { label: "Prep resume", action: "Help me update my resume for job applications" },
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
              <ShoppingBag className="w-7 h-7 text-[var(--ce-role-edgestar)]" />
            </div>
            <h1
              className="text-[20px] text-[var(--ce-text-primary)] mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              EdgeMarket
            </h1>
            <p
              className="text-[13px] text-[var(--ce-text-secondary)] max-w-[340px] mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Discover opportunities matched to your career stage.
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
              Browse Opportunities
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
                        ? "What opportunities interest you?"
                        : "Any preferred industries or locations?"}
                    </span>
                    <span
                      className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {buildStep === 0
                        ? "Select the types you'd like to see — I'll tailor your feed."
                        : "I'll match opportunities to your EdgePath roadmap and skill profile."}
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
                      {/* Interest pills */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {INTEREST_PILLS.map((pill) => {
                          const selected = selectedInterests.includes(pill);
                          return (
                            <button
                              key={pill}
                              onClick={() =>
                                setSelectedInterests((prev) =>
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
                        disabled={selectedInterests.length === 0}
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
                      {/* Location / industry input */}
                      <div
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
                        style={{
                          background: "rgba(var(--ce-glass-tint),0.03)",
                          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                        }}
                      >
                        <Search className="w-4 h-4 text-[var(--ce-text-quaternary)] flex-shrink-0" />
                        <input
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          placeholder="e.g. Remote, NYC, fintech, healthcare..."
                          className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                          style={{ fontFamily: "var(--font-body)" }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSurfaceState("active");
                              toast.success("Your opportunity feed is ready");
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            setSurfaceState("active");
                            toast.success("Your opportunity feed is ready");
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
                          toast.success("Your opportunity feed is ready");
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
          className="pt-8 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
        >
          <div>
            <h1
              className="text-[22px] text-[var(--ce-text-primary)] mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              EdgeMarket
            </h1>
            <p
              className="text-[13px] text-[var(--ce-text-secondary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {filtered.length} opportunities found — {strongFits} strong fit{strongFits !== 1 ? "s" : ""}
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
              View roadmap
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleNavigate("resume")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                border: "1px solid rgba(var(--ce-glass-tint),0.07)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Prep resume
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Filter row + search */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1 flex-wrap">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setActiveFilter(chip.value)}
                className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                style={{
                  background:
                    activeFilter === chip.value
                      ? "rgba(var(--ce-role-edgestar-rgb),0.1)"
                      : "transparent",
                  border:
                    activeFilter === chip.value
                      ? "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)"
                      : "1px solid rgba(var(--ce-glass-tint),0.06)",
                  color:
                    activeFilter === chip.value
                      ? "var(--ce-role-edgestar)"
                      : "var(--ce-text-tertiary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 sm:ml-auto sm:w-[240px]"
            style={{
              background: "rgba(var(--ce-glass-tint),0.03)",
              border: "1px solid rgba(var(--ce-glass-tint),0.07)",
            }}
          >
            <Search className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities..."
              className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
              style={{ fontFamily: "var(--font-body)" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="cursor-pointer"
              >
                <X className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Opportunity grid — 2 col desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {filtered.map((opp, i) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSave={toggleSave}
              onClick={setSelectedOpportunity}
              delay={0.05 * Math.min(i, 8)}
            />
          ))}
        </div>

        {/* Empty filter state */}
        {filtered.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <Search className="w-8 h-8 text-[var(--ce-text-quaternary)] mx-auto mb-3" />
            <p
              className="text-[13px] text-[var(--ce-text-secondary)] mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              No opportunities match your filters
            </p>
            <p
              className="text-[11px] text-[var(--ce-text-tertiary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Try broadening your search or changing the filter.
            </p>
          </motion.div>
        )}

        {/* Sophia insight */}
        {filtered.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
          >
            <SophiaInsight
              variant="inline"
              message={`${strongFits} opportunit${strongFits !== 1 ? "ies" : "y"} match Phase 2 of your roadmap. ${opportunities.filter((o) => o.deadline.includes("Apr")).length} have deadlines this month.`}
              actionLabel="View roadmap"
              onAction={() => handleNavigate("edgepath")}
            />
          </motion.div>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedOpportunity && (
          <DetailDrawer
            opportunity={selectedOpportunity}
            onClose={() => setSelectedOpportunity(null)}
            onSave={toggleSave}
            onNavigate={(target) => {
              setSelectedOpportunity(null);
              handleNavigate(target);
            }}
          />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}
