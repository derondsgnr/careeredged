import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "../animations/ScrollReveal";

const seekerCards = [
  {
    title: "Students & New Grads",
    headline: "Turn your potential into a concrete plan.",
    description: "Degree in hand, next step unclear? Turn your potential into a concrete plan.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  },
  {
    title: "Career Changers",
    headline: "Your experience transfers further than you think.",
    description: "Ready for something different? Discover careers that match your strengths, not just your last title.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    title: "Global Professionals",
    headline: "Navigate a new market with confidence.",
    description: "Building a career in a new country? Navigate the path with guidance built for your situation.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
  {
    title: "Rising Leaders",
    headline: "Get the roadmap to get there faster.",
    description: "You know where you want to be. Get the roadmap and accountability to get there faster.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
  },
];

// ─── Ecosystem Roles ──────────────────────────────────────

type RoleKey = "seeker" | "mentor" | "parent" | "institution" | "ngo" | "government";

const ROLES: Record<RoleKey, {
  label: string;
  title: string;
  accent: string;
  description: string;
  features: string[];
  stat: { value: string; label: string };
  cta: string;
  ctaHref: string;
  tagline: string;
}> = {
  seeker: {
    label: "Seekers",
    title: "The EdgeStar",
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
    ctaHref: "/signup",
    tagline: "Understand what your next move is.",
  },
  mentor: {
    label: "Mentors",
    title: "The Guide",
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
    ctaHref: "/signup",
    tagline: "Guide careers. Grow your reputation.",
  },
  parent: {
    label: "Parents",
    title: "The Supporter",
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
    ctaHref: "/signup",
    tagline: "Visibility without overreach.",
  },
  institution: {
    label: "Institutions",
    title: "The Educator",
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
    ctaHref: "/solutions/institutions",
    tagline: "Measure career readiness at scale.",
  },
  ngo: {
    label: "NGOs",
    title: "The Community",
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
    ctaHref: "/solutions/ngos",
    tagline: "Career impact, measured and reported.",
  },
  government: {
    label: "Government",
    title: "The Funder",
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
    ctaHref: "/solutions/government",
    tagline: "Workforce development with oversight.",
  },
};

const ROLE_KEYS: RoleKey[] = ["seeker", "mentor", "parent", "institution", "ngo", "government"];

// ─── Constellation Visualization ──────────────────────────

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

      {/* Orbital ring */}
      <motion.ellipse
        cx={center.x} cy={center.y}
        rx="160" ry="140"
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="1"
        strokeDasharray="2 6"
      />

      {/* Center node — EdgeStar */}
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
        fontSize="8"
        fontFamily="Satoshi, sans-serif"
        fontWeight="600"
      >
        EdgeStar
      </text>

      {/* Role nodes */}
      {positions.map((pos) => {
        const role = ROLES[pos.key];
        const isActive = activeRole === pos.key;

        return (
          <g
            key={pos.key}
            className="cursor-pointer"
            onMouseEnter={() => onRoleHover(pos.key)}
            onMouseLeave={() => onRoleHover(null)}
            onClick={() => onRoleClick(pos.key)}
          >
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

// ─── Role Content Panel ───────────────────────────────────

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
      <div
        className="text-[13px] mb-2"
        style={{ fontFamily: "'Satoshi', sans-serif", color: role.accent }}
      >
        {role.tagline}
      </div>

      <h3
        className="text-[28px] lg:text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] mb-4"
        style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
      >
        {role.title}
      </h3>

      <p
        className="text-[14px] leading-[1.75] mb-8 max-w-[520px]"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
      >
        {role.description}
      </p>

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

      <div className="flex flex-wrap items-center gap-6">
        <Link
          to={role.ctaHref}
          className="btn btn-primary flex items-center gap-2"
        >
          {role.cta}
          <ArrowRight size={14} />
        </Link>
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

export function WhoItsFor() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Ecosystem role state
  const [activeRole, setActiveRole] = useState<RoleKey>("seeker");
  const [hoveredRole, setHoveredRole] = useState<RoleKey | null>(null);
  const displayRole = hoveredRole || activeRole;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth || 600;
    const gap = 20;
    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  // Auto-scroll every 5s
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        const el = scrollRef.current;
        if (!el) return;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }, 5000);
    };

    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [scroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        {/* Header with arrows */}
        <div className="flex justify-between items-end mb-20">
          <div>
            <ScrollReveal variant="sm">
              <p className="text-eyebrow text-accent mb-8">For everyone</p>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="h2 text-text-primary">
                Built for wherever you are.
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="sm" delay={2}>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className={`w-12 h-12 rounded-full border border-border-light flex items-center justify-center transition-opacity duration-300 ${
                  canScrollLeft ? "opacity-100 hover:bg-bg-darker-gray" : "opacity-30 cursor-default"
                }`}
                disabled={!canScrollLeft}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className={`w-12 h-12 rounded-full border border-border-light flex items-center justify-center transition-opacity duration-300 ${
                  canScrollRight ? "opacity-100 hover:bg-bg-darker-gray" : "opacity-30 cursor-default"
                }`}
                disabled={!canScrollRight}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Cards — 2 visible, horizontal scroll */}
        <ScrollReveal>
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 testimonial-scroll snap-x snap-mandatory"
          >
            {seekerCards.map((card) => (
              <div
                key={card.title}
                data-card
                className="shrink-0 w-[calc(50%-10px)] snap-start rounded-[var(--radius-lg)] overflow-hidden flex flex-col"
              >
                {/* Image with title overlay */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-[28px] leading-[1.2] tracking-[-0.48px] font-normal text-white">{card.title}</h3>
                  </div>
                </div>

                {/* Description + CTA */}
                <div className="bg-bg-card p-8 flex-1 flex flex-col">
                  <p className="text-large text-text-primary font-medium mb-3">{card.headline}</p>
                  <p className="text-body text-text-secondary mb-6 flex-1">{card.description}</p>
                  <Link to="/signup" className="text-btn text-accent inline-flex items-center gap-2">
                    Get started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ═══ Six Roles Ecosystem ═══ */}
        <div className="mt-24 relative overflow-hidden rounded-[var(--radius-xl)] py-16 lg:py-24 px-6 lg:px-12" style={{ background: "var(--ce-surface-bg, var(--bg-dark))" }}>
          {/* Ambient glow that shifts with active role */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: `radial-gradient(ellipse at 50% 40%, ${ROLES[displayRole].accent}06 0%, transparent 60%)`,
            }}
            transition={{ duration: 0.8 }}
          />

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left — Constellation */}
              <div className="lg:col-span-5">
                <ScrollReveal>
                  <Constellation
                    activeRole={displayRole}
                    onRoleHover={setHoveredRole}
                    onRoleClick={setActiveRole}
                  />
                </ScrollReveal>
              </div>

              {/* Right — Content */}
              <div className="lg:col-span-7">
                <ScrollReveal>
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] mb-4"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                  >
                    Career Intelligence Ecosystem
                  </div>
                  <h2
                    className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[0.95] tracking-[-0.035em] mb-8"
                    style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-text-primary)" }}
                  >
                    Six roles.
                    <br />
                    <span style={{ color: "var(--ce-cyan)" }}>One connected system.</span>
                  </h2>
                </ScrollReveal>

                {/* Role switcher tabs */}
                <ScrollReveal>
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
                </ScrollReveal>

                {/* Dynamic content */}
                <AnimatePresence mode="wait">
                  <RolePanel roleKey={activeRole} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
