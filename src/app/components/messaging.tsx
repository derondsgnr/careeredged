import { EASE } from "./tokens";
/**
 * Messaging Surface — Full implementation per /docs/messaging-video-ux-spec.md
 * 
 * Three-panel layout: Conversation List | Active Thread | Context Panel
 * 5 thread types: DM, Group, Sophia, Session, Application
 * Simulated real-time, smart replies, typing indicator, cross-surface navigation
 * Role-adaptive mock data for all 8 roles
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SophiaMark } from "./sophia-mark";
import { RoleShell, type NavigateFn, type RoleId } from "./role-shell";
import { consumeMessages as consumeQueuedMessages } from "./message-queue";
import {
  Search, Pin, Video, MoreHorizontal, Send, Paperclip,
  X, ChevronLeft, ChevronRight, Calendar, Briefcase, Users,
  FileText, Download, Play,
  ExternalLink, Star, ArrowDown, Sparkles,
  MessageSquare,
} from "lucide-react";


// ─── Types ────────────────────────────────────────────────────────────

type ThreadType = "dm" | "group" | "sophia" | "session" | "application";

interface Participant {
  id: string;
  name: string;
  initial: string;
  role?: string;
  avatar?: string;
  isSophia?: boolean;
  specialties?: string[];
  rating?: number;
  company?: string;
  jobTitle?: string;
}

interface SessionDetails {
  date: string;
  time: string;
  timezone: string;
  duration: string;
  type: string;
  status: "upcoming" | "in_progress" | "completed";
}

interface ApplicationDetails {
  company: string;
  role: string;
  status: "applied" | "viewed" | "interviewing" | "offer" | "rejected";
  matchPercent: number;
  appliedDate: string;
}

interface GroupDetails {
  description: string;
  memberCount: number;
}

interface FileDetails {
  name: string;
  size: string;
  type: string;
}

interface LinkPreview {
  title: string;
  description: string;
  favicon: string;
  url: string;
}

interface SessionCard {
  participantName: string;
  date: string;
  time: string;
  timezone: string;
  status: "upcoming" | "in_progress" | "completed";
  duration: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  type: "text" | "file" | "image" | "voice" | "video" | "link" | "session_card" | "system";
  content: string;
  timestamp: string;
  fileDetails?: FileDetails;
  imageUrl?: string;
  linkPreview?: LinkPreview;
  sessionCard?: SessionCard;
}

interface Thread {
  id: string;
  type: ThreadType;
  title: string;
  participants: Participant[];
  messages: Message[];
  unread: boolean;
  pinned: boolean;
  lastMessageTime: string;
  lastMessagePreview: string;
  sessionDetails?: SessionDetails;
  applicationDetails?: ApplicationDetails;
  groupDetails?: GroupDetails;
  smartReplies?: string[];
  hasSummary?: boolean;
  summaryText?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────

const SOPHIA: Participant = {
  id: "sophia", name: "Sophia", initial: "S", isSophia: true,
};

const ME: Participant = { id: "me", name: "You", initial: "S" };

function createEdgeStarThreads(): Thread[] {
  return [
    // 1. DM — Mentor (Alice Chen)
    {
      id: "dm-alice",
      type: "dm",
      title: "Alice Chen",
      participants: [
        { id: "alice", name: "Alice Chen", initial: "A", role: "Product Design Lead at Stripe", specialties: ["Product Design", "Career Transitions", "Portfolio Reviews"], rating: 4.9 },
      ],
      unread: true,
      pinned: true,
      lastMessageTime: "2m",
      lastMessagePreview: "I reviewed your case study — the narrative arc is strong",
      hasSummary: true,
      summaryText: "Alice reviewed your portfolio case study and suggested strengthening the metrics section. You agreed to add quantified impact data and resubmit by Friday. She also recommended scheduling a mock interview next week.",
      smartReplies: ["Thanks for the feedback!", "I'll work on the metrics section", "When works for the mock interview?"],
      messages: [
        { id: "a1", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Hey Sharon! I had a chance to look at the case study you sent over.", timestamp: "Yesterday, 3:42 PM" },
        { id: "a2", senderId: "alice", senderName: "Alice Chen", type: "text", content: "The narrative arc is really strong. You do a great job of setting up the problem space and walking through your design process. The before/after comparisons are compelling.", timestamp: "Yesterday, 3:43 PM" },
        { id: "a3", senderId: "me", senderName: "You", type: "text", content: "Thank you! I spent a lot of time on the flow — wanted to make sure it told a complete story.", timestamp: "Yesterday, 3:50 PM" },
        { id: "a4", senderId: "alice", senderName: "Alice Chen", type: "text", content: "One area to strengthen: the metrics section. Right now you mention \"improved conversion\" but don't quantify it. Can you add specific numbers? Even estimates help — \"estimated 15-20% improvement based on A/B test results\".", timestamp: "Yesterday, 3:52 PM" },
        { id: "a5", senderId: "me", senderName: "You", type: "text", content: "Good point. I actually do have some data from the A/B test. Let me pull those numbers and update the case study.", timestamp: "Yesterday, 4:01 PM" },
        { id: "a6", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Perfect. Also — have you thought about scheduling a mock interview? You mentioned Figma is your top choice, and I have some experience with their interview process.", timestamp: "Yesterday, 4:03 PM" },
        { id: "a7", senderId: "me", senderName: "You", type: "text", content: "That would be amazing! I'm nervous about the portfolio presentation portion.", timestamp: "Yesterday, 4:10 PM" },
        { id: "a8", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Don't be — you've done the hard work. Let's schedule something for next week. I'll walk you through what to expect and we can do a dry run.", timestamp: "Yesterday, 4:12 PM" },
        { id: "a9", senderId: "me", senderName: "You", type: "image", content: "", timestamp: "Yesterday, 4:20 PM", imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop" },
        { id: "a10", senderId: "me", senderName: "You", type: "text", content: "Here's a preview of the updated metrics section. What do you think?", timestamp: "Yesterday, 4:21 PM" },
        { id: "a11", senderId: "alice", senderName: "Alice Chen", type: "text", content: "This is so much better! The 23% conversion increase really lands. And the engagement graph is a nice touch.", timestamp: "Yesterday, 4:35 PM" },
        { id: "a12", senderId: "alice", senderName: "Alice Chen", type: "file", content: "", timestamp: "Yesterday, 4:36 PM", fileDetails: { name: "interview-prep-guide.pdf", size: "2.4 MB", type: "pdf" } },
        { id: "a13", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Here's a prep guide I put together for design interviews. Has some Figma-specific tips too.", timestamp: "Yesterday, 4:36 PM" },
        { id: "a14", senderId: "me", senderName: "You", type: "text", content: "This is incredibly helpful, Alice. Thank you so much for taking the time!", timestamp: "Yesterday, 5:02 PM" },
        { id: "a15", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Of course! That's what I'm here for. Let me know once you've finalized the case study and we'll set up that mock interview.", timestamp: "Yesterday, 5:05 PM" },
        { id: "a16", senderId: "me", senderName: "You", type: "text", content: "Will do. Working on it tonight!", timestamp: "Yesterday, 5:10 PM" },
        { id: "a17", senderId: "alice", senderName: "Alice Chen", type: "link", content: "", timestamp: "Today, 9:15 AM", linkPreview: { title: "How Figma Evaluates Design Portfolios", description: "A behind-the-scenes look at what the Figma design team looks for in candidate portfolios.", favicon: "🔗", url: "https://example.com/figma-portfolios" } },
        { id: "a18", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Found this — thought it'd be useful for your prep. The section on storytelling is especially relevant.", timestamp: "Today, 9:16 AM" },
        { id: "a19", senderId: "alice", senderName: "Alice Chen", type: "text", content: "I reviewed your case study — the narrative arc is strong. Ready to schedule that mock interview whenever you are!", timestamp: "Today, 10:30 AM" },
      ],
    },
    // 2. DM — Peer (Marcus Johnson)
    {
      id: "dm-marcus",
      type: "dm",
      title: "Marcus Johnson",
      participants: [
        { id: "marcus", name: "Marcus Johnson", initial: "M", role: "Fellow job seeker • Software Engineering" },
      ],
      unread: false,
      pinned: false,
      lastMessageTime: "1h",
      lastMessagePreview: "Good luck with the Figma interview! You've got this",
      smartReplies: ["Thanks Marcus!", "How's your search going?"],
      messages: [
        { id: "m1", senderId: "marcus", senderName: "Marcus Johnson", type: "text", content: "Hey Sharon! How's the job search going on your end?", timestamp: "Today, 8:30 AM" },
        { id: "m2", senderId: "me", senderName: "You", type: "text", content: "Making progress! I have an interview with Figma coming up. Super nervous but also excited.", timestamp: "Today, 8:45 AM" },
        { id: "m3", senderId: "marcus", senderName: "Marcus Johnson", type: "text", content: "That's amazing! Figma is such a great company. What role?", timestamp: "Today, 8:47 AM" },
        { id: "m4", senderId: "me", senderName: "You", type: "text", content: "Product Designer. It's basically my dream role. Alice has been helping me prep.", timestamp: "Today, 9:00 AM" },
        { id: "m5", senderId: "marcus", senderName: "Marcus Johnson", type: "text", content: "Good luck with the Figma interview! You've got this 💪", timestamp: "Today, 9:15 AM" },
      ],
    },
    // 3. Group — Product Design Cohort 2026
    {
      id: "group-cohort",
      type: "group",
      title: "Product Design Cohort 2026",
      participants: [
        { id: "alice", name: "Alice Chen", initial: "A" },
        { id: "marcus", name: "Marcus Johnson", initial: "M" },
        { id: "priya", name: "Priya Sharma", initial: "P" },
        { id: "alex", name: "Alex Rivera", initial: "R" },
        { id: "jordan", name: "Jordan Kim", initial: "J" },
      ],
      groupDetails: { description: "A community of aspiring product designers sharing resources, job leads, and support.", memberCount: 5 },
      unread: true,
      pinned: false,
      lastMessageTime: "15m",
      lastMessagePreview: "Priya: Has anyone tried the new Figma Dev Mode?",
      smartReplies: ["I've been using it!", "Not yet, is it good?"],
      messages: [
        { id: "g1", senderId: "jordan", senderName: "Jordan Kim", type: "text", content: "Hey everyone! Just wanted to share a resource I found — this Dribbble collection has some amazing portfolio inspiration.", timestamp: "Today, 8:00 AM" },
        { id: "g2", senderId: "jordan", senderName: "Jordan Kim", type: "link", content: "", timestamp: "Today, 8:01 AM", linkPreview: { title: "Top Portfolio Designs 2026 — Dribbble Collection", description: "Curated collection of the best portfolio designs from the past year.", favicon: "🎨", url: "https://dribbble.com/collections" } },
        { id: "g3", senderId: "marcus", senderName: "Marcus Johnson", type: "text", content: "Nice find! The minimalist ones are really trending right now.", timestamp: "Today, 8:15 AM" },
        { id: "g4", senderId: "alex", senderName: "Alex Rivera", type: "text", content: "Thanks Jordan! I need to update my portfolio too. Has anyone looked into using Framer for their portfolio site?", timestamp: "Today, 8:30 AM" },
        { id: "g5", senderId: "priya", senderName: "Priya Sharma", type: "text", content: "Has anyone tried the new Figma Dev Mode? It seems like it could be really useful for designer-developer handoffs.", timestamp: "Today, 10:00 AM" },
      ],
    },
    // 4. Sophia — Welcome thread
    {
      id: "sophia-welcome",
      type: "sophia",
      title: "Sophia",
      participants: [SOPHIA],
      unread: false,
      pinned: false,
      lastMessageTime: "3d",
      lastMessagePreview: "Welcome to your inbox! This is where your career conversations live.",
      messages: [
        { id: "sw1", senderId: "sophia", senderName: "Sophia", type: "text", content: "Welcome to your inbox! This is where your career conversations live. Mentor chats, employer messages, session threads — they all show up here. I'm always available in this thread if you need me.\n\nFor now, here's what you could do next:", timestamp: "Mar 14, 2:00 PM" },
        { id: "sw2", senderId: "me", senderName: "You", type: "text", content: "Thanks Sophia! This is really helpful.", timestamp: "Mar 14, 2:05 PM" },
        { id: "sw3", senderId: "sophia", senderName: "Sophia", type: "text", content: "Of course! I'll be here whenever you need me. Just send a message anytime — whether it's about your resume, interview prep, or just figuring out next steps.", timestamp: "Mar 14, 2:06 PM" },
      ],
      smartReplies: ["What should I focus on today?", "Help me prepare for interviews"],
    },
    // 5. Sophia — Resume coaching thread
    {
      id: "sophia-resume",
      type: "sophia",
      title: "Sophia — Resume Coaching",
      participants: [SOPHIA],
      unread: false,
      pinned: false,
      lastMessageTime: "2d",
      lastMessagePreview: "Your resume score improved from 62 to 78 — nice work!",
      hasSummary: true,
      summaryText: "Sophia reviewed your resume and identified three improvement areas: quantified results, stronger action verbs, and a more targeted summary. You updated the resume and your ATS score improved from 62 to 78. Next step: tailor it for the Figma role specifically.",
      messages: [
        { id: "sr1", senderId: "me", senderName: "You", type: "text", content: "Hey Sophia, can you review my resume? I feel like it's not landing with employers.", timestamp: "Mar 15, 10:00 AM" },
        { id: "sr2", senderId: "sophia", senderName: "Sophia", type: "text", content: "Just looked at your resume in ResumeEdge. Your ATS score is 62 — here's where to improve:\n\n**1. Quantified results** — Your bullet points describe what you did but not the impact. Try: \"Redesigned checkout flow, increasing conversion by 23%\" instead of \"Redesigned checkout flow.\"\n\n**2. Action verbs** — Words like \"responsible for\" and \"helped with\" are passive. Use \"led,\" \"designed,\" \"shipped,\" \"increased.\"\n\n**3. Summary** — Your summary is generic. Tailor it to your target role: \"Product designer with 4 years of experience in B2B SaaS, specializing in design systems and user research.\"", timestamp: "Mar 15, 10:02 AM" },
        { id: "sr3", senderId: "me", senderName: "You", type: "text", content: "That makes sense. Let me update it and come back.", timestamp: "Mar 15, 10:10 AM" },
        { id: "sr4", senderId: "me", senderName: "You", type: "text", content: "OK I updated all three areas. Can you check the score now?", timestamp: "Mar 15, 2:30 PM" },
        { id: "sr5", senderId: "sophia", senderName: "Sophia", type: "text", content: "Your resume score improved from 62 to 78 — nice work! The quantified results section is much stronger. One more suggestion: for the Figma role specifically, consider highlighting any experience with design systems or Figma itself.", timestamp: "Mar 15, 2:32 PM" },
      ],
      smartReplies: ["Help me tailor it for Figma", "What else can I improve?"],
    },
    // 6. Session — Upcoming with Alice Chen
    {
      id: "session-alice",
      type: "session",
      title: "Session with Alice Chen — Mar 20",
      participants: [
        { id: "alice", name: "Alice Chen", initial: "A", role: "Product Design Lead at Stripe" },
      ],
      sessionDetails: {
        date: "Mar 20, 2026",
        time: "2:00 PM",
        timezone: "EST",
        duration: "60 min",
        type: "Mock Interview",
        status: "upcoming",
      },
      unread: true,
      pinned: false,
      lastMessageTime: "1h",
      lastMessagePreview: "Sophia: Here's your prep brief for tomorrow's session",
      messages: [
        { id: "sa1", senderId: "system", senderName: "System", type: "system", content: "Session booked: Mock Interview with Alice Chen", timestamp: "Mar 18, 11:00 AM" },
        { id: "sa2", senderId: "system", senderName: "System", type: "session_card", content: "", timestamp: "Mar 18, 11:00 AM", sessionCard: { participantName: "Alice Chen", date: "Mar 20, 2026", time: "2:00 PM", timezone: "EST", status: "upcoming", duration: "60 min" } },
        { id: "sa3", senderId: "sophia", senderName: "Sophia", type: "text", content: "Here's your prep brief for tomorrow's session with Alice:\n\n**Focus areas:**\n- Portfolio presentation walkthrough (Figma interview format)\n- Behavioral questions about design process\n- Questions to ask the interviewer\n\n**What to prepare:**\n- Have your case study ready to present (15 min walkthrough)\n- Prepare 2-3 questions about Figma's design culture\n- Review the interview prep guide Alice shared\n\nGood luck — you're well-prepared!", timestamp: "Today, 9:00 AM" },
        { id: "sa4", senderId: "alice", senderName: "Alice Chen", type: "text", content: "Looking forward to our session tomorrow! I'll play the role of the interviewer. Come ready to present your strongest case study.", timestamp: "Today, 9:30 AM" },
      ],
      smartReplies: ["Looking forward to it!", "Should I prepare anything else?", "Can we reschedule?"],
    },
    // 7. Session — Completed with Dr. Sarah Kim
    {
      id: "session-sarah",
      type: "session",
      title: "Session with Dr. Sarah Kim — Mar 12",
      participants: [
        { id: "sarah", name: "Dr. Sarah Kim", initial: "K", role: "Career Coach • UX Research" },
      ],
      sessionDetails: {
        date: "Mar 12, 2026",
        time: "10:00 AM",
        timezone: "EST",
        duration: "60 min",
        type: "Career Coaching",
        status: "completed",
      },
      unread: false,
      pinned: false,
      lastMessageTime: "5d",
      lastMessagePreview: "Sophia: Session summary and next steps",
      messages: [
        { id: "ss1", senderId: "system", senderName: "System", type: "session_card", content: "", timestamp: "Mar 12, 10:00 AM", sessionCard: { participantName: "Dr. Sarah Kim", date: "Mar 12, 2026", time: "10:00 AM", timezone: "EST", status: "completed", duration: "58 min" } },
        { id: "ss2", senderId: "sophia", senderName: "Sophia", type: "text", content: "Session complete! Here's what was covered:\n\n**Key takeaways:**\n- Focus on product design roles rather than general UX — your portfolio is stronger there\n- Target companies with strong design cultures (Figma, Stripe, Notion)\n- Complete the case study milestone on your roadmap before applying\n\n**Action items:**\n1. Update resume to focus on product design experience\n2. Complete case study by Mar 15 (done!)\n3. Apply to 3-5 product design roles this week", timestamp: "Mar 12, 11:05 AM" },
        { id: "ss3", senderId: "sarah", senderName: "Dr. Sarah Kim", type: "text", content: "Great session today! You have a really clear direction. Remember — quality over quantity with applications. Focus on the roles where you're a strong match.", timestamp: "Mar 12, 11:30 AM" },
        { id: "ss4", senderId: "me", senderName: "You", type: "text", content: "Thank you Dr. Kim! This was exactly what I needed to hear. Feeling much more focused now.", timestamp: "Mar 12, 11:45 AM" },
      ],
    },
    // 8. Application — Figma, Product Designer
    {
      id: "app-figma",
      type: "application",
      title: "Figma — Product Designer",
      participants: [
        { id: "figma-hr", name: "Emily Watson", initial: "E", role: "Talent Acquisition", company: "Figma", jobTitle: "Product Designer" },
      ],
      applicationDetails: {
        company: "Figma",
        role: "Product Designer",
        status: "interviewing",
        matchPercent: 92,
        appliedDate: "Mar 10, 2026",
      },
      unread: true,
      pinned: false,
      lastMessageTime: "3h",
      lastMessagePreview: "Emily: We'd love to schedule a portfolio review",
      messages: [
        { id: "af1", senderId: "system", senderName: "System", type: "system", content: "Application submitted for Product Designer at Figma", timestamp: "Mar 10, 2:00 PM" },
        { id: "af2", senderId: "sophia", senderName: "Sophia", type: "text", content: "Application sent! Your match score for this role is 92%. I'll keep you updated on any status changes.", timestamp: "Mar 10, 2:01 PM" },
        { id: "af3", senderId: "system", senderName: "System", type: "system", content: "Application status updated: Viewed", timestamp: "Mar 13, 9:00 AM" },
        { id: "af4", senderId: "sophia", senderName: "Sophia", type: "text", content: "Figma viewed your application! That's a great sign — they typically review within 3-5 days and your was picked up in 3.", timestamp: "Mar 13, 9:01 AM" },
        { id: "af5", senderId: "figma-hr", senderName: "Emily Watson", type: "text", content: "Hi Sharon! Thank you for applying to the Product Designer role at Figma. We were really impressed with your portfolio and experience.", timestamp: "Mar 15, 10:00 AM" },
        { id: "af6", senderId: "figma-hr", senderName: "Emily Watson", type: "text", content: "We'd love to schedule a portfolio review as the next step in our process. It's a 60-minute session where you'll walk us through one of your case studies. Would any time next week work for you?", timestamp: "Mar 15, 10:01 AM" },
        { id: "af7", senderId: "system", senderName: "System", type: "system", content: "Application status updated: Interviewing", timestamp: "Mar 15, 10:02 AM" },
        { id: "af8", senderId: "me", senderName: "You", type: "text", content: "Thank you Emily! I'm thrilled to hear that. I'm available Tuesday or Thursday afternoon — would either of those work?", timestamp: "Mar 15, 11:30 AM" },
        { id: "af9", senderId: "figma-hr", senderName: "Emily Watson", type: "text", content: "Thursday at 2 PM EST works perfectly! I'll send over a calendar invite shortly. Looking forward to it!", timestamp: "Today, 7:15 AM" },
      ],
      smartReplies: ["Thank you for the update!", "I'm available for an interview at your convenience", "Could you share more about the team?"],
    },
  ];
}

// Role-specific thread generators (lighter variants that swap names/context)
function getThreadsForRole(role: RoleId): Thread[] {
  const base = createEdgeStarThreads();
  if (role === "edgestar") return base;

  // For other roles, relabel the threads to match role context
  const labels: Record<string, { dmTitle: string; dmRole: string; groupTitle: string; groupDesc: string; appCompany: string; appRole: string }> = {
    edgepreneur: { dmTitle: "James Park", dmRole: "Startup Advisor • Y Combinator", groupTitle: "Founder Network 2026", groupDesc: "Founders sharing strategies, funding leads, and startup advice.", appCompany: "Sequoia Capital", appRole: "Portfolio Company — CTO" },
    parent: { dmTitle: "Ms. Rivera", dmRole: "Alex's Career Counselor", groupTitle: "Parent Support Circle", groupDesc: "Parents supporting their children's career journeys.", appCompany: "Google", appRole: "Software Engineer (Alex's application)" },
    guide: { dmTitle: "Sharon Lee", dmRole: "Mentee • Product Design", groupTitle: "Guide Community", groupDesc: "Mentors sharing coaching techniques and resources.", appCompany: "Stripe", appRole: "Product Designer (client application)" },
    employer: { dmTitle: "Sharon Lee", dmRole: "Applicant • Product Designer", groupTitle: "Hiring Team — Design", groupDesc: "Internal team coordinating on design hiring.", appCompany: "Your Company", appRole: "Product Designer posting" },
    edu: { dmTitle: "Dr. Martinez", dmRole: "Faculty • Career Services", groupTitle: "Faculty Career Committee", groupDesc: "Faculty coordinating on student career readiness.", appCompany: "TechCorp", appRole: "Campus Recruiting Partnership" },
    ngo: { dmTitle: "Maria Santos", dmRole: "Program Participant", groupTitle: "Program Coordinators", groupDesc: "Coordinators sharing program updates and success stories.", appCompany: "Community Foundation", appRole: "Grant Application" },
    agency: { dmTitle: "Director Williams", dmRole: "Workforce Development Lead", groupTitle: "Agency Partners Network", groupDesc: "Agency partners coordinating on workforce initiatives.", appCompany: "State Workforce Board", appRole: "Quarterly Report" },
  };

  const l = labels[role] || labels.edgepreneur;
  const threads = base.map(t => ({ ...t }));
  // Relabel DM mentor
  if (threads[0]) {
    threads[0] = { ...threads[0], title: l.dmTitle, participants: [{ ...threads[0].participants[0], name: l.dmTitle, initial: l.dmTitle[0], role: l.dmRole }] };
  }
  // Relabel group
  if (threads[2]) {
    threads[2] = { ...threads[2], title: l.groupTitle, groupDetails: { description: l.groupDesc, memberCount: 5 } };
  }
  // Relabel application
  if (threads[7]) {
    threads[7] = {
      ...threads[7],
      title: `${l.appCompany} — ${l.appRole}`,
      applicationDetails: threads[7].applicationDetails ? { ...threads[7].applicationDetails, company: l.appCompany, role: l.appRole } : undefined,
    };
  }
  return threads;
}

// Simulated responses per thread type
const SIMULATED_RESPONSES: Record<string, string[]> = {
  "dm-alice": [
    "That's looking great! I'd suggest adding one more data point about user retention.",
    "Let me check my calendar for next week. I think Tuesday or Thursday would work.",
    "By the way, I shared some additional resources in the prep guide. Make sure to check section 3!",
  ],
  "dm-marcus": [
    "Thanks! I actually just heard back from Google — got a first round interview!",
    "We should do a study group session soon. The mock interviews really help.",
    "How's your roadmap going? I saw you completed a big milestone last week.",
  ],
  "sophia-welcome": [
    "Great question! Based on your roadmap progress, I'd suggest focusing on completing your case study milestone today. You're 80% done and it'll give your portfolio a real boost.",
    "I noticed your resume score went up recently — nice work! Want me to suggest some roles that match your updated profile?",
  ],
  "sophia-resume": [
    "I'd recommend emphasizing your design system experience — Figma values that highly. Want me to help you draft some bullet points?",
    "Your resume is looking strong! The quantified results section is one of the best improvements you've made. Keep iterating.",
  ],
  "app-figma": [
    "Thank you for the update, Emily! I'll have the calendar invite confirmed shortly.",
  ],
  default: [
    "That's a great point! Let me think about that.",
    "Thanks for sharing — this is really helpful.",
    "I agree. Let's follow up on this next week.",
  ],
};

// ─── Typing Indicator ─────────────────────────────────────────────────

function TypingIndicator({ name, isSophia }: { name: string; isSophia?: boolean }) {
  const dotColor = isSophia ? "var(--ce-lime)" : "var(--ce-text-ghost)";
  return (
    <motion.div
      className="flex items-center gap-2 px-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      aria-live="polite"
      aria-label={`${name} is typing`}
    >
      {isSophia && <SophiaMark size={20} glowing={false} />}
      {!isSophia && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
          <span className="text-[9px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-display)" }}>{name[0]}</span>
        </div>
      )}
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl" style={{ background: isSophia ? "rgba(var(--ce-role-edgestar-rgb),0.06)" : "rgba(var(--ce-glass-tint),0.04)" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: dotColor }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{name} is typing...</span>
    </motion.div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────

function MessageBubble({
  message,
  isMe,
  isSophia,
  isGroup,
  onImageClick,
  onJoinCall,
}: {
  message: Message;
  isMe: boolean;
  isSophia: boolean;
  isGroup: boolean;
  onImageClick?: (url: string) => void;
  onJoinCall?: (name: string, initial: string) => void;
}) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center py-2">
        <span className="text-[10px] text-[var(--ce-text-quaternary)] px-3 py-1 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.02)", fontFamily: "var(--font-body)" }}>
          {message.content}
        </span>
      </div>
    );
  }

  if (message.type === "session_card" && message.sessionCard) {
    const sc = message.sessionCard;
    const statusColors: Record<string, string> = { upcoming: "var(--ce-role-edgestar)", in_progress: "var(--ce-lime)", completed: "var(--ce-text-secondary)" };
    const statusLabels: Record<string, string> = { upcoming: "Upcoming", in_progress: "In Progress", completed: "Completed" };
    return (
      <motion.div
        className="mx-auto my-3 max-w-[400px] rounded-xl p-4"
        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-ce-cyan" />
            <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {sc.status === "completed" ? "Session Complete" : "Scheduled Session"}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${statusColors[sc.status]}15`, color: statusColors[sc.status], fontFamily: "var(--font-body)" }}>
            {statusLabels[sc.status]}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)" }}>
            <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)" }}>{sc.participantName[0]}</span>
          </div>
          <div>
            <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{sc.participantName}</span>
            <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{sc.date} · {sc.time} {sc.timezone} · {sc.duration}</span>
          </div>
        </div>
        {sc.status === "upcoming" && (
          <button
            onClick={() => onJoinCall?.(sc.participantName, sc.participantName[0])}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[12px]"
            style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            <Video className="w-3.5 h-3.5" /> Join Call
          </button>
        )}
      </motion.div>
    );
  }

  const bubbleBg = isSophia
    ? "rgba(var(--ce-role-edgestar-rgb),0.08)"
    : isMe
    ? "rgba(var(--ce-lime-rgb),0.06)"
    : "rgba(var(--ce-glass-tint),0.05)";
  const borderLeft = isSophia ? "2px solid rgba(var(--ce-role-edgestar-rgb),0.3)" : "none";
  const align = isMe ? "flex-end" : "flex-start";

  return (
    <motion.div
      className="flex gap-2 max-w-[70%] mb-1"
      style={{ alignSelf: align, marginLeft: isMe ? "auto" : 0, marginRight: isMe ? 0 : "auto" }}
      initial={{ opacity: 0, scale: 0.95, x: isMe ? 10 : -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="listitem"
      aria-label={`${message.senderName} said: ${message.content || message.type}, ${message.timestamp}`}
    >
      {/* Avatar for non-me messages */}
      {!isMe && (
        <div className="flex-shrink-0 mt-1">
          {isSophia ? (
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.12)", border: "1.5px solid rgba(var(--ce-role-edgestar-rgb),0.3)" }}>
              <SophiaMark size={14} glowing={false} />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[10px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{message.senderName[0]}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-0.5" style={{ maxWidth: "100%" }}>
        {/* Sender name for group chats */}
        {isGroup && !isMe && (
          <span className="text-[10px] text-[var(--ce-text-secondary)] ml-1" style={{ fontFamily: "var(--font-body)" }}>{message.senderName}</span>
        )}

        <div className="rounded-2xl px-3.5 py-2.5" style={{ background: bubbleBg, borderLeft }}>
          {message.type === "text" && (
            <p className="text-[13px] text-[var(--ce-text-primary)] whitespace-pre-wrap" style={{ fontFamily: "var(--font-body)" }}>
              {message.content.split(/(\*\*.*?\*\*)/).map((part, i) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          )}

          {message.type === "file" && message.fileDetails && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                <FileText className="w-5 h-5 text-[var(--ce-text-secondary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[12px] text-[var(--ce-text-primary)] block truncate" style={{ fontFamily: "var(--font-body)" }}>{message.fileDetails.name}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{message.fileDetails.size} · {message.fileDetails.type.toUpperCase()}</span>
              </div>
              <button onClick={() => toast.success("Downloading...")} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                <Download className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
              </button>
            </div>
          )}

          {message.type === "image" && message.imageUrl && (
            <button onClick={() => onImageClick?.(message.imageUrl!)} className="cursor-pointer block">
              <img src={message.imageUrl} alt="Shared image" className="rounded-lg max-w-[280px] max-h-[200px] object-cover" />
            </button>
          )}

          {message.type === "voice" && (
            <div className="flex items-center gap-2">
              <button onClick={() => toast("Playing voice note...")} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-lime-rgb),0.1)" }}>
                <Play className="w-3.5 h-3.5 text-ce-lime" />
              </button>
              <div className="flex-1 h-6 flex items-center gap-[2px]">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-[3px] rounded-full" style={{ height: `${Math.random() * 16 + 4}px`, background: "rgba(var(--ce-lime-rgb),0.3)" }} />
                ))}
              </div>
              <span className="text-[10px] text-[var(--ce-text-secondary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>0:42</span>
            </div>
          )}

          {message.type === "video" && (
            <div className="relative rounded-lg overflow-hidden cursor-pointer" onClick={() => toast("Playing video...")}>
              <div className="w-[240px] h-[135px] flex items-center justify-center" style={{ background: "rgba(var(--ce-shadow-tint),0.3)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.15)", backdropFilter: "blur(4px)" }}>
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] text-white px-1.5 py-0.5 rounded" style={{ background: "rgba(var(--ce-shadow-tint),0.6)", fontFamily: "var(--font-body)" }}>2:15</span>
            </div>
          )}

          {message.type === "link" && message.linkPreview && (
            <button onClick={() => window.open(message.linkPreview!.url, "_blank")} className="block w-full text-left cursor-pointer rounded-lg overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[12px]">{message.linkPreview.favicon}</span>
                  <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{new URL(message.linkPreview.url).hostname}</span>
                </div>
                <span className="text-[12px] text-[var(--ce-text-primary)] block mb-1" style={{ fontFamily: "var(--font-body)" }}>{message.linkPreview.title}</span>
                <span className="text-[10px] text-[var(--ce-text-secondary)] line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>{message.linkPreview.description}</span>
              </div>
            </button>
          )}
        </div>

        <span className="text-[10px] text-[var(--ce-text-quaternary)] px-1" style={{ fontFamily: "var(--font-body)", textAlign: isMe ? "right" : "left" }}>
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Smart Replies ──────────────��─────────────────────────────────────

