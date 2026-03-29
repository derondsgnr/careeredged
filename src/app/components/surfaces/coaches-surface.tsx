/**
 * EdgeCoach & Mentor — Coach/Mentor Discovery Marketplace
 *
 * Discovery layer where EdgeStar, EdgePreneur, Parent, and Edu users
 * browse coaches/mentors, read profiles & reviews, compare, and link
 * through to Sessions to book.
 *
 * States: Empty → Building (Sophia-guided, 2 questions) → Active (3 tabs)
 * Route: /:role/coaches
 * Roles: EdgeStar, EdgePreneur, Parent, Edu
 *
 * Distinct from Sessions (/:role/sessions) which handles actual booking,
 * availability, and session management. This surface is the browsing/
 * discovery front-door.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "react-router";
import { EASE } from "../tokens";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import type { RoleId } from "../role-shell";
import {
  Users, Star, Search, Filter, ChevronRight, X, ArrowRight,
  Heart, MessageSquare, Calendar, Clock, Globe, Award,
  Sparkles, Shield, BookOpen, Video, Mic, DollarSign,
  Check, Send, ThumbsUp, MapPin, ChevronDown,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────

type Specialty = "Product Management" | "UX Design" | "Engineering" | "Data Science" | "Career Transitions" | "Interview Prep" | "Leadership" | "International Mobility";
type SessionType = "1:1 Mentoring" | "Mock Interview" | "Career Coaching" | "Group Workshop" | "Office Hours";

interface Review {
  id: string;
  author: string;
  authorInitials: string;
  rating: number;
  date: string;
  text: string;
  sessionType: SessionType;
}

interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  initials: string;
  color: string;
  specialties: Specialty[];
  sessionTypes: SessionType[];
  price: number;
  isFree: boolean;
  rating: number;
  reviewCount: number;
  sessionCount: number;
  nextAvailable: string;
  timezone: string;
  languages: string[];
  matchScore: number;
  matchReason: string;
  reviews: Review[];
  badges: string[];
  yearsExperience: number;
  saved: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────

const MOCK_COACHES: Coach[] = [
  {
    id: "c1", name: "Alice Chen", title: "Product Lead at Stripe",
    bio: "10 years in product at Stripe, Notion, and early-stage startups. I help career changers break into PM roles through structured roadmaps and interview prep. My approach focuses on real deliverables — by the end of our sessions, you'll have a portfolio-ready case study and a clear 90-day plan.",
    initials: "AC", color: "var(--ce-role-edgestar)",
    specialties: ["Product Management", "Career Transitions", "Interview Prep"],
    sessionTypes: ["1:1 Mentoring", "Career Coaching", "Mock Interview"],
    price: 75, isFree: false, rating: 4.9, reviewCount: 23, sessionCount: 156,
    nextAvailable: "Tomorrow, 2:00 PM", timezone: "EST (UTC-5)", languages: ["English", "Mandarin"],
    matchScore: 97, matchReason: "Specializes in PM transitions — your target role. Guided 23 people through this exact career shift.",
    badges: ["Top Rated", "Fast Responder"],
    yearsExperience: 10, saved: false,
    reviews: [
      { id: "r1", author: "Sarah K.", authorInitials: "SK", rating: 5, date: "2 weeks ago", text: "Alice completely changed my approach to PM interviews. After 3 sessions, I landed offers from two top-tier companies.", sessionType: "Mock Interview" },
      { id: "r2", author: "David L.", authorInitials: "DL", rating: 5, date: "1 month ago", text: "The roadmap Alice built with me was incredibly detailed. She doesn't just give advice — she helps you execute.", sessionType: "Career Coaching" },
      { id: "r3", author: "Mia T.", authorInitials: "MT", rating: 4, date: "2 months ago", text: "Great at breaking down complex PM concepts. Wish sessions were a bit longer but the value per minute is unmatched.", sessionType: "1:1 Mentoring" },
    ],
  },
  {
    id: "c2", name: "Marcus Johnson", title: "Senior UX Designer at Figma",
    bio: "Design systems architect by day, volunteer mentor on CareerEdge. I love helping people build portfolios that actually land jobs at top-tier design shops. My sessions focus on portfolio reviews, case study structure, and the design thinking that interviewers actually look for.",
    initials: "MJ", color: "var(--ce-lime)",
    specialties: ["UX Design", "Interview Prep", "Career Transitions"],
    sessionTypes: ["1:1 Mentoring", "Mock Interview", "Group Workshop"],
    price: 0, isFree: true, rating: 4.7, reviewCount: 45, sessionCount: 89,
    nextAvailable: "Today, 5:00 PM", timezone: "PST (UTC-8)", languages: ["English"],
    matchScore: 92, matchReason: "Your UX skills gap — Marcus has guided 12 transitions like yours and knows exactly what portfolio reviewers look for.",
    badges: ["Volunteer", "Most Sessions"],
    yearsExperience: 8, saved: true,
    reviews: [
      { id: "r4", author: "Nina P.", authorInitials: "NP", rating: 5, date: "1 week ago", text: "Marcus' portfolio feedback was transformative. He helped me restructure my case studies and I got callbacks from 4 out of 5 applications.", sessionType: "1:1 Mentoring" },
      { id: "r5", author: "Leo R.", authorInitials: "LR", rating: 5, date: "3 weeks ago", text: "The group workshop was incredible — Marcus created mock design challenges that mirrored real interviews. Invaluable experience.", sessionType: "Group Workshop" },
    ],
  },
  {
    id: "c3", name: "Dr. Priya Sharma", title: "International Career Mobility Strategist",
    bio: "PhD in organizational psychology, worked across 4 continents. I help professionals navigate cross-border career opportunities with clarity and a concrete action plan. My specialty is credential transfer, visa strategies, and building a global professional identity.",
    initials: "PS", color: "var(--ce-role-guide)",
    specialties: ["International Mobility", "Career Transitions", "Leadership"],
    sessionTypes: ["Career Coaching", "1:1 Mentoring"],
    price: 100, isFree: false, rating: 5.0, reviewCount: 12, sessionCount: 34,
    nextAvailable: "Thursday, 9:00 AM", timezone: "IST (UTC+5:30)", languages: ["English", "Hindi"],
    matchScore: 88, matchReason: "Your international career goals align directly with Dr. Sharma's specialty. She's worked across 4 continents.",
    badges: ["Top Rated", "PhD"],
    yearsExperience: 15, saved: false,
    reviews: [
      { id: "r6", author: "Amit K.", authorInitials: "AK", rating: 5, date: "2 weeks ago", text: "Dr. Sharma helped me understand exactly which credentials would transfer and which I'd need to redo. Saved me months of confusion.", sessionType: "Career Coaching" },
      { id: "r7", author: "Rachel M.", authorInitials: "RM", rating: 5, date: "1 month ago", text: "Incredibly knowledgeable about cross-border careers. She mapped out a 6-month plan that was realistic and achievable.", sessionType: "1:1 Mentoring" },
    ],
  },
  {
    id: "c4", name: "James Okafor", title: "Engineering Manager at Stripe",
    bio: "EM at Stripe, previously Google. I volunteer because I know how hard technical interviews are — and how much better you can do with the right prep. I focus on system design, behavioral interviews, and the communication patterns that differentiate senior engineers.",
    initials: "JO", color: "var(--ce-role-edgepreneur)",
    specialties: ["Engineering", "Interview Prep", "Leadership"],
    sessionTypes: ["Mock Interview", "1:1 Mentoring", "Office Hours"],
    price: 0, isFree: true, rating: 4.6, reviewCount: 67, sessionCount: 203,
    nextAvailable: "Wednesday, 11:00 AM", timezone: "WAT (UTC+1)", languages: ["English"],
    matchScore: 85, matchReason: "Strong match for technical interview prep. James has coached 23 successful FAANG hires.",
    badges: ["Volunteer", "200+ Sessions"],
    yearsExperience: 12, saved: false,
    reviews: [
      { id: "r8", author: "Tunde A.", authorInitials: "TA", rating: 5, date: "1 week ago", text: "James' mock interviews are the closest thing to a real FAANG loop. His system design feedback was specifically what got me through the Google interview.", sessionType: "Mock Interview" },
      { id: "r9", author: "Chris W.", authorInitials: "CW", rating: 4, date: "1 month ago", text: "Great technical depth. Office hours format is perfect for quick questions. Very generous with his time.", sessionType: "Office Hours" },
      { id: "r10", author: "Yuki T.", authorInitials: "YT", rating: 5, date: "2 months ago", text: "James helped me prepare for my eng manager interviews. His frameworks for behavioral questions were a game changer.", sessionType: "1:1 Mentoring" },
    ],
  },
  {
    id: "c5", name: "Zara Williams", title: "VP of Data Science at Airbnb",
    bio: "15 years in data, from analyst to VP. I specialize in helping data professionals level up — whether that's breaking into your first DS role or navigating the IC-to-manager transition. I bring frameworks from Airbnb's data culture that I've seen work at scale.",
    initials: "ZW", color: "var(--ce-role-edu)",
    specialties: ["Data Science", "Leadership", "Career Transitions"],
    sessionTypes: ["1:1 Mentoring", "Career Coaching"],
    price: 125, isFree: false, rating: 4.8, reviewCount: 18, sessionCount: 72,
    nextAvailable: "Friday, 3:00 PM", timezone: "PST (UTC-8)", languages: ["English", "French"],
    matchScore: 79, matchReason: "Strong data leadership perspective. Relevant if you're exploring the data science path in your career discovery.",
    badges: ["VP Level", "Top Rated"],
    yearsExperience: 15, saved: false,
    reviews: [
      { id: "r11", author: "Emma S.", authorInitials: "ES", rating: 5, date: "3 weeks ago", text: "Zara's advice on the IC-to-manager transition was exactly what I needed. She helped me see the bigger picture.", sessionType: "Career Coaching" },
    ],
  },
  {
    id: "c6", name: "Tomás Rivera", title: "Founder & Career Coach",
    bio: "Former McKinsey consultant turned career coach. I help people navigate career pivots with the same rigor I brought to Fortune 500 strategy. Specializing in structured thinking, communication, and building a compelling career narrative.",
    initials: "TR", color: "var(--ce-role-ngo)",
    specialties: ["Career Transitions", "Interview Prep", "Leadership"],
    sessionTypes: ["Career Coaching", "Mock Interview", "Group Workshop"],
    price: 90, isFree: false, rating: 4.9, reviewCount: 31, sessionCount: 124,
    nextAvailable: "Tomorrow, 10:00 AM", timezone: "CST (UTC-6)", languages: ["English", "Spanish"],
    matchScore: 82, matchReason: "Expert in career pivots with a structured, strategy-first approach. Great for clarifying your direction.",
    badges: ["Fast Responder", "Ex-Consulting"],
    yearsExperience: 11, saved: false,
    reviews: [
      { id: "r12", author: "Ana G.", authorInitials: "AG", rating: 5, date: "1 week ago", text: "Tomás brought a completely different framework to my career pivot. His consulting background means he cuts through ambiguity fast.", sessionType: "Career Coaching" },
      { id: "r13", author: "Brian F.", authorInitials: "BF", rating: 5, date: "1 month ago", text: "The group workshop on career narratives was outstanding. I finally know how to explain my non-linear path confidently.", sessionType: "Group Workshop" },
    ],
  },
  {
    id: "c7", name: "Fatima Al-Hassan", title: "Tech Recruiter → Career Strategist",
    bio: "10 years as a tech recruiter at Google and Meta, now helping candidates from the other side. I know exactly what hiring managers and recruiters look for — because I was one. My sessions focus on application strategy, resume optimization, and the unwritten rules of tech hiring.",
    initials: "FA", color: "var(--ce-role-parent)",
    specialties: ["Interview Prep", "Career Transitions", "Product Management"],
    sessionTypes: ["1:1 Mentoring", "Mock Interview", "Career Coaching"],
    price: 60, isFree: false, rating: 4.8, reviewCount: 52, sessionCount: 187,
    nextAvailable: "Today, 7:00 PM", timezone: "EST (UTC-5)", languages: ["English", "Arabic"],
    matchScore: 90, matchReason: "Former recruiter at Google/Meta — knows the hiring process from the inside. Highly relevant for your job search.",
    badges: ["Ex-Recruiter", "Fast Responder"],
    yearsExperience: 10, saved: true,
    reviews: [
      { id: "r14", author: "Jordan P.", authorInitials: "JP", rating: 5, date: "2 days ago", text: "Fatima's insider perspective on hiring is unmatched. She rewrote my resume and I went from 5% callback to 40%. Not exaggerating.", sessionType: "1:1 Mentoring" },
      { id: "r15", author: "Sam L.", authorInitials: "SL", rating: 5, date: "3 weeks ago", text: "Best mock interview prep I've done. She simulates real recruiter screens and the behavioral debrief is incredibly detailed.", sessionType: "Mock Interview" },
    ],
  },
  {
    id: "c8", name: "Chen Wei", title: "Staff Engineer at Vercel",
    bio: "Full-stack engineer specializing in React, Next.js, and developer tools. I mentor junior-to-senior engineers on system design, open source contributions, and building a technical brand. My office hours are open to anyone working on web technologies.",
    initials: "CW", color: "var(--ce-role-agency)",
    specialties: ["Engineering", "Interview Prep"],
    sessionTypes: ["Office Hours", "1:1 Mentoring", "Mock Interview"],
    price: 0, isFree: true, rating: 4.5, reviewCount: 28, sessionCount: 95,
    nextAvailable: "Monday, 4:00 PM", timezone: "JST (UTC+9)", languages: ["English", "Mandarin"],
    matchScore: 76, matchReason: "Strong technical mentor for web engineering. Good match if you're building frontend skills.",
    badges: ["Volunteer", "Open Source"],
    yearsExperience: 9, saved: false,
    reviews: [
      { id: "r16", author: "Kai N.", authorInitials: "KN", rating: 5, date: "2 weeks ago", text: "Chen's office hours are gold. I dropped in with a React performance question and left with a completely new mental model.", sessionType: "Office Hours" },
    ],
  },
];

const ALL_SPECIALTIES: Specialty[] = [
  "Product Management", "UX Design", "Engineering", "Data Science",
  "Career Transitions", "Interview Prep", "Leadership", "International Mobility",
];

// ─── Hook: persisted state ─────────────────────────────────────────

function useCoachesData() {
  const [savedCoaches, setSavedCoaches] = useState<Set<string>>(() => {
    try {
      const s = localStorage.getItem("ce-coaches-saved");
      return s ? new Set(JSON.parse(s)) : new Set(["c2", "c7"]);
    } catch { return new Set(["c2", "c7"]); }
  });

  const toggleSaved = (id: string) => {
    setSavedCoaches(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem("ce-coaches-saved", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  return { savedCoaches, toggleSaved };
}

// ─── Component ──────────────────────────────────────────────────────

export function CoachesSurface({ role: propRole, onNavigate }: { role?: RoleId; onNavigate?: (target: string) => void }) {
  const { role: paramRole } = useParams<{ role: string }>();
  const role = (propRole || paramRole || "edgestar") as RoleId;

  const [surfaceState, setSurfaceState] = useState<"empty" | "building" | "active">("empty");
  const [buildStep, setBuildStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [preferredStyle, setPreferredStyle] = useState("");

  const [activeTab, setActiveTab] = useState<"recommended" | "browse" | "saved">("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpec, setFilterSpec] = useState<Specialty | "all">("all");
  const [filterFree, setFilterFree] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");

  const { savedCoaches, toggleSaved } = useCoachesData();

  // Filtered coaches
  const filteredCoaches = useMemo(() => {
    let list = [...MOCK_COACHES];
    if (filterSpec !== "all") list = list.filter(c => c.specialties.includes(filterSpec));
    if (filterFree) list = list.filter(c => c.isFree);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.specialties.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [filterSpec, filterFree, searchQuery]);

  const recommendedCoaches = useMemo(() =>
    [...MOCK_COACHES].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5),
  []);

  const savedList = useMemo(() =>
    MOCK_COACHES.filter(c => savedCoaches.has(c.id)),
  [savedCoaches]);

  // ── Sophia override per state ──
  const sophiaOverride = surfaceState === "empty"
    ? { message: "I can match you with coaches and mentors who fit your exact career goals.", chips: [{ label: "Find a coach", action: () => setSurfaceState("building") }] }
    : surfaceState === "building"
    ? { message: "Let me understand what you're looking for so I can find the best match.", chips: [] }
    : {
        message: `${recommendedCoaches.length} coaches match your profile. ${recommendedCoaches[0]?.name} is your strongest match at ${recommendedCoaches[0]?.matchScore}%.`,
        chips: [
          { label: "Book a session", action: () => onNavigate?.("sessions") },
          { label: "My messages", action: () => onNavigate?.("messages") },
        ],
      };

  // ── Empty State ──
  if (surfaceState === "empty") {
    return (
      <RoleShell role={role} userName="You" userInitial="Y" onNavigate={onNavigate} sophiaOverride={sophiaOverride} noPadding>
        <div className="mt-14 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE as any }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(var(--ce-glass-tint), 0.06)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)" }}>
              <Users className="w-6 h-6" style={{ color: "var(--ce-role-guide)" }} />
            </div>
            <h2 className="text-[17px] font-medium mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>EdgeCoach & Mentor</h2>
            <p className="text-[13px] mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>Find expert coaches and mentors matched to your career goals.</p>
            <button onClick={() => setSurfaceState("building")} className="px-5 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>
              Find Your Match
            </button>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ── Building State ──
  if (surfaceState === "building") {
    const goalOptions = ["Career Pivot", "Interview Prep", "Skill Building", "Portfolio Review", "Leadership Growth", "International Move"];
    const styleOptions = ["Structured & Goal-Oriented", "Conversational & Exploratory", "Intensive & Challenging", "Supportive & Encouraging"];

    return (
      <RoleShell role={role} userName="You" userInitial="Y" onNavigate={onNavigate} sophiaOverride={sophiaOverride} noPadding>
        <div className="mt-14 px-4 sm:px-6 max-w-lg mx-auto pt-8">
          <GlassCard delay={0}>
            <div className="p-5">
              {/* Progress */}
              <div className="flex gap-1.5 mb-5">
                {[0, 1].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= buildStep ? "var(--ce-role-guide)" : "rgba(var(--ce-glass-tint), 0.08)" }} />
                ))}
              </div>

              {/* Sophia header */}
              <div className="flex items-start gap-3 mb-5">
                <SophiaMark size={28} />
                <p className="text-[13px] leading-relaxed pt-0.5" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>
                  {buildStep === 0
                    ? "What are your coaching goals? Pick all that apply — I'll match you with coaches who specialize in these areas."
                    : "What coaching style works best for you? This helps me find coaches whose approach matches your learning preferences."
                  }
                </p>
              </div>

              <AnimatePresence mode="wait">
                {buildStep === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease: EASE as any }}>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {goalOptions.map(g => {
                        const sel = selectedGoals.includes(g);
                        return (
                          <button key={g} onClick={() => setSelectedGoals(prev => sel ? prev.filter(x => x !== g) : [...prev, g])} className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all duration-200" style={{
                            fontFamily: "var(--font-body)",
                            background: sel ? "rgba(139,92,246,0.15)" : "rgba(var(--ce-glass-tint), 0.04)",
                            border: `1px solid ${sel ? "rgba(139,92,246,0.3)" : "rgba(var(--ce-glass-tint), 0.08)"}`,
                            color: sel ? "var(--ce-role-guide)" : "var(--ce-text-secondary)",
                          }}>
                            {sel && <Check className="w-3 h-3 inline mr-1" />}{g}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => { if (selectedGoals.length > 0) setBuildStep(1); }} disabled={selectedGoals.length === 0} className="w-full py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 disabled:opacity-70" style={{ fontFamily: "var(--font-display)", background: selectedGoals.length > 0 ? "var(--ce-role-guide)" : "rgba(var(--ce-glass-tint), 0.06)", color: selectedGoals.length > 0 ? "#fff" : "var(--ce-text-tertiary)" }}>
                      Continue
                    </button>
                  </motion.div>
                )}

                {buildStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease: EASE as any }}>
                    <div className="flex flex-col gap-2 mb-5">
                      {styleOptions.map(s => {
                        const sel = preferredStyle === s;
                        return (
                          <button key={s} onClick={() => setPreferredStyle(s)} className="px-4 py-3 rounded-xl text-[12px] text-left cursor-pointer transition-all duration-200" style={{
                            fontFamily: "var(--font-body)",
                            background: sel ? "rgba(139,92,246,0.12)" : "rgba(var(--ce-glass-tint), 0.04)",
                            border: `1px solid ${sel ? "rgba(139,92,246,0.25)" : "rgba(var(--ce-glass-tint), 0.08)"}`,
                            color: sel ? "var(--ce-role-guide)" : "var(--ce-text-secondary)",
                          }}>
                            {sel && <Check className="w-3 h-3 inline mr-1.5" />}{s}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setBuildStep(0)} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)", color: "var(--ce-text-secondary)" }}>
                        Back
                      </button>
                      <button onClick={() => setSurfaceState("active")} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>
                        Find My Matches
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </RoleShell>
    );
  }

  // ── Active State ──
  const tabs = [
    { id: "recommended" as const, label: "Sophia's Picks" },
    { id: "browse" as const, label: "Browse All" },
    { id: "saved" as const, label: `Saved (${savedList.length})` },
  ];

  const currentList = activeTab === "recommended" ? recommendedCoaches
    : activeTab === "saved" ? savedList
    : filteredCoaches;

  return (
    <RoleShell role={role} userName="You" userInitial="Y" onNavigate={onNavigate} sophiaOverride={sophiaOverride} noPadding>
      <div className="mt-14 px-4 sm:px-6 max-w-5xl mx-auto pb-24">

        {/* Tab bar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE as any }} className="flex gap-1 p-1 rounded-xl mb-5 mt-4" style={{ background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className="flex-1 py-2 rounded-lg text-[12px] font-medium cursor-pointer transition-all duration-200" style={{
              fontFamily: "var(--font-display)",
              background: activeTab === t.id ? "rgba(var(--ce-glass-tint), 0.08)" : "transparent",
              color: activeTab === t.id ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
            }}>
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* Browse filters */}
        {activeTab === "browse" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="mb-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ce-text-tertiary)" }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search coaches, specialties..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)", color: "var(--ce-text-primary)" }} />
            </div>
            {/* Specialty filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {(["all", ...ALL_SPECIALTIES] as const).map(spec => {
                const isAll = spec === "all";
                const sel = filterSpec === spec;
                return (
                  <button key={spec} onClick={() => setFilterSpec(spec as any)} className="px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-all duration-200" style={{
                    fontFamily: "var(--font-body)",
                    background: sel ? "rgba(139,92,246,0.12)" : "rgba(var(--ce-glass-tint), 0.04)",
                    border: `1px solid ${sel ? "rgba(139,92,246,0.2)" : "rgba(var(--ce-glass-tint), 0.06)"}`,
                    color: sel ? "var(--ce-role-guide)" : "var(--ce-text-tertiary)",
                  }}>
                    {isAll ? "All" : spec}
                  </button>
                );
              })}
              <button onClick={() => setFilterFree(!filterFree)} className="px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-all duration-200" style={{
                fontFamily: "var(--font-body)",
                background: filterFree ? "rgba(var(--ce-lime-rgb, 179,255,59), 0.12)" : "rgba(var(--ce-glass-tint), 0.04)",
                border: `1px solid ${filterFree ? "rgba(var(--ce-lime-rgb, 179,255,59), 0.2)" : "rgba(var(--ce-glass-tint), 0.06)"}`,
                color: filterFree ? "var(--ce-lime)" : "var(--ce-text-tertiary)",
              }}>
                Free Only
              </button>
            </div>
          </motion.div>
        )}

        {/* Compare bar */}
        {compareList.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl flex items-center justify-between" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-role-guide)" }}>
              {compareList.length} coach{compareList.length > 1 ? "es" : ""} selected for comparison
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCompareList([])} className="px-3 py-1 rounded-lg text-[11px] cursor-pointer" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.06)", color: "var(--ce-text-secondary)" }}>Clear</button>
              <button onClick={() => setShowCompare(true)} disabled={compareList.length < 2} className="px-3 py-1 rounded-lg text-[11px] font-medium cursor-pointer disabled:opacity-70" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>Compare</button>
            </div>
          </motion.div>
        )}

        {/* Recommended header */}
        {activeTab === "recommended" && (
          <div className="flex items-center gap-2 mb-4">
            <SophiaMark size={20} />
            <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>
              Matched based on your career goals, skills, and EdgePath progress
            </span>
          </div>
        )}

        {/* Empty saved state */}
        {activeTab === "saved" && savedList.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--ce-text-tertiary)" }} />
            <p className="text-[13px] mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>No saved coaches yet</p>
            <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>Tap the heart icon on any coach to save them here.</p>
          </div>
        )}

        {/* Coach grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentList.map((coach, i) => (
            <motion.div key={coach.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04, ease: EASE as any }}>
              <GlassCard delay={0}>
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-medium" style={{ fontFamily: "var(--font-display)", background: `rgba(${coach.color === "var(--ce-lime)" ? "179,255,59" : "139,92,246"}, 0.12)`, color: coach.color }}>
                      {coach.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedCoach(coach)} className="text-[14px] font-medium truncate cursor-pointer hover:underline" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>
                          {coach.name}
                        </button>
                        {activeTab === "recommended" && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ fontFamily: "var(--font-display)", background: "rgba(139,92,246,0.12)", color: "var(--ce-role-guide)" }}>
                            {coach.matchScore}% match
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] truncate" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>{coach.title}</p>
                    </div>
                    <button onClick={() => toggleSaved(coach.id)} className="shrink-0 cursor-pointer p-1" title={savedCoaches.has(coach.id) ? "Remove from saved" : "Save coach"}>
                      <Heart className="w-4 h-4" style={{ color: savedCoaches.has(coach.id) ? "var(--ce-status-error)" : "var(--ce-text-tertiary)", fill: savedCoaches.has(coach.id) ? "var(--ce-status-error)" : "none" }} />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {coach.badges.map(b => (
                      <span key={b} className="px-2 py-0.5 rounded text-[10px]" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.06)", color: "var(--ce-text-tertiary)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                        {b}
                      </span>
                    ))}
                    {coach.isFree && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ fontFamily: "var(--font-display)", background: "rgba(var(--ce-lime-rgb, 179,255,59), 0.12)", color: "var(--ce-lime)" }}>Free</span>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {coach.specialties.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px]" style={{ fontFamily: "var(--font-body)", background: "rgba(139,92,246,0.06)", color: "var(--ce-text-secondary)", border: "1px solid rgba(139,92,246,0.1)" }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mb-3 text-[11px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: "var(--ce-role-edgepreneur)", fill: "var(--ce-role-edgepreneur)" }} />{coach.rating} ({coach.reviewCount})</span>
                    <span className="flex items-center gap-1"><Video className="w-3 h-3" />{coach.sessionCount} sessions</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{coach.timezone.split(" ")[0]}</span>
                  </div>

                  {/* Sophia match reason (recommended only) */}
                  {activeTab === "recommended" && (
                    <div className="flex items-start gap-2 mb-3 p-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint), 0.03)" }}>
                      <SophiaMark size={14} />
                      <p className="text-[11px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>{coach.matchReason}</p>
                    </div>
                  )}

                  {/* Price + availability + actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>
                      {coach.isFree ? <span style={{ color: "var(--ce-lime)" }}>Free</span> : <span>${coach.price}/session</span>}
                      <span className="mx-1.5">·</span>
                      <Clock className="w-3 h-3 inline" /> {coach.nextAvailable}
                    </div>
                    <div className="flex gap-1.5">
                      {/* Compare checkbox */}
                      <button onClick={() => {
                        setCompareList(prev => prev.includes(coach.id) ? prev.filter(x => x !== coach.id) : prev.length < 3 ? [...prev, coach.id] : prev);
                      }} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: compareList.includes(coach.id) ? "rgba(139,92,246,0.12)" : "rgba(var(--ce-glass-tint), 0.04)", border: `1px solid ${compareList.includes(coach.id) ? "rgba(139,92,246,0.2)" : "rgba(var(--ce-glass-tint), 0.08)"}` }} title="Add to compare">
                        {compareList.includes(coach.id)
                          ? <Check className="w-3 h-3" style={{ color: "var(--ce-role-guide)" }} />
                          : <Filter className="w-3 h-3" style={{ color: "var(--ce-text-tertiary)" }} />
                        }
                      </button>
                      <button onClick={() => setSelectedCoach(coach)} className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Sophia insight */}
        {activeTab === "recommended" && (
          <div className="mt-5">
            <SophiaInsight variant="inline" title="Your coaching strategy" insight={`Based on your goals (${selectedGoals.length > 0 ? selectedGoals.join(", ") : "Career growth"}), I recommend starting with ${recommendedCoaches[0]?.name} for a focused 1:1 session. After that, ${recommendedCoaches[1]?.name}'s ${recommendedCoaches[1]?.isFree ? "free " : ""}sessions can complement with a different perspective.`} />
          </div>
        )}
      </div>

      {/* ── Coach Profile Drawer ── */}
      <AnimatePresence>
        {selectedCoach && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCoach(null)} className="fixed inset-0 z-[50]" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ duration: 0.3, ease: EASE as any }} className="fixed top-0 right-0 bottom-0 w-[420px] max-w-[90vw] z-[51] overflow-y-auto" style={{ background: "var(--ce-surface-modal-bg)", borderLeft: "1px solid rgba(var(--ce-glass-tint), 0.08)" }}>
              <div className="p-5">
                {/* Close */}
                <button onClick={() => setSelectedCoach(null)} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint), 0.06)" }}>
                  <X className="w-4 h-4" style={{ color: "var(--ce-text-tertiary)" }} />
                </button>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-4 pr-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[16px] font-medium" style={{ fontFamily: "var(--font-display)", background: `rgba(${selectedCoach.color === "var(--ce-lime)" ? "179,255,59" : "139,92,246"}, 0.12)`, color: selectedCoach.color }}>
                    {selectedCoach.initials}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>{selectedCoach.name}</h3>
                    <p className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>{selectedCoach.title}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedCoach.badges.map(b => (
                    <span key={b} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.06)", color: "var(--ce-text-secondary)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                      <Award className="w-3 h-3" />{b}
                    </span>
                  ))}
                  {selectedCoach.isFree && (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-medium" style={{ fontFamily: "var(--font-display)", background: "rgba(var(--ce-lime-rgb, 179,255,59), 0.12)", color: "var(--ce-lime)" }}>Volunteer Mentor</span>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Rating", value: `${selectedCoach.rating}`, icon: Star },
                    { label: "Reviews", value: `${selectedCoach.reviewCount}`, icon: MessageSquare },
                    { label: "Sessions", value: `${selectedCoach.sessionCount}`, icon: Video },
                    { label: "Experience", value: `${selectedCoach.yearsExperience}yr`, icon: Clock },
                  ].map(s => (
                    <div key={s.label} className="p-2 rounded-xl text-center" style={{ background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                      <s.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: "var(--ce-text-tertiary)" }} />
                      <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>{s.value}</div>
                      <div className="text-[9px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <h4 className="text-[12px] font-medium mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>About</h4>
                  <p className="text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>{selectedCoach.bio}</p>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-[12px] font-medium mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>Specialties</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCoach.specialties.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg text-[11px]" style={{ fontFamily: "var(--font-body)", background: "rgba(139,92,246,0.08)", color: "var(--ce-role-guide)", border: "1px solid rgba(139,92,246,0.12)" }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Session types */}
                <div className="mb-4">
                  <h4 className="text-[12px] font-medium mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>Session Types</h4>
                  <div className="space-y-1.5">
                    {selectedCoach.sessionTypes.map(st => (
                      <div key={st} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint), 0.03)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                        <Video className="w-3.5 h-3.5" style={{ color: "var(--ce-text-tertiary)" }} />
                        <span className="text-[12px] flex-1" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>{st}</span>
                        <span className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>
                          {selectedCoach.isFree ? "Free" : `$${selectedCoach.price}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>
                    <Globe className="w-3.5 h-3.5" style={{ color: "var(--ce-text-tertiary)" }} />
                    {selectedCoach.timezone} · {selectedCoach.languages.join(", ")}
                  </div>
                  <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>
                    <Calendar className="w-3.5 h-3.5" style={{ color: "var(--ce-text-tertiary)" }} />
                    Next available: {selectedCoach.nextAvailable}
                  </div>
                </div>

                {/* Sophia note */}
                <div className="flex items-start gap-2 p-3 rounded-xl mb-4" style={{ background: "rgba(var(--ce-glass-tint), 0.03)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                  <SophiaMark size={16} />
                  <p className="text-[11px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>{selectedCoach.matchReason}</p>
                </div>

                {/* Reviews */}
                <div className="mb-5">
                  <h4 className="text-[12px] font-medium mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>Reviews ({selectedCoach.reviews.length})</h4>
                  <div className="space-y-2.5">
                    {selectedCoach.reviews.map(r => (
                      <div key={r.id} className="p-3 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint), 0.03)", border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-medium" style={{ fontFamily: "var(--font-display)", background: "rgba(var(--ce-glass-tint), 0.08)", color: "var(--ce-text-secondary)" }}>
                              {r.authorInitials}
                            </div>
                            <span className="text-[11px] font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>{r.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className="w-2.5 h-2.5" style={{ color: idx < r.rating ? "var(--ce-role-edgepreneur)" : "var(--ce-text-tertiary)", fill: idx < r.rating ? "var(--ce-role-edgepreneur)" : "none" }} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] leading-relaxed mb-1.5" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}>{r.text}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", color: "var(--ce-text-tertiary)" }}>{r.sessionType}</span>
                          <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>{r.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <button onClick={() => {
                    setSelectedCoach(null);
                    onNavigate?.("sessions");
                  }} className="w-full py-3 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>
                    <Calendar className="w-4 h-4 inline mr-2" />Book a Session
                  </button>
                  <button onClick={() => {
                    setShowMessageModal(true);
                  }} className="w-full py-2.5 rounded-xl text-[12px] cursor-pointer transition-all duration-200" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)", color: "var(--ce-text-secondary)" }}>
                    <MessageSquare className="w-3.5 h-3.5 inline mr-2" />Send a Message
                  </button>
                  <button onClick={() => toggleSaved(selectedCoach.id)} className="w-full py-2.5 rounded-xl text-[12px] cursor-pointer transition-all duration-200" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)", color: savedCoaches.has(selectedCoach.id) ? "var(--ce-status-error)" : "var(--ce-text-secondary)" }}>
                    <Heart className="w-3.5 h-3.5 inline mr-2" style={{ fill: savedCoaches.has(selectedCoach.id) ? "var(--ce-status-error)" : "none" }} />
                    {savedCoaches.has(selectedCoach.id) ? "Saved" : "Save Coach"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Compare Modal ── */}
      <AnimatePresence>
        {showCompare && compareList.length >= 2 && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompare(false)} className="fixed inset-0 z-[50]" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.25, ease: EASE as any }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] max-w-[95vw] max-h-[80vh] overflow-y-auto z-[51] rounded-2xl p-5" style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint), 0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>Compare Coaches</h3>
                <button onClick={() => setShowCompare(false)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint), 0.06)" }}>
                  <X className="w-4 h-4" style={{ color: "var(--ce-text-tertiary)" }} />
                </button>
              </div>
              <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${Math.min(compareList.length, 3)}, 1fr)` }}>
                {compareList.map(id => {
                  const c = MOCK_COACHES.find(x => x.id === id);
                  if (!c) return null;
                  return (
                    <div key={c.id} className="p-4 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)" }}>
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-medium mx-auto mb-2" style={{ fontFamily: "var(--font-display)", background: `rgba(${c.color === "var(--ce-lime)" ? "179,255,59" : "139,92,246"}, 0.12)`, color: c.color }}>
                        {c.initials}
                      </div>
                      <h4 className="text-[13px] font-medium text-center mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>{c.name}</h4>
                      <p className="text-[10px] text-center mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>{c.title}</p>

                      {/* Comparison metrics */}
                      {[
                        { label: "Rating", value: `${c.rating}/5.0` },
                        { label: "Reviews", value: `${c.reviewCount}` },
                        { label: "Sessions", value: `${c.sessionCount}` },
                        { label: "Price", value: c.isFree ? "Free" : `$${c.price}/session` },
                        { label: "Experience", value: `${c.yearsExperience} years` },
                        { label: "Availability", value: c.nextAvailable },
                        { label: "Match Score", value: `${c.matchScore}%` },
                      ].map(m => (
                        <div key={m.label} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}>
                          <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>{m.label}</span>
                          <span className="text-[11px] font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>{m.value}</span>
                        </div>
                      ))}

                      <button onClick={() => { setShowCompare(false); setSelectedCoach(c); }} className="w-full mt-3 py-2 rounded-lg text-[11px] font-medium cursor-pointer" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>
                        View Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Message Modal ── */}
      <AnimatePresence>
        {showMessageModal && selectedCoach && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMessageModal(false)} className="fixed inset-0 z-[52]" style={{ background: "rgba(0,0,0,0.4)" }} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.25, ease: EASE as any }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[90vw] z-[53] rounded-2xl p-5" style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint), 0.1)" }}>
              <h3 className="text-[14px] font-medium mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--ce-text-primary)" }}>Message {selectedCoach.name}</h3>
              <p className="text-[11px] mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}>Introduce yourself and ask about their coaching approach.</p>

              <textarea value={messageText} onChange={e => setMessageText(e.target.value)} rows={5} placeholder={`Hi ${selectedCoach.name.split(" ")[0]}, I'm interested in your coaching sessions...`} className="w-full px-3 py-2.5 rounded-xl text-[12px] outline-none resize-none mb-3" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)", color: "var(--ce-text-primary)" }} />

              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: messageText.length > 500 ? "var(--ce-status-error)" : "var(--ce-text-tertiary)" }}>{messageText.length}/500</span>
                <div className="flex gap-2">
                  <button onClick={() => { setShowMessageModal(false); setMessageText(""); }} className="px-4 py-2 rounded-xl text-[12px] cursor-pointer" style={{ fontFamily: "var(--font-body)", background: "rgba(var(--ce-glass-tint), 0.04)", border: "1px solid rgba(var(--ce-glass-tint), 0.08)", color: "var(--ce-text-secondary)" }}>Cancel</button>
                  <button onClick={() => {
                    if (!messageText.trim()) return;
                    toast.success("Message sent", `Your message to ${selectedCoach.name} has been delivered.`);
                    setShowMessageModal(false);
                    setMessageText("");
                  }} disabled={!messageText.trim() || messageText.length > 500} className="px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer disabled:opacity-70" style={{ fontFamily: "var(--font-display)", background: "var(--ce-role-guide)", color: "#fff" }}>
                    <Send className="w-3 h-3 inline mr-1.5" />Send
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </RoleShell>
  );
}
