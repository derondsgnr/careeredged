/**
 * GuideProfileEdit — Full-screen two-column profile editing surface
 *
 * Left: Live profile preview with inline-editable fields (pencil on hover)
 * Right: Sophia suggestions panel (typed: photo, headline diff, story form, specialization pills)
 *
 * Route: /guide/profile
 * Pattern: ResumeEdge active state (SophiaForwardBackground + SharedTopNav + two-column grid)
 */

import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { SophiaForwardBackground } from "./shell-background";
import { SharedTopNav } from "./role-shell";
import { SophiaMark } from "./sophia-mark";
import { AvailabilityEditor } from "./sessions";
import { useGuideProfile, type GuideProfile } from "./guide-profile-modal";
import {
  Check, Pencil, Camera, ChevronDown, ChevronUp,
  Plus, Star, ArrowRight, Undo2, Sparkles,
} from "lucide-react";

const TRENDING_SPECS = ["AI Career Transitions", "Remote Work Strategy", "Personal Branding", "Executive Presence"];

interface SuccessStory { clientName: string; clientInitial: string; outcome: string; role: string; }
interface Testimonial { clientName: string; clientInitial: string; text: string; rating: number; }

const MOCK_TESTIMONIALS: Testimonial[] = [
  { clientName: "Sharon L.", clientInitial: "S", text: "Alice helped me land my dream role at Figma. Her interview prep was incredibly thorough.", rating: 5 },
  { clientName: "Marcus T.", clientInitial: "M", text: "The salary negotiation coaching alone paid for 10x the session cost.", rating: 5 },
];

type SuggestionId = "photo" | "headline" | "story" | "specialization";
interface Suggestion { id: SuggestionId; title: string; description: string; }
const SUGGESTIONS: Suggestion[] = [
  { id: "photo", title: "Add a profile photo", description: "Profiles with photos get 2x more bookings" },
  { id: "headline", title: "Strengthen your headline", description: "A stronger headline attracts more clients" },
  { id: "story", title: "Add a client success story", description: "Social proof increases booking rates" },
  { id: "specialization", title: "Add trending specialization", description: "These specializations are in demand right now" },
];

// ─── Editable Field ─────────────────────────────────────────────────────

function EditableText({ value, onSave, multiline }: { value: string; onSave: (v: string) => void; multiline?: boolean; }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { if (draft.trim()) onSave(draft.trim()); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    const cls = "w-full px-3 py-2 rounded-lg text-[13px] text-ce-text-primary outline-none";
    const st = { background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.3)", fontFamily: "var(--font-body)" };
    return multiline
      ? <textarea value={draft} onChange={e => setDraft(e.target.value)} onBlur={save} onKeyDown={e => e.key === "Escape" && cancel()} autoFocus rows={3} className={cls + " resize-none"} style={st} />
      : <input value={draft} onChange={e => setDraft(e.target.value)} onBlur={save} onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }} autoFocus className={cls} style={st} />;
  }

  return (
    <div className="group relative cursor-pointer inline" onClick={() => { setDraft(value); setEditing(true); }}>
      <span>{value}</span>
      <Pencil className="w-3 h-3 text-ce-text-quaternary opacity-0 group-hover:opacity-100 transition-opacity inline-block ml-2" />
    </div>
  );
}

// ─── Main Surface ───────────────────────────────────────────────────────

interface Props { role: string; onNavigate?: (s: string) => void; }

