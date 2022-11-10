import { isAfter } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import { getToday } from "../../../../utils/dates";

const numberToHintFile = {
  0: "hint1file",
  1: "hint2file",
  2: "hint3file",
} as const;

const numberToHint = {
  0: "hint1",
  1: "hint2",
  2: "hint3",
} as const;

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.day;
  const hintNumber = Number(req.query.hintnumber);

  const session = await getSession({ req });

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

  if (!hints[hintCheck]) {
    return res.json({ error: "no access to hint" });
  }

  if (isAfter(day.date, now)) {
    return res.json({ error: "nope" });
  } else {
    const buf = Buffer.from(day.file[numberToHintFile[hintNumber]], "base64");

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buf);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
