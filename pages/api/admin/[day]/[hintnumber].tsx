import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const numberToHintFile = {
  1: "hint1file",
  2: "hint2file",
  3: "hint3file",
} as const;

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.day;
  const hintNumber = Number(req.query.hintnumber);

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.json({ error: "No session" });
  }

  if (!(session.user.role === "admin")) {
    return res.json({ error: "not admin" });
  }

  const day = await prisma.day.findFirst({
    where: {
      id: Number(dayId),
    },
    include: {
      file: true,
    },
  });

  const buf = Buffer.from(day.file[numberToHintFile[hintNumber]], "base64");

  res.setHeader("Content-Type", "audio/mpeg");
  res.send(buf);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
