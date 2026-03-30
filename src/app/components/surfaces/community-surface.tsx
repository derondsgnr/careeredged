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
  Circle, Flame, Copy, Link2, MessageCircle,
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

// ─── Mock Comments ──────────────────────────────────────────────────────────

interface Comment {
  id: string;
  author: { name: string; initial: string; avatarColor: string };
  text: string;
  timestamp: string;
}

const MOCK_COMMENTS: Record<string, Comment[]> = {
  p1: [
    { id: "c1a", author: { name: "James L.", initial: "J", avatarColor: "var(--ce-role-edu)" }, text: "Congrats Sarah! This is so inspiring. What was the biggest challenge during your job search?", timestamp: "1h ago" },
    { id: "c1b", author: { name: "Coach Maria", initial: "M", avatarColor: "var(--ce-role-guide)" }, text: "So proud of you! The mock interviews really paid off.", timestamp: "45m ago" },
    { id: "c1c", author: { name: "Nina R.", initial: "N", avatarColor: "var(--ce-role-edgestar)" }, text: "Amazing! Which EdgePath track were you on?", timestamp: "30m ago" },
  ],
  p2: [
    { id: "c2a", author: { name: "Priya M.", initial: "P", avatarColor: "var(--ce-role-edgepreneur)" }, text: "I made this exact transition! Happy to chat about it. The product sense interviews were the hardest part.", timestamp: "3h ago" },
    { id: "c2b", author: { name: "Alex T.", initial: "A", avatarColor: "var(--ce-role-ngo)" }, text: "Google's PM certificate on Coursera was genuinely useful. Skip the expensive bootcamps.", timestamp: "2h ago" },
    { id: "c2c", author: { name: "Coach Ben", initial: "B", avatarColor: "var(--ce-role-guide)" }, text: "Your storytelling skills from marketing are a huge advantage in PM interviews. Lean into that.", timestamp: "1h ago" },
  ],
  p3: [
    { id: "c3a", author: { name: "David P.", initial: "D", avatarColor: "var(--ce-role-parent)" }, text: "This is exactly what I needed. My interview is next month. Bookmarked!", timestamp: "5h ago" },
    { id: "c3b", author: { name: "Fatima A.", initial: "F", avatarColor: "var(--ce-role-ngo)" }, text: "Can you share more about the document prep timeline? When did you start gathering everything?", timestamp: "4h ago" },
  ],
  p4: [
    { id: "c4a", author: { name: "Nina R.", initial: "N", avatarColor: "var(--ce-role-edgestar)" }, text: "Count me in! I've been wanting to build a daily design habit.", timestamp: "7h ago" },
    { id: "c4b", author: { name: "Sarah K.", initial: "S", avatarColor: "var(--ce-role-edgestar)" }, text: "Great idea! I did a similar challenge last year and it transformed my portfolio.", timestamp: "6h ago" },
  ],
  p5: [
    { id: "c5a", author: { name: "James L.", initial: "J", avatarColor: "var(--ce-role-edu)" }, text: "This matches what I'm seeing in the market. Location-agnostic is the future.", timestamp: "10h ago" },
    { id: "c5b", author: { name: "Raj S.", initial: "R", avatarColor: "var(--ce-role-edgepreneur)" }, text: "How does this affect negotiation strategy? Should we still anchor to local market rates?", timestamp: "8h ago" },
    { id: "c5c", author: { name: "Priya M.", initial: "P", avatarColor: "var(--ce-role-edgepreneur)" }, text: "Would love a deep dive on this in your next coaching session!", timestamp: "6h ago" },
  ],
};

