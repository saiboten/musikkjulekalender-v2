import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import { addHours, format, isBefore, isSameDay } from "date-fns";
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
import { hint1hours, hint2hours, hint3hours } from "../../components/constants";

function isHintExpired(hintTime: Date): boolean {
  return isBefore(hintTime, new Date());
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const session = await getSession();

  const day = await prisma.day.findUnique({
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

  const hint1releaseTime = addHours(day.date, hint1hours);
  const hint2releaseTime = addHours(day.date, hint2hours);
  const hint3releaseTime = addHours(day.date, hint3hours);

  const isToday = isSameDay(day.date, new Date());
  const isDayPassed = isBefore(day.date, new Date());

  const postWithFixedDates = {
    ...day,
    date: day.date.toISOString(),
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
        madeBy: day.madeBy,
        date: day.date.toISOString(),
        isToday,
        isDayPassed,
        hint1: isHintExpired(hint1releaseTime) ? day.hint1 : null,
        hint2: isHintExpired(hint2releaseTime) ? day.hint2 : null,
        hint3: isHintExpired(hint3releaseTime) ? day.hint3 : null,
        hint1releaseTime: hint1releaseTime.toISOString(),
        hint2releaseTime: hint2releaseTime.toISOString(),
        hint3releaseTime: hint3releaseTime.toISOString(),
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
  hint1releaseTime?: Date;
  hint2releaseTime?: Date;
  hint3releaseTime?: Date;
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
