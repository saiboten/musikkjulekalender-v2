import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dayId = req.query.day;

  const day = await prisma.day.findFirst({
    where: {
      id: Number(dayId),
    },
    include: {
      file: true,
    },
  });

  var buf = Buffer.from(day.file.file, "base64");

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
