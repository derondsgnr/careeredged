import { useLandingTheme } from "./use-landing-theme";

interface LandingWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function LandingWrapper({ children, className = "" }: LandingWrapperProps) {
  const { wrapperClass } = useLandingTheme();

  return (
    <div className={`${wrapperClass} ${className}`} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
