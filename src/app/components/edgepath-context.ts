/**
 * EdgePath Role Contextualization
 * 
 * Adapts EdgePath content to each user type's JBTD
 */

export interface EdgePathRoleContext {
  pathLabel: string;
  pathNoun: string; // "roadmap", "plan", "journey"
  milestoneNoun: string; // "milestone", "step", "task"
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  sophiaEmptyPrompt: string;
  sophiaActiveDefault: string;
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
