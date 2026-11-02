import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/requireAdmin";
import { DayProps } from "../../../components/Day";
import { EditDay } from "./edit-day";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const day = await prisma.day.findUnique({
    where: {
      id: Number(id) || -1,
    },
    include: {
      solution: true,
    },
  });

  if (!day) {
    notFound();
  }

  const dayWithFixedDates = {
    ...day,
    date: day.date.toISOString(),
  } as unknown as DayProps;

  return <EditDay {...dayWithFixedDates} />;
}
