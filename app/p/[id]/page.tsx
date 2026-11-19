import React from "react";
import { notFound, redirect } from "next/navigation";
import { isBefore, isSameDay } from "date-fns";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { getSolvedAnswers } from "../../../lib/answers";
import { Today } from "../../../components/Today";
import { OldDay } from "../../../components/OldDay";
import { FutureDay } from "../../../components/FutureDay";
import { DayWithAdmin } from "../../../components/Day";
import {
  calculatePointsAt,
  getHintOpenTime,
  getOpenHintCount,
} from "../../../utils/pointscalculator";

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

  const answer = await prisma.answer.findFirst({
    where: {
      dayId: day.id,
      userId: session.id,
    },
  });

  const now = new Date();
  const isToday = isSameDay(day.date, now) && day.date < now;
  const isDayPassed = isBefore(day.date, now);
  const hasHints = day.hint1 !== "" || day.hasFileHint1;
  const openHints = getOpenHintCount(day.date, now);
  const points = answer?.points ?? calculatePointsAt(day.date, now);
  const hintOpenTimes = ([1, 2, 3] as const).map((n) =>
    getHintOpenTime(day.date, n).toISOString()
  );
  const hintExists = [
    !!day.hint1 || !!day.hasFileHint1,
    !!day.hint2 || !!day.hasFileHint2,
    !!day.hint3 || !!day.hasFileHint3,
  ];

  const dayWithFixedDates = {
    ...day,
    date: day.date.toISOString(),
    isToday,
    isDayPassed,
    now: now.toISOString(),
    hasHints,
    todayAnswers,
  };

  // The day's props are passed on as before; the client components only read
  // the fields that apply to their state.
  let props: Record<string, unknown>;

  if (isDayPassed && !isToday) {
    props = dayWithFixedDates;
  } else if (isToday && answer) {
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
