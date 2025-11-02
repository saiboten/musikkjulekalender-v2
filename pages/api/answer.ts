import { prisma } from "../../lib/prisma";
import { calculatePoints } from "../../utils/pointscalculator";
import { isSameDay } from "date-fns";
import { getToday } from "../../utils/dates";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { guess, dayId } = req.query;

  const session = await getServerSession(req, res, authOptions);

  const day = await prisma.day.findUnique({
    where: {
      id: Number(dayId),
    },
  });

  if (!isSameDay(getToday(), day.date) || day.date > new Date()) {
    res.status(401).send({ message: "Dag ikke åpen" });
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
        points: calculatePoints([hints.hint1, hints.hint2, hints.hint3]),
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
