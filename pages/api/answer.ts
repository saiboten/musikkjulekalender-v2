import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import { calculatePoints } from "../../utils/pointscalculator";
import { getToday } from "../../utils/dates";

export default async function handler(req, res) {
  const { guess, dayId } = req.query;

  const session = await getSession({ req });

  const day = await prisma.day.findUnique({
    where: {
      id: Number(dayId),
    },
  });

  if (day.date > new Date()) {
    res.status(401).send({ message: "Dag ikke åpnet" });
  }

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
