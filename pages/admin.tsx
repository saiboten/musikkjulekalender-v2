import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { LoggedOut } from "../components/LoggedOut";
import { authOptions } from "./api/auth/[...nextauth]";
import { Admin } from "../components/Admin";
import { Day, User } from "@prisma/client";
import { Heading, Link, List, ListItem, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Spacer } from "../components/lib/Spacer";
import { format, parseISO } from "date-fns";

interface DayWithStringDate extends Omit<Day, "date"> {
  date: string;
}

type Props = {
  users: User[];
  days: DayWithStringDate[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (user.role !== "admin") {
    throw new Error("Not admin");
    // return {
    //   props: {
    //     users: [],
    //   },
    // };
  }

  const users = (await prisma.user.findMany({})).map((el) => ({
    ...el,
    createdAt: el.createdAt.toISOString(),
    updatedAt: el.updatedAt.toISOString(),
  }));

  const days = (await prisma.day.findMany({}))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((day) => ({
      ...day,
      date: day.date.toISOString(),
    }));

  return {
    props: {
      users,
      days,
    },
  };
};

const AdminPage: React.FC<Props> = ({ users, days }) => {
  const session = useSession();

  if (!session.data?.user) {
    return <LoggedOut />;
  }

  return (
    <Layout whiteBg>
      <Admin>
        <Heading size="lg">Admin</Heading>

        <List>
          {days.map((day) => {
            return (
              <NextLink key={day.id} href={`/edit/${day.id}`} passHref>
                <Link>
                  <ListItem
                    border="1px solid black"
                    padding="2"
                    borderRadius="5px"
                    margin="2"
                  >
                    <Text fontWeight="bold">
                      {format(parseISO(day.date), "d")}: {day.artist} -{" "}
                      {day.song}
                    </Text>
                    <Text>{day.description}</Text>
                    <Text>{day.solutionVideo}</Text>
                  </ListItem>
                </Link>
              </NextLink>
            );
          })}
        </List>

        <Spacer />
        <List>
          {users.map((el) => {
            return (
              <NextLink key={el.id} href={`/admin/user/${el.id}`} passHref>
                <Link>
                  <ListItem>
                    {el.nickname ?? el.name} - {el.email}
                  </ListItem>
                </Link>
              </NextLink>
            );
          })}
        </List>
      </Admin>
    </Layout>
  );
};

export default AdminPage;
