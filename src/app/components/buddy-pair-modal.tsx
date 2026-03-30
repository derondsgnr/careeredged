/**
 * BuddyPairModal — 5-stage pairing wizard for accountability partners
 *
 * Stages: intro → scanning → found → preferences → success
 * Follows child-link-modal.tsx blueprint exactly.
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  QrCode, X, Check, Users, Target, Calendar,
  Clock, Zap, ArrowRight,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;
const SPRING = { stiffness: 160, damping: 24 };

type PairStage = "intro" | "scanning" | "found" | "preferences" | "success";

const MOCK_BUDDY = {
  name: "Jordan Rivera",
  initial: "J",
  role: "UX Researcher",
  phase: "Phase 1 of 4",
  progress: 0.4,
  milestones: 5,
  streak: 7,
};

const FREQUENCY_OPTIONS = [
  { id: "daily", label: "Daily", sub: "Quick check-ins every day", icon: <Clock className="w-4 h-4" /> },
  { id: "weekly", label: "Weekly", sub: "Deep sync once a week", icon: <Calendar className="w-4 h-4" />, recommended: true },
  { id: "milestone", label: "Milestone-based", sub: "Check in when either hits a milestone", icon: <Target className="w-4 h-4" /> },
];

// ─── QR Scanner Frame (adapted from child-link-modal) ────────────────────

function QRScannerFrame({ scanning, roleColor, roleRgb }: { scanning: boolean; roleColor: string; roleRgb: string }) {
  return (
    <div className="relative w-48 h-48 mx-auto">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: "rgba(var(--ce-shadow-tint),0.6)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
      />
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-5 h-5`}
          style={{
            borderColor: scanning ? roleColor : "rgba(var(--ce-glass-tint),0.2)",
            borderStyle: "solid", borderWidth: 0,
            borderTopWidth: i < 2 ? 2 : 0, borderBottomWidth: i >= 2 ? 2 : 0,
            borderLeftWidth: i % 2 === 0 ? 2 : 0, borderRightWidth: i % 2 === 1 ? 2 : 0,
            borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
            transition: "border-color 0.4s ease",
          }}
        />
      ))}
      {scanning && (
        <motion.div
          className="absolute left-3 right-3 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${roleColor}, transparent)` }}
          initial={{ top: "10px" }}
          animate={{ top: ["10px", "170px", "10px"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      )}
      {!scanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className="w-14 h-14 text-[var(--ce-text-quaternary)]" />
        </div>
      )}
      {scanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div className="w-3 h-3 rounded-full" style={{ background: roleColor }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
      )}
    </div>
  );
}

// ─── Buddy Profile Card ──────────────────────────────────────────────────

function BuddyProfileCard({ roleColor, roleRgb }: { roleColor: string; roleRgb: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: `rgba(${roleRgb}, 0.04)`, border: `1px solid rgba(${roleRgb}, 0.12)` }}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[16px] font-medium flex-shrink-0"
          style={{ background: `rgba(${roleRgb}, 0.12)`, color: roleColor, fontFamily: "var(--font-display)" }}
        >
          {MOCK_BUDDY.initial}
        </div>
        <div className="flex-1">
          <div className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {MOCK_BUDDY.name}
          </div>
          <div className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
            {MOCK_BUDDY.phase} · {MOCK_BUDDY.role}
          </div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${roleColor}, var(--ce-lime))` }}
          initial={{ width: 0 }}
          animate={{ width: `${MOCK_BUDDY.progress * 100}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Milestones done", value: MOCK_BUDDY.milestones, color: roleColor },
          { label: "Day streak", value: MOCK_BUDDY.streak, color: "var(--ce-lime)" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-2 text-center" style={{ background: "rgba(var(--ce-glass-tint),0.025)" }}>
            <div className="text-[18px] mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────

interface BuddyPairModalProps {
  roleColor: string;
  roleRgb: string;
  onSuccess: (data: { name: string; frequency: string }) => void;
  onClose: () => void;
}

export function BuddyPairModal({ roleColor, roleRgb, onSuccess, onClose }: BuddyPairModalProps) {
  const [stage, setStage] = useState<PairStage>("intro");
  const [scanning, setScanning] = useState(false);
  const [frequency, setFrequency] = useState<string | null>(null);

  // Auto-trigger mock scan result
  useEffect(() => {
    if (stage === "scanning" && scanning) {
      const t = setTimeout(() => { setScanning(false); setStage("found"); }, 2400);
      return () => clearTimeout(t);
    }
  }, [stage, scanning]);

  // Auto-close after success
  useEffect(() => {
    if (stage === "success" && frequency) {
      const t = setTimeout(() => onSuccess({ name: MOCK_BUDDY.name, frequency }), 1800);
      return () => clearTimeout(t);
    }
  }, [stage, frequency, onSuccess]);

  const handleStartScan = () => {
    setStage("scanning");
    setTimeout(() => setScanning(true), 300);
  };

  const handleConfirm = () => setStage("preferences");

  const handleSelectFrequency = (id: string) => {
    setFrequency(id);
    setTimeout(() => setStage("success"), 350);
  };

  // Stage header
  const headers: Record<PairStage, { title: string; sub: string }> = {
    intro: { title: "Find an accountability buddy", sub: "Pair with someone on a parallel path" },
    scanning: { title: "Scanning...", sub: "Point your camera at their QR code" },
    found: { title: "Found a match", sub: "Is this who you want to pair with?" },
    preferences: { title: "Set your check-in rhythm", sub: "You can change this anytime" },
    success: { title: "You're paired!", sub: `You and ${MOCK_BUDDY.name} are accountability partners` },
  };

  const h = headers[stage];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(8,9,12,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ y: 32, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", ...SPRING }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(20,14,12,0.98), rgba(12,14,18,0.99))",
            border: `1px solid rgba(${roleRgb}, 0.08)`,
            boxShadow: `0 24px 64px rgba(var(--ce-shadow-tint),0.6), 0 0 80px rgba(${roleRgb}, 0.04)`,
          }}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <SophiaMark size={20} glow />
              <button onClick={onClose} className="p-1 rounded-lg cursor-pointer transition-colors" style={{ color: "var(--ce-text-tertiary)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[17px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {h.title}
            </div>
            <div className="text-[13px] text-ce-text-tertiary mt-1" style={{ fontFamily: "var(--font-body)" }}>
              {h.sub}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {stage === "intro" && (
              <div>
                <div className="space-y-3 mb-5">
                  {[
                    { icon: <QrCode className="w-4 h-4" />, text: "Exchange QR codes to connect instantly" },
                    { icon: <Users className="w-4 h-4" />, text: "Share milestones and track each other's progress" },
                    { icon: <Target className="w-4 h-4" />, text: "Stay accountable with regular check-ins" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${roleRgb}, 0.08)`, color: roleColor }}>
                        {item.icon}
                      </div>
                      <span className="text-[13px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleStartScan}
                  className="w-full py-3 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${roleColor}, var(--ce-cyan))`,
                    color: "var(--ce-void)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Scan a buddy's QR <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full mt-3 text-center text-[12px] text-ce-text-tertiary cursor-pointer"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  I'll do this later
                </button>
              </div>
            )}

            {stage === "scanning" && (
              <div>
                <QRScannerFrame scanning={scanning} roleColor={roleColor} roleRgb={roleRgb} />
                <p className="text-center text-[12px] text-ce-text-tertiary mt-3" style={{ fontFamily: "var(--font-body)" }}>
                  Looking for a QR code...
                </p>
              </div>
            )}

            {stage === "found" && (
              <div>
                <div className="flex items-center gap-2 mb-4 py-1.5 px-3 rounded-lg mx-auto w-fit" style={{ background: "rgba(var(--ce-lime-rgb), 0.08)" }}>
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--ce-lime)" }} />
                  <span className="text-[12px]" style={{ color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>QR code scanned successfully</span>
                </div>
                <BuddyProfileCard roleColor={roleColor} roleRgb={roleRgb} />
                <button
                  onClick={handleConfirm}
                  className="w-full mt-4 py-3 rounded-xl text-[13px] font-medium cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${roleColor}, var(--ce-cyan))`,
                    color: "var(--ce-void)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Pair with {MOCK_BUDDY.name} <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => { setStage("intro"); setScanning(false); }} className="w-full mt-2 text-center text-[12px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
                  Not the right person — scan again
                </button>
              </div>
            )}

            {stage === "preferences" && (
              <div>
                <p className="text-[13px] text-ce-text-secondary mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  How often do you want to check in with {MOCK_BUDDY.name}?
                </p>
                <div className="space-y-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectFrequency(opt.id)}
                      className="w-full p-3 rounded-xl text-left flex items-center gap-3 cursor-pointer transition-all duration-200"
                      style={{
                        background: frequency === opt.id ? `rgba(${roleRgb}, 0.08)` : "rgba(var(--ce-glass-tint), 0.03)",
                        border: `1px solid ${frequency === opt.id ? `rgba(${roleRgb}, 0.2)` : "rgba(var(--ce-glass-tint), 0.06)"}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `rgba(${roleRgb}, 0.06)`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = frequency === opt.id ? `rgba(${roleRgb}, 0.08)` : "rgba(var(--ce-glass-tint), 0.03)"; }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${roleRgb}, 0.08)`, color: roleColor }}>
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{opt.label}</span>
                          {opt.recommended && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-lime-rgb), 0.1)", color: "var(--ce-lime)", fontFamily: "var(--font-body)" }}>
                              Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{opt.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === "success" && (
              <div className="text-center py-4">
                <motion.div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `rgba(${roleRgb}, 0.12)` }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", ...SPRING }}
                >
                  <Check className="w-8 h-8" style={{ color: roleColor }} />
                </motion.div>
                <div className="text-[15px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Paired with {MOCK_BUDDY.name}
                </div>
                <div className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
                  {frequency === "daily" ? "Daily" : frequency === "weekly" ? "Weekly" : "Milestone-based"} check-ins start now
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
