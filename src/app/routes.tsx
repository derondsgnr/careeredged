/**
 * Route configuration — React Router Data Mode
 * 
 * Real paths replace the old surface switcher.
 * Archive routes preserve all design variations.
 */

import { createBrowserRouter, useNavigate, useParams, useOutletContext } from "react-router";
import { useCallback } from "react";
import RootLayout from "./layouts/root-layout";
import type { AppState } from "./components/state-toggle";

// ─── Existing components (unchanged) ────────────────────────────────

import { LandingV1 } from "./components/landing/landing-v1";
import { LandingV2 } from "./components/landing/landing-v2";
import { LandingV3 } from "./components/landing/landing-v3";
import { LandingV4 } from "./components/landing/landing-v4";
import { LandingV5 } from "./components/landing/landing-v5";
import { LandingV6 } from "./components/landing/landing-v6";
import { LandingV7 } from "./components/landing/landing-v7";
import { LandingV8 } from "./components/landing/landing-v8";
import { LandingV9 } from "./components/landing/landing-v9";
import { LandingV6A } from "./components/landing/landing-v6a";
import { LandingV6B } from "./components/landing/landing-v6b";
import { LandingV6C } from "./components/landing/landing-v6c";
import { AuthPage } from "./components/landing/auth-page";
import { EdgeProd } from "./components/edge-prod";
import { OnboardingH1 } from "./components/onboarding-h1";
import { OnboardingH2 } from "./components/onboarding-h2";
import { OnboardingH3 } from "./components/onboarding-h3";
import { ShellH1 } from "./components/shell-h1";
import { ShellH2 } from "./components/shell-h2";
import { ShellH3 } from "./components/shell-h3";
import { ShellSynthesis } from "./components/shell-synthesis";
import { EdgePathOptionA } from "./components/edgepath-option-a";
import { EdgePathOptionB } from "./components/edgepath-option-b";
import { ResumeEdge } from "./components/resume-edge";
import { EdgeMatchForRole } from "./components/edge-match";
import { TaskRoom } from "./components/task-room";
import { GuideProfileEditSurface } from "./components/guide-profile-edit";
import { ImmigrationSurface } from "./components/surfaces/immigration-surface";
import { CareerDiscovery } from "./components/career-discovery";
import { Messaging } from "./components/messaging";
import { EdgeSight } from "./components/edgesight";
import { Sessions } from "./components/sessions";
import { EdgePreneurDashboard } from "./components/dashboards/edgepreneur-dashboard";
import { EdgeParentDashboard } from "./components/dashboards/edgeparent-dashboard";
import { ParentEdgepath } from "./components/parent-edgepath";
import { EdgeGuideDashboard } from "./components/dashboards/edgeguide-dashboard";
import { EdgeEmployerDashboard } from "./components/dashboards/edgeemployer-dashboard";
import { EdgeEducationDashboard } from "./components/dashboards/edgeeducation-dashboard";
import { EdgeNGODashboard } from "./components/dashboards/edgengo-dashboard";
import { EdgeAgencyDashboard } from "./components/dashboards/edgeagency-dashboard";

// ─── Layer 3 surfaces ────────────────────────────────────────────────

import { FamilySurface }   from "./components/surfaces/family-surface";
import { FamilySurfaceSwitcher } from "./components/surfaces/family-switcher";
import { PipelineSurface } from "./components/surfaces/pipeline-surface";
import { EventsSurface }   from "./components/surfaces/events-surface";
import { ProgramsSurface } from "./components/surfaces/programs-surface";
import { ClientsSurface }  from "./components/surfaces/clients-surface";
import { FundingSurface }  from "./components/surfaces/funding-surface";

// ─── Types ──────────────────────────────────────────────────────────

type RoleId = "edgestar" | "edgepreneur" | "parent" | "guide" | "employer" | "edu" | "ngo" | "agency";

