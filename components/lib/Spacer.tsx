/**
 * Vertical space of 1rem.
 *
 * `multiply` is accepted for compatibility but adds no space: the old
 * styled-components version produced invalid CSS for it (`margin-top: 1rem}`),
 * so the browser ignored it, and the current layout is built around that.
 */
export const Spacer = ({ multiply }: { multiply?: number }) => (
  <div className={multiply ? undefined : "mt-4"} />
);
