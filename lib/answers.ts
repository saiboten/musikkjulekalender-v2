import { prisma } from "./prisma";

/** Everyone who solved the given day, best score first, then fastest first. */
export async function getSolvedAnswers(dayId: number | undefined) {
  const answers = await prisma.answer.findMany({
    include: {
      user: true,
    },
    where: {
      points: {
        gt: 0,
      },
      dayId: dayId ?? -1,
    },
  });

  return answers
    .sort((el1, el2) => {
      if (el1.points !== el2.points) {
        return el2.points - el1.points;
      }
      return el1.timeOfEntry.getTime() - el2.timeOfEntry.getTime();
    })
    .map((e) => ({
      points: e.points,
      user: e.user.nickname ?? e.user.email?.split("@")[0] ?? "ukjent",
      time: e.timeOfEntry.toISOString(),
    }));
}