const ALL_ROLES: RoleId[] = ["edgestar", "edgepreneur", "parent", "guide", "employer", "edu", "ngo", "agency"];

// ─── Wrapper components (provide navigation to existing components) ─

function LandingPage() {
  const navigate = useNavigate();
  const handleNavigate = useCallback((page: string) => {
    if (page === "home") navigate("/");
    else if (page === "login") navigate("/login");
    else if (page === "signup") navigate("/signup");
    else if (page === "careers") navigate("/careers");
  }, [navigate]);
  return <LandingV1 onNavigate={handleNavigate} />;
}

function LoginPage() {
  const navigate = useNavigate();
  return <AuthPage mode="login" onNavigate={(p: string) => {
    if (p === "home") navigate("/");
    else if (p === "login") navigate("/login");
    else if (p === "signup") navigate("/signup");
  }} onAuth={(action: "login" | "signup") => {
    if (action === "login") navigate("/edgestar");
    else navigate("/onboarding");
  }} />;
}

function SignupPage() {
  const navigate = useNavigate();
  return <AuthPage mode="signup" onNavigate={(p: string) => {
    if (p === "home") navigate("/");
    else if (p === "login") navigate("/login");
    else if (p === "signup") navigate("/signup");
  }} onAuth={(action: "login" | "signup") => {
    if (action === "login") navigate("/edgestar");
    else navigate("/onboarding");
  }} />;
}

function OnboardingPage() {
  const navigate = useNavigate();
  const { setAppState } = useOutletContext<{ appState: AppState; setAppState: (s: AppState) => void }>();
  const handleComplete = useCallback((role?: string) => {
    const r = role && ALL_ROLES.includes(role as RoleId) ? role : "edgestar";
    setAppState("active");
    navigate(`/${r}`);
  }, [navigate, setAppState]);
  return <OnboardingH2 onComplete={handleComplete} />;
}

// ─── Role-aware surface wrappers ────────────────────────────────────

function useRoleNavigation(): {
  role: RoleId;
  onNavigate: (target: string) => void;
  appState: AppState;
  setAppState: (s: AppState) => void;
} {
  const { role: roleParam } = useParams<{ role: string }>();
  const { appState, setAppState } = useOutletContext<{ appState: AppState; setAppState: (s: AppState) => void }>();
  const navigate = useNavigate();
  const role = (ALL_ROLES.includes(roleParam as RoleId) ? roleParam : "edgestar") as RoleId;

  const onNavigate = useCallback((target: string) => {
    const surfaceToPath: Record<string, string> = {
      synthesis: `/${role}`,
      edgepath:  `/${role}/edgepath`,
      resume:    `/${role}/resume`,
      jobs:      `/${role}/jobs`,
      messages:  `/${role}/messages`,
      analytics: `/${role}/analytics`,
      taskroom:  `/${role}/taskroom`,
      sessions:  `/${role}/sessions`,
      profile:   `/${role}/profile`,
      productivity: `/${role}/productivity`,
      immigration: `/${role}/immigration`,
      careers: `/${role}/careers`,
      // Layer 3 surfaces
      family:    `/${role}/family`,
      clients:   `/${role}/clients`,
      pipeline:  `/${role}/pipeline`,
      events:    `/${role}/events`,
      programs:  `/${role}/programs`,
      funding:   `/${role}/funding`,
      // Global
      landing:   "/",
    };
    navigate(surfaceToPath[target] || `/${role}`);
  }, [role, navigate]);

  return { role, onNavigate, appState, setAppState };
}

