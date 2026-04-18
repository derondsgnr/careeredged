import { useState } from "react";
import { ScrollReveal } from "../animations/ScrollReveal";
import { textSafeColor } from "../lib/colors";

interface Beat {
  tag: string;
  headline: string;
  body: string;
  image: string;
}

interface FeatureBeatsProps {
  eyebrow?: string;
  headline?: string;
  beats: Beat[];
  accentColor?: string;
}

export function FeatureBeats({ eyebrow, headline, beats, accentColor = "#14A9FF" }: FeatureBeatsProps) {
  const [active, setActive] = useState(0);

  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        {eyebrow && (
          <ScrollReveal variant="sm">
            <p className="text-eyebrow mb-8" style={{ color: textSafeColor(accentColor) }}>{eyebrow}</p>
          </ScrollReveal>
        )}
        {headline && (
          <ScrollReveal delay={1}>
            <h2 className="h2 text-text-primary mb-20">{headline}</h2>
          </ScrollReveal>
        )}

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Tab list */}
          <div className="flex flex-col">
            {beats.map((beat, i) => (
              <ScrollReveal key={beat.tag} variant="sm" delay={i + 1}>
                <button
                  onClick={() => setActive(i)}
                  className={`w-full text-left flex gap-5 p-5 rounded-[var(--radius-lg)] cursor-pointer transition-all duration-500 ${
                    active === i ? "bg-bg-card opacity-100" : "bg-transparent opacity-50 hover:opacity-75"
                  }`}
                >
                  <div className="w-[100px] h-[100px] rounded-[var(--radius-lg)] overflow-hidden shrink-0">
                    <img src={beat.image} alt={beat.tag} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-large font-bold text-text-primary mb-1">{beat.headline}</p>
                    <div className={`overflow-hidden transition-all duration-500 ${active === i ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                      <p className="text-body text-text-secondary">{beat.body}</p>
                    </div>
                    {active !== i && (
                      <p className="text-small text-text-secondary mt-1">{beat.tag}</p>
                    )}
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Panel image */}
          <ScrollReveal className="relative hidden lg:block">
            <div className="sticky top-32 rounded-[var(--radius-lg)] overflow-hidden" style={{ aspectRatio: "600/700" }}>
              {beats.map((beat, i) => (
                <img
                  key={beat.tag}
                  src={beat.image}
                  alt={beat.tag}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
