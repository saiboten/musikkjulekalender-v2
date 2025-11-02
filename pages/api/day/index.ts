import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
    file,
    hint1,
    hint2,
    hint3,
    hint1file,
    hint2file,
    hint3file,
  } = req.body;

  const session = await getServerSession(req, res, authOptions);
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