const BUDDY_MATCHES = [
  { name: "Lena K.", initial: "L", role: "UX Designer", avatarColor: "var(--ce-role-edgestar)", match: 92 },
  { name: "Marcus W.", initial: "M", role: "Career Changer", avatarColor: "var(--ce-role-edu)", match: 87 },
  { name: "Aisha N.", initial: "A", role: "Frontend Dev", avatarColor: "var(--ce-role-edgepreneur)", match: 85 },
  { name: "Tom R.", initial: "T", role: "PM Aspirant", avatarColor: "var(--ce-role-ngo)", match: 81 },
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

  // Compose modal
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeType, setComposeType] = useState<PostType>("update");

  // Comment drawer
  const [commentingPost, setCommentingPost] = useState<FeedPost | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(MOCK_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");

  // Buddy modal
  const [showBuddyModal, setShowBuddyModal] = useState(false);

  // Share popover
  const [sharingPost, setSharingPost] = useState<string | null>(null);

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
    setComposeText("");
    setComposeType("update");
    setShowCompose(true);
  };

  const handlePublishPost = () => {
    if (!composeText.trim()) return;
    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      author: { name: "You", initial: "Y", role: (role as string) || "edgestar", avatarColor: "var(--ce-cyan)" },
      type: composeType,
      content: composeText.trim(),
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setShowCompose(false);
    setComposeText("");
    toast.success("Post published");
  };

  const handleAddComment = () => {
    if (!commentingPost || !newCommentText.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: { name: "You", initial: "Y", avatarColor: "var(--ce-cyan)" },
      text: newCommentText.trim(),
      timestamp: "Just now",
    };
    setPostComments(prev => ({
      ...prev,
      [commentingPost.id]: [...(prev[commentingPost.id] || []), newComment],
    }));
    setPosts(prev => prev.map(p =>
      p.id === commentingPost.id ? { ...p, comments: p.comments + 1 } : p
    ));
    setNewCommentText("");
  };

  const handleCopyLink = (postId: string) => {
    navigator.clipboard.writeText(`https://careeredge.com/community/post/${postId}`);
    toast.success("Link copied");
    setSharingPost(null);
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
            onClick={() => setShowBuddyModal(true)}
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
                          onClick={() => { setCommentingPost(post); setNewCommentText(""); }}
                          className="flex items-center gap-1.5 text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer hover:text-[var(--ce-text-secondary)] transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {post.comments}
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setSharingPost(sharingPost === post.id ? null : post.id)}
                            className="flex items-center gap-1.5 text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer hover:text-[var(--ce-text-secondary)] transition-colors"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <AnimatePresence>
                            {sharingPost === post.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: EASE }}
                                className="absolute bottom-full left-0 mb-2 w-48 rounded-xl overflow-hidden z-50"
                                style={{
                                  background: "rgba(var(--ce-glass-tint),0.06)",
                                  backdropFilter: "blur(24px)",
                                  WebkitBackdropFilter: "blur(24px)",
                                  border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                                }}
                              >
                                <button
                                  onClick={() => handleCopyLink(post.id)}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] text-[var(--ce-text-secondary)] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy link
                                </button>
                                <button
                                  onClick={() => { onNavigate?.("messages"); setSharingPost(null); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] text-[var(--ce-text-secondary)] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  Share to Messages
                                </button>
                                <button
                                  onClick={() => { toast.success("Shared to your EdgePath timeline"); setSharingPost(null); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] text-[var(--ce-text-secondary)] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors text-left"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                  Share to EdgePath
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
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

        {/* Click-outside handler for share popover */}
        {sharingPost && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setSharingPost(null)}
          />
        )}

        {/* ─── Compose Modal ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showCompose && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                onClick={() => setShowCompose(false)}
              />
              <motion.div
                className="relative w-full max-w-[500px] mx-4 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                }}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                  <h3
                    className="text-[14px] text-[var(--ce-text-primary)]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Create Post
                  </h3>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.08)] transition-colors"
                  >
                    <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
                  </button>
                </div>

                {/* Post type selector */}
                <div className="px-5 pt-4 pb-2 flex flex-wrap gap-1.5">
                  {(Object.keys(POST_TYPE_CONFIG) as PostType[]).map(type => {
                    const cfg = POST_TYPE_CONFIG[type];
                    const selected = composeType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setComposeType(type)}
                        className="px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-all"
                        style={{
                          background: selected ? `${cfg.color}18` : "rgba(var(--ce-glass-tint),0.04)",
                          border: selected ? `1px solid ${cfg.color}30` : "1px solid rgba(var(--ce-glass-tint),0.08)",
                          color: selected ? cfg.color : "var(--ce-text-tertiary)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Textarea */}
                <div className="px-5 py-3">
                  <textarea
                    autoFocus
                    value={composeText}
                    onChange={e => setComposeText(e.target.value.slice(0, 500))}
                    placeholder="Share something with the community..."
                    className="w-full h-32 resize-none rounded-xl px-4 py-3 text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{
                      background: "rgba(var(--ce-glass-tint),0.04)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                  <div className="flex justify-end mt-1">
                    <span
                      className="text-[10px]"
                      style={{
                        color: composeText.length > 450 ? "var(--ce-status-warning)" : "var(--ce-text-quaternary)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {composeText.length}/500
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 px-5 py-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                    style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishPost}
                    disabled={!composeText.trim()}
                    className="px-4 py-2 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.97] disabled:opacity-70 disabled:cursor-default"
                    style={{
                      background: composeText.trim() ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
                      border: `1px solid ${composeText.trim() ? "rgba(var(--ce-cyan-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.08)"}`,
                      color: composeText.trim() ? accent : "var(--ce-text-quaternary)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                    }}
                  >
                    Post
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Buddy Modal ────────────────────────────────────────────── */}
        <AnimatePresence>
          {showBuddyModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                onClick={() => setShowBuddyModal(false)}
              />
              <motion.div
                className="relative w-full max-w-[400px] mx-4 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                }}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-[14px] text-[var(--ce-text-primary)]"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      Find a Buddy
                    </h3>
                    <SophiaMark size={14} glowing />
                  </div>
                  <button
                    onClick={() => setShowBuddyModal(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.08)] transition-colors"
                  >
                    <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
                  </button>
                </div>

                {/* Sophia message */}
                <div className="px-5 pt-4 pb-2">
                  <p
                    className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Based on your goals, here are people at a similar career stage.
                  </p>
                </div>

                {/* Match cards */}
                <div className="px-5 py-3 flex flex-col gap-2.5">
                  {BUDDY_MATCHES.map((buddy, i) => (
                    <motion.div
                      key={buddy.name}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background: "rgba(var(--ce-glass-tint),0.04)",
                        border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                      }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, ease: EASE, delay: i * 0.06 }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: buddy.avatarColor }}
                      >
                        <span className="text-[11px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {buddy.initial}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[12px] text-[var(--ce-text-primary)] block truncate"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          {buddy.name}
                        </span>
                        <span
                          className="text-[10px] text-[var(--ce-text-tertiary)]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {buddy.role}
                        </span>
                      </div>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "rgba(var(--ce-lime-rgb),0.08)",
                          color: "var(--ce-lime)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {buddy.match}% match
                      </span>
                      <button
                        onClick={() => {
                          toast.success("Request sent", "You'll hear back within 24 hours.");
                          setShowBuddyModal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all active:scale-[0.97] flex-shrink-0"
                        style={{
                          background: "rgba(var(--ce-cyan-rgb),0.1)",
                          border: "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                          color: accent,
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}
                      >
                        Connect
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="h-4" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Comment Drawer ─────────────────────────────────────────── */}
        <AnimatePresence>
          {commentingPost && (
            <motion.div
              className="fixed inset-0 z-50 flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.4)" }}
                onClick={() => setCommentingPost(null)}
              />
              <motion.div
                className="relative w-full max-w-[400px] h-full flex flex-col"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.03)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  borderLeft: "1px solid rgba(var(--ce-glass-tint),0.1)",
                }}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                  <h3
                    className="text-[14px] text-[var(--ce-text-primary)]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Comments
                  </h3>
                  <button
                    onClick={() => setCommentingPost(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.08)] transition-colors"
                  >
                    <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
                  </button>
                </div>

                {/* Original post summary */}
                <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: commentingPost.author.avatarColor }}
                    >
                      <span className="text-[9px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                        {commentingPost.author.initial}
                      </span>
                    </div>
                    <span
                      className="text-[11px] text-[var(--ce-text-primary)]"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {commentingPost.author.name}
                    </span>
                  </div>
                  <p
                    className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed line-clamp-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {commentingPost.content}
                  </p>
                </div>

                {/* Comments list */}
                <div className="flex-1 overflow-y-auto px-5 py-3">
                  {(postComments[commentingPost.id] || []).length === 0 ? (
                    <p
                      className="text-[11px] text-[var(--ce-text-quaternary)] text-center py-8"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      No comments yet. Be the first!
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {(postComments[commentingPost.id] || []).map((comment, i) => (
                        <motion.div
                          key={comment.id}
                          className="flex gap-2.5"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease: EASE, delay: i * 0.04 }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: comment.author.avatarColor }}
                          >
                            <span className="text-[9px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                              {comment.author.initial}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className="text-[11px] text-[var(--ce-text-primary)]"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                              >
                                {comment.author.name}
                              </span>
                              <span
                                className="text-[9px] text-[var(--ce-text-quaternary)]"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                {comment.timestamp}
                              </span>
                            </div>
                            <p
                              className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {comment.text}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment input */}
                <div className="px-5 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && newCommentText.trim()) handleAddComment(); }}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 rounded-lg text-[11px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                      style={{
                        background: "rgba(var(--ce-glass-tint),0.04)",
                        border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newCommentText.trim()}
                      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-[0.95] disabled:opacity-70 disabled:cursor-default"
                      style={{
                        background: newCommentText.trim() ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
                        border: `1px solid ${newCommentText.trim() ? "rgba(var(--ce-cyan-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.08)"}`,
                      }}
                    >
                      <Send className="w-3.5 h-3.5" style={{ color: newCommentText.trim() ? accent : "var(--ce-text-quaternary)" }} />
                    </button>
                  </div>
                </div>
              </motion.div>
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
