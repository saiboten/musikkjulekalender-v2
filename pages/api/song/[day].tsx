import { isAfter } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getToday } from "../../../utils/dates";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.day;

  const now = getToday();

  const day = await prisma.day.findFirst({
    where: {
      id: Number(dayId),
    },
    include: {
      file: true,
    },
  });

  if (isAfter(day.date, now)) {
    return res.json({ error: "nope" });
  } else {
    const buf = Buffer.from(day.file.file, "base64");

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
