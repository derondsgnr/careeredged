/**
 * ResumeEdge — Resume optimization surface
 * 
 * Layout: Two-column side-by-side
 *   LEFT: Live document preview with inline diffs (current strikethrough + suggested in green)
 *   RIGHT: Compact collapsible score bar + Sophia coaching chat (majority of vertical space)
 * 
 * States: empty → parseConfirm → building → analyzing → active
 * Default: empty (no resume yet)
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SophiaMark } from "./sophia-mark";
import { SophiaForwardBackground } from "./shell-background";
import { SharedTopNav } from "./role-shell";
import type { RoleId } from "./role-shell";
import {
  FileText, Upload, Check, X, ChevronRight, ChevronDown, ChevronUp,
  Sparkles, Target, ArrowRight, Briefcase, Compass,
  AlertTriangle, Download, Send, Mic, Undo2, Zap,
  User, Building2, Trophy, Crosshair, Wrench, Plus,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

type NavigateFn = (target: string) => void;

// ─── Types & Data ───────────────────────────────────────────────────────────

type ResumeState = "empty" | "parseConfirm" | "building" | "analyzing" | "active";

interface Suggestion {
  id: string;
  section: string;
  sectionKey: string;
  original: string;
  suggested: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

interface ScoreBreakdown {
  label: string;
  score: number;
  max: number;
  color: string;
}

const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1", section: "Summary", sectionKey: "summary",
    original: "Experienced professional looking for new opportunities in product design.",
    suggested: "Product design leader with 6 years of frontend engineering experience, specializing in design systems and user-centered development. Transitioning to product design with a portfolio of 3 shipped redesigns.",
    reason: "89% of Product Designer listings mention specific experience years and specializations. Generic summaries are filtered out by ATS systems.",
    status: "pending",
  },
  {
    id: "s2", section: "Experience — Bullet 1", sectionKey: "exp-1",
    original: "Managed team operations and improved workflow efficiency.",
    suggested: "Led cross-functional team of 8, implementing design-driven workflow improvements that increased team velocity by 34% and reduced client onboarding time from 2 weeks to 3 days.",
    reason: "Quantified impact with numbers. 'Led cross-functional team' maps to 6 of your target job descriptions.",
    status: "pending",
  },
  {
    id: "s3", section: "Experience — Bullet 2", sectionKey: "exp-2",
    original: "Created dashboards and reports for stakeholders.",
    suggested: "Designed and shipped 12 data visualization dashboards used by 200+ stakeholders, applying information hierarchy principles that reduced decision-making time by 40%.",
    reason: "'Data visualization' and 'information hierarchy' are design-specific terminology that bridges your ops experience to product design.",
    status: "pending",
  },
  {
    id: "s4", section: "Skills", sectionKey: "skills",
    original: "Excel, SQL, Salesforce, Project Management",
    suggested: "Figma, Design Systems, Prototyping, User Research, Information Architecture, Data Visualization, Excel, SQL",
    reason: "Your current skills list has 0% overlap with Product Designer requirements. Adding your newly acquired design skills moves keyword match from 12% to 67%.",
    status: "pending",
  },
];

const SCORE_BREAKDOWN: ScoreBreakdown[] = [
  { label: "ATS Compat.", score: 92, max: 100, color: "#B3FF3B" },
  { label: "Keywords", score: 67, max: 100, color: "#22D3EE" },
  { label: "Impact", score: 71, max: 100, color: "#22D3EE" },
  { label: "Format", score: 95, max: 100, color: "#B3FF3B" },
];

const SECTION_VERDICTS = [
  { name: "Summary", key: "summary", verdict: "warn" as const, detail: "Generic" },
  { name: "Experience", key: "experience", verdict: "warn" as const, detail: "No impact" },
  { name: "Education", key: "education", verdict: "good" as const, detail: "Strong" },
  { name: "Skills", key: "skills", verdict: "fix" as const, detail: "0% match" },
  { name: "Projects", key: "projects", verdict: "good" as const, detail: "3 linked" },
];

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onUpload, onBuildFromScratch }: { onUpload: () => void; onBuildFromScratch: () => void }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <motion.div
        className="max-w-[520px] w-full flex flex-col items-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <SophiaMark size={40} glowing />
        <h2 className="text-[20px] text-[#E8E8ED] mt-6 mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Let's get your resume working for you.
        </h2>
        <p className="text-[13px] text-[#6B7280] text-center mb-8" style={{ fontFamily: "var(--font-body)" }}>
          Upload your current resume and I'll analyze it against your target roles, or we can build one together from scratch.
        </p>

        <div className="w-full flex flex-col gap-4">
          <div
            className="rounded-xl p-8 text-center cursor-pointer transition-all"
            style={{
              background: dragOver ? "rgba(179,255,59,0.04)" : "rgba(255,255,255,0.02)",
              border: `2px dashed ${dragOver ? "rgba(179,255,59,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
            onClick={onUpload}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onUpload(); }}
          >
            <Upload className="w-8 h-8 text-[#6B7280] mx-auto mb-3" />
            <p className="text-[14px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Upload your resume
            </p>
            <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
              Drop your file here or click to browse · PDF, DOCX, TXT
            </p>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl cursor-pointer transition-colors hover:bg-[rgba(34,211,238,0.06)]"
            style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.08)" }}
            onClick={onBuildFromScratch}
          >
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Build from scratch with Sophia
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Upload Parse Confirmation ──────────────────────────────────────────────
// "She actually read it" — shows extracted info before analysis begins

function ParseConfirmState({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const fields = [1, 2, 3, 4, 5];
    const timers = fields.map((f, i) =>
      setTimeout(() => setRevealed(f), 300 + i * 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const extractedFields = [
    { icon: User, label: "Name", value: "Sharon Chen" },
    { icon: Briefcase, label: "Current Role", value: "Revenue Operations Manager at TechCorp Inc." },
    { icon: Zap, label: "Experience", value: "~6 years (mid-career — matches your profile)" },
    { icon: Wrench, label: "Skills Found", value: "Excel, SQL, Salesforce, Project Management" },
    { icon: FileText, label: "Sections", value: "Summary, Experience (3 bullets), Skills, Education, Projects" },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <motion.div
        className="max-w-[520px] w-full flex flex-col items-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <SophiaMark size={32} glowing />

        {/* Sophia message */}
        <motion.div
          className="mt-6 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[14px] text-[#E8E8ED] mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Here's what I found in your resume.
          </p>
          <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
            Let me know if this looks right, and I'll run a full analysis.
          </p>
        </motion.div>

        {/* Extracted fields — revealed sequentially */}
        <div className="w-full flex flex-col gap-2 mb-6">
          {extractedFields.map((field, i) => {
            const FieldIcon = field.icon;
            return (
              <motion.div
                key={field.label}
                className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: revealed > i ? 1 : 0, x: revealed > i ? 0 : -12 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.12)" }}
                >
                  <FieldIcon className="w-3 h-3 text-[#22D3EE]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#6B7280] block mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                    {field.label}
                  </span>
                  <span className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>
                    {field.value}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <motion.div
          className="w-full flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed >= 5 ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:brightness-110"
            style={{ background: "rgba(179,255,59,0.08)", border: "1px solid rgba(179,255,59,0.15)" }}
            onClick={onConfirm}
          >
            <Check className="w-4 h-4 text-[#B3FF3B]" />
            <span className="text-[13px] text-[#B3FF3B]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Looks right — analyze it
            </span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.03)]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            onClick={onBack}
          >
            <span className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
              Re-upload
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Build From Scratch — Sophia-guided conversational resume builder ────────

interface BuildStep {
  id: string;
  icon: typeof User;
  question: string;
  placeholder: string;
  sophiaFollowUp: string;
}

const BUILD_STEPS: BuildStep[] = [
  {
    id: "role",
    icon: User,
    question: "What's your current or most recent job title?",
    placeholder: "e.g., Revenue Operations Manager",
    sophiaFollowUp: "Great — that gives me a strong starting point. Now let's get the context.",
  },
  {
    id: "company",
    icon: Building2,
    question: "What company was that at, and how long have you been there?",
    placeholder: "e.g., TechCorp Inc., about 4 years",
    sophiaFollowUp: "Got it. Now tell me about your impact there — this is the most important part.",
  },
  {
    id: "achievement",
    icon: Trophy,
    question: "Tell me about your biggest win — a project you led, a result you're proud of, anything that shows your impact.",
    placeholder: "e.g., I led a team that rebuilt our onboarding flow and cut dropout rates by 40%...",
    sophiaFollowUp: "That's great material. I can already see 2-3 strong bullet points forming. Two more quick ones.",
  },
  {
    id: "target",
    icon: Crosshair,
    question: "What role are you targeting next?",
    placeholder: "e.g., Product Designer, UX Researcher",
    sophiaFollowUp: "Perfect — I'll tailor everything to that target. Last question.",
  },
  {
    id: "skills",
    icon: Wrench,
    question: "What are your top 3-4 skills for that target role?",
    placeholder: "e.g., Figma, user research, prototyping, design systems",
    sophiaFollowUp: "",
  },
];

// Contextual skill suggestions keyed by target role keywords
const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "product design": ["Figma", "Prototyping", "User Research", "Design Systems", "Wireframing", "Usability Testing", "Information Architecture", "Interaction Design"],
  "ux research": ["User Interviews", "Usability Testing", "Survey Design", "Data Analysis", "A/B Testing", "Affinity Mapping", "Personas", "Journey Mapping"],
  "product manage": ["Roadmapping", "Stakeholder Management", "A/B Testing", "SQL", "Agile/Scrum", "User Stories", "OKRs", "Data Analysis"],
  "software engineer": ["React", "TypeScript", "Node.js", "System Design", "REST APIs", "Git", "CI/CD", "Testing"],
  "data scien": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "TensorFlow", "Data Visualization", "A/B Testing"],
  "marketing": ["SEO", "Content Strategy", "Google Analytics", "Social Media", "Copywriting", "Email Marketing", "CRM", "Paid Ads"],
  default: ["Communication", "Project Management", "Data Analysis", "Problem Solving", "Collaboration", "Presentation", "Strategic Thinking", "Leadership"],
};

