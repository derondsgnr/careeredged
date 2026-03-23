/**
 * EditAnswersPanel — slides in from the right on roadmap screens.
 * Shows each question with the current answer. Tap an answer to change it.
 * The roadmap regenerates in response.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, ChevronDown, Check,
  User, Briefcase, Building2,
  Search, Rocket, Shield, Lightbulb, Users, BookOpen, Target, BarChart3,
  Compass, Zap, TrendingUp, Award, Sparkles,
} from "lucide-react";

interface Option { id: string; label: string; icon: React.ReactNode }

const INTENTS: Option[] = [
  { id: "career", label: "Building my career", icon: <User className="w-3.5 h-3.5" /> },
  { id: "someone", label: "Guiding someone else", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: "org", label: "Representing an org", icon: <Building2 className="w-3.5 h-3.5" /> },
];

const SUBS: Record<string, Option[]> = {
  career: [
    { id: "edgestar", label: "Finding opportunities", icon: <Search className="w-3.5 h-3.5" /> },
    { id: "edgepreneur", label: "Building a business", icon: <Rocket className="w-3.5 h-3.5" /> },
  ],
  someone: [
    { id: "parent", label: "Family member", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "guide", label: "Clients / mentees", icon: <Lightbulb className="w-3.5 h-3.5" /> },
  ],
  org: [
    { id: "employer", label: "Hiring talent", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "edu", label: "Education", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "ngo", label: "Non-profit", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "agency", label: "Government", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ],
};

const TARGETS: Option[] = [
  { id: "design", label: "Product Design", icon: <Compass className="w-3.5 h-3.5" /> },
  { id: "eng", label: "Software Engineering", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "data", label: "Data Science", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "pm", label: "Product Management", icon: <Target className="w-3.5 h-3.5" /> },
  { id: "mktg", label: "Marketing", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "fin", label: "Finance", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "other", label: "Something else", icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const LEVELS: Option[] = [
  { id: "exploring", label: "Exploring", icon: <Compass className="w-3.5 h-3.5" /> },
  { id: "student", label: "Student", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "early", label: "Early career", icon: <Zap className="w-3.5 h-3.5" /> },
  { id: "mid", label: "Mid career", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "senior", label: "Senior", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "change", label: "Career changer", icon: <Rocket className="w-3.5 h-3.5" /> },
];

interface EditAnswersPanelProps {
  intent: string;
  sub: string;
  target: string;
  level: string;
  targetOptions?: Option[];
  levelOptions?: Option[];
  targetLabel?: string;
  levelLabel?: string;
  onClose: () => void;
  onChange: (field: "intent" | "sub" | "target" | "level", value: string) => void;
}

function QuestionRow({ label, currentId, options, field, onChange }: {
  label: string; currentId: string; options: Option[];
  field: "intent" | "sub" | "target" | "level";
  onChange: (field: "intent" | "sub" | "target" | "level", value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.id === currentId);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] text-ce-text-tertiary uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>{label}</span>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-[rgba(var(--ce-glass-tint),0.06)] hover:border-[rgba(var(--ce-role-edgestar-rgb),0.15)] transition-colors cursor-pointer"
        style={{ background: "rgba(var(--ce-glass-tint),0.025)" }}>
        <div className="flex items-center gap-2">
          {current && <span className="text-ce-cyan">{current.icon}</span>}
          <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>
            {current?.label || "Select..."}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronDown className="w-3.5 h-3.5 text-ce-text-tertiary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="flex flex-col gap-1 pl-1"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {options.map(o => (
              <button key={o.id}
                onClick={() => { onChange(field, o.id); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-[12px] ${
                  o.id === currentId
                    ? "bg-[rgba(var(--ce-role-edgestar-rgb),0.08)] text-ce-text-primary border border-[rgba(var(--ce-role-edgestar-rgb),0.12)]"
                    : "text-ce-text-secondary hover:bg-[rgba(var(--ce-glass-tint),0.03)] border border-transparent"
                }`}
                style={{ fontFamily: "var(--font-body)" }}>
                <span className={o.id === currentId ? "text-ce-cyan" : "text-ce-text-tertiary"}>{o.icon}</span>
                {o.label}
                {o.id === currentId && <Check className="w-3 h-3 text-ce-cyan ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EditAnswersPanel({ intent, sub, target, level, targetOptions, levelOptions, targetLabel, levelLabel, onClose, onChange }: EditAnswersPanelProps) {
  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 z-50 w-[280px] flex flex-col"
      style={{
        background: "rgba(10,12,16,0.95)",
        borderLeft: "1px solid rgba(var(--ce-glass-tint),0.06)",
        backdropFilter: "blur(20px)",
        boxShadow: "-4px 0 30px rgba(var(--ce-shadow-tint),0.4)",
      }}
      initial={{ x: 280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 280, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(var(--ce-glass-tint),0.06)]">
        <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Edit answers
        </span>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(var(--ce-glass-tint),0.04)] transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5 text-ce-text-tertiary" />
        </button>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        <QuestionRow label="I am" currentId={intent} options={INTENTS} field="intent" onChange={onChange} />
        <QuestionRow label="Specifically" currentId={sub} options={SUBS[intent] || []} field="sub" onChange={onChange} />
        <QuestionRow label={targetLabel || "Field"} currentId={target} options={targetOptions || TARGETS} field="target" onChange={onChange} />
        <QuestionRow label={levelLabel || "Level"} currentId={level} options={levelOptions || LEVELS} field="level" onChange={onChange} />
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-[rgba(var(--ce-glass-tint),0.04)]">
        <p className="text-[11px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
          Changes update your results instantly.
        </p>
      </div>
    </motion.div>
  );
}
