import prisma from "../../lib/prisma";
import { format } from "date-fns";
import { getSession } from "next-auth/react";
import { userAgent } from "next/server";

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

  const rightAnswerList = result.map((el) => el.solution);

  if (rightAnswerList.includes(guess)) {
    await prisma.answer.create({
      data: {
        timeOfEntry: new Date(),
        points: 5,
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
