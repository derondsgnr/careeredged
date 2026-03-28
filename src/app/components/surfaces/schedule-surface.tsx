import { EASE } from "../tokens";
/**
 * ScheduleEdge — Unified Calendar Surface
 *
 * Sessions, interviews, events, and deadlines in one place.
 * Accessible via Explore menu, Sophia chips, and cross-surface links.
 *
 * States: Empty → Building (Sophia-guided, 2 steps) → Active (timeline/week/availability)
 * Route: /:role/schedule
 * Roles: All roles
 *
 * localStorage key: ce-schedule-data
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard } from "../role-shell";
import { SophiaInsight } from "../sophia-patterns";
import { SophiaMark } from "../sophia-mark";
import { toast } from "../ui/feedback";
import {
  Calendar, Clock, MapPin, Users, Video, Check, ChevronRight,
  Plus, ArrowRight, Send, Bell, Target, Sparkles, ExternalLink, Circle,
} from "lucide-react";


// ─── Types ───────────────────────────────────────────────────────────────────

type EventType = "session" | "interview" | "event" | "deadline" | "reminder";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  duration: string;
  location: string;
  attendees: { name: string; avatarInitial: string }[];
  sophiaNote: string;
  isVirtual: boolean;
}

interface TimeSlot {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

interface AvailabilityBlock {
  id: string;
  label: string;
  days: string[];
  startTime: string;
  endTime: string;
  active: boolean;
}

interface ScheduleSurfaceProps {
  role?: string;
  onNavigate?: (target: string) => void;
}

// ─── Type config ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<EventType, { label: string; color: string }> = {
  session:   { label: "Session",   color: "var(--ce-role-edgestar)" },
  interview: { label: "Interview", color: "var(--ce-status-success)" },
  event:     { label: "Event",     color: "var(--ce-role-edu)" },
  deadline:  { label: "Deadline",  color: "var(--ce-status-warning)" },
  reminder:  { label: "Reminder",  color: "var(--ce-role-guide)" },
};

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "s1", title: "1:1 with Marcus Chen", type: "session",
    date: "2026-03-28", time: "2:00 PM", duration: "30 min",
    location: "Virtual — Zoom", attendees: [{ name: "Marcus Chen", avatarInitial: "M" }],
    sophiaNote: "Marcus is preparing for his frontend interview next week. Focus on system design prep.", isVirtual: true,
  },
  {
    id: "s2", title: "Frontend Interview — TechCorp", type: "interview",
    date: "2026-03-29", time: "10:00 AM", duration: "1 hr",
    location: "Virtual — Google Meet", attendees: [{ name: "Sarah Lin", avatarInitial: "S" }, { name: "David Park", avatarInitial: "D" }],
    sophiaNote: "TechCorp uses React + TypeScript. Review your system design prep and portfolio projects.", isVirtual: true,
  },
  {
    id: "s3", title: "Resume review reminder", type: "reminder",
    date: "2026-03-29", time: "4:00 PM", duration: "15 min",
    location: "", attendees: [],
    sophiaNote: "Your resume score is 72. A quick pass on the summary section could push it to 80+.", isVirtual: false,
  },
  {
    id: "s4", title: "Career Fair: AI & ML", type: "event",
    date: "2026-03-30", time: "10:00 AM", duration: "4 hrs",
    location: "Student Union Ballroom B", attendees: [{ name: "Elena Russo", avatarInitial: "E" }, { name: "James Park", avatarInitial: "J" }],
    sophiaNote: "12 companies attending. Three match your target list: OpenAI, Anthropic, and Cohere.", isVirtual: false,
  },
  {
    id: "s5", title: "EdgePath milestone deadline", type: "deadline",
    date: "2026-03-31", time: "11:59 PM", duration: "",
    location: "", attendees: [],
    sophiaNote: "Phase 2 portfolio review is due. You have 2 of 3 projects uploaded.", isVirtual: false,
  },
  {
    id: "s6", title: "Group coaching — Interview Prep", type: "session",
    date: "2026-04-01", time: "3:00 PM", duration: "45 min",
    location: "Career Center Room 204", attendees: [{ name: "Nadia Chen", avatarInitial: "N" }, { name: "Tom Okafor", avatarInitial: "T" }, { name: "Rachel Wong", avatarInitial: "R" }],
    sophiaNote: "Focus on behavioral questions. All three attendees are in Phase 3.", isVirtual: false,
  },
  {
    id: "s7", title: "Portfolio review with Aisha", type: "session",
    date: "2026-04-02", time: "11:00 AM", duration: "30 min",
    location: "Virtual — Zoom", attendees: [{ name: "Aisha Patel", avatarInitial: "A" }],
    sophiaNote: "Aisha updated her portfolio last week. Check the new case study layout.", isVirtual: true,
  },
  {
    id: "s8", title: "Design Systems Workshop", type: "event",
    date: "2026-04-03", time: "1:00 PM", duration: "2 hrs",
    location: "Virtual — Zoom", attendees: [{ name: "Sharon Lee", avatarInitial: "S" }],
    sophiaNote: "Hosted by Figma. Great opportunity for networking.", isVirtual: true,
  },
  {
    id: "s9", title: "Application deadline — Linear", type: "deadline",
    date: "2026-04-05", time: "11:59 PM", duration: "",
    location: "", attendees: [],
    sophiaNote: "Your EdgeMatch score for Linear is 87. Application materials are ready.", isVirtual: false,
  },
  {
    id: "s10", title: "Mock interview with guide", type: "session",
    date: "2026-04-07", time: "9:00 AM", duration: "1 hr",
    location: "Career Center Room 101", attendees: [{ name: "Prof. Chen", avatarInitial: "P" }],
    sophiaNote: "Focus on the STAR method. Review your top 3 behavioral stories beforehand.", isVirtual: false,
  },
];

const MOCK_AVAILABILITY: AvailabilityBlock[] = [
  { id: "a1", label: "Morning block", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], startTime: "9:00 AM", endTime: "12:00 PM", active: true },
  { id: "a2", label: "Afternoon block", days: ["Mon", "Wed", "Fri"], startTime: "1:00 PM", endTime: "3:00 PM", active: true },
  { id: "a3", label: "Late afternoon", days: ["Tue", "Thu"], startTime: "3:00 PM", endTime: "5:00 PM", active: true },
  { id: "a4", label: "Weekend morning", days: ["Sat"], startTime: "10:00 AM", endTime: "12:00 PM", active: false },
  { id: "a5", label: "Evening prep", days: ["Mon", "Wed"], startTime: "6:00 PM", endTime: "8:00 PM", active: true },
  { id: "a6", label: "Friday wrap-up", days: ["Fri"], startTime: "4:00 PM", endTime: "5:30 PM", active: false },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_KEYS: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const TIME_PERIODS = ["Morning", "Afternoon", "Evening"] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRelativeGroup(dateStr: string): string {
  const today = new Date("2026-03-28");
  const target = new Date(dateStr);
  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff >= 2 && diff <= 6) return "This Week";
  return "Next Week";
}

function groupEvents(events: CalendarEvent[]): { label: string; events: CalendarEvent[] }[] {
  const order = ["Today", "Tomorrow", "This Week", "Next Week"];
  const grouped: Record<string, CalendarEvent[]> = {};
  events.forEach((e) => {
    const g = getRelativeGroup(e.date);
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(e);
  });
  return order.filter((k) => grouped[k]).map((k) => ({ label: k, events: grouped[k] }));
}

function getWeekDay(dateStr: string): number {
  const d = new Date(dateStr);
  return d.getDay() === 0 ? 6 : d.getDay() - 1; // Mon=0 ... Sun=6
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ScheduleSurface({ role: roleProp, onNavigate: onNavProp }: ScheduleSurfaceProps) {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = roleProp ?? roleParam ?? "edgestar";

  const handleNavigate = (target: string) => {
    if (onNavProp) return onNavProp(target);
    const paths: Record<string, string> = {
      sessions: `/${role}/sessions`, messages: `/${role}/messages`,
      synthesis: `/${role}`, schedule: `/${role}/schedule`,
    };
    navigate(paths[target] ?? `/${role}`);
  };

  // State machine
  const [surfaceState, setSurfaceState] = useState<"empty" | "building" | "active">(() => {
    try { return localStorage.getItem("ce-schedule-data") ? "active" : "empty"; } catch { return "empty"; }
  });
  const [buildStep, setBuildStep] = useState(1);
  const [activeView, setActiveView] = useState<"timeline" | "week" | "availability">("timeline");

  // Building state: time slot toggles
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    DAY_KEYS.map((d) => ({ day: d, morning: false, afternoon: false, evening: false }))
  );
  const [importConfirmed, setImportConfirmed] = useState(false);

  // Active state data
  const [events] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>(MOCK_AVAILABILITY);

  const toggleSlot = (dayIdx: number, period: "morning" | "afternoon" | "evening") => {
    setTimeSlots((prev) => prev.map((s, i) => i === dayIdx ? { ...s, [period]: !s[period] } : s));
  };

  const finishBuilding = () => {
    try { localStorage.setItem("ce-schedule-data", JSON.stringify({ slots: timeSlots, ts: Date.now() })); } catch {}
    setSurfaceState("active");
    toast.success("Calendar set up", "Your schedule is ready.");
  };

  const toggleAvailability = (id: string) => {
    setAvailability((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  };

  // Sophia override per state
  const sophiaOverride = surfaceState === "empty"
    ? { message: "Let me help you organize your schedule.", chips: [{ label: "Set up calendar", action: "Help me set up my calendar and availability" }] }
    : surfaceState === "building"
    ? { message: "Setting up your calendar...", chips: [] }
    : activeView === "timeline"
    ? { message: "You have 3 sessions this week. Your next is with Marcus Chen today at 2pm.", chips: [{ label: "Book a session", action: "sessions" }, { label: "Check messages", action: "messages" }] }
    : activeView === "availability"
    ? { message: "Your availability covers 20 hours per week across 5 days.", chips: [{ label: "Share availability", action: "Share my availability link" }] }
    : { message: "Your week is taking shape. 4 events across 5 days.", chips: [{ label: "Book a session", action: "sessions" }] };

  return (
    <RoleShell role={role as any} userName="You" userInitial="Y" edgeGas={55} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1200px] mx-auto">
        <AnimatePresence mode="wait">
          {surfaceState === "empty" && <EmptyState key="empty" onStart={() => setSurfaceState("building")} />}
          {surfaceState === "building" && (
            <BuildingState
              key="building"
              step={buildStep}
              timeSlots={timeSlots}
              toggleSlot={toggleSlot}
              onNext={() => setBuildStep(2)}
              onBack={() => setBuildStep(1)}
              importConfirmed={importConfirmed}
              setImportConfirmed={setImportConfirmed}
              onFinish={finishBuilding}
            />
          )}
          {surfaceState === "active" && (
            <ActiveState
              key="active"
              activeView={activeView}
              setActiveView={setActiveView}
              events={events}
              availability={availability}
              toggleAvailability={toggleAvailability}
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>
      </div>
    </RoleShell>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center pt-32 pb-20"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(var(--ce-glass-tint),0.06)", border: "1px solid rgba(var(--ce-glass-tint),0.08)" }}>
        <Calendar className="w-6 h-6" style={{ color: "var(--ce-text-tertiary)" }} />
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15, color: "var(--ce-text-primary)" }} className="mb-1.5">
        Your Schedule
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-tertiary)" }} className="mb-6 text-center max-w-[280px]">
        Sessions, interviews, events, and deadlines — all in one place.
      </p>
      <button
        onClick={onStart}
        className="px-5 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:scale-[1.02]"
        style={{
          fontFamily: "var(--font-body)", fontWeight: 500,
          background: "var(--ce-role-edgestar)", color: "#000",
        }}
      >
        Set Up Calendar
      </button>
    </motion.div>
  );
}

// ─── Building State ──────────────────────────────────────────────────────────

function BuildingState({
  step, timeSlots, toggleSlot, onNext, onBack, importConfirmed, setImportConfirmed, onFinish,
}: {
  step: number;
  timeSlots: TimeSlot[];
  toggleSlot: (day: number, period: "morning" | "afternoon" | "evening") => void;
  onNext: () => void;
  onBack: () => void;
  importConfirmed: boolean;
  setImportConfirmed: (v: boolean) => void;
  onFinish: () => void;
}) {
  const selectedCount = timeSlots.reduce((acc, s) => acc + (s.morning ? 1 : 0) + (s.afternoon ? 1 : 0) + (s.evening ? 1 : 0), 0);

  return (
    <motion.div
      className="pt-10 pb-20 max-w-[540px] mx-auto"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="h-1 rounded-full flex-1 transition-all" style={{
            background: s <= step ? "var(--ce-role-edgestar)" : "rgba(var(--ce-glass-tint),0.08)",
          }} />
        ))}
      </div>

      <GlassCard className="p-5" style={{ maxHeight: 480, overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
              <div className="flex items-start gap-2 mb-5">
                <SophiaMark size={20} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ce-text-secondary)", lineHeight: 1.5 }}>
                  What does your typical week look like? Toggle the times you're usually available.
                </p>
              </div>

              {/* Day/time grid */}
              <div className="overflow-x-auto">
                <div className="grid gap-1" style={{ gridTemplateColumns: "64px repeat(7, 1fr)", minWidth: 420 }}>
                  {/* Header row */}
                  <div />
                  {DAY_LABELS.map((d) => (
                    <div key={d} className="text-center py-1" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ce-text-tertiary)", fontWeight: 500 }}>
                      {d}
                    </div>
                  ))}

                  {/* Time rows */}
                  {TIME_PERIODS.map((period) => (
                    <>
                      <div key={`label-${period}`} className="flex items-center" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ce-text-tertiary)" }}>
                        {period}
                      </div>
                      {timeSlots.map((slot, dayIdx) => {
                        const periodKey = period.toLowerCase() as "morning" | "afternoon" | "evening";
                        const active = slot[periodKey];
                        return (
                          <button
                            key={`${slot.day}-${period}`}
                            onClick={() => toggleSlot(dayIdx, periodKey)}
                            className="h-9 rounded-md cursor-pointer transition-all hover:scale-[1.04]"
                            style={{
                              background: active ? "rgba(34,211,238,0.18)" : "rgba(var(--ce-glass-tint),0.04)",
                              border: active ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(var(--ce-glass-tint),0.06)",
                            }}
                          >
                            {active && <Check className="w-3 h-3 mx-auto" style={{ color: "var(--ce-role-edgestar)" }} />}
                          </button>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ce-text-quaternary)" }}>
                  {selectedCount} slots selected
                </span>
                <button
                  onClick={onNext}
                  disabled={selectedCount === 0}
                  className="px-4 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all flex items-center gap-1.5"
                  style={{
                    fontFamily: "var(--font-body)", fontWeight: 500,
                    background: selectedCount > 0 ? "var(--ce-role-edgestar)" : "rgba(var(--ce-glass-tint),0.06)",
                    color: selectedCount > 0 ? "#000" : "var(--ce-text-quaternary)",
                    opacity: selectedCount === 0 ? 0.7 : 1,
                  }}
                >
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
              <div className="flex items-start gap-2 mb-5">
                <SophiaMark size={20} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ce-text-secondary)", lineHeight: 1.5 }}>
                  I found 3 upcoming sessions from your Sessions profile. Should I add them to your calendar?
                </p>
              </div>

              {/* Preview list */}
              <div className="flex flex-col gap-2 mb-5">
                {[
                  { title: "1:1 with Marcus Chen", date: "Mar 28", time: "2:00 PM" },
                  { title: "Group coaching — Interview Prep", date: "Apr 1", time: "3:00 PM" },
                  { title: "Portfolio review with Aisha", date: "Apr 2", time: "11:00 AM" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
                  >
                    <Circle className="w-3 h-3 flex-shrink-0" style={{ color: "var(--ce-role-edgestar)" }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-primary)", fontWeight: 500 }} className="truncate">
                        {s.title}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ce-text-tertiary)" }}>
                        {s.date} at {s.time}
                      </p>
                    </div>
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--ce-status-success)" }} />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all"
                  style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)", background: "rgba(var(--ce-glass-tint),0.04)" }}
                >
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setImportConfirmed(false); onFinish(); }}
                    className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all"
                    style={{ fontFamily: "var(--font-body)", color: "var(--ce-text-tertiary)", background: "rgba(var(--ce-glass-tint),0.04)" }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => { setImportConfirmed(true); onFinish(); }}
                    className="px-4 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, background: "var(--ce-role-edgestar)", color: "#000" }}
                  >
                    Add sessions <Check className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

// ─── Active State ────────────────────────────────────────────────────────────

function ActiveState({
  activeView, setActiveView, events, availability, toggleAvailability, onNavigate,
}: {
  activeView: "timeline" | "week" | "availability";
  setActiveView: (v: "timeline" | "week" | "availability") => void;
  events: CalendarEvent[];
  availability: AvailabilityBlock[];
  toggleAvailability: (id: string) => void;
  onNavigate: (t: string) => void;
}) {
  const views = ["timeline", "week", "availability"] as const;

  return (
    <motion.div
      className="pt-8 pb-20"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4.5 h-4.5" style={{ color: "var(--ce-role-edgestar)" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15, color: "var(--ce-text-primary)" }}>
            ScheduleEdge
          </h1>
        </div>
        <button
          onClick={() => toast.success("New event", "Event creation coming soon.")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all hover:scale-[1.02]"
          style={{
            fontFamily: "var(--font-body)", fontWeight: 500,
            background: "rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)",
            border: "1px solid rgba(var(--ce-glass-tint),0.08)",
          }}
        >
          <Plus className="w-3 h-3" /> Add Event
        </button>
      </div>

      {/* Tab bar */}
      <motion.div
        className="flex items-center gap-1 mb-6 p-0.5 rounded-lg w-fit"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ background: "rgba(var(--ce-glass-tint),0.04)", border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}
      >
        {views.map((v) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className="px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-all capitalize"
            style={{
              fontFamily: "var(--font-body)",
              background: activeView === v ? "rgba(var(--ce-glass-tint),0.08)" : "transparent",
              color: activeView === v ? "var(--ce-text-primary)" : "var(--ce-text-tertiary)",
            }}
          >
            {v === "timeline" ? "Timeline" : v === "week" ? "Week" : "Availability"}
          </button>
        ))}
      </motion.div>

      {/* View content */}
      <AnimatePresence mode="wait">
        {activeView === "timeline" && <TimelineView key="timeline" events={events} onNavigate={onNavigate} />}
        {activeView === "week" && <WeekView key="week" events={events} />}
        {activeView === "availability" && <AvailabilityView key="availability" blocks={availability} toggle={toggleAvailability} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Timeline View ───────────────────────────────────────────────────────────

function TimelineView({ events, onNavigate }: { events: CalendarEvent[]; onNavigate: (t: string) => void }) {
  const groups = groupEvents(events);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {groups.map((group, gi) => (
        <div key={group.label} className="mb-6">
          <h3 className="mb-2.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 13, color: "var(--ce-text-tertiary)" }}>
            {group.label}
          </h3>
          <div className="flex flex-col gap-2">
            {group.events.map((event, ei) => {
              const cfg = TYPE_CONFIG[event.type];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.08 + ei * 0.04, duration: 0.3, ease: EASE }}
                >
                  <GlassCard className="p-3.5 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.005]" style={{ border: "1px solid rgba(var(--ce-glass-tint),0.06)" }}>
                    {/* Time column */}
                    <div className="flex-shrink-0 w-[56px] text-right">
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-primary)", fontWeight: 500 }}>
                        {event.time.replace(/ (AM|PM)/, "")}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--ce-text-quaternary)" }}>
                        {event.time.includes("AM") ? "AM" : "PM"}
                      </p>
                    </div>

                    {/* Type indicator */}
                    <div className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: cfg.color }} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-primary)", fontWeight: 500 }} className="truncate">
                          {event.title}
                        </p>
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px]" style={{
                          fontFamily: "var(--font-body)", color: cfg.color,
                          background: `rgba(var(--ce-glass-tint),0.04)`,
                        }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {event.location && (
                          <span className="flex items-center gap-1" style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "var(--ce-text-quaternary)" }}>
                            {event.isVirtual ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            <span className="truncate max-w-[140px]">{event.location}</span>
                          </span>
                        )}
                        {event.duration && (
                          <span className="flex items-center gap-1" style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "var(--ce-text-quaternary)" }}>
                            <Clock className="w-3 h-3" /> {event.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Attendee avatars */}
                    {event.attendees.length > 0 && (
                      <div className="flex-shrink-0 flex -space-x-1.5">
                        {event.attendees.slice(0, 3).map((a, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                            style={{
                              fontFamily: "var(--font-body)", fontWeight: 500,
                              background: "rgba(var(--ce-glass-tint),0.08)",
                              border: "1.5px solid var(--ce-surface-base)",
                              color: "var(--ce-text-secondary)",
                            }}
                          >
                            {a.avatarInitial}
                          </div>
                        ))}
                        {event.attendees.length > 3 && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px]"
                            style={{
                              fontFamily: "var(--font-body)",
                              background: "rgba(var(--ce-glass-tint),0.06)",
                              border: "1.5px solid var(--ce-surface-base)",
                              color: "var(--ce-text-quaternary)",
                            }}
                          >
                            +{event.attendees.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action */}
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--ce-text-quaternary)" }} />
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sophia insight */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3, ease: EASE }}
      >
        <SophiaInsight
          variant="inline"
          message="You have 3 sessions this week. Your next is with Marcus Chen today at 2pm."
          action={{ label: "Book a session", onClick: () => onNavigate("sessions") }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Week View ───────────────────────────────────────────────────────────────

function WeekView({ events }: { events: CalendarEvent[] }) {
  // Build columns: Mon–Sun
  const columns: CalendarEvent[][] = Array.from({ length: 7 }, () => []);
  events.forEach((e) => {
    const dayIdx = getWeekDay(e.date);
    if (dayIdx >= 0 && dayIdx < 7) columns[dayIdx].push(e);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="grid grid-cols-7 gap-1.5" style={{ minHeight: 320 }}>
        {DAY_LABELS.map((day, idx) => (
          <div key={day} className="flex flex-col gap-1">
            {/* Day header */}
            <div
              className="text-center py-1.5 rounded-md mb-1"
              style={{
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
                color: idx < 5 ? "var(--ce-text-secondary)" : "var(--ce-text-quaternary)",
                background: "rgba(var(--ce-glass-tint),0.03)",
              }}
            >
              {day}
            </div>
            {/* Events in this day */}
            {columns[idx].length === 0 && (
              <div className="flex-1 rounded-lg" style={{ background: "rgba(var(--ce-glass-tint),0.02)", minHeight: 48 }} />
            )}
            {columns[idx].map((event) => {
              const cfg = TYPE_CONFIG[event.type];
              return (
                <button
                  key={event.id}
                  onClick={() => toast.info(event.title, "Detail view coming soon.")}
                  className="text-left p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(var(--ce-glass-tint),0.04)",
                    border: "1px solid rgba(var(--ce-glass-tint),0.06)",
                    borderLeft: `2px solid ${cfg.color}`,
                  }}
                >
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--ce-text-primary)", fontWeight: 500 }} className="truncate mb-0.5">
                    {event.title}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "var(--ce-text-quaternary)" }}>
                    {event.time}
                  </p>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sophia insight */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3, ease: EASE }}
      >
        <SophiaInsight
          variant="inline"
          message="Your week is taking shape. 4 events across 5 days."
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Availability View ───────────────────────────────────────────────────────

function AvailabilityView({ blocks, toggle }: { blocks: AvailabilityBlock[]; toggle: (id: string) => void }) {
  const activeHours = blocks.filter((b) => b.active).reduce((acc, b) => {
    const start = parseTime(b.startTime);
    const end = parseTime(b.endTime);
    return acc + (end - start) * b.days.length;
  }, 0);
  const activeDays = new Set(blocks.filter((b) => b.active).flatMap((b) => b.days)).size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Summary */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" style={{ color: "var(--ce-text-tertiary)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-secondary)" }}>
            {activeHours}h / week
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" style={{ color: "var(--ce-text-tertiary)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-secondary)" }}>
            {activeDays} days
          </span>
        </div>
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-2 mb-6">
        {blocks.map((block, i) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3, ease: EASE }}
          >
            <GlassCard
              className="p-3.5 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.003]"
              style={{
                border: block.active ? "1px solid rgba(34,211,238,0.15)" : "1px solid rgba(var(--ce-glass-tint),0.06)",
                opacity: block.active ? 1 : 0.7,
              }}
              onClick={() => toggle(block.id)}
            >
              {/* Toggle indicator */}
              <div
                className="w-8 h-4.5 rounded-full flex items-center transition-all flex-shrink-0 px-0.5"
                style={{
                  background: block.active ? "rgba(34,211,238,0.2)" : "rgba(var(--ce-glass-tint),0.08)",
                }}
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full"
                  animate={{ x: block.active ? 14 : 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  style={{ background: block.active ? "var(--ce-role-edgestar)" : "var(--ce-text-quaternary)" }}
                />
              </div>

              {/* Block info */}
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ce-text-primary)", fontWeight: 500 }}>
                  {block.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ce-text-quaternary)" }}>
                    {block.days.join(", ")}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ce-text-quaternary)" }}>
                    {block.startTime} – {block.endTime}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Share button */}
      <button
        onClick={() => toast.success("Link copied", "Your availability link is ready to share.")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:scale-[1.02] w-fit"
        style={{
          fontFamily: "var(--font-body)", fontWeight: 500,
          background: "rgba(var(--ce-glass-tint),0.06)", color: "var(--ce-text-secondary)",
          border: "1px solid rgba(var(--ce-glass-tint),0.08)",
        }}
      >
        <Send className="w-3 h-3" /> Share Availability
      </button>

      {/* Sophia insight */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3, ease: EASE }}
      >
        <SophiaInsight
          variant="inline"
          message={`Your availability covers ${activeHours} hours per week across ${activeDays} days.`}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function parseTime(t: string): number {
  const [hm, ampm] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  const hour = ampm === "PM" && h !== 12 ? h + 12 : ampm === "AM" && h === 12 ? 0 : h;
  return hour + m / 60;
}
