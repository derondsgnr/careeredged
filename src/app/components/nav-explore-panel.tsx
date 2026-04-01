/**
 * NavExplorePanel — Categorized feature directory
 *
 * A docked bottom panel showing all CareerEdge features organized by category.
 * Used by both navigation variations (Dock and Segmented Bar).
 * Role-aware: only shows features relevant to the current user type.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap, Compass, FileText, Briefcase, BookOpen, Calendar,
  Globe, BarChart3, DollarSign, ShoppingBag, Users,
  MessageSquare, GraduationCap, Search, X, Heart,
  type LucideIcon,
} from "lucide-react";
import { SophiaMark } from "./sophia-mark";
import { EASE, FONT, TEXT, COLORS } from "./tokens";
import type { RoleId } from "./role-shell";

// ─── Feature catalog ──────────────────────────────────────────────────────

interface FeatureItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  /** The surfaceId to navigate to */
  surfaceId: string;
  /** Badge count (optional) */
  badge?: number;
}

interface FeatureGroup {
  id: string;
  label: string;
  items: FeatureItem[];
}

function getFeatureCatalog(role: RoleId): FeatureGroup[] {
  // Core tools — available to most roles with role-specific labeling
  const edgeTools: FeatureItem[] = [];
  const marketplace: FeatureItem[] = [];
  const community: FeatureItem[] = [];
  const analytics: FeatureItem[] = [];

  // ── EdgeTools (role-adaptive) ──────────────────────────────────────────

  // EdgePath — all roles
  const pathLabel = role === "edgepreneur" ? "Venture Roadmap"
    : role === "parent" ? "My Path"
    : role === "guide" ? "Client Roadmaps"
    : role === "employer" ? "Talent Paths"
    : "EdgePathway";
  edgeTools.push({
    id: "edgepath", label: pathLabel, description: "Career roadmap & milestones",
    icon: Compass, color: COLORS.cyan, surfaceId: "edgepath",
  });

  // Resume — EdgeStar, EdgePreneur
  if (["edgestar", "edgepreneur"].includes(role)) {
    edgeTools.push({
      id: "resume", label: "EdgeCareer", description: "Resume builder & optimizer",
      icon: FileText, color: COLORS.lime, surfaceId: "resume",
    });
  }

  // Productivity — EdgeStar, EdgePreneur
  if (["edgestar", "edgepreneur"].includes(role)) {
    edgeTools.push({
      id: "productivity", label: "Edge Productivity", description: "Pomodoro, goals & OKRs",
      icon: Zap, color: COLORS.amber, surfaceId: "productivity",
    });
  }

  // Career Discovery — All roles
  edgeTools.push({
    id: "careers", label: "Career Discovery", description: "Explore 30+ careers & find your archetype",
    icon: Compass, color: COLORS.cyan, surfaceId: "careers",
  });

  // Jobs / EdgeMatch — EdgeStar, EdgePreneur, Employer, NGO, Agency
  if (["edgestar", "edgepreneur", "employer", "ngo", "agency"].includes(role)) {
    const jobLabel = role === "employer" ? "Job Postings" : "EdgeMatch";
    edgeTools.push({
      id: "jobs", label: jobLabel, description: role === "employer" ? "Post & manage positions" : "Job matches & applications",
      icon: Briefcase, color: COLORS.green, surfaceId: "jobs",
    });
  }

  // EdgeWorkplace — EdgeStar only (documents, templates & workspaces)
  if (role === "edgestar") {
    edgeTools.push({
      id: "workplace", label: "EdgeWorkplace", description: "Documents, templates & workspaces",
      icon: FileText, color: COLORS.amber, surfaceId: "workplace",
    });
  }

  // EdgeResources — All roles
  edgeTools.push({
    id: "resources", label: "EdgeResources", description: "Learning materials & guides",
    icon: BookOpen, color: COLORS.purple, surfaceId: "resources",
  });

  // Events — EdgeStar, Edu, NGO, Agency
  if (["edgestar", "edu", "ngo", "agency"].includes(role)) {
    edgeTools.push({
      id: "events", label: "EdgeEvents", description: "Career fairs & workshops",
      icon: Calendar, color: COLORS.blue, surfaceId: "events",
    });
  }

  // ImmigrationEdge — EdgeStar + EdgePreneur
  if (["edgestar", "edgepreneur"].includes(role)) {
    edgeTools.push({
      id: "immigration", label: "ImmigrationEdge", description: "Global career mobility pathways",
      icon: Globe, color: COLORS.orange, surfaceId: "immigration",
    });
  }

  // ScheduleEdge — EdgeStar, EdgePreneur, Guide, Employer, Edu
  if (["edgestar", "edgepreneur", "guide", "employer", "edu"].includes(role)) {
    edgeTools.push({
      id: "schedule", label: "ScheduleEdge", description: "Calendar, availability & reminders",
      icon: Calendar, color: COLORS.purple, surfaceId: "schedule",
    });
  }

  // Sessions — EdgeStar, EdgePreneur, Guide
  if (["edgestar", "edgepreneur", "guide"].includes(role)) {
    edgeTools.push({
      id: "sessions", label: "Sessions", description: role === "guide" ? "Manage client sessions" : "Book coaching sessions",
      icon: Users, color: COLORS.cyan, surfaceId: "sessions",
    });
  }

  // Family — Parent
  if (role === "parent") {
    edgeTools.push({
      id: "family", label: "Family Progress", description: "Track your child's journey",
      icon: Users, color: COLORS.pink, surfaceId: "family",
    });
  }

  // Pipeline — Employer
  if (role === "employer") {
    edgeTools.push({
      id: "pipeline", label: "Pipeline", description: "Application review & tracking",
      icon: Briefcase, color: COLORS.green, surfaceId: "pipeline",
    });
  }

  // Programs — NGO, Agency
  if (["ngo", "agency"].includes(role)) {
    edgeTools.push({
      id: "programs", label: "Programs", description: "Manage career programs",
      icon: BookOpen, color: COLORS.orange, surfaceId: "programs",
    });
  }

  // ── Marketplace ────────────────────────────────────────────────────────

  if (["edgestar", "edgepreneur", "parent"].includes(role)) {
    marketplace.push({
      id: "market", label: "EdgeMarket", description: "Browse opportunities",
      icon: ShoppingBag, color: COLORS.amber, surfaceId: "market",
    });
  }

  if (["edgestar", "edgepreneur", "parent", "edu"].includes(role)) {
    marketplace.push({
      id: "coaches", label: "EdgeCoach & Mentor", description: "Find expert guidance",
      icon: Users, color: COLORS.purple, surfaceId: "coaches",
    });
  }

  if (["edgestar", "edgepreneur", "parent", "edu"].includes(role)) {
    marketplace.push({
      id: "courses", label: "Courses", description: "Browse & enroll in learning",
      icon: GraduationCap, color: COLORS.blue, surfaceId: "courses",
    });
  }

  // ── Community ──────────────────────────────────────────────────────────

  // EdgeBuddy — EdgeStar + EdgePreneur only
  if (["edgestar", "edgepreneur"].includes(role)) {
    community.push({
      id: "buddy", label: "EdgeBuddy", description: "Find an accountability partner",
      icon: Heart, color: COLORS.cyan, sophiaPrompt: "Help me find an accountability partner who matches my career goals",
    });
  }

  // CommunityEdge — All roles except Parent
  if (role !== "parent") {
    community.push({
      id: "community", label: "CommunityEdge", description: "Feed, groups & events",
      icon: Users, color: COLORS.cyan, surfaceId: "community",
    });
  }

  // ── Analytics ──────────────────────────────────────────────────────────

  const analyticsLabel = role === "guide" ? "Earnings"
    : role === "employer" ? "EdgeSight"
    : role === "edu" ? "Outcomes"
    : ["ngo", "agency"].includes(role) ? "Impact"
    : "EdgeBoard";

  analytics.push({
    id: "analytics", label: analyticsLabel, description: "Performance data & insights",
    icon: BarChart3, color: COLORS.cyan, surfaceId: "analytics",
  });

  // Budget — EdgeStar, Parent
  if (["edgestar", "parent"].includes(role)) {
    analytics.push({
      id: "budget", label: "Budget", description: "Career investment tracker",
      icon: DollarSign, color: COLORS.lime, surfaceId: "budget",
    });
  }

  // Funding — EdgePreneur
  if (role === "edgepreneur") {
    analytics.push({
      id: "funding", label: "Funding", description: "Grants & accelerators",
      icon: DollarSign, color: COLORS.amber, surfaceId: "funding",
    });
  }

  // ── Build groups ───────────────────────────────────────────────────────

  const groups: FeatureGroup[] = [];
  if (edgeTools.length > 0) groups.push({ id: "tools", label: "EdgeTools", items: edgeTools });
  if (marketplace.length > 0) groups.push({ id: "marketplace", label: "Marketplace", items: marketplace });
  if (community.length > 0) groups.push({ id: "community", label: "CommunityEdge", items: community });
  if (analytics.length > 0) groups.push({ id: "analytics", label: "Analytics", items: analytics });

  return groups;
}