export function GuideProfileEditSurface({ role, onNavigate }: Props) {
  const { profile, save: saveProfile, reset } = useGuideProfile();
  const [expanded, setExpanded] = useState<SuggestionId | null>(null);
  const [accepted, setAccepted] = useState<Set<SuggestionId>>(new Set());
  const [undoStack, setUndoStack] = useState<Map<SuggestionId, GuideProfile>>(new Map());
  const [showAvailability, setShowAvailability] = useState(false);
  const [addingStory, setAddingStory] = useState(false);
  const [storyDraft, setStoryDraft] = useState({ clientName: "", outcome: "", role: "" });

  // If no profile yet, redirect to dashboard
  if (!profile) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "var(--ce-void)" }}>
        <SophiaForwardBackground />
        <SharedTopNav role={role as any} onOpenSophia={() => {}} />
        <div className="mt-14 flex items-center justify-center py-20">
          <div className="text-center">
            <SophiaMark size={32} glowing />
            <p className="text-[14px] text-ce-text-secondary mt-4 mb-4" style={{ fontFamily: "var(--font-body)" }}>Set up your profile first</p>
            <button onClick={() => onNavigate?.("home")} className="text-[13px] text-[var(--ce-role-guide)] cursor-pointer" style={{ fontFamily: "var(--font-display)" }}>
              Back to dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stories: SuccessStory[] = (profile as any).successStories || [];

  const update = (changes: Partial<GuideProfile>) => {
    saveProfile({ ...profile, ...changes });
  };

  const acceptSuggestion = (id: SuggestionId) => {
    setUndoStack(prev => new Map(prev).set(id, { ...profile }));
    setAccepted(prev => new Set(prev).add(id));
    if (id === "headline") update({ headline: "Career Transition Coach | Helping professionals land product roles | 10+ years in hiring" });
    else if (id === "specialization") {
      const newSpecs = [...profile.specializations];
      TRENDING_SPECS.forEach(s => { if (!newSpecs.includes(s) && newSpecs.length < 8) newSpecs.push(s); });
      update({ specializations: newSpecs });
    }
    setExpanded(null);
  };

  const undoSuggestion = (id: SuggestionId) => {
    const prev = undoStack.get(id);
    if (prev) saveProfile(prev);
    setAccepted(p => { const n = new Set(p); n.delete(id); return n; });
    setUndoStack(p => { const n = new Map(p); n.delete(id); return n; });
  };

  const addStory = () => {
    if (!storyDraft.clientName || !storyDraft.outcome) return;
    const s: SuccessStory = { ...storyDraft, clientInitial: storyDraft.clientName[0] };
    update({ ...profile, successStories: [...stories, s] } as any);
    setStoryDraft({ clientName: "", outcome: "", role: "" });
    setAddingStory(false);
    setAccepted(prev => new Set(prev).add("story"));
    setExpanded(null);
  };

  const allDone = accepted.size >= SUGGESTIONS.length;
  const rgb = "var(--ce-role-guide-rgb)";

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--ce-void)" }}>
      <SophiaForwardBackground />
      <SharedTopNav role={role as any} onOpenSophia={() => {}} />

      <div className="mt-14 max-w-[1100px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SophiaMark size={24} glowing />
            <div>
              <div className="text-[17px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Edit your coaching profile</div>
              <div className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Changes save automatically</div>
            </div>
          </div>
          <button onClick={() => onNavigate?.("home")} className="text-[12px] text-ce-text-tertiary hover:text-ce-text-secondary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
            ← Back to dashboard
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_380px] gap-8">

          {/* LEFT — Profile Preview */}
          <div className="flex flex-col gap-6">
            <div className="text-[10px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>This is what clients see</div>

            {/* Avatar + Headline + Bio */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <div className="flex items-start gap-5 mb-5">
                <div className="relative group cursor-pointer flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-[22px] font-medium" style={{ background: `rgba(${rgb},0.12)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-display)" }}>A</div>
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    <EditableText value={profile.headline} onSave={h => update({ headline: h })} />
                  </div>
                  <div className="text-[13px] text-ce-text-tertiary mb-1" style={{ fontFamily: "var(--font-body)" }}>Alice Chen · EdgeGuide</div>
                  <div className="flex items-center gap-3 text-[12px]" style={{ fontFamily: "var(--font-body)" }}>
                    <span className="flex items-center gap-1 text-ce-text-secondary"><Star className="w-3 h-3 fill-current" style={{ color: "var(--ce-role-edgepreneur)" }} /> 4.9 <span className="text-ce-text-tertiary">(23 reviews)</span></span>
                    <span className="text-ce-text-quaternary">·</span>
                    <span className="text-ce-text-secondary">12 active clients</span>
                    <span className="text-ce-text-quaternary">·</span>
                    <span className="text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>${profile.rate}/hr</span>
                  </div>
                </div>
              </div>
              <div className="text-[13px] text-ce-text-secondary leading-relaxed mb-5" style={{ fontFamily: "var(--font-body)" }}>
                <EditableText value={profile.bio} onSave={b => update({ bio: b })} multiline />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.specializations.map(s => (
                  <span key={s} className="text-[11px] px-3 py-1 rounded-full" style={{ background: `rgba(${rgb},0.06)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-body)" }}>{s}</span>
                ))}
              </div>
              <div className="text-[12px] text-ce-text-tertiary pt-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>
                {profile.duration} min sessions · ${profile.rate}/session · Moderate cancellation
              </div>
            </div>

            {/* Success Stories */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] text-ce-text-quaternary uppercase tracking-wider" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Success Stories</span>
                {stories.length < 3 && <button onClick={() => setAddingStory(true)} className="flex items-center gap-1 text-[11px] text-[var(--ce-role-guide)] cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><Plus className="w-3 h-3" /> Add</button>}
              </div>
              {stories.length === 0 && !addingStory && <p className="text-[12px] text-ce-text-quaternary italic" style={{ fontFamily: "var(--font-body)" }}>Add your first client win — it's the best social proof.</p>}
              {stories.map((s, i) => (
                <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < stories.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-medium" style={{ background: `rgba(${rgb},0.08)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-display)" }}>{s.clientInitial}</div>
                  <div>
                    <div className="text-[13px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-body)" }}>{s.outcome}</div>
                    <div className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{s.clientName} · {s.role}</div>
                  </div>
                </div>
              ))}
              {addingStory && (
                <div className="mt-3 p-4 rounded-xl space-y-2.5" style={{ background: `rgba(${rgb},0.04)`, border: `1px solid rgba(${rgb},0.1)` }}>
                  <input value={storyDraft.clientName} onChange={e => setStoryDraft(d => ({...d, clientName: e.target.value}))} placeholder="Client name" className="w-full px-3 py-2 rounded-lg text-[12px] text-ce-text-primary outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
                  <input value={storyDraft.role} onChange={e => setStoryDraft(d => ({...d, role: e.target.value}))} placeholder="Their role (e.g., Product Designer)" className="w-full px-3 py-2 rounded-lg text-[12px] text-ce-text-primary outline-none" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
                  <textarea value={storyDraft.outcome} onChange={e => setStoryDraft(d => ({...d, outcome: e.target.value}))} placeholder="What did you help them achieve?" rows={2} className="w-full px-3 py-2 rounded-lg text-[12px] text-ce-text-primary outline-none resize-none" style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)", fontFamily: "var(--font-body)" }} />
                  <div className="flex gap-2">
                    <button onClick={addStory} disabled={!storyDraft.clientName || !storyDraft.outcome} className="flex-1 py-2 rounded-lg text-[11px] font-medium cursor-pointer disabled:opacity-50" style={{ background: `rgba(${rgb},0.12)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-display)" }}>Save story</button>
                    <button onClick={() => setAddingStory(false)} className="px-4 py-2 rounded-lg text-[11px] text-ce-text-tertiary cursor-pointer" style={{ background: "rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Testimonials */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <span className="text-[11px] text-ce-text-quaternary uppercase tracking-wider block mb-4" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Client Testimonials</span>
              {MOCK_TESTIMONIALS.map((t, i) => (
                <div key={i} className="py-3" style={{ borderBottom: i < MOCK_TESTIMONIALS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                  <div className="flex items-center gap-1 mb-1">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-current" style={{ color: "var(--ce-role-edgepreneur)" }} />)}</div>
                  <p className="text-[13px] text-ce-text-secondary mb-1 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>"{t.text}"</p>
                  <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>— {t.clientName}</span>
                </div>
              ))}
              <button className="mt-3 text-[11px] text-[var(--ce-role-guide)] flex items-center gap-1 cursor-pointer" style={{ fontFamily: "var(--font-body)" }}><Sparkles className="w-3 h-3" /> Request a testimonial from a client</button>
            </div>

            <button onClick={reset} className="text-[10px] text-ce-text-quaternary cursor-pointer hover:text-ce-text-tertiary transition-colors self-start" style={{ fontFamily: "var(--font-body)" }}>Reset profile (demo)</button>
          </div>

          {/* RIGHT — Sophia Suggestions */}
          <div className="flex flex-col gap-4">
            <div className="sticky top-20">
              <div className="flex items-center gap-2 mb-1">
                <SophiaMark size={16} />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia</span>
              </div>
              <div className="text-[12px] text-ce-text-tertiary mb-4" style={{ fontFamily: "var(--font-body)" }}>Suggestions to help you stand out</div>

              <div className="flex flex-col gap-3">
                {SUGGESTIONS.map(s => {
                  const done = accepted.has(s.id);
                  const isOpen = expanded === s.id;
                  return (
                    <div key={s.id} className="rounded-xl overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: `1px solid ${done ? "rgba(var(--ce-role-employer-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.05)"}` }}>
                      <button onClick={() => setExpanded(isOpen ? null : s.id)} className="w-full flex items-center justify-between p-3.5 cursor-pointer text-left">
                        <div className="flex items-center gap-2 flex-1">
                          {done && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--ce-role-employer)" }} />}
                          <div>
                            <div className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500, textDecoration: done ? "line-through" : "none", opacity: done ? 0.6 : 1 }}>{s.title}</div>
                            {!isOpen && <div className="text-[10px] text-ce-text-tertiary mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{s.description}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {done && !isOpen && <button onClick={e => { e.stopPropagation(); undoSuggestion(s.id); }} className="text-[10px] text-ce-text-quaternary hover:text-ce-text-tertiary cursor-pointer flex items-center gap-0.5" style={{ fontFamily: "var(--font-body)" }}><Undo2 className="w-3 h-3" /> Undo</button>}
                          {!done && (isOpen ? <ChevronUp className="w-3.5 h-3.5 text-ce-text-quaternary" /> : <ChevronDown className="w-3.5 h-3.5 text-ce-text-quaternary" />)}
                        </div>
                      </button>
                      {isOpen && !done && (
                        <div className="px-3.5 pb-3.5">
                          {s.id === "photo" && (
                            <button onClick={() => acceptSuggestion("photo")} className="w-full py-2.5 rounded-lg text-[12px] font-medium cursor-pointer flex items-center justify-center gap-2" style={{ background: `rgba(${rgb},0.08)`, color: "var(--ce-role-guide)", border: `1px solid rgba(${rgb},0.12)`, fontFamily: "var(--font-display)" }}>
                              <Camera className="w-4 h-4" /> Upload photo
                            </button>
                          )}
                          {s.id === "headline" && (
                            <div>
                              <div className="mb-2 p-3 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)" }}>
                                <div className="text-[10px] text-ce-text-quaternary mb-1" style={{ fontFamily: "var(--font-body)" }}>Current</div>
                                <div className="text-[12px] text-ce-text-tertiary line-through" style={{ fontFamily: "var(--font-body)" }}>{profile.headline}</div>
                              </div>
                              <div className="mb-3 p-3 rounded-lg" style={{ background: `rgba(${rgb},0.04)`, border: `1px solid rgba(${rgb},0.1)` }}>
                                <div className="text-[10px] text-[var(--ce-role-guide)] mb-1" style={{ fontFamily: "var(--font-body)" }}>Suggested</div>
                                <div className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>Career Transition Coach | Helping professionals land product roles | 10+ years in hiring</div>
                              </div>
                              <button onClick={() => acceptSuggestion("headline")} className="w-full py-2 rounded-lg text-[11px] font-medium cursor-pointer" style={{ background: `rgba(${rgb},0.08)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-display)" }}>Apply this change</button>
                            </div>
                          )}
                          {s.id === "story" && (
                            <div>
                              <p className="text-[11px] text-ce-text-tertiary mb-2" style={{ fontFamily: "var(--font-body)" }}>Add a specific client outcome — it's the strongest social proof.</p>
                              <button onClick={() => { setAddingStory(true); setExpanded(null); }} className="w-full py-2 rounded-lg text-[11px] font-medium cursor-pointer flex items-center justify-center gap-1" style={{ background: `rgba(${rgb},0.08)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-display)" }}>
                                <Plus className="w-3.5 h-3.5" /> Write a success story
                              </button>
                            </div>
                          )}
                          {s.id === "specialization" && (
                            <div>
                              <p className="text-[11px] text-ce-text-tertiary mb-2" style={{ fontFamily: "var(--font-body)" }}>These specializations are trending right now.</p>
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {TRENDING_SPECS.map(sp => (
                                  <span key={sp} className="text-[11px] px-2.5 py-1 rounded-full cursor-pointer" style={{ background: `rgba(${rgb},0.06)`, color: "var(--ce-role-guide)", border: `1px solid rgba(${rgb},0.12)`, fontFamily: "var(--font-body)" }}>{sp}</span>
                                ))}
                              </div>
                              <button onClick={() => acceptSuggestion("specialization")} className="w-full py-2 rounded-lg text-[11px] font-medium cursor-pointer" style={{ background: `rgba(${rgb},0.08)`, color: "var(--ce-role-guide)", fontFamily: "var(--font-display)" }}>Add all trending</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Exit: Set availability */}
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                {allDone && <div className="text-[12px] text-ce-text-secondary mb-3 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>Your profile is looking strong. Next step — set your availability so clients can start booking.</div>}
                <button onClick={() => setShowAvailability(true)} className="w-full py-3 rounded-xl text-[13px] font-medium cursor-pointer flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, var(--ce-role-guide), var(--ce-cyan))", color: "var(--ce-void)", fontFamily: "var(--font-display)" }}>
                  Set your availability <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAvailability && <AvailabilityEditor onClose={() => setShowAvailability(false)} />}
      </AnimatePresence>
    </div>
  );
}
