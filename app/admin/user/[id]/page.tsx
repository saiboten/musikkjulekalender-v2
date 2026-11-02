import React from "react";
import { notFound } from "next/navigation";
import Layout from "../../../../components/Layout";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/requireAdmin";
import { Heading, List, ListItem } from "../../../../components/ui";
import { Spacer } from "../../../../components/lib/Spacer";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const days = await prisma.day.findMany();

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id) || -1,
    },
    include: {
      answer: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <Layout whiteBg>
      <Heading size="lg">Brukerdetaljer</Heading>
      <Spacer />
      <p>
        {user.id}: {user.name} ({user.email})
      </p>
      <p>CreatedAt: {user.createdAt.toISOString()}</p>
      <p>Nick: {user.nickname}</p>
      <p>Rolle: {user.role}</p>
      <Heading size="md">Svar</Heading>
      <List>
        {user.answer.map((el) => {
          const dayDetails = days.find((day) => day.id === el.dayId);
          const output = `DagId: ${el.dayId} (${dayDetails?.artist} - ${dayDetails?.song}) ${el.points} poeng. Solution time: ${el.timeOfEntry.toISOString()}`;
          return <ListItem key={el.dayId}>{output}</ListItem>;
        })}
      </List>
    </Layout>
  );
}