function SmartReplies({ replies, onSelect, visible }: { replies: string[]; onSelect: (reply: string) => void; visible: boolean }) {
  if (!visible || replies.length === 0) return null;
  return (
    <motion.div
      className="flex gap-2 px-4 py-2 overflow-x-auto"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      aria-label="Suggested replies"
    >
      {replies.map((reply, i) => (
        <motion.button
          key={reply}
          onClick={() => onSelect(reply)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full cursor-pointer text-[11px] text-[var(--ce-text-tertiary)] hover:text-[var(--ce-text-primary)] transition-colors"
          style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2, ease: "easeOut" }}
          whileTap={{ scale: 0.95 }}
        >
          {reply}
        </motion.button>
      ))}
    </motion.div>
  );
}

// ─── Thread Summary ───────────────────────────────────���───────────────

function ThreadSummary({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  return (
    <motion.div
      className="mx-4 mb-3 rounded-xl p-4"
      style={{ background: "linear-gradient(145deg, rgba(var(--ce-role-edgestar-rgb),0.05), rgba(var(--ce-glass-tint),0.02))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SophiaMark size={14} glowing={false} />
          <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Thread Summary</span>
          <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Updated 2 hours ago</span>
        </div>
        <button onClick={onDismiss} className="w-5 h-5 rounded flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)]">
          <X className="w-3 h-3 text-[var(--ce-text-secondary)]" />
        </button>
      </div>
      <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{text}</p>
    </motion.div>
  );
}

// ─── Conversation List ────────────────────────────────────────────────

type FilterType = "all" | "dm" | "group" | "sophia" | "session" | "application";
const FILTER_LABELS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dm", label: "Direct" },
  { id: "group", label: "Groups" },
  { id: "sophia", label: "Sophia" },
  { id: "session", label: "Sessions" },
  { id: "application", label: "Applications" },
];

function ConversationList({
  threads,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: {
  threads: Thread[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
}) {
  const filtered = threads
    .filter((t) => activeFilter === "all" || t.type === activeFilter)
    .filter((t) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.lastMessagePreview.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <div className="w-[280px] flex-shrink-0 flex flex-col h-full" style={{ borderRight: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
      {/* Search */}
      <div className="p-3">
        <div className="relative" role="search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-8 py-2 rounded-lg text-[12px] text-[var(--ce-text-primary)] placeholder-[var(--ce-text-quaternary)] outline-none"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
              <X className="w-3 h-3 text-[var(--ce-text-secondary)]" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto" role="tablist">
        {FILTER_LABELS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={activeFilter === f.id}
            onClick={() => onFilterChange(f.id)}
            className="flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] cursor-pointer transition-colors"
            style={{
              background: activeFilter === f.id ? "rgba(var(--ce-lime-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
              color: activeFilter === f.id ? "var(--ce-lime)" : "var(--ce-text-secondary)",
              border: activeFilter === f.id ? "1px solid rgba(var(--ce-lime-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.04)",
              fontFamily: "var(--font-body)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto" role="listbox">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MessageSquare className="w-8 h-8 text-[var(--ce-text-quaternary)] mb-3" />
            <span className="text-[12px] text-[var(--ce-text-secondary)] text-center" style={{ fontFamily: "var(--font-body)" }}>
              {searchQuery ? `No conversations match "${searchQuery}"` : `No ${activeFilter === "all" ? "" : activeFilter + " "}conversations yet`}
            </span>
            {searchQuery && (
              <button onClick={() => onSearchChange("")} className="mt-2 text-[11px] text-ce-cyan cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>Clear search</button>
            )}
          </div>
        )}
        {filtered.map((thread) => {
          const isSelected = selectedId === thread.id;
          const mainParticipant = thread.participants[0];
          const isSophia = thread.type === "sophia";

          return (
            <button
              key={thread.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(thread.id)}
              className="w-full flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors text-left relative"
              style={{
                background: isSelected ? "rgba(var(--ce-glass-tint),0.04)" : "transparent",
                borderLeft: isSelected ? "2px solid var(--ce-lime)" : "2px solid transparent",
              }}
            >
              {/* Unread dot */}
              {thread.unread && !isSelected && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--ce-lime)]" />
              )}

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {isSophia ? (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "2px solid rgba(var(--ce-role-edgestar-rgb),0.3)" }}>
                    <SophiaMark size={18} glowing={false} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
                    <span className="text-[14px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{mainParticipant?.initial || "?"}</span>
                  </div>
                )}
                {/* Thread type overlay */}
                {thread.type === "session" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--ce-surface-0)", border: "1.5px solid rgba(var(--ce-role-edgestar-rgb),0.3)" }}>
                    <Calendar className="w-2.5 h-2.5 text-ce-cyan" />
                  </div>
                )}
                {thread.type === "application" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--ce-surface-0)", border: "1.5px solid rgba(var(--ce-lime-rgb),0.3)" }}>
                    <Briefcase className="w-2.5 h-2.5 text-ce-lime" />
                  </div>
                )}
                {thread.type === "group" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--ce-surface-0)", border: "1.5px solid rgba(var(--ce-role-guide-rgb),0.3)" }}>
                    <Users className="w-2.5 h-2.5 text-[var(--ce-role-guide)]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[12px] truncate ${thread.unread ? "text-[var(--ce-text-primary)]" : "text-[var(--ce-text-tertiary)]"}`} style={{ fontFamily: "var(--font-display)", fontWeight: thread.unread ? 500 : 400 }}>
                    {thread.title}
                  </span>
                  <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0 ml-2" style={{ fontFamily: "var(--font-body)" }}>
                    {thread.lastMessageTime}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--ce-text-secondary)] truncate block" style={{ fontFamily: "var(--font-body)" }}>
                  {thread.lastMessagePreview}
                </span>
              </div>

              {/* Pin icon */}
              {thread.pinned && (
                <Pin className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Context Panel ────────────────────────────────────────────────────

function ContextPanel({
  thread,
  isOpen,
  onToggle,
  onNavigate,
}: {
  thread: Thread;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: NavigateFn;
}) {
  const handleAction = (action: string) => {
    if (action === "jobs" || action === "resume" || action === "edgepath") {
      onNavigate?.(action);
    } else {
      toast.info("Opening Sophia...");
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 w-5 h-10 flex items-center justify-center cursor-pointer z-10"
        style={{
          right: isOpen ? 280 : 0,
          background: "rgba(14,16,20,0.95)",
          border: "1px solid rgba(var(--ce-glass-tint),0.06)",
          borderRight: isOpen ? "none" : undefined,
          borderRadius: isOpen ? "6px 0 0 6px" : "6px 0 0 6px",
          transition: "right 200ms ease-out",
        }}
      >
        {isOpen ? <ChevronRight className="w-3 h-3 text-[var(--ce-text-secondary)]" /> : <ChevronLeft className="w-3 h-3 text-[var(--ce-text-secondary)]" />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-[280px] flex-shrink-0 overflow-y-auto"
            style={{ borderLeft: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-4">
              {/* DM Context */}
              {thread.type === "dm" && thread.participants[0] && (
                <div className="space-y-4">
                  {/* Profile card */}
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
                      <span className="text-[18px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{thread.participants[0].initial}</span>
                    </div>
                    <h3 className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{thread.participants[0].name}</h3>
                    <p className="text-[11px] text-[var(--ce-text-secondary)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{thread.participants[0].role}</p>
                    {thread.participants[0].rating && (
                      <div className="flex items-center justify-center gap-1 mt-1.5">
                        <Star className="w-3 h-3 text-[var(--ce-role-edgepreneur)]" />
                        <span className="text-[11px] text-[var(--ce-role-edgepreneur)]" style={{ fontFamily: "var(--font-body)" }}>{thread.participants[0].rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {thread.participants[0].specialties && (
                    <div>
                      <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SPECIALTIES</span>
                      <div className="flex flex-wrap gap-1.5">
                        {thread.participants[0].specialties.map(s => (
                          <span key={s} className="text-[10px] text-[var(--ce-text-secondary)] px-2 py-1 rounded-md" style={{ background: "rgba(var(--ce-glass-tint),0.03)", fontFamily: "var(--font-body)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Your connection */}
                  <div className="rounded-lg p-3" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3 h-3 text-ce-cyan" />
                      <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Your Connection</span>
                    </div>
                    <p className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                      Specializes in Product Management transitions — your target role.
                    </p>
                  </div>

                  {/* Shared files */}
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SHARED FILES</span>
                    {thread.messages.filter(m => m.type === "file").length > 0 ? (
                      thread.messages.filter(m => m.type === "file").map(m => (
                        <div key={m.id} className="flex items-center gap-2 py-1.5">
                          <FileText className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
                          <span className="text-[11px] text-[var(--ce-text-tertiary)] truncate" style={{ fontFamily: "var(--font-body)" }}>{m.fileDetails?.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>No files shared yet</span>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    <button onClick={() => toast.info("Sophia can help you book a session.")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-primary)] transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                      <Calendar className="w-3.5 h-3.5 text-ce-cyan" /> Book a session
                    </button>
                    <button onClick={() => toast.info("Opening profile...")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-tertiary)] transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                      <ExternalLink className="w-3.5 h-3.5" /> View their profile
                    </button>
                  </div>
                </div>
              )}

              {/* Sophia Context */}
              {thread.type === "sophia" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "2px solid rgba(var(--ce-role-edgestar-rgb),0.2)" }}>
                      <SophiaMark size={24} glowing={false} />
                    </div>
                    <h3 className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</h3>
                    <p className="text-[11px] text-ce-cyan mt-0.5" style={{ fontFamily: "var(--font-body)" }}>Your AI career partner</p>
                  </div>

                  {/* Topics */}
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CONVERSATION TOPICS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(thread.id === "sophia-resume" ? ["Resume", "ATS Score", "Metrics"] : ["Onboarding", "Getting Started", "Career Goals"]).map(t => (
                        <span key={t} className="text-[10px] text-ce-cyan px-2 py-1 rounded-md" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)", fontFamily: "var(--font-body)" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Related surfaces */}
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>RELATED SURFACES</span>
                    <div className="space-y-1.5">
                      <button onClick={() => handleAction("resume")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-tertiary)] hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                        <FileText className="w-3.5 h-3.5" /> Open ResumeEdge
                      </button>
                      <button onClick={() => handleAction("edgepath")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-tertiary)] hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                        <Sparkles className="w-3.5 h-3.5" /> Open EdgePath
                      </button>
                      <button onClick={() => handleAction("jobs")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-tertiary)] hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                        <Search className="w-3.5 h-3.5" /> Browse EdgeMatch
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Group Context */}
              {thread.type === "group" && thread.groupDetails && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[14px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{thread.title}</h3>
                    <p className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{thread.groupDetails.description}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>MEMBERS ({thread.participants.length})</span>
                    {thread.participants.map(p => (
                      <div key={p.id} className="flex items-center gap-2 py-1.5">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
                          <span className="text-[9px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{p.initial}</span>
                        </div>
                        <span className="text-[11px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>{p.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shared files */}
                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SHARED FILES</span>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>No files shared yet</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PINNED MESSAGES</span>
                    <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>No pinned messages</span>
                  </div>
                </div>
              )}

              {/* Session Context */}
              {thread.type === "session" && thread.sessionDetails && (
                <div className="space-y-4">
                  <div className="rounded-xl p-3" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-ce-cyan" />
                      <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{thread.sessionDetails.type}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-[var(--ce-text-tertiary)] block" style={{ fontFamily: "var(--font-body)" }}>{thread.sessionDetails.date}</span>
                      <span className="text-[11px] text-[var(--ce-text-tertiary)] block" style={{ fontFamily: "var(--font-body)" }}>{thread.sessionDetails.time} {thread.sessionDetails.timezone}</span>
                      <span className="text-[11px] text-[var(--ce-text-secondary)] block" style={{ fontFamily: "var(--font-body)" }}>{thread.sessionDetails.duration}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block" style={{
                      background: thread.sessionDetails.status === "upcoming" ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(107,114,128,0.1)",
                      color: thread.sessionDetails.status === "upcoming" ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)",
                      fontFamily: "var(--font-body)",
                    }}>
                      {thread.sessionDetails.status === "upcoming" ? "Upcoming" : "Completed"}
                    </span>
                  </div>

                  {thread.participants[0] && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
                        <span className="text-[14px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{thread.participants[0].initial}</span>
                      </div>
                      <div>
                        <span className="text-[12px] text-[var(--ce-text-primary)] block" style={{ fontFamily: "var(--font-body)" }}>{thread.participants[0].name}</span>
                        <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{thread.participants[0].role}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Application Context */}
              {thread.type === "application" && thread.applicationDetails && (
                <div className="space-y-4">
                  <div className="rounded-xl p-3" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-3.5 h-3.5 text-ce-lime" />
                      <span className="text-[12px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{thread.applicationDetails.company}</span>
                    </div>
                    <span className="text-[12px] text-[var(--ce-text-tertiary)] block mb-2" style={{ fontFamily: "var(--font-body)" }}>{thread.applicationDetails.role}</span>

                    {/* Application status */}
                    <div className="flex items-center gap-2 mb-2">
                      {(["applied", "viewed", "interviewing", "offer"] as const).map((status, i) => {
                        const statuses = ["applied", "viewed", "interviewing", "offer"] as const;
                        const currentIdx = statuses.indexOf(thread.applicationDetails!.status);
                        const isReached = i <= currentIdx;
                        return (
                          <div key={status} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: isReached ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.06)" }} />
                            {i < 3 && <div className="w-4 h-[1px]" style={{ background: i < currentIdx ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint),0.06)" }} />}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-body)", textTransform: "capitalize" }}>{thread.applicationDetails.status}</span>

                    {/* Match % */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-lime-rgb),0.08)" }}>
                        <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{thread.applicationDetails.matchPercent}%</span>
                      </div>
                      <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>Match Score</span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    <button onClick={() => onNavigate?.("jobs")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-primary)] transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                      <Search className="w-3.5 h-3.5 text-ce-cyan" /> View job listing
                    </button>
                    <button onClick={() => onNavigate?.("resume")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-[var(--ce-text-tertiary)] transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.03)]" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                      <FileText className="w-3.5 h-3.5" /> Optimize resume for this role
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Active Thread ────────────────────────────────────────────────────

function ActiveThread({
  thread,
  onSendMessage,
  onNavigate,
  onStartVideoCall,
}: {
  thread: Thread;
  onSendMessage: (threadId: string, content: string) => void;
  onNavigate?: NavigateFn;
  onStartVideoCall?: (name: string, initial: string) => void;
}) {
  const [input, setInput] = useState("");
  const [showSummary, setShowSummary] = useState(thread.hasSummary ?? false);
  const [showSmartReplies, setShowSmartReplies] = useState(true);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [typingVisible, setTypingVisible] = useState(false);
  const [newMsgPill, setNewMsgPill] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevThreadId = useRef(thread.id);

  // Reset state on thread change
  useEffect(() => {
    if (prevThreadId.current !== thread.id) {
      setShowSummary(thread.hasSummary ?? false);
      setShowSmartReplies(true);
      setInput("");
      setMoreMenuOpen(false);
      setTypingVisible(false);
      setNewMsgPill(false);
      prevThreadId.current = thread.id;
    }
  }, [thread.id, thread.hasSummary]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    onSendMessage(thread.id, content.trim());
    setInput("");
    setShowSmartReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleSmartReply = (reply: string) => {
    handleSend(reply);
  };

  const mainParticipant = thread.participants[0];
  const isSophiaThread = thread.type === "sophia";
  const isGroup = thread.type === "group";

  const typeBadge: Record<ThreadType, string | null> = {
    dm: null,
    group: "Group",
    sophia: null,
    session: "Session",
    application: "Application",
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 flex-shrink-0" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <div className="flex items-center gap-3">
          {isSophiaThread ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "1.5px solid rgba(var(--ce-role-edgestar-rgb),0.3)" }}>
              <SophiaMark size={14} glowing={false} />
            </div>
          ) : isGroup ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)" }}>
              <Users className="w-4 h-4 text-[var(--ce-role-guide)]" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
              <span className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{mainParticipant?.initial || "?"}</span>
            </div>
          )}
          <div>
            <h2 className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{thread.title}</h2>
            {mainParticipant?.role && !isSophiaThread && !isGroup && (
              <span className="text-[10px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{mainParticipant.role}</span>
            )}
          </div>
          {typeBadge[thread.type] && (
            <span className="text-[9px] text-[var(--ce-text-secondary)] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.03)", fontFamily: "var(--font-body)" }}>
              {typeBadge[thread.type]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {thread.hasSummary && (
            <button onClick={() => setShowSummary(!showSummary)} className="px-2 py-1 rounded-md text-[10px] cursor-pointer transition-colors" style={{ background: showSummary ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)", color: showSummary ? "var(--ce-role-edgestar)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
              Summary
            </button>
          )}
          <button onClick={() => toast("Pinned thread")} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)]">
            <Pin className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
          </button>
          <button onClick={() => toast("Search within thread...")} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)]">
            <Search className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
          </button>
          {!isSophiaThread && (
            <button onClick={() => onStartVideoCall?.(mainParticipant?.name || "Participant", mainParticipant?.initial || "?")} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)]">
              <Video className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
            </button>
          )}
          <div className="relative">
            <button onClick={() => setMoreMenuOpen(!moreMenuOpen)} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)]">
              <MoreHorizontal className="w-3.5 h-3.5 text-[var(--ce-text-secondary)]" />
            </button>
            <AnimatePresence>
              {moreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMoreMenuOpen(false)} />
                  <motion.div
                    className="absolute right-0 top-full mt-1 w-[160px] rounded-lg overflow-hidden z-20"
                    style={{ background: "var(--ce-surface-modal-bg)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    {[
                      { label: "Mute thread", action: () => toast("Thread muted") },
                      { label: "Archive thread", action: () => toast("Thread archived") },
                      { label: "Mark as unread", action: () => toast("Marked as unread") },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { setMoreMenuOpen(false); item.action(); }}
                        className="w-full text-left px-3 py-2.5 text-[11px] text-[var(--ce-text-tertiary)] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.03)] transition-colors"
                        style={{ fontFamily: "var(--font-body)", borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1" role="list">
        {/* Thread summary */}
        <AnimatePresence>
          {showSummary && thread.summaryText && (
            <ThreadSummary text={thread.summaryText} onDismiss={() => setShowSummary(false)} />
          )}
        </AnimatePresence>

        {thread.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.senderId === "me"}
            isSophia={msg.senderId === "sophia"}
            isGroup={isGroup}
            onImageClick={(url) => setLightboxImage(url)}
            onJoinCall={onStartVideoCall}
          />
        ))}

        {/* Read receipt on last sent message */}
        {thread.messages.length > 0 && thread.messages[thread.messages.length - 1].senderId === "me" && (
          <div className="text-right pr-1">
            <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Seen</span>
          </div>
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {typingVisible && (
            <TypingIndicator
              name={isSophiaThread ? "Sophia" : mainParticipant?.name || "Someone"}
              isSophia={isSophiaThread}
            />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* New messages pill */}
      <AnimatePresence>
        {newMsgPill && (
          <motion.button
            className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer z-10"
            style={{ background: "rgba(14,16,20,0.95)", border: "1px solid rgba(var(--ce-lime-rgb),0.2)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, type: "spring" }}
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              setNewMsgPill(false);
            }}
          >
            <ArrowDown className="w-3 h-3 text-ce-lime" />
            <span className="text-[10px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>New messages</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Smart replies */}
      <AnimatePresence>
        {thread.smartReplies && showSmartReplies && (
          <SmartReplies
            replies={thread.smartReplies}
            onSelect={handleSmartReply}
            visible={showSmartReplies}
          />
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2 px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
        <button
          onClick={() => toast("Attachment menu: File, Image, Voice")}
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-[rgba(var(--ce-glass-tint),0.04)]"
          style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}
        >
          <Paperclip className="w-4 h-4 text-[var(--ce-text-secondary)]" />
        </button>

        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value && showSmartReplies) setShowSmartReplies(false);
            if (!e.target.value) setShowSmartReplies(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none text-[13px] text-[var(--ce-text-primary)] placeholder-[var(--ce-text-quaternary)] py-2 px-3 rounded-lg outline-none"
          style={{
            background: "rgba(var(--ce-glass-tint),0.03)",
            border: "1px solid rgba(var(--ce-glass-tint),0.04)",
            fontFamily: "var(--font-body)",
            maxHeight: "100px",
            minHeight: "36px",
          }}
        />

        <motion.button
          onClick={() => handleSend(input)}
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0"
          style={{
            background: input.trim() ? "rgba(var(--ce-lime-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.03)",
            border: input.trim() ? "1px solid rgba(var(--ce-lime-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.04)",
          }}
          whileTap={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Send className="w-4 h-4" style={{ color: input.trim() ? "var(--ce-lime)" : "var(--ce-text-quaternary)" }} />
        </motion.button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: "rgba(var(--ce-shadow-tint),0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.1)" }}>
              <X className="w-5 h-5 text-white" />
            </button>
            <img src={lightboxImage} alt="Full size" className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Video Call UI ────────────────────────────────────────────────────

function VideoCallUI({ participantName, participantInitial, onEndCall }: {
  participantName: string; participantInitial: string; onEndCall: () => void;
}) {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sophiaPanelOpen, setSophiaPanelOpen] = useState(false);
  const [callState, setCallState] = useState<"connecting" | "active" | "ended">("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingConsent, setRecordingConsent] = useState<"idle" | "pending" | "allowed" | "declined">("idle");

  useEffect(() => {
    const t = setTimeout(() => setCallState("active"), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (callState !== "active") return;
    const i = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(i);
  }, [callState]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleEndCall = () => {
    setCallState("ended");
    setTimeout(onEndCall, 2500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[55] flex flex-col"
      style={{ background: "var(--ce-surface-bg)" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Top bar — recording indicator (only when active) */}
      {isRecording && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--ce-status-error)] animate-pulse" />
          <span className="text-[10px] text-[var(--ce-status-error)]" style={{ fontFamily: "var(--font-body)" }}>REC</span>
          <button onClick={() => { setIsRecording(false); setRecordingConsent("idle"); }} className="text-[9px] text-[var(--ce-text-secondary)] px-1.5 py-0.5 rounded cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.05)", fontFamily: "var(--font-body)" }}>Stop</button>
        </div>
      )}

      {/* Recording consent modal */}
      <AnimatePresence>
        {recordingConsent === "pending" && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: "rgba(var(--ce-shadow-tint),0.6)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-[380px] rounded-2xl p-6" style={{ background: "rgba(14,16,20,0.99)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
              initial={{ scale: 0.95, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 8 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[var(--ce-status-error)]" />
                <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Recording request</span>
              </div>
              <p className="text-[12px] text-[var(--ce-text-tertiary)] leading-relaxed mb-2" style={{ fontFamily: "var(--font-body)" }}>
                <span className="text-[var(--ce-text-primary)]">You</span> want to record this session. Both parties must consent before recording starts.
              </p>
              <p className="text-[11px] text-[var(--ce-text-secondary)] mb-5" style={{ fontFamily: "var(--font-body)" }}>
                Recordings are stored in session history. Either party can request deletion at any time. <span className="text-ce-cyan">{participantName}</span> has been notified.
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.05)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.1)" }}>
                <div className="w-2 h-2 rounded-full bg-[var(--ce-role-edgepreneur)]" />
                <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>{participantName} sees: "You are being asked to allow recording."</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setRecordingConsent("allowed"); setIsRecording(true); toast.success("Recording started — both parties notified"); }} className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-status-error-rgb),0.1)", border: "1px solid rgba(var(--ce-status-error-rgb),0.2)", color: "var(--ce-status-error)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Allow Recording
                </button>
                <button onClick={() => { setRecordingConsent("declined"); toast("Recording declined"); }} className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                  Decline
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <span className="text-[12px] text-[var(--ce-text-secondary)] tabular-nums px-3 py-1 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
          {callState === "connecting" ? "Connecting..." : callState === "ended" ? "Call ended" : formatTime(callDuration)}
        </span>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex items-center justify-center relative">
        {callState === "connecting" && (
          <div className="flex flex-col items-center gap-4">
            <motion.div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)", border: "2px solid rgba(var(--ce-role-edgestar-rgb),0.2)" }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <span className="text-[28px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{participantInitial}</span>
            </motion.div>
            <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Connecting to {participantName}...</span>
          </div>
        )}
        {callState === "active" && (
          <>
            <div className="w-full max-w-[800px] aspect-video rounded-2xl flex items-center justify-center mx-4" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(var(--ce-glass-tint),0.05)" }}>
                  <span className="text-[24px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-display)" }}>{participantInitial}</span>
                </div>
                <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{participantName}</span>
              </div>
            </div>
            <div className="absolute bottom-24 right-8 w-[180px] aspect-video rounded-xl flex items-center justify-center" style={{ background: cameraOn ? "rgba(var(--ce-lime-rgb),0.04)" : "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
              <span className="text-[11px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>{cameraOn ? "Your camera" : "Camera off"}</span>
            </div>
          </>
        )}
        {callState === "ended" && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Call ended — {formatTime(callDuration)}</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
              <SophiaMark size={14} glowing={false} />
              <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>How did that go? I can add notes to your session thread.</span>
            </div>
          </div>
        )}
      </div>

      {/* Sophia coaching panel */}
      <AnimatePresence>
        {sophiaPanelOpen && callState === "active" && (
          <motion.div className="absolute right-0 top-0 bottom-16 w-[320px] overflow-y-auto" style={{ background: "rgba(10,12,16,0.95)", borderLeft: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }} initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} transition={{ duration: 0.3 }}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <SophiaMark size={16} glowing={false} />
                <span className="text-[12px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia Coaching</span>
              </div>
              <div className="space-y-3">
                {["Walk through your case study chronologically — problem → process → outcome.", "You've been talking for about 2 minutes — try to wrap up and move to impact metrics.", "Great mention of the A/B test results! Quantified impact always resonates.", "When they ask about collaboration, mention your design system work."].map((tip, i) => (
                  <motion.div key={i} className="rounded-lg px-3 py-2.5" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.06)" }} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.8 + 0.3, duration: 0.3 }}>
                    <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control bar */}
      {callState !== "ended" && (
        <motion.div className="h-16 flex items-center justify-center gap-3 px-6" style={{ background: "rgba(10,12,16,0.95)", borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }} initial={{ y: 64 }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
          <button onClick={() => setCameraOn(!cameraOn)} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer" style={{ background: cameraOn ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-status-error-rgb),0.1)", border: `1px solid ${cameraOn ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-status-error-rgb),0.2)"}` }}>
            <Video className="w-4 h-4" style={{ color: cameraOn ? "var(--ce-text-primary)" : "var(--ce-status-error)" }} />
            <span className="text-[11px]" style={{ color: cameraOn ? "var(--ce-text-primary)" : "var(--ce-status-error)", fontFamily: "var(--font-body)" }}>Camera</span>
          </button>
          <button onClick={() => setMicOn(!micOn)} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer" style={{ background: micOn ? "rgba(var(--ce-glass-tint),0.04)" : "rgba(var(--ce-status-error-rgb),0.1)", border: `1px solid ${micOn ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-status-error-rgb),0.2)"}` }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={micOn ? "var(--ce-text-primary)" : "var(--ce-status-error)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            <span className="text-[11px]" style={{ color: micOn ? "var(--ce-text-primary)" : "var(--ce-status-error)", fontFamily: "var(--font-body)" }}>{micOn ? "Mic" : "Muted"}</span>
          </button>
          <button onClick={() => { setScreenSharing(!screenSharing); toast(screenSharing ? "Screen sharing stopped" : "Sharing screen"); }} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer" style={{ background: screenSharing ? "rgba(var(--ce-lime-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${screenSharing ? "rgba(var(--ce-lime-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.06)"}` }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={screenSharing ? "var(--ce-lime)" : "var(--ce-text-primary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            <span className="text-[11px]" style={{ color: screenSharing ? "var(--ce-lime)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}>Screen</span>
          </button>
          <button onClick={() => setChatOpen(!chatOpen)} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer" style={{ background: chatOpen ? "rgba(var(--ce-role-edgestar-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${chatOpen ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)"}` }}>
            <MessageSquare className="w-4 h-4" style={{ color: chatOpen ? "var(--ce-role-edgestar)" : "var(--ce-text-primary)" }} />
            <span className="text-[11px]" style={{ color: chatOpen ? "var(--ce-role-edgestar)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}>Chat</span>
          </button>
          <button onClick={() => setSophiaPanelOpen(!sophiaPanelOpen)} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer" style={{ background: sophiaPanelOpen ? "rgba(var(--ce-role-edgestar-rgb),0.08)" : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${sophiaPanelOpen ? "rgba(var(--ce-role-edgestar-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)"}` }}>
            <Sparkles className="w-4 h-4" style={{ color: sophiaPanelOpen ? "var(--ce-role-edgestar)" : "var(--ce-text-primary)" }} />
            <span className="text-[11px]" style={{ color: sophiaPanelOpen ? "var(--ce-role-edgestar)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}>Sophia</span>
          </button>
          <button
            onClick={() => { if (!isRecording) setRecordingConsent("pending"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
            style={{ background: isRecording ? "rgba(var(--ce-status-error-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)", border: `1px solid ${isRecording ? "rgba(var(--ce-status-error-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}` }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: isRecording ? "var(--ce-status-error)" : "var(--ce-text-secondary)" }} />
            <span className="text-[11px]" style={{ color: isRecording ? "var(--ce-status-error)" : "var(--ce-text-primary)", fontFamily: "var(--font-body)" }}>{isRecording ? "Recording" : "Record"}</span>
          </button>
          <button onClick={handleEndCall} className="flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer" style={{ background: "rgba(var(--ce-status-error-rgb),0.15)", border: "1px solid rgba(var(--ce-status-error-rgb),0.3)" }}>
            <X className="w-4 h-4 text-[var(--ce-status-error)]" />
            <span className="text-[11px] text-[var(--ce-status-error)]" style={{ fontFamily: "var(--font-body)" }}>End</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Messaging Layout (Orchestrator) ──────────────────────────────────

function MessagingLayout({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  const [threads, setThreads] = useState<Thread[]>(() => getThreadsForRole(role));
  const [selectedId, setSelectedId] = useState(threads[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [contextOpen, setContextOpen] = useState(true);
  const [videoCall, setVideoCall] = useState<{ name: string; initial: string } | null>(null);

  // Recalculate threads on role change
  useEffect(() => {
    const newThreads = getThreadsForRole(role);
    setThreads(newThreads);
    setSelectedId(newThreads[0]?.id || "");
  }, [role]);

  // Consume queued messages from dashboard check-in chips
  useEffect(() => {
    const queued = consumeQueuedMessages();
    if (queued.length === 0) return;

    setThreads(prev => {
      let updated = [...prev];
      for (const qm of queued) {
        const existingIdx = updated.findIndex(t => t.id === `dm-${qm.recipientId}`);
        const newMsg: Message = {
          id: qm.id,
          senderId: "me",
          senderName: "You",
          type: "text",
          content: qm.content,
          timestamp: "Just now",
        };

        if (existingIdx >= 0) {
          // Append to existing thread
          const thread = updated[existingIdx];
          updated[existingIdx] = {
            ...thread,
            messages: [...thread.messages, newMsg],
            lastMessagePreview: qm.content,
            lastMessageTime: "now",
            unread: false,
          };
        } else {
          // Create new DM thread for this recipient
          const newThread: Thread = {
            id: `dm-${qm.recipientId}`,
            type: "dm",
            title: qm.recipientName,
            participants: [{
              id: qm.recipientId,
              name: qm.recipientName,
              initial: qm.recipientInitial,
            }],
            messages: [newMsg],
            unread: false,
            pinned: false,
            lastMessageTime: "now",
            lastMessagePreview: qm.content,
            smartReplies: ["Thanks!", "How are you doing?", "Let's catch up soon"],
          };
          updated = [newThread, ...updated];
        }
      }
      return updated;
    });
  }, []);

  const selectedThread = threads.find(t => t.id === selectedId);

  const handleSelectThread = useCallback((id: string) => {
    setSelectedId(id);
    // Mark as read
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: false } : t));
  }, []);

  const handleSendMessage = useCallback((threadId: string, content: string) => {
    const newMsg: Message = {
      id: `user-${Date.now()}`,
      senderId: "me",
      senderName: "You",
      type: "text",
      content,
      timestamp: "Just now",
    };

    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        messages: [...t.messages, newMsg],
        lastMessagePreview: content.slice(0, 60),
        lastMessageTime: "now",
        smartReplies: undefined, // Clear smart replies after sending
      };
    }));

    // Simulate typing + response
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    const isSophia = thread.type === "sophia";
    const responderName = isSophia ? "Sophia" : thread.participants[0]?.name || "Someone";
    const responderId = isSophia ? "sophia" : thread.participants[0]?.id || "other";
    const responses = SIMULATED_RESPONSES[threadId] || SIMULATED_RESPONSES.default;
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Show typing after delay
    setTimeout(() => {
      // We need to trigger re-render to show typing — using a trick with threads state
      setThreads(prev => prev.map(t => {
        if (t.id !== threadId) return t;
        return { ...t, _typing: true } as Thread & { _typing: boolean };
      }));
    }, 800);

    // Add response after typing delay
    setTimeout(() => {
      const responseMsg: Message = {
        id: `response-${Date.now()}`,
        senderId: responderId,
        senderName: responderName,
        type: "text",
        content: response,
        timestamp: "Just now",
      };

      setThreads(prev => prev.map(t => {
        if (t.id !== threadId) return t;
        const updated = { ...t, messages: [...t.messages, responseMsg], lastMessagePreview: response.slice(0, 60), lastMessageTime: "now" };
        delete (updated as any)._typing;
        return updated;
      }));
    }, 2500 + Math.random() * 1500);
  }, [threads]);

  if (!selectedThread) return null;

  const isTyping = (selectedThread as any)?._typing;

  // Role-specific user info
  const ROLE_USER: Record<RoleId, { name: string; initial: string; gas: number }> = {
    edgestar: { name: "Sharon", initial: "S", gas: 45 },
    edgepreneur: { name: "Raj", initial: "R", gas: 38 },
    parent: { name: "Linda", initial: "L", gas: 52 },
    guide: { name: "Alice", initial: "A", gas: 62 },
    employer: { name: "David", initial: "D", gas: 71 },
    edu: { name: "Prof. Kim", initial: "K", gas: 55 },
    ngo: { name: "Maria", initial: "M", gas: 48 },
    agency: { name: "Director Wu", initial: "W", gas: 60 },
  };

  const user = ROLE_USER[role];
  const unreadCount = threads.filter(t => t.unread).length;

  return (
    <RoleShell
      role={role}
      userName={user.name}
      userInitial={user.initial}
      edgeGas={user.gas}
      onNavigate={onNavigate}
      activeNav="messages"
      noPadding
      sophiaOverride={{
        message: unreadCount > 0 ? `${unreadCount} unread conversation${unreadCount > 1 ? "s" : ""}` : "All caught up — no unread messages",
        chips: [
          { label: "Open EdgePath", action: "edgepath" },
          { label: "Check resume score", action: "resume" },
        ],
      }}
    >
      <div className="flex h-[calc(100vh-56px-56px)]" style={{ background: "rgba(8,9,12,1)" }}>
        <ConversationList
          threads={threads}
          selectedId={selectedId}
          onSelect={handleSelectThread}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="flex-1 flex relative min-w-0">
          <ActiveThread
            key={selectedId}
            thread={{ ...selectedThread }}
            onSendMessage={handleSendMessage}
            onNavigate={onNavigate}
            onStartVideoCall={(name, initial) => setVideoCall({ name, initial })}
          />

          <ContextPanel
            thread={selectedThread}
            isOpen={contextOpen}
            onToggle={() => setContextOpen(!contextOpen)}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Typing indicator overlay - shown in the active thread via messages */}
      {isTyping && selectedThread.type === "sophia" && (
        <div className="fixed bottom-[130px] left-[304px] z-10">
          <TypingIndicator name="Sophia" isSophia />
        </div>
      )}
      {isTyping && selectedThread.type !== "sophia" && selectedThread.participants[0] && (
        <div className="fixed bottom-[130px] left-[304px] z-10">
          <TypingIndicator name={selectedThread.participants[0].name} />
        </div>
      )}

      {/* Video Call Overlay */}
      <AnimatePresence>
        {videoCall && (
          <VideoCallUI
            participantName={videoCall.name}
            participantInitial={videoCall.initial}
            onEndCall={() => setVideoCall(null)}
          />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}

// ─── Export ───────────────────────────────────────────────────────────

export function Messaging({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  return <MessagingLayout role={role} onNavigate={onNavigate} />;
}
