/**
 * EdgeGroups — Communities & coach-led groups
 *
 * Matches live careeredged.com /edge-groups surface with UX improvements:
 * - First-time users land on Discover (not empty My Groups)
 * - Professional cards: progressive disclosure (3 benefits + 4 focus areas shown, rest behind "+N more")
 * - Edge Plus paywall is aspirational with group-specific preview
 * - Create Group form has progressive fields (Country only if In-Person/Hybrid)
 * - Join with Code: monospace auto-split input, autoSubmit on 6 digits
 * - Preview mode for Professional groups (peek without subscribing)
 *
 * Routes:
 *   /:role/edge-groups
 *   /:role/edge-groups/:groupId               (user-created group detail)
 *   /:role/edge-groups/pro/:groupId           (Professional group detail, paywall-gated)
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaMark } from "../sophia-mark";
import { SophiaInsight } from "../sophia-patterns";
import { EdgePlusPaywall } from "../edge-plus-paywall";
import { useEdgePlus } from "../use-edge-plus";
import { toast } from "../ui/feedback";
import { EASE } from "../tokens";
import {
  ArrowLeft, Plus, Users as UsersIcon, QrCode, Check, X, ChevronDown,
  Search, Filter, Globe, Lock, Crown, MapPin, Calendar,
  Briefcase, FileText, Sparkles, ExternalLink, Eye,
  Camera, HelpCircle, type LucideIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = "mine" | "discover" | "professional";
type GroupType = "study" | "startup" | "community" | "immigration";
type MeetingFormat = "online" | "in_person" | "hybrid";
type Privacy = "public" | "private";
type ActivityLevel = "hot" | "active" | "quiet";

interface RegularGroup {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  format: MeetingFormat;
  privacy: Privacy;
  memberCount: number;
  maxMembers: number;
  activity: ActivityLevel;
  country?: string;
  state?: string;
  joined: boolean;
  ownerName: string;
  ownerInitial: string;
  ownerColor: string;
}

interface ProfessionalGroup {
  id: string;
  name: string;
  description: string;
  coach: {
    name: string;
    initial: string;
    expertise: string;
    color: string;
  };
  priceLabel: string;
  pricingType: "paid" | "free";
  benefits: string[];
  focusAreas: string[];
  stats: { members: number; jobs: number; resources: number; slots: number };
  subscribed: boolean;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const GROUP_TYPE_META: Record<GroupType, { label: string; short: string; color: string; emoji: string }> = {
  study:       { label: "Study Group",            short: "Study",       color: "var(--ce-role-edu)",         emoji: "📚" },
  startup:     { label: "Startup Team",           short: "Startup",     color: "var(--ce-role-edgepreneur)", emoji: "🚀" },
  community:   { label: "Community",              short: "Community",   color: "var(--ce-cyan)",             emoji: "💬" },
  immigration: { label: "🌍 ImmigrationEdge Group", short: "Immigration", color: "var(--ce-role-ngo)",         emoji: "🌍" },
};

const FORMAT_META: Record<MeetingFormat, { label: string; emoji: string }> = {
  online:    { label: "Online",    emoji: "🌐" },
  in_person: { label: "In-Person", emoji: "📍" },
  hybrid:    { label: "Hybrid",    emoji: "🔄" },
};

const ACTIVITY_META: Record<ActivityLevel, { label: string; color: string }> = {
  hot:    { label: "Hot",    color: "var(--ce-lime)" },
  active: { label: "Active", color: "var(--ce-cyan)" },
  quiet:  { label: "Quiet",  color: "var(--ce-text-quaternary)" },
};

// ─── Mock data ───────────────────────────────────────────────────────────────

const DISCOVER_GROUPS: RegularGroup[] = [
  {
    id: "g-ux",
    name: "UX/UI Designers",
    description: "Portfolio reviews, design challenges, and career advice for UX/UI professionals.",
    type: "study",
    format: "online",
    privacy: "public",
    memberCount: 234,
    maxMembers: 500,
    activity: "hot",
    joined: false,
    ownerName: "Aisha N.",
    ownerInitial: "A",
    ownerColor: "var(--ce-role-edgestar)",
  },
  {
    id: "g-imm",
    name: "International Professionals",
    description: "Support and resources for navigating work visas, credentials, and cultural transitions.",
    type: "immigration",
    format: "online",
    privacy: "public",
    memberCount: 189,
    maxMembers: 300,
    activity: "active",
    joined: false,
    ownerName: "Priya M.",
    ownerInitial: "P",
    ownerColor: "var(--ce-role-ngo)",
  },
  {
    id: "g-tip",
    name: "Tech Interview Prep",
    description: "Daily coding challenges, mock interviews, and system design practice for tech roles.",
    type: "study",
    format: "hybrid",
    privacy: "public",
    memberCount: 312,
    maxMembers: 400,
    activity: "hot",
    country: "United States",
    state: "California",
    joined: false,
    ownerName: "Marcus W.",
    ownerInitial: "M",
    ownerColor: "var(--ce-role-edu)",
  },
  {
    id: "g-cco",
    name: "Career Changers Over 30",
    description: "Late-career pivots, transferable skills, and proving that age is just a number.",
    type: "community",
    format: "online",
    privacy: "public",
    memberCount: 156,
    maxMembers: 200,
    activity: "active",
    joined: false,
    ownerName: "Sarah K.",
    ownerInitial: "S",
    ownerColor: "var(--ce-role-edgestar)",
  },
  {
    id: "g-founders",
    name: "First-Time Founders",
    description: "Validated-idea to first-dollar. Weekly calls, co-working sessions, and honest founder talk.",
    type: "startup",
    format: "hybrid",
    privacy: "public",
    memberCount: 78,
    maxMembers: 150,
    activity: "active",
    country: "Nigeria",
    state: "Lagos",
    joined: false,
    ownerName: "Tunde O.",
    ownerInitial: "T",
    ownerColor: "var(--ce-role-edgepreneur)",
  },
  {
    id: "g-nin",
    name: "Nigerian Professionals Network",
    description: "Connecting Nigerian professionals worldwide — jobs, mentorship, and community events.",
    type: "community",
    format: "hybrid",
    privacy: "public",
    memberCount: 278,
    maxMembers: 500,
    activity: "hot",
    country: "Nigeria",
    joined: false,
    ownerName: "Chidi A.",
    ownerInitial: "C",
    ownerColor: "var(--ce-role-ngo)",
  },
];

const PROFESSIONAL_GROUPS: ProfessionalGroup[] = [
  {
    id: "pg-dh",
    name: "Digital Health Professional Group",
    description: "All things Digital Health — from startups to enterprise deployments.",
    coach: { name: "John Adeoye", initial: "JA", expertise: "Healthcare & Public Health Expert", color: "var(--ce-role-guide)" },
    priceLabel: "$25/mo",
    pricingType: "paid",
    benefits: [
      "Weekly coaching calls",
      "1-on-1 mentorship sessions",
      "Career strategy sessions",
      "Priority coaching slots",
      "Group Q&A sessions",
    ],
    focusAreas: [
      "Career Transitions", "Executive Coaching", "Resume Building", "Leadership Development",
      "Interview Prep", "Job Search Strategy", "Salary Negotiation", "Industry Insights",
      "Professional Development", "Contracts & Consulting", "Securing a Job", "Mentorship", "Networking",
    ],
    stats: { members: 142, jobs: 12, resources: 34, slots: 8 },
    subscribed: false,
  },
  {
    id: "pg-vc",
    name: "Venture Capitalist",
    description: "Fund managers, LP relations, and deal flow for new and experienced VCs.",
    coach: { name: "EdgeCoach", initial: "E", expertise: "Finance & Accounting Expert", color: "var(--ce-role-edgepreneur)" },
    priceLabel: "$500/mo",
    pricingType: "paid",
    benefits: [
      "Weekly coaching calls",
      "1-on-1 mentorship sessions",
      "Career strategy sessions",
    ],
    focusAreas: ["Executive Coaching", "Networking"],
    stats: { members: 28, jobs: 6, resources: 14, slots: 4 },
    subscribed: false,
  },
  {
    id: "pg-pharma",
    name: "Pharma ACE Clinical Research",
    description: "Breaking into Clinical research industry as a CRA or CTM.",
    coach: { name: "Haywhy", initial: "H", expertise: "Healthcare & Public Health Expert", color: "var(--ce-role-guide)" },
    priceLabel: "$500/mo",
    pricingType: "paid",
    benefits: [
      "1-on-1 mentorship sessions",
      "Cover letter templates",
      "Group Q&A sessions",
      "Salary negotiation guides",
      "Priority coaching slots",
    ],
    focusAreas: [
      "Career Transitions", "Interview Prep", "Resume Building", "Job Search Strategy",
      "Industry Insights", "Professional Development", "Networking",
    ],
    stats: { members: 86, jobs: 9, resources: 22, slots: 6 },
    subscribed: false,
  },
  {
    id: "pg-cr",
    name: "Clinical Research Professional Group",
    description: "CRA and CRO Training with hands-on case studies and weekly office hours.",
    coach: { name: "John Adeoye", initial: "JA", expertise: "Healthcare & Public Health Expert", color: "var(--ce-role-guide)" },
    priceLabel: "Free",
    pricingType: "free",
    benefits: [
      "Weekly coaching calls",
      "1-on-1 mentorship sessions",
      "Group Q&A sessions",
      "Resume templates",
      "Career strategy sessions",
    ],
    focusAreas: [
      "Career Transitions", "Executive Coaching", "Resume Building", "Interview Prep",
      "Leadership Development", "Job Search Strategy", "Professional Development",
      "Contracts & Consulting", "Industry Insights", "Networking", "Mentorship", "Securing a Job",
    ],
    stats: { members: 312, jobs: 14, resources: 48, slots: 10 },
    subscribed: false,
  },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function getStoredGroups(): RegularGroup[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("careerEdgeGroups");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setStoredGroups(groups: RegularGroup[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("careerEdgeGroups", JSON.stringify(groups));
}

// ─── Main surface ────────────────────────────────────────────────────────────

export function EdgeGroupsSurface({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const navigate = useNavigate();
  const [edgePlus] = useEdgePlus();

  // Joined groups state (combined discover + user-created)
  const [joinedIds, setJoinedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("careerEdgeJoinedGroups");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [userCreatedGroups, setUserCreatedGroups] = useState<RegularGroup[]>(getStoredGroups);
  const [subscribedPro, setSubscribedPro] = useState<Set<string>>(new Set());

  // Smart default tab: if user has joined nothing, land on Discover
  const [tab, setTab] = useState<TabId>(() => joinedIds.size > 0 ? "mine" : "discover");

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<GroupType | "all">("all");

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [joinCodeOpen, setJoinCodeOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [paywallGroup, setPaywallGroup] = useState<ProfessionalGroup | null>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem("careerEdgeJoinedGroups", JSON.stringify(Array.from(joinedIds)));
  }, [joinedIds]);
  useEffect(() => {
    setStoredGroups(userCreatedGroups);
  }, [userCreatedGroups]);

  const handleJoinToggle = (groupId: string, groupName: string) => {
    setJoinedIds(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
        toast.success(`Left ${groupName}`);
      } else {
        next.add(groupId);
        toast.success(`Joined ${groupName}`);
      }
      return next;
    });
  };

  const handleOpenGroup = (groupId: string) => {
    navigate(`/${role}/edge-groups/${groupId}`);
  };

  const handleSubscribePro = (group: ProfessionalGroup) => {
    if (!edgePlus) {
      setPaywallGroup(group);
      return;
    }
    setSubscribedPro(prev => new Set(prev).add(group.id));
    toast.success(`Subscribed to ${group.name}`);
  };

  const handleOpenProGroup = (group: ProfessionalGroup) => {
    if (!edgePlus) {
      setPaywallGroup(group);
      return;
    }
    navigate(`/${role}/edge-groups/pro/${group.id}`);
  };

  const handlePreviewProGroup = (group: ProfessionalGroup) => {
    // Preview is always available — shows first post/resource without subscribing
    toast.success(`Peek inside ${group.name} — coach intro + sample resource`);
  };

  const handleCreateGroup = (input: Omit<RegularGroup, "id" | "memberCount" | "maxMembers" | "activity" | "joined" | "ownerName" | "ownerInitial" | "ownerColor"> & { maxMembers: number }) => {
    const newGroup: RegularGroup = {
      id: `g-${Date.now()}`,
      name: input.name,
      description: input.description,
      type: input.type,
      format: input.format,
      privacy: input.privacy,
      memberCount: 1,
      maxMembers: input.maxMembers,
      activity: "active",
      country: input.country,
      state: input.state,
      joined: true,
      ownerName: "You",
      ownerInitial: "JA",
      ownerColor: "var(--ce-cyan)",
    };
    setUserCreatedGroups(prev => [newGroup, ...prev]);
    setJoinedIds(prev => new Set(prev).add(newGroup.id));
    setCreateOpen(false);
    setTab("mine");
    toast.success(`${newGroup.name} created`);
  };

  // Filter logic
  const allRegularGroups = [...userCreatedGroups, ...DISCOVER_GROUPS];

  const filteredDiscover = useMemo(() => {
    return allRegularGroups.filter(g => {
      if (joinedIds.has(g.id)) return false;
      if (typeFilter !== "all" && g.type !== typeFilter) return false;
      if (search.trim() && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allRegularGroups, joinedIds, typeFilter, search]);

  const myGroups = useMemo(() => {
    return allRegularGroups.filter(g => joinedIds.has(g.id));
  }, [allRegularGroups, joinedIds]);

  const filteredPro = useMemo(() => {
    return PROFESSIONAL_GROUPS.filter(g => {
      if (search.trim() && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search]);

  const sophiaContext = useMemo(() => {
    if (tab === "mine") {
      return {
        message: myGroups.length === 0
          ? "Start by joining a group or creating your own — it's the fastest way to find your people."
          : `You're in ${myGroups.length} group${myGroups.length === 1 ? "" : "s"}. New activity this week in ${Math.min(myGroups.length, 2)}.`,
        chips: [
          { label: "Discover groups", action: "discover" },
          { label: "Create a group", action: "create" },
        ],
      };
    }
    if (tab === "professional") {
      return {
        message: edgePlus
          ? "Edge Plus unlocked — you can subscribe to any coach-led group."
          : "Professional groups are coach-led. Peek inside any group or unlock them all with Edge Plus.",
        chips: [
          { label: "Peek inside", action: "peek" },
          { label: "What's Edge Plus?", action: "edgeplus" },
        ],
      };
    }
    return {
      message: `${DISCOVER_GROUPS.length} public groups match your role. Sophia recommends Tech Interview Prep for Phase 2.`,
      chips: [
        { label: "Join a recommended group", action: "recommend" },
        { label: "Create a group", action: "create" },
      ],
    };
  }, [tab, myGroups.length, edgePlus]);

  return (
    <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate} sophiaOverride={sophiaContext}>
      <div className="pt-20 pb-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <button
            onClick={() => onNavigate?.("synthesis")}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] text-[var(--ce-text-primary)] leading-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                EdgeGroups
              </h1>
              {edgePlus && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px]"
                  style={{
                    background: "rgba(var(--ce-cyan-rgb),0.1)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
                    color: "var(--ce-cyan)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                  aria-label="Edge Plus active"
                >
                  <Crown className="w-2.5 h-2.5" />
                  Edge Plus
                </span>
              )}
            </div>
            <p className="text-[12px] text-[var(--ce-text-tertiary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
              Connect with peers, build communities, and grow together
            </p>
          </div>
        </div>

        {/* Primary actions */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{
              background: "var(--ce-cyan)",
              color: "#08090C",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Create Group
          </button>
          <button
            onClick={() => setJoinCodeOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            style={{
              background: "rgba(var(--ce-glass-tint),0.04)",
              border: "1px solid rgba(var(--ce-glass-tint),0.1)",
              color: "var(--ce-text-secondary)",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
            }}
          >
            <UsersIcon className="w-3.5 h-3.5" />
            Join with Code
          </button>
          <button
            onClick={() => setQrOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
            style={{
              background: "rgba(var(--ce-glass-tint),0.04)",
              border: "1px solid rgba(var(--ce-glass-tint),0.1)",
              color: "var(--ce-text-secondary)",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
            }}
          >
            <QrCode className="w-3.5 h-3.5" />
            Scan QR Code
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl mb-5"
          style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        >
          <TabButton active={tab === "mine"} onClick={() => setTab("mine")} count={myGroups.length}>
            <UsersIcon className="w-3 h-3" /> My Groups
          </TabButton>
          <TabButton active={tab === "discover"} onClick={() => setTab("discover")} count={filteredDiscover.length}>
            <Globe className="w-3 h-3" /> Discover
          </TabButton>
          <TabButton active={tab === "professional"} onClick={() => setTab("professional")} count={PROFESSIONAL_GROUPS.length} highlight>
            <Crown className="w-3 h-3" /> Professional
          </TabButton>
        </div>

        {/* Search + Filters row */}
        {tab !== "mine" && (
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-[480px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-9 pr-3 py-2 rounded-lg text-[12px] outline-none bg-transparent text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
            {tab === "discover" && (
              <div className="relative">
                <button
                  onClick={() => setFiltersOpen(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.04)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                    color: typeFilter !== "all" ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Filter className="w-3 h-3" />
                  {typeFilter === "all" ? "All types" : GROUP_TYPE_META[typeFilter].short}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {filtersOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 w-[200px] rounded-xl overflow-hidden z-50"
                      style={{
                        background: "rgba(14,16,20,0.98)",
                        border: "1px solid rgba(var(--ce-glass-tint),0.12)",
                      }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      <button
                        onClick={() => { setTypeFilter("all"); setFiltersOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] hover:bg-[rgba(var(--ce-glass-tint),0.06)] text-left text-[var(--ce-text-secondary)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Globe className="w-3 h-3" /> All types
                        {typeFilter === "all" && <Check className="w-3 h-3 ml-auto" />}
                      </button>
                      {(Object.keys(GROUP_TYPE_META) as GroupType[]).map(t => (
                        <button
                          key={t}
                          onClick={() => { setTypeFilter(t); setFiltersOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] hover:bg-[rgba(var(--ce-glass-tint),0.06)] text-left text-[var(--ce-text-secondary)]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <span>{GROUP_TYPE_META[t].emoji}</span> {GROUP_TYPE_META[t].short}
                          {typeFilter === t && <Check className="w-3 h-3 ml-auto" style={{ color: "var(--ce-cyan)" }} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Content area — plain switch, no AnimatePresence to avoid stall */}
        <div>
          {tab === "mine" && (
            <>
              {myGroups.length === 0 ? (
                <GlassCard className="p-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(var(--ce-cyan-rgb),0.08)", border: "1px solid rgba(var(--ce-cyan-rgb),0.18)" }}>
                    <UsersIcon className="w-6 h-6 text-[var(--ce-cyan)]" />
                  </div>
                  <h3 className="text-[16px] text-[var(--ce-text-primary)] mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    No groups yet
                  </h3>
                  <p className="text-[12px] text-[var(--ce-text-tertiary)] mb-5 max-w-[320px]" style={{ fontFamily: "var(--font-body)" }}>
                    Create one or discover existing groups to connect with peers on a similar journey.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTab("discover")}
                      className="px-4 py-2 rounded-xl text-[11px] cursor-pointer"
                      style={{
                        background: "var(--ce-cyan)",
                        color: "#08090C",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      Discover groups
                    </button>
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="px-4 py-2 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                      style={{
                        background: "rgba(var(--ce-glass-tint),0.04)",
                        border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                        color: "var(--ce-text-secondary)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                      }}
                    >
                      Create a group
                    </button>
                  </div>
                </GlassCard>
              ) : (
                <>
                  <SophiaInsight variant="compact" message={sophiaContext.message} />
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {myGroups.map(group => (
                      <RegularGroupCard
                        key={group.id}
                        group={group}
                        joined
                        onJoinToggle={() => handleJoinToggle(group.id, group.name)}
                        onOpen={() => handleOpenGroup(group.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {tab === "discover" && (
            <>
              <SophiaInsight variant="compact" message={sophiaContext.message} />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDiscover.map(group => (
                  <RegularGroupCard
                    key={group.id}
                    group={group}
                    joined={false}
                    onJoinToggle={() => handleJoinToggle(group.id, group.name)}
                    onOpen={() => handleOpenGroup(group.id)}
                  />
                ))}
              </div>
              {filteredDiscover.length === 0 && (
                <GlassCard className="p-8 text-center">
                  <p className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                    No groups match your filters. Try adjusting your search or creating one.
                  </p>
                </GlassCard>
              )}
            </>
          )}

          {tab === "professional" && (
            <>
              <div className="mb-4">
                <h2 className="text-[16px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Professional EdgeGroups
                </h2>
                <p className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                  Join coach-led groups for exclusive jobs, resources, and coaching sessions
                </p>
              </div>
              {!edgePlus && (
                <GlassCard className="p-4 mb-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(var(--ce-cyan-rgb),0.1)" }}
                  >
                    <Crown className="w-4 h-4 text-[var(--ce-cyan)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Unlock all Professional groups with Edge Plus
                    </div>
                    <div className="text-[10px] text-[var(--ce-text-tertiary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      One subscription. Every coach-led community. Peek inside any group first.
                    </div>
                  </div>
                  <button
                    onClick={() => setPaywallGroup(PROFESSIONAL_GROUPS[0])}
                    className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer flex-shrink-0"
                    style={{
                      background: "var(--ce-cyan)",
                      color: "#08090C",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    Learn more
                  </button>
                </GlassCard>
              )}
              <p className="text-[10px] text-[var(--ce-text-quaternary)] mb-3" style={{ fontFamily: "var(--font-body)" }}>
                Showing {filteredPro.length} of {PROFESSIONAL_GROUPS.length} groups
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredPro.map(group => (
                  <ProfessionalGroupCard
                    key={group.id}
                    group={group}
                    subscribed={subscribedPro.has(group.id)}
                    edgePlusActive={edgePlus}
                    onSubscribe={() => handleSubscribePro(group)}
                    onOpen={() => handleOpenProGroup(group)}
                    onPreview={() => handlePreviewProGroup(group)}
                    onViewCoach={() => {
                      if (!edgePlus) {
                        setPaywallGroup(group);
                      } else {
                        onNavigate?.("profile");
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Modals ────────────────────────────────────────────────── */}
      <CreateGroupModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateGroup} />
      <JoinCodeModal open={joinCodeOpen} onClose={() => setJoinCodeOpen(false)} onJoin={(code) => {
        // Simulate: any 6-char code joins a random discover group
        const target = DISCOVER_GROUPS[0];
        setJoinedIds(prev => new Set(prev).add(target.id));
        setJoinCodeOpen(false);
        setTab("mine");
        toast.success(`Joined ${target.name} with code ${code}`);
      }} />
      <ScanQRModal open={qrOpen} onClose={() => setQrOpen(false)} onScanSuccess={() => {
        const target = DISCOVER_GROUPS[1];
        setJoinedIds(prev => new Set(prev).add(target.id));
        setQrOpen(false);
        setTab("mine");
        toast.success(`Joined ${target.name} via QR`);
      }} />
      <EdgePlusPaywall
        open={paywallGroup !== null}
        onClose={() => setPaywallGroup(null)}
        preview={paywallGroup ? {
          groupName: paywallGroup.name,
          coachName: paywallGroup.coach.name,
          coachExpertise: paywallGroup.coach.expertise,
          benefits: paywallGroup.benefits,
        } : undefined}
      />
    </RoleShell>
  );
}

// ─── Tab Button ──────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  count,
  children,
  highlight = false,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all"
      style={{
        background: active
          ? highlight
            ? "rgba(var(--ce-cyan-rgb),0.12)"
            : "rgba(var(--ce-glass-tint),0.08)"
          : "transparent",
        border: active
          ? highlight
            ? "1px solid rgba(var(--ce-cyan-rgb),0.3)"
            : "1px solid rgba(var(--ce-glass-tint),0.15)"
          : "1px solid transparent",
        color: active
          ? highlight ? "var(--ce-cyan)" : "var(--ce-text-primary)"
          : "var(--ce-text-tertiary)",
        fontFamily: "var(--font-display)",
        fontWeight: active ? 500 : 400,
      }}
      aria-pressed={active}
    >
      {children}
      <span
        className="ml-1 px-1.5 py-0 rounded-full text-[9px]"
        style={{
          background: active ? "rgba(var(--ce-glass-tint),0.08)" : "rgba(var(--ce-glass-tint),0.04)",
          color: "var(--ce-text-quaternary)",
          fontFeatureSettings: "'tnum'",
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Regular group card ─────────────────────────────────────────────────────

function RegularGroupCard({
  group,
  joined,
  onJoinToggle,
  onOpen,
}: {
  group: RegularGroup;
  joined: boolean;
  onJoinToggle: () => void;
  onOpen: () => void;
}) {
  const typeMeta = GROUP_TYPE_META[group.type];
  const formatMeta = FORMAT_META[group.format];
  const activityMeta = ACTIVITY_META[group.activity];

  return (
    <GlassCard className="p-4 flex flex-col h-full">
      <div className="flex items-start gap-2 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[15px]"
          style={{ background: `${typeMeta.color}14`, border: `1px solid ${typeMeta.color}22` }}
        >
          {typeMeta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <button
            onClick={onOpen}
            className="text-[13px] text-[var(--ce-text-primary)] text-left cursor-pointer hover:underline line-clamp-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {group.name}
          </button>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              {typeMeta.short}
            </span>
            <span className="text-[9px] text-[var(--ce-text-quaternary)]">·</span>
            <span className="text-[9px]" style={{ color: activityMeta.color, fontFamily: "var(--font-body)" }}>
              {activityMeta.label}
            </span>
          </div>
        </div>
        {group.privacy === "private" && (
          <Lock className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0" aria-label="Private group" />
        )}
      </div>
      <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed mb-3 line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
        {group.description}
      </p>
      <div className="flex items-center gap-3 mb-3 text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
        <span className="flex items-center gap-1">
          <UsersIcon className="w-2.5 h-2.5" />
          {group.memberCount}/{group.maxMembers}
        </span>
        <span className="flex items-center gap-1">
          <span>{formatMeta.emoji}</span>
          {formatMeta.label}
        </span>
        {group.country && (
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-2.5 h-2.5" />
            {group.country}
          </span>
        )}
      </div>
      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={onJoinToggle}
          className="flex-1 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all active:scale-[0.98]"
          style={{
            background: joined ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-cyan-rgb),0.1)",
            border: joined ? "1px solid rgba(var(--ce-glass-tint),0.12)" : "1px solid rgba(var(--ce-cyan-rgb),0.25)",
            color: joined ? "var(--ce-text-tertiary)" : "var(--ce-cyan)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
        >
          {joined ? "Joined" : "Join"}
        </button>
        <button
          onClick={onOpen}
          className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
          style={{
            background: "rgba(var(--ce-glass-tint),0.04)",
            border: "1px solid rgba(var(--ce-glass-tint),0.08)",
            color: "var(--ce-text-secondary)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
          }}
          aria-label={`Open ${group.name}`}
        >
          Open
        </button>
      </div>
    </GlassCard>
  );
}

// ─── Professional group card ────────────────────────────────────────────────

function ProfessionalGroupCard({
  group,
  subscribed,
  edgePlusActive,
  onSubscribe,
  onOpen,
  onPreview,
  onViewCoach,
}: {
  group: ProfessionalGroup;
  subscribed: boolean;
  edgePlusActive: boolean;
  onSubscribe: () => void;
  onOpen: () => void;
  onPreview: () => void;
  onViewCoach: () => void;
}) {
  const [expandedBenefits, setExpandedBenefits] = useState(false);
  const [expandedFocus, setExpandedFocus] = useState(false);
  const visibleBenefits = expandedBenefits ? group.benefits : group.benefits.slice(0, 3);
  const visibleFocus = expandedFocus ? group.focusAreas : group.focusAreas.slice(0, 4);
  const hiddenBenefits = group.benefits.length - 3;
  const hiddenFocus = group.focusAreas.length - 4;
  const locked = !edgePlusActive && !subscribed;

  return (
    <GlassCard className="p-5 flex flex-col h-full">
      {/* Top row: Professional badge + price */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px]"
          style={{
            background: "rgba(var(--ce-cyan-rgb),0.08)",
            border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
            color: "var(--ce-cyan)",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            letterSpacing: "0.08em",
          }}
        >
          <Crown className="w-2.5 h-2.5" />
          PROFESSIONAL
        </span>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full"
          style={{
            background: group.pricingType === "free" ? "rgba(var(--ce-lime-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.06)",
            color: group.pricingType === "free" ? "var(--ce-lime)" : "var(--ce-text-secondary)",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}
        >
          {group.priceLabel}
        </span>
      </div>

      {/* Coach */}
      <div className="flex flex-col items-center text-center mb-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
          style={{
            background: group.coach.color,
            border: "2px solid rgba(var(--ce-cyan-rgb),0.3)",
          }}
        >
          <span className="text-[18px] text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {group.coach.initial}
          </span>
        </div>
        <div className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {group.coach.name}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--ce-text-tertiary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
          <Crown className="w-2.5 h-2.5" style={{ color: "var(--ce-cyan)" }} />
          {group.coach.expertise}
        </div>
        <button
          onClick={onViewCoach}
          className="flex items-center gap-1 text-[10px] mt-1.5 cursor-pointer transition-colors hover:underline"
          style={{ color: "var(--ce-cyan)", fontFamily: "var(--font-body)" }}
        >
          <ExternalLink className="w-2.5 h-2.5" />
          View EdgeCoach Profile
        </button>
      </div>

      {/* Group name + description */}
      <div className="mb-4 text-center">
        <h3 className="text-[15px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          {group.name}
        </h3>
        <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {group.description}
        </p>
      </div>

      {/* What You'll Get */}
      <div className="mb-3">
        <div className="text-[9px] text-[var(--ce-text-quaternary)] mb-2 tracking-[0.08em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
          What you'll get
        </div>
        <ul className="flex flex-col gap-1.5">
          {visibleBenefits.map(benefit => (
            <li key={benefit} className="flex items-start gap-1.5">
              <Check className="w-2.5 h-2.5 mt-1 flex-shrink-0" style={{ color: "var(--ce-cyan)" }} />
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                {benefit}
              </span>
            </li>
          ))}
        </ul>
        {hiddenBenefits > 0 && (
          <button
            onClick={() => setExpandedBenefits(v => !v)}
            className="mt-1.5 text-[10px] cursor-pointer hover:underline"
            style={{ color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
          >
            {expandedBenefits ? "Show less" : `+${hiddenBenefits} more`}
          </button>
        )}
      </div>

      {/* Focus Areas */}
      <div className="mb-4">
        <div className="text-[9px] text-[var(--ce-text-quaternary)] mb-2 tracking-[0.08em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
          Focus areas
        </div>
        <div className="flex flex-wrap gap-1">
          {visibleFocus.map(area => (
            <span
              key={area}
              className="text-[9px] px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(var(--ce-glass-tint),0.05)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-tertiary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {area}
            </span>
          ))}
          {hiddenFocus > 0 && !expandedFocus && (
            <button
              onClick={() => setExpandedFocus(true)}
              className="text-[9px] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[rgba(var(--ce-cyan-rgb),0.08)]"
              style={{
                background: "rgba(var(--ce-cyan-rgb),0.05)",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.15)",
                color: "var(--ce-cyan)",
                fontFamily: "var(--font-body)",
              }}
            >
              +{hiddenFocus} more
            </button>
          )}
          {expandedFocus && hiddenFocus > 0 && (
            <button
              onClick={() => setExpandedFocus(false)}
              className="text-[9px] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.08)]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.05)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-tertiary)",
                fontFamily: "var(--font-body)",
              }}
            >
              Show less
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <StatTile Icon={UsersIcon} value={group.stats.members} label="Members" color="var(--ce-cyan)" />
        <StatTile Icon={Briefcase} value={group.stats.jobs} label="Jobs" color="var(--ce-role-employer)" />
        <StatTile Icon={FileText} value={group.stats.resources} label="Resources" color="var(--ce-role-edu)" />
        <StatTile Icon={Calendar} value={group.stats.slots} label="Slots" color="var(--ce-role-guide)" />
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={subscribed ? onOpen : onSubscribe}
          className="w-full py-2 rounded-xl text-[11px] cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          style={{
            background: subscribed
              ? "rgba(var(--ce-lime-rgb),0.1)"
              : locked
              ? "rgba(var(--ce-cyan-rgb),0.08)"
              : "var(--ce-cyan)",
            border: subscribed
              ? "1px solid rgba(var(--ce-lime-rgb),0.3)"
              : locked
              ? "1px solid rgba(var(--ce-cyan-rgb),0.25)"
              : "1px solid var(--ce-cyan)",
            color: subscribed ? "var(--ce-lime)" : locked ? "var(--ce-cyan)" : "#08090C",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
          aria-label={subscribed ? `Open ${group.name}` : `Subscribe to ${group.name}`}
        >
          {locked && !subscribed && <Crown className="w-3 h-3" />}
          {subscribed ? "Open group" : group.pricingType === "free" ? "Join Free" : "Subscribe"}
        </button>
        {locked && (
          <button
            onClick={onPreview}
            className="w-full py-2 rounded-xl text-[11px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)] flex items-center justify-center gap-1.5"
            style={{
              background: "transparent",
              border: "1px solid rgba(var(--ce-glass-tint),0.1)",
              color: "var(--ce-text-tertiary)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Eye className="w-3 h-3" />
            Peek inside
          </button>
        )}
      </div>
    </GlassCard>
  );
}

function StatTile({ Icon, value, label, color }: { Icon: LucideIcon; value: number; label: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center py-2 rounded-lg"
      style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
    >
      <Icon className="w-3 h-3 mb-1" style={{ color }} />
      <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontFeatureSettings: "'tnum'" }}>
        {value}
      </span>
      <span className="text-[8px] text-[var(--ce-text-quaternary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Create Group modal ─────────────────────────────────────────────────────

function CreateGroupModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    name: string;
    description: string;
    type: GroupType;
    format: MeetingFormat;
    privacy: Privacy;
    country?: string;
    state?: string;
    maxMembers: number;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GroupType>("study");
  const [format, setFormat] = useState<MeetingFormat>("online");
  const [privacy, setPrivacy] = useState<Privacy>("private");
  const [maxMembers, setMaxMembers] = useState(50);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setType("study");
      setFormat("online");
      setPrivacy("private");
      setMaxMembers(50);
      setCountry("");
      setState("");
    }
  }, [open]);

  const needsLocation = format === "in_person" || format === "hybrid";
  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      type,
      format,
      privacy,
      country: needsLocation ? country || undefined : undefined,
      state: needsLocation ? state || undefined : undefined,
      maxMembers,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9995] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={onClose} />
          <motion.div
            className="relative w-full max-w-[480px] rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
            style={{
              background: "rgba(14,16,20,0.98)",
              border: "1px solid rgba(var(--ce-glass-tint),0.12)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
              <h2 className="text-[15px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Create new EdgeGroup
              </h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Group name <span style={{ color: "var(--ce-status-error)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 60))}
                  placeholder="Enter group name"
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg text-[12px] outline-none bg-transparent text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.04)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 240))}
                  placeholder="What is this group about?"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg text-[12px] outline-none bg-transparent text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] resize-none"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.04)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              {/* Group type */}
              <div>
                <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Group type
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(GROUP_TYPE_META) as GroupType[]).map(t => {
                    const m = GROUP_TYPE_META[t];
                    const selected = type === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all text-left"
                        style={{
                          background: selected ? `${m.color}14` : "rgba(var(--ce-glass-tint),0.04)",
                          border: selected ? `1px solid ${m.color}40` : "1px solid rgba(var(--ce-glass-tint),0.08)",
                          color: selected ? m.color : "var(--ce-text-secondary)",
                          fontFamily: "var(--font-body)",
                          fontWeight: selected ? 500 : 400,
                        }}
                      >
                        <span className="text-[14px]">{m.emoji}</span>
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Meeting format */}
              <div>
                <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Meeting format
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(FORMAT_META) as MeetingFormat[]).map(f => {
                    const m = FORMAT_META[f];
                    const selected = format === f;
                    return (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className="flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] cursor-pointer transition-all"
                        style={{
                          background: selected ? "rgba(var(--ce-cyan-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.04)",
                          border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
                          color: selected ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                          fontFamily: "var(--font-body)",
                          fontWeight: selected ? 500 : 400,
                        }}
                      >
                        <span className="text-[16px]">{m.emoji}</span>
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location (progressive — only for in-person/hybrid) */}
              <AnimatePresence>
                {needsLocation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-2 overflow-hidden"
                  >
                    <div>
                      <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        placeholder="e.g. Nigeria"
                        className="w-full px-3 py-2 rounded-lg text-[11px] outline-none bg-transparent text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                        style={{
                          background: "rgba(var(--ce-glass-tint),0.04)",
                          border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                          fontFamily: "var(--font-body)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                        State / region
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder={country ? "e.g. Lagos" : "Select country first"}
                        disabled={!country}
                        className="w-full px-3 py-2 rounded-lg text-[11px] outline-none bg-transparent text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)] disabled:opacity-70"
                        style={{
                          background: "rgba(var(--ce-glass-tint),0.04)",
                          border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                          fontFamily: "var(--font-body)",
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy */}
              <div>
                <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Privacy
                </label>
                <div className="flex flex-col gap-1.5">
                  {([
                    { id: "public" as Privacy, Icon: Globe, title: "Public", sub: "Anyone can discover and join" },
                    { id: "private" as Privacy, Icon: Lock, title: "Private", sub: "Only invited members can join" },
                  ]).map(opt => {
                    const Icon = opt.Icon;
                    const selected = privacy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPrivacy(opt.id)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-left"
                        style={{
                          background: selected ? "rgba(var(--ce-cyan-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.04)",
                          border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: selected ? "var(--ce-cyan)" : "var(--ce-text-tertiary)" }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px]" style={{ color: selected ? "var(--ce-cyan)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)", fontWeight: selected ? 500 : 400 }}>
                            {opt.title}
                          </div>
                          <div className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                            {opt.sub}
                          </div>
                        </div>
                        {selected && <Check className="w-3 h-3 flex-shrink-0" style={{ color: "var(--ce-cyan)" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max members */}
              <div>
                <label className="block text-[11px] text-[var(--ce-text-secondary)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                  Maximum members
                </label>
                <input
                  type="number"
                  min={2}
                  max={1000}
                  value={maxMembers}
                  onChange={e => setMaxMembers(Math.max(2, Math.min(1000, parseInt(e.target.value) || 2)))}
                  className="w-full px-3 py-2 rounded-lg text-[12px] outline-none bg-transparent text-[var(--ce-text-primary)]"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.04)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                    fontFamily: "var(--font-body)",
                    fontFeatureSettings: "'tnum'",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[11px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-4 py-2 rounded-lg text-[11px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: canSubmit ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.06)",
                  color: canSubmit ? "#08090C" : "var(--ce-text-quaternary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                Create Group
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Join with Code modal ────────────────────────────────────────────────────

function JoinCodeModal({
  open,
  onClose,
  onJoin,
}: {
  open: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setCode(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 60);
    }
  }, [open]);

  const handleChange = (i: number, value: string) => {
    const clean = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (!clean) {
      const next = [...code];
      next[i] = "";
      setCode(next);
      return;
    }
    const next = [...code];
    // If pasting multi-char, spread across inputs
    const chars = clean.split("");
    chars.forEach((ch, offset) => {
      if (i + offset < 6) next[i + offset] = ch;
    });
    setCode(next);
    // Focus next
    const lastFilled = Math.min(i + chars.length, 5);
    if (lastFilled < 5 && chars.length === 1) {
      inputRefs.current[i + 1]?.focus();
    } else if (next.every(c => c !== "")) {
      // Auto-submit
      setTimeout(() => onJoin(next.join("")), 120);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const canSubmit = code.every(c => c !== "");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9995] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={onClose} />
          <motion.div
            className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(14,16,20,0.98)",
              border: "1px solid rgba(var(--ce-glass-tint),0.12)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
              <h2 className="text-[15px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Join with invite code
              </h2>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]" aria-label="Close">
                <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-[11px] text-[var(--ce-text-tertiary)] mb-4 text-center" style={{ fontFamily: "var(--font-body)" }}>
                Enter the 6-character code your group admin shared with you
              </p>
              <div className="flex items-center justify-center gap-2 mb-5">
                {code.map((char, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="text"
                    maxLength={i === 0 ? 6 : 1}
                    value={char}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-10 h-12 text-center rounded-lg text-[18px] outline-none bg-transparent text-[var(--ce-text-primary)] uppercase"
                    style={{
                      background: "rgba(var(--ce-glass-tint),0.04)",
                      border: char ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.12)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontFeatureSettings: "'tnum'",
                    }}
                    aria-label={`Code character ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => canSubmit && onJoin(code.join(""))}
                disabled={!canSubmit}
                className="w-full py-2.5 rounded-xl text-[12px] cursor-pointer disabled:opacity-60"
                style={{
                  background: canSubmit ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.06)",
                  color: canSubmit ? "#08090C" : "var(--ce-text-quaternary)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                Join group
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scan QR modal ───────────────────────────────────────────────────────────

function ScanQRModal({
  open,
  onClose,
  onScanSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onScanSuccess: () => void;
}) {
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!open) setScanning(false);
  }, [open]);

  const handleStart = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onScanSuccess();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9995] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} onClick={onClose} />
          <motion.div
            className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(14,16,20,0.98)",
              border: "1px solid rgba(var(--ce-glass-tint),0.12)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
              <h2 className="text-[15px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Scan group invite QR
              </h2>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)]" aria-label="Close">
                <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
              </button>
            </div>
            <div className="p-5">
              <div
                className="aspect-square rounded-xl flex flex-col items-center justify-center mb-4 relative overflow-hidden"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.04)",
                  border: "1px dashed rgba(var(--ce-glass-tint),0.2)",
                }}
              >
                {scanning && (
                  <motion.div
                    className="absolute inset-x-4 h-0.5"
                    style={{ background: "var(--ce-cyan)", boxShadow: "0 0 12px var(--ce-cyan)" }}
                    initial={{ top: "15%" }}
                    animate={{ top: ["15%", "85%", "15%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                  />
                )}
                <QrCode className="w-14 h-14 text-[var(--ce-text-tertiary)] mb-2" />
                <p className="text-[11px] text-[var(--ce-text-tertiary)] text-center px-6" style={{ fontFamily: "var(--font-body)" }}>
                  {scanning ? "Scanning..." : "Point your camera at a CareerEdged QR code to connect"}
                </p>
              </div>
              <button
                onClick={handleStart}
                disabled={scanning}
                className="w-full py-2.5 rounded-xl text-[12px] cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                style={{
                  background: "var(--ce-cyan)",
                  color: "#08090C",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                <Camera className="w-3.5 h-3.5" />
                {scanning ? "Scanning..." : "Start Scanning"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
