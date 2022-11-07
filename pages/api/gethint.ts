import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import { calculatePoints } from "../../utils/pointscalculator";

export default async function handler(req, res) {
  const { dayId } = req.query;

  const session = await getSession({ req });

  if (!session.id) {
    throw Error;
  }

  const day = await prisma.day.findUnique({
    where: {
      id: Number(dayId),
    },
  });

  let hints = await prisma.hint.findFirst({
    where: {
      userId: session.id,
      dayId: Number(dayId),
    },
  });

  if (!hints) {
    await prisma.hint.create({
      data: {
        hint1: false,
        hint2: false,
        hint3: false,
        dayId: dayId,
        userId: session.id,
      },
    });
  }

  async function updateHintGiven(hintNumber: 1 | 2 | 3) {
    await prisma.hint.updateMany({
      data: {
        [`hint${hintNumber}`]: true,
      },
      where: {
        dayId: Number(dayId),
        userId: session.id,
      },
    });
  }

  let hintToGive: string | undefined = undefined;

  if (!hints.hint1) {
    hintToGive = day.hint1;
    await updateHintGiven(1);
  } else if (!hints.hint2) {
    hintToGive = day.hint2;
    await updateHintGiven(2);
  } else if (!hints.hint3) {
    hintToGive = day.hint3;
    await updateHintGiven(3);
  }

  hints = await prisma.hint.findFirst({
    where: {
      userId: session.id,
      dayId: Number(dayId),
    },
  });

  if (day.date > new Date()) {
    res.status(401).send({ message: "Dag ikke åpnet" });
  } else if (!hintToGive) {
    res.status(503).send({ message: "Alle hint er gitt?!" });
  } else {
    res.status(200).json({
      hint: hintToGive,
      points: calculatePoints([hints.hint1, hints.hint2, hints.hint3]),
    });
  }
}
