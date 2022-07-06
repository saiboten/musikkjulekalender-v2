import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;

  const session = await getSession({ req });
  if (session) {
    const result = await prisma.day.create({
      data: {
        revealDate: new Date().toISOString(),
        solutionArtist: "Jens",
        solutionDate: new Date().toISOString(),
        solutionSong: "Aha",
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
