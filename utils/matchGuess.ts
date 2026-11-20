export const normalizeGuess = (value: string) => value.trim().toLowerCase();

export type GuessMatch =
  | { kind: "new"; part: number }
  | { kind: "alreadyFound"; part: number }
  | { kind: "wrong" };

/**
 * Checks a guess against every part's accepted answers.
 * A match on a part the player hasn't found yet wins over one they already have.
 */
export function matchGuess(
  guess: string,
  solutions: { solution: string; part: number }[],
  foundParts: number[]
): GuessMatch {
  const normalized = normalizeGuess(guess);
  if (!normalized) return { kind: "wrong" };

  const matchedParts = new Set(
    solutions
      .filter((s) => normalizeGuess(s.solution) === normalized)
      .map((s) => s.part)
  );

  const newPart = [...matchedParts]
    .sort((a, b) => a - b)
    .find((part) => !foundParts.includes(part));
  if (newPart !== undefined) return { kind: "new", part: newPart };

  const oldPart = [...matchedParts][0];
  if (oldPart !== undefined) return { kind: "alreadyFound", part: oldPart };

  return { kind: "wrong" };
}

/** The parts a day has: [1], or [1, 2] on dual-answer days. */
export const dayParts = (day: { dualAnswer: boolean }) =>
  day.dualAnswer ? [1, 2] : [1];
