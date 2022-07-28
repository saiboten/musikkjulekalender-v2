import React from "react";
import Layout from "../components/Layout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { AddNickName } from "../components/AddNickName";
import { Box, Heading } from "@chakra-ui/react";
import { Spacer } from "../components/lib/Spacer";

interface Props {
  nickname?: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
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

  return {
    props: {
      nickname: user.nickname,
    },
  };
};

function Settings({ nickname: existingNick }: Props) {
  return (
    <Layout whiteBg customSize={30}>
      <Heading size="lg">Innstillinger</Heading>
      <Spacer />
      <Box>Slette bruker? Mer detaljer kommer ...</Box>
      <Spacer />
      <AddNickName nickname={existingNick} />
    </Layout>
  );
}

export default Settings;
