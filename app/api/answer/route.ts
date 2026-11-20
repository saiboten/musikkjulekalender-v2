import { isSameDay } from "date-fns";
import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { calculatePointsAt } from "../../../utils/pointscalculator";
import { getToday } from "../../../utils/dates";
import { getSession } from "../../../lib/auth";
import {
  dayParts,
  matchGuess,
  normalizeGuess,
} from "../../../utils/matchGuess";

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

  const parts = dayParts(day);
  const existingAnswers = await prisma.answer.findMany({
    where: { dayId: day.id, userId: session.id },
    select: { part: true },
  });
  const foundParts = existingAnswers.map((a) => a.part);
  const isDone = (found: number[]) => parts.every((p) => found.includes(p));

  // Already solved: don't log the guess or store another answer.
  if (isDone(foundParts)) {
    return Response.json({ success: true, done: true });
  }

  const solutions = await prisma.solution.findMany({
    where: { dayId: day.id, part: { in: parts } },
    select: { solution: true, part: true },
  });

  const match = matchGuess(guess, solutions, foundParts);

  if (match.kind === "alreadyFound") {
    return Response.json({
      success: false,
      alreadyFound: true,
      part: match.part,
    });
  }

  const correct = match.kind === "new";

  await prisma.guess.create({
    data: {
      guess: normalizeGuess(guess),
      correct,
      dayId: day.id,
      userId: session.id,
    },
  });

  if (!correct) {
    return Response.json({ success: false });
  }

  const now = new Date();
  await prisma.answer.create({
    data: {
      timeOfEntry: now,
      points: calculatePointsAt(day.date, now),
      part: match.part,
      dayId: day.id,
      userId: session.id,
    },
  });

  return Response.json({
    success: true,
    part: match.part,
    done: isDone([...foundParts, match.part]),
  });
}
