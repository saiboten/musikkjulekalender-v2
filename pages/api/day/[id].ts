import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.id;
  const { solutions, file, ...body } = req.body;

  const storeSolutions = solutions.map((solution) => ({
    dayId: Number(dayId),
    solution,
  }));

  const session = await getSession({ req });

  if (req.method === "DELETE") {
    if (session) {
      const post = await prisma.day.delete({
        where: { id: Number(dayId) },
      });
      res.json(post);
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } else if (req.method === "PUT") {
    await prisma.day.update({
      where: { id: Number(dayId) },
      data: {
        ...body,
        difficulty: parseInt(body.difficulty),
      },
    });

    await prisma.songFile.upsert({
      where: { dayId: Number(dayId) },
      create: {
        file,
        dayId: Number(dayId),
      },
      update: {
        file,
      },
    });

    await prisma.solution.deleteMany({
      where: { dayId: Number(dayId) },
    });

    await prisma.solution.createMany({
      data: storeSolutions,
    });
    res.json({ success: true });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
