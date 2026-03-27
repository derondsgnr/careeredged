/**
 * Surface Placeholder Pages — Layer 3 surfaces pre-wired but not yet built.
 *
 * Each new surface registered in ROLE_CONFIGS gets a proper placeholder here:
 * - Correct icon, title, and role-accurate description
 * - An EmptyState with contextual CTA
 * - A Sophia entry point with a relevant prompt
 * - Wrapped in RoleShell so nav, Sophia bar, and notifications all work
 *
 * When Layer 3 builds the real surface, this file gets replaced.
 */

import { useParams, useNavigate } from "react-router";
import { RoleShell } from "./role-shell";
import { EmptyState } from "./shared-patterns";
import type { RoleId } from "./role-shell";
import {
  Heart, Users, Kanban, Calendar, BookOpen, Layers, TrendingUp,
  type LucideIcon,
} from "lucide-react";

// ─── Role color map ───────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  edgestar: "var(--ce-role-edgestar)",
  edgepreneur: "var(--ce-role-edgepreneur)",
  parent: "var(--ce-role-parent)",
  guide: "var(--ce-role-guide)",
  employer: "var(--ce-role-employer)",
  edu: "var(--ce-role-edu)",
  ngo: "var(--ce-role-ngo)",
  agency: "var(--ce-role-agency)",
};

const ALL_ROLES: RoleId[] = ["edgestar", "edgepreneur", "parent", "guide", "employer", "edu", "ngo", "agency"];

// ─── Surface config per surfaceKey ───────────────────────────────────────────

interface SurfaceConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryLabel: string;
  sophiaPrompt: string;
  sophiaLabel: string;
}

const SURFACE_CONFIGS: Record<string, SurfaceConfig> = {
  family: {
    icon: Heart,
    title: "No children linked yet",
    description:
      "Connect your child's account by scanning their QR code. Once linked, you'll see their roadmap progress, milestones, and career readiness in real time.",
    primaryLabel: "Scan child's QR code",
    sophiaPrompt: "How do I link my child's account and what will I be able to see?",
    sophiaLabel: "Ask Sophia how linking works",
  },
  clients: {
    icon: Users,
    title: "Your client roster",
    description:
      "See all your active clients in one place — their roadmap phase, last session, upcoming milestones, and whether they need your attention.",
    primaryLabel: "View client roster",
    sophiaPrompt: "Show me my client roster, who needs the most support this week, and which sessions are coming up",
    sophiaLabel: "Ask Sophia about your clients",
  },
  pipeline: {
    icon: Kanban,
    title: "Your hiring pipeline",
    description:
      "Review applications, move candidates through stages, and see your best matches — all in one view. Post a new job to start filling your pipeline.",
    primaryLabel: "Post a job",
    sophiaPrompt: "Show me my current hiring pipeline and who the top candidates are for each open role",
    sophiaLabel: "Ask Sophia about candidates",
  },
  events: {
    icon: Calendar,
    title: "No events created yet",
    description:
      "Create career events, office hours, or workshops. Once created, you'll get a QR code for student check-ins and a live attendance roster.",
    primaryLabel: "Create your first event",
    sophiaPrompt: "Help me plan an upcoming career event — what do I need to set up for QR check-ins to work?",
    sophiaLabel: "Ask Sophia about event setup",
  },
  programs: {
    icon: BookOpen,
    title: "Your programs & grants",
    description:
      "Manage active programs, track participant progress, and apply for grants to fund your work. Your impact reporting lives here too.",
    primaryLabel: "Browse available grants",
    sophiaPrompt: "Show me available grants I can apply for and the status of my current programs",
    sophiaLabel: "Ask Sophia about grants",
  },
  funding: {
    icon: TrendingUp,
    title: "Find your funding",
    description:
      "Browse accelerators, grants, angel networks, and strategic partnerships matched to your current venture stage. Apply directly or let Sophia prep your pitch.",
    primaryLabel: "Browse funding opportunities",
    sophiaPrompt: "Find funding opportunities that match my venture stage and help me understand which ones I should prioritize",
    sophiaLabel: "Ask Sophia about funding strategy",
  },
};

// Agency programs surface gets a slightly different config
const AGENCY_PROGRAMS_CONFIG: SurfaceConfig = {
  icon: Layers,
  title: "Programs & grant distribution",
  description:
    "Create and manage workforce development programs, distribute grants to qualifying NGOs, and track placement metrics across all active programs.",
  primaryLabel: "Create a program",
  sophiaPrompt: "Show me the status of all active programs and which NGOs have applied for grants this month",
  sophiaLabel: "Ask Sophia about program status",
};

// ─── Shared placeholder page ──────────────────────────────────────────────────

function SurfacePlaceholderPage({ surfaceKey }: { surfaceKey: string }) {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = (ALL_ROLES.includes(roleParam as RoleId) ? roleParam : "edgestar") as RoleId;
  const roleColor = ROLE_COLORS[role] ?? "var(--ce-role-edgestar)";

  // Pick the right config — agency gets its own programs config
  const config =
    surfaceKey === "programs" && role === "agency"
      ? AGENCY_PROGRAMS_CONFIG
      : SURFACE_CONFIGS[surfaceKey] ?? SURFACE_CONFIGS.family;

  const handleNavigate = (target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`,
      edgepath: `/${role}/edgepath`,
      resume: `/${role}/resume`,
      jobs: `/${role}/jobs`,
      messages: `/${role}/messages`,
      analytics: `/${role}/analytics`,
      taskroom: `/${role}/taskroom`,
      sessions: `/${role}/sessions`,
      family: `/${role}/family`,
      clients: `/${role}/clients`,
      pipeline: `/${role}/pipeline`,
      events: `/${role}/events`,
      programs: `/${role}/programs`,
      funding: `/${role}/funding`,
      landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  // Surface-specific Sophia context — so the bottom bar is always relevant
  const sophiaContext = {
    message: config.sophiaLabel,
    chips: [{ label: "Ask Sophia", action: config.sophiaPrompt }],
  };

  return (
    <RoleShell
      role={role}
      userName="You"
      userInitial="Y"
      edgeGas={45}
      onNavigate={handleNavigate}
      sophiaOverride={sophiaContext}
    >
      <div className="pt-8">
        <EmptyState
          icon={config.icon}
          title={config.title}
          description={config.description}
          primaryAction={{
            label: config.primaryLabel,
            onClick: () => {
              // Primary action navigates back to home with Sophia open context
              // Full implementation in Layer 3
              handleNavigate(`/${role}`);
            },
          }}
          roleColor={roleColor}
          delay={0.1}
        />
      </div>
    </RoleShell>
  );
}

// ─── Named exports per surface ────────────────────────────────────────────────

export function FamilySurface() {
  return <SurfacePlaceholderPage surfaceKey="family" />;
}

export function ClientsSurface() {
  return <SurfacePlaceholderPage surfaceKey="clients" />;
}

export function PipelineSurface() {
  return <SurfacePlaceholderPage surfaceKey="pipeline" />;
}

export function EventsSurface() {
  return <SurfacePlaceholderPage surfaceKey="events" />;
}

export function ProgramsSurface() {
  return <SurfacePlaceholderPage surfaceKey="programs" />;
}

export function FundingSurface() {
  return <SurfacePlaceholderPage surfaceKey="funding" />;
}