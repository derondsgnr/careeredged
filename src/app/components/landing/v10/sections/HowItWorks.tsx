import { useEffect, useRef, useState, useCallback } from "react";

const steps = [
  {
    num: "01",
    tag: "Career Discovery",
    headline: "We start by listening.",
    body: "Answer a few questions about your experience, goals, and how you work best. In about 4 minutes, CareerEdge builds a profile of your strengths and career patterns — not from a template, but from what makes you different.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
  },
  {
    num: "02",
    tag: "Career Roadmap",
    headline: "Then we build your roadmap.",
    body: "A personalized career plan with clear phases, skill milestones, and a timeline that fits your life. See which careers match your profile, what they pay, and exactly what it takes to get there.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    num: "03",
    tag: "Resume & Interview Prep",
    headline: "We get your resume ready.",
    body: "Upload your resume and get it scored instantly. See exactly where it falls short, what to fix, and how to make it speak the language that hiring systems and real humans want to read.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
  },
  {
    num: "04",
    tag: "Community & Support",
    headline: "You don't do this alone.",
    body: "Find an accountability partner to keep you on track. Connect with mentors who've walked the path. Let the people who care about your growth see your progress and celebrate your wins.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
];

/*
  Natural zigzag path connecting the 4 dot positions.
  Steps alternate: right (240), left (60), right (240), left (60).
  viewBox 300 x 1200. Dots at y = 100, 400, 700, 1000.
  Path starts from top center, curves to each dot position naturally.
*/
const DOT_Y = [100, 400, 700, 1000];
const DOT_X = [220, 80, 220, 80]; // right, left, right, left

// Build a smooth cubic bezier path that zigzags to each dot
const PATH = (() => {
  let d = `M150 0`; // start top center
  const points = DOT_X.map((x, i) => ({ x, y: DOT_Y[i] }));

  // First curve: center top → dot 0 (right)
  d += ` C150 50, ${points[0].x} ${points[0].y - 80}, ${points[0].x} ${points[0].y}`;

  // Subsequent curves: each dot → next dot
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const midY = (from.y + to.y) / 2;
    // Control points pull toward the current side before crossing to the other
    d += ` C${from.x} ${midY - 30}, ${to.x} ${midY + 30}, ${to.x} ${to.y}`;
  }

  // End: last dot → bottom center
  d += ` C${points[3].x} ${points[3].y + 60}, 150 1160, 150 1200`;
  return d;
})();

