/**
 * Settings Panel — Reusable across all 8 roles
 * Contextual: each role sees relevant settings sections.
 * Triggered by clicking the avatar in TopNav.
 *
 * Sections:
 * - Profile (name, email, photo placeholder)
 * - Notifications (per-role preferences)
 * - Privacy & data
 * - Appearance
 * - Role-specific settings (varies per role)
 * - Connected accounts
 * - Danger zone (sign out, switch role, delete)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { SophiaMark } from "./sophia-mark";
import { toast } from "./ui/feedback";
import type { RoleId } from "./role-shell";
import {
  X, User, Bell, Lock, Palette, Zap, Link2,
  LogOut, ChevronRight, Check, Moon, Globe,
  Shield, Download, Trash2, Volume2, Mic,
  MessageSquare, Calendar, DollarSign, Users,
  BookOpen, BarChart3, Heart, Rocket, GraduationCap,
  Briefcase, Settings as SettingsIcon,
} from "lucide-react";

const EASE = [0.32, 0.72, 0, 1] as const;

// ─── Role-specific settings config ───────────────────────────────────────────

const ROLE_LABELS: Record<RoleId, string> = {
  edgestar: "EdgeStar",
  edgepreneur: "EdgePreneur",
  parent: "EdgeParent",
  guide: "EdgeGuide",
  employer: "EdgeEmployer",
  edu: "EdgeEducation",
  ngo: "EdgeNGO",
  agency: "EdgeAgency",
};

const ROLE_COLORS: Record<RoleId, string> = {
  edgestar: "#22D3EE",
  edgepreneur: "#F59E0B",
  parent: "#EC4899",
  guide: "#8B5CF6",
  employer: "#10B981",
  edu: "#3B82F6",
  ngo: "#F97316",
  agency: "#6366F1",
};

const ROLE_ICONS: Record<RoleId, React.ReactNode> = {
  edgestar:   <Zap className="w-4 h-4" />,
  edgepreneur:<Rocket className="w-4 h-4" />,
  parent:     <Heart className="w-4 h-4" />,
  guide:      <Users className="w-4 h-4" />,
  employer:   <Briefcase className="w-4 h-4" />,
  edu:        <GraduationCap className="w-4 h-4" />,
  ngo:        <BookOpen className="w-4 h-4" />,
  agency:     <BarChart3 className="w-4 h-4" />,
};

type SettingsSection = "profile" | "notifications" | "sophia" | "privacy" | "appearance" | "role" | "connected" | "danger";

const ALL_SECTIONS: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
  { id: "profile",       label: "Profile",         icon: <User className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications",   icon: <Bell className="w-4 h-4" /> },
  { id: "sophia",        label: "Sophia AI",        icon: <SophiaMark size={14} glowing={false} /> },
  { id: "privacy",       label: "Privacy & Data",   icon: <Lock className="w-4 h-4" /> },
  { id: "appearance",    label: "Appearance",       icon: <Palette className="w-4 h-4" /> },
  { id: "role",          label: "Role Settings",    icon: <SettingsIcon className="w-4 h-4" /> },
  { id: "connected",     label: "Connected Apps",   icon: <Link2 className="w-4 h-4" /> },
  { id: "danger",        label: "Account",          icon: <Shield className="w-4 h-4" /> },
];

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, accent = "#B3FF3B" }: { value: boolean; onChange: (v: boolean) => void; accent?: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
      style={{ background: value ? `${accent}30` : "rgba(255,255,255,0.06)", border: `1px solid ${value ? accent : "rgba(255,255,255,0.1)"}` }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full"
        style={{ background: value ? accent : "#374151" }}
        animate={{ left: value ? "calc(100% - 18px)" : "2px" }}
        transition={{ duration: 0.2, ease: EASE }}
      />
    </button>
  );
}

// ─── Setting Row ─────────────────────────────────────────────────────────────

function SettingRow({
  label,
  description,
  value,
  onChange,
  accent,
  type = "toggle",
  options,
  currentOption,
  onOptionChange,
}: {
  label: string;
  description?: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
  accent?: string;
  type?: "toggle" | "select" | "info";
  options?: string[];
  currentOption?: string;
  onOptionChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex-1 min-w-0 pr-4">
        <span className="text-[13px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{label}</span>
        {description && (
          <span className="text-[11px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{description}</span>
        )}
      </div>
      {type === "toggle" && value !== undefined && onChange && (
        <Toggle value={value} onChange={onChange} accent={accent} />
      )}
      {type === "select" && options && currentOption && onOptionChange && (
        <select
          value={currentOption}
          onChange={(e) => onOptionChange(e.target.value)}
          className="text-[12px] px-2 py-1 rounded-lg cursor-pointer outline-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </div>
  );
}

// ─── Section: Profile ─────────────────────────────────────────────────────────

function ProfileSection({ role, userName, userInitial, accent }: { role: RoleId; userName: string; userInitial: string; accent: string }) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(`${userName.toLowerCase().replace(" ", ".")}@example.com`);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Profile updated", "Your changes have been saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-[24px] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}25, rgba(179,255,59,0.1))`, border: `1.5px solid ${accent}30`, color: accent, fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {userInitial}
        </div>
        <div className="flex-1">
          <span className="text-[15px] text-[#E8E8ED] block mb-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{name}</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-[11px]" style={{ color: accent, fontFamily: "var(--font-body)" }}>{ROLE_LABELS[role]}</span>
          </div>
          <button className="text-[11px] mt-1.5 cursor-pointer hover:underline" style={{ color: "#6B7280", fontFamily: "var(--font-body)" }}>
            Change photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-[#374151] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>DISPLAY NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[#E8E8ED] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }}
          />
        </div>
        <div>
          <label className="text-[10px] text-[#374151] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>EMAIL</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[#E8E8ED] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }}
          />
        </div>
        <div>
          <label className="text-[10px] text-[#374151] block mb-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>TIMEZONE</label>
          <select
            className="w-full px-3 py-2.5 rounded-xl text-[13px] text-[#E8E8ED] outline-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-body)" }}
          >
            <option>Pacific Time (PT)</option>
            <option>Eastern Time (ET)</option>
            <option>Central Time (CT)</option>
            <option>Mountain Time (MT)</option>
            <option>UTC</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] cursor-pointer transition-all active:scale-[0.98]"
          style={{ background: saved ? "rgba(179,255,59,0.1)" : `${accent}12`, border: `1px solid ${saved ? "rgba(179,255,59,0.25)" : `${accent}25`}`, color: saved ? "#B3FF3B" : accent, fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : "Save changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

function NotificationsSection({ role, accent }: { role: RoleId; accent: string }) {
  const [prefs, setPrefs] = useState({
    email: true, push: true, digest: false, milestones: true, messages: true, sessions: true,
    sophia: true, marketing: false,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const roleSpecific: Record<RoleId, { key: string; label: string; desc: string }[]> = {
    edgestar:   [{ key: "milestones", label: "Milestone reminders", desc: "When a milestone is due or overdue" }, { key: "sessions", label: "Session confirmations", desc: "Booking and reminder notifications" }],
    edgepreneur:[{ key: "milestones", label: "Milestone alerts", desc: "Venture milestone due dates" }, { key: "sessions", label: "Advisor sessions", desc: "Upcoming advisor session reminders" }],
    parent:     [{ key: "milestones", label: "Child progress", desc: "When your child completes a milestone" }, { key: "sessions", label: "Coach updates", desc: "Messages from your child's coach" }],
    guide:      [{ key: "sessions", label: "New bookings", desc: "When a client books a session" }, { key: "milestones", label: "Client progress", desc: "When a client reaches a milestone" }],
    employer:   [{ key: "milestones", label: "New applications", desc: "When candidates apply to your roles" }, { key: "sessions", label: "Scheduled interviews", desc: "Interview reminders and updates" }],
    edu:        [{ key: "milestones", label: "Student alerts", desc: "At-risk student flags" }, { key: "sessions", label: "Event reminders", desc: "Upcoming event notifications" }],
    ngo:        [{ key: "milestones", label: "Grant deadlines", desc: "Upcoming grant application deadlines" }, { key: "sessions", label: "Participant flags", desc: "At-risk participant alerts" }],
    agency:     [{ key: "milestones", label: "Program updates", desc: "Program milestones and completions" }, { key: "sessions", label: "NGO applications", desc: "New NGO applications and updates" }],
  };

  return (
    <div>
      <div className="mb-4">
        <SettingRow label="Email notifications" description="Receive updates via email" value={prefs.email} onChange={() => toggle("email")} accent={accent} />
        <SettingRow label="Push notifications" description="Browser and mobile push alerts" value={prefs.push} onChange={() => toggle("push")} accent={accent} />
        <SettingRow label="Weekly digest" description="Summary of your activity every Monday" value={prefs.digest} onChange={() => toggle("digest")} accent={accent} />
        <SettingRow label="Messages" description="New messages from connections" value={prefs.messages} onChange={() => toggle("messages")} accent={accent} />
        <SettingRow label="Sophia insights" description="Proactive AI recommendations" value={prefs.sophia} onChange={() => toggle("sophia")} accent={accent} />
      </div>
      <div className="mb-1">
        <span className="text-[10px] text-[#374151]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>ROLE-SPECIFIC</span>
      </div>
      {roleSpecific[role].map(item => (
        <SettingRow key={item.key} label={item.label} description={item.desc}
          value={prefs[item.key as keyof typeof prefs] as boolean}
          onChange={() => toggle(item.key as keyof typeof prefs)} accent={accent} />
      ))}
      <div className="mt-2">
        <SettingRow label="Marketing & tips" description="Product news and career tips" value={prefs.marketing} onChange={() => toggle("marketing")} accent={accent} />
      </div>
    </div>
  );
}

// ─── Section: Sophia AI ───────────────────────────────────────────────────────

function SophiaSection({ accent }: { accent: string }) {
  const [prefs, setPrefs] = useState({
    proactive: true, voice: true, suggestions: true, shareData: true, history: true,
    personality: "Warm & direct",
  });
  const toggle = (k: keyof typeof prefs) => {
    if (typeof prefs[k] === "boolean") setPrefs(p => ({ ...p, [k]: !p[k] }));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 px-3 py-3 rounded-xl" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}>
        <SophiaMark size={18} glowing={false} />
        <div>
          <span className="text-[12px] text-[#22D3EE] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Sophia AI</span>
          <span className="text-[10px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>Your AI career co-pilot — always learning, never storing sensitive data</span>
        </div>
      </div>

      <SettingRow label="Proactive suggestions" description="Sophia surfaces insights without being asked" value={prefs.proactive} onChange={() => toggle("proactive")} accent={accent} />
      <SettingRow label="Voice mode" description="Use Sophia with your microphone" value={prefs.voice} onChange={() => toggle("voice")} accent={accent} />
      <SettingRow label="Chip suggestions" description="Show contextual action chips at the bottom" value={prefs.suggestions} onChange={() => toggle("suggestions")} accent={accent} />
      <SettingRow label="Session context" description="Sophia remembers context within sessions" value={prefs.history} onChange={() => toggle("history")} accent={accent} />
      <SettingRow
        label="Sophia personality"
        type="select"
        options={["Warm & direct", "Professional", "Concise", "Detailed"]}
        currentOption={prefs.personality}
        onOptionChange={(v) => setPrefs(p => ({ ...p, personality: v }))}
        accent={accent}
      />
    </div>
  );
}

// ─── Section: Privacy ─────────────────────────────────────────────────────────

function PrivacySection({ accent }: { accent: string }) {
  const [prefs, setPrefs] = useState({
    analytics: true, profileVisible: true, activityShare: false,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <SettingRow label="Usage analytics" description="Help improve CareerEdge with anonymized usage data" value={prefs.analytics} onChange={() => toggle("analytics")} accent={accent} />
      <SettingRow label="Profile visibility" description="Your profile visible to matched connections" value={prefs.profileVisible} onChange={() => toggle("profileVisible")} accent={accent} />
      <SettingRow label="Activity sharing" description="Share progress with your coach/guide" value={prefs.activityShare} onChange={() => toggle("activityShare")} accent={accent} />
      <div className="mt-4 space-y-2">
        <button
          onClick={() => toast.info("Data export started", "You'll receive a download link within 24 hours")}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}
        >
          <Download className="w-3.5 h-3.5" /> Export my data
        </button>
        <p className="text-[10px] text-[#374151] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          CareerEdge does not sell your data. All AI processing is ephemeral — nothing is stored beyond your session unless you explicitly opt in.
        </p>
      </div>
    </div>
  );
}

// ─── Section: Appearance ──────────────────────────────────────────────────────

function AppearanceSection({ accent }: { accent: string }) {
  const [density, setDensity] = useState("Comfortable");
  const [animSpeed, setAnimSpeed] = useState("Default");
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4" style={{ background: "rgba(179,255,59,0.04)", border: "1px solid rgba(179,255,59,0.1)" }}>
        <Moon className="w-3.5 h-3.5 text-[#B3FF3B]" />
        <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-body)" }}>Dark mode only — CareerEdge is built for the night shift</span>
      </div>
      <SettingRow label="UI density" type="select" options={["Compact", "Comfortable", "Spacious"]}
        currentOption={density} onOptionChange={setDensity} accent={accent} />
      <SettingRow label="Animation speed" type="select" options={["Slow", "Default", "Fast"]}
        currentOption={animSpeed} onOptionChange={setAnimSpeed} accent={accent} />
      <SettingRow label="Reduced motion" description="Minimizes animations for accessibility"
        value={reducedMotion} onChange={setReducedMotion} accent={accent} />
    </div>
  );
}

// ─── Section: Role Settings ───────────────────────────────────────────────────

function RoleSection({ role, accent }: { role: RoleId; accent: string }) {
  const [prefs, setPrefs] = useState({
    autoMatch: true, resumePrivate: false, calendarSync: true, availableForSessions: true,
    candidateAlerts: true, grantReminders: true, parentMode: true,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const sections: Record<RoleId, React.ReactNode> = {
    edgestar: <>
      <SettingRow label="Auto-match jobs" description="Sophia automatically matches you to new roles daily" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
      <SettingRow label="Private resume" description="Only share resume with employers you apply to" value={prefs.resumePrivate} onChange={() => toggle("resumePrivate")} accent={accent} />
      <SettingRow label="Calendar sync" description="Sync sessions to your Google/Apple Calendar" value={prefs.calendarSync} onChange={() => toggle("calendarSync")} accent={accent} />
    </>,
    edgepreneur: <>
      <SettingRow label="Advisor availability" description="Open to booking advisor sessions" value={prefs.availableForSessions} onChange={() => toggle("availableForSessions")} accent={accent} />
      <SettingRow label="Funding alerts" description="Notify when new matching opportunities open" value={prefs.grantReminders} onChange={() => toggle("grantReminders")} accent={accent} />
      <SettingRow label="Calendar sync" description="Sync advisor sessions to your calendar" value={prefs.calendarSync} onChange={() => toggle("calendarSync")} accent={accent} />
    </>,
    parent: <>
      <SettingRow label="Guardian mode" description="Require child's consent before sending notes" value={prefs.parentMode} onChange={() => toggle("parentMode")} accent={accent} />
      <SettingRow label="Progress alerts" description="Notify me when my child completes milestones" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
    </>,
    guide: <>
      <SettingRow label="Accept new clients" description="Appear in search results for new EdgeStars" value={prefs.availableForSessions} onChange={() => toggle("availableForSessions")} accent={accent} />
      <SettingRow label="Auto-confirm sessions" description="Auto-confirm bookings within your availability" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
      <SettingRow label="Calendar sync" description="Sync sessions to your Google/Apple Calendar" value={prefs.calendarSync} onChange={() => toggle("calendarSync")} accent={accent} />
    </>,
    employer: <>
      <SettingRow label="New applicant alerts" description="Instant notification for high-match applicants" value={prefs.candidateAlerts} onChange={() => toggle("candidateAlerts")} accent={accent} />
      <SettingRow label="Auto-screen candidates" description="Sophia pre-screens new applicants automatically" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
    </>,
    edu: <>
      <SettingRow label="At-risk student alerts" description="Notify when student readiness drops below threshold" value={prefs.candidateAlerts} onChange={() => toggle("candidateAlerts")} accent={accent} />
      <SettingRow label="Event auto-reminders" description="Auto-send reminders 48h before events" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
    </>,
    ngo: <>
      <SettingRow label="Grant deadline alerts" description="Reminders 30, 14, and 7 days before deadline" value={prefs.grantReminders} onChange={() => toggle("grantReminders")} accent={accent} />
      <SettingRow label="Participant re-engagement" description="Auto-trigger outreach for 10-day inactive participants" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
    </>,
    agency: <>
      <SettingRow label="NGO application alerts" description="Notify when NGOs apply for grants or programs" value={prefs.candidateAlerts} onChange={() => toggle("candidateAlerts")} accent={accent} />
      <SettingRow label="Placement reporting" description="Auto-generate quarterly placement reports" value={prefs.autoMatch} onChange={() => toggle("autoMatch")} accent={accent} />
    </>,
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
        <div style={{ color: accent }}>{ROLE_ICONS[role]}</div>
        <span className="text-[12px]" style={{ color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }}>{ROLE_LABELS[role]} settings</span>
      </div>
      {sections[role]}
    </div>
  );
}

// ─── Section: Connected Apps ──────────────────────────────────────────────────

function ConnectedSection({ accent }: { accent: string }) {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    google: true, linkedin: false, slack: false, notion: false,
  });

  const apps = [
    { id: "google",   label: "Google Calendar", desc: "Sync sessions and events",       icon: <Calendar className="w-4 h-4" /> },
    { id: "linkedin", label: "LinkedIn",         desc: "Import profile and connections", icon: <Globe className="w-4 h-4" /> },
    { id: "slack",    label: "Slack",            desc: "Receive notifications in Slack", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "notion",   label: "Notion",           desc: "Sync notes and milestones",      icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-2">
      {apps.map(app => (
        <div key={app.id} className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${connected[app.id] ? `${accent}15` : "rgba(255,255,255,0.05)"}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: connected[app.id] ? `${accent}12` : "rgba(255,255,255,0.04)", color: connected[app.id] ? accent : "#374151" }}>
            {app.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[13px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-body)" }}>{app.label}</span>
            <span className="text-[11px] text-[#6B7280]" style={{ fontFamily: "var(--font-body)" }}>{app.desc}</span>
          </div>
          <button
            onClick={() => {
              setConnected(p => ({ ...p, [app.id]: !p[app.id] }));
              toast.info(connected[app.id] ? `${app.label} disconnected` : `${app.label} connected`);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex-shrink-0"
            style={{ background: connected[app.id] ? "rgba(239,68,68,0.08)" : `${accent}12`, border: `1px solid ${connected[app.id] ? "rgba(239,68,68,0.15)" : `${accent}25`}`, color: connected[app.id] ? "#EF4444" : accent, fontFamily: "var(--font-body)" }}
          >
            {connected[app.id] ? "Disconnect" : "Connect"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Section: Danger Zone ─────────────────────────────────────────────────────

function DangerSection({ onSignOut }: { onSignOut: () => void }) {
  const [confirming, setConfirming] = useState<"signout" | "delete" | null>(null);

  return (
    <div className="space-y-3">
      {/* Switch role */}
      <div className="px-3 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-[13px] text-[#E8E8ED] block mb-0.5" style={{ fontFamily: "var(--font-body)" }}>Switch role</span>
        <span className="text-[11px] text-[#6B7280] block mb-2.5" style={{ fontFamily: "var(--font-body)" }}>Change your CareerEdge role to see another perspective</span>
        <div className="flex flex-wrap gap-1.5">
          {(["edgestar", "edgepreneur", "parent", "guide", "employer", "edu", "ngo", "agency"] as RoleId[]).map(r => (
            <a
              key={r}
              href={`/${r}`}
              className="text-[10px] px-2 py-1 rounded-md cursor-pointer transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}
            >
              {ROLE_LABELS[r]}
            </a>
          ))}
        </div>
      </div>

      {/* Sign out */}
      {confirming === "signout" ? (
        <motion.div className="px-3 py-3 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[12px] text-[#E8E8ED] block mb-2" style={{ fontFamily: "var(--font-body)" }}>Sign out of CareerEdge?</span>
          <div className="flex gap-2">
            <button onClick={() => setConfirming(null)} className="flex-1 py-1.5 rounded-lg text-[11px] cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}>Cancel</button>
            <button onClick={onSignOut} className="flex-1 py-1.5 rounded-lg text-[11px] cursor-pointer" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B", fontFamily: "var(--font-display)", fontWeight: 500 }}>Sign out</button>
          </div>
        </motion.div>
      ) : (
        <button onClick={() => setConfirming("signout")}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] cursor-pointer hover:bg-[rgba(245,158,11,0.06)] transition-colors"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}>
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      )}

      {/* Delete */}
      {confirming === "delete" ? (
        <motion.div className="px-3 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[12px] text-[#E8E8ED] block mb-1" style={{ fontFamily: "var(--font-body)" }}>This will permanently delete your account and all data.</span>
          <span className="text-[11px] text-[#EF4444] block mb-2" style={{ fontFamily: "var(--font-body)" }}>This action cannot be undone.</span>
          <div className="flex gap-2">
            <button onClick={() => setConfirming(null)} className="flex-1 py-1.5 rounded-lg text-[11px] cursor-pointer" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontFamily: "var(--font-body)" }}>Cancel</button>
            <button onClick={() => { setConfirming(null); toast.error("Request submitted", "Your data will be deleted within 30 days per our privacy policy"); }}
              className="flex-1 py-1.5 rounded-lg text-[11px] cursor-pointer" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontFamily: "var(--font-display)", fontWeight: 500 }}>Delete account</button>
          </div>
        </motion.div>
      ) : (
        <button onClick={() => setConfirming("delete")}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] cursor-pointer hover:bg-[rgba(239,68,68,0.04)] transition-colors"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(239,68,68,0.12)", color: "#EF4444", fontFamily: "var(--font-body)" }}>
          <Trash2 className="w-4 h-4" /> Delete account
        </button>
      )}
    </div>
  );
}

