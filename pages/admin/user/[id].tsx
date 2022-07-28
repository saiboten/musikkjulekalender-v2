import React from "react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../../components/Layout";
import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { Answer } from "@prisma/client";
import { Heading, Text } from "@chakra-ui/react";
import { EOL } from "os";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const adminUser = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (adminUser.role !== "admin") {
    return {
      props: {
        users: [],
      },
    };
  }

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
}

const Post: React.FC<Props> = ({ user }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  return (
    <Layout whiteBg>
      <Text>Id: {user.id}</Text>
      <Text>CreatedAt: {user.createdAt}</Text>
      <Text>Name: {user.name}</Text>
      <Text>Mail: {user.email}</Text>
      <Text>Nick: {user.nickname}</Text>
      <Text>Rolle: {user.role}</Text>
      <Heading>Svar</Heading>
      <ul>
        {user.answer.map((el) => {
          return (
            <li key={el.dayId}>
              DagId: {el.dayId}: {el.points} poeng
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default Post;
