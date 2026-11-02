import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";
import { isAdminRole } from "../../../../../utils/adminRoles";
import { audioResponse } from "../../../../../lib/audio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string }> }
) {
  const { day: dayParam } = await params;

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

  if (!day) {
    return Response.json({ error: "nope" });
  }

  return audioResponse(day.file?.file);
}
