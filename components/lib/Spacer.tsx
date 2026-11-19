/**
 * Vertical space of `multiply` rem (default 1rem).
 *
 * Uses a fixed height rather than a margin, so stacked spacers add up instead
 * of collapsing into a single margin.
 */
export const Spacer = ({ multiply = 1 }: { multiply?: number }) => (
  <div aria-hidden className="shrink-0" style={{ height: `${multiply}rem` }} />
);
