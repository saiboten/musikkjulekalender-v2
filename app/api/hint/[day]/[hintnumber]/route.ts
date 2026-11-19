import { isBefore } from "date-fns";
import { prisma } from "../../../../../lib/prisma";
import { getToday } from "../../../../../utils/dates";
import { getSession } from "../../../../../lib/auth";
import { audioResponse, numberToHintFile } from "../../../../../lib/audio";
import { getOpenHintCount } from "../../../../../utils/pointscalculator";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string; hintnumber: string }> }
) {
  const { day: dayParam, hintnumber } = await params;
  const dayId = Number(dayParam);
  const hintNumber = Number(hintnumber) as 1 | 2 | 3;

  const session = await getSession();

  if (!session) {
    return Response.json({ error: "No session" });
  }

  const day = await prisma.day.findFirst({
    where: {
      id: dayId || -1,
    },
    include: {
      file: true,
    },
  });

  if (!day || !numberToHintFile[hintNumber]) {
    return Response.json({ error: "nope" });
  }

  // Passed days are open to everyone; today, a hint opens N hours after the day opens.
  if (
    isBefore(day.date, getToday()) ||
    getOpenHintCount(day.date, new Date()) >= hintNumber
  ) {
    return audioResponse(day.file?.[numberToHintFile[hintNumber]]);
  }

  return Response.json({ error: "no access to hint" });
}
