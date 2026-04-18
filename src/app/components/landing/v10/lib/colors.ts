/**
 * Returns a contrast-safe version of an accent color for use as text.
 * Lime green (#B3FF3B) is great on dark backgrounds but unreadable on light ones.
 * This returns a darkened variant for light background contexts.
 */
export function textSafeColor(color: string, onDark: boolean = false): string {
  if (onDark) return color;
  const lightSafeMap: Record<string, string> = {
    "#B3FF3B": "#3D6600",
    "#FACC15": "#92700C",
  };
  return lightSafeMap[color] || color;
}
