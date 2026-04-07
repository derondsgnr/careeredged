import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ThemeToggle";
import { BtnText } from "../ui/BtnText";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "EdgeJobs", href: "/edgejobs" },
  { label: "Explore Careers", href: "/explore" },
  { label: "EdgePath", href: "/signup" },
];

const solutionsLinks = [
  { label: "Individuals", href: "/solutions/individuals" },
  { label: "Employers", href: "/solutions/employers" },
  { label: "Institutions", href: "/solutions/institutions" },
  { label: "Government", href: "/solutions/government" },
  { label: "NGOs", href: "/solutions/ngos" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg-primary/90 backdrop-blur-md border-b border-border-light"
          : "bg-transparent"
      }`}
    >
      <div className="container-main flex items-center justify-between h-16 px-[var(--section-padding-x)]">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-nav text-text-primary hover:text-accent transition-colors nav-link-slide"
            >
              {link.label}
            </Link>
          ))}

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="text-nav text-text-primary hover:text-accent transition-colors flex items-center gap-1">
              Solutions
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-300 ${solutionsOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ${
                solutionsOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-bg-card border border-border-light rounded-[var(--radius-lg)] shadow-lg py-2 min-w-[200px]">
                {solutionsLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block px-4 py-2.5 text-sm text-text-primary hover:bg-bg-darker-gray transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="text-nav text-text-primary hover:text-accent transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary !py-2.5 !px-5 !text-[13px]">
            <BtnText>Get Your Roadmap</BtnText>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-text-primary transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-1" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-text-primary transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-[500px] border-b border-border-light" : "max-h-0"
        } bg-bg-primary`}
      >
        <div className="container-main px-[var(--section-padding-x)] pb-6 pt-2 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-label text-text-primary py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border-light pt-4">
            <p className="text-label text-text-secondary mb-3">Solutions</p>
            {solutionsLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-sm text-text-primary py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border-light pt-4 flex flex-col gap-3">
            <Link to="/login" className="text-label text-text-primary">Log in</Link>
            <Link to="/signup" className="btn btn-primary text-center">Get Your Roadmap</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
