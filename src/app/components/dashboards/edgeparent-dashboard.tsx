/**
 * EdgeParent Dashboard
 * Supportive monitoring of child's career progress. Warm, not surveillance.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard, type NavigateFn } from "../role-shell";
import { ChildLinkModal } from "../child-link-modal";
import {
  Heart, Compass, Check, ChevronRight, BookOpen,
  Target, Calendar, TrendingUp, Star, MessageSquare,
  QrCode, ArrowRight, Sparkles,
} from "lucide-react";
import { EASE } from "../tokens";
import { KPIRow, PhaseBar } from "../kpi-patterns";
import { SophiaInsight } from "../sophia-patterns";
import { queueMessage } from "../message-queue";
import { toast } from "sonner";

const KPIS = [
  { label: "Roadmap Progress", value: "63%", trend: "+12% this month", icon: <Compass className="w-4 h-4" />, color: "var(--ce-role-parent)", gauge: 0.63 },
  { label: "Tasks Completed", value: "8", trend: "3 this week", icon: <Check className="w-4 h-4" />, color: "var(--ce-role-parent)", gauge: null },
  { label: "Next Session", value: "Fri", trend: "with Alice Chen", icon: <Calendar className="w-4 h-4" />, color: "var(--ce-role-parent)", gauge: null },
];

const PHASES = [
  { id: 1, title: "Discover & Position", status: "done" as const, progress: 1 },
  { id: 2, title: "Build & Apply", status: "active" as const, progress: 0.6 },
  { id: 3, title: "Interview & Close", status: "upcoming" as const, progress: 0 },
  { id: 4, title: "Transition & Grow", status: "upcoming" as const, progress: 0 },
];

const MILESTONES_COMPLETED = [
  { label: "Resume audit completed", date: "Mar 2", icon: <Check className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
  { label: "Portfolio review finished", date: "Mar 5", icon: <Check className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
  { label: "Target companies identified", date: "Mar 8", icon: <Check className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
  { label: "LinkedIn profile optimized", date: "Mar 12", icon: <Star className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
  { label: "First 3 applications sent", date: "Mar 15", icon: <TrendingUp className="w-3 h-3" />, color: "var(--ce-text-tertiary)" },
];

export function EdgeParentDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  const [childLinked, setChildLinked] = useState(() => {
    return localStorage.getItem("careerEdgeChildLinked") === "true";
  });
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Persist child-linked state
  const handleChildLinked = (involvement: string) => {
    setChildLinked(true);
    localStorage.setItem("careerEdgeChildLinked", "true");
    setShowLinkModal(false);
  };

  return (
    <RoleShell role="parent" userName="David" userInitial="D" edgeGas={20} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good afternoon, David
        </h1>
        <p className="text-[13px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
          {childLinked ? "Alex is making steady progress — Phase 2 is 60% complete" : "Link a child account to start tracking their progress"}
        </p>
      </motion.div>

      {/* Link CTA — shown when no child linked */}
      <AnimatePresence>
        {!childLinked && (
          <motion.div
            key="link-cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
            className="mb-5"
          >
            <div
              className="rounded-2xl p-px"
              style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-parent-rgb),0.25), rgba(var(--ce-role-guide-rgb),0.1), rgba(var(--ce-role-parent-rgb),0.06))" }}
            >
              <div
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--ce-surface-bg) 96%, var(--ce-role-parent) 4%) 0%, var(--ce-surface-modal-bg) 60%)`,
                  boxShadow: "inset 0 1px 1px rgba(var(--ce-glass-tint),0.04)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)" }}
                >
                  <QrCode className="w-5 h-5 text-[var(--ce-role-parent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-[var(--ce-text-primary)] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    Connect your child's account
                  </div>
                  <p className="text-[12px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                    Scan their QR code to see their roadmap, milestones, and progress in real time.
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowLinkModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer flex-shrink-0 text-[13px]"
                  style={{
                    background: "linear-gradient(135deg, var(--ce-role-parent), var(--ce-role-guide))",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Link now <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs — only shown when child linked */}
      {childLinked && <div className="mb-5"><KPIRow kpis={KPIS} /></div>}

      {/* Child's roadmap (read-only) — only when linked */}
      {childLinked && <GlassCard delay={0.45} className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[var(--ce-role-parent)]" />
            <span className="text-[14px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Alex's Career Roadmap</span>
            <span className="text-[10px] text-[var(--ce-text-tertiary)] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>Product Design</span>
          </div>
          <button onClick={() => onNavigate?.("family")} className="flex items-center gap-1 text-[12px] text-[var(--ce-text-tertiary)] hover:text-[var(--ce-text-secondary)] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
            View details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <PhaseBar phases={PHASES} accent="var(--ce-role-parent)" delay={0.5} />
      </GlassCard>}

      {/* Single wider layout — parent doesn't need dense two-column */}
      {childLinked && <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Weekly progress */}
          <GlassCard delay={0.5}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[var(--ce-role-parent)]" />
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Recent Milestones</span>
            </div>
            <p className="text-[12px] text-[var(--ce-text-tertiary)] mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Here's what Alex has accomplished recently
            </p>
            {MILESTONES_COMPLETED.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < MILESTONES_COMPLETED.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <span className="text-[12px] text-[var(--ce-text-secondary)] flex-1 min-w-0" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
              </div>
            ))}
          </GlassCard>

          {/* Upcoming */}
          <GlassCard delay={0.55}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[var(--ce-role-guide)]" />
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Coming Up</span>
            </div>
            {[
              { text: "Mentor session with Alice Chen", date: "Friday, 2 PM", color: "var(--ce-role-parent)" },
              { text: "Networking outreach milestone due", date: "Monday", color: "var(--ce-text-tertiary)" },
              { text: "First application batch target", date: "Next Wednesday", color: "var(--ce-text-tertiary)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-[12px] text-[var(--ce-text-secondary)] flex-1" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{item.date}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          <SophiaInsight
            message="Alex is building momentum — 5 milestones completed in 2 weeks. Their mentor Alice says the portfolio is coming together well. The next big step is sending out applications."
            actionLabel="View Alex's roadmap"
            onAction={() => onNavigate?.("family")}
            delay={0.6}
          />
          {/* Quick message */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-[var(--ce-role-parent)]" />
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Message Alex</span>
            </div>
            <p className="text-[12px] text-[var(--ce-text-tertiary)] mb-3" style={{ fontFamily: "var(--font-body)" }}>
              Send encouragement or check in
            </p>
            <div className="flex gap-2">
              {["Great progress!", "How's it going?", "Need anything?"].map((msg) => (
                <button key={msg} onClick={() => {
                  queueMessage({
                    recipientId: "child-alex",
                    recipientName: "Alex Chen",
                    recipientInitial: "A",
                    content: msg,
                    senderRole: "parent",
                    threadType: "dm",
                  });
                  toast.success(`Sent to Alex: "${msg}"`, { duration: 2500 });
                }} className="text-[11px] text-[var(--ce-text-secondary)] px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }}>
                  {msg}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>}
      </div>

      {/* Child link modal */}
      <AnimatePresence>
        {showLinkModal && (
          <ChildLinkModal
            onSuccess={handleChildLinked}
            onClose={() => setShowLinkModal(false)}
          />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}