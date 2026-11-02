import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";
import { isAdminRole } from "../../../../../utils/adminRoles";
import { audioResponse, numberToHintFile } from "../../../../../lib/audio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string; hintnumber: string }> }
) {
  const { day: dayParam, hintnumber } = await params;
  const hintNumber = Number(hintnumber) as 1 | 2 | 3;

  const session = await getSession();

  if (!session) {
    return Response.json({ error: "No session" });
  }

  if (!isAdminRole(session.user.role)) {
    return Response.json({ error: "not admin" });
  }

  const day = await prisma.day.findFirst({
    where: {
      id: Number(dayParam) || -1,
    },
    include: {
      file: true,
    },
  });

  if (!day || !numberToHintFile[hintNumber]) {
    return Response.json({ error: "nope" });
  }

  return audioResponse(day.file?.[numberToHintFile[hintNumber]]);
}
