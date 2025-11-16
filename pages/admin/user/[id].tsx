import React from "react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../../components/Layout";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { Answer, Day } from "@prisma/client";
import { Heading, List, ListItem, Text } from "@chakra-ui/react";
import { Spacer } from "../../../components/lib/Spacer";
import { isAdminRole } from "../../../utils/adminRoles";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const session = await getServerSession(context.req, context.res, authOptions);

  const adminUser = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (!isAdminRole(adminUser.role)) {
    return {
      props: {
        users: [],
      },
    };
  }

  const days = await (
    await prisma.day.findMany()
  ).map((el) => ({ ...el, date: el.date.toISOString() }));

  const rawUser = await prisma.user.findUnique({
    where: {
      id: Number(params?.id ?? -1),
    },
    include: {
      answer: true,
    },
  });

  const user = {
    ...rawUser,
    answer: rawUser.answer.map((el) => ({
      ...el,
      timeOfEntry: el.timeOfEntry.toISOString(),
    })),
    createdAt: rawUser.createdAt.toISOString(),
    updatedAt: rawUser.updatedAt.toISOString(),
  };

  return {
    props: {
      user,
      days,
    },
  };
};

interface Props {
  user: {
    createdAt: string;
    updatedAt: string;
    id: number;
    name: string;
    nickname: string;
    email: string;
    emailVerified: Date;
    image: string;
    role: string;
    answer: Answer[];
  };
  days: Day[];
}

const Post: React.FC<Props> = ({ user, days }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  return (
    <Layout whiteBg>
      <Heading size="lg">Brukerdetaljer</Heading>
      <Spacer />
      <Text>
        {user.id}: {user.name} ({user.email})
      </Text>
      <Text>CreatedAt: {user.createdAt}</Text>
      <Text>Nick: {user.nickname}</Text>
      <Text>Rolle: {user.role}</Text>
      <Heading size="md">Svar</Heading>
      <List>
        {user.answer.map((el) => {
          const dayDetails = days.filter((day) => day.id === el.dayId)[0];
          const output = `DagId: ${el.dayId} (${dayDetails.artist} - ${dayDetails.song}) ${el.points} poeng. Solution time: ${el.timeOfEntry}`;
          return <ListItem key={el.dayId}>{output}</ListItem>;
        })}
      </List>
    </Layout>
  );
};

export default Post;
