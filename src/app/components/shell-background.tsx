/**
 * Shared topographic background treatments for shell/dashboard screens.
 * Uses the same Figma SVG paths as onboarding, but at dashboard-appropriate
 * opacities — subtler since dashboards have more content to read.
 * 
 * Three variants for the three hypotheses:
 * - "corridor": Topo lines drift right, dot-grid, minimal blobs. Tool-like.
 * - "sophia": Centered radial topo, warm gradient wash, breathing. Companion-like.
 * - "mission": Topo lines fill the canvas, dense grid, gradient band at top. Command center.
 */

import topoSvgPaths from "../../imports/svg-3bufurt997";
import patternHex from "../../assets/pattern-hex.svg";

const TOPO_PATHS = [
  { d: topoSvgPaths.p338f9380, color: "var(--ce-role-edgestar)" },
  { d: topoSvgPaths.p36a4b5b0, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p7035a40, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p3983ca60, color: "var(--ce-role-edgestar)" },
  { d: topoSvgPaths.p1be07340, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p21888e60, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p3e16f200, color: "var(--ce-role-edgestar)" },
  { d: topoSvgPaths.p9101500, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p2d0f2fc0, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p19740c00, color: "var(--ce-role-edgestar)" },
  { d: topoSvgPaths.p80b8920, color: "var(--ce-forest)" },
  { d: topoSvgPaths.p296fb600, color: "var(--ce-forest)" },
];

const NOISE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ─── H1: "The Corridor" ────────────────────────────────────────────────────
// Topo lines shifted right and faded, dot-grid center, single forest blob.
// Feels like a workspace — grounded, not decorative.

export function CorridorBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Dot grid — center fade */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle, rgba(var(--ce-glass-tint),0.025) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: "radial-gradient(ellipse 80% 70% at 55% 45%, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 55% 45%, black 20%, transparent 75%)",
      }} />

      {/* Forest green blob — upper left, very dim */}
      <div className="absolute rounded-full"
        style={{
          width: "800px", height: "800px", left: "-200px", top: "-250px",
          background: "radial-gradient(circle, rgba(4,44,1,0.12) 0%, rgba(4,44,1,0.03) 40%, transparent 70%)",
          filter: "blur(100px)",
        }} />

      {/* Cyan wash — right side, very subtle */}
      <div className="absolute rounded-full"
        style={{
          width: "500px", height: "700px", right: "-150px", top: "20%",
          background: "radial-gradient(circle, rgba(var(--ce-role-edgestar-rgb),0.025) 0%, transparent 65%)",
          filter: "blur(100px)",
        }} />

      {/* Topo lines — shifted right, low opacity */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1099 851"
        preserveAspectRatio="xMaxYMid slice"
        style={{ opacity: 0.015, right: 0 }}
      >
        <g transform="translate(200, -50)">
          {TOPO_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={p.color} strokeOpacity="0.5" strokeWidth="1.16" />
          ))}
        </g>
      </svg>

      {/* Hex grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${patternHex})`,
        backgroundSize: "600px auto",
        backgroundRepeat: "repeat",
        opacity: 0.025,
        maskImage: "radial-gradient(ellipse 70% 60% at 55% 45%, black 15%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 55% 45%, black 15%, transparent 65%)",
      }} />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: NOISE_URL,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}

// ─── H2: "Sophia Forward" ──────────────────────────────────────────────────
// Centered radial topo, warm gradient wash, generous. 
// The background breathes — like the product is alive around you.

export function SophiaForwardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Primary gradient wash — warm, centered, expansive */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 90% 60% at 50% 35%, rgba(var(--ce-role-edgestar-rgb),0.035) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 65% 65%, rgba(var(--ce-lime-rgb),0.02) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 25% 70%, rgba(4,44,1,0.06) 0%, transparent 50%)",
      }} />

      {/* Topo lines — centered, radial mask to create "landscape" feel */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1099 851"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.02 }}
      >
        <defs>
          <radialGradient id="topo-mask-h2" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="topo-radial-mask">
            <rect width="100%" height="100%" fill="url(#topo-mask-h2)" />
          </mask>
        </defs>
        <g mask="url(#topo-radial-mask)">
          {TOPO_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={p.color} strokeOpacity="0.6" strokeWidth="1.16" />
          ))}
        </g>
      </svg>

      {/* Hex grid pattern — subtle geometric structure under content */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${patternHex})`,
        backgroundSize: "600px auto",
        backgroundRepeat: "repeat",
        opacity: 0.03,
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 10%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 10%, transparent 70%)",
      }} />

      {/* Cyan accent glow — top center, very soft, where Sophia's greeting lives */}
      <div className="absolute rounded-full"
        style={{
          width: "600px", height: "300px", left: "50%", top: "8%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(var(--ce-role-edgestar-rgb),0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

      {/* Forest depth — bottom edge, grounds the Sophia bar */}
      <div className="absolute rounded-full"
        style={{
          width: "100%", height: "300px", left: 0, bottom: "-100px",
          background: "linear-gradient(to top, rgba(4,44,1,0.08), transparent)",
          filter: "blur(40px)",
        }} />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.012]" style={{
        backgroundImage: NOISE_URL,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}

// ─── H3: "Mission Control" ─────────────────────────────────────────────────
// Full topo coverage, denser, with gradient band at top merging into content.
// Feels like satellite terrain data — serious, data-rich, operational.

export function MissionControlBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Brand gradient band — top area, merges with the header gradient */}
      <div className="absolute top-0 left-[220px] right-0 h-[200px]" style={{
        background: "linear-gradient(180deg, rgba(4,44,1,0.15) 0%, rgba(var(--ce-role-edgestar-rgb),0.03) 40%, transparent 100%)",
      }} />

      {/* Forest green blob — left side, behind sidebar edge */}
      <div className="absolute rounded-full"
        style={{
          width: "600px", height: "900px", left: "100px", top: "-100px",
          background: "radial-gradient(circle, rgba(4,44,1,0.1) 0%, rgba(4,44,1,0.03) 40%, transparent 65%)",
          filter: "blur(80px)",
        }} />

      {/* Cyan operational glow — right side, subtle */}
      <div className="absolute rounded-full"
        style={{
          width: "500px", height: "500px", right: "-100px", bottom: "10%",
          background: "radial-gradient(circle, rgba(var(--ce-role-edgestar-rgb),0.02) 0%, transparent 60%)",
          filter: "blur(80px)",
        }} />

      {/* Full topo lines — denser, with a slight diagonal offset for dynamism */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1099 851"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.025 }}
      >
        <g transform="translate(-50, -30)">
          {TOPO_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={p.color} strokeOpacity="0.5" strokeWidth="1.0" />
          ))}
        </g>
        {/* Second pass — offset for density */}
        <g transform="translate(100, 80)" style={{ opacity: 0.4 }}>
          {TOPO_PATHS.slice(0, 6).map((p, i) => (
            <path key={`b-${i}`} d={p.d} fill="none" stroke={p.color} strokeOpacity="0.3" strokeWidth="0.8" />
          ))}
        </g>
      </svg>

      {/* Fine dot grid — dense, operational */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle, rgba(var(--ce-glass-tint),0.015) 0.5px, transparent 0.5px)",
        backgroundSize: "16px 16px",
        maskImage: "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
      }} />

      {/* Hex grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${patternHex})`,
        backgroundSize: "500px auto",
        backgroundRepeat: "repeat",
        opacity: 0.02,
      }} />

      {/* Noise — slightly more visible for texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: NOISE_URL,
        backgroundSize: "128px 128px",
      }} />
    </div>
  );
}
