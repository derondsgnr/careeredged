import { Link } from "react-router";

export function LogoIcon({ color = "var(--accent)", className = "" }: { color?: string; className?: string }) {
  return (
    <svg className={className} width="28" height="38" viewBox="0 0 133 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill={color} />
      <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill={color} />
      <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill={color} />
    </svg>
  );
}

export function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "white" | "dark";
  className?: string;
}) {
  const iconColor =
    variant === "dark" ? "#12110E" :
    variant === "white" ? "#FFFFFF" :
    "var(--accent)";
  const textColor =
    variant === "white"
      ? "#FFFFFF"
      : variant === "dark"
        ? "#12110E"
        : "currentColor";

  return (
    <Link to="/" className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <LogoIcon color={iconColor} />
      <span
        className="text-[17px] font-bold tracking-tight leading-tight"
        style={{ color: textColor }}
      >
        Career
        <br />
        Edge
      </span>
    </Link>
  );
}
