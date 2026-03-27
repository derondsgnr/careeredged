/**
 * BuddyDashboardCard — Accountability partner card for dashboard right column
 *
 * States: empty (find a buddy) → paired (buddy info + check-in)
 * Mirrors child-link-modal patterns. Uses role accent colors.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, MessageSquare, Sparkles } from "lucide-react";
import { BuddyPairModal } from "./buddy-pair-modal";
import { queueMessage } from "./message-queue";
import { toast } from "sonner";
import { EASE } from "./tokens";

// ─── Buddy State Hook ─────────────────────────────────────────────────────

interface BuddyData {
  name: string;
  initial: string;
  phase: string;
  frequency: string;
  pairedAt: number;
}

export function useBuddyState() {
  const [buddy, setBuddy] = useState<BuddyData | null>(() => {
    try {
      const stored = localStorage.getItem("ce-buddy");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const pair = useCallback((data: BuddyData) => {
    setBuddy(data);
    try { localStorage.setItem("ce-buddy", JSON.stringify(data)); } catch {}
  }, []);

  const unpair = useCallback(() => {
    setBuddy(null);
    try { localStorage.removeItem("ce-buddy"); } catch {}
  }, []);

  return { buddy, pair, unpair } as const;
}

// ─── Dashboard Card ───────────────────────────────────────────────────────

interface BuddyDashboardCardProps {
  roleColor: string;
  roleRgb: string;
  onNavigate?: (surface: string) => void;
  onSophia?: (prompt: string) => void;
  delay?: number;
}

export function BuddyDashboardCard({
  roleColor,
  roleRgb,
  onNavigate,
  onSophia,
  delay = 0,
}: BuddyDashboardCardProps) {
  const { buddy, pair, unpair } = useBuddyState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  const handlePairSuccess = (data: { name: string; frequency: string }) => {
    pair({
      name: data.name,
      initial: data.name.charAt(0),
      phase: "Phase 1 of 4",
      frequency: data.frequency,
      pairedAt: Date.now(),
    });
    setModalOpen(false);
  };

  const daysPaired = buddy
    ? Math.max(1, Math.floor((Date.now() - buddy.pairedAt) / 86400000))
    : 0;

  return (
    <>
      <motion.div
        className="rounded-2xl p-4"
        style={{
          background: `rgba(${roleRgb}, 0.03)`,
          border: `1px solid rgba(${roleRgb}, 0.06)`,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3, ease: EASE }}
      >
        {!buddy ? (
          /* ─── Empty State ─── */
          <div className="text-center py-2">
            <div
              className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: `rgba(${roleRgb}, 0.08)` }}
            >
              <Users className="w-5 h-5" style={{ color: roleColor }} />
            </div>
            <div
              className="text-[13px] text-ce-text-primary mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Accountability Partner
            </div>
            <p
              className="text-[12px] text-ce-text-tertiary mb-4 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Pair with another EdgeStar on a similar path. Share progress, check in weekly, and keep each other on track.
            </p>
            <button
              onClick={() => { setOpenCount(c => c + 1); setModalOpen(true); }}
              className="w-full py-2 rounded-lg text-[12px] font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: `rgba(${roleRgb}, 0.08)`,
                color: roleColor,
                border: `1px solid rgba(${roleRgb}, 0.12)`,
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${roleRgb}, 0.14)`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(${roleRgb}, 0.08)`; }}
            >
              Find a buddy
            </button>
            <button
              onClick={() => onSophia?.("Help me find an accountability partner who matches my career goals")}
              className="mt-2 flex items-center gap-1.5 mx-auto text-[11px] text-ce-text-tertiary cursor-pointer"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Sparkles className="w-3 h-3" style={{ color: roleColor }} />
              Ask Sophia to match me
            </button>
          </div>
        ) : (
          /* ─── Paired State ─── */
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium"
                  style={{
                    background: `rgba(${roleRgb}, 0.12)`,
                    color: roleColor,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {buddy.initial}
                </div>
                <div>
                  <div
                    className="text-[13px] text-ce-text-primary"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    {buddy.name}
                  </div>
                  <div className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                    {buddy.phase}
                  </div>
                </div>
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-[10px]"
                style={{
                  background: `rgba(${roleRgb}, 0.06)`,
                  color: roleColor,
                  fontFamily: "var(--font-body)",
                }}
              >
                {daysPaired}d paired
              </div>
            </div>

            {/* Inline check-in chips — mirrors EdgeParent pattern */}
            <p className="text-[11px] text-ce-text-tertiary mb-2" style={{ fontFamily: "var(--font-body)" }}>
              Quick check-in
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["How's your week?", "Hit a milestone!", "Need accountability?"].map((msg) => (
                <button
                  key={msg}
                  onClick={() => {
                    queueMessage({
                      recipientId: `buddy-${buddy.name.toLowerCase().replace(/\s/g, "-")}`,
                      recipientName: buddy.name,
                      recipientInitial: buddy.initial,
                      content: msg,
                      senderRole: "edgestar",
                      threadType: "dm",
                    });
                    toast.success(`Sent to ${buddy.name.split(" ")[0]}: "${msg}"`, { duration: 2500 });
                  }}
                  className="text-[11px] text-ce-text-secondary px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: "rgba(var(--ce-glass-tint), 0.03)",
                    border: "1px solid rgba(var(--ce-glass-tint), 0.06)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${roleRgb}, 0.06)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(var(--ce-glass-tint), 0.03)"; }}
                >
                  {msg}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() => onNavigate?.("messages")}
                className="flex items-center gap-1.5 text-[11px] text-ce-text-tertiary cursor-pointer"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <MessageSquare className="w-3 h-3" />
                Open full conversation
              </button>
              <button
                onClick={unpair}
                className="text-[10px] text-ce-text-quaternary cursor-pointer hover:text-ce-text-tertiary transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Unpair
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Pairing Modal */}
      <AnimatePresence>
        {modalOpen && (
          <BuddyPairModal
            key={openCount}
            roleColor={roleColor}
            roleRgb={roleRgb}
            onSuccess={handlePairSuccess}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