function WindingPath({ drawProgress }: { drawProgress: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const dashOffset = pathLength - pathLength * drawProgress;

  return (
    <div className="hiw-path-container hidden lg:block">
      <svg viewBox="0 0 300 1200" preserveAspectRatio="none" fill="none">
        {/* Background track */}
        <path d={PATH} className="hiw-path-bg" />
        {/* Animated draw-on-scroll */}
        <path
          ref={pathRef}
          d={PATH}
          className="hiw-path-active"
          strokeDasharray={pathLength || 1}
          strokeDashoffset={dashOffset}
        />
        {/* Dots at each step */}
        {DOT_X.map((x, i) => {
          const isReached = drawProgress >= (DOT_Y[i] / 1200) * 0.9 + 0.05;
          return (
            <circle
              key={i}
              cx={x}
              cy={DOT_Y[i]}
              r={isReached ? 7 : 4}
              fill={isReached ? "#9FFF07" : "rgba(255,255,255,0.12)"}
              style={{
                transition: "all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
                filter: isReached
                  ? "drop-shadow(0 0 8px rgba(159,255,7,0.7)) drop-shadow(0 0 20px rgba(159,255,7,0.3))"
                  : "none",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/*
  Anorva-style card entrance: 3D perspective tilt + rise.
  Card starts tilted back (rotateX) and below, then flattens and rises into place.
*/
function FloatingCard({
  children,
  isVisible,
  className = "",
}: {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}) {
  return (
    <div style={{ perspective: "1200px" }}>
      <div
        className={className}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) rotateX(0deg) scale(1)"
            : "translateY(80px) rotateX(8deg) scale(0.95)",
          transformOrigin: "center bottom",
          transition:
            "opacity 1s cubic-bezier(0.165, 0.84, 0.44, 1), transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/*
  Staggered text entrance: slides up with delay, slight blur that clears.
*/
function StaggeredText({
  children,
  isVisible,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  isVisible: boolean;
  delay: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        filter: isVisible ? "blur(0px)" : "blur(4px)",
        transition: `opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${delay}ms, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${delay}ms, filter 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [drawProgress, setDrawProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visiblePoints, setVisiblePoints] = useState<Set<number>>(new Set());

  const onScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // Draw progress
    const scrolled = viewportHeight - sectionTop;
    const totalTravel = sectionHeight + viewportHeight;
    const raw = Math.max(0, Math.min(1, scrolled / totalTravel));
    const remapped = Math.max(0, Math.min(1, (raw - 0.12) / 0.76));
    setDrawProgress(remapped);

    // Active point + visibility tracking
    let closest = -1;
    let closestDist = Infinity;
    const center = viewportHeight * 0.45;
    const newVisible = new Set<number>();

    pointRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const elCenter = r.top + r.height / 2;
      const dist = Math.abs(elCenter - center);

      // Is it in viewport at all? (with some buffer for the float-in)
      if (r.top < viewportHeight * 0.85 && r.bottom > 0) {
        newVisible.add(i);
      }

      if (dist < closestDist && r.top < viewportHeight && r.bottom > 0) {
        closestDist = dist;
        closest = i;
      }
    });

    setActiveIndex(closest);
    setVisiblePoints(newVisible);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section id="how-it-works" className="section section-dark" ref={sectionRef}>
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-eyebrow text-accent mb-6">How it works</p>
        </div>

        <h2 className="h2 text-center mb-6">
          Your journey, step by step.
        </h2>

        {/* Vertical separator */}
        <div className="flex justify-center mb-16">
          <div className="w-px h-20 bg-current opacity-20" />
        </div>

        {/* Timeline area */}
        <div className="relative">
          <WindingPath drawProgress={drawProgress} />

          {/* Step points */}
          <div className="flex flex-col gap-32 lg:gap-48 relative z-[2]">
            {steps.map((step, i) => {
              const isLeft = i % 2 !== 0;
              const isVis = visiblePoints.has(i);
              const state =
                i === activeIndex
                  ? "hiw-point-active"
                  : i < activeIndex
                    ? "hiw-point-past"
                    : "hiw-point-inactive";

              return (
                <div
                  key={step.num}
                  ref={(el) => { pointRefs.current[i] = el; }}
                  className={`hiw-point ${state}`}
                >
                  {/* Desktop: alternating — content on one side, image on the other */}
                  <div className={`hidden lg:flex gap-12 items-start ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Content side — takes ~45% */}
                    <div className="w-[45%]">
                      {/* Dot + number */}
                      <StaggeredText isVisible={isVis} delay={0} className="flex items-center gap-3 mb-5">
                        <div className="hiw-dot" />
                        <span className="hiw-num">{step.num}</span>
                      </StaggeredText>

                      {/* Tag */}
                      <StaggeredText isVisible={isVis} delay={100}>
                        <p className="text-small text-accent mb-3 font-medium uppercase tracking-wider">
                          {step.tag}
                        </p>
                      </StaggeredText>

                      {/* Headline */}
                      <StaggeredText isVisible={isVis} delay={200}>
                        <p className="h5 font-medium mb-4">{step.headline}</p>
                      </StaggeredText>

                      {/* Body */}
                      <StaggeredText isVisible={isVis} delay={350}>
                        <p className="text-body opacity-70 max-w-md">
                          {step.body}
                        </p>
                      </StaggeredText>
                    </div>

                    {/* Image side — takes ~45% */}
                    <FloatingCard isVisible={isVis} className="hiw-img w-[45%]">
                      <img src={step.image} alt={step.tag} />
                    </FloatingCard>
                  </div>

                  {/* Mobile: stacked */}
                  <div className="lg:hidden">
                    <StaggeredText isVisible={isVis} delay={0} className="flex items-center gap-3 mb-4">
                      <div className="hiw-dot" />
                      <span className="hiw-num">{step.num}</span>
                    </StaggeredText>

                    <FloatingCard isVisible={isVis} className="hiw-img mb-5">
                      <img src={step.image} alt={step.tag} />
                    </FloatingCard>

                    <StaggeredText isVisible={isVis} delay={150}>
                      <p className="text-small text-accent mb-2 font-medium uppercase tracking-wider">
                        {step.tag}
                      </p>
                    </StaggeredText>

                    <StaggeredText isVisible={isVis} delay={250}>
                      <p className="text-large font-medium mb-3">
                        {step.headline}
                      </p>
                    </StaggeredText>

                    <StaggeredText isVisible={isVis} delay={400}>
                      <p className="text-body opacity-70">{step.body}</p>
                    </StaggeredText>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
