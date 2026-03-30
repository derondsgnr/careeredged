import { EASE } from "./tokens";
/**
 * EdgeSight / EdgeBoard — Analytics surface per /docs/edgesight-ux-spec.md
 * EdgeStar only this sprint. Role-based architecture ready via role prop.
 * v3 — recharts fully removed; all charts are pure SVG with controlled keys.
 */

import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { SophiaMark } from "./sophia-mark";
import { RoleShell, type RoleId, type NavigateFn } from "./role-shell";
import {
  TrendingUp, TrendingDown, Compass, FileText, Search,
  ChevronRight, Lock, Sparkles, Zap, ChevronDown,
} from "lucide-react";


// ─── Mock Data ──────────────────────────────────────────────────────

const applicationData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2026, 0, 1 + i);
  return {
    date: `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`,
    applications: Math.max(0, Math.floor(Math.sin(i * 0.15) * 2 + ((i * 7) % 3))),
    views: Math.max(0, Math.floor(Math.sin(i * 0.12 + 1) * 4 + ((i * 3) % 5) + 2)),
  };
});

const skillsGapData = [
  { skill: "Product Thinking", you: 85, market: 90 },
  { skill: "Interaction Design", you: 72, market: 88 },
  { skill: "User Research", you: 78, market: 82 },
  { skill: "Design Systems", you: 65, market: 85 },
  { skill: "Prototyping", you: 80, market: 78 },
  { skill: "Accessibility", you: 55, market: 75 },
  { skill: "Data Viz", you: 70, market: 68 },
  { skill: "Figma", you: 90, market: 85 },
];

const funnelData = [
  { stage: "Applied", count: 28, percent: 100 },
  { stage: "Viewed", count: 18, percent: 64 },
  { stage: "Interview", count: 5, percent: 18 },
  { stage: "Offer", count: 1, percent: 4 },
];

const heatmapData: number[][] = Array.from({ length: 13 }, (_, wi) =>
  Array.from({ length: 7 }, (_, di) => (wi * 7 + di) % 5)
);

const resumeScoreData = [
  { date: "Jan 15", score: 45 },
  { date: "Jan 28", score: 52 },
  { date: "Feb 10", score: 62 },
  { date: "Feb 25", score: 62 },
  { date: "Mar 5", score: 68 },
  { date: "Mar 10", score: 72 },
  { date: "Mar 15", score: 78 },
  { date: "Mar 17", score: 82 },
];

const matchDistribution = [
  { name: "90%+", value: 3, color: "var(--ce-lime)" },
  { name: "70-89%", value: 12, color: "var(--ce-role-edgestar)" },
  { name: "50-69%", value: 8, color: "var(--ce-role-edgepreneur)" },
  { name: "<50%", value: 5, color: "var(--ce-text-tertiary)" },
];

// ─── Pure-SVG Charts (zero recharts dependency) ───────────────────

function SvgAreaChart({ data }: { data: { date: string; views: number; applications: number }[] }) {
  const W = 800, H = 200, PL = 32, PR = 8, PT = 8, PB = 28;
  const cW = W - PL - PR;
  const cH = H - PT - PB;
  const maxV = Math.max(...data.map(d => Math.max(d.views, d.applications)), 1);
  const xs = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * cW;
  const ys = (v: number) => PT + cH - (v / maxV) * cH;
  const linePts = (key: "views" | "applications") =>
    data.map((d, i) => `${xs(i).toFixed(1)},${ys(d[key]).toFixed(1)}`).join(" ");
  const areaPts = (key: "views" | "applications") => {
    const top = data.map((d, i) => `${xs(i).toFixed(1)},${ys(d[key]).toFixed(1)}`).join(" L");
    return `M${xs(0).toFixed(1)},${(PT + cH).toFixed(1)} L${top} L${xs(data.length - 1).toFixed(1)},${(PT + cH).toFixed(1)} Z`;
  };
  const yTicks = [0, Math.round(maxV / 2), maxV];
  const xLabels = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="svg-ac-views" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ce-role-edgestar)" stopOpacity={0.25} />
          <stop offset="100%" stopColor="var(--ce-role-edgestar)" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="svg-ac-apps" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ce-lime)" stopOpacity={0.2} />
          <stop offset="100%" stopColor="var(--ce-lime)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {yTicks.map(v => (
        <line
          key={`yg-${v}`}
          x1={PL} x2={W - PR}
          y1={ys(v)} y2={ys(v)}
          stroke="rgba(var(--ce-glass-tint),0.04)" strokeWidth={1}
        />
      ))}
      {yTicks.map(v => (
        <text
          key={`yt-${v}`}
          x={PL - 4} y={ys(v) + 3}
          textAnchor="end" fill="var(--ce-text-quaternary)" fontSize={8}
        >{v}</text>
      ))}

      <path d={areaPts("views")} fill="url(#svg-ac-views)" />
      <path d={areaPts("applications")} fill="url(#svg-ac-apps)" />

      <polyline points={linePts("views")} fill="none" stroke="var(--ce-role-edgestar)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={linePts("applications")} fill="none" stroke="var(--ce-lime)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

      {xLabels.map(d => {
        const idx = data.indexOf(d);
        return (
          <text key={`xl-${d.date}`} x={xs(idx)} y={H - 4} textAnchor="middle" fill="var(--ce-text-quaternary)" fontSize={8}>{d.date}</text>
        );
      })}
    </svg>
  );
}

