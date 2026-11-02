import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { calculatePoints } from "../../../utils/pointscalculator";
import { getSession } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const dayId = Number(request.nextUrl.searchParams.get("dayId"));

  const session = await getSession();

  if (!session?.id) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;

  const day = await prisma.day.findUnique({
    where: {
      id: dayId || -1,
    },
    include: {
      file: true,
    },
  });

  if (!day || day.date > new Date()) {
    return Response.json({ message: "Dag ikke åpnet" }, { status: 401 });
  }

  let hints = await prisma.hint.findFirst({
    where: {
      userId,
      dayId,
    },
  });

  if (!hints) {
    hints = await prisma.hint.create({
      data: {
        hint1: false,
        hint2: false,
        hint3: false,
        dayId,
        userId,
      },
    });
  }

  async function updateHintGiven(hintNumber: 1 | 2 | 3) {
    await prisma.hint.updateMany({
      data: {
        [`hint${hintNumber}`]: true,
      },
      where: {
        dayId,
        userId,
      },
    });
  }

  let hintToGive: string | undefined = undefined;
  let hintFileToGive: string | null | undefined = undefined;

  if (!hints.hint1) {
    hintToGive = day.hint1;
    hintFileToGive = day.file?.hint1file;
    await updateHintGiven(1);
  } else if (!hints.hint2) {
    hintToGive = day.hint2;
    hintFileToGive = day.file?.hint2file;
    await updateHintGiven(2);
  } else if (!hints.hint3) {
    hintToGive = day.hint3;
    hintFileToGive = day.file?.hint3file;
    await updateHintGiven(3);
  }

  hints = await prisma.hint.findFirst({
    where: {
      userId,
      dayId,
    },
  });

  if (!hintToGive && !hintFileToGive) {
    return Response.json({ message: "Alle hint er gitt?!" }, { status: 503 });
  }

  return Response.json({
    hint: hintToGive,
    fileHintExists: hintFileToGive !== null,
    points: calculatePoints([hints.hint1, hints.hint2, hints.hint3]),
  });
}
