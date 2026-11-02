import React from "react";
import { notFound, redirect } from "next/navigation";
import Layout from "../../components/Layout";
import { getSession } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AddNickName } from "../../components/AddNickName";
import { Heading } from "../../components/ui";
import { Spacer } from "../../components/lib/Spacer";
import { DeleteUser } from "./delete-user";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <Layout whiteBg customSize={40}>
      <Heading size="lg">Innstillinger</Heading>
      <Spacer />
      <p>
        Du er innlogget som{" "}
        <strong>
          {user.name} ({user.email})
        </strong>
      </p>
      <Spacer />

      <AddNickName nickname={user.nickname ?? undefined} />

      <DeleteUser />
    </Layout>
  );
}
