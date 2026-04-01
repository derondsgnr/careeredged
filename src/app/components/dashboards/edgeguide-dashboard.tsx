/**
 * EdgeGuide Dashboard
 * Coach/mentor focused on sessions, client outcomes, and earnings.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard, type NavigateFn } from "../role-shell";
import {
  Calendar, Users, DollarSign, Star, Check, Clock,
  ChevronRight, Video, MessageSquare, TrendingUp, ArrowUpRight,
  UserCircle, ArrowRight, Pencil,
} from "lucide-react";
import { EASE } from "../tokens";
import { KPIRow } from "../kpi-patterns";
import { SophiaInsight } from "../sophia-patterns";
import { GuideProfileModal, useGuideProfile } from "../guide-profile-modal";
import { SophiaMark } from "../sophia-mark";

const KPIS = [
  { label: "Sessions This Week", value: "8", trend: "+2 vs last week", icon: <Calendar className="w-4 h-4" />, color: "var(--ce-role-guide)", gauge: null },
  { label: "Monthly Earnings", value: "$1,240", trend: "+18%", icon: <DollarSign className="w-4 h-4" />, color: "var(--ce-role-guide)", gauge: null },
  { label: "Client Satisfaction", value: "4.9", trend: "23 reviews", icon: <Star className="w-4 h-4" />, color: "var(--ce-role-guide)", gauge: 0.98 },
  { label: "Active Clients", value: "12", trend: "3 new this month", icon: <Users className="w-4 h-4" />, color: "var(--ce-role-guide)", gauge: null },
];

const TODAY_SESSIONS = [
  { client: "Sharon Lee", topic: "Portfolio review", time: "10:00 AM", duration: "60 min", type: "1:1 Mentoring", status: "upcoming" as const, initial: "S", milestone: "Just completed case study milestone" },
  { client: "Marcus Johnson", topic: "Interview prep", time: "2:00 PM", duration: "30 min", type: "Mock Interview", status: "upcoming" as const, initial: "M", milestone: "Has interview with Google next week" },
  { client: "Alex Rivera", topic: "Career transition strategy", time: "4:30 PM", duration: "60 min", type: "Career Coaching", status: "upcoming" as const, initial: "A", milestone: "Finishing Phase 1 of roadmap" },
];

const CLIENTS = [
  { name: "Sharon Lee", progress: 63, phase: "Phase 2", role: "Product Design", sessions: 5, lastSession: "2 days ago" },
  { name: "Marcus Johnson", progress: 41, phase: "Phase 1", role: "Software Engineering", sessions: 3, lastSession: "1 week ago" },
  { name: "Priya Sharma", progress: 87, phase: "Phase 3", role: "Data Science", sessions: 8, lastSession: "3 days ago" },
  { name: "Alex Rivera", progress: 25, phase: "Phase 1", role: "UX Research", sessions: 2, lastSession: "5 days ago" },
];

const PENDING_REVIEWS = [
  { client: "Priya Sharma", task: "Case study submission", submitted: "Yesterday" },
  { client: "Marcus Johnson", task: "Resume draft review", submitted: "2 days ago" },
];

export function EdgeGuideDashboard({ onNavigate }: { onNavigate?: NavigateFn }) {
  const { profile, save: saveProfile, reset: resetProfile } = useGuideProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  return (
    <RoleShell role="guide" userName="Alice" userInitial="A" edgeGas={62} onNavigate={onNavigate}>
      <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <motion.div className="pt-8 pb-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: EASE }}>
        <h1 className="text-[22px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          Good morning, Alice
        </h1>
        <p className="text-[13px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>
          3 sessions today · 2 task reviews pending
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="mb-5"><KPIRow kpis={KPIS} /></div>

      {/* Today's sessions */}
      <GlassCard delay={0.45} className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[var(--ce-role-guide)]" />
            <span className="text-[14px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Today's Sessions</span>
          </div>
          <button onClick={() => onNavigate?.("sessions")} className="flex items-center gap-1 text-[12px] text-ce-text-tertiary hover:text-ce-text-secondary transition-colors cursor-pointer" style={{ fontFamily: "var(--font-body)" }}>
            View calendar <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {TODAY_SESSIONS.map((session, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[rgba(var(--ce-glass-tint),0.02)] cursor-pointer transition-colors" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.04)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.15)" }}>
                <span className="text-[13px] text-[var(--ce-role-guide)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{session.initial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{session.client}</span>
                  <span className="text-[10px] text-ce-text-tertiary px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-glass-tint),0.04)", fontFamily: "var(--font-body)" }}>{session.type}</span>
                </div>
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{session.topic} · {session.milestone}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{session.time}</span>
                  <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>{session.duration}</span>
                </div>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(var(--ce-role-guide-rgb),0.1)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.15)" }}>
                  <Video className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Two-column */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="flex flex-col gap-5">
          {/* Client progress */}
          <GlassCard delay={0.55}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-ce-cyan" />
                <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Client Progress</span>
              </div>
              <button onClick={() => onNavigate?.("clients")} className="text-[11px] text-ce-text-tertiary hover:text-ce-text-secondary cursor-pointer transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                View all →
              </button>
            </div>
            {CLIENTS.map((client, i) => (
              <div key={i} className="flex items-center gap-3 py-3 cursor-pointer" style={{ borderBottom: i < CLIENTS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(var(--ce-role-edgestar-rgb),0.08)" }}>
                  <span className="text-[11px] text-ce-cyan" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{client.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] text-ce-text-primary" style={{ fontFamily: "var(--font-body)" }}>{client.name}</span>
                    <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{client.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--ce-glass-tint),0.04)" }}>
                      <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--ce-role-edgestar), var(--ce-lime))" }} initial={{ width: 0 }} animate={{ width: `${client.progress}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: EASE }} />
                    </div>
                    <span className="text-[10px] text-ce-text-tertiary tabular-nums w-8 text-right" style={{ fontFamily: "var(--font-body)" }}>{client.progress}%</span>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--ce-text-quaternary)] flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{client.sessions} sessions</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="flex flex-col gap-5">
          {/* Profile entry card */}
          {!profile ? (
            <GlassCard delay={0.55}>
              <div className="text-center py-2">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(var(--ce-role-guide-rgb),0.08)" }}>
                  <UserCircle className="w-5 h-5 text-[var(--ce-role-guide)]" />
                </div>
                <div className="text-[13px] text-ce-text-primary mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  Build your profile
                </div>
                <p className="text-[12px] text-ce-text-tertiary mb-3 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Clients find and book you through your profile. Takes about 2 minutes.
                </p>
                <button
                  onClick={() => { setModalKey(k => k + 1); setShowProfileModal(true); }}
                  className="w-full py-2 rounded-lg text-[12px] font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{ background: "rgba(var(--ce-role-guide-rgb),0.08)", color: "var(--ce-role-guide)", border: "1px solid rgba(var(--ce-role-guide-rgb),0.12)", fontFamily: "var(--font-display)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(var(--ce-role-guide-rgb),0.14)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(var(--ce-role-guide-rgb),0.08)"; }}
                >
                  Set up your profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard delay={0.55}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-3.5 h-3.5 text-[var(--ce-role-guide)]" />
                  <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Your Profile</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-employer-rgb),0.1)", color: "var(--ce-role-employer)", fontFamily: "var(--font-body)" }}>Live</span>
              </div>
              <p className="text-[12px] text-ce-text-secondary mb-2 line-clamp-1" style={{ fontFamily: "var(--font-body)" }}>{profile.headline}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {profile.specializations.slice(0, 3).map(s => (
                  <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(var(--ce-role-guide-rgb),0.06)", color: "var(--ce-role-guide)", fontFamily: "var(--font-body)" }}>{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>${profile.rate}/hr · {profile.duration} min</span>
                <button onClick={() => onNavigate?.("profile")} className="flex items-center gap-1 text-[10px] text-ce-text-quaternary cursor-pointer hover:text-ce-text-tertiary transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <button onClick={resetProfile} className="mt-2 text-[10px] text-ce-text-quaternary cursor-pointer hover:text-ce-text-tertiary transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Reset (demo)
              </button>
            </GlassCard>
          )}

          <SophiaInsight
            message="Sharon just completed a major milestone — a portfolio debrief session would be high-value right now. She has an interview with Figma next week."
            actionLabel="View session prep"
            onAction={() => onNavigate?.("sessions")}
            delay={0.6}
          />

          {/* Pending reviews */}
          <GlassCard delay={0.65}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-[var(--ce-role-edgepreneur)]" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Pending Reviews</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(var(--ce-role-edgepreneur-rgb),0.1)] text-[var(--ce-role-edgepreneur)]" style={{ fontFamily: "var(--font-body)" }}>{PENDING_REVIEWS.length}</span>
            </div>
            {PENDING_REVIEWS.map((review, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < PENDING_REVIEWS.length - 1 ? "1px solid rgba(var(--ce-glass-tint),0.03)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-ce-text-primary block" style={{ fontFamily: "var(--font-body)" }}>{review.client}</span>
                  <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>{review.task} · {review.submitted}</span>
                </div>
                <button onClick={() => onNavigate?.("sessions")} className="text-[10px] text-[var(--ce-role-edgepreneur)] px-2 py-1 rounded-md cursor-pointer" style={{ background: "rgba(var(--ce-role-edgepreneur-rgb),0.08)", border: "1px solid rgba(var(--ce-role-edgepreneur-rgb),0.12)", fontFamily: "var(--font-body)" }}>
                  Review
                </button>
              </div>
            ))}
          </GlassCard>

          {/* Earnings summary */}
          <GlassCard delay={0.7}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-3.5 h-3.5 text-ce-lime" />
              <span className="text-[13px] text-ce-text-primary" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Earnings</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[24px] text-ce-text-primary tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>$1,240</span>
              <span className="text-[11px] text-ce-lime" style={{ fontFamily: "var(--font-body)" }}>+18% this month</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-ce-text-tertiary" style={{ fontFamily: "var(--font-body)" }}>16 paid sessions · $77.50 avg</span>
              <span className="text-[10px] text-[var(--ce-text-quaternary)]" style={{ fontFamily: "var(--font-body)" }}>Next payout: Mar 31</span>
            </div>
          </GlassCard>
        </div>
      </div>
      </div>

      {/* Profile setup modal (first time) */}
      <AnimatePresence>
        {showProfileModal && (
          <GuideProfileModal
            key={modalKey}
            onSuccess={(p) => { saveProfile(p); setShowProfileModal(false); }}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </AnimatePresence>

    </RoleShell>
  );
}