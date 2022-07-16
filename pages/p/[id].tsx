import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import { format, isBefore, isSameDay } from "date-fns";
import Countdown from "react-countdown";
import Router from "next/router";
import { DayProps } from "../../components/Day";
import prisma from "../../lib/prisma";
import { getSession, useSession } from "next-auth/react";
import { Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Spacer } from "../../components/lib/Spacer";
import { Today } from "../../components/Today";
import { Admin } from "../../components/Admin";
import { OldDay } from "../../components/OldDay";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const session = await getSession();

  const post = await prisma.day.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
  });

  const answer = await prisma.answer.findFirst({
    where: {
      dayId: Number(params?.id || -1),
      userId: session?.id ?? -1,
    },
  });

  const isToday = isSameDay(post.date, new Date());
  const isDayPassed = isBefore(post.date, new Date());

  const postWithFixedDates = {
    ...post,
    date: post.date.toISOString(),
    isToday,
    isDayPassed,
  };

  if (isDayPassed && !isToday) {
    return {
      props: postWithFixedDates,
    };
  } else if (isToday && answer) {
    return {
      props: { ...postWithFixedDates, solved: true },
    };
  } else {
    return {
      props: {
        madeBy: post.madeBy,
        date: post.date.toISOString(),
        isToday,
        isDayPassed,
      },
    };
  }
};

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/");
}

export interface DayWithAdmin extends DayProps {
  solved: boolean;
}

export const AdminEditLink = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Admin>
      <NextLink href={`/edit/${id}`} passHref>
        <Link>Edit</Link>
      </NextLink>
    </Admin>
  );
};

const Post: React.FC<DayWithAdmin> = (props) => {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  if (props.isToday) {
    return <Today {...props} />;
  } else if (props.isDayPassed) {
    return <OldDay {...props} />;
  }

  return (
    <Layout>
      <AdminEditLink />
      <Text textAlign="center">
        <Heading>{format(new Date(props.date), "d 'dag jul")}</Heading>
        <Spacer />
        <Text>
          Tid før luken åpner: <Countdown date={new Date(props.date)} />
        </Text>
      </Text>
    </Layout>
  );
};

export default Post;
