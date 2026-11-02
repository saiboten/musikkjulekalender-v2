import { isAfter } from "date-fns";
import { prisma } from "../../../../lib/prisma";
import { getToday } from "../../../../utils/dates";
import { audioResponse } from "../../../../lib/audio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  const dayId = Number((await params).day);

  const day = await prisma.day.findFirst({
    where: {
      id: dayId || -1,
    },
    include: {
      file: true,
    },
  });

  if (!day || isAfter(day.date, getToday())) {
    return Response.json({ error: "nope" });
  }

  return audioResponse(day.file?.file);
}