function DashboardPage() {
  const { role, onNavigate, appState, setAppState } = useRoleNavigation();
  const navigate = useNavigate();

  if (appState === "onboarding") {
    const handleOnboardingComplete = (completedRole?: string) => {
      const r = completedRole && ALL_ROLES.includes(completedRole as RoleId)
        ? completedRole
        : role;
      setAppState("active");
      navigate(`/${r}`);
    };
    return <OnboardingH2 onComplete={handleOnboardingComplete} />;
  }

  const handleOpenTaskRoom = (milestoneId: string) => {
    navigate(`/${role}/taskroom/${milestoneId}`);
  };

  switch (role) {
    case "edgepreneur": return <EdgePreneurDashboard onNavigate={onNavigate} />;
    case "parent":      return <EdgeParentDashboard  onNavigate={onNavigate} />;
    case "guide":       return <EdgeGuideDashboard   onNavigate={onNavigate} />;
    case "employer":    return <EdgeEmployerDashboard onNavigate={onNavigate} />;
    case "edu":         return <EdgeEducationDashboard onNavigate={onNavigate} />;
    case "ngo":         return <EdgeNGODashboard     onNavigate={onNavigate} />;
    case "agency":      return <EdgeAgencyDashboard  onNavigate={onNavigate} />;
    default:            return <ShellSynthesis onNavigate={onNavigate} onOpenTaskRoom={handleOpenTaskRoom} />;
  }
}

function JobsPage() {
  const { role, onNavigate } = useRoleNavigation();
  return <EdgeMatchForRole role={role} onNavigate={onNavigate} />;
}

function ResumePage() {
  const { role, onNavigate } = useRoleNavigation();
  return <ResumeEdge role={role} onNavigate={onNavigate} />;
}

function MessagesPage() {
  const { role, onNavigate } = useRoleNavigation();
  return <Messaging role={role} onNavigate={onNavigate} />;
}

function AnalyticsPage() {
  const { role, onNavigate } = useRoleNavigation();
  return <EdgeSight role={role} onNavigate={onNavigate} />;
}

function EdgePathPage() {
  const { role, onNavigate } = useRoleNavigation();
  const navigate = useNavigate();
  const handleOpenTaskRoom = useCallback((milestoneId: string) => {
    navigate(`/${role}/taskroom/${milestoneId}`);
  }, [role, navigate]);
  return <EdgePathOptionA role={role} onOpenTaskRoom={handleOpenTaskRoom} onNavigate={onNavigate} />;
}

function ParentEdgepathPage() {
  const navigate = useNavigate();
  const onNavigate = useCallback((target: string) => {
    const paths: Record<string, string> = {
      synthesis: "/parent",
      edgepath:  "/parent/edgepath",
      family:    "/parent/family",
      messages:  "/parent/messages",
      taskroom:  "/parent/taskroom",
      landing:   "/",
    };
    navigate(paths[target] || "/parent");
  }, [navigate]);
  const onOpenTaskRoom = useCallback((milestoneId: string) => {
    navigate(`/parent/taskroom/${milestoneId}`);
  }, [navigate]);
  return <ParentEdgepath onNavigate={onNavigate} onOpenTaskRoom={onOpenTaskRoom} />;
}

function TaskRoomPage() {
  const { role, onNavigate } = useRoleNavigation();
  const { milestoneId } = useParams<{ milestoneId: string }>();
  return <TaskRoom onNavigate={onNavigate} milestoneId={milestoneId || "m6"} role={role} />;
}

function SessionsPage() {
  const { role, onNavigate } = useRoleNavigation();
  return <Sessions role={role} onNavigate={onNavigate} />;
}

function ProfilePage() {
  const { role, onNavigate } = useRoleNavigation();
  return <GuideProfileEditSurface role={role} onNavigate={onNavigate} />;
}

function ProductivityPage() {
  const { role, onNavigate } = useRoleNavigation();
  return <EdgeProd role={role} onNavigate={onNavigate} />;
}

// ─── Archive wrappers ───────────────────────────────────────────────

