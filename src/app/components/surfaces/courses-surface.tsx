import { EASE } from "../tokens";
/**
 * Courses Surface — Skill-aligned Course Marketplace
 *
 * Curated course marketplace matched to EdgePath skill gaps and career goals.
 * Sophia guides initial skill/format selection, then curates recommendations.
 *
 * States: Empty → Building (2-step Sophia-guided) → Active (3 tabs)
 * Route: /:role/courses
 * Roles: All roles (primary: EdgeStar, EdgePreneur)
 *
 * Cross-surface: EdgePath roadmap, Budget tracking
 * Storage: localStorage `ce-courses-data`
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  GraduationCap, Search, Play, Clock, DollarSign, Star, Users,
  BookOpen, Check, ChevronRight, ArrowRight, X, Sparkles,
  ExternalLink, Filter, Award, BarChart3, Send, Circle, Bookmark,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CourseFormat = "self-paced" | "live" | "hybrid";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";
type ActiveTab = "recommended" | "browse" | "mycourses";

interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  format: CourseFormat;
  difficulty: DifficultyLevel;
  duration: string;
  cost: number;
  costLabel?: string;
  rating: number;
  enrollmentCount: number;
  tags: string[];
  phaseAligned?: number;
  enrolled: boolean;
  progress?: number;
  curriculum: string[];
  prerequisites: string[];
}

// ─── Config ──────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; color: string }> = {
  beginner:     { label: "Beginner",     color: "var(--ce-text-secondary)" },
  intermediate: { label: "Intermediate", color: "var(--ce-text-secondary)" },
  advanced:     { label: "Advanced",     color: "var(--ce-text-secondary)" },
};

const FORMAT_CONFIG: Record<CourseFormat, { label: string; icon: React.ReactNode }> = {
  "self-paced": { label: "Self-Paced", icon: <Play className="w-3 h-3" /> },
  live:         { label: "Live",       icon: <Users className="w-3 h-3" /> },
  hybrid:       { label: "Hybrid",     icon: <BarChart3 className="w-3 h-3" /> },
};

const SKILL_PILLS = ["Data & Analytics", "Design & UX", "Engineering", "Marketing", "Leadership", "Communication"] as const;
const FORMAT_PILLS = ["Self-Paced", "Live Classes", "Hybrid", "Any"] as const;

const FILTER_CHIPS: { label: string; value: string }[] = [
  { label: "All",       value: "all" },
  { label: "Free",      value: "free" },
  { label: "Paid",      value: "paid" },
  { label: "Self-Paced", value: "self-paced" },
  { label: "Live",      value: "live" },
];

// ─── Mock Data ──────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id: "c1", title: "Introduction to UX Design", provider: "Google", description: "Learn the foundations of UX design including user research, wireframing, prototyping, and usability testing from industry practitioners.", format: "self-paced", difficulty: "beginner", duration: "4 weeks", cost: 0, rating: 4.7, enrollmentCount: 45000, tags: ["design", "ux", "research"], phaseAligned: 2, enrolled: true, progress: 65,
    curriculum: ["Foundations of User Experience", "User Research Methods", "Wireframing & Prototyping", "Usability Testing Fundamentals", "Building a UX Portfolio"],
    prerequisites: ["No prior experience required"],
  },
  {
    id: "c2", title: "HTML & CSS Fundamentals", provider: "freeCodeCamp", description: "Master the building blocks of the web with hands-on projects covering semantic HTML, responsive CSS, Flexbox, and Grid layouts.", format: "self-paced", difficulty: "beginner", duration: "8 hours", cost: 0, rating: 4.5, enrollmentCount: 120000, tags: ["engineering", "web", "html", "css"], enrolled: false,
    curriculum: ["Semantic HTML Structure", "CSS Selectors & Box Model", "Flexbox Layout", "CSS Grid Mastery", "Responsive Design Patterns", "Final Project: Portfolio Page"],
    prerequisites: ["Basic computer literacy"],
  },
  {
    id: "c3", title: "Career Networking Essentials", provider: "LinkedIn Learning", description: "Build meaningful professional connections with proven networking strategies, cold outreach templates, and relationship-building frameworks.", format: "self-paced", difficulty: "beginner", duration: "2 hours", cost: 0, rating: 4.3, enrollmentCount: 28000, tags: ["communication", "networking", "career"], enrolled: true, progress: 100,
    curriculum: ["Why Networking Matters", "Building Your Elevator Pitch", "Cold Outreach That Works", "Maintaining Professional Relationships"],
    prerequisites: ["LinkedIn profile recommended"],
  },
  {
    id: "c4", title: "UX Research Masterclass", provider: "Coursera", description: "Advanced user research techniques including contextual inquiry, diary studies, A/B testing, and quantitative methods for product decisions.", format: "self-paced", difficulty: "intermediate", duration: "6 weeks", cost: 49, rating: 4.8, enrollmentCount: 12000, tags: ["design", "ux", "research"], phaseAligned: 2, enrolled: false,
    curriculum: ["Advanced Interview Techniques", "Contextual Inquiry & Field Studies", "Diary Studies & Longitudinal Research", "A/B Testing & Quantitative Methods", "Synthesizing & Presenting Findings"],
    prerequisites: ["Basic UX knowledge", "Familiarity with user interviews"],
  },
  {
    id: "c5", title: "Data Visualization with Python", provider: "Udemy", description: "Create compelling data stories using matplotlib, seaborn, and Plotly. Covers statistical visualization, dashboards, and presentation-ready charts.", format: "self-paced", difficulty: "intermediate", duration: "20 hours", cost: 29, rating: 4.6, enrollmentCount: 8000, tags: ["data", "analytics", "python"], phaseAligned: 3, enrolled: false,
    curriculum: ["Python Data Libraries Overview", "Matplotlib Deep Dive", "Statistical Visualization with Seaborn", "Interactive Charts with Plotly", "Building Dashboards", "Storytelling with Data"],
    prerequisites: ["Basic Python knowledge", "Understanding of statistics fundamentals"],
  },
  {
    id: "c6", title: "Product Management Bootcamp", provider: "General Assembly", description: "Intensive program covering product strategy, user stories, roadmapping, stakeholder management, and go-to-market execution.", format: "live", difficulty: "advanced", duration: "12 weeks", cost: 3950, rating: 4.9, enrollmentCount: 2000, tags: ["leadership", "product", "strategy"], enrolled: false,
    curriculum: ["Product Strategy & Vision", "User Stories & Prioritization", "Roadmap Planning", "Stakeholder Communication", "Go-to-Market Execution"],
    prerequisites: ["2+ years professional experience", "Basic understanding of product lifecycle"],
  },
  {
    id: "c7", title: "Public Speaking for Professionals", provider: "Skillshare", description: "Overcome presentation anxiety and deliver impactful talks with techniques from TEDx speakers and executive coaches.", format: "hybrid", difficulty: "intermediate", duration: "4 weeks", cost: 15, costLabel: "$15/mo", rating: 4.4, enrollmentCount: 5000, tags: ["communication", "leadership", "presentation"], enrolled: false,
    curriculum: ["Overcoming Presentation Anxiety", "Structuring Your Message", "Body Language & Vocal Variety", "Handling Q&A with Confidence"],
    prerequisites: ["No prior experience required"],
  },
  {
    id: "c8", title: "Advanced SQL for Data Analysis", provider: "DataCamp", description: "Master complex queries, window functions, CTEs, performance optimization, and real-world data analysis scenarios.", format: "self-paced", difficulty: "intermediate", duration: "15 hours", cost: 25, rating: 4.7, enrollmentCount: 15000, tags: ["data", "analytics", "sql"], phaseAligned: 2, enrolled: true, progress: 30,
    curriculum: ["Complex JOINs & Subqueries", "Window Functions", "Common Table Expressions", "Query Optimization", "Real-World Analysis Projects"],
    prerequisites: ["Basic SQL knowledge"],
  },
  {
    id: "c9", title: "Business Strategy Fundamentals", provider: "HBS Online", description: "Harvard Business School's framework for competitive analysis, value creation, and strategic decision-making in dynamic markets.", format: "live", difficulty: "advanced", duration: "8 weeks", cost: 1750, rating: 4.8, enrollmentCount: 3000, tags: ["leadership", "strategy", "business"], enrolled: false,
    curriculum: ["Competitive Advantage Analysis", "Value Creation & Capture", "Strategic Positioning", "Dynamic Strategy in Changing Markets", "Case Study: Real Company Decisions"],
    prerequisites: ["3+ years professional experience", "Basic business acumen"],
  },
  {
    id: "c10", title: "Digital Marketing Certificate", provider: "Google", description: "Comprehensive digital marketing training covering SEO, SEM, social media, email marketing, and analytics measurement.", format: "self-paced", difficulty: "beginner", duration: "6 months", cost: 0, rating: 4.6, enrollmentCount: 89000, tags: ["marketing", "digital", "analytics"], enrolled: false,
    curriculum: ["SEO Foundations", "Search Engine Marketing", "Social Media Strategy", "Email Marketing Campaigns", "Analytics & Measurement", "Capstone Project"],
    prerequisites: ["No prior experience required"],
  },
  {
    id: "c11", title: "Full-Stack Web Development", provider: "Codecademy", description: "Build complete web applications from front to back using React, Node.js, PostgreSQL, and modern deployment workflows.", format: "self-paced", difficulty: "intermediate", duration: "10 weeks", cost: 39, costLabel: "$39/mo", rating: 4.5, enrollmentCount: 22000, tags: ["engineering", "web", "react", "node"], enrolled: false,
    curriculum: ["React Fundamentals", "State Management & Hooks", "Node.js & Express API", "PostgreSQL & Data Modeling", "Authentication & Deployment"],
    prerequisites: ["HTML/CSS proficiency", "Basic JavaScript knowledge"],
  },
  {
    id: "c12", title: "AI & Machine Learning Foundations", provider: "Stanford Online", description: "Stanford's introduction to machine learning covering supervised learning, neural networks, and practical AI applications.", format: "hybrid", difficulty: "advanced", duration: "12 weeks", cost: 2100, rating: 4.9, enrollmentCount: 6000, tags: ["engineering", "ai", "data"], phaseAligned: 3, enrolled: false,
    curriculum: ["Supervised Learning Algorithms", "Neural Networks & Deep Learning", "Unsupervised Learning", "Practical AI Applications", "Ethics in AI", "Capstone: Build an ML Model"],
    prerequisites: ["Linear algebra basics", "Python programming experience"],
  },
  {
    id: "c13", title: "Resume Writing Workshop", provider: "CareerEdge", description: "Live workshop covering ATS optimization, impact-driven bullet points, and formatting that gets noticed by recruiters.", format: "live", difficulty: "beginner", duration: "2 hours", cost: 0, rating: 4.8, enrollmentCount: 500, tags: ["career", "resume", "writing"], enrolled: false,
    curriculum: ["ATS-Friendly Formatting", "Writing Impact-Driven Bullets", "Tailoring for Each Application", "Review & Feedback Session"],
    prerequisites: ["Bring a current resume draft"],
  },
  {
    id: "c14", title: "Interview Preparation Intensive", provider: "CareerEdge", description: "Three-session intensive covering behavioral interviews, technical assessments, and salary negotiation with mock practice.", format: "live", difficulty: "intermediate", duration: "3 sessions", cost: 99, rating: 4.7, enrollmentCount: 1200, tags: ["career", "interviews", "negotiation"], phaseAligned: 2, enrolled: false,
    curriculum: ["Behavioral Interview Mastery (STAR Method)", "Technical Assessment Strategies", "Salary Negotiation Frameworks", "Mock Interview with Feedback"],
    prerequisites: ["Active job search recommended"],
  },
  {
    id: "c15", title: "Leadership & Management", provider: "Wharton Online", description: "Wharton's leadership program covering team dynamics, organizational behavior, change management, and executive presence.", format: "self-paced", difficulty: "advanced", duration: "4 months", cost: 2800, rating: 4.8, enrollmentCount: 4000, tags: ["leadership", "management", "strategy"], enrolled: false,
    curriculum: ["Team Dynamics & Motivation", "Organizational Behavior", "Change Management", "Executive Presence & Communication", "Strategic Decision Making"],
    prerequisites: ["5+ years professional experience", "Management experience preferred"],
  },
];

// ─── Course Card ─────────────────────────────────────────────────────────────

function CourseCard({
  course,
  onClick,
  delay = 0,
}: {
  course: Course;
  onClick: (c: Course) => void;
  delay?: number;
}) {
  const diff = DIFFICULTY_CONFIG[course.difficulty];
  const fmt = FORMAT_CONFIG[course.format];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: EASE }}
    >
      <GlassCard delay={0}>
        <div
          className="cursor-pointer"
          onClick={() => onClick(course)}
        >
          {/* Provider logo placeholder + title */}
          <div className="flex items-start gap-3 mb-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.06)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              {course.provider[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-[13px] text-[var(--ce-text-primary)] mb-0.5 leading-snug"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {course.title}
              </h3>
              <span
                className="text-[10px] text-[var(--ce-text-quaternary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {course.provider}
              </span>
            </div>
          </div>

          {/* Badges row: difficulty + format + duration */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
              style={{
                background: `${diff.color}12`,
                border: `1px solid ${diff.color}20`,
                color: diff.color,
                fontFamily: "var(--font-body)",
              }}
            >
              {diff.label}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.04)",
                border: "1px solid rgba(var(--ce-glass-tint),0.07)",
                color: "var(--ce-text-tertiary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {fmt.icon}
              {fmt.label}
            </span>
            <span
              className="inline-flex items-center gap-1 text-[10px] text-[var(--ce-text-quaternary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          </div>

          {/* Cost + Rating + Enrollment */}
          <div className="flex items-center gap-3 mb-2">
            {course.cost === 0 ? (
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{
                  background: "rgba(var(--ce-lime-rgb),0.12)",
                  border: "1px solid rgba(var(--ce-lime-rgb),0.2)",
                  color: "var(--ce-lime)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Free
              </span>
            ) : (
              <span
                className="text-[12px] text-[var(--ce-text-primary)]"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
              >
                {course.costLabel ?? `$${course.cost}`}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px]" style={{ fontFamily: "var(--font-body)" }}>
              <Star className="w-3 h-3" style={{ color: "#F59E0B" }} fill="#F59E0B" />
              <span style={{ color: "#F59E0B" }}>{course.rating}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              <Users className="w-3 h-3" />
              {course.enrollmentCount >= 1000 ? `${(course.enrollmentCount / 1000).toFixed(course.enrollmentCount >= 10000 ? 0 : 1)}k` : course.enrollmentCount}
            </span>
          </div>

          {/* Phase alignment */}
          {course.phaseAligned && (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--ce-cyan)]" />
              <span className="text-[10px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-body)" }}>
                Aligns with Phase {course.phaseAligned}
              </span>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Detail Drawer ──────────────────────────────────────────────────────────

