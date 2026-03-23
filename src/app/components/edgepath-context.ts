/**
 * EdgePath Role Contextualization
 * 
 * Adapts EdgePath content to each user type's JBTD
 */

export interface EdgePathSophiaPanelData {
  sophiaInsight: { message: string; actionLabel: string; actionQuery: string };
  skillProgress?: { skill: string; pct: number; color: string }[];
  quickWins: { label: string; time: string }[];
  /** When true, renders job matches card. Supply jobs[] with the data. */
  showJobMatches: boolean;
  jobs?: { title: string; company: string; match: number }[];
  /** When true, renders mentor connection card. Supply mentor{} with the data. */
  showMentor: boolean;
  mentor?: { name: string; initial: string; role: string; nextSession: string; quote: string };
}

export interface EdgePathRoleContext {
  pathLabel: string;
  pathNoun: string; // "roadmap", "plan", "journey"
  milestoneNoun: string; // "milestone", "step", "task"
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  sophiaEmptyPrompt: string;
  sophiaActiveDefault: string;
  /** When provided, SophiaPanel renders this instead of the EdgeStar-specific defaults */
  sophiaPanel?: EdgePathSophiaPanelData;
}

export function getRoleContext(role: string): EdgePathRoleContext {
  switch (role) {
    case "edgestar":
      return {
        pathLabel: "Career Roadmap",
        pathNoun: "roadmap",
        milestoneNoun: "milestone",
        emptyStateTitle: "Build your personalized career roadmap",
        emptyStateSubtitle: "Sophia will help you create a step-by-step path to your target role",
        sophiaEmptyPrompt: "Tell me about your current role and where you want to go",
        sophiaActiveDefault: "You're on track with your Product Designer transition. 3 milestones ahead of schedule.",
      };
    case "edgepreneur":
      return {
        pathLabel: "Venture Roadmap",
        pathNoun: "roadmap",
        milestoneNoun: "milestone",
        emptyStateTitle: "Map your venture journey",
        emptyStateSubtitle: "Sophia will help you create a step-by-step plan from idea to launch",
        sophiaEmptyPrompt: "Tell me about your business idea and where you want to take it",
        sophiaActiveDefault: "Your pitch deck milestone is 80% complete. On track to finish this week.",
      };
    case "parent":
      return {
        pathLabel: "Alex's Career Plan",
        pathNoun: "plan",
        milestoneNoun: "step",
        emptyStateTitle: "Track Alex's career progress",
        emptyStateSubtitle: "View the personalized plan Sophia created for Alex's career goals",
        sophiaEmptyPrompt: "What career goals does Alex have?",
        sophiaActiveDefault: "Alex completed 2 milestones this week. Currently working on portfolio building.",
      };
    case "parent-career":
      return {
        pathLabel: "My Career",
        pathNoun: "roadmap",
        milestoneNoun: "milestone",
        emptyStateTitle: "Build your career roadmap",
        emptyStateSubtitle: "Sophia will help you create a step-by-step plan for your professional growth",
        sophiaEmptyPrompt: "Tell me about your current role and where you want to go",
        sophiaActiveDefault: "You're on track with your career transition. Upskilling phase is 60% complete.",
        sophiaPanel: {
          sophiaInsight: {
            message: "Your Strategic Leadership course is your highest-leverage milestone right now. Completing it unlocks your Q2 stretch assignment — the single biggest move toward Director-level scope.",
            actionLabel: "Continue course",
            actionQuery: "Help me make progress on my Strategic Leadership course",
          },
          skillProgress: [
            { skill: "Leadership", pct: 40, color: "#EC4899" },
            { skill: "Communication", pct: 65, color: "#22D3EE" },
            { skill: "Project Management", pct: 70, color: "#B3FF3B" },
            { skill: "Strategic Thinking", pct: 15, color: "#9CA3AF" },
          ],
          quickWins: [
            { label: "Ask manager about Q2 stretch opportunity", time: "10 min" },
            { label: "Add recent project outcome to LinkedIn", time: "5 min" },
            { label: "Connect with a Director-level peer", time: "15 min" },
          ],
          showJobMatches: false,
          showMentor: false,
        },
      };
    case "parent-support":
      return {
        pathLabel: "Support Journey",
        pathNoun: "journey",
        milestoneNoun: "step",
        emptyStateTitle: "Map your child support journey",
        emptyStateSubtitle: "Sophia will help you track how you're supporting Alex's career goals",
        sophiaEmptyPrompt: "How are you currently supporting Alex's career development?",
        sophiaActiveDefault: "Alex is on track. You've completed the Connect phase and are actively supporting.",
        sophiaPanel: {
          sophiaInsight: {
            message: "Alex is progressing well in the Connect phase. Your most impactful next step is setting your involvement level — it shapes how Alex receives your support and how often you'll be notified.",
            actionLabel: "Set involvement level",
            actionQuery: "Help me understand the involvement levels for supporting Alex",
          },
          quickWins: [
            { label: "Send Alex an encouragement note", time: "5 min" },
            { label: "Schedule a 15-min check-in this week", time: "2 min" },
            { label: "Ask one open-ended career question today", time: "Moment" },
          ],
          showJobMatches: false,
          showMentor: false,
        },
      };
    case "guide":
      return {
        pathLabel: "Client Roadmaps",
        pathNoun: "roadmap",
        milestoneNoun: "milestone",
        emptyStateTitle: "Manage client career roadmaps",
        emptyStateSubtitle: "View and support your clients' personalized career paths",
        sophiaEmptyPrompt: "Show me my active client roadmaps",
        sophiaActiveDefault: "Sharon is 3 milestones ahead on her Product Designer path. Consider advancing timeline.",
      };
    case "employer":
      return {
        pathLabel: "Talent Development Paths",
        pathNoun: "path",
        milestoneNoun: "step",
        emptyStateTitle: "Build talent development paths",
        emptyStateSubtitle: "Create structured growth roadmaps for your teams",
        sophiaEmptyPrompt: "Help me create development paths for my Product Design team",
        sophiaActiveDefault: "3 team members are on track with their Senior Designer roadmaps.",
      };
    case "edu":
      return {
        pathLabel: "Student Career Paths",
        pathNoun: "path",
        milestoneNoun: "milestone",
        emptyStateTitle: "Track student career readiness",
        emptyStateSubtitle: "Monitor personalized career roadmaps for your cohort",
        sophiaEmptyPrompt: "Show me student progress across career paths",
        sophiaActiveDefault: "Spring 2026 cohort: 68% career readiness. 45 students on track to meet placement goals.",
      };
    case "ngo":
      return {
        pathLabel: "Participant Pathways",
        pathNoun: "pathway",
        milestoneNoun: "step",
        emptyStateTitle: "Support participant career pathways",
        emptyStateSubtitle: "Track progress for program participants on their career journeys",
        sophiaEmptyPrompt: "Show me active participant pathways",
        sophiaActiveDefault: "12 participants completed interview prep this week. 8 are ready for job search phase.",
      };
    case "agency":
      return {
        pathLabel: "Workforce Development Paths",
        pathNoun: "path",
        milestoneNoun: "milestone",
        emptyStateTitle: "Manage workforce development",
        emptyStateSubtitle: "Track participant progress through employment readiness programs",
        sophiaEmptyPrompt: "Show me participant pathway completion rates",
        sophiaActiveDefault: "Q1 placement targets: 78% achieved. 34 participants entering final phase this month.",
      };
    default:
      return {
        pathLabel: "Career Roadmap",
        pathNoun: "roadmap",
        milestoneNoun: "milestone",
        emptyStateTitle: "Build your personalized roadmap",
        emptyStateSubtitle: "Sophia will help you create a step-by-step path",
        sophiaEmptyPrompt: "Tell me about your goals",
        sophiaActiveDefault: "You're on track. Keep going.",
      };
  }
}
