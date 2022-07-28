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
  } = req.body;

  const session = await getSession({ req });
  if (session.user?.role !== "admin") {
    res.status(401).send({ message: "Unauthorized" });
    return;
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
      difficulty: parseInt(difficulty),
      solution: {
        create: solutions.map((el) => ({ solution: el })),
      },
      file: {
        create: {
          file: file ?? "",
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
