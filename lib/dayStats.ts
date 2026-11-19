import { prisma } from "./prisma";
import { displayName } from "./answers";
import { computeDayStats } from "../utils/dayStats";

/** Stats for one day. Active players = users with a correct answer that calendar year. */
export async function getDayStats(day: { id: number; date: Date }) {
  const year = day.date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const nextYearStart = new Date(Date.UTC(year + 1, 0, 1));

  const [answers, guesses, activePlayers] = await Promise.all([
    prisma.answer.findMany({
      where: { dayId: day.id, points: { gt: 0 } },
      include: { user: true },
    }),
    prisma.guess.findMany({
      where: { dayId: day.id },
      select: { userId: true, correct: true },
    }),
    prisma.answer.groupBy({
      by: ["userId"],
      where: { day: { date: { gte: yearStart, lt: nextYearStart } } },
    }),
  ]);

  return computeDayStats({
    dayDate: day.date,
    answers: answers.map((a) => ({
      points: a.points,
      timeOfEntry: a.timeOfEntry,
      name: displayName(a.user),
    })),
    guesses,
    activePlayers: activePlayers.length,
  });
}
