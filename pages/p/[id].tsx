import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { addHours, daysToWeeks, isBefore, isSameDay } from "date-fns";
import Router from "next/router";
import { DayProps } from "../../components/Day";
import { prisma } from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { Box, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { Today } from "../../components/Today";
import { Admin } from "../../components/Admin";
import { EditIcon } from "@chakra-ui/icons";
import { OldDay } from "../../components/OldDay";
import { authOptions } from "../api/auth/[...nextauth]";
import { FutureDay } from "../../components/FutureDay";
import { calculatePoints } from "../../utils/pointscalculator";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!params.id) {
    throw Error("No id given");
  }

  const day = await prisma.day.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  const todayAnswers = (
    await prisma.answer.findMany({
      include: {
        user: true,
      },
      where: {
        points: {
          gt: 0,
        },
        dayId: day?.id ?? -1,
      },
    })
  )
    .sort((el1, el2) => {
      if (el1.points > el2.points) {
        return -1;
      }

      if (el2.points > el1.points) {
        return 1;
      }

      if (el1.timeOfEntry < el2.timeOfEntry) {
        return -1;
      }

      if (el2.timeOfEntry < el1.timeOfEntry) {
        return 1;
      }

      return 0;
    })
    .map((e) => {
      return {
        points: e.points,
        user: e.user.nickname ?? e.user.email?.split("@")[0] ?? "ukjent",
        time: e.timeOfEntry.toISOString(),
      };
    });

  if (!day) {
    throw Error("Could not find day");
  }

  const answer = await prisma.answer.findFirst({
    where: {
      dayId: day.id,
      userId: session.id,
    },
  });

  let hints = await prisma.hint.findFirst({
    where: {
      dayId: day.id,
      userId: session.id,
    },
  });

  if (hints === null) {
    await prisma.hint.create({
      data: {
        hint1: false,
        hint2: false,
        hint3: false,
        dayId: day.id,
        userId: session.id,
      },
    });

    hints = await prisma.hint.findFirst({
      where: {
        dayId: day.id,
        userId: session.id,
      },
    });
  }

  const isToday = isSameDay(day.date, new Date()) && day.date < new Date();
  const isDayPassed = isBefore(day.date, new Date());

  const dayWithFixedDates = {
    ...day,
    date: day.date.toISOString(),
    isToday,
    isDayPassed,
    now: new Date().toISOString(),
    hasHints: day.hint1 !== "" || day.hasFileHint1,
  };

  if (isDayPassed && !isToday) {
    return {
      props: { ...dayWithFixedDates, todayAnswers },
    };
  } else if (isToday && answer) {
    return {
      props: {
        ...dayWithFixedDates,
        solved: true,
        todayAnswers,
        points: calculatePoints([hints.hint1, hints.hint2, hints.hint3]),
      },
    };
  } else if (isToday) {
    return {
      props: {
        madeBy: day.madeBy,
        date: day.date.toISOString(),
        isToday,
        isDayPassed,
        hasTextSolution: day.hasTextSolution,
        hasHints: day.hint1 !== "" || day.hasFileHint1,
        hint1: hints.hint1 ? day.hint1 : null,
        hint2: hints.hint2 ? day.hint2 : null,
        hint3: hints.hint3 ? day.hint3 : null,
        hasFileHint1: day.hasFileHint1,
        hasFileHint2: day.hasFileHint2,
        hasFileHint3: day.hasFileHint3,
        now: Date.now(),
        video: day.video,
        points: calculatePoints([hints.hint1, hints.hint2, hints.hint3]),
        id: day.id,
        description: day.description,
      },
    };
  } else {
    return {
      props: {
        date: day.date.toISOString(),
        isToday,
        isDayPassed,
        todayAnswers,
        now: Date.now(),
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
  id: number;
  todayAnswers: { points: number; user: string; time: string }[];
}

export const AdminEditLink = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Admin>
      <NextLink href={`/edit/${id}`} passHref legacyBehavior>
        <Link display="flex" alignItems="center">
          <EditIcon mr="2" />
          <span>Endre dag</span>
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