function ArchiveOnboarding() {
  const { hypothesis } = useParams<{ hypothesis: string }>();
  const navigate = useNavigate();
  const handleComplete = useCallback((role?: string) => {
    const r = role && ALL_ROLES.includes(role as RoleId) ? role : "edgestar";
    navigate(`/${r}`);
  }, [navigate]);
  if (hypothesis === "h1") return <OnboardingH1 onComplete={handleComplete} />;
  if (hypothesis === "h3") return <OnboardingH3 onComplete={handleComplete} />;
  return <OnboardingH2 onComplete={handleComplete} />;
}

function ArchiveOnboardingIndex() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#08090C" }}>
      <h1 className="text-[20px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Onboarding Variations</h1>
      <div className="flex gap-3">
        {[
          { id: "h1", label: "H1 — World Opens Up" },
          { id: "h2", label: "H2 — Builds Around You" },
          { id: "h3", label: "H3 — Sophia Speaks First" },
        ].map(h => (
          <button key={h.id} onClick={() => navigate(`/archive/onboarding/${h.id}`)} className="px-4 py-3 rounded-xl cursor-pointer text-[13px] text-[#E8E8ED]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {h.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ArchiveShell() {
  const { hypothesis } = useParams<{ hypothesis: string }>();
  if (hypothesis === "h1") return <ShellH1 />;
  if (hypothesis === "h3") return <ShellH3 />;
  return <ShellH2 />;
}

function ArchiveShellIndex() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#08090C" }}>
      <h1 className="text-[20px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Shell Explorations</h1>
      <div className="flex gap-3">
        {[
          { id: "h1", label: "H1 — The Corridor" },
          { id: "h2", label: "H2 — Sophia Forward" },
          { id: "h3", label: "H3 — Mission Control" },
        ].map(h => (
          <button key={h.id} onClick={() => navigate(`/archive/shell/${h.id}`)} className="px-4 py-3 rounded-xl cursor-pointer text-[13px] text-[#E8E8ED]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {h.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ArchiveLanding() {
  const { variation } = useParams<{ variation: string }>();
  const navigate = useNavigate();
  const handleNavigate = useCallback((page: string) => {
    if (page === "home") navigate("/");
    else if (page === "login") navigate("/login");
    else if (page === "signup") navigate("/signup");
  }, [navigate]);
  if (variation === "v2") return <LandingV2 onNavigate={handleNavigate} />;
  if (variation === "v3") return <LandingV3 onNavigate={handleNavigate} />;
  if (variation === "v4") return <LandingV4 onNavigate={handleNavigate} />;
  if (variation === "v5") return <LandingV5 onNavigate={handleNavigate} />;
  if (variation === "v6") return <LandingV6 onNavigate={handleNavigate} />;
  if (variation === "v7") return <LandingV7 onNavigate={handleNavigate} />;
  if (variation === "v8") return <LandingV8 onNavigate={handleNavigate} />;
  if (variation === "v9") return <LandingV9 onNavigate={handleNavigate} />;
  if (variation === "v6a") return <LandingV6A onNavigate={handleNavigate} />;
  if (variation === "v6b") return <LandingV6B onNavigate={handleNavigate} />;
  if (variation === "v6c") return <LandingV6C onNavigate={handleNavigate} />;
  return <LandingV1 onNavigate={handleNavigate} />;
}

function ArchiveLandingIndex() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#08090C" }}>
      <h1 className="text-[20px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Landing Page Variations</h1>
      <div className="flex gap-3">
        {[
          { id: "v1", label: "V1 — The Editorial" },
          { id: "v2", label: "V2 — The Proof" },
          { id: "v3", label: "V3 — The Narrative" },
          { id: "v4", label: "V4 — The Architect" },
          { id: "v5", label: "V5 — The Conversation" },
          { id: "v6", label: "V6 — The Gallery" },
          { id: "v7", label: "V7 — The Data Canvas" },
          { id: "v8", label: "V8 — The Manifesto" },
          { id: "v9", label: "V9 — The Ecosystem" },
          { id: "v6a", label: "V6-A — Conviction" },
          { id: "v6b", label: "V6-B — Intimacy" },
          { id: "v6c", label: "V6-C — Precision" },
        ].map(v => (
          <button key={v.id} onClick={() => navigate(`/archive/landing/${v.id}`)} className="px-4 py-3 rounded-xl cursor-pointer text-[13px] text-[#E8E8ED]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ArchiveEdgePath() {
  const { option } = useParams<{ option: string }>();
  const navigate = useNavigate();
  const handleOpenTaskRoom = useCallback((milestoneId: string) => {
    navigate(`/edgestar/taskroom/${milestoneId}`);
  }, [navigate]);
  if (option === "b") return <EdgePathOptionB />;
  return <EdgePathOptionA onOpenTaskRoom={handleOpenTaskRoom} />;
}

function ArchiveEdgePathIndex() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#08090C" }}>
      <h1 className="text-[20px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EdgePath Variations</h1>
      <div className="flex gap-3">
        {[
          { id: "a", label: "Option A — Two-Column + Map" },
          { id: "b", label: "Option B — Inline Feed + Map" },
        ].map(o => (
          <button key={o.id} onClick={() => navigate(`/archive/edgepath/${o.id}`)} className="px-4 py-3 rounded-xl cursor-pointer text-[13px] text-[#E8E8ED]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#08090C" }}>
      <h1 className="text-[28px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>404</h1>
      <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>This page doesn't exist.</p>
      <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg cursor-pointer text-[12px] text-[#22D3EE]" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)", fontFamily: "var(--font-body)" }}>
        Go home
      </button>
    </div>
  );
}

// ─── Router ─────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Landing & Auth
      { index: true, Component: LandingPage },
      { path: "login",      Component: LoginPage },
      { path: "signup",     Component: SignupPage },
      { path: "onboarding", Component: OnboardingPage },

      // Role-based surfaces: /:role/*
      { path: ":role",                          Component: DashboardPage },
      { path: ":role/jobs",                     Component: JobsPage },
      { path: ":role/resume",                   Component: ResumePage },
      { path: ":role/messages",                 Component: MessagesPage },
      { path: ":role/analytics",                Component: AnalyticsPage },
      { path: "parent/edgepath",                Component: ParentEdgepathPage },
      { path: ":role/edgepath",                 Component: EdgePathPage },
      { path: ":role/taskroom",                 Component: TaskRoomPage },
      { path: ":role/taskroom/:milestoneId",    Component: TaskRoomPage },
      { path: ":role/sessions",                 Component: SessionsPage },
      { path: ":role/profile",                  Component: ProfilePage },
      { path: ":role/productivity",              Component: ProductivityPage },
      // Layer 3 surfaces
      { path: ":role/family",                   Component: FamilySurfaceSwitcher },
      { path: ":role/clients",                  Component: ClientsSurface },
      { path: ":role/pipeline",                 Component: PipelineSurface },
      { path: ":role/events",                   Component: EventsSurface },
      { path: ":role/programs",                 Component: ProgramsSurface },
      { path: ":role/funding",                  Component: FundingSurface },
      { path: ":role/immigration",              Component: ImmigrationSurface },
      { path: ":role/careers",                  Component: CareerDiscovery },
      { path: "careers",                        Component: CareerDiscovery },

      // Archives
      { path: "archive/onboarding",             Component: ArchiveOnboardingIndex },
      { path: "archive/onboarding/:hypothesis", Component: ArchiveOnboarding },
      { path: "archive/shell",                  Component: ArchiveShellIndex },
      { path: "archive/shell/:hypothesis",      Component: ArchiveShell },
      { path: "archive/landing",                Component: ArchiveLandingIndex },
      { path: "archive/landing/:variation",     Component: ArchiveLanding },
      { path: "archive/edgepath",               Component: ArchiveEdgePathIndex },
      { path: "archive/edgepath/:option",       Component: ArchiveEdgePath },

      // 404
      { path: "*", Component: NotFound },
    ],
  },
]);
