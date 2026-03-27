/**
 * Sessions — Surface 9
 * Role-based session/booking surface.
 * EdgeStar/EdgePreneur: Find & book mentors/advisors (Sophia's picks + browse)
 * EdgeGuide: Manage availability, upcoming sessions, history, earnings
 * Other roles: Simplified scheduling interface
 *
 * Covers: all 5 session types, both view modes (calendar/list), full booking
 * flow (4 steps), post-session flow, prep briefs, payment mock (all 3 revenue
 * models), availability editor, earnings dashboard.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SophiaMark } from "./sophia-mark";
import { RoleShell, GlassCard, type RoleId, type NavigateFn } from "./role-shell";
import { EASE } from "./tokens";
import { SophiaInsight } from "./sophia-patterns";
import {
  Calendar, Clock, Star, DollarSign, Users, Video,
  ChevronRight, ChevronLeft, Check, X, MessageSquare,
  Sparkles, Globe, Plus, ArrowRight,
  FileText, Award, TrendingUp, Filter, Search,
  BookOpen, Zap, CreditCard, AlertCircle,
  Play, Mic, MicOff, Camera, CameraOff,
  Shield, ThumbsUp, RefreshCw,
  ChevronDown, ChevronUp, MoreHorizontal,
  Info, Bell, Download, BarChart3,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

type SessionType = "1:1 Mentoring" | "Mock Interview" | "Career Coaching" | "Group Workshop" | "Office Hours";
type PriceModel = "free" | "per_session" | "subscription";
type CancellationPolicy = "flexible" | "moderate" | "strict";

interface Mentor {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  sessionTypes: SessionType[];
  price: number;
  priceModel: PriceModel;
  subscriptionPrice?: number;
  rating: number;
  reviewCount: number;
  timezone: string;
  timezoneDisplay: string;
  nextAvailable: string;
  matchReason: string;
  matchConfidence: "high" | "medium" | "low";
  sessionCount: number;
  initials: string;
  color: string;
  cancellationPolicy: CancellationPolicy;
  languages: string[];
  bio: string;
  earnings: number;
  commission: number;
}

interface UpcomingSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorInitials: string;
  mentorColor: string;
  sessionType: SessionType;
  date: string;
  time: string;
  timezone: string;
  duration: number;
  status: "prep_ready" | "upcoming" | "in_2_hours";
  threadId: string;
  prepReady: boolean;
  price: number;
}

interface SessionHistoryItem {
  id: string;
  mentorName: string;
  mentorInitials: string;
  mentorColor: string;
  sessionType: SessionType;
  date: string;
  duration: number;
  guideRating: number;
  myRating: number;
  price: number;
  notes: string;
  sophiaFollowUp: string;
  tasksAdded: boolean;
  awaitingRating: boolean;
}

interface GuideSession {
  id: string;
  bookerName: string;
  bookerInitials: string;
  bookerColor: string;
  sessionType: SessionType;
  date: string;
  time: string;
  duration: number;
  status: "in_2_hours" | "upcoming" | "completed";
  sophiaContext: string;
  price: number;
  earnings: number;
}

interface TimeSlot {
  id: string;
  date: string;
  dateObj: Date;
  time: string;
  endTime: string;
  displayDate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MENTORS: Mentor[] = [
  {
    id: "m1", name: "Alice Chen", title: "Product Lead at Stripe",
    specialty: ["Product Management", "Career Transitions", "Roadmap Strategy"],
    sessionTypes: ["1:1 Mentoring", "Career Coaching", "Mock Interview"],
    price: 75, priceModel: "per_session", subscriptionPrice: 199,
    rating: 4.9, reviewCount: 23, timezone: "EST", timezoneDisplay: "EST (UTC-5)",
    nextAvailable: "Tomorrow, 2:00 PM",
    matchReason: "Alice specializes in PM transitions — your target role. She's guided 23 people through this exact career shift.",
    matchConfidence: "high", sessionCount: 156,
    initials: "AC", color: "var(--ce-role-edgestar)", cancellationPolicy: "moderate",
    languages: ["English", "Mandarin"],
    bio: "10 years in product at Stripe, Notion, and early-stage startups. I help career changers break into PM roles through structured roadmaps and interview prep.",
    earnings: 63.75, commission: 11.25,
  },
  {
    id: "m2", name: "Marcus Johnson", title: "Senior UX Designer at Figma",
    specialty: ["UX Design", "Portfolio Review", "Design Systems"],
    sessionTypes: ["1:1 Mentoring", "Mock Interview", "Group Workshop"],
    price: 0, priceModel: "free",
    rating: 4.7, reviewCount: 45, timezone: "PST", timezoneDisplay: "PST (UTC-8)",
    nextAvailable: "Today, 5:00 PM",
    matchReason: "Your UX skills gap — Marcus has guided 12 transitions like yours and knows exactly what portfolio reviewers look for.",
    matchConfidence: "high", sessionCount: 89,
    initials: "MJ", color: "var(--ce-lime)", cancellationPolicy: "flexible",
    languages: ["English"],
    bio: "Design systems architect by day, volunteer mentor on CareerEdge. I love helping people build portfolios that actually land jobs at top-tier design shops.",
    earnings: 0, commission: 0,
  },
  {
    id: "m3", name: "Dr. Priya Sharma", title: "International Career Mobility Strategist",
    specialty: ["International Career Mobility", "Cross-Border Careers", "Global Opportunities"],
    sessionTypes: ["Career Coaching", "1:1 Mentoring"],
    price: 100, priceModel: "per_session", subscriptionPrice: 249,
    rating: 5.0, reviewCount: 12, timezone: "IST", timezoneDisplay: "IST (UTC+5:30)",
    nextAvailable: "Thursday, 9:00 AM",
    matchReason: "Your international career goals align directly with Dr. Sharma's specialty. She's worked across 4 continents.",
    matchConfidence: "medium", sessionCount: 34,
    initials: "PS", color: "var(--ce-role-guide)", cancellationPolicy: "strict",
    languages: ["English", "Hindi"],
    bio: "PhD in organizational psychology, worked across 4 continents. I help professionals navigate cross-border career opportunities with clarity and a concrete action plan.",
    earnings: 85, commission: 15,
  },
  {
    id: "m4", name: "James Okafor", title: "Engineering Manager at Stripe",
    specialty: ["Interview Prep", "Technical Interviews", "FAANG Coaching"],
    sessionTypes: ["Mock Interview", "1:1 Mentoring", "Office Hours"],
    price: 0, priceModel: "free",
    rating: 4.6, reviewCount: 67, timezone: "WAT", timezoneDisplay: "WAT (UTC+1)",
    nextAvailable: "Wednesday, 11:00 AM",
    matchReason: "Your upcoming Google interview — James has coached 23 successful FAANG hires and knows the exact rubric they use.",
    matchConfidence: "high", sessionCount: 203,
    initials: "JO", color: "var(--ce-role-edgepreneur)", cancellationPolicy: "flexible",
    languages: ["English"],
    bio: "EM at Stripe, previously Google. I volunteer because I know how hard technical interviews are — and how much better you can do with the right prep.",
    earnings: 0, commission: 0,
  },
];

const UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    id: "s1", mentorId: "m1", mentorName: "Alice Chen", mentorInitials: "AC",
    mentorColor: "var(--ce-role-edgestar)", sessionType: "1:1 Mentoring",
    date: "Today", time: "2:00 PM", timezone: "EST", duration: 60,
    status: "in_2_hours", threadId: "t1", prepReady: true, price: 75,
  },
  {
    id: "s2", mentorId: "m2", mentorName: "Marcus Johnson", mentorInitials: "MJ",
    mentorColor: "var(--ce-lime)", sessionType: "Mock Interview",
    date: "Tomorrow", time: "5:00 PM", timezone: "PST", duration: 30,
    status: "upcoming", threadId: "t2", prepReady: false, price: 0,
  },
  {
    id: "s3", mentorId: "m4", mentorName: "James Okafor", mentorInitials: "JO",
    mentorColor: "var(--ce-role-edgepreneur)", sessionType: "Mock Interview",
    date: "March 25", time: "11:00 AM", timezone: "WAT", duration: 60,
    status: "upcoming", threadId: "t3", prepReady: false, price: 0,
  },
];

const SESSION_HISTORY: SessionHistoryItem[] = [
  {
    id: "h1", mentorName: "Alice Chen", mentorInitials: "AC", mentorColor: "var(--ce-role-edgestar)",
    sessionType: "Career Coaching", date: "March 10, 2026", duration: 60,
    guideRating: 5, myRating: 5, price: 75,
    notes: "Focus on PM case study structure. Alice suggested breaking into PM with 3 strong case studies rather than applying broadly. Recommended targeting Series B–C startups first.",
    sophiaFollowUp: "Based on your session with Alice, I've drafted 2 new tasks for your roadmap: 'Complete 3 PM case studies' and 'Research Stripe's product philosophy.' Want me to add them?",
    tasksAdded: true, awaitingRating: false,
  },
  {
    id: "h2", mentorName: "Marcus Johnson", mentorInitials: "MJ", mentorColor: "var(--ce-lime)",
    sessionType: "1:1 Mentoring", date: "March 5, 2026", duration: 60,
    guideRating: 5, myRating: 4, price: 0,
    notes: "Portfolio critique session. Marcus recommended adding interaction annotations to case studies. Motion work is strong — lead with it. Remove the early student work from page 1.",
    sophiaFollowUp: "Marcus suggested adding 3 interaction examples to your portfolio. I've added 'Annotate case study interactions' to your design phase tasks.",
    tasksAdded: true, awaitingRating: false,
  },
  {
    id: "h3", mentorName: "Dr. Priya Sharma", mentorInitials: "PS", mentorColor: "var(--ce-role-guide)",
    sessionType: "Career Coaching", date: "February 28, 2026", duration: 60,
    guideRating: 5, myRating: 5, price: 100,
    notes: "International career mobility strategy. Dr. Sharma outlined 3-step approach: skill documentation, regional certification mapping, and employer targeting by geography.",
    sophiaFollowUp: "Dr. Sharma's mobility framework has been added to your roadmap. 3 new milestones: 'Document transferable skills', 'Research target markets', 'Build international network.'",
    tasksAdded: true, awaitingRating: false,
  },
  {
    id: "h4", mentorName: "James Okafor", mentorInitials: "JO", mentorColor: "var(--ce-role-edgepreneur)",
    sessionType: "Mock Interview", date: "February 20, 2026", duration: 30,
    guideRating: 4, myRating: 0, price: 0,
    notes: "Technical interview simulation. Strong on behavioral rounds, needs work on system design under time pressure. Time management during technical rounds is key.",
    sophiaFollowUp: "James identified system design as your key growth area. I've drafted 'Study distributed systems fundamentals' for your Interview Prep phase. Want me to add it?",
    tasksAdded: false, awaitingRating: true,
  },
  {
    id: "h5", mentorName: "Alice Chen", mentorInitials: "AC", mentorColor: "var(--ce-role-edgestar)",
    sessionType: "1:1 Mentoring", date: "February 10, 2026", duration: 30,
    guideRating: 5, myRating: 5, price: 75,
    notes: "First session. Covered PM fundamentals, Alice reviewed background and suggested 6-month roadmap. Focus on: outcome-based thinking, stakeholder management, and product analytics.",
    sophiaFollowUp: "Your first session with Alice set the foundation for your PM roadmap. Phase 1 milestones created based on her recommendations.",
    tasksAdded: true, awaitingRating: false,
  },
];

const GUIDE_UPCOMING: GuideSession[] = [
  {
    id: "gu1", bookerName: "Sharon Lee", bookerInitials: "SL", bookerColor: "var(--ce-role-edgestar)",
    sessionType: "1:1 Mentoring", date: "Today", time: "10:00 AM", duration: 60,
    status: "in_2_hours",
    sophiaContext: "Sharon is on Phase 2 of 4, Interaction Design focus. Completed 2 case study milestones this week. Resume score: 82. Has 2 applications in 'Interviewing' status at Google and Figma. She may want to discuss portfolio structure or interview prep.",
    price: 75, earnings: 63.75,
  },
  {
    id: "gu2", bookerName: "Marcus Rivera", bookerInitials: "MR", bookerColor: "var(--ce-lime)",
    sessionType: "Mock Interview", date: "Today", time: "2:00 PM", duration: 30,
    status: "upcoming",
    sophiaContext: "Marcus is preparing for a Google SWE interview next week. 60% through his Interview Prep module. Focus: system design and behavioral questions. He tends to over-explain — help him structure concise, STAR-format answers.",
    price: 0, earnings: 0,
  },
  {
    id: "gu3", bookerName: "Alex Rivera", bookerInitials: "AR", bookerColor: "var(--ce-role-guide)",
    sessionType: "Career Coaching", date: "Tomorrow", time: "4:00 PM", duration: 60,
    status: "upcoming",
    sophiaContext: "Alex is transitioning from marketing to UX research. Phase 1 of 6, 25% complete. No previous UX experience — significant pivot. Motivated but overwhelmed. Start with a realistic 6-month view and celebrate the small wins.",
    price: 75, earnings: 63.75,
  },
];

// Week calendar blocks for EdgeGuide (day 0=Mon, hours 8-20)
const GUIDE_AVAILABILITY = [
  { day: 0, start: 9, end: 12, type: "available" as const },
  { day: 0, start: 14, end: 17, type: "available" as const },
  { day: 1, start: 9, end: 11, type: "booked" as const, client: "Sharon L." },
  { day: 1, start: 14, end: 14.5, type: "booked" as const, client: "Marcus R." },
  { day: 2, start: 10, end: 16, type: "available" as const },
  { day: 3, start: 9, end: 13, type: "available" as const },
  { day: 4, start: 9, end: 12, type: "booked" as const, client: "Alex R." },
  { day: 4, start: 14, end: 18, type: "available" as const },
  { day: 5, start: 10, end: 12, type: "available" as const },
];

// Generate available time slots for the next 14 days
function generateSlots(mentorId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const base = new Date(2026, 2, 18); // March 18, 2026
  const times = ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM", "5:30 PM"];
  const endTimes = ["10:00 AM", "11:30 AM", "3:00 PM", "5:00 PM", "6:30 PM"];
  // Different availability patterns per mentor
  const patterns: Record<string, number[][]> = {
    m1: [[0, 3, 4], [1, 3], [2, 4], [3, 0, 2]],
    m2: [[0, 4], [1, 2, 4], [0, 3], [2, 4]],
    m3: [[2], [3, 4], [0], [1, 4]],
    m4: [[0, 1, 3], [2, 4], [0, 3], [1, 2]],
  };
  const pat = patterns[mentorId] || [[0, 2, 4], [1, 3], [0, 4], [2, 3]];

  for (let d = 1; d <= 14; d++) {
    const date = new Date(base);
    date.setDate(base.getDate() + d);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue; // skip weekends
    const patIdx = Math.floor(d / 3.5) % pat.length;
    const daySlots = pat[patIdx] || [0, 2];
    daySlots.forEach((ti) => {
      slots.push({
        id: `${mentorId}-${d}-${ti}`,
        date: date.toISOString(),
        dateObj: date,
        time: times[ti],
        endTime: endTimes[ti],
        displayDate: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      });
    });
  }
  return slots;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function StarRating({ value, max = 5, size = 14, interactive = false, onChange }: {
  value: number; max?: number; size?: number; interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = interactive && hovered !== null ? hovered : value;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} out of ${max} stars`}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
            style={{ color: n <= display ? "var(--ce-role-edgepreneur)" : "var(--ce-text-quaternary)", padding: 0, background: "none", border: "none" }}
          >
            <Star style={{ width: size, height: size }} fill={n <= display ? "var(--ce-role-edgepreneur)" : "none"} />
          </button>
        ) : (
          <span
            key={n}
            aria-hidden="true"
            style={{ color: n <= display ? "var(--ce-role-edgepreneur)" : "var(--ce-text-quaternary)", display: "inline-flex" }}
          >
            <Star style={{ width: size, height: size }} fill={n <= display ? "var(--ce-role-edgepreneur)" : "none"} />
          </span>
        )
      )}
    </div>
  );
}

function PriceBadge({ mentor }: { mentor: Mentor }) {
  if (mentor.priceModel === "free") {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-lime-rgb),0.1)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>
        Free
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.1)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>
      ${mentor.price}/session
    </span>
  );
}

function SessionTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    "1:1 Mentoring": "var(--ce-role-edgestar)",
    "Mock Interview": "var(--ce-role-guide)",
    "Career Coaching": "var(--ce-role-edgepreneur)",
    "Group Workshop": "var(--ce-role-parent)",
    "Office Hours": "var(--ce-role-employer)",
  };
  const color = colors[type] || "var(--ce-text-secondary)";
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap" style={{ background: `${color}12`, color, fontFamily: "var(--font-body)", border: `1px solid ${color}20` }}>
      {type}
    </span>
  );
}

// ─── Mentor Card ───────────────────────���──────────────────────────────────────

function MentorCard({ mentor, onBook, compact = false }: {
  mentor: Mentor;
  onBook: (mentor: Mentor) => void;
  compact?: boolean;
}) {
  return (
    <motion.div
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer group"
      style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)", transition: "border-color 0.2s" }}
      whileHover={{ borderColor: "rgba(var(--ce-glass-tint),0.1)", y: -1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: `${mentor.color}18`, border: `1.5px solid ${mentor.color}30` }}>
          <span className="text-[16px]" style={{ color: mentor.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{mentor.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{mentor.name}</span>
            <PriceBadge mentor={mentor} />
          </div>
          <span className="text-[11px] text-ce-text-tertiary block mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{mentor.title}</span>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating value={mentor.rating} size={11} />
            <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{mentor.rating} · {mentor.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      {/* Sophia match reason */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}>
        <SophiaMark size={14} glowing={false} />
        <p className="text-[11px] text-ce-cyan leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{mentor.matchReason}</p>
      </div>

      {/* Session types */}
      <div className="flex flex-wrap gap-1.5">
        {mentor.sessionTypes.map((t) => <SessionTypeBadge key={t} type={t} />)}
      </div>

      {/* Specialty tags */}
      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          {mentor.specialty.map((s) => (
            <span key={s} className="text-[10px] text-ce-text-secondary px-2 py-0.5 rounded-md" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-ce-text-tertiary" />
          <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Next: {mentor.nextAvailable}</span>
        </div>
        <button
          onClick={() => onBook(mentor)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all"
          style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          Book Session <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Sophia's Picks Section ───────────────────────────────────────────────────

function SophiaPicksSection({ onBook }: { onBook: (mentor: Mentor) => void }) {
  return (
    <div>
      {/* Sophia timing nudge */}
      <motion.div
        className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
        style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.06), rgba(var(--ce-lime-rgb),0.03))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
      >
        <SophiaMark size={16} glowing={false} />
        <div className="flex-1">
          <p className="text-[13px] text-ce-text-primary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            <span className="text-ce-cyan">Good pairing opportunity.</span> You just completed your Phase 2 milestone — a debrief session this week would help solidify your learnings and accelerate Phase 3.
          </p>
          <div className="flex gap-2 mt-2">
            <button className="text-[11px] text-ce-cyan px-2.5 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)", fontFamily: "var(--font-body)" }}>
              Find a debrief mentor →
            </button>
            <button className="text-[11px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
              Not now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Picks grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MENTORS.map((mentor, i) => (
          <motion.div key={mentor.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: EASE }}>
            <MentorCard mentor={mentor} onBook={onBook} />
          </motion.div>
        ))}
      </div>

      <motion.button
        className="w-full mt-4 py-3 rounded-xl text-[13px] text-ce-text-secondary flex items-center justify-center gap-2 cursor-pointer"
        style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)", fontFamily: "var(--font-body)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        whileHover={{ backgroundColor: "rgba(var(--ce-glass-tint),0.04)" }}
      >
        Browse all mentors <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── Browse All Section ───────────────────────────────────────────────────────

