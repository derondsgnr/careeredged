import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Users, GraduationCap, Heart, Briefcase, Globe, Building2 } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V9: "The Ecosystem"
 *
 * INSPIRATION: Airbnb (multi-audience) + Constellation maps + Boundless
 *
 * Philosophy: Show the network, not the product. Each user role is
 * a planet in an orbital system. The visitor chooses their perspective
 * and the entire page transforms. Interactive, multi-audience, connected.
 *
 * DESIGN MOVES:
 * - Hero is an orbital/constellation visualization of 6 roles
 * - Hovering a role shifts the page's accent color
 * - Selecting a role transforms content below into that perspective
 * - Brand patterns as connective tissue between nodes
 * - Each role has its own "universe" with tailored value props
 * - Sophia sits at the center connecting everything
 * - Horizontal tabs for role switching
 * - Sections morph based on active role
 */

interface LandingV9Props {
  onNavigate: (page: string) => void;
}

type RoleKey = "seeker" | "mentor" | "parent" | "institution" | "ngo" | "government";

const ROLES: Record<RoleKey, {
  label: string;
  title: string;
  icon: React.ElementType;
  accent: string;
  description: string;
  features: string[];
  stat: { value: string; label: string };
  cta: string;
  tagline: string;
}> = {
  seeker: {
    label: "Seekers",
    title: "The EdgeStar",
    icon: Users,
    accent: "var(--ce-cyan)",
    description: "Career seekers who want direction, not just listings. Get archetype-matched to roles that fit who you actually are.",
    features: [
      "15-question archetype assessment",
      "AI-personalized career roadmap",
      "Job matching by compatibility, not keywords",
      "Resume builder with AI bullet enhancement",
      "Productivity suite with SMART goals",
      "Immigration pathway mapping",
    ],
    stat: { value: "10,247", label: "roadmaps built" },
    cta: "Find Your Archetype",
    tagline: "Understand what your next move is.",
  },
  mentor: {
    label: "Mentors",
    title: "The Guide",
    icon: Briefcase,
    accent: "#8B5CF6",
    description: "Verified coaches and volunteer mentors who grow their practice through meaningful connections with career seekers.",
    features: [
      "Professional profile & portfolio builder",
      "Session scheduling & management",
      "Earnings tracking dashboard",
      "Matched with seekers by archetype",
      "Reputation & review system",
      "Both paid and volunteer tracks",
    ],
    stat: { value: "1,432", label: "verified guides" },
    cta: "Build Your Practice",
    tagline: "Guide careers. Grow your reputation.",
  },
  parent: {
    label: "Parents",
    title: "The Supporter",
    icon: Heart,
    accent: "#EC4899",
    description: "Parents who want visibility into their child's career journey without controlling it. Trust with transparency.",
    features: [
      "Read-only progress dashboards",
      "QR-based child linking (instant)",
      "Involvement level settings",
      "Milestone notifications",
      "Shared achievement tracking",
      "Privacy-respecting by design",
    ],
    stat: { value: "3,891", label: "connected families" },
    cta: "Support Your Child",
    tagline: "Visibility without overreach.",
  },
  institution: {
    label: "Institutions",
    title: "The Educator",
    icon: GraduationCap,
    accent: "#3B82F6",
    description: "Universities and schools tracking career readiness, managing events, and measuring the outcomes that matter.",
    features: [
      "Student adoption analytics",
      "QR-based event check-in",
      "Career fair management",
      "Career readiness metrics",
      "Cohort outcome tracking",
      "Integration-ready APIs",
    ],
    stat: { value: "247", label: "partner schools" },
    cta: "Track Outcomes",
    tagline: "Measure career readiness at scale.",
  },
  ngo: {
    label: "NGOs",
    title: "The Community",
    icon: Globe,
    accent: "#F97316",
    description: "Non-profits running career programs that need to track participants, measure impact, and report to funders.",
    features: [
      "Program creation & management",
      "Participant enrollment tracking",
      "Impact reporting dashboards",
      "Grant application system",
      "Multi-cohort analytics",
      "Funder-facing reports",
    ],
    stat: { value: "89", label: "active programs" },
    cta: "Launch a Program",
    tagline: "Career impact, measured and reported.",
  },
  government: {
    label: "Government",
    title: "The Funder",
    icon: Building2,
    accent: "#6366F1",
    description: "Government agencies distributing grants, overseeing workforce development, and needing data on outcomes.",
    features: [
      "Grant creation & distribution",
      "Application review workflow",
      "Impact oversight dashboard",
      "Workforce development metrics",
      "Multi-program tracking",
      "Compliance-ready reporting",
    ],
    stat: { value: "12", label: "agency partners" },
    cta: "Fund Development",
    tagline: "Workforce development with oversight.",
  },
};

