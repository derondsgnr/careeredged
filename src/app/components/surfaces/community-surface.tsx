import { EASE } from "../tokens";
/**
 * Community Surface — CommunityEdge
 *
 * Social feed, groups, and events for the CareerEdge community.
 * Available to all roles — connects peers, coaches, and organizations.
 *
 * Layer 3 scope:
 * - Feed with typed posts (updates, articles, insights, questions, achievements)
 * - Groups (joined + discover) with coach-led badges
 * - Events with RSVP and capacity tracking
 * - Sophia community insights
 * - Cross-surface navigation chips
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  Users, Heart, MessageSquare, Share2, Plus, Search,
  Calendar, MapPin, Video, Crown, ChevronRight, ArrowRight,
  Sparkles, Check, X, Send, Globe, Star, TrendingUp,
  Circle, Flame,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PostType = "update" | "article" | "insight" | "question" | "achievement";

interface FeedPost {
  id: string;
  author: {
    name: string;
    initial: string;
    role: string;
    avatarColor: string;
  };
  type: PostType;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  image?: string;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  category: string;
  activity: "hot" | "active" | "quiet";
  description: string;
  joined: boolean;
  isCoachLed: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  capacity: number;
  rsvpd: boolean;
  virtual: boolean;
}

type SurfaceState = "empty" | "building" | "active";
type ActiveTab = "feed" | "groups" | "events";

// ─── Post type config ────────────────────────────────────────────────────────

const POST_TYPE_CONFIG: Record<PostType, { label: string; color: string }> = {
  update:      { label: "Update",      color: "var(--ce-text-secondary)" },
  article:     { label: "Article",     color: "var(--ce-cyan)" },
  insight:     { label: "Insight",     color: "var(--ce-role-guide)" },
  question:    { label: "Question",    color: "var(--ce-role-edgepreneur)" },
  achievement: { label: "Achievement", color: "var(--ce-lime)" },
};

const ACTIVITY_CONFIG: Record<string, { label: string; color: string }> = {
  hot:    { label: "Hot",    color: "var(--ce-lime)" },
  active: { label: "Active", color: "var(--ce-cyan)" },
  quiet:  { label: "Quiet",  color: "var(--ce-text-quaternary)" },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const FEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    author: { name: "Sarah K.", initial: "S", role: "edgestar", avatarColor: "var(--ce-role-edgestar)" },
    type: "achievement",
    content: "Just landed my first tech role after 6 months on EdgePath! The resume workshops and mock interviews made all the difference. Thank you to this incredible community.",
    timestamp: "2h ago",
    likes: 47,
    comments: 12,
    liked: false,
  },
  {
    id: "p2",
    author: { name: "James L.", initial: "J", role: "edgestar", avatarColor: "var(--ce-role-edu)" },
    type: "question",
    content: "Has anyone transitioned from marketing to product management? Looking for advice on how to position transferable skills and which certifications actually matter.",
    timestamp: "4h ago",
    likes: 18,
    comments: 23,
    liked: false,
  },
  {
    id: "p3",
    author: { name: "Priya M.", initial: "P", role: "edgepreneur", avatarColor: "var(--ce-role-edgepreneur)" },
    type: "article",
    content: "5 Things I Wish I Knew Before My H-1B Interview — From document prep to the questions they actually ask, here's my honest breakdown after going through the process twice.",
    timestamp: "6h ago",
    likes: 92,
    comments: 34,
    liked: true,
    image: "H-1B interview preparation checklist infographic",
  },
  {
    id: "p4",
    author: { name: "Alex T.", initial: "A", role: "edgestar", avatarColor: "var(--ce-role-ngo)" },
    type: "update",
    content: "Starting my 30-day UX challenge today. Who's joining? I'll be posting daily progress and sharing resources in the UX/UI Designers group.",
    timestamp: "8h ago",
    likes: 31,
    comments: 15,
    liked: false,
  },
  {
    id: "p5",
    author: { name: "Coach Maria", initial: "M", role: "guide", avatarColor: "var(--ce-role-guide)" },
    type: "insight",
    content: "Remote salaries are converging globally — here's what I'm seeing in my coaching practice. Companies are moving toward location-agnostic bands, which changes the negotiation playbook entirely.",
    timestamp: "12h ago",
    likes: 156,
    comments: 41,
    liked: false,
  },
  {
    id: "p6",
    author: { name: "TechBridge Academy", initial: "T", role: "edu", avatarColor: "var(--ce-role-agency)" },
    type: "achievement",
    content: "Our bootcamp cohort just graduated 45 students with 89% placement rate! Proud of every single graduate. If your org is hiring junior devs, reach out.",
    timestamp: "1d ago",
    likes: 203,
    comments: 28,
    liked: true,
  },
  {
    id: "p7",
    author: { name: "David P.", initial: "D", role: "edgestar", avatarColor: "var(--ce-role-parent)" },
    type: "question",
    content: "Best resources for learning system design? I have 2 months before my interviews at FAANG companies and want a structured approach.",
    timestamp: "1d ago",
    likes: 24,
    comments: 38,
    liked: false,
  },
  {
    id: "p8",
    author: { name: "Nina R.", initial: "N", role: "edgestar", avatarColor: "var(--ce-role-edgestar)" },
    type: "update",
    content: "Grateful for this community. Got 3 referrals through EdgeGroups this month. Networking here actually works — people genuinely want to help.",
    timestamp: "1d ago",
    likes: 67,
    comments: 9,
    liked: false,
  },
  {
    id: "p9",
    author: { name: "Fatima A.", initial: "F", role: "edgestar", avatarColor: "var(--ce-role-ngo)" },
    type: "article",
    content: "How I negotiated a 40% salary increase as an immigrant professional. The key was data — I used EdgeMatch benchmarks to back every ask.",
    timestamp: "2d ago",
    likes: 284,
    comments: 56,
    liked: true,
  },
  {
    id: "p10",
    author: { name: "Coach Ben", initial: "B", role: "guide", avatarColor: "var(--ce-role-guide)" },
    type: "insight",
    content: "The #1 mistake I see in career changers: they try to hide the pivot instead of owning the narrative. Your unique path IS the selling point.",
    timestamp: "2d ago",
    likes: 178,
    comments: 22,
    liked: false,
  },
  {
    id: "p11",
    author: { name: "Raj S.", initial: "R", role: "edgepreneur", avatarColor: "var(--ce-role-edgepreneur)" },
    type: "update",
    content: "Just shipped v1 of my portfolio site using the feedback from this group. The before/after is night and day. Sharing the case study soon.",
    timestamp: "3d ago",
    likes: 42,
    comments: 7,
    liked: false,
  },
  {
    id: "p12",
    author: { name: "Global Talent Hub", initial: "G", role: "ngo", avatarColor: "var(--ce-role-employer)" },
    type: "achievement",
    content: "We just crossed 1,000 professionals matched through our international talent program. Each match represents a career transformed. Here's to the next thousand.",
    timestamp: "3d ago",
    likes: 315,
    comments: 44,
    liked: false,
  },
];

const GROUPS: Group[] = [
  { id: "g1", name: "UX/UI Designers",            memberCount: 234, category: "Design",         activity: "hot",    description: "Portfolio reviews, design challenges, and career advice for UX/UI professionals.",              joined: true,  isCoachLed: false },
  { id: "g2", name: "International Professionals", memberCount: 189, category: "Immigration",    activity: "active", description: "Support and resources for navigating work visas, credentials, and cultural transitions.",         joined: true,  isCoachLed: false },
  { id: "g3", name: "Tech Interview Prep",         memberCount: 312, category: "Career",         activity: "hot",    description: "Daily coding challenges, mock interviews, and system design practice for tech roles.",           joined: false, isCoachLed: false },
  { id: "g4", name: "Career Changers Over 30",     memberCount: 156, category: "Community",      activity: "active", description: "Late-career pivots, transferable skills, and proving that age is just a number.",                 joined: false, isCoachLed: false },
  { id: "g5", name: "Coach Maria's Growth Lab",    memberCount: 45,  category: "Coaching",       activity: "active", description: "Exclusive group for Coach Maria's clients — weekly prompts, AMAs, and peer accountability.",      joined: true,  isCoachLed: true  },
  { id: "g6", name: "Nigerian Professionals Network", memberCount: 278, category: "Regional",    activity: "hot",    description: "Connecting Nigerian professionals worldwide — jobs, mentorship, and community events.",          joined: false, isCoachLed: false },
];

const EVENTS: CommunityEvent[] = [
  { id: "ev1", title: "AI Career Fair 2026",                  date: "March 30, 2026", time: "10:00 AM – 4:00 PM",  location: "Virtual",                     attendees: 234, capacity: 500, rsvpd: true,  virtual: true  },
  { id: "ev2", title: "Resume Workshop with Coach Maria",     date: "April 2, 2026",  time: "2:00 PM – 4:00 PM",   location: "Downtown Co-working Space",   attendees: 18,  capacity: 25,  rsvpd: false, virtual: false },
  { id: "ev3", title: "EdgePath Demo Day",                    date: "April 5, 2026",  time: "1:00 PM – 3:00 PM",   location: "Virtual",                     attendees: 156, capacity: 200, rsvpd: false, virtual: true  },
  { id: "ev4", title: "Networking Mixer: Tech Startups",      date: "April 8, 2026",  time: "6:00 PM – 8:30 PM",   location: "Startup Hub, 3rd Floor",      attendees: 45,  capacity: 60,  rsvpd: true,  virtual: false },
  { id: "ev5", title: "Mock Interview Marathon",              date: "April 12, 2026", time: "9:00 AM – 12:00 PM",  location: "Virtual",                     attendees: 89,  capacity: 100, rsvpd: false, virtual: true  },
];

// ─── Building step config ────────────────────────────────────────────────────

const INTEREST_PILLS = ["Industry Groups", "Career Stage Peers", "Local Professionals", "Coach-Led Communities"];
const ENGAGE_PILLS   = ["Lurk & Learn", "Active Contributor", "Looking for Connections"];

// ─── Main Surface ────────────────────────────────────────────────────────────

export function CommunitySurface({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const navigate = useNavigate();
  const params = useParams();

  // State machine
  const stored = typeof window !== "undefined" ? localStorage.getItem("ce-community-data") : null;
  const [surfaceState, setSurfaceState] = useState<SurfaceState>(stored ? "active" : "empty");

  // Building state
  const [buildStep, setBuildStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedEngage, setSelectedEngage] = useState<string | null>(null);

  // Active state
  const [activeTab, setActiveTab] = useState<ActiveTab>("feed");
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);
  const [groups, setGroups] = useState<Group[]>(GROUPS);
  const [events, setEvents] = useState<CommunityEvent[]>(EVENTS);

  const accent = "var(--ce-cyan)";

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleJoinCommunity = () => {
    setSurfaceState("building");
    setBuildStep(1);
  };

  const handleBuildNext = () => {
    if (buildStep === 1 && selectedInterests.length === 0) {
      toast.error("Select at least one interest");
      return;
    }
    if (buildStep === 2) {
      localStorage.setItem("ce-community-data", JSON.stringify({ interests: selectedInterests, engage: selectedEngage }));
      setSurfaceState("active");
      toast.success("Welcome to the community!");
      return;
    }
    setBuildStep(2);
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleToggleGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const next = !g.joined;
      toast.success(next ? `Joined ${g.name}!` : `Left ${g.name}`);
      return { ...g, joined: next, memberCount: next ? g.memberCount + 1 : g.memberCount - 1 };
    }));
  };

  const handleToggleRsvp = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const next = !e.rsvpd;
      if (next) toast.success(`RSVP'd to ${e.title}!`);
      else toast.success(`Cancelled RSVP for ${e.title}`);
      return { ...e, rsvpd: next, attendees: next ? e.attendees + 1 : e.attendees - 1 };
    }));
  };

  const handleCompose = () => {
    toast("Compose coming soon", "This feature is being built.");
  };

  // ─── Empty State ─────────────────────────────────────────────────────────

  if (surfaceState === "empty") {
    return (
      <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
        <div className="px-6 py-8 max-w-2xl mx-auto">
          <SophiaInsight
            variant="inline"
            message="I'll connect you with the right communities for your career stage."
          />

          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
            >
              <Users className="w-6 h-6 text-[var(--ce-text-tertiary)]" />
            </div>
            <h2
              className="text-[15px] text-[var(--ce-text-primary)] mb-1.5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Your Professional Community
            </h2>
            <p
              className="text-[12px] text-[var(--ce-text-tertiary)] mb-6 max-w-[280px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Connect, share, and grow with peers in your field.
            </p>
            <button
              onClick={handleJoinCommunity}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.97]"
              style={{
                background: `rgba(var(--ce-cyan-rgb),0.12)`,
                border: `1px solid rgba(var(--ce-cyan-rgb),0.25)`,
                color: accent,
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              <Users className="w-3.5 h-3.5" />
              Join the Community
            </button>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Building State ──────────────────────────────────────────────────────

  if (surfaceState === "building") {
    return (
      <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
        <div className="px-6 py-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map(step => (
                <div key={step} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: accent }}
                    initial={{ width: 0 }}
                    animate={{ width: buildStep >= step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </div>
              ))}
            </div>

            {/* Sophia card */}
            <GlassCard className="p-5 mb-6">
              <div className="flex items-start gap-3">
                <SophiaMark size={20} glowing />
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {buildStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p
                          className="text-[13px] text-[var(--ce-text-primary)] mb-4"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          What communities interest you?
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {INTEREST_PILLS.map(pill => {
                            const selected = selectedInterests.includes(pill);
                            return (
                              <button
                                key={pill}
                                onClick={() => setSelectedInterests(prev =>
                                  selected ? prev.filter(p => p !== pill) : [...prev, pill]
                                )}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                                style={{
                                  background: selected ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
                                  border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
                                  color: selected ? accent : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                }}
                              >
                                {selected && <Check className="w-3 h-3" />}
                                {pill}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {buildStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p
                          className="text-[13px] text-[var(--ce-text-primary)] mb-4"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          How do you like to engage?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ENGAGE_PILLS.map(pill => {
                            const selected = selectedEngage === pill;
                            return (
                              <button
                                key={pill}
                                onClick={() => setSelectedEngage(pill)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                                style={{
                                  background: selected ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
                                  border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
                                  color: selected ? accent : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                }}
                              >
                                {selected && <Check className="w-3 h-3" />}
                                {pill}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <SophiaMark size={12} glowing={false} />
                          <span
                            className="text-[11px] text-[var(--ce-text-tertiary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            I'll set up your feed based on your EdgePath focus area.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {buildStep > 1 ? (
                <button
                  onClick={() => setBuildStep(buildStep - 1)}
                  className="text-[12px] text-[var(--ce-text-secondary)] cursor-pointer hover:text-[var(--ce-text-primary)] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Back
                </button>
              ) : <div />}
              <button
                onClick={handleBuildNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  background: `rgba(var(--ce-cyan-rgb),0.12)`,
                  border: `1px solid rgba(var(--ce-cyan-rgb),0.25)`,
                  color: accent,
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                }}
              >
                {buildStep === 2 ? "Finish setup" : "Continue"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Active State ────────────────────────────────────────────────────────

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "feed",   label: "Feed" },
    { id: "groups", label: "Groups" },
    { id: "events", label: "Events" },
  ];

  const joinedGroups = groups.filter(g => g.joined);
  const discoverGroups = groups.filter(g => !g.joined);

  return (
    <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center gap-2 mb-1">
            <SophiaMark size={14} glowing={false} />
            <span
              className="text-[11px] text-[var(--ce-text-tertiary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Your community — feed, groups, and events.
            </span>
          </div>
        </motion.div>

        {/* Tab bar */}
        <div
          className="flex items-center gap-1 p-0.5 rounded-lg mb-5"
          style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-md text-[11px] cursor-pointer transition-all text-center"
              style={{
                background: activeTab === tab.id ? "rgba(var(--ce-cyan-rgb),0.1)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(var(--ce-cyan-rgb),0.2)" : "1px solid transparent",
                color: activeTab === tab.id ? accent : "var(--ce-text-tertiary)",
                fontFamily: "var(--font-display)",
                fontWeight: activeTab === tab.id ? 500 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cross-surface chips */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => toast("Opening Sophia...", "Find a study buddy or accountability partner.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            style={{
              border: "1px solid rgba(var(--ce-glass-tint),0.08)",
              color: "var(--ce-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Sparkles className="w-3 h-3 text-ce-cyan" />
            Find a buddy
          </button>
          <button
            onClick={() => onNavigate?.("schedule")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            style={{
              border: "1px solid rgba(var(--ce-glass-tint),0.08)",
              color: "var(--ce-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Calendar className="w-3 h-3" />
            My schedule
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ─── Feed Tab ─────────────────────────────────────────────────── */}
          {activeTab === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Sophia insight */}
              <SophiaInsight
                variant="compact"
                message="Your EdgePath cohort posted 5 new updates this week."
              />

              <div className="mt-4 flex flex-col gap-3">
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE, delay: i * 0.03 }}
                  >
                    <GlassCard className="p-4">
                      {/* Author row */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: post.author.avatarColor }}
                        >
                          <span className="text-[11px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                            {post.author.initial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[12px] text-[var(--ce-text-primary)] truncate"
                              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                            >
                              {post.author.name}
                            </span>
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full"
                              style={{
                                background: "rgba(var(--ce-glass-tint),0.06)",
                                color: "var(--ce-text-quaternary)",
                                fontFamily: "var(--font-body)",
                              }}
                            >
                              {post.author.role}
                            </span>
                          </div>
                          <span
                            className="text-[10px] text-[var(--ce-text-quaternary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {post.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Type badge */}
                      <div className="mb-2">
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full inline-block"
                          style={{
                            background: `${POST_TYPE_CONFIG[post.type].color}12`,
                            color: POST_TYPE_CONFIG[post.type].color,
                            border: `1px solid ${POST_TYPE_CONFIG[post.type].color}20`,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {POST_TYPE_CONFIG[post.type].label}
                        </span>
                      </div>

                      {/* Content */}
                      <p
                        className="text-[12px] text-[var(--ce-text-secondary)] leading-relaxed mb-3"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {post.content}
                      </p>

                      {/* Image placeholder */}
                      {post.image && (
                        <div
                          className="w-full h-32 rounded-lg mb-3 flex items-center justify-center"
                          style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
                        >
                          <span
                            className="text-[10px] text-[var(--ce-text-quaternary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {post.image}
                          </span>
                        </div>
                      )}

                      {/* Action row */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className="flex items-center gap-1.5 text-[11px] cursor-pointer transition-colors"
                          style={{
                            color: post.liked ? "var(--ce-status-error)" : "var(--ce-text-quaternary)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          <Heart className="w-3.5 h-3.5" style={{ fill: post.liked ? "var(--ce-status-error)" : "none" }} />
                          {post.likes}
                        </button>
                        <button
                          onClick={() => toast("Comments coming soon")}
                          className="flex items-center gap-1.5 text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer hover:text-[var(--ce-text-secondary)] transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {post.comments}
                        </button>
                        <button
                          onClick={() => toast("Share coming soon")}
                          className="flex items-center gap-1.5 text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer hover:text-[var(--ce-text-secondary)] transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Floating compose button */}
              <motion.button
                onClick={handleCompose}
                className="fixed bottom-20 right-6 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-40"
                style={{
                  background: accent,
                  color: "var(--ce-bg)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* ─── Groups Tab ───────────────────────────────────────────────── */}
          {activeTab === "groups" && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Your Groups */}
              {joinedGroups.length > 0 && (
                <>
                  <h3
                    className="text-[13px] text-[var(--ce-text-primary)] mb-3"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Your Groups
                  </h3>
                  <div className="flex flex-col gap-3 mb-6">
                    {joinedGroups.map((group, i) => (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                      >
                        <GroupCard group={group} onToggle={handleToggleGroup} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Discover */}
              {discoverGroups.length > 0 && (
                <>
                  <h3
                    className="text-[13px] text-[var(--ce-text-primary)] mb-3"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Discover
                  </h3>
                  <div className="flex flex-col gap-3">
                    {discoverGroups.map((group, i) => (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                      >
                        <GroupCard group={group} onToggle={handleToggleGroup} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ─── Events Tab ───────────────────────────────────────────────── */}
          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Sophia insight */}
              <SophiaInsight
                variant="compact"
                message="2 events match your interests this month."
              />

              <div className="mt-4 flex flex-col gap-3">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE, delay: i * 0.04 }}
                  >
                    <GlassCard className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className="text-[13px] text-[var(--ce-text-primary)] flex-1 min-w-0 pr-3"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          {event.title}
                        </h4>
                        {event.virtual && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                            style={{
                              background: "rgba(var(--ce-cyan-rgb),0.08)",
                              color: accent,
                              border: "1px solid rgba(var(--ce-cyan-rgb),0.15)",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            <Video className="w-2.5 h-2.5" />
                            Virtual
                          </span>
                        )}
                      </div>

                      {/* Date, time, location */}
                      <div className="flex flex-col gap-1 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                          <span
                            className="text-[11px] text-[var(--ce-text-secondary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {event.date} &middot; {event.time}
                          </span>
                        </div>
                        {!event.virtual && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                            <span
                              className="text-[11px] text-[var(--ce-text-secondary)]"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Capacity bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-[10px] text-[var(--ce-text-tertiary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {event.attendees} / {event.capacity} attending
                          </span>
                          <span
                            className="text-[10px] text-[var(--ce-text-quaternary)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {Math.round((event.attendees / event.capacity) * 100)}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min((event.attendees / event.capacity) * 100, 100)}%`,
                              background: accent,
                            }}
                          />
                        </div>
                      </div>

                      {/* RSVP button */}
                      <button
                        onClick={() => handleToggleRsvp(event.id)}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.98]"
                        style={{
                          background: event.rsvpd ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-cyan-rgb),0.08)",
                          border: event.rsvpd ? "1px solid rgba(var(--ce-lime-rgb),0.2)" : "1px solid rgba(var(--ce-cyan-rgb),0.15)",
                          color: event.rsvpd ? "var(--ce-lime)" : accent,
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}
                      >
                        {event.rsvpd ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            RSVP'd
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            RSVP
                          </>
                        )}
                      </button>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RoleShell>
  );
}

// ─── Group Card Component ────────────────────────────────────────────────────

function GroupCard({ group, onToggle }: { group: Group; onToggle: (id: string) => void }) {
  const actCfg = ACTIVITY_CONFIG[group.activity];

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="text-[13px] text-[var(--ce-text-primary)] truncate"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {group.name}
            </h4>
            {group.isCoachLed && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                style={{
                  background: "rgba(var(--ce-role-guide-rgb),0.1)",
                  color: "var(--ce-role-guide)",
                  border: "1px solid rgba(var(--ce-role-guide-rgb),0.2)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Crown className="w-2.5 h-2.5" />
                Coach-Led
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] text-[var(--ce-text-tertiary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {group.memberCount} members
            </span>
            <span className="text-[var(--ce-text-quaternary)]">&middot;</span>
            <div className="flex items-center gap-1">
              <Circle
                className="w-2 h-2"
                style={{ fill: actCfg.color, color: actCfg.color }}
              />
              <span
                className="text-[10px]"
                style={{ color: actCfg.color, fontFamily: "var(--font-body)" }}
              >
                {actCfg.label}
              </span>
            </div>
            <span className="text-[var(--ce-text-quaternary)]">&middot;</span>
            <span
              className="text-[10px] text-[var(--ce-text-quaternary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {group.category}
            </span>
          </div>
          <p
            className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {group.description}
          </p>
        </div>

        <button
          onClick={() => onToggle(group.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.97] flex-shrink-0"
          style={{
            background: group.joined ? "rgba(var(--ce-lime-rgb),0.08)" : "rgba(var(--ce-cyan-rgb),0.08)",
            border: group.joined ? "1px solid rgba(var(--ce-lime-rgb),0.15)" : "1px solid rgba(var(--ce-cyan-rgb),0.15)",
            color: group.joined ? "var(--ce-lime)" : "var(--ce-cyan)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
        >
          {group.joined ? (
            <>
              <Check className="w-3 h-3" />
              Joined
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Join
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}

export default CommunitySurface;
