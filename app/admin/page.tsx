import React from "react";
import NextLink from "next/link";
import { format } from "date-fns";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/requireAdmin";
import { Heading, List, ListItem } from "../../components/ui";
import { Spacer } from "../../components/lib/Spacer";

export default async function AdminPage() {
  const session = await requireAdmin();
  const role = session.user.role;

  const users = await prisma.user.findMany({});

  const allDays = await prisma.day.findMany({});

  // Filter days: admin sees all, other roles only see their own
  const days = (
    role === "admin" ? allDays : allDays.filter((day) => day.madeBy === role)
  ).sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <Layout whiteBg>
      <Heading size="lg">Admin</Heading>

      <List>
        {days.map((day) => {
          return (
            <ListItem key={day.id} className="inline-block">
              <NextLink
                href={`/edit/${day.id}`}
                className="m-2 block rounded-[5px] border border-black p-2 hover:underline"
              >
                <p className="font-bold">
                  {format(day.date, "d")}: {day.artist} - {day.song}
                </p>
                <p>{day.description}</p>
                <Spacer />
                <p>Laget av: {day.madeBy}</p>
                <p>{day.solutionVideo}</p>
                <p>
                  Hint 1: {day.hint1} - filhint?{" "}
                  {day.hasFileHint1 ? "ja" : "nei"}
                </p>
                <p>
                  Hint 2: {day.hint2} - filhint?{" "}
                  {day.hasFileHint2 ? "ja" : "nei"}
                </p>
                <p>
                  Hint 3: {day.hint3} - filhint?{" "}
                  {day.hasFileHint3 ? "ja" : "nei"}
                </p>
              </NextLink>
            </ListItem>
          );
        })}
      </List>

      <Spacer />
      <List>
        {users.map((el) => {
          return (
            <ListItem key={el.id}>
              <NextLink
                href={`/admin/user/${el.id}`}
                className="hover:underline"
              >
                {el.nickname ?? el.name} - {el.email}
              </NextLink>
            </ListItem>
          );
        })}
      </List>
    </Layout>
  );
}
