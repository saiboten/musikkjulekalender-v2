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
    file,
    hint1,
    hint2,
    hint3,
    hint1file,
    hint2file,
    hint3file,
  } = req.body;

  const session = await getSession({ req });
  if (session.user?.role !== "admin") {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const result = await prisma.day.create({
    data: {
      description,
      date,
      artist,
      madeBy,
      video,
      song,
      hint1,
      hint2,
      hint3,
      hasFileHint1: !!hint1file,
      hasFileHint2: !!hint2file,
      hasFileHint3: !!hint3file,
      difficulty: parseInt(difficulty),
      solution: {
        create: solutions.map((el) => ({ solution: el })),
      },
      file: {
        create: {
          file: file ?? "",
          hint1file: hint1file,
          hint2file: hint2file,
          hint3file: hint3file,
        },
      },
    },
  });
  res.json(result);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
