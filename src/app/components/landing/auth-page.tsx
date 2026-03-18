import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

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

  return (
    <div className="min-h-screen flex" style={{ background: "#08090C" }}>
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Logo */}
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 mb-12 cursor-pointer group">
            <svg width="24" height="32" viewBox="0 0 133 180" fill="none" className="transition-transform duration-300 group-hover:scale-105">
              <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="#B3FF3B"/>
              <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="#B3FF3B"/>
              <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="#B3FF3B"/>
            </svg>
            <span style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "16px", color: "#E8E8ED" }}>
              CareerEdged
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
              color: "#E8E8ED",
            }}
          >
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mb-8 text-[14px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "#6B7280" }}>
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
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#E8E8ED",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
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
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-[11px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "#374151" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
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
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#374151" }} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-[13px] outline-none transition-all duration-200"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#E8E8ED",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(179,255,59,0.3)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#374151" }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-[13px] outline-none transition-all duration-200"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#E8E8ED",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(179,255,59,0.3)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#374151" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg text-[13px] outline-none transition-all duration-200"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#E8E8ED",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(179,255,59,0.3)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword
                  ? <EyeOff size={15} style={{ color: "#374151" }} />
                  : <Eye size={15} style={{ color: "#374151" }} />
                }
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[12px] cursor-pointer transition-colors duration-200"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "#6B7280" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
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
                background: "#B3FF3B",
                color: "#0A0C10",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(179,255,59,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {isLogin ? "Log in" : "Create account"}
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "#6B7280" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onNavigate(isLogin ? "signup" : "login")}
              className="cursor-pointer transition-colors duration-200"
              style={{ color: "#B3FF3B", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#c4ff6a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#B3FF3B"; }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

          {/* Trust */}
          <p className="mt-8 text-[11px] text-center" style={{ fontFamily: "'Satoshi', sans-serif", color: "#374151" }}>
            Your data stays yours. We don't sell it, share it, or use it to train models.
          </p>
        </motion.div>
      </div>

      {/* Right — Visual (desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: "#0A0C10" }}>
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(179,255,59,0.05) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 text-center max-w-[360px]">
          {/* Large monogram */}
          <svg width="80" height="108" viewBox="0 0 133 180" fill="none" className="mx-auto mb-8">
            <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="rgba(179,255,59,0.15)"/>
            <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="rgba(179,255,59,0.15)"/>
            <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="rgba(179,255,59,0.15)"/>
          </svg>

          <p
            className="text-[20px] leading-[1.4] mb-3"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#E8E8ED",
            }}
          >
            {isLogin
              ? "Your roadmap is waiting"
              : "From where you are to where you belong"
            }
          </p>
          <p className="text-[13px]" style={{ fontFamily: "'Satoshi', sans-serif", color: "#6B7280" }}>
            {isLogin
              ? "Pick up right where you left off."
              : "Career intelligence, guided by Sophia."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
