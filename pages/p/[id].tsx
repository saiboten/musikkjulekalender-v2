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
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Spacer } from "../../components/lib/Spacer";
import { Today } from "../../components/Today";
import { Admin } from "../../components/Admin";
import { EditIcon } from "@chakra-ui/icons";
import { OldDay } from "../../components/OldDay";
import { hint1hours, hint2hours, hint3hours } from "../../components/constants";
import { FutureDay } from "../../components/FutureDay";

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
      dayId: Number(params?.id) || -1,
      userId: session?.id ?? -1,
    },
  });

  const hint1releaseTime = addHours(day.date, hint1hours);
  const hint2releaseTime = addHours(day.date, hint2hours);
  const hint3releaseTime = addHours(day.date, hint3hours);

  const isToday = isSameDay(day.date, new Date());
  const isDayPassed = isBefore(day.date, new Date());

  const dayWithFixedDates = {
    ...day,
    date: day.date.toISOString(),
    isToday,
    isDayPassed,
    now: new Date().toISOString(),
  };

  if (isDayPassed && !isToday) {
    return {
      props: dayWithFixedDates,
    };
  } else if (isToday && answer) {
    return {
      props: { ...dayWithFixedDates, solved: true },
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
        now: Date.now(),
        video: day.video,
        points: day.points,
        id: day.id,
        description: day.description,
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
  now: Date;
  hint1releaseTime?: Date;
  hint2releaseTime?: Date;
  hint3releaseTime?: Date;
  id: number;
}

export const AdminEditLink = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Admin>
      <NextLink href={`/edit/${id}`} passHref>
        <Link display="flex" alignItems="center">
          <EditIcon mr="2" />
          <span> Endre dag</span>
        </Link>
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

  return <FutureDay {...props} />;
};

export default Post;
