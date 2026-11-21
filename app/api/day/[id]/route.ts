import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";
import { isAdminRole } from "../../../../utils/adminRoles";
import { toSolutionRows } from "../../../../utils/solutionRows";

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

  const {
    solutions,
    solutions2,
    artistSolutions,
    artistSolutions2,
    file,
    hint1file,
    hint2file,
    hint3file,
    ...body
  } = await request.json();

  const storeSolutions = toSolutionRows({
    solutions,
    artistSolutions,
    solutions2: body.dualAnswer ? solutions2 : [],
    artistSolutions2: body.dualAnswer ? artistSolutions2 : [],
  }).map((row) => ({ ...row, dayId }));

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

  // The edit page doesn't load stored files, so only the ones uploaded in this
  // edit arrive here. Save each on its own; a hint can change without the song.
  const uploads = Object.fromEntries(
    Object.entries({ file, hint1file, hint2file, hint3file }).filter(
      ([, value]) => !!value
    )
  );

  if (Object.keys(uploads).length > 0) {
    await prisma.songFile.upsert({
      where: { dayId },
      create: { file: "", ...uploads, dayId },
      update: uploads,
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
