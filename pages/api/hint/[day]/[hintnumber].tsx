import { isAfter, isBefore } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";
import { getToday } from "../../../../utils/dates";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const numberToHintFile = {
  1: "hint1file",
  2: "hint2file",
  3: "hint3file",
} as const;

const numberToHint = {
  1: "hint1",
  2: "hint2",
  3: "hint3",
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

  const now = getToday();

  const day = await prisma.day.findFirst({
    where: {
      id: Number(dayId),
    },
    include: {
      file: true,
    },
  });

  const hints = await prisma.hint.findFirst({
    where: {
      dayId: Number(dayId),
      userId: session.id,
    },
  });

  const hintCheck = numberToHint[hintNumber];

  if (isBefore(day.date, now)) {
    const buf = Buffer.from(day.file[numberToHintFile[hintNumber]], "base64");

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buf);
  } else if (hints[hintCheck]) {
    const buf = Buffer.from(day.file[numberToHintFile[hintNumber]], "base64");

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buf);
  } else if (!hints[hintCheck]) {
    return res.json({ error: "no access to hint" });
  } else {
    return res.json({ error: "nope" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
