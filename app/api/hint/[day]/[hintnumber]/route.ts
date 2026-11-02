import { isBefore } from "date-fns";
import { prisma } from "../../../../../lib/prisma";
import { getToday } from "../../../../../utils/dates";
import { getSession } from "../../../../../lib/auth";
import { audioResponse, numberToHintFile } from "../../../../../lib/audio";

const numberToHint = {
  1: "hint1",
  2: "hint2",
  3: "hint3",
} as const;

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

  const hints = await prisma.hint.findFirst({
    where: {
      dayId,
      userId: session.id,
    },
  });

  // Passed days are open to everyone; otherwise the user must have taken the hint.
  if (isBefore(day.date, getToday()) || hints?.[numberToHint[hintNumber]]) {
    return audioResponse(day.file?.[numberToHintFile[hintNumber]]);
  }

  return Response.json({ error: "no access to hint" });
}
