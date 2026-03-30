/**
 * GuideProfileModal — Inline multi-stage profile setup for Coaches/Mentors
 *
 * Follows child-link-modal.tsx blueprint.
 * Stages: intro → headline → bio → specializations → rates → success
 * Sophia guides conversationally at each stage.
 * Purple accent (var(--ce-role-guide)).
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { X, Check, ArrowRight, Sparkles, User, Tag, DollarSign } from "lucide-react";

const SPRING = { stiffness: 160, damping: 24 };
type SetupStage = "intro" | "headline" | "bio" | "specializations" | "rates" | "success";

const SPECS = [
  "Resume Review", "Interview Prep", "Career Transitions",
  "Salary Negotiation", "Portfolio Review", "Leadership Coaching",
  "Technical Mentoring", "Executive Coaching", "Startup Advisory",
  "AI Career Transitions", "Remote Work Strategy", "Personal Branding",
];

export interface GuideProfile {
  headline: string;
  bio: string;
  specializations: string[];
  rate: number;
  duration: number;
  photoSet: boolean;
}

export function useGuideProfile() {
  const [profile, setP] = useState<GuideProfile | null>(() => {
    try { const s = localStorage.getItem("ce-guide-profile"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const save = (p: GuideProfile) => { setP(p); try { localStorage.setItem("ce-guide-profile", JSON.stringify(p)); } catch {} };
  const reset = () => { setP(null); try { localStorage.removeItem("ce-guide-profile"); } catch {} };
  return { profile, save, reset } as const;
}

interface Props { onSuccess: (p: GuideProfile) => void; onClose: () => void; }

export function GuideProfileModal({ onSuccess, onClose }: Props) {
  const [stage, setStage] = useState<SetupStage>("intro");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);
  const [rate, setRate] = useState(85);
  const [dur, setDur] = useState(45);

  useEffect(() => {
    if (stage === "success") {
      const t = setTimeout(() => onSuccess({ headline, bio, specializations: specs, rate, duration: dur, photoSet: false }), 1800);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const toggle = (s: string) => setSpecs(p => p.includes(s) ? p.filter(x => x !== s) : p.length < 5 ? [...p, s] : p);
  const ok = stage === "headline" ? headline.trim().length >= 5 : stage === "bio" ? bio.trim().length >= 20 : stage === "specializations" ? specs.length >= 2 : true;
  const next = () => { const f: SetupStage[] = ["intro","headline","bio","specializations","rates","success"]; const i = f.indexOf(stage); if (i < f.length - 1) setStage(f[i+1]); };

  const titles: Record<SetupStage, [string, string]> = {
    intro: ["Build your coaching profile", "Clients find and book you through your profile"],
    headline: ["Your coaching headline", "Step 1 of 4"],
    bio: ["Tell clients about yourself", "Step 2 of 4"],
    specializations: ["Your specializations", "Step 3 of 4"],
    rates: ["Session pricing", "Step 4 of 4"],
    success: ["Your profile is live!", "Clients can now find and book you"],
  };
  const [title, sub] = titles[stage];
  const step = ["headline","bio","specializations","rates"].indexOf(stage);

  const gradientBtn = (label: string, icon: React.ReactNode, onClick: () => void, disabled = false) => (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3 rounded-xl text-[13px] font-medium cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      style={{ background: disabled ? "rgba(var(--ce-glass-tint),0.06)" : "linear-gradient(135deg, var(--ce-role-guide), var(--ce-cyan))", color: disabled ? "var(--ce-text-tertiary)" : "var(--ce-void)", fontFamily: "var(--font-display)" }}>
      {label} {icon}
    </button>
  );

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(8,9,12,0.75)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <motion.div className="relative z-10 w-full max-w-md" initial={{ y: 32, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0, scale: 0.98 }} transition={{ type: "spring", ...SPRING }}>
        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(var(--ce-role-guide-rgb),0.2), rgba(var(--ce-role-edgestar-rgb),0.08), rgba(var(--ce-role-guide-rgb),0.06))" }}>
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "linear-gradient(160deg, rgba(16,10,20,0.98) 0%, rgba(12,14,19,0.99) 60%)", boxShadow: "0 8px 60px rgba(var(--ce-shadow-tint),0.7), inset 0 1px 1px rgba(var(--ce-glass-tint),0.04)" }}>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SophiaMark size={28} glowing />
                <div>
                  <div className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{title}</div>
                  <div className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{sub}</div>
                </div>
              </div>
              {stage !== "success" && (
                <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[rgba(var(--ce-glass-tint),0.06)] transition-colors" style={{ color: "var(--ce-text-tertiary)" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Progress */}
            {step >= 0 && (
              <div className="flex gap-1.5">
                {[0,1,2,3].map(i => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "var(--ce-role-guide)" : "rgba(var(--ce-glass-tint),0.06)", transition: "background 0.3s" }} />)}
              </div>
            )}

            {/* Intro */}
            {stage === "intro" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl p-4" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                  {[
                    { icon: <User className="w-4 h-4" />, text: "Sophia will help you set it up in about 2 minutes — just 4 quick questions" },
                    { icon: <Tag className="w-4 h-4" />, text: "You'll pick your specializations, set your rates, and craft a headline clients see first" },
                    { icon: <Sparkles className="w-4 h-4" />, text: "Your profile goes live immediately — you can always edit it later" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < 2 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(var(--ce-role-guide-rgb),0.08)", color: "var(--ce-role-guide)" }}>{item.icon}</div>
                      <span className="text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                {gradientBtn("Build with Sophia", <ArrowRight className="w-4 h-4" />, next)}
                <button onClick={onClose} className="w-full text-center text-[12px] text-ce-text-tertiary cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>I'll do this later</button>
              </div>
            )}

            {/* Headline */}
            {stage === "headline" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <SophiaMark size={16} />
                  <p className="text-[13px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    How do you describe yourself in one line? Clients see this before anything else — something like "Career Coach | 10 years in tech hiring" or "Interview Prep Specialist for designers."
                  </p>
                </div>
                <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g., Career Coach | 10 years in tech hiring" autoFocus
                  className="w-full px-4 py-3 rounded-xl text-[13px] text-ce-text-primary outline-none"
                  style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: `1px solid ${headline ? "rgba(var(--ce-role-guide-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)"}`, fontFamily: "var(--font-body)" }} />
                {gradientBtn("Next", <ArrowRight className="w-4 h-4" />, next, !ok)}
              </div>
            )}

            {/* Bio */}
            {stage === "bio" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <SophiaMark size={16} />
                  <p className="text-[13px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Tell clients what makes your coaching unique — 2-3 sentences about your approach, experience, or what they'll get from working with you.
                  </p>
                </div>
                <div className="relative">
                  <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 300))} placeholder="e.g., I help mid-career professionals transition into product roles..." rows={4} autoFocus
                    className="w-full px-4 py-3 rounded-xl text-[13px] text-ce-text-primary outline-none resize-none"
                    style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: `1px solid ${bio ? "rgba(var(--ce-role-guide-rgb),0.2)" : "rgba(var(--ce-glass-tint),0.06)"}`, fontFamily: "var(--font-body)" }} />
                  <span className="absolute bottom-3 right-3 text-[10px] text-ce-text-quaternary" style={{ fontFamily: "var(--font-body)" }}>{bio.length}/300</span>
                </div>
                {gradientBtn("Next", <ArrowRight className="w-4 h-4" />, next, !ok)}
              </div>
            )}

            {/* Specializations */}
            {stage === "specializations" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <SophiaMark size={16} />
                  <p className="text-[13px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Pick 2-5 areas you specialize in. Clients filter coaches by these — the more specific, the better your matches.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SPECS.map(s => (
                    <button key={s} onClick={() => toggle(s)} className="px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all duration-200"
                      style={{ background: specs.includes(s) ? "rgba(var(--ce-role-guide-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)", border: `1px solid ${specs.includes(s) ? "rgba(var(--ce-role-guide-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}`, color: specs.includes(s) ? "var(--ce-role-guide)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-ce-text-quaternary" style={{ fontFamily: "var(--font-body)" }}>{specs.length}/5 selected {specs.length < 2 && "· pick at least 2"}</div>
                {gradientBtn("Next", <ArrowRight className="w-4 h-4" />, next, !ok)}
              </div>
            )}

            {/* Rates */}
            {stage === "rates" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <SophiaMark size={16} />
                  <p className="text-[13px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Set your default session rate and duration. You can customize per session type later in your availability settings.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Rate per session</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ce-text-quaternary" />
                      <input type="number" value={rate} onChange={e => setRate(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg text-[13px] text-ce-text-primary outline-none"
                        style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.2)", fontFamily: "var(--font-body)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-ce-text-tertiary block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Session length</label>
                    <div className="flex gap-2">
                      {[30, 45, 60].map(d => (
                        <button key={d} onClick={() => setDur(d)} className="flex-1 py-2.5 rounded-lg text-[12px] cursor-pointer transition-all"
                          style={{ background: dur === d ? "rgba(var(--ce-role-guide-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)", border: `1px solid ${dur === d ? "rgba(var(--ce-role-guide-rgb),0.25)" : "rgba(var(--ce-glass-tint),0.06)"}`, color: dur === d ? "var(--ce-role-guide)" : "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}>
                          {d}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {gradientBtn("Publish profile", <Check className="w-4 h-4" />, () => setStage("success"))}
              </div>
            )}

            {/* Success */}
            {stage === "success" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(var(--ce-role-guide-rgb),0.12)" }}>
                  <Check className="w-8 h-8" style={{ color: "var(--ce-role-guide)" }} />
                </div>
                <div className="text-[15px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Your profile is live</div>
                <div className="text-[12px] text-ce-text-tertiary mb-3" style={{ fontFamily: "var(--font-body)" }}>{headline}</div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {specs.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-guide-rgb),0.08)", color: "var(--ce-role-guide)", fontFamily: "var(--font-body)" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
