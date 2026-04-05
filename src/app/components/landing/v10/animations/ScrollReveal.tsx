import { useEffect, useRef, useCallback } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "sm" | "lg";
  delay?: number;
  threshold?: number;
  as?: keyof HTMLElementTagNameMap;
}

function isElementVisible(el: HTMLElement, buffer = 100): boolean {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  return rect.top < windowHeight + buffer && rect.bottom > -buffer;
}

export function ScrollReveal({
  children,
  className = "",
  variant = "default",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (isElementVisible(el)) {
      el.classList.add("revealed");
    } else {
      el.classList.remove("revealed");
    }
  }, []);

  useEffect(() => {
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);

  const variantClass =
    variant === "sm" ? "reveal-sm" : variant === "lg" ? "reveal-lg" : "reveal";
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`${variantClass} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const revealChildren = el.querySelectorAll(".reveal, .reveal-sm, .reveal-lg");
    if (isElementVisible(el)) {
      revealChildren.forEach((child) => child.classList.add("revealed"));
    } else {
      revealChildren.forEach((child) => child.classList.remove("revealed"));
    }
  }, []);

  useEffect(() => {
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);

  return ref;
}
