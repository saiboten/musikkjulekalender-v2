import React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import styled from "styled-components";
import Day, { DayProps } from "../components/Day";
import { prisma } from "../lib/prisma";
import { Grid, GridItem } from "../components/Grid";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { Footer } from "../components/Footer";
import { TopScores } from "../components/TopScores";
import { UserStats } from "../components/UserStats";
import { isBefore, parseISO } from "date-fns";
import { BestDaily } from "../components/BestDaily";
import { Spacer } from "../components/lib/Spacer";
import { getToday } from "../utils/dates";
import { LoggedOut } from "../components/LoggedOut";
import { MainHeading } from "../components/MainHeading";
import { authOptions } from "./api/auth/[...nextauth]";
import { Day as DayType, Texts } from "@prisma/client";
import { P } from "../components/lib/Paragraph";
import { FrontPageBox } from "../components/FrontPageBox";
import { Heading } from "@chakra-ui/react";

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
`;

type Props = {
  days: {
    id: number;
    date: string;
  }[];
  points: number;
  scores?: { name: string; score: number; id: number }[];
  todayAnswers: { points: number; user: string; time: string }[];
  userScores: {
    day: string;
    score: number;
  }[];
  today: string;
  texts: Texts;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const today = getToday();

  const todayDay = await prisma.day.findFirst({
    where: {
      date: today,
    },
  });

  const texts = await prisma.texts.findFirst();

  const days = await prisma.day.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      answers: {
        where: {
          userId: session?.id ?? -1,
        },
      },
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
        dayId: todayDay?.id ?? -1,
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

  const userScores = days
    .filter((day) => isBefore(day.date, new Date()))
    .map((el) => {
      const score = el.answers.reduce((sum, next) => {
        return sum + next.points;
      }, 0);
      return {
        day: el.date.toISOString(),
        score,
      };
    });

  const users = await prisma.user.findMany({
    include: {
      answer: true,
    },
  });

  const scores = users
    .map((user) => {
      const points = user.answer.reduce((sum, next) => {
        return sum + next.points;
      }, 0);

      return {
        name: user.nickname ?? user.email?.split("@")[0] ?? "ukjent",
        score: points,
        id: user.id,
      };
    })
    .sort((el1, el2) => (el1.score > el2.score ? -1 : 1));

  const answers = await prisma.answer.findMany({
    where: {
      userId: session?.id,
    },
  });

  const points = answers.reduce((sum, next) => {
    return sum + next.points;
  }, 0);

  const daysWithFixedDates = days.map((el) => ({
    id: el.id,
    date: el.date.toISOString(),
  }));

  return {
    props: {
      days: daysWithFixedDates,
      points,
      scores,
      userScores,
      todayAnswers,
      today: today.toISOString(),
      texts,
    },
  };
};

const Blog: React.FC<Props> = (props) => {
  const session = useSession();

  if (!session.data?.user) {
    return <LoggedOut />;
  }

  return (
    <Layout>
      <div>
        <MainHeading />
        {props.texts.frontpageMessage ? (
          <FrontPageBox>
            <Heading>{props.texts.frontpageHeading}</Heading>
            <P>{props.texts.frontpageMessage}</P>
          </FrontPageBox>
        ) : null}

        <Spacer />
        <main>
          <TopGrid>
            <BestDaily frontPage todayAnswers={props.todayAnswers} />
            <UserStats userScores={props.userScores ?? []} />
            <TopScores scores={props.scores ?? []} />
          </TopGrid>
          <Spacer />
          <Grid>
            {props.days.map((day) => (
              <GridItem key={day.id}>
                <Day day={day} today={parseISO(props.today)} />
              </GridItem>
            ))}
          </Grid>
        </main>
      </div>
      <Footer />
    </Layout>
  );
};

export default Blog;
