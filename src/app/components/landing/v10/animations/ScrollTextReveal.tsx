import { useRef, useEffect, useState } from "react";

interface ScrollTextRevealProps {
  children: string;
  className?: string;
}

export function ScrollTextReveal({
  children,
  className = "",
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.3;
      const current = rect.top;

      if (current >= start) {
        setProgress(0);
      } else if (current <= end) {
        setProgress(1);
      } else {
        setProgress((start - current) / (start - end));
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const words = children.split(" ");
  const totalWords = words.length;

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, i) => {
        const wordProgress = totalWords > 1 ? i / (totalWords - 1) : 0;
        const isActive = progress > wordProgress * 0.85;

        return (
          <span
            key={i}
            className="transition-opacity duration-500 ease-out"
            style={{ opacity: isActive ? 1 : 0.25 }}
          >
            {word}
            {i < totalWords - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
}
