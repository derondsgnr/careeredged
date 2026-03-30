import { useState, useEffect } from "react";
import { ChevronDown, Sun, Moon } from "lucide-react";
import { useThemeToggle } from "../ui/use-theme";

interface LandingNavProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

const solutionsItems = [
  { id: "individuals", label: "Individuals" },
  { id: "employers", label: "Employers" },
  { id: "institutions", label: "Institutions" },
  { id: "government", label: "Government" },
  { id: "ngos", label: "NGOs" },
];

export function LandingNav({ onNavigate, currentPage = "home" }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { isDark, toggle: toggleTheme } = useThemeToggle();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "var(--ce-nav-scrolled-bg, rgba(var(--ce-glass-tint), 0.85))"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
        borderBottom: scrolled ? "1px solid rgba(var(--ce-glass-tint),0.04)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <svg width="28" height="38" viewBox="0 0 133 180" fill="none" className="transition-transform duration-300 group-hover:scale-105">
            <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="var(--ce-cyan)"/>
            <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="var(--ce-cyan)"/>
            <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="var(--ce-cyan)"/>
          </svg>
          <span
            className="text-[var(--ce-text-primary)] tracking-[-0.02em]"
            style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "18px" }}
          >
            CareerEdged
          </span>
        </button>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { id: "about", label: "About" },
            { id: "jobs", label: "EdgeJobs" },
            { id: "careers", label: "Explore Careers" },
            { id: "edgepath", label: "EdgePath" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="px-4 py-2 rounded-lg text-[13px] transition-colors duration-200 cursor-pointer"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 500,
                color: currentPage === item.id ? "var(--ce-text-primary)" : "var(--ce-text-secondary)",
              }}
              onMouseEnter={(e) => { if (currentPage !== item.id) e.currentTarget.style.color = "var(--ce-text-tertiary)"; }}
              onMouseLeave={(e) => { if (currentPage !== item.id) e.currentTarget.style.color = "var(--ce-text-secondary)"; }}
            >
              {item.label}
            </button>
          ))}

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-colors duration-200 cursor-pointer"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 500,
                color: solutionsOpen ? "var(--ce-text-primary)" : "var(--ce-text-secondary)",
              }}
            >
              Solutions
              <ChevronDown
                size={13}
                className="transition-transform duration-200"
                style={{ transform: solutionsOpen ? "rotate(180deg)" : "rotate(0)" }}
              />
            </button>

            {/* Dropdown */}
            <div
              className="absolute top-full left-1/2 pt-2 transition-all duration-200"
              style={{
                transform: "translateX(-50%)",
                opacity: solutionsOpen ? 1 : 0,
                pointerEvents: solutionsOpen ? "auto" : "none",
              }}
            >
              <div
                className="rounded-xl py-2 min-w-[200px]"
                style={{
                  background: "var(--ce-surface-modal-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                  boxShadow: "0 20px 60px rgba(var(--ce-shadow-tint),0.5)",
                }}
              >
                {solutionsItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(`solutions-${item.id}`);
                      setSolutionsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-150 cursor-pointer"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 500,
                      color: "var(--ce-text-tertiary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--ce-text-primary)";
                      e.currentTarget.style.background = "rgba(var(--ce-glass-tint),0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--ce-text-tertiary)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Theme + Auth */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
            style={{ color: "var(--ce-text-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ce-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-text-tertiary)"; }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            onClick={() => onNavigate("login")}
            className="px-4 py-2 rounded-lg text-[13px] transition-colors duration-200 cursor-pointer"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 500,
              color: "var(--ce-text-tertiary)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ce-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-text-tertiary)"; }}
          >
            Log in
          </button>
          <button
            onClick={() => onNavigate("signup")}
            className="px-5 py-2.5 rounded-lg text-[13px] transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 600,
              background: "var(--ce-cyan)",
              color: "var(--ce-surface-0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#45e0f0";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--ce-cyan)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Your Edge
          </button>
        </div>
      </div>
    </nav>
  );
}
