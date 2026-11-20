import { prisma } from "./prisma";
import { dayTargets } from "../utils/matchGuess";

/** The name shown for a user in lists and stats. */
export function displayName(user: {
  nickname: string | null;
  email: string | null;
}) {
  return user.nickname ?? user.email?.split("@")[0] ?? "ukjent";
}

/**
 * Everyone who found something on the given day, best score first, then fastest first.
 * A player's correct answers (artist, song, both songs on dual days) are summed;
 * the time is the latest one.
 */
export async function getSolvedAnswers(dayId: number | undefined) {
  const [day, answers] = await Promise.all([
    prisma.day.findUnique({
      where: { id: dayId ?? -1 },
      select: { dualAnswer: true, hasTextSolution: true },
    }),
    prisma.answer.findMany({
      include: {
        user: true,
      },
      where: {
        points: {
          gt: 0,
        },
        dayId: dayId ?? -1,
      },
    }),
  ]);

  const parts = day ? dayTargets(day).length : 1;
  const byUser = new Map<
    number,
    { points: number; user: string; time: Date; found: number }
  >();
  for (const answer of answers) {
    const entry = byUser.get(answer.userId) ?? {
      points: 0,
      user: displayName(answer.user),
      time: answer.timeOfEntry,
      found: 0,
    };
    entry.points += answer.points;
    entry.found++;
    if (answer.timeOfEntry > entry.time) entry.time = answer.timeOfEntry;
    byUser.set(answer.userId, entry);
  }

  return [...byUser.values()]
    .sort((el1, el2) => {
      if (el1.points !== el2.points) {
        return el2.points - el1.points;
      }
      return el1.time.getTime() - el2.time.getTime();
    })
    .map((e) => ({
      points: e.points,
      user: e.user,
      time: e.time.toISOString(),
      found: e.found,
      parts,
    }));
}
