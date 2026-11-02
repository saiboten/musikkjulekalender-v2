import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";
import { isAdminRole } from "../../../../utils/adminRoles";

type Context = { params: Promise<{ id: string }> };

async function isAdmin() {
  const session = await getSession();
  return isAdminRole(session?.user?.role);
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdmin())) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dayId = Number((await params).id);

  const day = await prisma.day.delete({
    where: { id: dayId },
  });

  return Response.json(day);
}

export async function PUT(request: Request, { params }: Context) {
  if (!(await isAdmin())) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dayId = Number((await params).id);

  const { solutions, file, hint1file, hint2file, hint3file, ...body } =
    await request.json();

  const storeSolutions = solutions.map((solution: string) => ({
    dayId,
    solution,
  }));

  const existingDay = await prisma.day.findUnique({
    where: {
      id: dayId,
    },
  });

  await prisma.day.update({
    where: { id: dayId },
    data: {
      ...body,
      hasFileHint1: !!hint1file || existingDay?.hasFileHint1,
      hasFileHint2: !!hint2file || existingDay?.hasFileHint2,
      hasFileHint3: !!hint3file || existingDay?.hasFileHint3,
    },
  });

  if (file) {
    await prisma.songFile.upsert({
      where: { dayId },
      create: {
        hint1file,
        hint2file,
        hint3file,
        file,
        dayId,
      },
      update: {
        file,
        hint1file,
        hint2file,
        hint3file,
      },
    });
  }

  await prisma.solution.deleteMany({
    where: { dayId },
  });

  await prisma.solution.createMany({
    data: storeSolutions,
  });

  return Response.json({ success: true });
}
