export const normalizeGuess = (value: string) => value.trim().toLowerCase();

export type AnswerKind = "song" | "artist";

/** Something a player has to find: the song or the artist of song 1 or 2. */
export type Target = { part: number; kind: AnswerKind };

export const targetKey = ({ part, kind }: Target) => `${part}-${kind}`;

type DayKey = {
  dualAnswer: boolean;
  hasTextSolution: boolean | null;
  artist: string;
  song: string;
  artist2: string | null;
  song2: string | null;
};

/**
 * What a player has to find on a day. Text puzzles have only an answer
 * (stored as the song); other days have an artist and a song per song.
 */
export function dayTargets(day: {
  dualAnswer: boolean;
  hasTextSolution: boolean | null;
}): Target[] {
  const parts = day.dualAnswer ? [1, 2] : [1];
  const kinds: AnswerKind[] = day.hasTextSolution
    ? ["song"]
    : ["artist", "song"];
  return parts.flatMap((part) => kinds.map((kind) => ({ part, kind })));
}

/**
 * Every accepted answer for the day's targets: the answer key's artist and
 * song first, then the extra accepted spellings.
 */
export function acceptedAnswers(
  day: DayKey,
  extras: { solution: string; part: number; kind: string }[]
) {
  const fromKey = (target: Target) => {
    const value =
      target.part === 1
        ? target.kind === "artist"
          ? day.artist
          : day.song
        : target.kind === "artist"
          ? day.artist2
          : day.song2;
    return value ? [{ ...target, answer: value }] : [];
  };

  return dayTargets(day).flatMap((target) => [
    ...fromKey(target),
    ...extras
      .filter((e) => e.part === target.part && e.kind === target.kind)
      .map((e) => ({ ...target, answer: e.solution })),
  ]);
}

export type GuessMatch =
  | { kind: "new"; part: number }
  | { kind: "alreadyFound"; part: number }
  | { kind: "wrong" };

/**
 * Checks a guess typed in the artist or song field against the accepted
 * answers of that kind. A match on something not found yet wins over one
 * the player already has.
 */
export function matchGuess(
  guess: string,
  field: AnswerKind,
  accepted: { part: number; kind: string; answer: string }[],
  found: Target[]
): GuessMatch {
  const normalized = normalizeGuess(guess);
  if (!normalized) return { kind: "wrong" };

  const matchedParts = [
    ...new Set(
      accepted
        .filter(
          (a) => a.kind === field && normalizeGuess(a.answer) === normalized
        )
        .map((a) => a.part)
    ),
  ].sort((a, b) => a - b);

  const isFound = (part: number) =>
    found.some((f) => f.part === part && f.kind === field);

  const newPart = matchedParts.find((part) => !isFound(part));
  if (newPart !== undefined) return { kind: "new", part: newPart };

  if (matchedParts.length > 0) {
    return { kind: "alreadyFound", part: matchedParts[0] };
  }
  return { kind: "wrong" };
}
