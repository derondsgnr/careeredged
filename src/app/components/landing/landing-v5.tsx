import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

/**
 * V5: "The Conversation"
 *
 * INSPIRATION: Kriss.ai (human-AI warmth) + Claude (conversational intelligence)
 *
 * Philosophy: The entire landing page IS a conversation with Sophia.
 * Anti-SaaS — feels like talking to a friend who happens to know everything
 * about career development. Photography-forward, warm, human.
 *
 * DESIGN MOVES:
 * - Page structured as a dialogue between Sophia and the visitor
 * - Each "section" is a message bubble that reveals on scroll
 * - Photography of real people (Unsplash) integrated into conversation
 * - Warm cyan glow follows Sophia's messages
 * - Visitor can "respond" via interactive choices
 * - No traditional hero — starts mid-conversation
 * - Soft, rounded forms instead of sharp grids
 * - Background shifts warmth as conversation deepens
 */

interface LandingV5Props {
  onNavigate: (page: string) => void;
}

// ─── Typing Indicator ──────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--ce-cyan)" }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Sophia Message ────────────────────────────────────────
function SophiaMessage({
  children,
  delay = 0,
  showAvatar = true,
}: {
  children: React.ReactNode;
  delay?: number;
  showAvatar?: boolean;
}) {
  const [showContent, setShowContent] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShowTyping(true), delay * 1000);
          setTimeout(() => {
            setShowTyping(false);
            setShowContent(true);
          }, delay * 1000 + 800);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="flex gap-3 max-w-[680px]">
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(34, 211, 238, 0.1)",
              border: "1px solid rgba(34, 211, 238, 0.15)",
            }}
          >
            <Sparkles size={14} style={{ color: "var(--ce-cyan)" }} />
          </div>
        </div>
      )}
      {!showAvatar && <div className="w-9 flex-shrink-0" />}

      <div>
        {showAvatar && (
          <div
            className="text-[11px] uppercase tracking-[0.1em] mb-1.5 ml-1"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-cyan)" }}
          >
            Sophia
          </div>
        )}

        <AnimatePresence mode="wait">
          {showTyping && !showContent && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl rounded-tl-md"
              style={{
                background: "rgba(34, 211, 238, 0.04)",
                border: "1px solid rgba(34, 211, 238, 0.08)",
              }}
            >
              <TypingDots />
            </motion.div>
          )}

          {showContent && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-2xl rounded-tl-md px-5 py-4"
              style={{
                background: "rgba(34, 211, 238, 0.04)",
                border: "1px solid rgba(34, 211, 238, 0.08)",
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── User Message ──────────────────────────────────────────
function UserMessage({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="flex justify-end"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      <div
        className="rounded-2xl rounded-tr-md px-5 py-4 max-w-[480px]"
        style={{
          background: "rgba(var(--ce-glass-tint), 0.04)",
          border: "1px solid rgba(var(--ce-glass-tint), 0.06)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ─── Interactive Choice Bubbles ────────────────────────────
function ChoiceBubbles({
  choices,
  onChoice,
  delay = 0,
}: {
  choices: string[];
  onChoice?: (choice: string) => void;
  delay?: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-end"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      {choices.map((choice) => (
        <button
          key={choice}
          onClick={() => {
            setSelected(choice);
            onChoice?.(choice);
          }}
          className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer transition-all duration-300"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            background: selected === choice ? "var(--ce-lime)" : "rgba(var(--ce-glass-tint), 0.03)",
            color: selected === choice ? "#08090C" : "var(--ce-text-secondary)",
            border: selected === choice ? "1px solid var(--ce-lime)" : "1px solid rgba(var(--ce-glass-tint), 0.06)",
            fontWeight: selected === choice ? 600 : 400,
          }}
        >
          {choice}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Photo Insert (conversation-embedded image) ────────────
function PhotoInsert({ src, alt, caption, delay = 0 }: { src: string; alt: string; caption: string; delay?: number }) {
  return (
    <motion.div
      className="max-w-[420px] mx-auto"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(var(--ce-glass-tint), 0.06)" }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
        />
        <div
          className="px-4 py-3 text-[12px]"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            color: "var(--ce-text-tertiary)",
            background: "rgba(var(--ce-glass-tint), 0.02)",
          }}
        >
          {caption}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Conversation Divider ──────────────────────────────────
function ConvDivider({ text }: { text: string }) {
  return (
    <motion.div
      className="flex items-center gap-4 py-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-1 h-[1px]" style={{ background: "rgba(var(--ce-glass-tint), 0.04)" }} />
      <span
        className="text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
      >
        {text}
      </span>
      <div className="flex-1 h-[1px]" style={{ background: "rgba(var(--ce-glass-tint), 0.04)" }} />
    </motion.div>
  );
}

// ─── Stat Pill ─────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(var(--ce-lime-rgb), 0.06)",
        border: "1px solid rgba(var(--ce-lime-rgb), 0.1)",
      }}
    >
      <span
        className="text-[13px] font-semibold"
        style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-lime)" }}
      >
        {value}
      </span>
      <span
        className="text-[11px]"
        style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function LandingV5({ onNavigate }: LandingV5Props) {
  return (
    <div className="min-h-screen" style={{ background: "var(--ce-surface-bg)" }}>
      <LandingNav onNavigate={onNavigate} />

      {/* Ambient Sophia glow */}
      <div
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 20% 30%, rgba(34, 211, 238, 0.03) 0%, transparent 50%)",
        }}
      />

      {/* ═══ CONVERSATION CONTAINER ═══ */}
      <div className="relative z-10 max-w-[760px] mx-auto px-6 pt-32 pb-20">
        {/* Scroll indicator */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} style={{ color: "var(--ce-text-quaternary)", margin: "0 auto" }} />
          </motion.div>
          <div
            className="text-[11px] mt-2 tracking-[0.08em]"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
          >
            Sophia wants to talk
          </div>
        </motion.div>

        {/* ─── Opening ─── */}
        <div className="space-y-5 mb-16">
          <SophiaMessage delay={0.3}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Hey. I'm Sophia — and before you ask, no, I'm not another chatbot
              that's going to ask you to upload your resume and then ghost you.
            </p>
          </SophiaMessage>

          <SophiaMessage delay={0.8} showAvatar={false}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              I'm more like that friend in your network who actually knows what they're
              talking about. I've helped <StatPill value="10,000+" label="people" /> map
              their careers — and I remember every single one.
            </p>
          </SophiaMessage>
        </div>

        {/* ─── The Question ─── */}
        <div className="space-y-5 mb-16">
          <SophiaMessage delay={0}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              So here's what I need to know — what's actually going on with your career right now?
            </p>
          </SophiaMessage>

          <ChoiceBubbles
            choices={[
              "I'm stuck and need direction",
              "I'm switching careers",
              "I'm helping someone else",
              "Just exploring",
            ]}
            delay={0.3}
          />
        </div>

        <ConvDivider text="What happens next" />

        {/* ─── The Assessment ─── */}
        <div className="space-y-5 mb-16">
          <UserMessage delay={0}>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Okay so how does this actually work?
            </p>
          </UserMessage>

          <SophiaMessage delay={0.2}>
            <p
              className="text-[15px] leading-[1.75] mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              15 questions. That's it. I'll figure out your career archetype — there are 18 of them,
              and yours tells me exactly what kind of work makes you come alive.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Innovator", "Strategist", "Visionary", "Helper", "Builder", "Analyst"].map((arch) => (
                <span
                  key={arch}
                  className="px-3 py-1 rounded-full text-[11px]"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    background: "rgba(var(--ce-glass-tint), 0.04)",
                    color: "var(--ce-text-tertiary)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.04)",
                  }}
                >
                  {arch}
                </span>
              ))}
              <span
                className="px-3 py-1 rounded-full text-[11px]"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  color: "var(--ce-text-quaternary)",
                }}
              >
                +12 more
              </span>
            </div>
          </SophiaMessage>

          <SophiaMessage delay={0.5} showAvatar={false}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Then I build you a roadmap. Not a generic "learn to code" thing — a real plan
              with milestones, job matches, and a <StatPill value="87%" label="completion rate" /> because
              it's actually built around how you work.
            </p>
          </SophiaMessage>
        </div>

        {/* ─── Photo moment ─── */}
        <PhotoInsert
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
          alt="People collaborating on career growth"
          caption="Real people. Real roadmaps. Not stock photo energy."
          delay={0.1}
        />

        <ConvDivider text="Not just for you" />

        {/* ─── The Ecosystem ─── */}
        <div className="space-y-5 mb-16">
          <UserMessage delay={0}>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Wait — you mentioned you're not just for job seekers?
            </p>
          </UserMessage>

          <SophiaMessage delay={0.2}>
            <p
              className="text-[15px] leading-[1.75] mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Exactly. I work with six different types of people:
            </p>
            <div className="space-y-2.5">
              {[
                { role: "Seekers", desc: "Building roadmaps and finding matches", color: "var(--ce-cyan)" },
                { role: "Parents", desc: "Supporting without overstepping", color: "#EC4899" },
                { role: "Mentors", desc: "Growing their coaching practice", color: "#8B5CF6" },
                { role: "Institutions", desc: "Tracking student outcomes", color: "#3B82F6" },
                { role: "NGOs", desc: "Running career programs at scale", color: "#F97316" },
                { role: "Government", desc: "Funding workforce development", color: "#6366F1" },
              ].map((item) => (
                <div key={item.role} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
                  >
                    <strong style={{ fontWeight: 600 }}>{item.role}</strong>
                    <span style={{ color: "var(--ce-text-tertiary)" }}> — {item.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </SophiaMessage>

          <SophiaMessage delay={0.5} showAvatar={false}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Everyone's connected. Your mentor sees your progress. Your institution
              tracks outcomes. And I make sure everyone's on the same page — literally.
            </p>
          </SophiaMessage>
        </div>

        {/* ─── Photo moment 2 ─── */}
        <PhotoInsert
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
          alt="Professional woman with career confidence"
          caption="94% archetype match. Product Strategy Lead."
          delay={0.1}
        />

        <ConvDivider text="The tools" />

        {/* ─── The Tools ─── */}
        <div className="space-y-5 mb-16">
          <SophiaMessage delay={0}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Here's what you get when you come in:
            </p>
          </SophiaMessage>

          <SophiaMessage delay={0.3} showAvatar={false}>
            <div className="space-y-4">
              {[
                { name: "EdgePath", desc: "Career discovery. 15 questions → your archetype → matched careers with salary & demand data." },
                { name: "ResumeEdge", desc: "Resume builder with AI bullet enhancement. Not a template — intelligent formatting." },
                { name: "EdgeProd", desc: "SMART goals, Pomodoro focus, OKR tracking. Your productivity suite." },
                { name: "EdgeMatch", desc: "Job matching by archetype. Not keywords — actual compatibility." },
                { name: "ImmigrationEdge", desc: "For international seekers. Visa pathways, cost calculators, timeline mapping." },
              ].map((tool) => (
                <div key={tool.name}>
                  <div
                    className="text-[13px] font-semibold mb-0.5"
                    style={{ fontFamily: "'Urbanist', sans-serif", color: "var(--ce-lime)" }}
                  >
                    {tool.name}
                  </div>
                  <div
                    className="text-[13px] leading-[1.6]"
                    style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
                  >
                    {tool.desc}
                  </div>
                </div>
              ))}
            </div>
          </SophiaMessage>
        </div>

        <ConvDivider text="Proof" />

        {/* ─── Social Proof ─── */}
        <div className="space-y-5 mb-16">
          <UserMessage delay={0}>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              Does this actually work though?
            </p>
          </UserMessage>

          <SophiaMessage delay={0.2}>
            <p
              className="text-[15px] leading-[1.75] mb-3"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              I'm going to give you numbers, not testimonials:
            </p>
            <div className="flex flex-wrap gap-2">
              <StatPill value="10,247" label="roadmaps built" />
              <StatPill value="87%" label="goal completion" />
              <StatPill value="23" label="avg. job matches" />
              <StatPill value="$0" label="to start" />
            </div>
          </SophiaMessage>

          <SophiaMessage delay={0.5} showAvatar={false}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              The reason the completion rate is that high? Because everything is built
              around <em>your</em> archetype. A Visionary doesn't plan like an Analyst.
              I know the difference. That changes everything.
            </p>
          </SophiaMessage>
        </div>

        {/* ─── The Close ─── */}
        <div className="space-y-5 mb-12">
          <SophiaMessage delay={0}>
            <p
              className="text-[15px] leading-[1.75]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-primary)" }}
            >
              So — want to find out your archetype? 15 questions. Takes about 4 minutes.
              I'll build your roadmap while you watch.
            </p>
          </SophiaMessage>
        </div>

        {/* ─── CTA ─── */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <button
            onClick={() => onNavigate("signup")}
            className="px-8 py-4 rounded-full text-[15px] font-medium flex items-center gap-3 cursor-pointer transition-all duration-300 hover:gap-5 mx-auto"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              background: "var(--ce-lime)",
              color: "#08090C",
            }}
          >
            <MessageCircle size={16} />
            Talk to Sophia
            <ArrowRight size={16} />
          </button>
          <p
            className="mt-4 text-[12px]"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
          >
            Free. No credit card. Your data stays yours.
          </p>
        </motion.div>
      </div>

      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