const ROLE_KEYS: RoleKey[] = ["seeker", "mentor", "parent", "institution", "ngo", "government"];

// ─── Reveal ────────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Constellation Visualization ───────────────────────────
function Constellation({ activeRole, onRoleHover, onRoleClick }: {
  activeRole: RoleKey;
  onRoleHover: (role: RoleKey | null) => void;
  onRoleClick: (role: RoleKey) => void;
}) {
  const positions = [
    { key: "seeker" as RoleKey, x: 200, y: 80 },
    { key: "mentor" as RoleKey, x: 340, y: 150 },
    { key: "parent" as RoleKey, x: 320, y: 290 },
    { key: "institution" as RoleKey, x: 180, y: 350 },
    { key: "ngo" as RoleKey, x: 60, y: 290 },
    { key: "government" as RoleKey, x: 60, y: 150 },
  ];

  const center = { x: 200, y: 210 };

  return (
    <svg viewBox="0 0 400 430" className="w-full max-w-[400px] mx-auto" role="img" aria-label="CareerEdge ecosystem constellation showing 6 connected roles">
      {/* Connection lines to center */}
      {positions.map((pos) => (
        <motion.line
          key={`line-${pos.key}`}
          x1={center.x} y1={center.y} x2={pos.x} y2={pos.y}
          stroke={ROLES[pos.key].accent}
          strokeWidth={activeRole === pos.key ? 1.5 : 0.5}
          strokeDasharray={activeRole === pos.key ? "none" : "4 4"}
          opacity={activeRole === pos.key ? 0.6 : 0.15}
          animate={{
            opacity: activeRole === pos.key ? 0.6 : 0.15,
            strokeWidth: activeRole === pos.key ? 1.5 : 0.5,
          }}
          transition={{ duration: 0.4 }}
        />
      ))}

      {/* Inter-node connections (orbital ring) */}
      <motion.ellipse
        cx={center.x} cy={center.y}
        rx="160" ry="140"
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="1"
        strokeDasharray="2 6"
      />

      {/* Center node — Sophia */}
      <motion.circle
        cx={center.x} cy={center.y} r="28"
        fill="rgba(34, 211, 238, 0.06)"
        stroke="var(--ce-cyan)"
        strokeWidth="1"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <text
        x={center.x} y={center.y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--ce-cyan)"
        fontSize="9"
        fontFamily="Satoshi, sans-serif"
        fontWeight="600"
      >
        Sophia
      </text>

      {/* Role nodes */}
      {positions.map((pos) => {
        const role = ROLES[pos.key];
        const isActive = activeRole === pos.key;
        const Icon = role.icon;

        return (
          <g
            key={pos.key}
            className="cursor-pointer"
            onMouseEnter={() => onRoleHover(pos.key)}
            onMouseLeave={() => onRoleHover(null)}
            onClick={() => onRoleClick(pos.key)}
          >
            {/* Glow ring */}
            <motion.circle
              cx={pos.x} cy={pos.y}
              r={isActive ? 36 : 28}
              fill={`${role.accent}08`}
              stroke={role.accent}
              strokeWidth={isActive ? 1.5 : 0.5}
              animate={{
                r: isActive ? 36 : 28,
                strokeWidth: isActive ? 1.5 : 0.5,
              }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            />

            {/* Label */}
            <text
              x={pos.x} y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? role.accent : "var(--ce-text-tertiary)"}
              fontSize={isActive ? "10" : "9"}
              fontFamily="Satoshi, sans-serif"
              fontWeight={isActive ? "600" : "400"}
            >
              {role.label}
            </text>
          </g>
        );
      })}

      {/* Orbiting particle */}
      <motion.circle
        r="2.5"
        fill="var(--ce-lime)"
        opacity={0.6}
        animate={{
          cx: positions.map((p) => p.x).concat(positions[0].x),
          cy: positions.map((p) => p.y).concat(positions[0].y),
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

// ─── Role Content Panel ────────────────────────────────────
function RolePanel({ roleKey }: { roleKey: RoleKey }) {
  const role = ROLES[roleKey];

  return (
    <motion.div
      key={roleKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Tagline */}
      <div
        className="text-[13px] mb-2"
        style={{ fontFamily: "'Satoshi', sans-serif", color: role.accent }}
      >
        {role.tagline}
      </div>

      {/* Title */}
      <h3
        className="text-[28px] lg:text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] mb-4"
        style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
      >
        {role.title}
      </h3>

      {/* Description */}
      <p
        className="text-[14px] leading-[1.75] mb-8 max-w-[520px]"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
      >
        {role.description}
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {role.features.map((feature, i) => (
          <motion.div
            key={feature}
            className="flex items-start gap-2.5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: role.accent }} />
            <span
              className="text-[13px] leading-[1.6]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              {feature}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Stat + CTA */}
      <div className="flex flex-wrap items-center gap-6">
        <button
          className="px-6 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-all duration-300 hover:gap-4"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            background: role.accent,
            color: "#fff",
          }}
        >
          {role.cta}
          <ArrowRight size={14} />
        </button>
        <div>
          <div
            className="text-[24px] font-bold tracking-[-0.03em] leading-none"
            style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
          >
            {role.stat.value}
          </div>
          <div
            className="text-[11px] uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
          >
            {role.stat.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function LandingV9({ onNavigate }: LandingV9Props) {
  const [activeRole, setActiveRole] = useState<RoleKey>("seeker");
  const [hoveredRole, setHoveredRole] = useState<RoleKey | null>(null);
  const displayRole = hoveredRole || activeRole;

  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* ═══ HERO — Constellation ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Ambient glow that shifts with active role */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(ellipse at 50% 40%, ${ROLES[displayRole].accent}06 0%, transparent 60%)`,
          }}
          transition={{ duration: 0.8 }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left — Constellation */}
            <div className="lg:col-span-5">
              <Reveal>
                <Constellation
                  activeRole={displayRole}
                  onRoleHover={setHoveredRole}
                  onRoleClick={setActiveRole}
                />
              </Reveal>
            </div>

            {/* Right — Content */}
            <div className="lg:col-span-7">
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                >
                  Career Intelligence Ecosystem
                </div>
                <h1
                  className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[0.95] tracking-[-0.035em] mb-8"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  Six roles.
                  <br />
                  <span style={{ color: "var(--ce-cyan)" }}>One connected system.</span>
                </h1>
              </Reveal>

              {/* Role switcher tabs */}
              <Reveal delay={0.1}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {ROLE_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveRole(key)}
                      className="px-4 py-2 rounded-full text-[12px] cursor-pointer transition-all duration-300"
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        background: activeRole === key ? `${ROLES[key].accent}15` : "rgba(var(--ce-glass-tint), 0.02)",
                        color: activeRole === key ? ROLES[key].accent : "var(--ce-text-tertiary)",
                        border: `1px solid ${activeRole === key ? `${ROLES[key].accent}30` : "rgba(var(--ce-glass-tint), 0.04)"}`,
                        fontWeight: activeRole === key ? 600 : 400,
                      }}
                    >
                      {ROLES[key].label}
                    </button>
                  ))}
                </div>
              </Reveal>

              {/* Dynamic content */}
              <AnimatePresence mode="wait">
                <RolePanel roleKey={activeRole} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOPHIA — The Center ═══ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <Reveal>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-cyan)" }}
                >
                  The Center of Everything
                </div>
                <h2
                  className="text-[32px] lg:text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] mb-4"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                >
                  Sophia connects
                  <br />
                  every role.
                </h2>
                <p
                  className="text-[14px] leading-[1.75] max-w-[480px] mb-6"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                >
                  She doesn't just help seekers — she's the intelligence layer
                  that connects the entire ecosystem. Mentors get matched to the
                  right seekers. Institutions see outcomes. Parents stay informed.
                  Everyone moves forward because Sophia remembers everything.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-3">
                  {[
                    { text: "Knows every user's archetype and constraints", color: "var(--ce-cyan)" },
                    { text: "Connects surfaces across the entire platform", color: "var(--ce-lime)" },
                    { text: "Zero AI cost — rule-based intelligence", color: "#F59E0B" },
                    { text: "Conversational, never robotic", color: "#8B5CF6" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span
                        className="text-[13px]"
                        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Connection diagram */}
            <Reveal delay={0.15}>
              <div
                className="rounded-xl p-8 lg:p-10"
                style={{
                  background: "rgba(var(--ce-glass-tint), 0.02)",
                  border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                }}
              >
                <div className="space-y-4">
                  {[
                    { from: "Seeker", action: "gets roadmap", to: "Sophia", fromColor: "var(--ce-cyan)", toColor: "var(--ce-cyan)" },
                    { from: "Sophia", action: "matches with", to: "Mentor", fromColor: "var(--ce-cyan)", toColor: "#8B5CF6" },
                    { from: "Parent", action: "sees progress of", to: "Seeker", fromColor: "#EC4899", toColor: "var(--ce-cyan)" },
                    { from: "Institution", action: "tracks outcomes via", to: "Sophia", fromColor: "#3B82F6", toColor: "var(--ce-cyan)" },
                    { from: "NGO", action: "runs programs for", to: "Seekers", fromColor: "#F97316", toColor: "var(--ce-cyan)" },
                    { from: "Government", action: "funds programs at", to: "NGO", fromColor: "#6366F1", toColor: "#F97316" },
                  ].map((conn, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-[13px]"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                      <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: conn.fromColor }}>
                        {conn.from}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                      >
                        {conn.action}
                      </span>
                      <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: conn.toColor }}>
                        {conn.to}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 lg:py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <h2
              className="text-[32px] sm:text-[44px] lg:text-[56px] font-semibold leading-[1.05] tracking-[-0.035em] mb-6"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Find your place
              <br />
              in the <span style={{ color: "var(--ce-cyan)" }}>ecosystem.</span>
            </h2>
            <p
              className="text-[15px] leading-[1.7] max-w-[480px] mx-auto mb-10"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              Whether you're a seeker, mentor, parent, educator, or funder —
              there's a place for you. Start free.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate("signup")}
                className="px-8 py-4 rounded-lg text-[14px] font-medium flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "var(--ce-cyan)",
                  color: "#08090C",
                }}
              >
                Get Started Free
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="px-8 py-4 rounded-lg text-[14px] font-medium flex items-center gap-3 cursor-pointer transition-colors duration-300"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  color: "var(--ce-text-secondary)",
                  border: "1px solid rgba(var(--ce-glass-tint), 0.08)",
                }}
              >
                Learn More
                <ArrowUpRight size={15} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
