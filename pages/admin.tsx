import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { LoggedOut } from "../components/LoggedOut";
import { authOptions } from "./api/auth/[...nextauth]";
import { Admin } from "../components/Admin";
import { User } from "@prisma/client";
import { List, ListItem } from "@chakra-ui/react";
import NextLink from "next/link";

type Props = {
  users: User[];
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
    return {
      props: {
        users: [],
      },
    };
  }

  const users = (await prisma.user.findMany({})).map((el) => ({
    ...el,
    createdAt: el.createdAt.toISOString(),
    updatedAt: el.updatedAt.toISOString(),
  }));

  return {
    props: {
      users,
    },
  };
};

const AdminPage: React.FC<Props> = ({ users }) => {
  const session = useSession();

  if (!session.data?.user) {
    return <LoggedOut />;
  }

  return (
    <Layout whiteBg>
      <Admin>
        <List>
          {users.map((el) => {
            return (
              <NextLink key={el.id} href={`/admin/user/${el.id}`} passHref>
                <ListItem>{el.name}</ListItem>
              </NextLink>
            );
          })}
        </List>
      </Admin>
    </Layout>
  );
};

export default AdminPage;
