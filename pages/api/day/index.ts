import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

// POST /api/post
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    description,
    artist,
    date,
    madeBy,
    solutions,
    song,
    video,
    difficulty,
  } = req.body;

  const session = await getSession({ req });
  if (session) {
    const result = await prisma.day.create({
      data: {
        description,
        date,
        artist,
        song,
        madeBy,
        video,
        difficulty: parseInt(difficulty),
        solution: {
          create: solutions.map((el) => ({ solution: el })),
        },
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
