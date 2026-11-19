import { prisma } from "./prisma";

/** The name shown for a user in lists and stats. */
export function displayName(user: {
  nickname: string | null;
  email: string | null;
}) {
  return user.nickname ?? user.email?.split("@")[0] ?? "ukjent";
}

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
      user: displayName(e.user),
      time: e.timeOfEntry.toISOString(),
    }));
}
