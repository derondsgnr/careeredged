import { EASE } from "../tokens";
/**
 * Budget Surface — Career Investment Tracker
 *
 * Track career spending across categories: courses, coaching, certifications,
 * events, immigration, and tools. Sophia provides ROI projections and
 * spending insights.
 *
 * Layer 3 scope:
 * - KPI row (invested, monthly, remaining, ROI)
 * - Monthly spend chart (horizontal stacked bars)
 * - Category breakdown (progress bars)
 * - Transaction history (scrollable list)
 * - Sophia spending insight
 * - Add transaction modal (full form)
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3,
  ArrowRight, ArrowUpRight, Plus, ChevronRight, ChevronDown,
  Clock, BookOpen, Users, Award, Calendar, Wrench, Globe,
  Sparkles, Check, X, Circle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type SpendCategory = "courses" | "coaching" | "certifications" | "events" | "immigration" | "tools";
type SurfaceState = "empty" | "building" | "active";

interface Transaction {
  id: string;
  item: string;
  category: SpendCategory;
  amount: number;
  date: string;
  linkedSurface?: string;
  note?: string;
}

interface BudgetProfile {
  totalBudget: number;
  totalSpent: number;
  monthlySpend: number;
  transactions: Transaction[];
  categories: Record<SpendCategory, number>;
}

// ─── Category Config ────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<SpendCategory, { label: string; color: string; icon: React.ReactNode }> = {
  courses:        { label: "Courses",        color: "var(--ce-role-edu)",          icon: <BookOpen className="w-3 h-3" /> },
  coaching:       { label: "Coaching",       color: "var(--ce-role-guide)",        icon: <Users className="w-3 h-3" /> },
  certifications: { label: "Certifications", color: "var(--ce-role-edgepreneur)",  icon: <Award className="w-3 h-3" /> },
  events:         { label: "Events",         color: "var(--ce-role-employer)",     icon: <Calendar className="w-3 h-3" /> },
  immigration:    { label: "Immigration",    color: "var(--ce-role-ngo)",          icon: <Globe className="w-3 h-3" /> },
  tools:          { label: "Tools",          color: "var(--ce-role-edgestar)",     icon: <Wrench className="w-3 h-3" /> },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const TRANSACTIONS: Transaction[] = [
  // Courses ($890)
  { id: "t1",  item: "UX Research Masterclass — Coursera",           category: "courses",        amount: 49,   date: "Jan 5, 2026" },
  { id: "t2",  item: "Product Management Bootcamp — GA",             category: "courses",        amount: 450,  date: "Jan 15, 2026", note: "Payment 1 of 3" },
  { id: "t3",  item: "Advanced SQL — DataCamp",                      category: "courses",        amount: 25,   date: "Feb 1, 2026" },
  { id: "t4",  item: "Data Viz with Python — Udemy",                 category: "courses",        amount: 29,   date: "Feb 14, 2026" },
  { id: "t5",  item: "Interview Prep Intensive — CareerEdge",        category: "courses",        amount: 99,   date: "Mar 1, 2026", linkedSurface: "courses" },
  { id: "t6",  item: "Public Speaking — Skillshare",                 category: "courses",        amount: 15,   date: "Mar 10, 2026" },
  { id: "t7",  item: "Full-Stack Web Dev — Codecademy",              category: "courses",        amount: 39,   date: "Mar 15, 2026" },
  { id: "t8",  item: "AI Foundations — Stanford",                    category: "courses",        amount: 184,  date: "Mar 20, 2026", note: "Deposit" },
  // Coaching ($680)
  { id: "t9",  item: "1:1 Career Coaching — Marcus Chen",            category: "coaching",       amount: 120,  date: "Jan 8, 2026", linkedSurface: "sessions" },
  { id: "t10", item: "1:1 Career Coaching — Marcus Chen",            category: "coaching",       amount: 120,  date: "Jan 22, 2026", linkedSurface: "sessions" },
  { id: "t11", item: "Resume Review Session",                        category: "coaching",       amount: 80,   date: "Feb 5, 2026" },
  { id: "t12", item: "1:1 Career Coaching — Marcus Chen",            category: "coaching",       amount: 120,  date: "Feb 19, 2026", linkedSurface: "sessions" },
  { id: "t13", item: "Mock Interview Session",                       category: "coaching",       amount: 120,  date: "Mar 5, 2026" },
  { id: "t14", item: "1:1 Career Coaching — Marcus Chen",            category: "coaching",       amount: 120,  date: "Mar 19, 2026", linkedSurface: "sessions" },
  // Certifications ($350)
  { id: "t15", item: "Google UX Design Certificate",                 category: "certifications", amount: 250,  date: "Feb 10, 2026" },
  { id: "t16", item: "HubSpot Content Marketing",                    category: "certifications", amount: 0,    date: "Feb 20, 2026", note: "Free" },
  { id: "t17", item: "AWS Cloud Practitioner Exam",                  category: "certifications", amount: 100,  date: "Mar 12, 2026" },
  // Events ($195)
  { id: "t18", item: "AI Career Summit 2026",                        category: "events",         amount: 45,   date: "Jan 20, 2026" },
  { id: "t19", item: "NYC Tech Networking Night",                    category: "events",         amount: 25,   date: "Feb 15, 2026" },
  { id: "t20", item: "Career Fair VIP Pass",                         category: "events",         amount: 75,   date: "Mar 1, 2026" },
  { id: "t21", item: "Resume Workshop",                              category: "events",         amount: 0,    date: "Mar 8, 2026", note: "Free" },
  { id: "t22", item: "Startup Pitch Night",                          category: "events",         amount: 50,   date: "Mar 22, 2026" },
  // Tools ($300)
  { id: "t23", item: "Figma Pro (annual)",                           category: "tools",          amount: 144,  date: "Jan 1, 2026" },
  { id: "t24", item: "LinkedIn Premium (3 mo)",                      category: "tools",          amount: 90,   date: "Jan 1, 2026" },
  { id: "t25", item: "Notion Plus",                                  category: "tools",          amount: 48,   date: "Jan 1, 2026" },
  { id: "t26", item: "Portfolio Hosting — Vercel Pro",               category: "tools",          amount: 18,   date: "Mar 1, 2026" },
];

const MOCK_BUDGET: BudgetProfile = {
  totalBudget: 3000,
  totalSpent: 2415,
  monthlySpend: 805,
  transactions: TRANSACTIONS,
  categories: {
    courses: 890,
    coaching: 680,
    certifications: 350,
    events: 195,
    immigration: 0,
    tools: 300,
  },
};

// Monthly breakdowns
const MONTHLY_DATA: { month: string; total: number; breakdown: Partial<Record<SpendCategory, number>> }[] = [
  { month: "Jan", total: 889, breakdown: { courses: 499, coaching: 240, events: 45, tools: 282, immigration: 0, certifications: 0 } },
  { month: "Feb", total: 619, breakdown: { courses: 54, coaching: 200, certifications: 250, events: 25, tools: 0, immigration: 0 } },
  { month: "Mar", total: 907, breakdown: { courses: 337, coaching: 240, certifications: 100, events: 125, tools: 18, immigration: 0 } },
];

// ─── Building pills ──────────────────────────────────────────────────────────

const BUDGET_PILLS = ["$500", "$1,000", "$2,500", "$5,000", "Custom"];
const CATEGORY_PILLS: { key: SpendCategory; label: string }[] = [
  { key: "courses", label: "Courses" },
  { key: "coaching", label: "Coaching" },
  { key: "certifications", label: "Certifications" },
  { key: "events", label: "Events" },
  { key: "immigration", label: "Immigration" },
  { key: "tools", label: "Tools" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getCategoryPercent(amount: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((amount / total) * 100);
}

// ─── Main Surface ────────────────────────────────────────────────────────────

export function BudgetSurface({ role, onNavigate }: { role?: string; onNavigate?: (t: string) => void }) {
  const navigate = useNavigate();
  const params = useParams();

  // State machine
  const stored = typeof window !== "undefined" ? localStorage.getItem("ce-budget-data") : null;
  const [surfaceState, setSurfaceState] = useState<SurfaceState>(stored ? "active" : "empty");

  // Building state
  const [buildStep, setBuildStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<SpendCategory[]>([]);

  // Active state
  const [budget, setBudget] = useState<BudgetProfile>(MOCK_BUDGET);
  const [sortNewest, setSortNewest] = useState(true);
  const [showAllTx, setShowAllTx] = useState(false);

  // Add transaction modal
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [txItem, setTxItem] = useState("");
  const [txCategory, setTxCategory] = useState<SpendCategory>("courses");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));
  const [txNote, setTxNote] = useState("");

  const accent = "var(--ce-cyan)";
  const budgetUsedPct = Math.round((budget.totalSpent / budget.totalBudget) * 100);
  const remaining = budget.totalBudget - budget.totalSpent;

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSetupBudget = () => {
    setSurfaceState("building");
    setBuildStep(1);
  };

  const handleBuildNext = () => {
    if (buildStep === 1 && !selectedBudget && !customBudget) {
      toast.error("Select or enter a budget amount");
      return;
    }
    if (buildStep === 2) {
      if (selectedCategories.length === 0) {
        toast.error("Select at least one category");
        return;
      }
      localStorage.setItem("ce-budget-data", JSON.stringify({ budget: selectedBudget || customBudget, categories: selectedCategories }));
      setSurfaceState("active");
      toast.success("Budget tracker ready!");
      return;
    }
    setBuildStep(2);
  };

  const handleSelectBudgetPill = (pill: string) => {
    if (pill === "Custom") {
      setShowCustomInput(true);
      setSelectedBudget(null);
    } else {
      setShowCustomInput(false);
      setCustomBudget("");
      setSelectedBudget(pill);
    }
  };

  const handleToggleCategory = (cat: SpendCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddTransaction = () => {
    setTxItem("");
    setTxCategory("courses");
    setTxAmount("");
    setTxDate(new Date().toISOString().slice(0, 10));
    setTxNote("");
    setShowAddTransaction(true);
  };

  const handleSubmitTransaction = () => {
    const amount = parseFloat(txAmount);
    if (!txItem.trim()) { toast.error("Enter an item name"); return; }
    if (isNaN(amount) || amount <= 0) { toast.error("Enter a valid amount"); return; }

    const newTx: Transaction = {
      id: `t${Date.now()}`,
      item: txItem.trim(),
      category: txCategory,
      amount,
      date: new Date(txDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      note: txNote.trim() || undefined,
    };

    setBudget(prev => {
      const updated = {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        totalSpent: prev.totalSpent + amount,
        categories: { ...prev.categories, [txCategory]: (prev.categories[txCategory] || 0) + amount },
      };
      // Recalculate monthly spend (transactions in current month)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      updated.monthlySpend = updated.transactions
        .filter(t => { const d = new Date(t.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
        .reduce((s, t) => s + t.amount, 0);
      return updated;
    });

    toast.success("Transaction added", `$${amount} for "${txItem.trim()}"`);
    setShowAddTransaction(false);
  };

  // Sort transactions
  const sortedTransactions = [...budget.transactions].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return sortNewest ? db - da : da - db;
  });
  const visibleTransactions = showAllTx ? sortedTransactions : sortedTransactions.slice(0, 10);

  // Active categories (non-zero)
  const activeCategories = (Object.entries(budget.categories) as [SpendCategory, number][])
    .filter(([, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  // Max monthly for bar scaling
  const maxMonthly = Math.max(...MONTHLY_DATA.map(m => m.total));

  // ─── Empty State ─────────────────────────────────────────────────────────

  if (surfaceState === "empty") {
    return (
      <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
        <div className="px-6 py-8 max-w-2xl mx-auto">
          <SophiaInsight
            variant="inline"
            message="I'll help you track every career investment and measure your ROI."
          />

          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
            >
              <DollarSign className="w-6 h-6 text-[var(--ce-text-tertiary)]" />
            </div>
            <h2
              className="text-[15px] text-[var(--ce-text-primary)] mb-1.5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              Career Budget
            </h2>
            <p
              className="text-[12px] text-[var(--ce-text-tertiary)] mb-6 max-w-[280px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Track your career investment and measure your ROI.
            </p>
            <button
              onClick={handleSetupBudget}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.97]"
              style={{
                background: "rgba(var(--ce-cyan-rgb),0.12)",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
                color: accent,
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Set Up Budget
            </button>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Building State ──────────────────────────────────────────────────────

  if (surfaceState === "building") {
    return (
      <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
        <div className="px-6 py-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map(step => (
                <div key={step} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: accent }}
                    initial={{ width: 0 }}
                    animate={{ width: buildStep >= step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </div>
              ))}
            </div>

            {/* Sophia card */}
            <GlassCard className="p-5 mb-6">
              <div className="flex items-start gap-3">
                <SophiaMark size={20} glowing />
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {buildStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p
                          className="text-[13px] text-[var(--ce-text-primary)] mb-4"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          What's your total career transition budget?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {BUDGET_PILLS.map(pill => {
                            const isCustom = pill === "Custom";
                            const selected = isCustom ? showCustomInput : selectedBudget === pill;
                            return (
                              <button
                                key={pill}
                                onClick={() => handleSelectBudgetPill(pill)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                                style={{
                                  background: selected ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.04)",
                                  border: selected ? "1px solid rgba(var(--ce-cyan-rgb),0.3)" : "1px solid rgba(var(--ce-glass-tint),0.08)",
                                  color: selected ? accent : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                }}
                              >
                                {selected && !isCustom && <Check className="w-3 h-3" />}
                                {pill}
                              </button>
                            );
                          })}
                        </div>
                        {showCustomInput && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.25, ease: EASE }}
                          >
                            <input
                              type="text"
                              placeholder="Enter amount (e.g. 3000)"
                              value={customBudget}
                              onChange={e => setCustomBudget(e.target.value.replace(/[^0-9]/g, ""))}
                              className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
                              style={{
                                background: "rgba(var(--ce-glass-tint),0.04)",
                                border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                                color: "var(--ce-text-primary)",
                                fontFamily: "var(--font-body)",
                              }}
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {buildStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p
                          className="text-[13px] text-[var(--ce-text-primary)] mb-4"
                          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                        >
                          What categories are you investing in?
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {CATEGORY_PILLS.map(({ key, label }) => {
                            const selected = selectedCategories.includes(key);
                            const cfg = CATEGORY_CONFIG[key];
                            return (
                              <button
                                key={key}
                                onClick={() => handleToggleCategory(key)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                                style={{
                                  background: selected ? `rgba(var(--ce-cyan-rgb),0.12)` : "rgba(var(--ce-glass-tint),0.04)",
                                  border: selected ? `1px solid rgba(var(--ce-cyan-rgb),0.3)` : "1px solid rgba(var(--ce-glass-tint),0.08)",
                                  color: selected ? accent : "var(--ce-text-secondary)",
                                  fontFamily: "var(--font-body)",
                                }}
                              >
                                {selected && <Check className="w-3 h-3" />}
                                {cfg.icon}
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "rgba(var(--ce-cyan-rgb),0.04)", border: "1px solid rgba(var(--ce-cyan-rgb),0.08)" }}>
                          <SophiaMark size={14} glowing={false} />
                          <p className="text-[11px] text-[var(--ce-text-tertiary)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                            I see you've spent $120 on coaching sessions — I'll track that automatically.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>

            {/* Next button */}
            <button
              onClick={handleBuildNext}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: "rgba(var(--ce-cyan-rgb),0.12)",
                border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
                color: accent,
                fontFamily: "var(--font-display)",
                fontWeight: 500,
              }}
            >
              {buildStep === 2 ? "Start Tracking" : "Continue"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </RoleShell>
    );
  }

  // ─── Active State ──────────────────────────────────────────────────────────

  return (
    <RoleShell role={(role as any) || "edgestar"} onNavigate={onNavigate}>
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Sophia context */}
        <SophiaInsight
          variant="inline"
          message="Your career budget — spending, progress, and projected returns."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col gap-5 mt-4"
        >
          {/* ─── KPI Row ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Invested */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <DollarSign className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Total Invested</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  {formatCurrency(budget.totalSpent)}
                </span>
                <TrendingUp className="w-3 h-3 text-[var(--ce-lime)]" />
              </div>
            </GlassCard>

            {/* Monthly Spend */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Monthly Spend</span>
              </div>
              <span className="text-[22px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {formatCurrency(budget.monthlySpend)}
              </span>
            </GlassCard>

            {/* Budget Remaining */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <PieChart className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Remaining</span>
              </div>
              <span className="text-[22px] text-[var(--ce-text-primary)] mb-2 block" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {formatCurrency(remaining)}
              </span>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: budgetUsedPct > 90 ? "var(--ce-status-warning)" : accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetUsedPct}%` }}
                  transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
                />
              </div>
              <span className="text-[10px] text-[var(--ce-text-quaternary)] mt-1 block" style={{ fontFamily: "var(--font-body)" }}>
                {budgetUsedPct}% used
              </span>
            </GlassCard>

            {/* Estimated ROI */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3 h-3 text-[var(--ce-text-quaternary)]" />
                <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Est. ROI</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] text-[var(--ce-lime)]" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  6.2x
                </span>
                <ArrowUpRight className="w-3 h-3 text-[var(--ce-lime)]" />
              </div>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>
                $15k target increase
              </span>
            </GlassCard>
          </div>

          {/* ─── Monthly Spending Chart ────────────────────────────────── */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Spending by Month
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {MONTHLY_DATA.map((month, mi) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="text-[11px] text-[var(--ce-text-secondary)] w-8 flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>
                    {month.month}
                  </span>
                  <div className="flex-1 h-[6px] rounded-full overflow-hidden flex" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                    {(Object.entries(month.breakdown) as [SpendCategory, number][])
                      .filter(([, amt]) => amt > 0)
                      .map(([cat, amt]) => {
                        const widthPct = (amt / maxMonthly) * 100;
                        return (
                          <motion.div
                            key={cat}
                            className="h-full"
                            style={{ background: CATEGORY_CONFIG[cat].color, minWidth: widthPct > 0 ? 2 : 0 }}
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ delay: 0.2 + mi * 0.1, duration: 0.5, ease: EASE }}
                          />
                        );
                      })}
                  </div>
                  <span className="text-[11px] text-[var(--ce-text-secondary)] w-12 text-right tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                    {formatCurrency(month.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
              {activeCategories.map(([cat, amt]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_CONFIG[cat].color }} />
                  <span className="text-[10px] text-[var(--ce-text-tertiary)]" style={{ fontFamily: "var(--font-body)" }}>
                    {CATEGORY_CONFIG[cat].label} · {formatCurrency(amt)}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ─── Category Breakdown ────────────────────────────────────── */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
              <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Category Breakdown
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {activeCategories.map(([cat, amt], ci) => {
                const pct = getCategoryPercent(amt, budget.totalSpent);
                const cfg = CATEGORY_CONFIG[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                        <span className="text-[12px] text-[var(--ce-text-secondary)]" style={{ fontFamily: "var(--font-body)" }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[var(--ce-text-primary)] tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                          {formatCurrency(amt)}
                        </span>
                        <span className="text-[10px] text-[var(--ce-text-quaternary)] tabular-nums w-8 text-right" style={{ fontFamily: "var(--font-body)" }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: cfg.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + ci * 0.08, duration: 0.5, ease: EASE }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* ─── Transaction History ────────────────────────────────────── */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)]" />
                <span className="text-[13px] text-[var(--ce-text-primary)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Recent Transactions
                </span>
              </div>
              <button
                onClick={() => setSortNewest(prev => !prev)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] cursor-pointer transition-colors hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                style={{ color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              >
                {sortNewest ? "Newest" : "Oldest"}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col" style={{ maxHeight: 400, overflowY: "auto" }}>
              {visibleTransactions.map((tx, i) => {
                const cfg = CATEGORY_CONFIG[tx.category];
                const hasLink = !!tx.linkedSurface;
                return (
                  <motion.div
                    key={tx.id}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors"
                    style={{ cursor: hasLink ? "pointer" : "default" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.25, ease: EASE }}
                    onClick={() => {
                      if (hasLink && onNavigate) onNavigate(tx.linkedSurface!);
                    }}
                    whileHover={{ backgroundColor: "rgba(var(--ce-glass-tint),0.04)" }}
                  >
                    {/* Date */}
                    <span className="text-[10px] text-[var(--ce-text-quaternary)] w-[70px] flex-shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)" }}>
                      {tx.date.replace(", 2026", "")}
                    </span>
                    {/* Category dot */}
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                    {/* Item */}
                    <span className="text-[12px] text-[var(--ce-text-secondary)] flex-1 min-w-0 truncate" style={{ fontFamily: "var(--font-body)" }}>
                      {tx.item}
                      {tx.note && (
                        <span className="text-[10px] text-[var(--ce-text-quaternary)] ml-1.5">({tx.note})</span>
                      )}
                    </span>
                    {/* Amount */}
                    <span className="text-[12px] text-[var(--ce-text-primary)] tabular-nums flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>
                      {tx.amount === 0 ? "Free" : formatCurrency(tx.amount)}
                    </span>
                    {/* Link indicator */}
                    {hasLink && <ChevronRight className="w-3 h-3 text-[var(--ce-text-quaternary)] flex-shrink-0" />}
                  </motion.div>
                );
              })}
            </div>

            {!showAllTx && sortedTransactions.length > 10 && (
              <button
                onClick={() => setShowAllTx(true)}
                className="w-full flex items-center justify-center gap-1.5 pt-3 mt-2 text-[11px] cursor-pointer transition-colors hover:text-[var(--ce-text-primary)]"
                style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}
              >
                Show all {sortedTransactions.length} transactions
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </GlassCard>

          {/* ─── Sophia Insight ──────────────────────────────────────── */}
          <SophiaInsight
            variant="inline"
            message={`You've invested ${formatCurrency(budget.totalSpent)} this quarter — ${budgetUsedPct}% of your ${formatCurrency(budget.totalBudget)} budget. At your target salary increase of $15k, that's a projected 6.2x return. Your biggest spend is courses at ${getCategoryPercent(budget.categories.courses, budget.totalSpent)}%.`}
          />

          {/* ─── Cross-surface chips ──────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate?.("courses")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.03)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              <BookOpen className="w-3 h-3" /> View courses <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate?.("sessions")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
              style={{
                background: "rgba(var(--ce-glass-tint),0.03)",
                border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                color: "var(--ce-text-secondary)",
                fontFamily: "var(--font-body)",
              }}
            >
              <Users className="w-3 h-3" /> View sessions <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* ─── Floating Add Button ───────────────────────────────────── */}
        <motion.button
          onClick={handleAddTransaction}
          className="fixed bottom-20 right-6 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-40"
          style={{
            background: "rgba(var(--ce-cyan-rgb),0.15)",
            border: "1px solid rgba(var(--ce-cyan-rgb),0.3)",
            color: accent,
            backdropFilter: "blur(12px)",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3, ease: EASE }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* ─── Add Transaction Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showAddTransaction && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
              onClick={() => setShowAddTransaction(false)}
            />
            <motion.div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                maxWidth: 440,
                background: "rgba(var(--ce-glass-tint),0.06)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
              }}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h3
                  className="text-[15px]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--ce-text-primary)" }}
                >
                  Add Transaction
                </h3>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.08)]"
                  style={{ color: "var(--ce-text-tertiary)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="px-5 pb-5 space-y-4">
                {/* Item name */}
                <div>
                  <label
                    className="block text-[11px] mb-1.5"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                  >
                    Item
                  </label>
                  <input
                    type="text"
                    value={txItem}
                    onChange={e => setTxItem(e.target.value)}
                    placeholder="e.g., UX Research Course"
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none transition-all"
                    style={{
                      background: "rgba(var(--ce-glass-tint),0.04)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                      color: "var(--ce-text-primary)",
                      fontFamily: "var(--font-body)",
                    }}
                    onFocus={e => (e.target.style.borderColor = "rgba(var(--ce-cyan-rgb),0.3)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(var(--ce-glass-tint),0.1)")}
                  />
                </div>

                {/* Category pills */}
                <div>
                  <label
                    className="block text-[11px] mb-1.5"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                  >
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CATEGORY_CONFIG) as SpendCategory[]).map(cat => {
                      const cfg = CATEGORY_CONFIG[cat];
                      const selected = txCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setTxCategory(cat)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all"
                          style={{
                            background: selected ? `rgba(${cfg.color === accent ? "var(--ce-cyan-rgb)" : "var(--ce-glass-tint)"}, ${selected ? 0.15 : 0.04})` : "rgba(var(--ce-glass-tint),0.04)",
                            border: `1px solid ${selected ? cfg.color : "rgba(var(--ce-glass-tint),0.08)"}`,
                            color: selected ? cfg.color : "var(--ce-text-tertiary)",
                            fontFamily: "var(--font-body)",
                            fontWeight: selected ? 500 : 400,
                          }}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount + Date row */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      className="block text-[11px] mb-1.5"
                      style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                    >
                      Amount
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]"
                        style={{ color: "var(--ce-text-quaternary)", fontFamily: "var(--font-body)" }}
                      >
                        $
                      </span>
                      <input
                        type="number"
                        value={txAmount}
                        onChange={e => setTxAmount(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 rounded-lg text-[13px] outline-none transition-all"
                        style={{
                          background: "rgba(var(--ce-glass-tint),0.04)",
                          border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                          color: "var(--ce-text-primary)",
                          fontFamily: "var(--font-body)",
                        }}
                        onFocus={e => (e.target.style.borderColor = "rgba(var(--ce-cyan-rgb),0.3)")}
                        onBlur={e => (e.target.style.borderColor = "rgba(var(--ce-glass-tint),0.1)")}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-[11px] mb-1.5"
                      style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      value={txDate}
                      onChange={e => setTxDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none transition-all"
                      style={{
                        background: "rgba(var(--ce-glass-tint),0.04)",
                        border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                        color: "var(--ce-text-primary)",
                        fontFamily: "var(--font-body)",
                        colorScheme: "dark",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(var(--ce-cyan-rgb),0.3)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(var(--ce-glass-tint),0.1)")}
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label
                    className="block text-[11px] mb-1.5"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)" }}
                  >
                    Note <span style={{ color: "var(--ce-text-quaternary)" }}>(optional)</span>
                  </label>
                  <textarea
                    value={txNote}
                    onChange={e => setTxNote(e.target.value)}
                    rows={2}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 rounded-lg text-[13px] outline-none transition-all resize-none"
                    style={{
                      background: "rgba(var(--ce-glass-tint),0.04)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.1)",
                      color: "var(--ce-text-primary)",
                      fontFamily: "var(--font-body)",
                    }}
                    onFocus={e => (e.target.style.borderColor = "rgba(var(--ce-cyan-rgb),0.3)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(var(--ce-glass-tint),0.1)")}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSubmitTransaction}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] cursor-pointer transition-all hover:brightness-110"
                    style={{
                      background: "rgba(var(--ce-cyan-rgb),0.15)",
                      border: "1px solid rgba(var(--ce-cyan-rgb),0.25)",
                      color: accent,
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddTransaction(false)}
                    className="px-4 py-2.5 rounded-lg text-[13px] cursor-pointer transition-all hover:bg-[rgba(var(--ce-glass-tint),0.06)]"
                    style={{
                      background: "rgba(var(--ce-glass-tint),0.04)",
                      border: "1px solid rgba(var(--ce-glass-tint),0.08)",
                      color: "var(--ce-text-tertiary)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RoleShell>
  );
}
