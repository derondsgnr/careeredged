/**
 * BtnText — Scalient-style text-swap hover for buttons.
 * Wrap button text in this component to get the slide-up/slide-in effect.
 * The parent <a> or <button> must have the `btn` class.
 */
export function BtnText({ children }: { children: React.ReactNode }) {
  return (
    <span className="btn-text">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
