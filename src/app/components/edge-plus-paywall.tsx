/**
 * EdgePlusPaywall — Aspirational paywall modal for Professional EdgeGroups
 *
 * Unlike the punitive lock-icon pattern in the live product, this modal
 * shows a mini-preview of what the user would unlock: coach attribution,
 * sample benefits, and an aspirational CTA. Reused anywhere we need an
 * Edge Plus gate (EdgeGroups Professional cards, Subscribe action, etc.)
 *
 * Design rules:
 * - Never a cold dead-end; always show concrete value
 * - "Upgrade to Edge Plus" CTA feels like opening a door
 * - "Not Now" does NOT navigate away — user stays where they were
 * - Triggering it auto-enables Edge Plus after "upgrade" in our mock
 *   (wired via useEdgePlus) so demos flow through the gate
 */

import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Check, Crown } from "lucide-react";
import { EASE } from "./tokens";
import { SophiaMark } from "./sophia-mark";
import { useEdgePlus } from "./use-edge-plus";
import { toast } from "./ui/feedback";

export interface EdgePlusPaywallProps {
  open: boolean;
  onClose: () => void;
  /** Optional: the group/feature that triggered the paywall — renders a preview */
  preview?: {
    groupName?: string;
    coachName?: string;
    coachExpertise?: string;
    benefits?: string[];
  };
}

const DEFAULT_BENEFITS = [
  "Coach-led weekly group calls",
  "1:1 mentorship sessions",
  "Exclusive job listings & intros",
  "Priority coaching slots",
  "Premium learning resources",
];

export function EdgePlusPaywall({ open, onClose, preview }: EdgePlusPaywallProps) {
  const [, setEdgePlus] = useEdgePlus();
  const benefits = preview?.benefits && preview.benefits.length > 0 ? preview.benefits : DEFAULT_BENEFITS;

  const handleUpgrade = () => {
    // Demo: flip the subscription on instantly so the gated surface unlocks
    setEdgePlus(true);
    toast.success("Welcome to Edge Plus — all Professional groups unlocked");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={onClose}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          />
          <motion.div
            className="relative w-full max-w-[440px] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(14,16,20,0.98)",
              border: "1px solid rgba(var(--ce-cyan-rgb),0.18)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(var(--ce-cyan-rgb),0.12)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow header */}
            <div
              className="relative p-6 pb-5"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(var(--ce-cyan-rgb),0.14), transparent 70%)",
              }}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-white/[0.06]"
              >
                <X className="w-3.5 h-3.5 text-[var(--ce-text-tertiary)]" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(var(--ce-cyan-rgb),0.12)" }}
                >
                  <Crown className="w-3.5 h-3.5" style={{ color: "var(--ce-cyan)" }} />
                </div>
                <span
                  className="text-[10px] tracking-[0.14em] uppercase"
                  style={{ color: "var(--ce-cyan)", fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  Edge Plus
                </span>
              </div>

              <h2
                className="text-[20px] leading-tight text-[var(--ce-text-primary)] mb-1"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {preview?.groupName
                  ? `Unlock ${preview.groupName}`
                  : "Unlock Professional EdgeGroups"}
              </h2>
              <p
                className="text-[12px] leading-relaxed text-[var(--ce-text-tertiary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {preview?.coachName
                  ? `Join ${preview.coachName} and coach-led communities for exclusive jobs, resources, and 1:1 guidance.`
                  : "Coach-led communities with exclusive jobs, resources, and 1:1 guidance from verified experts."}
              </p>
            </div>

            {/* Benefits preview */}
            <div className="px-6 pb-5">
              <div className="flex items-center gap-2 mb-3">
                <SophiaMark size={12} glowing={false} />
                <span
                  className="text-[10px] text-[var(--ce-text-quaternary)] uppercase tracking-[0.08em]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  You'll unlock
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {benefits.slice(0, 5).map((benefit, i) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04, ease: EASE }}
                    className="flex items-start gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(var(--ce-cyan-rgb),0.12)" }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: "var(--ce-cyan)" }} />
                    </div>
                    <span
                      className="text-[12px] text-[var(--ce-text-secondary)] leading-snug"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div
              className="px-6 pb-6 pt-2 flex flex-col gap-2"
              style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
            >
              <button
                onClick={handleUpgrade}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(var(--ce-cyan-rgb),0.95), rgba(var(--ce-cyan-rgb),0.75))",
                  boxShadow: "0 6px 24px rgba(var(--ce-cyan-rgb),0.25)",
                  color: "#08090C",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Upgrade to Edge Plus
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.03] text-[12px] text-[var(--ce-text-tertiary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
