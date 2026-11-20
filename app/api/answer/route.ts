import { isSameDay } from "date-fns";
import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { calculatePointsAt } from "../../../utils/pointscalculator";
import { getToday } from "../../../utils/dates";
import { getSession } from "../../../lib/auth";
import {
  type AnswerKind,
  type Target,
  acceptedAnswers,
  dayTargets,
  matchGuess,
  normalizeGuess,
} from "../../../utils/matchGuess";

export type FieldResult = "correct" | "wrong" | "alreadyFound";

export type AnswerResponse = {
  /** Result per field that was filled in. */
  results: Partial<Record<AnswerKind, FieldResult>>;
  /** Everything on the day has been found. */
  done: boolean;
};

/**
 * Checks a guess. `artist` and `song` are checked on their own, and each one
 * found is scored by the clock. Text puzzles only use `song`.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const dayId = Number(params.get("dayId"));

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

  const targets = dayTargets(day);
  const existing = await prisma.answer.findMany({
    where: { dayId: day.id, userId: session.id },
    select: { part: true, kind: true },
  });
  const found: Target[] = existing.map((a) => ({
    part: a.part,
    kind: a.kind as AnswerKind,
  }));
  const isDone = () =>
    targets.every((t) =>
      found.some((f) => f.part === t.part && f.kind === t.kind)
    );

  // Already solved: don't log the guess or store more answers.
  if (isDone()) {
    return Response.json({ results: {}, done: true } satisfies AnswerResponse);
  }

  const extras = await prisma.solution.findMany({
    where: { dayId: day.id },
    select: { solution: true, part: true, kind: true },
  });
  const accepted = acceptedAnswers(day, extras);
  const fields = [...new Set(targets.map((t) => t.kind))] as AnswerKind[];

  const results: AnswerResponse["results"] = {};
  const now = new Date();

  for (const field of fields) {
    const guess = params.get(field) ?? "";
    if (!guess.trim()) continue;

    const match = matchGuess(guess, field, accepted, found);
    if (match.kind === "alreadyFound") {
      // Typing something you already found again costs nothing.
      results[field] = "alreadyFound";
      continue;
    }

    const correct = match.kind === "new";
    await prisma.guess.create({
      data: {
        guess: normalizeGuess(guess),
        kind: field,
        correct,
        dayId: day.id,
        userId: session.id,
      },
    });

    if (correct) {
      await prisma.answer.create({
        data: {
          timeOfEntry: now,
          points: calculatePointsAt(day.date, now),
          part: match.part,
          kind: field,
          dayId: day.id,
          userId: session.id,
        },
      });
      found.push({ part: match.part, kind: field });
    }
    results[field] = correct ? "correct" : "wrong";
  }

  return Response.json({ results, done: isDone() } satisfies AnswerResponse);
}