// ─── Panel Component ──────────────────────────────────────────────────────

interface NavExplorePanelProps {
  role: RoleId;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (surfaceId: string) => void;
  /** When true, panel renders above the Sophia bar (Variation A). When false, renders as its own section (Variation B). */
  variant?: "dock" | "inline";
}

export function NavExplorePanel({
  role,
  isOpen,
  onClose,
  onNavigate,
  variant = "dock",
}: NavExplorePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const catalog = getFeatureCatalog(role);

  // Filter by search
  const filtered = searchQuery.trim()
    ? catalog.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(group => group.items.length > 0)
    : catalog;

  const handleItemClick = (surfaceId: string) => {
    onNavigate(surfaceId);
    onClose();
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[38]"
            style={{ background: "rgba(var(--ce-shadow-tint),0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={`fixed left-0 right-0 z-[39] ${variant === "dock" ? "bottom-14" : "bottom-0"}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div
              className="max-w-[800px] mx-auto rounded-t-2xl overflow-hidden"
              style={{
                background: "var(--ce-surface-modal-bg)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                borderBottom: variant === "dock" ? "none" : undefined,
                backdropFilter: "blur(24px)",
                boxShadow: "0 -8px 40px rgba(var(--ce-shadow-tint),0.3)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
              >
                <div className="flex items-center gap-2.5">
                  <SophiaMark size={14} glowing={false} />
                  <span
                    className="text-[13px]"
                    style={{ color: TEXT.primary, fontFamily: FONT.display, fontWeight: 500 }}
                  >
                    Explore CareerEdge
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                  style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}
                >
                  <X className="w-3.5 h-3.5" style={{ color: TEXT.tertiary }} />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.03)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                  }}
                >
                  <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEXT.tertiary }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search features..."
                    className="flex-1 text-[12px] bg-transparent outline-none placeholder:text-[var(--ce-text-quaternary)]"
                    style={{ color: TEXT.primary, fontFamily: FONT.body }}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" style={{ color: TEXT.tertiary }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Feature groups */}
              <div
                className="px-5 py-4 overflow-y-auto"
                style={{ maxHeight: "min(420px, 60vh)" }}
              >
                {filtered.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[12px]" style={{ color: TEXT.tertiary, fontFamily: FONT.body }}>
                      No features match "{searchQuery}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filtered.map((group) => (
                    <div key={group.id}>
                      <span
                        className="text-[10px] uppercase tracking-wider block mb-2.5 px-1"
                        style={{ color: TEXT.tertiary, fontFamily: FONT.body, letterSpacing: "0.08em" }}
                      >
                        {group.label}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.surfaceId)}
                              className="flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.04)] group text-left"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group-hover:brightness-125"
                                style={{ background: "rgba(var(--ce-glass-tint), 0.06)" }}
                              >
                                <Icon className="w-4 h-4" style={{ color: "var(--ce-text-secondary)" }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-[12px] truncate"
                                    style={{ color: TEXT.primary, fontFamily: FONT.body, fontWeight: 500 }}
                                  >
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className="text-[9px] px-1.5 py-0.5 rounded-full"
                                      style={{
                                        background: `${COLORS.cyan}15`,
                                        color: COLORS.cyan,
                                        fontFamily: FONT.body,
                                      }}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className="text-[10px] block truncate"
                                  style={{ color: TEXT.tertiary, fontFamily: FONT.body }}
                                >
                                  {item.description}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