function CourseDrawer({
  course,
  onClose,
  onEnroll,
  onNavigate,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: (id: string) => void;
  onNavigate: (t: string) => void;
}) {
  const diff = DIFFICULTY_CONFIG[course.difficulty];
  const fmt = FORMAT_CONFIG[course.format];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        className="relative w-full max-w-[400px] h-full overflow-y-auto"
        style={{
          background: "var(--ce-surface-primary)",
          borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        }}
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors mb-5 hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
          >
            <X className="w-4 h-4 text-[var(--ce-text-tertiary)]" />
          </button>

          {/* Provider + Title */}
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-[15px]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.06)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              {course.provider[0]}
            </div>
            <div>
              <h2
                className="text-[15px] text-[var(--ce-text-primary)] mb-1 leading-snug"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {course.title}
              </h2>
              <span
                className="text-[12px] text-[var(--ce-text-secondary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {course.provider}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
              style={{ background: `${diff.color}12`, border: `1px solid ${diff.color}20`, color: diff.color, fontFamily: "var(--font-body)" }}
            >
              {diff.label}
            </span>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
              style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
            >
              {fmt.icon}
              {fmt.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
          </div>

          {/* Cost */}
          <div className="mb-4">
            {course.cost === 0 ? (
              <span
                className="px-3 py-1 rounded-lg text-[13px] font-medium inline-block"
                style={{ background: "rgba(var(--ce-lime-rgb),0.12)", border: "1px solid rgba(var(--ce-lime-rgb),0.2)", color: "var(--ce-lime)", fontFamily: "var(--font-display)" }}
              >
                Free
              </span>
            ) : (
              <span
                className="text-[18px] text-[var(--ce-text-primary)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {course.costLabel ?? `$${course.cost.toLocaleString()}`}
              </span>
            )}
          </div>

          {/* Rating + Enrollment */}
          <div className="flex items-center gap-4 mb-5">
            <span className="flex items-center gap-1 text-[12px]" style={{ fontFamily: "var(--font-body)" }}>
              <Star className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} fill="#F59E0B" />
              <span style={{ color: "#F59E0B" }}>{course.rating}</span>
            </span>
            <span className="flex items-center gap-1 text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
              <Users className="w-3.5 h-3.5" />
              {course.enrollmentCount.toLocaleString()} enrolled
            </span>
          </div>

          {/* Description */}
          <p
            className="text-[12px] text-[var(--ce-text-secondary)] leading-relaxed mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {course.description}
          </p>

          {/* Curriculum */}
          <div className="mb-5">
            <h3
              className="text-[12px] text-[var(--ce-text-primary)] mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              What you'll learn
            </h3>
            <div className="flex flex-col gap-2">
              {course.curriculum.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--ce-status-success)] flex-shrink-0 mt-0.5" />
                  <span
                    className="text-[11px] text-[var(--ce-text-secondary)] leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="mb-5">
            <h3
              className="text-[12px] text-[var(--ce-text-primary)] mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Prerequisites
            </h3>
            <div className="flex flex-col gap-1.5">
              {course.prerequisites.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Circle className="w-2.5 h-2.5 text-[var(--ce-text-quaternary)] flex-shrink-0 mt-1" />
                  <span
                    className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase alignment note */}
          {course.phaseAligned && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5"
              style={{ background: "rgba(var(--ce-cyan-rgb),0.06)", border: "1px solid rgba(var(--ce-cyan-rgb),0.12)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--ce-cyan)]" />
              <span className="text-[11px] text-[var(--ce-cyan)]" style={{ fontFamily: "var(--font-body)" }}>
                Aligns with your EdgePath Phase {course.phaseAligned}
              </span>
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => onEnroll(course.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: course.enrolled ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-cyan-rgb),0.1)",
                border: course.enrolled ? "1px solid rgba(var(--ce-glass-tint),0.1)" : "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                color: course.enrolled ? "var(--ce-text-secondary)" : "var(--ce-cyan)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              {course.enrolled ? (course.progress === 100 ? "View Certificate" : "Continue") : "Enroll"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cross-surface links */}
          <div className="flex flex-col gap-2 pt-3" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
            <button
              onClick={() => { onClose(); onNavigate("edgepath"); }}
              className="flex items-center gap-2 text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer transition-colors hover:text-[var(--ce-text-secondary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <BookOpen className="w-3 h-3" />
              Add to EdgePath
            </button>
            {course.cost > 0 && (
              <button
                onClick={() => { onClose(); onNavigate("budget"); }}
                className="flex items-center gap-2 text-[11px] text-[var(--ce-text-quaternary)] cursor-pointer transition-colors hover:text-[var(--ce-text-secondary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <DollarSign className="w-3 h-3" />
                Track in Budget
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Surface ────────────────────────────────────────────────────────────

export function CoursesSurface({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const navigate = useNavigate();
  const { role: roleParam } = useParams<{ role: string }>();
  const resolvedRole = role ?? roleParam ?? "edgestar";

  // State machine
  const stored = typeof window !== "undefined" ? localStorage.getItem("ce-courses-data") : null;
  const [surfaceState, setSurfaceState] = useState<"empty" | "building" | "active">(stored ? "active" : "empty");

  // Building
  const [buildStep, setBuildStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  // Active
  const [activeTab, setActiveTab] = useState<ActiveTab>("recommended");
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [browseFilter, setBrowseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCertificate, setShowCertificate] = useState<Course | null>(null);

  const accent = "var(--ce-cyan)";

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleNavigate = (target: string) => {
    if (onNavigate) { onNavigate(target); return; }
    const paths: Record<string, string> = {
      edgepath: `/${resolvedRole}/edgepath`,
      budget: `/${resolvedRole}/budget`,
      sessions: `/${resolvedRole}/sessions`,
      synthesis: `/${resolvedRole}`,
    };
    navigate(paths[target] ?? `/${resolvedRole}`);
  };

  const handleBuildNext = () => {
    if (buildStep === 1 && selectedSkills.length === 0) {
      toast.error("Select at least one skill area");
      return;
    }
    if (buildStep === 2) {
      localStorage.setItem("ce-courses-data", JSON.stringify({ skills: selectedSkills, format: selectedFormat }));
      setSurfaceState("active");
      toast.success("Course library ready!");
      return;
    }
    setBuildStep(2);
  };

  const handleEnroll = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (c.enrolled) return c;
      toast.success(`Enrolled in ${c.title}!`);
      return { ...c, enrolled: true, progress: 0 };
    }));
    setSelectedCourse(prev => prev && prev.id === id ? { ...prev, enrolled: true, progress: 0 } : prev);
  };

  // Filtered data
  const recommendedCourses = courses.filter(c => c.phaseAligned || c.tags.some(t => ["career", "design", "ux", "data", "analytics"].includes(t))).slice(0, 8);
  const browseCourses = courses.filter(c => {
    const matchesFilter =
      browseFilter === "all" ||
      (browseFilter === "free" && c.cost === 0) ||
      (browseFilter === "paid" && c.cost > 0) ||
      (browseFilter === "self-paced" && c.format === "self-paced") ||
      (browseFilter === "live" && c.format === "live");
    const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
  const enrolledCourses = courses.filter(c => c.enrolled);

  const sophiaOverride = surfaceState === "empty"
    ? { message: "I'll match courses to your skill gaps and career goals.", chips: [{ label: "View roadmap", action: "Show my EdgePath roadmap" }, { label: "Track spending", action: "Open my budget tracker" }] }
    : { message: "Your course library — aligned to your roadmap.", chips: [{ label: "View roadmap", action: "Show my EdgePath roadmap" }, { label: "Track spending", action: "Open my budget tracker" }] };

  const userName = resolvedRole === "edgestar" ? "Alex" : resolvedRole === "edgepreneur" ? "Jordan" : "User";
  const userInitial = userName[0];

  // ─── Empty State ─────────────────────────────────────────────────────────

  if (surfaceState === "empty") {
    return (
      <RoleShell role={resolvedRole as any} userName={userName} userInitial={userInitial} edgeGas={42} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="flex flex-col items-center justify-center py-32 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(var(--ce-cyan-rgb),0.08)", border: "1px solid rgba(var(--ce-cyan-rgb),0.15)" }}
            >
              <GraduationCap className="w-7 h-7 text-[var(--ce-cyan)]" />
            </div>
            <h1
              className="text-[20px] text-[var(--ce-text-primary)] mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Course Library
            </h1>
            <p
              className="text-[13px] text-[var(--ce-text-secondary)] max-w-[340px] mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Skill-aligned courses matched to your career roadmap.
            </p>
            <button
              onClick={() => setSurfaceState("building")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: "rgba(var(--ce-cyan-rgb),0.1)",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                color: "var(--ce-cyan)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              Browse Courses
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Building State ──────────────────────────────────────────────────────

  if (surfaceState === "building") {
    return (
      <RoleShell role={resolvedRole as any} userName={userName} userInitial={userInitial} edgeGas={42} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            className="max-w-[520px] mx-auto py-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-1.5 mb-8">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{ background: s <= buildStep ? "var(--ce-cyan)" : "rgba(var(--ce-glass-tint),0.08)" }}
                />
              ))}
            </div>

            <GlassCard delay={0.1}>
              <div className="rounded-xl p-4 overflow-y-auto" style={{ maxHeight: 420 }}>
                {/* Sophia header */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="flex-shrink-0 mt-0.5">
                    <SophiaMark size={20} />
                  </div>
                  <div>
                    <span
                      className="text-[13px] text-[var(--ce-text-primary)] block mb-1"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {buildStep === 1 ? "What skills are you looking to build?" : "Preferred format?"}
                    </span>
                    <span
                      className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {buildStep === 1
                        ? "Pick one or more areas — I'll recommend courses that match."
                        : "I'll recommend courses aligned with your EdgePath skill gaps."}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {buildStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <div className="flex flex-wrap gap-2 mb-5">
                        {SKILL_PILLS.map(pill => {
                          const selected = selectedSkills.includes(pill);
                          return (
                            <button
                              key={pill}
                              onClick={() => setSelectedSkills(prev => selected ? prev.filter(p => p !== pill) : [...prev, pill])}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] cursor-pointer transition-all"
                              style={{
                                background: selected ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
                                border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.07)",
                                color: selected ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
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
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <div className="flex flex-wrap gap-2 mb-5">
                        {FORMAT_PILLS.map(pill => {
                          const selected = selectedFormat === pill;
                          return (
                            <button
                              key={pill}
                              onClick={() => setSelectedFormat(pill)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] cursor-pointer transition-all"
                              style={{
                                background: selected ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
                                border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.25)" : "1px solid rgba(var(--ce-glass-tint),0.07)",
                                color: selected ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
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
                </AnimatePresence>

                {/* Next / Finish button */}
                <button
                  onClick={handleBuildNext}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
                  style={{
                    background: "rgba(var(--ce-cyan-rgb),0.1)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                    color: "var(--ce-cyan)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                  }}
                >
                  {buildStep === 2 ? "Build My Library" : "Next"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Active State ────────────────────────────────────────────────────────

  const TABS: { label: string; value: ActiveTab }[] = [
    { label: "Recommended", value: "recommended" },
    { label: "Browse",      value: "browse" },
    { label: "My Courses",  value: "mycourses" },
  ];

  return (
    <RoleShell role={resolvedRole as any} userName={userName} userInitial={userInitial} edgeGas={42} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-[var(--ce-cyan)]" />
              <h1
                className="text-[15px] text-[var(--ce-text-primary)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Courses
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate("edgepath")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              >
                <BookOpen className="w-3 h-3" />
                View roadmap
              </button>
              <button
                onClick={() => handleNavigate("budget")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ border: "1px solid rgba(var(--ce-glass-tint),0.07)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              >
                <DollarSign className="w-3 h-3" />
                Track spending
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex-1 px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-all"
                style={{
                  background: activeTab === tab.value ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
                  color: activeTab === tab.value ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: activeTab === tab.value ? 500 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Recommended Tab ─────────────────────────────────────────── */}
          {activeTab === "recommended" && (
            <motion.div
              key="recommended"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <SophiaInsight
                message="These courses align with your EdgePath phases and skill gaps. Enroll to track progress automatically."
                onAction={() => {}}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {recommendedCourses.map((c, i) => (
                  <CourseCard key={c.id} course={c} onClick={setSelectedCourse} delay={i * 0.04} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Browse Tab ──────────────────────────────────────────────── */}
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* Filter chips */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {FILTER_CHIPS.map(chip => (
                  <button
                    key={chip.value}
                    onClick={() => setBrowseFilter(chip.value)}
                    className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                    style={{
                      background: browseFilter === chip.value ? "rgba(var(--ce-cyan-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.03)",
                      border: browseFilter === chip.value ? "1px solid rgba(var(--ce-cyan-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.07)",
                      color: browseFilter === chip.value ? "var(--ce-cyan)" : "var(--ce-text-tertiary)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
                style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.07)" }}
              >
                <Search className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[12px] text-[var(--ce-text-primary)] placeholder:text-[var(--ce-text-quaternary)]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="cursor-pointer">
                    <X className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                  </button>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {browseCourses.map((c, i) => (
                  <CourseCard key={c.id} course={c} onClick={setSelectedCourse} delay={i * 0.03} />
                ))}
              </div>
              {browseCourses.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-5 h-5 text-[var(--ce-text-quaternary)] mx-auto mb-2" />
                  <p className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                    No courses match your search.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── My Courses Tab ──────────────────────────────────────────── */}
          {activeTab === "mycourses" && (
            <motion.div
              key="mycourses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {enrolledCourses.length > 0 ? (
                <>
                  <SophiaInsight
                    message={`You've completed ${enrolledCourses.filter(c => c.progress === 100).length} course${enrolledCourses.filter(c => c.progress === 100).length !== 1 ? "s" : ""} and have ${enrolledCourses.filter(c => (c.progress ?? 0) < 100).length} in progress. Keep going!`}
                    onAction={() => {}}
                  />
                  <div className="flex flex-col gap-3 mt-4">
                    {enrolledCourses.map((c, i) => {
                      const isComplete = c.progress === 100;
                      return (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                        >
                          <GlassCard delay={0}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h3
                                    className="text-[13px] text-[var(--ce-text-primary)]"
                                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                                  >
                                    {c.title}
                                  </h3>
                                  <span
                                    className="px-2 py-0.5 rounded-md text-[9px]"
                                    style={{
                                      background: isComplete ? "rgba(var(--ce-status-success-rgb),0.1)" : "rgba(var(--ce-cyan-rgb),0.08)",
                                      border: isComplete ? "1px solid rgba(var(--ce-status-success-rgb),0.2)" : "1px solid rgba(var(--ce-cyan-rgb),0.15)",
                                      color: isComplete ? "var(--ce-status-success)" : "var(--ce-cyan)",
                                      fontFamily: "var(--font-body)",
                                    }}
                                  >
                                    {isComplete ? "Completed" : "In Progress"}
                                  </span>
                                </div>
                                <span
                                  className="text-[10px] text-[var(--ce-text-quaternary)] block mb-2.5"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {c.provider}
                                </span>

                                {/* Progress bar */}
                                <div className="mb-1.5">
                                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ background: isComplete ? "var(--ce-status-success)" : "var(--ce-cyan)" }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${c.progress ?? 0}%` }}
                                      transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 + 0.2 }}
                                    />
                                  </div>
                                </div>
                                <span
                                  className="text-[10px] text-[var(--ce-text-tertiary)]"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {c.progress}% complete
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  if (isComplete) { setShowCertificate(c); }
                                  else { setSelectedCourse(c); }
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-all flex-shrink-0 hover:bg-[rgba(var(--ce-cyan-rgb),0.12)]"
                                style={{
                                  background: "rgba(var(--ce-cyan-rgb),0.08)",
                                  border: "1px solid rgba(var(--ce-cyan-rgb),0.15)",
                                  color: "var(--ce-cyan)",
                                  fontFamily: "var(--font-body)",
                                }}
                              >
                                {isComplete ? (
                                  <>
                                    <Award className="w-3 h-3" />
                                    Certificate
                                  </>
                                ) : (
                                  <>
                                    Continue
                                    <ArrowRight className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <GraduationCap className="w-6 h-6 text-[var(--ce-text-quaternary)] mx-auto mb-3" />
                  <p
                    className="text-[13px] text-[var(--ce-text-secondary)] mb-1"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    No courses yet
                  </p>
                  <p
                    className="text-[12px] text-[var(--ce-text-tertiary)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Enroll in a course to track your progress here.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseDrawer
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onEnroll={handleEnroll}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>

      {/* ─── Certificate Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
              onClick={() => setShowCertificate(null)}
            />
            <motion.div
              className="relative w-full"
              style={{ maxWidth: 500 }}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {/* Certificate Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(var(--ce-glass-tint),0.06)",
                  backdropFilter: "blur(24px)",
                  border: "2px solid rgba(var(--ce-cyan-rgb),0.2)",
                  boxShadow: "0 0 0 1px rgba(var(--ce-cyan-rgb),0.08), 0 24px 48px rgba(0,0,0,0.3)",
                }}
              >
                {/* Inner decorative border */}
                <div
                  className="m-3 rounded-xl p-8 text-center"
                  style={{
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.12)",
                    background: "rgba(var(--ce-glass-tint),0.03)",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Award className="w-5 h-5" style={{ color: accent }} />
                    <h2
                      className="text-[20px] tracking-tight"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "var(--ce-text-primary)",
                      }}
                    >
                      Certificate of Completion
                    </h2>
                  </div>

                  {/* Decorative line */}
                  <div
                    className="mx-auto mb-6 rounded-full"
                    style={{
                      width: 80,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, rgba(var(--ce-cyan-rgb),0.5), transparent)`,
                    }}
                  />

                  {/* Body */}
                  <p
                    className="text-[12px] mb-1"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                  >
                    This certifies that
                  </p>
                  <p
                    className="text-[18px] mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--ce-text-primary)",
                    }}
                  >
                    You
                  </p>
                  <p
                    className="text-[12px] mb-1"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                  >
                    has successfully completed
                  </p>
                  <p
                    className="text-[16px] mb-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--ce-text-primary)",
                    }}
                  >
                    {showCertificate.title}
                  </p>
                  <p
                    className="text-[12px] mb-5"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-secondary)" }}
                  >
                    {showCertificate.provider}
                  </p>

                  {/* Decorative line */}
                  <div
                    className="mx-auto mb-5 rounded-full"
                    style={{
                      width: 80,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, rgba(var(--ce-cyan-rgb),0.5), transparent)`,
                    }}
                  />

                  {/* Meta */}
                  <div className="flex items-center justify-center gap-6 mb-5">
                    <div>
                      <p
                        className="text-[10px] mb-0.5"
                        style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-quaternary)" }}
                      >
                        Completion Date
                      </p>
                      <p
                        className="text-[12px]"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                          color: "var(--ce-text-secondary)",
                        }}
                      >
                        {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div
                      style={{
                        width: 1,
                        height: 24,
                        background: "rgba(var(--ce-glass-tint),0.1)",
                      }}
                    />
                    <div>
                      <p
                        className="text-[10px] mb-0.5"
                        style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-quaternary)" }}
                      >
                        Certificate ID
                      </p>
                      <p
                        className="text-[12px]"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                          color: "var(--ce-text-secondary)",
                        }}
                      >
                        CE-{showCertificate.id.toUpperCase()}-2026
                      </p>
                    </div>
                  </div>

                  {/* Sophia mark */}
                  <div className="flex items-center justify-center gap-1.5 opacity-40">
                    <SophiaMark size={14} />
                    <span
                      className="text-[10px]"
                      style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-quaternary)" }}
                    >
                      Verified by CareerEdge
                    </span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => {
                    toast.success("Certificate downloaded");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:brightness-110"
                  style={{
                    background: "rgba(var(--ce-cyan-rgb),0.12)",
                    border: "1px solid rgba(var(--ce-cyan-rgb),0.2)",
                    color: accent,
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://careeredge.com/certificates/CE-${showCertificate.id.toUpperCase()}-2026`);
                    toast.success("Certificate link copied");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:brightness-110"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.06)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                    color: "var(--ce-text-secondary)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Share
                </button>
                <button
                  onClick={() => setShowCertificate(null)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:brightness-110"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.06)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                    color: "var(--ce-text-tertiary)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RoleShell>
  );
}
