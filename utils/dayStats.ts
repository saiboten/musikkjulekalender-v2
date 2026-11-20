export type DayStats = {
  /** Players who found every song (one, or two on dual-answer days). */
  solvedCount: number;
  /** Dual-answer days: players who found one of the two songs. Null on ordinary days. */
  partialCount: number | null;
  /** Share of active players (0–1) who solved the day; null if nobody is active yet. */
  solveRate: number | null;
  /** Number of songs found per point value: 5 = no hints, 3/2/1 = after hint 1/2/3. */
  pointsSplit: Record<5 | 3 | 2 | 1, number>;
  firstSolver: { name: string; minutesAfterOpen: number } | null;
  medianMinutes: number | null;
  /** Null until guesses are logged for the day. */
  guesses: {
    total: number;
    players: number;
    /** Share (0–1) of players who guessed and got it right. */
    solvedPercent: number;
    /** Average number of guesses, including the right one, per solver who has logged guesses. */
    avgPerSolver: number | null;
  } | null;
};

type Input = {
  dayDate: Date;
  /** One row per song found. `userId` groups a player's finds; it defaults to the name. */
  answers: {
    points: number;
    timeOfEntry: Date;
    name: string;
    userId?: number;
  }[];
  guesses: { userId: number; correct: boolean }[];
  activePlayers: number;
  /** Songs to find: 1, or 2 on dual-answer days. */
  parts?: number;
};

const minutesBetween = (from: Date, to: Date) =>
  Math.max(0, Math.round((to.getTime() - from.getTime()) / 60_000));

function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function computeDayStats({
  dayDate,
  answers,
  guesses,
  activePlayers,
  parts = 1,
}: Input): DayStats {
  const pointsSplit: DayStats["pointsSplit"] = { 5: 0, 3: 0, 2: 0, 1: 0 };
  for (const { points } of answers) {
    if (points === 5 || points === 3 || points === 2 || points === 1) {
      pointsSplit[points]++;
    }
  }

  // A player has solved the day once they found every song; the time is their last find.
  const players = new Map<
    number | string,
    { name: string; found: number; time: Date }
  >();
  for (const a of answers) {
    const key = a.userId ?? a.name;
    const entry = players.get(key) ?? {
      name: a.name,
      found: 0,
      time: a.timeOfEntry,
    };
    entry.found++;
    if (a.timeOfEntry > entry.time) entry.time = a.timeOfEntry;
    players.set(key, entry);
  }
  const solvers = [...players.values()].filter((p) => p.found >= parts);
  const solvedCount = solvers.length;

  const byTime = [...solvers].sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  );
  const first = byTime[0];

  return {
    solvedCount,
    partialCount: parts > 1 ? players.size - solvedCount : null,
    solveRate: activePlayers > 0 ? solvedCount / activePlayers : null,
    pointsSplit,
    firstSolver: first
      ? {
          name: first.name,
          minutesAfterOpen: minutesBetween(dayDate, first.time),
        }
      : null,
    medianMinutes: median(solvers.map((p) => minutesBetween(dayDate, p.time))),
    guesses: summarizeGuesses(guesses),
  };
}

function summarizeGuesses(guesses: Input["guesses"]): DayStats["guesses"] {
  if (guesses.length === 0) return null;

  const perUser = new Map<number, { count: number; solved: boolean }>();
  for (const { userId, correct } of guesses) {
    const entry = perUser.get(userId) ?? { count: 0, solved: false };
    entry.count++;
    entry.solved ||= correct;
    perUser.set(userId, entry);
  }

  const solvers = [...perUser.values()].filter((u) => u.solved);
  const solverGuesses = solvers.reduce((sum, u) => sum + u.count, 0);

  return {
    total: guesses.length,
    players: perUser.size,
    solvedPercent: solvers.length / perUser.size,
    avgPerSolver: solvers.length > 0 ? solverGuesses / solvers.length : null,
  };
}
