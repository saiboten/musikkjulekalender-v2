import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { isAdminRole } from "../../../utils/adminRoles";

export async function POST(request: Request) {
  const session = await getSession();
  if (!isAdminRole(session?.user?.role)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    description,
    artist,
    date,
    madeBy,
    solutions,
    song,
    video,
    file,
    hint1,
    hint2,
    hint3,
    hint1file,
    hint2file,
    hint3file,
  } = await request.json();

  const result = await prisma.day.create({
    data: {
      description,
      date,
      artist,
      madeBy,
      video,
      song,
      hint1,
      hint2,
      hint3,
      hasFileHint1: !!hint1file,
      hasFileHint2: !!hint2file,
      hasFileHint3: !!hint3file,
      solution: {
        create: solutions.map((el: string) => ({ solution: el })),
      },
      file: {
        create: {
          file: file ?? "",
          hint1file: hint1file,
          hint2file: hint2file,
          hint3file: hint3file,
        },
      },
    },
  });

  return Response.json(result);
}
