import { isAfter } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.day;

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

  const buf = Buffer.from(day.file.file, "base64");

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
