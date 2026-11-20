import React from "react";
import { notFound, redirect } from "next/navigation";
import { isBefore, isSameDay } from "date-fns";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { getSolvedAnswers } from "../../../lib/answers";
import { getDayStats } from "../../../lib/dayStats";
import { Today } from "../../../components/Today";
import { OldDay } from "../../../components/OldDay";
import { FutureDay } from "../../../components/FutureDay";
import { DayWithAdmin } from "../../../components/Day";
import {
  calculatePointsAt,
  getHintOpenTime,
  getOpenHintCount,
} from "../../../utils/pointscalculator";
import { dayParts } from "../../../utils/matchGuess";

export default async function DayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const day = await prisma.day.findUnique({
    where: {
      id: Number(id) || -1,
    },
  });

  if (!day) {
    notFound();
  }

  const todayAnswers = await getSolvedAnswers(day.id);

  const answers = await prisma.answer.findMany({
    where: {
      dayId: day.id,
      userId: session.id,
    },
  });
  const foundParts = answers.map((a) => a.part).sort((a, b) => a - b);
  const solved = dayParts(day).every((p) => foundParts.includes(p));
  const earnedPoints = answers.reduce((sum, a) => sum + a.points, 0);

  const now = new Date();
  const isToday = isSameDay(day.date, now) && day.date < now;
  const isDayPassed = isBefore(day.date, now);
  const openHints = getOpenHintCount(day.date, now);
  // The points one (more) song is worth right now, or the total once solved.
  const points = solved ? earnedPoints : calculatePointsAt(day.date, now);
  const hintOpenTimes = ([1, 2, 3] as const).map((n) =>
    getHintOpenTime(day.date, n).toISOString()
  );
  const hintExists = [
    !!day.hint1 || !!day.hasFileHint1,
    !!day.hint2 || !!day.hasFileHint2,
    !!day.hint3 || !!day.hasFileHint3,
  ];
  // A hint exists if it has text or an audio file; empty text is stored as null or "".
  const hasHints = hintExists.some(Boolean);

  const stats = isToday || isDayPassed ? await getDayStats(day) : undefined;

  const dayWithFixedDates = {
    ...day,
    date: day.date.toISOString(),
    isToday,
    isDayPassed,
    now: now.toISOString(),
    hasHints,
    hintExists,
    todayAnswers,
    stats,
    foundParts,
    earnedPoints,
  };

  // The day's props are passed on as before; the client components only read
  // the fields that apply to their state.
  let props: Record<string, unknown>;

  if (isDayPassed && !isToday) {
    props = dayWithFixedDates;
  } else if (isToday && solved) {
    props = {
      ...dayWithFixedDates,
      solved: true,
      points,
      openHints: 3,
      hintOpenTimes,
      hintExists,
    };
  } else if (isToday) {
    // Today, unsolved: only send what the user is allowed to see.
    props = {
      madeBy: day.madeBy,
      date: day.date.toISOString(),
      isToday,
      isDayPassed,
      hasTextSolution: day.hasTextSolution,
      dualAnswer: day.dualAnswer,
      foundParts,
      earnedPoints,
      // Only reveal the songs the player has already found.
      artist: foundParts.includes(1) ? day.artist : undefined,
      song: foundParts.includes(1) ? day.song : undefined,
      artist2: foundParts.includes(2) ? day.artist2 : undefined,
      song2: foundParts.includes(2) ? day.song2 : undefined,
      hasHints,
      hint1: openHints >= 1 ? day.hint1 : null,
      hint2: openHints >= 2 ? day.hint2 : null,
      hint3: openHints >= 3 ? day.hint3 : null,
      hasFileHint1: day.hasFileHint1,
      hasFileHint2: day.hasFileHint2,
      hasFileHint3: day.hasFileHint3,
      openHints,
      hintOpenTimes,
      hintExists,
      now: now.getTime(),
      video: day.video,
      points,
      id: day.id,
      description: day.description,
      todayAnswers,
      stats,
    };
  } else {
    props = {
      id: day.id,
      date: day.date.toISOString(),
      isToday,
      isDayPassed,
      todayAnswers,
      now: now.getTime(),
    };
  }

  const dayProps = props as unknown as DayWithAdmin;

  if (dayProps.isToday) {
    return <Today {...dayProps} />;
  } else if (dayProps.isDayPassed) {
    return <OldDay {...dayProps} />;
  }

  return <FutureDay {...dayProps} />;
}