function SvgBarChart({ data }: { data: { skill: string; you: number; market: number }[] }) {
  const ROW = 28, PL = 108, PR = 8, PT = 4;
  const W = 400;
  const H = data.length * ROW + PT;
  const cW = W - PL - PR;
  const sc = (v: number) => (v / 100) * cW;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      {[0, 25, 50, 75, 100].map(v => (
        <line key={`xg-${v}`} x1={PL + sc(v)} x2={PL + sc(v)} y1={PT} y2={H} stroke="rgba(var(--ce-glass-tint),0.04)" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const y = PT + i * ROW;
        return (
          <g key={d.skill}>
            <text x={PL - 5} y={y + ROW / 2 + 3} textAnchor="end" fill="var(--ce-text-tertiary)" fontSize={9}>{d.skill}</text>
            <rect x={PL} y={y + 6} width={sc(d.market)} height={7} rx={3} fill="var(--ce-role-edgestar)" opacity={0.7} />
            <rect x={PL} y={y + 15} width={sc(d.you)} height={7} rx={3} fill="var(--ce-lime)" opacity={0.9} />
          </g>
        );
      })}
      <text x={PL} y={H - 1} fill="var(--ce-text-quaternary)" fontSize={7}>▪ Market  ▪ You</text>
    </svg>
  );
}

function SvgLineChart({ data }: { data: { date: string; score: number }[] }) {
  const W = 800, H = 180, PL = 32, PR = 8, PT = 8, PB = 24;
  const cW = W - PL - PR, cH = H - PT - PB;
  const minV = Math.min(...data.map(d => d.score));
  const maxV = Math.max(...data.map(d => d.score));
  const range = maxV - minV || 1;
  const xs = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * cW;
  const ys = (v: number) => PT + cH - ((v - minV) / range) * cH;
  const pts = data.map((d, i) => `${xs(i).toFixed(1)},${ys(d.score).toFixed(1)}`).join(" ");
  const areaPath = `M${xs(0).toFixed(1)},${(PT + cH).toFixed(1)} L${data.map((d, i) => `${xs(i).toFixed(1)},${ys(d.score).toFixed(1)}`).join(" L")} L${xs(data.length - 1).toFixed(1)},${(PT + cH).toFixed(1)} Z`;
  const yTicks = [minV, Math.round((minV + maxV) / 2), maxV];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="svg-lc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ce-lime)" stopOpacity={0.18} />
          <stop offset="100%" stopColor="var(--ce-lime)" stopOpacity={0} />
        </linearGradient>
      </defs>
      {yTicks.map(v => (
        <line key={`yg-${v}`} x1={PL} x2={W - PR} y1={ys(v)} y2={ys(v)} stroke="rgba(var(--ce-glass-tint),0.04)" strokeWidth={1} />
      ))}
      {yTicks.map(v => (
        <text key={`yt-${v}`} x={PL - 4} y={ys(v) + 3} textAnchor="end" fill="var(--ce-text-quaternary)" fontSize={8}>{v}</text>
      ))}
      <path d={areaPath} fill="url(#svg-lc-grad)" />
      <polyline points={pts} fill="none" stroke="var(--ce-lime)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={`dot-${d.date}`} cx={xs(i)} cy={ys(d.score)} r={3} fill="var(--ce-lime)" />
      ))}
      {data.map((d, i) => (
        <text key={`xl-${d.date}`} x={xs(i)} y={H - 2} textAnchor="middle" fill="var(--ce-text-quaternary)" fontSize={8}>{d.date}</text>
      ))}
    </svg>
  );
}

function SvgDonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const R = 72, r = 48, cx = 100, cy = 88;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cursor = -Math.PI / 2;

  return (
    <svg viewBox="0 0 200 176" width="100%" height="100%">
      {data.map(d => {
        const sweep = (d.value / total) * 2 * Math.PI;
        const sa = cursor;
        const ea = cursor + sweep - 0.025;
        cursor += sweep;
        const lg = sweep > Math.PI ? 1 : 0;
        const x1 = cx + R * Math.cos(sa), y1 = cy + R * Math.sin(sa);
        const x2 = cx + R * Math.cos(ea), y2 = cy + R * Math.sin(ea);
        const ix1 = cx + r * Math.cos(ea), iy1 = cy + r * Math.sin(ea);
        const ix2 = cx + r * Math.cos(sa), iy2 = cy + r * Math.sin(sa);
        const path = `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${lg} 1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix1.toFixed(2)},${iy1.toFixed(2)} A${r},${r} 0 ${lg} 0 ${ix2.toFixed(2)},${iy2.toFixed(2)} Z`;
        return <path key={d.name} d={path} fill={d.color} />;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--ce-text-primary)" fontSize={20} fontWeight={500}>{total}</text>
      <text x={cx} y={cx + 8} textAnchor="middle" fill="var(--ce-text-tertiary)" fontSize={9}>Applied</text>
    </svg>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────

function AnimatedCounter({ value, duration = 600 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value, duration]);
  return <>{count}</>;
}

// ─── Sophia Insight Strip ─────────────────────────────────────────

function SophiaInsightStrip({ insights }: { insights: { text: string }[] }) {
  return (
    <motion.div
      className="flex gap-3 overflow-x-auto pb-2"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
    >
      {insights.map((ins, idx) => (
        <motion.div
          key={ins.text}
          className="flex-shrink-0 flex items-start gap-2.5 px-4 py-3 rounded-xl min-w-[280px] max-w-[360px]"
          style={{ background: "linear-gradient(145deg,rgba(var(--ce-role-edgestar-rgb),0.05),rgba(var(--ce-glass-tint),0.02))", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + idx * 0.1, duration: 0.3 }}
        >
          <SophiaMark size={16} glowing={false} />
          <p className="flex-1 text-[12px] text-ce-text-secondary leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{ins.text}</p>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--ce-text-quaternary)] flex-shrink-0 mt-0.5" />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────

interface KPIData { label: string; value: number; suffix?: string; trend: string; trendPositive: boolean; sparkline: number[] }

function KPICard({ kpi, delay }: { kpi: KPIData; delay: number }) {
  const sMax = Math.max(...kpi.sparkline);
  return (
    <motion.div
      className="rounded-xl p-4"
      style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{kpi.label}</span>
        <svg width="48" height="20" viewBox="0 0 48 20">
          <polyline
            fill="none" stroke="rgba(var(--ce-lime-rgb),0.35)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            points={kpi.sparkline.map((v, i) => `${(i * 48 / Math.max(kpi.sparkline.length - 1, 1)).toFixed(1)},${(20 - (v / sMax) * 18).toFixed(1)}`).join(" ")}
          />
        </svg>
      </div>
      <div className="text-[28px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        <AnimatedCounter value={kpi.value} />{kpi.suffix ?? ""}
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        {kpi.trendPositive ? <TrendingUp className="w-3 h-3 text-ce-lime" /> : <TrendingDown className="w-3 h-3 text-[var(--ce-role-edgepreneur)]" />}
        <span className="text-[10px]" style={{ color: kpi.trendPositive ? "var(--ce-lime)" : "var(--ce-role-edgepreneur)", fontFamily: "var(--font-body)" }}>{kpi.trend}</span>
      </div>
    </motion.div>
  );
}

// ─── Date Range Bar ───────────────────────────────────────────────

function DateRangeBar({ selected, onChange }: { selected: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      {["7d", "30d", "90d", "1y", "All"].map(p => (
        <button
          key={p} onClick={() => onChange(p)}
          className="px-3 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors"
          style={{
            background: selected === p ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.03)",
            color: selected === p ? "var(--ce-cyan)" : "var(--ce-text-tertiary)",
            border: selected === p ? "1px solid rgba(var(--ce-cyan-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.04)",
            fontFamily: "var(--font-body)",
          }}
        >{p}</button>
      ))}
    </div>
  );
}

// ─── Filter Chips ─────────────────────────────────────────────────

function FilterChips({ category, status, onCategoryChange, onStatusChange }: {
  category: string; status: string; onCategoryChange: (v: string) => void; onStatusChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1.5">
        {["All", "Applications", "Resume", "Roadmap", "Skills"].map(c => (
          <button key={c} onClick={() => onCategoryChange(c)} className="px-2.5 py-1 rounded-md text-[10px] cursor-pointer transition-colors" style={{
            background: category === c ? "rgba(var(--ce-role-edgestar-rgb),0.1)" : "rgba(var(--ce-glass-tint),0.02)",
            color: category === c ? "var(--ce-role-edgestar)" : "var(--ce-text-tertiary)",
            border: category === c ? "1px solid rgba(var(--ce-role-edgestar-rgb),0.15)" : "1px solid transparent",
            fontFamily: "var(--font-body)",
          }}>{c}</button>
        ))}
      </div>
      <div className="w-px h-4" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }} />
      <div className="flex gap-1.5">
        {["Active", "Completed", "All"].map(s => (
          <button key={s} onClick={() => onStatusChange(s)} className="px-2.5 py-1 rounded-md text-[10px] cursor-pointer transition-colors" style={{
            background: status === s ? "rgba(var(--ce-glass-tint),0.06)" : "rgba(var(--ce-glass-tint),0.02)",
            color: status === s ? "var(--ce-text-primary)" : "var(--ce-text-quaternary)",
            fontFamily: "var(--font-body)",
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Chart Card ───────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, delay = 0.3, annotation, className = "" }: {
  title: string; subtitle: string; children: React.ReactNode; delay?: number; annotation?: string; className?: string;
}) {
  return (
    <motion.div
      className={`rounded-xl p-5 ${className}`}
      style={{ background: "rgba(var(--ce-glass-tint),0.025)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[13px] text-ce-text-primary mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{title}</h3>
          <p className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{subtitle}</p>
        </div>
        {annotation && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.06)" }}>
            <SophiaMark size={10} glowing={false} />
            <span className="text-[9px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>{annotation}</span>
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// ─── Activity Heatmap ─────────────────────────────────────────────

function ActivityHeatmap({ data }: { data: number[][] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const getColor = (v: number) => {
    if (v === 0) return "rgba(var(--ce-glass-tint),0.02)";
    if (v === 1) return "rgba(var(--ce-lime-rgb),0.12)";
    if (v === 2) return "rgba(var(--ce-lime-rgb),0.22)";
    if (v === 3) return "rgba(var(--ce-lime-rgb),0.38)";
    return "rgba(var(--ce-lime-rgb),0.55)";
  };
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-0.5 pt-5">
        {days.map(d => (
          <div key={d} className="h-[14px] flex items-center">
            <span className="text-[8px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{d}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 overflow-x-auto">
        {data.map((week, wi) => (
          <div key={`w-${wi}`} className="flex flex-col gap-0.5">
            {week.map((v, di) => (
              <div key={`c-${wi}-${di}`} className="w-[14px] h-[14px] rounded-[3px]" style={{ background: getColor(v) }} title={`${v} activities`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Roadmap Gauge ────────────────────────────────────────────────

function RoadmapGauge({ percent }: { percent: number }) {
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M10 75 A60 60 0 0 1 130 75" fill="none" stroke="rgba(var(--ce-glass-tint),0.06)" strokeWidth="8" strokeLinecap="round" />
        <motion.path
          d="M10 75 A60 60 0 0 1 130 75"
          fill="none" stroke="var(--ce-lime)" strokeWidth="8" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: percent / 100 }}
          transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
        />
        <text x="70" y="65" textAnchor="middle" fill="var(--ce-text-primary)" fontSize="22" fontFamily="var(--font-display)" fontWeight="500">{percent}%</text>
        <text x="70" y="78" textAnchor="middle" fill="var(--ce-text-tertiary)" fontSize="9" fontFamily="var(--font-body)">Overall Progress</text>
      </svg>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Phase 2 of 4</span>
        <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Est. completion: June 2026</span>
      </div>
    </div>
  );
}

// ─── Premium Gate ───────────────────────────────────────────────
function PremiumGate({ title, onUpgrade }: { title: string; onUpgrade: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
      style={{ background: "rgba(8,9,12,0.82)", backdropFilter: "blur(6px)", border: "1px solid rgba(var(--ce-cyan-rgb),0.1)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(var(--ce-cyan-rgb),0.08)", border: "1px solid rgba(var(--ce-cyan-rgb),0.15)" }}>
        <Lock className="w-4 h-4 text-ce-cyan" />
      </div>
      <p className="text-[12px] text-ce-text-primary mb-1 text-center px-6" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{title}</p>
      <p className="text-[10px] text-ce-text-tertiary text-center px-8 mb-3" style={{ fontFamily: "var(--font-body)" }}>Unlock with EdgePrime — includes salary benchmarking, predictive timelines &amp; deep market intel.</p>
      <button onClick={onUpgrade} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-[11px]"
        style={{ background: "linear-gradient(135deg, rgba(var(--ce-cyan-rgb),0.15), rgba(var(--ce-role-edgestar-rgb),0.06))", border: "1px solid rgba(var(--ce-cyan-rgb),0.2)", color: "var(--ce-cyan)", fontFamily: "var(--font-display)", fontWeight: 500 }}>
        <Sparkles className="w-3.5 h-3.5" /> Upgrade to EdgePrime
      </button>
    </motion.div>
  );
}

// ─── Upgrade Modal ───────────────────────────────────────────────
function UpgradeModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const plans = [
    { name: "EdgeFree", price: "$0/mo", features: ["Career roadmap", "Basic EdgeMatch", "Resume builder", "5 sessions/year"], current: true, cta: "Current plan", ctaDisabled: true },
    { name: "EdgePrime", price: "$29/mo", features: ["Everything in Free", "Salary benchmarking", "Predictive career timelines", "Market intelligence reports", "Unlimited sessions", "Priority Sophia insights"], current: false, cta: "Upgrade to EdgePrime", ctaDisabled: false },
    { name: "EdgePrime+", price: "$79/mo", features: ["Everything in EdgePrime", "1-on-1 career coaching", "Custom market reports", "Employer intro program", "Dedicated EdgeGuide"], current: false, cta: "Contact sales", ctaDisabled: false },
  ];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(var(--ce-shadow-tint),0.75)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-[680px] rounded-2xl overflow-hidden" style={{ background: "rgba(12,14,18,0.99)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
          <div>
            <h2 className="text-[16px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Upgrade your plan</h2>
            <p className="text-[11px] text-ce-text-tertiary mt-0.5" style={{ fontFamily: "var(--font-body)" }}>Unlock the full power of Sophia's market intelligence and career analytics.</p>
          </div>
          <button onClick={onClose} className="text-ce-text-tertiary cursor-pointer hover:text-ce-text-secondary">✕</button>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-xl p-4 flex flex-col" style={{
              background: plan.name === "EdgePrime" ? "linear-gradient(145deg, rgba(var(--ce-cyan-rgb),0.05), rgba(var(--ce-role-edgestar-rgb),0.03))" : "rgba(var(--ce-glass-tint),0.02)",
              border: plan.name === "EdgePrime" ? "1px solid rgba(var(--ce-cyan-rgb),0.15)" : "1px solid rgba(var(--ce-glass-tint),0.05)",
            }}>
              <div className="mb-3">
                <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{plan.name}</span>
                <span className="text-[20px] tabular-nums" style={{ color: plan.name === "EdgePrime" ? "var(--ce-cyan)" : "var(--ce-text-primary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{plan.price}</span>
              </div>
              <ul className="flex flex-col gap-1.5 flex-1 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-1.5">
                    <span className="text-ce-cyan text-[11px] mt-0.5">✓</span>
                    <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { if (!plan.ctaDisabled) { onConfirm(); onClose(); } }}
                className="w-full py-2.5 rounded-xl text-[11px] cursor-pointer transition-colors"
                style={{
                  background: plan.ctaDisabled ? "rgba(var(--ce-glass-tint),0.02)" : plan.name === "EdgePrime" ? "rgba(var(--ce-cyan-rgb),0.15)" : "rgba(var(--ce-glass-tint),0.04)",
                  border: plan.ctaDisabled ? "1px solid rgba(var(--ce-glass-tint),0.05)" : plan.name === "EdgePrime" ? "1px solid rgba(var(--ce-cyan-rgb),0.2)" : "1px solid rgba(var(--ce-glass-tint),0.07)",
                  color: plan.ctaDisabled ? "var(--ce-text-quaternary)" : plan.name === "EdgePrime" ? "var(--ce-cyan)" : "var(--ce-text-secondary)",
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  cursor: plan.ctaDisabled ? "default" : "pointer",
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
          <Zap className="w-3.5 h-3.5 text-ce-lime" />
          <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>CareerEdge is built to augment your career strategy, not replace your judgment. Your data is never sold.</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EdgeBoard Main ───────────────────────────────────────────────

function EdgeBoard({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  const [dateRange, setDateRange] = useState("90d");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("Active");
  const [tier, setTier] = useState<"free" | "prime">("free");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPrime = tier === "prime";
  const handleUpgrade = () => setShowUpgrade(true);

  const kpis: KPIData[] = [
    { label: "Applications Sent", value: 28, trend: "+12% vs last 30d", trendPositive: true, sparkline: [2, 3, 1, 4, 3, 5, 4, 6, 5, 7] },
    { label: "Resume Views", value: 47, trend: "+38% vs last 30d", trendPositive: true, sparkline: [1, 2, 3, 2, 5, 8, 6, 9, 11, 14] },
    { label: "Interview Rate", value: 18, suffix: "%", trend: "+5% vs last 30d", trendPositive: true, sparkline: [8, 10, 12, 11, 14, 15, 16, 18, 17, 18] },
    { label: "Roadmap Velocity", value: 2, suffix: "/wk", trend: "On track", trendPositive: true, sparkline: [1, 1, 2, 1, 2, 3, 2, 2, 2, 2] },
  ];

  const insights = [
    { text: "Resume views tripled since you added quantified results on Mar 10" },
    { text: "Applications spike on Mondays — consider applying Sunday night" },
    { text: "3 of your top matches posted new roles this week" },
  ];

  const shouldShow = (c: string) => category === "All" || category === c;

  const ROLE_USER: Record<RoleId, { name: string; initial: string; gas: number }> = {
    edgestar: { name: "Sharon", initial: "S", gas: 45 },
    edgepreneur: { name: "Raj", initial: "R", gas: 38 },
    parent: { name: "Linda", initial: "L", gas: 52 },
    guide: { name: "Alice", initial: "A", gas: 62 },
    employer: { name: "David", initial: "D", gas: 71 },
    edu: { name: "Prof. Kim", initial: "K", gas: 55 },
    ngo: { name: "Maria", initial: "M", gas: 48 },
    agency: { name: "Director Wu", initial: "W", gas: 60 },
  };
  const user = ROLE_USER[role];

  return (
    <RoleShell
      role={role}
      userName={user.name}
      userInitial={user.initial}
      edgeGas={user.gas}
      onNavigate={onNavigate}
      sophiaOverride={{
        message: "Your resume views are up 38% this week",
        chips: [
          { label: "Find matching roles", action: "jobs" },
          { label: "Continue roadmap", action: "edgepath" },
        ],
      }}
    >
      <div className="max-w-[1200px] mx-auto py-6 space-y-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-[22px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EdgeBoard</h1>
          <p className="text-[12px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Your career analytics — Sophia interprets the data so you don't have to.</p>
        </motion.div>

        <SophiaInsightStrip insights={insights} />

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi, i) => <KPICard key={kpi.label} kpi={kpi} delay={0.2 + i * 0.08} />)}
        </div>

        {/* Controls */}
        <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.3 }}>
          <DateRangeBar selected={dateRange} onChange={setDateRange} />
          <div className="flex items-center gap-3">
            <FilterChips category={category} status={status} onCategoryChange={setCategory} onStatusChange={setStatus} />
            {/* Tier toggle — lets team evaluate both states */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.03)", border: "1px solid rgba(var(--ce-glass-tint),0.05)" }}>
              {(["free", "prime"] as const).map(t => (
                <button key={t} onClick={() => setTier(t)} className="px-2.5 py-1 rounded-md text-[10px] cursor-pointer"
                  style={{ background: tier === t ? (t === "prime" ? "rgba(var(--ce-cyan-rgb),0.12)" : "rgba(var(--ce-glass-tint),0.06)") : "transparent", color: tier === t ? (t === "prime" ? "var(--ce-cyan)" : "var(--ce-text-primary)") : "var(--ce-text-tertiary)", fontFamily: "var(--font-body)" }}>
                  {t === "prime" ? "⚡ EdgePrime" : "EdgeFree"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chart Grid */}
        <div className="grid grid-cols-2 gap-4">

          {/* 1 — Application Activity */}
          {shouldShow("Applications") && (
            <ChartCard title="Application Activity" subtitle="Applications submitted and resume views over time" delay={0.5} annotation="Views jumped after resume update" className="col-span-2">
              <div className="h-[220px]">
                <SvgAreaChart data={applicationData.slice(-30)} />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-[var(--ce-role-edgestar)] rounded" /><span className="text-[9px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Views</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-[var(--ce-lime)] rounded" /><span className="text-[9px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>Applications</span></div>
              </div>
            </ChartCard>
          )}

          {/* 2 — Skills Gap */}
          {shouldShow("Skills") && (
            <ChartCard title="Skills Gap Analysis" subtitle="Your skills vs. market demand for target roles" delay={0.6} annotation="Design Systems is your biggest gap">
              <div className="h-[240px]">
                <SvgBarChart data={skillsGapData} />
              </div>
            </ChartCard>
          )}

          {/* 3 — Application Funnel */}
          {shouldShow("Applications") && (
            <ChartCard title="Application Funnel" subtitle="Conversion through hiring stages" delay={0.7} annotation="60% of apps aren't being viewed">
              <div className="space-y-3">
                {funnelData.map((stage, i) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{stage.stage}</span>
                      <span className="text-[11px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-body)" }}>{stage.count} ({stage.percent}%)</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: i === 0 ? "var(--ce-lime)" : i === 1 ? "var(--ce-role-edgestar)" : i === 2 ? "var(--ce-role-guide)" : "var(--ce-role-edgepreneur)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percent}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* 4 — Activity Heatmap */}
          <ChartCard title="Activity Heatmap" subtitle="Daily activity over the past 90 days" delay={0.8} annotation="Most active on Tue & Thu" className="col-span-2">
            <ActivityHeatmap data={heatmapData} />
          </ChartCard>

          {/* 5 — Resume Score */}
          {shouldShow("Resume") && (
            <ChartCard title="Resume Score Over Time" subtitle="Your ResumeEdge ATS score progression" delay={0.9} annotation="Score jumped +16 after adding metrics" className="col-span-2">
              <div className="h-[200px]">
                <SvgLineChart data={resumeScoreData} />
              </div>
              <button onClick={() => onNavigate?.("resume")} className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-ce-cyan transition-colors" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                <FileText className="w-3.5 h-3.5" /> Optimize your resume →
              </button>
            </ChartCard>
          )}

          {/* 6 — Job Match Distribution */}
          {shouldShow("Applications") && (
            <ChartCard title="Job Match Distribution" subtitle="Applied jobs by match percentage" delay={1.0}>
              <div className="h-[200px] flex items-center justify-center">
                <SvgDonutChart data={matchDistribution} />
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {matchDistribution.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[9px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate?.("jobs")} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-ce-cyan transition-colors" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                <Search className="w-3.5 h-3.5" /> Find matching roles →
              </button>
            </ChartCard>
          )}

          {/* 7 — Roadmap Progress */}
          {shouldShow("Roadmap") && (
            <ChartCard title="Roadmap Progress" subtitle="Overall career roadmap completion" delay={1.1}>
              <RoadmapGauge percent={63} />
              <button onClick={() => onNavigate?.("edgepath")} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[11px] text-ce-cyan transition-colors" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)", fontFamily: "var(--font-body)" }}>
                <Compass className="w-3.5 h-3.5" /> Continue your roadmap →
              </button>
            </ChartCard>
          )}

          {/* 8 — PREMIUM: Salary Benchmarking */}
          <ChartCard title="Salary Benchmarking" subtitle="Your market value vs. role in your target location" delay={1.2} className="relative overflow-hidden">
            {!isPrime && <PremiumGate title="Salary Benchmarking" onUpgrade={handleUpgrade} />}
            <div className={isPrime ? "" : "blur-sm pointer-events-none"}>
              <div className="space-y-3">
                {[
                  { label: "Your current target", value: 145, max: 200, color: "var(--ce-role-edgestar)" },
                  { label: "P25 Product Designer", value: 120, max: 200, color: "var(--ce-text-quaternary)" },
                  { label: "P50 Product Designer", value: 152, max: 200, color: "var(--ce-text-tertiary)" },
                  { label: "P75 Product Designer", value: 175, max: 200, color: "var(--ce-lime)" },
                ].map((d, i) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-ce-text-secondary" style={{ fontFamily: "var(--font-body)" }}>{d.label}</span>
                      <span className="text-[10px] tabular-nums" style={{ color: d.color, fontFamily: "var(--font-body)" }}>${d.value}K</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                      <motion.div className="h-full rounded-full" style={{ background: d.color }}
                        initial={{ width: 0 }} animate={{ width: `${(d.value / d.max) * 100}%` }}
                        transition={{ delay: 1.4 + i * 0.1, duration: 0.6, ease: EASE }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-ce-text-tertiary mt-3" style={{ fontFamily: "var(--font-body)" }}>Based on 1,240 verified offers in SF Bay Area · Updated Mar 2026</p>
            </div>
          </ChartCard>

          {/* 9 — PREMIUM: Predictive Career Timeline */}
          <ChartCard title="Predictive Career Timeline" subtitle="Sophia's projection based on current trajectory" delay={1.3} className="relative overflow-hidden">
            {!isPrime && <PremiumGate title="Predictive Career Timeline" onUpgrade={handleUpgrade} />}
            <div className={isPrime ? "" : "blur-sm pointer-events-none"}>
              <div className="flex flex-col gap-2.5">
                {[
                  { milestone: "First offer", date: "May 2026", confidence: 82, color: "var(--ce-lime)" },
                  { milestone: "Accept offer", date: "Jun 2026", confidence: 74, color: "var(--ce-role-edgestar)" },
                  { milestone: "6-month review", date: "Dec 2026", confidence: 68, color: "var(--ce-role-guide)" },
                  { milestone: "$180K+ salary", date: "2027–2028", confidence: 61, color: "var(--ce-role-edgepreneur)" },
                ].map((p, i) => (
                  <div key={p.milestone} className="flex items-center gap-3 py-1.5" style={{ borderBottom: i < 3 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <div className="flex-1">
                      <span className="text-[11px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{p.milestone}</span>
                      <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{p.date}</span>
                    </div>
                    <span className="text-[10px] tabular-nums" style={{ color: p.color, fontFamily: "var(--font-body)" }}>{p.confidence}% confidence</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.04)", border: "1px solid rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
                <Sparkles className="w-3 h-3 text-ce-cyan" />
                <span className="text-[10px] text-ce-cyan" style={{ fontFamily: "var(--font-body)" }}>Sophia: At your current pace, Phase 2 completion pushes your first offer timeline 3 weeks earlier.</span>
              </div>
            </div>
          </ChartCard>

          {/* 10 — PREMIUM: Market Intelligence */}
          <ChartCard title="Market Intelligence" subtitle="Role demand, hiring velocity & competitor analysis" delay={1.4} className="col-span-2 relative overflow-hidden">
            {!isPrime && <PremiumGate title="Market Intelligence Report" onUpgrade={handleUpgrade} />}
            <div className={isPrime ? "" : "blur-sm pointer-events-none"}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Product Designer roles posted", value: "+15%", sub: "vs last month", color: "var(--ce-lime)" },
                  { label: "Avg. time to fill", value: "28 days", sub: "↓ 4d vs Q4", color: "var(--ce-role-edgestar)" },
                  { label: "Top hiring companies", value: "Figma, Linear, Vercel", sub: "In your target cluster", color: "var(--ce-role-guide)" },
                  { label: "Remote ratio", value: "62%", sub: "of open roles", color: "var(--ce-role-edgestar)" },
                  { label: "YoY demand growth", value: "+22%", sub: "Product Design in SF", color: "var(--ce-lime)" },
                  { label: "Median days to offer", value: "34 days", sub: "from first application", color: "var(--ce-text-secondary)" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-lg px-3 py-2.5" style={{ background: "rgba(var(--ce-glass-tint),0.02)", border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
                    <span className="text-[14px] tabular-nums block" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{stat.value}</span>
                    <span className="text-[10px] text-ce-text-tertiary block" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</span>
                    <span className="text-[9px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{stat.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

        </div>
      </div>

      {/* Upgrade modal */}
      <AnimatePresence>
        {showUpgrade && (
          <UpgradeModal onClose={() => setShowUpgrade(false)} onConfirm={() => { setTier("prime"); }} />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}

// ─── Export ──────────────────────────────────────────────────────

export function EdgeSight({ role, onNavigate }: { role: RoleId; onNavigate?: NavigateFn }) {
  return <EdgeBoard role={role} onNavigate={onNavigate} />;
}