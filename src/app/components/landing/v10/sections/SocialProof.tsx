import { Link } from "react-router";
import { ScrollReveal } from "../animations/ScrollReveal";
import { CountUp } from "../animations/CountUp";

/*
  Scalient-style stats: alternating card fills.
  - Card 1 (lime): large featured card, dark text, white chart
  - Card 2 (white): dark text, accent chart
  - Card 3 (blue): white text, white chart
  - Card 4 (dark): white text, white chart
*/

const stats = [
  {
    end: 12,
    suffix: "K+",
    label: "Roadmaps built",
    description:
      "Real career roadmaps built for professionals, students, and career changers across 190 countries.",
    bg: "#B3FF3B",
    textColor: "#12110E",
    mutedColor: "rgba(18, 17, 14, 0.6)",
    chartStroke: "#12110E",
    chartFill: "#12110E",
    gradientId: "grad_a",
    featured: true,
  },
  {
    end: 4.9,
    suffix: "",
    label: "Avg rating",
    description:
      "Our commitment to personalized career guidance shines through a near-perfect rating.",
    decimals: 1,
    bg: "#FFFFFF",
    textColor: "#12110E",
    mutedColor: "rgba(18, 17, 14, 0.65)",
    chartStroke: "#14A9FF",
    chartFill: "#14A9FF",
    gradientId: "grad_b",
  },
  {
    end: 190,
    suffix: "+",
    label: "Countries",
    description:
      "Global reach means your roadmap understands your market, wherever you are.",
    bg: "#14A9FF",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255, 255, 255, 0.6)",
    chartStroke: "#FFFFFF",
    chartFill: "#FFFFFF",
    gradientId: "grad_c",
  },
  {
    end: 4,
    suffix: " min",
    label: "To your first roadmap",
    description:
      "From first question to a complete career plan in under five minutes.",
    bg: "#111820",
    textColor: "#FFFFFF",
    mutedColor: "rgba(255, 255, 255, 0.5)",
    chartStroke: "#FFFFFF",
    chartFill: "#FFFFFF",
    gradientId: "grad_d",
  },
];

function StatChart({
  gradientId,
  chartStroke,
  chartFill,
}: {
  gradientId: string;
  chartStroke: string;
  chartFill: string;
}) {
  return (
    <svg
      className="h-full w-auto"
      viewBox="0 0 113 219"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
    >
      <path
        d="M69.0482 60.1582L1.8951 60.281L1.21875 190.148L111.426 190.025L112.103 85.0158L69.0482 60.1582Z"
        fill={`url(#${gradientId})`}
        fillOpacity="0.45"
      />
      <line x1="1.90469" y1="3.73437" x2="1.9047" y2="218.736" stroke={chartStroke} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
      <line x1="69.2016" y1="58.2695" x2="69.2016" y2="218.736" stroke={chartStroke} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
      <line x1="111.358" y1="83.127" x2="111.358" y2="218.736" stroke={chartStroke} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="2.50562" cy="2.50562" r="2.50562" fill={chartStroke} opacity="0.7" />
      <path d="M1.77344 58.2695H69.2906L112.345 83.1271" stroke={chartStroke} strokeWidth="1.5" opacity="0.7" />
      <defs>
        <linearGradient id={gradientId} x1="57.4385" y1="163.928" x2="57.4385" y2="-55.4592" gradientUnits="userSpaceOnUse">
          <stop stopColor={chartFill} stopOpacity="0" />
          <stop offset="1" stopColor={chartFill} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SocialProof() {
  return (
    <section className="section section-dark">
      <div className="container-main">
        {/* Header — Scalient style: heading left, description + CTA right */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <ScrollReveal variant="sm">
            <h2 className="h2">
              People are building real plans.
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="sm" delay={1}>
            <div className="lg:flex lg:flex-col lg:items-end lg:text-right">
              <p className="text-large opacity-70 max-w-md mb-6">
                Join professionals, students, and career changers who stopped guessing and started moving.
              </p>
              <Link to="/signup" className="text-btn text-accent inline-flex items-center gap-2">
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats grid — first card spans 2 cols on desktop like Scalient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <ScrollReveal
              key={stat.label}
              variant="sm"
              delay={i + 1}
              className=""
            >
              <div
                className="rounded-[var(--radius-lg)] h-[420px] overflow-hidden flex flex-col"
                style={{ backgroundColor: stat.bg, color: stat.textColor }}
              >
                {/* Number + label */}
                <div className="p-8 pb-0">
                  <p className="flex items-baseline gap-1">
                    <span className="text-[72px] leading-[1] tracking-[-3px] font-normal">
                      <CountUp
                        end={stat.end}
                        suffix=""
                        decimals={(stat as { decimals?: number }).decimals || 0}
                        staggerDelay={i * 300}
                      />
                    </span>
                    <span className="text-[28px] leading-[1] tracking-[-0.5px] font-normal align-top -translate-y-4 inline-block">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="text-sm font-medium mt-1" style={{ color: stat.mutedColor }}>
                    {stat.label}
                  </p>
                </div>

                {/* Description — pushed to bottom */}
                <div className="mt-auto p-8 pt-0 flex gap-4">
                  <div className="flex-1 relative">
                    {/* Chart in background */}
                    <div className="absolute -top-[160px] left-0 h-[200px] w-full overflow-hidden">
                      <StatChart
                        gradientId={stat.gradientId}
                        chartStroke={stat.chartStroke}
                        chartFill={stat.chartFill}
                      />
                    </div>
                    <p className="text-sm leading-relaxed relative" style={{ color: stat.mutedColor }}>
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