const FILTER_OPTIONS = {
  specialty: ["Product Management", "UX Design", "International Career Mobility", "Interview Prep", "Data Science", "Leadership"],
  sessionType: ["1:1 Mentoring", "Mock Interview", "Career Coaching", "Group Workshop", "Office Hours"],
  price: ["Free only", "$0–$50", "$50–$100", "$100+"],
  availability: ["This week", "Next week", "Anytime"],
  rating: ["4+ stars", "3+ stars"],
  language: ["English", "Mandarin", "Hindi", "Spanish"],
};

function MentorBrowseSection({ onBook }: { onBook: (mentor: Mentor) => void }) {
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalFilters = Object.values(activeFilters).flat().length;

  const filtered = MENTORS.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.specialty.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (activeFilters.price?.includes("Free only") && m.priceModel !== "free") return false;
    if (activeFilters.rating?.includes("4+ stars") && m.rating < 4) return false;
    return true;
  });

  const toggleFilter = (cat: string, val: string) => {
    setActiveFilters(prev => {
      const curr = prev[cat] || [];
      if (curr.includes(val)) return { ...prev, [cat]: curr.filter(v => v !== val) };
      return { ...prev, [cat]: [...curr, val] };
    });
  };

  return (
    <div>
      {/* Search + filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
          <Search className="w-4 h-4 text-ce-text-tertiary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search mentors, specialties…"
            className="flex-1 bg-transparent text-[13px] text-ce-text-primary outline-none placeholder:text-[var(--ce-text-quaternary)]"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter ? null : "all")}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] cursor-pointer"
            style={{ background: totalFilters > 0 ? "rgba(var(--ce-role-edgestar-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.03)", border: totalFilters > 0 ? "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)" : "1px solid rgba(var(--ce-glass-tint),0.06)", color: totalFilters > 0 ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
          >
            <Filter className="w-3.5 h-3.5" /> Filters {totalFilters > 0 && `(${totalFilters})`}
          </button>

          <AnimatePresence>
            {openFilter && (
              <motion.div
                className="absolute top-10 right-0 z-30 w-[320px] rounded-2xl p-4"
                style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", backdropFilter: "blur(20px)" }}
                initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
              >
                {Object.entries(FILTER_OPTIONS).map(([cat, opts]) => (
                  <div key={cat} className="mb-4">
                    <span className="text-[10px] text-ce-text-tertiary uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "0.08em" }}>
                      {cat.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {opts.map((opt) => {
                        const active = (activeFilters[cat] || []).includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleFilter(cat, opt)}
                            className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                            style={{ background: active ? "rgba(var(--ce-lime-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)", border: active ? "1px solid rgba(var(--ce-lime-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.06)", color: active ? "var(--ce-lime)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <button onClick={() => { setActiveFilters({}); setOpenFilter(null); }} className="text-[11px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="text-[11px] text-ce-text-tertiary mb-3" style={{ fontFamily: "var(--font-body)" }}>
        {filtered.length} mentors available
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((mentor, i) => (
          <motion.div key={mentor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <MentorCard mentor={mentor} onBook={onBook} compact />
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-4">
          <SophiaMark size={32} glowing={false} />
          <p className="text-[13px] text-ce-text-secondary text-center max-w-[300px]" style={{ fontFamily: "var(--font-body)" }}>
            No mentors match your current filters. I'll notify you when one becomes available. Try exploring other focus areas.
          </p>
          <button onClick={() => setActiveFilters({})} className="text-[12px] text-ce-cyan px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)", fontFamily: "var(--font-body)" }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Upcoming Sessions Strip ──────────────────────────────────────────────────

function UpcomingSessionsStrip({ sessions, onOpenThread }: {
  sessions: UpcomingSession[];
  onOpenThread?: (threadId: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-ce-lime" />
        <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Upcoming Sessions</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-lime-rgb),0.1)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>{sessions.length}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {sessions.map((s, i) => (
          <motion.div
            key={s.id}
            className="flex-shrink-0 w-[260px] rounded-2xl p-4"
            style={{
              background: s.status === "in_2_hours" ? "linear-gradient(135deg, rgba(var(--ce-lime-rgb),0.06), rgba(var(--ce-glass-tint),0.02))" : "rgba(var(--ce-glass-tint),0.025)",
              border: s.status === "in_2_hours" ? "1px solid rgba(var(--ce-lime-rgb),0.15)" : "1px solid rgba(var(--ce-glass-tint),0.05)",
            }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07, duration: 0.35, ease: EASE }}
          >
            {s.status === "in_2_hours" && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-lime)]" style={{ animation: "pulse 2s infinite" }} />
                <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>Starting in 2 hours</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${s.mentorColor}15`, border: `1px solid ${s.mentorColor}25` }}>
                <span className="text-[11px]" style={{ color: s.mentorColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.mentorInitials}</span>
              </div>
              <div>
                <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{s.mentorName}</span>
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{s.date} · {s.time} {s.timezone}</span>
              </div>
            </div>
            <div className="flex gap-1.5 mb-3">
              <SessionTypeBadge type={s.sessionType} />
              <span className="text-[10px] text-ce-text-tertiary px-2 py-0.5 rounded-md" style={{ background: "rgba(var(--ce-glass-tint),0.03)", fontFamily: "var(--font-body)" }}>{s.duration} min</span>
              {s.price === 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>Free</span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.08)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>${s.price}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onOpenThread?.(s.threadId)} className="flex-1 text-[11px] py-1.5 rounded-lg text-center cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", color: "var(--ce-role-edgestar)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)", fontFamily: "var(--font-body)" }}>
                Open thread
              </button>
              <button className="flex-1 text-[11px] py-1.5 rounded-lg text-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.05)", fontFamily: "var(--font-body)" }}>
                Reschedule
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Prep Brief Card ──────────────────────────────────────────────────────────

function PrepBriefCard({ session }: { session: UpcomingSession }) {
  const topics = [
    "Portfolio structure (you completed the case study milestone last week)",
    "Interview prep for PM roles (you have 2 applications in 'Interviewing' status)",
    "Networking strategy for your target companies",
  ];
  return (
    <motion.div
      className="rounded-2xl p-5 mb-4"
      style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-edgestar-rgb),0.07), rgba(var(--ce-lime-rgb),0.03))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)" }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35, ease: EASE }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SophiaMark size={16} glowing={false} />
        <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session Prep — {session.mentorName}</span>
        <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{session.date} · {session.time} {session.timezone}</span>
      </div>
      <p className="text-[12px] text-ce-text-secondary mb-3" style={{ fontFamily: "var(--font-body)" }}>
        Based on your roadmap progress, here's what might be most valuable to discuss:
      </p>
      <ul className="flex flex-col gap-2 mb-4">
        {topics.map((t, i) => (
          <li key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-edgestar)] mt-1.5 flex-shrink-0" />
            <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{t}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg cursor-pointer" style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
          <Video className="w-3 h-3" /> Join Call
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>
          <MessageSquare className="w-3 h-3" /> Open thread
        </button>
        <button className="px-3 py-1.5 text-[11px] text-ce-text-tertiary rounded-lg cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
          Reschedule
        </button>
      </div>
    </motion.div>
  );
}

// ─── Session History List ─────────────────────────────────────────────────────

function SessionHistoryList({ items, onRateSession }: {
  items: SessionHistoryItem[];
  onRateSession?: (item: SessionHistoryItem) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: item.awaitingRating ? "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.35, ease: EASE }}
        >
          {/* Row */}
          <button
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${item.mentorColor}15`, border: `1px solid ${item.mentorColor}25` }}>
              <span className="text-[12px]" style={{ color: item.mentorColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{item.mentorInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{item.mentorName}</span>
                <SessionTypeBadge type={item.sessionType} />
                {item.awaitingRating && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.12)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>
                    Rate this session
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{item.date} · {item.duration} min</span>
                {item.price > 0 && <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>· ${item.price}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {item.myRating > 0 && <StarRating value={item.myRating} size={12} />}
              {expanded === item.id ? <ChevronUp className="w-4 h-4 text-ce-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-ce-text-tertiary" />}
            </div>
          </button>

          {/* Expanded content */}
          <AnimatePresence>
            {expanded === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                style={{ overflow: "hidden", borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
              >
                <div className="px-5 py-4 flex flex-col gap-4">
                  {/* Rating prompt */}
                  {item.awaitingRating && (
                    <button
                      onClick={() => onRateSession?.(item)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer w-full text-left"
                      style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.15)" }}
                    >
                      <Star className="w-4 h-4 text-[var(--ce-role-edgepreneur)]" />
                      <span className="text-[12px] text-[var(--ce-role-edgepreneur)]" style={{ fontFamily: "var(--font-body)" }}>Rate your session with James →</span>
                    </button>
                  )}

                  {/* Notes */}
                  <div>
                    <span className="text-[11px] text-ce-text-tertiary block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session Notes</span>
                    <p className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.notes}</p>
                  </div>

                  {/* Sophia follow-up */}
                  <div className="flex items-start gap-2 px-3 py-3 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.05)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}>
                    <SophiaMark size={14} glowing={false} />
                    <div className="flex-1">
                      <p className="text-[11px] text-ce-cyan leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.sophiaFollowUp}</p>
                      {!item.tasksAdded && (
                        <div className="flex gap-2 mt-2">
                          <button className="text-[10px] text-ce-lime px-2 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", border: "1px solid rgba(var(--ce-lime-rgb),0.15)", fontFamily: "var(--font-body)" }}>
                            Add to roadmap →
                          </button>
                          <button className="text-[10px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Dismiss</button>
                        </div>
                      )}
                      {item.tasksAdded && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Check className="w-3 h-3 text-ce-lime" />
                          <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Added to roadmap</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next session CTA */}
                  <button
                    onClick={() => toast.success("Booking flow opened")}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] cursor-pointer"
                    style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Book follow-up with {item.mentorName.split(" ")[0]}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Post-Session Modal ───────────────────────────────────────────────────────

function PostSessionModal({ item, onClose }: { item: SessionHistoryItem; onClose: () => void }) {
  const [step, setStep] = useState<"rating" | "notes" | "followup" | "done">("rating");
  const [myRating, setMyRating] = useState(0);
  const [notes, setNotes] = useState(item.notes);
  const [acceptedTasks, setAcceptedTasks] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(var(--ce-shadow-tint),0.7)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-[480px] rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${item.mentorColor}15` }}>
              <span className="text-[11px]" style={{ color: item.mentorColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{item.mentorInitials}</span>
            </div>
            <div>
              <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session Complete</span>
              <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>with {item.mentorName} · {item.sessionType}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-ce-text-tertiary cursor-pointer hover:text-ce-text-secondary"><X className="w-5 h-5" /></button>
        </div>

        {/* Step: Rating */}
        {step === "rating" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SophiaMark size={16} glowing={false} />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>How was your session with {item.mentorName.split(" ")[0]}?</span>
            </div>
            <div className="flex flex-col items-center gap-4 py-6 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <StarRating value={myRating} size={32} interactive onChange={setMyRating} />
              <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                {myRating === 0 ? "Tap to rate" : myRating === 5 ? "Excellent session!" : myRating === 4 ? "Great session" : myRating === 3 ? "Decent session" : "Could be better"}
              </p>
            </div>
            <button
              onClick={() => myRating > 0 && setStep("notes")}
              className="w-full py-3 rounded-xl text-[13px] cursor-pointer transition-colors"
              style={{ background: myRating > 0 ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.04)", color: myRating > 0 ? "var(--ce-surface-0)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step: Notes */}
        {step === "notes" && (
          <div className="flex flex-col gap-4">
            <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session notes</span>
            <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>These are shared with {item.mentorName.split(" ")[0]}. Add anything worth remembering.</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              className="w-full rounded-xl px-4 py-3 text-[13px] text-ce-text-primary resize-none outline-none"
              style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", fontFamily: "var(--font-body)" }}
            />
            <button
              onClick={() => setStep("followup")}
              className="w-full py-3 rounded-xl text-[13px] cursor-pointer"
              style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Save Notes & Continue
            </button>
          </div>
        )}

        {/* Step: Sophia Follow-up */}
        {step === "followup" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 px-4 py-4 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)" }}>
              <SophiaMark size={16} glowing={false} />
              <div>
                <p className="text-[13px] text-ce-cyan mb-2" style={{ fontFamily: "var(--font-body)" }}>Session complete. Here's what I picked up:</p>
                <ul className="flex flex-col gap-1.5 mb-3">
                  <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-[var(--ce-role-edgestar)] mt-1.5 flex-shrink-0" /><span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Strong on behavioral, needs work on system design timing</span></li>
                  <li className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-[var(--ce-role-edgestar)] mt-1.5 flex-shrink-0" /><span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>James suggested STAR format with 45-second limit per behavioral</span></li>
                </ul>
                <p className="text-[11px] text-ce-text-secondary mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  I've drafted 2 new tasks for your roadmap: <span className="text-ce-text-primary">'Study distributed systems fundamentals'</span> and <span className="text-ce-text-primary">'Practice STAR format with 10 mock questions.'</span> Want me to add them?
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setAcceptedTasks(true); setStep("done"); }} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-lime-rgb),0.1)", color: "var(--ce-lime)", border: "1px solid rgba(var(--ce-lime-rgb),0.2)", fontFamily: "var(--font-body)" }}>
                    <Check className="w-3 h-3" /> Yes, add them →
                  </button>
                  <button onClick={() => setStep("done")} className="px-3 py-1.5 text-[11px] text-ce-text-tertiary rounded-lg cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Review first</button>
                </div>
              </div>
            </div>

            {/* Next session */}
            <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <p className="text-[12px] text-ce-text-secondary mb-2" style={{ fontFamily: "var(--font-body)" }}>
                <span className="text-ce-cyan">Sophia suggests:</span> James has availability next Thursday. A follow-up session focused on system design would help before your Google interview.
              </p>
              <div className="flex gap-2">
                <button className="text-[11px] text-ce-lime px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", border: "1px solid rgba(var(--ce-lime-rgb),0.15)", fontFamily: "var(--font-body)" }}>
                  Book follow-up →
                </button>
                <button onClick={() => setStep("done")} className="text-[11px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Not now</button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.1)", border: "1px solid rgba(var(--ce-lime-rgb),0.2)" }}>
              <Check className="w-6 h-6 text-ce-lime" />
            </div>
            <div className="text-center">
              <p className="text-[15px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>All done</p>
              <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                {acceptedTasks ? "Tasks added to your roadmap." : "Notes saved."} Great session with James.
              </p>
            </div>
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-[13px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

const SESSION_TYPE_DETAILS: Record<SessionType, { icon: React.ReactNode; desc: string; sophiaNote: string; durations: number[] }> = {
  "1:1 Mentoring": {
    icon: <Users className="w-5 h-5" />,
    desc: "One-on-one video session. Discuss career goals, get personalized advice, and work through specific challenges.",
    sophiaNote: "1:1 sessions are highest value right after a milestone. You'll get the most out of this now.",
    durations: [30, 60],
  },
  "Mock Interview": {
    icon: <Mic className="w-5 h-5" />,
    desc: "Practice interview with real-time feedback. Sophia will coach you during the call with prompts and tips.",
    sophiaNote: "I'll be active in the sidebar during this session — providing real-time coaching and performance notes.",
    durations: [30, 60],
  },
  "Career Coaching": {
    icon: <Award className="w-5 h-5" />,
    desc: "Structured career coaching with a professional coach. Deep-dive into your roadmap, strategy, and next moves.",
    sophiaNote: "Career coaching sessions are billable. Your roadmap data is shared with the coach in advance.",
    durations: [60],
  },
  "Group Workshop": {
    icon: <Video className="w-5 h-5" />,
    desc: "Join a small group (up to 6) for a focused workshop. Learn from peers and the host in a collaborative setting.",
    sophiaNote: "Group sessions are great for expanding your network. Other attendees share similar career goals.",
    durations: [60, 90],
  },
  "Office Hours": {
    icon: <BookOpen className="w-5 h-5" />,
    desc: "Drop-in office hours. No booking required for attendance — join the queue when the host is live.",
    sophiaNote: "Office Hours is drop-in. You'll be queued with other attendees — estimated wait shown when you join.",
    durations: [0],
  },
};

const CANCELLATION_LABELS: Record<CancellationPolicy, string> = {
  flexible: "Flexible — cancel anytime, full refund",
  moderate: "Moderate — cancel 24hrs before, full refund",
  strict: "Strict — cancel 48hrs before, 50% refund",
};

function BookingModal({ mentor, onClose, onComplete }: {
  mentor: Mentor;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<"type" | "time" | "payment" | "confirm">("type");
  const [selectedType, setSelectedType] = useState<SessionType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [calendarView, setCalendarView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 2, 1));
  const [calendarAdded, setCalendarAdded] = useState<string | null>(null);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  const slots = useMemo(() => generateSlots(mentor.id), [mentor.id]);

  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isPaid = mentor.priceModel !== "free" && selectedType === "Career Coaching";
  const price = isPaid ? mentor.price : 0;

  // Build calendar grid for current month
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const availableDates = new Set(slots.map(s => new Date(s.dateObj).toDateString()));

  const slotsForDate = selectedDate
    ? slots.filter(s => new Date(s.dateObj).toDateString() === selectedDate.toDateString())
    : [];

  const nextSlots = slots.slice(0, 12);

  const stepLabels = ["Session Type", "Pick a Time", isPaid ? "Payment" : null, "Confirmed"].filter(Boolean);

  function handleSlotSelect(slot: TimeSlot) {
    if (expandedSlot === slot.id) {
      if (isPaid) {
        setStep("payment");
      } else {
        setStep("confirm");
      }
      return;
    }
    setExpandedSlot(slot.id);
    setSelectedSlot(slot);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(var(--ce-shadow-tint),0.7)", backdropFilter: "blur(10px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-[600px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "rgba(12,14,18,0.99)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", maxHeight: "90vh" }}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${mentor.color}15`, border: `1.5px solid ${mentor.color}25` }}>
              <span className="text-[12px]" style={{ color: mentor.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{mentor.initials}</span>
            </div>
            <div>
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Book with {mentor.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Globe className="w-3 h-3 text-ce-text-tertiary" />
                <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{mentor.timezoneDisplay}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-ce-text-tertiary cursor-pointer hover:text-ce-text-secondary"><X className="w-5 h-5" /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          {(["type", "time", isPaid ? "payment" : null, "confirm"] as (string | null)[]).filter(Boolean).map((s, i, arr) => {
            const isActive = step === s;
            const stepOrder = ["type", "time", "payment", "confirm"];
            const currentIdx = stepOrder.indexOf(step);
            const isDone = stepOrder.indexOf(s!) < currentIdx;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: isDone ? "var(--ce-lime)" : isActive ? "rgba(var(--ce-lime-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.04)", color: isDone ? "var(--ce-surface-0)" : isActive ? "var(--ce-lime)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                    {isDone ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="text-[11px]" style={{ color: isActive ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                    {stepLabels[i]}
                  </span>
                </div>
                {i < arr.length - 1 && <div className="w-8 h-px" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }} />}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Step 1: Session Type */}
          {step === "type" && (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] text-ce-text-tertiary mb-1" style={{ fontFamily: "var(--font-body)" }}>What kind of session do you need?</p>
              {mentor.sessionTypes.map((type) => {
                const detail = SESSION_TYPE_DETAILS[type];
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => { setSelectedType(type); setSelectedDuration(detail.durations[0]); }}
                    className="w-full text-left rounded-xl p-4 cursor-pointer transition-all"
                    style={{ background: isSelected ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.025)", border: isSelected ? "1px solid rgba(var(--ce-lime-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: isSelected ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)", color: isSelected ? "var(--ce-lime)" : "var(--ce-text-tertiary)" }}>
                        {detail.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px]" style={{ color: isSelected ? "var(--ce-text-primary)" : "var(--ce-text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{type}</span>
                          {type === "Career Coaching" && mentor.priceModel !== "free" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.1)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>
                              ${mentor.price}/session
                            </span>
                          )}
                          {(type !== "Career Coaching" || mentor.priceModel === "free") && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>Free</span>
                          )}
                        </div>
                        <p className="text-[11px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{detail.desc}</p>
                        {isSelected && (
                          <div className="flex items-start gap-1.5 mt-2">
                            <SophiaMark size={12} glowing={false} />
                            <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>{detail.sophiaNote}</span>
                          </div>
                        )}
                        {isSelected && detail.durations.length > 1 && (
                          <div className="flex gap-2 mt-3">
                            {detail.durations.map(d => (
                              <button
                                key={d}
                                onClick={(e) => { e.stopPropagation(); setSelectedDuration(d); }}
                                className="px-3 py-1 rounded-lg text-[11px] cursor-pointer"
                                style={{ background: selectedDuration === d ? "rgba(var(--ce-lime-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)", border: selectedDuration === d ? "1px solid rgba(var(--ce-lime-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.06)", color: selectedDuration === d ? "var(--ce-lime)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                              >
                                {d} min
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-ce-lime flex-shrink-0 mt-0.5" />}
                    </div>
                  </button>
                );
              })}

              {/* Cancellation policy */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mt-1" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                <Shield className="w-3.5 h-3.5 text-ce-text-tertiary flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                  <span className="text-ce-text-secondary">Cancellation policy:</span> {CANCELLATION_LABELS[mentor.cancellationPolicy]}
                </span>
              </div>

              <button
                onClick={() => selectedType && setStep("time")}
                className="w-full py-3 rounded-xl text-[13px] mt-2 cursor-pointer transition-colors"
                style={{ background: selectedType ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.04)", color: selectedType ? "var(--ce-surface-0)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Time Picker */}
          {step === "time" && (
            <div className="flex flex-col gap-4">
              {/* View toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl self-start" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                {(["calendar", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalendarView(v)}
                    className="px-4 py-1.5 rounded-lg text-[12px] cursor-pointer transition-colors capitalize"
                    style={{ background: calendarView === v ? "rgba(var(--ce-glass-tint),0.06)" : "transparent", color: calendarView === v ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                  >
                    {v === "calendar" ? "Calendar" : "Quick List"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                <Globe className="w-3 h-3" />
                Times shown in your timezone ({userTz.replace(/_/g, " ")})
              </div>

              {/* Calendar View */}
              {calendarView === "calendar" && (
                <div className="flex gap-4">
                  {/* Calendar grid */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="cursor-pointer text-ce-text-tertiary hover:text-ce-text-primary transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                        {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                      <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="cursor-pointer text-ce-text-tertiary hover:text-ce-text-primary transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-1">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                        <div key={d} className="text-center text-[10px] text-ce-text-tertiary py-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{d}</div>
                      ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                        const hasSlots = availableDates.has(d.toDateString());
                        const isSelected = selectedDate?.toDateString() === d.toDateString();
                        const isPast = d < new Date(2026, 2, 19);
                        if (isPast) return (
                          <div key={day} className="aspect-square flex flex-col items-center justify-center">
                            <span className="text-[12px] text-[var(--ce-text-ghost)]" style={{ fontFamily: "var(--font-body)" }}>{day}</span>
                          </div>
                        );
                        return (
                          <button
                            key={day}
                            onClick={() => hasSlots && setSelectedDate(d)}
                            disabled={!hasSlots}
                            className="aspect-square flex flex-col items-center justify-center rounded-lg transition-all relative cursor-pointer"
                            style={{ background: isSelected ? "rgba(var(--ce-lime-rgb),0.15)" : hasSlots ? "rgba(var(--ce-glass-tint),0.02)" : "transparent", border: isSelected ? "1px solid rgba(var(--ce-lime-rgb),0.3)" : "1px solid transparent", cursor: hasSlots ? "pointer" : "default" }}
                          >
                            <span className="text-[12px]" style={{ color: isSelected ? "var(--ce-lime)" : hasSlots ? "var(--ce-text-primary)" : "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}>{day}</span>
                            {hasSlots && !isSelected && <div className="w-1 h-1 rounded-full bg-[var(--ce-lime)] mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots for selected date */}
                  {selectedDate && (
                    <div className="w-[180px] flex-shrink-0">
                      <span className="text-[11px] text-ce-text-secondary block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                        {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <div className="flex flex-col gap-2">
                        {slotsForDate.length === 0 && <p className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>No slots on this day</p>}
                        {slotsForDate.map((slot) => {
                          const isExpanded = expandedSlot === slot.id;
                          return (
                            <div key={slot.id}>
                              <button
                                onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}
                                className="w-full px-3 py-2 rounded-xl text-[12px] text-left cursor-pointer transition-all"
                                style={{ background: isExpanded ? "rgba(var(--ce-lime-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.03)", border: isExpanded ? "1px solid rgba(var(--ce-lime-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.06)", color: isExpanded ? "var(--ce-lime)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}
                              >
                                {slot.time}
                              </button>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-2 pb-1 px-1 flex flex-col gap-1.5">
                                      <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{slot.time}–{slot.endTime}</span>
                                      <button
                                        onClick={() => { setSelectedSlot(slot); isPaid ? setStep("payment") : setStep("confirm"); }}
                                        className="w-full py-1.5 rounded-lg text-[11px] cursor-pointer"
                                        style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                                      >
                                        Confirm
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {calendarView === "list" && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-ce-text-tertiary mb-1" style={{ fontFamily: "var(--font-body)" }}>Next available times</p>
                  {nextSlots.map((slot) => {
                    const isExpanded = expandedSlot === slot.id;
                    return (
                      <div key={slot.id}>
                        <button
                          onClick={() => { setExpandedSlot(isExpanded ? null : slot.id); setSelectedSlot(slot); }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all text-left"
                          style={{ background: isExpanded ? "rgba(var(--ce-lime-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.025)", border: isExpanded ? "1px solid rgba(var(--ce-lime-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                        >
                          <span className="text-[12px]" style={{ color: isExpanded ? "var(--ce-lime)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}>{slot.displayDate}</span>
                          <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{slot.time}</span>
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-center justify-between px-4 py-3 rounded-b-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", borderLeft: "1px solid rgba(var(--ce-lime-rgb),0.2)", borderRight: "1px solid rgba(var(--ce-lime-rgb),0.2)", borderBottom: "1px solid rgba(var(--ce-lime-rgb),0.2)" }}>
                                <div>
                                  <span className="text-[11px] text-ce-text-secondary block" style={{ fontFamily: "var(--font-body)" }}>{selectedType} · {selectedDuration} min</span>
                                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{slot.time}–{slot.endTime} · {mentor.timezoneDisplay}</span>
                                </div>
                                <button
                                  onClick={() => isPaid ? setStep("payment") : setStep("confirm")}
                                  className="px-4 py-1.5 rounded-lg text-[12px] cursor-pointer"
                                  style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                                >
                                  Confirm →
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => setStep("type")}
                className="text-[12px] text-ce-text-tertiary cursor-pointer flex items-center gap-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>
          )}

          {/* Step 3: Payment (paid sessions) */}
          {step === "payment" && (
            <div className="flex flex-col gap-4">
              {/* Session summary */}
              <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                <span className="text-[11px] text-ce-text-tertiary block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session Summary</span>
                {[
                  ["Mentor", mentor.name],
                  ["Session Type", selectedType || ""],
                  ["Duration", `${selectedDuration} minutes`],
                  ["Date & Time", selectedSlot ? `${selectedSlot.displayDate} · ${selectedSlot.time}` : "—"],
                  ["Your timezone", userTz.replace(/_/g, " ")],
                  [`${mentor.name.split(" ")[0]}'s timezone`, mentor.timezoneDisplay],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between mb-2">
                    <span className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{label}</span>
                    <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)", paddingTop: "12px", marginTop: "8px" }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Total</span>
                    <span className="text-[14px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>${price}</span>
                  </div>
                  <p className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                    {mentor.name.split(" ")[0]} earns ${mentor.earnings.toFixed(2)} · CareerEdge fee: ${mentor.commission.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Mock Stripe card form */}
              <div className="flex flex-col gap-3">
                <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Payment Details</span>
                <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                    <CreditCard className="w-4 h-4 text-ce-text-tertiary" />
                    <input readOnly value="4242 4242 4242 4242" className="flex-1 text-[13px] bg-transparent outline-none" style={{ color: "var(--ce-text-primary)", fontFamily: "var(--font-body)" }} />
                    <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>MOCK</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                      <input readOnly value="03/28" className="flex-1 text-[13px] bg-transparent outline-none" style={{ color: "var(--ce-text-primary)", fontFamily: "var(--font-body)" }} />
                    </div>
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                      <input readOnly value="123" className="flex-1 text-[13px] bg-transparent outline-none" style={{ color: "var(--ce-text-primary)", fontFamily: "var(--font-body)" }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-ce-text-tertiary" />
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Payments handled by Stripe. CareerEdge never stores card details.</span>
                </div>
              </div>

              {/* Revenue model options */}
              <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                <span className="text-[11px] text-ce-text-tertiary block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Subscription Option</span>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>Unlimited sessions with {mentor.name.split(" ")[0]}</span>
                    <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Best value if booking 3+ sessions/month</span>
                  </div>
                  <span className="text-[13px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>${mentor.subscriptionPrice}/mo</span>
                </div>
                <button className="text-[11px] text-ce-cyan cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Switch to subscription →</button>
              </div>

              <button
                onClick={() => setStep("confirm")}
                className="w-full py-3 rounded-xl text-[13px] cursor-pointer"
                style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Confirm & Pay ${price} →
              </button>
              <button onClick={() => setStep("time")} className="text-[12px] text-ce-text-tertiary cursor-pointer flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}>
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirm" && (
            <div className="flex flex-col items-center gap-5 py-4 relative">
              {/* Glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: "1px solid rgba(var(--ce-lime-rgb),0.3)", boxShadow: "0 0 40px rgba(var(--ce-lime-rgb),0.1)" }}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
              />

              {/* Animated checkmark */}
              <svg width="72" height="72" viewBox="0 0 72 72">
                <motion.circle
                  cx="36" cy="36" r="34"
                  fill="none" stroke="rgba(var(--ce-lime-rgb),0.15)" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.circle
                  cx="36" cy="36" r="34"
                  fill="none" stroke="var(--ce-lime)" strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="213" strokeDashoffset="213"
                  initial={{ strokeDashoffset: 213 }} animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.path
                  d="M22 36 L31 45 L50 27"
                  fill="none" stroke="var(--ce-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                />
              </svg>

              <motion.div className="text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.3 }}>
                <p className="text-[18px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session booked</p>
                <p className="text-[13px] text-ce-text-tertiary mt-1" style={{ fontFamily: "var(--font-body)" }}>with {mentor.name}</p>
              </motion.div>

              {/* Session details stagger */}
              <div className="w-full rounded-xl p-4 flex flex-col gap-2.5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                {[
                  [<Calendar key="c" className="w-3.5 h-3.5 text-ce-lime" />, selectedSlot?.displayDate || "Scheduled"],
                  [<Clock key="cl" className="w-3.5 h-3.5 text-ce-lime" />, `${selectedSlot?.time || "—"} (${userTz.replace(/_/g, " ")}) · ${selectedSlot?.time || "—"} (${mentor.timezoneDisplay})`],
                  [<Video key="v" className="w-3.5 h-3.5 text-ce-lime" />, `${selectedType} · ${selectedDuration} min`],
                  price > 0 ? [<DollarSign key="d" className="w-3.5 h-3.5 text-ce-lime" />, `$${price} charged`] : [<ThumbsUp key="t" className="w-3.5 h-3.5 text-ce-lime" />, "Free session"],
                ].map(([icon, label], i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                  >
                    {icon}
                    <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{label as string}</span>
                  </motion.div>
                ))}
              </div>

              {/* Sophia message */}
              <motion.div
                className="w-full flex items-start gap-2 px-4 py-3 rounded-xl"
                style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.05)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.35 }}
              >
                <SophiaMark size={14} glowing={false} />
                <p className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>
                  I'll send you a prep brief 2 hours before. A session thread has been created. See you there.
                </p>
              </motion.div>

              {/* Add to calendar */}
              <motion.div className="w-full relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                <button
                  onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer"
                  style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                >
                  <Download className="w-3.5 h-3.5" /> Add to Calendar <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {showCalendarDropdown && (
                    <motion.div
                      className="absolute bottom-10 left-0 right-0 rounded-xl overflow-hidden z-10"
                      style={{ background: "rgba(18,20,26,0.99)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    >
                      {["Google Calendar", "Apple Calendar", "Outlook (.ics)"].map((cal) => (
                        <button
                          key={cal}
                          onClick={() => { setCalendarAdded(cal); setShowCalendarDropdown(false); toast.success(`Added to ${cal}`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors"
                          style={{ borderBottom: cal !== "Outlook (.ics)" ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}
                        >
                          <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{cal}</span>
                          {calendarAdded === cal && <Check className="w-3.5 h-3.5 text-ce-lime ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Actions */}
              <motion.div className="w-full flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                <button
                  onClick={() => { onComplete(); toast.success("Session thread opened"); }}
                  className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer"
                  style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", color: "var(--ce-role-edgestar)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)", fontFamily: "var(--font-body)" }}
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" /> Go to session thread
                </button>
                <button
                  onClick={onComplete}
                  className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer"
                  style={{ background: "rgba(var(--ce-glass-tint),0.03)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}
                >
                  Back to Sessions
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EdgeStar View ────────────────────────────────────────────────────────────

type StarTab = "find" | "bookings" | "history" | "prep";

function EdgeStarView({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  const [tab, setTab] = useState<StarTab>("find");
  const [findView, setFindView] = useState<"picks" | "browse">("picks");
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [postSessionItem, setPostSessionItem] = useState<SessionHistoryItem | null>(null);

  const awaitingRating = SESSION_HISTORY.find(h => h.awaitingRating);
  const prepSession = UPCOMING_SESSIONS.find(s => s.status === "in_2_hours");

  const isPreneur = role === "edgepreneur";

  const sophiaOverride = {
    message: prepSession
      ? `Your session with ${prepSession.mentorName} starts in 2 hours — want to review your prep brief?`
      : "3 mentor recommendations ready based on your roadmap progress",
    chips: prepSession
      ? [{ label: "View prep brief", action: "sessions" }, { label: "Open session thread", action: "messages" }]
      : [{ label: "See Sophia's picks", action: "sessions" }, { label: "Browse all", action: "sessions" }],
  };

  const tabItems: { id: StarTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "find", label: isPreneur ? "Find Advisors" : "Find Mentors", icon: <Search className="w-3.5 h-3.5" /> },
    { id: "bookings", label: "My Bookings", icon: <Calendar className="w-3.5 h-3.5" />, badge: UPCOMING_SESSIONS.length },
    { id: "history", label: "History", icon: <BarChart3 className="w-3.5 h-3.5" />, badge: awaitingRating ? 1 : undefined },
    { id: "prep", label: "Prep Hub", icon: <BookOpen className="w-3.5 h-3.5" />, badge: prepSession ? 1 : undefined },
  ];

  return (
    <RoleShell
      role={role}
      userName={isPreneur ? "Sam Rivera" : "Jordan Kim"}
      userInitial={isPreneur ? "SR" : "JK"}
      edgeGas={47}
      onNavigate={onNavigate}
      sophiaOverride={sophiaOverride}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Page header */}
        <motion.div className="pt-6 pb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35, ease: EASE }}>
          <h1 className="text-[22px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Sessions
          </h1>
          <p className="text-[13px] text-ce-text-tertiary mt-1" style={{ fontFamily: "var(--font-body)" }}>
            {isPreneur ? "Connect with advisors who can accelerate your venture." : "Connect with mentors who've been where you're heading."}
          </p>
        </motion.div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl self-start" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", width: "fit-content" }}>
          {tabItems.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-colors text-[12px]"
              style={{ background: tab === t.id ? "rgba(var(--ce-glass-tint),0.06)" : "transparent", color: tab === t.id ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
            >
              {t.icon}
              {t.label}
              {t.badge && (
                <span className="text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: t.id === "history" ? "rgba(var(--ce-role-edgepreneur-rgb),0.2)" : "rgba(var(--ce-role-edgestar-rgb),0.12)", color: t.id === "history" ? "var(--ce-role-edgepreneur)" : "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {/* Find */}
          {tab === "find" && (
            <motion.div key="find" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {/* Picks / Browse toggle */}
              <div className="flex items-center gap-1 mb-5 p-1 rounded-xl self-start" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", width: "fit-content" }}>
                {(["picks", "browse"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setFindView(v)}
                    className="px-4 py-1.5 rounded-lg text-[12px] cursor-pointer transition-colors"
                    style={{ background: findView === v ? "rgba(var(--ce-glass-tint),0.06)" : "transparent", color: findView === v ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                  >
                    {v === "picks" ? "Sophia's Picks" : "Browse All"}
                  </button>
                ))}
              </div>

              {findView === "picks" && <SophiaPicksSection onBook={setBookingMentor} />}
              {findView === "browse" && <MentorBrowseSection onBook={setBookingMentor} />}
            </motion.div>
          )}

          {/* My Bookings */}
          {tab === "bookings" && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-6">
                <UpcomingSessionsStrip sessions={UPCOMING_SESSIONS} onOpenThread={() => onNavigate?.("messages")} />
                {/* CTA if no sessions */}
                <GlassCard delay={0.3}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", border: "1px solid rgba(var(--ce-lime-rgb),0.12)" }}>
                      <Plus className="w-5 h-5 text-ce-lime" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Book another session</span>
                      <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Sophia has 4 mentor recommendations based on your current roadmap phase</span>
                    </div>
                    <button onClick={() => { setTab("find"); setFindView("picks"); }} className="px-4 py-2 rounded-lg text-[12px] cursor-pointer" style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Find mentors →
                    </button>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* History */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {awaitingRating && (
                <motion.div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 cursor-pointer" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.15)" }}
                  onClick={() => setPostSessionItem(awaitingRating)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Star className="w-4 h-4 text-[var(--ce-role-edgepreneur)]" />
                  <span className="text-[12px] text-[var(--ce-role-edgepreneur)]" style={{ fontFamily: "var(--font-body)" }}>
                    Your session with James Okafor is waiting for a rating →
                  </span>
                </motion.div>
              )}
              <SessionHistoryList items={SESSION_HISTORY} onRateSession={setPostSessionItem} />
            </motion.div>
          )}

          {/* Prep Hub */}
          {tab === "prep" && (
            <motion.div key="prep" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-4">
                {prepSession ? (
                  <>
                    <p className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Active prep briefs for your upcoming sessions</p>
                    <PrepBriefCard session={prepSession} />
                  </>
                ) : (
                  <SophiaInsight
                    message="No upcoming sessions in the next 2 hours. Prep briefs appear here automatically 2 hours before each session — Sophia generates them based on your roadmap progress."
                    actionLabel="Book a session"
                    onAction={() => { setTab("find"); setFindView("picks"); }}
                    delay={0.2}
                  />
                )}

                {/* Pending Sophia actions */}
                {SESSION_HISTORY.filter(h => !h.tasksAdded && !h.awaitingRating).length > 0 && (
                  <div>
                    <span className="text-[11px] text-ce-text-tertiary mb-3 block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia follow-ups</span>
                    <div className="flex flex-col gap-2">
                      {SESSION_HISTORY.filter(h => !h.tasksAdded).map((h) => (
                        <div key={h.id} className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
                          <SophiaMark size={14} glowing={false} />
                          <div>
                            <p className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>{h.sophiaFollowUp}</p>
                            <div className="flex gap-2 mt-2">
                              <button className="text-[10px] text-ce-lime px-2.5 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-lime-rgb),0.08)", border: "1px solid rgba(var(--ce-lime-rgb),0.15)", fontFamily: "var(--font-body)" }}>Add to roadmap →</button>
                              <button className="text-[10px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Dismiss</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingMentor && (
          <BookingModal
            mentor={bookingMentor}
            onClose={() => setBookingMentor(null)}
            onComplete={() => { setBookingMentor(null); toast.success("Session booked! Thread created."); onNavigate?.("messages"); }}
          />
        )}
      </AnimatePresence>

      {/* Post-session Modal */}
      <AnimatePresence>
        {postSessionItem && (
          <PostSessionModal item={postSessionItem} onClose={() => setPostSessionItem(null)} />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}

// ─── EdgeGuide: Earnings Card ─────────────────────────────────────────────────

function EarningsCard() {
  const [revenueTab, setRevenueTab] = useState<"per_session" | "subscription" | "commission">("per_session");
  return (
    <div className="flex flex-col gap-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "This Month", value: "$1,240", trend: "+18% vs last month", color: "var(--ce-lime)" },
          { label: "All Time", value: "$8,920", trend: "156 sessions", color: "var(--ce-role-edgestar)" },
          { label: "Avg. Per Session", value: "$63.75", trend: "after 15% fee", color: "var(--ce-role-guide)" },
          { label: "Avg. Rating", value: "4.9", trend: "23 reviews", color: "var(--ce-role-edgepreneur)" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.35, ease: EASE }}>
            <div className="text-[24px] tabular-nums" style={{ color: kpi.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{kpi.value}</div>
            <div className="text-[11px] text-ce-text-tertiary mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{kpi.label}</div>
            <div className="text-[10px] mt-1" style={{ color: kpi.color, fontFamily: "var(--font-body)" }}>{kpi.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Payout status */}
      <GlassCard delay={0.4}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.08)" }}>
              <Zap className="w-4 h-4 text-ce-lime" />
            </div>
            <div>
              <span className="text-[13px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Next payout: March 31</span>
              <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>$620 pending · Stripe connected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--ce-lime)]" />
            <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>Active</span>
          </div>
        </div>
      </GlassCard>

      {/* Revenue model tabs */}
      <GlassCard delay={0.5}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[var(--ce-role-guide)]" />
          <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Revenue Model</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full text-ce-text-secondary" style={{ background: "rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>Choose your model</span>
        </div>
        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          {[
            { id: "per_session" as const, label: "Per Session" },
            { id: "subscription" as const, label: "Subscription" },
            { id: "commission" as const, label: "Commission" },
          ].map((t) => (
            <button key={t.id} onClick={() => setRevenueTab(t.id)}
              className="flex-1 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors"
              style={{ background: revenueTab === t.id ? "rgba(var(--ce-glass-tint),0.06)" : "transparent", color: revenueTab === t.id ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {revenueTab === "per_session" && (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Clients pay a fixed rate per session. You set the price; CareerEdge takes a 15% platform fee.</p>
            <div className="flex items-center justify-between py-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Session price (you set)</span>
              <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>$75</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>CareerEdge fee (15%)</span>
              <span className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>−$11.25</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>You earn</span>
              <span className="text-[14px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>$63.75</span>
            </div>
          </div>
        )}

        {revenueTab === "subscription" && (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Clients subscribe for unlimited sessions with you per month. Predictable recurring revenue.</p>
            <div className="flex items-center justify-between py-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Monthly subscription price</span>
              <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>$199/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>CareerEdge fee (12%)</span>
              <span className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>−$23.88</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>You earn</span>
              <span className="text-[14px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>$175.12/mo per client</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-body)" }}>Active subscribers: 3</span>
              <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>= $525.36/mo guaranteed</span>
            </div>
          </div>
        )}

        {revenueTab === "commission" && (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Earn a commission when your mentees land jobs at target companies. Aligned incentives — you win when they win.</p>
            <div className="rounded-xl p-3" style={{ background: "rgba(var(--ce-lime-rgb),0.04)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)" }}>
              <span className="text-[11px] text-ce-lime block mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>How it works</span>
              <ul className="flex flex-col gap-1">
                {["Mentee lands job at a partner employer", "CareerEdge shares placement data", "Guide earns 2% of first-year salary (avg. $2,800)"].map((s, i) => (
                  <li key={i} className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-[var(--ce-lime)] mt-1.5 flex-shrink-0" /><span className="text-[10px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[12px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>Active mentees on commission track</span>
              <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>4</span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Session earnings breakdown */}
      <GlassCard delay={0.6}>
        <span className="text-[12px] text-ce-text-secondary block mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Recent Earnings</span>
        <div className="flex flex-col gap-2">
          {GUIDE_UPCOMING.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between py-2" style={{ borderBottom: i < GUIDE_UPCOMING.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "none" }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${s.bookerColor}12` }}>
                  <span className="text-[10px]" style={{ color: s.bookerColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.bookerInitials}</span>
                </div>
                <div>
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{s.bookerName}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{s.sessionType} · {s.date}</span>
                </div>
              </div>
              {s.earnings > 0 ? (
                <span className="text-[13px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>+${s.earnings.toFixed(2)}</span>
              ) : (
                <span className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Volunteer</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── EdgeGuide: Week Calendar / Availability Editor ───────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am-8pm

type BlockType = "available" | "booked" | "break" | "none";

interface AvailBlock {
  day: number;
  start: number;
  end: number;
  type: "available" | "booked";
  client?: string;
}

function WeekCalendar({ onEdit }: { onEdit: () => void }) {
  const [blocks, setBlocks] = useState<AvailBlock[]>(GUIDE_AVAILABILITY);
  const [editingBlock, setEditingBlock] = useState<AvailBlock | null>(null);

  const getBlockForCell = (day: number, hour: number): AvailBlock | null => {
    return blocks.find(b => b.day === day && hour >= b.start && hour < b.end) || null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Week of March 18, 2026</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(var(--ce-lime-rgb),0.25)" }} /> Available</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(var(--ce-role-guide-rgb),0.3)" }} /> Booked</div>
          </div>
          <button onClick={onEdit} className="text-[11px] text-ce-cyan px-2.5 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)", fontFamily: "var(--font-body)" }}>
            Edit Availability
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Day headers */}
          <div className="grid gap-px mb-px" style={{ gridTemplateColumns: "52px repeat(7, 1fr)" }}>
            <div />
            {DAYS.map((d, i) => (
              <div key={d} className="text-center py-2">
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{d}</span>
                <div className="text-[13px] text-ce-text-primary mt-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{18 + i}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
            {HOURS.map((hour) => (
              <div key={hour} className="grid gap-px" style={{ gridTemplateColumns: "52px repeat(7, 1fr)" }}>
                <div className="flex items-center justify-end pr-2 text-[9px] text-[var(--ce-text-quaternary)] py-2" style={{ fontFamily: "var(--font-body)" }}>
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                {DAYS.map((_, dayIdx) => {
                  const block = getBlockForCell(dayIdx, hour);
                  return (
                    <button
                      key={dayIdx}
                      className="h-8 relative transition-colors cursor-pointer"
                      style={{
                        background: block?.type === "booked" ? "rgba(var(--ce-role-guide-rgb),0.25)" : block?.type === "available" ? "rgba(var(--ce-lime-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.01)",
                        borderTop: "1px solid rgba(var(--ce-glass-tint),0.03)",
                        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.03)",
                      }}
                      onClick={() => block && setEditingBlock(block)}
                    >
                      {block?.client && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-[var(--ce-role-guide)]" style={{ fontFamily: "var(--font-body)" }}>
                          {block.client}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block detail */}
      <AnimatePresence>
        {editingBlock && (
          <motion.div
            className="mt-4 rounded-xl p-4"
            style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: editingBlock.type === "booked" ? "1px solid rgba(var(--ce-role-guide-rgb),0.2)" : "1px solid rgba(var(--ce-lime-rgb),0.15)" }}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {DAYS[editingBlock.day]}, {editingBlock.start > 12 ? editingBlock.start - 12 : editingBlock.start}{editingBlock.start >= 12 ? "PM" : "AM"} – {editingBlock.end > 12 ? editingBlock.end - 12 : editingBlock.end}{editingBlock.end >= 12 ? "PM" : "AM"}
              </span>
              <button onClick={() => setEditingBlock(null)} className="text-ce-text-tertiary cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            {editingBlock.type === "booked" ? (
              <div>
                <span className="text-[12px] text-[var(--ce-role-guide)] block mb-2" style={{ fontFamily: "var(--font-body)" }}>Booked — {editingBlock.client}</span>
                <div className="flex gap-2">
                  <button className="text-[11px] text-ce-text-secondary px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>View session thread</button>
                  <button className="text-[11px] text-[var(--ce-status-error)] px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-status-error-rgb),0.06)", border: "1px solid rgba(var(--ce-status-error-rgb),0.12)", fontFamily: "var(--font-body)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setBlocks(prev => prev.filter(b => b !== editingBlock))} className="text-[11px] text-[var(--ce-status-error)] px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-status-error-rgb),0.06)", border: "1px solid rgba(var(--ce-status-error-rgb),0.12)", fontFamily: "var(--font-body)" }}>Remove block</button>
                <button onClick={() => setEditingBlock(null)} className="text-[11px] text-ce-text-secondary px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>Done</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── EdgeGuide: Availability Editor (Settings) ───────────────────────────────

export function AvailabilityEditor({ onClose }: { onClose: () => void }) {
  const [policy, setPolicy] = useState<CancellationPolicy>("moderate");
  const [repeatWeekly, setRepeatWeekly] = useState(true);
  const [maxPerDay, setMaxPerDay] = useState(4);
  const [enabledTypes, setEnabledTypes] = useState<SessionType[]>(["1:1 Mentoring", "Career Coaching", "Mock Interview"]);
  const [prices, setPrices] = useState<Record<string, number>>({ "1:1 Mentoring": 75, "Career Coaching": 100, "Mock Interview": 0 });

  const toggleType = (t: SessionType) => {
    setEnabledTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const allTypes: SessionType[] = ["1:1 Mentoring", "Career Coaching", "Mock Interview", "Group Workshop", "Office Hours"];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: "rgba(var(--ce-shadow-tint),0.6)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-[560px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(12,14,18,0.99)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", maxHeight: "85vh", overflowY: "auto" }}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
          <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Availability Settings</span>
          <button onClick={onClose} className="text-ce-text-tertiary cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Session types & pricing */}
          <div>
            <span className="text-[12px] text-ce-text-secondary block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session Types You Offer</span>
            <div className="flex flex-col gap-2">
              {allTypes.map((type) => {
                const enabled = enabledTypes.includes(type);
                return (
                  <div key={type} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: enabled ? "rgba(var(--ce-lime-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.02)", border: enabled ? "1px solid rgba(var(--ce-lime-rgb),0.12)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                    <button onClick={() => toggleType(type)} className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 cursor-pointer" style={{ background: enabled ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.06)", border: enabled ? "none" : "1px solid rgba(var(--ce-glass-tint),0.1)" }}>
                      {enabled && <Check className="w-3 h-3 text-[var(--ce-surface-0)]" />}
                    </button>
                    <span className="flex-1 text-[12px]" style={{ color: enabled ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>{type}</span>
                    {enabled && type !== "Office Hours" && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-ce-text-tertiary" />
                        <input
                          type="number"
                          value={prices[type] || 0}
                          onChange={e => setPrices(p => ({ ...p, [type]: Number(e.target.value) }))}
                          className="w-16 text-[12px] text-right bg-transparent outline-none"
                          style={{ color: "var(--ce-text-primary)", fontFamily: "var(--font-body)", border: "none" }}
                        />
                        <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>/session</span>
                      </div>
                    )}
                    {enabled && type === "Office Hours" && (
                      <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>Free / Drop-in</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Max sessions per day */}
          <div>
            <span className="text-[12px] text-ce-text-secondary block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Max sessions per day</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setMaxPerDay(Math.max(1, maxPerDay - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <span className="text-ce-text-primary">−</span>
              </button>
              <span className="text-[20px] text-ce-text-primary tabular-nums w-8 text-center" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{maxPerDay}</span>
              <button onClick={() => setMaxPerDay(Math.min(10, maxPerDay + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <span className="text-ce-text-primary">+</span>
              </button>
            </div>
          </div>

          {/* Repeat weekly */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Repeat weekly</span>
              <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Your availability blocks repeat every week automatically</span>
            </div>
            <button
              onClick={() => setRepeatWeekly(!repeatWeekly)}
              className="w-12 h-6 rounded-full relative transition-colors cursor-pointer"
              style={{ background: repeatWeekly ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.1)" }}
            >
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: repeatWeekly ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>

          {/* Cancellation policy */}
          <div>
            <span className="text-[12px] text-ce-text-secondary block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Cancellation Policy</span>
            <div className="flex flex-col gap-2">
              {(["flexible", "moderate", "strict"] as CancellationPolicy[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPolicy(p)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-left"
                  style={{ background: policy === p ? "rgba(var(--ce-lime-rgb),0.05)" : "rgba(var(--ce-glass-tint),0.02)", border: policy === p ? "1px solid rgba(var(--ce-lime-rgb),0.15)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                >
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: policy === p ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.2)" }}>
                    {policy === p && <div className="w-2 h-2 rounded-full bg-[var(--ce-lime)]" />}
                  </div>
                  <div>
                    <span className="text-[12px] capitalize" style={{ color: policy === p ? "var(--ce-text-primary)" : "var(--ce-text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{p}</span>
                    <span className="text-[10px] text-ce-text-tertiary block" style={{ fontFamily: "var(--font-body)" }}>{CANCELLATION_LABELS[p]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { onClose(); toast.success("Availability settings saved"); }}
            className="w-full py-3 rounded-xl text-[13px] cursor-pointer"
            style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EdgeGuide: Upcoming Sessions ────────────────────────────────────────────

function GuideUpcomingList() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {GUIDE_UPCOMING.map((s, i) => (
        <motion.div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: s.status === "in_2_hours" ? "rgba(var(--ce-lime-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.025)", border: s.status === "in_2_hours" ? "1px solid rgba(var(--ce-lime-rgb),0.12)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.35, ease: EASE }}>
          <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} className="w-full flex items-center gap-4 px-5 py-4 cursor-pointer text-left">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${s.bookerColor}15`, border: `1px solid ${s.bookerColor}25` }}>
              <span className="text-[12px]" style={{ color: s.bookerColor, fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.bookerInitials}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{s.bookerName}</span>
                <SessionTypeBadge type={s.sessionType} />
                {s.status === "in_2_hours" && (
                  <span className="text-[10px] text-ce-lime flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--ce-lime)]" /> Starting in 2h
                  </span>
                )}
              </div>
              <span className="text-[11px] text-ce-text-tertiary mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{s.date} · {s.time} · {s.duration} min {s.earnings > 0 && `· +$${s.earnings.toFixed(2)}`}</span>
            </div>
            {expanded === s.id ? <ChevronUp className="w-4 h-4 text-ce-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-ce-text-tertiary" />}
          </button>

          <AnimatePresence>
            {expanded === s.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                style={{ overflow: "hidden", borderTop: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.05)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}>
                    <SophiaMark size={14} glowing={false} />
                    <p className="text-[11px] text-ce-cyan leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.sophiaContext}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] cursor-pointer" style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      <Video className="w-3 h-3" /> Join Call
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", color: "var(--ce-role-edgestar)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)", fontFamily: "var(--font-body)" }}>
                      <MessageSquare className="w-3 h-3" /> Open thread
                    </button>
                    <button className="px-3 py-2 rounded-lg text-[12px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Reschedule</button>
                    <button className="px-3 py-2 rounded-lg text-[12px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ─── EdgeGuide View ───────────────────────────────────────────────────────────

type GuideTab = "availability" | "sessions" | "history" | "earnings";

function EdgeGuideView({ onNavigate }: { onNavigate?: NavigateFn }) {
  const [tab, setTab] = useState<GuideTab>("sessions");
  const [availEditorOpen, setAvailEditorOpen] = useState(false);
  const [hasAvailability, setHasAvailability] = useState(true); // false = empty state

  const sophiaOverride = {
    message: "Sharon's session starts in 2 hours — she completed her case study milestone yesterday",
    chips: [{ label: "View session prep", action: "sessions" }, { label: "Open Sharon's thread", action: "messages" }],
  };

  const tabItems: { id: GuideTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "availability", label: "Availability", icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: "sessions", label: "Sessions", icon: <Users className="w-3.5 h-3.5" />, badge: GUIDE_UPCOMING.filter(s => s.status === "in_2_hours").length },
    { id: "history", label: "History", icon: <BarChart3 className="w-3.5 h-3.5" />, badge: 2 },
    { id: "earnings", label: "Earnings", icon: <DollarSign className="w-3.5 h-3.5" /> },
  ];

  return (
    <RoleShell role="guide" userName="Alice Chen" userInitial="AC" edgeGas={62} onNavigate={onNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div className="pt-6 pb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35, ease: EASE }}>
          <h1 className="text-[22px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sessions</h1>
          <p className="text-[13px] text-ce-text-tertiary mt-1" style={{ fontFamily: "var(--font-body)" }}>3 sessions today · 2 task reviews pending</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", width: "fit-content" }}>
          {tabItems.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer text-[12px]"
              style={{ background: tab === t.id ? "rgba(var(--ce-glass-tint),0.06)" : "transparent", color: tab === t.id ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
              {t.icon} {t.label}
              {t.badge ? (
                <span className="text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-guide-rgb),0.2)", color: "var(--ce-role-guide)", fontFamily: "var(--font-body)" }}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Availability */}
          {tab === "availability" && (
            <motion.div key="avail" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {!hasAvailability ? (
                <SophiaInsight
                  message="Set your first available time to start accepting bookings. You'll be matched with users whose goals align with your expertise. Your profile preview will appear to potential bookers once you're set up."
                  actionLabel="Set up availability →"
                  onAction={() => { setAvailEditorOpen(true); setHasAvailability(true); }}
                  delay={0.2}
                />
              ) : (
                <GlassCard delay={0.2}>
                  <WeekCalendar onEdit={() => setAvailEditorOpen(true)} />
                </GlassCard>
              )}

              {/* Session type config below calendar */}
              {hasAvailability && (
                <GlassCard delay={0.4} className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Session Configuration</span>
                    <button onClick={() => setAvailEditorOpen(true)} className="text-[11px] text-ce-cyan cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Edit →</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["1:1 Mentoring — $75", "Career Coaching — $100", "Mock Interview — Free"].map((t) => (
                      <span key={t} className="text-[11px] px-3 py-1.5 rounded-lg" style={{ background: "rgba(var(--ce-lime-rgb),0.06)", color: "var(--ce-lime)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)", fontFamily: "var(--font-body)" }}>{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                    <div className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Moderate cancellation policy</div>
                    <div className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Repeats weekly</div>
                    <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Max 4 sessions/day</div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {/* Sessions */}
          {tab === "sessions" && (
            <motion.div key="sessions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <GuideUpcomingList />
            </motion.div>
          )}

          {/* History */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <motion.div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 cursor-pointer" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.05)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.15)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Bell className="w-4 h-4 text-[var(--ce-role-edgepreneur)]" />
                <span className="text-[12px] text-[var(--ce-role-edgepreneur)]" style={{ fontFamily: "var(--font-body)" }}>2 sessions need your feedback — Sharon and Marcus are waiting for your notes.</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <SophiaMark size={12} glowing={false} />
                  <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Sophia: "Want to knock those out?"</span>
                </div>
              </motion.div>

              {/* Completed sessions for guide */}
              <div className="flex flex-col gap-3">
                {[
                  { name: "Priya Sharma", initials: "PS", color: "var(--ce-role-guide)", type: "Career Coaching" as SessionType, date: "March 10", duration: 60, rating: 5, earnings: 85, notes: "Covered international opportunity mapping. Client made excellent progress on Phase 2 milestone." },
                  { name: "Marcus Rivera", initials: "MR", color: "var(--ce-lime)", type: "Mock Interview" as SessionType, date: "March 5", duration: 30, rating: 4, earnings: 0, notes: "", awaitingFeedback: true },
                  { name: "Sharon Lee", initials: "SL", color: "var(--ce-role-edgestar)", type: "1:1 Mentoring" as SessionType, date: "March 1", duration: 60, rating: 5, earnings: 63.75, notes: "Portfolio review. Sharon is on track for Phase 3 transition by end of month.", awaitingFeedback: true },
                ].map((s, i) => (
                  <motion.div key={i} className="rounded-2xl p-5" style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: s.awaitingFeedback ? "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.15)" : "1px solid rgba(var(--ce-glass-tint),0.05)" }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: EASE }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${s.color}15` }}>
                        <span className="text-[11px]" style={{ color: s.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.initials}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{s.name}</span>
                          <SessionTypeBadge type={s.type} />
                          {s.awaitingFeedback && <span className="text-[10px] text-[var(--ce-role-edgepreneur)] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.1)", fontFamily: "var(--font-body)" }}>Needs notes</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{s.date} · {s.duration} min</span>
                          {s.earnings > 0 && <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>· +${s.earnings.toFixed(2)}</span>}
                        </div>
                      </div>
                      <StarRating value={s.rating} size={12} />
                    </div>
                    {s.notes ? (
                      <p className="text-[11px] text-ce-text-tertiary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.notes}</p>
                    ) : (
                      <button className="w-full py-2 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.06)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.12)", color: "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>
                        Add session notes →
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Earnings */}
          {tab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <EarningsCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Availability Editor Modal */}
      <AnimatePresence>
        {availEditorOpen && <AvailabilityEditor onClose={() => setAvailEditorOpen(false)} />}
      </AnimatePresence>
    </RoleShell>
  );
}

// ─── Other Roles View ─────────────────────────────────────────────────────────

const OTHER_ROLE_CONFIG: Record<string, { title: string; subtitle: string; cta: string; sessions: string[] }> = {
  employer: {
    title: "Interview Scheduling",
    subtitle: "Schedule and manage candidate interviews with your hiring team.",
    cta: "Schedule Interview",
    sessions: ["Video Interview — Sarah K. · Product Designer · Tomorrow 2:00 PM", "Panel Interview — Marcus J. · SWE · March 25, 10:00 AM", "Final Round — Priya S. · Data Analyst · March 28, 3:00 PM"],
  },
  edu: {
    title: "Office Hours & Events",
    subtitle: "Manage office hours, career fairs, and employer engagement sessions.",
    cta: "Create Office Hours",
    sessions: ["Spring Career Fair · March 25 · 10:00 AM–4:00 PM", "Mock Interview Day · March 22 · 9:00 AM", "Employer Panel: Tech Industry · March 20 · 2:00 PM"],
  },
  ngo: {
    title: "Community Event Scheduling",
    subtitle: "Schedule workshops, webinars, and community sessions for program participants.",
    cta: "Create Event",
    sessions: ["Job Readiness Workshop · March 20 · 10:00 AM", "Resume Review Drop-in · March 22 · 2:00 PM", "Employer Partner Webinar · March 25 · 1:00 PM"],
  },
  agency: {
    title: "Workforce Program Sessions",
    subtitle: "Schedule training sessions, placement assessments, and stakeholder meetings.",
    cta: "Schedule Session",
    sessions: ["Cohort 12 Assessment · March 19 · 9:00 AM", "Employer Partner Briefing · March 21 · 3:00 PM", "Grant Compliance Review · March 24 · 11:00 AM"],
  },
};

function OtherRolesView({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  const config = OTHER_ROLE_CONFIG[role] || OTHER_ROLE_CONFIG.employer;
  return (
    <RoleShell role={role} userName="Alex M." userInitial="AM" edgeGas={35} onNavigate={onNavigate}>
      <div className="max-w-[900px] mx-auto">
        <motion.div className="pt-6 pb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35, ease: EASE }}>
          <h1 className="text-[22px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{config.title}</h1>
          <p className="text-[13px] text-ce-text-tertiary mt-1" style={{ fontFamily: "var(--font-body)" }}>{config.subtitle}</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <GlassCard delay={0.2} gradient>
            <div className="flex items-center gap-2 mb-4">
              <SophiaMark size={16} glowing={false} />
              <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
            </div>
            <p className="text-[13px] text-ce-text-secondary mb-4" style={{ fontFamily: "var(--font-body)" }}>
              You have 3 sessions scheduled this week. No conflicts detected. One session starts in 4 hours.
            </p>
            <button onClick={() => toast.success("Creating new session…")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer" style={{ background: "var(--ce-lime)", color: "var(--ce-surface-0)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
              <Plus className="w-4 h-4" /> {config.cta}
            </button>
          </GlassCard>

          <GlassCard delay={0.35}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-ce-lime" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Upcoming</span>
            </div>
            <div className="flex flex-col gap-2">
              {config.sessions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: i === 0 ? "var(--ce-lime)" : "var(--ce-text-tertiary)" }} />
                  <span className="text-[12px] text-ce-text-secondary flex-1" style={{ fontFamily: "var(--font-body)" }}>{s}</span>
                  <div className="flex gap-2">
                    <button className="text-[10px] text-ce-cyan px-2 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", fontFamily: "var(--font-body)" }}>Details</button>
                    <button className="text-[10px] text-ce-text-tertiary px-2 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", fontFamily: "var(--font-body)" }}>Reschedule</button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </RoleShell>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function Sessions({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  if (role === "guide") return <EdgeGuideView onNavigate={onNavigate} />;
  if (role === "edgestar" || role === "edgepreneur") return <EdgeStarView role={role} onNavigate={onNavigate} />;
  return <OtherRolesView role={role} onNavigate={onNavigate} />;
}
