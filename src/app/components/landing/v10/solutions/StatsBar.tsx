import { ScrollReveal } from "../animations/ScrollReveal";

interface Stat {
  value: string;
  label: string;
  note?: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: "light" | "dark";
  accentColor?: string;
}

export function StatsBar({ stats, variant = "light", accentColor = "#B3FF3B" }: StatsBarProps) {
  const isDark = variant === "dark";

  return (
    <section className={`section ${isDark ? "section-dark" : "bg-bg-primary"}`}>
      <div className="container-main">
        <div className={`grid gap-8 ${stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4"}`}>
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} variant="sm" delay={i + 1}>
              <div className="text-center">
                <p className="text-[56px] leading-[1.1] tracking-[-1.5px] font-normal mb-2" style={{ color: accentColor }}>
                  {stat.value}
                </p>
                <p className={`text-body ${isDark ? "opacity-70" : "text-text-secondary"}`}>{stat.label}</p>
                {stat.note && (
                  <p className={`text-small mt-1 ${isDark ? "opacity-40" : "text-text-secondary/60"} italic`}>{stat.note}</p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
