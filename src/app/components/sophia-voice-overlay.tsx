/**
 * Sophia Voice Overlay — Layer 6
 *
 * A dedicated, beautiful voice-first interaction surface.
 * Triggered by the mic button in the bottom bar.
 *
 * Design:
 *   - Full-screen frosted glass bloom, not a modal frame
 *   - Large SophiaMark at center — the face of Sophia when listening
 *   - Animated waveform behind the mark during speech
 *   - Transcript rail below — shows what Sophia heard, letter by letter
 *   - Four states: idle → listening → processing → speaking
 *   - On completion: cross-dissolve to Sophia panel with pre-loaded query
 *   - Single-gesture exit: tap anywhere outside the mark, or press Escape
 *
 * The voice UX spec from /docs/sophia-interaction-ux-spec.md:
 *   - "Camp B: AI is a layer within the product"
 *   - Voice should feel like a natural escalation of the bottom bar mic,
 *     not a separate product
 *   - Complete → dismiss pattern: when done, Sophia recedes
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { X, Mic, ChevronRight } from "lucide-react";
import { EASE } from "./tokens";

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "complete";

// Demo transcript phrases — shown character by character in listening state
const DEMO_TRANSCRIPTS = [
  "What should I focus on today?",
  "Show me my job matches",
  "Review my resume",
  "Help me prep for my Figma interview",
  "What skills am I missing?",
  "How's my progress looking?",
];

// Sophia response previews for each transcript
const SOPHIA_RESPONSES: Record<string, string> = {
  "What should I focus on today?":         "Your top priority is LinkedIn optimization — 5 recruiters at target companies are active this week.",
  "Show me my job matches":                 "3 new matches since yesterday. Figma Product Designer at 92% is your strongest fit.",
  "Review my resume":                       "Your resume scores 72 ATS. Biggest gap: impact quantification. I have 3 specific fixes.",
  "Help me prep for my Figma interview":    "Figma has 4 interview rounds. Your weakest point is the design challenge — let me build a practice plan.",
  "What skills am I missing?":              "Design Systems is your highest-leverage gap — it appears in 4 of 5 target JDs.",
  "How's my progress looking?":             "You're ahead of schedule — 60% through Phase 1, above the 45% average for this stage.",
};

// Waveform bars — deterministic heights based on golden angle
const WAVEFORM_BARS = Array.from({ length: 28 }, (_, i) => {
  const phase = (i * 137.5) % 360;
  return {
    peak: 12 + Math.abs(Math.sin((phase * Math.PI) / 180)) * 32,
    delay: i * 0.035,
    duration: 0.35 + (i % 5) * 0.06,
  };
});

interface SophiaVoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user has spoken and Sophia has a response — opens the full panel */
  onOpenPanel: (message: string) => void;
}