function getSkillSuggestions(targetRole: string): string[] {
  const lower = targetRole.toLowerCase();
  for (const [key, skills] of Object.entries(SKILL_SUGGESTIONS)) {
    if (key !== "default" && lower.includes(key)) return skills;
  }
  return SKILL_SUGGESTIONS.default;
}

function BuildFromScratchState({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const customSkillRef = useRef<HTMLInputElement>(null);

  const isSkillsStep = BUILD_STEPS[currentStep]?.id === "skills";
  const skillSuggestions = getSkillSuggestions(answers["target"] || "");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput("");
    setShowCustomInput(false);
  };

  useEffect(() => {
    if (showCustomInput) customSkillRef.current?.focus();
  }, [showCustomInput]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [currentStep, isTyping, generating, genStep]);

  useEffect(() => {
    if (!generating && !isTyping) {
      inputRef.current?.focus();
    }
  }, [currentStep, isTyping, generating]);

  const handleSubmitSkills = () => {
    if (selectedSkills.length === 0 || isTyping || generating) return;
    const step = BUILD_STEPS[currentStep];
    setAnswers((prev) => ({ ...prev, [step.id]: selectedSkills.join(", ") }));

    if (currentStep < BUILD_STEPS.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep((prev) => prev + 1);
      }, 1000);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setGenerating(true);
      }, 800);
    }
  };

  const handleSubmit = () => {
    if (isSkillsStep) { handleSubmitSkills(); return; }
    if (!input.trim() || isTyping || generating) return;
    const step = BUILD_STEPS[currentStep];
    setAnswers((prev) => ({ ...prev, [step.id]: input.trim() }));
    setInput("");

    if (currentStep < BUILD_STEPS.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep((prev) => prev + 1);
      }, 1000);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setGenerating(true);
      }, 800);
    }
  };

  useEffect(() => {
    if (!generating) return;
    const delays = [600, 1200, 1800, 2400];
    const timers = delays.map((d, i) =>
      setTimeout(() => setGenStep(i + 1), d)
    );
    timers.push(setTimeout(onComplete, 3200));
    return () => timers.forEach(clearTimeout);
  }, [generating, onComplete]);

  const GEN_STEPS = [
    "Structuring your sections...",
    "Writing experience bullets from your achievements...",
    "Optimizing keywords for your target role...",
    "Formatting for ATS compatibility...",
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
      <motion.div
        className="w-full max-w-[560px] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <SophiaMark size={28} glowing />
          <div>
            <h2 className="text-[16px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              Build your resume
            </h2>
            <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
              {generating ? "Generating your first draft..." : `Question ${Math.min(currentStep + 1, BUILD_STEPS.length)} of ${BUILD_STEPS.length}`}
            </p>
          </div>
          <button
            className="ml-auto text-[11px] text-[#374151] px-2.5 py-1 rounded-md cursor-pointer hover:text-[#6B7280] transition-colors"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-body)" }}
            onClick={onBack}
          >
            Back
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {BUILD_STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full overflow-hidden transition-all duration-500"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: i <= currentStep || generating ? "#22D3EE" : "transparent" }}
                initial={{ width: "0%" }}
                animate={{ width: i < currentStep || generating ? "100%" : i === currentStep ? "50%" : "0%" }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </div>
          ))}
        </div>

        {/* Conversation thread */}
        <div
          ref={scrollRef}
          className="rounded-xl overflow-y-auto px-4 py-4 flex flex-col gap-4 mb-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            maxHeight: "calc(100vh - 22rem)",
            minHeight: 280,
          }}
        >
          {/* Sophia greeting */}
          <div className="flex gap-2.5">
            <SophiaMark size={12} glowing={false} />
            <p className="text-[12px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Since you're at the <strong className="text-[#E8E8ED]">mid-career stage</strong>, I'll skip the experience-level questions — I already have that context. I just need 5 quick details about your background and target, and I'll generate a polished first draft. Takes about 2 minutes.
            </p>
          </div>

          {/* Completed Q&A pairs */}
          {BUILD_STEPS.map((step, i) => {
            if (i > currentStep) return null;
            const StepIcon = step.icon;
            const answer = answers[step.id];

            return (
              <div key={step.id} className="flex flex-col gap-3">
                {/* Sophia question */}
                <motion.div
                  className="flex gap-2.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}
                  >
                    <StepIcon className="w-2.5 h-2.5 text-[#22D3EE]" />
                  </div>
                  <p className="text-[12px] text-[#E8E8ED] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {step.question}
                  </p>
                </motion.div>

                {/* Skill picker (for skills step, before answer) */}
                {step.id === "skills" && !answer && i === currentStep && (
                  <motion.div
                    className="flex flex-col gap-2 ml-7"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3, ease: EASE }}
                  >
                    <p className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                      Based on "{answers["target"] || "your target"}" — tap to select, or add your own:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skillSuggestions.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                            style={{
                              fontFamily: "var(--font-body)",
                              background: isSelected ? "rgba(179,255,59,0.1)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${isSelected ? "rgba(179,255,59,0.25)" : "rgba(255,255,255,0.06)"}`,
                              color: isSelected ? "#B3FF3B" : "#9CA3AF",
                            }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                            {skill}
                          </button>
                        );
                      })}
                      {/* Custom skills already added */}
                      {selectedSkills.filter((s) => !skillSuggestions.includes(s)).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                          style={{
                            fontFamily: "var(--font-body)",
                            background: "rgba(179,255,59,0.1)",
                            border: "1px solid rgba(179,255,59,0.25)",
                            color: "#B3FF3B",
                          }}
                        >
                          <Check className="w-2.5 h-2.5" />
                          {skill}
                        </button>
                      ))}
                      {/* Add custom skill */}
                      {showCustomInput ? (
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,211,238,0.2)" }}
                        >
                          <input
                            ref={customSkillRef}
                            type="text"
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addCustomSkill();
                              if (e.key === "Escape") { setShowCustomInput(false); setCustomSkillInput(""); }
                            }}
                            onBlur={() => { if (customSkillInput.trim()) addCustomSkill(); else setShowCustomInput(false); }}
                            placeholder="Type skill..."
                            className="w-20 text-[11px] text-[#E8E8ED] placeholder:text-[#374151] bg-transparent outline-none"
                            style={{ fontFamily: "var(--font-body)" }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomInput(true)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.05)]"
                          style={{
                            fontFamily: "var(--font-body)",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px dashed rgba(255,255,255,0.1)",
                            color: "#6B7280",
                          }}
                        >
                          <Plus className="w-2.5 h-2.5" /> Add skill
                        </button>
                      )}
                    </div>
                    {selectedSkills.length > 0 && (
                      <motion.button
                        onClick={handleSubmitSkills}
                        className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer mt-1"
                        style={{
                          fontFamily: "var(--font-body)",
                          background: "rgba(34,211,238,0.08)",
                          border: "1px solid rgba(34,211,238,0.15)",
                          color: "#22D3EE",
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        Continue with {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""} <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    )}
                  </motion.div>
                )}

                {/* User answer */}
                {answer && (
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <div className="max-w-[85%] px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>{answer}</p>
                    </div>
                  </motion.div>
                )}

                {/* Sophia follow-up */}
                {answer && step.sophiaFollowUp && (
                  <motion.div
                    className="flex gap-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <SophiaMark size={12} glowing={false} />
                    <p className="text-[12px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                      {step.sophiaFollowUp}
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Sophia typing indicator */}
          {isTyping && (
            <motion.div
              className="flex gap-2.5 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SophiaMark size={12} glowing={false} />
              <div className="flex gap-1">
                {[0, 1, 2].map((dotIdx) => (
                  <motion.div
                    key={dotIdx}
                    className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: dotIdx * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Generation progress */}
          {generating && (
            <motion.div
              className="flex flex-col gap-2 mt-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-2.5 mb-2">
                <SophiaMark size={12} glowing />
                <p className="text-[12px] text-[#E8E8ED] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Perfect. Give me a moment — I'm building your resume now.
                </p>
              </div>
              {GEN_STEPS.map((label, i) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                  style={{
                    background: genStep > i ? "rgba(179,255,59,0.03)" : "rgba(255,255,255,0.015)",
                    border: `1px solid ${genStep > i ? "rgba(179,255,59,0.08)" : "rgba(255,255,255,0.04)"}`,
                  }}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: genStep >= i ? 1 : 0.3 }}
                >
                  {genStep > i ? (
                    <Check className="w-3.5 h-3.5 text-[#B3FF3B] flex-shrink-0" />
                  ) : genStep === i ? (
                    <motion.div
                      className="w-3.5 h-3.5 rounded-full border-2 border-[#22D3EE] border-t-transparent flex-shrink-0"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-[rgba(255,255,255,0.08)] flex-shrink-0" />
                  )}
                  <span
                    className={`text-[11px] ${genStep > i ? "text-[#9CA3AF]" : genStep === i ? "text-[#E8E8ED]" : "text-[#374151]"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Input bar — hidden on skills step (pill picker replaces it) */}
        {!generating && !isSkillsStep && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={currentStep < BUILD_STEPS.length ? BUILD_STEPS[currentStep].placeholder : ""}
              disabled={isTyping}
              className="flex-1 text-[12px] text-[#E8E8ED] placeholder:text-[#374151] bg-transparent outline-none disabled:text-[#374151]"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors">
              <Mic className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
            <button
              className="p-1 rounded-md hover:bg-[rgba(34,211,238,0.06)] cursor-pointer transition-colors disabled:opacity-30"
              onClick={handleSubmit}
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-3.5 h-3.5 text-[#22D3EE]" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Analyzing State ────────────────────────────────────────────────────────

function AnalyzingState({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Parsing structure...", duration: 800 },
    { label: "Scanning 400+ keywords for Product Designer...", duration: 1200 },
    { label: "Analyzing impact language...", duration: 1000 },
    { label: "Checking ATS compatibility...", duration: 800 },
    { label: "Preparing suggestions...", duration: 600 },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    steps.forEach((s, i) => {
      elapsed += s.duration;
      timers.push(setTimeout(() => setStep(i + 1), elapsed));
    });
    const total = steps.reduce((a, s) => a + s.duration, 0);
    timers.push(setTimeout(onComplete, total + 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <motion.div className="max-w-[440px] w-full flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SophiaMark size={32} glowing />
        <p className="text-[14px] text-[#E8E8ED] mt-6 mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Analyzing your resume...
        </p>
        <div className="w-full flex flex-col gap-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: step > i ? "rgba(34,211,238,0.03)" : "rgba(255,255,255,0.015)",
                border: `1px solid ${step > i ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.04)"}`,
              }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: step >= i ? 1 : 0.3 }}
            >
              {step > i ? (
                <Check className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />
              ) : step === i ? (
                <motion.div className="w-4 h-4 rounded-full border-2 border-[#22D3EE] border-t-transparent flex-shrink-0" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.08)] flex-shrink-0" />
              )}
              <span className={`text-[12px] ${step > i ? "text-[#9CA3AF]" : step === i ? "text-[#E8E8ED]" : "text-[#374151]"}`}
                style={{ fontFamily: "var(--font-body)" }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Inline Diff Block ───────────────���──────────────────────────────────────
// Shows current (strikethrough) → suggested (green) directly on the document

function InlineDiff({ suggestion, justAccepted }: { suggestion: Suggestion; justAccepted?: boolean }) {
  if (suggestion.status === "accepted") {
    return (
      <motion.span
        className="text-[#E8E8ED] inline"
        initial={justAccepted ? { backgroundColor: "rgba(179,255,59,0.15)" } : false}
        animate={{ backgroundColor: "rgba(179,255,59,0)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B3FF3B] mr-1.5 -mt-0.5 align-middle" />
        {suggestion.suggested}
      </motion.span>
    );
  }

  if (suggestion.status === "rejected") {
    return <span className="text-[#9CA3AF]">{suggestion.original}</span>;
  }

  // Pending — show both with visual diff
  return (
    <span>
      <span className="line-through text-[#994444]">{suggestion.original}</span>
      <span className="block mt-1.5 px-2 py-1 rounded-md text-[#B3FF3B]" style={{ background: "rgba(179,255,59,0.03)", border: "1px solid rgba(179,255,59,0.08)" }}>
        <Sparkles className="w-2.5 h-2.5 inline mr-1 -mt-0.5 text-[#B3FF3B]" />
        {suggestion.suggested}
      </span>
    </span>
  );
}

// ─── Document Preview (left column) ─────────────────────────────────────────

function DocumentPreview({ suggestions, activeSuggestionKey, onSectionClick, justAcceptedId }: {
  suggestions: Suggestion[];
  activeSuggestionKey: string | null;
  onSectionClick: (key: string) => void;
  justAcceptedId: string | null;
}) {
  const getSuggestion = (key: string) => suggestions.find((s) => s.sectionKey === key);

  const sectionStyle = (key: string) => {
    const isActive = activeSuggestionKey === key;
    const sug = getSuggestion(key);
    const hasSuggestion = !!sug;
    return {
      background: isActive
        ? "rgba(34,211,238,0.04)"
        : hasSuggestion && sug!.status === "pending"
          ? "rgba(179,255,59,0.01)"
          : "transparent",
      border: isActive
        ? "1px solid rgba(34,211,238,0.15)"
        : hasSuggestion && sug!.status === "pending"
          ? "1px solid rgba(179,255,59,0.06)"
          : "1px solid transparent",
      cursor: hasSuggestion ? "pointer" : "default",
      borderRadius: 10,
      padding: "10px 12px",
      marginLeft: -12,
      marginRight: -12,
      transition: "all 0.25s ease",
    };
  };

  const renderText = (key: string, fallback: string) => {
    const sug = getSuggestion(key);
    if (!sug) return <span className="text-[#9CA3AF]">{fallback}</span>;
    return <InlineDiff suggestion={sug} justAccepted={sug.id === justAcceptedId} />;
  };

  return (
    <motion.div
      className="rounded-2xl overflow-auto mx-auto"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        maxHeight: "calc(100vh - 8rem)",
        width: "100%",
        maxWidth: 640,
        aspectRatio: "8.5 / 11",
        padding: "40px 36px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.02)",
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
    >
      {/* Header */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <h2 className="text-[18px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sharon Chen</h2>
        <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
          sharon.chen@email.com · San Francisco, CA · linkedin.com/in/sharonchen
        </p>
      </div>

      {/* Summary */}
      <div style={sectionStyle("summary")} onClick={() => onSectionClick("summary")}>
        <h3 className="text-[11px] text-[#22D3EE] mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SUMMARY</h3>
        <div className="text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {renderText("summary", "Experienced professional looking for new opportunities in product design.")}
        </div>
      </div>

      {/* Experience */}
      <div className="mt-4">
        <h3 className="text-[11px] text-[#22D3EE] mb-1.5 tracking-wide px-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EXPERIENCE</h3>
        <div className="px-3 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>Revenue Ops Manager</span>
            <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>2020 – Present</span>
          </div>
          <span className="text-[11px] text-[#6B7280] block mb-2" style={{ fontFamily: "var(--font-body)" }}>TechCorp Inc.</span>
        </div>

        <div style={sectionStyle("exp-1")} onClick={() => onSectionClick("exp-1")}>
          <div className="text-[12px] leading-relaxed flex gap-2" style={{ fontFamily: "var(--font-body)" }}>
            <span className="text-[#374151] mt-0.5 flex-shrink-0">•</span>
            <span>{renderText("exp-1", "Managed team operations and improved workflow efficiency.")}</span>
          </div>
        </div>

        <div style={sectionStyle("exp-2")} onClick={() => onSectionClick("exp-2")}>
          <div className="text-[12px] leading-relaxed flex gap-2" style={{ fontFamily: "var(--font-body)" }}>
            <span className="text-[#374151] mt-0.5 flex-shrink-0">•</span>
            <span>{renderText("exp-2", "Created dashboards and reports for stakeholders.")}</span>
          </div>
        </div>

        <div className="px-3 mt-1">
          <div className="text-[12px] text-[#9CA3AF] leading-relaxed flex gap-2" style={{ fontFamily: "var(--font-body)" }}>
            <span className="text-[#374151] mt-0.5">•</span>
            Spearheaded quarterly business reviews with C-suite stakeholders
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4" style={sectionStyle("skills")} onClick={() => onSectionClick("skills")}>
        <h3 className="text-[11px] text-[#22D3EE] mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>SKILLS</h3>
        <div className="text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {renderText("skills", "Excel, SQL, Salesforce, Project Management")}
        </div>
      </div>

      {/* Education */}
      <div className="mt-4 px-3">
        <h3 className="text-[11px] text-[#22D3EE] mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EDUCATION</h3>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>B.S. Business Administration — UC Berkeley</span>
          <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>2016</span>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-4 px-3">
        <h3 className="text-[11px] text-[#22D3EE] mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>PROJECTS</h3>
        <div className="text-[12px] text-[#9CA3AF] flex flex-col gap-1.5" style={{ fontFamily: "var(--font-body)" }}>
          <div className="flex gap-2"><span className="text-[#374151]">•</span> Fitness App Redesign — Case Study</div>
          <div className="flex gap-2"><span className="text-[#374151]">•</span> E-commerce Checkout Flow — Case Study</div>
          <div className="flex gap-2"><span className="text-[#374151]">•</span> Design System Starter Kit — Open Source</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Compact Score Bar (collapsible) ────────────────────────────────────────

function ScoreBar({ score, breakdown, verdicts, onSectionClick, onNavigate }: {
  score: number;
  breakdown: ScoreBreakdown[];
  verdicts: typeof SECTION_VERDICTS;
  onSectionClick: (key: string) => void;
  onNavigate: NavigateFn;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="rounded-xl overflow-hidden flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
    >
      {/* Compact bar — always visible */}
      <div
        className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[rgba(255,255,255,0.01)] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Score badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: score >= 80 ? "rgba(179,255,59,0.08)" : "rgba(34,211,238,0.08)",
            border: `1px solid ${score >= 80 ? "rgba(179,255,59,0.15)" : "rgba(34,211,238,0.15)"}`,
          }}>
            <span className="text-[14px] tabular-nums" style={{
              color: score >= 80 ? "#B3FF3B" : "#22D3EE",
              fontFamily: "var(--font-display)", fontWeight: 500,
            }}>{score}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ATS Score</span>
            <span className="text-[9px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Product Designer</span>
          </div>
        </div>

        {/* Mini breakdown bars */}
        <div className="flex-1 flex gap-1 items-center px-2">
          {breakdown.map((item) => (
            <div key={item.label} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="h-full rounded-full" style={{ background: item.color, width: `${(item.score / item.max) * 100}%` }} />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] cursor-pointer transition-colors"
            style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.12)", color: "#B3FF3B", fontFamily: "var(--font-display)", fontWeight: 500 }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Download className="w-3 h-3" /> Save
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] cursor-pointer transition-colors"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}
            onClick={(e) => { e.stopPropagation(); onNavigate("jobs"); }}
          >
            <Briefcase className="w-3 h-3 text-[#22D3EE]" /> Jobs
          </button>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#374151]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#374151]" />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {/* Full breakdown */}
              <div className="flex flex-col gap-1.5 mb-3">
                {breakdown.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6B7280] w-[70px] text-right truncate" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="h-full rounded-full" style={{ background: item.color, width: `${(item.score / item.max) * 100}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums w-[20px] text-right" style={{ color: item.color, fontFamily: "var(--font-body)" }}>{item.score}</span>
                  </div>
                ))}
              </div>

              {/* Section verdicts */}
              <div className="flex flex-wrap gap-1">
                {verdicts.map((s) => {
                  const colors = { good: "#22C55E", warn: "#F59E0B", fix: "#EF4444" };
                  const icons = { good: Check, warn: AlertTriangle, fix: Target };
                  const VIcon = icons[s.verdict];
                  return (
                    <button
                      key={s.name}
                      className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[rgba(255,255,255,0.015)] cursor-pointer transition-colors"
                      onClick={() => onSectionClick(s.key)}
                    >
                      <VIcon className="w-2.5 h-2.5" style={{ color: colors[s.verdict] }} />
                      <span className="text-[10px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{s.name}</span>
                      <span className="text-[8px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{s.detail}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Sophia Coaching Chat ───────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "sophia" | "user" | "system";
  content: string;
  suggestion?: Suggestion;
  promptAction?: boolean;
}

function SophiaCoachingChat({ messages, onSend, onAccept, onReject, onUndo, onStartSuggestions, onNavigate }: {
  messages: ChatMessage[];
  onSend: (msg: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onUndo: (id: string) => void;
  onStartSuggestions?: () => void;
  onNavigate: NavigateFn;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <SophiaMark size={14} glowing={false} />
        <span className="text-[11px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia — Resume Coach</span>
        <span className="text-[9px] text-[#374151] ml-auto" style={{ fontFamily: "var(--font-body)" }}>Chat with me as we edit</span>
      </div>

      {/* Messages — takes all available space */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "sophia" && (
              <div className="flex gap-2.5">
                <SophiaMark size={12} glowing={false} />
                <div className="flex-1">
                  {/* Exit chips */}
                  {msg.content === "__EXIT_CHIPS__" ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:brightness-110"
                        style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.12)", color: "#22D3EE", fontFamily: "var(--font-display)", fontWeight: 500 }}
                        onClick={() => onNavigate("jobs")}
                      >
                        <Search className="w-3 h-3" /> See matching jobs
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:brightness-110"
                        style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.12)", color: "#B3FF3B", fontFamily: "var(--font-display)", fontWeight: 500 }}
                        onClick={() => onNavigate("edgepath")}
                      >
                        <Compass className="w-3 h-3" /> Back to roadmap
                      </button>
                    </div>
                  ) : (
                  <>
                  <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-2" style={{ fontFamily: "var(--font-body)" }}>
                    {msg.content}
                  </p>

                  {/* Prompt action — "Show me" button */}
                  {msg.promptAction && onStartSuggestions && (
                    <motion.button
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-colors hover:brightness-110 mt-1"
                      style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.12)", color: "#B3FF3B", fontFamily: "var(--font-display)", fontWeight: 500 }}
                      onClick={onStartSuggestions}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Sparkles className="w-3 h-3" /> Show me the suggestions
                    </motion.button>
                  )}

                  {/* Suggestion card — compact since diff is on the document */}
                  {msg.suggestion && (
                    <div className="rounded-lg overflow-hidden mb-1" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="px-3 py-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                            {msg.suggestion.section}
                          </span>
                          {msg.suggestion.status === "accepted" && (
                            <span className="text-[9px] text-[#B3FF3B] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(179,255,59,0.06)" }}>Applied</span>
                          )}
                          {msg.suggestion.status === "rejected" && (
                            <span className="text-[9px] text-[#6B7280] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.03)" }}>Skipped</span>
                          )}
                        </div>

                        {/* Reason */}
                        <p className="text-[10px] text-[#6B7280] leading-relaxed mb-2" style={{ fontFamily: "var(--font-body)" }}>
                          <Sparkles className="w-2.5 h-2.5 text-[#22D3EE] inline mr-1 -mt-0.5" />
                          {msg.suggestion.reason}
                        </p>

                        {/* Actions */}
                        {msg.suggestion.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors"
                              style={{ background: "rgba(179,255,59,0.06)", border: "1px solid rgba(179,255,59,0.12)", color: "#B3FF3B", fontFamily: "var(--font-body)" }}
                              onClick={() => onAccept(msg.suggestion!.id)}
                            >
                              <Check className="w-3 h-3" /> Accept
                            </button>
                            <button
                              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors"
                              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#6B7280", fontFamily: "var(--font-body)" }}
                              onClick={() => onReject(msg.suggestion!.id)}
                            >
                              <X className="w-3 h-3" /> Skip
                            </button>
                          </div>
                        )}
                        {msg.suggestion.status === "accepted" && (
                          <button
                            className="flex items-center gap-1 text-[10px] text-[#6B7280] cursor-pointer hover:text-[#9CA3AF] transition-colors"
                            style={{ fontFamily: "var(--font-body)" }}
                            onClick={() => onUndo(msg.suggestion!.id)}
                          >
                            <Undo2 className="w-3 h-3" /> Undo this change
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  </>
                  )}
                </div>
              </div>
            )}

            {msg.role === "user" && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[12px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>{msg.content}</p>
                </div>
              </div>
            )}

            {msg.role === "system" && (
              <div className="text-center py-1">
                <span className="text-[10px] text-[#374151] px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.02)", fontFamily: "var(--font-body)" }}>
                  {msg.content}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input — always at bottom */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask Sophia about your resume..."
            className="flex-1 text-[12px] text-[#E8E8ED] placeholder:text-[#374151] bg-transparent outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors">
            <Mic className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
          <button className="p-1 rounded-md hover:bg-[rgba(34,211,238,0.06)] cursor-pointer transition-colors" onClick={handleSubmit}>
            <Send className="w-3.5 h-3.5 text-[#22D3EE]" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function ResumeEdge({ role = "edgestar", onNavigate }: { role?: RoleId; onNavigate: NavigateFn }) {
  const [state, setState] = useState<ResumeState>("empty");
  const [buildSource, setBuildSource] = useState<"upload" | "build">("upload");
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [overallScore, setOverallScore] = useState(78);
  const [activeSuggestionKey, setActiveSuggestionKey] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [justAcceptedId, setJustAcceptedId] = useState<string | null>(null);

  // Sequential reveal phases for active state
  const [revealPhase, setRevealPhase] = useState<"doc" | "score" | "prompt" | "full">("doc");

  // Build initial chat on entering active state — with sequential reveal
  useEffect(() => {
    if (state !== "active") return;

    // Reset reveal
    setRevealPhase("doc");

    const introContent = buildSource === "build"
      ? "Here's your first draft — I used your experience details and optimized it against your Product Designer target."
      : "I've analyzed your resume against 23 Product Designer listings.";

    const initialMessages: ChatMessage[] = [
      {
        id: "intro",
        role: "sophia",
        content: introContent,
      },
    ];
    setChatMessages(initialMessages);

    // Phase 1: Show doc immediately (already visible)
    // Phase 2: Score fills in after 1.2s
    const t1 = setTimeout(() => setRevealPhase("score"), 1200);

    // Phase 3: After score, Sophia asks about suggestions (2.4s)
    const t2 = setTimeout(() => {
      setRevealPhase("prompt");
      setChatMessages((prev) => [
        ...prev,
        {
          id: "score-reveal",
          role: "sophia",
          content: `Your ATS score is 78 — ${buildSource === "build" ? "a strong starting point for a first draft" : "solid foundation, room to grow"}. I found 4 sections where targeted changes will significantly improve your match rate.`,
        },
        {
          id: "prompt-suggestions",
          role: "sophia",
          content: "Want to see my suggestions? I'll walk you through each one.",
          promptAction: true,
        },
      ]);
    }, 2400);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [state]);

  const startSuggestions = useCallback(() => {
    setRevealPhase("full");
    // Remove the prompt message and add the first suggestion
    setChatMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== "prompt-suggestions");
      if (INITIAL_SUGGESTIONS.length > 0) {
        filtered.push({
          id: "sys-1",
          role: "system",
          content: buildSource === "build"
            ? "First draft generated — review suggestions on your resume."
            : "Sections with pending suggestions are highlighted on your resume.",
        });
        filtered.push({
          id: `sug-${INITIAL_SUGGESTIONS[0].id}`,
          role: "sophia",
          content: `Let's start with your **${INITIAL_SUGGESTIONS[0].section}**. I've highlighted the current text and my suggested replacement directly on your resume. Here's why this change matters:`,
          suggestion: INITIAL_SUGGESTIONS[0],
        });
        setActiveSuggestionKey(INITIAL_SUGGESTIONS[0].sectionKey);
      }
      return filtered;
    });
    setSuggestionIndex(1);
  }, [buildSource]);

  const advanceToNextSuggestion = useCallback((afterId: string) => {
    setSuggestionIndex((prev) => {
      const nextIdx = prev;
      if (nextIdx < INITIAL_SUGGESTIONS.length) {
        const nextSug = INITIAL_SUGGESTIONS[nextIdx];
        setTimeout(() => {
          setChatMessages((msgs) => [
            ...msgs,
            {
              id: `sug-${nextSug.id}`,
              role: "sophia",
              content: `Next up — your **${nextSug.section}**. I've updated the highlight on your resume:`,
              suggestion: { ...nextSug },
            },
          ]);
          setActiveSuggestionKey(nextSug.sectionKey);
        }, 600);
        return prev + 1;
      } else {
        setTimeout(() => {
          setChatMessages((msgs) => [
            ...msgs,
            {
              id: "done",
              role: "sophia",
              content: `That's all my suggestions! Your score has improved. You can keep chatting with me to refine further, or take your next step:`,
            },
            {
              id: "exit-chips",
              role: "sophia",
              content: "__EXIT_CHIPS__",
            },
          ]);
          setActiveSuggestionKey(null);
        }, 600);
        return prev;
      }
    });
  }, []);

  const handleAccept = useCallback((id: string) => {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "accepted" } : s));
    setChatMessages((prev) => prev.map((msg) =>
      msg.suggestion?.id === id ? { ...msg, suggestion: { ...msg.suggestion, status: "accepted" as const } } : msg
    ));
    setOverallScore((prev) => Math.min(prev + 4, 98));
    // Lime flash on document
    setJustAcceptedId(id);
    setTimeout(() => setJustAcceptedId(null), 1500);
    setChatMessages((prev) => [...prev, { id: `sys-acc-${id}`, role: "system", content: "Change applied — visible on your resume" }]);
    advanceToNextSuggestion(id);
  }, [advanceToNextSuggestion]);

  const handleReject = useCallback((id: string) => {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "rejected" } : s));
    setChatMessages((prev) => prev.map((msg) =>
      msg.suggestion?.id === id ? { ...msg, suggestion: { ...msg.suggestion, status: "rejected" as const } } : msg
    ));
    advanceToNextSuggestion(id);
  }, [advanceToNextSuggestion]);

  const handleUndo = useCallback((id: string) => {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, status: "pending" } : s));
    setChatMessages((prev) => prev.map((msg) =>
      msg.suggestion?.id === id ? { ...msg, suggestion: { ...msg.suggestion, status: "pending" as const } } : msg
    ));
    setOverallScore((prev) => Math.max(prev - 4, 0));
    setChatMessages((prev) => [...prev, { id: `sys-undo-${id}`, role: "system", content: "Change reverted on your resume" }]);
    setActiveSuggestionKey(suggestions.find((s) => s.id === id)?.sectionKey || null);
  }, [suggestions]);

  const handleChatSend = useCallback((msg: string) => {
    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: msg }]);
    setTimeout(() => {
      setChatMessages((prev) => [...prev, {
        id: `s-${Date.now()}`,
        role: "sophia",
        content: "Good question. Let me think about that in context of your target roles and current resume. I can rephrase any section, add specific keywords, or adjust the tone — just tell me which section and what you'd like changed.",
      }]);
    }, 1000);
  }, []);

  const handleSectionClick = useCallback((key: string) => {
    setActiveSuggestionKey((prev) => prev === key ? null : key);
  }, []);

  if (state === "empty") {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
        <SophiaForwardBackground />
        <SharedTopNav role={role} onOpenSophia={() => {}} />
        <div className="mt-14">
          <EmptyState onUpload={() => { setBuildSource("upload"); setState("parseConfirm"); }} onBuildFromScratch={() => { setBuildSource("build"); setState("building"); }} />
        </div>
      </div>
    );
  }

  if (state === "building") {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
        <SophiaForwardBackground />
        <SharedTopNav role={role} onOpenSophia={() => {}} />
        <div className="mt-14">
          <BuildFromScratchState onComplete={() => setState("active")} onBack={() => setState("empty")} />
        </div>
      </div>
    );
  }

  if (state === "parseConfirm") {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
        <SophiaForwardBackground />
        <SharedTopNav role={role} onOpenSophia={() => {}} />
        <div className="mt-14">
          <ParseConfirmState onConfirm={() => setState("analyzing")} onBack={() => setState("empty")} />
        </div>
      </div>
    );
  }

  if (state === "analyzing") {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
        <SophiaForwardBackground />
        <SharedTopNav role={role} onOpenSophia={() => {}} />
        <div className="mt-14">
          <AnalyzingState onComplete={() => setState("active")} />
        </div>
      </div>
    );
  }

  const acceptedCount = suggestions.filter((s) => s.status === "accepted").length;
  const pendingCount = suggestions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#08090C" }}>
      <SophiaForwardBackground />
      <SharedTopNav role={role} onOpenSophia={() => {}} />

      <main className="mt-14 px-6 pb-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div
            className="pt-5 pb-3 flex items-center justify-between"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
          >
            <div>
              <h1 className="text-[20px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ResumeEdge</h1>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                  Optimizing for: <span className="text-[#22D3EE]">Product Designer</span>
                </span>
                <span className="text-[10px] text-[#374151]">·</span>
                <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
                  {acceptedCount} applied · {pendingCount} pending
                </span>
              </div>
            </div>
            <button
              className="text-[10px] px-2.5 py-1 rounded-md cursor-pointer"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#374151", fontFamily: "var(--font-body)" }}
              onClick={() => setState("empty")}
            >
              Upload New
            </button>
          </motion.div>

          {/* Two-column: Document LEFT | Score bar + Chat RIGHT */}
          <div className="grid grid-cols-[1fr_420px] gap-5" style={{ height: "calc(100vh - 9rem)" }}>
            {/* Left: Live Document with inline diffs */}
            <DocumentPreview
              suggestions={suggestions}
              activeSuggestionKey={activeSuggestionKey}
              onSectionClick={handleSectionClick}
              justAcceptedId={justAcceptedId}
            />

            {/* Right: Compact score bar (top) + Full-height Sophia chat */}
            <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 9rem)" }}>
              {/* Score bar — reveals after doc, phase 2 */}
              <AnimatePresence>
                {(revealPhase === "score" || revealPhase === "prompt" || revealPhase === "full") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <ScoreBar
                      score={overallScore}
                      breakdown={SCORE_BREAKDOWN}
                      verdicts={SECTION_VERDICTS}
                      onSectionClick={handleSectionClick}
                      onNavigate={onNavigate}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sophia coaching chat — fills ALL remaining space */}
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <SophiaCoachingChat
                  messages={chatMessages}
                  onSend={handleChatSend}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onUndo={handleUndo}
                  onStartSuggestions={revealPhase === "prompt" ? startSuggestions : undefined}
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}