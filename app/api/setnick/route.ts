import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const nick = request.nextUrl.searchParams.get("nick");

  const session = await getSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (nick && nick.length > 3) {
    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        nickname: nick,
      },
    });
    return Response.json({ success: true });
  }

  return Response.json({ message: "Noe gikk galt" }, { status: 500 });
}