// ─── Main Settings Panel ──────────────────────────────────────────────────────

export function SettingsPanel({
  isOpen,
  onClose,
  role,
  userName,
  userInitial,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: RoleId;
  userName: string;
  userInitial: string;
}) {
  const navigate = useNavigate();
  const accent = ROLE_COLORS[role];
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const handleSignOut = () => {
    onClose();
    navigate("/");
    toast.info("Signed out", "See you next time");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":       return <ProfileSection role={role} userName={userName} userInitial={userInitial} accent={accent} />;
      case "notifications": return <NotificationsSection role={role} accent={accent} />;
      case "sophia":        return <SophiaSection accent={accent} />;
      case "privacy":       return <PrivacySection accent={accent} />;
      case "appearance":    return <AppearanceSection accent={accent} />;
      case "role":          return <RoleSection role={role} accent={accent} />;
      case "connected":     return <ConnectedSection accent={accent} />;
      case "danger":        return <DangerSection onSignOut={handleSignOut} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-[680px] h-full flex flex-col"
            style={{ background: "rgba(10,12,16,0.98)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
            initial={{ x: 680 }}
            animate={{ x: 0 }}
            exit={{ x: 680 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accent}12`, border: `1px solid ${accent}20`, color: accent }}>
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[15px] text-[#E8E8ED] block" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Settings</span>
                  <span className="text-[11px]" style={{ color: accent, fontFamily: "var(--font-body)" }}>{ROLE_LABELS[role]}</span>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors">
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>

            {/* Body — 2-col */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar nav */}
              <div className="w-48 flex-shrink-0 py-4 px-3 flex flex-col gap-0.5" style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                {ALL_SECTIONS.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all"
                    style={{
                      background: activeSection === section.id ? `${accent}10` : "transparent",
                      border: `1px solid ${activeSection === section.id ? `${accent}20` : "transparent"}`,
                      color: activeSection === section.id ? accent : "#6B7280",
                    }}
                  >
                    <div style={{ color: activeSection === section.id ? accent : "#6B7280" }}>{section.icon}</div>
                    <span className="text-[12px]" style={{ fontFamily: "var(--font-body)" }}>{section.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
