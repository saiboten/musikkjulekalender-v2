import prisma from "../../lib/prisma";
import { addHours, isBefore } from "date-fns";
import { getSession } from "next-auth/react";
import { hint1hours, hint2hours, hint3hours } from "../../components/constants";

export function calculatePoints(currentTime: Date, day: Date) {
  let points = 1;

  const hint1time = addHours(day, hint1hours);
  const hint2time = addHours(day, hint2hours);
  const hint3time = addHours(day, hint3hours);

  if (isBefore(currentTime, hint1time)) {
    points = 5;
  } else if (isBefore(currentTime, hint2time)) {
    points = 3;
  } else if (isBefore(currentTime, hint3time)) {
    points = 2;
  }

  return points;
}

export default async function handler(req, res) {
  const { guess } = req.query;

  const session = await getSession({ req });

  const now = new Date();
  now.setUTCHours(-2, 0, 0, 0);

  const day = await prisma.day.findFirst({
    where: {
      date: now,
    },
  });

  const result = await prisma.solution.findMany({
    where: {
      dayId: day.id,
    },
  });

  const rightAnswerList = result.map((el) => el.solution.toLowerCase());

  if (rightAnswerList.includes(guess.toLowerCase())) {
    await prisma.answer.create({
      data: {
        timeOfEntry: new Date(),
        points: calculatePoints(new Date(), day.date),
        dayId: day.id,
        userId: session.id,
      },
    });
    res.status(200).json({
      success: true,
      artist: day.artist,
      song: day.song,
      solutionVideo: day.solutionVideo,
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
}