export function SophiaVoiceOverlay({ isOpen, onClose, onOpenPanel }: SophiaVoiceOverlayProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [sophiaReply, setSophiaReply] = useState("");
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [replyCharIndex, setReplyCharIndex] = useState(0);
  const transcriptRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const replyRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef<VoiceState>("idle");

  stateRef.current = voiceState;

  const reset = useCallback(() => {
    setVoiceState("idle");
    setTranscript("");
    setSophiaReply("");
    setCharIndex(0);
    setReplyCharIndex(0);
    if (transcriptRef.current) clearInterval(transcriptRef.current);
    if (replyRef.current) clearInterval(replyRef.current);
  }, []);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(reset, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, reset]);

  // Start listening automatically when opened
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => startListening(), 600);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const startListening = useCallback(() => {
    setVoiceState("listening");
    setTranscript("");
    setCharIndex(0);

    const phrase = DEMO_TRANSCRIPTS[selectedDemo % DEMO_TRANSCRIPTS.length];

    // Delay before transcript starts appearing
    const startDelay = setTimeout(() => {
      let i = 0;
      transcriptRef.current = setInterval(() => {
        if (stateRef.current !== "listening") {
          clearInterval(transcriptRef.current!);
          return;
        }
        i++;
        setCharIndex(i);
        setTranscript(phrase.slice(0, i));
        if (i >= phrase.length) {
          clearInterval(transcriptRef.current!);
          // Move to processing after transcript is complete
          setTimeout(() => {
            setVoiceState("processing");
            setTimeout(() => startSpeaking(phrase), 1200);
          }, 400);
        }
      }, 48);
    }, 800);

    return () => {
      clearTimeout(startDelay);
      if (transcriptRef.current) clearInterval(transcriptRef.current);
    };
  }, [selectedDemo]);

  const startSpeaking = (phrase: string) => {
    const reply = SOPHIA_RESPONSES[phrase] ?? "Let me look into that for you.";
    setSophiaReply("");
    setReplyCharIndex(0);
    setVoiceState("speaking");

    let i = 0;
    replyRef.current = setInterval(() => {
      i++;
      setReplyCharIndex(i);
      setSophiaReply(reply.slice(0, i));
      if (i >= reply.length) {
        clearInterval(replyRef.current!);
        setVoiceState("complete");
      }
    }, 22);
  };

  const handleTryAnother = () => {
    setSelectedDemo((d) => (d + 1) % DEMO_TRANSCRIPTS.length);
    reset();
    setTimeout(() => startListening(), 300);
  };

  const handleOpenFull = () => {
    const phrase = DEMO_TRANSCRIPTS[selectedDemo % DEMO_TRANSCRIPTS.length];
    onOpenPanel(phrase);
    onClose();
  };

  const handleBackground = () => {
    if (voiceState === "complete") {
      onClose();
    } else if (voiceState === "listening" || voiceState === "idle") {
      onClose();
    }
    // Don't close during processing/speaking
  };

  // State-based colors
  const markColor = voiceState === "listening"
    ? "var(--ce-role-edgestar)"
    : voiceState === "processing"
    ? "var(--ce-role-edgepreneur)"
    : voiceState === "speaking"
    ? "var(--ce-lime)"
    : voiceState === "complete"
    ? "var(--ce-role-edgestar)"
    : "var(--ce-role-edgestar)";

  const stateLabel = {
    idle:       "Tap to speak",
    listening:  "Listening…",
    processing: "Thinking…",
    speaking:   "Speaking",
    complete:   "Done",
  }[voiceState];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background bloom */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "var(--ce-surface-bg)", backdropFilter: "blur(24px)" }}
            onClick={handleBackground}
          />

          {/* Radial glow behind mark */}
          <motion.div
            className="absolute"
            style={{
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${markColor}12 0%, transparent 70%)`,
            }}
            animate={{
              scale: voiceState === "listening" ? [1, 1.2, 1] : voiceState === "speaking" ? [1, 1.3, 1] : 1,
              opacity: voiceState === "idle" ? 0.5 : 1,
            }}
            transition={{ duration: 2.5, repeat: voiceState === "listening" || voiceState === "speaking" ? Infinity : 0, ease: "easeInOut" }}
          />

          {/* Waveform — only during listening and speaking */}
          <div className="absolute flex items-center justify-center gap-0.5" style={{ width: 280, height: 80 }}>
            <AnimatePresence>
              {(voiceState === "listening" || voiceState === "speaking") && (
                <>
                  {WAVEFORM_BARS.map((bar, i) => (
                    <motion.div
                      key={i}
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: 3,
                        background: voiceState === "listening" ? "rgba(var(--ce-role-edgestar-rgb),0.35)" : "rgba(var(--ce-lime-rgb),0.35)",
                      }}
                      initial={{ height: 4, opacity: 0 }}
                      animate={{
                        height: [4, bar.peak, 4],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      exit={{ height: 4, opacity: 0 }}
                      transition={{
                        duration: bar.duration,
                        repeat: Infinity,
                        delay: bar.delay,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Main content — stacked vertically */}
          <div className="relative z-10 flex flex-col items-center gap-6" style={{ pointerEvents: "none" }}>
            {/* SophiaMark */}
            <motion.div
              animate={{
                scale: voiceState === "listening" ? [1, 1.06, 1] : voiceState === "processing" ? [1, 0.96, 1] : 1,
              }}
              transition={{
                duration: voiceState === "listening" ? 1.8 : 0.8,
                repeat: voiceState === "listening" || voiceState === "processing" ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{ pointerEvents: "none" }}
            >
              <SophiaMark size={80} glowing={voiceState !== "idle"} />
            </motion.div>

            {/* State label */}
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: 1 }}
              key={voiceState}
              initial={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              {voiceState === "listening" && (
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--ce-role-edgestar)" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
              <span
                className="text-[13px]"
                style={{ color: markColor, fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                {stateLabel}
              </span>
            </motion.div>

            {/* Transcript */}
            <AnimatePresence>
              {transcript && (
                <motion.div
                  className="text-center max-w-[400px] px-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <span
                    className="text-[18px] text-[var(--ce-text-primary)]"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500, lineHeight: 1.4 }}
                  >
                    &ldquo;{transcript}
                    {voiceState === "listening" && (
                      <motion.span
                        className="inline-block w-0.5 h-5 rounded-full ml-0.5 -mb-0.5"
                        style={{ background: "var(--ce-role-edgestar)" }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                    {voiceState !== "listening" && <>&rdquo;</>}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sophia reply */}
            <AnimatePresence>
              {(voiceState === "speaking" || voiceState === "complete") && sophiaReply && (
                <motion.div
                  className="max-w-[380px] px-6 text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <SophiaMark size={12} glowing={false} />
                    <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                      Sophia
                    </span>
                  </div>
                  <p
                    className="text-[14px] text-[var(--ce-text-tertiary)] leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {sophiaReply}
                    {voiceState === "speaking" && (
                      <motion.span
                        className="inline-block w-0.5 h-3.5 rounded-full ml-0.5 -mb-0.5"
                        style={{ background: "var(--ce-lime)" }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions — only in complete state */}
            <AnimatePresence>
              {voiceState === "complete" && (
                <motion.div
                  className="flex items-center gap-3"
                  style={{ pointerEvents: "auto" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <button
                    onClick={handleTryAnother}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors"
                    style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.08)", color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Try again
                  </button>
                  <button
                    onClick={handleOpenFull}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.97]"
                    style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.1)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.2)", color: "var(--ce-role-edgestar)", fontFamily: "var(--font-display)", fontWeight: 500 }}
                  >
                    Open full response
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dismiss button — top right */}
          <motion.button
            className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors"
            style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <X className="w-4 h-4 text-[var(--ce-text-secondary)]" />
          </motion.button>

          {/* Hint text — bottom */}
          <motion.p
            className="absolute bottom-24 text-[11px] text-[var(--ce-text-quaternary)] text-center"
            style={{ fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: voiceState === "idle" || voiceState === "listening" ? 0.7 : 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            {voiceState === "idle" ? "Tap the mic or speak" : "Tap background to cancel"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}