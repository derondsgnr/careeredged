/**
 * ChildLinkModal — Parent-Child QR Linking Flow
 *
 * Stages: intro → scanning → found → involvement → success
 * Mock QR scan — consistent with events-surface.tsx pattern.
 * Accent: var(--ce-role-parent) (parent pink)
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import {
  QrCode, X, Check, Zap, Heart, Eye,
  User, Sparkles, ArrowRight, GraduationCap,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;
const SPRING = { stiffness: 160, damping: 24 };

type LinkStage = "intro" | "scanning" | "found" | "involvement" | "success";

interface InvolvementLevel {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
}

const INVOLVEMENT_LEVELS: InvolvementLevel[] = [
  {
    id: "very_active",
    label: "Very Active",
    sub: "Daily updates on every milestone",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "active",
    label: "Active",
    sub: "Weekly summaries, key milestones",
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: "observer",
    label: "Observer",
    sub: "Major events only, occasional check-ins",
    icon: <Eye className="w-4 h-4" />,
  },
];

const MOCK_CHILD = {
  name: "Alex Chen",
  initial: "A",
  goal: "Product Designer",
  school: "UCLA",
  phase: "Phase 2 of 4",
  progress: 0.6,
  milestones: 8,
  streak: 14,
};

// ─── QR Scanner Animation ─────────────────────────────────────────────────

function QRScannerFrame({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative w-52 h-52 mx-auto">
      {/* Camera frame */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "rgba(var(--ce-shadow-tint),0.6)",
          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
        }}
      />

      {/* Corner markers */}
      {[
        "top-2 left-2",
        "top-2 right-2",
        "bottom-2 left-2",
        "bottom-2 right-2",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-6 h-6`}
          style={{
            borderColor: scanning ? "var(--ce-role-parent)" : "rgba(var(--ce-glass-tint),0.2)",
            borderStyle: "solid",
            borderWidth: 0,
            borderTopWidth: i < 2 ? 2 : 0,
            borderBottomWidth: i >= 2 ? 2 : 0,
            borderLeftWidth: i % 2 === 0 ? 2 : 0,
            borderRightWidth: i % 2 === 1 ? 2 : 0,
            borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
            transition: "border-color 0.4s ease",
          }}
        />
      ))}

      {/* Scan line */}
      {scanning && (
        <motion.div
          className="absolute left-3 right-3 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--ce-role-parent), transparent)" }}
          initial={{ top: "12px" }}
          animate={{ top: ["12px", "188px", "12px"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Pulse rings when scanning */}
      {scanning && (
        <>
          {[0, 0.4, 0.8].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl"
              style={{ border: "1px solid rgba(var(--ce-role-parent-rgb),0.3)" }}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 0.6, 0], scale: [1, 1.06, 1.06] }}
              transition={{ duration: 1.5, delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </>
      )}

      {/* Center QR icon (idle) */}
      {!scanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <QrCode className="w-16 h-16 text-[var(--ce-text-quaternary)]" />
        </div>
      )}

      {/* Scanning label */}
      {scanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-[var(--ce-role-parent)]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Child Profile Card ────────────────────────────────────────────────────

function ChildProfileCard() {
  return (
    <motion.div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(var(--ce-role-parent-rgb),0.04)",
        border: "1px solid rgba(var(--ce-role-parent-rgb),0.12)",
      }}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", ...SPRING }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[16px] font-medium flex-shrink-0"
          style={{
            background: "rgba(var(--ce-role-parent-rgb),0.12)",
            color: "var(--ce-role-parent)",
            fontFamily: "var(--font-display)",
          }}
        >
          {MOCK_CHILD.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[14px] text-ce-text-primary mb-0.5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {MOCK_CHILD.name}
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3 h-3 text-ce-text-tertiary" />
            <span
              className="text-[12px] text-ce-text-tertiary"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {MOCK_CHILD.school}
            </span>
          </div>
        </div>
        <div
          className="px-2 py-1 rounded-full text-[10px]"
          style={{
            background: "rgba(var(--ce-role-edgestar-rgb),0.08)",
            border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.12)",
            color: "var(--ce-role-edgestar)",
            fontFamily: "var(--font-body)",
          }}
        >
          {MOCK_CHILD.goal}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[11px] text-ce-text-tertiary"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {MOCK_CHILD.phase}
          </span>
          <span
            className="text-[11px] text-[var(--ce-role-parent)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {Math.round(MOCK_CHILD.progress * 100)}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--ce-role-parent), var(--ce-role-edgestar))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${MOCK_CHILD.progress * 100}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Milestones done", value: MOCK_CHILD.milestones, color: "var(--ce-role-edgestar)" },
          { label: "Day streak", value: MOCK_CHILD.streak, color: "var(--ce-lime)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-2.5 text-center"
            style={{ background: "rgba(var(--ce-glass-tint),0.025)" }}
          >
            <div
              className="text-[18px] mb-0.5"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div
              className="text-[10px] text-ce-text-tertiary"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────

interface ChildLinkModalProps {
  onSuccess: (involvement: string) => void;
  onClose: () => void;
}

export function ChildLinkModal({ onSuccess, onClose }: ChildLinkModalProps) {
  const [stage, setStage] = useState<LinkStage>("intro");
  const [scanning, setScanning] = useState(false);
  const [involvement, setInvolvement] = useState<string | null>(null);

  // Auto-trigger mock scan result after 2.4s
  useEffect(() => {
    if (stage === "scanning" && scanning) {
      const t = setTimeout(() => {
        setScanning(false);
        setStage("found");
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [stage, scanning]);

  // Auto-close after success
  useEffect(() => {
    if (stage === "success") {
      const t = setTimeout(() => {
        if (involvement) onSuccess(involvement);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [stage, involvement, onSuccess]);

  const handleStartScan = () => {
    setStage("scanning");
    setTimeout(() => setScanning(true), 300);
  };

  const handleConfirmChild = () => {
    setStage("involvement");
  };

  const handleSelectInvolvement = (id: string) => {
    setInvolvement(id);
    setTimeout(() => setStage("success"), 350);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(8,9,12,0.75)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
          className="rounded-2xl p-px"
          style={{
            background:
              "linear-gradient(135deg, rgba(var(--ce-role-parent-rgb),0.2), rgba(var(--ce-role-edgestar-rgb),0.08), rgba(var(--ce-role-parent-rgb),0.06))",
          }}
        >
          <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background:
                "linear-gradient(160deg, rgba(20,10,16,0.98) 0%, rgba(12,14,19,0.99) 60%)",
              boxShadow:
                "0 8px 60px rgba(var(--ce-shadow-tint),0.7), inset 0 1px 1px rgba(var(--ce-glass-tint),0.04)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SophiaMark size={28} glowing />
                <div>
                  <div
                    className="text-[14px] text-ce-text-primary"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    {stage === "success"
                      ? "You're connected."
                      : stage === "involvement"
                      ? "Set your involvement"
                      : stage === "found"
                      ? "Found a match"
                      : "Connect a child"}
                  </div>
                  <div
                    className="text-[12px] text-ce-text-tertiary"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {stage === "success"
                      ? "Alex's progress is now visible to you"
                      : stage === "involvement"
                      ? "You can change this anytime"
                      : stage === "found"
                      ? "Is this your child's account?"
                      : "Scan your child's CareerEdge QR code"}
                  </div>
                </div>
              </div>
              {stage !== "success" && (
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors"
                  style={{ color: "var(--ce-text-tertiary)" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {/* ── Intro ── */}
              {stage === "intro" && (
                <motion.div
                  key="intro"
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -8, transition: { duration: 0.2 } }}
                >
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(var(--ce-glass-tint),0.02)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.04)",
                    }}
                  >
                    {[
                      {
                        icon: <QrCode className="w-4 h-4" />,
                        text: "Ask your child to open CareerEdge and share their QR code",
                      },
                      {
                        icon: <User className="w-4 h-4" />,
                        text: "You'll see their roadmap, milestones, and progress in read-only mode",
                      },
                      {
                        icon: <Heart className="w-4 h-4" />,
                        text: "Send encouragement notes directly on their milestones",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 py-2.5"
                        style={{
                          borderBottom:
                            i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none",
                        }}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "rgba(var(--ce-role-parent-rgb),0.08)",
                            color: "var(--ce-role-parent)",
                          }}
                        >
                          {item.icon}
                        </div>
                        <span
                          className="text-[12px] text-ce-text-secondary leading-relaxed"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={handleStartScan}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, var(--ce-role-parent), var(--ce-role-guide))",
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      color: "#fff",
                      fontSize: "13px",
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, ease: EASE }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <QrCode className="w-4 h-4" /> Scan QR code{" "}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="text-[12px] text-[var(--ce-text-quaternary)] hover:text-ce-text-tertiary transition-colors cursor-pointer text-center"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Link later from my dashboard
                  </button>
                </motion.div>
              )}

              {/* ── Scanning ── */}
              {stage === "scanning" && (
                <motion.div
                  key="scanning"
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <QRScannerFrame scanning={scanning} />
                  <div className="text-center">
                    <motion.p
                      className="text-[13px] text-ce-text-secondary"
                      style={{ fontFamily: "var(--font-body)" }}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {scanning ? "Scanning…" : "Preparing scanner…"}
                    </motion.p>
                    <p
                      className="text-[11px] text-ce-text-tertiary mt-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Point at your child's QR code
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Found ── */}
              {stage === "found" && (
                <motion.div
                  key="found"
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -8, transition: { duration: 0.2 } }}
                >
                  {/* Scan success flash */}
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2 rounded-xl"
                    style={{ background: "rgba(var(--ce-lime-rgb),0.06)", border: "1px solid rgba(var(--ce-lime-rgb),0.1)" }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    >
                      <Check className="w-3.5 h-3.5 text-ce-lime" />
                    </motion.div>
                    <span
                      className="text-[12px] text-ce-lime"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      QR code scanned successfully
                    </span>
                  </motion.div>

                  <ChildProfileCard />

                  <motion.button
                    onClick={handleConfirmChild}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, var(--ce-role-parent), var(--ce-role-guide))",
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      color: "#fff",
                      fontSize: "13px",
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, ease: EASE }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Yes, this is Alex <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <button
                    onClick={() => setStage("scanning")}
                    className="text-[12px] text-[var(--ce-text-quaternary)] hover:text-ce-text-tertiary transition-colors cursor-pointer text-center"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Not my child — scan again
                  </button>
                </motion.div>
              )}

              {/* ── Involvement ── */}
              {stage === "involvement" && (
                <motion.div
                  key="involvement"
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -8, transition: { duration: 0.2 } }}
                >
                  <p
                    className="text-[12px] text-ce-text-tertiary leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    How closely do you want to follow Alex's career journey?
                  </p>

                  {INVOLVEMENT_LEVELS.map((lvl, i) => (
                    <motion.button
                      key={lvl.id}
                      onClick={() => handleSelectInvolvement(lvl.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer border transition-all text-left ${
                        involvement === lvl.id
                          ? "bg-[rgba(var(--ce-role-parent-rgb),0.08)] border-[rgba(var(--ce-role-parent-rgb),0.2)]"
                          : "bg-[rgba(var(--ce-glass-tint),0.025)] border-[rgba(var(--ce-glass-tint),0.06)] hover:bg-[rgba(var(--ce-glass-tint),0.04)] hover:border-[rgba(var(--ce-glass-tint),0.1)]"
                      }`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          involvement === lvl.id
                            ? "bg-[rgba(var(--ce-role-parent-rgb),0.12)] text-[var(--ce-role-parent)]"
                            : "bg-[rgba(var(--ce-glass-tint),0.04)] text-ce-text-tertiary"
                        }`}
                      >
                        {lvl.icon}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-[13px] ${involvement === lvl.id ? "text-ce-text-primary" : "text-ce-text-secondary"}`}
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          {lvl.label}
                        </div>
                        <div
                          className="text-[11px] text-ce-text-tertiary mt-0.5"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {lvl.sub}
                        </div>
                      </div>
                      {involvement === lvl.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="w-4 h-4 rounded-full bg-[var(--ce-role-parent)] flex items-center justify-center flex-shrink-0"
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* ── Success ── */}
              {stage === "success" && (
                <motion.div
                  key="success"
                  className="flex flex-col items-center gap-5 py-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Success ring */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "2px solid rgba(var(--ce-role-parent-rgb),0.3)" }}
                      animate={{ scale: [1, 1.4, 1.4], opacity: [1, 0, 0] }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(var(--ce-role-parent-rgb),0.1)" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-7 h-7 text-[var(--ce-role-parent)]" />
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="text-[15px] text-ce-text-primary mb-1"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      You're connected to Alex
                    </motion.div>
                    <motion.p
                      className="text-[12px] text-ce-text-tertiary"
                      style={{ fontFamily: "var(--font-body)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      {involvement === "very_active"
                        ? "You'll get daily updates on every milestone."
                        : involvement === "active"
                        ? "You'll get weekly summaries on key milestones."
                        : "You'll be notified for major events only."}
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--ce-role-parent)]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
