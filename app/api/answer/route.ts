import { isSameDay } from "date-fns";
import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { calculatePoints } from "../../../utils/pointscalculator";
import { getToday } from "../../../utils/dates";
import { getSession } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const guess = request.nextUrl.searchParams.get("guess") ?? "";
  const dayId = Number(request.nextUrl.searchParams.get("dayId"));

  const session = await getSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const day = await prisma.day.findUnique({
    where: {
      id: dayId || -1,
    },
  });

  if (!day || !isSameDay(getToday(), day.date) || day.date > new Date()) {
    return Response.json({ message: "Dag ikke åpen" }, { status: 401 });
  }

  const result = await prisma.solution.findMany({
    where: {
      dayId: day.id,
    },
  });

  const hints = await prisma.hint.findFirst({
    where: {
      dayId: day.id,
      userId: session.id,
    },
  });

  const rightAnswerList = result.map((el) => el.solution.toLowerCase());

  if (rightAnswerList.includes(guess.toLowerCase())) {
    await prisma.answer.create({
      data: {
        timeOfEntry: new Date(),
        points: calculatePoints([hints?.hint1, hints?.hint2, hints?.hint3]),
        dayId: day.id,
        userId: session.id,
      },
    });
    return Response.json({
      success: true,
      artist: day.artist,
      song: day.song,
      solutionVideo: day.solutionVideo,
    });
  }

  return Response.json({ success: false });
}
