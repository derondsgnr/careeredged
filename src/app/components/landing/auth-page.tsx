import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import patternHex from "../../../assets/pattern-hex.svg";

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
];

interface AuthPageProps {
  mode: "login" | "signup";
  onNavigate: (page: string) => void;
  onAuth: (action: "login" | "signup") => void;
}

export function AuthPage({ mode, onNavigate, onAuth }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isLogin = mode === "login";

  // Image carousel
  const [activeImg, setActiveImg] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: "#00253A" }}>

      {/* ─── Left — Brand Panel (desktop only) ─── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-end justify-center pb-16" style={{ background: "#00253A" }}>
        {/* Background image carousel */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImg}
            src={CAROUSEL_IMAGES[activeImg]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Bottom gradient — images visible at top, text readable at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,37,58,0.15) 0%, rgba(0,37,58,0.4) 30%, rgba(0,37,58,0.85) 55%, rgba(0,37,58,0.95) 75%, #00253A 100%)",
          }}
        />

        <div className="relative z-10 px-16 max-w-lg">
          {/* Logo */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 mb-16 cursor-pointer group">
            <svg width="28" height="38" viewBox="0 0 133 180" fill="none" className="transition-transform duration-300 group-hover:scale-105">
              <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="#14A9FF"/>
              <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="#14A9FF"/>
              <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="#14A9FF"/>
            </svg>
            <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "16px", color: "#E8E8ED" }}>
              CareerEdge
            </span>
          </button>

          {/* Headline */}
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#E8E8ED",
            }}
          >
            {isLogin
              ? <>Your roadmap{"\n"}is waiting.</>
              : <>Your career is personal.{" "}<span style={{ color: "#14A9FF" }}>Your plan should be too.</span></>
            }
          </h1>

          <p
            className="mb-12"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(232, 232, 237, 0.6)",
            }}
          >
            {isLogin
              ? "Pick up right where you left off. Your roadmap, your progress, your next move — all saved."
              : "12,000+ professionals across 190 countries have built their career roadmap with CareerEdge."
            }
          </p>

          {/* Testimonial — glass card */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px) saturate(1.3)",
              WebkitBackdropFilter: "blur(20px) saturate(1.3)",
            }}
          >
            <p
              className="mb-4"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "rgba(232, 232, 237, 0.7)",
                fontStyle: "italic",
              }}
            >
              &ldquo;CareerEdge gave me an actual plan in 10 minutes. For the first time, I knew exactly what to do next.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(20, 169, 255, 0.15)" }}
              >
                <span className="text-[10px] font-semibold" style={{ color: "#14A9FF" }}>DA</span>
              </div>
              <div>
                <p className="text-[13px] font-medium" style={{ fontFamily: "'Satoshi', sans-serif", color: "#E8E8ED" }}>
                  Damilola A.
                </p>
                <p className="text-[11px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(232, 232, 237, 0.4)" }}>
                  Marketing → UX Design
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 mt-10">
            {[
              { value: "12K+", label: "Roadmaps built" },
              { value: "190+", label: "Countries" },
              { value: "4 min", label: "To your plan" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-[20px] font-bold tracking-tight"
                  style={{ fontFamily: "'Urbanist', sans-serif", color: "#E8E8ED" }}
                >
                  {stat.value}
                </p>
                <p className="text-[11px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(232, 232, 237, 0.4)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right — Form ─── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden"
        style={{ background: "var(--ce-surface-bg, #0A0C10)" }}
      >
        {/* Subtle hex pattern */}
        <img
          src={patternHex}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.02 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo (hidden on desktop — brand panel has it) */}
          <button onClick={() => onNavigate("home")} className="flex lg:hidden items-center gap-2.5 mb-12 cursor-pointer group">
            <svg width="24" height="32" viewBox="0 0 133 180" fill="none" className="transition-transform duration-300 group-hover:scale-105">
              <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="#14A9FF"/>
              <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="#14A9FF"/>
              <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="#14A9FF"/>
            </svg>
            <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "16px", color: "var(--ce-text-primary)" }}>
              CareerEdge
            </span>
          </button>

          {/* Heading */}
          <h1
            className="mb-2"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700,
              fontSize: "28px",
              letterSpacing: "-0.02em",
              color: "var(--ce-text-primary)",
            }}
          >
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mb-8 text-[14px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
            {isLogin
              ? "Log in to continue your career journey."
              : "Start free. Get your personalized career roadmap in minutes."
            }
          </p>

          {/* Google Auth */}
          <button
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-lg text-[13px] mb-6 cursor-pointer transition-all duration-200"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 500,
              background: "rgba(var(--ce-glass-tint),0.04)",
              border: "1px solid rgba(var(--ce-glass-tint),0.08)",
              color: "var(--ce-text-primary)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.08)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }} />
            <span className="text-[11px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(var(--ce-glass-tint),0.06)" }} />
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              onAuth(mode);
            }}
          >
            {!isLogin && (
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ce-text-quaternary)" }} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-[13px] outline-none transition-all duration-200"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    background: "rgba(var(--ce-glass-tint),0.03)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                    color: "var(--ce-text-primary)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(20, 169, 255, 0.3)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.06)"; }}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ce-text-quaternary)" }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-[13px] outline-none transition-all duration-200"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "rgba(var(--ce-glass-tint),0.03)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                  color: "var(--ce-text-primary)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(20, 169, 255, 0.3)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.06)"; }}
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--ce-text-quaternary)" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg text-[13px] outline-none transition-all duration-200"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "rgba(var(--ce-glass-tint),0.03)",
                  border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                  color: "var(--ce-text-primary)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(20, 169, 255, 0.3)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(var(--ce-glass-tint),0.06)"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword
                  ? <EyeOff size={15} style={{ color: "var(--ce-text-quaternary)" }} />
                  : <Eye size={15} style={{ color: "var(--ce-text-quaternary)" }} />
                }
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[12px] cursor-pointer transition-colors duration-200"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ce-text-secondary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-text-tertiary)"; }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-lg text-[14px] mt-2 cursor-pointer transition-all duration-200"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 600,
                background: "#14A9FF",
                color: "#fff",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(20, 169, 255, 0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {isLogin ? "Log in" : "Create account"}
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-tertiary)" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onNavigate(isLogin ? "signup" : "login")}
              className="cursor-pointer transition-colors duration-200"
              style={{ color: "#14A9FF", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#4DBDFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#14A9FF"; }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

          {/* Trust */}
          <p className="mt-8 text-[11px] text-center" style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}>
            Your data stays yours. We don't sell it, share it, or use it to train models.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
