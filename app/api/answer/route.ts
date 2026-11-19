import { isSameDay } from "date-fns";
import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { calculatePointsAt } from "../../../utils/pointscalculator";
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

  const solvedResponse = {
    success: true,
    artist: day.artist,
    song: day.song,
    solutionVideo: day.solutionVideo,
  };

  // Already solved: don't log the guess or store a second answer.
  const existingAnswer = await prisma.answer.findFirst({
    where: { dayId: day.id, userId: session.id },
  });
  if (existingAnswer) {
    return Response.json(solvedResponse);
  }

  const result = await prisma.solution.findMany({
    where: {
      dayId: day.id,
    },
  });

  const rightAnswerList = result.map((el) => el.solution.toLowerCase());
  const normalizedGuess = guess.trim().toLowerCase();
  const correct = rightAnswerList.includes(guess.toLowerCase());

  await prisma.guess.create({
    data: {
      guess: normalizedGuess,
      correct,
      dayId: day.id,
      userId: session.id,
    },
  });

  if (correct) {
    const now = new Date();
    await prisma.answer.create({
      data: {
        timeOfEntry: now,
        points: calculatePointsAt(day.date, now),
        dayId: day.id,
        userId: session.id,
      },
    });
    return Response.json(solvedResponse);
  }

  return Response.json({ success: false });
}
