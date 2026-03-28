/**
 * Brand Patterns — SVG pattern components from the CareerEdged brand identity.
 *
 * Each pattern supports:
 *   - `color`     — stroke/fill color (default: brand color)
 *   - `bgColor`   — background fill
 *   - `opacity`   — pattern opacity (0–1)
 *   - `scale`     — pattern tile scale multiplier
 *   - `className` — additional Tailwind / CSS classes
 *
 * Usage:
 *   <PatternOverlay pattern="tiles" opacity={0.08} />
 *   <BrandPatternCard pattern="chevrons" bgColor="#00253A">...children</BrandPatternCard>
 */

import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "./utils";

// ─── Pattern Prop Types ──────────────────────────────────────────────────────

interface PatternProps {
  /** Pattern fill/stroke color */
  color?: string;
  /** Background color behind the pattern */
  bgColor?: string;
  /** Pattern opacity 0–1 */
  opacity?: number;
  /** Scale multiplier for the pattern tile (1 = default size) */
  scale?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

// ─── Pattern 01: Octagonal Tile Grid ────────────────────────────────────────
// Lime green octagon tiles on olive background.
// From brand file: bg #70B600, tiles in lighter lime.
// Corner radii are FIXED — they stay sharp/edgy regardless of scale.

export function PatternTiles({
  color = "#B3FF3B",
  bgColor = "#70B600",
  opacity = 1,
  scale = 1,
  className,
  style,
}: PatternProps) {
  const id = useId();
  const patternId = `pattern-tiles-${id}`;

  // Tile geometry scales, but corner cut and radius stay FIXED for edgy look
  const tileSize = 120 * scale;
  const gap = 8 * scale;
  const cellSize = tileSize + gap;

  // Fixed corner values — never scale these
  const cornerCut = 20;
  const r = 8;

  // Octagon path with fixed sharp corners
  const octPath = `
    M ${cornerCut + r},0
    L ${tileSize - cornerCut - r},0
    Q ${tileSize - cornerCut},0 ${tileSize - cornerCut + r * 0.7},${cornerCut - r * 0.7}
    L ${tileSize - r * 0.3},${cornerCut + r * 0.3}
    Q ${tileSize},${cornerCut} ${tileSize},${cornerCut + r}
    L ${tileSize},${tileSize - cornerCut - r}
    Q ${tileSize},${tileSize - cornerCut} ${tileSize - r * 0.3},${tileSize - cornerCut - r * 0.3}
    L ${tileSize - cornerCut + r * 0.7},${tileSize - cornerCut + r * 0.7}
    Q ${tileSize - cornerCut},${tileSize} ${tileSize - cornerCut - r},${tileSize}
    L ${cornerCut + r},${tileSize}
    Q ${cornerCut},${tileSize} ${cornerCut - r * 0.7},${tileSize - cornerCut + r * 0.7}
    L ${r * 0.3},${tileSize - cornerCut - r * 0.3}
    Q 0,${tileSize - cornerCut} 0,${tileSize - cornerCut - r}
    L 0,${cornerCut + r}
    Q 0,${cornerCut} ${r * 0.3},${cornerCut + r * 0.3}
    L ${cornerCut - r * 0.7},${cornerCut - r * 0.7}
    Q ${cornerCut},0 ${cornerCut + r},0
    Z
  `;

  return (
    <svg
      className={cn("absolute inset-0 size-full", className)}
      style={{ opacity, ...style }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="100%" height="100%" fill={bgColor} />
      <defs>
        <pattern
          id={patternId}
          x={gap / 2}
          y={gap / 2}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path d={octPath} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

// ─── Pattern 02: Logo Mark Tessellation ─────────────────────────────────────
// The CareerEdged logo mark (square with notched corner + arrow) repeated
// diagonally. From brand file: bg #22D3EE, marks in slightly darker/lighter blue.
//
// The mark consists of two shapes:
//   1. A square with the top-right corner cut away (the "C" / page shape)
//   2. An arrow pointing up-right sitting in the cut-away corner

export function PatternArrows({
  color = "rgba(0,140,200,0.35)",
  bgColor = "#22D3EE",
  opacity = 1,
  scale = 1,
  className,
  style,
}: PatternProps) {
  const id = useId();
  const patternId = `pattern-arrows-${id}`;

  // Each logo mark unit sits in a cell
  const cellSize = 90 * scale;
  // Diagonal offset — each row shifts right and down
  const shiftX = cellSize * 0.5;
  const shiftY = cellSize * 0.5;
  const patternW = cellSize;
  const patternH = cellSize * 2;

  const m = cellSize * 0.12; // margin inside cell
  const s = cellSize - m * 2; // mark size
  const notch = s * 0.45; // corner notch size

  // Shape 1: Square with top-right corner notched (the "page" / "C" shape)
  const pagePath = `
    M ${m},${m}
    L ${m + s - notch},${m}
    L ${m + s},${m + notch}
    L ${m + s},${m + s}
    L ${m},${m + s}
    Z
  `;

  // Shape 2: Arrow in the notch — pointing up-right
  const arrowSize = notch * 0.75;
  const ax = m + s - notch * 0.7; // arrow origin x
  const ay = m + notch * 0.7; // arrow origin y
  const arrowPath = `
    M ${ax},${ay}
    L ${ax + arrowSize * 0.5},${ay - arrowSize * 0.7}
    L ${ax + arrowSize * 0.5},${ay - arrowSize * 0.2}
    L ${ax + arrowSize},${ay - arrowSize * 0.2}
    L ${ax + arrowSize},${ay + arrowSize * 0.3}
    L ${ax + arrowSize * 0.5},${ay + arrowSize * 0.3}
    L ${ax + arrowSize * 0.5},${ay + arrowSize * 0.7}
    Z
  `;

  return (
    <svg
      className={cn("absolute inset-0 size-full", className)}
      style={{ opacity, ...style }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="100%" height="100%" fill={bgColor} />
      <defs>
        <pattern
          id={patternId}
          width={patternW}
          height={patternH}
          patternUnits="userSpaceOnUse"
        >
          {/* Row 1 — mark at (0,0) */}
          <path d={pagePath} fill={color} />
          <path d={arrowPath} fill={color} />
          {/* Row 2 — offset by half a cell diagonally */}
          <g transform={`translate(${shiftX}, ${shiftY + cellSize * 0.08})`}>
            <path d={pagePath} fill={color} />
            <path d={arrowPath} fill={color} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

// ─── Pattern 03: Chevron Stripes ────────────────────────────────────────────
// Large chevron/arrow stripes pointing right on dark navy.
// From brand file: bg #00253A, strokes in lime #B3FF3B.

export function PatternChevrons({
  color = "#B3FF3B",
  bgColor = "#00253A",
  opacity = 1,
  scale = 1,
  className,
  style,
}: PatternProps) {
  const id = useId();
  const patternId = `pattern-chevrons-${id}`;
  const strokeWidth = 3 * scale;
  const chevronW = 180 * scale;
  const chevronH = 400 * scale;
  const gap = 40 * scale;
  const patternWidth = chevronW + gap;

  // Each chevron is a ">"-shaped path pointing right
  const chevronPath = `
    M 0,0
    L ${chevronW * 0.6},${chevronH * 0.5}
    L 0,${chevronH}
  `;

  return (
    <svg
      className={cn("absolute inset-0 size-full", className)}
      style={{ opacity, ...style }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="100%" height="100%" fill={bgColor} />
      <defs>
        <pattern
          id={patternId}
          width={patternWidth}
          height={chevronH}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={chevronPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="bevel"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

// ─── Pattern Overlay — Generic Wrapper ──────────────────────────────────────
// Renders any pattern as an absolute-positioned overlay inside a relative parent.

type PatternType = "tiles" | "arrows" | "chevrons";

interface PatternOverlayProps extends PatternProps {
  pattern: PatternType;
}

export function PatternOverlay({ pattern, ...props }: PatternOverlayProps) {
  switch (pattern) {
    case "tiles":
      return <PatternTiles {...props} />;
    case "arrows":
      return <PatternArrows {...props} />;
    case "chevrons":
      return <PatternChevrons {...props} />;
  }
}

// ─── Brand Pattern Card ─────────────────────────────────────────────────────
// A card/surface with a brand pattern in the background.
// Children render on top of the pattern.

interface BrandPatternCardProps extends PatternProps {
  pattern: PatternType;
  children?: ReactNode;
  /** Classes for the outer container */
  containerClassName?: string;
  /** Classes for the content layer (above pattern) */
  contentClassName?: string;
}

export function BrandPatternCard({
  pattern,
  children,
  containerClassName,
  contentClassName,
  className,
  ...patternProps
}: BrandPatternCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        containerClassName
      )}
    >
      <PatternOverlay
        pattern={pattern}
        className={className}
        {...patternProps}
      />
      <div className={cn("relative z-10", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
