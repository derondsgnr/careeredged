/**
 * EdgeGroup Detail — individual group view
 *
 * Four tabs:
 * - Discussion — threaded posts (reuses feed card pattern, scoped to group)
 * - Members — avatar grid with quick message / view profile
 * - Resources — pinned files and links (coach-led groups get richer content)
 * - Events — upcoming group events with RSVP → Sessions surface
 *
 * Header: cover banner, name, description, activity badge, join/leave.
 * If Professional group + not Edge Plus → redirect to paywall via EdgeGroups list.
 *
 * Routes:
 *   /:role/edge-groups/:groupId
 *   /:role/edge-groups/pro/:groupId
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { EdgePlusPaywall } from "../edge-plus-paywall";
import { useEdgePlus } from "../use-edge-plus";
import { toast } from "../ui/feedback";
import { EASE } from "../tokens";
import {
  ArrowLeft, Users as UsersIcon, MessageCircle, FileText, Calendar,
  Globe, Lock, Crown, Heart, Share2, MoreHorizontal, MessageSquare,
  Check, X, Download, ExternalLink, Plus, Send, MapPin, Clock,
  MessagesSquare, Pin,
  type LucideIcon,
} from "lucide-react";

type TabId = "discussion" | "chat" | "members" | "resources" | "events";

interface ChatMessage {
  id: string;
  author: { name: string; initial: string; color: string; isCoach?: boolean; isSelf?: boolean };
  content: string;
  time: string;
  pinned?: boolean;
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activity: "hot" | "active" | "quiet";
  isProfessional: boolean;
  coachName?: string;
  coachInitial?: string;
  coachColor?: string;
  priceLabel?: string;
  coverGradient: string;
}

interface DiscussionPost {
  id: string;
  author: { name: string; initial: string; color: string; isCoach?: boolean };
  content: string;
  time: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface Member {
  name: string;
  initial: string;
  role: string;
  color: string;
  isAdmin?: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link" | "template";
  size?: string;
  addedBy: string;
  addedAt: string;
}

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  virtual: boolean;
  attendees: number;
  capacity: number;
  rsvpd: boolean;
}

// Mock directory — in a real app this would come from a data layer
const GROUP_DIRECTORY: Record<string, GroupData> = {
  "g-ux": {
    id: "g-ux", name: "UX/UI Designers",
    description: "Portfolio reviews, design challenges, and career advice for UX/UI professionals.",
    memberCount: 234, activity: "hot", isProfessional: false,
    coverGradient: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.04))",
  },
  "g-imm": {
    id: "g-imm", name: "International Professionals",
    description: "Support and resources for navigating work visas, credentials, and cultural transitions.",
    memberCount: 189, activity: "active", isProfessional: false,
    coverGradient: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.04))",
  },
  "g-tip": {
    id: "g-tip", name: "Tech Interview Prep",
    description: "Daily coding challenges, mock interviews, and system design practice for tech roles.",
    memberCount: 312, activity: "hot", isProfessional: false,
    coverGradient: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.04))",
  },
  "g-cco": {
    id: "g-cco", name: "Career Changers Over 30",
    description: "Late-career pivots, transferable skills, and proving that age is just a number.",
    memberCount: 156, activity: "active", isProfessional: false,
    coverGradient: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.04))",
  },
  "g-founders": {
    id: "g-founders", name: "First-Time Founders",
    description: "Validated-idea to first-dollar. Weekly calls, co-working sessions, and honest founder talk.",
    memberCount: 78, activity: "active", isProfessional: false,
    coverGradient: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.04))",
  },
  "g-nin": {
    id: "g-nin", name: "Nigerian Professionals Network",
    description: "Connecting Nigerian professionals worldwide — jobs, mentorship, and community events.",
    memberCount: 278, activity: "hot", isProfessional: false,
    coverGradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.04))",
  },
  "pg-dh": {
    id: "pg-dh", name: "Digital Health Professional Group",
    description: "All things Digital Health — from startups to enterprise deployments.",
    memberCount: 142, activity: "hot", isProfessional: true,
    coachName: "John Adeoye", coachInitial: "JA", coachColor: "var(--ce-role-guide)", priceLabel: "$25/mo",
    coverGradient: "linear-gradient(135deg, rgba(34,211,238,0.28), rgba(139,92,246,0.14))",
  },
  "pg-vc": {
    id: "pg-vc", name: "Venture Capitalist",
    description: "Fund managers, LP relations, and deal flow for new and experienced VCs.",
    memberCount: 28, activity: "active", isProfessional: true,
    coachName: "EdgeCoach", coachInitial: "E", coachColor: "var(--ce-role-edgepreneur)", priceLabel: "$500/mo",
    coverGradient: "linear-gradient(135deg, rgba(245,158,11,0.28), rgba(34,211,238,0.14))",
  },
  "pg-pharma": {
    id: "pg-pharma", name: "Pharma ACE Clinical Research",
    description: "Breaking into Clinical research industry as a CRA or CTM.",
    memberCount: 86, activity: "active", isProfessional: true,
    coachName: "Haywhy", coachInitial: "H", coachColor: "var(--ce-role-guide)", priceLabel: "$500/mo",
    coverGradient: "linear-gradient(135deg, rgba(179,255,59,0.2), rgba(34,211,238,0.14))",
  },
  "pg-cr": {
    id: "pg-cr", name: "Clinical Research Professional Group",
    description: "CRA and CRO Training with hands-on case studies and weekly office hours.",
    memberCount: 312, activity: "hot", isProfessional: true,
    coachName: "John Adeoye", coachInitial: "JA", coachColor: "var(--ce-role-guide)", priceLabel: "Free",
    coverGradient: "linear-gradient(135deg, rgba(34,211,238,0.28), rgba(179,255,59,0.14))",
  },
};

// ─── Mock content ────────────────────────────────────────────────────────────

const MOCK_DISCUSSION: DiscussionPost[] = [
  {
    id: "d1",
    author: { name: "Coach Maria", initial: "M", color: "var(--ce-role-guide)", isCoach: true },
    content: "Welcome everyone! This week's focus: portfolio storytelling. Share a link to one of your case studies and I'll pick 3 to review in our Friday call.",
    time: "2h ago",
    likes: 24,
    comments: 8,
    liked: true,
  },
  {
    id: "d2",
    author: { name: "Sarah K.", initial: "S", color: "var(--ce-role-edgestar)" },
    content: "Sharing my latest case study on a fintech onboarding redesign — would love feedback on the narrative arc. https://sarahk.design/onboarding",
    time: "5h ago",
    likes: 12,
    comments: 15,
    liked: false,
  },
  {
    id: "d3",
    author: { name: "James L.", initial: "J", color: "var(--ce-role-edu)" },
    content: "Has anyone used the Notion template Coach Maria shared last week? Looking for examples of how to structure the problem statement.",
    time: "1d ago",
    likes: 6,
    comments: 11,
    liked: false,
  },
];

const MOCK_MEMBERS: Member[] = [
  { name: "Coach Maria",  initial: "M", role: "Design Coach",     color: "var(--ce-role-guide)",       isAdmin: true },
  { name: "Sarah K.",     initial: "S", role: "Senior Designer",  color: "var(--ce-role-edgestar)" },
  { name: "James L.",     initial: "J", role: "Career Changer",   color: "var(--ce-role-edu)" },
  { name: "Priya M.",     initial: "P", role: "Product Designer", color: "var(--ce-role-edgepreneur)" },
  { name: "Marcus W.",    initial: "M", role: "UX Researcher",    color: "var(--ce-role-edgestar)" },
  { name: "Aisha N.",     initial: "A", role: "Frontend + Design",color: "var(--ce-role-ngo)" },
  { name: "Nina R.",      initial: "N", role: "Design Student",   color: "var(--ce-role-edu)" },
  { name: "Tunde O.",     initial: "T", role: "Design Lead",      color: "var(--ce-role-edgestar)" },
];

const MOCK_RESOURCES: Resource[] = [
  { id: "r1", title: "Portfolio Narrative Template",        type: "template", size: "12 KB",  addedBy: "Coach Maria", addedAt: "2d ago" },
  { id: "r2", title: "Case Study Writing Guide (PDF)",       type: "pdf",      size: "1.2 MB", addedBy: "Coach Maria", addedAt: "5d ago" },
  { id: "r3", title: "Recording: Portfolio Review Call",    type: "video",    size: "45 min", addedBy: "Coach Maria", addedAt: "1w ago" },
  { id: "r4", title: "Figma Community Link — UX Patterns",  type: "link",     addedBy: "Sarah K.",    addedAt: "1w ago" },
];

const MOCK_EVENTS: GroupEvent[] = [
  { id: "e1", title: "Friday Portfolio Review", date: "Apr 18, 2026", time: "2:00 PM – 3:30 PM", location: "Virtual",        virtual: true,  attendees: 24, capacity: 40, rsvpd: true  },
  { id: "e2", title: "Office Hours with Coach Maria", date: "Apr 22, 2026", time: "4:00 PM – 5:00 PM", location: "Virtual",        virtual: true,  attendees: 8,  capacity: 15, rsvpd: false },
  { id: "e3", title: "Design Meetup — NYC",           date: "May 3, 2026",  time: "6:00 PM – 9:00 PM", location: "Brooklyn, NY",   virtual: false, attendees: 32, capacity: 50, rsvpd: false },
];

// ─── Chat builder ────────────────────────────────────────────────────────────

function buildMockChat(coachName: string): ChatMessage[] {
  const coachInitial = coachName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return [
    {
      id: "c0",
      author: { name: coachName, initial: coachInitial, color: "var(--ce-role-guide)", isCoach: true },
      content: `Welcome everyone! This week's focus: portfolio storytelling. Drop your biggest challenge below and I'll pick 3 to deep-dive on Friday's call.`,
      time: "Mon 9:02 AM",
      pinned: true,
    },
    {
      id: "c1",
      author: { name: "Sarah K.", initial: "S", color: "rgba(var(--ce-cyan-rgb),0.7)" },
      content: "Excited to be here! My challenge is writing case study narratives — I always lead with process instead of impact.",
      time: "Mon 9:15 AM",
    },
    {
      id: "c2",
      author: { name: "James L.", initial: "J", color: "rgba(99,102,241,0.8)" },
      content: "Same! I also struggle quantifying impact when I wasn't directly measuring metrics. Any templates for that?",
      time: "Mon 10:31 AM",
    },
    {
      id: "c3",
      author: { name: coachName, initial: coachInitial, color: "var(--ce-role-guide)", isCoach: true },
      content: "Great question James — I uploaded a metrics estimation template in Resources. It covers proxy metrics and stakeholder attribution. Check it out.",
      time: "Mon 11:04 AM",
    },
    {
      id: "c4",
      author: { name: "Priya M.", initial: "P", color: "rgba(245,158,11,0.8)" },
      content: "Just checked the template — this is gold. Adding it to my active case study right now.",
      time: "Mon 12:20 PM",
    },
    {
      id: "c5",
      author: { name: "Marcus T.", initial: "M", color: "rgba(16,185,129,0.8)" },
      content: "Reminder: Friday's call starts at 2PM sharp. Coach shared the Zoom link in the pinned post above.",
      time: "Tue 8:45 AM",
    },
    {
      id: "c6",
      author: { name: "You", initial: "JA", color: "rgba(var(--ce-cyan-rgb),0.5)", isSelf: true },
      content: "See everyone Friday! Working through the narrative template now — much clearer structure.",
      time: "Tue 9:12 AM",
    },
  ];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EdgeGroupDetail({ role, onNavigate, isProfessional: routeIsPro }: { role?: string; onNavigate?: (t: string) => void; isProfessional?: boolean }) {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [edgePlus] = useEdgePlus();

  const group = groupId ? GROUP_DIRECTORY[groupId] : undefined;
  const isPro = routeIsPro ?? group?.isProfessional ?? false;

  const [tab, setTab] = useState<TabId>("discussion");
  const [posts, setPosts] = useState<DiscussionPost[]>(MOCK_DISCUSSION);
  const [events, setEvents] = useState<GroupEvent[]>(MOCK_EVENTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(buildMockChat(group?.coachName ?? "Coach"));
  const [chatInput, setChatInput] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [joined, setJoined] = useState(true); // Assume joined if navigating to detail
  const [paywallOpen, setPaywallOpen] = useState(!edgePlus && isPro);

  // If this is a professional group and user doesn't have Edge Plus → show paywall
  if (!group) {
    return (
      <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
        <div className="pt-20 pb-24 px-6 max-w-[640px] mx-auto">
          <GlassCard className="p-10 text-center">
            <h2 className="text-[16px] text-[var(--ce-text-primary)] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Group not found
            </h2>
            <p className="text-[12px] text-[var(--ce-text-tertiary)] mb-4" style={{ fontFamily: "var(--font-body)" }}>
              This group may have been deleted or the link is broken.
            </p>
            <button
              onClick={() => navigate(`/${role}/edge-groups`)}
              className="px-4 py-2 rounded-lg text-[11px] cursor-pointer"
              style={{
                background: "rgba(var(--ce-cyan-rgb),0.1)",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
                color: "var(--ce-cyan)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              Back to EdgeGroups
            </button>
          </GlassCard>
        </div>
      </RoleShell>
    );
  }

  // Paywall gate for professional groups
  if (isPro && !edgePlus) {
    return (
      <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
        <div className="pt-20 pb-24 px-4 sm:px-6 max-w-[720px] mx-auto">
          <button
            onClick={() => navigate(`/${role}/edge-groups`)}
            className="flex items-center gap-1.5 text-[11px] text-[var(--ce-text-tertiary)] mb-4 cursor-pointer hover:text-[var(--ce-text-secondary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="w-3 h-3" /> Back to EdgeGroups
          </button>
          <GlassCard className="p-0 overflow-hidden">
            <div className="h-28 w-full" style={{ background: group.coverGradient }} />
            <div className="p-6 -mt-12">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-[20px]"
                  style={{
                    background: group.coachColor ?? "var(--ce-cyan)",
                    border: "3px solid rgba(14,16,20,0.98)",
                    color: "white",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                  }}
                >
                  {group.coachInitial ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[18px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      {group.name}
                    </h1>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-cyan-rgb),0.1)", color: "var(--ce-cyan)", border: "1px solid rgba(var(--ce-cyan-rgb),0.25)", fontFamily: "var(--font-body)" }}>
                      {group.priceLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ce-text-tertiary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                    Led by {group.coachName} · {group.memberCount} members
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(var(--ce-cyan-rgb),0.04)", border: "1px solid rgba(var(--ce-cyan-rgb),0.15)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-3.5 h-3.5 text-[var(--ce-cyan)]" />
                  <span className="text-[11px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Edge Plus required
                  </span>
                </div>
                <p className="text-[11px] text-[var(--ce-text-tertiary)] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  Unlock this group and every other Professional EdgeGroup with a single Edge Plus subscription.
                </p>
                <button
                  onClick={() => setPaywallOpen(true)}
                  className="w-full py-2 rounded-lg text-[11px] cursor-pointer"
                  style={{
                    background: "var(--ce-cyan)",
                    color: "#08090C",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}
                >
                  Upgrade to Edge Plus
                </button>
              </div>
              <button
                onClick={() => {
                  toast.success(`Peek inside ${group.name} — coach intro + sample resource`);
                }}
                className="w-full py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                  color: "var(--ce-text-secondary)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Peek inside
              </button>
            </div>
          </GlassCard>
        </div>
        <EdgePlusPaywall
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          preview={{
            groupName: group.name,
            coachName: group.coachName,
            coachExpertise: "",
          }}
        />
      </RoleShell>
    );
  }

  const handleCompose = () => {
    if (!composeText.trim()) return;
    const newPost: DiscussionPost = {
      id: `d-${Date.now()}`,
      author: { name: "You", initial: "JA", color: "var(--ce-cyan)" },
      content: composeText.trim(),
      time: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setComposeText("");
    setComposeOpen(false);
    toast.success("Post published");
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleRsvp = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? {
      ...e,
      rsvpd: !e.rsvpd,
      attendees: e.rsvpd ? e.attendees - 1 : e.attendees + 1,
    } : e));
    toast.success("RSVP updated");
  };

  const sophiaContext = tab === "chat"
    ? {
        message: `${chatMessages.length} messages in the group chat — the coach pinned a note for Friday's call.`,
        chips: [
          { label: "Back to EdgeGroups", action: "groups" },
        ],
      }
    : {
        message: `${posts.length} new posts this week in ${group.name}.`,
        chips: [
          { label: "Compose a post", action: "compose" },
          { label: "Back to EdgeGroups", action: "groups" },
        ],
      };

  return (
    <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate} sophiaOverride={sophiaContext}>
      <div className="pt-20 pb-24 max-w-[960px] mx-auto">
        {/* Cover */}
        <div className="relative h-36 mx-4 sm:mx-6 rounded-2xl overflow-hidden mb-4" style={{ background: group.coverGradient }}>
          <button
            onClick={() => navigate(`/${role}/edge-groups`)}
            className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(14,16,20,0.6)", border: "1px solid rgba(var(--ce-glass-tint),0.1)", backdropFilter: "blur(8px)" }}
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--ce-text-primary)]" />
          </button>
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 mb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-[22px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {group.name}
                </h1>
                {isPro && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px]" style={{ background: "rgba(var(--ce-cyan-rgb),0.1)", border: "1px solid rgba(var(--ce-cyan-rgb),0.25)", color: "var(--ce-cyan)", fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}>
                    <Crown className="w-2.5 h-2.5" /> PROFESSIONAL
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[var(--ce-text-tertiary)] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                {group.description}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                <span className="flex items-center gap-1"><UsersIcon className="w-3 h-3" /> {group.memberCount} members</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Public</span>
                {isPro && group.coachName && (
                  <span className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-[var(--ce-cyan)]" /> Led by {group.coachName}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setJoined(!joined)}
                className="px-4 py-2 rounded-lg text-[11px] cursor-pointer transition-all"
                style={{
                  background: joined ? "rgba(var(--ce-glass-tint),0.06)" : "var(--ce-cyan)",
                  border: joined ? "1px solid rgba(var(--ce-glass-tint),0.12)" : "1px solid var(--ce-cyan)",
                  color: joined ? "var(--ce-text-tertiary)" : "#08090C",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                {joined ? "Joined" : "Join"}
              </button>
              <button
                onClick={() => toast.success("Invite link copied")}
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
                aria-label="Share"
              >
                <Share2 className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
              </button>
              <button
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
                aria-label="More"
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6">
          <div
            className="flex items-center gap-1 p-1 rounded-xl mb-4 overflow-x-auto"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", scrollbarWidth: "none" }}
          >
            {([
              { id: "discussion" as TabId, Icon: MessageCircle,   label: "Discussion" },
              { id: "chat" as TabId,       Icon: MessagesSquare,  label: "Chat" },
              { id: "members" as TabId,    Icon: UsersIcon,       label: "Members" },
              { id: "resources" as TabId,  Icon: FileText,        label: "Resources" },
              { id: "events" as TabId,     Icon: Calendar,        label: "Events" },
            ]).map(t => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all"
                  style={{
                    background: active ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
                    border: active ? "1px solid rgba(var(--ce-glass-tint),0.15)" : "1px solid transparent",
                    color: active ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
                    fontFamily: "var(--font-display)",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  <t.Icon className="w-3 h-3" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div>
            {tab === "discussion" && (
              <div className="max-w-[720px]">
                <SophiaInsight variant="compact" message={`${posts.length} new posts this week in ${group.name}.`} />
                <button
                  onClick={() => setComposeOpen(true)}
                  className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-left hover:bg-[rgba(var(--ce-glass-tint),0.05)] transition-colors"
                  style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(var(--ce-cyan-rgb),0.14)", border: "1px solid rgba(var(--ce-cyan-rgb),0.22)" }}
                  >
                    <span className="text-[11px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      JA
                    </span>
                  </div>
                  <span className="flex-1 text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                    Share an update with the group…
                  </span>
                </button>
                <div className="mt-3 flex flex-col gap-3">
                  {posts.map(post => (
                    <GlassCard key={post.id} className="p-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: post.author.color }}
                        >
                          <span className="text-[11px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                            {post.author.initial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                              {post.author.name}
                            </span>
                            {post.author.isCoach && (
                              <span className="flex items-center gap-0.5 text-[8px] px-1.5 py-0 rounded-full" style={{ background: "rgba(var(--ce-cyan-rgb),0.1)", color: "var(--ce-cyan)", border: "1px solid rgba(var(--ce-cyan-rgb),0.2)", fontFamily: "var(--font-body)" }}>
                                <Crown className="w-2 h-2" /> Coach
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                            {post.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-[var(--ce-text-secondary)] leading-relaxed mb-3" style={{ fontFamily: "var(--font-body)" }}>
                        {post.content}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1 text-[11px] cursor-pointer"
                          style={{ color: post.liked ? "var(--ce-status-error)" : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
                        >
                          <Heart className="w-3 h-3" style={{ fill: post.liked ? "var(--ce-status-error)" : "none" }} />
                          {post.likes}
                        </button>
                        <button
                          onClick={() => toast.success("Opening comments")}
                          className="flex items-center gap-1 text-[11px] cursor-pointer text-[var(--ce-text-tertiary)]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {tab === "chat" && (
              <div className="max-w-[720px] flex flex-col" style={{ height: "calc(100vh - 360px)", minHeight: 420 }}>
                <SophiaInsight variant="compact" message={`${chatMessages.length} messages this week — the coach pinned a resource worth checking.`} />

                {/* Message thread */}
                <div className="flex-1 overflow-y-auto mt-4 flex flex-col gap-3 pb-3" style={{ scrollbarWidth: "none" }}>
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.author.isSelf ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 self-end"
                        style={{ background: msg.author.color }}
                      >
                        <span className="text-[10px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {msg.author.initial}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[70%] ${msg.author.isSelf ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                        {/* Name + Coach badge + pin */}
                        {!msg.author.isSelf && (
                          <div className="flex items-center gap-1.5 px-1">
                            <span className="text-[10px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                              {msg.author.name}
                            </span>
                            {msg.author.isCoach && (
                              <span className="flex items-center gap-0.5 text-[8px] px-1 py-0 rounded-full" style={{ background: "rgba(var(--ce-cyan-rgb),0.1)", color: "var(--ce-cyan)", border: "1px solid rgba(var(--ce-cyan-rgb),0.2)" }}>
                                <Crown className="w-2 h-2" /> Coach
                              </span>
                            )}
                            {msg.pinned && (
                              <span className="flex items-center gap-0.5 text-[8px] text-[var(--ce-text-quaternary)]">
                                <Pin className="w-2.5 h-2.5" /> Pinned
                              </span>
                            )}
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className="px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed"
                          style={{
                            background: msg.author.isSelf
                              ? "rgba(var(--ce-cyan-rgb),0.12)"
                              : msg.author.isCoach
                              ? "rgba(var(--ce-glass-tint),0.08)"
                              : "rgba(var(--ce-glass-tint),0.05)",
                            border: msg.author.isSelf
                              ? "1px solid rgba(var(--ce-cyan-rgb),0.22)"
                              : msg.pinned
                              ? "1px solid rgba(var(--ce-cyan-rgb),0.15)"
                              : "1px solid rgba(var(--ce-glass-tint),0.08)",
                            color: "var(--ce-text-primary)",
                            fontFamily: "var(--font-body)",
                            borderRadius: msg.author.isSelf ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          }}
                        >
                          {msg.content}
                        </div>

                        <span className="text-[9px] text-[var(--ce-text-quaternary)] px-1" style={{ fontFamily: "var(--font-body)" }}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Composer */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mt-2 flex-shrink-0"
                  style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.1)" }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-cyan-rgb),0.14)" }}>
                    <span className="text-[10px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>JA</span>
                  </div>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && chatInput.trim()) {
                        const newMsg: ChatMessage = {
                          id: `c${Date.now()}`,
                          author: { name: "You", initial: "JA", color: "rgba(var(--ce-cyan-rgb),0.5)", isSelf: true },
                          content: chatInput.trim(),
                          time: "Just now",
                        };
                        setChatMessages(prev => [...prev, newMsg]);
                        setChatInput("");
                      }
                    }}
                    placeholder="Message the group…"
                    className="flex-1 bg-transparent text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] outline-none"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                  <button
                    onClick={() => {
                      if (!chatInput.trim()) return;
                      const newMsg: ChatMessage = {
                        id: `c${Date.now()}`,
                        author: { name: "You", initial: "JA", color: "rgba(var(--ce-cyan-rgb),0.5)", isSelf: true },
                        content: chatInput.trim(),
                        time: "Just now",
                      };
                      setChatMessages(prev => [...prev, newMsg]);
                      setChatInput("");
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all"
                    style={{
                      background: chatInput.trim() ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.06)",
                      color: chatInput.trim() ? "#000" : "var(--ce-text-quaternary)",
                    }}
                    aria-label="Send message"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {tab === "members" && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MOCK_MEMBERS.map(member => (
                    <GlassCard key={member.name} className="p-4 flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                        style={{ background: member.color }}
                      >
                        <span className="text-[14px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {member.initial}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {member.name}
                        </span>
                        {member.isAdmin && (
                          <Crown className="w-2.5 h-2.5" style={{ color: "var(--ce-cyan)" }} aria-label="Admin" />
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--ce-text-tertiary)] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                        {member.role}
                      </span>
                      <button
                        onClick={() => {
                          toast.success(`Message sent to ${member.name}`);
                          onNavigate?.("messages");
                        }}
                        className="w-full px-2 py-1.5 rounded-lg text-[10px] cursor-pointer hover:bg-[rgba(var(--ce-cyan-rgb),0.08)] transition-colors flex items-center justify-center gap-1"
                        style={{
                          background: "rgba(var(--ce-cyan-rgb),0.05)",
                          border: "1px solid rgba(var(--ce-cyan-rgb),0.18)",
                          color: "var(--ce-cyan)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <MessageSquare className="w-2.5 h-2.5" />
                        Message
                      </button>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {tab === "resources" && (
              <div className="max-w-[720px]">
                <SophiaInsight variant="compact" message="Coach Maria pinned 4 resources — the Portfolio Narrative Template is the most viewed this week." />
                <div className="mt-4 flex flex-col gap-2">
                  {MOCK_RESOURCES.map(r => (
                    <GlassCard key={r.id} className="p-4 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: r.type === "pdf" ? "rgba(239,68,68,0.1)" :
                                      r.type === "video" ? "rgba(139,92,246,0.1)" :
                                      r.type === "template" ? "rgba(34,211,238,0.1)" :
                                      "rgba(16,185,129,0.1)",
                        }}
                      >
                        {r.type === "link" ? <ExternalLink className="w-4 h-4 text-[var(--ce-text-secondary)]" /> : <FileText className="w-4 h-4 text-[var(--ce-text-secondary)]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-[var(--ce-text-primary)] truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {r.title}
                        </div>
                        <div className="text-[10px] text-[var(--ce-text-quaternary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                          Added by {r.addedBy} · {r.addedAt}{r.size ? ` · ${r.size}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success(`Opening ${r.title}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                        style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
                        aria-label={`Open ${r.title}`}
                      >
                        {r.type === "link" ? <ExternalLink className="w-3 h-3 text-[var(--ce-text-tertiary)]" /> : <Download className="w-3 h-3 text-[var(--ce-text-tertiary)]" />}
                      </button>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {tab === "events" && (
              <div className="max-w-[720px]">
                <SophiaInsight variant="compact" message="Friday Portfolio Review is your next event — you've already RSVP'd." />
                <div className="mt-4 flex flex-col gap-3">
                  {events.map(ev => (
                    <GlassCard key={ev.id} className="p-4">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h3 className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                          {ev.title}
                        </h3>
                        {ev.virtual && (
                          <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(var(--ce-cyan-rgb),0.08)", color: "var(--ce-cyan)", border: "1px solid rgba(var(--ce-cyan-rgb),0.18)", fontFamily: "var(--font-body)" }}>
                            Virtual
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 mb-3 text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {ev.date} · {ev.time}
                        </div>
                        {!ev.virtual && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            {ev.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-3 h-3" />
                          {ev.attendees}/{ev.capacity} attending
                        </div>
                      </div>
                      <button
                        onClick={() => handleRsvp(ev.id)}
                        className="w-full py-2 rounded-lg text-[11px] cursor-pointer"
                        style={{
                          background: ev.rsvpd ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-cyan-rgb),0.08)",
                          border: ev.rsvpd ? "1px solid rgba(var(--ce-lime-rgb),0.25)" : "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                          color: ev.rsvpd ? "var(--ce-lime)" : "var(--ce-cyan)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                        }}
                      >
                        {ev.rsvpd ? "RSVP'd ✓" : "RSVP"}
                      </button>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {composeOpen && (
          <motion.div
            className="fixed inset-0 z-[9995] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={() => setComposeOpen(false)} />
            <motion.div
              className="relative w-full max-w-[500px] rounded-2xl overflow-hidden"
              style={{ background: "rgba(14,16,20,0.98)", border: "1px solid rgba(var(--ce-glass-tint),0.12)" }}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <h3 className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  New post in {group.name}
                </h3>
                <button onClick={() => setComposeOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]">
                  <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
                </button>
              </div>
              <div className="p-5">
                <textarea
                  autoFocus
                  value={composeText}
                  onChange={e => setComposeText(e.target.value.slice(0, 500))}
                  placeholder="Share an update, a question, or a resource with the group…"
                  rows={5}
                  className="w-full bg-transparent resize-none outline-none text-[13px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="px-5 py-4 flex items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                  {500 - composeText.length} characters left
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setComposeOpen(false)}
                    className="px-4 py-2 rounded-lg text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                    style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompose}
                    disabled={!composeText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] cursor-pointer disabled:opacity-60"
                    style={{
                      background: composeText.trim() ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.06)",
                      color: composeText.trim() ? "#08090C" : "var(--ce-text-quaternary)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    <Send className="w-3 h-3" /> Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RoleShell>
  );
}
