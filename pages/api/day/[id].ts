import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.id;

  const session = await getSession({ req });

  if (session.user?.role !== "admin") {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

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
    const { solutions, file, hint1file, hint2file, hint3file, ...body } =
      req.body;

    const storeSolutions = solutions.map((solution) => ({
      dayId: Number(dayId),
      solution,
    }));

    await prisma.day.update({
      where: { id: Number(dayId) },
      data: {
        ...body,
        hasFileHint1: !!hint1file,
        hasFileHint2: !!hint2file,
        hasFileHint3: !!hint3file,
      },
    });

    await prisma.songFile.upsert({
      where: { dayId: Number(dayId) },
      create: {
        hint1file,
        hint2file,
        hint3file,
        file,
        dayId: Number(dayId),
      },
      update: {
        file,
        hint1file,
        hint2file,
        hint3file,
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
