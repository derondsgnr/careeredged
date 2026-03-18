/**
 * Events Surface — EdgeEducation (primary), EdgeNGO, EdgeAgency
 *
 * Career events management: creation, attendee tracking, QR check-in.
 * QR check-in ships both options (in-app scanner + native camera handoff).
 * The default is a toggle — business decides which is primary.
 *
 * Layer 3 scope:
 * - Event list (upcoming / past)
 * - Create event flow (4-step form, slide-in panel)
 * - Event detail panel with attendee roster
 * - QR check-in module: in-app scanner + native handoff (both built)
 * - Sophia attendance insights
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RoleShell, GlassCard, SophiaInsight } from "../role-shell";
import { SophiaMark } from "../sophia-mark";
import { useSophia } from "../sophia-context";
import { toast } from "../ui/feedback";
import { FormattedNumberInput } from "../ui/formatted-number-input";
import {
  Calendar, Plus, Users, MapPin, Clock, QrCode, Check,
  ChevronRight, X, ArrowRight, Smartphone, Camera,
  Sparkles, TrendingUp, CheckCircle2, Circle, Search,
  BookOpen, Star, Zap, AlertCircle, ExternalLink,
  ChevronDown, Filter, Radio,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Role color map ───────────────────────────────────────────────────────────

const ROLE_ACCENT: Record<string, string> = {
  edu:    "#3B82F6",
  ngo:    "#F97316",
  agency: "#6366F1",
};

// ─── Types ───────────────────────────────────────────────────────────────────

type EventStatus = "upcoming" | "live" | "past";
type EventType   = "career_fair" | "workshop" | "employer_visit" | "info_session" | "bootcamp";
type QRMethod    = "inapp" | "native";

interface Attendee {
  id: string;
  name: string;
  initial: string;
  role: string;
  checkedIn: boolean;
  registeredDate: string;
}

interface CareerEvent {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  date: string;
  time: string;
  location: string;
  virtual: boolean;
  registered: number;
  capacity: number;
  checkedIn: number;
  attendees: Attendee[];
  sophiaNote: string;
  daysUntil?: number;
  employers?: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<EventType, { label: string; color: string; icon: React.ReactNode }> = {
  career_fair:    { label: "Career Fair",     color: "#3B82F6", icon: <Star className="w-3 h-3" /> },
  workshop:       { label: "Workshop",        color: "#8B5CF6", icon: <BookOpen className="w-3 h-3" /> },
  employer_visit: { label: "Employer Visit",  color: "#10B981", icon: <Zap className="w-3 h-3" /> },
  info_session:   { label: "Info Session",    color: "#F59E0B", icon: <Radio className="w-3 h-3" /> },
  bootcamp:       { label: "Bootcamp",        color: "#EC4899", icon: <TrendingUp className="w-3 h-3" /> },
};

const EVENTS: CareerEvent[] = [
  {
    id: "e1",
    title: "Spring 2026 Career Fair",
    type: "career_fair",
    status: "upcoming",
    date: "April 4, 2026",
    time: "10:00 AM – 4:00 PM",
    location: "Student Union Ballroom B",
    virtual: false,
    registered: 148,
    capacity: 200,
    checkedIn: 0,
    daysUntil: 17,
    employers: ["Figma", "Vercel", "Notion", "Linear", "Loom", "+8 more"],
    sophiaNote: "Registration pace is 40% ahead of last year. Predict 85%+ show rate based on historical patterns. Sophia recommends sending a reminder 48h before — it typically recovers 12% of no-show risk.",
    attendees: [
      { id: "a1", name: "Sharon Lee",    initial: "S", role: "Product Design", checkedIn: false, registeredDate: "Mar 10" },
      { id: "a2", name: "Marcus Rivera", initial: "M", role: "UX Design",       checkedIn: false, registeredDate: "Mar 11" },
      { id: "a3", name: "Aisha Patel",   initial: "A", role: "UX Research",     checkedIn: false, registeredDate: "Mar 12" },
      { id: "a4", name: "James Park",    initial: "J", role: "Product Design",  checkedIn: false, registeredDate: "Mar 13" },
      { id: "a5", name: "Elena Russo",   initial: "E", role: "Motion Design",   checkedIn: false, registeredDate: "Mar 14" },
    ],
  },
  {
    id: "e2",
    title: "LinkedIn Profile & Personal Branding Workshop",
    type: "workshop",
    status: "upcoming",
    date: "March 25, 2026",
    time: "2:00 PM – 4:00 PM",
    location: "Career Center Room 204",
    virtual: false,
    registered: 34,
    capacity: 40,
    checkedIn: 0,
    daysUntil: 7,
    sophiaNote: "85% capacity. Consider opening a second session — 12 students are on the waitlist. Format works best for Phases 1–2 students; Sophia has already shared this with the 28 Phase 1 students in your cohort.",
    attendees: [
      { id: "a6",  name: "Nadia Chen",    initial: "N", role: "Design Systems",  checkedIn: false, registeredDate: "Mar 15" },
      { id: "a7",  name: "Tom Okafor",    initial: "T", role: "UX Design",       checkedIn: false, registeredDate: "Mar 16" },
      { id: "a8",  name: "Rachel Wong",   initial: "R", role: "Product Design",  checkedIn: false, registeredDate: "Mar 17" },
    ],
  },
  {
    id: "e3",
    title: "Employer Visit: Figma Design Team",
    type: "employer_visit",
    status: "upcoming",
    date: "March 28, 2026",
    time: "11:00 AM – 12:30 PM",
    location: "Virtual — Zoom",
    virtual: true,
    registered: 52,
    capacity: 60,
    checkedIn: 0,
    daysUntil: 10,
    employers: ["Figma"],
    sophiaNote: "Figma will demo their internal design process and take Q&A. Sophia recommends briefing students on Figma's recent design systems push — highly likely to be a topic. 6 registered students have Figma as a top job target.",
    attendees: [
      { id: "a9",  name: "Sharon Lee",    initial: "S", role: "Product Design",  checkedIn: false, registeredDate: "Mar 14" },
      { id: "a10", name: "Aisha Patel",   initial: "A", role: "UX Research",     checkedIn: false, registeredDate: "Mar 15" },
    ],
  },
  {
    id: "e4",
    title: "Resume Review Day",
    type: "workshop",
    status: "past",
    date: "March 12, 2026",
    time: "1:00 PM – 5:00 PM",
    location: "Career Center Main Hall",
    virtual: false,
    registered: 67,
    capacity: 80,
    checkedIn: 58,
    sophiaNote: "86.5% attendance rate — above average. Sophia flagged 14 students who attended but still have ATS scores below 65. Consider a follow-up drop-in session.",
    attendees: [],
  },
  {
    id: "e5",
    title: "Mock Interview Bootcamp",
    type: "bootcamp",
    status: "past",
    date: "February 28, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Business School Room 101",
    virtual: false,
    registered: 38,
    capacity: 40,
    checkedIn: 35,
    sophiaNote: "92% attendance. Post-event survey scored 4.7/5. Students who attended are 2.3x more likely to pass first-round interviews. Worth expanding to a 2-day format.",
    attendees: [],
  },
];

// ─── QR Check-in Modal ────────────────────────────────────────────────────────

function QRModal({ event, onClose }: { event: CareerEvent; onClose: () => void }) {
  const [method, setMethod] = useState<QRMethod>("inapp");
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const [scanCount, setScanCount] = useState(0);
  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const names = ["Sharon Lee", "Marcus Rivera", "Aisha Patel", "James Park"];
      const name = names[scanCount % names.length];
      setLastScan(`${name} — Product Design (Checked in ✓)`);
      setScanCount(c => c + 1);
      toast.success(`${name} checked in`, event.title);
    }, 2200);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-[440px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(10,12,16,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <QrCode className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-[14px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              QR Check-in
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Event title */}
        <div className="px-5 pt-4 pb-3">
          <span className="text-[12px] text-[#9CA3AF] block truncate" style={{ fontFamily: "var(--font-body)" }}>{event.title}</span>

          {/* Method toggle — THIS is the business decision surface */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg mt-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => setMethod("inapp")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] cursor-pointer transition-all"
              style={{
                background: method === "inapp" ? "rgba(59,130,246,0.12)" : "transparent",
                border: method === "inapp" ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                color: method === "inapp" ? "#3B82F6" : "#6B7280",
                fontFamily: "var(--font-body)",
              }}
            >
              <Smartphone className="w-3.5 h-3.5" />
              In-app scanner
            </button>
            <button
              onClick={() => setMethod("native")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] cursor-pointer transition-all"
              style={{
                background: method === "native" ? "rgba(59,130,246,0.12)" : "transparent",
                border: method === "native" ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                color: method === "native" ? "#3B82F6" : "#6B7280",
                fontFamily: "var(--font-body)",
              }}
            >
              <Camera className="w-3.5 h-3.5" />
              Device camera
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {method === "inapp" ? (
            <motion.div key="inapp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Camera viewfinder simulation */}
              <div className="mx-5 mb-4 rounded-xl overflow-hidden relative" style={{ background: "#0A0A0F", aspectRatio: "4/3", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Corner brackets */}
                {[["top-3 left-3", "border-t-2 border-l-2"], ["top-3 right-3", "border-t-2 border-r-2"], ["bottom-3 left-3", "border-b-2 border-l-2"], ["bottom-3 right-3", "border-b-2 border-r-2"]].map(([pos, border], i) => (
                  <div key={i} className={`absolute w-6 h-6 ${pos} ${border}`} style={{ borderColor: "#3B82F6", borderRadius: 2 }} />
                ))}

                {/* Scan line animation */}
                {scanning && (
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, #3B82F6, transparent)", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }}
                    animate={{ top: ["20%", "80%", "20%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  {lastScan ? (
                    <motion.div className="flex flex-col items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)" }}>
                        <Check className="w-6 h-6 text-[#10B981]" />
                      </div>
                      <span className="text-[11px] text-[#10B981] text-center px-4" style={{ fontFamily: "var(--font-body)" }}>{lastScan}</span>
                    </motion.div>
                  ) : scanning ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                        <QrCode className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Scanning…</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <QrCode className="w-10 h-10 text-[#374151]" />
                      <span className="text-[11px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>Aim at student QR code</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="flex-1 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3B82F6", fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {scanning ? "Scanning…" : lastScan ? "Scan next" : "Start scanning"}
                </button>
                {lastScan && (
                  <button onClick={() => setLastScan(null)} className="px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                    <X className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="native" className="px-5 pb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* Native camera handoff */}
              <div className="rounded-xl p-5 mb-4 flex flex-col items-center gap-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <Camera className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <div>
                  <span className="text-[13px] text-[#E8E8ED] block mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Use your device camera</span>
                  <span className="text-[11px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Opens your camera app directly. Student scans the event QR code — CareerEdge registers their check-in automatically.
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 w-full text-left">
                  {["Student scans the code with any QR reader", "CareerEdge registers the check-in via deep link", "Attendance syncs to your roster in real time"].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)" }}>
                        <span className="text-[8px] text-[#3B82F6]" style={{ fontFamily: "var(--font-body)" }}>{i + 1}</span>
                      </div>
                      <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3B82F6", fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Display QR code for students to scan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live count */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ boxShadow: "0 0 4px rgba(16,185,129,0.6)" }} />
            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Live check-in</span>
          </div>
          <span className="text-[12px] text-[#E8E8ED] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {event.checkedIn} <span className="text-[#374151]">/ {event.registered} checked in</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Create Event Panel ───────────────────────────────────────────────────────

function CreateEventPanel({ onClose, onCreated }: { onClose: () => void; onCreated: (e: CareerEvent) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", type: "workshop" as EventType,
    date: "", time: "", location: "", virtual: false, capacity: "",
  });

  const steps = ["Event basics", "Logistics", "Capacity", "Review & create"];

  const handleCreate = () => {
    const newEvent: CareerEvent = {
      id: `e${Date.now()}`,
      title: form.title || "New Event",
      type: form.type,
      status: "upcoming",
      date: form.date || "TBD",
      time: form.time || "TBD",
      location: form.location || "TBD",
      virtual: form.virtual,
      registered: 0,
      capacity: parseInt(form.capacity) || 50,
      checkedIn: 0,
      daysUntil: 14,
      sophiaNote: "Sophia will generate attendance predictions once registration opens.",
      attendees: [],
    };
    onCreated(newEvent);
    onClose();
    toast.success(`${newEvent.title} created`, "Students will be notified based on their roadmap phase");
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-[520px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(10,12,16,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <span className="text-[14px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Create Event</span>
            <div className="flex items-center gap-2 mt-1">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: i <= step ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${i <= step ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                    {i < step ? <Check className="w-2 h-2 text-[#3B82F6]" /> : <span className="text-[7px]" style={{ color: i === step ? "#3B82F6" : "#374151", fontFamily: "var(--font-body)" }}>{i + 1}</span>}
                  </div>
                  {i < steps.length - 1 && <div className="w-4 h-px" style={{ background: i < step ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)" }} />}
                </div>
              ))}
              <span className="text-[10px] text-[#6B7280] ml-1" style={{ fontFamily: "var(--font-body)" }}>{steps[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Step content */}
        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EVENT TITLE</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Spring Career Fair, LinkedIn Workshop..." className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[#E8E8ED] placeholder:text-[#374151] outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EVENT TYPE</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(([type, cfg]) => (
                      <button key={type} onClick={() => setForm({ ...form, type })}
                        className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl cursor-pointer transition-all"
                        style={{ background: form.type === type ? `${cfg.color}10` : "rgba(255,255,255,0.02)", border: `1px solid ${form.type === type ? `${cfg.color}25` : "rgba(255,255,255,0.06)"}` }}>
                        <div style={{ color: form.type === type ? cfg.color : "#374151" }}>{cfg.icon}</div>
                        <span className="text-[9px] text-center" style={{ color: form.type === type ? cfg.color : "#6B7280", fontFamily: "var(--font-body)" }}>{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#6B7280] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>DATE</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[#E8E8ED] outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)", colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B7280] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>TIME</label>
                    <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[#E8E8ED] outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)", colorScheme: "dark" }} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>LOCATION</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Room, building, or Zoom link..." className="w-full px-3 py-2.5 rounded-xl text-[12px] text-[#E8E8ED] placeholder:text-[#374151] outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }} />
                </div>
                <button onClick={() => setForm({ ...form, virtual: !form.virtual })}
                  className="flex items-center gap-2 cursor-pointer self-start">
                  <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: form.virtual ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${form.virtual ? "#3B82F6" : "rgba(255,255,255,0.1)"}` }}>
                    {form.virtual && <Check className="w-2.5 h-2.5 text-[#3B82F6]" />}
                  </div>
                  <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>Virtual event</span>
                </button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] text-[#6B7280] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>CAPACITY</label>
                  <FormattedNumberInput value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })}
                    placeholder="50" className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[#E8E8ED] placeholder:text-[#374151] outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }} />
                  <span className="text-[10px] text-[#374151] mt-1 block" style={{ fontFamily: "var(--font-body)" }}>
                    Sophia recommends 40–80 for workshops, 100–200 for career fairs
                  </span>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <SophiaMark size={12} glowing={false} />
                    <span className="text-[11px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's recommendation</span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Based on your cohort size (186 students) and this event type, a capacity of 50–60 is ideal. Enable a waitlist to capture overflow demand — Sophia can auto-promote from it.
                  </p>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-3">
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { label: "Title",    value: form.title    || "(untitled)" },
                    { label: "Type",     value: TYPE_CONFIG[form.type].label },
                    { label: "Date",     value: form.date     || "TBD" },
                    { label: "Time",     value: form.time     || "TBD" },
                    { label: "Location", value: form.location || "TBD" },
                    { label: "Capacity", value: form.capacity ? `${form.capacity} attendees` : "TBD" },
                    { label: "Format",   value: form.virtual ? "Virtual" : "In-person" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{row.label}</span>
                      <span className="text-[11px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-body)" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Sophia will generate a QR code and registration link after creation. Students will be notified based on their roadmap phase and target employers.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}>
              Back
            </button>
          )}
          <button
            onClick={step < 3 ? () => setStep(step + 1) : handleCreate}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#3B82F6", fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {step < 3 ? <><ArrowRight className="w-3.5 h-3.5" /> Continue</> : <><Check className="w-3.5 h-3.5" /> Create event</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  event,
  accent,
  onSelect,
  onQR,
}: {
  event: CareerEvent;
  accent: string;
  onSelect: (e: CareerEvent) => void;
  onQR: (e: CareerEvent) => void;
}) {
  const typeConfig = TYPE_CONFIG[event.type];
  const fillPct = (event.registered / event.capacity) * 100;
  const isPast = event.status === "past";
  const attendancePct = isPast ? Math.round((event.checkedIn / event.registered) * 100) : null;

  return (
    <motion.div
      className="rounded-xl p-4 cursor-pointer group"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${event.status === "upcoming" && event.daysUntil && event.daysUntil <= 7 ? `${accent}15` : "rgba(255,255,255,0.05)"}`,
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(event)}
      layout
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: `${typeConfig.color}12`, color: typeConfig.color, border: `1px solid ${typeConfig.color}20`, fontFamily: "var(--font-body)" }}>
              {typeConfig.icon}{typeConfig.label}
            </span>
            {event.status === "live" && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "var(--font-body)" }}>
                <div className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" /> Live
              </span>
            )}
            {event.daysUntil !== undefined && event.daysUntil <= 7 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.08)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.15)", fontFamily: "var(--font-body)" }}>
                {event.daysUntil}d away
              </span>
            )}
          </div>
          <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {event.title}
          </span>
        </div>
        {!isPast && (
          <button
            onClick={(e) => { e.stopPropagation(); onQR(event); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
            style={{ background: `${accent}10`, border: `1px solid ${accent}20`, color: accent, fontFamily: "var(--font-body)" }}
          >
            <QrCode className="w-3 h-3" /> QR
          </button>
        )}
      </div>

      {/* Event meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
        {[
          { icon: <Calendar className="w-3 h-3" />, text: event.date },
          { icon: <Clock className="w-3 h-3" />,    text: event.time },
          { icon: <MapPin className="w-3 h-3" />,   text: event.virtual ? "Virtual" : event.location.split(" ").slice(0, 3).join(" ") },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div style={{ color: "#374151" }}>{item.icon}</div>
            <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Registration / attendance */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>
            {isPast ? `Attended: ${event.checkedIn} / ${event.registered} registered` : `${event.registered} / ${event.capacity} registered`}
          </span>
          {isPast && attendancePct !== null && (
            <span className="text-[10px] tabular-nums" style={{ color: attendancePct >= 80 ? "#B3FF3B" : attendancePct >= 60 ? "#F59E0B" : "#EF4444", fontFamily: "var(--font-body)" }}>
              {attendancePct}% attendance
            </span>
          )}
          {!isPast && (
            <span className="text-[10px] tabular-nums" style={{ color: fillPct >= 90 ? "#EF4444" : fillPct >= 70 ? "#F59E0B" : "#B3FF3B", fontFamily: "var(--font-body)" }}>
              {Math.round(fillPct)}% full
            </span>
          )}
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: isPast ? accent : `${accent}` }}
            initial={{ width: 0 }}
            animate={{ width: isPast ? `${attendancePct}%` : `${fillPct}%` }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Event Detail Panel ───────────────────────────────────────────────────────

function EventDetail({
  event,
  accent,
  onClose,
  onQR,
}: {
  event: CareerEvent;
  accent: string;
  onClose: () => void;
  onQR: (e: CareerEvent) => void;
}) {
  const { openSophia } = useSophia();
  const typeConfig = TYPE_CONFIG[event.type];
  const isPast = event.status === "past";

  return (
    <motion.div
      className="fixed top-0 right-0 bottom-0 w-[400px] z-50 flex flex-col"
      style={{ background: "rgba(10,12,16,0.98)", borderLeft: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${typeConfig.color}12`, color: typeConfig.color, fontFamily: "var(--font-body)" }}>{typeConfig.label}</span>
          </div>
          <span className="text-[14px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{event.title}</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Event details */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {[
            { icon: <Calendar className="w-3.5 h-3.5" />, label: event.date },
            { icon: <Clock className="w-3.5 h-3.5" />,    label: event.time },
            { icon: <MapPin className="w-3.5 h-3.5" />,   label: event.location },
            { icon: <Users className="w-3.5 h-3.5" />,    label: `${event.registered} registered · ${event.capacity} capacity` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <div style={{ color: "#6B7280" }}>{item.icon}</div>
              <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Employers (if career fair / employer visit) */}
        {event.employers && (
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="text-[10px] text-[#374151] block mb-2.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EMPLOYERS</span>
            <div className="flex flex-wrap gap-1.5">
              {event.employers.map((emp) => (
                <span key={emp} className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}>{emp}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sophia note */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <SophiaMark size={12} glowing={false} />
            <span className="text-[11px] text-[#22D3EE]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia's read</span>
          </div>
          <p className="text-[12px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{event.sophiaNote}</p>
        </div>

        {/* Attendee list */}
        {event.attendees.length > 0 && (
          <div className="px-5 py-4">
            <span className="text-[10px] text-[#374151] block mb-3" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
              REGISTERED ({event.attendees.length} of {event.registered} shown)
            </span>
            <div className="flex flex-col gap-0.5">
              {event.attendees.map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.01)" }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px]" style={{ background: `${accent}12`, color: accent, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    {a.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{a.name}</span>
                    <span className="text-[9px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>{a.role}</span>
                  </div>
                  {a.checkedIn && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-4 flex flex-col gap-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {!isPast && (
          <button
            onClick={() => onQR(event)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            <QrCode className="w-3.5 h-3.5" /> Open QR Check-in
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => openSophia(`Help me edit the event "${event.title}" on ${event.date}. Current: ${event.time}, ${event.location}, ${event.registered}/${event.capacity} registered.`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}>
            Edit event
          </button>
          <button
            onClick={() => openSophia(`Draft a reminder notification for students registered for "${event.title}" on ${event.date}. ${event.daysUntil ? `The event is in ${event.daysUntil} days.` : ""} ${event.sophiaNote}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] cursor-pointer hover:bg-[rgba(34,211,238,0.06)] transition-colors" style={{ background: "rgba(34,211,238,0.03)", border: "1px solid rgba(34,211,238,0.1)", color: "#22D3EE", fontFamily: "var(--font-body)" }}>
            Notify students
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function EventsSurface() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const role = (["edu", "ngo", "agency"].includes(roleParam ?? "") ? roleParam : "edu") as string;
  const accent = ROLE_ACCENT[role] ?? "#3B82F6";

  const [events, setEvents] = useState<CareerEvent[]>(EVENTS);
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null);
  const [qrEvent, setQrEvent] = useState<CareerEvent | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const handleNavigate = (target: string) => {
    const paths: Record<string, string> = {
      synthesis: `/${role}`, events: `/${role}/events`, programs: `/${role}/programs`,
      analytics: `/${role}/analytics`, messages: `/${role}/messages`,
      students: `/${role}/students`, outcomes: `/${role}/analytics`, landing: "/",
    };
    navigate(paths[target] ?? `/${role}`);
  };

  const filtered = events.filter((e) =>
    filter === "all" ? true : filter === "upcoming" ? e.status !== "past" : e.status === "past"
  );

  const upcoming = events.filter((e) => e.status !== "past");
  const past = events.filter((e) => e.status === "past");

  // Contextual Sophia bottom bar — updates when an event is selected
  const sophiaOverride = selectedEvent
    ? {
        message: `${selectedEvent.title} — ${selectedEvent.registered} registered${selectedEvent.daysUntil ? ` · ${selectedEvent.daysUntil}d away` : ""}`,
        chips: [
          { label: "Notify attendees", action: `Draft a reminder for students registered for "${selectedEvent.title}" on ${selectedEvent.date}. ${selectedEvent.sophiaNote}` },
          { label: "Attendance forecast", action: `Predict attendance and suggest improvements for "${selectedEvent.title}" — ${selectedEvent.registered}/${selectedEvent.capacity} currently registered.` },
        ],
      }
    : {
        message: "Spring Career Fair is 17 days away — 148 registered, on track for 85%+ turnout",
        chips: [
          { label: "Attendance forecast", action: "What is the predicted attendance for the Spring Career Fair and how can I improve show rate?" },
          { label: "Remind students", action: "Draft a reminder message for students registered for the LinkedIn Workshop — it's in 7 days" },
        ],
      };

  const userName = role === "edu" ? "Professor Chen" : role === "ngo" ? "Marcus" : "Agency";
  const userInitial = userName[0];

  return (
    <RoleShell role={role as any} userName={userName} userInitial={userInitial} edgeGas={55} onNavigate={handleNavigate} sophiaOverride={sophiaOverride}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div className="pt-8 pb-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4, ease: EASE }}>
          <div>
            <h1 className="text-[22px] text-[#E8E8ED] mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Events</h1>
            <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
            style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            <Plus className="w-3.5 h-3.5" /> Create event
          </button>
        </motion.div>

        {/* Summary strip */}
        <motion.div className="flex gap-3 mb-5"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: EASE }}>
          {[
            { label: "Upcoming events", value: upcoming.length,                                    color: accent },
            { label: "Total registered",value: upcoming.reduce((a, e) => a + e.registered, 0),    color: "#B3FF3B" },
            { label: "Avg attendance",  value: `${Math.round(past.reduce((a,e) => a + (e.checkedIn/e.registered*100), 0) / Math.max(past.length, 1))}%`, color: "#22D3EE" },
            { label: "Past events",     value: past.length,                                        color: "#6B7280" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-[20px] tabular-nums mb-0.5" style={{ color: stat.color, fontFamily: "var(--font-display)", fontWeight: 500 }}>{stat.value}</div>
              <div className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <motion.div className="flex items-center gap-1 mb-5 p-0.5 rounded-lg w-fit"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {(["upcoming", "past", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-all capitalize"
              style={{ background: filter === f ? "rgba(255,255,255,0.08)" : "transparent", color: filter === f ? "#E8E8ED" : "#6B7280", fontFamily: "var(--font-body)" }}>
              {f}
            </button>
          ))}
        </motion.div>

        {/* Main layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 300px" }}>
          {/* Event list */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filtered.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3, ease: EASE }}>
                  <EventCard event={event} accent={accent} onSelect={setSelectedEvent} onQR={setQrEvent} />
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="rounded-xl p-12 flex flex-col items-center gap-3" style={{ border: "1px dashed rgba(255,255,255,0.06)" }}>
                <Calendar className="w-8 h-8 text-[#374151]" />
                <span className="text-[13px] text-[#374151]" style={{ fontFamily: "var(--font-body)" }}>No {filter} events</span>
                <button onClick={() => setCreateOpen(true)} className="text-[12px] cursor-pointer" style={{ color: accent, fontFamily: "var(--font-body)" }}>
                  Create your first event →
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <SophiaInsight
              message="The Spring Career Fair has the strongest registration pace in 3 years. Send a day-before reminder to recover an estimated 18 additional attendees."
              actionLabel="Draft reminder"
              onAction={() => {}}
              actionPrompt="Draft a reminder message for students registered for the Spring Career Fair — it's in 17 days and I want to improve show rate"
              delay={0.4}
            />

            {/* Next event countdown */}
            {upcoming[0] && (
              <GlassCard delay={0.5}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5" style={{ color: accent }} />
                  <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Next up</span>
                </div>
                <p className="text-[12px] text-[#9CA3AF] mb-1" style={{ fontFamily: "var(--font-body)" }}>{upcoming[0].title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[24px] tabular-nums" style={{ color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>{upcoming[0].daysUntil}</span>
                  <span className="text-[12px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>days away</span>
                </div>
                <button onClick={() => setQrEvent(upcoming[0])}
                  className="w-full flex items-center justify-center gap-1.5 mt-3 py-2 rounded-xl text-[11px] cursor-pointer transition-colors"
                  style={{ background: `${accent}08`, border: `1px solid ${accent}15`, color: accent, fontFamily: "var(--font-body)" }}>
                  <QrCode className="w-3 h-3" /> View QR check-in
                </button>
              </GlassCard>
            )}

            {/* Tips */}
            <GlassCard delay={0.6}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span className="text-[13px] text-[#E8E8ED]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Event tips</span>
              </div>
              {[
                "Send reminders 48h and 2h before — recovers ~15% no-shows",
                "Students who attend events are 2.1× more likely to land interviews",
                "QR check-in data feeds into student career readiness scores",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                  <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "#374151" }} />
                  <span className="text-[11px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{tip}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Event detail drawer */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)} />
            <EventDetail event={selectedEvent} accent={accent} onClose={() => setSelectedEvent(null)} onQR={(e) => { setSelectedEvent(null); setQrEvent(e); }} />
          </>
        )}
      </AnimatePresence>

      {/* QR modal */}
      <AnimatePresence>
        {qrEvent && <QRModal event={qrEvent} onClose={() => setQrEvent(null)} />}
      </AnimatePresence>

      {/* Create event modal */}
      <AnimatePresence>
        {createOpen && (
          <CreateEventPanel
            onClose={() => setCreateOpen(false)}
            onCreated={(e) => setEvents((prev) => [e, ...prev])}
          />
        )}
      </AnimatePresence>
    </RoleShell>
  );
}