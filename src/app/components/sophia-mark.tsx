import { motion } from "motion/react";

/**
 * Sophia's geometric mark — a compass-like symbol with directional energy.
 * Inspired by the brand's pathfinding motif. Cyan glow, geometric precision.
 */
export function SophiaMark({ size = 64, glowing = true }: { size?: number; glowing?: boolean }) {
  const r = size / 2;
  const innerR = r * 0.35;
  const outerR = r * 0.85;
  const dotR = size * 0.04;

  // Four cardinal points (compass directions)
  const points = [
    { x: r, y: r - outerR }, // N
    { x: r + outerR, y: r }, // E
    { x: r, y: r + outerR }, // S
    { x: r - outerR, y: r }, // W
  ];

  // Inner diamond
  const innerPoints = [
    { x: r, y: r - innerR },
    { x: r + innerR, y: r },
    { x: r, y: r + innerR },
    { x: r - innerR, y: r },
  ];

  const outerPath = `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`;
  const innerPath = `M ${innerPoints[0].x} ${innerPoints[0].y} L ${innerPoints[1].x} ${innerPoints[1].y} L ${innerPoints[2].x} ${innerPoints[2].y} L ${innerPoints[3].x} ${innerPoints[3].y} Z`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {glowing && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(var(--ce-role-edgestar-rgb), 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="sophia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--ce-role-edgestar)" />
            <stop offset="100%" stopColor="var(--ce-cyan)" />
          </linearGradient>
          <filter id="sophia-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer diamond — thin stroke */}
        <motion.path
          d={outerPath}
          stroke="url(#sophia-gradient)"
          strokeWidth={1.2}
          fill="none"
          filter={glowing ? "url(#sophia-glow)" : undefined}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Inner diamond — filled with gradient at low opacity */}
        <motion.path
          d={innerPath}
          fill="rgba(var(--ce-role-edgestar-rgb), 0.08)"
          stroke="url(#sophia-gradient)"
          strokeWidth={0.8}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: `${r}px ${r}px` }}
        />

        {/* Center dot */}
        <motion.circle
          cx={r}
          cy={r}
          r={dotR}
          fill="var(--ce-role-edgestar)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.0, type: "spring" }}
        />

        {/* Cardinal dots */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={dotR * 0.8}
            fill="var(--ce-cyan)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}
